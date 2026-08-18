"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { bookingConfig, business, isTodo, telLink } from "@/content/site";
import { useT } from "@/lib/i18n";
import { ButtonLink, PhoneIcon } from "./ui";

/**
 * Formularz zgłoszenia wizyty z podglądowym kalendarzykiem.
 *
 * Kalendarzyk pokazuje GRAFIK PRACY, a nie wolne terminy — strona nie ma
 * dostępu do kalendarza Mikołaja. Wygaszone są dni spoza grafiku (weekendy),
 * dni z przeszłości, dni za horyzontem zapisów oraz te, w których nie został
 * już ani jeden termin z zachowaniem wyprzedzenia. Ta ostatnia reguła jest
 * ważna: bez niej dzisiejszy dzień o 21:00 dalej byłby klikalny, a lista
 * godzin pod nim byłaby pusta.
 *
 * Wysyłka nie idzie na serwer, bo backendu nie ma. Formularz składa gotową
 * wiadomość i przekazuje ją do klienta poczty — pacjent wysyła ją ze swojej
 * skrzynki, więc Mikołaj od razu ma kontakt zwrotny. Brak `email` wyłącza
 * wysyłkę i pokazuje to wprost, zamiast udawać, że zgłoszenie gdzieś poleciało.
 *
 * WIADOMOŚĆ IDZIE W JĘZYKU, W KTÓRYM PACJENT CZYTAŁ STRONĘ. Nazwy pól są
 * tłumaczone razem z resztą, bo pacjent wysyła ją ze swojej skrzynki i musi
 * rozumieć, co podpisuje. Zgłoszenie po angielsku jest sygnałem samym w sobie:
 * mówi Mikołajowi, w jakim języku oddzwonić.
 */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

/** Poniedziałek jako 0 — siatka kalendarza zaczyna tydzień od poniedziałku. */
const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/* ------------------------------------------------------------------ */
/* ZEGAR                                                               */
/* ------------------------------------------------------------------ */

/**
 * „Teraz" odczytane raz, dopiero w przeglądarce.
 *
 * Na serwerze snapshot jest pusty, więc siatka kalendarza w ogóle się stamtąd
 * nie renderuje i nie ma czego rozjechać przy hydratacji. W przeglądarce
 * wartość liczy się przy pierwszym odczycie i zostaje zapamiętana: `getSnapshot`
 * musi oddawać stabilny wynik, inaczej React wpada w pętlę renderów. Przy okazji
 * „dzisiaj" nie przesunie się nikomu w trakcie wypełniania formularza
 * tuż przed północą.
 */
let clientNow: number | null = null;
const getClientNow = () => (clientNow ??= Date.now());
const getServerNow = () => null;
const subscribeNever = () => () => {};

/** Wszystkie godziny z grafiku — niezależnie od tego, czy jeszcze nie minęły. */
function allSlots() {
  const { from, to, stepMinutes } = bookingConfig.schedule;
  const out: number[] = [];
  for (let m = toMinutes(from); m <= toMinutes(to); m += stepMinutes) out.push(m);
  return out;
}

export function BookingForm() {
  const t = useT();
  const {
    labels,
    errors: errorMsg,
    calendar,
    message: messageText,
    privacyNote,
    orLabel,
    callPrompt,
  } = t.booking;

  /**
   * Kalendarz montujemy dopiero po stronie przeglądarki. „Dzisiaj” na serwerze
   * i w przeglądarce to dwie różne chwile, a bywa też, że i dwie różne strefy,
   * więc renderowanie siatki z serwera kończyłoby się rozjazdem przy hydratacji.
   *
   * Datę bierzemy z `useSyncExternalStore` (patrz „ZEGAR" wyżej), a nie
   * ze stanu ustawianego w efekcie. Efekt dokładał render z pustą siatką
   * i łamał regułę `set-state-in-effect`.
   */
  const nowMs = useSyncExternalStore(subscribeNever, getClientNow, getServerNow);

  const now = useMemo(() => (nowMs === null ? null : new Date(nowMs)), [nowMs]);
  const today = useMemo(() => (now ? startOfDay(now) : null), [now]);

  /* Wybór użytkownika w nagłówku kalendarza. Dopóki nikt nie przewijał
     miesięcy, pokazujemy bieżący. */
  const [monthPick, setMonthPick] = useState<Date | null>(null);
  const month = useMemo(
    () => monthPick ?? (today ? new Date(today.getFullYear(), today.getMonth(), 1) : null),
    [monthPick, today]
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [complaint, setComplaint] = useState("");
  /* Indeks pozycji w cenniku, a nie jej nazwa — patrz `services` niżej. */
  const [serviceIndex, setServiceIndex] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  /**
   * Usługi bierzemy z cennika, żeby lista nie rozjechała się z ofertą.
   *
   * Przy zmianie języka wybrana pozycja przestaje pasować do nowej listy,
   * bo to ten sam napis w innym języku. `<select>` pokazałby wtedy puste pole,
   * a walidacja i tak by je przepuściła. Dlatego wybór trzymamy jako INDEKS,
   * a nazwę odczytujemy dopiero przy składaniu wiadomości.
   */
  const services = useMemo(
    () =>
      t.pricing.groups.flatMap((group) =>
        group.items.map((item) => item.name).filter((name) => !isTodo(name))
      ),
    [t]
  );

  /** Nazwa wybranej usługi w bieżącym języku. Pusta, dopóki nikt nie wybrał. */
  const service = services[Number(serviceIndex)] ?? "";

  const horizon = today ? addDays(today, bookingConfig.schedule.horizonDays) : null;
  const leadMinutes = bookingConfig.schedule.leadTimeHours * 60;

  /** Czy w danym dniu został jeszcze jakikolwiek termin z wyprzedzeniem. */
  const daySlots = (day: Date) => {
    if (!now || !today) return [];
    const slots = allSlots();
    if (!sameDay(day, today)) return slots;
    const cutoff = now.getHours() * 60 + now.getMinutes() + leadMinutes;
    return slots.filter((m) => m >= cutoff);
  };

  const dayEnabled = (day: Date) => {
    if (!today || !horizon) return false;
    if (!bookingConfig.schedule.workdays.includes(day.getDay())) return false;
    if (day < today || day > horizon) return false;
    return daySlots(day).length > 0;
  };

  const slotsForSelected = date ? daySlots(date) : [];

  /** Siatka miesiąca: puste pola na początek tygodnia + dni miesiąca. */
  const grid = useMemo(() => {
    if (!month) return [];
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const blanks = Array.from({ length: mondayIndex(first) }, () => null);
    const cells = Array.from(
      { length: days },
      (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)
    );
    return [...blanks, ...cells];
  }, [month]);

  const canGoBack =
    !!month && !!today && month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward =
    !!month && !!horizon && month < new Date(horizon.getFullYear(), horizon.getMonth(), 1);

  const errors = {
    firstName: !firstName.trim(),
    lastName: !lastName.trim(),
    complaint: !complaint.trim(),
    service: serviceIndex === "",
    date: !date,
    time: !time,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const channelReady = !isTodo(business.email);

  /** Data w treści zgłoszenia, zapisana wg reguł danego języka. */
  const longDate = (d: Date) =>
    calendar.longDate(
      calendar.weekdays[mondayIndex(d)],
      d.getDate(),
      calendar.monthsIn[d.getMonth()],
      d.getFullYear()
    );

  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  const message = () =>
    [
      messageText.title,
      "",
      `${messageText.name}: ${fullName}`,
      `${messageText.service}: ${service}`,
      `${messageText.slot}: ${date ? longDate(date) : ""}, ${messageText.at} ${time}`,
      "",
      `${messageText.complaint}: ${complaint.trim()}`,
    ].join("\n");

  const send = () => {
    setShowErrors(true);
    if (hasErrors) {
      document.getElementById("zgloszenie-blad")?.scrollIntoView({ block: "center" });
      return;
    }
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      messageText.subject(fullName)
    )}&body=${encodeURIComponent(message())}`;
  };

  const field =
    "w-full rounded-btn border border-ink/20 bg-paper px-4 py-3 text-base text-ink " +
    "outline-none transition-colors placeholder:text-ink-40 focus:border-blue";
  const label = "mb-2 block text-sm font-semibold text-ink-80";
  const errorClass = "mt-1.5 block text-sm text-blue";

  return (
    /*
      TRZY KOMÓRKI, DWIE KOLUMNY.

      `items-start`: karta z terminem jest wyższa od karty z danymi, a przy
      rozciąganiu na równą wysokość pod polem opisu zostawało puste dno.

      Kolejność w DOM to dane → termin → notka i telefon, bo taka jest właściwa
      na telefonie: pacjent wypełnia pola, wybiera termin, wysyła, a dopiero
      potem czyta drobny druk i widzi wyjście na rozmowę. Na desktopie jawne
      `col-start`/`row-start` przesuwają notkę i telefon z powrotem POD dane,
      w lewą kolumnę — to one domykają pustkę, którą zostawiała tam wyższa
      karta z terminem.
    */
    <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
      {/* ---------------------------------------------------------- */}
      {/* DANE PACJENTA                                              */}
      {/* ---------------------------------------------------------- */}
      <div className="rounded-card border border-ink/12 bg-paper p-6 md:p-8 lg:col-start-1 lg:row-start-1">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="imie">
              {labels.firstName}
            </label>
            <input
              id="imie"
              name="imie"
              autoComplete="given-name"
              className={field}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={showErrors && errors.firstName}
            />
            {showErrors && errors.firstName && (
              <span className={errorClass}>{errorMsg.firstName}</span>
            )}
          </div>

          <div>
            <label className={label} htmlFor="nazwisko">
              {labels.lastName}
            </label>
            <input
              id="nazwisko"
              name="nazwisko"
              autoComplete="family-name"
              className={field}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={showErrors && errors.lastName}
            />
            {showErrors && errors.lastName && (
              <span className={errorClass}>{errorMsg.lastName}</span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className={label} htmlFor="usluga">
            {labels.service}
          </label>
          <select
            id="usluga"
            name="usluga"
            className={`${field} appearance-none`}
            value={serviceIndex}
            onChange={(e) => setServiceIndex(e.target.value)}
            aria-invalid={showErrors && errors.service}
          >
            <option value="">{labels.servicePlaceholder}</option>
            {services.map((name, i) => (
              <option key={name} value={i}>
                {name}
              </option>
            ))}
          </select>
          {showErrors && errors.service && (
            <span className={errorClass}>{errorMsg.service}</span>
          )}
        </div>

        <div className="mt-5">
          <label className={label} htmlFor="dolegliwosci">
            {labels.complaint}
          </label>
          <textarea
            id="dolegliwosci"
            name="dolegliwosci"
            rows={5}
            className={`${field} resize-y`}
            placeholder={labels.complaintHint}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            aria-invalid={showErrors && errors.complaint}
          />
          {showErrors && errors.complaint && (
            <span className={errorClass}>{errorMsg.complaint}</span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* TERMIN                                                     */}
      {/* ---------------------------------------------------------- */}
      {/* Na telefonie karta i ramka kalendarza mają węższe marginesy — każdy
          odzyskany piksel idzie na kratki dni, które inaczej robią się za małe
          na palec. */}
      <div className="rounded-card border border-ink/12 bg-paper p-4 md:p-8 lg:col-start-2 lg:row-start-1 lg:row-span-2">
        <p className={label}>{labels.date}</p>

        {/* Do czasu zamontowania trzymamy wysokość siatki, żeby karta nie skakała. */}
        {!month || !today ? (
          <div className="h-[19rem] rounded-btn border border-ink/10 bg-mist-dim" />
        ) : (
          <div className="rounded-btn border border-ink/12 p-2 md:p-3">
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() =>
                  setMonthPick(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                }
                disabled={!canGoBack}
                aria-label={calendar.prevMonth}
                className="rounded-btn px-3 py-1.5 text-lg leading-none text-ink-60 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ‹
              </button>
              <p className="font-display text-[15px] font-semibold">
                {calendar.months[month.getMonth()]} {month.getFullYear()}
              </p>
              <button
                type="button"
                onClick={() =>
                  setMonthPick(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                }
                disabled={!canGoForward}
                aria-label={calendar.nextMonth}
                className="rounded-btn px-3 py-1.5 text-lg leading-none text-ink-60 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ›
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wide text-ink-40 uppercase">
              {calendar.weekdays.map((d) => (
                <span key={d} className="py-1">
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {grid.map((day, i) =>
                day === null ? (
                  <span key={`p${i}`} />
                ) : (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={!dayEnabled(day)}
                    aria-pressed={!!date && sameDay(day, date)}
                    onClick={() => {
                      setDate(day);
                      setTime("");
                    }}
                    className={`aspect-square rounded-btn text-sm transition-colors ${
                      date && sameDay(day, date)
                        ? "bg-ink font-semibold text-paper"
                        : dayEnabled(day)
                          ? "text-ink hover:bg-blue/10"
                          : "cursor-not-allowed text-ink-40/45"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                )
              )}
            </div>
          </div>
        )}
        {showErrors && errors.date && (
          <span className={errorClass}>{errorMsg.date}</span>
        )}

        <p className={`${label} mt-6`}>{labels.time}</p>
        {!date ? (
          <p className="text-sm text-ink-40">{calendar.pickDayFirst}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotsForSelected.map((m) => {
              const value = toHHMM(m);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={time === value}
                  onClick={() => setTime(value)}
                  className={`rounded-btn border py-2 text-sm transition-colors ${
                    time === value
                      ? "border-ink bg-ink font-semibold text-paper"
                      : "border-ink/20 text-ink hover:border-ink/50"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        )}
        {showErrors && errors.time && (
          <span className={errorClass}>{errorMsg.time}</span>
        )}

        {/* ---------------------------------------------------------- */}
        {/* WYSYŁKA                                                    */}
        {/* ---------------------------------------------------------- */}
        <div className="mt-8 border-t border-ink/10 pt-6">
          {showErrors && hasErrors && (
            <p id="zgloszenie-blad" className="mb-4 text-sm text-blue">
              {errorMsg.summary}
            </p>
          )}

          {channelReady ? (
            <button
              type="button"
              onClick={send}
              className="inline-flex items-center justify-center gap-2 rounded-btn bg-blue px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-blue-bright hover:text-ink"
            >
              {labels.submitEmail}
            </button>
          ) : (
            <p className="rounded-btn border border-blue/30 bg-blue/5 px-4 py-3 text-sm text-ink-60">
              {labels.missingChannel}
            </p>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* DROBNY DRUK I DRUGA DROGA                                  */}
      {/* ---------------------------------------------------------- */}
      <div className="lg:col-start-1 lg:row-start-2">
        {privacyNote && (
          <p className="text-sm leading-relaxed text-ink-40">{privacyNote}</p>
        )}

        {/* Wyjście na telefon, gdyby ktoś nie chciał wypełniać formularza ani
            czekać na odpowiedź. Wyśrodkowane w kolumnie: „Lub" pracuje tu jako
            rozdzielnik między dwiema drogami, a rozdzielnik dosunięty do
            krawędzi przestaje nim być. */}
        {telLink && (
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="font-display text-lg text-ink/30">{orLabel}</p>
            <p className="mt-3 text-lg leading-relaxed text-ink-80">{callPrompt}</p>
            <ButtonLink href={telLink} className="mt-5">
              <PhoneIcon />
              {business.phoneDisplay}
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { booking, business, isTodo, pricing, waLink } from "@/content/site";

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
 * wiadomość i przekazuje ją do WhatsAppa albo do klienta poczty — pacjent
 * wysyła ją ze swojego numeru lub skrzynki, więc Mikołaj od razu ma kontakt
 * zwrotny. Brak `phoneE164` i `email` wyłącza wysyłkę i pokazuje to wprost,
 * zamiast udawać, że zgłoszenie gdzieś poleciało.
 */

const WEEKDAYS = ["pon", "wt", "śr", "czw", "pt", "sob", "ndz"];

const MONTHS = [
  "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
  "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień",
];

const MONTHS_IN = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];

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

const longDate = (d: Date) =>
  `${WEEKDAYS[mondayIndex(d)]}, ${d.getDate()} ${MONTHS_IN[d.getMonth()]} ${d.getFullYear()}`;

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
  const { from, to, stepMinutes } = booking.schedule;
  const out: number[] = [];
  for (let m = toMinutes(from); m <= toMinutes(to); m += stepMinutes) out.push(m);
  return out;
}

export function BookingForm() {
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
  const [service, setService] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  /** Usługi bierzemy z cennika, żeby lista nie rozjechała się z ofertą. */
  const services = useMemo(
    () =>
      pricing.groups.flatMap((group) =>
        group.items.map((item) => item.name).filter((name) => !isTodo(name))
      ),
    []
  );

  const horizon = today ? addDays(today, booking.schedule.horizonDays) : null;
  const leadMinutes = booking.schedule.leadTimeHours * 60;

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
    if (!booking.schedule.workdays.includes(day.getDay())) return false;
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
    service: !service,
    date: !date,
    time: !time,
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const channelReady = Boolean(business.phoneE164) || !isTodo(business.email);

  const message = () =>
    [
      "Zgłoszenie wizyty ze strony LetFit",
      "",
      `Imię i nazwisko: ${firstName.trim()} ${lastName.trim()}`,
      `Usługa: ${service}`,
      `Proponowany termin: ${date ? longDate(date) : ""}, godz. ${time}`,
      "",
      `Dolegliwości: ${complaint.trim()}`,
    ].join("\n");

  const send = (channel: "wa" | "mail") => {
    setShowErrors(true);
    if (hasErrors) {
      document.getElementById("zgloszenie-blad")?.scrollIntoView({ block: "center" });
      return;
    }
    const text = message();
    if (channel === "wa" && waLink) {
      window.open(`${waLink}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return;
    }
    const subject = `Zgłoszenie wizyty: ${firstName.trim()} ${lastName.trim()}`;
    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(text)}`;
  };

  const field =
    "w-full rounded-btn border border-ink/20 bg-paper px-4 py-3 text-base text-ink " +
    "outline-none transition-colors placeholder:text-ink-40 focus:border-blue";
  const label = "mb-2 block text-sm font-semibold text-ink-80";
  const errorText = "mt-1.5 block text-sm text-blue";

  return (
    /* `items-start`: karta z terminem jest wyższa od karty z danymi, a przy
       rozciąganiu na równą wysokość pod polem opisu zostawało puste dno. */
    <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
      {/* ---------------------------------------------------------- */}
      {/* DANE PACJENTA                                              */}
      {/* ---------------------------------------------------------- */}
      <div className="rounded-card border border-ink/12 bg-paper p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="imie">
              {booking.labels.firstName}
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
              <span className={errorText}>Podaj imię.</span>
            )}
          </div>

          <div>
            <label className={label} htmlFor="nazwisko">
              {booking.labels.lastName}
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
              <span className={errorText}>Podaj nazwisko.</span>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label className={label} htmlFor="usluga">
            {booking.labels.service}
          </label>
          <select
            id="usluga"
            name="usluga"
            className={`${field} appearance-none`}
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-invalid={showErrors && errors.service}
          >
            <option value="">{booking.labels.servicePlaceholder}</option>
            {services.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {showErrors && errors.service && (
            <span className={errorText}>Wybierz usługę.</span>
          )}
        </div>

        <div className="mt-5">
          <label className={label} htmlFor="dolegliwosci">
            {booking.labels.complaint}
          </label>
          <textarea
            id="dolegliwosci"
            name="dolegliwosci"
            rows={5}
            className={`${field} resize-y`}
            placeholder={booking.labels.complaintHint}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            aria-invalid={showErrors && errors.complaint}
          />
          {showErrors && errors.complaint && (
            <span className={errorText}>Napisz w dwóch zdaniach, co ci dolega.</span>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* TERMIN                                                     */}
      {/* ---------------------------------------------------------- */}
      {/* Na telefonie karta i ramka kalendarza mają węższe marginesy — każdy
          odzyskany piksel idzie na kratki dni, które inaczej robią się za małe
          na palec. */}
      <div className="rounded-card border border-ink/12 bg-paper p-4 md:p-8">
        <p className={label}>{booking.labels.date}</p>

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
                aria-label="Poprzedni miesiąc"
                className="rounded-btn px-3 py-1.5 text-lg leading-none text-ink-60 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ‹
              </button>
              <p className="font-display text-[15px] font-semibold">
                {MONTHS[month.getMonth()]} {month.getFullYear()}
              </p>
              <button
                type="button"
                onClick={() =>
                  setMonthPick(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                }
                disabled={!canGoForward}
                aria-label="Następny miesiąc"
                className="rounded-btn px-3 py-1.5 text-lg leading-none text-ink-60 transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ›
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold tracking-wide text-ink-40 uppercase">
              {WEEKDAYS.map((d) => (
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
        {showErrors && errors.date && <span className={errorText}>Wybierz dzień.</span>}

        <p className={`${label} mt-6`}>{booking.labels.time}</p>
        {!date ? (
          <p className="text-sm text-ink-40">Najpierw wybierz dzień z kalendarza.</p>
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
        {showErrors && errors.time && <span className={errorText}>Wybierz godzinę.</span>}

        {/* ---------------------------------------------------------- */}
        {/* WYSYŁKA                                                    */}
        {/* ---------------------------------------------------------- */}
        <div className="mt-8 border-t border-ink/10 pt-6">
          {showErrors && hasErrors && (
            <p id="zgloszenie-blad" className="mb-4 text-sm text-blue">
              Uzupełnij zaznaczone pola. Bez nich nie wiem, z czym i kiedy przychodzisz.
            </p>
          )}

          {channelReady ? (
            <div className="flex flex-wrap gap-3">
              {waLink && (
                <button
                  type="button"
                  onClick={() => send("wa")}
                  className="inline-flex items-center justify-center gap-2 rounded-btn bg-blue px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-blue-bright hover:text-ink"
                >
                  {booking.labels.submitWhatsApp}
                </button>
              )}
              {!isTodo(business.email) && (
                <button
                  type="button"
                  onClick={() => send("mail")}
                  className="inline-flex items-center justify-center gap-2 rounded-btn border border-ink/25 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink hover:bg-ink/[0.04]"
                >
                  {booking.labels.submitEmail}
                </button>
              )}
            </div>
          ) : (
            <p className="rounded-btn border border-blue/30 bg-blue/5 px-4 py-3 text-sm text-ink-60">
              {booking.labels.missingChannel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

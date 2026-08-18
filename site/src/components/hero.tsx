"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { bookingConfig, business, collaborationLogos, telLink } from "@/content/site";
import { useT } from "@/lib/i18n";
import { HeroRotatingLine } from "./hero-rotating-line";
import { HeroRunnerBackdrop, HeroRunnerLayer } from "./hero-runner";
import {
  ButtonLink,
  CalendarIcon,
  CheckIcon,
  PhoneIcon,
  Val,
} from "./ui";

export function Hero() {
  const t = useT();
  const hero = t.hero;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-ink/10 bg-paper pt-10 pb-16 md:pt-16 md:pb-20"
    >
      {/* Ozdobniki tła: dwie powolne plamy mgły i znak wodny z sygnetu.
          Wszystko dekoracyjne, pod treścią, bez wpływu na czytelność tekstu. */}
      <div
        aria-hidden="true"
        className="mist-drift pointer-events-none absolute -top-40 -left-32 size-[38rem] rounded-full bg-blue-soft/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        style={{ "--delay": "-12s" } as CSSProperties}
        className="mist-drift pointer-events-none absolute -bottom-48 left-1/3 size-[30rem] rounded-full bg-blue/8 blur-3xl"
      />
      {/* Biegacz jako warstwa tła przy prawej krawędzi — bez ramki i wcięcia. */}
      <HeroRunnerLayer />
      {/* Ten sam klip na telefonie: tło całej sekcji, pod tekstem. */}
      <HeroRunnerBackdrop />

      {/* Znak wodny leży NA klipie z biegaczem, nie pod nim. Wcześniej szedł
          przed `HeroRunnerLayer`, więc przykrywała go rozjaśniająca zasłona
          `bg-paper/45` i w rogu zostawała sama biała plama. `mix-blend-multiply`
          zamiast krycia sprawia, że znak przyciemnia obraz zamiast go zasłaniać. */}
      <Image
        src="/brand/letfit-mark.png"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1024}
        priority={false}
        className="hero-breathe pointer-events-none absolute top-8 right-8 hidden w-[20rem] mix-blend-multiply select-none lg:block xl:w-[24rem]"
      />

      {/*
        Kolumna z tekstem jest wyraźnie szersza niż połowa siatki. To warunek
        konieczny dla stopnia pisma nagłówka: przy 88 px najdłuższy wariant
        rotacji potrzebuje ok. 715 px, a przy podziale po połowie zostawało
        555 px i wiersz łamał się na dwa. Druga kolumna jedynie rezerwuje
        wysokość — klip z biegaczem i tak leży w warstwie tła, na 56%
        szerokości sekcji, więc jej zwężenie go nie dotyka.
      */}
      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <p
            style={{ "--delay": "0ms" } as CSSProperties}
            className="hero-in mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-ink-60 uppercase"
          >
            <span aria-hidden="true" className="h-px w-8 bg-blue/60" />
            {hero.eyebrow}
          </p>

          {/* Drugi wiersz podmienia się co dwie sekundy (hero-rotating-line.tsx).
              Pierwszy zostaje nieruchomy — to on niesie obietnicę, a ruch pod
              nim czyta się jak wyliczanka dopiero wtedy, gdy góra stoi. */}
          {/*
            Stopień pisma skaluje się płynnie zamiast skakać na progach, a jego
            granice są ZMIERZONE, nie dobrane na oko.

            Wiąże je najdłuższy wariant rotacji („którego ci brakuje"), który
            musi zmieścić się w jednym wierszu — przy groteskowym kroju jest
            ok. 8,1 raza szerszy niż wysoki. Górne 5,5rem (88 px) wymaga więc
            ok. 715 px i dlatego kolumna tekstu została poszerzona do 1,35fr:
            daje 762 px, czyli z zapasem. Dolna granica trzyma się szerokości
            telefonu, gdzie na tekst zostaje ok. 335 px.
          */}
          <h1 className="hero-display text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[1.04]">
            {hero.heading.split("\n").map((line, i) => {
              const rotates = i === 1 && hero.headingRotation.length > 1;
              return (
                <span
                  key={line}
                  style={{ "--delay": `${90 + i * 90}ms` } as CSSProperties}
                  className="hero-in block"
                >
                  {rotates ? (
                    <HeroRotatingLine phrases={hero.headingRotation} />
                  ) : (
                    line
                  )}
                </span>
              );
            })}
          </h1>

          <p
            style={{ "--delay": "290ms" } as CSSProperties}
            className="hero-in mt-7 max-w-xl text-lg leading-relaxed text-ink-60"
          >
            {hero.lead}
          </p>

          <ul className="mt-8 space-y-3">
            {hero.bullets.map((b, i) => (
              <li
                key={b}
                style={{ "--delay": `${380 + i * 80}ms` } as CSSProperties}
                className="hero-in flex items-start gap-3 text-[15px] text-ink-80"
              >
                <CheckIcon className="mt-1 size-4 shrink-0 text-blue" />
                {b}
              </li>
            ))}
          </ul>

          <div
            style={{ "--delay": "640ms" } as CSSProperties}
            className="hero-in mt-10 flex flex-wrap gap-3"
          >
            {bookingConfig.enabled ? (
              <ButtonLink href="#rezerwacja">
                <CalendarIcon />
                {t.ui.book}
              </ButtonLink>
            ) : (
              business.booksyUrl && (
                <ButtonLink
                  href={business.booksyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarIcon />
                  {t.ui.bookBooksy}
                </ButtonLink>
              )
            )}
            {telLink && (
              <ButtonLink
                href={telLink}
                variant={bookingConfig.enabled || business.booksyUrl ? "outline" : "primary"}
              >
                <PhoneIcon />
                {business.phoneDisplay}
              </ButtonLink>
            )}
            {!bookingConfig.enabled && !business.booksyUrl && !telLink && (
              <ButtonLink href="#kontakt">
                <CalendarIcon />
                {t.ui.book}
              </ButtonLink>
            )}
          </div>

          {!telLink && (
            <p
              style={{ "--delay": "700ms" } as CSSProperties}
              className="hero-in mt-4 text-sm"
            >
              <Val>{business.phoneDisplay}</Val>
            </p>
          )}
        </div>

        {/* Pusta kolumna rezerwuje miejsce dla warstwy z biegaczem od lg w górę. */}
        <div aria-hidden="true" className="hidden lg:block lg:min-h-[34rem]" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PASEK WSPÓŁPRACY ZE SPORTOWCAMI                                     */
/* ------------------------------------------------------------------ */

/**
 * Ile razy powielamy listę klubów w taśmie. Wyprowadzenie tej liczby siedzi
 * przy `marquee-track` w globals.css — w skrócie: taśma minus jedna kopia
 * musi wypełnić szerokość okna, inaczej w miejscu zapętlenia widać pustkę.
 */
const MARQUEE_COPIES = 8;

export function Collaborations() {
  const t = useT();
  if (collaborationLogos.length === 0) return null;

  return (
    <section className="marquee-viewport overflow-hidden border-b border-ink/10 bg-mist py-6">
      {/*
        Podpis stoi nieruchomo po lewej, a taśma z klubami jedzie obok niego.
        Na jasnym podłożu podpis musi mieć własne tło i wytopienie w prawo —
        inaczej nazwy wjeżdżałyby wprost pod niego i zlewały się z nim.
      */}
      {/*
        Taśma siedzi w tym samym kontenerze co reszta strony, a nie na całej
        szerokości okna. To nie jest kwestia rytmu, tylko powtórzeń: na ekranie
        2560 px rozciągnięty pasek pokazywał 2,5 kopii listy naraz i te same
        trzy nazwy stały obok siebie. Ograniczony do kontenera mieści mniej
        więcej jedną kopię, więc nazwa wraca dopiero po pełnym obrocie.
      */}
      <div className="container-x relative flex items-center">
        <p className="relative z-10 shrink-0 bg-mist pr-6 text-xs font-semibold tracking-[0.18em] text-ink-40 uppercase">
          {t.collaborations.lead}
        </p>

        {/*
          Pierwsza kopia niesie treść, pozostałe tylko domykają pętlę, więc są
          schowane przed czytnikiem ekranu. Dlaczego akurat tyle kopii —
          patrz `marquee-track` w globals.css.
        */}
        <div className="marquee-fade min-w-0 flex-1 overflow-hidden">
          <div
            className="marquee-track"
            style={{ "--marquee-copies": MARQUEE_COPIES } as CSSProperties}
          >
            {Array.from({ length: MARQUEE_COPIES }, (_, i) => (
              <ClubTape key={i} duplicate={i > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Znaczek klubu obok nazwy.
 *
 * Kształt bierze się z danych: herby są okrągłe, znaki złożone na kwadratowym
 * tle wyglądają lepiej w kwadracie z zaokrąglonymi rogami. Kadr jest kwadratowy
 * w obu przypadkach, więc rytm paska się nie sypie.
 *
 * Dopóki nie ma pliku, w środku siedzą inicjały — świadomie, zamiast rysować
 * przybliżenie cudzego herbu. Po wrzuceniu grafiki do `/public/brand/clubs/`
 * i wpisaniu ścieżki w `site.ts` zastępnik znika sam.
 */
function ClubBadge({
  item,
}: {
  item: (typeof collaborationLogos)[number];
}) {
  const shape = item.shape === "rounded" ? "rounded-[0.55rem]" : "rounded-full";
  const frame = `size-9 shrink-0 overflow-hidden ${shape} ring-1 ring-ink/10`;

  if (!item.logo) {
    return (
      <span
        aria-hidden="true"
        className={`${frame} grid place-items-center bg-blue-soft font-display text-[11px] font-semibold tracking-wide text-blue`}
      >
        {item.initials}
      </span>
    );
  }

  return (
    <span aria-hidden="true" className={`${frame} bg-paper`}>
      <Image
        src={item.logo}
        alt=""
        width={144}
        height={144}
        className="club-logo size-full object-contain"
        unoptimized
      />
    </span>
  );
}

function ClubTape({ duplicate = false }: { duplicate?: boolean }) {
  const t = useT();

  return (
    /*
      Odstępy są duże celowo. Przy ciasnym rozstawie w kadr wchodziło po kilka
      powtórzeń tej samej nazwy naraz i pasek wyglądał na zapchany jednym
      napisem. Szeroka przerwa sprawia, że w danej chwili widać zwykle trzy
      pozycje, a powtórzenie wraca dopiero po przejechaniu całej listy.
    */
    <ul
      className="flex shrink-0 items-center gap-x-24 pr-24 md:gap-x-32 md:pr-32"
      aria-hidden={duplicate || undefined}
    >
      {collaborationLogos.map((item) => (
        <li
          key={item.id}
          className="flex shrink-0 items-center gap-3.5 whitespace-nowrap"
        >
          <ClubBadge item={item} />
          <span className="font-display text-[15px] font-semibold text-ink-80">
            {t.collaborations.names[item.id]}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* ZASTĘPNIK ZDJĘCIA                                                   */
/* ------------------------------------------------------------------ */

export function PhotoPlaceholder({
  label,
  hint,
}: {
  label: string;
  hint: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <svg
        viewBox="0 0 24 24"
        className="size-10 text-ink/25"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.5" />
        <path d="m4 18 5.5-5.5L14 17l2.5-2.5L20 18" />
      </svg>
      <p className="font-display text-sm font-semibold text-ink-60">{label}</p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-ink-40">
        Wrzuć plik do <code className="font-mono">/public/photos/</code> i wpisz ścieżkę w{" "}
        <code className="font-mono">{hint}</code>
      </p>
    </div>
  );
}

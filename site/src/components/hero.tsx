import type { CSSProperties } from "react";
import Image from "next/image";
import { booking, business, collaborations, hero, telLink, waLink } from "@/content/site";
import { HeroRotatingLine } from "./hero-rotating-line";
import { HeroRunnerBackdrop, HeroRunnerLayer } from "./hero-runner";
import {
  ButtonLink,
  CalendarIcon,
  CheckIcon,
  PhoneIcon,
  Val,
  WhatsAppIcon,
} from "./ui";

export function Hero() {
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

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
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
          <h1 className="text-[2.5rem] leading-[1.08] font-semibold sm:text-5xl lg:text-[3.6rem]">
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
            {booking.enabled ? (
              <ButtonLink href="#rezerwacja">
                <CalendarIcon />
                Umów wizytę
              </ButtonLink>
            ) : (
              business.booksyUrl && (
                <ButtonLink
                  href={business.booksyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarIcon />
                  Rezerwuj w Booksy
                </ButtonLink>
              )
            )}
            {telLink && (
              <ButtonLink
                href={telLink}
                variant={booking.enabled || business.booksyUrl ? "outline" : "primary"}
              >
                <PhoneIcon />
                {business.phoneDisplay}
              </ButtonLink>
            )}
            {waLink && (
              <ButtonLink
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
              >
                <WhatsAppIcon />
                WhatsApp
              </ButtonLink>
            )}
            {!booking.enabled && !business.booksyUrl && !telLink && (
              <ButtonLink href="#kontakt">
                <CalendarIcon />
                Umów wizytę
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

export function Collaborations() {
  if (collaborations.items.length === 0) return null;

  return (
    <section className="border-b border-ink/10 bg-mist py-7">
      {/* Podpis i trzy nazwy rozkładają się równo na całej szerokości paska.
          Wcześniej rozciągana była sama lista, więc odstęp między podpisem
          a pierwszym klubem był o połowę mniejszy niż odstępy między klubami
          i rytm się sypał. `sm:contents` wypuszcza `li` bezpośrednio do flexa
          rodzica, dzięki czemu wszystkie cztery elementy dzielą wolne miejsce
          po równo, a znacznik listy zostaje na swoim miejscu.
          Poniżej `sm` lista wraca do zwykłego zawijania — rozstrzelona
          na wąskim ekranie wyglądałaby na zgubioną. */}
      <div className="container-x flex flex-col items-start gap-x-8 gap-y-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="shrink-0 text-xs font-semibold tracking-[0.18em] text-ink-40 uppercase">
          {collaborations.lead}
        </p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 sm:contents">
          {collaborations.items.map((item) => (
            <li
              key={item}
              className="font-display text-[15px] font-semibold text-ink-80"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
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

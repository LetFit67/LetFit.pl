"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { certificates } from "@/content/site";
import { useT } from "@/lib/i18n";
import { Eyebrow, Lead, Section, SectionHeading } from "./ui";

/** Najwęższy dopuszczalny kciuk suwaka jako ułamek toru. Przy dziesięciu
    kaflach naturalna proporcja zeszłaby na wąskich ekranach do kilku pikseli
    i nie dałoby się w nią trafić palcem. */
const MIN_KCIUK = 0.14;

/**
 * CERTYFIKATY JAKO POZIOMY PAS PRZECIĄGANY MYSZĄ.
 *
 * Mechanika przeciągania jest ta sama co w `testimonials-rail.tsx`: chwyt
 * wskaźnikiem i wybieg po puszczeniu. Skopiowana, a nie współdzielona, bo tamten
 * plik niesie ze sobą kaskadę wejścia, gwiazdki i zapętlenie, a tutaj żadna
 * z tych rzeczy nie jest potrzebna.
 *
 * BEZ ZAPĘTLANIA, w odróżnieniu od opinii. Pętla wymaga potrojenia listy,
 * a tu każda pozycja to zdjęcie: trzydzieści obrazków zamiast dziesięciu
 * kosztowałoby więcej, niż warta jest wygoda przewijania w kółko.
 *
 * KAFLE MAJĄ STAŁĄ SZEROKOŚĆ, A SKAN JEST W NIE WPISANY (`object-contain`),
 * nie przycięty. Dziewięć certyfikatów jest poziomych, jeden pionowy, więc
 * przy kafelkach o naturalnej szerokości ten jeden byłby o połowę węższy,
 * a podpis pod nim długi na trzy wiersze. Stała szerokość kosztuje trochę
 * pustego miejsca po bokach pionowego skanu i to jest tańszy kompromis.
 *
 * Wymiary każdego pliku podaje `certificates` w site.ts. Bez nich `next/image`
 * nie zna proporcji przed wczytaniem i układ przeskakiwałby po doczytaniu.
 *
 * POD PASEM STOI WŁASNY SUWAK. Systemowy pasek przewijania jest schowany
 * (`.rail-track` w globals.css), więc nic nie mówiło, że pas sięga dalej niż
 * krawędź ekranu. Suwak pokazuje, ile listy widać, i sam przewija: wskaźnikiem,
 * palcem i strzałkami z klawiatury.
 *
 * KLIKNIĘCIE W KAFEL OTWIERA SKAN W NAKŁADCE, z krzyżykiem, klawiszem Escape
 * i tłem gaszącym podgląd. Wcześniej skan wychodził do nowej karty i jedynym
 * wyjściem było zamknięcie tej karty. Odnośnik zostaje prawdziwym `href`-em,
 * więc bez skryptu i pod klikiem z modyfikatorem plik otwiera się po staremu.
 */
export function Certificates() {
  const t = useT();
  const { certificates: tekst } = t;
  const pas = useRef<HTMLUListElement>(null);
  const tor = useRef<HTMLDivElement>(null);
  const [ciagnie, setCiagnie] = useState(false);
  const [ciagnieSuwak, setCiagnieSuwak] = useState(false);
  /** Ułamek listy mieszczący się w kadrze oraz położenie okna przewijania. */
  const [suwak, setSuwak] = useState({ udzial: 1, pozycja: 0 });
  /** Indeks certyfikatu pokazanego w nakładce; `null` znaczy: nakładka zgaszona. */
  const [podglad, setPodglad] = useState<number | null>(null);

  useEffect(() => {
    const el = pas.current;
    if (!el) return;

    let startX = 0;
    let startScroll = 0;
    let aktywny = false;
    let predkosc = 0;
    let ostatniX = 0;
    let ostatniT = 0;
    let wybieg = 0;
    /* Przeciągnięcie nie może kończyć się otwarciem certyfikatu, w który
       akurat trafił kursor. Ta flaga zjada kliknięcie po dłuższym ruchu. */
    let przeciagniete = false;

    const stopWybieg = () => {
      if (wybieg) cancelAnimationFrame(wybieg);
      wybieg = 0;
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      stopWybieg();
      aktywny = true;
      przeciagniete = false;
      startX = ostatniX = e.clientX;
      ostatniT = performance.now();
      predkosc = 0;
      startScroll = el.scrollLeft;
      setCiagnie(true);
    };

    const move = (e: PointerEvent) => {
      if (!aktywny) return;
      const delta = e.clientX - startX;
      if (Math.abs(delta) > 3) {
        przeciagniete = true;
        el.setPointerCapture?.(e.pointerId);
        e.preventDefault();
      }
      el.scrollLeft = startScroll - delta;

      /* Uśrednianie z poprzednim pomiarem: pojedyncza klatka potrafi dać
         skrajną wartość i wybieg wychodziłby szarpany. */
      const teraz = performance.now();
      const dt = teraz - ostatniT;
      if (dt > 0) {
        predkosc = predkosc * 0.7 + ((e.clientX - ostatniX) / dt) * 0.3;
        ostatniX = e.clientX;
        ostatniT = teraz;
      }
    };

    const up = () => {
      if (!aktywny) return;
      aktywny = false;
      setCiagnie(false);

      let v = predkosc * 16;
      if (Math.abs(v) < 0.5) return;
      const zwalniaj = () => {
        el.scrollLeft -= v;
        v *= 0.94;
        if (Math.abs(v) > 0.2) wybieg = requestAnimationFrame(zwalniaj);
        else wybieg = 0;
      };
      wybieg = requestAnimationFrame(zwalniaj);
    };

    const klik = (e: MouseEvent) => {
      if (!przeciagniete) return;
      e.preventDefault();
      e.stopPropagation();
      przeciagniete = false;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("click", klik, true);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      stopWybieg();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("click", klik, true);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  /* Suwak czyta pas, nie odwrotnie: każde przewinięcie, skądkolwiek przyszło
     (przeciągnięcie kafli, gest na dotyku, klawiatura), przesuwa kciuk. */
  useEffect(() => {
    const el = pas.current;
    if (!el) return;

    const przelicz = () => {
      const zakres = el.scrollWidth - el.clientWidth;
      setSuwak({
        udzial: zakres > 0 ? el.clientWidth / el.scrollWidth : 1,
        pozycja: zakres > 0 ? el.scrollLeft / zakres : 0,
      });
    };

    przelicz();
    el.addEventListener("scroll", przelicz, { passive: true });
    /* Doczytane obrazki i obrót telefonu zmieniają szerokość pasa,
       a samo `resize` okna tego nie łapie. */
    const obserwator = new ResizeObserver(przelicz);
    obserwator.observe(el);
    for (const dziecko of Array.from(el.children)) obserwator.observe(dziecko);

    return () => {
      el.removeEventListener("scroll", przelicz);
      obserwator.disconnect();
    };
  }, []);

  /* Wymiary bierzemy z żywego DOM-u, nie ze stanu: przy przeciąganiu liczy się
     to, co jest na ekranie w tej klatce, a stan zawsze jest o krok z tyłu. */
  const przewinDoWskaznika = useCallback((x: number) => {
    const el = pas.current;
    const t2 = tor.current;
    if (!el || !t2) return;

    const zakres = el.scrollWidth - el.clientWidth;
    if (zakres <= 0) return;

    const r = t2.getBoundingClientRect();
    const kciuk = r.width * Math.max(el.clientWidth / el.scrollWidth, MIN_KCIUK);
    const bieg = r.width - kciuk;
    if (bieg <= 0) return;

    /* Punkt chwytu liczymy do ŚRODKA kciuka, dlatego odejmujemy jego połowę:
       inaczej kciuk skakałby lewą krawędzią pod kursor. */
    const p = Math.min(1, Math.max(0, (x - r.left - kciuk / 2) / bieg));
    el.scrollLeft = p * zakres;
  }, []);

  const klawiszSuwaka = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = pas.current;
    if (!el) return;
    const krok = el.clientWidth * 0.6;

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      el.scrollBy({ left: e.key === "ArrowLeft" ? -krok : krok, behavior: "smooth" });
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      el.scrollTo({
        left: e.key === "Home" ? 0 : el.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  if (certificates.length === 0) return null;

  const kciuk = Math.max(suwak.udzial, MIN_KCIUK);

  return (
    <Section id="certyfikaty" tone="mist">
      <div>
        <Eyebrow>{tekst.eyebrow}</Eyebrow>
        <SectionHeading>{tekst.heading}</SectionHeading>
        <Lead>{tekst.lead}</Lead>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-ink-40">
        <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-blue/50" />
        <span aria-hidden="true" className="hidden sm:inline">
          {tekst.dragHint}
        </span>
      </p>

      <ul
        id="pas-certyfikatow"
        ref={pas}
        className={`rail-track mt-6 flex gap-5 overflow-x-auto pb-4 ${
          ciagnie ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {certificates.map((c, i) => {
          const nazwa = tekst.names[c.id] ?? c.id;
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`/certyfikaty/${c.id}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tekst.open(nazwa)}
                onClick={(e) => {
                  /* Klik z modyfikatorem to świadome otwarcie w nowej karcie.
                     Nakładka przejmuje wyłącznie zwykłe kliknięcie. */
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  setPodglad(i);
                }}
                className="group block w-[16rem] sm:w-[19rem]"
              >
                {/* Ramka o stałych wymiarach, skan wyśrodkowany w środku.
                    Bez wyśrodkowania pionowy certyfikat przykleiłby się
                    do lewej krawędzi kafla. */}
                <div className="flex h-[11rem] items-center justify-center overflow-hidden rounded-card border border-ink/12 bg-paper p-2 transition-colors group-hover:border-ink/30 sm:h-[13rem]">
                  <Image
                    src={`/certyfikaty/${c.id}.jpg`}
                    alt={nazwa}
                    width={c.w}
                    height={c.h}
                    sizes="(max-width: 640px) 16rem, 19rem"
                    className="pointer-events-none max-h-full w-auto object-contain"
                  />
                </div>

                <p className="mt-3 text-[14px] leading-snug font-medium text-ink-80">
                  {nazwa}
                </p>
                <p className="mt-0.5 text-xs text-ink-40">
                  {c.issuer} · {c.year}
                </p>
              </a>
            </li>
          );
        })}
      </ul>

      {/* Suwak znika, gdy cała lista mieści się w kadrze: pasek, którym nie ma
          czego przewijać, tylko myli. */}
      {suwak.udzial < 1 && (
        <div
          ref={tor}
          role="scrollbar"
          aria-controls="pas-certyfikatow"
          aria-orientation="horizontal"
          aria-label={tekst.scrollbar}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(suwak.pozycja * 100)}
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault();
            setCiagnieSuwak(true);
            przewinDoWskaznika(e.clientX);
            /* Przechwycenie wskaźnika na końcu i w klamrze: dzięki niemu ruch
               poza torem nadal prowadzi kciuk, ale gdy się nie uda, chwyt ma
               działać dalej, tylko bez wyprowadzania palca poza pasek. */
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              /* wskaźnik zdążył zniknąć, nie ma czego przechwytywać */
            }
          }}
          onPointerMove={(e) => {
            if (ciagnieSuwak) przewinDoWskaznika(e.clientX);
          }}
          onPointerUp={() => setCiagnieSuwak(false)}
          onPointerCancel={() => setCiagnieSuwak(false)}
          onKeyDown={klawiszSuwaka}
          /* Wysokość 1.5 rem to pole trafienia dla palca, sam pasek jest cienki.
             `touch-none`, bo bez tego palec na suwaku przewijałby stronę
             w pionie zamiast prowadzić kciuk w poziomie. */
          className={`relative mx-auto mt-2 h-6 w-full max-w-md touch-none rounded-full outline-blue outline-offset-2 focus-visible:outline-2 ${
            ciagnieSuwak ? "cursor-grabbing" : "cursor-pointer"
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink/10"
          />
          <span
            aria-hidden="true"
            className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-colors ${
              ciagnieSuwak ? "bg-blue" : "bg-blue/70"
            }`}
            style={{
              width: `${kciuk * 100}%`,
              left: `${suwak.pozycja * (1 - kciuk) * 100}%`,
            }}
          />
        </div>
      )}

      {podglad !== null && (
        <PodgladCertyfikatu
          indeks={podglad}
          nazwa={tekst.names[certificates[podglad].id] ?? certificates[podglad].id}
          etykietaZamkniecia={tekst.close}
          onClose={() => setPodglad(null)}
        />
      )}
    </Section>
  );
}

/**
 * Nakładka z pełnym skanem.
 *
 * Rysowana PORTALEM do `body`, a nie w miejscu sekcji: `position: fixed` liczy
 * się względem najbliższego przodka z transformacją, a sekcje na tej stronie
 * mają animacje wejścia. W portalu nakładka zawsze zakrywa cały ekran.
 *
 * Wyjść można na trzy sposoby, bo każdy ma swoje odruchy: krzyżykiem, klawiszem
 * Escape i kliknięciem w tło obok skanu.
 */
function PodgladCertyfikatu({
  indeks,
  nazwa,
  etykietaZamkniecia,
  onClose,
}: {
  indeks: number;
  nazwa: string;
  etykietaZamkniecia: string;
  onClose: () => void;
}) {
  const c = certificates[indeks];
  const zamknij = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wczesniej = document.activeElement as HTMLElement | null;
    zamknij.current?.focus();

    const klawisz = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      /* W nakładce jest jeden przycisk, więc pilnowanie fokusu sprowadza się
         do zawrócenia go na krzyżyk. Bez tego Tab schodziłby na stronę pod
         spodem, po której nie widać, gdzie się jest. */
      if (e.key === "Tab") {
        e.preventDefault();
        zamknij.current?.focus();
      }
    };

    /* Strona pod nakładką stoi. Ubytek paska przewijania nadrabiamy
       marginesem, inaczej cały układ podskakiwałby w bok przy otwarciu. */
    const pasekPrzewijania = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (pasekPrzewijania > 0) document.body.style.paddingRight = `${pasekPrzewijania}px`;

    document.addEventListener("keydown", klawisz);
    return () => {
      document.removeEventListener("keydown", klawisz);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      wczesniej?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={nazwa}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-ink/85 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        ref={zamknij}
        type="button"
        onClick={onClose}
        aria-label={etykietaZamkniecia}
        className="absolute top-4 right-4 grid size-11 place-items-center rounded-btn border border-paper/25 bg-ink/60 text-paper transition-colors hover:border-paper/50 hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper sm:top-6 sm:right-6"
      >
        <XIcon />
      </button>

      <Image
        src={`/certyfikaty/${c.id}.jpg`}
        alt={nazwa}
        width={c.w}
        height={c.h}
        sizes="100vw"
        /* `priority`, bo skan wchodzi tu z kliknięcia, a nie z przewijania.
           Leniwe wczytywanie nie ruszyłoby go z miejsca: dopóki plik nie jest
           w pamięci, `w-auto` daje zerową szerokość, a obserwator widoczności
           nie ma czego zobaczyć i obrazek zostaje pusty. */
        priority
        /* Skan łapie kliknięcia i sam ich nie obsługuje, więc klik w niego nic
           nie robi, a klik obok, już w tło, gasi nakładkę. */
        draggable={false}
        /* `w-auto` przy ograniczonej wysokości: przeglądarka sama przelicza
           szerokość z proporcji pliku, więc pionowy skan nie dostaje białych
           pasów po bokach, a poziomy nie wychodzi poza ekran. */
        className="max-h-[76vh] w-auto max-w-full rounded-card bg-paper object-contain shadow-2xl shadow-ink/40"
      />

      <p className="max-w-2xl text-center text-sm text-paper/80">
        <span className="font-medium text-paper">{nazwa}</span>
        <span className="mx-2 text-paper/40">·</span>
        {c.issuer} · {c.year}
      </p>
    </div>,
    document.body,
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

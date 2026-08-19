"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useT } from "@/lib/i18n";

/**
 * OPINIE JAKO POZIOMY PAS PRZECIĄGANY MYSZĄ.
 *
 * Pas przewija się chwytem: wciskasz i ciągniesz, tak jak przesuwa się mapę.
 * Na dotyku działa natywne przewijanie palcem, więc obsługa gestu dotyczy
 * wyłącznie wskaźnika. Strzałek nie ma — chwyt jest jedynym sterowaniem.
 *
 * ANIMACJE STERUJE ATRYBUT `data-rail`, NIE `@starting-style`.
 * Ta różnica jest istotna: `@starting-style` działa dla elementów dopiero
 * wstawianych do drzewa, a karty przychodzą gotowe z serwera — przeglądarka
 * nie uznaje ich za nowe i nie ma czego animować. Dlatego stan ukryty zakłada
 * skrypt po zamontowaniu, a zdejmuje go dopiero, gdy pas wjedzie w kadr.
 *
 * Bez skryptu, przy zatrzymanym zegarze dokumentu i przy prośbie o mniej ruchu
 * atrybut nie pojawia się wcale — sekcja jest wtedy kompletna i nieruchoma.
 *
 * PAS JEST ZAPĘTLONY: za ostatnią opinią wraca pierwsza i tak w kółko, w obie
 * strony. Robi to KOPIOWANIE, nie przestawianie elementów — lista jedzie
 * trzykrotnie, pas startuje na początku środkowej kopii, a skrypt przesuwa
 * `scrollLeft` o szerokość jednej kopii, gdy pacjent wyjedzie poza jej zakres.
 * Treść w miejscu skoku jest identyczna, więc skok jest niewidoczny, a przewijanie
 * nigdy nie uderza w koniec listy.
 *
 * Kopie 2 i 3 są `aria-hidden` — czytnik ekranu ma przeczytać siedem opinii,
 * a nie dwadzieścia jeden.
 */

/**
 * Ile razy powielamy listę opinii.
 *
 * Trzy, nie dwa: pas startuje na POCZĄTKU ŚRODKOWEJ kopii, więc z każdej strony
 * zostaje pełna lista zapasu. Przy dwóch kopiach i starcie od zera przewijanie
 * w lewo od razu uderzałoby w krawędź, bo `scrollLeft` nie schodzi poniżej
 * zera i nie ma czego zawinąć.
 */
const LOOP_COPIES = 3;

type Item = {
  quote: string;
  author: string;
  context?: string;
  rating: number;
};

export function TestimonialsRail({
  items,
  source,
  dragHint,
}: {
  items: Item[];
  source?: string;
  dragHint?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"idle" | "pending" | "in">("idle");
  const [dragging, setDragging] = useState(false);

  /* Przy jednej opinii nie ma czego zapętlać — zostaje zwykły, krótki pas. */
  const looped = items.length > 1;
  const copies = looped ? LOOP_COPIES : 1;

  /* ---------------------------------------------------------------- */
  /* WEJŚCIE W KADR                                                    */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // W karcie w tle zegar stoi — pas ma tam zostać po prostu widoczny.
    if (document.hidden) return;
    if (!("IntersectionObserver" in window)) return;

    setPhase("pending");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setPhase("in");
          io.disconnect();
        });
      },
      { threshold: 0.25 },
    );

    io.observe(rail);
    // Bezpiecznik — gdyby obserwator nigdy nie zadziałał, odsłaniamy sami.
    const t = window.setTimeout(() => setPhase("in"), 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /* PRZECIĄGANIE                                                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let startX = 0;
    let startScroll = 0;
    let active = false;
    /* Prędkość liczona z ostatniego ruchu — napędza wybieg po puszczeniu. */
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let glide = 0;

    const stopGlide = () => {
      if (glide) cancelAnimationFrame(glide);
      glide = 0;
    };

    /* ---------------------------------------------------------------- */
    /* ZAWIJANIE                                                         */
    /* ---------------------------------------------------------------- */

    /**
     * Szerokość jednej kopii listy, mierzona w DOM-ie jako odległość między
     * pierwszą kartą kopii 1 a pierwszą kartą kopii 2. Liczenie jej ze
     * `scrollWidth / 3` byłoby o włos nietrafione, bo w tej sumie siedzą
     * jeszcze przerwy między kopiami.
     */
    const setWidth = () => {
      if (!looped) return 0;
      const first = rail.children[0] as HTMLElement | undefined;
      const next = rail.children[items.length] as HTMLElement | undefined;
      if (!first || !next) return 0;
      return next.offsetLeft - first.offsetLeft;
    };

    /**
     * Przesuwa pas o całą kopię, gdy wyjedzie poza zakres środkowej. Karta pod
     * tą samą pozycją w sąsiedniej kopii jest ta sama, więc skoku nie widać.
     * `startScroll` przesuwamy razem z nim — inaczej trwające przeciągnięcie
     * odbiłoby pas z powrotem w następnej klatce.
     */
    const wrap = () => {
      const w = setWidth();
      // Kopia węższa od kadru nie da się zapętlić bez widocznego przeskoku.
      if (w <= 0 || w <= rail.clientWidth) return;
      if (rail.scrollLeft >= 2 * w) {
        rail.scrollLeft -= w;
        startScroll -= w;
      } else if (rail.scrollLeft < w) {
        rail.scrollLeft += w;
        startScroll += w;
      }
    };

    /* Start na początku środkowej kopii — dopiero stamtąd da się jechać w obie
       strony. Po zmianie szerokości okna karty mają inny rozmiar, więc pozycję
       trzeba wyznaczyć na nowo. */
    const reset = () => {
      const w = setWidth();
      if (w > 0 && w > rail.clientWidth) rail.scrollLeft = w;
    };
    reset();

    const onResize = () => reset();

    /* Palcem i kółkiem myszy przewija sama przeglądarka, więc zawijanie musi
       wisieć też na zwykłym zdarzeniu przewijania, nie tylko na geście.
       W trakcie przeciągania pomijamy je — tam `wrap` wywołuje `move`,
       razem z korektą `startScroll`. */
    const onScroll = () => {
      if (!active) wrap();
    };

    const down = (e: PointerEvent) => {
      // Dotyk i pióro zostawiamy przeglądarce — natywne przewijanie jest lepsze.
      if (e.pointerType !== "mouse") return;
      stopGlide();
      active = true;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      startScroll = rail.scrollLeft;
      setDragging(true);
    };

    const move = (e: PointerEvent) => {
      if (!active) return;
      const delta = e.clientX - startX;
      // Dopiero wyraźny ruch przejmuje zdarzenie, żeby nie blokować kliknięć.
      if (Math.abs(delta) > 3) {
        rail.setPointerCapture?.(e.pointerId);
        e.preventDefault();
      }
      rail.scrollLeft = startScroll - delta;
      wrap();

      /* Uśredniamy z poprzednim pomiarem — pojedyncza klatka potrafi dać
         skrajną wartość i wybieg wychodziłby szarpany. */
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const v = (e.clientX - lastX) / dt;
        velocity = velocity * 0.7 + v * 0.3;
        lastX = e.clientX;
        lastT = now;
      }
    };

    const up = () => {
      if (!active) return;
      active = false;
      setDragging(false);

      /*
        Wybieg: pas jedzie dalej i wytraca prędkość, zamiast stawać jak wryty
        w chwili puszczenia. Mnożnik 16 przelicza piksele na milisekundę na
        drogę w jednej klatce, a 0,94 to tarcie — im bliżej jedynki, tym
        dłuższy poślizg.
      */
      const startVelocity = velocity * 16;
      if (Math.abs(startVelocity) < 0.5) return;

      let v = startVelocity;
      const decay = () => {
        rail.scrollLeft -= v;
        wrap();
        v *= 0.94;
        if (Math.abs(v) > 0.2) glide = requestAnimationFrame(decay);
        else glide = 0;
      };
      glide = requestAnimationFrame(decay);
    };

    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    rail.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("resize", onResize);

    return () => {
      stopGlide();
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      rail.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", onResize);
    };
  }, [looped, items.length]);

  return (
    <div className="mt-12">
      {source && (
        <p className="mb-6 flex items-center gap-2 text-sm text-ink-40">
          {source}
          {dragHint && (
            <span aria-hidden="true" className="hidden sm:inline">
              · {dragHint}
            </span>
          )}
        </p>
      )}

      <ul
        ref={railRef}
        data-rail={phase === "idle" ? undefined : phase}
        /*
          BEZ `scroll-snap`. Przyciąganie — nawet w łagodnym wariancie
          `proximity` — po każdym zatrzymaniu ruchu dociągało pas do najbliższej
          karty. Przy przeciąganiu myszą wyglądało to jak przeskakiwanie
          slajdów zamiast ciągłego przesuwania. Pozycję pasa wyznacza teraz
          wyłącznie ruch ręki i wybieg po puszczeniu.
        */
        className={`rail-track flex gap-6 overflow-x-auto pb-4 ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {Array.from({ length: copies }, (_, copy) =>
          items.map((t, i) => (
          <li
            key={`${copy}-${t.author}`}
            /* Kaskada wejścia liczy się w obrębie kopii: przy dwudziestu jeden
               kartach narastające opóźnienie ciągnęłoby się kilka sekund. */
            style={{ "--i": i } as CSSProperties}
            /* Kopie poza pierwszą tylko domykają pętlę — czytnik ekranu ma
               przeczytać siedem opinii, nie dwadzieścia jeden. */
            aria-hidden={copy > 0 || undefined}
            className="rail-card w-[20rem] shrink-0 sm:w-[23rem]"
          >
            <figure className="flex h-full flex-col items-center rounded-[1.75rem] border border-ink/8 bg-paper p-8 text-center shadow-[0_6px_24px_-8px_rgba(10,20,51,0.14)]">
              <Rating
                value={t.rating}
                index={i}
                active={phase === "in" && copy === 0}
              />

              <blockquote className="mt-6 flex-1 font-display text-[16.5px] leading-[1.65] text-ink-80 italic">
                „{t.quote}”
              </blockquote>

              <figcaption className="mt-6 w-full border-t border-ink/10 pt-4">
                <span className="font-display text-sm font-semibold not-italic">
                  {t.author}
                </span>
                {t.context && (
                  <span className="mt-0.5 block text-xs text-ink-40">
                    {t.context}
                  </span>
                )}
              </figcaption>
            </figure>
          </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OCENA — gwiazdki plus liczba                                        */
/* ------------------------------------------------------------------ */

const STAR_PATH =
  "M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z";

function Rating({
  value,
  index,
  active,
}: {
  value: number;
  index: number;
  active: boolean;
}) {
  /*
    Liczba dolicza się od zera do oceny. Startuje z pełną wartością, więc bez
    skryptu i przy nieruchomej stronie widać po prostu „5,0”, a nie zero.
  */
  const t = useT();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const from = 0;
    const duration = 620;
    const delay = index * 90 + 200;
    let raf = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = Math.min(1, (now - startedAt) / duration);
      // Wyhamowanie na końcu — liczba dobiega do oceny, zamiast w nią wpadać.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (value - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active, value, index]);

  return (
    /* Ocena jest pierwszą rzeczą w karcie i ma taką wagę — gwiazdki są
       wyraźnie większe od pisma, a liczba idzie obok nich jak wynik. */
    <div className="flex items-center justify-center gap-3.5">
      {/*
        `relative` NIE jest tu ozdobą.

        `sr-only` ustawia `position: absolute`. Bez pozycjonowanego przodka
        blokiem zawierającym takiego elementu jest cały dokument, więc podpis
        NIE JEST przycinany przez pas z opiniami: ląduje w bezwzględnych
        współrzędnych daleko poza ekranem i rozciąga stronę na kilka tysięcy
        pikseli, dając poziomy pasek przewijania przy całym dokumencie.

        Po potrojeniu listy na potrzeby pętli podpisy odjeżdżały trzy razy
        dalej niż wcześniej, więc problem stał się dobrze widoczny.
      */}
      <div className="relative flex items-center gap-2">
        <span className="sr-only">{t.ui.ratingOf(value)}</span>

        {Array.from({ length: 5 }, (_, s) => (
          <span key={s} aria-hidden="true" className="relative block size-7">
            {/* Zarys zostaje pod spodem — widać, ile gwiazdek jeszcze czeka. */}
            <svg
              viewBox="0 0 20 20"
              className="absolute inset-0 size-full text-ink/12"
              fill="currentColor"
            >
              <path d={STAR_PATH} />
            </svg>

            {s < value && (
              <svg
                viewBox="0 0 20 20"
                className="star-fill absolute inset-0 size-full text-amber-500"
                style={{ "--s": s } as CSSProperties}
                fill="currentColor"
              >
                <path d={STAR_PATH} />
              </svg>
            )}
          </span>
        ))}
      </div>

      <span
        aria-hidden="true"
        className="font-display text-xl font-semibold text-ink tabular-nums"
      >
        {shown.toFixed(1).replace(".", t.ui.decimalMark)}
      </span>
    </div>
  );
}

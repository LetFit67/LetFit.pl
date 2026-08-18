"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
 */

type Item = {
  quote: string;
  author: string;
  context?: string;
  rating: number;
};

export function TestimonialsRail({
  items,
  source,
}: {
  items: Item[];
  source?: string;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"idle" | "pending" | "in">("idle");
  const [dragging, setDragging] = useState(false);

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
        v *= 0.94;
        if (Math.abs(v) > 0.2) glide = requestAnimationFrame(decay);
        else glide = 0;
      };
      glide = requestAnimationFrame(decay);
    };

    rail.addEventListener("pointerdown", down);
    rail.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    return () => {
      stopGlide();
      rail.removeEventListener("pointerdown", down);
      rail.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="mt-12">
      {source && (
        <p className="mb-6 flex items-center gap-2 text-sm text-ink-40">
          {source}
          <span aria-hidden="true" className="hidden sm:inline">
            · przeciągnij, aby przewinąć
          </span>
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
        {items.map((t, i) => (
          <li
            key={t.author}
            style={{ "--i": i } as CSSProperties}
            className="rail-card w-[20rem] shrink-0 sm:w-[23rem]"
          >
            <figure className="flex h-full flex-col items-center rounded-[1.75rem] border border-ink/8 bg-paper p-8 text-center shadow-[0_6px_24px_-8px_rgba(10,20,51,0.14)]">
              <Rating value={t.rating} index={i} active={phase === "in"} />

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
        ))}
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
      <div className="flex items-center gap-2">
        <span className="sr-only">Ocena {value} na 5</span>

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
        {shown.toFixed(1).replace(".", ",")}
      </span>
    </div>
  );
}

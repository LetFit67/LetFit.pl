"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Zapętlony klip z biegaczem, wtopiony w tło sekcji hero.
 *
 * Nie ma tu ramki ani zaokrąglonego kadru — obraz schodzi maską do zera, zanim
 * dojdzie do kolumny z tekstem, więc nie widać żadnego wcięcia. Na dużych
 * ekranach klip jest warstwą tła przy prawej krawędzi, na małych staje się
 * pasem pod tekstem, rozciągniętym na całą szerokość.
 *
 * Klip powstał w generatorze, po czym został rozmyty, ochłodzony kolorystycznie
 * i zapętlony. Pętla jest zbudowana WYŁĄCZNIE do przodu: końcówka materiału
 * przenika w jego początek. Wcześniejsza wersja używała ping-ponga (przód plus
 * odwrócony tył) i w punkcie zawrócenia biegacz zaczynał biec wstecz, co wyglądało
 * jak podwójny wymach rękami. Pomiar potwierdził skuteczność zmiany: różnica
 * między ostatnią a pierwszą klatką wynosi tyle samo, co między dowolnymi dwiema
 * sąsiednimi klatkami w środku klipu.
 *
 * Warianty źródłowe leżą w `../Biegacz/`.
 */

/** Maska pozioma wygasza obraz na długo przed kolumną z tekstem. */
const DESKTOP_MASK: CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 34%, #000 68%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 76%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 34%, #000 68%), linear-gradient(to bottom, transparent 0%, #000 18%, #000 76%, transparent 100%)",
  WebkitMaskComposite: "source-in",
};

const MOBILE_MASK: CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, transparent 0%, #000 24%, #000 70%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, #000 24%, #000 70%, transparent 100%)",
};

function useReducedMotionPause() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.autoplay = false;
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return ref;
}

const VIDEO_PROPS = {
  src: "/video/hero-runner.mp4",
  poster: "/video/hero-runner.jpg",
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "metadata",
  "aria-hidden": true,
} as const;

/** Warstwa tła przy prawej krawędzi hero — od dużych ekranów w górę. */
export function HeroRunnerLayer() {
  const ref = useReducedMotionPause();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] select-none lg:block"
      style={DESKTOP_MASK}
    >
      <video
        ref={ref}
        {...VIDEO_PROPS}
        className="size-full scale-105 object-cover blur-[2px]"
      />
      {/* Zasłony: rozjaśnienie w kolor tła i chłodny odcień marki. */}
      <div className="absolute inset-0 bg-paper/45" />
      <div className="absolute inset-0 bg-blue/10 mix-blend-multiply" />
    </div>
  );
}

/** Pas pod tekstem — na ekranach mniejszych niż lg. */
export function HeroRunnerBand() {
  const ref = useReducedMotionPause();

  return (
    <div
      aria-hidden="true"
      /* Renderowany poza `container-x`, więc pełna szerokość sekcji wychodzi
         wprost z `w-full` — bez ujemnych marginesów i bez prześwitu przy krawędzi. */
      className="pointer-events-none relative mt-10 h-72 w-full select-none lg:hidden"
      style={MOBILE_MASK}
    >
      <video
        ref={ref}
        {...VIDEO_PROPS}
        className="size-full scale-105 object-cover blur-[2px]"
      />
      <div className="absolute inset-0 bg-paper/45" />
      <div className="absolute inset-0 bg-blue/10 mix-blend-multiply" />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { certificates } from "@/content/site";
import { useT } from "@/lib/i18n";
import { Eyebrow, Lead, Section, SectionHeading } from "./ui";

/**
 * CERTYFIKATY JAKO POZIOMY PAS PRZECIĄGANY MYSZĄ.
 *
 * Mechanika jest ta sama co w `testimonials-rail.tsx`: chwyt wskaźnikiem
 * i wybieg po puszczeniu. Skopiowana, a nie współdzielona, bo tamten plik
 * niesie ze sobą kaskadę wejścia, gwiazdki i zapętlenie, a tutaj żadna z tych
 * rzeczy nie jest potrzebna.
 *
 * BEZ ZAPĘTLANIA, w odróżnieniu od opinii. Pętla wymaga potrojenia listy,
 * a tu każda pozycja to zdjęcie: trzydzieści obrazków zamiast dziesięciu
 * kosztowałoby więcej, niż warta jest wygoda przewijania w kółko.
 *
 * KAFLE MAJĄ STAŁĄ SZEROKOŚĆ, A SKAN JEST W NIE WPISANY (`object-contain`),
 * nie przycięty. Dziewięć certyfikatów jest poziomych, jeden pionowy, więc
 * przy kafelkach o naturalnej szerokości ten jeden byłby o połowę węższy,
 * a podpis pod nim — długi na trzy wiersze. Stała szerokość kosztuje trochę
 * pustego miejsca po bokach pionowego skanu i to jest tańszy kompromis.
 *
 * Wymiary każdego pliku podaje `certificates` w site.ts. Bez nich `next/image`
 * nie zna proporcji przed wczytaniem i układ przeskakiwałby po doczytaniu.
 */
export function Certificates() {
  const t = useT();
  const { certificates: tekst } = t;
  const pas = useRef<HTMLUListElement>(null);
  const [ciagnie, setCiagnie] = useState(false);

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

  if (certificates.length === 0) return null;

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
        ref={pas}
        className={`rail-track mt-6 flex gap-5 overflow-x-auto pb-4 ${
          ciagnie ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {certificates.map((c) => {
          const nazwa = tekst.names[c.id] ?? c.id;
          return (
            <li key={c.id} className="shrink-0">
              <a
                href={`/certyfikaty/${c.id}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tekst.open(nazwa)}
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
    </Section>
  );
}

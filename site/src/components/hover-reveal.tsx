"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Rozwija `<details>` w środku po najechaniu myszą — na dotyku nie robi nic.
 *
 * Kliknięcie działa niezależnie i ma pierwszeństwo: jeśli pacjent kliknie
 * pozycję, zostaje ona „przypięta" i nie zamknie się przy zjechaniu kursorem.
 * Bez tego czytanie dłuższego opisu kończyłoby się zamknięciem panelu przy
 * pierwszym drgnięciu ręki.
 *
 * Celowo nie zastępuję tym `<details>`: znacznik daje za darmo obsługę
 * klawiatury, czytników ekranu i wyszukiwarki, a strona działa tak samo,
 * gdyby ten skrypt się nie wykonał. Hover jest dodatkiem, nie fundamentem.
 */
export function HoverReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Dotyk, rysik i sterowanie klawiaturą zostają przy samym kliknięciu.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups: (() => void)[] = [];

    root.querySelectorAll("details").forEach((d) => {
      const open = () => {
        if (d.dataset.pinned !== "true") d.open = true;
      };
      const close = () => {
        if (d.dataset.pinned !== "true") d.open = false;
      };
      // W momencie kliknięcia `d.open` to jeszcze STARY stan — przypinamy więc
      // ten, do którego przeglądarka zaraz przejdzie.
      const pin = () => {
        d.dataset.pinned = String(!d.open);
      };

      const summary = d.querySelector("summary");
      d.addEventListener("mouseenter", open);
      d.addEventListener("mouseleave", close);
      summary?.addEventListener("click", pin);

      cleanups.push(() => {
        d.removeEventListener("mouseenter", open);
        d.removeEventListener("mouseleave", close);
        summary?.removeEventListener("click", pin);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Jednozdaniowa podpowiedź nad rozwijaną listą. Myszy mówi „najedź",
 * dotykowi „dotknij" — rozstrzyga o tym CSS w `globals.css`, więc nie ma
 * migotania przy hydratacji ani zgadywania urządzenia w JavaScripcie.
 */
export function ExpandHint({
  pointer,
  touch,
  className = "",
}: {
  pointer: string;
  touch: string;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2 text-sm text-ink-40 ${className}`}
      aria-hidden="true"
    >
      <span className="inline-block size-1.5 rounded-full bg-blue/50" />
      <span className="hint-pointer">{pointer}</span>
      <span className="hint-touch">{touch}</span>
    </p>
  );
}

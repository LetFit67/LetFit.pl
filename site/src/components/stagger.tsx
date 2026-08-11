"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lista, której elementy pojawiają się po kolei, gdy sekcja wejdzie w kadr.
 *
 * Domyślnie — czyli w HTML-u z serwera i bez JS-a — wszystko jest widoczne.
 * Stan ukrycia dokłada dopiero skrypt, więc awaria JS-u czy blokada skryptów
 * nie potrafi zostawić pustej sekcji.
 *
 * Dwa wyjątki, w których animacja w ogóle się nie włącza:
 *   • `prefers-reduced-motion: reduce` — użytkownik prosił o mniej ruchu,
 *   • karta niewidoczna w momencie startu (otwarta w tle, bot do zrzutów) —
 *     oś czasu dokumentu wtedy stoi, przejście zamarłoby w stanie ukrytym
 *     i treść nie pojawiłaby się wcale.
 */
export function StaggerList({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (document.visibilityState !== "visible") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.stagger = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.stagger = "in";
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}

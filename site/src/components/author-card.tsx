"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { credit } from "@/content/site";

/* ------------------------------------------------------------------ */
/* PIKTOGRAMY                                                          */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "size-4 shrink-0",
};

const ITEM_ICONS: Record<string, ReactNode> = {
  link: (
    <svg {...iconProps}>
      <path d="M10.4 13.6a3.6 3.6 0 0 0 5.2 0l2.8-2.8a3.7 3.7 0 0 0-5.2-5.2l-1.4 1.4" />
      <path d="M13.6 10.4a3.6 3.6 0 0 0-5.2 0l-2.8 2.8a3.7 3.7 0 0 0 5.2 5.2l1.4-1.4" />
    </svg>
  ),
  calendar: (
    <svg {...iconProps}>
      <rect x="3.4" y="5" width="17.2" height="15.4" rx="2" />
      <path d="M3.4 9.8h17.2M8.2 3.2v3.6M15.8 3.2v3.6" />
    </svg>
  ),
  code: (
    <svg {...iconProps}>
      <path d="m8.6 8.4-4.4 3.7 4.4 3.7M15.4 8.4l4.4 3.7-4.4 3.7M13.4 4.6l-2.8 15" />
    </svg>
  ),
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      {...iconProps}
      className={`size-3.5 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 14.5 6-6 6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* KAFELEK AUTORA                                                      */
/* ------------------------------------------------------------------ */

/**
 * Podpis wykonawcy strony w formie kafelka z rozwijaną listą.
 *
 * Lista wychodzi w GÓRĘ — kafelek siedzi na samym dole dokumentu, więc panel
 * rozwijany w dół lądowałby poza ekranem i wymuszał przewijanie.
 *
 * Sam kafelek jest zwykłym odnośnikiem do studia, a rozwijanie siedzi
 * w osobnym przycisku obok. Dzięki temu podpis działa tak samo jak wcześniejszy
 * zwykły link — również wtedy, gdy skrypt się nie wykona.
 */
export function AuthorCard() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    /* `text-left` jest tu potrzebne: w stopce kafelek stoi w kolumnie
       wyrównanej do prawej, a wyrównanie dziedziczy się do środka kafelka. */
    <div ref={root} className="relative w-full text-left sm:w-72">
      <div className="flex items-center gap-2 rounded-card border border-ink/12 bg-paper p-3 transition-colors hover:border-ink/25">
        <a
          href={credit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 items-center gap-3"
        >
          {/* Kafelek zostaje granatowy także pod logo: znak NikPage jest biały
              na przezroczystym tle i na jasnym podłożu zniknąłby bez śladu. */}
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-btn bg-ink font-display text-lg font-semibold text-paper transition-colors group-hover:bg-blue"
          >
            {credit.avatar ? (
              <Image
                src={credit.avatar}
                alt=""
                width={440}
                height={377}
                unoptimized
                className="size-7 object-contain"
              />
            ) : (
              credit.monogram
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block text-sm leading-tight font-semibold">
              {credit.label}
            </span>
            <span className="block text-xs leading-tight text-ink-40">
              {credit.role}
            </span>
          </span>
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Szczegóły wykonawcy: ${credit.label}`}
          onClick={() => setOpen((v) => !v)}
          className="grid size-8 shrink-0 place-items-center rounded-btn text-ink-40 transition-colors hover:bg-mist hover:text-blue"
        >
          <ChevronIcon open={open} />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          className="absolute right-0 bottom-full z-20 mb-2 w-full rounded-card border border-ink/12 bg-paper p-2 shadow-lg shadow-ink/10"
        >
          <ul className="space-y-0.5">
            {credit.items.map((item) => {
              const row = (
                <>
                  <span className="flex flex-1 items-center gap-2.5 text-ink-60">
                    {ITEM_ICONS[item.icon]}
                    <span className="text-sm font-medium text-ink">{item.label}</span>
                  </span>
                  <span className="rounded-btn bg-blue-soft px-2 py-0.5 text-xs font-semibold text-blue">
                    {item.value}
                  </span>
                </>
              );

              return (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-btn p-2.5 transition-colors hover:bg-mist"
                    >
                      {row}
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 p-2.5">{row}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {credit.cta.href && (
            <>
              <div
                aria-hidden="true"
                className="my-2 h-px bg-linear-to-r from-transparent via-ink/15 to-transparent"
              />
              <a
                href={credit.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-btn bg-blue-soft p-2.5 text-sm font-semibold text-blue transition-colors hover:bg-blue hover:text-paper"
              >
                {credit.cta.label}
                <span aria-hidden="true">→</span>
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

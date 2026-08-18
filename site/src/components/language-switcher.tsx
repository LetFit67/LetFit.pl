"use client";

import { DICTIONARIES, LOCALES, useLocale, useT } from "@/lib/i18n";

/**
 * Przełącznik języka — segmentowana pigułka „PL | EN".
 *
 * Dwa osobne przyciski, a nie jeden przełączający się w kółko: przy dwóch
 * językach różnica jest niewielka, ale pacjent od razu widzi, że wersja
 * angielska w ogóle istnieje, zamiast domyślać się tego po ikonie.
 *
 * Podpis każdego przycisku dla czytnika ekranu jest W JĘZYKU, NA KTÓRY
 * PRZEŁĄCZA („Switch to English" pod EN). Czytnik wymawia go wtedy poprawnie,
 * a osoba nieznająca polskiego rozumie, w co klika.
 *
 * Flag CELOWO nie ma. Flaga oznacza kraj, nie język — angielski w wersji
 * z brytyjskim proporczykiem odsyłałby Amerykanina czy Ukraińca po angielsku
 * do niewłaściwego miejsca.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t.meta.switchLabel}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border border-ink/15 p-0.5 ${className}`}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={DICTIONARIES[code].meta.switchTo}
            lang={DICTIONARIES[code].meta.htmlLang}
            className={`rounded-full px-2.5 py-1.5 text-xs font-semibold tracking-[0.08em] transition-colors ${
              active
                ? "bg-ink text-paper"
                : "text-ink-40 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {DICTIONARIES[code].meta.short}
          </button>
        );
      })}
    </div>
  );
}

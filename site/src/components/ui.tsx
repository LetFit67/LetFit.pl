"use client";

import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { isTodo } from "@/content/site";
import { useT } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* LOGO                                                                */
/* ------------------------------------------------------------------ */

/**
 * Pliki generuje `scripts/build-brand-pictogram.mjs` ze znaku piktogramowego
 * („Logo concept/Piktogram 2026").
 *
 * `mark` to sam sygnet, bez podpisu obok — używany tam, gdzie napis i tak
 * byłby nieczytelny (favikona, znak wodny, małe formaty).
 *
 * Znak jest granatowy na przezroczystym tle, więc nadaje się wyłącznie na jasne
 * podłoże. Na ciemnych sekcjach logo nie występuje.
 */
const LOGO_FILES = {
  horizontal: { file: "letfit-horizontal", w: 1189, h: 400 },
  mark: { file: "letfit-mark", w: 1024, h: 1024 },
} as const;

type LogoProps = {
  variant?: keyof typeof LOGO_FILES;
  className?: string;
  priority?: boolean;
};

/**
 * `unoptimized` jest tu celowe. Logo szło przez `/_next/image?url=…` i w pasku
 * nagłówka potrafiło się nie pojawić, mimo że plik jest poprawny (sprawdzone
 * pikselowo) i serwer oddaje go z kodem 200. Adres z parametrem `url=` bywa
 * blokowany przez rozszerzenia przeglądarki i zapisywany w cache osobno od
 * samego pliku. Plik ma własną kompresję paletową (70 kB) nadaną w
 * `scripts/build-brand-pictogram.mjs`, więc optymalizator niewiele tu zyskuje,
 * a znak ładuje się wprost spod `/brand/…`.
 */
export function Logo({ variant = "horizontal", className, priority }: LogoProps) {
  const cfg = LOGO_FILES[variant];
  const t = useT();
  return (
    <Image
      src={`/brand/${cfg.file}.png`}
      alt={t.ui.logoAlt}
      width={cfg.w}
      height={cfg.h}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}

/* ------------------------------------------------------------------ */
/* UKŁAD SEKCJI                                                        */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  tone = "paper",
  className = "",
  children,
}: {
  id?: string;
  tone?: "paper" | "mist" | "ink";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    paper: "bg-paper text-ink",
    mist: "bg-mist text-ink",
    ink: "bg-ink text-paper",
  };
  return (
    <section id={id} className={`${tones[tone]} py-20 md:py-28 ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase ${
        onDark ? "text-blue-bright" : "text-blue"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-8 ${onDark ? "bg-blue-bright/60" : "bg-blue/50"}`}
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`max-w-3xl text-3xl leading-[1.15] font-semibold sm:text-4xl md:text-[2.6rem] ${className}`}
    >
      {children}
    </h2>
  );
}

export function Lead({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`mt-5 max-w-2xl text-lg leading-relaxed ${
        onDark ? "text-paper/70" : "text-ink-60"
      }`}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* PRZYCISKI                                                           */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "accent" | "outline" | "ghost-dark";

/**
 * Pigułka zamiast prostokąta — jedyne miejsce na stronie, gdzie odchodzimy
 * od ostrych narożników. Przycisk jest wezwaniem do działania i ma się
 * odróżniać od kafli, które zostają kanciaste.
 */
const BUTTON_BASE =
  "btn-shell inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 " +
  "text-sm font-semibold transition-colors duration-300";

/**
 * Każdy wariant podaje dwie rzeczy: wygląd spoczynkowy (tło i obramowanie
 * na samym przycisku) oraz kolor warstwy najechania w `--btn-fill`.
 * Samego przejścia kolorów nie animujemy — robi to warstwa `btn-fill`.
 */
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper [--btn-fill:var(--color-blue)]",
  accent: "bg-blue text-paper [--btn-fill:var(--color-blue-deep)]",
  outline:
    "border border-ink/25 text-ink hover:border-ink hover:text-paper [--btn-fill:var(--color-ink)]",
  "ghost-dark":
    "border border-paper/30 text-paper hover:border-paper hover:text-ink [--btn-fill:var(--color-paper)]",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variant?: ButtonVariant }) {
  return (
    <a
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {/* Warstwa otoczki. Dekoracyjna, leży pod treścią (z-index -1),
          więc nie przechwytuje kliknięć ani nie wchodzi do drzewa dostępności. */}
      <span aria-hidden="true" className="btn-fill rounded-full" />
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* ZNACZNIK BRAKUJĄCEJ TREŚCI                                          */
/* ------------------------------------------------------------------ */

/**
 * Renderuje wartość z pliku treści. Jeżeli to nieuzupełniony placeholder,
 * pokazuje go w widocznej ramce — żeby nie dało się wypuścić strony z luką.
 *
 * Znacznik [UZUPEŁNIJ] zostaje po polsku także w wersji angielskiej. To notatka
 * dla prowadzącego stronę, a nie treść dla pacjenta, i ma wyglądać tak samo
 * niezależnie od tego, w którym języku ktoś ją zobaczy.
 */
export function Val({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  if (!isTodo(children)) return <>{children}</>;
  return (
    <span
      className={`inline-block rounded border border-dashed border-blue/70 bg-blue-soft px-2 py-0.5 text-[0.8em] font-medium text-blue ${className}`}
      title="Uzupełnij tę wartość w src/content/site.ts albo w słowniku języka"
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* IKONY                                                               */
/* ------------------------------------------------------------------ */

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PhoneIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 13 11 21 19.4 21a1.5 1.5 0 0 0 1.6-1.5v-2a1 1 0 0 0-.8-1l-3.3-.7a1 1 0 0 0-1 .4l-.9 1.2a13.6 13.6 0 0 1-5.4-5.4l1.2-.9a1 1 0 0 0 .4-1l-.7-3.3a1 1 0 0 0-1-.8Z" />
    </svg>
  );
}

export function CalendarIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function PinIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function HomeIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5Z" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

export function ClockIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CheckIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function ArrowIcon({ className = "size-4" }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

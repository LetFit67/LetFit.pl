import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { isTodo } from "@/content/site";

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
  return (
    <Image
      src={`/brand/${cfg.file}.png`}
      alt="LetFit Physio — Mikołaj Letkiewicz, fizjoterapia"
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

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-btn px-6 py-3.5 text-sm font-semibold " +
  "transition-colors duration-200";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-ink-80",
  accent: "bg-blue text-paper hover:bg-blue-bright hover:text-ink",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.04]",
  "ghost-dark": "border border-paper/30 text-paper hover:border-paper hover:bg-paper/10",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: ButtonVariant }) {
  return (
    <a
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* ZNACZNIK BRAKUJĄCEJ TREŚCI                                          */
/* ------------------------------------------------------------------ */

/**
 * Renderuje wartość z pliku treści. Jeżeli to nieuzupełniony placeholder,
 * pokazuje go w widocznej ramce — żeby nie dało się wypuścić strony z luką.
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
      title="Uzupełnij tę wartość w src/content/site.ts"
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

export function WhatsAppIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.3.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.9a5 5 0 0 0 2.5.5c.7-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.2-.2-.4-.3Z" />
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

"use client";

import { useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

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
  className: "size-5",
};

/**
 * Rysunki są celowo oszczędne — ta sama kreska co w ikonach kontaktowych
 * (`ui.tsx`), żeby sekcja nie zaczęła wyglądać jak zestaw naklejek.
 */
const FOR_WHOM_ICONS: Record<string, ReactNode> = {
  /* Kręgosłup: kolumna kręgów z łagodnym wygięciem szyjnym. */
  spine: (
    <svg {...iconProps}>
      <path d="M13.5 3c-1.6 1.4-2.3 3-2.2 4.8.2 3.4 1.4 5 1.5 8.2.1 2.2-.7 4-2.3 5.5" />
      <path d="M12.4 6.2h3M11.4 9.6h3.3M12 13h3.2M12.6 16.4h3M11.5 19.6h2.8" />
    </svg>
  ),
  /* Promieniowanie: punkt zapalny i fale schodzące na obwód. */
  radiating: (
    <svg {...iconProps}>
      <circle cx="7" cy="7" r="2.4" />
      <path d="M11.2 6.2a6.5 6.5 0 0 1 0 8.6M14.6 4.4a10.5 10.5 0 0 1 0 12.6M6.6 9.9 5.2 20.9" />
    </svg>
  ),
  /* Uraz sportowy: sylwetka w biegu. */
  sport: (
    <svg {...iconProps}>
      <circle cx="15.5" cy="4.7" r="1.9" />
      <path d="M14.8 21.5 12 16.2l2.4-2.6-1-4.6-3 2.1-1.1 3" />
      <path d="m14.4 9 3.4 1.9 1.2 3.2M11.4 11.1 6.6 9.4" />
    </svg>
  ),
  /* Po operacji: opatrunek — najczytelniejszy skrót „po zabiegu". */
  recovery: (
    <svg {...iconProps}>
      <rect x="2.6" y="8.6" width="18.8" height="6.8" rx="3.4" transform="rotate(-38 12 12)" />
      <path d="M10.6 11.2h.01M13.4 12.8h.01M10.9 14.1h.01M13.1 9.9h.01" strokeWidth="2.1" />
    </svg>
  ),
  /* Praca przy biurku: monitor na podstawce. */
  desk: (
    <svg {...iconProps}>
      <rect x="2.8" y="4" width="18.4" height="12" rx="1.6" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  ),
  /* Wada postawy: pion odniesienia oraz linie barków i miednicy — dokładnie
     to, co porównuje się na ocenie postawy. */
  posture: (
    <svg {...iconProps}>
      <path d="M12 2.2v19.6" strokeDasharray="2.2 2.6" />
      <path d="M5.6 8.6 18.4 6.6M6.8 16.8 17.2 15.4" />
      <path d="M5.6 8.6h.01M18.4 6.6h.01M6.8 16.8h.01M17.2 15.4h.01" strokeWidth="2.8" />
    </svg>
  ),
};

/* ------------------------------------------------------------------ */
/* KAFEL                                                               */
/* ------------------------------------------------------------------ */

/**
 * Akcenty krążą po trzech odcieniach marki. Sześć osobnych kolorów, jak
 * w typowych siatkach „feature", rozbiłoby granatowo-błękitną paletę — a przy
 * takim zawężeniu i tak nie byłyby od siebie odróżnialne.
 */
const ACCENTS = ["#0a2c63", "#10428f", "#2f74c0"];

/** Maksymalny przechył kafla pod kursorem. Ledwie wyczuwalny i o to chodzi. */
const TILT = 4;

let motionOk: boolean | null = null;

/**
 * Przechył zostaje wyłączony tam, gdzie byłby nie na miejscu: przy prośbie
 * o mniej ruchu i na ekranach dotykowych (tam kursor to tap, więc kafel
 * zastygałby przechylony). Wynik zapamiętujemy — `matchMedia` przy każdym
 * ruchu myszy to zbędna praca.
 */
function tiltEnabled() {
  if (motionOk === null) {
    motionOk =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover)").matches;
  }
  return motionOk;
}

type Item = { icon: string; title: string; body: string };

function Card({
  item,
  accent,
  dimmed,
  onEnter,
  onLeave,
}: {
  item: Item;
  accent: string;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLLIElement>(null);

  /* Kąt i środek poświaty idą prosto we własności CSS elementu, z pominięciem
     stanu Reacta — przy każdym drgnięciu myszy przerysowywanie całej siatki
     byłoby marnotrawstwem. */
  const handleMove = (e: MouseEvent<HTMLLIElement>) => {
    const el = ref.current;
    if (!el || !tiltEnabled()) return;

    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;

    el.style.setProperty("--rx", `${(0.5 - ny) * 2 * TILT}deg`);
    el.style.setProperty("--ry", `${(nx - 0.5) * 2 * TILT}deg`);
    el.style.setProperty("--gx", `${nx * 100}%`);
    el.style.setProperty("--gy", `${ny * 100}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    onLeave();
  };

  return (
    <li
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className="tilt-card group relative flex flex-col gap-5 overflow-hidden rounded-card border border-ink/12 bg-paper p-7 hover:border-ink/25"
      style={
        {
          "--accent": accent,
          "--card-scale": dimmed ? 0.985 : 1,
          opacity: dimmed ? 0.55 : 1,
        } as CSSProperties
      }
    >
      {/* Stały refleks w narożniku — kafel ma kolor także bez kursora. */}
      <span aria-hidden="true" className="card-tint pointer-events-none absolute inset-0" />

      {/* Poświata chodząca za kursorem. */}
      <span
        aria-hidden="true"
        className="card-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="icon-badge relative grid size-11 shrink-0 place-items-center rounded-btn">
        {FOR_WHOM_ICONS[item.icon]}
      </span>

      <div className="relative">
        <h3 className="text-[17px] leading-snug font-semibold">{item.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-60">{item.body}</p>
      </div>

      {/* Kreska akcentu wysuwająca się przy najechaniu. */}
      <span
        aria-hidden="true"
        className="accent-rule absolute inset-x-0 bottom-0 h-px w-0 transition-[width] duration-500 group-hover:w-full"
      />
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* SIATKA                                                              */
/* ------------------------------------------------------------------ */

/**
 * Kafle „dla kogo". Po najechaniu na jeden pozostałe przygasają — pacjent
 * szuka tu swojego objawu, więc warto, żeby wybrany punkt został sam na sam
 * z uwagą.
 */
export function ForWhomGrid({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Card
          key={item.title}
          item={item}
          accent={ACCENTS[i % ACCENTS.length]}
          dimmed={active !== null && active !== item.title}
          onEnter={() => setActive(item.title)}
          onLeave={() => setActive(null)}
        />
      ))}
    </ul>
  );
}

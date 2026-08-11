import type { CSSProperties } from "react";

/**
 * Trzy propozycje grafiki do sekcji hero. Wszystkie:
 *   • są czystym SVG-em z animacją CSS — zero wideo, zero zależności,
 *     ostre w każdej rozdzielczości i wagi kilku kilobajtów,
 *   • mieszczą się w kadrze 4:5 z zapasem, nic nie jest przycinane,
 *   • trzymają paletę strony: granat i błękit, czerwień tylko jako sygnał bólu,
 *   • wracają do stanu spoczynkowego, więc zamrożone wyglądają jak ilustracja.
 *
 * Klatki kluczowe siedzą w globals.css, w bloku „PROPOZYCJE GRAFIKI HERO".
 */

/* ------------------------------------------------------------------ */
/* A — KRĘGOSŁUP DIAGNOSTYCZNY                                         */
/* ------------------------------------------------------------------ */

const VERTEBRAE = 12;
/** Który krąg jest oznaczony jako bolesny — odcinek lędźwiowy. */
const ALERT_INDEX = 9;

const spine = Array.from({ length: VERTEBRAE }, (_, i) => {
  const t = i / (VERTEBRAE - 1);
  return {
    i,
    y: 128 + t * 258,
    dx: 13 * Math.sin(t * Math.PI * 1.9 - 0.55),
    w: 17 + 27 * Math.pow(t, 0.8),
    h: 8 + 8 * Math.pow(t, 0.7),
  };
});

/**
 * Sygnał schodzi kolejnymi kręgami z góry na dół, a jeden krąg w odcinku
 * lędźwiowym pulsuje na czerwono z rozchodzącą się poświatą.
 */
export function SpineScan() {
  const alert = spine[ALERT_INDEX];

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Schemat kręgosłupa: sygnał schodzi kolejnymi kręgami, jeden krąg w odcinku lędźwiowym pulsuje na czerwono"
      className="size-full"
    >
      <g transform="translate(0 10)">
        <g className="text-blue">
          <circle
            cx="200"
            cy="240"
            r="158"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="2"
          />
          <g
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M150 132 C 118 168, 112 214, 128 258 C 142 298, 138 340, 148 386" />
            <path d="M250 132 C 282 168, 288 214, 272 258 C 258 298, 262 340, 252 386" />
          </g>
        </g>

        {/* Poświata wokół bolesnego kręgu — pod spodem, żeby go nie zasłaniała. */}
        <circle
          className="alert-halo"
          cx={200 + alert.dx}
          cy={alert.y}
          r={alert.w * 0.8}
          fill="var(--color-alert)"
        />

        <g className="text-blue" fill="currentColor">
          {spine.map((v) =>
            v.i === ALERT_INDEX ? (
              <rect
                key={v.i}
                className="vert-alert"
                x={200 + v.dx - v.w / 2}
                y={v.y - v.h / 2}
                width={v.w}
                height={v.h}
                rx={v.h / 2}
                fill="var(--color-alert)"
              />
            ) : (
              <rect
                key={v.i}
                className="vert-scan"
                style={{ "--i": v.i } as CSSProperties}
                x={200 + v.dx - v.w / 2}
                y={v.y - v.h / 2}
                width={v.w}
                height={v.h}
                rx={v.h / 2}
              />
            )
          )}
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* B — ZAKRES RUCHU                                                    */
/* ------------------------------------------------------------------ */

/**
 * Staw z ramieniem odmierzającym zakres ruchu: ramię unosi się i opada,
 * a łuk kąta wypełnia się dokładnie w jego rytm — jak goniometr.
 */
export function RangeOfMotion() {
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Schemat pomiaru zakresu ruchu w stawie: ramię unosi się, a łuk kąta wypełnia się w jego rytm"
      className="size-full text-blue"
    >
      {/* Ramię spoczynkowe — nieruchoma podstawa pomiaru. */}
      <line
        x1="110"
        y1="347"
        x2="340"
        y2="347"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Ślad łuku i wypełniający się kąt. */}
      <path
        d="M265 347 A 155 155 0 0 0 182.8 210.1"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="rom-arc"
        d="M265 347 A 155 155 0 0 0 182.8 210.1"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Ramię ruchome. */}
      <g className="rom-arm">
        <line
          x1="110"
          y1="347"
          x2="340"
          y2="347"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="340" cy="347" r="9" fill="currentColor" />
      </g>

      {/* Oś obrotu. */}
      <circle cx="110" cy="347" r="14" fill="currentColor" />
      <circle cx="110" cy="347" r="5" fill="var(--color-paper)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* C — PION POSTAWY                                                    */
/* ------------------------------------------------------------------ */

/** Znaczniki punktów kostnych i ich odchylenie od pionu odniesienia. */
const LANDMARKS = [
  { label: "głowa", y: 128, w: 40, dx: -26 },
  { label: "barki", y: 196, w: 58, dx: 20 },
  { label: "miednica", y: 268, w: 52, dx: -30 },
  { label: "kolana", y: 340, w: 44, dx: 24 },
  { label: "stopy", y: 404, w: 38, dx: -12 },
];

/**
 * Pion odniesienia i punkty kostne, które zjeżdżają się do osi, a potem
 * wracają do odchylenia — skrót graficzny oceny i korekty postawy.
 */
export function PostureLine() {
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Schemat oceny postawy: punkty kostne ustawiają się do pionu odniesienia"
      className="size-full text-blue"
    >
      {/* Pion odniesienia. */}
      <line
        x1="200"
        y1="96"
        x2="200"
        y2="436"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeDasharray="6 9"
        strokeLinecap="round"
      />
      <circle cx="200" cy="96" r="4" fill="currentColor" fillOpacity="0.4" />
      <circle cx="200" cy="436" r="4" fill="currentColor" fillOpacity="0.4" />

      {LANDMARKS.map((m, i) => (
        <g
          key={m.label}
          className="posture-mark"
          style={{ "--i": i, "--dx": `${m.dx}px` } as CSSProperties}
        >
          <rect
            x={200 - m.w / 2}
            y={m.y - 4}
            width={m.w}
            height="8"
            rx="4"
            fill="currentColor"
            fillOpacity="0.55"
          />
          <circle cx="200" cy={m.y} r="4.5" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

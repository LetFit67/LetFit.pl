import type { CSSProperties } from "react";

/**
 * Minimalistyczna grafika do sekcji hero — zamiast zdjęcia.
 *
 * Motyw wzięty wprost z logo: kręgosłup wpisany w okrąg, obrysowany kilkoma
 * otwartymi kreskami sugerującymi plecy. Obrys jest celowo otwarty — zamknięta
 * sylwetka czytała się jak wazon, a nie jak ciało.
 *
 * Ruch jest dwojaki i powolny:
 *   • fala mobilizacji schodzi po kręgach z góry na dół (kolejne kręgi
 *     rozjaśniają się i minimalnie powiększają),
 *   • po okręgu przesuwa się łuk „zakresu ruchu”.
 *
 * WAŻNE dla odporności: każda klatka kluczowa zaczyna się i kończy w stanie
 * neutralnym, a łuk przebiega pełny obwód. Dzięki temu grafika zamrożona
 * w czasie zerowym — karta otwarta w tle, bot do zrzutów, `prefers-reduced-motion`
 * — wygląda jak skończona ilustracja, a nie jak kadr z połowy animacji.
 */

const VERTEBRAE = 12;

/**
 * Kręgi od szyjnych (wąskie) do lędźwiowych (najszersze), ustawione na
 * łagodnym „S” — lordoza szyjna, kifoza piersiowa, lordoza lędźwiowa.
 */
const vertebrae = Array.from({ length: VERTEBRAE }, (_, i) => {
  const t = i / (VERTEBRAE - 1);
  return {
    i,
    y: 128 + t * 258,
    dx: 13 * Math.sin(t * Math.PI * 1.9 - 0.55),
    w: 17 + 27 * Math.pow(t, 0.8),
    h: 8 + 8 * Math.pow(t, 0.7),
  };
});

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Schematyczny rysunek kręgosłupa wpisanego w okrąg — symbol pracy fizjoterapeutycznej"
      className="size-full text-blue"
    >
      {/* Przesunięcie wyśrodkowuje kompozycję w kadrze 4:5. */}
      <g transform="translate(0 10)">
        {/* Okrąg — ślad i przesuwający się po nim łuk zakresu ruchu. */}
        <circle
          cx="200"
          cy="240"
          r="158"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="2"
        />
        <circle
          className="rom-sweep"
          cx="200"
          cy="240"
          r="158"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Zarys pleców — statyczny, tylko sugestia sylwetki. */}
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.26"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M150 132 C 118 168, 112 214, 128 258 C 142 298, 138 340, 148 386" />
          <path d="M250 132 C 282 168, 288 214, 272 258 C 258 298, 262 340, 252 386" />
        </g>
        <g
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M168 178 C 154 208, 156 240, 168 268" />
          <path d="M232 178 C 246 208, 244 240, 232 268" />
        </g>

        {/* Kręgosłup — fala mobilizacji schodzi kolejnymi kręgami. */}
        <g fill="currentColor">
          {vertebrae.map((v) => (
            <rect
              key={v.i}
              className="vertebra"
              style={{ "--i": v.i } as CSSProperties}
              x={200 + v.dx - v.w / 2}
              y={v.y - v.h / 2}
              width={v.w}
              height={v.h}
              rx={v.h / 2}
            />
          ))}
        </g>
      </g>
    </svg>
  );
}

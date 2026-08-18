"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/**
 * PRZEBIEG WIZYTY JAKO MAPA.
 *
 * Etapy nie stoją w równej linii — każdy jest przesunięty w pionie o inną
 * wartość, a między nimi biegnie przerywana ścieżka, po której jedzie strzałka.
 * Kolejny etap odsłania się dopiero wtedy, gdy strzałka do niego dojedzie.
 *
 * Trzy rzeczy, na których to stoi:
 *
 * 1. ŚCIEŻKA JEST MIERZONA, NIE WPISANA. Po zamontowaniu komponent odczytuje
 *    faktyczne położenie kafli i z niego buduje krzywą. Dzięki temu ten sam kod
 *    obsługuje układ czterokolumnowy, dwukolumnowy i pionowy na telefonie —
 *    bez osobnych ścieżek na każdy przypadek i bez rozjeżdżania się przy
 *    zmianie długości tekstu.
 *
 * 2. POSTĘP LICZY SIĘ Z POŁOŻENIA STRONY, nie z upływu czasu. Przewinięcie
 *    w górę cofa strzałkę i zwija etapy, bo te same wejścia dają te same
 *    wyjścia. Nie ma animacji do „odegrania wstecz".
 *
 * 3. STANEM BAZOWYM JEST WSZYSTKO WIDOCZNE. Tryb animowany włącza dopiero
 *    skrypt, po udanym pomiarze. Gdy JavaScript nie wystartuje, oś czasu stoi
 *    (karta w tle, bot do zrzutów) albo użytkownik prosi o mniej ruchu —
 *    sekcja jest zwykłą, kompletną listą etapów.
 */

type Step = { title: string; body: string };

/** Przesunięcia w pionie — celowo nierówne, żeby rytm nie był mechaniczny. */
const OFFSETS = ["0rem", "3rem", "0.75rem", "3.75rem"];

/**
 * Kiedy rusza strzałka i jak długo jedzie, liczone w postępie przewijania
 * przez sekcję (0–1).
 *
 * Opóźniony start daje pierwszemu etapowi chwilę na spokojne wejście, a krótki
 * przedział sprawia, że cała trasa kończy się mniej więcej w połowie sekcji.
 * Wcześniej strzałka jechała przez całe przewijanie i ostatni etap odsłaniał
 * się dopiero tuż przed końcem — czytało się to jak zacięcie.
 */
const ARROW_START = 0.08;
const ARROW_SPAN = 0.56;

/**
 * Siła wygładzania ruchu strzałki (0–1): ile drogi do wartości docelowej
 * pokonuje ona w jednej klatce.
 *
 * Bez tego strzałka jest sztywno przypięta do pozycji przewijania i skacze
 * razem z kółkiem myszy — kółko przesuwa stronę porcjami, więc ruch wychodzi
 * poszarpany. Tutaj scroll ustawia tylko CEL, a strzałka dopływa do niego
 * własnym tempem, co daje ruch ciągły i lekko rozpędzony.
 */
const ARROW_EASING = 0.075;

/**
 * Gładka krzywa przez zadane punkty: Catmull-Rom przeliczony na krzywe
 * Béziera. Uchwyty każdego punktu biegną wzdłuż odcinka między jego sąsiadami,
 * dzięki czemu styczne po obu stronach punktu są równoległe i przejście
 * nie ma załamania.
 */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const prev = pts[i - 1] ?? pts[i];
    const cur = pts[i];
    const next = pts[i + 1];
    const after = pts[i + 2] ?? next;

    // Szóstka to standardowe napięcie Catmull-Rom — krzywa trzyma się punktów
    // blisko, nie robiąc pętli na ostrych zmianach kierunku.
    const c1x = cur[0] + (next[0] - prev[0]) / 6;
    const c1y = cur[1] + (next[1] - prev[1]) / 6;
    const c2x = next[0] - (after[0] - cur[0]) / 6;
    const c2y = next[1] - (after[1] - cur[1]) / 6;

    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${next[0].toFixed(1)} ${next[1].toFixed(1)}`;
  }

  return d;
}

type Geometry = {
  w: number;
  h: number;
  d: string;
  /** Położenie każdego etapu wzdłuż ścieżki, w zakresie 0–1. */
  anchors: number[];
};

export function ProcessMap({ steps }: { steps: Step[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  const [geo, setGeo] = useState<Geometry | null>(null);
  const [progress, setProgress] = useState(0);
  const [animated, setAnimated] = useState(false);

  /* ---------------------------------------------------------------- */
  /* POMIAR — ścieżka przez środki krawędzi kolejnych kafli            */
  /* ---------------------------------------------------------------- */

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const nodes = nodeRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!wrap || nodes.length < 2) return;

    const box = wrap.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;

    const rects = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return {
        left: r.left - box.left,
        right: r.right - box.left,
        top: r.top - box.top,
        bottom: r.bottom - box.top,
        cx: r.left - box.left + r.width / 2,
        cy: r.top - box.top + r.height / 2,
      };
    });

    /*
      Punkty, przez które ma przejść linia: środek każdego kafla, a między nimi
      punkt w przerwie, odchylony na przemian w górę i w dół. To te odchylenia
      robią falę — same środki kafli dałyby linię niemal prostą.
    */
    const points: [number, number][] = [];
    rects.forEach((r, i) => {
      points.push([r.cx, r.cy]);
      const next = rects[i + 1];
      if (!next) return;

      const horizontal = Math.abs(next.cx - r.cx) > Math.abs(next.cy - r.cy);
      const swing = (i % 2 === 0 ? 1 : -1) * 54;

      points.push(
        horizontal
          ? [(r.right + next.left) / 2, (r.cy + next.cy) / 2 + swing]
          : [(r.cx + next.cx) / 2 + swing, (r.bottom + next.top) / 2],
      );
    });

    /*
      Jedna gładka krzywa przez wszystkie punkty (Catmull-Rom przepisany na
      krzywe Béziera), a nie ciąg osobnych łuków. Poprzednia wersja liczyła
      każdy odcinek z osobna, przez co na styku dwóch odcinków styczne się nie
      zgadzały i linia łamała się ostrym skrętem. Tutaj uchwyt każdego punktu
      wyprowadzany jest z kierunku między jego sąsiadami, więc nachylenie jest
      ciągłe na całej długości — linia płynie jak wykres funkcji.

      Linia biegnie POD kaflami; widać ją tylko w przerwach, bo lista rysuje
      się nad warstwą SVG.
    */
    const d = smoothPath(points);

    /*
      Kotwice etapów wzdłuż ścieżki. Punkty idą naprzemiennie: kafel, przerwa,
      kafel… więc kafel o numerze `i` leży na pozycji `2i` z `2n-2`. Służy to
      wyłącznie do decyzji „strzałka już tu dojechała", więc podział po równo
      w zupełności wystarcza.
    */
    const last = points.length - 1;
    const anchors = rects.map((_, i) => (last > 0 ? (i * 2) / last : 0));

    setGeo({ w: box.width, h: box.height, d, anchors });
  }, []);

  /* ---------------------------------------------------------------- */
  /* POSTĘP — z pozycji przewijania                                    */
  /* ---------------------------------------------------------------- */

  /**
   * Cel, wartość bieżąca i uchwyt pętli.
   *
   * Bieżąca wartość MUSI mieszkać w refie, a nie tylko w stanie. Wcześniej
   * pętla czytała ją przez funkcję aktualizującą `setProgress` i w środku tej
   * funkcji planowała kolejną klatkę — czyli robiła efekt uboczny tam, gdzie
   * React nie gwarantuje ani jednego wywołania, ani jego momentu. Skutek był
   * taki, że pętla nie ruszała, postęp zostawał na zerze i wszystkie etapy
   * pozostawały ukryte.
   */
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(0);

  const update = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const vh = window.innerHeight;
    if (!vh || vh < 200) return;

    const r = wrap.getBoundingClientRect();
    /*
      Sekwencja rusza, gdy mapa wejdzie w dolną część ekranu, i kończy się,
      zanim wyjedzie górą. Zapas z obu stron sprawia, że ostatni etap zdąży
      się rozwinąć, nim sekcja zniknie z pola widzenia.
    */
    const start = vh * 0.82;
    const span = r.height + vh * 0.28;
    const p = (start - r.top) / span;
    targetRef.current = p < 0 ? 0 : p > 1 ? 1 : p;

    // Pętla dogania cel i sama się zatrzymuje, gdy różnica przestaje być widoczna.
    if (rafRef.current) return;

    const step = () => {
      const diff = targetRef.current - currentRef.current;

      if (Math.abs(diff) < 0.0004) {
        currentRef.current = targetRef.current;
        setProgress(currentRef.current);
        rafRef.current = 0;
        return;
      }

      currentRef.current += diff * ARROW_EASING;
      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    measure();
    update();

    /*
      W karcie otwartej w tle NIE włączamy trybu animowanego. Tam oś czasu
      dokumentu stoi, a strona bywa renderowana przez boty do zrzutów —
      mapa zostaje wtedy kompletną, statyczną listą etapów zamiast pokazać
      jeden przystanek i trzy puste miejsca. Po powrocie na wierzch tryb
      włącza się sam.
    */
    if (!document.hidden) setAnimated(true);
    const onVisible = () => {
      if (!document.hidden) {
        measure();
        update();
        setAnimated(true);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    const onScroll = () => update();
    const onResize = () => {
      measure();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Wysokości kafli zmieniają się, gdy podmieni się krój pisma.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) onResize();
    });

    const ro = new ResizeObserver(onResize);
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => {
      cancelled = true;
      /*
        Uchwyt MUSI wrócić do zera. React w trybie deweloperskim montuje
        komponent dwa razy (mount → unmount → mount); gdyby po sprzątaniu
        została tu stara, niezerowa wartość, strażnik `if (rafRef.current)`
        w `update` uznałby, że pętla już chodzi, i nigdy by jej nie wystartował.
        Postęp zostawał wtedy na zerze, a wszystkie etapy — ukryte.
      */
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [measure, update]);

  /* ---------------------------------------------------------------- */
  /* STRZAŁKA — punkt i kąt pobierane wprost ze ścieżki                */
  /* ---------------------------------------------------------------- */

  /*
    Postęp strzałki to nie wprost postęp przewijania: trasa rusza z opóźnieniem
    i kończy się w połowie sekcji, żeby ostatni etap zdążył się rozwinąć,
    zanim sekcja wyjedzie z ekranu.
  */
  /*
    Wersja surowa bywa ujemna — przed startem trasy. To celowe: dzięki temu
    PIERWSZY etap też ma swój próg i wchodzi dopiero, gdy trasa ruszy, zamiast
    być widoczny od chwili wjechania sekcji w ekran. Do rysowania używamy
    wersji przyciętej, bo ujemna długość ścieżki nie ma sensu.
  */
  const rawTravel = (progress - ARROW_START) / ARROW_SPAN;
  const travel = Math.min(1, Math.max(0, rawTravel));

  const path = pathRef.current;
  let arrow: { x: number; y: number; angle: number } | null = null;

  if (path && geo && animated && travel > 0.001) {
    const len = path.getTotalLength();
    const at = len * travel;
    const p1 = path.getPointAtLength(at);
    // Drugi punkt tuż za pierwszym daje styczną, czyli kąt obrotu grotu.
    const p2 = path.getPointAtLength(Math.min(len, at + 1.5));
    arrow = {
      x: p1.x,
      y: p1.y,
      angle: (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI,
    };
  }

  const active = (i: number) =>
    !animated || !geo || rawTravel >= (geo.anchors[i] ?? 0);

  return (
    <div ref={wrapRef} className="relative mt-14">
      {geo && animated && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          width={geo.w}
          height={geo.h}
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            {/*
              Maska odsłania ścieżkę do miejsca, w którym jest strzałka.
              Prostokąt wystarcza, bo ruch zawsze biegnie w prawo i w dół,
              a jego róg jedzie razem z grotem.
            */}
            <mask id="mapa-postep">
              <rect
                x="0"
                y="0"
                width={arrow ? arrow.x + 10 : 0}
                height={geo.h}
                fill="white"
              />
            </mask>
          </defs>

          {/* Ślad, który zostaje: przerywana linia narysowana za strzałką. */}
          <path
            ref={pathRef}
            d={geo.d}
            fill="none"
            stroke="var(--color-blue-bright)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="12 14"
            opacity="0.6"
            mask="url(#mapa-postep)"
          />

          {arrow && (
            <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
              <path
                d="M -13 -9 L 7 0 L -13 9 Z"
                fill="var(--color-blue-bright)"
              />
            </g>
          )}
        </svg>
      )}

      <ol
        className="relative grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
        data-map={animated ? "on" : undefined}
      >
        {steps.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            style={{ "--offset": OFFSETS[i % OFFSETS.length] } as CSSProperties}
            className="map-node"
            data-on={active(i) ? "true" : "false"}
          >
            <div className="rounded-card border border-paper/12 bg-ink/60 p-7 backdrop-blur-[2px]">
              <span
                aria-hidden="true"
                className="map-num block font-display text-4xl leading-none font-semibold tabular-nums text-blue-bright"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="map-title mt-5 text-lg font-semibold text-paper">
                {step.title}
              </h3>
              <p className="map-body mt-2.5 text-[15px] leading-relaxed text-paper/65">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Drugi wiersz nagłówka hero, podmieniany co dwie sekundy.
 *
 * Efekt jest ten sam co w komponencie „AI Text Loading" z kokonutui: wiersz
 * wychodzi w górę, następny wjeżdża z dołu, a po literach przesuwa się
 * połysk gradientu. Zrobiony jest jednak na czystym CSS zamiast na
 * `motion/react` — projekt ma cztery zależności i biblioteka animacji ważyłaby
 * tu więcej niż cała reszta strony razem wzięta. Klatki siedzą w `globals.css`
 * jako `hero-swap` i `hero-shimmer`.
 *
 * Kolejność jest losowa, ale nigdy nie wypada dwa razy z rzędu ten sam wariant:
 * losujemy spośród WSZYSTKICH POZOSTAŁYCH pozycji, a nie spośród wszystkich
 * z odrzucaniem trafienia w bieżącą. Dzięki temu nie ma pętli losowania
 * i każdy inny wariant ma równe szanse.
 *
 * Cztery rzeczy, na których stoi ten komponent:
 *
 * 1. Dostępność. Czytnik ekranu i wyszukiwarka dostają pierwszy wariant jako
 *    zwykły tekst, a karuzela jest dla nich niewidoczna. Bez tego nagłówek
 *    strony zmieniałby się pod czytnikiem co dwie sekundy.
 * 2. Zgodność serwera z przeglądarką. Pierwsze renderowanie zawsze pokazuje
 *    pozycję zerową — losowanie rusza dopiero po zamontowaniu, więc HTML
 *    z serwera i pierwszy render w przeglądarce są identyczne.
 * 3. Brak skoków układu. W tej samej komórce siatki leży niewidoczna rozpórka
 *    z najdłuższym wariantem, więc komórka ma stały rozmiar niezależnie od
 *    tego, co akurat wypadło. Podmiana nie rusza treści pod spodem.
 *    Rozpórka jest jedna, a nie po jednej na wariant — piętnastu ukrytych
 *    kopii w `h1` nie chcemy ani w kodzie, ani pod wyszukiwarką.
 * 4. Tekst nigdy nie znika. Stanem bazowym jest pełna widoczność, a animacja
 *    tylko do niej dochodzi — przy `prefers-reduced-motion` (gdzie arkusz
 *    skraca animacje do 0.01 ms) wiersz po prostu stoi i jest czytelny.
 */
export function HeroRotatingLine({
  phrases,
  intervalMs = 2000,
  className = "",
}: {
  phrases: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    // Kto prosi o mniej ruchu, dostaje pierwszy wariant i święty spokój.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((prev) => {
        // Losujemy z puli bez bieżącej pozycji: indeks od 0 do n-2, a potem
        // przesuwamy o jeden te, które wypadły na bieżącej lub za nią.
        const draw = Math.floor(Math.random() * (phrases.length - 1));
        return draw >= prev ? draw + 1 : draw;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [phrases.length, intervalMs]);

  if (phrases.length === 0) return null;

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <span className={`grid ${className}`}>
      <span className="sr-only">{phrases[0]}</span>

      {/* Rozpórka: najdłuższy wariant trzyma rozmiar komórki na stałe. */}
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {longest}
      </span>

      <span
        key={index}
        aria-hidden="true"
        className="hero-swap hero-shimmer col-start-1 row-start-1"
      >
        {phrases[index]}
      </span>
    </span>
  );
}

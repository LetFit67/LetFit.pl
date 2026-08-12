/**
 * TRYB PODGLĄDU.
 *
 * Włącza go zmienna środowiskowa `LETFIT_PREVIEW=1`. Służy do jednego:
 * strona wystawiona pod adresem tymczasowym (np. `letfit.vercel.app`) prosi
 * wyszukiwarki, żeby jej NIE indeksowały. Bez tego Google mógłby wciągnąć
 * podgląd do wyników i docelowa domena `letfit.pl` konkurowałaby z kopią
 * samej siebie — a Google w takiej parze sam wybiera, którą wersję pokazać.
 *
 * Zmienna jest odczytywana PODCZAS BUDOWANIA (strona jest w całości statyczna,
 * więc HTML powstaje raz, przy deployu). Zmiana wartości w panelu hostingu
 * nie działa wstecz — trzeba wypchnąć nowy deploy.
 *
 * Domyślnie wyłączone: brak zmiennej = strona normalna, indeksowana.
 * Przed uruchomieniem letfit.pl wystarczy skasować zmienną i przebudować.
 *
 * Nie dopisywać tego do `content/site.ts`: tamten plik trafia też do
 * komponentów klienckich, a zmienne bez przedrostka `NEXT_PUBLIC_` istnieją
 * wyłącznie po stronie serwera.
 */
export const isPreview = process.env.LETFIT_PREVIEW === "1";

# LETFIT — strona Mikołaja Letkiewicza

Strona marki osobistej fizjoterapeuty z Marek. One-pager po polsku i angielsku,
zbudowany w Next.js 16 i Tailwind CSS v4.

## Co gdzie leży

```
.
├─ site/     aplikacja Next.js — cała strona
├─ brand/    znak i materiały graficzne marki
└─ media/    materiały wideo, z których powstały klipy na stronie
```

### `site/`

| Ścieżka | Co tam jest |
| --- | --- |
| `src/content/site.ts` | **Fakty.** Telefon, adres, kwoty, ścieżki plików, przełączniki sekcji — wszystko, czego zmiana byłaby błędem w obu językach naraz. |
| `src/content/pl.ts` | **Polska treść.** Każde zdanie, które widać na stronie. Zwykle to jedyny plik, który trzeba ruszyć. |
| `src/content/en.ts` | **Angielska treść.** Ten sam kształt co `pl.ts`, wymuszony typem. |
| `src/lib/i18n.tsx` | Przełącznik języka: magazyn wyboru, provider i haki `useT`/`useLocale`. |
| `src/components/` | Komponenty sekcji: hero, usługi, cennik, formularz zgłoszenia, kontakt. |
| `src/app/` | Layout, style globalne, podstrony (`polityka-prywatnosci`, `animacje`) i ikony. |
| `scripts/` | Generatory plików logo z materiałów w `brand/`. |
| `public/` | Gotowe assety serwowane pod adresem: logo, zdjęcia, wideo. |

Miejsca oznaczone w treści jako `TODO(...)` wyświetlają na stronie widoczny
znacznik `[UZUPEŁNIJ]`. To celowe — strona nie pozwala o sobie zapomnieć,
dopóki nie ma prawdziwych danych. Znacznik zostaje po polsku również w wersji
angielskiej: to notatka dla prowadzącego stronę, nie treść dla pacjenta.

## Dwa języki

Strona jest po polsku i po angielsku, a przełącznik `PL | EN` stoi w nagłówku.
Kilka rzeczy warto wiedzieć, zanim się w to wejdzie:

- **Wybór działa w przeglądarce, nie w adresie.** Nie ma `letfit.pl/en`. Język
  siedzi w `localStorage`, a pierwsze wejście idzie za ustawieniem przeglądarki.
- **Google widzi wyłącznie wersję polską**, bo taką dostaje z serwera. Znaczy to
  też, że nie da się wysłać komuś odnośnika prosto do wersji angielskiej.
  Gdyby strona miała kiedyś ściągać obcojęzycznych pacjentów z wyszukiwarki,
  trzeba przejść na osobne ścieżki (`/en`) i renderować obie wersje na serwerze.
- **Brak tłumaczenia to błąd kompilacji.** `en.ts` jest typowany kształtem
  `pl.ts`, więc nowy klucz w polskim słowniku wywala `npm run build`, dopóki
  nie dopiszesz angielskiego odpowiednika.
- **Kwoty i godziny są w `site.ts`**, a słowniki dokładają do nich tylko walutę
  i opis. Podniesienie ceny to jedna zmiana, widoczna od razu w obu wersjach.
- **Opinie w wersji angielskiej są tłumaczeniem** i każda ma to napisane
  w podpisie. Cytat bez takiego oznaczenia sugerowałby, że pacjent wypowiedział
  się po angielsku.
- **Strona robocza `/animacje` została po polsku.** Nie jest podlinkowana,
  ma zakaz indeksowania i służy wyłącznie do wyboru grafiki.

### `brand/`

| Ścieżka | Co tam jest |
| --- | --- |
| `pictogram-2026/` | **Obowiązujący znak** — piktogram biegacza z błękitnym łukiem, komplet lockupów i sygnet z wyciętym tłem. |
| `archive/` | Poprzedni znak (kręgosłup w okręgu) i stare koncepty. Nieaktualne, trzymane dla historii. |

### `media/`

| Ścieżka | Co tam jest |
| --- | --- |
| `runner-source/` | Warianty klipu z biegaczem. Wybrany wariant siedzi w `site/public/video/`. |
| `generated-clips/` | Klipy generowane, z których żaden nie trafił na stronę. |

## Jak uruchomić

```bash
cd site
npm install
npm run dev
```

Strona wstaje na `http://localhost:3000`.

## Assety marki

Pliki logo w `site/public/brand/` oraz favikony w `site/src/app/` są
**generowane**, a nie rysowane ręcznie:

```bash
cd site
node scripts/build-brand-pictogram.mjs
```

Skrypt bierze materiały z `brand/pictogram-2026/`, wycina białe tło, przycina
kadr i składa: poziomy lockup do nagłówka, sam sygnet pod znak wodny oraz
favikony (biały znak na granatowej płycie — na przezroczystości znikał
w ciemnym pasku zakładek).

Starszy `scripts/build-brand.mjs` robi to samo dla wycofanego znaku
z `brand/archive/`. **Nadpisuje te same pliki**, więc nie uruchamiaj go,
dopóki oba znaki są w obiegu.

## Czego tu nie ma

- **Rezerwacji online.** Formularz w sekcji „Umów wizytę" składa wiadomość
  i przekazuje ją do klienta poczty — nie ma backendu i nic nie
  zapisuje się na serwerze. Kalendarzyk pokazuje grafik pracy, a nie wolne
  terminy.
- **Analityki i ciasteczek śledzących.** Jedyna treść zewnętrzna to osadzona
  mapa Google przy gabinecie w Markach.

---

Projekt i wykonanie: [NikPage](https://nikpage.pl)

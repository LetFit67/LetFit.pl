# LETFIT — strona Mikołaja Letkiewicza

Strona marki osobistej fizjoterapeuty z Marek. One-pager po polsku, zbudowany
w Next.js 16 i Tailwind CSS v4.

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
| `src/content/site.ts` | **Jedyne źródło treści.** Teksty, ceny, adresy, godziny — wszystko, co widać na stronie. Zwykle to jedyny plik, który trzeba ruszyć. |
| `src/components/` | Komponenty sekcji: hero, usługi, cennik, formularz zgłoszenia, kontakt. |
| `src/app/` | Layout, style globalne, podstrony (`polityka-prywatnosci`, `animacje`) i ikony. |
| `scripts/` | Generatory plików logo z materiałów w `brand/`. |
| `public/` | Gotowe assety serwowane pod adresem: logo, zdjęcia, wideo. |

Miejsca oznaczone w treści jako `TODO(...)` wyświetlają na stronie widoczny
znacznik `[UZUPEŁNIJ]`. To celowe — strona nie pozwala o sobie zapomnieć,
dopóki nie ma prawdziwych danych.

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
  i przekazuje ją do WhatsAppa albo klienta poczty — nie ma backendu i nic nie
  zapisuje się na serwerze. Kalendarzyk pokazuje grafik pracy, a nie wolne
  terminy.
- **Analityki i ciasteczek śledzących.** Jedyna treść zewnętrzna to osadzona
  mapa Google przy gabinecie w Markach.

---

Projekt i wykonanie: [NikPage](https://nikpage.pl)

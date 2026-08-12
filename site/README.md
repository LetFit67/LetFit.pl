# LETFIT — strona internetowa

One-pager marki osobistej **Mikołaj Letkiewicz — fizjoterapeuta**.
Next.js 16 (App Router) + Tailwind v4. Strona jest w całości statyczna — buduje się
do plików i nie potrzebuje serwera aplikacyjnego.

## Uruchomienie

```bash
npm install
npm run dev
```

Strona: http://localhost:3000

```bash
npm run build   # produkcyjny build + sprawdzenie typów
npm start       # podgląd builda
```

## Gdzie zmieniać treść

**Wszystko siedzi w jednym pliku: `src/content/site.ts`.** Komponentów nie trzeba
dotykać. Plik jest podzielony na sekcje odpowiadające sekcjom strony.

Wartości zapisane jako `TODO("…")` renderują się na stronie jako widoczny,
błękitny znacznik `[UZUPEŁNIJ: …]`. To celowe — dopóki na stronie widać
choć jeden taki znacznik, nie jest gotowa do publikacji.

### Skąd pochodzą dane

Opisy usług, adres gabinetu w Markach, wizyty domowe i odpowiedź „ile wizyt”
pochodzą bezpośrednio od Mikołaja i **mają pierwszeństwo**. Opis „o mnie”, adres
Kliniki Sosnowej i godziny w Wesołej pochodzą z profilu Booksy (staffer 718317).
Ceny z Booksy nie zostały potwierdzone dla Marek, więc cennik czeka na nowe stawki —
stare wartości zostały w komentarzach jako punkt odniesienia.

### Do uzupełnienia przed publikacją

| Gdzie w `site.ts` | Czego brakuje |
|---|---|
| `business.phoneDisplay` / `phoneE164` | telefon (E.164 zasila `tel:` i WhatsApp) |
| `business.email` | adres e-mail |
| `business.legal` | nazwa działalności i NIP (stopka + polityka prywatności) |
| `business.locations[0].hours` | godziny przyjęć w Markach |
| `business.locations[1].mapsEmbedUrl` | mapa dla Wesołej — Marki mają już swoją, puste ukrywa mapę |
| `booking.calLink` | identyfikator kalendarza Cal.com — patrz niżej |
| `pricing.groups` | wszystkie czasy i ceny |
| `about.credentials` | wykształcenie i kursy — pusta tablica ukrywa sekcję |
| `portfolio.items` | metamorfozy podopiecznych — pusta tablica ukrywa sekcję |
| `testimonials.items` | **prawdziwe** opinie pacjentów — pusta tablica ukrywa sekcję |
| `seo.siteUrl` | docelowa domena |

### Dwie lokalizacje

`business.locations` to tablica — Mikołaj przyjmuje w Markach i w Klinice Sosnowej
w Warszawie Wesołej. Każda lokalizacja ma własne godziny i własny kanał rezerwacji
(`bookingUrl`), żeby pacjent nie umówił się pod złym adresem. Pierwsza pozycja jest
traktowana jako gabinet główny — trafia do danych strukturalnych i do polityki
prywatności jako siedziba.

## Rezerwacja online (Cal.com)

Sekcja „Rezerwacja” renderuje się dopiero wtedy, gdy `booking.calLink` w `site.ts`
nie jest pusty. Dopóki jest pusty, na stronie nie ma kalendarza — lepiej żadnego
niż taki, który niczego nie rezerwuje.

### Konfiguracja krok po kroku

1. Załóż konto na [cal.com](https://cal.com) (plan darmowy wystarcza dla jednej osoby).
2. **Podłącz kalendarz** Mikołaja: *Settings → Calendars → Google Calendar*
   (lub Outlook). To jest ten mechanizm, który sprawia, że zajęte terminy znikają —
   Cal czyta zajętość i dopisuje nowe wizyty do tego samego kalendarza.
3. Ustaw dostępność: *Availability* — godziny, w których wolno umawiać wizyty
   w Markach.
4. Utwórz typy wydarzeń. **Czasy trwania różnią się między usługami**, a jeden typ
   wydarzenia ma jeden czas — dlatego zrób trzy, po jednym na grupę z cennika:

   | Typ wydarzenia | Czas | Obejmuje |
   |---|---|---|
   | Wizyta fizjoterapeutyczna | wg cennika | pierwsza, kolejna, domowa |
   | Ocena i korekta postawy | wg cennika | ocena postawy, wizyta korekcyjna |
   | Trening personalny | wg cennika | trening, kolejny trening, prowadzenie online |

   `calLink` to fragment adresu wydarzenia w formacie `użytkownik/nazwa-wydarzenia`.
   Podanie samej nazwy użytkownika (`letfit`) osadza stronę ze **wszystkimi** typami
   naraz — wygodne, gdy chcesz, żeby pacjent najpierw wybrał rodzaj wizyty.
5. W zakładce **Advanced → Booking questions** dodaj pola:

   | Pole | Typ w Cal.com | Wymagane |
   |---|---|---|
   | Imię i nazwisko | wbudowane `Your name` | tak |
   | E-mail | wbudowane `Email` | tak (nieusuwalne — służy do potwierdzenia) |
   | Numer telefonu | `Phone` | tak |
   | Rodzaj usługi | `Select` z listą pozycji z cennika | tak |
   | Dodatkowe informacje o dolegliwościach | `Long text` | **nie** |

   Pole z dolegliwościami musi zostać nieobowiązkowe — to dane o zdrowiu.

   Gotowa lista do wklejenia w pole `Select` „Rodzaj usługi” (zgodna z cennikiem):

   ```
   Pierwsza wizyta fizjoterapeutyczna
   Kolejna wizyta fizjoterapeutyczna
   Wizyta domowa
   Ocena postawy
   Wizyta korekcyjna
   Trening personalny
   Trening personalny — kolejny
   Prowadzenie online
   ```
6. Wklej `calLink` do `booking.calLink` w `site.ts`. Kalendarz pojawi się na stronie,
   a w nawigacji dojdzie pozycja „Rezerwacja”. Wszystkie przyciski CTA przełączą się
   z Booksy na kalendarz.

### RODO

Formularz zbiera dane o zdrowiu, więc Cal.com staje się podmiotem przetwarzającym.
Przed uruchomieniem podpisz z nimi umowę powierzenia (DPA — dostępna z poziomu
ustawień konta) i sprawdź, czy sekcja o rezerwacji w polityce prywatności zgadza się
ze stanem faktycznym. Polityka wykrywa `booking.calLink` i sama dopisuje akapit
o Cal.com, kiedy kalendarz jest włączony.

### Wymiana Cal.com na inny serwis

Cal.com jest tu osadzony jako `iframe`, więc nie ma między nim a stroną żadnej
warstwy danych do przepisania — strona nie pobiera terminów ani nie tworzy
rezerwacji. Podmiana dostawcy sprowadza się do **zastąpienia jednego komponentu**
`components/booking.tsx`; `page.tsx`, nawigacja i przyciski CTA zostają bez zmian,
bo sterują się polem `booking.calLink`.

Warstwa abstrakcji nad dostawcą ma sens dopiero wtedy, gdy zrezygnujemy z osadzania
i zaczniemy sami rysować kalendarz — wtedy potrzebne będą dwie operacje (pobierz
wolne terminy, utwórz rezerwację) i funkcje serwerowe. Do tego czasu byłaby to
pusta komplikacja.

### Booksy

Booksy zostaje jako kanał rezerwacji **wyłącznie dla Kliniki Sosnowej** — link siedzi
w `business.locations[1].bookingUrl`. Gdy `booking.calLink` jest ustawiony, główne CTA
prowadzą do kalendarza na stronie, a Booksy pojawia się tylko przy karcie tej
lokalizacji.

### Mapa dojazdu

Mapa renderuje się przy tej lokalizacji, która ma wypełnione `mapsEmbedUrl`.
Teraz jest to wyłącznie gabinet w Markach. Adres osadzenia korzysta z formy
`…/maps?q=…&output=embed`, która nie wymaga klucza do Maps Embed API i jest
czytelna do ręcznej edycji. Wskazuje adres, nie konkretny lokal — gdy znany
będzie dokładny punkt, najlepiej podmienić go na link z „Udostępnij → Umieść mapę”.

Mapa ładuje się leniwie (`loading="lazy"`), więc nie obciąża pierwszego
wyświetlenia. Uwaga RODO: jej wyświetlenie łączy przeglądarkę pacjenta
z serwerami Google — polityka prywatności ma na ten temat osobną sekcję.

### Zdjęcia

Zapisz plik jako `public/photos/mikolaj-portret.jpg` i wpisz tę ścieżkę
w `about.photo` (`"/photos/mikolaj-portret.jpg"`). Dopóki pole jest puste,
renderuje się ramka z instrukcją zamiast zdjęcia. Kadr pionowy 4:5, sensowny
rozmiar ok. 1200×1500 px.

Sekcja hero **nie używa zdjęcia** — jest tam rysunkowa animacja kręgosłupa
(`components/hero-figure.tsx`).

## Marka

Źródłem znaku jest `Logo concept/Logo faworyt 2.png`. Pliki na stronę generuje
skrypt — nie edytuj ich ręcznie, bo następny build je nadpisze:

```bash
node scripts/build-brand.mjs
```

| Plik | Co zawiera | Gdzie używany |
|---|---|---|
| `public/brand/letfit-horizontal.png` | sygnet + „LetFit Physio / Fizjoterapia" obok | nagłówek, stopka |
| `public/brand/letfit-emblem.png` | **sam sygnet, bez podpisu** | znak wodny w hero, małe formaty |
| `public/brand/letfit-full.png` | układ pionowy z pełnym podpisem | materiały, zapas |
| `src/app/icon.png` | favikona 512 px | automatycznie przez Next.js |
| `src/app/apple-icon.png` | ikona iOS 180 px na białej płycie | automatycznie przez Next.js |

**Favikona zawiera wyłącznie sygnet.** Podpis „LetFit Physio / FIZJOTERAPIA"
jest z niej celowo wycięty — w rozmiarze 32 px zlewa się w nieczytelną plamę.
Kadry są wyliczone z pikseli oryginału i opisane w nagłówku skryptu.

Paleta wyprowadzona z kolorów odczytanych z logo:

| Token | HEX | Rola |
|---|---|---|
| `ink` | `#0A1433` | granat: tekst, ciemne sekcje |
| `paper` | `#FBFCFE` | tło podstawowe, chłodna biel |
| `mist` | `#F1F5FB` | tło drugiego planu |
| `blue` | `#10428F` | akcent na jasnym tle |
| `blue-bright` | `#7FB0F2` | akcent na granacie |
| `blue-soft` | `#E3EBF7` | delikatne plamy i chipy |

**Ton wizualny jest gabinetowy, nie sportowy.** Nagłówki składane są szeryfem
(Source Serif 4), tekst bieżący Interem. Narożniki są ostre (`--radius-card`
0.375 rem), przyciski prostokątne, a błękit jest jedynym akcentem.

Znak jest granatowy na przezroczystym tle, więc działa tylko na jasnym podłożu.
Na ciemnych sekcjach (przebieg wizyty, kontakt) logo się nie pojawia — nie ma
wersji odwróconej.

### Animacja

Animowane są trzy miejsca — reszta strony jest statyczna.

**Hero.** Elementy wchodzą raz przy załadowaniu strony, z niewielkim opóźnieniem
między wierszami, sygnet w tle powoli „oddycha", a w miejscu zdjęcia pracuje
rysunek kręgosłupa (`components/hero-figure.tsx`): fala mobilizacji schodzi
kolejnymi kręgami, a po okręgu przesuwa się łuk zakresu ruchu. Klatki kluczowe
rysunku zaczynają się i kończą w stanie neutralnym, a łuk pokonuje pełny obwód —
zamrożony w czasie zerowym wygląda jak skończona ilustracja.

**Pas pod hero.** `components/hero-ribbon.tsx` — zapętlony klip z falującymi
liniami (`public/video/hero-wave.mp4`, 421 KB). Element jest dekoracyjny:
`aria-hidden`, bez dźwięku, z klatką `poster` na wypadek nieudanego wczytania,
zatrzymywany przy `prefers-reduced-motion: reduce`.

Klip pochodzi z generatora Higgsfield. Surowe wyjście miało ciepłe, zaszumione
tło, więc przeszło obróbkę: przycięcie do pasa z liniami, ochłodzenie kolorów
do palety strony i kompresję. Oryginały wszystkich generowanych klipów leżą
w `../Generowane klipy/` — **poza folderem strony**, żeby nic się przypadkiem
nie opublikowało.

**Przebieg wizyty.** Cztery etapy pojawiają się po kolei, gdy sekcja wejdzie
w kadr (`components/stagger.tsx`, opóźnienie 130 ms na krok). Animowana jest
zawartość kafla, a nie sam kafel — kafle tworzą siatkę `gap-px`, więc wygaszenie
`<li>` odsłoniłoby jasne tło spod spodu.

### Dlaczego animacje nie potrafią ukryć treści

Wszystkie efekty są zbudowane tak, żeby stanem domyślnym była pełna widoczność:

- hero animuje **wyłącznie transformację**, nigdy krycia,
- etapy wizyty ukrywa dopiero JavaScript, ustawiając `data-stagger="pending"` —
  bez skryptu żadna reguła ukrywająca nie ma na czym zadziałać,
- skrypt w ogóle się nie uzbraja, gdy karta jest niewidoczna w momencie startu
  (`document.visibilityState !== "visible"`) albo gdy użytkownik prosi
  o `prefers-reduced-motion: reduce`.

Powód jest konkretny: w karcie otwartej w tle oś czasu dokumentu stoi, a przejście
zamarza w stanie początkowym. Efekt startujący od `opacity: 0` zostawiłby wtedy
pustą sekcję — również na zrzutach robionych przez boty.

Wejście zbudowane jest na `@starting-style` i animuje **tylko transformację, nie
krycie**. To celowe: gdy strona otworzy się w karcie w tle albo renderuje ją bot do
zrzutów, oś czasu dokumentu stoi i przejście zamarza w stanie początkowym. Przy
animacji krycia dałoby to pusty hero; tutaj najgorszy skutek to treść przesunięta
o kilkanaście pikseli. `prefers-reduced-motion: reduce` wyłącza ruch całkowicie.

Stopka autorska („Strona stworzona przez NikPage”) jest w `credit` w `site.ts`.

## Struktura

```
src/
  app/
    layout.tsx                  fonty, metadane, OpenGraph
    page.tsx                    złożenie sekcji one-pagera
    globals.css                 tokeny marki + utilities
    icon.png, apple-icon.png    favikony (generowane skryptem)
    robots.ts, sitemap.ts       SEO
    polityka-prywatnosci/       podstrona RODO (wymaga weryfikacji prawnej)
  components/
    header.tsx                  nagłówek + menu mobilne (komponent kliencki)
    hero.tsx                    sekcja otwierająca + pasek współpracy ze sportowcami
    hero-figure.tsx             rysunek kręgosłupa (animacja zamiast zdjęcia)
    hero-ribbon.tsx             pas z falami pod hero (klip wideo)
    stagger.tsx                 wejście etapów wizyty po kolei
    sections.tsx                dla kogo, zakres opieki, przebieg, o mnie,
                                metamorfozy, cennik, opinie, FAQ
    booking.tsx                 kalendarz Cal.com (komponent kliencki)
    contact.tsx                 kontakt, lokalizacje, stopka, pasek CTA na mobile
    json-ld.tsx                 dane strukturalne (Physiotherapy + FAQPage)
    ui.tsx                      logo, przyciski, nagłówki sekcji, ikony
  content/
    site.ts                     ← TREŚĆ STRONY
```

Strona renderuje się na serwerze; klienckie są tylko nagłówek i kalendarz.

## Dane strukturalne

`json-ld.tsx` generuje schema.org `Physiotherapy` i `FAQPage`. Pola, które nadal
są placeholderami, są automatycznie pomijane — do Google nie trafi `[UZUPEŁNIJ]`.

## Polityka prywatności

`src/app/polityka-prywatnosci/page.tsx` zawiera szkielet oparty na typowych
obowiązkach gabinetu fizjoterapii. **To nie jest porada prawna.** Przejrzyj treść,
dopasuj do rzeczywistego sposobu przetwarzania danych i usuń błękitną ramkę
ostrzegawczą na górze.

## Publikacja

Strona jest statyczna, więc zadziała na Vercelu, Netlify i każdym hostingu Node.
Najprościej:

```bash
npx vercel
```

Przed publikacją: podmień `seo.siteUrl` na docelową domenę i sprawdź, czy na
stronie nie został żaden znacznik `[UZUPEŁNIJ]`.

**Uwaga przy imporcie repozytorium do Vercela: `Root Directory` musi wskazywać
na `site`.** Aplikacja siedzi w podkatalogu, w korzeniu repo leżą materiały marki.

### Podgląd przed startem (`LETFIT_PREVIEW`)

Strona wystawiona pod adresem tymczasowym (np. `letfit.vercel.app`) może trafić
do Google i konkurować z docelową domeną. Żeby do tego nie dopuścić, ustaw
w panelu hostingu zmienną:

```
LETFIT_PREVIEW=1
```

Wtedy `robots.txt` blokuje całą stronę, a każda podstrona dostaje w `<head>`
znacznik `noindex, nofollow`. Bez tej zmiennej strona zachowuje się normalnie —
jest indeksowana.

Wartość jest odczytywana **przy budowaniu** (strona jest statyczna), więc
zmiana w panelu działa dopiero po nowym deployu. Przed uruchomieniem letfit.pl
zmienną trzeba skasować i przebudować. Kod: `src/lib/preview.ts`.

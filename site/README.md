# LETFIT — strona internetowa

One-pager marki osobistej **Mikołaj Letkiewicz — fizjoterapeuta**, po polsku
i po angielsku. Next.js 16 (App Router) + Tailwind v4. Strona jest w całości
statyczna — buduje się do plików i nie potrzebuje serwera aplikacyjnego ani
bazy danych.

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

Treść siedzi w trzech plikach w `src/content/` i granica między nimi biegnie
w jednym miejscu:

| Plik | Co tam jest |
|---|---|
| `site.ts` | **Fakty.** Telefon, adres, kwoty, adresy odnośników, ścieżki plików, przełączniki sekcji. Wszystko, czego zmiana byłaby błędem w obu językach naraz. |
| `pl.ts` | **Polska treść.** Każde zdanie, które widać na stronie. Zwykle jedyny plik, który trzeba ruszyć. |
| `en.ts` | **Angielska treść.** Ten sam kształt co `pl.ts`. |

Reguła: jeżeli zmiana wartości byłaby błędem w obu językach naraz (inna cena,
inny numer telefonu), wartość należy do `site.ts`. Jeżeli to samo trzeba
powiedzieć innymi słowami — do słownika.

Komponentów nie trzeba dotykać. Każdy plik jest podzielony na sekcje
odpowiadające sekcjom strony.

### Kwoty są w jednym egzemplarzu

Ceny NIE są wpisane w cenniku, tylko w stałej `prices` w `site.ts`. Słowniki
dokładają do nich wyłącznie walutę i opis:

```ts
price: `${prices.firstVisit} zł`      // pl.ts
price: `${prices.firstVisit} PLN`     // en.ts
```

Podniesienie stawki to jedna zmiana w `site.ts`, widoczna od razu w obu
wersjach. Tak samo `officeHours` — godziny przyjęć mają ten sam zapis cyfrowy
w obu językach.

### Znacznik `[UZUPEŁNIJ]`

Wartości zapisane jako `TODO("…")` renderują się na stronie jako widoczny,
błękitny znacznik `[UZUPEŁNIJ: …]`. To celowe — dopóki na stronie widać choć
jeden taki znacznik, nie jest gotowa do publikacji.

Znacznik zostaje **po polsku również w wersji angielskiej**: to notatka dla
prowadzącego stronę, a nie treść dla pacjenta, i ma wyglądać tak samo
niezależnie od tego, w którym języku ktoś ją zobaczy.

### Co zostało do uzupełnienia

Dane kontaktowe, cennik, adres i opinie są już prawdziwe. Zostały trzy rzeczy:

| Gdzie | Czego brakuje |
|---|---|
| `privacy.recipientsTodo` w słownikach | konkretna lista odbiorców danych w polityce prywatności — jedyny `[UZUPEŁNIJ]`, który realnie widać na stronie |
| `bookingConfig.schedule` w `site.ts` | godziny 8:00–20:00 są punktem wyjścia, nie ustaleniem — **czekają na potwierdzenie od Mikołaja** |
| `public/brand/clubs/kadra-polski.png` | plik pochodzi ze stocka i ma wtopiony znak wodny „pngtree" — do podmiany przed publikacją |

Puste tablice ukrywają całe sekcje i tak ma zostać, dopóki nie ma czym ich
wypełnić: `about.credentials` (wykształcenie i kursy) oraz `portfolio.items`
(metamorfozy — potrzebna zgoda pacjenta na publikację wizerunku).

## Dwa języki

Przełącznik `PL | EN` stoi w nagłówku. Maszyneria siedzi w `src/lib/i18n.tsx`:
magazyn wyboru na `useSyncExternalStore`, `LocaleProvider` i haki `useT()`
oraz `useLocale()`.

**Wybór działa w przeglądarce, nie w adresie.** Nie ma `letfit.pl/en` — język
siedzi w `localStorage` pod kluczem `letfit-jezyk`, a pierwsze wejście idzie za
ustawieniem przeglądarki. Konsekwencje trzeba znać:

- Google indeksuje **wyłącznie wersję polską**, bo taką dostaje z serwera.
- Nie da się wysłać komuś odnośnika prosto do wersji angielskiej.
- `hreflang` nie ma czego wskazać.

Gdyby strona miała kiedyś ściągać obcojęzycznych pacjentów z wyszukiwarki,
trzeba przejść na osobne ścieżki (`/en`) i renderować obie wersje na serwerze.

**Brak tłumaczenia jest błędem kompilacji.** `en.ts` jest typowany kształtem
`pl.ts` (`export type Content = typeof pl`), więc nowy klucz w polskim słowniku
wywala `npm run build`, dopóki nie dopiszesz angielskiego odpowiednika. To
celowe: brakujące tłumaczenie ma być błędem builda, a nie pustym miejscem
odkrytym przez pacjenta.

### Granice klienta

Przełącznik podmienia treść bez przeładowania, więc każdy komponent z tekstem
musi umieć się przerysować — czyli musi być po stronie klienta. Dyrektywa
`"use client"` stoi w dwóch miejscach: `components/site-shell.tsx` (strona
główna) i `components/privacy-shell.tsx` (polityka prywatności). Wciągają one
w pakiet kliencki wszystko, co importują, więc nie trzeba jej powtarzać
w każdej sekcji.

Poza tą granicą zostają dwie rzeczy, obie **zawsze po polsku**:

- `components/json-ld.tsx` — dane strukturalne,
- metadane z `app/layout.tsx` — tytuł i opis w `<head>`.

Robot i tak dostaje z serwera wyłącznie wersję polską, więc opisywanie mu
treści, której nie widzi, byłoby wpisem o nieistniejącej stronie. Sam tytuł
zakładki podmienia po hydratacji `LocaleProvider` — szczegóły i pułapka z tym
związana są opisane w komentarzu w `i18n.tsx`.

### Opinie po angielsku są tłumaczeniem

Każdy angielski cytat ma to napisane w podpisie („translated from Polish").
Bez tego czytelnik brałby te zdania za oryginalne słowa pacjenta. Wzorem jest
sama wizytówka Google, która tak oznacza opinię przełożoną z francuskiego.

## Zgłoszenie wizyty

Sekcja „Rezerwacja” to **własny formularz zgłoszenia**
(`components/booking-form.tsx`), nie system rezerwacji. Cal.com został
porzucony — wymagał konta, synchronizacji kalendarza i konfiguracji pytań,
a Mikołaj wolał prostsze rozwiązanie.

**Czym to NIE jest.** Strona nie zna kalendarza Mikołaja, więc kalendarzyk
w formularzu pokazuje **grafik pracy**, a nie wolne terminy. Wybrany termin
jest prośbą pacjenta, którą Mikołaj potwierdza osobiście. Cała treść na stronie
mówi to wprost i tak ma zostać — inaczej ktoś przyjdzie przekonany, że ma
rezerwację.

Wygaszone są dni spoza grafiku, dni z przeszłości, dni za horyzontem zapisów
oraz te, w których nie został już ani jeden termin z zachowaniem wyprzedzenia.
Ta ostatnia reguła jest istotna: bez niej dzisiejszy dzień o 21:00 dalej byłby
klikalny, a lista godzin pod nim byłaby pusta.

### Konfiguracja

Wszystko siedzi w `bookingConfig` w `site.ts`:

| Pole | Znaczenie |
|---|---|
| `enabled` | wyłącznik całej sekcji — `false` chowa formularz i przestawia przyciski CTA na telefon |
| `schedule.workdays` | dni pracy wg `Date.getDay()`, dziś `[1,2,3,4,5,6]` (pn–sob) |
| `schedule.from` / `to` | pierwsza i ostatnia godzina, na którą można się zapisać |
| `schedule.stepMinutes` | co ile minut proponujemy termin |
| `schedule.horizonDays` | jak daleko w przód wolno wybierać dzień |
| `schedule.leadTimeHours` | ile godzin przed wizytą zgłoszenie przestaje mieć sens |

Teksty formularza — nagłówek, etykiety pól, komunikaty błędów i szkielet
gotowej wiadomości — leżą w słownikach pod kluczem `booking`.

### Wysyłka idzie e-mailem i tylko e-mailem

Backendu nie ma, więc formularz niczego nie wysyła sam: składa gotową
wiadomość i otwiera klienta poczty pacjenta (`business.email`). Pacjent wysyła
ją ze swojej skrzynki, więc Mikołaj od razu ma kontakt zwrotny. Pusty
`business.email` wyłącza wysyłkę i mówi o tym wprost, zamiast udawać, że
zgłoszenie gdzieś poleciało.

Wiadomość idzie **w języku, w którym pacjent czytał stronę**. Zgłoszenie po
angielsku jest sygnałem samym w sobie: mówi Mikołajowi, w jakim języku
oddzwonić.

Wybrana usługa trzymana jest w stanie jako **indeks** pozycji cennika, a nie
jej nazwa. Po zmianie języka nazwa przestałaby pasować do listy, `<select>`
świeciłby pustką, a walidacja i tak by to przepuściła.

Pod formularzem stoi druga droga: „Lub — zadzwoń i umów się już teraz”
z przyciskiem na numer. Blok znika sam, gdy w `site.ts` nie ma telefonu.

## Lokalizacja i mapa

`business.locations` jest tablicą, ale ma dziś **jedną pozycję** — gabinet
w Markach przy ul. Kościuszki 59. Klinika Sosnowa w Warszawie Wesołej
i rezerwacja przez Booksy zostały usunięte w sierpniu 2026 (decyzja Mikołaja).
Zostają gabinet w Markach oraz wizyty domowe, a terminy idą wyłącznie przez
formularz.

`business.booksyUrl` jest **celowo puste**. Wszystkie przyciski i odnośniki do
Booksy są warunkowe, więc puste pole wystarcza, żeby zniknęły z nagłówka, hero,
sekcji zgłoszenia i kontaktu. Wpisanie tu adresu przywróci je.

Każda lokalizacja ma `id`, pod którym słowniki trzymają jej nazwę, etykietę,
podpowiedź i godziny przyjęć. Pierwsza pozycja jest traktowana jako gabinet
główny — trafia do danych strukturalnych i do polityki prywatności jako
siedziba.

Mapa renderuje się przy tej lokalizacji, która ma wypełnione `mapsEmbedUrl`.
Adres osadzenia korzysta z formy `…/maps?q=…&output=embed`, która nie wymaga
klucza do Maps Embed API i jest czytelna do ręcznej edycji. Wskazuje adres,
a nie konkretny lokal — gdy znany będzie dokładny punkt, najlepiej podmienić
go na link z „Udostępnij → Umieść mapę”.

Mapa ładuje się leniwie (`loading="lazy"`), więc nie obciąża pierwszego
wyświetlenia. Uwaga RODO: jej wyświetlenie łączy przeglądarkę pacjenta
z serwerami Google — polityka prywatności ma na ten temat osobną sekcję,
a przycisk „Nawiguj” otwiera mapę dopiero po kliknięciu.

## Zdjęcia

Ścieżki zdjęć leżą w `photos` w `site.ts`. Portret to
`public/photos/mikolaj-portret.jpg`, kadr pionowy 3:4 (ok. 1200×1600 px).
Dopóki pole jest puste, renderuje się ramka z instrukcją zamiast zdjęcia.

Sekcja hero **nie używa zdjęcia** — jest tam klip z biegaczem
(`components/hero-runner.tsx`, `public/video/hero-runner.mp4` z klatką
`hero-runner.jpg` jako poster).

## Marka

Obowiązujący znak to piktogram biegacza z błękitnym łukiem. Pliki na stronę
generuje skrypt z materiałów w `../brand/pictogram-2026/` — nie edytuj ich
ręcznie, bo następne uruchomienie je nadpisze:

```bash
node scripts/build-brand-pictogram.mjs
```

| Plik | Co zawiera | Gdzie używany |
|---|---|---|
| `public/brand/letfit-horizontal.png` | poziomy lockup: sygnet + napis „LetFit" | nagłówek, stopka |
| `public/brand/letfit-mark.png` | **sam sygnet, bez podpisu** | znak wodny w hero |
| `src/app/icon.png` | favikona: biały znak na granatowej płycie | automatycznie przez Next.js |
| `src/app/apple-icon.png` | ikona iOS bez zaokrąglenia (iOS przycina róg sam) | automatycznie przez Next.js |

**Favikona musi mieć granatową płytę z białym znakiem**, nie sam sygnet na
przezroczystości — granat na granacie znikał w ciemnym pasku zakładek
przeglądarki.

**Logo idzie przez `unoptimized`.** Przez `/_next/image?url=…` potrafiło się
w ogóle nie pojawić w nagłówku, mimo poprawnego pliku i statusu 200: adres
z parametrem `url=` bywa blokowany przez rozszerzenia przeglądarki i zapisywany
w cache osobno od samego pliku. Dlatego pliki w `public/brand` dostają własną
kompresję paletową w skrypcie i nie polegają na optymalizatorze.

Znak jest granatowy na przezroczystym tle, więc działa tylko na jasnym
podłożu. Na ciemnych sekcjach (przebieg wizyty, kontakt) logo się nie pojawia —
nie ma wersji odwróconej.

### Paleta i typografia

| Token | HEX | Rola |
|---|---|---|
| `ink` | `#0A1433` | granat: tekst, ciemne sekcje |
| `paper` | `#FBFCFE` | tło podstawowe, chłodna biel |
| `mist` | `#F1F5FB` | tło drugiego planu |
| `blue` | `#10428F` | akcent na jasnym tle |
| `blue-bright` | `#7FB0F2` | akcent na granacie |
| `blue-soft` | `#E3EBF7` | delikatne plamy i chipy |

**Ton wizualny jest gabinetowy, nie sportowy.** Nagłówki składane są szeryfem
(Source Serif 4), tekst bieżący Interem. Kafle i karty mają ostre narożniki
(`--radius-card` 0.375 rem), a błękit jest jedynym akcentem.

Wyjątkiem są **przyciski: pigułki** (`rounded-full`). To jedyne miejsce, gdzie
odchodzimy od ostrych narożników — przycisk jest wezwaniem do działania i ma
się odróżniać od kafli, które zostają kanciaste.

### Szerszy pasek nagłówka

Nagłówek ma własny kontener `container-header` (88 rem) zamiast wspólnego
`container-x` (76 rem). Świadome odstępstwo od siatki: przy 76 rem logo, siedem
pozycji menu, telefon, przycisk i przełącznik języka mieściły się z zapasem
26 px i wyglądały na wciśnięte. Cena: logo nie stoi w jednej pionowej linii
z tekstem sekcji poniżej.

Pasek z pozycjami pojawia się dopiero od `xl` (1280 px); niżej nawigacja idzie
do menu pod hamburgerem. To jest zmierzone, nie dobrane na oko — przy pełnych
odstępach cały rząd potrzebuje 1180 px po polsku i 1190 px po angielsku.
**Każda nowa pozycja menu wymaga sprawdzenia szerokości w obu językach.**

## Animacja

**Hero.** Elementy wchodzą raz przy załadowaniu strony, z niewielkim
opóźnieniem między wierszami (`hero-in`). Drugi wiersz nagłówka podmienia się
co dwie sekundy (`components/hero-rotating-line.tsx`) — pierwsza pozycja
rotacji jest wyjątkowa: to ona trafia do wyszukiwarek i czytników ekranu,
reszta jest wyłącznie efektem wizualnym. Znak wodny powoli „oddycha"
(`hero-breathe`), a w tle po prawej stronie leży klip z biegaczem.

**Pasek współpracy.** Nazwy klubów jadą w kółko (`marquee-track`, 8 kopii
listy). Pasek siedzi w kontenerze strony, a nie na całej szerokości okna: na
ekranie 2560 px rozciągnięty pokazywał 2,5 kopii naraz i te same trzy nazwy
stały obok siebie.

**Kafle „Dla kogo".** Przechył pod kursorem i poświata za nim, na własnych
zdarzeniach myszy i zmiennych CSS. Po najechaniu na jeden pozostałe przygasają —
pacjent szuka tu swojego objawu.

**Przebieg wizyty.** Etapy jako mapa: zygzak, przerywana ścieżka i strzałka,
która odsłania kolejne przystanki wraz z przewijaniem
(`components/process-map.tsx`).

**Opinie.** Poziomy pas przeciągany myszą, z wybiegiem po puszczeniu
(`components/testimonials-rail.tsx`). Pas jest **zapętlony w obie strony**:
lista renderuje się trzykrotnie, pas startuje na początku środkowej kopii,
a skrypt przesuwa `scrollLeft` o szerokość jednej kopii, gdy pacjent wyjedzie
poza jej zakres. Treść w miejscu skoku jest identyczna, więc skoku nie widać.
Kopie 2 i 3 są `aria-hidden` — czytnik ekranu ma przeczytać siedem opinii,
a nie dwadzieścia jeden.

### Dlaczego animacje nie potrafią ukryć treści

Wszystkie efekty są zbudowane tak, żeby stanem domyślnym była pełna widoczność:

- hero animuje **wyłącznie transformację**, nigdy krycia,
- karty opinii ukrywa dopiero JavaScript, ustawiając `data-rail="pending"` —
  bez skryptu żadna reguła ukrywająca nie ma na czym zadziałać,
- skrypt w ogóle się nie uzbraja, gdy karta jest niewidoczna w momencie startu
  (`document.hidden`) albo gdy użytkownik prosi o `prefers-reduced-motion:
  reduce`.

Powód jest konkretny: w karcie otwartej w tle oś czasu dokumentu stoi,
a przejście zamarza w stanie początkowym. Efekt startujący od `opacity: 0`
zostawiłby wtedy pustą sekcję — również na zrzutach robionych przez boty.

## Struktura

```
src/
  app/
    layout.tsx                  fonty, metadane, OpenGraph (zawsze po polsku)
    page.tsx                    dane strukturalne + granica klienta
    globals.css                 tokeny marki + utilities + animacje
    icon.png, apple-icon.png    favikony (generowane skryptem)
    robots.ts, sitemap.ts       SEO
    polityka-prywatnosci/       podstrona RODO (wymaga weryfikacji prawnej)
    animacje/                   strona robocza, noindex, niepodlinkowana
  components/
    site-shell.tsx              granica "use client" + złożenie sekcji
    privacy-shell.tsx           to samo dla polityki prywatności
    language-switcher.tsx       pigułka PL | EN
    header.tsx                  nagłówek + menu mobilne
    hero.tsx                    sekcja otwierająca + pasek współpracy
    hero-runner.tsx             klip z biegaczem (warstwa tła)
    hero-rotating-line.tsx      podmieniany drugi wiersz nagłówka
    for-whom.tsx                kafle "Dla kogo" z przechyłem
    sections.tsx                dla kogo, zakres opieki, sprzęt, przebieg,
                                o mnie, metamorfozy, cennik, opinie, FAQ
    process-map.tsx             mapa etapów wizyty
    testimonials-rail.tsx       zapętlony pas opinii
    hover-reveal.tsx            rozwijanie <details> po najechaniu
    booking.tsx                 sekcja zgłoszenia
    booking-form.tsx            formularz + kalendarzyk grafiku
    contact.tsx                 kontakt, lokalizacja, stopka, pasek CTA mobile
    author-card.tsx             podpis wykonawcy w stopce
    json-ld.tsx                 dane strukturalne (zawsze po polsku, serwer)
    ui.tsx                      logo, przyciski, nagłówki sekcji, ikony
  content/
    site.ts                     ← FAKTY (telefon, adres, kwoty, przełączniki)
    pl.ts                       ← POLSKA TREŚĆ
    en.ts                       ← ANGIELSKA TREŚĆ
  lib/
    i18n.tsx                    przełącznik języka: magazyn, provider, haki
    preview.ts                  tryb podglądu (LETFIT_PREVIEW)
```

Na serwerze renderują się tylko dane strukturalne i metadane — reszta strony
jest kliencka, bo musi się przerysować po zmianie języka. Nie ma tu danych do
pobrania ani sekretów do ukrycia, a cały JavaScript strony to i tak animacje,
formularz i menu.

## Dane strukturalne

`json-ld.tsx` generuje schema.org `Physiotherapy` i `FAQPage`, **zawsze po
polsku i zawsze na serwerze**. Pola, które są placeholderami, są automatycznie
pomijane — do Google nie trafi `[UZUPEŁNIJ]`.

Zakres cen liczy się z cennika, więc nie trzeba go utrzymywać osobno.

## Polityka prywatności

`src/app/polityka-prywatnosci/page.tsx` renderuje `PrivacyShell` z treścią ze
słowników. Wersja angielska jest tłumaczeniem tego samego dokumentu, nie osobną
polityką — podstawy prawne (RODO, przepisy o dokumentacji medycznej) są
identyczne.

**To nie jest porada prawna.** Przejrzyj treść, dopasuj do rzeczywistego
sposobu przetwarzania danych i usuń błękitną ramkę ostrzegawczą na górze
(pole `privacy.draftNotice` — puste ukrywa ramkę).

Podstrona ma `robots: { index: false, follow: true }` i jest wyłączona
w `robots.txt`.

## Publikacja

Strona jest statyczna, więc zadziała na Vercelu, Netlify i każdym hostingu
Node. Najprościej:

```bash
npx vercel
```

Przed publikacją: podmień `siteUrl` w `site.ts` na docelową domenę i sprawdź,
czy na stronie nie został żaden znacznik `[UZUPEŁNIJ]`.

**Uwaga przy imporcie repozytorium do Vercela: `Root Directory` musi wskazywać
na `site`.** Aplikacja siedzi w podkatalogu, w korzeniu repo leżą materiały
marki.

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

## Czego nie ruszać i co jest martwe

Rzeczy, które leżą w repozytorium, ale nie są częścią działającej strony:

| Co | Dlaczego zostaje |
|---|---|
| `scripts/build-brand.mjs` | generator **wycofanego** znaku (kręgosłup w okręgu). **Nie uruchamiaj go** — nadpisuje `letfit-horizontal.png`, `icon.png` i `apple-icon.png` obowiązującego znaku. |
| `public/brand/letfit-emblem.png`, `letfit-full.png` | pliki starego znaku, nic ich już nie używa |
| `components/hero-figure.tsx`, `hero-animations.tsx` | odrzucone propozycje grafiki do hero; `hero-animations` zasila jeszcze roboczą stronę `/animacje` |
| `components/stagger.tsx` | wejście etapów wizyty po kolei — zastąpione przez `process-map.tsx`, nikt tego nie importuje |
| `public/v2.html`, `v3.html` | statyczne propozycje wyglądu, poza aplikacją Next.js |
| `@calcom/embed-react` w `package.json` | pozostałość po porzuconym Cal.com, nic tego nie importuje |

Strona `/animacje` jest robocza: niepodlinkowana z nawigacji, z zakazem
indeksowania i **celowo tylko po polsku** — służy do wyboru grafiki, nie
pacjentom.

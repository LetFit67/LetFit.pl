/**
 * FAKTY O GABINECIE — dane, które NIE zależą od języka.
 *
 * Telefon, adres, kwoty, adresy odnośników, ścieżki do plików i przełączniki
 * sekcji siedzą tutaj i istnieją w jednym egzemplarzu. Wszystko, co jest
 * zdaniem do przeczytania, leży w słownikach językowych:
 * `src/content/pl.ts` i `src/content/en.ts`.
 *
 * Granica biegnie w jednym miejscu: jeżeli zmiana wartości byłaby BŁĘDEM
 * w obu językach naraz (inna cena, inny numer telefonu), wartość należy tutaj.
 * Jeżeli to samo trzeba powiedzieć innymi słowami, należy do słownika.
 *
 * Miejsca oznaczone stałą TODO() to twarde fakty, których nie dało się ustalić —
 * podmień je na prawdziwe wartości. Dopóki tego nie zrobisz, na stronie
 * wyświetli się widoczny znacznik [UZUPEŁNIJ], żebyś nie wypuścił jej z lukami.
 *
 * Wszystkie treści pochodzą bezpośrednio od Mikołaja.
 *
 * W sierpniu 2026 ze strony zniknęły: lokalizacja w Klinice Sosnowej
 * (Warszawa Wesoła) i rezerwacja przez Booksy. Zostaje gabinet w Markach
 * oraz wizyty domowe, a terminy idą wyłącznie przez formularz zgłoszenia.
 */

export const TODO = (co: string) => `[UZUPEŁNIJ: ${co}]`;

export const isTodo = (v: string) => v.startsWith("[UZUPEŁNIJ");

/* ------------------------------------------------------------------ */
/* DANE KONTAKTOWE I FIRMOWE                                           */
/* ------------------------------------------------------------------ */

export type Location = {
  /** Klucz, pod którym słownik trzyma nazwę, etykietę, podpowiedź i godziny. */
  id: string;
  street: string;
  city: string;
  postalCode: string;
  mapsUrl: string;
  /** Puste = mapa się nie renderuje. Wklej adres z „Udostępnij → Umieść mapę”. */
  mapsEmbedUrl: string;
  /** Rezerwacja dotycząca akurat tej lokalizacji, jeśli idzie osobnym kanałem. */
  bookingUrl: string;
};

export const business: {
  brand: string;
  person: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  booksyUrl: string;
  social: { instagram: string; facebook: string; tiktok: string };
  locations: Location[];
  legal: { companyName: string; nip: string };
} = {
  brand: "LETFIT",
  person: "Mikołaj Letkiewicz",

  phoneDisplay: "794 420 328",
  /** Format E.164 — zasila linki tel:. */
  phoneE164: "+48794420328",

  email: "mikolaj.letkiewicz@gmail.com",

  /**
   * PUSTE ŚWIADOMIE — Booksy zostało wycofane ze strony (decyzja Mikołaja,
   * sierpień 2026) razem z lokalizacją w Klinice Sosnowej. Wszystkie przyciski
   * i odnośniki do Booksy są warunkowe, więc puste pole wystarcza, żeby zniknęły
   * z nagłówka, hero, rezerwacji i kontaktu. Wpisanie tu adresu przywróci je.
   */
  booksyUrl: "",

  social: {
    instagram: "https://www.instagram.com/_letfit_/",
    facebook: "",
    tiktok: "",
  },

  /**
   * Kolejność w tablicy = kolejność na stronie. Nazwa własna, etykieta,
   * podpowiedź i godziny przyjęć leżą w słownikach pod kluczem `id`.
   */
  locations: [
    {
      id: "marki",
      street: "ul. Kościuszki 59",
      city: "Marki",
      postalCode: "05-270", // ogólny kod dla Marek — warto zweryfikować
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Ko%C5%9Bciuszki+59+05-270+Marki",
      /**
       * Osadzenie przez `output=embed` — nie wymaga klucza do Maps Embed API.
       * Mapa wskazuje adres, a nie konkretny lokal; gdy poznamy dokładną
       * pinezkę, najlepiej podmienić na link z „Udostępnij → Umieść mapę”.
       */
      mapsEmbedUrl:
        "https://www.google.com/maps?q=Ko%C5%9Bciuszki%2059%2C%2005-270%20Marki&z=16&output=embed",
      bookingUrl: "",
    },
    /*
      Klinika Sosnowa (Warszawa Wesoła) została usunięta w sierpniu 2026 —
      decyzja Mikołaja. Razem z nią zniknął jedyny kanał rezerwacji przez
      Booksy. Zostaje gabinet w Markach i wizyty domowe.
    */
  ],

  legal: {
    companyName: "Mikołaj Letkiewicz LetFit Physio",
    nip: "1251796178",
  },
};

/** Godziny przyjęć. Zapis cyfrowy jest ten sam w obu wersjach językowych. */
export const officeHours = "08:00 – 20:00";

export const telLink = business.phoneE164 && `tel:${business.phoneE164}`;

/* ------------------------------------------------------------------ */
/* KWOTY                                                               */
/* ------------------------------------------------------------------ */

/**
 * Stawki podane przez Mikołaja 11.08.2026 (wiadomość na Messengerze) —
 * zastąpiły ceny z Booksy, które dotyczyły wyłącznie Kliniki Sosnowej.
 *
 * Liczby stoją tutaj, a nie w cenniku, ŻEBY NIE DAŁO SIĘ ICH ROZJECHAĆ:
 * słowniki językowe dokładają do nich tylko walutę i opis. Podniesienie ceny
 * to jedna zmiana w tym pliku, widoczna od razu w obu wersjach.
 */
export const prices = {
  firstVisit: 220,
  followUp: 200,
  homeVisit: 200,
  postureCheck: 150,
  personalTraining: 200,
  onlineCoaching: 200,
} as const;

/* ------------------------------------------------------------------ */
/* ZDJĘCIA                                                             */
/* ------------------------------------------------------------------ */

export const photos = {
  /** Zdjęcie portretowe, kadr 3:4 (1200×1600). Puste = zastępnik. */
  portrait: "/photos/mikolaj-portret.jpg",
};

/* ------------------------------------------------------------------ */
/* STOPKA AUTORSKA                                                     */
/* ------------------------------------------------------------------ */

/**
 * Kafelek studia w components/author-card.tsx — część niezależna od języka.
 * Podpis roli i etykiety wierszy leżą w słownikach.
 */
export const credit = {
  label: "NikPage",
  url: "https://nikpage.pl",
  /**
   * Logo pobrane z `nikpage.pl/assets/logo.png` (11.08.2026). Jest białe
   * na przezroczystym tle, więc działa wyłącznie na ciemnym kafelku — nie
   * przenoś go na jasne podłoże bez podmiany pliku.
   */
  avatar: "/brand/nikpage-logo.png",
  /** Zapas, gdyby `avatar` był pusty — kafelek pokaże wtedy literę. */
  monogram: "N",
  domain: "nikpage.pl",
  year: "2026",
  stack: "Next.js",
  ctaUrl: "https://nikpage.pl",
};

/* ------------------------------------------------------------------ */
/* FORMULARZ ZGŁOSZENIA WIZYTY                                         */
/* ------------------------------------------------------------------ */

/**
 * Formularz zgłoszenia zamiast osadzonego kalendarza rezerwacji.
 *
 * WAŻNE — czym to NIE jest: to nie jest system rezerwacji. Strona nie zna
 * kalendarza Mikołaja, więc kalendarzyk w formularzu pokazuje dni i godziny,
 * w których Mikołaj W OGÓLE pracuje, a nie te, które są akurat wolne. Wybrany
 * termin jest prośbą pacjenta, którą Mikołaj potwierdza. Cała treść na stronie
 * musi to mówić wprost, żeby nikt nie przyszedł przekonany, że ma rezerwację.
 *
 * Zgłoszenie nie leci na serwer — nie ma backendu. Formularz składa gotową
 * wiadomość i otwiera klienta poczty (`business.email`). Dopóki adres nie jest
 * wypełniony, formularz pokazuje się, ale wysyłka jest wyłączona z widoczną
 * informacją.
 *
 * Teksty formularza (nagłówek, etykiety pól, komunikaty błędów, szkielet
 * wiadomości) leżą w słownikach językowych pod kluczem `booking`.
 */
export const bookingConfig = {
  /**
   * Wyłącznik całej sekcji. `false` chowa formularz i przestawia przyciski
   * na stronie z „Umów wizytę" na telefon albo Booksy — tak jak działo się to
   * wcześniej, gdy nie było wpisanego kalendarza rezerwacji.
   */
  enabled: true,

  /**
   * Grafik, z którego kalendarzyk buduje dostępne dni i godziny.
   *
   * Soboty są przyjmowane, godziny 8:00–20:00 potwierdzone przez Mikołaja
   * (sierpień 2026). To ustalenie, nie punkt wyjścia.
   */
  schedule: {
    /** Dni pracy wg `Date.getDay()`: 1 = poniedziałek … 6 = sobota. */
    workdays: [1, 2, 3, 4, 5, 6],
    /** Pierwsza i ostatnia godzina, na którą można się zapisać. */
    from: "08:00",
    to: "20:00",
    /** Co ile minut proponujemy termin. */
    stepMinutes: 30,
    /** Jak daleko w przód wolno wybierać dzień. */
    horizonDays: 60,
    /** Ile godzin przed wizytą zgłoszenie przestaje mieć sens. */
    leadTimeHours: 2,
  },
};

/* ------------------------------------------------------------------ */
/* WSPÓŁPRACA ZE SPORTOWCAMI                                           */
/* ------------------------------------------------------------------ */

/**
 * Pasek przewijający się w kółko pod hero — warstwa graficzna.
 *
 * `logo` jest OPCJONALNE i wskazuje plik w `/public/brand/clubs/`. Dopóki go nie
 * ma, w pasku jedzie sama nazwa klubu — nic się nie psuje, a pasek nadal działa.
 * Po wrzuceniu pliku wystarczy dopisać ścieżkę tutaj.
 *
 * Logotypy klubów są cudzym znakiem towarowym. Wrzucaj wyłącznie takie, na które
 * masz zgodę — pobrane z profilu klubu „bo są publiczne" to za mało.
 *
 * Format: PNG lub SVG z przezroczystym tłem, wysokość co najmniej 120 px.
 * Znaczki idą w kolorze, z lekko obniżonym kryciem, które wraca do pełnego
 * po najechaniu na pasek. Przezroczystość ma znaczenie: logo na białym
 * prostokącie będzie widać jako łatę na tle znaczka.
 *
 * Nazwy leżą w słownikach pod kluczem `id`: dwie pierwsze pozycje to nazwy
 * własne klubów i brzmią tak samo w obu językach, trzecia jest opisem.
 */
export const collaborationLogos: {
  id: string;
  /** Plik w `/public/brand/clubs/`. Puste = pokazujemy zastępnik z inicjałami. */
  logo?: string;
  /** Herby są okrągłe, znaki na kwadratowym tle lepiej wyglądają w kwadracie. */
  shape?: "circle" | "rounded";
  /** Zastępnik, dopóki nie ma pliku — NIE podrabiamy cudzego znaku. */
  initials: string;
}[] = [
  {
    id: "markowi-biegacze",
    shape: "rounded",
    initials: "MB",
    logo: "/brand/clubs/markowi-biegacze.png",
  },
  {
    id: "sparta-marki",
    shape: "circle",
    initials: "SM",
    logo: "/brand/clubs/sparta-marki.jpg",
  },
  {
    id: "kadra-polski",
    shape: "circle",
    initials: "PL",
    /* Flaga narysowana od zera (SVG), nie wzięta ze stocka — poprzedni plik
       miał wtopiony znak wodny „pngtree", widoczny na stronie. Flaga
       państwowa nie jest niczyim znakiem, więc nie ma czego licencjonować. */
    logo: "/brand/clubs/kadra-polski.svg",
  },
];

/* ------------------------------------------------------------------ */
/* NAWIGACJA                                                           */
/* ------------------------------------------------------------------ */

/** Kotwice sekcji. Etykiety leżą w słownikach pod kluczem `id`. */
export const navItems = [
  { id: "forWhom", href: "#dla-kogo" },
  /* Sprzęt CELOWO nie ma pozycji w menu. Po dodaniu numeru telefonu pasek
     nawigacji był już pełny i ósma pozycja łamała go na dwa wiersze.
     Sekcja leży tuż pod „Zakresem opieki”, więc trafia się na nią sama. */
  { id: "services", href: "#uslugi" },
  { id: "process", href: "#wizyta" },
  { id: "about", href: "#o-mnie" },
  { id: "pricing", href: "#cennik" },
  { id: "contact", href: "#kontakt" },
] as const;

/** Pozycja dodawana do nawigacji tylko wtedy, gdy formularz jest włączony. */
export const bookingNavItem = { id: "booking", href: "#rezerwacja" } as const;

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

/** Docelowy adres strony — potrzebny do metadanych i sitemap. */
export const siteUrl = "https://letfit.pl";

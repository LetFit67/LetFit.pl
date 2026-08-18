/**
 * JEDYNE ŹRÓDŁO PRAWDY DLA TREŚCI STRONY.
 *
 * Wszystko, co widać na stronie, siedzi tutaj. Nie trzeba dotykać komponentów.
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
  /** Nazwa własna gabinetu — puste, jeśli to po prostu adres. */
  name: string;
  street: string;
  city: string;
  postalCode: string;
  /** Krótka etykieta, np. „gabinet główny”. */
  badge: string;
  hint: string;
  hours: { day: string; value: string }[];
  mapsUrl: string;
  /** Puste = mapa się nie renderuje. Wklej adres z „Udostępnij → Umieść mapę”. */
  mapsEmbedUrl: string;
  /** Rezerwacja dotycząca akurat tej lokalizacji, jeśli idzie osobnym kanałem. */
  bookingUrl: string;
  bookingLabel: string;
};

export const business: {
  brand: string;
  person: string;
  role: string;
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  booksyUrl: string;
  social: { instagram: string; facebook: string; tiktok: string };
  locations: Location[];
  homeVisits: { label: string; detail: string };
  legal: { companyName: string; nip: string };
} = {
  brand: "LETFIT",
  person: "Mikołaj Letkiewicz",
  role: "Fizjoterapeuta",

  phoneDisplay: "794 420 328",
  /** Format E.164 — zasila linki tel: i WhatsApp. */
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
   * Mikołaj przyjmuje w dwóch miejscach. Kolejność w tablicy = kolejność na stronie.
   * Każda lokalizacja ma własny kanał rezerwacji, żeby pacjent nie zarezerwował
   * terminu pod złym adresem.
   */
  locations: [
    {
      name: "",
      badge: "Gabinet główny",
      street: "ul. Kościuszki 59",
      city: "Marki",
      postalCode: "05-270", // ogólny kod dla Marek — warto zweryfikować
      hint: "Przyjmuję po wcześniejszym umówieniu terminu.",
      hours: [{ day: "Poniedziałek – sobota", value: "08:00 – 20:00" }],
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
      bookingLabel: "",
    },
    /*
      Klinika Sosnowa (Warszawa Wesoła) została usunięta w sierpniu 2026 —
      decyzja Mikołaja. Razem z nią zniknął jedyny kanał rezerwacji przez
      Booksy. Zostaje gabinet w Markach i wizyty domowe.
    */
  ],

  /** Wizyty domowe — drugie miejsce, w którym Mikołaj przyjmuje. */
  homeVisits: {
    label: "Wizyty domowe",
    detail:
      "Dojeżdżam do pacjenta, jeśli dotarcie do gabinetu jest utrudnione: " +
      "po zabiegu, przy ograniczonej samodzielności albo w opiece nad bliskim.",
  },

  legal: {
    companyName: "Mikołaj Letkiewicz LetFit Physio",
    nip: "1251796178",
  },
};

export const waLink =
  business.phoneE164 && `https://wa.me/${business.phoneE164.replace(/\D/g, "")}`;

export const telLink = business.phoneE164 && `tel:${business.phoneE164}`;

/**
 * Stopka autorska — kafelek studia w components/author-card.tsx.
 *
 * `items` to rozwijana lista: `href` zamienia wiersz w link, jego brak zostawia
 * zwykłą parę etykieta–wartość. `icon` wskazuje piktogram z mapy w komponencie.
 * Pusty `cta.href` chowa przycisk na dole listy.
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
  role: "Projekt i wykonanie strony",
  domain: "nikpage.pl",
  items: [
    {
      icon: "link",
      label: "Strona studia",
      value: "nikpage.pl",
      href: "https://nikpage.pl",
    },
    { icon: "calendar", label: "Realizacja", value: "2026", href: "" },
    { icon: "code", label: "Technologia", value: "Next.js", href: "" },
  ],
  cta: { label: "Zamów podobną stronę", href: "https://nikpage.pl" },
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
 * wiadomość i otwiera WhatsAppa (`business.phoneE164`) albo klienta poczty
 * (`business.email`). Dopóki żadne z tych pól nie jest wypełnione, formularz
 * pokazuje się, ale wysyłka jest wyłączona z widoczną informacją.
 */
export const booking = {
  /**
   * Wyłącznik całej sekcji. `false` chowa formularz i przestawia przyciski
   * na stronie z „Umów wizytę" na telefon albo Booksy — tak jak działo się to
   * wcześniej, gdy nie było wpisanego kalendarza rezerwacji.
   */
  enabled: true,

  eyebrow: "Zgłoszenie",
  heading: "Umów wizytę",
  lead:
    "Wypełnij zgłoszenie, a odezwę się z potwierdzeniem terminu. Kalendarz poniżej " +
    "pokazuje dni i godziny, w których przyjmuję. Wybrany termin potwierdzam " +
    "osobiście, bo część godzin może być już zajęta.",
  /**
   * Informacja pod formularzem. Pacjent wpisuje dane o dolegliwościach,
   * więc musi wiedzieć, gdzie one trafiają.
   */
  privacyNote:
    "Zgłoszenie wysyłasz bezpośrednio do mnie, WhatsAppem albo e-mailem, " +
    "z twojego telefonu lub skrzynki. Strona niczego nie zapisuje ani nie wysyła " +
    "w tle. Dane służą wyłącznie do umówienia i przeprowadzenia wizyty. " +
    "Szczegóły w polityce prywatności.",
  /** Lokalizacja, której dotyczy formularz — żeby nie było wątpliwości. */
  locationNote:
    "Formularz dotyczy gabinetu w Markach przy ul. Kościuszki 59 oraz wizyt domowych.",
  /**
   * Przycisk obok notki powyżej. Sama notka odsyłała pacjenta do Booksy
   * słownie, ale nie było w co kliknąć — najbliższy odnośnik leżał dopiero
   * w sekcji kontaktu, na końcu strony.
   *
   * Puste = przycisk się nie renderuje. Znika też sam, gdy `business.booksyUrl`
   * jest pusty.
   */
  /* Puste — nie ma już dokąd odsyłać po wycofaniu Booksy. */
  booksyLabel: "",

  /**
   * Grafik, z którego kalendarzyk buduje dostępne dni i godziny.
   *
   * Soboty są przyjmowane (decyzja Mikołaja, sierpień 2026).
   * GODZINY 8:00–20:00 NADAL DO POTWIERDZENIA — to punkt wyjścia, nie ustalenie.
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

  labels: {
    firstName: "Imię",
    lastName: "Nazwisko",
    complaint: "Krótki opis dolegliwości",
    complaintHint: "Co boli, od kiedy i co to pogarsza. Wystarczą dwa zdania.",
    service: "Usługa",
    servicePlaceholder: "Wybierz usługę",
    date: "Data",
    time: "Godzina",
    submitWhatsApp: "Wyślij przez WhatsApp",
    submitEmail: "Wyślij e-mailem",
    missingChannel: TODO("telefon lub e-mail, bez nich nie ma czym wysłać zgłoszenia"),
  },
};

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Fizjoterapia ortopedyczna i sportowa · Marki",
  heading: "Wróć do ruchu,\nktórego ci brakuje",
  headingAccent: "ruchu",
  /**
   * Drugi wiersz nagłówka podmienia się co dwie sekundy, w kolejności losowej,
   * ale nigdy dwa razy z rzędu na tym samym wariancie.
   *
   * Pierwsza pozycja jest wyjątkowa: to ona pokazuje się przy wejściu na stronę
   * i to ona trafia do wyszukiwarek oraz czytników ekranu. Reszta jest wyłącznie
   * efektem wizualnym, więc kolejność pozostałych nie ma znaczenia.
   *
   * Każdy wariant musi domykać zdanie zaczynające się od „Wróć do ruchu,”
   * i mieścić się w JEDNYM wierszu na telefonie. Granicy nie da się podać
   * w znakach — przy 390 px na tekst zostaje 350 px, a to mierzy się w pikselach:
   * „którego ci brakuje” ma 18 znaków i 344 px (mieści się), a „w pełnym
   * zakresie” 17 znaków i 353 px (już nie). Nowy wariant trzeba zmierzyć,
   * a nie policzyć. Dwa wiersze rozpychają nagłówek i psują rytm sekcji.
   * Pusta tablica = drugi wiersz stoi w miejscu.
   */
  headingRotation: [
    "którego ci brakuje",
    "w pełnej skali",
    "bez ograniczeń",
    "bez asekuracji",
    "który cię nie boli",
    "bez bólu rano",
    "wróć do siebie",
    "wróć do zdrowia",
    "wróć do formy",
    "bądź znów sobą",
    "który cię napędza",
    "który cię niesie",
    "który daje radość",
  ],
  lead:
    "Prowadzę terapię, która nie kończy się na chwilowej uldze. Szukamy przyczyny bólu, " +
    "usprawniamy to, co ją napędza, i budujemy ciało, które nie wraca do tego samego problemu.",
  bullets: [
    "Wizyta 1:1 w gabinecie w Markach lub u ciebie w domu",
    "Terapia manualna połączona z pracą ruchem",
    "Konkretny plan na to, co robisz między wizytami",
  ],
  // Zamiast zdjęcia hero ma rysunkową animację kręgosłupa —
  // components/hero-figure.tsx. Nie ma tu nic do uzupełnienia.
};

/* ------------------------------------------------------------------ */
/* DLA KOGO                                                            */
/* ------------------------------------------------------------------ */

/**
 * `icon` wskazuje piktogram z mapy `FOR_WHOM_ICONS` (components/for-whom.tsx).
 * Nazwa spoza tej mapy zostawia kafel bez ikony — nic się nie psuje.
 */
export const forWhom = {
  eyebrow: "Dla kogo",
  heading: "Jeśli któryś z tych punktów brzmi znajomo, jesteś we właściwym miejscu",
  items: [
    {
      icon: "spine",
      title: "Przewlekły ból pleców i szyi",
      body:
        "Odpuszcza na kilka dni po masażu albo tabletce, po czym odzywa się " +
        "dokładnie tak samo. Wraca, bo nie ruszyliśmy przyczyny.",
    },
    {
      icon: "radiating",
      title: "Dyskopatia i promieniowanie",
      body:
        "Ból schodzący do ręki lub nogi, drętwienie, mrowienie. Trzeba to zbadać " +
        "i rozpisać plan na kilka tygodni.",
    },
    {
      icon: "sport",
      title: "Uraz sportowy",
      body:
        "Chcesz wrócić do treningu i mieć pewność, że staw wytrzyma obciążenie. " +
        "Samo ustąpienie bólu ci nie wystarczy.",
    },
    {
      icon: "recovery",
      title: "Po operacji lub kontuzji",
      body:
        "Zdjęto gips, skończył się szpitalny protokół i zostajesz sam z pytaniem, " +
        "co dalej i jak szybko można obciążać.",
    },
    {
      icon: "desk",
      title: "Praca przy biurku",
      body:
        "Napięty kark, drętwiejące ręce, sztywność między łopatkami po ośmiu godzinach " +
        "przed monitorem.",
    },
    {
      icon: "posture",
      title: "Wada postawy",
      body:
        "U ciebie albo u dziecka. Warto wiedzieć, co da się skorygować ruchem, " +
        "a co wymaga konsultacji lekarskiej.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* USŁUGI                                                              */
/* ------------------------------------------------------------------ */

export const services = {
  eyebrow: "Zakres opieki",
  heading: "Cztery obszary, w których pracuję",
  lead:
    "Każda wizyta zaczyna się od badania. To z niego wynika, jakich narzędzi użyjemy.",
  items: [
    {
      slug: "ortopedyczna",
      title: "Fizjoterapia ortopedyczna",
      summary:
        "Bóle kręgosłupa i stawów, dyskopatie, przeciążenia oraz rehabilitacja " +
        "po urazach i zabiegach operacyjnych.",
      points: [
        "Przewlekłe bóle pleców i szyi",
        "Dyskopatia i dolegliwości promieniujące do kończyn",
        "Terapia manualna: mobilizacje stawowe i praca na tkankach",
        "Stopniowe przywracanie zakresu ruchu i siły",
        "Plan ćwiczeń dopasowany do twojego dnia",
      ],
    },
    {
      slug: "sportowa",
      title: "Fizjoterapia sportowa",
      summary:
        "Przegląd techniczny dla ciała sportowca i powrót do startów po tym, " +
        "co już się wydarzyło.",
      points: [
        "Ocena deficytów zakresu ruchu limitujących twoje możliwości sportowe",
        "Ocena wzorców ruchu w twojej dyscyplinie",
        "Rehabilitacja po urazach sportowych i przeciążeniowych",
        "Przygotowanie ciała przed startem",
      ],
    },
    {
      slug: "postawa",
      title: "Ocena i korekta wad postawy",
      summary:
        "Sprawdzamy, co dzieje się z twoją sylwetką pod obciążeniem i co da się " +
        "z tym zrobić ruchem.",
      points: [
        "Badanie ustawienia miednicy, kręgosłupa i obręczy barkowej",
        "Ocena, które wzorce są nawykiem, a które ograniczeniem strukturalnym",
        "Praca nad wzorcem oddechowym i kontrolą tułowia",
        "Zestaw ćwiczeń korekcyjnych do domu i kontrola postępów",
        "Dla dorosłych i dla dzieci",
      ],
    },
    {
      slug: "trening",
      title: "Trening personalny i prowadzenie online",
      summary:
        "Trening prowadzony przez fizjoterapeutę, który wie, co twoje tkanki " +
        "faktycznie wytrzymają.",
      points: [
        "Plan oparty na badaniu, nie na gotowym schemacie z internetu",
        "Nauka techniki i bezpiecznego obciążania",
        "Prowadzenie online: stały kontakt na WhatsAppie",
        "Kontrola diety i realna weryfikacja postępów",
      ],
    },
  ],
  /**
   * Wyróżnienie usługi prowadzonej zdalnie — rozwinięcie karty „trening".
   * Puste `title` = blok się nie renderuje.
   */
  online: {
    title: "Jak wygląda współpraca online",
    lead:
      "Nie musisz mieszkać w Markach, żeby pracować pod moją opieką. Prowadzenie " +
      "zdalne opieram na tych samych zasadach co pracę w gabinecie. Zmienia się " +
      "tylko to, że kontakt przenosi się na telefon.",
    points: [
      {
        title: "Stały kontakt na WhatsAppie",
        body:
          "Piszesz, kiedy masz wątpliwość, zamiast czekać tydzień na kolejną wizytę. " +
          "Nagrywasz serię, ja oceniam technikę i koryguję.",
      },
      {
        title: "Kontrola tego, co jesz",
        body:
          "Bez wysiłku po stronie kuchni trening nie dowiezie efektu. Pilnujemy tego " +
          "razem, na konkretnych posiłkach i liczbach.",
      },
      {
        title: "Plan aktualizowany na bieżąco",
        body:
          "Progresja obciążeń idzie za tym, co faktycznie wykonujesz na treningu.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* SPRZĘT W GABINECIE                                                  */
/* ------------------------------------------------------------------ */

/**
 * Wyposażenie gabinetu, podane przez Mikołaja (17.08.2026).
 *
 * Lista jest opisowa, nie sprzedażowa: pacjent ma zobaczyć, czym dysponuje
 * gabinet, a nie dostać obietnicę, że każde urządzenie zostanie u niego użyte.
 * O doborze decyduje badanie — mówi o tym zdanie w `note`.
 *
 * Nazwy zapisane tak, jak podał je Mikołaj. Puste `items` chowa całą sekcję.
 */
export const equipment = {
  eyebrow: "Wyposażenie",
  heading: "Sprzęt, który mam na miejscu",
  lead:
    "Fizykoterapia jest dodatkiem do terapii manualnej i pracy ruchem, nie zamiast nich. " +
    "To, czy i czego użyjemy, wychodzi z badania.",
  items: [
    "Elektroterapia",
    "Ultradźwięki",
    "Pole magnetyczne",
    "Laser wysokoenergetyczny",
    "Fala uderzeniowa",
    "Tecar",
    "Diatermia",
    "USG",
    "Elektrostymulator mięśniowy",
    "Aparat do elektrolizy",
    "Aparat do stymulacji śródmięśniowej",
  ],
};

/* ------------------------------------------------------------------ */
/* WSPÓŁPRACA ZE SPORTOWCAMI                                           */
/* ------------------------------------------------------------------ */

/**
 * Pasek przewijający się w kółko pod hero.
 *
 * `logo` jest OPCJONALNE i wskazuje plik w `/public/brand/clubs/`. Dopóki go nie
 * ma, w pasku jedzie sama nazwa klubu — nic się nie psuje, a pasek nadal działa.
 * Po wrzuceniu pliku wystarczy dopisać ścieżkę tutaj.
 *
 * Logotypy klubów są cudzym znakiem towarowym. Wrzucaj wyłącznie takie, na które
 * masz zgodę — pobrane z profilu klubu „bo są publiczne" to za mało.
 *
 * Format: PNG lub SVG z przezroczystym tłem, wysokość co najmniej 120 px.
 * Pasek i tak sprowadza je do skali szarości i wtapia w tło, więc kolor pliku
 * nie ma znaczenia, ale przezroczystość ma — logo na białym prostokącie
 * będzie widać jako łatę.
 */
export const collaborations: {
  lead: string;
  items: {
    name: string;
    /** Plik w `/public/brand/clubs/`. Puste = pokazujemy zastępnik z inicjałami. */
    logo?: string;
    /** Herby są okrągłe, znaki na kwadratowym tle lepiej wyglądają w kwadracie. */
    shape?: "circle" | "rounded";
    /** Zastępnik, dopóki nie ma pliku — NIE podrabiamy cudzego znaku. */
    initials: string;
  }[];
} = {
  lead: "Pracuję z zawodnikami",
  items: [
    {
      name: "KS Markowi Biegacze",
      shape: "rounded",
      initials: "MB",
      logo: "/brand/clubs/markowi-biegacze.png",
    },
    {
      name: "MKS Sparta Marki",
      shape: "circle",
      initials: "SM",
      logo: "/brand/clubs/sparta-marki.jpg",
    },
    {
      name: "Reprezentanci kadry narodowej",
      shape: "circle",
      initials: "PL",
      /* UWAGA: plik pochodzi ze stocka i ma wtopiony znak wodny „pngtree".
         Widać go na stronie i jest to cudzy znak — do podmiany na czystą
         grafikę flagi, zanim strona pójdzie na produkcję. */
      logo: "/brand/clubs/kadra-polski.png",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* PRZEBIEG WIZYTY                                                     */
/* ------------------------------------------------------------------ */

export const process = {
  eyebrow: "Przebieg wizyty",
  heading: "Wiesz, czego się spodziewać",
  steps: [
    {
      title: "Rozmowa",
      body:
        "Pytam o historię dolegliwości, twoją aktywność, pracę i to, co już próbowałeś. " +
        "Bez tego badanie jest tylko zgadywaniem.",
    },
    {
      title: "Badanie",
      body:
        "Oglądam, jak się poruszasz, i testuję konkretne struktury. Na koniec wiesz, " +
        "co jest źródłem problemu i dlaczego akurat to.",
    },
    {
      title: "Terapia",
      body:
        "Praca manualna, ruch albo jedno i drugie, zależnie od tego, co wyszło z badania. " +
        "Sprawdzamy efekt jeszcze na miejscu.",
    },
    {
      title: "Plan",
      body:
        "Wychodzisz z zestawem ćwiczeń i jasną informacją, co robić, czego unikać " +
        "i kiedy widzimy się ponownie.",
    },
  ],
  note:
    "Pierwsza wizyta trwa dłużej niż kolejne. Większość tego czasu zajmuje badanie i rozmowa.",
};

/* ------------------------------------------------------------------ */
/* O MNIE                                                              */
/* ------------------------------------------------------------------ */

export const about = {
  eyebrow: "O mnie",
  heading: "Mikołaj Letkiewicz",
  /** Pierwszy akapit to oryginalny opis z Booksy, słowo w słowo. */
  paragraphs: [
    "Jestem dyplomowanym fizjoterapeutą z doświadczeniem zdobytym zarówno w Polsce, " +
      "jak i w Kanadzie. Specjalizuję się w terapii ortopedycznej i sportowej, wspierając " +
      "zarówno osoby zmagające się z bólem czy kontuzjami, jak i tych, którzy chcą zadbać " +
      "o profilaktykę i sprawność swojego ciała.",
    "Pracuję jeden na jeden i nie prowadzę dwóch osób naraz. Wizyta to rozmowa, badanie " +
      "i terapia, a nie sam zabieg. Chcę, żebyś wychodził wiedząc, co się dzieje z twoim " +
      "ciałem i co możesz z tym zrobić sam.",
  ],
  /** Puste = sekcja z wykształceniem i kursami się nie pokaże. */
  credentials: [] as { title: string; detail?: string }[],
  // credentials: [
  //   { title: "Magister fizjoterapii", detail: "nazwa uczelni, rok" },
  //   { title: "Terapia manualna wg …", detail: "rok" },
  // ],

  /** Zdjęcie portretowe, kadr 3:4 (1200×1600). */
  photo: "/photos/mikolaj-portret.jpg",
  photoAlt: "Mikołaj Letkiewicz, fizjoterapeuta",
};

/* ------------------------------------------------------------------ */
/* METAMORFOZY / PORTFOLIO                                             */
/* ------------------------------------------------------------------ */

/**
 * CELOWO PUSTE — sekcja nie renderuje się, dopóki nie wstawisz prawdziwych metamorfoz.
 * Zdjęcia wrzuć do /public/photos/, potrzebna jest zgoda osoby na publikację wizerunku.
 */
export const portfolio = {
  eyebrow: "Efekty",
  heading: "Metamorfozy podopiecznych",
  lead:
    "Zmiany, które udało się przeprowadzić razem z pacjentami w gabinecie i w prowadzeniu online.",
  items: [] as {
    name: string;
    context: string;
    duration: string;
    before: string;
    after: string;
    summary: string;
  }[],
  // Przykład:
  // items: [
  //   {
  //     name: "Paweł",
  //     context: "powrót do biegania po zerwaniu więzadła",
  //     duration: "7 miesięcy",
  //     before: "/photos/pawel-przed.jpg",
  //     after: "/photos/pawel-po.jpg",
  //     summary: "…",
  //   },
  // ],
};

/* ------------------------------------------------------------------ */
/* CENNIK                                                              */
/* ------------------------------------------------------------------ */

export const pricing = {
  eyebrow: "Cennik",
  heading: "Przejrzyste stawki, bez gwiazdek",
  lead: "Wszystkie ceny dotyczą jednej wizyty, chyba że zaznaczono inaczej.",
  /**
   * Stawki podane przez Mikołaja 11.08.2026 (wiadomość na Messengerze) —
   * zastępują ceny z Booksy, które dotyczyły wyłącznie Kliniki Sosnowej.
   *
   * Mikołaj wycenił sześć pozycji i tyle jest w cenniku. Wcześniejsze wiersze
   * „Wizyta korekcyjna" i „Trening personalny — kolejny" zniknęły, bo nie ma
   * dla nich ceny — lepszy krótszy cennik niż taki z lukami. Jeśli te usługi
   * istnieją osobno, wystarczy dopisać je z powrotem razem ze stawką.
   *
   * `description` rozwija się po kliknięciu w pozycję (na myszy — po najechaniu).
   * Opisy wizyty domowej, oceny postawy, treningu i prowadzenia online są
   * przepisane z tego, co Mikołaj zatwierdził w „Zakresie opieki" i przy
   * wizytach domowych. Opisy pierwszej i kolejnej wizyty złożyłem z opisanego
   * na stronie przebiegu wizyty — WYMAGAJĄ JEGO POTWIERDZENIA.
   */
  groups: [
    {
      name: "Fizjoterapia",
      featured: true,
      items: [
        {
          name: "Pierwsza wizyta fizjoterapeutyczna",
          duration: "1 godz.",
          price: "220 zł",
          description:
            "Wywiad, badanie i pierwsza terapia w jednym spotkaniu. Wychodzisz " +
            "wiedząc, skąd bierze się problem, co robimy dalej i co masz ćwiczyć " +
            "między wizytami.",
        },
        {
          name: "Kolejna wizyta fizjoterapeutyczna",
          duration: "40–60 min",
          price: "200 zł",
          description:
            "Sprawdzamy, co zmieniło się od poprzedniego razu, i pracujemy dalej: " +
            "terapia manualna połączona z pracą ruchem, z korektą planu domowego.",
        },
        {
          name: "Wizyta domowa",
          duration: "40–60 min",
          /* Pełny zapis „+ cena dojazdu" jest dłuższy niż miejsce obok nazwy,
             więc cena schodzi do własnego wiersza — tak samo jak w dwóch
             pozycjach powyżej, gdzie wiersz łamią długie nazwy. */
          price: "200 zł + cena dojazdu",
          description:
            "To samo co w gabinecie, tylko u ciebie: dla osób po zabiegu, " +
            "z ograniczoną samodzielnością albo w opiece nad bliskim. Na terenie " +
            "Marek dojazd jest w cenie.",
        },
      ],
    },
    {
      name: "Postawa",
      featured: false,
      items: [
        {
          name: "Ocena postawy",
          duration: "30 min",
          price: "150 zł",
          description:
            "Badanie ustawienia miednicy, kręgosłupa i obręczy barkowej. Kończy się " +
            "konkretną informacją: co da się skorygować ruchem, a co wymaga " +
            "konsultacji lekarskiej. Dla dorosłych i dla dzieci.",
        },
      ],
    },
    {
      name: "Trening",
      featured: false,
      items: [
        {
          name: "Trening personalny",
          duration: "1 godz.",
          price: "200 zł",
          description:
            "Trening prowadzony przez fizjoterapeutę, a nie przez trenera: plan " +
            "oparty na badaniu, nauka techniki i bezpiecznego obciążania.",
        },
        {
          name: "Prowadzenie online",
          duration: "miesięcznie",
          price: "200 zł",
          description:
            "Plan ćwiczeń i stały kontakt na WhatsAppie przez cały miesiąc, " +
            "z realną weryfikacją postępów. Nie musisz mieszkać w Markach.",
        },
      ],
    },
  ],
  /** Podpowiedź nad kartami — inna dla myszy, inna dla dotyku. */
  expandHintPointer: "Najedź na pozycję, żeby zobaczyć opis",
  expandHintTouch: "Dotknij pozycji, żeby zobaczyć opis",
  footnote:
    "Przy wizycie domowej na terenie Marek dojazd jest w cenie. Poza Markami " +
    "do stawki doliczany jest dojazd, ustalany indywidualnie.",
};

/* ------------------------------------------------------------------ */
/* OPINIE                                                              */
/* ------------------------------------------------------------------ */

/**
 * PRAWDZIWE OPINIE Z WIZYTÓWKI GOOGLE, przepisane 17.08.2026.
 *
 * Zasady, których trzymamy się w tej sekcji:
 * — cytujemy WYŁĄCZNIE wypowiedzi pacjentów; odpowiedzi Mikołaja pod opiniami
 *   nie trafiają na stronę,
 * — treść jest wierna oryginałowi. Poprawione zostały jedynie brakujące spacje
 *   po przecinkach, bo to zapis, a nie słowa autora. Literówki i skróty
 *   („profeska", „fizjo") zostają — cytat ma brzmieć jak cytat,
 * — nazwiska w formie, w jakiej autorzy sami je podali w Google.
 *
 * `rating` zasila gwiazdki. Wszystkie dotychczasowe opinie to 5/5.
 */
export const testimonials = {
  eyebrow: "Opinie",
  heading: "Co mówią pacjenci",
  /** Podpis nad listą — skąd pochodzą cytaty. */
  source: "Opinie z wizytówki Google",
  items: [
    {
      quote:
        "Byłem już 6 raz, z różnymi dolegliwościami, przeciążenia mięśniowe i bol kolana. " +
        "Napewno wrócę, na kolejne składanie mojego cielska w to samo miejsce :D " +
        "Profesjonalnie, sympatycznie, nie bezboleśnie ale skutecznie! " +
        "Ps. Dużo sprzętu jest na miejscu, więc nie ma nudy",
      author: "Wojciech K.",
      context: "6 miesięcy temu",
      rating: 5,
    },
    {
      quote:
        "O panu Mikołaju dowiedziałam się od pacjentki. Jestem bardzo wdzięczna za " +
        "profesjonalizm, dużą wiedzę, ogromne zaangażowanie, przemiłą atmosferę, " +
        "chęć pomocy i prace domowe w formie ćwiczeń. Moje kolano doszło do świetnej " +
        "formy. Jeszcze raz serdeczne dzięki i do miłego zobaczenia.",
      author: "Dorota Sz.",
      context: "2 miesiące temu",
      rating: 5,
    },
    {
      quote:
        "Zdecydowanie polecam. Pełen profesjonalizm. Super podejście. Wiedza " +
        "i umiejętności na najwyższym poziomie. Korzystałem z zabiegów kilka razy, " +
        "w tym raz w „trybie ratunkowym” — Mikołaj postawił mnie na nogi, gdy zostałem " +
        "w skłonie po nieudanej próbie podniesienia ciężaru",
      author: "Grzegorz E.",
      context: "7 miesięcy temu",
      rating: 5,
    },
    {
      quote:
        "Polecam serdecznie Mikołaja. Korzystałem z dwóch innych fizjo, którzy nie byli " +
        "w stanie pomóc, a Mikołajowi udało się! Profesjonalne podejście i rozsądny koszt. " +
        "Polecam!",
      author: "Hubert K.",
      context: "8 miesięcy temu",
      rating: 5,
    },
    {
      quote:
        "Mikołaj jest bardzo sympatycznym fizjoterapeutą, profesjonalistą i osobą, która " +
        "słucha pacjentów. Udziela bardzo dobrych porad i wyjaśnia wszystko, co robi " +
        "oraz dlaczego. Gorąco go polecam.",
      author: "Lilla",
      /* Google pokazuje tę opinię jako tłumaczenie z francuskiego — zaznaczamy to,
         żeby nikt nie brał brzmienia zdania za oryginalne słowa autorki. */
      context: "7 miesięcy temu · tłumaczenie z francuskiego",
      rating: 5,
    },
    {
      quote:
        "Polecam, pełna profeska, bardzo sympatyczny i pełen zapału fizjoterapeuta, " +
        "bardzo pomocny w leczeniu",
      author: "Gracjan K.",
      context: "6 miesięcy temu",
      rating: 5,
    },
    {
      quote:
        "Polecam Mikołaja jako fizjoterapeutę z konkretnym, skutecznym podejściem. " +
        "Szybko znalazł źródło problemu, wszystko jasno wyjaśnił i dobrał ćwiczenia, " +
        "które faktycznie działają. Po kilku wizytach ból znacząco zmalał. Fachowa robota",
      author: "Multi Rocka",
      context: "8 miesięcy temu",
      rating: 5,
    },
  ] as { quote: string; author: string; context?: string; rating: number }[],
};

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faq = {
  eyebrow: "Pytania",
  heading: "Zanim przyjdziesz",
  /** Podpowiedź nad listą — inna dla myszy, inna dla dotyku. */
  expandHintPointer: "Najedź na pytanie, żeby zobaczyć odpowiedź",
  expandHintTouch: "Dotknij pytania, żeby zobaczyć odpowiedź",
  items: [
    {
      q: "Czy potrzebuję skierowania od lekarza?",
      a: "Nie. Na wizytę prywatną możesz umówić się bezpośrednio, bez skierowania.",
    },
    {
      q: "Gdzie przyjmujesz?",
      a:
        "W gabinecie w Markach przy ul. Kościuszki 59. Dojeżdżam też do pacjenta " +
        "do domu, jeśli dotarcie do gabinetu jest utrudnione. Termin umówisz przez " +
        "formularz na tej stronie.",
    },
    {
      q: "Ile wizyt będę potrzebować?",
      a:
        "Nikt nie jest w stanie przewidzieć, ile potrzebnych będzie spotkań. Można bazować " +
        "na tym, ile to trwało u osób z podobnym problemem, ale trzeba pamiętać, że każdy " +
        "organizm jest inny. Dużo do powiedzenia mają też czynniki niezależne " +
        "od fizjoterapeuty: styl życia, dieta, praca pacjenta i higiena snu.",
    },
    {
      q: "W czym mam przyjść?",
      a:
        "W wygodnym stroju, w którym swobodnie się poruszysz. Koszulka i krótkie spodenki " +
        "albo legginsy w zupełności wystarczą. Potrzebuję zobaczyć, jak pracuje okolica, " +
        "którą się zajmujemy.",
    },
    {
      q: "Zabrać ze sobą wyniki badań?",
      a:
        "Jeśli masz RTG, USG, rezonans albo wypis ze szpitala, weź je ze sobą. " +
        "Nie są konieczne do umówienia wizyty, ale bywają pomocne.",
    },
    {
      q: "Czym trening ze mną różni się od treningu z trenerem personalnym?",
      a:
        "Punktem wyjścia jest badanie fizjoterapeutyczne, a nie gotowy plan. Wiem, które " +
        "struktury są po urazie i co wolno obciążać. Widzę też, kiedy ból w trakcie serii " +
        "jest sygnałem, że trzeba zmienić ćwiczenie, a nie zacisnąć zęby.",
    },
    {
      q: "Czy terapia boli?",
      a:
        "Niektóre techniki bywają nieprzyjemne, ale pracujemy w granicach, które akceptujesz. " +
        "Ból nie jest miarą skuteczności, więc w każdej chwili mów, co czujesz.",
    },
    {
      q: "Jak odwołać wizytę?",
      a:
        "Zadzwoń lub napisz jak najszybciej. Wolny termin niemal zawsze przydaje się komuś, " +
        "kto czeka.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* KONTAKT                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  eyebrow: "Kontakt",
  heading: "Umów wizytę",
  lead:
    "Najszybciej przez telefon lub WhatsApp. Jeśli nie odbieram, jestem w trakcie " +
    "wizyty i oddzwonię.",
};

/* ------------------------------------------------------------------ */
/* NAWIGACJA                                                           */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: "Dla kogo", href: "#dla-kogo" },
  /* Sprzęt CELOWO nie ma pozycji w menu. Po dodaniu numeru telefonu pasek
     nawigacji był już pełny i ósma pozycja łamała go na dwa wiersze.
     Sekcja leży tuż pod „Zakresem opieki”, więc trafia się na nią sama. */
  { label: "Zakres opieki", href: "#uslugi" },
  { label: "Wizyta", href: "#wizyta" },
  { label: "O mnie", href: "#o-mnie" },
  { label: "Cennik", href: "#cennik" },
  { label: "Kontakt", href: "#kontakt" },
];

/** Pozycja dodawana do nawigacji tylko wtedy, gdy kalendarz jest skonfigurowany. */
export const bookingNavItem = { label: "Rezerwacja", href: "#rezerwacja" };

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export const seo = {
  /** Docelowy adres strony — potrzebny do metadanych i sitemap. */
  siteUrl: "https://letfit.pl",
  title: "LETFIT | Mikołaj Letkiewicz, fizjoterapeuta, Marki",
  description:
    "Fizjoterapia ortopedyczna i sportowa, korekta wad postawy oraz trening personalny " +
    "w Markach i z dojazdem do domu. Wizyty 1:1, badanie funkcjonalne i plan, " +
    "który działa także między spotkaniami.",
};

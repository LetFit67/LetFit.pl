/**
 * POLSKA WERSJA TREŚCI — wzorzec dla wszystkich pozostałych.
 *
 * Kształt tego obiektu jest jednocześnie typem słownika (`Content` w i18n.tsx),
 * więc każda nowa wartość dopisana tutaj musi zostać przetłumaczona w `en.ts`,
 * inaczej projekt się nie zbuduje. To celowe: brakujące tłumaczenie ma być
 * błędem kompilacji, a nie pustym miejscem odkrytym przez pacjenta.
 *
 * Fakty (telefon, adres, kwoty, ścieżki plików) leżą w `site.ts` i wchodzą
 * tutaj przez import. Nie przepisuj ich z palca — cena wpisana ręcznie w dwóch
 * słownikach prędzej czy później rozjedzie się z drugim.
 */

import { officeHours, prices } from "./site";

export const pl = {
  /** Nazwa języka na przełączniku i w atrybucie `lang` dokumentu. */
  meta: {
    htmlLang: "pl",
    name: "Polski",
    short: "PL",
    /** Opisuje przełącznik czytnikowi ekranu. */
    switchLabel: "Język strony",
    switchTo: "Przełącz na polski",
  },

  /* ---------------------------------------------------------------- */
  /* ETYKIETY INTERFEJSU                                               */
  /* ---------------------------------------------------------------- */

  /**
   * Wszystko, co nie jest treścią sekcji: przyciski, etykiety dostępności,
   * komunikaty. Wcześniej te napisy siedziały wpisane wprost w komponentach.
   */
  ui: {
    skipToContent: "Przejdź do treści",
    logoAlt: "LetFit, Mikołaj Letkiewicz, fizjoterapia",
    homeLink: "LETFIT, strona główna",
    mainNav: "Główna",
    mobileNav: "Mobilna",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",

    book: "Umów wizytę",
    bookBooksy: "Rezerwuj w Booksy",
    pickSlot: "Wybierz termin",
    call: "Zadzwoń",

    phone: "Telefon",
    email: "E-mail",
    findMeHere: "Znajdziesz mnie też tu",
    navigate: "Nawiguj",
    bookHere: "Rezerwuj",
    /** Tytuł osadzonej mapy — czytnik ekranu czyta go zamiast ramki. */
    mapTitle: (city: string, street: string) => `Mapa dojazdu: ${city}, ${street}`,

    /** Etykieta numeru podatkowego. Sam skrót NIP zostaje, bo tak brzmi nazwa. */
    taxId: "NIP",
    privacyPolicy: "Polityka prywatności",
    madeBy: "Strona stworzona przez",
    backHome: "Wróć na stronę główną",

    before: "Przed",
    after: "Po",
    ratingOf: (value: number) => `Ocena ${value} na 5`,
    /** Separator dziesiętny przy ocenie: „5,0” po polsku, „5.0” po angielsku. */
    decimalMark: ",",
  },

  /* ---------------------------------------------------------------- */
  /* LOKALIZACJE I WIZYTY DOMOWE                                       */
  /* ---------------------------------------------------------------- */

  /** Klucze odpowiadają `business.locations[].id` z site.ts. */
  locations: {
    marki: {
      /** Nazwa własna gabinetu — puste, jeśli to po prostu adres. */
      name: "",
      /** Krótka etykieta nad adresem. */
      badge: "Gabinet główny",
      hint: "Przyjmuję po wcześniejszym umówieniu terminu.",
      hours: [{ day: "Poniedziałek – sobota", value: officeHours }],
      /** Podpis odnośnika do zewnętrznej rezerwacji, jeśli taka istnieje. */
      bookingLabel: "",
    },
  } as Record<
    string,
    {
      name: string;
      badge: string;
      hint: string;
      hours: { day: string; value: string }[];
      bookingLabel: string;
    }
  >,

  /** Wizyty domowe — drugie miejsce, w którym Mikołaj przyjmuje. */
  homeVisits: {
    label: "Wizyty domowe",
    detail:
      "Dojeżdżam do pacjenta, jeśli dotarcie do gabinetu jest utrudnione: " +
      "po zabiegu, przy ograniczonej samodzielności albo w opiece nad bliskim.",
  },

  /* ---------------------------------------------------------------- */
  /* STOPKA AUTORSKA                                                   */
  /* ---------------------------------------------------------------- */

  credit: {
    role: "Projekt i wykonanie strony",
    details: (label: string) => `Szczegóły wykonawcy: ${label}`,
    items: {
      site: "Strona studia",
      year: "Realizacja",
      stack: "Technologia",
    },
    cta: "Zamów podobną stronę",
  },

  /* ---------------------------------------------------------------- */
  /* FORMULARZ ZGŁOSZENIA                                              */
  /* ---------------------------------------------------------------- */

  booking: {
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
      "Zgłoszenie wysyłasz bezpośrednio do mnie, e-mailem ze swojej skrzynki. " +
      "Strona niczego nie zapisuje ani nie wysyła w tle. Dane służą wyłącznie " +
      "do umówienia i przeprowadzenia wizyty. Szczegóły w polityce prywatności.",
    /** Lokalizacja, której dotyczy formularz — żeby nie było wątpliwości. */
    locationNote:
      "Formularz dotyczy gabinetu w Markach przy ul. Kościuszki 59 oraz wizyt domowych.",
    /**
     * Przycisk obok notki powyżej. Puste = przycisk się nie renderuje.
     * Znika też sam, gdy `business.booksyUrl` jest pusty.
     */
    /* Puste — nie ma już dokąd odsyłać po wycofaniu Booksy. */
    booksyLabel: "",

    /**
     * Druga droga umówienia wizyty, pod formularzem. Pacjent, który nie chce
     * wypełniać pól ani czekać na odpowiedź, ma tu wyjście od razu na telefon.
     * Blok nie renderuje się bez numeru w `business.phoneE164`.
     */
    orLabel: "Lub",
    callPrompt: "Zadzwoń i umów się już teraz",

    labels: {
      firstName: "Imię",
      lastName: "Nazwisko",
      complaint: "Krótki opis dolegliwości",
      complaintHint: "Co boli, od kiedy i co to pogarsza. Wystarczą dwa zdania.",
      service: "Usługa",
      servicePlaceholder: "Wybierz usługę",
      date: "Data",
      time: "Godzina",
      submitEmail: "Wyślij zgłoszenie e-mailem",
      missingChannel:
        "[UZUPEŁNIJ: adres e-mail, bez niego nie ma czym wysłać zgłoszenia]",
    },

    errors: {
      firstName: "Podaj imię.",
      lastName: "Podaj nazwisko.",
      service: "Wybierz usługę.",
      complaint: "Napisz w dwóch zdaniach, co ci dolega.",
      date: "Wybierz dzień.",
      time: "Wybierz godzinę.",
      summary: "Uzupełnij zaznaczone pola. Bez nich nie wiem, z czym i kiedy przychodzisz.",
    },

    calendar: {
      prevMonth: "Poprzedni miesiąc",
      nextMonth: "Następny miesiąc",
      pickDayFirst: "Najpierw wybierz dzień z kalendarza.",
      weekdays: ["pon", "wt", "śr", "czw", "pt", "sob", "ndz"],
      months: [
        "styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec",
        "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień",
      ],
      /**
       * Dopełniacz — wchodzi w zdanie „14 sierpnia 2026" w treści zgłoszenia.
       * W angielskim odmiany nie ma, więc tam ta lista powtarza `months`.
       */
      monthsIn: [
        "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
      ],
      /** Zapis daty w gotowej wiadomości: „pon, 14 sierpnia 2026". */
      longDate: (weekday: string, day: number, monthIn: string, year: number) =>
        `${weekday}, ${day} ${monthIn} ${year}`,
    },

    /** Szkielet wiadomości, którą pacjent wysyła ze swojego telefonu lub skrzynki. */
    message: {
      title: "Zgłoszenie wizyty ze strony LetFit",
      name: "Imię i nazwisko",
      service: "Usługa",
      slot: "Proponowany termin",
      at: "godz.",
      complaint: "Dolegliwości",
      subject: (name: string) => `Zgłoszenie wizyty: ${name}`,
    },
  },

  /* ---------------------------------------------------------------- */
  /* HERO                                                              */
  /* ---------------------------------------------------------------- */

  hero: {
    eyebrow: "Fizjoterapia ortopedyczna i sportowa · Marki",
    heading: "Wróć do ruchu,\nktórego ci brakuje",
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
  },

  /* ---------------------------------------------------------------- */
  /* WSPÓŁPRACA ZE SPORTOWCAMI                                         */
  /* ---------------------------------------------------------------- */

  /** Klucze odpowiadają `collaborationLogos[].id` z site.ts. */
  collaborations: {
    lead: "Pracuję z zawodnikami",
    names: {
      "markowi-biegacze": "KS Markowi Biegacze",
      "sparta-marki": "MKS Sparta Marki",
      "kadra-polski": "Reprezentanci kadry narodowej",
    } as Record<string, string>,
  },

  /* ---------------------------------------------------------------- */
  /* DLA KOGO                                                          */
  /* ---------------------------------------------------------------- */

  /**
   * `icon` wskazuje piktogram z mapy `FOR_WHOM_ICONS` (components/for-whom.tsx).
   * Nazwa spoza tej mapy zostawia kafel bez ikony — nic się nie psuje.
   */
  forWhom: {
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
  },

  /* ---------------------------------------------------------------- */
  /* ZAKRES OPIEKI                                                     */
  /* ---------------------------------------------------------------- */

  services: {
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
          "Prowadzenie online: stały kontakt między treningami",
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
          title: "Stały kontakt między wizytami",
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
  },

  /* ---------------------------------------------------------------- */
  /* SPRZĘT W GABINECIE                                                */
  /* ---------------------------------------------------------------- */

  /**
   * Wyposażenie gabinetu, podane przez Mikołaja (17.08.2026).
   *
   * Lista jest opisowa, nie sprzedażowa: pacjent ma zobaczyć, czym dysponuje
   * gabinet, a nie dostać obietnicę, że każde urządzenie zostanie u niego użyte.
   * O doborze decyduje badanie — mówi o tym zdanie w `lead`.
   *
   * Nazwy zapisane tak, jak podał je Mikołaj. Puste `items` chowa całą sekcję.
   */
  equipment: {
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
  },

  /* ---------------------------------------------------------------- */
  /* PRZEBIEG WIZYTY                                                   */
  /* ---------------------------------------------------------------- */

  process: {
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
  },

  /* ---------------------------------------------------------------- */
  /* O MNIE                                                            */
  /* ---------------------------------------------------------------- */

  about: {
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
    photoAlt: "Mikołaj Letkiewicz, fizjoterapeuta",
    photoPlaceholder: "Portret Mikołaja",
    role: "Fizjoterapeuta",
  },

  /* ---------------------------------------------------------------- */
  /* METAMORFOZY / PORTFOLIO                                           */
  /* ---------------------------------------------------------------- */

  /**
   * CELOWO PUSTE — sekcja nie renderuje się, dopóki nie wstawisz prawdziwych
   * metamorfoz. Zdjęcia wrzuć do /public/photos/, potrzebna jest zgoda osoby
   * na publikację wizerunku.
   */
  portfolio: {
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
  },

  /* ---------------------------------------------------------------- */
  /* CENNIK                                                            */
  /* ---------------------------------------------------------------- */

  /**
   * Kwoty pochodzą z `prices` w site.ts — tutaj dokładamy do nich walutę
   * i opis. Nie wpisuj liczb ręcznie.
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
  pricing: {
    eyebrow: "Cennik",
    heading: "Przejrzyste stawki, bez gwiazdek",
    lead: "Wszystkie ceny dotyczą jednej wizyty, chyba że zaznaczono inaczej.",
    groups: [
      {
        name: "Fizjoterapia",
        featured: true,
        items: [
          {
            name: "Pierwsza wizyta fizjoterapeutyczna",
            duration: "1 godz.",
            price: `${prices.firstVisit} zł`,
            description:
              "Wywiad, badanie i pierwsza terapia w jednym spotkaniu. Wychodzisz " +
              "wiedząc, skąd bierze się problem, co robimy dalej i co masz ćwiczyć " +
              "między wizytami.",
          },
          {
            name: "Kolejna wizyta fizjoterapeutyczna",
            duration: "40–60 min",
            price: `${prices.followUp} zł`,
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
            price: `${prices.homeVisit} zł + cena dojazdu`,
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
            price: `${prices.postureCheck} zł`,
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
            price: `${prices.personalTraining} zł`,
            description:
              "Trening prowadzony przez fizjoterapeutę, a nie przez trenera: plan " +
              "oparty na badaniu, nauka techniki i bezpiecznego obciążania.",
          },
          {
            name: "Prowadzenie online",
            duration: "miesięcznie",
            price: `${prices.onlineCoaching} zł`,
            description:
              "Plan ćwiczeń i stały kontakt przez cały miesiąc, " +
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
    /** Zakres cen do danych strukturalnych. */
    currency: "zł",
  },

  /* ---------------------------------------------------------------- */
  /* OPINIE                                                            */
  /* ---------------------------------------------------------------- */

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
   * W wersji angielskiej te same opinie są TŁUMACZENIEM i muszą być tak
   * podpisane — pacjent ma wiedzieć, że nie czyta oryginalnych słów autora.
   * Wzorem jest sama wizytówka Google, która tak właśnie oznacza opinię
   * przełożoną z francuskiego.
   *
   * `rating` zasila gwiazdki. Wszystkie dotychczasowe opinie to 5/5.
   */
  testimonials: {
    eyebrow: "Opinie",
    heading: "Co mówią pacjenci",
    /** Podpis nad listą — skąd pochodzą cytaty. */
    source: "Opinie z wizytówki Google",
    /** Podpowiedź przy podpisie, tylko dla myszy — pas przewija się chwytem. */
    dragHint: "przeciągnij, aby przewinąć",
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
  },

  /* ---------------------------------------------------------------- */
  /* FAQ                                                               */
  /* ---------------------------------------------------------------- */

  faq: {
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
  },

  /* ---------------------------------------------------------------- */
  /* KONTAKT                                                           */
  /* ---------------------------------------------------------------- */

  contact: {
    eyebrow: "Kontakt",
    heading: "Umów wizytę",
    lead:
      "Najszybciej przez telefon. Jeśli nie odbieram, jestem w trakcie wizyty " +
      "i oddzwonię.",
  },

  /* ---------------------------------------------------------------- */
  /* NAWIGACJA                                                         */
  /* ---------------------------------------------------------------- */

  /** Klucze odpowiadają `navItems[].id` i `bookingNavItem.id` z site.ts. */
  nav: {
    forWhom: "Dla kogo",
    services: "Zakres opieki",
    process: "Wizyta",
    about: "O mnie",
    pricing: "Cennik",
    contact: "Kontakt",
    booking: "Rezerwacja",
  } as Record<string, string>,

  /* ---------------------------------------------------------------- */
  /* SEO                                                               */
  /* ---------------------------------------------------------------- */

  seo: {
    title: "LETFIT | Mikołaj Letkiewicz, fizjoterapeuta, Marki",
    description:
      "Fizjoterapia ortopedyczna i sportowa, korekta wad postawy oraz trening personalny " +
      "w Markach i z dojazdem do domu. Wizyty 1:1, badanie funkcjonalne i plan, " +
      "który działa także między spotkaniami.",
  },

  /* ---------------------------------------------------------------- */
  /* POLITYKA PRYWATNOŚCI                                              */
  /* ---------------------------------------------------------------- */

  privacy: {
    title: "Polityka prywatności",
    metaDescription:
      "Informacja o przetwarzaniu danych osobowych przez gabinet fizjoterapii LETFIT.",
    /** Ramka robocza. Puste `draftNotice` = ramka znika ze strony. */
    draftTitle: "Do weryfikacji przed publikacją.",
    draftNotice:
      "To szkielet oparty na typowych obowiązkach gabinetu fizjoterapii (RODO " +
      "+ dokumentacja medyczna). Nie jest to porada prawna. Przed opublikowaniem " +
      "strony przejrzyj go i dopasuj do tego, jak faktycznie przetwarzasz dane. " +
      "Usuń tę ramkę, gdy skończysz.",

    controllerHeading: "Administrator danych",
    controllerIntro: "Administratorem twoich danych osobowych jest",
    controllerNip: "NIP",
    controllerSeat: "z siedzibą przy",
    controllerContact: "Kontakt w sprawie danych:",

    dataHeading: "Jakie dane zbieram i po co",
    dataVisitLabel: "Umówienie i realizacja wizyty",
    dataVisit:
      "imię, nazwisko, numer telefonu, adres e-mail. Podstawa: podjęcie działań " +
      "przed zawarciem umowy oraz jej wykonanie (art. 6 ust. 1 lit. b RODO).",
    dataRecordsLabel: "Dokumentacja z terapii",
    dataRecords:
      "dane o stanie zdrowia, wywiad, wyniki badań i przebieg terapii. Podstawa: " +
      "art. 9 ust. 2 lit. h RODO w związku z przepisami o działalności leczniczej " +
      "i dokumentacji medycznej.",
    dataBillingLabel: "Rozliczenia",
    dataBilling:
      "dane niezbędne do wystawienia paragonu lub faktury. Podstawa: obowiązek " +
      "prawny (art. 6 ust. 1 lit. c RODO).",
    dataFormLabel: "Zgłoszenie wizyty przez stronę",
    dataForm:
      "imię, nazwisko, wybrana usługa, proponowany termin i krótki opis dolegliwości. " +
      "Formularz niczego nie wysyła sam i nie zapisuje danych na serwerze: składa " +
      "z nich gotową wiadomość, którą wysyłasz ze swojej skrzynki e-mail. Trafia ona " +
      "bezpośrednio do mnie, a pośrednikiem jest wyłącznie dostawca poczty, " +
      "z którego korzystasz. Jeśli wolisz nie opisywać dolegliwości na piśmie, " +
      "zadzwoń albo opowiedz o nich na wizycie.",

    retentionHeading: "Jak długo przechowuję dane",
    retention:
      "Dokumentację medyczną przechowuję przez okres wymagany przepisami o prawach " +
      "pacjenta i dokumentacji medycznej. Dane rozliczeniowe przez okres wymagany " +
      "przepisami podatkowymi. Pozostałe dane kontaktowe usuwam, gdy przestają być " +
      "potrzebne.",

    recipientsHeading: "Komu przekazuję dane",
    recipients:
      "Wyłącznie podmiotom, które są niezbędne do prowadzenia gabinetu: dostawcy " +
      "systemu rezerwacji, biuro rachunkowe, dostawca hostingu i poczty. Każdy z nich " +
      "działa na podstawie umowy powierzenia albo własnego obowiązku prawnego. Danych " +
      "nie sprzedaję i nie przekazuję do celów marketingowych podmiotom trzecim.",
    recipientsTodo:
      "[UZUPEŁNIJ: wypisz konkretnych odbiorców, np. Booksy, biuro rachunkowe, dostawca hostingu]",

    rightsHeading: "Twoje prawa",
    rights:
      "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia " +
      "przetwarzania, prawo do przenoszenia danych oraz prawo sprzeciwu wobec przetwarzania. " +
      "W przypadku dokumentacji medycznej część tych praw jest ograniczona przepisami, " +
      "które nakazują mi jej przechowywanie.",
    rightsComplaint:
      "Przysługuje ci również skarga do Prezesa Urzędu Ochrony Danych Osobowych, " +
      "ul. Stawki 2, 00-193 Warszawa.",

    mapHeading: "Mapa dojazdu",
    map:
      "Przy adresie gabinetu osadzona jest mapa Google. Jej wyświetlenie oznacza " +
      "połączenie twojej przeglądarki z serwerami Google, które mogą przy tej okazji " +
      "odczytać adres IP i zapisać własne pliki cookie. Dzieje się to niezależnie ode " +
      "mnie. Jeśli wolisz tego uniknąć, skorzystaj z przycisku „Nawiguj”, który otwiera " +
      "mapę dopiero po kliknięciu.",

    cookiesHeading: "Pliki cookie i statystyki",
    cookies:
      "Ta strona nie używa własnych plików cookie do śledzenia i nie osadza narzędzi " +
      "analitycznych. Jedyną treścią zewnętrzną jest opisana wyżej mapa. Formularz " +
      "zgłoszenia działa w całości w twojej przeglądarce i nie łączy się z żadnym " +
      "serwisem. Jeżeli w przyszłości dodane zostaną statystyki odwiedzin lub piksele " +
      "reklamowe, ta sekcja zostanie zaktualizowana, a przed ich uruchomieniem pojawi " +
      "się prośba o zgodę.",
  },
};

/**
 * Kształt polskiego słownika JEST typem słownika. Każda wersja językowa musi
 * go wypełnić co do klucza, inaczej `npm run build` się nie powiedzie.
 */
export type Content = typeof pl;

/**
 * ANGIELSKA WERSJA TREŚCI.
 *
 * Plik jest typowany kształtem `pl.ts`, więc TypeScript nie pozwoli go zbudować
 * z brakującym kluczem. Dopisując cokolwiek do polskiego słownika, dopisz to
 * również tutaj — kompilator i tak o to upomni.
 *
 * Kwoty, godziny i adresy wchodzą z `site.ts`. Tutaj dokładamy do nich wyłącznie
 * walutę i słowa, nigdy same liczby.
 *
 * OPINIE SĄ TŁUMACZENIEM, nie oryginałem. Każda ma to napisane w podpisie,
 * dokładnie tak, jak robi to wizytówka Google przy opinii przełożonej
 * z francuskiego. Cytat bez takiego oznaczenia sugerowałby, że pacjent
 * wypowiedział się po angielsku.
 */

import type { Content } from "./pl";
import { officeHours, prices } from "./site";

export const en: Content = {
  meta: {
    htmlLang: "en",
    name: "English",
    short: "EN",
    switchLabel: "Site language",
    switchTo: "Switch to English",
  },

  /* ---------------------------------------------------------------- */
  /* INTERFACE LABELS                                                  */
  /* ---------------------------------------------------------------- */

  ui: {
    skipToContent: "Skip to content",
    logoAlt: "LetFit, Mikołaj Letkiewicz, physiotherapy",
    homeLink: "LETFIT, home page",
    mainNav: "Main",
    mobileNav: "Mobile",
    openMenu: "Open menu",
    closeMenu: "Close menu",

    book: "Book a visit",
    bookBooksy: "Book on Booksy",
    pickSlot: "Pick a time",
    call: "Call",

    phone: "Phone",
    email: "E-mail",
    findMeHere: "You can also find me here",
    navigate: "Directions",
    bookHere: "Book",
    mapTitle: (city: string, street: string) => `Map: ${street}, ${city}`,

    taxId: "NIP (Polish tax ID)",
    privacyPolicy: "Privacy policy",
    madeBy: "Site built by",
    backHome: "Back to the home page",

    before: "Before",
    after: "After",
    ratingOf: (value: number) => `Rated ${value} out of 5`,
    decimalMark: ".",
  },

  /* ---------------------------------------------------------------- */
  /* LOCATIONS AND HOME VISITS                                         */
  /* ---------------------------------------------------------------- */

  locations: {
    marki: {
      name: "",
      badge: "Main practice",
      hint: "Visits are by appointment only.",
      hours: [{ day: "Monday – Saturday", value: officeHours }],
      bookingLabel: "",
    },
  },

  homeVisits: {
    label: "Home visits",
    detail:
      "I travel to the patient when getting to the practice is difficult: " +
      "after surgery, with limited mobility, or while caring for a relative.",
  },

  /* ---------------------------------------------------------------- */
  /* SITE CREDIT                                                       */
  /* ---------------------------------------------------------------- */

  credit: {
    role: "Website design and build",
    details: (label: string) => `Studio details: ${label}`,
    items: {
      site: "Studio website",
      year: "Built in",
      stack: "Technology",
    },
    cta: "Order a site like this",
  },

  /* ---------------------------------------------------------------- */
  /* APPOINTMENT REQUEST FORM                                          */
  /* ---------------------------------------------------------------- */

  booking: {
    eyebrow: "Request",
    heading: "Book a visit",
    lead:
      "Send a request and I will get back to you to confirm the time. The calendar " +
      "below shows the days and hours when I see patients. I confirm every chosen " +
      "slot personally, because some of those hours may already be taken.",
    privacyNote:
      "Your request goes straight to me, by e-mail sent from your own mailbox. This " +
      "site stores nothing and sends nothing in the background. The data serves only " +
      "to arrange and carry out the visit. Details are in the privacy policy.",
    locationNote:
      "This form covers the practice in Marki at ul. Kościuszki 59 and home visits.",
    /* Puste — nie ma już dokąd odsyłać po wycofaniu Booksy. */
    booksyLabel: "",

    orLabel: "Or",
    callPrompt: "Call and book your visit right away",

    labels: {
      firstName: "First name",
      lastName: "Last name",
      complaint: "Briefly, what is wrong",
      complaintHint: "What hurts, since when, and what makes it worse. Two sentences is enough.",
      service: "Service",
      servicePlaceholder: "Choose a service",
      date: "Date",
      time: "Time",
      submitEmail: "Send the request by e-mail",
      missingChannel:
        "[UZUPEŁNIJ: adres e-mail, bez niego nie ma czym wysłać zgłoszenia]",
    },

    errors: {
      firstName: "Enter your first name.",
      lastName: "Enter your last name.",
      service: "Choose a service.",
      complaint: "Describe in two sentences what is bothering you.",
      date: "Choose a day.",
      time: "Choose a time.",
      summary: "Fill in the marked fields. Without them I do not know what you are coming with, or when.",
    },

    calendar: {
      prevMonth: "Previous month",
      nextMonth: "Next month",
      pickDayFirst: "Choose a day from the calendar first.",
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
      /* Angielski nie odmienia nazw miesięcy, więc lista dopełniaczowa
         powtarza mianownik. */
      monthsIn: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
      longDate: (weekday: string, day: number, monthIn: string, year: number) =>
        `${weekday}, ${monthIn} ${day}, ${year}`,
    },

    message: {
      title: "Appointment request from the LetFit website",
      name: "Name",
      service: "Service",
      slot: "Proposed time",
      at: "at",
      complaint: "Symptoms",
      subject: (name: string) => `Appointment request: ${name}`,
    },
  },

  /* ---------------------------------------------------------------- */
  /* HERO                                                              */
  /* ---------------------------------------------------------------- */

  hero: {
    eyebrow: "Orthopedic and sports physiotherapy · Marki",
    heading: "Back to moving,\nthe way you miss",
    /**
     * Ta sama zasada co po polsku: pierwsza pozycja jest wersją stałą, trafia
     * do wyszukiwarek i czytników ekranu, reszta to efekt wizualny. Każdy
     * wariant musi zmieścić się w JEDNYM wierszu na telefonie — mierzone
     * w pikselach, nie w znakach. Wszystkie poniższe mają najwyżej 18 znaków,
     * czyli tyle co polski wariant graniczny.
     */
    headingRotation: [
      "the way you miss",
      "at full range",
      "with no limits",
      "without bracing",
      "with no pain",
      "pain-free mornings",
      "back to yourself",
      "back to health",
      "back in shape",
      "be yourself again",
      "and feeling strong",
      "with joy again",
      "on your terms",
    ],
    lead:
      "I run therapy that does not stop at momentary relief. We look for the cause of " +
      "the pain, improve what feeds it, and build a body that does not come back to " +
      "the same problem.",
    bullets: [
      "One-to-one visits at the practice in Marki or at your home",
      "Manual therapy combined with movement work",
      "A concrete plan for what you do between visits",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* WORK WITH ATHLETES                                                */
  /* ---------------------------------------------------------------- */

  collaborations: {
    lead: "I work with athletes",
    names: {
      /* Nazwy własne klubów zostają w oryginale. */
      "markowi-biegacze": "KS Markowi Biegacze",
      "sparta-marki": "MKS Sparta Marki",
      "kadra-polski": "National team athletes",
    },
  },

  /* ---------------------------------------------------------------- */
  /* WHO IT IS FOR                                                     */
  /* ---------------------------------------------------------------- */

  forWhom: {
    eyebrow: "Who it is for",
    heading: "If any of these sounds familiar, you are in the right place",
    items: [
      {
        icon: "spine",
        title: "Chronic back and neck pain",
        body:
          "It eases for a few days after a massage or a painkiller, then comes back " +
          "exactly the same. It returns because the cause was never touched.",
      },
      {
        icon: "radiating",
        title: "Disc problems and radiating pain",
        body:
          "Pain running down the arm or leg, numbness, pins and needles. This needs " +
          "an examination and a plan spread over several weeks.",
      },
      {
        icon: "sport",
        title: "Sports injury",
        body:
          "You want to get back to training and be sure the joint will take the load. " +
          "Pain simply going away is not enough for you.",
      },
      {
        icon: "recovery",
        title: "After surgery or injury",
        body:
          "The cast is off, the hospital protocol has ended, and you are left with the " +
          "question of what comes next and how soon you can load it.",
      },
      {
        icon: "desk",
        title: "Desk work",
        body:
          "A tight neck, numb hands and stiffness between the shoulder blades after " +
          "eight hours at a screen.",
      },
      {
        icon: "posture",
        title: "Postural problems",
        body:
          "Yours or your child's. It is worth knowing what movement can correct and " +
          "what calls for a medical consultation.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* SCOPE OF CARE                                                     */
  /* ---------------------------------------------------------------- */

  services: {
    eyebrow: "Scope of care",
    heading: "Four areas I work in",
    lead:
      "Every visit starts with an examination. What we reach for follows from it.",
    items: [
      {
        slug: "ortopedyczna",
        title: "Orthopedic physiotherapy",
        summary:
          "Spine and joint pain, disc problems, overload injuries, and rehabilitation " +
          "after injuries and surgery.",
        points: [
          "Chronic back and neck pain",
          "Disc problems and pain radiating into the limbs",
          "Manual therapy: joint mobilisation and soft tissue work",
          "Gradual return of range of motion and strength",
          "An exercise plan that fits your day",
        ],
      },
      {
        slug: "sportowa",
        title: "Sports physiotherapy",
        summary:
          "A technical inspection for an athlete's body, and a return to competing " +
          "after whatever has already happened.",
        points: [
          "Assessment of range deficits limiting your sporting capacity",
          "Assessment of movement patterns in your discipline",
          "Rehabilitation after sports and overload injuries",
          "Preparing the body before a competition",
        ],
      },
      {
        slug: "postawa",
        title: "Posture assessment and correction",
        summary:
          "We check what happens to your posture under load and what movement can " +
          "do about it.",
        points: [
          "Assessment of pelvis, spine and shoulder girdle alignment",
          "Telling which patterns are habit and which are structural limits",
          "Work on the breathing pattern and trunk control",
          "A set of corrective exercises for home, with progress checks",
          "For adults and for children",
        ],
      },
      {
        slug: "trening",
        title: "Personal training and online coaching",
        summary:
          "Training led by a physiotherapist who knows what your tissues will " +
          "actually take.",
        points: [
          "A plan based on an examination, not on a template from the internet",
          "Learning technique and safe loading",
          "Online coaching: steady contact between sessions",
          "Diet oversight and honest progress checks",
        ],
      },
    ],
    online: {
      title: "How online coaching works",
      lead:
        "You do not have to live in Marki to work under my care. Remote coaching " +
        "follows the same rules as work at the practice. The only difference is that " +
        "contact moves to your phone.",
      points: [
        {
          title: "Steady contact between visits",
          body:
            "You write the moment you have a doubt, instead of waiting a week for the " +
            "next visit. You film a set, I assess the technique and correct it.",
        },
        {
          title: "Oversight of what you eat",
          body:
            "Without effort in the kitchen, training will not deliver. We keep an eye " +
            "on it together, on specific meals and numbers.",
        },
        {
          title: "A plan updated as we go",
          body:
            "Load progression follows what you actually do in training.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  /* EQUIPMENT                                                         */
  /* ---------------------------------------------------------------- */

  equipment: {
    eyebrow: "Equipment",
    heading: "What I have on site",
    lead:
      "Physical modalities are an addition to manual therapy and movement work, not " +
      "a replacement. Whether and what we use follows from the examination.",
    items: [
      "Electrotherapy",
      "Therapeutic ultrasound",
      "Magnetic field therapy",
      "High-power laser",
      "Shockwave therapy",
      "Tecar therapy",
      "Diathermy",
      "Diagnostic ultrasound",
      "Muscle electrostimulator",
      "Percutaneous electrolysis unit",
      "Intramuscular stimulation unit",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* HOW A VISIT GOES                                                  */
  /* ---------------------------------------------------------------- */

  process: {
    eyebrow: "How a visit goes",
    heading: "You know what to expect",
    steps: [
      {
        title: "Conversation",
        body:
          "I ask about the history of the problem, your activity, your work and what " +
          "you have already tried. Without that, an examination is only guesswork.",
      },
      {
        title: "Examination",
        body:
          "I watch how you move and test specific structures. By the end you know what " +
          "the source of the problem is and why it is that one.",
      },
      {
        title: "Therapy",
        body:
          "Manual work, movement, or both, depending on what the examination showed. " +
          "We check the effect while you are still here.",
      },
      {
        title: "Plan",
        body:
          "You leave with a set of exercises and a clear answer on what to do, what to " +
          "avoid, and when we see each other again.",
      },
    ],
    note:
      "The first visit takes longer than the ones that follow. Most of that time goes " +
      "to the examination and the conversation.",
  },

  /* ---------------------------------------------------------------- */
  /* ABOUT                                                             */
  /* ---------------------------------------------------------------- */

  about: {
    eyebrow: "About me",
    heading: "Mikołaj Letkiewicz",
    paragraphs: [
      "I am a qualified physiotherapist with experience gained in Poland and in Canada. " +
        "I specialise in orthopedic and sports therapy, working both with people dealing " +
        "with pain or injury and with those who want to look after prevention and keep " +
        "their body capable.",
      "I work one to one and never see two people at once. A visit is a conversation, " +
        "an examination and therapy, not a procedure on its own. I want you to leave " +
        "knowing what is happening in your body and what you can do about it yourself.",
    ],
    credentials: [],
    photoAlt: "Mikołaj Letkiewicz, physiotherapist",
    photoPlaceholder: "Portrait of Mikołaj",
    role: "Physiotherapist",
  },

  /* ---------------------------------------------------------------- */
  /* TRANSFORMATIONS                                                   */
  /* ---------------------------------------------------------------- */

  portfolio: {
    eyebrow: "Results",
    heading: "Patient transformations",
    lead:
      "Changes achieved together with patients at the practice and in online coaching.",
    items: [],
  },

  /* ---------------------------------------------------------------- */
  /* PRICES                                                            */
  /* ---------------------------------------------------------------- */

  pricing: {
    eyebrow: "Prices",
    heading: "Clear rates, no asterisks",
    lead: "All prices are per visit unless stated otherwise.",
    groups: [
      {
        name: "Physiotherapy",
        featured: true,
        items: [
          {
            name: "First physiotherapy visit",
            duration: "1 hr",
            price: `${prices.firstVisit} PLN`,
            description:
              "History, examination and the first therapy in one appointment. You leave " +
              "knowing where the problem comes from, what we do next, and what to " +
              "practise between visits.",
          },
          {
            name: "Follow-up physiotherapy visit",
            duration: "40–60 min",
            price: `${prices.followUp} PLN`,
            description:
              "We check what has changed since last time and carry on: manual therapy " +
              "combined with movement work, with the home plan adjusted.",
          },
          {
            name: "Home visit",
            duration: "40–60 min",
            price: `${prices.homeVisit} PLN + travel`,
            description:
              "The same as at the practice, only at your place: for people after surgery, " +
              "with limited mobility, or caring for a relative. Within Marki, travel is " +
              "included in the price.",
          },
        ],
      },
      {
        name: "Posture",
        featured: false,
        items: [
          {
            name: "Posture assessment",
            duration: "30 min",
            price: `${prices.postureCheck} PLN`,
            description:
              "Assessment of pelvis, spine and shoulder girdle alignment. It ends with a " +
              "concrete answer: what movement can correct and what calls for a medical " +
              "consultation. For adults and for children.",
          },
        ],
      },
      {
        name: "Training",
        featured: false,
        items: [
          {
            name: "Personal training",
            duration: "1 hr",
            price: `${prices.personalTraining} PLN`,
            description:
              "Training led by a physiotherapist rather than a coach: a plan based on an " +
              "examination, learning technique and safe loading.",
          },
          {
            name: "Online coaching",
            duration: "per month",
            price: `${prices.onlineCoaching} PLN`,
            description:
              "An exercise plan and steady contact for the whole month, " +
              "with honest progress checks. You do not have to live in Marki.",
          },
        ],
      },
    ],
    expandHintPointer: "Hover over an item to see the description",
    expandHintTouch: "Tap an item to see the description",
    footnote:
      "For home visits within Marki, travel is included in the price. Outside Marki a " +
      "travel charge is added to the rate and agreed individually.",
    currency: "PLN",
  },

  /* ---------------------------------------------------------------- */
  /* REVIEWS                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Tłumaczenia prawdziwych opinii z wizytówki Google. Każdy podpis mówi,
   * z jakiego języka cytat został przełożony — bez tego czytelnik brałby
   * angielskie zdania za oryginalne słowa pacjenta.
   *
   * Tłumaczenie oddaje ton oryginału, łącznie z potocznością. Literówek
   * z polskiej wersji nie odtwarzamy: przepisane byłyby udawaniem cudzego
   * niedbalstwa, którego autor nie popełnił po angielsku.
   */
  testimonials: {
    eyebrow: "Reviews",
    heading: "What patients say",
    source: "Reviews from the Google business profile",
    dragHint: "drag to scroll",
    items: [
      {
        quote:
          "This was my 6th time, with various complaints, muscle overload and knee pain. " +
          "I will definitely be back to have my carcass put back together in the same " +
          "place :D Professional, friendly, not painless but effective! " +
          "PS. There is plenty of equipment on site, so you never get bored",
        author: "Wojciech K.",
        context: "6 months ago · translated from Polish",
        rating: 5,
      },
      {
        quote:
          "I heard about Mikołaj from another patient. I am very grateful for the " +
          "professionalism, the depth of knowledge, the enormous commitment, the lovely " +
          "atmosphere, the willingness to help and the homework in the form of exercises. " +
          "My knee is in great shape. Thank you again and see you soon.",
        author: "Dorota Sz.",
        context: "2 months ago · translated from Polish",
        rating: 5,
      },
      {
        quote:
          "Highly recommended. Complete professionalism. Great approach. Knowledge and " +
          "skill at the highest level. I have used his treatments several times, once in " +
          "„emergency mode”: Mikołaj got me back on my feet when I was stuck bent over " +
          "after a failed lift",
        author: "Grzegorz E.",
        context: "7 months ago · translated from Polish",
        rating: 5,
      },
      {
        quote:
          "I warmly recommend Mikołaj. I had been to two other physios who could not " +
          "help, and Mikołaj managed it! A professional approach and a reasonable price. " +
          "Recommended!",
        author: "Hubert K.",
        context: "8 months ago · translated from Polish",
        rating: 5,
      },
      {
        quote:
          "Mikołaj is a very likeable physiotherapist, a professional, and someone who " +
          "listens to patients. He gives very good advice and explains everything he does " +
          "and why. I recommend him warmly.",
        author: "Lilla",
        /* Ta opinia była na Google już jako tłumaczenie z francuskiego. */
        context: "7 months ago · translated from French",
        rating: 5,
      },
      {
        quote:
          "Recommended, fully professional, a very likeable physiotherapist full of drive, " +
          "very helpful in treatment",
        author: "Gracjan K.",
        context: "6 months ago · translated from Polish",
        rating: 5,
      },
      {
        quote:
          "I recommend Mikołaj as a physiotherapist with a concrete, effective approach. " +
          "He quickly found the source of the problem, explained everything clearly and " +
          "picked exercises that actually work. After a few visits the pain dropped " +
          "considerably. Solid work",
        author: "Multi Rocka",
        context: "8 months ago · translated from Polish",
        rating: 5,
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* FAQ                                                               */
  /* ---------------------------------------------------------------- */

  faq: {
    eyebrow: "Questions",
    heading: "Before you come",
    expandHintPointer: "Hover over a question to see the answer",
    expandHintTouch: "Tap a question to see the answer",
    items: [
      {
        q: "Do I need a referral from a doctor?",
        a: "No. You can book a private visit directly, with no referral.",
      },
      {
        q: "Where do you see patients?",
        a:
          "At the practice in Marki, ul. Kościuszki 59. I also travel to patients at home " +
          "when getting to the practice is difficult. You can arrange a time through the " +
          "form on this site.",
      },
      {
        q: "How many visits will I need?",
        a:
          "Nobody can predict how many appointments it will take. You can go by how long " +
          "it took for people with a similar problem, but every body is different. Factors " +
          "outside the physiotherapist's hands matter a great deal too: lifestyle, diet, " +
          "the patient's work and sleep habits.",
      },
      {
        q: "What should I wear?",
        a:
          "Comfortable clothing you can move freely in. A T-shirt and shorts or leggings " +
          "are plenty. I need to see how the area we are working on behaves.",
      },
      {
        q: "Should I bring my test results?",
        a:
          "If you have an X-ray, ultrasound, MRI or a hospital discharge summary, bring " +
          "them along. They are not needed to book a visit, but they can help.",
      },
      {
        q: "How is training with you different from a personal trainer?",
        a:
          "The starting point is a physiotherapy examination rather than a ready-made plan. " +
          "I know which structures are post-injury and what may be loaded. I also see when " +
          "pain during a set is a signal to change the exercise instead of gritting your teeth.",
      },
      {
        q: "Does the therapy hurt?",
        a:
          "Some techniques can be unpleasant, but we work within limits you accept. Pain is " +
          "no measure of effectiveness, so tell me what you feel at any point.",
      },
      {
        q: "How do I cancel a visit?",
        a:
          "Call or write as soon as you can. A freed-up slot almost always comes in handy " +
          "for someone who is waiting.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* CONTACT                                                           */
  /* ---------------------------------------------------------------- */

  contact: {
    eyebrow: "Contact",
    heading: "Book a visit",
    lead:
      "The fastest way is by phone. If I do not pick up I am with a patient, " +
      "and I will call you back.",
  },

  /* ---------------------------------------------------------------- */
  /* NAVIGATION                                                        */
  /* ---------------------------------------------------------------- */

  nav: {
    forWhom: "Who it's for",
    services: "Scope of care",
    process: "The visit",
    about: "About me",
    pricing: "Prices",
    contact: "Contact",
    booking: "Booking",
  },

  /* ---------------------------------------------------------------- */
  /* SEO                                                               */
  /* ---------------------------------------------------------------- */

  seo: {
    title: "LETFIT | Mikołaj Letkiewicz, physiotherapist, Marki",
    description:
      "Orthopedic and sports physiotherapy, posture correction and personal training in " +
      "Marki and at your home. One-to-one visits, a functional examination and a plan " +
      "that works between appointments too.",
  },

  /* ---------------------------------------------------------------- */
  /* PRIVACY POLICY                                                    */
  /* ---------------------------------------------------------------- */

  privacy: {
    title: "Privacy policy",
    metaDescription:
      "Information on the processing of personal data by the LETFIT physiotherapy practice.",
    draftTitle: "To be reviewed before publication.",
    draftNotice: "",

    controllerHeading: "Data controller",
    controllerIntro: "The controller of your personal data is",
    controllerNip: "NIP (Polish tax ID)",
    controllerSeat: "registered at",
    controllerContact: "Contact regarding data:",

    dataHeading: "What data I collect and why",
    dataVisitLabel: "Arranging and carrying out a visit",
    dataVisit:
      "first name, last name, phone number, e-mail address. Basis: steps taken before " +
      "entering into a contract and its performance (Art. 6(1)(b) GDPR).",
    dataRecordsLabel: "Therapy records",
    dataRecords:
      "health data, history, test results and the course of therapy. Basis: Art. 9(2)(h) " +
      "GDPR in connection with the regulations on medical activity and medical records.",
    dataBillingLabel: "Billing",
    dataBilling:
      "the data needed to issue a receipt or an invoice. Basis: legal obligation " +
      "(Art. 6(1)(c) GDPR).",
    dataFormLabel: "Appointment request through the site",
    dataForm:
      "first name, last name, the chosen service, the proposed time and a short " +
      "description of your symptoms. The form sends nothing by itself and stores no data " +
      "on a server: it assembles a ready message which you send from your own e-mail " +
      "account. It reaches me directly, and the only intermediary is the mail provider " +
      "you use. If you would rather not put your symptoms in writing, call instead or " +
      "describe them at the visit.",

    retentionHeading: "How long I keep the data",
    retention:
      "Medical records are kept for the period required by the regulations on patients' " +
      "rights and medical records. Billing data is kept for the period required by tax " +
      "law. Remaining contact data is deleted once it is no longer needed.",

    recipientsHeading: "Who I share the data with",
    recipients:
      "I do not pass your data to third parties. I use no booking system, I keep no " +
      "records in external software and I share nothing with an accounting office. " +
      "I do not sell the data and I do not pass it on for marketing.",
    recipientsInfra:
      "Out of technical necessity, two services can reach part of the data, because " +
      "without them neither this site nor e-mail works: the provider of the mailbox " +
      "your request arrives in, and the provider hosting this site, whose server logs " +
      "visitors' IP addresses. I do not look into that data beyond handling requests.",
    recipientsTodo: "",

    rightsHeading: "Your rights",
    rights:
      "You have the right to access your data, to rectify it, to erase it or restrict its " +
      "processing, the right to data portability and the right to object to processing. " +
      "For medical records some of these rights are limited by the regulations that " +
      "require me to retain them.",
    rightsComplaint:
      "You may also lodge a complaint with the President of the Personal Data Protection " +
      "Office, ul. Stawki 2, 00-193 Warsaw, Poland.",

    mapHeading: "Map",
    map:
      "A Google map is embedded next to the practice address. Displaying it means your " +
      "browser connects to Google servers, which may read your IP address and store their " +
      "own cookies. This happens independently of me. If you would rather avoid it, use " +
      "the „Directions” button, which opens the map only after you click.",

    cookiesHeading: "Cookies and analytics",
    cookies:
      "This site uses no tracking cookies of its own and embeds no analytics tools. The " +
      "only external content is the map described above. The request form runs entirely " +
      "in your browser and connects to no service. If visit statistics or advertising " +
      "pixels are added in future, this section will be updated and consent will be asked " +
      "for before they are switched on.",
  },
};

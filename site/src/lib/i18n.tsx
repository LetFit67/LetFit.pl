"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { en } from "@/content/en";
import { pl, type Content } from "@/content/pl";

export type { Content };

/**
 * PRZEŁĄCZNIK JĘZYKA PO STRONIE PRZEGLĄDARKI.
 *
 * Strona ma JEDEN adres. Wybór języka siedzi w `localStorage`, a nie w ścieżce,
 * więc `letfit.pl/en` nie istnieje. Konsekwencje trzeba znać, zanim ktoś zacznie
 * liczyć na ruch z wyszukiwarki:
 *
 * — Google indeksuje wyłącznie wersję polską, bo taką dostaje z serwera,
 * — nie da się wysłać komuś odnośnika prosto do wersji angielskiej,
 * — `hreflang` nie ma czego wskazać.
 *
 * Gdyby strona miała kiedyś ściągać obcojęzycznych pacjentów z wyszukiwarki,
 * trzeba przejść na osobne ścieżki (`/en`) i renderować obie wersje na serwerze.
 * Do tego czasu ten plik jest całą maszynerią tłumaczeń.
 */

export const DICTIONARIES = { pl, en } as const;

export type Locale = keyof typeof DICTIONARIES;

/** Język, w którym strona wychodzi z serwera i trafia do wyszukiwarek. */
export const DEFAULT_LOCALE: Locale = "pl";

export const LOCALES = Object.keys(DICTIONARIES) as Locale[];

const STORAGE_KEY = "letfit-jezyk";

const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as string[]).includes(v);

/* ------------------------------------------------------------------ */
/* MAGAZYN WYBORU                                                      */
/* ------------------------------------------------------------------ */

/**
 * Zwykły magazyn zewnętrzny zamiast stanu ustawianego w efekcie.
 *
 * `getSnapshot` MUSI oddawać ten sam obiekt przy każdym wywołaniu, dopóki nic
 * się nie zmieniło — inaczej React wpada w pętlę renderów. Stąd `current`
 * liczone raz i zapamiętane. Na serwerze snapshot jest stały i polski, więc
 * HTML zawsze wychodzi po polsku, a przeglądarka podmienia go zaraz po
 * hydratacji, jeżeli wybór mówi co innego.
 */
let current: Locale | null = null;

const listeners = new Set<() => void>();

function detect(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    /* Tryb prywatny albo zablokowany magazyn — jedziemy dalej na wykrywaniu. */
  }
  // Bez zapisanego wyboru idziemy za ustawieniem przeglądarki. Polski jest
  // domyślny tylko dla tych, którzy faktycznie mają polską przeglądarkę.
  return window.navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
}

const getSnapshot = (): Locale => (current ??= detect());

const getServerSnapshot = (): Locale => DEFAULT_LOCALE;

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Zmiana języka w innej karcie ma dogonić tę kartę. */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY || !isLocale(e.newValue)) return;
    if (e.newValue === current) return;
    current = e.newValue;
    listeners.forEach((fn) => fn());
  });
}

function setLocale(next: Locale) {
  if (next === getSnapshot()) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Bez zapisu wybór przepadnie po odświeżeniu, ale ta sesja zadziała. */
  }
  listeners.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ */
/* KONTEKST                                                            */
/* ------------------------------------------------------------------ */

type LocaleValue = {
  locale: Locale;
  t: Content;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleValue | null>(null);

/** Tytuł dokumentu w danym języku — inny dla strony głównej, inny dla polityki. */
export type PageTitle = (t: Content) => string;

export function LocaleProvider({
  children,
  title,
}: {
  children: ReactNode;
  /**
   * Tytuł w zakładce przeglądarki. Metadane z `layout.tsx` powstają na
   * serwerze i są zawsze polskie, więc po przełączeniu na angielski trzeba je
   * podmienić w dokumencie — inaczej zakładka mówiłaby co innego niż strona.
   *
   * Opisu `<meta name="description">` NIE ruszamy. Czyta go wyłącznie robot
   * i podgląd udostępnianego odnośnika, a jedno i drugie dostaje z serwera
   * wersję polską i tylko taką widzi. Podmiana dokładałaby drugi znacznik
   * w `<head>` bez żadnego pożytku.
   */
  title?: PageTitle;
}) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = DICTIONARIES[locale];

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
  }, [t]);

  /**
   * Tytuł w zakładce trzeba nie tylko ustawić, ale i UTRZYMAĆ.
   *
   * Next wstawia własny `<title>` do `<head>` PO zakończeniu hydratacji, więc
   * samo przypisanie w efekcie działa przy kliknięciu w przełącznik, ale przy
   * wejściu na stronę z zapisanym angielskim zostaje nadpisane i zakładka
   * wraca do polskiej. Renderowanie własnego `<title>` w drzewie też nie jest
   * wyjściem: znacznik trafia wtedy również do HTML z serwera i strona wychodzi
   * z dwoma tytułami, co jest gorsze niż jeden zły.
   *
   * Obserwator pilnuje `<head>` i przywraca tytuł, gdy ktoś go zmieni. Warunek
   * `!==` przerywa pętlę: własne przypisanie też wywoła obserwatora, ale wtedy
   * tytuł już się zgadza i nic się nie dzieje.
   */
  useEffect(() => {
    if (!title) return;

    const wanted = title(t);
    const apply = () => {
      if (document.title !== wanted) document.title = wanted;
    };

    apply();
    const observer = new MutationObserver(apply);
    /* `characterData` jest tu niezbędne: Next nie podmienia całego znacznika,
       tylko treść węzła tekstowego w środku, a to nie jest zmiana `childList`. */
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [t, title]);

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

function useLocaleContext() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error(
      "Komponent z tłumaczeniami renderuje się poza <LocaleProvider>. " +
        "Owiń go providerem albo dodaj sekcję do site-shell.tsx."
    );
  }
  return ctx;
}

/** Słownik bieżącego języka. Podstawowy sposób sięgania po treść. */
export function useT(): Content {
  return useLocaleContext().t;
}

/** Sam wybór języka — potrzebny wyłącznie przełącznikowi. */
export function useLocale() {
  const { locale, setLocale: set } = useLocaleContext();
  return { locale, setLocale: set };
}

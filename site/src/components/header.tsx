"use client";

import { useEffect, useState } from "react";
import {
  bookingConfig,
  bookingNavItem,
  business,
  navItems,
  telLink,
} from "@/content/site";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "./language-switcher";
import { ButtonLink, CalendarIcon, Logo, PhoneIcon } from "./ui";

/** Pozycja „Rezerwacja” pojawia się dopiero, gdy formularz jest włączony. */
const items = bookingConfig.enabled
  ? [...navItems.slice(0, -1), bookingNavItem, navItems[navItems.length - 1]]
  : navItems;

export function Header() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Otwarte menu mobilne nie może pozwalać na scroll tła.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Formularz na stronie ma pierwszeństwo nad rezerwacją zewnętrzną.
  const primaryCta = bookingConfig.enabled
    ? "#rezerwacja"
    : business.booksyUrl || telLink || "#kontakt";
  const primaryLabel =
    !bookingConfig.enabled && business.booksyUrl ? t.ui.bookBooksy : t.ui.book;
  const ctaExternal = !bookingConfig.enabled && Boolean(business.booksyUrl);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-paper/92 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      {/*
        Odstępy rosną skokowo, bo miejsce pojawia się skokowo. Kontener
        nagłówka ma 88rem, ale do 1400 px i tak ogranicza go szerokość okna,
        więc dopiero od tej granicy jest z czego dosypać. Niżej zostają
        wartości, które się mieszczą.
      */}
      <div className="container-header flex h-20 items-center justify-between gap-6 min-[1400px]:gap-10">
        <a href="#top" aria-label={t.ui.homeLink} className="shrink-0">
          <Logo variant="horizontal" className="h-12 w-auto md:h-14" priority />
        </a>

        {/*
          Pasek z pozycjami pojawia się od xl (1280 px), nie od lg.

          To jest ZMIERZONE, nie dobrane na oko: przy pełnych odstępach
          (`gap-7` w nawigacji, `gap-6` w pasku) logo, siedem pozycji, telefon,
          przycisk i przełącznik potrzebują 1180 px po polsku i 1190 px po
          angielsku. Kontener ma `max-width: 76rem` i 2rem marginesu z każdej
          strony, więc tyle miejsca daje dopiero okno od ok. 1254 px.

          Na lg mieściło się to wcześniej tylko pozornie — telefon i „Umów
          wizytę" łamały się po cichu na dwa wiersze. Stąd `whitespace-nowrap`
          niżej: pasek ma raczej oddać pozycje do menu, niż zrobić się
          dwupiętrowy.
        */}
        <nav
          aria-label={t.ui.mainNav}
          className="hidden items-center gap-7 xl:flex min-[1400px]:gap-9"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium whitespace-nowrap text-ink-60 transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-blue after:transition-all hover:after:w-full"
            >
              {t.nav[item.id]}
            </a>
          ))}
        </nav>

        {/* Przełącznik stoi ZA przyciskiem „Umów wizytę". Wciśnięty przed
            telefon rozbijał parę telefon + przycisk, czyli dwie drogi kontaktu,
            które mają trzymać się razem na prawym końcu paska.

            `whitespace-nowrap` na numerze i na przycisku jest tu konieczne:
            bez niego przy ciasnym pasku łamały się na dwa wiersze zamiast
            wymusić zwężenie i wyglądało to jak zepsuty układ. */}
        <div className="hidden shrink-0 items-center gap-3 md:flex min-[1400px]:gap-5">
          {telLink && (
            <a
              href={telLink}
              className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-ink transition-colors hover:text-blue"
            >
              <PhoneIcon />
              {business.phoneDisplay}
            </a>
          )}
          <ButtonLink
            href={primaryCta}
            target={ctaExternal ? "_blank" : undefined}
            rel={ctaExternal ? "noopener noreferrer" : undefined}
            className="px-5 py-3 whitespace-nowrap"
          >
            <CalendarIcon />
            {primaryLabel}
          </ButtonLink>
          <LanguageSwitcher />
        </div>

        {/* Hamburger sięga aż do xl, bo do tej szerokości nawigacja siedzi
            w menu. Wcześniej znikał już na md i między 768 a 1024 px nie było
            czym nawigować — pozycje nie mieściły się w pasku, a menu nie dało
            się otworzyć.

            Przełącznik stoi tu tylko na telefonie: od md jedzie w prawej
            grupie, za przyciskiem. Na telefonie musi być OBOK hamburgera,
            a nie w rozwiniętym menu — osoba, która nie zna polskiego, nie
            powinna musieć otwierać menu po polsku, żeby znaleźć w nim
            angielski. */}
        <div className="flex items-center gap-2 xl:hidden">
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobilne"
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink"
          >
            <span className="sr-only">{open ? t.ui.closeMenu : t.ui.openMenu}</span>
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="menu-mobilne"
          className="min-h-[calc(100dvh-5rem)] border-t border-ink/10 bg-paper xl:hidden"
        >
          <nav
            aria-label={t.ui.mobileNav}
            className="container-header flex flex-col py-4"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/5 py-4 font-display text-lg font-semibold"
              >
                {t.nav[item.id]}
              </a>
            ))}
            <ButtonLink
              href={primaryCta}
              target={ctaExternal ? "_blank" : undefined}
              rel={ctaExternal ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="mt-6"
            >
              <CalendarIcon />
              {primaryLabel}
            </ButtonLink>
          </nav>
        </div>
      )}
    </header>
  );
}

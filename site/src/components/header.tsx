"use client";

import { useEffect, useState } from "react";
import { booking, bookingNavItem, business, nav, telLink } from "@/content/site";
import { ButtonLink, CalendarIcon, Logo, PhoneIcon } from "./ui";

/** Pozycja „Rezerwacja” pojawia się dopiero, gdy kalendarz jest skonfigurowany. */
const navItems = booking.enabled
  ? [...nav.slice(0, -1), bookingNavItem, nav[nav.length - 1]]
  : nav;

export function Header() {
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

  // Kalendarz na stronie ma pierwszeństwo nad rezerwacją zewnętrzną.
  const primaryCta = booking.enabled
    ? "#rezerwacja"
    : business.booksyUrl || telLink || "#kontakt";
  const primaryLabel = booking.enabled
    ? "Umów wizytę"
    : business.booksyUrl
      ? "Rezerwuj w Booksy"
      : "Umów wizytę";
  const ctaExternal = !booking.enabled && Boolean(business.booksyUrl);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-paper/92 backdrop-blur-sm"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <a href="#top" aria-label="LETFIT — strona główna" className="shrink-0">
          <Logo variant="horizontal" className="h-12 w-auto md:h-14" priority />
        </a>

        <nav aria-label="Główna" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink-60 transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-blue after:transition-all hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {telLink && (
            <a
              href={telLink}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-blue"
            >
              <PhoneIcon />
              {business.phoneDisplay}
            </a>
          )}
          <ButtonLink
            href={primaryCta}
            target={ctaExternal ? "_blank" : undefined}
            rel={ctaExternal ? "noopener noreferrer" : undefined}
            className="px-5 py-3"
          >
            <CalendarIcon />
            {primaryLabel}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobilne"
          className="-mr-2 grid size-11 place-items-center rounded-full text-ink md:hidden"
        >
          <span className="sr-only">{open ? "Zamknij menu" : "Otwórz menu"}</span>
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

      {open && (
        <div
          id="menu-mobilne"
          className="min-h-[calc(100dvh-5rem)] border-t border-ink/10 bg-paper md:hidden"
        >
          <nav aria-label="Mobilna" className="container-x flex flex-col py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-ink/5 py-4 font-display text-lg font-semibold"
              >
                {item.label}
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

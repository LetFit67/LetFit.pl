"use client";

import { LocaleProvider, useT, type PageTitle } from "@/lib/i18n";
import { Contact, Footer, MobileCtaBar } from "./contact";
import { Header } from "./header";
import { Booking } from "./booking";
import { Collaborations, Hero } from "./hero";
import {
  About,
  Equipment,
  Faq,
  ForWhom,
  Portfolio,
  Pricing,
  Process,
  Services,
  Testimonials,
} from "./sections";

/**
 * GRANICA KLIENTA DLA CAŁEJ STRONY GŁÓWNEJ.
 *
 * Przełącznik języka podmienia treść bez przeładowania, więc każdy komponent
 * z tekstem musi umieć się przerysować — a to znaczy: musi być po stronie
 * klienta. Directive `"use client"` postawiona tutaj wciąga w pakiet kliencki
 * wszystko, co ten plik importuje, więc nie trzeba jej powtarzać w każdej sekcji.
 *
 * Cena jest znana i zaakceptowana: strona nie ma danych do pobrania ani
 * sekretów do ukrycia, a cały jej JavaScript to i tak animacje, formularz
 * i menu. Poza tą granicą zostaje `JsonLd` — dane strukturalne mają zostać
 * na serwerze i po polsku (patrz komentarz w tamtym pliku).
 */

const homeTitle: PageTitle = (t) => t.seo.title;

export function SiteShell() {
  return (
    <LocaleProvider title={homeTitle}>
      <SkipLink />
      <Header />

      {/* Zapas na dole pod przyklejony pasek CTA na mobile. */}
      <main id="tresc" className="flex-1 pb-20 md:pb-0">
        <Hero />
        <Collaborations />
        <ForWhom />
        {/* Opinie idą PRZED zakresem opieki: pacjent najpierw rozpoznaje swój
            problem („Dla kogo”), potem widzi, że komuś takiemu jak on to
            pomogło, i dopiero wtedy czyta, co konkretnie się robi. */}
        <Testimonials />
        <Services />
        <Equipment />
        <Process />
        <About />
        <Portfolio />
        <Pricing />
        <Faq />
        <Booking />
        <Contact />
      </main>

      <Footer />
      <MobileCtaBar />
    </LocaleProvider>
  );
}

/** Skrót do treści dla klawiatury. Renderuje się już pod providerem. */
function SkipLink() {
  const { ui } = useT();

  return (
    <a
      href="#tresc"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
    >
      {ui.skipToContent}
    </a>
  );
}

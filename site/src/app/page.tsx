import { Contact, Footer, MobileCtaBar } from "@/components/contact";
import { Header } from "@/components/header";
import { Booking } from "@/components/booking";
import { Collaborations, Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import {
  About,
  Faq,
  ForWhom,
  Portfolio,
  Pricing,
  Process,
  Services,
  Testimonials,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <JsonLd />
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-paper"
      >
        Przejdź do treści
      </a>

      <Header />

      {/* Zapas na dole pod przyklejony pasek CTA na mobile. */}
      <main id="tresc" className="flex-1 pb-20 md:pb-0">
        <Hero />
        <Collaborations />
        <ForWhom />
        <Services />
        <Process />
        <About />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <Faq />
        <Booking />
        <Contact />
      </main>

      <Footer />
      <MobileCtaBar />
    </>
  );
}

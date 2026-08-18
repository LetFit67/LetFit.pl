"use client";

import { business } from "@/content/site";
import { useT } from "@/lib/i18n";
import { BookingForm } from "./booking-form";
import { ButtonLink, CalendarIcon, Eyebrow, Lead, SectionHeading } from "./ui";

/**
 * Sekcja zgłoszenia wizyty.
 *
 * Zastąpiła osadzony kalendarz Cal.com. Tamten był prawdziwą rezerwacją, ale
 * wymagał konta, synchronizacji kalendarza i konfiguracji pytań formularza —
 * Mikołaj wolał prostsze rozwiązanie. Tutaj pacjent zostawia zgłoszenie
 * z proponowanym terminem, a potwierdzenie idzie ręcznie.
 *
 * Sekcja renderuje się zawsze: formularz działa niezależnie od tego, czy
 * uzupełniono już telefon i e-mail. Sama wysyłka jest wtedy wyłączona
 * i mówi o tym wprost — patrz `BookingForm`.
 */
export function Booking() {
  const { booking } = useT();

  return (
    <section id="rezerwacja" className="bg-mist py-20 md:py-28">
      <div className="container-x">
        <Eyebrow>{booking.eyebrow}</Eyebrow>
        <SectionHeading>{booking.heading}</SectionHeading>
        <Lead>{booking.lead}</Lead>

        {/* Notka o lokalizacji razem z wyjściem do Booksy. Bez przycisku
            pacjent szukający terminu w Wesołej czytał, że ma rezerwować przez
            Booksy, i nie miał w co kliknąć. */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {booking.locationNote && (
            <p className="rounded-btn border border-ink/15 bg-paper px-3 py-2 text-sm text-ink-60">
              {booking.locationNote}
            </p>
          )}
          {business.booksyUrl && booking.booksyLabel && (
            <ButtonLink
              href={business.booksyUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="px-4 py-2.5"
            >
              <CalendarIcon />
              {booking.booksyLabel}
            </ButtonLink>
          )}
        </div>

        {/* Notka o prywatności i wyjście na telefon siedzą WEWNĄTRZ formularza,
            w lewej kolumnie pod polami — patrz booking-form.tsx. Karta z terminem
            jest wyższa od karty z danymi, więc pod danymi zostawała pusta
            kolumna; te dwa bloki ją domykają. */}
        <BookingForm />
      </div>
    </section>
  );
}

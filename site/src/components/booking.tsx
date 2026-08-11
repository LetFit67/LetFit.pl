import { booking } from "@/content/site";
import { BookingForm } from "./booking-form";
import { Eyebrow, Lead, SectionHeading } from "./ui";

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
  return (
    <section id="rezerwacja" className="bg-mist py-20 md:py-28">
      <div className="container-x">
        <Eyebrow>{booking.eyebrow}</Eyebrow>
        <SectionHeading>{booking.heading}</SectionHeading>
        <Lead>{booking.lead}</Lead>

        {booking.locationNote && (
          <p className="mt-4 inline-flex rounded-btn border border-ink/15 bg-paper px-3 py-2 text-sm text-ink-60">
            {booking.locationNote}
          </p>
        )}

        <BookingForm />

        {booking.privacyNote && (
          <p className="mt-6 max-w-2xl text-sm text-ink-40">{booking.privacyNote}</p>
        )}
      </div>
    </section>
  );
}

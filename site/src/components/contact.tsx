import { booking, business, contact, isTodo, telLink, waLink } from "@/content/site";
import type { Location } from "@/content/site";
import { AuthorCard } from "./author-card";
import {
  ButtonLink,
  CalendarIcon,
  ClockIcon,
  Eyebrow,
  HomeIcon,
  Logo,
  MailIcon,
  PhoneIcon,
  PinIcon,
  SectionHeading,
  Val,
  WhatsAppIcon,
} from "./ui";

export function Contact() {
  const socials = Object.entries(business.social).filter(([, url]) => url);

  return (
    <section id="kontakt" className="bg-ink py-20 text-paper md:py-28">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow onDark>{contact.eyebrow}</Eyebrow>
            <SectionHeading>{contact.heading}</SectionHeading>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-paper/70">
              {contact.lead}
            </p>

            <div className="mt-9 flex flex-wrap gap-3 empty:mt-0">
              {booking.enabled && (
                <ButtonLink href="#rezerwacja" variant="accent">
                  <CalendarIcon />
                  Wybierz termin
                </ButtonLink>
              )}
              {telLink && (
                <ButtonLink href={telLink} variant="ghost-dark">
                  <PhoneIcon />
                  Zadzwoń
                </ButtonLink>
              )}
              {waLink && (
                <ButtonLink
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="ghost-dark"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </ButtonLink>
              )}
            </div>

            {socials.length > 0 && (
              <div className="mt-10 border-t border-paper/15 pt-6">
                <p className="text-xs tracking-[0.18em] text-paper/45 uppercase">
                  Znajdziesz mnie też tu
                </p>
                <div className="mt-3 flex gap-5">
                  {socials.map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-paper/80 capitalize transition-colors hover:text-blue-bright"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-card border border-paper/15 bg-paper/[0.04] p-8 md:p-10">
            <dl className="space-y-7">
              <Row icon={<PhoneIcon className="size-5" />} label="Telefon">
                {telLink ? (
                  <a href={telLink} className="hover:text-blue-bright">
                    {business.phoneDisplay}
                  </a>
                ) : (
                  <Val>{business.phoneDisplay}</Val>
                )}
              </Row>

              <Row icon={<MailIcon className="size-5" />} label="E-mail">
                {/* Adres jest klikalny tak samo jak telefon — dopóki jest
                    prawdziwy. Znacznik [UZUPEŁNIJ] nie może zostać odnośnikiem,
                    bo `mailto:` z placeholderem otwiera pustą wiadomość. */}
                {isTodo(business.email) ? (
                  <Val>{business.email}</Val>
                ) : (
                  <a
                    href={`mailto:${business.email}`}
                    className="break-all hover:text-blue-bright"
                  >
                    {business.email}
                  </a>
                )}
              </Row>

              <Row
                icon={<HomeIcon className="size-5" />}
                label={business.homeVisits.label}
              >
                <p className="text-[15px] leading-relaxed text-paper/80">
                  {business.homeVisits.detail}
                </p>
              </Row>
            </dl>
          </div>
        </div>

        {/* Dwie lokalizacje — każda z własnym kanałem rezerwacji, żeby pacjent
            nie umówił się pod złym adresem. */}
        {business.locations.length > 0 && (
          /* `items-start` zamiast rozciągania na równą wysokość: kartę w Markach
             wydłuża osadzona mapa, a bez tego karta Kliniki Sosnowej dostawała
             kilkaset pikseli pustego dna. Lepiej dwie karty różnej wysokości niż
             jedna do połowy pusta. */
          <div className="mt-14 grid items-start gap-6 border-t border-paper/15 pt-14 md:grid-cols-2">
            {business.locations.map((loc) => (
              <LocationCard key={`${loc.street}-${loc.city}`} location={loc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LocationCard({ location }: { location: Location }) {
  return (
    <article className="flex flex-col rounded-card border border-paper/15 p-8">
      <div className="flex items-start gap-4">
        <PinIcon className="mt-1 size-5 shrink-0 text-blue-bright" />
        <div className="min-w-0 flex-1">
          {location.badge && (
            <p className="text-xs tracking-[0.18em] text-paper/45 uppercase">
              {location.badge}
            </p>
          )}
          {location.name && (
            <p className="mt-1.5 font-display text-lg font-semibold">{location.name}</p>
          )}
          <p className={location.name ? "mt-1" : "mt-1.5"}>
            <Val>{location.street}</Val>
          </p>
          <p>
            <Val>{location.postalCode}</Val> <Val>{location.city}</Val>
          </p>
          {location.hint && <p className="mt-2 text-sm text-paper/50">{location.hint}</p>}
        </div>
      </div>

      {location.hours.length > 0 && (
        <div className="mt-6 flex items-start gap-4 border-t border-paper/10 pt-5">
          <ClockIcon className="mt-1 size-5 shrink-0 text-blue-bright" />
          <ul className="min-w-0 flex-1 space-y-1.5 text-[15px]">
            {location.hours.map((h) => (
              <li key={h.day} className="flex flex-wrap justify-between gap-x-6">
                <span className="text-paper/70">{h.day}</span>
                <span className="font-semibold">
                  <Val>{h.value}</Val>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {location.mapsUrl && (
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-bright underline-offset-4 hover:underline"
          >
            Nawiguj →
          </a>
        )}
        {location.bookingUrl ? (
          <a
            href={location.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-bright underline-offset-4 hover:underline"
          >
            {location.bookingLabel || "Rezerwuj"} →
          </a>
        ) : (
          booking.enabled && (
            <a
              href="#rezerwacja"
              className="text-sm font-semibold text-blue-bright underline-offset-4 hover:underline"
            >
              Wybierz termin →
            </a>
          )
        )}
      </div>

      {location.mapsEmbedUrl && (
        <div className="mt-6 overflow-hidden rounded-card border border-paper/15">
          <iframe
            src={location.mapsEmbedUrl}
            title={`Mapa dojazdu: ${location.city}, ${location.street}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="block h-64 w-full border-0"
          />
        </div>
      )}
    </article>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 shrink-0 text-blue-bright" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs tracking-[0.18em] text-paper/45 uppercase">{label}</dt>
        <dd className="mt-1.5 leading-relaxed">{children}</dd>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STOPKA                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-paper py-12">
      <div className="container-x flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <Logo variant="horizontal" className="h-12 w-auto" />
          <p className="mt-4 text-sm text-ink-40">
            <Val>{business.legal.companyName}</Val> · NIP <Val>{business.legal.nip}</Val>
          </p>
        </div>

        <div className="w-full text-sm text-ink-40 sm:w-auto sm:text-right">
          <a
            href="/polityka-prywatnosci"
            className="font-medium text-ink-60 hover:text-ink"
          >
            Polityka prywatności
          </a>
          <p className="mt-2">
            © {year} {business.brand} · {business.person}
          </p>

          {/* Podpis wykonawcy — kafelek z rozwijanymi szczegółami. */}
          <div className="mt-5 flex flex-col items-start gap-2 sm:items-end">
            <p className="text-xs tracking-[0.18em] text-ink-40 uppercase">
              Strona stworzona przez
            </p>
            <AuthorCard />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* PASEK CTA NA MOBILE                                                 */
/* ------------------------------------------------------------------ */

export function MobileCtaBar() {
  const secondary = booking.enabled
    ? { href: "#rezerwacja", label: "Wybierz termin", external: false }
    : business.booksyUrl
      ? { href: business.booksyUrl, label: "Booksy", external: true }
      : waLink
        ? { href: waLink, label: "WhatsApp", external: true }
        : null;

  if (!telLink && !secondary) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur-sm md:hidden">
      <div className="flex gap-2">
        {telLink && (
          <ButtonLink href={telLink} className="flex-1 px-4 py-3">
            <PhoneIcon />
            Zadzwoń
          </ButtonLink>
        )}
        {secondary && (
          <ButtonLink
            href={secondary.href}
            target={secondary.external ? "_blank" : undefined}
            rel={secondary.external ? "noopener noreferrer" : undefined}
            variant={telLink ? "outline" : "primary"}
            className="flex-1 px-4 py-3"
          >
            <CalendarIcon />
            {secondary.label}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { bookingConfig, business } from "@/content/site";
import { LocaleProvider, useT, type PageTitle } from "@/lib/i18n";
import { Footer } from "./contact";
import { Header } from "./header";
import { Val } from "./ui";

/**
 * Polityka prywatności — treść w obu językach, ta sama granica klienta
 * co na stronie głównej (patrz site-shell.tsx).
 *
 * Wersja angielska jest tłumaczeniem tego samego dokumentu, nie osobną
 * polityką: podstawy prawne (RODO, przepisy o dokumentacji medycznej)
 * są identyczne, zmienia się wyłącznie język.
 */

const privacyTitle: PageTitle = (t) => `${t.privacy.title} | LETFIT`;

export function PrivacyShell() {
  return (
    <LocaleProvider title={privacyTitle}>
      <Header />
      <PrivacyBody />
      <Footer />
    </LocaleProvider>
  );
}

function PrivacyBody() {
  const t = useT();
  const p = t.privacy;
  // Siedzibą jest gabinet główny — pierwsza lokalizacja na liście.
  const seat = business.locations[0];

  return (
    <main className="flex-1 py-16 md:py-24">
      <div className="container-x max-w-3xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{p.title}</h1>

        {p.draftNotice && (
          <div className="mt-4 rounded-card border border-dashed border-blue/60 bg-blue-soft p-5 text-sm leading-relaxed text-ink-80">
            <strong className="font-display">{p.draftTitle}</strong> {p.draftNotice}
          </div>
        )}

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-60 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <section>
            <h2>{p.controllerHeading}</h2>
            <p>
              {p.controllerIntro} <Val>{business.legal.companyName}</Val>,{" "}
              {p.controllerNip} <Val>{business.legal.nip}</Val>, {p.controllerSeat}{" "}
              <Val>{seat.street}</Val>, <Val>{seat.postalCode}</Val>{" "}
              <Val>{seat.city}</Val>.
            </p>
            <p>
              {p.controllerContact} <Val>{business.email}</Val>,{" "}
              <Val>{business.phoneDisplay}</Val>.
            </p>
          </section>

          <section>
            <h2>{p.dataHeading}</h2>
            <ul>
              <li>
                <strong>{p.dataVisitLabel}</strong>: {p.dataVisit}
              </li>
              <li>
                <strong>{p.dataRecordsLabel}</strong>: {p.dataRecords}
              </li>
              <li>
                <strong>{p.dataBillingLabel}</strong>: {p.dataBilling}
              </li>
              {bookingConfig.enabled && (
                <li>
                  <strong>{p.dataFormLabel}</strong>: {p.dataForm}
                </li>
              )}
            </ul>
          </section>

          <section>
            <h2>{p.retentionHeading}</h2>
            <p>{p.retention}</p>
          </section>

          <section>
            <h2>{p.recipientsHeading}</h2>
            <p>{p.recipients}</p>
            <p className="rounded-lg bg-mist-dim p-4">
              <Val>{p.recipientsTodo}</Val>
            </p>
          </section>

          <section>
            <h2>{p.rightsHeading}</h2>
            <p>{p.rights}</p>
            <p>{p.rightsComplaint}</p>
          </section>

          <section>
            <h2>{p.mapHeading}</h2>
            <p>{p.map}</p>
          </section>

          <section>
            <h2>{p.cookiesHeading}</h2>
            <p>{p.cookies}</p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-blue"
        >
          ← {t.ui.backHome}
        </Link>
      </div>
    </main>
  );
}

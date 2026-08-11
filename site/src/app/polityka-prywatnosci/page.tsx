import type { Metadata } from "next";
import Link from "next/link";
import { booking, business } from "@/content/site";
import { Footer } from "@/components/contact";
import { Header } from "@/components/header";
import { Val } from "@/components/ui";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Informacja o przetwarzaniu danych osobowych przez gabinet fizjoterapii LETFIT.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  // Siedzibą jest gabinet główny — pierwsza lokalizacja na liście.
  const seat = business.locations[0];

  return (
    <>
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container-x max-w-3xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Polityka prywatności</h1>

          <div className="mt-4 rounded-card border border-dashed border-blue/60 bg-blue-soft p-5 text-sm leading-relaxed text-ink-80">
            <strong className="font-display">Do weryfikacji przed publikacją.</strong>{" "}
            To szkielet oparty na typowych obowiązkach gabinetu fizjoterapii (RODO
            + dokumentacja medyczna). Nie jest to porada prawna — przed
            opublikowaniem strony przejrzyj go i dopasuj do tego, jak faktycznie
            przetwarzasz dane. Usuń tę ramkę, gdy skończysz.
          </div>

          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-60 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
            <section>
              <h2>Administrator danych</h2>
              <p>
                Administratorem twoich danych osobowych jest{" "}
                <Val>{business.legal.companyName}</Val>, NIP{" "}
                <Val>{business.legal.nip}</Val>, z siedzibą przy{" "}
                <Val>{seat.street}</Val>, <Val>{seat.postalCode}</Val>{" "}
                <Val>{seat.city}</Val>.
              </p>
              <p>
                Kontakt w sprawie danych: <Val>{business.email}</Val>,{" "}
                <Val>{business.phoneDisplay}</Val>.
              </p>
            </section>

            <section>
              <h2>Jakie dane zbieram i po co</h2>
              <ul>
                <li>
                  <strong>Umówienie i realizacja wizyty</strong> — imię, nazwisko,
                  numer telefonu, adres e-mail. Podstawa: podjęcie działań przed
                  zawarciem umowy oraz jej wykonanie (art. 6 ust. 1 lit. b RODO).
                </li>
                <li>
                  <strong>Dokumentacja z terapii</strong> — dane o stanie zdrowia,
                  wywiad, wyniki badań i przebieg terapii. Podstawa: art. 9 ust. 2
                  lit. h RODO w związku z przepisami o działalności leczniczej i
                  dokumentacji medycznej.
                </li>
                <li>
                  <strong>Rozliczenia</strong> — dane niezbędne do wystawienia
                  paragonu lub faktury. Podstawa: obowiązek prawny (art. 6 ust. 1
                  lit. c RODO).
                </li>
                {booking.enabled && (
                  <li>
                    <strong>Zgłoszenie wizyty przez stronę</strong> — imię, nazwisko,
                    wybrana usługa, proponowany termin i krótki opis dolegliwości.
                    Formularz niczego nie wysyła sam i nie zapisuje danych na serwerze:
                    składa z nich gotową wiadomość, którą wysyłasz ze swojego telefonu
                    przez WhatsAppa albo ze swojej skrzynki e-mail. Trafia ona
                    bezpośrednio do mnie, a pośrednikiem jest wyłącznie dostawca
                    komunikatora lub poczty, z którego korzystasz. Jeśli wolisz nie
                    opisywać dolegliwości na piśmie, zadzwoń — opowiesz o nich na wizycie.
                  </li>
                )}
              </ul>
            </section>

            <section>
              <h2>Jak długo przechowuję dane</h2>
              <p>
                Dokumentację medyczną przechowuję przez okres wymagany przepisami
                o prawach pacjenta i dokumentacji medycznej. Dane rozliczeniowe —
                przez okres wymagany przepisami podatkowymi. Pozostałe dane
                kontaktowe usuwam, gdy przestają być potrzebne.
              </p>
            </section>

            <section>
              <h2>Komu przekazuję dane</h2>
              <p>
                Wyłącznie podmiotom, które są niezbędne do prowadzenia gabinetu:
                dostawcy systemu rezerwacji, biuro rachunkowe, dostawca hostingu i
                poczty. Każdy z nich działa na podstawie umowy powierzenia albo
                własnego obowiązku prawnego. Danych nie sprzedaję i nie przekazuję
                do celów marketingowych podmiotom trzecim.
              </p>
              <p className="rounded-lg bg-mist-dim p-4">
                <Val>
                  [UZUPEŁNIJ: wypisz konkretnych odbiorców — np. Booksy, biuro
                  rachunkowe, dostawca hostingu]
                </Val>
              </p>
            </section>

            <section>
              <h2>Twoje prawa</h2>
              <p>
                Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia
                lub ograniczenia przetwarzania, prawo do przenoszenia danych oraz
                prawo sprzeciwu wobec przetwarzania. W przypadku dokumentacji
                medycznej część tych praw jest ograniczona przepisami, które
                nakazują mi jej przechowywanie.
              </p>
              <p>
                Przysługuje ci również skarga do Prezesa Urzędu Ochrony Danych
                Osobowych, ul. Stawki 2, 00-193 Warszawa.
              </p>
            </section>

            <section>
              <h2>Mapa dojazdu</h2>
              <p>
                Przy adresie gabinetu osadzona jest mapa Google. Jej wyświetlenie
                oznacza połączenie twojej przeglądarki z serwerami Google, które
                mogą przy tej okazji odczytać adres IP i zapisać własne pliki
                cookie — dzieje się to niezależnie ode mnie. Jeśli wolisz tego
                uniknąć, skorzystaj z przycisku „Nawiguj”, który otwiera mapę
                dopiero po kliknięciu.
              </p>
            </section>

            <section>
              <h2>Pliki cookie i statystyki</h2>
              <p>
                Ta strona nie używa własnych plików cookie do śledzenia i nie
                osadza narzędzi analitycznych. Jedyną treścią zewnętrzną jest
                opisana wyżej mapa — formularz zgłoszenia działa w całości
                w twojej przeglądarce i nie łączy się z żadnym serwisem. Jeżeli
                w przyszłości dodane zostaną statystyki odwiedzin lub piksele
                reklamowe, ta sekcja zostanie zaktualizowana, a przed ich
                uruchomieniem pojawi się prośba o zgodę.
              </p>
            </section>
          </div>

          <Link
            href="/"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-blue"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

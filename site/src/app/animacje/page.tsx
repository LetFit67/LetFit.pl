import type { Metadata } from "next";
import Link from "next/link";
import {
  PostureLine,
  RangeOfMotion,
  SpineScan,
} from "@/components/hero-animations";

export const metadata: Metadata = {
  title: "Propozycje animacji hero",
  robots: { index: false, follow: false },
};

const OPTIONS = [
  {
    key: "A",
    name: "Kręgosłup diagnostyczny",
    idea: "Sygnał schodzi kolejnymi kręgami z góry na dół. W odcinku lędźwiowym jeden krąg świeci na czerwono i pulsuje z rozchodzącą się poświatą.",
    reads: "Najbardziej dosłownie mówi „kręgosłup i ból”. Nawiązuje do sylwetki pleców, więc jest najbliżej tego, czym zajmuje się gabinet.",
    Figure: SpineScan,
  },
  {
    key: "B",
    name: "Zakres ruchu",
    idea: "Ramię goniometru unosi się i opada w stałym rytmie, a łuk kąta wypełnia się dokładnie razem z nim.",
    reads: "Czysty pomiar, najmniej dosłowny i najbardziej geometryczny. Mówi o odzyskiwaniu ruchomości, a nie o bólu.",
    Figure: RangeOfMotion,
  },
  {
    key: "C",
    name: "Pion postawy",
    idea: "Punkty kostne — głowa, barki, miednica, kolana, stopy — zjeżdżają się do pionu odniesienia, a po chwili wracają do odchylenia.",
    reads: "Pokazuje ocenę i korektę postawy, czyli jedną z usług z cennika. Najbardziej „gabinetowy”, najmniej ozdobny.",
    Figure: PostureLine,
  },
];

export default function AnimationsPreviewPage() {
  return (
    <main className="flex-1 py-16 md:py-24">
      <div className="container-x">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-ink-60 uppercase">
          <span aria-hidden="true" className="h-px w-8 bg-blue/60" />
          Do wyboru
        </p>
        <h1 className="max-w-3xl text-3xl leading-[1.15] font-semibold sm:text-4xl">
          Trzy propozycje grafiki do sekcji hero
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-60">
          Każda jest rysunkiem wektorowym z animacją CSS — ostra w każdej
          rozdzielczości, waży kilka kilobajtów i nie wymaga wczytywania wideo.
          Kadr odpowiada temu, co widać na stronie po prawej stronie tekstu.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {OPTIONS.map(({ key, name, idea, reads, Figure }) => (
            <section key={key}>
              <div className="relative aspect-4/5 overflow-hidden rounded-card border border-ink/10 bg-mist p-8">
                <Figure />
              </div>
              <h2 className="mt-5 text-xl font-semibold">
                <span className="text-blue">{key}.</span> {name}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-60">{idea}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-40">{reads}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 rounded-card border border-ink/12 bg-mist p-6 text-[15px] leading-relaxed text-ink-60">
          To strona robocza — nie jest podlinkowana z nawigacji i ma ustawiony
          zakaz indeksowania. Po wyborze wariantu wstawiam go do hero i usuwam tę
          stronę razem z dwoma niewykorzystanymi grafikami.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-blue"
        >
          ← Wróć na stronę główną
        </Link>
      </div>
    </main>
  );
}

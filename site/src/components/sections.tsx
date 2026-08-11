import type { CSSProperties } from "react";
import Image from "next/image";
import {
  about,
  faq,
  forWhom,
  portfolio,
  pricing,
  process,
  services,
  testimonials,
} from "@/content/site";
import { ExpandHint, HoverReveal } from "./hover-reveal";
import { ForWhomGrid } from "./for-whom";
import { PhotoPlaceholder } from "./hero";
import { StaggerList } from "./stagger";
import {
  ArrowIcon,
  CheckIcon,
  Eyebrow,
  Lead,
  Section,
  SectionHeading,
  Val,
} from "./ui";

/* ------------------------------------------------------------------ */
/* DLA KOGO                                                            */
/* ------------------------------------------------------------------ */

export function ForWhom() {
  return (
    <Section id="dla-kogo" tone="mist">
      <div>
        <Eyebrow>{forWhom.eyebrow}</Eyebrow>
        <SectionHeading>{forWhom.heading}</SectionHeading>
      </div>

      <ForWhomGrid items={forWhom.items} />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* ZAKRES OPIEKI                                                       */
/* ------------------------------------------------------------------ */

export function Services() {
  return (
    <Section id="uslugi">
      <div>
        <Eyebrow>{services.eyebrow}</Eyebrow>
        <SectionHeading>{services.heading}</SectionHeading>
        <Lead>{services.lead}</Lead>
      </div>

      {/* Karty siedzą na wspólnym ciemnym podkładzie i są rozdzielone samą
          szczeliną `gap-px`, więc nie mogą mieć własnego tła przezroczystego —
          każdy prześwit odsłania podkład. Stąd `bg-paper` na karcie
          i `hover:bg-mist` zamiast przyciemniania kryciem. */}
      <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-ink/12 bg-ink/12 sm:grid-cols-2 xl:grid-cols-4">
        {services.items.map((item, i) => (
          <article
            key={item.slug}
            className="group relative isolate flex flex-col overflow-hidden bg-paper p-8 transition-colors duration-300 hover:bg-mist"
          >
            {/* Błękitna listwa wyjeżdżająca od lewej — jedyny ruch w tej sekcji,
                więc trzyma uwagę bez rozpraszania. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-blue transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            {/* Wielka cyfra w tle. Krycie jest ledwie widoczne — ma budować
                głębię, a nie konkurować z treścią. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 -bottom-6 -z-10 font-display text-[8rem] leading-none font-semibold text-ink/[0.04] transition-colors duration-500 select-none group-hover:text-blue/[0.09]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              aria-hidden="true"
              className="flex items-center gap-3 font-display text-sm font-semibold tracking-[0.2em] text-blue"
            >
              {String(i + 1).padStart(2, "0")}
              <span className="h-px w-6 origin-left scale-x-0 bg-blue/50 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            {/* min-h na tytule i leadzie wyrównuje linie działowe w rzędzie kart */}
            <h3 className="mt-4 text-xl leading-snug font-semibold sm:min-h-[3.5rem]">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-60 sm:min-h-[7rem] xl:min-h-[8.5rem]">
              {item.summary}
            </p>

            <ul className="mt-6 space-y-2.5 border-t border-ink/12 pt-6">
              {item.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-ink-80">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-blue" />
                  {p}
                </li>
              ))}
            </ul>

            <a
              href="#rezerwacja"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-blue"
            >
              Umów wizytę
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </article>
        ))}
      </div>

      {services.online.title && (
        <div className="mt-6 rounded-card border border-ink/12 bg-mist p-8 md:p-10">
          <h3 className="text-2xl font-semibold">{services.online.title}</h3>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-60">
            {services.online.lead}
          </p>
          <dl className="mt-8 grid gap-8 border-t border-ink/12 pt-8 md:grid-cols-3">
            {services.online.points.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-[17px] font-semibold">{p.title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink-60">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* PRZEBIEG WIZYTY                                                     */
/* ------------------------------------------------------------------ */

export function Process() {
  return (
    <Section id="wizyta" tone="ink">
      <div>
        <Eyebrow onDark>{process.eyebrow}</Eyebrow>
        <SectionHeading>{process.heading}</SectionHeading>
      </div>

      <StaggerList className="mt-14 grid gap-px overflow-hidden rounded-card bg-paper/20 sm:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, i) => (
          <li key={step.title} className="bg-ink p-8">
            {/* Animujemy zawartość, a nie kafel — kafle tworzą siatkę gap-px,
                więc wygaszenie <li> odsłoniłoby jasne tło spod spodu. */}
            <div className="stagger-item" style={{ "--i": i } as CSSProperties}>
              <span
                aria-hidden="true"
                className="block font-display text-4xl leading-none font-semibold tabular-nums text-blue-bright"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-paper">{step.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-paper/65">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </StaggerList>

      {process.note && (
        <p className="mt-8 text-sm text-paper/55">{process.note}</p>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* O MNIE                                                              */
/* ------------------------------------------------------------------ */

export function About() {
  return (
    <Section id="o-mnie">
      {/* Tekst jest krótki, a portret wysoki, więc przy `items-start` pod
          akapitami zostawała pusta kolumna na 250 px. Kolumny wyrównane do
          środka, portret węższy (a przez stałą proporcję — niższy), a tekst
          zwężony do miary czytelniczej, dzięki czemu łamie się na więcej
          wierszy i obie kolumny kończą się w podobnym miejscu. */}
      <div className="grid items-center gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        {/* Kadr 3:4 zgodny z proporcją portretu — dzięki temu nic nie jest przycięte. */}
        <div className="relative aspect-3/4 overflow-hidden rounded-card border border-ink/10 bg-mist-dim">
          {about.photo ? (
            <Image
              src={about.photo}
              alt={about.photoAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <PhotoPlaceholder
              label="Portret Mikołaja"
              hint="about.photo w src/content/site.ts"
            />
          )}
        </div>

        <div>
          <Eyebrow>{about.eyebrow}</Eyebrow>
          <SectionHeading>{about.heading}</SectionHeading>

          <div className="mt-6 max-w-[46ch] space-y-5 text-lg leading-relaxed text-ink-60 lg:text-xl">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                <Val>{p}</Val>
              </p>
            ))}
          </div>

          {about.credentials.length > 0 && (
            <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-ink/12 pt-8 sm:grid-cols-2">
              {about.credentials.map((c) => (
                <div key={c.title}>
                  <dt className="font-display text-[15px] font-semibold">{c.title}</dt>
                  {c.detail && <dd className="mt-1 text-sm text-ink-40">{c.detail}</dd>}
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* METAMORFOZY                                                         */
/* ------------------------------------------------------------------ */

export function Portfolio() {
  // Bez prawdziwych metamorfoz sekcja w ogóle się nie renderuje.
  if (portfolio.items.length === 0) return null;

  return (
    <Section id="metamorfozy" tone="mist">
      <div>
        <Eyebrow>{portfolio.eyebrow}</Eyebrow>
        <SectionHeading>{portfolio.heading}</SectionHeading>
        <Lead>{portfolio.lead}</Lead>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {portfolio.items.map((item) => (
          <figure
            key={item.name}
            className="overflow-hidden rounded-card border border-ink/12 bg-paper"
          >
            <div className="grid grid-cols-2 gap-px bg-ink/12">
              {(
                [
                  { src: item.before, label: "Przed" },
                  { src: item.after, label: "Po" },
                ] as const
              ).map((side) => (
                <div key={side.label} className="relative aspect-3/4 bg-mist-dim">
                  <Image
                    src={side.src}
                    alt={`${item.name} — ${side.label.toLowerCase()}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 rounded-btn bg-ink/80 px-2 py-1 text-[11px] font-semibold tracking-wide text-paper uppercase">
                    {side.label}
                  </span>
                </div>
              ))}
            </div>

            <figcaption className="p-6">
              <p className="font-display text-lg font-semibold">
                {item.name} <span className="text-ink-40">· {item.duration}</span>
              </p>
              <p className="mt-1 text-sm text-ink-40">{item.context}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-60">{item.summary}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* CENNIK                                                              */
/* ------------------------------------------------------------------ */

export function Pricing() {
  return (
    <Section id="cennik" tone="mist">
      <div>
        <Eyebrow>{pricing.eyebrow}</Eyebrow>
        <SectionHeading>{pricing.heading}</SectionHeading>
        <Lead>{pricing.lead}</Lead>
      </div>

      <ExpandHint
        className="mt-6"
        pointer={pricing.expandHintPointer}
        touch={pricing.expandHintTouch}
      />

      {/* `items-start`: grupy mają 3, 1 i 2 pozycje, więc przy równej wysokości
          karta „Postawa" świeciła 242 px pustego dna. Każda karta kończy się
          teraz tam, gdzie kończy się jej treść. */}
      <HoverReveal className="smooth-details mt-8 grid items-start gap-6 lg:grid-cols-3">
        {pricing.groups.map((group) => (
          <article
            key={group.name}
            /* min-w-0 pozwala karcie zwęzić się poniżej szerokości najdłuższej
               nierozdzielnej treści — bez tego długa cena rozpycha siatkę
               i strona przewija się w bok na wąskich ekranach. */
            className={`flex min-w-0 flex-col rounded-card p-6 md:p-8 ${
              group.featured
                ? "bg-ink text-paper"
                : "border border-ink/12 bg-paper text-ink"
            }`}
          >
            <h3 className="text-xl font-semibold">{group.name}</h3>

            <ul
              className={`mt-6 flex-1 divide-y ${
                group.featured ? "divide-paper/15" : "divide-ink/10"
              }`}
            >
              {group.items.map((item) => (
                <li key={`${item.name}-${item.duration}`}>
                  <details className="group">
                    {/* Cały wiersz jest celem dotyku — na telefonie nie ma sensu
                        celować w samą nazwę usługi. */}
                    <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-5 gap-y-1 py-4 [&::-webkit-details-marker]:hidden">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[15px] leading-snug font-medium">
                          <Val>{item.name}</Val>
                          <span
                            aria-hidden="true"
                            className={`inline-block shrink-0 text-[10px] leading-none transition-transform duration-200 group-open:rotate-180 ${
                              group.featured ? "text-paper/50" : "text-ink-40"
                            }`}
                          >
                            ▼
                          </span>
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            group.featured ? "text-paper/50" : "text-ink-40"
                          }`}
                        >
                          <Val>{item.duration}</Val>
                        </p>
                      </div>
                      <p className="shrink-0 font-display text-lg font-semibold whitespace-nowrap">
                        <Val>{item.price}</Val>
                      </p>
                    </summary>

                    {item.description && (
                      <p
                        className={`pb-4 text-[14px] leading-relaxed ${
                          group.featured ? "text-paper/70" : "text-ink-60"
                        }`}
                      >
                        {item.description}
                      </p>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </HoverReveal>

      {pricing.footnote && (
        <p className="mt-8 text-sm text-ink-40">{pricing.footnote}</p>
      )}
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* OPINIE                                                              */
/* ------------------------------------------------------------------ */

export function Testimonials() {
  // Bez prawdziwych opinii sekcja w ogóle się nie renderuje.
  if (testimonials.items.length === 0) return null;

  return (
    <Section id="opinie">
      <div>
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <SectionHeading>{testimonials.heading}</SectionHeading>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.items.map((t) => (
          <figure
            key={t.author}
            className="flex flex-col rounded-card border border-ink/12 bg-mist p-8"
          >
            <blockquote className="flex-1 text-[15px] leading-relaxed text-ink-80">
              „{t.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t border-ink/10 pt-4">
              <span className="font-display text-sm font-semibold">{t.author}</span>
              {t.context && (
                <span className="mt-0.5 block text-xs text-ink-40">{t.context}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function Faq() {
  return (
    /* Nagłówek szedł wcześniej w osobnej kolumnie obok listy. Przy ośmiu
       pytaniach kolumna z dwoma wierszami tekstu zostawiała obok siebie
       prawie ekran pustki, więc nagłówek wraca nad listę, a lista dostaje
       pełną szerokość. */
    <Section id="faq">
      <div>
        <div className="max-w-3xl">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <SectionHeading>{faq.heading}</SectionHeading>
        </div>

        <div className="mt-10">
          <ExpandHint
            className="mb-5"
            pointer={faq.expandHintPointer}
            touch={faq.expandHintTouch}
          />
          <HoverReveal className="smooth-details divide-y divide-ink/12 border-y border-ink/12">
            {faq.items.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-[17px] font-semibold [&::-webkit-details-marker]:hidden sm:gap-6">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="relative grid size-8 shrink-0 place-items-center rounded-btn border border-ink/20 transition-colors group-open:border-blue group-open:bg-blue group-open:text-paper"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="pr-2 pb-6 text-[15px] leading-relaxed text-ink-60 sm:pr-14">
                  {item.a}
                </p>
              </details>
            ))}
          </HoverReveal>
        </div>
      </div>
    </Section>
  );
}

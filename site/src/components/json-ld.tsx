import { business, faq, isTodo, pricing, seo, services } from "@/content/site";

/** Do structured data nie może trafić placeholder — takie pola po prostu pomijamy. */
const real = (v: string) => (v && !isTodo(v) ? v : undefined);

function clean<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")
  );
}

export function JsonLd() {
  // Adres główny to pierwsza lokalizacja; pozostałe idą jako oddziały.
  const toPostalAddress = (loc: (typeof business.locations)[number]) => {
    const streetAddress = real(loc.street);
    const addressLocality = real(loc.city);
    if (!streetAddress && !addressLocality) return undefined;
    return clean({
      "@type": "PostalAddress",
      streetAddress,
      addressLocality,
      postalCode: real(loc.postalCode),
      addressCountry: "PL",
    });
  };

  const [primaryLocation, ...otherLocations] = business.locations;
  const address = primaryLocation ? toPostalAddress(primaryLocation) : undefined;

  const branches = otherLocations
    .map((loc) => {
      const branchAddress = toPostalAddress(loc);
      if (!branchAddress) return undefined;
      return clean({
        "@type": "Physiotherapy",
        name: loc.name || `${business.brand} — ${loc.city}`,
        address: branchAddress,
      });
    })
    .filter(Boolean);

  const prices = pricing.groups
    .flatMap((g) => g.items.map((i) => parseInt(i.price.replace(/\s/g, ""), 10)))
    .filter((n) => Number.isFinite(n));

  const priceRange = prices.length
    ? `${Math.min(...prices)}–${Math.max(...prices)} zł`
    : undefined;

  const localBusiness = clean({
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: `${business.brand} — ${business.person}`,
    description: seo.description,
    url: seo.siteUrl,
    image: `${seo.siteUrl}/brand/letfit-avatar.svg`,
    telephone: business.phoneE164 || undefined,
    email: real(business.email),
    address,
    subOrganization: branches.length ? branches : undefined,
    priceRange,
    sameAs: [
      ...Object.values(business.social).filter(Boolean),
      business.booksyUrl,
    ].filter(Boolean),
    founder: {
      "@type": "Person",
      name: business.person,
      jobTitle: business.role,
    },
    makesOffer: services.items.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary },
    })),
  });

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { pl } from "@/content/pl";
import { siteUrl } from "@/content/site";
import { isPreview } from "@/lib/preview";
import "./globals.css";

/**
 * Szeryf do nagłówków — formalny, spokojny, z pełnymi polskimi znakami.
 * Marka wymaga tonu medycznego, nie sportowego, dlatego zamiast groteskowego
 * kroju wystawowego idziemy w typografię gabinetową.
 */
const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

/**
 * Metadane powstają na serwerze, więc są ZAWSZE polskie — dokładnie tak, jak
 * wersja, którą indeksuje Google. Po przełączeniu na angielski tytuł i opis
 * w dokumencie podmienia `LocaleProvider` (src/lib/i18n.tsx).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pl.seo.title,
    template: "%s | LETFIT",
  },
  description: pl.seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "LETFIT, Mikołaj Letkiewicz",
    title: pl.seo.title,
    description: pl.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: pl.seo.title,
    description: pl.seo.description,
  },
  /* Meta `robots` dubluje zakaz z `robots.txt` — ten plik można przeoczyć
     albo zignorować, a znacznik w <head> jedzie razem z każdą podstroną. */
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBFCFE",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${sourceSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

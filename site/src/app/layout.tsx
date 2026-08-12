import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { seo } from "@/content/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    template: "%s | LETFIT",
  },
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    siteName: "LETFIT, Mikołaj Letkiewicz",
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
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

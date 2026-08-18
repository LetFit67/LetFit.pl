import type { Metadata } from "next";
import { pl } from "@/content/pl";
import { PrivacyShell } from "@/components/privacy-shell";

/** Metadane wychodzą z serwera, więc są polskie — jak na stronie głównej. */
export const metadata: Metadata = {
  title: pl.privacy.title,
  description: pl.privacy.metaDescription,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyShell />;
}

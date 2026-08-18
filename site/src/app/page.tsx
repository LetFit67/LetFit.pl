import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";

/**
 * Strona jest jednym dokumentem w dwóch językach (PL/EN), przełączanym
 * w przeglądarce. Cała treść siedzi więc w `SiteShell`, czyli po stronie
 * klienta. Tutaj zostaje wyłącznie to, co ma pozostać na serwerze:
 * dane strukturalne dla wyszukiwarek.
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteShell />
    </>
  );
}

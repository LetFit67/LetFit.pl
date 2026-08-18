import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";
import { isPreview } from "@/lib/preview";

export default function robots(): MetadataRoute.Robots {
  // Podgląd pod adresem tymczasowym — zamykamy całość przed robotami
  // i nie podajemy mapy strony, żeby nie zapraszać ich tylnym wejściem.
  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/polityka-prywatnosci" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

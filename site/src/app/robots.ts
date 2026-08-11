import type { MetadataRoute } from "next";
import { seo } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/polityka-prywatnosci" },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
  };
}

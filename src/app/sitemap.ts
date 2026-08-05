import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteMeta } from "@/data/site-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.canonicalBase;
  return routing.locales.map((locale) => ({
    url: locale === routing.defaultLocale ? base : `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }));
}

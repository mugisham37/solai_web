import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";

const routes = [
  "",
  "/features",
  "/pricing",
  "/for-africa",
  "/contact",
  "/signup",
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}

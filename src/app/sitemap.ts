import type { MetadataRoute } from "next";
import { CITIES } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { listBusinesses } from "@/lib/data/businesses";
import { FAN_HUBS } from "@/data/fanHubs";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();
  const businesses = await listBusinesses({ limit: 200 });

  const staticRoutes = [
    "", "/cities", "/directory", "/match-day", "/near-me", "/fan-hubs",
    "/community", "/pricing", "/list-business", "/search", "/login", "/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const cityRoutes = CITIES.map((c) => ({
    url: `${base}/cities/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/directory/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const businessRoutes = businesses.map((b) => ({
    url: `${base}/business/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const hubRoutes = FAN_HUBS.map((h) => ({
    url: `${base}/fan-hubs/${h.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...cityRoutes, ...categoryRoutes, ...businessRoutes, ...hubRoutes];
}

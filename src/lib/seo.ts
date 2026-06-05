import type { Metadata } from "next";

export const SITE = {
  name: "532",
  title: "532 — Your World Cup City Assistant",
  description:
    "The unofficial operating system for the 2026 FIFA World Cup. Transport, food, fan zones, and trusted local services across all 16 host cities — instantly.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://532.app",
};

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = title ? `${title} · 532` : SITE.title;
  const desc = description || SITE.description;
  const url = `${SITE.url}${path}`;
  return {
    title: fullTitle,
    description: desc,
    keywords: ["World Cup 2026", "FIFA", "fan guide", "host cities", "match day", ...keywords],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
  };
}

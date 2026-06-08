"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CITIES } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  const cols = [
    {
      title: t("footer.platform"),
      links: [
        { href: "/cities", label: t("footer.hostCities") },
        { href: "/directory", label: t("footer.businessDirectory") },
        { href: "/match-day", label: t("footer.matchDayMode") },
        { href: "/near-me", label: t("nav.nearMe") },
        { href: "/fan-hubs", label: t("nav.fanHubs") },
        { href: "/community", label: t("nav.community") },
      ],
    },
    {
      title: t("footer.business"),
      links: [
        { href: "/list-business", label: t("footer.listYourBusiness") },
        { href: "/pricing", label: t("nav.pricing") },
        { href: "/login", label: t("action.signIn") },
      ],
    },
    {
      title: t("footer.topCities"),
      // City names are proper nouns — not translated.
      links: CITIES.slice(0, 6).map((c) => ({ href: `/cities/${c.slug}`, label: c.name })),
    },
    {
      title: t("footer.categories"),
      links: CATEGORIES.slice(0, 6).map((c) => ({ href: `/directory/${c.slug}`, label: c.label })),
    },
  ];

  return (
    <footer className="relative mt-10 border-t border-white/[0.06] pb-28 pt-16 lg:pb-16">
      <div className="container-pad">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-white/50">{t("footer.tagline")}</p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Instagram, Github].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full glass text-white/60 transition-colors hover:text-neon"
                  aria-label="social link"
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-white/40 md:flex-row">
          <p>{t("footer.copyright")}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/70">{t("footer.privacy")}</Link>
            <Link href="/terms" className="hover:text-white/70">{t("footer.terms")}</Link>
            <Link href="/accessibility" className="hover:text-white/70">{t("footer.accessibility")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import type { City } from "@/lib/types";
import { cn } from "@/lib/utils";
import { seededInt } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function CityCard({ city }: { city: City }) {
  const { t } = useLanguage();
  const fansNow = seededInt(city.slug + "fans", 1200, 18400);
  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900"
    >
      {/* gradient banner */}
      <div className={cn("relative h-40 bg-gradient-to-br", city.heroGradient)}>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: `radial-gradient(80% 80% at 70% 20%, ${city.accent}33, transparent 70%)` }}
        />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="text-3xl drop-shadow">{city.flag}</span>
        </div>
        <div className="absolute right-4 top-4">
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-950/50 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
            </span>
            {t("cities.card.active").replace("{count}", fansNow.toLocaleString())}
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-semibold text-white drop-shadow">{city.name}</h3>
          <p className="text-xs text-white/70">{city.country}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="line-clamp-2 text-sm text-white/55">{city.tagline} {city.stadium.name}.</p>
        <div className="mt-4 flex items-center justify-between text-xs text-white/55">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-neon" /> {t("cities.card.matches").replace("{count}", String(city.matchCount))}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neon" /> {city.stadium.neighborhood}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-neon">
            {t("cities.card.explore")}
          </span>
          <ArrowUpRight className="h-4 w-4 text-white/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon" />
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, CalendarDays, ArrowUpRight } from "lucide-react";
import type { City } from "@/lib/types";
import { seededInt } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { Flag } from "@/components/ui/Flag";
import { CITY_IMAGES } from "@/data/cityImages";

export function CityCard({ city }: { city: City }) {
  const { t } = useLanguage();
  const fansNow = seededInt(city.slug + "fans", 1200, 18400);
  const photo = CITY_IMAGES[city.slug];

  return (
    <Link
      href={`/cities/${city.slug}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Photo banner (Airbnb-style) with graceful tinted fallback */}
      <div className="relative h-44 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={`${city.name} skyline`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${city.accent}1f, ${city.accent}08 70%)` }}
          />
        )}
        {/* subtle bottom gradient so the chips read on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-base shadow-sm backdrop-blur">
          <Flag emoji={city.flag} />
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
          </span>
          {t("cities.card.active").replace("{count}", fansNow.toLocaleString())}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{city.name}</h3>
          <span className="shrink-0 text-sm text-gray-400">{city.country}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-gray-500">{city.tagline}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-neon-ink" /> {t("cities.card.matches").replace("{count}", String(city.matchCount))}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-neon-ink" /> {city.stadium.neighborhood}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-neon-ink">
            {t("cities.card.explore")}
          </span>
          <ArrowUpRight className="h-4 w-4 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon-ink" />
        </div>
      </div>
    </Link>
  );
}

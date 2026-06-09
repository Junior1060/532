"use client";

import Link from "next/link";
import { Star, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Business } from "@/lib/types";
import { VerificationBadge, Badge } from "@/components/ui/Badge";
import { CATEGORY_LABEL } from "@/data/categories";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function BusinessCard({ business: b }: { business: Business }) {
  const { t } = useLanguage();
  const city = getCity(b.citySlug);
  const price = "$".repeat(b.priceLevel);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {b.featured && (
        <div className="absolute right-3 top-3 z-10">
          <Badge tone="amber">{t("directory.business.featured")}</Badge>
        </div>
      )}
      <Link href={`/business/${b.slug}`} className="block">
        <div className="relative h-28 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${b.image}26, ${b.image}0d 70%, #ffffff)` }}
          />
          <div className="absolute bottom-2 left-4 text-xs font-medium uppercase tracking-wider text-gray-500">
            {CATEGORY_LABEL[b.category]}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/business/${b.slug}`}>
            <h3 className="font-semibold leading-tight text-gray-900 transition-colors group-hover:text-neon-ink">
              {b.name}
            </h3>
          </Link>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500" /> {b.rating}
            <span className="text-gray-400">({b.reviewCount})</span>
          </span>
          <span className="text-gray-400">{price}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {t("directory.card.km").replace("{km}", String(b.distanceFromStadiumKm))}
          </span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm text-gray-500">{b.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {b.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2">
            <VerificationBadge status={b.verification} />
          </div>
          <div className="flex gap-1.5">
            {b.whatsapp && (
              <a
                href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C4B] transition-colors hover:bg-[#25D366]/25"
                aria-label={t("directory.card.whatsappLabel")}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            <a
              href={`tel:${b.phone.replace(/\s/g, "")}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              aria-label={t("directory.card.callLabel")}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
        {city && (
          <div className={cn("mt-2 text-[11px] text-gray-400")}>{city.name}</div>
        )}
      </div>
    </div>
  );
}

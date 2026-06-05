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
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900 glass-hover">
      {b.featured && (
        <div className="absolute right-3 top-3 z-10">
          <Badge tone="amber">{t("directory.business.featured")}</Badge>
        </div>
      )}
      <Link href={`/business/${b.slug}`} className="block">
        <div className="relative h-28 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${b.image}33, #0a0a0d 80%)` }}
          />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute bottom-2 left-4 text-xs font-medium uppercase tracking-wider text-white/60">
            {CATEGORY_LABEL[b.category]}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/business/${b.slug}`}>
            <h3 className="font-semibold leading-tight text-white transition-colors group-hover:text-neon">
              {b.name}
            </h3>
          </Link>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
          <span className="flex items-center gap-1 text-amber-300">
            <Star className="h-3.5 w-3.5 fill-amber-300" /> {b.rating}
            <span className="text-white/40">({b.reviewCount})</span>
          </span>
          <span className="text-white/40">{price}</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {t("directory.card.km").replace("{km}", String(b.distanceFromStadiumKm))}
          </span>
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm text-white/50">{b.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {b.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/55">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2">
            <VerificationBadge status={b.verification} />
          </div>
          <div className="flex gap-1.5">
            {b.whatsapp && (
              <a
                href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] transition-colors hover:bg-[#25D366]/25"
                aria-label={t("directory.card.whatsappLabel")}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            <a
              href={`tel:${b.phone.replace(/\s/g, "")}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white/70 transition-colors hover:bg-white/[0.12]"
              aria-label={t("directory.card.callLabel")}
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
        {city && (
          <div className={cn("mt-2 text-[11px] text-white/35")}>{city.name}</div>
        )}
      </div>
    </div>
  );
}

"use client";

import { TICKER_ITEMS } from "@/data/live";
import { LiveDot } from "@/components/ui/Badge";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function LiveTicker() {
  const { t } = useLanguage();
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative flex items-center gap-4 border-y border-white/[0.06] bg-ink-900/40 py-2.5">
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/[0.06] pl-5 pr-4 md:pl-8">
        <LiveDot label={t("home.hero.live")} />
      </div>
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <span key={i} className="text-sm text-white/55">
              {item}
              <span className="ml-8 text-neon/40">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

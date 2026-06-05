"use client";

import type { CityMatch } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MatchCard({
  match,
  flag,
  highlight,
}: {
  match: CityMatch;
  flag?: string;
  highlight?: boolean;
}) {
  const { t } = useLanguage();
  const isSpecial = /FINAL|OPENING|Semi|Third/i.test(match.stage);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
        highlight || isSpecial
          ? "border-neon/30 bg-neon/[0.05]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
      )}
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-ink-950/60 px-2 py-2 text-center">
        <span className="text-[10px] uppercase tracking-wider text-white/45">
          {fmtDate(match.date).split(" ")[0]}
        </span>
        <span className="text-lg font-semibold text-white">
          {new Date(match.date).getDate()}
        </span>
        <span className="text-[10px] uppercase text-white/45">
          {new Date(match.date).toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              isSpecial ? "bg-neon/15 text-neon" : "bg-white/[0.06] text-white/55"
            )}
          >
            {match.stage}
          </span>
          <span className="text-xs text-white/40">{match.kickoffLocal}</span>
        </div>
        <div className="mt-1.5 truncate text-sm font-medium text-white">
          {flag} {match.home} <span className="text-white/40">{t("cities.detail.vs")}</span> {match.away}
        </div>
      </div>
    </div>
  );
}

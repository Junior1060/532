"use client";

import type { CityMatch } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { teamFlag } from "@/lib/teamFlags";
import { Flag } from "@/components/ui/Flag";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MatchCard({
  match,
  highlight,
}: {
  match: CityMatch;
  highlight?: boolean;
}) {
  const { t } = useLanguage();
  const isSpecial = /FINAL|OPENING|Semi|Third/i.test(match.stage);
  const homeFlag = teamFlag(match.home);
  const awayFlag = teamFlag(match.away);
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
        highlight || isSpecial
          ? "border-neon-border bg-neon-subtle"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-2 py-2 text-center">
        <span className="text-[10px] uppercase tracking-wider text-gray-500">
          {fmtDate(match.date).split(" ")[0]}
        </span>
        <span className="text-lg font-semibold text-gray-900">
          {new Date(match.date).getDate()}
        </span>
        <span className="text-[10px] uppercase text-gray-500">
          {new Date(match.date).toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              isSpecial ? "bg-neon-subtle text-neon-ink" : "bg-gray-100 text-gray-500"
            )}
          >
            {match.stage}
          </span>
          <span className="text-xs text-gray-400">{match.kickoffLocal}</span>
        </div>
        <div className="mt-1.5 truncate text-sm font-medium text-gray-900">
          {homeFlag && <Flag emoji={homeFlag} className="mr-1" />}{match.home}{" "}
          <span className="text-gray-400">{t("cities.detail.vs")}</span>{" "}
          {awayFlag && <Flag emoji={awayFlag} className="mr-1" />}{match.away}
        </div>
      </div>
    </div>
  );
}

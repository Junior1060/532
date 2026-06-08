"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export function Countdown({
  target,
  className,
  compact = false,
}: {
  target: string; // ISO
  className?: string;
  compact?: boolean;
}) {
  const { t: tr } = useLanguage();
  const targetMs = new Date(target).getTime();
  const [t, setT] = useState(() => diff(targetMs));

  useEffect(() => {
    setT(diff(targetMs));
    const id = setInterval(() => setT(diff(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const units = [
    { label: tr("unit.days"), value: t.days },
    { label: tr("unit.hrs"), value: t.hours },
    { label: tr("unit.min"), value: t.minutes },
    { label: tr("unit.sec"), value: t.seconds },
  ];

  return (
    <div className={cn("flex items-stretch gap-2 md:gap-3", className)}>
      {units.map((u, i) => (
        <div
          key={u.label}
          className={cn(
            "glass-strong flex flex-col items-center rounded-2xl",
            compact ? "min-w-[52px] px-2.5 py-2" : "min-w-[64px] px-3.5 py-3 md:min-w-[84px]"
          )}
        >
          <span
            className={cn(
              "font-mono font-semibold tabular-nums text-neon",
              compact ? "text-lg" : "text-2xl md:text-4xl"
            )}
            suppressHydrationWarning
          >
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-white/45">
            {u.label}
          </span>
          {i < units.length - 1 && null}
        </div>
      ))}
    </div>
  );
}

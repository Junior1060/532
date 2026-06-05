"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LIVE_MODULES, STADIUM_SIGNALS } from "@/data/live";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  neon: "text-neon",
  amber: "text-accent-amber",
  blue: "text-accent-blue",
  red: "text-accent-red",
};

/** Animated "12,421 fans active now" style counter. */
function LiveCounter({ base }: { base: number }) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const drift = Math.floor((prev % 7) - 3) + (prev % 2 === 0 ? 5 : -2);
        const next = prev + drift;
        return Math.max(base - 200, Math.min(base + 600, next));
      });
    }, 2200);
    return () => clearInterval(id);
  }, [base]);
  return <span className="tabular-nums" suppressHydrationWarning>{n.toLocaleString()}</span>;
}

export function LiveModules() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {LIVE_MODULES.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="glass relative overflow-hidden rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <Icon name={m.icon} className={cn("h-4 w-4", toneMap[m.tone])} />
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              {m.trend}
            </span>
          </div>
          <div className={cn("mt-3 text-2xl font-semibold", toneMap[m.tone])}>
            {m.label === "Fans active now" ? <LiveCounter base={12421} /> : m.value}
          </div>
          <div className="mt-0.5 text-xs text-white/45">{m.label}</div>
          <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-neon/5 blur-2xl" />
        </motion.div>
      ))}
    </div>
  );
}

export function StadiumSignals({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-2.5 md:grid-cols-3", className)}>
      {STADIUM_SIGNALS.map((s) => (
        <div key={s.label} className="glass rounded-2xl px-3.5 py-3">
          <div className="text-[11px] text-white/45">{s.label}</div>
          <div className={cn("mt-1 text-base font-semibold", toneMap[s.tone])}>{s.value}</div>
        </div>
      ))}
    </div>
  );
}

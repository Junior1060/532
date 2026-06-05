"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Navigation, Train, ShieldAlert, Flame, CloudSun, Car, UtensilsCrossed,
  BatteryCharging, Cross, Shield, MapPin, Clock,
} from "lucide-react";
import { CITIES } from "@/data/cities";
import { LiveDot } from "@/components/ui/Badge";
import { Countdown } from "@/components/visuals/Countdown";
import { cn, seededInt } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const MARKERS = [
  { key: "food", labelKey: "discovery.dashboard.marker.food", icon: UtensilsCrossed, color: "#f59e0b" },
  { key: "charge", labelKey: "discovery.dashboard.marker.charge", icon: BatteryCharging, color: "#00ff85" },
  { key: "ride", labelKey: "discovery.dashboard.marker.ride", icon: Car, color: "#eab308" },
  { key: "medical", labelKey: "discovery.dashboard.marker.medical", icon: Cross, color: "#fb7185" },
  { key: "police", labelKey: "discovery.dashboard.marker.police", icon: Shield, color: "#60a5fa" },
];

export function MatchDayDashboard() {
  const { t } = useLanguage();
  const [cityIdx, setCityIdx] = useState(0);
  const city = CITIES[cityIdx];
  const nextMatch = city.matches[0];

  const gateWait = seededInt(city.slug + "g", 8, 38);
  const lastTrain = seededInt(city.slug + "t", 9, 42);
  const ridesLeft = seededInt(city.slug + "r", 2, 9);
  const crowdLevel = ["moderate", "rising", "heavy"][seededInt(city.slug + "c", 0, 2)];
  const crowd = t(`discovery.dashboard.crowd.${crowdLevel}`);
  const crowdTone = crowdLevel === "heavy" ? "text-accent-red" : crowdLevel === "rising" ? "text-accent-amber" : "text-neon";

  return (
    <div>
      {/* City selector */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {CITIES.map((c, i) => (
          <button
            key={c.slug}
            onClick={() => setCityIdx(i)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
              i === cityIdx ? "border-neon/40 bg-neon/10 text-neon" : "border-white/10 text-white/60 hover:text-white"
            )}
          >
            <span>{c.flag}</span> {c.shortName}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Map panel */}
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-ink-900 p-5">
          <div className="absolute inset-0 bg-grid-neon opacity-15" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon text-ink-950">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold text-white">{city.stadium.name}</div>
                  <div className="text-xs text-white/45">{city.name} · {city.stadium.neighborhood}</div>
                </div>
              </div>
              <LiveDot />
            </div>

            {/* Live mini map */}
            <div className="relative mt-4 h-72 overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-950">
              <div className="absolute inset-0 bg-grid opacity-30" />
              {/* concentric stadium pulse */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative h-10 w-10">
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon/40" />
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-neon/30 [animation-delay:0.8s]" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-neon text-ink-950">
                    <Flame className="h-5 w-5" />
                  </span>
                </div>
              </div>
              {/* route */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 280" fill="none" preserveAspectRatio="none">
                <path d="M30 250 C 120 220, 130 150, 200 140 S 300 90, 370 50" stroke="#00ff85" strokeWidth="2.5" strokeDasharray="7 7">
                  <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="1.2s" repeatCount="indefinite" />
                </path>
              </svg>
              {/* category pings */}
              {[
                { x: "14%", y: "82%", m: MARKERS[0] },
                { x: "70%", y: "30%", m: MARKERS[1] },
                { x: "44%", y: "58%", m: MARKERS[2] },
                { x: "85%", y: "70%", m: MARKERS[3] },
                { x: "24%", y: "38%", m: MARKERS[4] },
              ].map((p, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: p.x, top: p.y }}>
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ background: p.m.color }} />
                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full text-ink-950" style={{ background: p.m.color }}>
                      <p.m.icon className="h-3.5 w-3.5" />
                    </span>
                  </span>
                </div>
              ))}
              <div className="absolute bottom-3 left-3 rounded-xl bg-ink-950/80 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
                <Navigation className="mr-1 inline h-3.5 w-3.5 text-neon" /> {t("discovery.dashboard.fastestRoute")}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {MARKERS.map((m) => (
                <span key={m.key} className="flex items-center gap-1.5 text-xs text-white/55">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} /> {t(m.labelKey)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live signals panel */}
        <div className="space-y-4">
          {nextMatch && (
            <div className="glass rounded-3xl p-5">
              <div className="text-xs uppercase tracking-wider text-white/45">{t("discovery.dashboard.nextMatch")}</div>
              <div className="mt-1 font-semibold text-white">{nextMatch.home} <span className="text-white/40">{t("discovery.dashboard.vs")}</span> {nextMatch.away}</div>
              <div className="text-sm text-white/50">{nextMatch.stage} · {nextMatch.kickoffLocal}</div>
              <div className="mt-3"><Countdown target={nextMatch.date} compact /></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Signal icon={Flame} label={t("discovery.dashboard.signal.crowd")} value={crowd} valueClass={crowdTone} />
            <Signal icon={Clock} label={t("discovery.dashboard.signal.gate")} value={t("discovery.dashboard.signal.minutes").replace("{n}", String(gateWait))} valueClass={gateWait > 25 ? "text-accent-red" : "text-accent-amber"} />
            <Signal icon={Train} label={t("discovery.dashboard.signal.lastTrain")} value={t("discovery.dashboard.signal.minutes").replace("{n}", String(lastTrain))} valueClass={lastTrain < 20 ? "text-accent-red" : "text-neon"} />
            <Signal icon={Car} label={t("discovery.dashboard.signal.rides")} value={t("discovery.dashboard.signal.onlyRides").replace("{n}", String(ridesLeft))} valueClass="text-accent-amber" />
            <Signal icon={CloudSun} label={t("discovery.dashboard.signal.kickoff")} value={city.weather.tempC.split("–")[1] || t("discovery.dashboard.signal.weatherClear")} valueClass="text-neon" />
            <Signal icon={ShieldAlert} label={t("discovery.dashboard.signal.alerts")} value={t("discovery.dashboard.signal.oneActive")} valueClass="text-accent-amber" />
          </div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-3xl border border-accent-amber/30 bg-accent-amber/[0.07] p-4"
          >
            <div className="flex items-center gap-2 text-accent-amber">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-sm font-semibold">{t("discovery.dashboard.liveAlert")}</span>
            </div>
            <p className="mt-1.5 text-sm text-white/70">
              {t("discovery.dashboard.alertText").replace(
                "{dir}",
                city.shortName === "CDMX" ? t("discovery.dashboard.dir.north") : t("discovery.dashboard.dir.east")
              )}
            </p>
          </motion.div>

          <div className="rounded-3xl border border-neon/20 bg-neon/[0.05] p-4 text-sm text-white/70">
            <ShieldAlert className="mr-1.5 inline h-4 w-4 text-neon" />
            {city.stadium.note}
          </div>
        </div>
      </div>
    </div>
  );
}

function Signal({
  icon: Icon, label, value, valueClass,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; valueClass?: string }) {
  return (
    <div className="glass rounded-2xl p-3.5">
      <Icon className="h-4 w-4 text-white/40" />
      <div className="mt-2 text-[11px] text-white/45">{label}</div>
      <div className={cn("text-base font-semibold text-white", valueClass)}>{value}</div>
    </div>
  );
}

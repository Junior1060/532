"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, BadgeCheck, Navigation, Footprints } from "lucide-react";
import { NEAR_ME } from "@/data/categories";
import { CITIES } from "@/data/cities";
import { Icon } from "@/components/ui/Icon";
import { Flag as FlagImg } from "@/components/ui/Flag";
import { LiveDot } from "@/components/ui/Badge";
import { cn, seededInt, seededValue } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

function placesFor(citySlug: string, cat: string) {
  const labelPool: Record<string, string[]> = {
    food: ["Late Night Tacos", "Halftime Grill", "Corner Kebab", "24h Noodle Bar", "Stadium Eats"],
    washrooms: ["Public Washroom", "Transit Station Facilities", "Fan Zone Restrooms", "Mall Washroom"],
    charging: ["Charging Hub", "Power Station Kiosk", "Café Charge Point", "Transit Charge Bank"],
    bars: ["The Offside Tap", "Supporters' Bar", "Penalty Box Pub", "Match View Lounge"],
    "fan-zones": ["Official FanFest", "Downtown Watch Party", "Plaza Big Screen", "Riverside Fan Zone"],
    pharmacies: ["CareFirst Pharmacy", "QuickMeds", "24h Pharmacy", "HealthPoint Rx"],
    atms: ["Bank ATM", "Credit Union ATM", "Transit Hub ATM", "Plaza ATM"],
    "safe-rides": ["Verified Pickup Zone", "SafeLane Stand", "TrustRide Point", "Official Rideshare Lot"],
    police: ["Police Post", "Event Security Station", "Mobile Police Unit", "Precinct"],
    medical: ["First Aid Station", "Urgent Care", "Medical Tent", "Walk-in Clinic"],
    "open-late": ["24h Diner", "Late Convenience", "Night Café", "All-night Pharmacy"],
    water: ["Water Refill Station", "Public Fountain", "Hydration Point", "Fan Zone Water"],
  };
  const pool = labelPool[cat] || ["Verified Spot"];
  return Array.from({ length: 5 }).map((_, i) => {
    const seed = `${citySlug}-${cat}-${i}`;
    return {
      name: `${pool[i % pool.length]}`,
      walk: seededInt(seed + "w", 2, 18),
      dist: Math.round((0.1 + seededValue(seed + "d") * 1.8) * 10) / 10,
      open: seededValue(seed + "o") > 0.2,
      verified: seededValue(seed + "v") > 0.35,
      busy: ["quiet", "moderate", "busy"][seededInt(seed + "b", 0, 2)],
    };
  }).sort((a, b) => a.walk - b.walk);
}

export function NearMeExplorer() {
  const { t } = useLanguage();
  const [cityIdx, setCityIdx] = useState(0);
  const [cat, setCat] = useState(NEAR_ME[0].slug);
  const city = CITIES[cityIdx];
  const active = NEAR_ME.find((c) => c.slug === cat)!;
  const places = useMemo(() => placesFor(city.slug, cat), [city.slug, cat]);

  return (
    <div>
      {/* City selector */}
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {CITIES.map((c, i) => (
          <button key={c.slug} onClick={() => setCityIdx(i)}
            className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
              i === cityIdx ? "border-neon-border bg-neon-subtle text-neon-ink" : "border-gray-200 text-gray-600 hover:text-gray-900")}>
            <span><FlagImg emoji={c.flag} /></span> {c.shortName}
          </button>
        ))}
      </div>

      {/* Category selector */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {NEAR_ME.map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)}
            className={cn("flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
              cat === c.slug ? "border-gray-200 bg-gray-100 text-gray-900" : "border-gray-200 text-gray-600 hover:text-gray-900")}
            style={cat === c.slug ? { borderColor: c.color + "66", color: c.color } : undefined}>
            <Icon name={c.icon} className="h-4 w-4" /> {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Map */}
        <div className="relative h-[420px] overflow-hidden rounded-4xl border border-gray-200 bg-gray-50">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-xs text-gray-700 backdrop-blur">
            <LiveDot label={t("discovery.nearMe.liveLabel")} /> {t("discovery.nearMe.nearStadium").replace("{label}", active.label).replace("{stadium}", city.stadium.name)}
          </div>
          {/* center marker */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full text-gray-900" style={{ background: active.color }}>
              <Icon name={active.icon} className="h-4 w-4" />
            </span>
          </div>
          {places.map((p, i) => {
            const angle = (i / places.length) * Math.PI * 2;
            const r = 28 + i * 6;
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * (r * 0.7);
            return (
              <motion.div key={i}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}>
                <span className="relative flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ background: active.color }} />
                  <span className="relative inline-flex h-5 w-5 rounded-full border-2 border-gray-200" style={{ background: active.color }} />
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Results */}
        <div className="space-y-2.5">
          {places.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass glass-hover flex items-center gap-3 rounded-2xl p-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: active.color + "22", color: active.color }}>
                <Icon name={active.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-medium text-gray-900">
                  {p.name}
                  {p.verified && <BadgeCheck className="h-3.5 w-3.5 text-neon-ink" />}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Footprints className="h-3 w-3" /> {t("discovery.nearMe.minutes").replace("{n}", String(p.walk))}</span>
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {t("discovery.nearMe.km").replace("{n}", String(p.dist))}</span>
                  <span className={cn(p.open ? "text-neon-ink" : "text-accent-red")}>
                    {p.open ? t("discovery.nearMe.openNow") : t("discovery.nearMe.closed")}
                  </span>
                  <span className="text-gray-400">· {t(`discovery.nearMe.busy.${p.busy}`)}</span>
                </div>
              </div>
              <button className="rounded-full bg-gray-50 p-2 text-gray-700 transition-colors hover:bg-neon hover:text-gray-900" aria-label={t("discovery.nearMe.directions")}>
                <Navigation className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          <p className="pt-1 text-center text-xs text-gray-400">
            <Clock className="mr-1 inline h-3 w-3" /> {t("discovery.nearMe.resultsUpdate")}
          </p>
        </div>
      </div>
    </div>
  );
}

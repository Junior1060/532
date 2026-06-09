"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Business } from "@/lib/types";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { CITIES } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

type SortKey = "featured" | "rating" | "distance";

export function DirectoryExplorer({
  businesses,
  initialCity = "all",
  initialCategory = "all",
  lockCategory = false,
}: {
  businesses: Business[];
  initialCity?: string;
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const [city, setCity] = useState(initialCity);
  const [category, setCategory] = useState(initialCategory);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const results = useMemo(() => {
    let list = businesses.filter((b) => {
      if (city !== "all" && b.citySlug !== city) return false;
      if (!lockCategory && category !== "all" && b.category !== category) return false;
      if (verifiedOnly && b.verification !== "verified") return false;
      if (q) {
        const s = q.toLowerCase();
        if (!b.name.toLowerCase().includes(s) && !b.tags.some((t) => t.toLowerCase().includes(s)))
          return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "distance") return a.distanceFromStadiumKm - b.distanceFromStadiumKm;
      return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
    });
    return list;
  }, [businesses, city, category, verifiedOnly, q, sort, lockCategory]);

  return (
    <div>
      {/* Controls */}
      <div className="glass sticky top-16 z-30 rounded-3xl p-4">
        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-ink-950/60 px-4 py-2.5 focus-within:border-neon-border">
          <Search className="h-4.5 w-4.5 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("directory.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Select label={t("directory.filter.city")} value={city} onChange={setCity}
            options={[{ value: "all", label: t("directory.filter.allCities") }, ...CITIES.map((c) => ({ value: c.slug, label: c.name }))]} />
          {!lockCategory && (
            <Select label={t("directory.filter.category")} value={category} onChange={setCategory}
              options={[{ value: "all", label: t("directory.filter.allCategories") }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))]} />
          )}
          <Select label={t("directory.filter.sort")} value={sort} onChange={(v) => setSort(v as SortKey)}
            options={[{ value: "featured", label: t("directory.sort.featured") }, { value: "rating", label: t("directory.sort.rating") }, { value: "distance", label: t("directory.sort.distance") }]} />
          <button
            onClick={() => setVerifiedOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
              verifiedOnly ? "border-neon-border bg-neon-subtle text-neon-ink" : "border-gray-200 text-gray-600 hover:text-gray-900"
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> {t("directory.verifiedOnly")}
          </button>
        </div>
      </div>

      <div className="mt-5 text-sm text-gray-500">
        {t(results.length === 1 ? "directory.resultCount.one" : "directory.resultCount.other").replace(
          "{count}",
          String(results.length)
        )}
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
          {t("directory.empty")}
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm">
      <span className="text-gray-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-gray-900 focus:outline-none [&>option]:bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

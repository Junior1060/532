"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { Search, Loader2, Check, Star, MapPin, Download } from "lucide-react";
import { CITIES } from "@/data/cities";
import { PLACE_CATEGORIES } from "@/lib/placeCategories";
import { CATEGORY_LABEL } from "@/data/categories";
import { fetchPlaces, importPlaces, type PreviewPlace } from "@/app/actions/places";
import type { BusinessCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const ANCHOR_TYPES = [
  { value: "stadium", label: "Stadium" },
  { value: "fan-zone", label: "Fan zone" },
  { value: "hotel-district", label: "Hotel district" },
  { value: "downtown", label: "Downtown area" },
  { value: "airport", label: "Airport" },
];
const RADII = [
  { value: 500, label: "500 m" },
  { value: 1000, label: "1 km" },
  { value: 2000, label: "2 km" },
  { value: 5000, label: "5 km" },
];

function photoUrl(name: string, w = 96) {
  return `/api/places/photo?name=${encodeURIComponent(name)}&w=${w}`;
}

export function ImportWizard() {
  const [citySlug, setCitySlug] = useState(CITIES[0].slug);
  const [anchorType, setAnchorType] = useState("stadium");
  const city = useMemo(() => CITIES.find((c) => c.slug === citySlug) ?? CITIES[0], [citySlug]);
  const [lat, setLat] = useState(String(city.lat));
  const [lng, setLng] = useState(String(city.lng));
  const [radiusM, setRadiusM] = useState(1000);
  const [cats, setCats] = useState<Set<string>>(new Set(["restaurants", "cafes", "bars"]));

  const [results, setResults] = useState<PreviewPlace[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isFetching, startFetch] = useTransition();
  const [isImporting, startImport] = useTransition();

  const anchorLabel =
    anchorType === "stadium"
      ? city.stadium.name
      : `${ANCHOR_TYPES.find((a) => a.value === anchorType)?.label ?? anchorType} · ${city.name}`;

  // When the city changes (or anchor set to stadium), prefill coordinates.
  function pickCity(slug: string) {
    setCitySlug(slug);
    const c = CITIES.find((x) => x.slug === slug);
    if (c) { setLat(String(c.lat)); setLng(String(c.lng)); }
  }
  function pickAnchor(type: string) {
    setAnchorType(type);
    if (type === "stadium") { setLat(String(city.lat)); setLng(String(city.lng)); }
  }

  function toggleCat(key: string) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function runFetch() {
    setError(null);
    setNotice(null);
    setResults(null);
    startFetch(async () => {
      const res = await fetchPlaces({
        citySlug, anchorLabel, lat: Number(lat), lng: Number(lng), radiusM, categories: [...cats],
      });
      if (!res.ok) { setError(res.error ?? "Search failed."); return; }
      const list = res.results ?? [];
      setResults(list);
      // Pre-select everything not already imported.
      setSelected(new Set(list.filter((r) => !r.alreadyExists).map((r) => r.placeId)));
      if (!list.length) setNotice("No businesses found for those filters. Try a larger radius or different categories.");
    });
  }

  function runImport() {
    if (!results) return;
    setError(null);
    setNotice(null);
    const records = results.filter((r) => selected.has(r.placeId));
    if (!records.length) { setError("Select at least one business to import."); return; }
    startImport(async () => {
      const res = await importPlaces({
        records, citySlug, anchorLabel, anchorType,
        anchorLat: Number(lat), anchorLng: Number(lng), radiusM, categories: [...cats],
      });
      setNotice(res.message);
      if (res.ok) {
        // Mark imported ones as existing; clear selection.
        const importedIds = new Set(records.map((r) => r.placeId));
        setResults((prev) => prev?.map((r) => (importedIds.has(r.placeId) ? { ...r, alreadyExists: true } : r)) ?? null);
        setSelected(new Set());
      }
    });
  }

  const selectableCount = results?.filter((r) => !r.alreadyExists).length ?? 0;
  const allSelected = selectableCount > 0 && selected.size === selectableCount;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-gray-900">Import from Google Places</h3>
        <p className="mt-1 text-sm text-gray-500">Find real businesses near an anchor point, preview, and import the ones you want.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="City">
            <select value={citySlug} onChange={(e) => pickCity(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30">
              {CITIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Anchor type">
            <select value={anchorType} onChange={(e) => pickAnchor(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30">
              {ANCHOR_TYPES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </Field>
          <Field label="Latitude">
            <input value={lat} onChange={(e) => setLat(e.target.value)} inputMode="decimal" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30" />
          </Field>
          <Field label="Longitude">
            <input value={lng} onChange={(e) => setLng(e.target.value)} inputMode="decimal" className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30" />
          </Field>
        </div>

        <div className="mt-4">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400">Categories</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {PLACE_CATEGORIES.map((c) => {
              const on = cats.has(c.key);
              return (
                <button key={c.key} type="button" onClick={() => toggleCat(c.key)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors",
                    on ? "border-neon-border bg-neon-subtle text-neon-ink" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900")}>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <Field label="Radius" className="w-40">
            <select value={radiusM} onChange={(e) => setRadiusM(Number(e.target.value))} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/30">
              {RADII.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>
          <button onClick={runFetch} disabled={isFetching || cats.size === 0}
            className="inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:brightness-105 disabled:opacity-50">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Fetch businesses
          </button>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-accent-red/30 bg-accent-red/[0.06] p-3 text-sm text-accent-red">{error}</div>}
      {notice && <div className="rounded-2xl border border-neon-border bg-neon-subtle p-3 text-sm text-neon-ink">{notice}</div>}

      {/* Preview */}
      {results && results.length > 0 && (
        <div className="glass rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-gray-900">Preview · {results.length} found</h3>
              <button
                type="button"
                onClick={() => setSelected(allSelected ? new Set() : new Set(results.filter((r) => !r.alreadyExists).map((r) => r.placeId)))}
                className="mt-1 text-xs text-neon-ink hover:underline"
              >
                {allSelected ? "Deselect all" : `Select all (${selectableCount})`}
              </button>
            </div>
            <button onClick={runImport} disabled={isImporting || selected.size === 0}
              className="inline-flex items-center gap-2 rounded-full bg-neon px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:brightness-105 disabled:opacity-50">
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Import selected ({selected.size})
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {results.map((r) => {
              const checked = selected.has(r.placeId);
              return (
                <label key={r.placeId}
                  className={cn("flex items-center gap-3 rounded-2xl border p-3 transition-colors",
                    r.alreadyExists ? "border-gray-200 bg-gray-50 opacity-70" : checked ? "border-neon-border bg-neon-subtle/40" : "border-gray-200 hover:border-gray-300")}>
                  <input
                    type="checkbox"
                    disabled={r.alreadyExists}
                    checked={checked}
                    onChange={() => setSelected((prev) => { const n = new Set(prev); if (n.has(r.placeId)) n.delete(r.placeId); else n.add(r.placeId); return n; })}
                    className="h-4 w-4 shrink-0 accent-[#00C16A]"
                  />
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {r.photoRefs[0] && (
                      <Image src={photoUrl(r.photoRefs[0], 96)} alt="" fill sizes="48px" className="object-cover" unoptimized />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate font-medium text-gray-900">{r.name}</span>
                      {r.alreadyExists && <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-500">Imported</span>}
                    </div>
                    <div className="truncate text-xs text-gray-500">{CATEGORY_LABEL[r.category as BusinessCategory] ?? r.category} · {r.address}</div>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 text-xs text-gray-500 sm:flex">
                    {r.rating != null && <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500" />{r.rating} <span className="text-gray-400">({r.reviewCount ?? 0})</span></span>}
                    {r.distanceKm != null && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.distanceKm} km</span>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400">{label}</span>
      {children}
    </label>
  );
}

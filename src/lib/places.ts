import "server-only";

import type { BusinessCategory } from "@/lib/types";
import { haversineKm } from "@/lib/utils";
import { PLACE_CATEGORIES, type PlaceCategoryConfig } from "@/lib/placeCategories";

export { PLACE_CATEGORIES, type PlaceCategoryConfig } from "@/lib/placeCategories";

/**
 * Google Places API (New, v1) client — server-only. Used by the admin importer
 * to discover real public businesses near an anchor point. No scraping.
 * Disabled gracefully until GOOGLE_PLACES_API_KEY is set.
 */
export const PLACES_CONFIGURED = !!process.env.GOOGLE_PLACES_API_KEY;

const BASE = "https://places.googleapis.com/v1";
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.regularOpeningHours.weekdayDescriptions",
  "places.internationalPhoneNumber",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.photos",
  "places.primaryType",
  "places.types",
].join(",");

/** One normalized place returned to the importer UI. */
export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceLevel: number | null; // 1..4
  hours: string | null; // joined weekday descriptions
  photoRefs: string[]; // Google photo resource names (places/.../photos/...)
  googleTypes: string[];
  /** Internal category this result maps to. */
  category: BusinessCategory;
  distanceKm: number | null;
}

export interface PlacesResponse {
  ok: boolean;
  results?: PlaceResult[];
  error?: string;
}

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 1,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

interface ApiPlace {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  photos?: { name?: string }[];
  primaryType?: string;
  types?: string[];
}

function mapApiPlace(
  p: ApiPlace,
  cfg: PlaceCategoryConfig,
  anchorLat: number,
  anchorLng: number
): PlaceResult {
  const lat = p.location?.latitude ?? null;
  const lng = p.location?.longitude ?? null;
  return {
    placeId: p.id,
    name: p.displayName?.text ?? "Unnamed",
    address: p.formattedAddress ?? "",
    lat,
    lng,
    phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber ?? null,
    website: p.websiteUri ?? null,
    googleMapsUrl: p.googleMapsUri ?? null,
    rating: typeof p.rating === "number" ? p.rating : null,
    reviewCount: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
    priceLevel: p.priceLevel ? PRICE_LEVEL_MAP[p.priceLevel] ?? null : null,
    hours: p.regularOpeningHours?.weekdayDescriptions?.join("; ") ?? null,
    photoRefs: (p.photos ?? []).map((ph) => ph.name).filter((n): n is string => !!n).slice(0, 3),
    googleTypes: p.types ?? (p.primaryType ? [p.primaryType] : []),
    category: cfg.internalCategory,
    distanceKm: lat != null && lng != null ? Math.round(haversineKm(anchorLat, anchorLng, lat, lng) * 10) / 10 : null,
  };
}

function describeError(status: number, body: string): string {
  if (status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(body)) {
    return "Google Places quota reached. Wait a moment or raise your quota, then try again.";
  }
  if (status === 403 || status === 401 || /PERMISSION_DENIED|API key|billing/i.test(body)) {
    return "Google Places rejected the request — check the API key, that Places API (New) is enabled, and billing is active.";
  }
  if (status === 400) return "Invalid Places request. Try a different category or radius.";
  return `Google Places request failed (HTTP ${status}).`;
}

async function callPlaces(
  endpoint: "searchNearby" | "searchText",
  payload: Record<string, unknown>
): Promise<{ ok: boolean; places?: ApiPlace[]; error?: string }> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return { ok: false, error: "Google Places API is not configured." };
  try {
    const res = await fetch(`${BASE}/places:${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("[532] Places API error", res.status, text.slice(0, 300));
      return { ok: false, error: describeError(res.status, text) };
    }
    const data = text ? JSON.parse(text) : {};
    return { ok: true, places: (data.places ?? []) as ApiPlace[] };
  } catch (err) {
    console.error("[532] Places API network error:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Could not reach Google Places. Please try again." };
  }
}

/**
 * Fetch places for a set of importer category keys near an anchor point.
 * Dedupes by Place ID across categories (first category wins).
 */
export async function fetchPlacesForCategories(opts: {
  lat: number;
  lng: number;
  radiusM: number;
  categoryKeys: string[];
  maxPerCategory?: number;
}): Promise<PlacesResponse> {
  if (!PLACES_CONFIGURED) {
    return { ok: false, error: "Google Places API is not configured yet. Add GOOGLE_PLACES_API_KEY to enable importing." };
  }
  const { lat, lng, radiusM, categoryKeys } = opts;
  const max = Math.min(20, opts.maxPerCategory ?? 20);
  const configs = PLACE_CATEGORIES.filter((c) => categoryKeys.includes(c.key));
  if (!configs.length) return { ok: false, error: "Select at least one category." };

  const seen = new Map<string, PlaceResult>();
  let lastError: string | undefined;

  for (const cfg of configs) {
    const payload =
      cfg.method === "nearby"
        ? {
            includedTypes: cfg.includedTypes,
            maxResultCount: max,
            locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: radiusM } },
          }
        : {
            textQuery: cfg.query,
            maxResultCount: max,
            locationBias: { circle: { center: { latitude: lat, longitude: lng }, radius: radiusM } },
          };

    const r = await callPlaces(cfg.method === "nearby" ? "searchNearby" : "searchText", payload);
    if (!r.ok) {
      lastError = r.error;
      // Quota/permission errors are fatal — stop early.
      if (/quota|key|billing|configured/i.test(r.error ?? "")) return { ok: false, error: r.error };
      continue;
    }
    for (const p of r.places ?? []) {
      if (!p.id || seen.has(p.id)) continue;
      const mapped = mapApiPlace(p, cfg, lat, lng);
      // Text searches can return far-off results; keep within ~1.5x radius.
      if (mapped.distanceKm != null && mapped.distanceKm > (radiusM / 1000) * 1.5) continue;
      seen.set(p.id, mapped);
    }
  }

  const results = [...seen.values()].sort((a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9));
  if (!results.length && lastError) return { ok: false, error: lastError };
  return { ok: true, results };
}

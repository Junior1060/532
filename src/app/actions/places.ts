"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fetchPlacesForCategories, type PlaceResult } from "@/lib/places";
import { rateLimit } from "@/lib/rateLimit";
import { slugify } from "@/lib/utils";

export interface PreviewPlace extends PlaceResult {
  alreadyExists: boolean;
}

export interface FetchPlacesResult {
  ok: boolean;
  results?: PreviewPlace[];
  error?: string;
}

export interface ImportPlacesResult {
  ok: boolean;
  imported: number;
  updated: number;
  skipped: number;
  message: string;
}

async function adminGuard() {
  const { user, isAdmin } = await getSessionUser();
  if (!user) return { user: null, error: "You're not signed in." as const };
  if (!isAdmin) return { user: null, error: "You don't have permission to do that." as const };
  return { user, error: null };
}

const RADII = new Set([500, 1000, 2000, 5000]);

/** Admin: search Google Places near an anchor and flag which already exist. */
export async function fetchPlaces(input: {
  citySlug: string;
  anchorLabel: string;
  lat: number;
  lng: number;
  radiusM: number;
  categories: string[];
}): Promise<FetchPlacesResult> {
  const { user, error } = await adminGuard();
  if (error) return { ok: false, error };

  if (!rateLimit(`fetchPlaces:${user!.id}`, 30, 10 * 60_000).ok) {
    return { ok: false, error: "Too many searches recently. Please wait a few minutes." };
  }

  const lat = Number(input.lat);
  const lng = Number(input.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return { ok: false, error: "Enter valid latitude and longitude." };
  }
  const radiusM = RADII.has(input.radiusM) ? input.radiusM : 1000;

  const res = await fetchPlacesForCategories({ lat, lng, radiusM, categoryKeys: input.categories });
  if (!res.ok || !res.results) return { ok: false, error: res.error ?? "No results." };
  if (!res.results.length) return { ok: true, results: [] };

  // Flag which place IDs already exist in the directory.
  const supabase = getSupabaseAdmin();
  let existing = new Set<string>();
  if (supabase) {
    const ids = res.results.map((r) => r.placeId);
    const { data } = await supabase.from("businesses").select("google_place_id").in("google_place_id", ids);
    existing = new Set((data ?? []).map((d: { google_place_id: string | null }) => d.google_place_id ?? ""));
  }

  return {
    ok: true,
    results: res.results.map((r) => ({ ...r, alreadyExists: existing.has(r.placeId) })),
  };
}

/** Admin: import selected places into the businesses directory (verified). */
export async function importPlaces(input: {
  records: PlaceResult[];
  citySlug: string;
  anchorLabel: string;
  anchorType: string;
  anchorLat: number;
  anchorLng: number;
  radiusM: number;
  categories: string[];
}): Promise<ImportPlacesResult> {
  const { user, error } = await adminGuard();
  if (error) return { ok: false, imported: 0, updated: 0, skipped: 0, message: error };

  if (!rateLimit(`importPlaces:${user!.id}`, 20, 10 * 60_000).ok) {
    return { ok: false, imported: 0, updated: 0, skipped: 0, message: "Too many imports recently. Please wait a few minutes." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, imported: 0, updated: 0, skipped: 0, message: "Database is not configured." };
  }

  const records = (input.records ?? []).filter((r) => r && r.placeId && r.name);
  if (!records.length) return { ok: false, imported: 0, updated: 0, skipped: 0, message: "No businesses selected." };

  const isStadium = input.anchorType === "stadium";
  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const r of records) {
    try {
      const { data: existing } = await supabase
        .from("businesses")
        .select("id,phone,website,address,latitude,longitude,google_maps_url,rating,review_count,price_level,hours,photos,distance_from_anchor_km,anchor_label")
        .eq("google_place_id", r.placeId)
        .maybeSingle();

      if (existing) {
        // Update missing fields only.
        const patch: Record<string, unknown> = {};
        const setIfMissing = (col: string, cur: unknown, val: unknown) => {
          if (val == null || val === "") return;
          if (cur == null || cur === "" || (Array.isArray(cur) && cur.length === 0) || cur === 0) patch[col] = val;
        };
        setIfMissing("phone", existing.phone, r.phone);
        setIfMissing("website", existing.website, r.website);
        setIfMissing("address", existing.address, r.address);
        setIfMissing("latitude", existing.latitude, r.lat);
        setIfMissing("longitude", existing.longitude, r.lng);
        setIfMissing("google_maps_url", existing.google_maps_url, r.googleMapsUrl);
        setIfMissing("rating", existing.rating, r.rating);
        setIfMissing("review_count", existing.review_count, r.reviewCount);
        setIfMissing("price_level", existing.price_level, r.priceLevel);
        setIfMissing("hours", existing.hours, r.hours);
        setIfMissing("photos", existing.photos, r.photoRefs.length ? r.photoRefs : null);
        setIfMissing("distance_from_anchor_km", existing.distance_from_anchor_km, r.distanceKm);
        setIfMissing("anchor_label", existing.anchor_label, input.anchorLabel);

        if (Object.keys(patch).length) {
          const { error: upErr } = await supabase.from("businesses").update(patch).eq("id", existing.id);
          if (upErr) { skipped++; continue; }
          updated++;
        } else {
          skipped++;
        }
        continue;
      }

      // Insert new — verified, source google_places. Ensure unique slug.
      let slug = slugify(`${r.name}-${input.citySlug}`) || `place-${r.placeId.slice(-6)}`;
      const { data: clash } = await supabase.from("businesses").select("id").eq("slug", slug).maybeSingle();
      if (clash) slug = `${slug}-${r.placeId.slice(-5).toLowerCase()}`;

      const row: Record<string, unknown> = {
        slug,
        name: r.name,
        category: r.category,
        city_slug: input.citySlug || null,
        description: `${r.name} — ${r.address}`.slice(0, 500),
        address: r.address || null,
        phone: r.phone,
        website: r.website,
        hours: r.hours,
        rating: r.rating ?? 0,
        review_count: r.reviewCount ?? 0,
        price_level: r.priceLevel ?? 2,
        latitude: r.lat,
        longitude: r.lng,
        google_maps_url: r.googleMapsUrl,
        google_place_id: r.placeId,
        photos: r.photoRefs.length ? r.photoRefs : [],
        distance_from_anchor_km: r.distanceKm,
        anchor_label: input.anchorLabel,
        distance_from_stadium_km: isStadium ? r.distanceKm : null,
        source: "google_places",
        imported_at: new Date().toISOString(),
        verification: "verified",
      };
      const { error: insErr } = await supabase.from("businesses").insert(row);
      if (insErr) {
        console.error("[532] importPlaces insert failed:", insErr.message);
        skipped++;
        continue;
      }
      imported++;
    } catch (err) {
      console.error("[532] importPlaces record error:", err instanceof Error ? err.message : err);
      skipped++;
    }
  }

  // Log the run (best-effort).
  await supabase.from("import_logs").insert({
    created_by: user!.id,
    city_slug: input.citySlug || null,
    anchor_label: input.anchorLabel || null,
    anchor_lat: input.anchorLat,
    anchor_lng: input.anchorLng,
    categories: input.categories,
    radius_m: input.radiusM,
    fetched_count: records.length,
    imported_count: imported,
    updated_count: updated,
    skipped_count: skipped,
  });

  revalidatePath("/admin");
  revalidatePath("/directory");
  revalidatePath("/near-me");
  revalidatePath("/cities");

  return {
    ok: true,
    imported,
    updated,
    skipped,
    message: `Imported ${imported} new, updated ${updated}, skipped ${skipped}.`,
  };
}

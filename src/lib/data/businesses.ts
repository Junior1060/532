import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Business, BusinessCategory } from "@/lib/types";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { CITIES } from "@/data/cities";
import {
  BUSINESSES as SEED_BUSINESSES,
  getBusinessesByCity as seedByCity,
  getBusinessesByCategory as seedByCategory,
  getBusiness as seedBySlug,
  getFeaturedBusinesses as seedFeatured,
  searchBusinesses as seedSearch,
  DIRECTORY_STATS as SEED_STATS,
} from "@/data/businesses";

/**
 * Public business data access. Reads VERIFIED listings from Supabase when it's
 * configured (so admin-approved businesses appear site-wide); otherwise falls
 * back to the deterministic seed directory for local/demo use.
 *
 * All reads use the anon key — RLS ("verified businesses public") guarantees
 * only verified rows are returned to anonymous visitors.
 */

const TABLE = "businesses";
const COLUMNS =
  "id,slug,name,category,city_slug,description,address,website,phone,email,whatsapp,hours,verification,rating,review_count,price_level,distance_from_stadium_km,plan,featured,tags,logo_url";

let _client: SupabaseClient | null | undefined;
function db(): SupabaseClient | null {
  if (_client !== undefined) return _client;
  _client = SUPABASE_CONFIGURED
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
    : null;
  return _client;
}

const accentFor = (citySlug: string | null) =>
  CITIES.find((c) => c.slug === citySlug)?.accent ?? "#10b981";

interface Row {
  id: string;
  slug: string;
  name: string;
  category: string;
  city_slug: string | null;
  description: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  hours: string | null;
  verification: Business["verification"];
  rating: number | null;
  review_count: number | null;
  price_level: number | null;
  distance_from_stadium_km: number | null;
  plan: Business["plan"];
  featured: boolean | null;
  tags: string[] | null;
  logo_url: string | null;
}

function mapRow(row: Row): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as BusinessCategory,
    citySlug: row.city_slug ?? "",
    description: row.description ?? "",
    address: row.address ?? "",
    website: row.website ?? undefined,
    phone: row.phone ?? "",
    email: row.email ?? "",
    whatsapp: row.whatsapp ?? undefined,
    hours: row.hours ?? "",
    verification: row.verification,
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    priceLevel: (Math.min(4, Math.max(1, row.price_level ?? 2)) as 1 | 2 | 3 | 4),
    distanceFromStadiumKm: Number(row.distance_from_stadium_km ?? 0),
    plan: row.plan ?? "starter",
    featured: !!row.featured,
    tags: row.tags ?? [],
    image: row.logo_url || accentFor(row.city_slug),
  };
}

/** Featured first, then rating. Mirrors the seed ordering. */
const byPriority = (a: Business, b: Business) =>
  Number(b.featured) - Number(a.featured) || b.rating - a.rating;

export interface BusinessFilter {
  city?: string;
  category?: BusinessCategory;
  q?: string;
  limit?: number;
}

export async function listBusinesses(filter: BusinessFilter = {}): Promise<Business[]> {
  const { city, category, q, limit = 200 } = filter;
  const client = db();

  if (!client) {
    let list = SEED_BUSINESSES.filter((b) => b.verification === "verified");
    if (city) list = list.filter((b) => b.citySlug === city);
    if (category) list = list.filter((b) => b.category === category);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter(
        (b) => b.name.toLowerCase().includes(needle) || b.tags.some((t) => t.toLowerCase().includes(needle))
      );
    }
    return list.sort(byPriority).slice(0, limit);
  }

  let query = client.from(TABLE).select(COLUMNS).eq("verification", "verified");
  if (city) query = query.eq("city_slug", city);
  if (category) query = query.eq("category", category);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query
    .order("featured", { ascending: false })
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.error("[532] listBusinesses failed:", error.message);
    return [];
  }
  return (data as Row[]).map(mapRow);
}

export async function getBusinessesByCity(citySlug: string): Promise<Business[]> {
  if (!db()) return seedByCity(citySlug).filter((b) => b.verification === "verified");
  return listBusinesses({ city: citySlug });
}

export async function getBusinessesByCategory(category: BusinessCategory): Promise<Business[]> {
  if (!db()) return seedByCategory(category).filter((b) => b.verification === "verified");
  return listBusinesses({ category });
}

export async function getFeaturedBusinesses(limit = 6): Promise<Business[]> {
  const client = db();
  if (!client) return seedFeatured(limit);
  const { data, error } = await client
    .from(TABLE)
    .select(COLUMNS)
    .eq("verification", "verified")
    .eq("featured", true)
    .order("rating", { ascending: false })
    .limit(limit);
  if (error || !data) {
    if (error) console.error("[532] getFeaturedBusinesses failed:", error.message);
    return [];
  }
  return (data as Row[]).map(mapRow);
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const client = db();
  if (!client) return seedBySlug(slug) ?? null;
  const { data, error } = await client.from(TABLE).select(COLUMNS).eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  const biz = mapRow(data as Row);
  // Only surface verified listings publicly.
  return biz.verification === "verified" ? biz : null;
}

export async function searchBusinesses(query: string): Promise<Business[]> {
  const q = query.trim();
  if (!q) return [];
  if (!db()) return seedSearch(q).filter((b) => b.verification === "verified");
  return listBusinesses({ q, limit: 24 });
}

export async function getDirectoryStats(): Promise<{ total: number; verified: number; cities: number }> {
  const client = db();
  if (!client) return SEED_STATS;
  const { count } = await client
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("verification", "verified");
  const verified = count ?? 0;
  return { total: verified, verified, cities: CITIES.length };
}

import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { CITIES } from "@/data/cities";
import { COMMUNITY_POSTS } from "@/data/live";

/** Shape consumed by the community feed UI. */
export interface FeedPost {
  id: string;
  author: string;
  flag: string;
  city: string;
  type: string;
  title: string;
  body: string;
  upvotes: number;
  verified: boolean;
  pending?: boolean;
}

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

const cityMeta = (slug: string | null) => {
  const c = CITIES.find((x) => x.slug === slug);
  return { name: c?.name ?? "All cities", flag: c?.flag ?? "🌍" };
};

interface PostRow {
  id: string;
  city_slug: string | null;
  type: string;
  title: string;
  body: string;
  upvotes: number | null;
}

/** Published community posts for the public feed (seed fallback in dev). */
export async function listPublishedPosts(limit = 50): Promise<FeedPost[]> {
  const client = db();
  if (!client) {
    return COMMUNITY_POSTS.map((p) => ({
      id: p.id,
      author: p.author,
      flag: p.flag,
      city: p.city,
      type: p.type,
      title: p.title,
      body: p.body,
      upvotes: p.upvotes,
      verified: p.verified,
    }));
  }

  const { data, error } = await client
    .from("community_posts")
    .select("id,city_slug,type,title,body,upvotes")
    .eq("status", "published")
    .order("upvotes", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.error("[532] listPublishedPosts failed:", error.message);
    return [];
  }

  return (data as PostRow[]).map((p) => {
    const { name, flag } = cityMeta(p.city_slug);
    return {
      id: p.id,
      author: "Verified fan",
      flag,
      city: name,
      type: p.type,
      title: p.title,
      body: p.body,
      upvotes: p.upvotes ?? 0,
      verified: true,
    };
  });
}

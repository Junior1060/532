"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CITIES } from "@/data/cities";

export interface CommunityResult {
  ok: boolean;
  message: string;
  needsAuth?: boolean;
}

const ALLOWED_TYPES = new Set(["Tip", "Recommendation", "Warning", "Question"]);

/**
 * Submit a community post. Requires sign-in (RLS ties posts to the author).
 * Posts land as 'pending' for admin moderation before appearing publicly.
 */
export async function createCommunityPost(input: {
  type: string;
  title: string;
  body: string;
  cityName: string;
}): Promise<CommunityResult> {
  const title = input.title?.trim() ?? "";
  const body = input.body?.trim() ?? "";
  const type = ALLOWED_TYPES.has(input.type) ? input.type : "Tip";

  if (title.length < 4) return { ok: false, message: "Add a longer title." };
  if (body.length < 10) return { ok: false, message: "Add a bit more detail." };
  if (title.length > 160 || body.length > 2000) return { ok: false, message: "That's too long." };

  const citySlug = CITIES.find((c) => c.name === input.cityName)?.slug ?? null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, needsAuth: true, message: "Please sign in to post to the community." };
  }

  const { error } = await supabase.from("community_posts").insert({
    author_id: user.id,
    city_slug: citySlug,
    type,
    title,
    body,
    status: "pending",
  });

  if (error) {
    console.error("[532] createCommunityPost failed:", error.message);
    return { ok: false, message: "Could not post right now. Please try again." };
  }

  revalidatePath("/admin");
  return { ok: true, message: "Thanks! Your post was submitted for review." };
}

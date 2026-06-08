"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  message: string;
}

/**
 * Approve or reject a pending business listing.
 *
 * Authorization is enforced twice: here (explicit admin check) and by Postgres
 * RLS ("owner update business" allows public.is_admin()). The action runs with
 * the caller's session, so a non-admin simply cannot write.
 */
export async function setBusinessVerification(
  id: string,
  status: "verified" | "rejected"
): Promise<AdminActionResult> {
  if (!id || (status !== "verified" && status !== "rejected")) {
    return { ok: false, message: "Invalid request." };
  }

  const { user, isAdmin, supabase } = await getSessionUser();
  if (!user) return { ok: false, message: "You're not signed in." };
  if (!isAdmin) return { ok: false, message: "You don't have permission to do that." };

  const { error } = await supabase
    .from("businesses")
    .update({ verification: status })
    .eq("id", id);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[532] setBusinessVerification failed:", error.message);
    return { ok: false, message: "Update failed. Please try again." };
  }

  // Refresh anywhere verified listings surface.
  revalidatePath("/admin");
  revalidatePath("/directory");
  revalidatePath("/near-me");

  return {
    ok: true,
    message: status === "verified" ? "Listing approved." : "Listing rejected.",
  };
}

async function requireAdmin() {
  const { user, isAdmin, supabase } = await getSessionUser();
  if (!user) return { error: "You're not signed in." as const, supabase };
  if (!isAdmin) return { error: "You don't have permission to do that." as const, supabase };
  return { error: null, supabase };
}

/** Moderate a community post: publish it or remove it. */
export async function moderatePost(
  id: string,
  status: "published" | "removed"
): Promise<AdminActionResult> {
  if (!id || (status !== "published" && status !== "removed")) {
    return { ok: false, message: "Invalid request." };
  }
  const { error, supabase } = await requireAdmin();
  if (error) return { ok: false, message: error };

  const { error: dbError } = await supabase
    .from("community_posts")
    .update({ status })
    .eq("id", id);
  if (dbError) return { ok: false, message: "Update failed. Please try again." };

  revalidatePath("/admin");
  revalidatePath("/community");
  return { ok: true, message: status === "published" ? "Post published." : "Post removed." };
}

/** Publish a new city/match-day alert. */
export async function postAlert(
  message: string,
  citySlug: string | null,
  level: "info" | "warning" | "critical" = "warning"
): Promise<AdminActionResult> {
  const text = message.trim();
  if (!text) return { ok: false, message: "Alert text is required." };
  const { error, supabase } = await requireAdmin();
  if (error) return { ok: false, message: error };

  const { error: dbError } = await supabase
    .from("alerts")
    .insert({ message: text, city_slug: citySlug, level, active: true });
  if (dbError) return { ok: false, message: "Could not publish the alert." };

  revalidatePath("/admin");
  return { ok: true, message: "Alert published." };
}

/** Deactivate (soft-delete) an alert. */
export async function deactivateAlert(id: string): Promise<AdminActionResult> {
  if (!id) return { ok: false, message: "Invalid request." };
  const { error, supabase } = await requireAdmin();
  if (error) return { ok: false, message: error };

  const { error: dbError } = await supabase.from("alerts").update({ active: false }).eq("id", id);
  if (dbError) return { ok: false, message: "Could not remove the alert." };

  revalidatePath("/admin");
  return { ok: true, message: "Alert removed." };
}

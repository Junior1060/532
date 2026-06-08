"use server";

import { headers } from "next/headers";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { rateLimit } from "@/lib/rateLimit";
import type { BusinessCategory } from "@/lib/types";

export interface SubmitState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

// Runtime allow-list mirroring the BusinessCategory union in lib/types.ts.
const ALLOWED_CATEGORIES = new Set<BusinessCategory>([
  "restaurants", "hotels", "transportation", "safe-rides", "tour-guides",
  "translators", "photographers", "bars", "fan-events", "luggage-storage",
  "currency-exchange", "sim-cards", "pharmacies", "medical-services",
  "security-services", "airport-transfers",
]);

// Per-field maximum lengths — server-side cap so a client can't post megabytes.
const MAX = {
  name: 120, contactName: 80, email: 160, phone: 40,
  website: 300, address: 200, city: 60, description: 2000,
} as const;

export async function submitBusiness(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  // Rate limit per client IP (best-effort; see lib/rateLimit.ts).
  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for")?.split(",")[0].trim()) || hdrs.get("x-real-ip") || "unknown";
  if (!rateLimit(`submitBusiness:${ip}`, 5, 10 * 60_000).ok) {
    return { ok: false, message: "You've submitted several times recently. Please try again in a few minutes." };
  }

  const get = (k: string) => (formData.get(k)?.toString() || "").trim();

  const data = {
    name: get("name"),
    category: get("category"),
    contactName: get("contactName"),
    email: get("email"),
    phone: get("phone"),
    website: get("website"),
    address: get("address"),
    city: get("city"),
    description: get("description"),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Business name is required.";
  else if (data.name.length > MAX.name) errors.name = "Business name is too long.";
  if (!ALLOWED_CATEGORIES.has(data.category as BusinessCategory)) errors.category = "Select a valid category.";
  if (!data.contactName) errors.contactName = "Contact name is required.";
  else if (data.contactName.length > MAX.contactName) errors.contactName = "Contact name is too long.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || data.email.length > MAX.email) errors.email = "Enter a valid email.";
  if (!data.phone) errors.phone = "Phone is required.";
  else if (data.phone.length > MAX.phone) errors.phone = "Phone number is too long.";
  if (data.website && (data.website.length > MAX.website || !/^https?:\/\//i.test(data.website)))
    errors.website = "Enter a valid URL starting with http(s)://";
  if (data.address.length > MAX.address) errors.address = "Address is too long.";
  if (!data.city) errors.city = "Select a city.";
  else if (data.city.length > MAX.city) errors.city = "City is too long.";
  if (data.description.length < 20) errors.description = "Add at least 20 characters.";
  else if (data.description.length > MAX.description) errors.description = "Description is too long (2000 characters max).";

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  const record = {
    ...data,
    slug: slugify(`${data.name}-${data.city}`),
    status: "pending" as const,
    submitted_at: new Date().toISOString(),
  };

  // Persist to Supabase when configured; otherwise accept and log (seed-data mode).
  // Uses the service-role client: submissions are anonymous (no owner session),
  // so they must bypass the owner-scoped RLS insert policy. New rows land as
  // `verification: 'pending'` for an admin to approve in the dashboard.
  if (SUPABASE_CONFIGURED) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("businesses").insert({
        name: record.name,
        category: record.category,
        contact_name: record.contactName,
        email: record.email,
        phone: record.phone,
        website: record.website || null,
        address: record.address || null,
        city_slug: record.city,
        description: record.description,
        slug: record.slug,
        verification: "pending",
      });
      if (error) {
        // Log the detail server-side; return a generic message to the client.
        // eslint-disable-next-line no-console
        console.error("[532] submitBusiness insert failed:", error.message);
        return { ok: false, message: "Submission failed. Please try again shortly." };
      }
    }
  } else {
    // eslint-disable-next-line no-console
    console.log("[532] New business submission (pending review):", record.slug);
  }

  return {
    ok: true,
    message: `Thanks, ${data.contactName}! "${data.name}" was submitted for review. Approved listings appear across ${data.city} pages, the directory, and Match Day Mode — usually within 24 hours.`,
  };
}

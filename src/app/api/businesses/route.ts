import { NextResponse } from "next/server";
import { BUSINESSES } from "@/data/businesses";
import type { BusinessCategory } from "@/lib/types";
import { rateLimit, clientIp } from "@/lib/rateLimit";

/** GET /api/businesses?city=toronto&category=restaurants&verified=true&q=tacos */
export async function GET(req: Request) {
  const { ok, resetAt } = rateLimit(`businesses:${clientIp(req)}`, 60, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const category = searchParams.get("category") as BusinessCategory | null;
  const verified = searchParams.get("verified") === "true";
  // Cap the free-text query so a giant string can't be used to burn CPU.
  const q = (searchParams.get("q") || "").slice(0, 100).toLowerCase();
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 200);

  let list = BUSINESSES.filter((b) => {
    if (city && b.citySlug !== city) return false;
    if (category && b.category !== category) return false;
    if (verified && b.verification !== "verified") return false;
    if (q && !b.name.toLowerCase().includes(q) && !b.tags.some((t) => t.toLowerCase().includes(q))) return false;
    return true;
  });

  list = list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating).slice(0, limit);

  return NextResponse.json({ count: list.length, results: list });
}

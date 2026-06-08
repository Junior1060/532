import { NextResponse } from "next/server";
import type { BusinessCategory } from "@/lib/types";
import { listBusinesses } from "@/lib/data/businesses";
import { rateLimit, clientIp } from "@/lib/rateLimit";

/**
 * GET /api/businesses?city=toronto&category=restaurants&q=tacos
 * Returns verified, public listings from the database (seed fallback in dev).
 */
export async function GET(req: Request) {
  const { ok, resetAt } = rateLimit(`businesses:${clientIp(req)}`, 60, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || undefined;
  const category = (searchParams.get("category") as BusinessCategory | null) || undefined;
  // Cap the free-text query so a giant string can't be used to burn CPU.
  const q = (searchParams.get("q") || "").slice(0, 100) || undefined;
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 50, 1), 200);

  const results = await listBusinesses({ city, category, q, limit });

  return NextResponse.json({ count: results.length, results });
}

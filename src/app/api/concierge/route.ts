import { NextResponse } from "next/server";
import { askConcierge } from "@/lib/concierge";
import { listBusinesses } from "@/lib/data/businesses";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const MAX_QUERY_LEN = 500;

/** POST /api/concierge  { "query": "..." } → verified-data answer */
export async function POST(req: Request) {
  const { ok, resetAt } = rateLimit(`concierge:${clientIp(req)}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const query = body?.query;
    if (typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }
    if (query.length > MAX_QUERY_LEN) {
      return NextResponse.json({ error: "query is too long" }, { status: 413 });
    }
    const businesses = await listBusinesses({ limit: 200 });
    const answer = askConcierge(query, businesses);
    return NextResponse.json(answer);
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}

import "server-only";

/**
 * Best-effort in-memory fixed-window rate limiter.
 *
 * NOTE: serverless instances are ephemeral and not shared, so this throttles
 * per-instance, not globally — it raises the cost of abuse and stops naive
 * floods, but is NOT a substitute for an edge WAF or a shared store (Upstash /
 * Vercel KV) under real load. Swap `hits` for a shared store when you scale.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    hits.set(key, { count: 1, resetAt });
    // Opportunistic cleanup so the map can't grow unbounded.
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return { ok: true, remaining: limit - 1, resetAt };
  }

  entry.count += 1;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count), resetAt: entry.resetAt };
}

/** Derive a client identifier from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { CITIES } from "@/data/cities";
import { CATEGORY_LABEL } from "@/data/categories";
import { findCity, detectCategory, type ConciergeAnswer } from "@/lib/concierge";
import type { Business } from "@/lib/types";

/**
 * LLM-backed concierge — the "Claude on miss" half of the hybrid Ask 532.
 *
 * This is RAG, not training: we RETRIEVE the relevant slice of 532's own data
 * (host-city guides + the verified business directory), hand it to Claude as
 * grounding context, and instruct it to answer ONLY from that data. It never
 * invents places, prices, or facts — anything not in the context, it declines.
 *
 * Stays gracefully disabled until ANTHROPIC_API_KEY is set (server-only), so
 * the rule matcher remains the sole answerer with no behavior change.
 */
export const CONCIERGE_LLM_CONFIGURED = !!process.env.ANTHROPIC_API_KEY;

// Public-widget concierge: cheapest/fastest tier. Change this one string to
// upgrade quality (e.g. "claude-sonnet-4-6" or "claude-opus-4-8").
const MODEL = "claude-haiku-4-5";

// Bound token spend: cap how many business rows enter the prompt.
const MAX_BUSINESS_ROWS = 60;

let _client: Anthropic | null | undefined;
function client(): Anthropic | null {
  if (_client !== undefined) return _client;
  _client = CONCIERGE_LLM_CONFIGURED ? new Anthropic() : null;
  return _client;
}

const SYSTEM_PROMPT = `You are "Ask 532", the concierge for 532 — the unofficial city-intelligence and fan-services platform for the 2026 FIFA World Cup across 16 host cities in Canada, the USA, and Mexico.

You answer fan questions using ONLY the 532 DATA provided in the user message (host-city guides and the verified business directory). This data is the single source of truth.

Hard rules:
- Use only facts present in the provided 532 DATA. Never invent businesses, addresses, prices, phone numbers, distances, match fixtures, or stats.
- If the DATA doesn't cover the question, say so plainly and point the user to what 532 does cover (browsing cities, the directory, Match Day Mode). Do not guess.
- Never recommend a business that is not in the provided directory rows.
- Be concise and friendly — a few sentences, or short bullet lines starting with "• " when listing options. Plain text only: no markdown headings, bold, or links inside the text.
- When you reference specific businesses, list them by their exact name. When you lean on a host city's guide, note the city.
- You are unofficial — never claim to be FIFA or speak for the tournament organizers.

Return your answer in the required structured format: the prose in "text", the host city you relied on (its slug) in "citySlug" (empty string if none), and the slugs of any businesses you named in "businessSlugs" (only slugs that appear in the DATA).`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    text: { type: "string" },
    citySlug: { type: "string" },
    businessSlugs: { type: "array", items: { type: "string" } },
  },
  required: ["text", "citySlug", "businessSlugs"],
  additionalProperties: false,
} as const;

/** Compact, token-bounded grounding context drawn entirely from 532's own data. */
function buildContext(query: string, businesses: Business[]): { context: string; pool: Business[] } {
  const q = query.toLowerCase().trim();
  const city = findCity(q);
  const category = detectCategory(q);

  const lines: string[] = [];

  // 1) Host-city roster — lets Claude answer cross-city / comparison questions.
  lines.push("HOST CITIES (16):");
  for (const c of CITIES) {
    lines.push(
      `- ${c.name} [${c.slug}] · ${c.country} · ${c.stadium.name} (${c.stadium.neighborhood}, cap ${c.stadium.capacity}) · ${c.matchCount} matches · ${c.weather.summer}, ${c.weather.tempC} · ${c.timezone} · ${c.currency} · langs: ${c.language} · emergency: ${c.emergency.map((e) => `${e.service} ${e.number}`).join(", ")}`
    );
  }

  // 2) Deep detail for a city named in the question (if any).
  if (city) {
    lines.push("");
    lines.push(`CITY DETAIL — ${city.name} [${city.slug}]:`);
    lines.push(`Tagline: ${city.tagline}`);
    lines.push(`Overview: ${city.overview}`);
    lines.push(`Stadium note: ${city.stadium.note}`);
    lines.push(`Weather: ${city.weather.summer}, ${city.weather.tempC} — ${city.weather.advice}`);
    lines.push(`Transport: ${city.transport.map((t) => `${t.mode}: ${t.detail}`).join(" | ")}`);
    lines.push(`Fan zones: ${city.fanZones.map((f) => `${f.name} (${f.area}, ${f.capacity}) — ${f.vibe}`).join(" | ")}`);
    lines.push(`Safety: ${city.safety.join(" | ")}`);
    lines.push(`Scams to avoid: ${city.scams.join(" | ")}`);
    lines.push(`Attractions: ${city.attractions.join(", ")}`);
    if (city.matches.length) {
      lines.push(`Fixtures: ${city.matches.slice(0, 8).map((m) => `${m.stage}: ${m.home} vs ${m.away} (${m.kickoffLocal})`).join(" | ")}`);
    }
  }

  // 3) Verified businesses — narrowed to the most relevant slice, then bounded.
  let pool = businesses;
  if (city) pool = pool.filter((b) => b.citySlug === city.slug);
  if (category) {
    const filtered = pool.filter((b) => b.category === category);
    if (filtered.length) pool = filtered;
  }
  pool = pool
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
    .slice(0, MAX_BUSINESS_ROWS);

  lines.push("");
  lines.push(`VERIFIED BUSINESS DIRECTORY (${pool.length} rows shown):`);
  if (pool.length) {
    for (const b of pool) {
      const cityName = CITIES.find((c) => c.slug === b.citySlug)?.name ?? b.citySlug;
      const label = CATEGORY_LABEL[b.category] ?? b.category;
      lines.push(
        `- ${b.name} [${b.slug}] · ${label} · ${cityName} · ${b.rating}★ (${b.reviewCount}) · ${b.distanceFromStadiumKm}km from stadium · ${b.address || "address n/a"}`
      );
    }
  } else {
    lines.push("- (no verified businesses match this query)");
  }

  return { context: lines.join("\n"), pool };
}

/**
 * Answer a query with Claude, grounded in 532 data. Returns null when the LLM
 * is not configured or the call fails — the caller then keeps the rule answer.
 */
export async function askConciergeLLM(
  query: string,
  businesses: Business[]
): Promise<ConciergeAnswer | null> {
  const anthropic = client();
  if (!anthropic) return null;

  const { context, pool } = buildContext(query, businesses);

  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `532 DATA:\n${context}\n\nFAN QUESTION: ${query}`,
        },
      ],
      output_config: { format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
    });

    const block = res.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return null;

    let parsed: { text?: unknown; citySlug?: unknown; businessSlugs?: unknown };
    try {
      parsed = JSON.parse(block.text);
    } catch {
      // Structured outputs should guarantee valid JSON; if not, treat raw text as the answer.
      return { text: block.text.trim(), sources: [] };
    }

    const text = typeof parsed.text === "string" ? parsed.text.trim() : "";
    if (!text) return null;

    // Build trustworthy links from OUR data only — never from model-authored URLs.
    const chips: { label: string; href: string }[] = [];
    const bySlug = new Map(pool.map((b) => [b.slug, b]));
    const slugs = Array.isArray(parsed.businessSlugs) ? parsed.businessSlugs : [];
    for (const s of slugs) {
      const biz = typeof s === "string" ? bySlug.get(s) : undefined;
      if (biz && !chips.some((c) => c.href === `/business/${biz.slug}`)) {
        chips.push({ label: biz.name, href: `/business/${biz.slug}` });
      }
      if (chips.length >= 4) break;
    }

    const sources: { label: string; href: string }[] = [];
    const citySlug = typeof parsed.citySlug === "string" ? parsed.citySlug : "";
    const city = CITIES.find((c) => c.slug === citySlug);
    if (city) sources.push({ label: `${city.name} city guide`, href: `/cities/${city.slug}` });
    sources.push({ label: "Browse the directory", href: "/directory" });

    return { text, sources, chips: chips.length ? chips : undefined };
  } catch (err) {
    console.error("[532] concierge LLM error:", err instanceof Error ? err.message : err);
    return null;
  }
}

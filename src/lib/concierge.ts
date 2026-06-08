import { CITIES, getCity } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_LABEL } from "@/data/categories";
import type { Business, BusinessCategory } from "@/lib/types";

export interface ConciergeAnswer {
  text: string;
  sources: { label: string; href: string }[];
  chips?: { label: string; href: string }[];
}

const FALLBACK: ConciergeAnswer = {
  text:
    "I don't currently have verified information for that request. I can only answer from 532's internal city data, the verified business directory, and official 2026 FIFA World Cup information. Try asking about a host city, getting to a stadium, food or pharmacies near a venue, fan zones, or safety tips.",
  sources: [],
  chips: [
    { label: "Browse cities", href: "/cities" },
    { label: "Match Day Mode", href: "/match-day" },
    { label: "Near Me", href: "/near-me" },
  ],
};

function findCity(q: string) {
  return CITIES.find(
    (c) =>
      q.includes(c.slug.replace(/-/g, " ")) ||
      q.includes(c.name.toLowerCase()) ||
      q.includes(c.shortName.toLowerCase()) ||
      q.includes(c.stadium.name.toLowerCase()) ||
      // stadium nicknames
      (c.slug === "toronto" && q.includes("bmo")) ||
      (c.slug === "vancouver" && q.includes("bc place")) ||
      (c.slug === "new-york-new-jersey" && (q.includes("metlife") || q.includes("new york") || q.includes("nyc"))) ||
      (c.slug === "mexico-city" && q.includes("azteca"))
  );
}

function detectCategory(q: string): BusinessCategory | undefined {
  if (/\b(eat|food|restaurant|dinner|lunch|halal|hungry|meal)\b/.test(q)) return "restaurants";
  if (/\b(hotel|stay|sleep|room|accommodation)\b/.test(q)) return "hotels";
  if (/\b(bar|pub|drink|watch the (game|match)|beer)\b/.test(q)) return "bars";
  if (/\b(pharmacy|medicine|pharmacist|prescription)\b/.test(q)) return "pharmacies";
  if (/\b(doctor|medical|clinic|hospital|sick|injured)\b/.test(q)) return "medical-services";
  if (/\b(ride|driver|taxi|cab|uber|lyft|transfer)\b/.test(q)) return "safe-rides";
  if (/\b(sim|data|internet|phone plan|esim)\b/.test(q)) return "sim-cards";
  if (/\b(exchange|currency|money|cash|atm)\b/.test(q)) return "currency-exchange";
  if (/\b(luggage|bag|storage|store my)\b/.test(q)) return "luggage-storage";
  if (/\b(guide|tour)\b/.test(q)) return "tour-guides";
  if (/\b(translat|interpret|language)\b/.test(q)) return "translators";
  if (/\b(airport|arrival|landing)\b/.test(q)) return "airport-transfers";
  return undefined;
}

export function askConcierge(query: string, businesses: Business[] = []): ConciergeAnswer {
  const q = query.toLowerCase().trim();
  if (!q) return FALLBACK;

  const city = findCity(q);
  const category = detectCategory(q);

  // Category + city → directory results
  if (category && city) {
    const matches = businesses.filter(
      (b) => b.citySlug === city.slug && b.category === category
    )
      .sort((a, b) => a.distanceFromStadiumKm - b.distanceFromStadiumKm)
      .slice(0, 3);
    if (matches.length) {
      const list = matches
        .map(
          (m) =>
            `• ${m.name} — ${m.distanceFromStadiumKm} km from ${city.stadium.name}, ${m.rating}★${m.verification === "verified" ? " (verified)" : ""}`
        )
        .join("\n");
      return {
        text: `Here are verified ${CATEGORY_LABEL[category].toLowerCase()} options near ${city.stadium.name} in ${city.name}:\n\n${list}`,
        sources: [
          { label: `${city.name} directory`, href: `/cities/${city.slug}` },
          { label: `${CATEGORY_LABEL[category]} in ${city.shortName}`, href: `/directory/${category}` },
        ],
        chips: matches.map((m) => ({ label: m.name, href: `/business/${m.slug}` })),
      };
    }
  }

  // Transport / route questions
  if (city && /\b(route|get to|getting to|transit|transport|subway|train|metro|how do i get|back after|fastest way|drive)\b/.test(q)) {
    const tips = city.transport.slice(0, 3).map((t) => `• ${t.mode}: ${t.detail}`).join("\n");
    return {
      text: `Getting around ${city.name} for ${city.stadium.name}:\n\n${tips}\n\n${city.stadium.note}`,
      sources: [
        { label: `${city.name} transport guide`, href: `/cities/${city.slug}` },
        { label: "Match Day Mode", href: "/match-day" },
      ],
      chips: [{ label: `Open ${city.shortName} Match Day`, href: "/match-day" }],
    };
  }

  // Fan zones
  if (city && /\b(fan zone|fanfest|gather|watch party|where are .* fans|crowd|supporters)\b/.test(q)) {
    const fz = city.fanZones.map((f) => `• ${f.name} (${f.area}) — ${f.vibe}`).join("\n");
    return {
      text: `Fan zones in ${city.name}:\n\n${fz}`,
      sources: [
        { label: `${city.name} fan zones`, href: `/cities/${city.slug}` },
        { label: "Fan Hubs", href: "/fan-hubs" },
      ],
    };
  }

  // Safety
  if (city && /\b(safe|safety|danger|scam|avoid|careful|crime|emergency)\b/.test(q)) {
    const safety = city.safety.slice(0, 3).map((s) => `• ${s}`).join("\n");
    const scams = city.scams.slice(0, 2).map((s) => `• ${s}`).join("\n");
    const emerg = city.emergency.map((e) => `• ${e.service}: ${e.number}`).join("\n");
    return {
      text: `Safety in ${city.name}:\n\n${safety}\n\nCommon scams to avoid:\n${scams}\n\nEmergency numbers:\n${emerg}`,
      sources: [{ label: `${city.name} safety guide`, href: `/cities/${city.slug}` }],
    };
  }

  // Weather
  if (city && /\b(weather|hot|cold|rain|temperature|wear|pack)\b/.test(q)) {
    return {
      text: `Weather in ${city.name} during the tournament: ${city.weather.summer}, around ${city.weather.tempC}. ${city.weather.advice}`,
      sources: [{ label: `${city.name} overview`, href: `/cities/${city.slug}` }],
    };
  }

  // Matches / schedule
  if (city && /\b(match|schedule|fixture|game|kickoff|playing|when)\b/.test(q)) {
    const next = city.matches.slice(0, 3).map((m) => `• ${m.stage}: ${m.home} vs ${m.away} — ${m.kickoffLocal}`).join("\n");
    return {
      text: `${city.name} hosts ${city.matchCount} matches at ${city.stadium.name}. Upcoming fixtures:\n\n${next}`,
      sources: [{ label: `${city.name} match schedule`, href: `/cities/${city.slug}` }],
    };
  }

  // Generic city overview ("what should I do in Toronto")
  if (city) {
    return {
      text: `${city.name} — ${city.tagline}\n\n${city.overview}\n\nStadium: ${city.stadium.name} (${city.stadium.neighborhood}), hosting ${city.matchCount} matches.`,
      sources: [{ label: `${city.name} city guide`, href: `/cities/${city.slug}` }],
      chips: [
        { label: "Transport", href: `/cities/${city.slug}` },
        { label: "Fan zones", href: `/cities/${city.slug}` },
        { label: "Directory", href: `/directory` },
      ],
    };
  }

  // Category without city → point to directory
  if (category) {
    const cat = CATEGORIES.find((c) => c.slug === category)!;
    return {
      text: `I can find verified ${cat.label.toLowerCase()} in any host city. Tell me which city — for example "${cat.label.toLowerCase()} near BMO Field" — or browse the directory.`,
      sources: [{ label: `${cat.label} directory`, href: `/directory/${category}` }],
      chips: CITIES.slice(0, 4).map((c) => ({ label: c.shortName, href: `/cities/${c.slug}` })),
    };
  }

  // General product questions
  if (/\b(what is 532|who are you|how does this work|about)\b/.test(q)) {
    return {
      text:
        "532 is the unofficial operating system for the 2026 FIFA World Cup — a city intelligence platform helping fans find transport, food, fan zones, safe routes, and trusted local services across all 16 host cities. I only answer from verified internal data, so you can trust what I tell you.",
      sources: [
        { label: "Browse cities", href: "/cities" },
        { label: "How pricing works", href: "/pricing" },
      ],
    };
  }

  if (/\b(final|where is the final)\b/.test(q)) {
    const ny = getCity("new-york-new-jersey")!;
    return {
      text: `The 2026 World Cup Final is at ${ny.stadium.name} in ${ny.stadium.neighborhood} on July 19, 2026.`,
      sources: [{ label: "New York / New Jersey guide", href: "/cities/new-york-new-jersey" }],
    };
  }

  if (/\b(opener|opening|first match)\b/.test(q)) {
    return {
      text: "The tournament opens at Estadio Azteca in Mexico City on June 11, 2026, with Mexico playing the first match.",
      sources: [{ label: "Mexico City guide", href: "/cities/mexico-city" }],
    };
  }

  return FALLBACK;
}

export const SUGGESTED_QUESTIONS = [
  "Where can I eat near BMO Field?",
  "What's the fastest way to get to BC Place?",
  "Where are Argentina fans gathering in Miami?",
  "Closest pharmacy near MetLife Stadium?",
  "What should I know before a match in Toronto?",
  "Where is the World Cup Final?",
];

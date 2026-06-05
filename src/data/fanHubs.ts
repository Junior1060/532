import type { FanHub } from "@/lib/types";

export const FAN_HUBS: FanHub[] = [
  {
    slug: "brazil-toronto",
    country: "Brazil",
    flag: "🇧🇷",
    citySlug: "toronto",
    members: 4820,
    nextWatchParty: { venue: "Maple Leaf Square", match: "Brazil vs Group B", date: "2026-06-20T13:00:00-04:00" },
    description: "The largest Brazilian supporters' community in Toronto — samba, churrasco, and big-screen viewing all tournament long.",
    vibe: "Loud, joyful, all-ages",
  },
  {
    slug: "mexico-los-angeles",
    country: "Mexico",
    flag: "🇲🇽",
    citySlug: "los-angeles",
    members: 9140,
    nextWatchParty: { venue: "LA Live FanFest", match: "Mexico vs Group A", date: "2026-06-17T12:00:00-07:00" },
    description: "El Tri's heartland away from home. Expect green seas of jerseys across DTLA for every Mexico match.",
    vibe: "Passionate, family-strong",
  },
  {
    slug: "argentina-miami",
    country: "Argentina",
    flag: "🇦🇷",
    citySlug: "miami",
    members: 7330,
    nextWatchParty: { venue: "Bayfront Park FanFest", match: "Argentina vs Group", date: "2026-06-21T18:00:00-04:00" },
    description: "Albiceleste fans take over South Florida. Drums, flags, and that unmistakable Argentine roar.",
    vibe: "Electric, chant-heavy",
  },
  {
    slug: "nigeria-vancouver",
    country: "Nigeria",
    flag: "🇳🇬",
    citySlug: "vancouver",
    members: 2210,
    nextWatchParty: { venue: "The PNE FanFest", match: "Super Eagles Watch Party", date: "2026-06-18T18:00:00-07:00" },
    description: "Super Eagles supporters in the Pacific Northwest — afrobeats, jollof, and unstoppable energy.",
    vibe: "Vibrant, welcoming",
  },
  {
    slug: "england-new-york-new-jersey",
    country: "England",
    flag: "🏴",
    citySlug: "new-york-new-jersey",
    members: 6050,
    nextWatchParty: { venue: "Hoboken Waterfront", match: "Three Lions Watch Party", date: "2026-06-22T18:00:00-04:00" },
    description: "Three Lions supporters across the five boroughs and Jersey. Pubs, chants, and full-volume singalongs.",
    vibe: "Pub culture, banter",
  },
  {
    slug: "germany-atlanta",
    country: "Germany",
    flag: "🇩🇪",
    citySlug: "atlanta",
    members: 1980,
    nextWatchParty: { venue: "The Battery", match: "Die Mannschaft Watch Party", date: "2026-06-18T18:00:00-04:00" },
    description: "Die Mannschaft fans gather in the South. Beer gardens, bratwurst, and disciplined optimism.",
    vibe: "Organized, festive",
  },
  {
    slug: "france-dallas",
    country: "France",
    flag: "🇫🇷",
    citySlug: "dallas",
    members: 2540,
    nextWatchParty: { venue: "Deep Ellum", match: "Les Bleus Watch Party", date: "2026-06-22T15:00:00-05:00" },
    description: "Les Bleus supporters in the metroplex — chic, confident, and ready to defend the crown.",
    vibe: "Stylish, spirited",
  },
  {
    slug: "japan-seattle",
    country: "Japan",
    flag: "🇯🇵",
    citySlug: "seattle",
    members: 1670,
    nextWatchParty: { venue: "Seattle Center FanFest", match: "Samurai Blue Watch Party", date: "2026-06-19T18:00:00-07:00" },
    description: "Samurai Blue fans in the Emerald City — famous for cleaning up the stands after every match.",
    vibe: "Respectful, colorful",
  },
  {
    slug: "portugal-boston",
    country: "Portugal",
    flag: "🇵🇹",
    citySlug: "boston",
    members: 3120,
    nextWatchParty: { venue: "City Hall Plaza FanFest", match: "Seleção Watch Party", date: "2026-06-19T15:00:00-04:00" },
    description: "New England's huge Portuguese community comes out in force. Pastéis, port, and pride.",
    vibe: "Proud, deep-rooted",
  },
  {
    slug: "colombia-houston",
    country: "Colombia",
    flag: "🇨🇴",
    citySlug: "houston",
    members: 2880,
    nextWatchParty: { venue: "Discovery Green FanFest", match: "Los Cafeteros Watch Party", date: "2026-06-20T18:00:00-05:00" },
    description: "Los Cafeteros fans bring cumbia and color to Space City. Yellow everywhere.",
    vibe: "Dancing, joyful",
  },
];

export function getFanHub(slug: string): FanHub | undefined {
  return FAN_HUBS.find((h) => h.slug === slug);
}

export function getFanHubsByCity(citySlug: string): FanHub[] {
  return FAN_HUBS.filter((h) => h.citySlug === citySlug);
}

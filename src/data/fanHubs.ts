import type { FanHub } from "@/lib/types";

/**
 * Official FIFA World Cup 2026 Fan Festivals and host-committee fan zones — one or
 * more per host city. Every entry is sourced from an official host-committee / FIFA
 * page (see `sourceUrl`); nothing here is invented. A few host cities (New York/New
 * Jersey, the Bay Area, Seattle) run a decentralized network of fan zones rather than
 * a single festival, so they list several entries.
 *
 * Data current as of June 2026 — venues are confirmed; exact daily hours/programming
 * may still be finalized by each host committee.
 */
export const FAN_HUBS: FanHub[] = [
  {
    slug: "toronto-fan-festival",
    citySlug: "toronto",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Toronto",
    emoji: "🎉",
    venue: "Fort York & The Bentway",
    area: "Downtown waterfront",
    schedule: "June 11 – July 19, 2026",
    description:
      "Toronto's official FIFA Fan Festival runs the full tournament at Fort York and The Bentway, beneath the Gardiner — free grounds with big screens, food, and live music near the waterfront.",
    sourceUrl: "https://torontofwc26.ca/news/fifa-toronto-fan-festival-venue-location",
  },
  {
    slug: "vancouver-fan-festival",
    citySlug: "vancouver",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Vancouver",
    emoji: "🎉",
    venue: "PNE / Hastings Park (PNE Amphitheatre)",
    area: "Hastings Park, East Vancouver",
    schedule: "June 11 – July 19, 2026",
    description:
      "Vancouver's official fan festival fills the PNE grounds at Hastings Park for all 39 days, centered on the new ~10,000-seat amphitheatre. Free grounds access; premium amphitheatre seating is ticketed.",
    sourceUrl: "https://www.vancouverfwc26.ca/fifa-fan-festival",
  },
  {
    slug: "nynj-fan-village-rockefeller",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Fan Village at Rockefeller Center",
    emoji: "🎉",
    venue: "Rockefeller Plaza",
    area: "Midtown Manhattan",
    schedule: "July 6 – 19, 2026",
    description:
      "The flagship of NY/NJ's decentralized fan-zone network — the Rockefeller rink becomes a pitch ringed by big screens. (The originally planned Liberty State Park FIFA Fan Festival was cancelled in early 2026 and replaced by zones across the region.)",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "nynj-jersey-fan-hub",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Jersey Fan Hub",
    emoji: "🎉",
    venue: "Sports Illustrated Stadium",
    area: "Harrison, NJ",
    schedule: "June 11 – July 14, 2026 (select dates)",
    description:
      "The New Jersey anchor of the regional fan-zone network, at Sports Illustrated Stadium in Harrison. Roughly $10/day; free for kids 12 and under.",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "nynj-queens-fan-zone",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Queens Fan Zone",
    emoji: "🎉",
    venue: "USTA Billie Jean King National Tennis Center",
    area: "Flushing, Queens",
    schedule: "June 11 – 27, 2026",
    description:
      "Group-stage fan zone at the USTA Billie Jean King National Tennis Center in Flushing, part of NY/NJ's official network.",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "nynj-brooklyn-fan-zone",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Brooklyn Fan Zone",
    emoji: "🎉",
    venue: "Brooklyn Bridge Park",
    area: "Brooklyn waterfront",
    schedule: "June 13 – July 19, 2026 (select dates)",
    description:
      "East River waterfront fan zone at Brooklyn Bridge Park, with Manhattan-skyline views on select match days.",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "nynj-bronx-fan-zone",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Bronx Fan Zone",
    emoji: "🎉",
    venue: "Bronx Terminal Market",
    area: "South Bronx",
    schedule: "June 13 – 14, 2026",
    description:
      "Opening-weekend fan zone at Bronx Terminal Market in the South Bronx, part of NY/NJ's official network.",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "nynj-staten-island-fan-zone",
    citySlug: "new-york-new-jersey",
    kind: "fan-festival",
    name: "Staten Island Fan Zone",
    emoji: "🎉",
    venue: "SIUH Community Park",
    area: "Staten Island",
    schedule: "June 29 – July 2, 2026",
    description:
      "Staten Island's fan zone at SIUH Community Park, rounding out the five-borough fan-zone network.",
    sourceUrl: "https://nynjfwc26.com/fan-events/",
  },
  {
    slug: "los-angeles-fan-festival",
    citySlug: "los-angeles",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Los Angeles",
    emoji: "🎉",
    venue: "Los Angeles Memorial Coliseum",
    area: "Exposition Park",
    schedule: "June 11 – 14, 2026",
    description:
      "LA's official FIFA Fan Festival is a ticketed opening-weekend event at the Memorial Coliseum in Exposition Park. Tickets from $10; free for kids 12 and under.",
    sourceUrl: "https://losangelesfwc26.com/fifa-fan-festival-los-angeles/",
  },
  {
    slug: "dallas-fan-festival",
    citySlug: "dallas",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Dallas",
    emoji: "🎉",
    venue: "Fair Park",
    area: "Fair Park, east of downtown Dallas",
    schedule: "June 11 – July 19, 2026",
    description:
      "Dallas's official FIFA Fan Festival runs every match day at historic Fair Park, served by the DART Green Line. Free and open to the public. (Matches are at AT&T Stadium in Arlington.)",
    sourceUrl: "https://www.dallasfwc26.com/our-venues/fan-festival/",
  },
  {
    slug: "houston-fan-festival",
    citySlug: "houston",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Houston",
    emoji: "🎉",
    venue: "East Downtown district (next to Shell Energy Stadium)",
    area: "East Downtown (EaDo)",
    schedule: "June 11 – July 19, 2026",
    description:
      "Houston's official fan festival takes over an open-air EaDo district beside Shell Energy Stadium, with a match-ball projection dome. Free; gates open 90 minutes before the first kickoff.",
    sourceUrl: "https://www.fwc26houston.com/fanfestival",
  },
  {
    slug: "atlanta-fan-festival",
    citySlug: "atlanta",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Atlanta",
    emoji: "🎉",
    venue: "Centennial Olympic Park",
    area: "Downtown Atlanta",
    schedule: "June 11 – July 15, 2026",
    description:
      "Atlanta's official 'Global Game, Atlanta Sound' FIFA Fan Festival runs at Centennial Olympic Park downtown. Free, but advance registration is required for entry.",
    sourceUrl: "https://atlantafwc26.com/fan-fest/",
  },
  {
    slug: "miami-fan-festival",
    citySlug: "miami",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Miami",
    emoji: "🎉",
    venue: "Bayfront Park",
    area: "Downtown Miami, Biscayne Bay",
    schedule: "June 13 – July 5, 2026",
    description:
      "Miami's official FIFA Fan Festival spreads across Bayfront Park on Biscayne Bay, hosting up to ~30,000 fans a day through the group and knockout rounds.",
    sourceUrl: "https://miamifwc26.com/fan-festival/",
  },
  {
    slug: "boston-fan-festival",
    citySlug: "boston",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Boston",
    emoji: "🎉",
    venue: "City Hall Plaza",
    area: "Downtown / Government Center",
    schedule: "June 12 – 27, 2026",
    description:
      "Boston's official FIFA Fan Festival sets up downtown at City Hall Plaza through the group-stage window. (The matches themselves are at Gillette Stadium in Foxborough.)",
    sourceUrl: "https://bostonfwc26.com/fifa-fan-festival/",
  },
  {
    slug: "philadelphia-fan-festival",
    citySlug: "philadelphia",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Philadelphia",
    emoji: "🎉",
    venue: "Lemon Hill, East Fairmount Park",
    area: "East Fairmount Park",
    schedule: "June 11 – July 19, 2026",
    description:
      "Philly hosts the only U.S. FIFA Fan Festival running all 39 days, on Lemon Hill in East Fairmount Park near Boathouse Row. Free with online registration.",
    sourceUrl: "https://phillyfwc26.com/fifa-fan-fest",
  },
  {
    slug: "seattle-lets-play-sea",
    citySlug: "seattle",
    kind: "fan-festival",
    name: "Let's Play SEA '26",
    emoji: "🎉",
    venue: "Seattle Center",
    area: "Lower Queen Anne / Uptown",
    schedule: "June – July 2026",
    description:
      "Seattle runs four free fan-celebration sites instead of one festival; Let's Play SEA '26 is the family hub at Seattle Center, beneath the Space Needle.",
    sourceUrl: "https://www.seattlefwc26.org/events/seattle-fan-celebrations",
  },
  {
    slug: "seattle-soccer-house",
    citySlug: "seattle",
    kind: "fan-festival",
    name: "Seattle Soccer House",
    emoji: "🎉",
    venue: "Pacific Place",
    area: "Downtown Seattle",
    schedule: "June – July 2026",
    description:
      "Downtown fan zone at Pacific Place built around a four-story, 70-foot LED screen.",
    sourceUrl: "https://www.seattlefwc26.org/events/seattle-fan-celebrations",
  },
  {
    slug: "seattle-soccer-celebration",
    citySlug: "seattle",
    kind: "fan-festival",
    name: "Seattle Soccer Celebration",
    emoji: "🎉",
    venue: "Waterfront Park / Pier 62",
    area: "Seattle Waterfront",
    schedule: "June – July 2026",
    description:
      "Waterfront celebration with a floating mini-pitch on Elliott Bay, hosted by Sounders FC and Reign FC.",
    sourceUrl: "https://www.seattlefwc26.org/events/seattle-fan-celebrations",
  },
  {
    slug: "seattle-match-day-live",
    citySlug: "seattle",
    kind: "fan-festival",
    name: "Seattle Match Day Live",
    emoji: "🎉",
    venue: "Victory Hall",
    area: "SODO",
    schedule: "June – July 2026",
    description:
      "Match-day viewing at Victory Hall in SODO, a short walk from Lumen Field.",
    sourceUrl: "https://www.seattlefwc26.org/events/seattle-fan-celebrations",
  },
  {
    slug: "bay-area-thrive-city",
    citySlug: "san-francisco-bay-area",
    kind: "fan-festival",
    name: "Thrive City Fan Zone",
    emoji: "🎉",
    venue: "Thrive City at Chase Center",
    area: "Mission Bay, San Francisco",
    schedule: "June 11 – July 19, 2026",
    description:
      "The Bay Area runs 30+ free official fan celebrations rather than one festival; Thrive City at Chase Center is the main San Francisco hub, open all tournament.",
    sourceUrl: "https://www.sfbayareafwc26.com/bay-area-events",
  },
  {
    slug: "bay-area-pier-39",
    citySlug: "san-francisco-bay-area",
    kind: "fan-festival",
    name: "PIER 39 Fan Zone",
    emoji: "🎉",
    venue: "PIER 39",
    area: "The Embarcadero, San Francisco",
    schedule: "from June 12, 2026",
    description:
      "Bayfront fan zone at PIER 39 on the Embarcadero, one of the Bay Area's official fan-celebration sites.",
    sourceUrl: "https://www.sfbayareafwc26.com/bay-area-events",
  },
  {
    slug: "bay-area-mission-rock",
    citySlug: "san-francisco-bay-area",
    kind: "fan-festival",
    name: "Mission Rock Fan Zone",
    emoji: "🎉",
    venue: "China Basin Park at Mission Rock",
    area: "Mission Bay, San Francisco",
    schedule: "from June 13, 2026",
    description:
      "Waterfront fan zone at China Basin Park / Mission Rock, part of the Bay Area's official network.",
    sourceUrl: "https://www.sfbayareafwc26.com/bay-area-events",
  },
  {
    slug: "bay-area-san-pedro-square",
    citySlug: "san-francisco-bay-area",
    kind: "fan-festival",
    name: "San Pedro Square Fan Zone",
    emoji: "🎉",
    venue: "San Pedro Square",
    area: "Downtown San Jose",
    schedule: "June – July 2026",
    description:
      "Downtown San Jose's fan zone at San Pedro Square Market, the closest official celebration to Levi's Stadium.",
    sourceUrl: "https://www.sfbayareafwc26.com/bay-area-events",
  },
  {
    slug: "kansas-city-fan-festival",
    citySlug: "kansas-city",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Kansas City",
    emoji: "🎉",
    venue: "National WWI Museum & Memorial (south lawn)",
    area: "Downtown / Union Station",
    schedule: "18 select days, June – July 2026",
    description:
      "KC's official fan festival sits on the south lawn of the National WWI Museum & Memorial — skyline views and a 65-foot heart-shaped entrance — on 18 selected days, not every match day.",
    sourceUrl: "https://www.kc2026.com/fifa-fan-festival/",
  },
  {
    slug: "mexico-city-fan-festival",
    citySlug: "mexico-city",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Mexico City",
    emoji: "🎉",
    venue: "Zócalo (Plaza de la Constitución)",
    area: "Centro Histórico",
    schedule: "June 11 – July 19, 2026",
    description:
      "Mexico City's official FIFA Fan Festival fills the Zócalo for all 39 days, with the largest LED screen of any host-city festival (~510 m²). Free admission.",
    sourceUrl: "https://www.mexicocityfwc26.com.mx/fifa-fan-festival",
  },
  {
    slug: "guadalajara-fan-festival",
    citySlug: "guadalajara",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Guadalajara",
    emoji: "🎉",
    venue: "Plaza de la Liberación",
    area: "Centro Histórico",
    schedule: "June 11 – July 19, 2026",
    description:
      "Guadalajara's official fan festival stretches across the historic-center plazas around the Cathedral — Plaza de la Liberación as the main stage, with a gastronomic zone at Plaza de Armas. Free, no registration.",
    sourceUrl: "https://guadalajarafwc26.com/fifa-fan-festival",
  },
  {
    slug: "monterrey-fan-festival",
    citySlug: "monterrey",
    kind: "fan-festival",
    name: "FIFA Fan Festival — Monterrey",
    emoji: "🎉",
    venue: "Parque Fundidora",
    area: "Parque Fundidora district",
    schedule: "June 11 – July 19, 2026",
    description:
      "Monterrey's official FIFA Fan Festival takes over Parque Fundidora, the former steel mill turned cultural park. Free entry, first-come capacity.",
    sourceUrl: "https://www.fifafanfestivalmonterrey.com/en",
  },
];

export function getFanHub(slug: string): FanHub | undefined {
  return FAN_HUBS.find((h) => h.slug === slug);
}

export function getFanHubsByCity(citySlug: string): FanHub[] {
  return FAN_HUBS.filter((h) => h.citySlug === citySlug);
}

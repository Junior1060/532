import type { Business, BusinessCategory, PlanTier, VerificationStatus } from "@/lib/types";
import { CITIES } from "./cities";
import { slugify, seededInt, seededValue } from "@/lib/utils";

/**
 * Realistic seed directory. Businesses are generated deterministically per city
 * from curated name pools so every city + category has trustworthy sample listings.
 */

type Seed = {
  category: BusinessCategory;
  names: string[];
  tagPool: string[];
  priceLevel: 1 | 2 | 3 | 4;
};

const SEEDS: Seed[] = [
  {
    category: "restaurants",
    names: ["Estadio Kitchen", "The Halftime Table", "Golazo Cantina", "Pitch & Plate", "Corner Flag Grill", "Midfield Eats"],
    tagPool: ["Halal options", "Open late", "Group bookings", "Vegan menu", "Match-day specials"],
    priceLevel: 2,
  },
  {
    category: "hotels",
    names: ["The Matchday Hotel", "Stadium View Suites", "Pitchside Inn", "Extra Time Lodge", "The Supporters' House"],
    tagPool: ["Free cancellation", "Near transit", "Breakfast included", "Late checkout", "Fan packages"],
    priceLevel: 3,
  },
  {
    category: "transportation",
    names: ["CityRail Concierge", "Transit Pass Hub", "Getaround Transit", "Metro Made Easy"],
    tagPool: ["Multilingual", "Group passes", "Airport links", "24/7 support"],
    priceLevel: 1,
  },
  {
    category: "safe-rides",
    names: ["Verified Ride Co.", "SafeLane Drivers", "GuardedGo", "TrustRide Partners", "NightOwl Transfers"],
    tagPool: ["Background-checked", "Live tracking", "Fixed pricing", "Female drivers available", "Post-match pickup"],
    priceLevel: 2,
  },
  {
    category: "tour-guides",
    names: ["Local Legends Tours", "Insider City Walks", "MatchCity Guides", "Backstreet Experts"],
    tagPool: ["Licensed guide", "Small groups", "Match-day routes", "Food tours"],
    priceLevel: 2,
  },
  {
    category: "translators",
    names: ["FanSpeak Interpreters", "Babel On-Demand", "PolyglotPro", "Bridge Language Co."],
    tagPool: ["10+ languages", "On-demand", "Medical-certified", "Video calls"],
    priceLevel: 2,
  },
  {
    category: "photographers",
    names: ["Stadium Lens", "Matchday Memories", "Golden Hour Studio", "Travel Frame Co."],
    tagPool: ["Same-day delivery", "Drone shots", "Fan portraits", "Event coverage"],
    priceLevel: 3,
  },
  {
    category: "bars",
    names: ["The Offside Tap", "Penalty Box Pub", "Supporters' Bar", "Extra Time Tavern", "The Terrace"],
    tagPool: ["All matches shown", "Craft beer", "Big screens", "Open late", "Country nights"],
    priceLevel: 2,
  },
  {
    category: "fan-events",
    names: ["FanFest Collective", "Watch Party HQ", "Supporters United Events", "Pitch Party Co."],
    tagPool: ["Free entry", "Live DJ", "Country meetups", "Family friendly"],
    priceLevel: 1,
  },
  {
    category: "luggage-storage",
    names: ["BagDrop Central", "StashIt Lockers", "Stadium Luggage Co.", "Safe Stow"],
    tagPool: ["Insured", "Near station", "Hourly rates", "24/7 access"],
    priceLevel: 1,
  },
  {
    category: "currency-exchange",
    names: ["FairRate Exchange", "GlobalCash Bureau", "TrustFX", "Traveler's Currency"],
    tagPool: ["Licensed", "No hidden fees", "Live rates", "Multiple currencies"],
    priceLevel: 1,
  },
  {
    category: "sim-cards",
    names: ["FanConnect SIM", "RoamReady", "DataDash", "GlobalSIM Hub"],
    tagPool: ["eSIM available", "Unlimited data", "Instant setup", "5G network"],
    priceLevel: 1,
  },
  {
    category: "pharmacies",
    names: ["CareFirst Pharmacy", "QuickMeds", "Traveler's Pharmacy", "HealthPoint Rx"],
    tagPool: ["Open late", "Travel kits", "Multilingual staff", "Walk-in"],
    priceLevel: 1,
  },
  {
    category: "medical-services",
    names: ["Urgent Care Plus", "FanHealth Clinic", "Traveler Med Center", "RapidCare Walk-In"],
    tagPool: ["Walk-in", "English-speaking", "Insurance help", "24/7"],
    priceLevel: 2,
  },
  {
    category: "security-services",
    names: ["Guardian Personal Security", "SafeEscort Co.", "Sentinel Protection", "VIP Shield"],
    tagPool: ["Licensed", "Event security", "Personal escort", "Discreet"],
    priceLevel: 4,
  },
  {
    category: "airport-transfers",
    names: ["AirLink Transfers", "ArrivalsPro", "Gateway Rides", "TouchDown Transit"],
    tagPool: ["Meet & greet", "Fixed price", "Flight tracking", "Luggage help"],
    priceLevel: 2,
  },
];

const STREETS = ["Main St", "King St", "Stadium Blvd", "Market Ave", "Harbor Rd", "Central Ave", "Union St", "Park Ave"];

function buildBusinesses(): Business[] {
  const out: Business[] = [];
  for (const city of CITIES) {
    for (const seed of SEEDS) {
      // 1–2 listings per category per city, deterministic.
      const count = seed.category === "restaurants" || seed.category === "bars" || seed.category === "hotels" ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const baseName = seed.names[(city.slug.length + i) % seed.names.length];
        const name = `${baseName} ${city.shortName}`;
        const id = `${city.slug}-${seed.category}-${i}`;
        const seedStr = id;
        const rate = seededValue(seedStr + "r");
        const verification: VerificationStatus =
          rate > 0.25 ? "verified" : rate > 0.12 ? "pending" : "verified";
        const planRoll = seededValue(seedStr + "p");
        const plan: PlanTier =
          planRoll > 0.82 ? "premium" : planRoll > 0.6 ? "featured" : "starter";
        const featured = plan === "premium" || plan === "featured";
        const tagCount = 2 + (seededInt(seedStr + "t", 0, 1));
        const tags = [...seed.tagPool]
          .sort((a, b) => seededValue(seedStr + a) - seededValue(seedStr + b))
          .slice(0, tagCount);
        const num = seededInt(seedStr + "n", 10, 980);
        const street = STREETS[seededInt(seedStr + "s", 0, STREETS.length - 1)];

        out.push({
          id,
          slug: slugify(`${baseName}-${city.shortName}-${i}`),
          name,
          category: seed.category,
          citySlug: city.slug,
          description: `${baseName} is a ${verification === "verified" ? "532-verified" : "newly listed"} ${seed.category.replace("-", " ")} option in ${city.name}, popular with World Cup visitors for being close to ${city.stadium.name} and the main fan zones.`,
          address: `${num} ${street}, ${city.name}`,
          website: `https://${slugify(baseName)}.example.com`,
          phone: `+1 ${seededInt(seedStr + "a", 200, 989)}-${seededInt(seedStr + "b", 200, 989)}-${String(seededInt(seedStr + "c", 1000, 9999))}`,
          email: `hello@${slugify(baseName)}.example.com`,
          whatsapp: rate > 0.4 ? `+1${seededInt(seedStr + "w", 2000000000, 9899999999)}` : undefined,
          hours: rate > 0.5 ? "Daily 8:00 AM – 2:00 AM" : "Mon–Sun 9:00 AM – 11:00 PM",
          verification,
          rating: Math.round((3.8 + seededValue(seedStr + "rt") * 1.2) * 10) / 10,
          reviewCount: seededInt(seedStr + "rc", 18, 1240),
          priceLevel: seed.priceLevel,
          distanceFromStadiumKm: Math.round((0.3 + seededValue(seedStr + "d") * 7) * 10) / 10,
          plan,
          featured,
          tags,
          image: city.accent,
        });
      }
    }
  }
  return out;
}

export const BUSINESSES: Business[] = buildBusinesses();

export function getBusinessesByCity(citySlug: string): Business[] {
  return BUSINESSES.filter((b) => b.citySlug === citySlug);
}

export function getBusinessesByCategory(category: BusinessCategory): Business[] {
  return BUSINESSES.filter((b) => b.category === category);
}

export function getBusiness(slug: string): Business | undefined {
  return BUSINESSES.find((b) => b.slug === slug);
}

export function getFeaturedBusinesses(limit = 6): Business[] {
  return BUSINESSES.filter((b) => b.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function searchBusinesses(query: string): Business[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return BUSINESSES.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.category.includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 24);
}

export const DIRECTORY_STATS = {
  total: BUSINESSES.length,
  verified: BUSINESSES.filter((b) => b.verification === "verified").length,
  cities: CITIES.length,
};

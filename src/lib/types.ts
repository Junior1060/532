export type Country = "Canada" | "United States" | "Mexico";

export type BusinessCategory =
  | "restaurants"
  | "cafes"
  | "hotels"
  | "transportation"
  | "safe-rides"
  | "tour-guides"
  | "translators"
  | "photographers"
  | "bars"
  | "sports-bars"
  | "grocery-stores"
  | "attractions"
  | "fan-events"
  | "luggage-storage"
  | "currency-exchange"
  | "sim-cards"
  | "pharmacies"
  | "medical-services"
  | "security-services"
  | "airport-transfers";

export type VerificationStatus = "verified" | "pending" | "rejected";
export type PlanTier = "starter" | "featured" | "premium" | "enterprise";

export interface CityMatch {
  id: string;
  date: string; // ISO
  stage: string; // "Group Stage", "Round of 32", etc.
  home: string;
  away: string;
  kickoffLocal: string;
}

export interface FanZone {
  name: string;
  area: string;
  capacity: string;
  vibe: string;
}

export interface TransitTip {
  mode: string;
  detail: string;
}

export interface City {
  slug: string;
  name: string;
  shortName: string;
  country: Country;
  countryCode: string;
  flag: string; // emoji
  tagline: string;
  overview: string;
  stadium: {
    name: string;
    capacity: number;
    neighborhood: string;
    note: string;
  };
  matchCount: number;
  weather: {
    summer: string;
    tempC: string;
    advice: string;
  };
  timezone: string;
  currency: string;
  language: string;
  transport: TransitTip[];
  fanZones: FanZone[];
  emergency: { service: string; number: string }[];
  safety: string[];
  scams: string[];
  attractions: string[];
  heroGradient: string; // tailwind gradient classes
  accent: string; // hex
  lat: number;
  lng: number;
  matches: CityMatch[];
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: BusinessCategory;
  citySlug: string;
  description: string;
  address: string;
  website?: string;
  phone: string;
  email: string;
  whatsapp?: string;
  hours: string;
  verification: VerificationStatus;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  distanceFromStadiumKm: number;
  plan: PlanTier;
  featured: boolean;
  tags: string[];
  image: string; // gradient seed / emoji
  // Location + Google Places fields (present on imported listings).
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  googlePlaceId?: string;
  photos?: string[]; // Google photo reference names, served via /api/places/photo
}

export type FanHubKind = "fan-festival" | "supporter-group";

export interface FanHub {
  slug: string;
  citySlug: string;
  kind: FanHubKind;
  name: string; // display name (e.g. "FIFA Fan Festival — Toronto", "American Outlaws Boston")
  emoji: string; // card icon: 🎉 for festivals, a national flag, or ⚽ for club groups
  country?: string; // national team supported (supporter groups), when applicable
  venue?: string; // real venue / location
  area?: string; // neighborhood / area
  schedule?: string; // dates or schedule, when published
  description: string; // honest one- or two-line description
  sourceUrl: string; // official / verifiable link — the data is sourced, not invented
}

export interface CategoryMeta {
  slug: BusinessCategory;
  label: string;
  icon: string; // lucide icon name
  blurb: string;
}

export interface NearMeCategory {
  slug: string;
  label: string;
  icon: string;
  color: string;
}

export type Country = "Canada" | "United States" | "Mexico";

export type BusinessCategory =
  | "restaurants"
  | "hotels"
  | "transportation"
  | "safe-rides"
  | "tour-guides"
  | "translators"
  | "photographers"
  | "bars"
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
}

export interface FanHub {
  slug: string;
  country: string;
  flag: string;
  citySlug: string;
  members: number;
  nextWatchParty: { venue: string; match: string; date: string };
  description: string;
  vibe: string;
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

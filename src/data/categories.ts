import type { CategoryMeta, NearMeCategory, BusinessCategory } from "@/lib/types";

export const CATEGORIES: CategoryMeta[] = [
  { slug: "restaurants", label: "Restaurants", icon: "UtensilsCrossed", blurb: "Verified spots to eat near every stadium and fan zone." },
  { slug: "cafes", label: "Cafes", icon: "Coffee", blurb: "Coffee shops and casual spots to refuel between matches." },
  { slug: "hotels", label: "Hotels", icon: "BedDouble", blurb: "Stays from budget to luxury, ranked by distance and trust." },
  { slug: "transportation", label: "Transportation", icon: "TrainFront", blurb: "Transit help, passes, and getting-around guidance." },
  { slug: "safe-rides", label: "Safe Rides", icon: "Car", blurb: "Vetted drivers and verified pickup partners." },
  { slug: "tour-guides", label: "Tour Guides", icon: "Map", blurb: "Local experts for city tours and match-day navigation." },
  { slug: "translators", label: "Translators", icon: "Languages", blurb: "On-demand interpreters for any language barrier." },
  { slug: "photographers", label: "Photographers", icon: "Camera", blurb: "Capture the trip with verified local photographers." },
  { slug: "bars", label: "Bars", icon: "Beer", blurb: "Where to watch the match with fellow fans." },
  { slug: "sports-bars", label: "Sports Bars", icon: "Trophy", blurb: "Big screens and a roaring crowd for every match." },
  { slug: "grocery-stores", label: "Grocery Stores", icon: "ShoppingCart", blurb: "Supermarkets and corner shops for trip essentials." },
  { slug: "attractions", label: "Attractions", icon: "Landmark", blurb: "Must-see sights and things to do between matches." },
  { slug: "fan-events", label: "Fan Events", icon: "PartyPopper", blurb: "Watch parties, meetups, and supporter gatherings." },
  { slug: "luggage-storage", label: "Luggage Storage", icon: "Luggage", blurb: "Secure bag drop near stations and stadiums." },
  { slug: "currency-exchange", label: "Currency Exchange", icon: "Banknote", blurb: "Fair-rate, licensed exchange you can trust." },
  { slug: "sim-cards", label: "SIM Cards", icon: "Smartphone", blurb: "Data plans and eSIMs for staying connected." },
  { slug: "pharmacies", label: "Pharmacies", icon: "Pill", blurb: "Find medication and health essentials fast." },
  { slug: "medical-services", label: "Medical Services", icon: "Stethoscope", blurb: "Clinics, urgent care, and traveler health." },
  { slug: "security-services", label: "Security Services", icon: "ShieldCheck", blurb: "Personal security and event protection." },
  { slug: "airport-transfers", label: "Airport Transfers", icon: "Plane", blurb: "Reliable airport-to-hotel rides on arrival." },
];

export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const CATEGORY_LABEL: Record<BusinessCategory, string> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.slug] = c.label;
    return acc;
  },
  {} as Record<BusinessCategory, string>
);

/** Near Me discovery categories (live map experience). */
export const NEAR_ME: NearMeCategory[] = [
  { slug: "food", label: "Food", icon: "UtensilsCrossed", color: "#f59e0b" },
  { slug: "washrooms", label: "Washrooms", icon: "Toilet", color: "#3b82f6" },
  { slug: "charging", label: "Charging", icon: "BatteryCharging", color: "#00ff85" },
  { slug: "bars", label: "Bars", icon: "Beer", color: "#a855f7" },
  { slug: "fan-zones", label: "Fan Zones", icon: "Flag", color: "#ef4444" },
  { slug: "pharmacies", label: "Pharmacies", icon: "Pill", color: "#10b981" },
  { slug: "atms", label: "ATMs", icon: "Banknote", color: "#22d3ee" },
  { slug: "safe-rides", label: "Safe Rides", icon: "Car", color: "#eab308" },
  { slug: "police", label: "Police", icon: "Shield", color: "#60a5fa" },
  { slug: "medical", label: "Medical", icon: "Cross", color: "#fb7185" },
  { slug: "open-late", label: "Open Late", icon: "Moon", color: "#818cf8" },
  { slug: "water", label: "Water", icon: "Droplets", color: "#38bdf8" },
];

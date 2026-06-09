import type { BusinessCategory } from "@/lib/types";

/**
 * The 12 importer categories → Google Places query strategy + the internal
 * BusinessCategory they map to. Client-safe (no server-only deps) so both the
 * admin UI and the server Places client can share one source of truth.
 */
export interface PlaceCategoryConfig {
  key: string;
  label: string;
  method: "nearby" | "text";
  includedTypes?: string[];
  query?: string;
  internalCategory: BusinessCategory;
}

export const PLACE_CATEGORIES: PlaceCategoryConfig[] = [
  { key: "restaurants", label: "Restaurants", method: "nearby", includedTypes: ["restaurant"], internalCategory: "restaurants" },
  { key: "cafes", label: "Cafes", method: "nearby", includedTypes: ["cafe", "coffee_shop"], internalCategory: "cafes" },
  { key: "bars", label: "Bars", method: "nearby", includedTypes: ["bar"], internalCategory: "bars" },
  { key: "sports-bars", label: "Sports bars", method: "text", query: "sports bar", internalCategory: "sports-bars" },
  { key: "hotels", label: "Hotels", method: "nearby", includedTypes: ["lodging", "hotel"], internalCategory: "hotels" },
  { key: "transportation", label: "Transportation", method: "nearby", includedTypes: ["transit_station", "subway_station", "train_station", "taxi_stand"], internalCategory: "transportation" },
  { key: "pharmacies", label: "Pharmacies", method: "nearby", includedTypes: ["pharmacy", "drugstore"], internalCategory: "pharmacies" },
  { key: "grocery-stores", label: "Grocery stores", method: "nearby", includedTypes: ["supermarket", "grocery_store"], internalCategory: "grocery-stores" },
  { key: "attractions", label: "Attractions", method: "nearby", includedTypes: ["tourist_attraction"], internalCategory: "attractions" },
  { key: "sim-cards", label: "SIM / phone stores", method: "nearby", includedTypes: ["cell_phone_store", "electronics_store"], internalCategory: "sim-cards" },
  { key: "luggage-storage", label: "Luggage storage", method: "text", query: "luggage storage", internalCategory: "luggage-storage" },
  { key: "currency-exchange", label: "Currency exchange", method: "text", query: "currency exchange", internalCategory: "currency-exchange" },
];

export const PLACE_CATEGORY_KEYS = PLACE_CATEGORIES.map((c) => c.key);

/**
 * Curated city photos (Unsplash CDN, allowed in next.config remotePatterns + CSP).
 * Slugs missing here fall back to a clean tinted placeholder in CityCard.
 * Only verified-resolving URLs are included.
 */
export const CITY_IMAGES: Record<string, string> = {
  toronto: "https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=60",
  vancouver: "https://images.unsplash.com/photo-1560814304-4f05b62af116?auto=format&fit=crop&w=800&q=60",
  "new-york-new-jersey": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=60",
  "los-angeles": "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=800&q=60",
  dallas: "https://images.unsplash.com/photo-1545194445-dddb8f4487c6?auto=format&fit=crop&w=800&q=60",
  houston: "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?auto=format&fit=crop&w=800&q=60",
  atlanta: "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?auto=format&fit=crop&w=800&q=60",
  miami: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=800&q=60",
  boston: "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?auto=format&fit=crop&w=800&q=60",
  philadelphia: "https://images.unsplash.com/photo-1601887389937-0b02c26b602c?auto=format&fit=crop&w=800&q=60",
  seattle: "https://images.unsplash.com/photo-1438401171849-74ac270044ee?auto=format&fit=crop&w=800&q=60",
  "san-francisco-bay-area": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=60",
  "mexico-city": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=60",
  guadalajara: "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?auto=format&fit=crop&w=800&q=60",
  monterrey: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=800&q=60",
};

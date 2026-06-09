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

/**
 * Per-fan-hub photos, keyed by FanHub slug — used so the cities that run several
 * fan zones (NY/NJ, Seattle, Bay Area) don't all show the same city skyline. Each
 * URL was downloaded and visually confirmed to depict the right place. Any fan hub
 * not listed here falls back to its city photo in CITY_IMAGES.
 */
export const FANHUB_IMAGES: Record<string, string> = {
  // New York / New Jersey — distinct boroughs/landmarks
  "nynj-fan-village-rockefeller": "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=800&q=60", // Times Square / Midtown at night
  "nynj-jersey-fan-hub": "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=800&q=60", // Statue of Liberty + harbor
  "nynj-brooklyn-fan-zone": "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=800&q=60", // Brooklyn Bridge at sunset
  "nynj-bronx-fan-zone": "https://images.unsplash.com/photo-1543158266-0066955047b1?auto=format&fit=crop&w=800&q=60", // Manhattan skyline aerial, dusk
  // Seattle — four distinct sites
  "seattle-lets-play-sea": "https://images.unsplash.com/photo-1676695172201-dbbe3b46dc90?auto=format&fit=crop&w=800&q=60", // Space Needle from Kerry Park
  "seattle-soccer-house": "https://images.unsplash.com/photo-1714691461045-0c0b82b2d400?auto=format&fit=crop&w=800&q=60", // Skyline with Mount Rainier
  "seattle-soccer-celebration": "https://images.unsplash.com/photo-1741996657280-fad60bf666c6?auto=format&fit=crop&w=800&q=60", // Waterfront + Great Wheel
  "seattle-match-day-live": "https://images.unsplash.com/photo-1741801515036-083f0108539a?auto=format&fit=crop&w=800&q=60", // Lumen Field
  // San Francisco Bay Area
  "bay-area-thrive-city": "https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=60", // Golden Gate Bridge, sunset
  "bay-area-pier-39": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=60", // Golden Gate Bridge, teal sky
};

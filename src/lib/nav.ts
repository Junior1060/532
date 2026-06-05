// `label` is the English fallback; `key` resolves through the i18n dictionaries
// (see src/lib/i18n.ts) so nav items translate when the language changes.
export const NAV_LINKS = [
  { href: "/cities", label: "Cities", key: "nav.cities" },
  { href: "/directory", label: "Directory", key: "nav.directory" },
  { href: "/match-day", label: "Match Day", key: "nav.matchDay" },
  { href: "/near-me", label: "Near Me", key: "nav.nearMe" },
  { href: "/fan-hubs", label: "Fan Hubs", key: "nav.fanHubs" },
  { href: "/community", label: "Community", key: "nav.community" },
  { href: "/pricing", label: "Pricing", key: "nav.pricing" },
];

export const MOBILE_TABS = [
  { href: "/", label: "Home", icon: "Home", key: "nav.home" },
  { href: "/cities", label: "Cities", icon: "Building2", key: "nav.cities" },
  { href: "/match-day", label: "Match Day", icon: "Radio", key: "nav.matchDay" },
  { href: "/near-me", label: "Near Me", icon: "MapPin", key: "nav.nearMe" },
  { href: "/directory", label: "Directory", icon: "Compass", key: "nav.directory" },
];

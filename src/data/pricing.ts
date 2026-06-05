export interface Plan {
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  href: string;
  highlight?: boolean;
  features: string[];
}

export const BUSINESS_PLANS: Plan[] = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    tagline: "Get listed and discovered.",
    cta: "List for free",
    href: "/list-business",
    features: [
      "Standard directory listing",
      "Appears on your city page",
      "Contact & WhatsApp buttons",
      "Basic business profile",
      "Community reviews",
    ],
  },
  {
    name: "Featured",
    price: "$29",
    period: "/month",
    tagline: "Stand out in your city.",
    cta: "Start Featured",
    href: "/list-business",
    highlight: true,
    features: [
      "Everything in Starter",
      "Featured placement in category",
      "532 Verified badge",
      "Priority in search results",
      "Photo gallery (up to 6)",
      "Performance analytics",
    ],
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    tagline: "Maximum match-day exposure.",
    cta: "Go Premium",
    href: "/list-business",
    features: [
      "Everything in Featured",
      "Homepage exposure",
      "Match Day Mode promotion",
      "Top of city directory",
      "Sponsored placement slots",
      "Dedicated account support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Chains, brands & partners.",
    cta: "Contact sales",
    href: "/list-business",
    features: [
      "Everything in Premium",
      "Multi-city listings",
      "API & bulk management",
      "Custom sponsorships",
      "Co-marketing campaigns",
      "SLA & priority support",
    ],
  },
];

export const FAN_PLANS: Plan[] = [
  {
    name: "Free",
    price: "Free",
    period: "",
    tagline: "Everything to explore.",
    cta: "Start free",
    href: "/cities",
    features: [
      "All 16 city guides",
      "Business directory",
      "Near Me discovery",
      "Match Day Mode",
      "Ask 532 concierge",
    ],
  },
  {
    name: "532 Premium",
    price: "$9",
    period: "/month",
    tagline: "Your VIP concierge.",
    cta: "Go Premium",
    href: "/login",
    highlight: true,
    features: [
      "Personalized itineraries",
      "VIP recommendations",
      "Airport-to-hotel guidance",
      "Priority Ask 532 concierge",
      "Offline city packs",
      "Priority support",
    ],
  },
];

import type { BusinessCategory } from "@/lib/types";

/**
 * Affiliate offers — how 532 earns from the directory without charging fans or
 * onboarding businesses. Each offer attaches to a directory category and links
 * to a travel partner. When a visitor books through the link, the partner pays
 * 532 a commission; the visitor pays the same price either way.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO TURN ON EARNINGS (do this once per partner):
 *   1. Apply to each program below (free):
 *        • Airalo (eSIM)        → partners.airalo.com
 *        • Booking.com (hotels) → admin.booking.com/partner  (Affiliate Partner Program)
 *        • Welcome Pickups      → welcomepickups.com/partners
 *        • GetYourGuide (tours) → partner.getyourguide.com
 *        • Wise (money)         → wise.com/partners
 *   2. They give you an affiliate ID / link. Replace the `YOUR_..._ID`
 *      placeholder in each `href` below with it.
 * Until you do, the links still WORK (they go to the partner) — you just don't
 * earn yet. Nothing breaks. Swap the IDs whenever each program approves you.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface AffiliateOffer {
  id: string;
  category: BusinessCategory; // directory category this offer appears on
  partner: string; // brand name, shown to the user
  icon: string; // lucide icon name
  title: string;
  description: string;
  ctaLabel: string;
  href: string; // partner link with your affiliate ID (placeholder until approved)
}

export const AFFILIATE_OFFERS: AffiliateOffer[] = [
  {
    id: "airalo-esim",
    category: "sim-cards",
    partner: "Airalo",
    icon: "Smartphone",
    title: "Get data the second you land",
    description:
      "Skip airport SIM queues — install an eSIM before you fly and arrive online in any host city. Plans from a few dollars.",
    ctaLabel: "Get an eSIM",
    href: "https://www.airalo.com/?aff=YOUR_AIRALO_ID",
  },
  {
    id: "booking-hotels",
    category: "hotels",
    partner: "Booking.com",
    icon: "BedDouble",
    title: "Book your stay near the stadium",
    description:
      "Compare hotels and apartments across all 16 host cities, with free cancellation on most rooms. Book early — World Cup demand is high.",
    ctaLabel: "Find a hotel",
    href: "https://www.booking.com/index.html?aid=YOUR_BOOKING_AID",
  },
  {
    id: "welcome-transfers",
    category: "airport-transfers",
    partner: "Welcome Pickups",
    icon: "Plane",
    title: "Pre-book your airport ride",
    description:
      "A vetted English-speaking driver waiting at arrivals, fixed price, no surge. Lock in your airport-to-hotel transfer before you travel.",
    ctaLabel: "Book a transfer",
    href: "https://www.welcomepickups.com/?ref=YOUR_WELCOME_ID",
  },
  {
    id: "gyg-tours",
    category: "tour-guides",
    partner: "GetYourGuide",
    icon: "Map",
    title: "Tours & things to do between matches",
    description:
      "Skip-the-line tickets, city tours, and experiences — booked instantly with free cancellation on most options.",
    ctaLabel: "Browse experiences",
    href: "https://www.getyourguide.com/?partner_id=YOUR_GYG_ID",
  },
  {
    id: "wise-money",
    category: "currency-exchange",
    partner: "Wise",
    icon: "Banknote",
    title: "Spend abroad without the bad rates",
    description:
      "A free multi-currency card at the real exchange rate — far cheaper than airport kiosks or foreign-card fees across Canada, the USA, and Mexico.",
    ctaLabel: "Get a Wise card",
    href: "https://wise.com/invite/YOUR_WISE_ID",
  },
];

/** Categories shown as the "Fan essentials" strip on the directory home. */
export const FEATURED_AFFILIATE_IDS = ["airalo-esim", "booking-hotels", "welcome-transfers"];

export function getAffiliateForCategory(category: string): AffiliateOffer | undefined {
  return AFFILIATE_OFFERS.find((o) => o.category === category);
}

export function getFeaturedAffiliates(): AffiliateOffer[] {
  return FEATURED_AFFILIATE_IDS.map((id) => AFFILIATE_OFFERS.find((o) => o.id === id)).filter(
    (o): o is AffiliateOffer => !!o
  );
}

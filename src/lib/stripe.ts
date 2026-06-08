import "server-only";

import Stripe from "stripe";
import type { PlanTier } from "@/lib/types";

export const STRIPE_CONFIGURED = !!process.env.STRIPE_SECRET_KEY;

/** Server-side Stripe client, or null when no secret key is configured. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Use the SDK's pinned API version; bump the `stripe` package deliberately.
    appInfo: { name: "532 World Cup Platform" },
  });
}

/**
 * Maps a billable plan to its Stripe Price ID (set these in your env after
 * creating recurring prices in the Stripe dashboard). Plans without a price
 * (Starter/Free/Enterprise) are handled outside checkout.
 */
export const PLAN_PRICE_ENV: Partial<Record<PlanTier | "fan_premium", string | undefined>> = {
  featured: process.env.STRIPE_PRICE_FEATURED,
  premium: process.env.STRIPE_PRICE_PREMIUM,
  fan_premium: process.env.STRIPE_PRICE_FAN_PREMIUM,
};

/** Resolves a checkout `plan` key from the request to its configured Price ID. */
export function priceIdForPlan(plan: string): string | undefined {
  return PLAN_PRICE_ENV[plan as keyof typeof PLAN_PRICE_ENV];
}

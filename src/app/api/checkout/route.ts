import { NextResponse } from "next/server";
import { getStripe, priceIdForPlan } from "@/lib/stripe";
import { getSessionUser } from "@/lib/supabase/server";
import { SITE } from "@/lib/seo";
import { rateLimit, clientIp } from "@/lib/rateLimit";

/**
 * POST /api/checkout  { plan: "featured" | "premium" | "fan_premium" }
 * Creates a Stripe Checkout Session (subscription) and returns its URL.
 * Requires the user to be signed in so the subscription can be tied to them.
 */
export async function POST(req: Request) {
  const { ok } = rateLimit(`checkout:${clientIp(req)}`, 10, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  let plan = "";
  try {
    const body = await req.json();
    plan = String(body?.plan ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: "Unknown or unconfigured plan." }, { status: 400 });
  }

  // Require sign-in so we can attach the subscription to a user/profile.
  const { user } = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "auth_required", redirect: "/login?next=/pricing" }, { status: 401 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      metadata: { user_id: user.id, plan },
      subscription_data: { metadata: { user_id: user.id, plan } },
      allow_promotion_codes: true,
      success_url: `${SITE.url}/pricing?checkout=success`,
      cancel_url: `${SITE.url}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[532] checkout session failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}

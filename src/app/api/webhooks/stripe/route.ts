import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PlanTier } from "@/lib/types";

/**
 * Stripe webhook. Verifies the signature, then records subscription state in
 * Supabase via the service-role client (RLS-bypassing, server-only).
 *
 * Configure the endpoint URL `${SITE}/api/webhooks/stripe` in the Stripe
 * dashboard and put the signing secret in STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[532] webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Acknowledge so Stripe doesn't retry forever; log for follow-up.
    console.error("[532] webhook received but Supabase service role not configured.");
    return NextResponse.json({ received: true });
  }

  const planTier = (plan: string | undefined): PlanTier => {
    if (plan === "premium" || plan === "featured" || plan === "enterprise") return plan;
    return "starter";
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.user_id || s.client_reference_id || null;
        const plan = planTier(s.metadata?.plan);
        if (userId) {
          await supabase.from("subscriptions").insert({
            owner_id: userId,
            plan,
            status: "active",
            stripe_customer_id: typeof s.customer === "string" ? s.customer : null,
            stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : null,
          });
          if (plan !== "starter") {
            await supabase.from("profiles").update({ is_premium: true }).eq("id", userId);
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const status =
          sub.status === "active" || sub.status === "trialing"
            ? sub.status === "trialing" ? "trialing" : "active"
            : sub.status === "past_due"
              ? "past_due"
              : "canceled";
        await supabase
          .from("subscriptions")
          .update({
            status,
            current_period_end: sub.items.data[0]?.current_period_end
              ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
        // Unhandled event types are fine — just acknowledge.
        break;
    }
  } catch (err) {
    console.error("[532] webhook handler error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

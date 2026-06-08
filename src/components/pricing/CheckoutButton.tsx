"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Starts a Stripe Checkout session for a billable plan. Redirects to Stripe on
 * success, to /login if the user isn't signed in, and shows an inline error
 * if payments aren't configured yet.
 */
export function CheckoutButton({
  plan,
  label,
  className,
}: {
  plan: "featured" | "premium" | "fan_premium";
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.status === 401 && data?.redirect) {
        router.push(data.redirect);
        return;
      }
      if (!res.ok || !data?.url) {
        setError(data?.error || "Could not start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button onClick={checkout} disabled={loading}
        className={cn("flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all disabled:opacity-60", className)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-accent-red">{error}</p>}
    </div>
  );
}

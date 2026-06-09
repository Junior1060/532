import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight } from "lucide-react";
import type { AffiliateOffer } from "@/data/affiliates";

/**
 * Affiliate units for the directory. Always rendered as real, working partner
 * links; 532 earns a commission once your affiliate ID is set in
 * src/data/affiliates.ts. Links are marked rel="sponsored" for transparency.
 */

const REL = "sponsored noopener noreferrer";

/** Full-width banner — shown at the top of a category's directory page. */
export function AffiliateCTA({ offer }: { offer: AffiliateOffer }) {
  return (
    <a
      href={offer.href}
      target="_blank"
      rel={REL}
      className="group relative mb-6 flex items-center gap-4 overflow-hidden rounded-3xl border border-neon-border bg-neon-subtle p-5 transition-all hover:brightness-[1.02] sm:p-6"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-neon-ink">
        <Icon name={offer.icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold text-gray-900">{offer.title}</h3>
          <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
            Sponsored
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{offer.description}</p>
      </div>
      <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-neon px-5 py-2.5 text-sm font-semibold text-gray-900 transition-all group-hover:brightness-105 sm:inline-flex">
        {offer.ctaLabel} <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}

/** Compact card — used in the "Fan essentials" strip. */
export function AffiliateCard({ offer }: { offer: AffiliateOffer }) {
  return (
    <a
      href={offer.href}
      target="_blank"
      rel={REL}
      className="group glass flex flex-col rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-subtle text-neon-ink">
          <Icon name={offer.icon} className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Sponsored
        </span>
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{offer.title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-gray-600">{offer.description}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neon-ink">
        {offer.ctaLabel} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

/** Labeled grid of the featured offers + a one-line affiliate disclosure. */
export function AffiliateStrip({ offers }: { offers: AffiliateOffer[] }) {
  if (!offers.length) return null;
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Fan essentials</h2>
        <span className="text-xs text-gray-400">Affiliate links — 532 may earn a commission, at no extra cost to you.</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <AffiliateCard key={o.id} offer={o} />
        ))}
      </div>
    </div>
  );
}

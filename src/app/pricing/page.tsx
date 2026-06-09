import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BUSINESS_PLANS, FAN_PLANS, type Plan } from "@/data/pricing";
import { CheckoutButton } from "@/components/pricing/CheckoutButton";
import { cn } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { translate, type LanguageCode } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Pricing",
  description: "532 pricing for businesses and fans. List free, upgrade for featured placement and homepage exposure, or go Premium for a VIP fan concierge.",
  path: "/pricing",
});

// Maps the English plan name (stable data key) to its translation key prefix.
const PLAN_KEY: Record<string, string> = {
  Starter: "starter",
  Featured: "featured",
  Premium: "premium",
  Enterprise: "enterprise",
  Free: "fanFree",
  "532 Premium": "fanPremium",
};

// Billable plans route through Stripe Checkout; others are plain links.
const CHECKOUT_PLAN: Record<string, "featured" | "premium" | "fan_premium"> = {
  Featured: "featured",
  Premium: "premium",
  "532 Premium": "fan_premium",
};

export default async function PricingPage() {
  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "commerce.pricing.eyebrow")}
        title={translate(lang, "commerce.pricing.title")}
        description={translate(lang, "commerce.pricing.description")}
      />

      <Section className="py-10">
        <SectionHeading
          eyebrow={translate(lang, "commerce.pricing.business.eyebrow")}
          title={translate(lang, "commerce.pricing.business.title")}
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} delay={i * 0.06} lang={lang} />)}
        </div>
      </Section>

      <Section className="py-10">
        <SectionHeading
          eyebrow={translate(lang, "commerce.pricing.fans.eyebrow")}
          title={translate(lang, "commerce.pricing.fans.title")}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
          {FAN_PLANS.map((plan, i) => <PlanCard key={plan.name} plan={plan} delay={i * 0.06} lang={lang} />)}
        </div>
      </Section>

      <Section className="py-10">
        <div className="glass rounded-4xl p-8 text-center md:p-12">
          <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">{translate(lang, "commerce.pricing.faq.title")}</h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-600">
            {translate(lang, "commerce.pricing.faq.body")}
          </p>
          <Link href="/list-business" className="mt-6 inline-flex rounded-full bg-neon px-7 py-3.5 font-semibold text-gray-900 hover:brightness-110">
            {translate(lang, "commerce.pricing.faq.cta")}
          </Link>
        </div>
      </Section>
    </>
  );
}

function PlanCard({ plan, delay, lang }: { plan: Plan; delay: number; lang: LanguageCode }) {
  const pk = PLAN_KEY[plan.name];
  const tName = pk ? translate(lang, `commerce.plan.${pk}.name`) : plan.name;
  const tTagline = pk ? translate(lang, `commerce.plan.${pk}.tagline`) : plan.tagline;
  const tCta = pk ? translate(lang, `commerce.plan.${pk}.cta`) : plan.cta;
  const tPeriod = pk ? translate(lang, `commerce.plan.${pk}.period`) : plan.period;
  return (
    <Reveal delay={delay}>
      <div className={cn(
        "relative flex h-full flex-col rounded-3xl border p-6",
        plan.highlight ? "border-neon-border bg-gradient-to-b from-neon-subtle to-white shadow-glow" : "border-gray-200 bg-ink-900"
      )}>
        {plan.highlight && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon px-3 py-1 text-xs font-semibold text-gray-900">
            <Sparkles className="mr-1 inline h-3 w-3" /> {translate(lang, "commerce.pricing.mostPopular")}
          </span>
        )}
        <h3 className="text-lg font-semibold text-gray-900">{tName}</h3>
        <p className="mt-1 text-sm text-gray-500">{tTagline}</p>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
          <span className="mb-1 text-sm text-gray-500">{tPeriod}</span>
        </div>
        <ul className="mt-5 flex-1 space-y-2.5">
          {plan.features.map((f, fi) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon-ink" /> {pk ? translate(lang, `commerce.plan.${pk}.feat.${fi}`) : f}
            </li>
          ))}
        </ul>
        {CHECKOUT_PLAN[plan.name] ? (
          <CheckoutButton
            plan={CHECKOUT_PLAN[plan.name]}
            label={tCta}
            className={plan.highlight ? "bg-neon text-gray-900 hover:brightness-110" : "glass text-gray-900 hover:border-neon-border"}
          />
        ) : (
          <Link href={plan.href}
            className={cn("mt-6 flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all",
              plan.highlight ? "bg-neon text-gray-900 hover:brightness-110" : "glass text-gray-900 hover:border-neon-border")}>
            {tCta}
          </Link>
        )}
      </div>
    </Reveal>
  );
}

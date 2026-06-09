import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ExternalLink, Building2 } from "lucide-react";
import { FAN_HUBS, getFanHub } from "@/data/fanHubs";
import { getCity } from "@/data/cities";
import { getBusinessesByCity } from "@/lib/data/businesses";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateFanHub, translateBusinesses } from "@/lib/translateData";

export function generateStaticParams() {
  return FAN_HUBS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = getFanHub(slug);
  if (!hub) {
    const lang = await getServerLang();
    return buildMetadata({ title: translate(lang, "social.fanHub.notFound") });
  }
  return buildMetadata({
    title: hub.name,
    description: hub.description,
    path: `/fan-hubs/${hub.slug}`,
  });
}

export default async function FanHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawHub = getFanHub(slug);
  if (!rawHub) notFound();
  const lang = await getServerLang();
  const hub = await translateFanHub(rawHub, lang);
  const city = getCity(rawHub.citySlug)!;
  const bars = await translateBusinesses(
    (await getBusinessesByCity(city.slug)).filter((b) => b.category === "bars" || b.category === "restaurants").slice(0, 3),
    lang,
  );

  return (
    <>
      <section className="relative overflow-hidden border-b border-gray-200 pb-12 pt-14 md:pt-20">
        <AmbientBackground />
        <div className="container-pad relative z-10">
          <Reveal>
            <Link href="/fan-hubs" className="text-sm text-gray-500 hover:text-neon-ink">{translate(lang, "social.fanHub.backToAll")}</Link>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-6xl">{hub.emoji}</span>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">{hub.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone="neutral"><MapPin className="h-3.5 w-3.5" /> {city.name}</Badge>
                  {hub.schedule && <Badge tone="neon"><Calendar className="h-3.5 w-3.5" /> {hub.schedule}</Badge>}
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-gray-600">{hub.description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={hub.sourceUrl} target="_blank" rel="noopener noreferrer">{translate(lang, "social.fanHub.officialSite")} <ExternalLink className="h-4 w-4" /></ButtonLink>
              <ButtonLink href={`/cities/${city.slug}`} variant="secondary">{translate(lang, "social.fanHub.cityGuide").replace("{city}", city.name)} <ArrowRight className="h-4 w-4" /></ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-neon-ink"><MapPin className="h-5 w-5" /><h2 className="text-lg font-semibold text-gray-900">{translate(lang, "social.fanHub.location")}</h2></div>
            <dl className="mt-4 space-y-3">
              {hub.venue && (
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <Building2 className="mt-0.5 h-4 w-4 text-neon-ink" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">{translate(lang, "social.fanHub.venue")}</dt>
                    <dd className="text-sm text-gray-900">{hub.venue}</dd>
                  </div>
                </div>
              )}
              {hub.area && (
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <MapPin className="mt-0.5 h-4 w-4 text-neon-ink" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">{translate(lang, "social.fanHub.area")}</dt>
                    <dd className="text-sm text-gray-900">{hub.area}</dd>
                  </div>
                </div>
              )}
              {hub.schedule && (
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <Calendar className="mt-0.5 h-4 w-4 text-neon-ink" />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-400">{translate(lang, "social.fanHub.dates")}</dt>
                    <dd className="text-sm text-gray-900">{hub.schedule}</dd>
                  </div>
                </div>
              )}
            </dl>
          </Reveal>

          <Reveal delay={0.1} className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-neon-ink"><ExternalLink className="h-5 w-5" /><h2 className="text-lg font-semibold text-gray-900">{translate(lang, "social.fanHub.officialSite")}</h2></div>
            <p className="mt-2 text-sm text-gray-600">{translate(lang, "social.fanHub.officialBlurb")}</p>
            <a
              href={hub.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 break-all rounded-2xl border border-neon-border bg-neon-subtle p-4 text-sm text-gray-900 hover:brightness-105"
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-neon-ink" />
              {hub.sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </Reveal>
        </div>
      </Section>

      {bars.length > 0 && (
        <Section className="py-8">
          <h2 className="text-2xl font-semibold text-gray-900">{translate(lang, "social.fanHub.recommendedSpots").replace("{city}", city.shortName)}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bars.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        </Section>
      )}
    </>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, MapPin, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { FAN_HUBS, getFanHub } from "@/data/fanHubs";
import { getCity } from "@/data/cities";
import { getBusinessesByCity } from "@/lib/data/businesses";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { Countdown } from "@/components/visuals/Countdown";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";
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
  const city = getCity(hub.citySlug);
  return buildMetadata({
    title: `${hub.country} Fans in ${city?.name}`,
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
      <section className="relative overflow-hidden border-b border-white/[0.06] pb-12 pt-14 md:pt-20">
        <AmbientBackground />
        <div className="container-pad relative z-10">
          <Reveal>
            <Link href="/fan-hubs" className="text-sm text-white/50 hover:text-neon">{translate(lang, "social.fanHub.backToAll")}</Link>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-6xl">{hub.flag}</span>
              <div>
                <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{translate(lang, "social.fanHubs.fansIn").replace("{country}", hub.country).replace("{city}", city.name)}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge tone="neon"><Users className="h-3.5 w-3.5" /> {translate(lang, "social.fanHub.members").replace("{count}", formatNumber(hub.members))}</Badge>
                  <Badge tone="neutral"><MapPin className="h-3.5 w-3.5" /> {city.name}</Badge>
                  <Badge tone="violet">{hub.vibe}</Badge>
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-white/65">{hub.description}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#join">{translate(lang, "social.fanHub.joinHub")} <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href={`/cities/${city.slug}`} variant="secondary">{translate(lang, "social.fanHub.cityGuide").replace("{city}", city.name)}</ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="py-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-neon"><Calendar className="h-5 w-5" /><h2 className="text-lg font-semibold text-white">{translate(lang, "social.fanHub.nextWatchParty")}</h2></div>
            <div className="mt-4 rounded-2xl border border-neon/20 bg-neon/[0.05] p-5">
              <div className="text-xl font-semibold text-white">{hub.nextWatchParty.match}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/60"><MapPin className="h-4 w-4 text-neon" /> {hub.nextWatchParty.venue}</div>
              <div className="mt-4"><Countdown target={hub.nextWatchParty.date} compact /></div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                translate(lang, "social.fanHub.meetupSpot"),
                translate(lang, "social.fanHub.groupChat"),
                translate(lang, "social.fanHub.localTips"),
              ].map((label, i) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] p-4 text-center">
                  <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-neon">
                    {[<MapPin key="m" className="h-4 w-4" />, <MessageSquare key="c" className="h-4 w-4" />, <Sparkles key="s" className="h-4 w-4" />][i]}
                  </div>
                  <div className="mt-2 text-sm text-white/70">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} id="join" className="glass rounded-3xl p-6">
            <h2 className="text-lg font-semibold text-white">{translate(lang, "social.fanHub.joinCountryFans").replace("{country}", hub.country)}</h2>
            <p className="mt-2 text-sm text-white/55">{translate(lang, "social.fanHub.joinBlurb").replace("{city}", city.name)}</p>
            <div className="mt-4 space-y-3">
              <input placeholder={translate(lang, "social.fanHub.yourName")} className="w-full rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon/40" />
              <input placeholder={translate(lang, "social.fanHub.email")} className="w-full rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon/40" />
              <button className="w-full rounded-full bg-neon px-6 py-3 font-semibold text-ink-950 hover:brightness-110">{translate(lang, "social.fanHub.joinButton")}</button>
            </div>
          </Reveal>
        </div>
      </Section>

      {bars.length > 0 && (
        <Section className="py-8">
          <h2 className="text-2xl font-semibold text-white">{translate(lang, "social.fanHub.recommendedSpots").replace("{city}", city.shortName)}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bars.map((b) => <BusinessCard key={b.id} business={b} />)}
          </div>
        </Section>
      )}
    </>
  );
}

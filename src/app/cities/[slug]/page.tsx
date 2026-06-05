import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Users, CloudSun, Clock, Banknote, Languages, TrainFront,
  Flag, ShieldAlert, AlertTriangle, Phone, Sparkles, ArrowRight, Landmark, CalendarDays,
} from "lucide-react";
import { CITIES, getCity } from "@/data/cities";
import { getBusinessesByCity } from "@/data/businesses";
import { getFanHubsByCity } from "@/data/fanHubs";
import { getServerLang } from "@/lib/locale";
import { translate } from "@/lib/i18n";
import { translateCity, translateBusinesses, translateFanHubs } from "@/lib/translateData";
import { jsonLd } from "@/lib/utils";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, LiveDot } from "@/components/ui/Badge";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { MatchCard } from "@/components/cards/MatchCard";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { Countdown } from "@/components/visuals/Countdown";
import { buildMetadata } from "@/lib/seo";
import { cn, formatNumber, seededInt } from "@/lib/utils";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return buildMetadata({ title: "City not found" });
  return buildMetadata({
    title: `${city.name} — World Cup 2026 Guide`,
    description: `${city.name} 2026 World Cup guide: ${city.stadium.name}, ${city.matchCount} matches, transit, fan zones, safety, weather, and verified local services.`,
    path: `/cities/${city.slug}`,
    keywords: [city.name, city.stadium.name, city.country],
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawCity = getCity(slug);
  if (!rawCity) notFound();

  // Machine-translate the city prose + related data for the active language.
  const lang = await getServerLang();
  const city = await translateCity(rawCity, lang);
  const businesses = await translateBusinesses(
    getBusinessesByCity(rawCity.slug).filter((b) => b.featured).slice(0, 6),
    lang
  );
  const hubs = await translateFanHubs(getFanHubsByCity(rawCity.slug), lang);
  const fansNow = seededInt(city.slug + "f", 4000, 22000);
  const nextMatch = city.matches[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] pb-12 pt-14 md:pt-20">
        <AmbientBackground />
        <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-50", city.heroGradient)} />
        <div className="container-pad relative z-10">
          <Reveal>
            <Link href="/cities" className="text-sm text-white/50 hover:text-neon">{translate(lang, "cities.detail.allCities")}</Link>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-5xl drop-shadow md:text-6xl">{city.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                    {city.name}
                  </h1>
                </div>
                <p className="text-white/55">{city.country} · {city.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/65 md:text-lg">
              {city.overview}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white/80">
                <LiveDot /> {translate(lang, "cities.detail.fansActive").replace("{count}", formatNumber(fansNow))}
              </span>
              <Badge tone="neon"><CalendarDays className="h-3.5 w-3.5" /> {translate(lang, "cities.detail.matches").replace("{count}", String(city.matchCount))}</Badge>
              <Badge tone="neutral"><Clock className="h-3.5 w-3.5" /> {city.timezone}</Badge>
              <Badge tone="neutral"><Banknote className="h-3.5 w-3.5" /> {city.currency}</Badge>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/match-day">{translate(lang, "cities.detail.matchDayMode")} <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href={`/directory?city=${city.slug}`} variant="secondary">
                {translate(lang, "cities.detail.localServicesIn").replace("{name}", city.shortName)}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick facts */}
      <Section className="py-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Fact icon={Landmark} label={translate(lang, "cities.detail.fact.stadium")} value={city.stadium.name} sub={translate(lang, "cities.detail.fact.capacity").replace("{count}", formatNumber(city.stadium.capacity))} />
          <Fact icon={CloudSun} label={translate(lang, "cities.detail.fact.weather")} value={city.weather.tempC} sub={city.weather.summer} />
          <Fact icon={Languages} label={translate(lang, "cities.detail.fact.language")} value={city.language} />
          <Fact icon={MapPin} label={translate(lang, "cities.detail.fact.stadiumArea")} value={city.stadium.neighborhood} />
        </div>
      </Section>

      {/* Stadium + next match */}
      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-neon">
              <Landmark className="h-5 w-5" />
              <h2 className="text-lg font-semibold text-white">{city.stadium.name}</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div><div className="text-white/45">{translate(lang, "cities.detail.stadium.capacity")}</div><div className="text-white">{formatNumber(city.stadium.capacity)}</div></div>
              <div><div className="text-white/45">{translate(lang, "cities.detail.stadium.neighborhood")}</div><div className="text-white">{city.stadium.neighborhood}</div></div>
              <div><div className="text-white/45">{translate(lang, "cities.detail.stadium.matches")}</div><div className="text-white">{city.matchCount}</div></div>
            </div>
            <p className="mt-4 rounded-2xl border border-neon/20 bg-neon/[0.05] p-4 text-sm text-white/70">
              <ShieldAlert className="mr-1.5 inline h-4 w-4 text-neon" />
              {city.stadium.note}
            </p>
          </Reveal>

          {nextMatch && (
            <Reveal delay={0.1} className="glass rounded-3xl p-6">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/45">
                {translate(lang, "cities.detail.nextAt").replace("{name}", city.shortName)}
              </div>
              <div className="text-lg font-semibold text-white">
                {nextMatch.home} <span className="text-white/40">{translate(lang, "cities.detail.vs")}</span> {nextMatch.away}
              </div>
              <div className="mt-1 text-sm text-white/55">{nextMatch.stage} · {nextMatch.kickoffLocal}</div>
              <div className="mt-4">
                <Countdown target={nextMatch.date} compact />
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Matches */}
      <Section className="py-8">
        <SectionHeading eyebrow={translate(lang, "cities.detail.schedule.eyebrow")} title={translate(lang, "cities.detail.schedule.title").replace("{name}", city.stadium.name)} />
        <Stagger className="mt-6 grid gap-3 md:grid-cols-2">
          {city.matches.map((m) => (
            <StaggerItem key={m.id}>
              <MatchCard match={m} flag={city.flag} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Transport + Fan Zones */}
      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-2 text-neon">
              <TrainFront className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">{translate(lang, "cities.detail.gettingAround")}</h3>
            </div>
            <ul className="space-y-3">
              {city.transport.map((t) => (
                <li key={t.mode} className="border-l-2 border-neon/30 pl-3">
                  <div className="text-sm font-medium text-white">{t.mode}</div>
                  <div className="text-sm text-white/55">{t.detail}</div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-2 text-neon">
              <Flag className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">{translate(lang, "cities.detail.fanZones")}</h3>
            </div>
            <div className="space-y-3">
              {city.fanZones.map((f) => (
                <div key={f.name} className="rounded-2xl border border-white/[0.07] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{f.name}</span>
                    <span className="text-xs text-white/45">{f.capacity}</span>
                  </div>
                  <div className="text-xs text-neon/80">{f.area}</div>
                  <div className="mt-1 text-sm text-white/55">{f.vibe}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Safety + Scams + Emergency */}
      <Section className="py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Reveal className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-2 text-accent-blue">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">{translate(lang, "cities.detail.safetyTips")}</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-white/65">
              {city.safety.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-accent-blue">•</span>{s}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-2 text-accent-amber">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">{translate(lang, "cities.detail.scamWarnings")}</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-white/65">
              {city.scams.map((s) => (
                <li key={s} className="flex gap-2"><span className="text-accent-amber">•</span>{s}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.16} className="glass rounded-3xl p-6">
            <div className="mb-4 flex items-center gap-2 text-accent-red">
              <Phone className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">{translate(lang, "cities.detail.emergency")}</h3>
            </div>
            <ul className="space-y-2.5">
              {city.emergency.map((e) => (
                <li key={e.service} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                  <span className="text-sm text-white/65">{e.service}</span>
                  <a href={`tel:${e.number}`} className="text-sm font-semibold text-accent-red">{e.number}</a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Attractions */}
      <Section className="py-8">
        <SectionHeading eyebrow={translate(lang, "cities.detail.attractions.eyebrow")} title={translate(lang, "cities.detail.attractions.title").replace("{name}", city.name)} />
        <div className="mt-6 flex flex-wrap gap-2.5">
          {city.attractions.map((a) => (
            <span key={a} className="glass rounded-full px-4 py-2 text-sm text-white/75">
              <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-neon" />{a}
            </span>
          ))}
        </div>
      </Section>

      {/* Local businesses */}
      {businesses.length > 0 && (
        <Section className="py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading eyebrow={translate(lang, "cities.detail.directory.eyebrow")} title={translate(lang, "cities.detail.directory.title").replace("{name}", city.name)} />
            <ButtonLink href={`/directory?city=${city.slug}`} variant="outline" size="sm">
              {translate(lang, "cities.detail.seeAll")} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
          <Stagger className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((b) => (
              <StaggerItem key={b.id}><BusinessCard business={b} /></StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {/* Fan hubs */}
      {hubs.length > 0 && (
        <Section className="py-8">
          <SectionHeading eyebrow={translate(lang, "cities.detail.community.eyebrow")} title={translate(lang, "cities.detail.community.title").replace("{name}", city.shortName)} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hubs.map((h) => (
              <Link key={h.slug} href={`/fan-hubs/${h.slug}`} className="glass glass-hover flex items-center gap-4 rounded-3xl p-5">
                <span className="text-4xl">{h.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white">{translate(lang, "cities.detail.fansIn").replace("{country}", h.country).replace("{name}", city.shortName)}</div>
                  <div className="text-sm text-white/50">{translate(lang, "cities.detail.members").replace("{count}", formatNumber(h.members)).replace("{vibe}", h.vibe)}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-white/40" />
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: city.name,
            description: city.overview,
            address: { "@type": "PostalAddress", addressCountry: city.countryCode },
            geo: { "@type": "GeoCoordinates", latitude: city.lat, longitude: city.lng },
          }),
        }}
      />
    </>
  );
}

function Fact({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <Icon className="h-4 w-4 text-neon" />
      <div className="mt-2 text-xs uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold text-white" title={value}>{value}</div>
      {sub && <div className="text-xs text-white/45">{sub}</div>}
    </div>
  );
}

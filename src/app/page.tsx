import Link from "next/link";
import { ArrowRight, Radio, MapPin, Sparkles, ShieldCheck, Users, Star } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { LiveTicker } from "@/components/layout/LiveTicker";
import { LiveModules } from "@/components/live/LiveModules";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CityCard } from "@/components/cards/CityCard";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { CITIES, COUNTRIES } from "@/data/cities";
import { CATEGORIES } from "@/data/categories";
import { getFeaturedBusinesses, getDirectoryStats } from "@/lib/data/businesses";
import { Icon } from "@/components/ui/Icon";
import { Flag as FlagImg } from "@/components/ui/Flag";
import { MatchDayTeaser } from "@/components/home/MatchDayTeaser";
import { ConciergeTeaser } from "@/components/home/ConciergeTeaser";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateCities, translateCategories, translateBusinesses } from "@/lib/translateData";

export default async function HomePage() {
  const lang = await getServerLang();
  const featuredCities = await translateCities(CITIES.slice(0, 6), lang);
  const [rawFeatured, DIRECTORY_STATS] = await Promise.all([getFeaturedBusinesses(6), getDirectoryStats()]);
  const featured = await translateBusinesses(rawFeatured, lang);
  const categories = await translateCategories(CATEGORIES.slice(0, 12), lang);

  return (
    <>
      <Hero />
      <LiveTicker />

      {/* Live control room */}
      <Section className="pt-14">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-ink">
                {translate(lang, "home.liveRoom.eyebrow")}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
                {translate(lang, "home.liveRoom.title")}
              </h2>
            </div>
            <Link href="/match-day" className="hidden text-sm text-gray-600 hover:text-neon-ink md:block">
              {translate(lang, "home.liveRoom.openMatchDay")}
            </Link>
          </div>
        </Reveal>
        <LiveModules />
      </Section>

      {/* Stats band */}
      <Section className="py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: MapPin, value: "16", label: translate(lang, "home.stats.hostCities") },
            { icon: ShieldCheck, value: `${DIRECTORY_STATS.verified}+`, label: translate(lang, "home.stats.verifiedBusinesses") },
            { icon: Users, value: "104", label: translate(lang, "home.stats.matchesCovered") },
            { icon: Star, value: "3", label: translate(lang, "home.stats.countriesOneApp") },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="glass rounded-2xl p-5 text-center">
                <s.icon className="mx-auto h-5 w-5 text-neon-ink" />
                <div className="mt-2 text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Cities */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={translate(lang, "home.cities.eyebrow")}
            title={translate(lang, "home.cities.title")}
            description={translate(lang, "home.cities.description")}
          />
          <ButtonLink href="/cities" variant="outline" size="sm">
            {translate(lang, "home.cities.allCities")} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <span key={c.name} className="glass rounded-full px-3 py-1.5 text-sm text-gray-700">
              <FlagImg emoji={c.flag} /> {c.name} · {c.count}
            </span>
          ))}
        </div>

        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCities.map((city) => (
            <StaggerItem key={city.slug}>
              <CityCard city={city} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <ConciergeTeaser />

      {/* Categories */}
      <Section>
        <SectionHeading
          eyebrow={translate(lang, "home.categories.eyebrow")}
          title={translate(lang, "home.categories.title")}
          description={translate(lang, "home.categories.description")}
          align="center"
        />
        <Stagger className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/directory/${cat.slug}`}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition-all hover:border-neon-border hover:bg-gray-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-subtle text-neon-ink transition-transform group-hover:scale-110">
                  <Icon name={cat.icon} className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-gray-700">{cat.label}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-8 text-center">
          <ButtonLink href="/directory" variant="secondary">
            {translate(lang, "home.categories.browseFull")} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>

      <MatchDayTeaser />

      {/* Featured businesses */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={translate(lang, "home.featured.eyebrow")}
            title={translate(lang, "home.featured.title")}
            description={translate(lang, "home.featured.description")}
          />
          <ButtonLink href="/directory" variant="outline" size="sm">
            {translate(lang, "home.featured.seeAll")} <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
        <Stagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((b) => (
            <StaggerItem key={b.id}>
              <BusinessCard business={b} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Business CTA */}
      <Section>
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl border border-neon-border bg-gradient-to-br from-neon-subtle via-white to-white p-8 md:p-14">
            <div className="absolute inset-0 bg-grid-neon opacity-30" />
            <div className="relative z-10 max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-ink">
                <Sparkles className="h-4 w-4" /> {translate(lang, "home.cta.eyebrow")}
              </div>
              <h2 className="text-balance text-3xl font-bold text-gray-900 md:text-4xl">
                {translate(lang, "home.cta.title")}
              </h2>
              <p className="mt-4 text-gray-600">
                {translate(lang, "home.cta.description")}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/list-business" size="lg">
                  {translate(lang, "home.cta.listBusiness")} <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/pricing" variant="secondary" size="lg">
                  {translate(lang, "home.cta.viewPricing")}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

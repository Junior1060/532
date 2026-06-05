import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star, MapPin, Phone, Mail, Globe, Clock, MessageCircle, ArrowRight, BadgeCheck, Navigation,
} from "lucide-react";
import { BUSINESSES, getBusiness, getBusinessesByCity } from "@/data/businesses";
import { getCity } from "@/data/cities";
import { CATEGORY_LABEL, getCategory } from "@/data/categories";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { VerificationBadge, Badge } from "@/components/ui/Badge";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { ButtonLink } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";
import { cn, formatNumber, jsonLd } from "@/lib/utils";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateBusiness, translateBusinesses, translateCategory } from "@/lib/translateData";

export function generateStaticParams() {
  return BUSINESSES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBusiness(slug);
  if (!b) return buildMetadata({ title: translate(await getServerLang(), "directory.business.notFound") });
  const city = getCity(b.citySlug);
  return buildMetadata({
    title: `${b.name} — ${CATEGORY_LABEL[b.category]} in ${city?.name}`,
    description: b.description,
    path: `/business/${b.slug}`,
  });
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rawBusiness = getBusiness(slug);
  if (!rawBusiness) notFound();
  const lang = await getServerLang();
  const b = await translateBusiness(rawBusiness, lang);
  const city = getCity(rawBusiness.citySlug);
  const related = await translateBusinesses(
    getBusinessesByCity(rawBusiness.citySlug)
      .filter((x) => x.category === rawBusiness.category && x.id !== rawBusiness.id)
      .slice(0, 3),
    lang
  );
  const price = "$".repeat(b.priceLevel);
  const rawCat = getCategory(b.category);
  const categoryLabel = rawCat ? (await translateCategory(rawCat, lang)).label : CATEGORY_LABEL[b.category];

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${b.image}22, #050507 70%)` }} />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container-pad relative z-10 py-12 md:py-16">
          <Reveal>
            <Link href={`/directory/${b.category}`} className="text-sm text-white/50 hover:text-neon">
              ← {categoryLabel}
            </Link>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <VerificationBadge status={b.verification} />
                  {b.featured && <Badge tone="amber">{translate(lang, "directory.business.featured")}</Badge>}
                  <Badge tone="neutral">{categoryLabel}</Badge>
                </div>
                <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{b.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/60">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Star className="h-4 w-4 fill-amber-300" /> {b.rating}
                    <span className="text-white/40">{translate(lang, "directory.business.reviews").replace("{count}", String(formatNumber(b.reviewCount)))}</span>
                  </span>
                  <span>{price}</span>
                  {city && (
                    <Link href={`/cities/${city.slug}`} className="flex items-center gap-1.5 hover:text-neon">
                      <MapPin className="h-4 w-4" /> {city.name}
                    </Link>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Navigation className="h-4 w-4" /> {translate(lang, "directory.business.kmFromStadium").replace("{km}", String(b.distanceFromStadiumKm))}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Main */}
          <div className="space-y-6">
            <Reveal className="glass rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white">{translate(lang, "directory.business.about")}</h2>
              <p className="mt-3 leading-relaxed text-white/65">{b.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {b.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-white/65">{t}</span>
                ))}
              </div>
            </Reveal>

            {/* Gallery placeholder (gradient tiles) */}
            <Reveal delay={0.05} className="glass rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white">{translate(lang, "directory.business.photos")}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.06]"
                    style={{ background: `linear-gradient(${120 + i * 30}deg, ${b.image}33, #0a0a0d)` }}>
                    <div className="h-full w-full bg-grid opacity-20" />
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Reviews summary */}
            <Reveal delay={0.1} className="glass rounded-3xl p-6">
              <h2 className="text-lg font-semibold text-white">{translate(lang, "directory.business.ratings")}</h2>
              <div className="mt-4 flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{b.rating}</div>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(b.rating) ? "fill-amber-300 text-amber-300" : "text-white/20")} />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-white/45">{translate(lang, "directory.business.reviewsShort").replace("{count}", String(formatNumber(b.reviewCount)))}</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === Math.round(b.rating) ? 64 : star === 5 ? 70 : Math.max(4, 30 - star * 5);
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-white/45">
                        <span className="w-3">{star}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-neon/60" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass rounded-3xl p-6">
              <div className="grid gap-3">
                {b.whatsapp && (
                  <a href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-ink-950 transition-all hover:brightness-110">
                    <MessageCircle className="h-4 w-4" /> {translate(lang, "directory.business.whatsapp")}
                  </a>
                )}
                <a href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-full bg-neon px-5 py-3 font-semibold text-ink-950 transition-all hover:brightness-110">
                  {translate(lang, "directory.business.bookNow")}
                </a>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <InfoRow icon={MapPin} value={b.address} />
                <InfoRow icon={Clock} value={b.hours} />
                <InfoRow icon={Phone} value={b.phone} href={`tel:${b.phone.replace(/\s/g, "")}`} />
                <InfoRow icon={Mail} value={b.email} href={`mailto:${b.email}`} />
                {b.website && <InfoRow icon={Globe} value={translate(lang, "directory.business.visitWebsite")} href={b.website} />}
              </div>
            </div>

            {b.verification === "verified" && (
              <div className="glass rounded-3xl p-5">
                <div className="flex items-center gap-2 text-neon">
                  <BadgeCheck className="h-5 w-5" />
                  <span className="font-semibold text-white">{translate(lang, "directory.business.verifiedTitle")}</span>
                </div>
                <p className="mt-2 text-sm text-white/55">
                  {translate(lang, "directory.business.verifiedNote")}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="py-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-white">{translate(lang, "directory.business.moreIn").replace("{category}", categoryLabel.toLowerCase()).replace("{city}", city?.shortName ?? "")}</h2>
            <ButtonLink href={`/directory/${b.category}`} variant="outline" size="sm">{translate(lang, "directory.business.seeAll")} <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <BusinessCard key={r.id} business={r} />)}
          </div>
        </Section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: b.name,
            description: b.description,
            address: b.address,
            telephone: b.phone,
            email: b.email,
            url: b.website,
            aggregateRating: { "@type": "AggregateRating", ratingValue: b.rating, reviewCount: b.reviewCount },
          }),
        }}
      />
    </>
  );
}

function InfoRow({ icon: Icon, value, href }: { icon: React.ComponentType<{ className?: string }>; value: string; href?: string }) {
  const content = (
    <span className="flex items-start gap-2.5 text-white/65">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
      <span className="break-words">{value}</span>
    </span>
  );
  if (href) return <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block transition-colors hover:text-white">{content}</a>;
  return content;
}

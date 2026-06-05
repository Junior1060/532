"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";
import { CITIES } from "@/data/cities";
import { searchBusinesses } from "@/data/businesses";
import { askConcierge } from "@/lib/concierge";
import { SmartSearch } from "@/components/SmartSearch";
import { BusinessCard } from "@/components/cards/BusinessCard";
import { CityCard } from "@/components/cards/CityCard";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function SearchResults() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const q = params.get("q") || "";

  const cityResults = useMemo(
    () =>
      q
        ? CITIES.filter(
            (c) =>
              c.name.toLowerCase().includes(q.toLowerCase()) ||
              c.country.toLowerCase().includes(q.toLowerCase()) ||
              c.stadium.name.toLowerCase().includes(q.toLowerCase())
          )
        : [],
    [q]
  );
  const bizResults = useMemo(() => (q ? searchBusinesses(q) : []), [q]);
  const answer = useMemo(() => (q ? askConcierge(q) : null), [q]);

  return (
    <div>
      <SmartSearch />

      {!q && (
        <p className="mt-10 text-center text-white/45">{t("misc.search.emptyPrompt")}</p>
      )}

      {q && (
        <>
          {/* Concierge answer */}
          {answer && (
            <div className="mt-8 rounded-3xl border border-neon/20 bg-neon/[0.05] p-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neon">
                <Sparkles className="h-4 w-4" /> {t("misc.search.ask532")}
              </div>
              <p className="whitespace-pre-wrap text-white/80">{answer.text}</p>
              {answer.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 border-t border-white/10 pt-3">
                  {answer.sources.map((s) => (
                    <Link key={s.href + s.label} href={s.href} className="text-sm text-white/55 hover:text-neon">{s.label} →</Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {cityResults.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-white">{t("misc.search.cities")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cityResults.map((c) => <CityCard key={c.slug} city={c} />)}
              </div>
            </section>
          )}

          {bizResults.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-white">{t("misc.search.businesses")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bizResults.map((b) => <BusinessCard key={b.id} business={b} />)}
              </div>
            </section>
          )}

          {cityResults.length === 0 && bizResults.length === 0 && (
            <div className="mt-10 rounded-3xl border border-white/10 p-10 text-center">
              <MapPin className="mx-auto h-6 w-6 text-white/30" />
              <p className="mt-3 text-white/55">{t("misc.search.noResults").replace("{q}", q)}</p>
              <Link href="/directory" className="mt-4 inline-flex items-center gap-1 text-sm text-neon hover:underline">
                {t("misc.search.browseDirectory")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

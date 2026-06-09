"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, MapPin } from "lucide-react";
import { CITIES } from "@/data/cities";
import type { ConciergeAnswer } from "@/lib/concierge";
import type { Business } from "@/lib/types";
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

  const [bizResults, setBizResults] = useState<Business[]>([]);
  const [answer, setAnswer] = useState<ConciergeAnswer | null>(null);

  useEffect(() => {
    if (!q) {
      setBizResults([]);
      setAnswer(null);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [bizRes, ansRes] = await Promise.all([
          fetch(`/api/businesses?q=${encodeURIComponent(q)}&limit=24`),
          fetch("/api/concierge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: q }),
          }),
        ]);
        const biz = await bizRes.json();
        const ans = await ansRes.json();
        if (!active) return;
        setBizResults(Array.isArray(biz?.results) ? biz.results : []);
        setAnswer(ans && typeof ans.text === "string" ? ans : null);
      } catch {
        if (active) {
          setBizResults([]);
          setAnswer(null);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [q]);

  return (
    <div>
      <SmartSearch />

      {!q && (
        <p className="mt-10 text-center text-gray-500">{t("misc.search.emptyPrompt")}</p>
      )}

      {q && (
        <>
          {/* Concierge answer */}
          {answer && (
            <div className="mt-8 rounded-3xl border border-neon-border bg-neon-subtle p-6">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neon-ink">
                <Sparkles className="h-4 w-4" /> {t("misc.search.ask532")}
              </div>
              <p className="whitespace-pre-wrap text-gray-700">{answer.text}</p>
              {answer.sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-200 pt-3">
                  {answer.sources.map((s) => (
                    <Link key={s.href + s.label} href={s.href} className="text-sm text-gray-600 hover:text-neon-ink">{s.label} →</Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {cityResults.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("misc.search.cities")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cityResults.map((c) => <CityCard key={c.slug} city={c} />)}
              </div>
            </section>
          )}

          {bizResults.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("misc.search.businesses")}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {bizResults.map((b) => <BusinessCard key={b.id} business={b} />)}
              </div>
            </section>
          )}

          {cityResults.length === 0 && bizResults.length === 0 && (
            <div className="mt-10 rounded-3xl border border-gray-200 p-10 text-center">
              <MapPin className="mx-auto h-6 w-6 text-gray-400" />
              <p className="mt-3 text-gray-600">{t("misc.search.noResults").replace("{q}", q)}</p>
              <Link href="/directory" className="mt-4 inline-flex items-center gap-1 text-sm text-neon-ink hover:underline">
                {t("misc.search.browseDirectory")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { Sparkles, ShieldCheck, Zap, MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { SUGGESTED_QUESTIONS } from "@/lib/concierge";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export async function ConciergeTeaser() {
  const lang = await getServerLang();
  return (
    <Section>
      <div className="relative overflow-hidden rounded-4xl border border-gray-200 bg-gray-50 p-8 md:p-12">
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-border bg-neon-subtle px-3 py-1 text-xs font-semibold text-neon-ink">
              <Sparkles className="h-3.5 w-3.5" /> {translate(lang, "home.concierge.badge")}
            </div>
            <h2 className="text-balance text-3xl font-bold text-gray-900 md:text-4xl">
              {translate(lang, "home.concierge.title")}
            </h2>
            <p className="mt-4 text-gray-600">
              {translate(lang, "home.concierge.description")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-neon-ink" /> {translate(lang, "home.concierge.instant")}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-neon-ink" /> {translate(lang, "home.concierge.local")}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-neon-ink" /> {translate(lang, "home.concierge.verifiedOnly")}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
              <Reveal key={q} delay={i * 0.08}>
                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon-subtle text-neon-ink">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-gray-700">{q}</span>
                </div>
              </Reveal>
            ))}
            <p className="pt-1 text-center text-xs text-gray-400">
              {translate(lang, "home.concierge.tapPrefix")} <span className="text-neon-ink">Ask 532</span> {translate(lang, "home.concierge.tapSuffix")}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

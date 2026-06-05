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
      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-neon/[0.06] via-ink-900 to-ink-950 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
              <Sparkles className="h-3.5 w-3.5" /> {translate(lang, "home.concierge.badge")}
            </div>
            <h2 className="text-balance text-3xl font-bold text-white md:text-4xl">
              {translate(lang, "home.concierge.title")}
            </h2>
            <p className="mt-4 text-white/60">
              {translate(lang, "home.concierge.description")}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-neon" /> {translate(lang, "home.concierge.instant")}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-neon" /> {translate(lang, "home.concierge.local")}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-neon" /> {translate(lang, "home.concierge.verifiedOnly")}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
              <Reveal key={q} delay={i * 0.08}>
                <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-white/75">{q}</span>
                </div>
              </Reveal>
            ))}
            <p className="pt-1 text-center text-xs text-white/40">
              {translate(lang, "home.concierge.tapPrefix")} <span className="text-neon">Ask 532</span> {translate(lang, "home.concierge.tapSuffix")}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

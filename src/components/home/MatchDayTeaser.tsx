import { Radio, ArrowRight, Navigation, Flame, ShieldAlert, Train } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/Badge";
import { StadiumSignals } from "@/components/live/LiveModules";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export async function MatchDayTeaser() {
  const lang = await getServerLang();
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon-ink">
            <Radio className="h-4 w-4" /> {translate(lang, "home.matchDay.eyebrow")}
          </div>
          <h2 className="text-balance text-3xl font-bold text-gray-900 md:text-4xl">
            {translate(lang, "home.matchDay.title")}
          </h2>
          <p className="mt-4 text-gray-600">
            {translate(lang, "home.matchDay.description")}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Navigation, label: translate(lang, "home.matchDay.feature.routes") },
              { icon: Flame, label: translate(lang, "home.matchDay.feature.crowd") },
              { icon: Train, label: translate(lang, "home.matchDay.feature.transit") },
              { icon: ShieldAlert, label: translate(lang, "home.matchDay.feature.emergency") },
            ].map((f) => (
              <div key={f.label} className="flex items-start gap-2.5 text-sm text-gray-700">
                <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-neon-ink" />
                {f.label}
              </div>
            ))}
          </div>

          <div className="mt-7">
            <ButtonLink href="/match-day" size="lg">
              {translate(lang, "home.matchDay.launch")} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-4xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon text-gray-900">
                    <Radio className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">BMO Field · Toronto</div>
                    <div className="text-[11px] text-gray-400">{translate(lang, "home.matchDay.card.matchDay")}</div>
                  </div>
                </div>
                <LiveDot />
              </div>

              {/* mini map */}
              <div className="relative mt-4 h-44 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                <div className="absolute inset-0 bg-grid opacity-40" />
                {/* route line */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 180" fill="none">
                  <path d="M40 150 C 120 120, 160 60, 250 60 S 360 40, 360 40" stroke="#00ff85" strokeWidth="2.5" strokeDasharray="6 6" />
                </svg>
                {/* pings */}
                {[
                  { x: "12%", y: "78%", c: "#00ff85" },
                  { x: "62%", y: "32%", c: "#f59e0b" },
                  { x: "88%", y: "20%", c: "#ef4444" },
                  { x: "40%", y: "55%", c: "#3b82f6" },
                ].map((p, i) => (
                  <span key={i} className="absolute" style={{ left: p.x, top: p.y }}>
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: p.c }} />
                      <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: p.c }} />
                    </span>
                  </span>
                ))}
                <div className="absolute bottom-2 left-2 rounded-lg border border-gray-200 bg-white/90 px-2 py-1 text-[10px] text-gray-600 backdrop-blur">
                  {translate(lang, "home.matchDay.card.fastestRoute")}
                </div>
              </div>

              <StadiumSignals className="mt-4 grid-cols-2 md:grid-cols-2" />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

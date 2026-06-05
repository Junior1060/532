import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { MatchDayDashboard } from "@/components/matchday/MatchDayDashboard";
import { LiveDot } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Navigation, Train, ShieldAlert, Flame, Car, UtensilsCrossed } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Match Day Mode",
  description: "A live tactical dashboard for World Cup 2026 match days: crowd density, safest routes, gate wait times, last-train alerts, and verified late-night food and rides.",
  path: "/match-day",
});

export default async function MatchDayPage() {
  const lang = await getServerLang();
  const features = [
    { icon: Navigation, title: translate(lang, "discovery.matchDay.feature.routes.title"), text: translate(lang, "discovery.matchDay.feature.routes.text") },
    { icon: Flame, title: translate(lang, "discovery.matchDay.feature.crowd.title"), text: translate(lang, "discovery.matchDay.feature.crowd.text") },
    { icon: Train, title: translate(lang, "discovery.matchDay.feature.transit.title"), text: translate(lang, "discovery.matchDay.feature.transit.text") },
    { icon: ShieldAlert, title: translate(lang, "discovery.matchDay.feature.emergency.title"), text: translate(lang, "discovery.matchDay.feature.emergency.text") },
    { icon: Car, title: translate(lang, "discovery.matchDay.feature.pickup.title"), text: translate(lang, "discovery.matchDay.feature.pickup.text") },
    { icon: UtensilsCrossed, title: translate(lang, "discovery.matchDay.feature.food.title"), text: translate(lang, "discovery.matchDay.feature.food.text") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={<span className="flex items-center gap-2"><LiveDot /> {translate(lang, "discovery.matchDay.eyebrow")}</span>}
        title={translate(lang, "discovery.matchDay.title")}
        description={translate(lang, "discovery.matchDay.description")}
      />

      <Section className="py-10">
        <MatchDayDashboard />
      </Section>

      <Section className="py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05} className="glass rounded-3xl p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon/12 text-neon">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-white/55">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

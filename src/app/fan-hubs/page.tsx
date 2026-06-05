import Link from "next/link";
import { Users, Calendar, ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FAN_HUBS } from "@/data/fanHubs";
import { getCity } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";
import { formatNumber } from "@/lib/utils";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateFanHubs } from "@/lib/translateData";

export const metadata = buildMetadata({
  title: "Fan Hubs",
  description: "Country-based supporter communities across World Cup 2026 host cities — watch parties, meetup spots, and recommendations from fellow fans.",
  path: "/fan-hubs",
});

export default async function FanHubsPage() {
  const lang = await getServerLang();
  const hubs = await translateFanHubs(FAN_HUBS, lang);
  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "social.fanHubs.eyebrow")}
        title={translate(lang, "social.fanHubs.title")}
        description={translate(lang, "social.fanHubs.description")}
      />
      <Section className="py-10">
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((h) => {
            const city = getCity(h.citySlug);
            return (
              <StaggerItem key={h.slug}>
                <Link href={`/fan-hubs/${h.slug}`} className="group block overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900 glass-hover">
                  <div className="relative h-28 bg-gradient-to-br from-white/[0.06] to-transparent">
                    <div className="absolute inset-0 bg-grid opacity-25" />
                    <span className="absolute left-4 top-4 text-5xl">{h.flag}</span>
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-ink-950/50 px-2.5 py-1 text-xs text-white/80 backdrop-blur">
                      <Users className="h-3.5 w-3.5 text-neon" /> {formatNumber(h.members)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white group-hover:text-neon">{translate(lang, "social.fanHubs.fansIn").replace("{country}", h.country).replace("{city}", city?.shortName ?? "")}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/55">{h.description}</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-xs text-white/50">
                      <Calendar className="h-3.5 w-3.5 text-neon" />
                      {translate(lang, "social.fanHubs.next").replace("{venue}", h.nextWatchParty.venue)}
                      <ArrowRight className="ml-auto h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>
    </>
  );
}

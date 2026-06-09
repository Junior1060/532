import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FAN_HUBS } from "@/data/fanHubs";
import { getCity } from "@/data/cities";
import { CITY_IMAGES, FANHUB_IMAGES } from "@/data/cityImages";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateFanHubs } from "@/lib/translateData";

export const metadata = buildMetadata({
  title: "Fan Festivals",
  description:
    "Official FIFA Fan Festivals and host-city fan zones across all 16 World Cup 2026 host cities — venues, dates, and official sources.",
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
            const photo = FANHUB_IMAGES[h.slug] ?? CITY_IMAGES[h.citySlug];
            return (
              <StaggerItem key={h.slug}>
                <Link href={`/fan-hubs/${h.slug}`} className="group block h-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={city ? `${city.name} — ${h.name}` : h.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    {/* gradient so chips/text stay legible on any photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                    {city && (
                      <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
                        <MapPin className="h-3.5 w-3.5 text-neon-ink" /> {city.shortName}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-neon-ink">{h.name}</h3>
                    {h.venue && <p className="mt-1 text-sm text-gray-600">{h.venue}</p>}
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">{h.description}</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3 text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-neon-ink" />
                      {h.schedule ?? ""}
                      <ArrowRight className="ml-auto h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
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

import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { NearMeExplorer } from "@/components/nearme/NearMeExplorer";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Near Me",
  description: "Find food, washrooms, charging, bars, fan zones, pharmacies, ATMs, safe rides, and more near any World Cup 2026 stadium — live.",
  path: "/near-me",
});

export default async function NearMePage() {
  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "discovery.nearMe.eyebrow")}
        title={translate(lang, "discovery.nearMe.title")}
        description={translate(lang, "discovery.nearMe.description")}
      />
      <Section className="py-10">
        <NearMeExplorer />
      </Section>
    </>
  );
}

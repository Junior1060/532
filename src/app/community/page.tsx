import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Community",
  description: "Share and discover crowd-sourced tips, recommendations, and warnings from fellow World Cup 2026 fans. Moderated for safety and accuracy.",
  path: "/community",
});

export default async function CommunityPage() {
  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "social.community.eyebrow")}
        title={translate(lang, "social.community.title")}
        description={translate(lang, "social.community.description")}
      />
      <Section className="py-10">
        <CommunityFeed />
      </Section>
    </>
  );
}

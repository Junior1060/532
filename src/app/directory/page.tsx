import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { DirectoryExplorer } from "@/components/directory/DirectoryExplorer";
import { Icon } from "@/components/ui/Icon";
import { BUSINESSES, DIRECTORY_STATS } from "@/data/businesses";
import { CATEGORIES } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateBusinesses, translateCategories } from "@/lib/translateData";

export const metadata = buildMetadata({
  title: "Business Directory",
  description: "Browse verified restaurants, hotels, safe rides, and local services across all 16 World Cup 2026 host cities. Filter by city, category, and rating.",
  path: "/directory",
});

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const { city = "all", category = "all" } = await searchParams;
  const lang = await getServerLang();
  const businesses = await translateBusinesses(BUSINESSES, lang);
  const categories = await translateCategories(CATEGORIES, lang);

  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "directory.eyebrow")
          .replace("{total}", String(DIRECTORY_STATS.total))
          .replace("{verified}", String(DIRECTORY_STATS.verified))}
        title={translate(lang, "directory.title")}
        description={translate(lang, "directory.description")}
      />

      <Section className="py-10">
        {/* Category chips */}
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/directory/${c.slug}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-sm text-white/70 transition-colors hover:border-neon/30 hover:text-white"
            >
              <Icon name={c.icon} className="h-4 w-4 text-neon" />
              {c.label}
            </Link>
          ))}
        </div>

        <DirectoryExplorer businesses={businesses} initialCity={city} initialCategory={category} />
      </Section>
    </>
  );
}

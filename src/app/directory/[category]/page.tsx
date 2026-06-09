import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { DirectoryExplorer } from "@/components/directory/DirectoryExplorer";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, getCategory } from "@/data/categories";
import { getBusinessesByCategory } from "@/lib/data/businesses";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateBusinesses, translateCategory, translateCategories } from "@/lib/translateData";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

// Revalidate so newly approved listings appear without a redeploy.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return buildMetadata({ title: translate(await getServerLang(), "directory.notFound") });
  return buildMetadata({
    title: `${cat.label} — World Cup 2026 Directory`,
    description: `${cat.blurb} Verified ${cat.label.toLowerCase()} across all 16 World Cup host cities.`,
    path: `/directory/${cat.slug}`,
    keywords: [cat.label],
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const rawCat = getCategory(category);
  if (!rawCat) notFound();
  const lang = await getServerLang();
  const cat = await translateCategory(rawCat, lang);
  const businesses = await translateBusinesses(await getBusinessesByCategory(rawCat.slug), lang);
  const otherCategories = await translateCategories(
    CATEGORIES.filter((c) => c.slug !== rawCat.slug).slice(0, 8),
    lang
  );

  return (
    <>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2">
            <Icon name={cat.icon} className="h-4 w-4" />{" "}
            {translate(lang, "directory.category.eyebrow").replace("{label}", cat.label)}
          </span>
        }
        title={cat.label}
        description={cat.blurb}
      >
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {otherCategories.map((c) => (
            <Link key={c.slug} href={`/directory/${c.slug}`}
              className="shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-neon-border hover:text-gray-900">
              {c.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <Section className="py-10">
        <DirectoryExplorer businesses={businesses} lockCategory />
      </Section>
    </>
  );
}

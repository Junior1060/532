import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { SearchResults } from "@/components/SearchResults";
import { Skeleton } from "@/components/ui/Skeleton";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search 532 — cities, food, transit, safe rides, and trusted local services across the 2026 World Cup.",
  path: "/search",
});

export default async function SearchPage() {
  const lang = await getServerLang();
  return (
    <>
      <PageHeader eyebrow={translate(lang, "misc.search.eyebrow")} title={translate(lang, "misc.search.title")} />
      <Section className="py-10">
        <Suspense fallback={<Skeleton className="h-14 w-full" />}>
          <SearchResults />
        </Suspense>
      </Section>
    </>
  );
}

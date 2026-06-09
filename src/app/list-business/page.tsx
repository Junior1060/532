import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { ListBusinessForm } from "@/components/ListBusinessForm";
import { Reveal } from "@/components/ui/Reveal";
import { Clock, Eye, ShieldCheck, TrendingUp } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "List Your Business",
  description: "Get discovered by millions of World Cup 2026 visitors. List your business in under 60 seconds — free to start.",
  path: "/list-business",
});

const perks = [
  { icon: Eye, key: "exposure" },
  { icon: ShieldCheck, key: "trust" },
  { icon: TrendingUp, key: "demand" },
  { icon: Clock, key: "live" },
];

export default async function ListBusinessPage() {
  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "commerce.list.eyebrow")}
        title={translate(lang, "commerce.list.title")}
        description={translate(lang, "commerce.list.description")}
      />

      <Section className="py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {perks.map((p, i) => (
              <Reveal key={p.key} delay={i * 0.06} className="glass flex items-start gap-3.5 rounded-2xl p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-subtle text-neon-ink">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{translate(lang, `commerce.list.perk.${p.key}.title`)}</h3>
                  <p className="mt-1 text-sm text-gray-600">{translate(lang, `commerce.list.perk.${p.key}.text`)}</p>
                </div>
              </Reveal>
            ))}
            <div className="glass rounded-2xl p-5 text-sm text-gray-600">
              {translate(lang, "commerce.list.upsell")}{" "}
              <a href="/pricing" className="text-neon-ink hover:underline">{translate(lang, "commerce.list.upsellLink")}</a>
            </div>
          </div>

          <div>
            <ListBusinessForm />
          </div>
        </div>
      </Section>
    </>
  );
}

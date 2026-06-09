import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { CityCard } from "@/components/cards/CityCard";
import { Flag as FlagImg } from "@/components/ui/Flag";
import { CITIES, COUNTRIES, getCitiesByCountry } from "@/data/cities";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { translateCities } from "@/lib/translateData";

export const metadata = buildMetadata({
  title: "Host Cities",
  description: "All 16 official 2026 FIFA World Cup host cities across Canada, the USA, and Mexico — fully mapped with stadiums, transit, fan zones, and trusted services.",
  path: "/cities",
});

export default async function CitiesPage() {
  const lang = await getServerLang();
  const cities = await translateCities(CITIES, lang);

  return (
    <>
      <PageHeader
        eyebrow={translate(lang, "cities.list.eyebrow")}
        title={translate(lang, "cities.list.title")}
        description={translate(lang, "cities.list.description")}
      />

      {COUNTRIES.map((country) => {
        const countryCities = cities.filter((c) => c.country === country.name);
        return (
          <Section key={country.name} className="py-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-3xl"><FlagImg emoji={country.flag} /></span>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{country.name}</h2>
                <p className="text-sm text-gray-500">
                  {translate(lang, "cities.list.countryCount").replace("{count}", String(country.count))}
                </p>
              </div>
            </div>
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {countryCities.map((city) => (
                <StaggerItem key={city.slug}>
                  <CityCard city={city} />
                </StaggerItem>
              ))}
            </Stagger>
          </Section>
        );
      })}
    </>
  );
}

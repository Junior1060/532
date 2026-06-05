/**
 * i18n configuration for 532.
 *
 * This is the single source of truth for supported languages. The UI (language
 * dropdown, <html dir/lang>) and the future translation layer both read from here.
 *
 * Full text translation is NOT implemented yet — but the structure is ready:
 * drop real strings into `dictionaries` (keyed by language code) and components
 * can start calling the `t()` helper from `useLanguage()` immediately.
 */

export type LanguageCode = "en" | "ar" | "fr" | "es" | "de";
export type TextDirection = "ltr" | "rtl";

export interface Language {
  /** ISO code, used for storage + <html lang>. */
  code: LanguageCode;
  /** Short label shown in the navbar, e.g. "EN". */
  label: string;
  /** Full English name shown in the dropdown list. */
  name: string;
  /** Flag emoji for the dropdown item. */
  flag: string;
  /** Writing direction — Arabic is RTL. */
  dir: TextDirection;
}

export const LANGUAGES: readonly Language[] = [
  { code: "en", label: "EN", name: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "ar", label: "AR", name: "Arabic", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", label: "FR", name: "French", flag: "🇫🇷", dir: "ltr" },
  { code: "es", label: "ES", name: "Spanish", flag: "🇪🇸", dir: "ltr" },
  { code: "de", label: "DE", name: "German", flag: "🇩🇪", dir: "ltr" },
] as const;

export const DEFAULT_LANGUAGE: LanguageCode = "en";

/** localStorage key for the persisted language preference. */
export const LANGUAGE_STORAGE_KEY = "532.lang";

/** Resolve a (possibly unknown) code to a Language, falling back to the default. */
export function getLanguage(code: string | null | undefined): Language {
  return (
    LANGUAGES.find((l) => l.code === code) ??
    LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE)!
  );
}

/** Narrow an arbitrary string to a supported LanguageCode (or null). */
export function toLanguageCode(code: string | null | undefined): LanguageCode | null {
  return LANGUAGES.some((l) => l.code === code) ? (code as LanguageCode) : null;
}

/**
 * Translation dictionaries — one per language, keyed by a stable string key.
 *
 * Intentionally empty for now. When translations are ready, populate like:
 *   en: { "nav.search": "Search", "nav.signIn": "Sign in" }
 *   fr: { "nav.search": "Rechercher", "nav.signIn": "Se connecter" }
 *
 * The `t()` helper resolves: current language → English fallback → the raw key.
 */
export type Dictionary = Record<string, string>;

export const dictionaries: Record<LanguageCode, Dictionary> = {
  en: {
    "nav.cities": "Cities",
    "nav.directory": "Directory",
    "nav.matchDay": "Match Day",
    "nav.nearMe": "Near Me",
    "nav.fanHubs": "Fan Hubs",
    "nav.community": "Community",
    "nav.pricing": "Pricing",
    "nav.home": "Home",
    "action.search": "Search",
    "action.signIn": "Sign in",
    "action.listBusiness": "List business",
    "footer.platform": "Platform",
    "footer.business": "Business",
    "footer.topCities": "Top Cities",
    "footer.categories": "Categories",
    "footer.hostCities": "Host Cities",
    "footer.businessDirectory": "Business Directory",
    "footer.matchDayMode": "Match Day Mode",
    "footer.listYourBusiness": "List your business",
    "footer.adminDashboard": "Admin Dashboard",
    "footer.tagline":
      "The unofficial operating system for the 2026 FIFA World Cup. City intelligence, trusted local services, and real-time match-day guidance — in one place.",
    "footer.copyright": "© 2026 532. Built for fans, by fans. Not affiliated with FIFA.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.accessibility": "Accessibility",
    "unit.days": "Days",
    "unit.hrs": "Hrs",
    "unit.min": "Min",
    "unit.sec": "Sec",
  },
  ar: {
    "nav.cities": "المدن",
    "nav.directory": "الدليل",
    "nav.matchDay": "يوم المباراة",
    "nav.nearMe": "بالقرب مني",
    "nav.fanHubs": "مناطق المشجعين",
    "nav.community": "المجتمع",
    "nav.pricing": "الأسعار",
    "nav.home": "الرئيسية",
    "action.search": "بحث",
    "action.signIn": "تسجيل الدخول",
    "action.listBusiness": "أضف نشاطك التجاري",
    "footer.platform": "المنصة",
    "footer.business": "الأعمال",
    "footer.topCities": "أبرز المدن",
    "footer.categories": "الفئات",
    "footer.hostCities": "المدن المضيفة",
    "footer.businessDirectory": "دليل الأعمال",
    "footer.matchDayMode": "وضع يوم المباراة",
    "footer.listYourBusiness": "أضف نشاطك التجاري",
    "footer.adminDashboard": "لوحة الإدارة",
    "footer.tagline":
      "النظام التشغيلي غير الرسمي لكأس العالم FIFA 2026. معلومات عن المدن وخدمات محلية موثوقة وإرشادات فورية في أيام المباريات — في مكان واحد.",
    "footer.copyright": "© 2026 532. صُنع للمشجعين بواسطة المشجعين. غير تابع للفيفا.",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "footer.accessibility": "إمكانية الوصول",
    "unit.days": "أيام",
    "unit.hrs": "ساعات",
    "unit.min": "دقائق",
    "unit.sec": "ثوانٍ",
  },
  fr: {
    "nav.cities": "Villes",
    "nav.directory": "Annuaire",
    "nav.matchDay": "Jour de match",
    "nav.nearMe": "À proximité",
    "nav.fanHubs": "Espaces fans",
    "nav.community": "Communauté",
    "nav.pricing": "Tarifs",
    "nav.home": "Accueil",
    "action.search": "Rechercher",
    "action.signIn": "Se connecter",
    "action.listBusiness": "Référencer une entreprise",
    "footer.platform": "Plateforme",
    "footer.business": "Entreprise",
    "footer.topCities": "Villes principales",
    "footer.categories": "Catégories",
    "footer.hostCities": "Villes hôtes",
    "footer.businessDirectory": "Annuaire des entreprises",
    "footer.matchDayMode": "Mode jour de match",
    "footer.listYourBusiness": "Référencez votre entreprise",
    "footer.adminDashboard": "Tableau de bord admin",
    "footer.tagline":
      "Le système d'exploitation non officiel de la Coupe du Monde FIFA 2026. Intelligence urbaine, services locaux de confiance et conseils en temps réel les jours de match — au même endroit.",
    "footer.copyright": "© 2026 532. Conçu pour les fans, par des fans. Non affilié à la FIFA.",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.accessibility": "Accessibilité",
    "unit.days": "Jours",
    "unit.hrs": "Hres",
    "unit.min": "Min",
    "unit.sec": "Sec",
  },
  es: {
    "nav.cities": "Ciudades",
    "nav.directory": "Directorio",
    "nav.matchDay": "Día de partido",
    "nav.nearMe": "Cerca de mí",
    "nav.fanHubs": "Zonas de aficionados",
    "nav.community": "Comunidad",
    "nav.pricing": "Precios",
    "nav.home": "Inicio",
    "action.search": "Buscar",
    "action.signIn": "Iniciar sesión",
    "action.listBusiness": "Publicar negocio",
    "footer.platform": "Plataforma",
    "footer.business": "Negocios",
    "footer.topCities": "Ciudades destacadas",
    "footer.categories": "Categorías",
    "footer.hostCities": "Ciudades anfitrionas",
    "footer.businessDirectory": "Directorio de negocios",
    "footer.matchDayMode": "Modo día de partido",
    "footer.listYourBusiness": "Publica tu negocio",
    "footer.adminDashboard": "Panel de administración",
    "footer.tagline":
      "El sistema operativo no oficial de la Copa Mundial de la FIFA 2026. Inteligencia urbana, servicios locales de confianza y orientación en tiempo real los días de partido, todo en un solo lugar.",
    "footer.copyright": "© 2026 532. Hecho por aficionados, para aficionados. No afiliado a la FIFA.",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.accessibility": "Accesibilidad",
    "unit.days": "Días",
    "unit.hrs": "Hrs",
    "unit.min": "Min",
    "unit.sec": "Seg",
  },
  de: {
    "nav.cities": "Städte",
    "nav.directory": "Verzeichnis",
    "nav.matchDay": "Spieltag",
    "nav.nearMe": "In der Nähe",
    "nav.fanHubs": "Fan-Zonen",
    "nav.community": "Community",
    "nav.pricing": "Preise",
    "nav.home": "Start",
    "action.search": "Suchen",
    "action.signIn": "Anmelden",
    "action.listBusiness": "Unternehmen eintragen",
    "footer.platform": "Plattform",
    "footer.business": "Unternehmen",
    "footer.topCities": "Top-Städte",
    "footer.categories": "Kategorien",
    "footer.hostCities": "Austragungsstädte",
    "footer.businessDirectory": "Unternehmensverzeichnis",
    "footer.matchDayMode": "Spieltag-Modus",
    "footer.listYourBusiness": "Ihr Unternehmen eintragen",
    "footer.adminDashboard": "Admin-Dashboard",
    "footer.tagline":
      "Das inoffizielle Betriebssystem für die FIFA Weltmeisterschaft 2026. Stadtinformationen, vertrauenswürdige lokale Dienste und Echtzeit-Hilfe am Spieltag — alles an einem Ort.",
    "footer.copyright": "© 2026 532. Von Fans für Fans gemacht. Nicht mit der FIFA verbunden.",
    "footer.privacy": "Datenschutz",
    "footer.terms": "AGB",
    "footer.accessibility": "Barrierefreiheit",
    "unit.days": "Tage",
    "unit.hrs": "Std",
    "unit.min": "Min",
    "unit.sec": "Sek",
  },
};

// Merge per-domain dictionaries (one file per route group) into the base above.
// Keeping them in separate files lets translations be authored independently.
import { homeDict } from "@/lib/i18n-ns/home";
import { citiesDict } from "@/lib/i18n-ns/cities";
import { directoryDict } from "@/lib/i18n-ns/directory";
import { discoveryDict } from "@/lib/i18n-ns/discovery";
import { socialDict } from "@/lib/i18n-ns/social";
import { commerceDict } from "@/lib/i18n-ns/commerce";
import { miscDict } from "@/lib/i18n-ns/misc";

for (const ns of [homeDict, citiesDict, directoryDict, discoveryDict, socialDict, commerceDict, miscDict]) {
  for (const lang of Object.keys(ns) as LanguageCode[]) {
    Object.assign(dictionaries[lang], ns[lang]);
  }
}

/** Look up a key for a language with graceful fallback. */
export function translate(lang: LanguageCode, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries[DEFAULT_LANGUAGE]?.[key] ?? key;
}

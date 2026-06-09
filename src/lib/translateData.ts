import "server-only";
import type { LanguageCode } from "@/lib/i18n";
import { translateFields } from "@/lib/translate";
import type { Business, CategoryMeta, City, FanHub } from "@/lib/types";

/**
 * Per-type machine translators for seed data. Each lists exactly the prose fields
 * to translate — slugs, codes, phone numbers, classNames, hex, and proper nouns
 * (city/stadium/business/team names) are deliberately left untouched.
 *
 * All return the original object unchanged when no translation provider is
 * configured or the target is English (see translate.ts), so callers are safe to
 * use everywhere with zero config.
 */

const CITY_FIELDS = [
  "tagline",
  "overview",
  "stadium.neighborhood",
  "stadium.note",
  "weather.summer",
  "weather.advice",
  "language",
  "transport.*.detail",
  "fanZones.*.area",
  "fanZones.*.vibe",
  "emergency.*.service",
  "safety.*",
  "scams.*",
  "attractions.*",
  "matches.*.stage",
];

const BUSINESS_FIELDS = ["description", "tags.*"];
const FANHUB_FIELDS = ["description", "area"];
const CATEGORY_FIELDS = ["label", "blurb"];

export const translateCity = (c: City, lang: LanguageCode) =>
  translateFields(c, lang, CITY_FIELDS);

export const translateBusiness = (b: Business, lang: LanguageCode) =>
  translateFields(b, lang, BUSINESS_FIELDS);

export const translateFanHub = (h: FanHub, lang: LanguageCode) =>
  translateFields(h, lang, FANHUB_FIELDS);

export const translateCategory = (c: CategoryMeta, lang: LanguageCode) =>
  translateFields(c, lang, CATEGORY_FIELDS);

export const translateCities = (cs: City[], lang: LanguageCode) =>
  Promise.all(cs.map((c) => translateCity(c, lang)));

export const translateBusinesses = (bs: Business[], lang: LanguageCode) =>
  Promise.all(bs.map((b) => translateBusiness(b, lang)));

export const translateFanHubs = (hs: FanHub[], lang: LanguageCode) =>
  Promise.all(hs.map((h) => translateFanHub(h, lang)));

export const translateCategories = (cs: CategoryMeta[], lang: LanguageCode) =>
  Promise.all(cs.map((c) => translateCategory(c, lang)));

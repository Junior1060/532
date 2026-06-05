import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  toLanguageCode,
  type LanguageCode,
} from "@/lib/i18n";

/**
 * Read the active language on the server (from the cookie set by LanguageProvider),
 * so server components can machine-translate seed data for the current visitor.
 * The cookie shares LANGUAGE_STORAGE_KEY with the client's localStorage value.
 */
export async function getServerLang(): Promise<LanguageCode> {
  const store = await cookies();
  return toLanguageCode(store.get(LANGUAGE_STORAGE_KEY)?.value) ?? DEFAULT_LANGUAGE;
}

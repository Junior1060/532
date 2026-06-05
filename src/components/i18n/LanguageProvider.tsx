"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getLanguage,
  toLanguageCode,
  translate,
  type Language,
  type LanguageCode,
} from "@/lib/i18n";

interface LanguageContextValue {
  /** Current language code. */
  lang: LanguageCode;
  /** Full metadata (label, name, flag, dir) for the current language. */
  language: Language;
  /** Switch the active language (persists + updates <html dir/lang>). */
  setLang: (code: LanguageCode) => void;
  /** Translate a key for the current language. Falls back to English, then the key. */
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const router = useRouter();

  // Hydrate the saved preference after mount (avoids SSR/client mismatch).
  useEffect(() => {
    const stored = toLanguageCode(window.localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (stored) setLangState(stored);
  }, []);

  // Reflect the language on the document and persist it (localStorage + cookie).
  // The cookie lets server components machine-translate seed data for this language.
  useEffect(() => {
    const meta = getLanguage(lang);
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir; // "rtl" for Arabic, else "ltr"
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, meta.code);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${meta.code}; path=/; max-age=31536000; samesite=lax`;
  }, [lang]);

  const setLang = useCallback(
    (code: LanguageCode) => {
      setLangState(code);
      // Persist immediately so the server sees the new language on refresh, then
      // re-render server components to pull freshly translated seed data.
      document.cookie = `${LANGUAGE_STORAGE_KEY}=${code}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router]
  );
  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, language: getLanguage(lang), setLang, t }),
    [lang, setLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a <LanguageProvider>");
  return ctx;
}

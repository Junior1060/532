"use client";

import { ButtonLink, Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useLanguage();
  return (
    <section className="flex min-h-[70vh] items-center justify-center">
      <div className="container-pad text-center">
        <div className="font-display text-6xl font-black text-accent-amber">!</div>
        <h1 className="mt-4 text-2xl font-semibold text-white">{t("misc.error.title")}</h1>
        <p className="mx-auto mt-3 max-w-md text-white/55">
          {t("misc.error.description")}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>{t("misc.error.tryAgain")}</Button>
          <ButtonLink href="/" variant="secondary">{t("misc.error.backHome")}</ButtonLink>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LiveDot } from "@/components/ui/Badge";
import { Countdown } from "@/components/visuals/Countdown";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { SmartSearch } from "@/components/SmartSearch";
import { WORLD_CUP_START } from "@/data/cities";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden pb-16 pt-10">
      <AmbientBackground withGlobe />

      <div className="container-pad relative z-10 w-full">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 px-3.5 py-1.5 text-xs backdrop-blur"
          >
            <LiveDot label={t("home.hero.live")} />
            <span className="text-white/60">{t("home.hero.badge")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            {t("home.hero.titleLine1")}
            <br />
            <span className="gradient-text">{t("home.hero.titleLine2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-balance text-base text-white/55 sm:text-lg"
          >
            {t("home.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-xl"
          >
            <SmartSearch />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href="/cities" size="lg" className="w-full sm:w-auto">
              {t("home.hero.exploreCities")} <MapPin className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/match-day" variant="secondary" size="lg" className="w-full sm:w-auto">
              <Radio className="h-4 w-4" /> {t("home.hero.matchDayGuide")} <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-12"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/40">
              {t("home.hero.kickoffIn")}
            </p>
            <Countdown target={WORLD_CUP_START} className="justify-center" />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950 to-transparent" />
    </section>
  );
}

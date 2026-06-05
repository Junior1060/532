"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { LANGUAGES } from "@/lib/i18n";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Language selector for the navbar. Shows a globe + the current short label (EN/AR/…)
 * and opens a dark glassy dropdown matching the 532 design. Selecting a language
 * updates the label, persists to localStorage, and flips RTL for Arabic — all handled
 * by the LanguageProvider.
 */
export function LanguageDropdown({ className }: { className?: string }) {
  const { lang, language, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium tabular-nums">{language.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label="Languages"
            className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-950/95 p-1.5 shadow-card backdrop-blur-xl"
          >
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/[0.07] text-white"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="flex-1 text-start">{l.name}</span>
                    {active && <Check className="h-4 w-4 text-neon" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

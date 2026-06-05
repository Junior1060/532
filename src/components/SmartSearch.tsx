"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const HINTS = ["Toronto", "halal near BMO Field", "BC Place transit", "fan zones in Miami", "pharmacy MetLife"];

export function SmartSearch({
  size = "lg",
  placeholder,
  className,
}: {
  size?: "md" | "lg";
  placeholder?: string;
  className?: string;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={submit}
        className={cn(
          "group flex items-center gap-3 rounded-full border border-white/12 bg-ink-900/70 backdrop-blur-xl transition-colors focus-within:border-neon/40 focus-within:shadow-glow-sm",
          size === "lg" ? "px-5 py-3.5" : "px-4 py-2.5"
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-white/40 group-focus-within:text-neon" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder ?? t("misc.search.placeholder")}
          className="flex-1 bg-transparent text-white placeholder:text-white/35 focus:outline-none"
          aria-label={t("misc.search.ariaLabel")}
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-neon px-4 py-1.5 text-sm font-semibold text-ink-950 transition-all hover:brightness-110 active:scale-95"
        >
          {t("misc.search.button")}
        </button>
      </form>
      {size === "lg" && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/40">
          <span className="text-white/30">{t("misc.search.tryLabel")}</span>
          {HINTS.map((h) => (
            <button
              key={h}
              onClick={() => router.push(`/search?q=${encodeURIComponent(h)}`)}
              className="rounded-full border border-white/10 px-2.5 py-1 transition-colors hover:border-neon/30 hover:text-white"
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

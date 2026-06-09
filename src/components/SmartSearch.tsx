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
          "group flex items-center gap-3 rounded-full border border-gray-200 bg-white shadow-sm transition-shadow focus-within:border-gray-300 focus-within:shadow-md",
          size === "lg" ? "px-6 py-4" : "px-4 py-2.5"
        )}
      >
        <Search className={cn("shrink-0 text-gray-400 group-focus-within:text-neon-ink", size === "lg" ? "h-6 w-6" : "h-5 w-5")} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder ?? t("misc.search.placeholder")}
          className={cn("flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none", size === "lg" && "text-lg")}
          aria-label={t("misc.search.ariaLabel")}
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:brightness-105 active:scale-95"
        >
          {t("misc.search.button")}
        </button>
      </form>
      {size === "lg" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
          <span className="text-gray-400">{t("misc.search.tryLabel")}</span>
          {HINTS.map((h) => (
            <button
              key={h}
              onClick={() => router.push(`/search?q=${encodeURIComponent(h)}`)}
              className="rounded-full border border-gray-200 px-3 py-1.5 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

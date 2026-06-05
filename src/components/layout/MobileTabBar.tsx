"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <div className="mx-auto mb-3 flex max-w-md items-center justify-around gap-1 rounded-full border border-white/10 bg-ink-900/85 px-2 py-2 shadow-card backdrop-blur-xl">
        {MOBILE_TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full px-1 py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-neon" : "text-white/55"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  active && "bg-neon/12"
                )}
              >
                <Icon name={tab.icon} className="h-[18px] w-[18px]" />
              </span>
              {t(tab.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

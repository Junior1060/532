"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV_LINKS } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageDropdown } from "@/components/layout/LanguageDropdown";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled ? "border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl" : "bg-transparent"
        )}
      >
        <nav className="container-pad flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    active ? "text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {t(link.key)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageDropdown />
            <Link
              href="/search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/login"
              className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm text-white/70 transition-colors hover:text-white md:flex"
            >
              <LogIn className="h-4 w-4" /> {t("action.signIn")}
            </Link>
            <ButtonLink href="/list-business" size="sm" className="hidden sm:inline-flex">
              {t("action.listBusiness")}
            </ButtonLink>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white hover:bg-white/[0.06] lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-b border-white/[0.06] bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-pad grid gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-sm text-white/80 hover:bg-white/[0.06] hover:text-white"
                >
                  {t(link.key)}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ButtonLink href="/login" variant="secondary" size="sm">
                  {t("action.signIn")}
                </ButtonLink>
                <ButtonLink href="/list-business" size="sm">
                  {t("action.listBusiness")}
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

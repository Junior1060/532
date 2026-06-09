"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Auth-aware account control for the navbar. Reflects the live Supabase session:
 * shows "Sign in" when logged out, and an account menu (Admin link if the
 * profile role is admin, plus Sign out) when logged in.
 */
export function AuthNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let active = true;

    async function load(userId?: string, userEmail?: string | null) {
      if (!userId) {
        if (active) { setEmail(null); setIsAdmin(false); }
        return;
      }
      if (active) setEmail(userEmail ?? null);
      const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
      if (active) setIsAdmin(data?.role === "admin");
    }

    supabase.auth.getUser().then(({ data }) => load(data.user?.id, data.user?.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user?.id, session?.user?.email);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  // ---- Logged out ----
  if (!email) {
    if (variant === "mobile") {
      return (
        <Link href="/login" className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
          <LogIn className="h-4 w-4" /> {t("action.signIn")}
        </Link>
      );
    }
    return (
      <Link href="/login" className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm text-gray-500 transition-colors hover:text-gray-900 md:flex">
        <LogIn className="h-4 w-4" /> {t("action.signIn")}
      </Link>
    );
  }

  const initial = email[0]?.toUpperCase() ?? "U";

  // ---- Logged in (mobile: inline links) ----
  if (variant === "mobile") {
    return (
      <div className="col-span-2 grid gap-2">
        {isAdmin && (
          <Link href="/admin" className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
            <LayoutDashboard className="h-4 w-4" /> Admin
          </Link>
        )}
        <button onClick={signOut} className="flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900">
          <LogOut className="h-4 w-4" /> {t("commerce.admin.signOut")}
        </button>
      </div>
    );
  }

  // ---- Logged in (desktop: dropdown) ----
  return (
    <div ref={menuRef} className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white pl-1.5 pr-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neon text-xs font-bold text-gray-900">{initial}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-lg">
          <div className="truncate px-3 py-2 text-xs text-gray-400">{email}</div>
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <LayoutDashboard className="h-4 w-4 text-neon-ink" /> Admin dashboard
            </Link>
          )}
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            <LogOut className="h-4 w-4" /> {t("commerce.admin.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

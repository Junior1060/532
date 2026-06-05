"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass rounded-4xl p-8">
        <div className="flex justify-center"><Logo showWord={false} /></div>
        <h1 className="mt-5 text-center text-2xl font-bold text-white">
          {mode === "login" ? t("commerce.auth.login.title") : t("commerce.auth.signup.title")}
        </h1>
        <p className="mt-1.5 text-center text-sm text-white/50">
          {mode === "login" ? t("commerce.auth.login.subtitle") : t("commerce.auth.signup.subtitle")}
        </p>

        {done ? (
          <div className="mt-6 rounded-2xl border border-neon/30 bg-neon/[0.06] p-5 text-center text-sm text-white/75">
            {t("commerce.auth.demoComplete")}
          </div>
        ) : (
          <>
            {/* Social */}
            <div className="mt-6 grid gap-2.5">
              <SocialButton provider="Google" />
              <SocialButton provider="Apple" />
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-white/35">
              <div className="hairline flex-1" /> {mode === "login" ? t("commerce.auth.dividerLogin") : t("commerce.auth.dividerSignup")} <div className="hairline flex-1" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && <InputRow icon={User} type="text" placeholder={t("commerce.auth.fullName")} />}
              <InputRow icon={Mail} type="email" placeholder={t("commerce.auth.emailAddress")} />
              <InputRow icon={Lock} type="password" placeholder={t("commerce.auth.password")} />
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-ink-950 transition-all hover:brightness-110 disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? t("commerce.auth.signIn") : t("commerce.auth.createAccount")} <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </>
        )}

        <p className="mt-5 text-center text-sm text-white/50">
          {mode === "login" ? (
            <>{t("commerce.auth.newToApp")} <Link href="/signup" className="text-neon hover:underline">{t("commerce.auth.createAccountLink")}</Link></>
          ) : (
            <>{t("commerce.auth.haveAccount")} <Link href="/login" className="text-neon hover:underline">{t("commerce.auth.signInLink")}</Link></>
          )}
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-white/40">
        <Link href="/cities" className="hover:text-white">{t("commerce.auth.guest")}</Link>
      </p>
    </div>
  );
}

function SocialButton({ provider }: { provider: string }) {
  const { t } = useLanguage();
  return (
    <button className="flex items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.06]">
      <span className="text-base font-bold">{provider === "Google" ? "G" : ""}</span>
      {t("commerce.auth.continueWith").replace("{provider}", provider)}
    </button>
  );
}

function InputRow({ icon: Icon, type, placeholder }: { icon: React.ComponentType<{ className?: string }>; type: string; placeholder: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 focus-within:border-neon/40">
      <Icon className="h-4 w-4 text-white/40" />
      <input type={type} placeholder={placeholder} required className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none" />
    </div>
  );
}

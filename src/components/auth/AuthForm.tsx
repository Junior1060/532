"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function safeNext(): string {
  if (typeof window === "undefined") return "/";
  const next = new URLSearchParams(window.location.search).get("next");
  // Only allow same-site relative paths to avoid open-redirects.
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const next = safeNext();
        router.push(next);
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "apple") {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const next = encodeURIComponent(safeNext());
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass rounded-4xl p-8">
        <div className="flex justify-center"><Logo showWord={false} /></div>
        <h1 className="mt-5 text-center text-2xl font-bold text-gray-900">
          {mode === "login" ? t("commerce.auth.login.title") : t("commerce.auth.signup.title")}
        </h1>
        <p className="mt-1.5 text-center text-sm text-gray-500">
          {mode === "login" ? t("commerce.auth.login.subtitle") : t("commerce.auth.signup.subtitle")}
        </p>

        {done ? (
          <div className="mt-6 rounded-2xl border border-neon-border bg-neon-subtle p-5 text-center text-sm text-gray-700">
            {t("commerce.auth.checkEmail")}
          </div>
        ) : (
          <>
            {/* Social */}
            <div className="mt-6 grid gap-2.5">
              <SocialButton provider="Google" onClick={() => oauth("google")} />
              <SocialButton provider="Apple" onClick={() => oauth("apple")} />
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
              <div className="hairline flex-1" /> {mode === "login" ? t("commerce.auth.dividerLogin") : t("commerce.auth.dividerSignup")} <div className="hairline flex-1" />
            </div>

            {error && (
              <div className="mb-3 rounded-2xl border border-accent-red/30 bg-accent-red/[0.06] p-3 text-center text-sm text-accent-red">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-3">
              {mode === "signup" && (
                <InputRow icon={User} type="text" placeholder={t("commerce.auth.fullName")} value={fullName} onChange={setFullName} autoComplete="name" />
              )}
              <InputRow icon={Mail} type="email" placeholder={t("commerce.auth.emailAddress")} value={email} onChange={setEmail} autoComplete="email" />
              <InputRow icon={Lock} type="password" placeholder={t("commerce.auth.password")} value={password} onChange={setPassword} autoComplete={mode === "login" ? "current-password" : "new-password"} />
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-gray-900 transition-all hover:brightness-110 disabled:opacity-60">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? t("commerce.auth.signIn") : t("commerce.auth.createAccount")} <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          </>
        )}

        <p className="mt-5 text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>{t("commerce.auth.newToApp")} <Link href="/signup" className="text-neon-ink hover:underline">{t("commerce.auth.createAccountLink")}</Link></>
          ) : (
            <>{t("commerce.auth.haveAccount")} <Link href="/login" className="text-neon-ink hover:underline">{t("commerce.auth.signInLink")}</Link></>
          )}
        </p>
      </div>

      <p className="mt-4 text-center text-sm text-gray-400">
        <Link href="/cities" className="hover:text-gray-900">{t("commerce.auth.guest")}</Link>
      </p>
    </div>
  );
}

function SocialButton({ provider, onClick }: { provider: string; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-center gap-2.5 rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:border-gray-300 hover:bg-gray-50">
      <span className="text-base font-bold">{provider === "Google" ? "G" : ""}</span>
      {t("commerce.auth.continueWith").replace("{provider}", provider)}
    </button>
  );
}

function InputRow({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  icon: React.ComponentType<{ className?: string }>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-ink-950/60 px-4 py-3 focus-within:border-neon-border">
      <Icon className="h-4 w-4 text-gray-400" />
      <input
        type={inputType}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-gray-400 transition-colors hover:text-gray-900"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

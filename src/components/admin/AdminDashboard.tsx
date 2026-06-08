"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Store, Building2, Flag, MessageSquare,
  Check, X, BadgeCheck, Loader2,
} from "lucide-react";
import { CITIES } from "@/data/cities";
import { CATEGORY_LABEL } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import {
  setBusinessVerification,
  moderatePost,
  postAlert,
  deactivateAlert,
} from "@/app/actions/admin";
import type { BusinessCategory } from "@/lib/types";

/** A pending listing loaded from the database for the review queue. */
export interface PendingBusiness {
  id: string;
  name: string;
  category: string;
  address: string | null;
  city_slug: string | null;
}

export interface PendingPost {
  id: string;
  title: string;
  body: string;
  type: string;
  city_slug: string | null;
}

export interface AdminAlert {
  id: string;
  message: string;
  city_slug: string | null;
  level: string;
}

export interface AdminStats {
  pendingBusinesses: number;
  verifiedBusinesses: number;
  pendingPosts: number;
  activeAlerts: number;
}

const TABS = [
  { id: "overview", labelKey: "commerce.admin.tab.overview", icon: LayoutDashboard },
  { id: "submissions", labelKey: "commerce.admin.tab.submissions", icon: Store },
  { id: "cities", labelKey: "commerce.admin.tab.cities", icon: Building2 },
  { id: "alerts", labelKey: "commerce.admin.tab.alerts", icon: Flag },
  { id: "community", labelKey: "commerce.admin.tab.community", icon: MessageSquare },
];

const cityName = (slug: string | null) =>
  CITIES.find((c) => c.slug === slug)?.name ?? (slug ?? "All cities");

export function AdminDashboard({
  pendingBusinesses,
  pendingPosts,
  alerts,
  stats,
}: {
  pendingBusinesses: PendingBusiness[];
  pendingPosts: PendingPost[];
  alerts: AdminAlert[];
  stats: AdminStats;
}) {
  const { t } = useLanguage();
  const [tab, setTab] = useState("overview");
  const [pending, setPending] = useState(pendingBusinesses);
  const [posts, setPosts] = useState(pendingPosts);

  // Live counts reflect actions taken this session.
  const liveStats: AdminStats = {
    ...stats,
    pendingBusinesses: pending.length,
    pendingPosts: posts.length,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
          {TABS.map((tabItem) => (
            <button key={tabItem.id} onClick={() => setTab(tabItem.id)}
              className={cn("flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm transition-colors",
                tab === tabItem.id ? "bg-neon/12 text-neon" : "text-white/55 hover:bg-white/[0.04] hover:text-white")}>
              <tabItem.icon className="h-4 w-4" /> {t(tabItem.labelKey)}
            </button>
          ))}
        </div>
      </aside>

      <div>
        {tab === "overview" && <Overview stats={liveStats} onJump={setTab} />}
        {tab === "submissions" && <Submissions pending={pending} setPending={setPending} />}
        {tab === "cities" && <CitiesAdmin />}
        {tab === "alerts" && <AlertsAdmin initialAlerts={alerts} />}
        {tab === "community" && <CommunityModeration posts={posts} setPosts={setPosts} />}
      </div>
    </div>
  );
}

function Overview({ stats, onJump }: { stats: AdminStats; onJump: (tab: string) => void }) {
  const { t } = useLanguage();
  const cards = [
    { value: stats.pendingBusinesses, label: t("commerce.admin.pendingSubmissions"), tab: "submissions", tone: "amber" as const },
    { value: stats.pendingPosts, label: t("commerce.admin.postsToModerate"), tab: "community", tone: "blue" as const },
    { value: stats.activeAlerts, label: t("commerce.admin.activeCityAlerts"), tab: "alerts", tone: "neon" as const },
    { value: stats.verifiedBusinesses, label: t("commerce.admin.stat.listedBusinesses"), tab: "submissions", tone: "neon" as const },
  ];
  const toneClass = {
    amber: "border-accent-amber/30 bg-accent-amber/[0.06] text-accent-amber",
    blue: "border-accent-blue/30 bg-accent-blue/[0.06] text-accent-blue",
    neon: "border-neon/30 bg-neon/[0.06] text-neon",
  };
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.needsAttention")}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <button key={c.label} onClick={() => onJump(c.tab)}
              className={cn("rounded-2xl border p-4 text-left transition-transform hover:scale-[1.02]", toneClass[c.tone])}>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-sm text-white/60">{c.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Submissions({
  pending,
  setPending,
}: {
  pending: PendingBusiness[];
  setPending: React.Dispatch<React.SetStateAction<PendingBusiness[]>>;
}) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categoryLabel = (c: string) => CATEGORY_LABEL[c as BusinessCategory] ?? c;

  function act(id: string, status: "verified" | "rejected") {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await setBusinessVerification(id, status);
      if (res.ok) setPending((x) => x.filter((b) => b.id !== id));
      else setError(res.message);
      setBusyId(null);
    });
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-semibold text-white">{t("commerce.admin.reviewQueue")}</h3>
      {error && (
        <div className="mt-3 rounded-2xl border border-accent-red/30 bg-accent-red/[0.06] p-3 text-sm text-accent-red">{error}</div>
      )}
      <div className="mt-4 space-y-2.5">
        {pending.length === 0 && <p className="py-8 text-center text-white/45">{t("commerce.admin.queueClear")}</p>}
        {pending.map((b) => {
          const busy = isPending && busyId === b.id;
          return (
            <motion.div key={b.id} layout exit={{ opacity: 0, x: -20 }}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] p-4">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white">{b.name}</div>
                <div className="text-xs text-white/45">{categoryLabel(b.category)}{b.address ? ` · ${b.address}` : ""}</div>
              </div>
              <div className="flex gap-2">
                <button disabled={busy} onClick={() => act(b.id, "verified")} className="flex items-center gap-1.5 rounded-full bg-neon/15 px-3 py-1.5 text-sm text-neon hover:bg-neon/25 disabled:opacity-50">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("commerce.admin.approve")}
                </button>
                <button disabled={busy} onClick={() => act(b.id, "rejected")} className="flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1.5 text-sm text-accent-red hover:bg-accent-red/25 disabled:opacity-50">
                  <X className="h-4 w-4" /> {t("commerce.admin.reject")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function CitiesAdmin() {
  const { t } = useLanguage();
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-semibold text-white">{t("commerce.admin.manageCities")}</h3>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {CITIES.map((c) => (
          <div key={c.slug} className="flex items-center justify-between rounded-2xl border border-white/[0.07] p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{c.flag}</span>
              <div>
                <div className="text-sm font-medium text-white">{c.name}</div>
                <div className="text-xs text-white/45">{t("commerce.admin.matches").replace("{count}", String(c.matchCount)).replace("{country}", c.country)}</div>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs text-neon"><BadgeCheck className="h-3.5 w-3.5" /> {t("commerce.admin.live")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsAdmin({ initialAlerts }: { initialAlerts: AdminAlert[] }) {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function publish() {
    const message = text.trim();
    if (!message) return;
    setError(null);
    startTransition(async () => {
      const res = await postAlert(message, null, "warning");
      if (res.ok) {
        // Optimistic: prepend. Server revalidates on next load with the real id.
        setAlerts((a) => [{ id: `tmp-${a.length}-${message.length}`, message, city_slug: null, level: "warning" }, ...a]);
        setText("");
      } else setError(res.message);
    });
  }

  function remove(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await deactivateAlert(id);
      if (res.ok) setAlerts((x) => x.filter((y) => y.id !== id));
      else setError(res.message);
    });
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.postAlert")}</h3>
        {error && <div className="mt-3 rounded-2xl border border-accent-red/30 bg-accent-red/[0.06] p-3 text-sm text-accent-red">{error}</div>}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("commerce.admin.alertPlaceholder")}
            className="flex-1 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon/40" />
          <button disabled={isPending || !text.trim()} onClick={publish}
            className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-ink-950 hover:brightness-110 disabled:opacity-50">{t("commerce.admin.publishAlert")}</button>
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.activeAlerts")}</h3>
        <div className="mt-4 space-y-2.5">
          {alerts.length === 0 && <p className="py-6 text-center text-white/45">{t("commerce.admin.queueClear")}</p>}
          {alerts.map((a) => (
            <div key={a.id} className={cn("flex items-center justify-between rounded-2xl border p-4",
              a.level === "warning" ? "border-accent-amber/30 bg-accent-amber/[0.06]" : a.level === "critical" ? "border-accent-red/30 bg-accent-red/[0.06]" : "border-accent-blue/30 bg-accent-blue/[0.06]")}>
              <div>
                <div className="text-xs text-white/45">{cityName(a.city_slug)}</div>
                <div className="text-sm text-white/80">{a.message}</div>
              </div>
              <button disabled={isPending} onClick={() => remove(a.id)} className="text-white/40 hover:text-accent-red disabled:opacity-50"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunityModeration({
  posts,
  setPosts,
}: {
  posts: PendingPost[];
  setPosts: React.Dispatch<React.SetStateAction<PendingPost[]>>;
}) {
  const { t } = useLanguage();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function act(id: string, status: "published" | "removed") {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await moderatePost(id, status);
      if (res.ok) setPosts((x) => x.filter((p) => p.id !== id));
      else setError(res.message);
      setBusyId(null);
    });
  }

  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-semibold text-white">{t("commerce.admin.communityModeration")}</h3>
      {error && <div className="mt-3 rounded-2xl border border-accent-red/30 bg-accent-red/[0.06] p-3 text-sm text-accent-red">{error}</div>}
      <div className="mt-4 space-y-2.5">
        {posts.length === 0 && <p className="py-8 text-center text-white/45">{t("commerce.admin.noPosts")}</p>}
        {posts.map((p) => {
          const busy = isPending && busyId === p.id;
          return (
            <motion.div key={p.id} layout exit={{ opacity: 0 }} className="rounded-2xl border border-white/[0.07] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{p.title}</span>
                <span className="text-xs text-white/40">{cityName(p.city_slug)} · {p.type}</span>
              </div>
              <p className="mt-1 text-sm text-white/55">{p.body}</p>
              <div className="mt-3 flex gap-2">
                <button disabled={busy} onClick={() => act(p.id, "published")} className="flex items-center gap-1.5 rounded-full bg-neon/15 px-3 py-1.5 text-sm text-neon hover:bg-neon/25 disabled:opacity-50">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("commerce.admin.publish")}
                </button>
                <button disabled={busy} onClick={() => act(p.id, "removed")} className="flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1.5 text-sm text-accent-red hover:bg-accent-red/25 disabled:opacity-50">
                  <X className="h-4 w-4" /> {t("commerce.admin.remove")}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

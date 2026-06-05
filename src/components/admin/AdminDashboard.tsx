"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Store, Building2, Flag, MessageSquare, BarChart3,
  Check, X, BadgeCheck, TrendingUp, Users, Eye, DollarSign,
} from "lucide-react";
import { BUSINESSES } from "@/data/businesses";
import { CITIES } from "@/data/cities";
import { COMMUNITY_POSTS } from "@/data/live";
import { CATEGORY_LABEL } from "@/data/categories";
import { cn, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const TABS = [
  { id: "overview", labelKey: "commerce.admin.tab.overview", icon: LayoutDashboard },
  { id: "submissions", labelKey: "commerce.admin.tab.submissions", icon: Store },
  { id: "cities", labelKey: "commerce.admin.tab.cities", icon: Building2 },
  { id: "alerts", labelKey: "commerce.admin.tab.alerts", icon: Flag },
  { id: "community", labelKey: "commerce.admin.tab.community", icon: MessageSquare },
  { id: "analytics", labelKey: "commerce.admin.tab.analytics", icon: BarChart3 },
];

export function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("overview");
  const pending = BUSINESSES.filter((b) => b.verification === "pending");

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
        {tab === "overview" && <Overview pending={pending.length} />}
        {tab === "submissions" && <Submissions pending={pending} />}
        {tab === "cities" && <CitiesAdmin />}
        {tab === "alerts" && <AlertsAdmin />}
        {tab === "community" && <CommunityModeration />}
        {tab === "analytics" && <Analytics />}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend?: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-neon" />
        {trend && <span className="text-xs text-neon">{trend}</span>}
      </div>
      <div className="mt-3 text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}

function Overview({ pending }: { pending: number }) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Eye} label={t("commerce.admin.stat.monthlyVisitors")} value="284K" trend="+12%" />
        <StatCard icon={Users} label={t("commerce.admin.stat.activeFans")} value="12,421" trend="+8%" />
        <StatCard icon={Store} label={t("commerce.admin.stat.listedBusinesses")} value={formatNumber(BUSINESSES.length)} trend="+34" />
        <StatCard icon={DollarSign} label={t("commerce.admin.stat.mrr")} value="$18.4K" trend="+21%" />
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.needsAttention")}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-accent-amber/30 bg-accent-amber/[0.06] p-4">
            <div className="text-2xl font-bold text-accent-amber">{pending}</div>
            <div className="text-sm text-white/60">{t("commerce.admin.pendingSubmissions")}</div>
          </div>
          <div className="rounded-2xl border border-accent-blue/30 bg-accent-blue/[0.06] p-4">
            <div className="text-2xl font-bold text-accent-blue">3</div>
            <div className="text-sm text-white/60">{t("commerce.admin.postsToModerate")}</div>
          </div>
          <div className="rounded-2xl border border-neon/30 bg-neon/[0.06] p-4">
            <div className="text-2xl font-bold text-neon">2</div>
            <div className="text-sm text-white/60">{t("commerce.admin.activeCityAlerts")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Submissions({ pending }: { pending: typeof BUSINESSES }) {
  const { t } = useLanguage();
  const [items, setItems] = useState(pending.slice(0, 8));
  const act = (id: string) => setItems((x) => x.filter((b) => b.id !== id));
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-semibold text-white">{t("commerce.admin.reviewQueue")}</h3>
      <div className="mt-4 space-y-2.5">
        {items.length === 0 && <p className="py-8 text-center text-white/45">{t("commerce.admin.queueClear")}</p>}
        {items.map((b) => (
          <motion.div key={b.id} layout exit={{ opacity: 0, x: -20 }}
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] p-4">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-white">{b.name}</div>
              <div className="text-xs text-white/45">{CATEGORY_LABEL[b.category]} · {b.address}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => act(b.id)} className="flex items-center gap-1.5 rounded-full bg-neon/15 px-3 py-1.5 text-sm text-neon hover:bg-neon/25">
                <Check className="h-4 w-4" /> {t("commerce.admin.approve")}
              </button>
              <button onClick={() => act(b.id)} className="flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1.5 text-sm text-accent-red hover:bg-accent-red/25">
                <X className="h-4 w-4" /> {t("commerce.admin.reject")}
              </button>
            </div>
          </motion.div>
        ))}
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

function AlertsAdmin() {
  const [alerts, setAlerts] = useState([
    { id: 1, city: "Toronto", text: "Heavy congestion near Gate 3 after the match", level: "warning" },
    { id: 2, city: "Mexico City", text: "Tren Ligero running extra service for the opener", level: "info" },
  ]);
  const [text, setText] = useState("");
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.postAlert")}</h3>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("commerce.admin.alertPlaceholder")}
            className="flex-1 rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-neon/40" />
          <button onClick={() => { if (text.trim()) { setAlerts((a) => [{ id: Date.now() % 100000, city: t("commerce.admin.allCities"), text, level: "warning" }, ...a]); setText(""); } }}
            className="rounded-full bg-neon px-6 py-3 text-sm font-semibold text-ink-950 hover:brightness-110">{t("commerce.admin.publishAlert")}</button>
        </div>
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.activeAlerts")}</h3>
        <div className="mt-4 space-y-2.5">
          {alerts.map((a) => (
            <div key={a.id} className={cn("flex items-center justify-between rounded-2xl border p-4",
              a.level === "warning" ? "border-accent-amber/30 bg-accent-amber/[0.06]" : "border-accent-blue/30 bg-accent-blue/[0.06]")}>
              <div>
                <div className="text-xs text-white/45">{a.city}</div>
                <div className="text-sm text-white/80">{a.text}</div>
              </div>
              <button onClick={() => setAlerts((x) => x.filter((y) => y.id !== a.id))} className="text-white/40 hover:text-accent-red"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunityModeration() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState(COMMUNITY_POSTS.slice(0, 4));
  const act = (id: string) => setPosts((x) => x.filter((p) => p.id !== id));
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="font-semibold text-white">{t("commerce.admin.communityModeration")}</h3>
      <div className="mt-4 space-y-2.5">
        {posts.length === 0 && <p className="py-8 text-center text-white/45">{t("commerce.admin.noPosts")}</p>}
        {posts.map((p) => (
          <motion.div key={p.id} layout exit={{ opacity: 0 }} className="rounded-2xl border border-white/[0.07] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{p.title}</span>
              <span className="text-xs text-white/40">{p.flag} {p.city} · {p.type}</span>
            </div>
            <p className="mt-1 text-sm text-white/55">{p.body}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => act(p.id)} className="flex items-center gap-1.5 rounded-full bg-neon/15 px-3 py-1.5 text-sm text-neon hover:bg-neon/25"><Check className="h-4 w-4" /> {t("commerce.admin.publish")}</button>
              <button onClick={() => act(p.id)} className="flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1.5 text-sm text-accent-red hover:bg-accent-red/25"><X className="h-4 w-4" /> {t("commerce.admin.remove")}</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const { t } = useLanguage();
  const bars = [42, 58, 70, 55, 80, 95, 72, 88, 64, 90, 78, 99];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label={t("commerce.admin.stat.pageViews")} value="1.2M" trend="+18%" />
        <StatCard icon={Store} label={t("commerce.admin.stat.directoryClicks")} value="86K" trend="+24%" />
        <StatCard icon={Users} label={t("commerce.admin.stat.conciergeQueries")} value="41K" trend="+39%" />
      </div>
      <div className="glass rounded-3xl p-6">
        <h3 className="font-semibold text-white">{t("commerce.admin.trafficTitle")}</h3>
        <div className="mt-6 flex h-44 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="flex-1 rounded-t-lg bg-gradient-to-t from-neon/30 to-neon" />
          ))}
        </div>
      </div>
    </div>
  );
}

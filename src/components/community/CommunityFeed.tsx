"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigUp, BadgeCheck, Send, ShieldCheck, Loader2 } from "lucide-react";
import { CITIES } from "@/data/cities";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import { createCommunityPost } from "@/app/actions/community";
import { Flag as FlagImg } from "@/components/ui/Flag";
import type { FeedPost } from "@/lib/data/community";

type Post = FeedPost & { pending?: boolean };

const TYPES = ["Tip", "Recommendation", "Warning", "Question"];
const typeTone: Record<string, string> = {
  Tip: "text-neon-ink bg-neon-subtle",
  Recommendation: "text-accent-blue bg-accent-blue/10",
  Warning: "text-accent-amber bg-accent-amber/10",
  Question: "text-accent-violet bg-accent-violet/10",
};

export function CommunityFeed({ initialPosts }: { initialPosts: Post[] }) {
  const { t } = useLanguage();
  const typeLabel = (type: string) => t(`social.type.${type}`);
  const tabLabel = (tab: string) => (tab === "All" ? t("social.community.filterAll") : typeLabel(tab));
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("Tip");
  const [city, setCity] = useState(CITIES[0].name);
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visible = filter === "All" ? posts : posts.filter((p) => p.type === filter);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 4 || body.trim().length < 10) return;
    setNotice(null);
    const draftTitle = title.trim();
    const draftBody = body.trim();
    startTransition(async () => {
      const res = await createCommunityPost({ type, title: draftTitle, body: draftBody, cityName: city });
      setNotice(res.message);
      if (res.ok) {
        // Optimistically show the user's pending post at the top of the feed.
        setPosts((prev) => [
          {
            id: `pending-${prev.length}-${draftTitle.length}`,
            author: "You",
            flag: "🌍",
            city,
            type,
            title: draftTitle,
            body: draftBody,
            upvotes: 0,
            verified: false,
            pending: true,
          },
          ...prev,
        ]);
        setTitle("");
        setBody("");
      }
    });
  }

  function upvote(id: string) {
    if (upvoted[id]) return;
    setUpvoted({ ...upvoted, [id]: true });
    setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
      {/* Composer */}
      <form onSubmit={submit} className="glass h-fit rounded-3xl p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-gray-900">{t("social.community.shareWithFans")}</h2>
        <p className="mt-1 text-sm text-gray-500">{t("social.community.composerBlurb")}</p>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="flex-1 rounded-2xl border border-gray-200 bg-ink-950/60 px-3 py-2.5 text-sm text-gray-900 focus:outline-none [&>option]:bg-ink-900">
              {TYPES.map((type) => <option key={type} value={type}>{typeLabel(type)}</option>)}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)}
              className="flex-1 rounded-2xl border border-gray-200 bg-ink-950/60 px-3 py-2.5 text-sm text-gray-900 focus:outline-none [&>option]:bg-ink-900">
              {CITIES.map((c) => <option key={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("social.community.titlePlaceholder")}
            className="w-full rounded-2xl border border-gray-200 bg-ink-950/60 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/40" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder={t("social.community.detailsPlaceholder")}
            className="w-full rounded-2xl border border-gray-200 bg-ink-950/60 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/40" />
          <button type="submit" disabled={isPending} className="flex w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-gray-900 hover:brightness-110 disabled:opacity-60">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} {t("social.community.post")}
          </button>
          {notice && <p className="text-center text-xs text-gray-700">{notice}</p>}
          <p className="flex items-center justify-center gap-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3 w-3" /> {t("social.community.moderated")}
          </p>
        </div>
      </form>

      {/* Feed */}
      <div>
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
          {["All", ...TYPES].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                filter === tab ? "border-neon-border bg-neon-subtle text-neon-ink" : "border-gray-200 text-gray-600 hover:text-gray-900")}>
              {tabLabel(tab)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {visible.map((p) => (
              <motion.article key={p.id}
                layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-lg"><FlagImg emoji={p.flag} /></span>
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                        {p.author}
                        {p.verified && <BadgeCheck className="h-3.5 w-3.5 text-neon-ink" />}
                      </div>
                      <div className="text-xs text-gray-400">{p.city}</div>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", typeTone[p.type] || "text-gray-600 bg-gray-50")}>
                    {typeLabel(p.type)}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{p.body}</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                  <button onClick={() => upvote(p.id)}
                    className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                      upvoted[p.id] ? "bg-neon-subtle text-neon-ink" : "text-gray-600 hover:bg-gray-50")}>
                    <ArrowBigUp className="h-4 w-4" /> {p.upvotes}
                  </button>
                  {p.pending && (
                    <span className="rounded-full bg-accent-amber/10 px-2.5 py-0.5 text-xs text-accent-amber">{t("social.community.pendingReview")}</span>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

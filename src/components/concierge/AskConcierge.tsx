"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles, X, Send, ShieldCheck, ArrowUpRight } from "lucide-react";
import { askConcierge, SUGGESTED_QUESTIONS, type ConciergeAnswer } from "@/lib/concierge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface Msg {
  role: "user" | "assistant";
  text: string;
  answer?: ConciergeAnswer;
}

export function AskConcierge() {
  const { t } = useLanguage();
  const greeting: Msg = { role: "assistant", text: t("misc.concierge.greeting") };
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setTyping(true);
    // simulate latency for a responsive feel; answer is computed locally
    window.setTimeout(() => {
      const answer = askConcierge(q);
      setMessages((m) => [...m, { role: "assistant", text: answer.text, answer }]);
      setTyping(false);
    }, 520);
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-neon px-4 py-3 text-ink-950 shadow-glow lg:bottom-6 lg:right-6"
        aria-label={t("misc.concierge.title")}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-ink-950/30" />
          <Sparkles className="relative h-5 w-5" />
        </span>
        <span className="text-sm font-semibold">{t("misc.concierge.title")}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-ink-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-x-3 bottom-3 z-50 flex h-[78vh] max-h-[640px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-2xl lg:inset-x-auto lg:bottom-6 lg:right-6 lg:h-[600px] lg:w-[420px]"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-gradient-to-r from-neon/10 to-transparent px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon text-ink-950">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      {t("misc.concierge.title")}
                      <span className="h-1.5 w-1.5 rounded-full bg-neon" />
                    </div>
                    <div className="text-[11px] text-white/45">{t("misc.concierge.subtitle")}</div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/[0.06] hover:text-white"
                  aria-label={t("misc.concierge.close")}
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* messages */}
              <div ref={scrollRef} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <MessageBubble key={i} msg={m} onChip={send} />
                ))}
                {typing && <Typing />}

                {messages.length === 1 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="px-1 text-[11px] uppercase tracking-wider text-white/35">
                      {t("misc.concierge.tryAsking")}
                    </div>
                    {SUGGESTED_QUESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="block w-full rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-left text-sm text-white/70 transition-colors hover:border-neon/30 hover:text-white"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-white/[0.07] p-3"
              >
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-950/60 px-3 py-2 focus-within:border-neon/40">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("misc.concierge.placeholder")}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-neon text-ink-950 transition-opacity disabled:opacity-40"
                    aria-label={t("misc.concierge.send")}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-white/30">
                  <ShieldCheck className="h-3 w-3" /> {t("misc.concierge.disclaimer")}
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ msg, onChip }: { msg: Msg; onChip: (s: string) => void }) {
  const { t } = useLanguage();
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-neon text-ink-950"
            : "border border-white/[0.07] bg-white/[0.03] text-white/85"
        )}
      >
        <p className="whitespace-pre-wrap">{msg.text}</p>

        {msg.answer?.chips && msg.answer.chips.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {msg.answer.chips.map((c) => (
              <Link
                key={c.href + c.label}
                href={c.href}
                className="inline-flex items-center gap-1 rounded-full border border-neon/30 bg-neon/10 px-2.5 py-1 text-xs text-neon hover:bg-neon/20"
              >
                {c.label} <ArrowUpRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        )}

        {msg.answer?.sources && msg.answer.sources.length > 0 && (
          <div className="mt-2.5 border-t border-white/10 pt-2">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-white/35">{t("misc.concierge.sources")}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {msg.answer.sources.map((s) => (
                <Link
                  key={s.href + s.label}
                  href={s.href}
                  className="text-xs text-white/55 underline-offset-2 hover:text-neon hover:underline"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-neon"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

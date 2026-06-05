import { cn } from "@/lib/utils";
import { BadgeCheck, Clock, ShieldX } from "lucide-react";
import type { VerificationStatus } from "@/lib/types";
import type { ReactNode } from "react";

type Tone = "neon" | "amber" | "blue" | "red" | "violet" | "neutral";

const tones: Record<Tone, string> = {
  neon: "bg-neon/12 text-neon border-neon/30",
  amber: "bg-accent-amber/12 text-accent-amber border-accent-amber/30",
  blue: "bg-accent-blue/12 text-accent-blue border-accent-blue/30",
  red: "bg-accent-red/12 text-accent-red border-accent-red/30",
  violet: "bg-accent-violet/12 text-accent-violet border-accent-violet/30",
  neutral: "bg-white/[0.06] text-white/70 border-white/10",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "verified")
    return (
      <Badge tone="neon">
        <BadgeCheck className="h-3.5 w-3.5" /> Verified
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge tone="amber">
        <Clock className="h-3.5 w-3.5" /> Pending
      </Badge>
    );
  return (
    <Badge tone="red">
      <ShieldX className="h-3.5 w-3.5" /> Rejected
    </Badge>
  );
}

export function LiveDot({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neon">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
      </span>
      {label}
    </span>
  );
}

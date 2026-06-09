import { cn } from "@/lib/utils";
import { BadgeCheck, Clock, ShieldX } from "lucide-react";
import type { VerificationStatus } from "@/lib/types";
import type { ReactNode } from "react";

type Tone = "neon" | "amber" | "blue" | "red" | "violet" | "neutral";

const tones: Record<Tone, string> = {
  neon: "bg-neon-subtle text-neon-ink border-neon-border",
  amber: "bg-accent-amber/10 text-accent-amber border-accent-amber/25",
  blue: "bg-accent-blue/10 text-accent-blue border-accent-blue/25",
  red: "bg-accent-red/10 text-accent-red border-accent-red/25",
  violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/25",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
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
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neon-ink">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
      </span>
      {label}
    </span>
  );
}

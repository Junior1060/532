import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
  hover = false,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-5",
        hover && "glass-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl px-4 py-3.5", className)}>
      <div className="text-xs uppercase tracking-wider text-white/45">{label}</div>
      <div className="mt-1 text-xl font-semibold text-white">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-white/50">{sub}</div>}
    </div>
  );
}

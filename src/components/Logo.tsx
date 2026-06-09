import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="532 home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-neon text-gray-900 shadow-glow-sm transition-transform duration-300 group-hover:scale-105">
        <span className="font-display text-lg font-black tracking-tighter">5</span>
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-gray-200 bg-accent-amber" />
      </span>
      {showWord && (
        <span className="font-display text-xl font-bold tracking-tight text-gray-900">
          532
          <span className="ml-1 align-top text-[10px] font-medium uppercase tracking-widest text-neon-ink">
            beta
          </span>
        </span>
      )}
    </Link>
  );
}

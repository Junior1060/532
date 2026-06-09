import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-neon text-gray-900 hover:brightness-105 hover:shadow-sm active:scale-[0.98] font-semibold",
  secondary:
    "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]",
  ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  outline:
    "border border-gray-300 text-gray-900 hover:border-neon hover:text-neon-ink active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2.5",
  md: "text-sm px-5 py-3",
  lg: "text-base px-7 py-4",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-white/[0.06] pb-12 pt-14 md:pt-20", className)}>
      <AmbientBackground />
      <div className="container-pad relative z-10">
        <Reveal>
          {eyebrow && (
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neon/80">
              {eyebrow}
            </div>
          )}
          <h1 className="max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base text-white/55 md:text-lg">{description}</p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}

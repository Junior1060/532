import * as Lucide from "lucide-react";
import type { LucideProps } from "lucide-react";

/** Render a Lucide icon by name (from data files). Falls back to a dot. */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Cmp = (Lucide as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Cmp) return <Lucide.Circle {...props} />;
  return <Cmp {...props} />;
}

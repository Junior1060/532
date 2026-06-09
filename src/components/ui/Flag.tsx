import { cn } from "@/lib/utils";

/**
 * Renders a country flag as an image (flagcdn.com) instead of a flag emoji.
 * Windows does not render flag emoji at all, so emoji flags are invisible there
 * — this guarantees flags show on every OS. It decodes the regional-indicator
 * emoji back to its ISO code; UK nations use flagcdn subdivision codes.
 *
 * Sizes to the surrounding font-size (h-[1em]) by default, so it can drop in
 * wherever a flag emoji used to be. Falls back to the raw text for anything
 * that isn't a country flag (e.g. 🌍).
 */
const SPECIAL: Record<string, string> = {
  "🏴󠁧󠁢󠁥󠁮󠁧󠁿": "gb-eng", // England
  "🏴󠁧󠁢󠁳󠁣󠁴󠁿": "gb-sct", // Scotland
  "🏴󠁧󠁢󠁷󠁬󠁳󠁿": "gb-wls", // Wales
};

function flagCode(emoji?: string): string | null {
  if (!emoji) return null;
  if (SPECIAL[emoji]) return SPECIAL[emoji];
  const cps = Array.from(emoji).map((c) => c.codePointAt(0) ?? 0);
  // Standard flag = two regional indicator symbols (U+1F1E6–U+1F1FF) → "us", "ca"…
  if (cps.length === 2 && cps.every((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)) {
    return cps.map((cp) => String.fromCharCode(cp - 0x1f1e6 + 97)).join("");
  }
  return null;
}

export function Flag({ emoji, className }: { emoji?: string; className?: string }) {
  const code = flagCode(emoji);
  if (!code) return emoji ? <span className={className}>{emoji}</span> : null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={cn("inline-block h-[1em] w-auto rounded-[0.15em] align-[-0.15em]", className)}
    />
  );
}

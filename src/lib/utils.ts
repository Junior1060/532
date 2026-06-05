import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with thousands separators. */
export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Title-case a slug. */
export function deslugify(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Deterministic pseudo-random in [0,1) from a string seed (SSR-safe, no Math.random). */
export function seededValue(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Pick a deterministic integer in [min, max] from a seed. */
export function seededInt(seed: string, min: number, max: number) {
  return Math.floor(seededValue(seed) * (max - min + 1)) + min;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/**
 * Serialize an object for an inline <script type="application/ld+json">.
 * JSON.stringify does NOT escape "<", so a value containing "</script>" could
 * break out of the tag (stored XSS when the data is user-submitted). Escaping
 * "<", ">", and "&" to unicode escapes keeps the payload inert.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

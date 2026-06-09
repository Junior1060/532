import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Repurposed to a light scale so existing `bg-ink-*` usages become
        // white → light-gray automatically (clean white minimal theme).
        ink: {
          950: "#ffffff",
          900: "#ffffff",
          850: "#fafafa",
          800: "#f9fafb",
          700: "#f3f4f6",
          600: "#e5e7eb",
        },
        // 532 green — accent/CTA only. DEFAULT is the brand fill (used with dark
        // text). `ink` is a deepened green for green text/icons on white (legible).
        neon: {
          DEFAULT: "#00ff85",
          ink: "#0a8f5b",
          soft: "#3dffa0",
          subtle: "#ecfdf3",
          border: "#a6f4c5",
          dim: "#0c5c3a",
          glow: "rgba(0,255,133,0.35)",
        },
        // Darkened one step for legibility on white.
        accent: {
          blue: "#2563eb",
          violet: "#7c3aed",
          amber: "#d97706",
          red: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        // Soft, neutral elevation — no neon glow. Old keys kept as graceful
        // fallbacks so any stragglers degrade to subtle shadows.
        sm: "0 1px 2px 0 rgba(16,24,40,0.05)",
        md: "0 4px 12px -2px rgba(16,24,40,0.08), 0 2px 6px -2px rgba(16,24,40,0.05)",
        lg: "0 12px 32px -8px rgba(16,24,40,0.12)",
        glow: "0 4px 12px -2px rgba(16,24,40,0.08)",
        "glow-sm": "0 1px 2px 0 rgba(16,24,40,0.05)",
        card: "0 1px 3px rgba(16,24,40,0.1), 0 1px 2px rgba(16,24,40,0.06)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.8s infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite",
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

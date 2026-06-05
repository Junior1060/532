"use client";

import { motion } from "framer-motion";

/** Subtle moving gradient + grid backdrop used behind sections. Pure CSS/transform — cheap. */
export function AmbientBackground({ withGlobe = false }: { withGlobe?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* base grid */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />
      {/* moving neon grid overlay */}
      <div className="absolute inset-0 animate-grid-pan bg-grid-neon mask-fade-b opacity-40" />
      {/* spotlight */}
      <div className="absolute inset-0 spotlight" />

      {/* drifting gradient blobs */}
      <motion.div
        aria-hidden
        className="absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-neon/10 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-40 top-40 h-[26rem] w-[26rem] rounded-full bg-accent-blue/10 blur-[130px]"
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {withGlobe && <GlobeArtwork />}
    </div>
  );
}

function GlobeArtwork() {
  return (
    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
      <div className="relative h-[42rem] w-[42rem] opacity-[0.18]">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-neon/30" />
        <div className="absolute inset-8 animate-spin-slow rounded-full border border-white/10 [animation-direction:reverse]" />
        <div className="absolute inset-20 rounded-full border border-neon/20" />
        {/* meridians */}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 rounded-full border-x border-white/[0.06]"
            style={{ transform: `rotateY(70deg) rotateZ(${deg}deg)` }}
          />
        ))}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,133,0.15),transparent_60%)]" />
      </div>
    </div>
  );
}

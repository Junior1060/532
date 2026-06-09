/**
 * Decorative backdrop. In the clean white theme this renders nothing — the old
 * animated neon grid + drifting blobs were removed for a flat, minimal look.
 * Kept as a no-op component so existing call sites need no changes.
 */
export function AmbientBackground(_props: { withGlobe?: boolean }) {
  return null;
}

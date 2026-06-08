/**
 * Supabase configuration flag. The app runs fully on seed data when env vars
 * are absent; when configured, the clients in `lib/supabase/*` connect to a real
 * Supabase project (schema in /supabase/schema.sql).
 *
 *   - lib/supabase/client.ts  → browser client (anon, session-aware)
 *   - lib/supabase/server.ts  → server client (anon, RLS as the signed-in user)
 *   - lib/supabase/admin.ts   → service-role client (bypasses RLS, server-only)
 */
export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

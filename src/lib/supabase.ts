/**
 * Supabase client helpers. The app runs fully on seed data when env vars are absent;
 * when configured, these connect to a real Supabase project (schema in /supabase/schema.sql).
 */

export const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Minimal surface used by the app; the real client (when installed) is a superset. */
interface SupabaseLike {
  from: (table: string) => {
    insert: (row: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
}

/**
 * Returns a configured Supabase client, or null when env is not set.
 * Dynamically imports so the dependency is optional at build time.
 */
export async function getSupabaseServer(): Promise<SupabaseLike | null> {
  if (!SUPABASE_CONFIGURED) return null;
  try {
    // Indirect specifier keeps this an optional, runtime-only dependency so the
    // build doesn't require @supabase/supabase-js to be installed.
    const pkg = ["@supabase", "supabase-js"].join("/");
    const mod = (await import(/* webpackIgnore: true */ pkg)) as {
      createClient: (url: string, key: string) => SupabaseLike;
    };
    return mod.createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  } catch {
    return null;
  }
}

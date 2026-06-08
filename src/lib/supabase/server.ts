import "server-only";

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Cookie-bound server Supabase client (anon key + the visitor's session).
 * Use in Server Components, Server Actions, and Route Handlers. RLS applies as
 * the signed-in user, so admin-only writes are enforced by the database.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component where cookies are
            // read-only. The middleware refreshes the session, so this is safe
            // to ignore.
          }
        },
      },
    }
  );
}

/**
 * Returns the current user and whether they are an admin (profiles.role).
 * `null` user means not signed in.
 */
export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { user, isAdmin: profile?.role === "admin", supabase };
}

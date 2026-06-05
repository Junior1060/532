import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Interim access gate for /admin.
 *
 * Until full Supabase Auth + `profiles.is_admin` is wired, the admin area is
 * protected by a shared secret in ADMIN_ACCESS_TOKEN:
 *   - No token configured  → /admin is DISABLED (redirect home). Safe default.
 *   - Visit /admin?key=<token> once → sets an httpOnly cookie, then redirects clean.
 *   - Subsequent visits require that cookie.
 *
 * Replace this with a real per-user session + admin role check before opening
 * the dashboard to multiple operators (see SECURITY.md).
 */
const ADMIN_COOKIE = "532_admin";

export function middleware(req: NextRequest) {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  const url = req.nextUrl;

  // Admin is off unless an access token is explicitly configured.
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // One-time unlock via ?key=… → set cookie, strip the key from the URL.
  const key = url.searchParams.get("key");
  if (key) {
    if (key === token) {
      const dest = url.clone();
      dest.searchParams.delete("key");
      const res = NextResponse.redirect(dest);
      res.cookies.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/admin",
        maxAge: 60 * 60 * 8, // 8 hours
      });
      return res;
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.cookies.get(ADMIN_COOKIE)?.value === token) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { AdminDashboard, type PendingBusiness, type PendingPost, type AdminAlert, type AdminStats } from "@/components/admin/AdminDashboard";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { LiveDot } from "@/components/ui/Badge";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";
import { getSessionUser } from "@/lib/supabase/server";

export const metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "532 internal admin dashboard — moderate businesses, manage cities, post alerts, and view analytics.",
  path: "/admin",
});

// Always render fresh — pending listings change as they're moderated.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Middleware already gates /admin by session + admin role; re-check here as
  // defense in depth so the dashboard never renders for a non-admin.
  const { user, isAdmin, supabase } = await getSessionUser();
  if (!user || !isAdmin) {
    notFound();
  }

  const [pendingRes, postsRes, alertsRes, verifiedCountRes] = await Promise.all([
    supabase
      .from("businesses")
      .select("id,name,category,address,city_slug")
      .eq("verification", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("community_posts")
      .select("id,title,body,type,city_slug")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("alerts")
      .select("id,message,city_slug,level")
      .eq("active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("businesses")
      .select("id", { count: "exact", head: true })
      .eq("verification", "verified"),
  ]);

  const pendingBusinesses = (pendingRes.data ?? []) as PendingBusiness[];
  const pendingPosts = (postsRes.data ?? []) as PendingPost[];
  const alerts = (alertsRes.data ?? []) as AdminAlert[];
  const stats: AdminStats = {
    pendingBusinesses: pendingBusinesses.length,
    verifiedBusinesses: verifiedCountRes.count ?? 0,
    pendingPosts: pendingPosts.length,
    activeAlerts: alerts.length,
  };

  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={<span className="flex items-center gap-2"><LiveDot /> {translate(lang, "commerce.admin.eyebrow")}</span>}
        title={translate(lang, "commerce.admin.title")}
        description={translate(lang, "commerce.admin.description")}
      >
        <SignOutButton label={translate(lang, "commerce.admin.signOut")} />
      </PageHeader>
      <Section className="py-10">
        <AdminDashboard
          pendingBusinesses={pendingBusinesses}
          pendingPosts={pendingPosts}
          alerts={alerts}
          stats={stats}
        />
      </Section>
    </>
  );
}

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LiveDot } from "@/components/ui/Badge";
import { buildMetadata } from "@/lib/seo";
import { translate } from "@/lib/i18n";
import { getServerLang } from "@/lib/locale";

export const metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "532 internal admin dashboard — moderate businesses, manage cities, post alerts, and view analytics.",
  path: "/admin",
});

export default async function AdminPage() {
  // Defense in depth: middleware gates /admin, but re-check the access cookie
  // here so the dashboard never renders without a valid token. See SECURITY.md.
  const token = process.env.ADMIN_ACCESS_TOKEN;
  const cookieStore = await cookies();
  if (!token || cookieStore.get("532_admin")?.value !== token) {
    notFound();
  }

  const lang = await getServerLang();
  return (
    <>
      <PageHeader
        eyebrow={<span className="flex items-center gap-2"><LiveDot /> {translate(lang, "commerce.admin.eyebrow")}</span>}
        title={translate(lang, "commerce.admin.title")}
        description={translate(lang, "commerce.admin.description")}
      />
      <Section className="py-10">
        <AdminDashboard />
      </Section>
    </>
  );
}

import { AuthForm } from "@/components/auth/AuthForm";
import { AmbientBackground } from "@/components/visuals/AmbientBackground";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Create account", path: "/signup" });

export default function SignupPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden py-16">
      <AmbientBackground />
      <div className="container-pad relative z-10">
        <AuthForm mode="signup" />
      </div>
    </section>
  );
}

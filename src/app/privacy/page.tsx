import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How 532 handles privacy for fans, businesses, and visitors.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy"
        title="Privacy"
        description="532 collects only the information needed to operate the directory, concierge, and match-day tools."
      />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-white/60">
          <p>
            We use submitted business details, account information, search terms, and basic usage data to run the
            platform, improve recommendations, prevent abuse, and respond to support requests.
          </p>
          <p>
            We do not sell personal information. When third-party services are used for hosting, analytics, maps,
            payments, or messaging, they process data only as needed to provide those services.
          </p>
          <p>
            To request access, correction, or deletion of information connected to your listing or account, contact the
            532 team through your normal support channel.
          </p>
        </div>
      </Section>
    </>
  );
}

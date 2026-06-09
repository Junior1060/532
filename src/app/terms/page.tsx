import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using 532.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy"
        title="Terms"
        description="By using 532, you agree to use the platform responsibly and verify time-sensitive travel details."
      />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-gray-600">
          <p>
            532 provides city intelligence, business listings, and fan guidance for convenience. Match schedules,
            transit conditions, venue policies, prices, and availability can change, so users should confirm critical
            details with official sources before acting.
          </p>
          <p>
            Businesses are responsible for keeping submitted listings accurate, lawful, and current. 532 may review,
            edit, reject, suspend, or remove listings that appear misleading, unsafe, abusive, or out of scope.
          </p>
          <p>
            532 is an unofficial fan services platform and is not affiliated with FIFA, host cities, venues, teams, or
            tournament organizers unless explicitly stated.
          </p>
        </div>
      </Section>
    </>
  );
}

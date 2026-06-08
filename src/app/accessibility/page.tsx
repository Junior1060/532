import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility commitments for 532.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy"
        title="Accessibility"
        description="532 aims to make host-city information easy to navigate across devices, languages, and assistive tools."
      />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-7 text-white/60">
          <p>
            The site is designed with keyboard-accessible controls, semantic pages, responsive layouts, visible focus
            states, and language metadata for supported locales.
          </p>
          <p>
            We continue to improve contrast, labels, motion behavior, and screen-reader support as the product grows.
            If a page or feature is difficult to use, report the issue with the page URL, device, browser, and assistive
            technology involved.
          </p>
        </div>
      </Section>
    </>
  );
}

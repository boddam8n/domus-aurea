import { PageShell } from "@/components/page-shell";
import { ComparisonSection, FaqSection } from "@/components/home-sections";
import { PricingSection } from "@/components/pricing-section";

export default function PricingPage() {
  return (
    <PageShell>
      <div className="pt-20">
        <PricingSection />
        <ComparisonSection />
        <FaqSection />
      </div>
    </PageShell>
  );
}

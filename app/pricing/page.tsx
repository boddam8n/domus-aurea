import { PageShell } from "@/components/page-shell";
import { ComparisonSection, FaqSection, PricingSection } from "@/components/home-sections";

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

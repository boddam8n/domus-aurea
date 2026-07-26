import { PageShell } from "@/components/page-shell";
import {
  FaqSection,
  HeroSection,
  OrderCtaSection,
  PricingSection,
  ProcessSection,
  TestimonialsSection,
} from "@/components/home-sections";
import { brandFontVariables } from "@/lib/brand-fonts";
import { getPublicPricingPackages } from "@/lib/pricing";

export default async function HomePage() {
  const pricingPackages = await getPublicPricingPackages();

  return (
    <div className={`${brandFontVariables} homepage-type`}>
      <PageShell>
        <HeroSection />
        <ProcessSection />
        <PricingSection packages={pricingPackages} />
        <TestimonialsSection />
        <FaqSection />
        <OrderCtaSection />
      </PageShell>
    </div>
  );
}

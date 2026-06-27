import { PageShell } from "@/components/page-shell";
import {
  FaqSection,
  HeroSection,
  OrderCtaSection,
  PricingSection,
  ProcessSection,
  TestimonialsSection,
} from "@/components/home-sections";

export default function HomePage() {
  return (
    <PageShell>
      <HeroSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <OrderCtaSection />
    </PageShell>
  );
}

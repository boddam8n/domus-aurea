import { PageShell } from "@/components/page-shell";
import {
  FaqSection,
  HeroSection,
  OrderCtaSection,
  PricingSection,
  ProcessSection,
  TemplateShowcase,
  TestimonialsSection,
} from "@/components/home-sections";

export default function HomePage() {
  return (
    <PageShell>
      <HeroSection />
      <TemplateShowcase />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <OrderCtaSection />
    </PageShell>
  );
}

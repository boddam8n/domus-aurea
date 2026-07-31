import { PageShell } from "@/components/page-shell";
import {
  FaqSection,
  HeroSection,
  OrderCtaSection,
  ProcessSection,
  TestimonialsSection,
  WeddingTemplatesShowcase,
} from "@/components/home-sections";

export default function HomePage() {
  return (
    <div className="homepage-type">
      <PageShell>
        <HeroSection />
        <WeddingTemplatesShowcase />
        <ProcessSection />
        <TestimonialsSection />
        <OrderCtaSection />
        <FaqSection />
      </PageShell>
    </div>
  );
}

import { AdminPricingManager } from "@/components/admin-pricing-manager";
import { PageShell } from "@/components/page-shell";
import { brandFontVariables } from "@/lib/brand-fonts";

export default function AdminPage() {
  return (
    <div className={`${brandFontVariables} homepage-type`}>
      <PageShell>
        <section className="px-4 py-32 md:px-8">
          <div className="mx-auto max-w-6xl">
            <AdminPricingManager />
          </div>
        </section>
      </PageShell>
    </div>
  );
}

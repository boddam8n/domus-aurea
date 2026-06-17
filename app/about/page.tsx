import Image from "next/image";
import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-gold">ع�  Domus Aurea</p>
            <h1 className="font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">
              A digital atelier for luxury wedding invitation orders.
            </h1>
            <p className="mt-7 text-lg leading-9 text-[var(--color-muted)]">
              We design the ordering experience for couples and planners who care about mood, typography, language, ceremony details and the emotional first impression guests receive.
            </p>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem]">
            <Image src="/assets/candle-table.webp" alt="Luxury wedding table" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/50 to-transparent" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}

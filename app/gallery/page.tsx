import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { gallery } from "@/lib/data";

export default function GalleryPage() {
  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Gallery"
            title="A cinematic gallery for every moment."
            body="Optimized editorial grids with luxury hover effects and responsive image layouts."
          />
          <div className="mt-14 grid auto-rows-[280px] gap-5 md:grid-cols-4">
            {[...gallery, ...gallery].map((src, index) => (
              <div
                key={`${src}-${index}`}
                className={`group relative overflow-hidden rounded-[2rem] ${index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <SafeImage src={src} alt="" fill fallbackLabel="Gallery" sizes="(min-width: 768px) 25vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent opacity-80" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

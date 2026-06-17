import { PageShell } from "@/components/page-shell";
import { GalleryPreview, ThemesSection } from "@/components/home-sections";

export default function ThemesPage() {
  return (
    <PageShell>
      <div className="pt-20">
        <ThemesSection />
        <GalleryPreview />
      </div>
    </PageShell>
  );
}

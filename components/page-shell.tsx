import { AmbientParticles } from "@/components/ambient-particles";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="luxury-bg relative min-h-screen overflow-hidden">
      <AmbientParticles />
      <Navigation />
      <div className="relative z-10">{children}</div>
      <Footer />
    </main>
  );
}

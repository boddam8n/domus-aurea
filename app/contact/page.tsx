import { Mail, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid min-h-screen place-items-center px-4 py-32 md:px-8">
        <div className="glass grid max-w-5xl gap-8 rounded-[2.5rem] p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">Contact</p>
            <h1 className="mt-5 font-display text-5xl text-pearl md:text-7xl">Plan something unforgettable.</h1>
            <p className="mt-6 leading-8 text-pearl/65">
              For wedding studios, planners and couples who want a digital invitation that feels like a premium brand experience.
            </p>
          </div>
          <div className="grid gap-4">
            {[Mail, Phone, MapPin].map((Icon, index) => (
              <div key={index} className="flex items-center gap-4 rounded-3xl bg-white/[0.06] p-5 text-pearl/75">
                <Icon className="h-5 w-5 text-gold" />
                <span>{index === 0 ? "hello@domusaurea.com" : index === 1 ? "+20 100 000 0000" : "Cairo · Dubai · Riyadh"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

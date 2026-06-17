import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { story } from "@/lib/data";

export default function StoryPage() {
  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            eyebrow="Story"
            title="The timeline of a love story."
            body="A scroll-triggered narrative timeline for couples who want the invitation to feel personal."
          />
          <div className="relative mt-16">
            <div className="absolute bottom-0 right-1/2 top-0 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
            {story.map((item, index) => (
              <article key={item.title} className={`relative mb-10 grid gap-6 md:grid-cols-2 ${index % 2 ? "" : "md:[&>*:first-child]:col-start-2"}`}>
                <div className="glass rounded-[2rem] p-7">
                  <span className="gold-text font-display text-5xl">{item.date}</span>
                  <h2 className="mt-5 text-2xl font-bold text-pearl">{item.title}</h2>
                  <p className="mt-3 leading-8 text-pearl/62">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

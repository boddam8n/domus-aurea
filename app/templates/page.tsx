"use client";

import Link from "next/link";
import { ArrowUpLeft, Eye, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { invitationTemplates } from "@/lib/data";

const styleNotes = [
  "Acrylic",
  "Wax seal",
  "Coastal",
  "Scroll",
  "Seaside",
  "Laser cut",
  "Velvet",
  "Letterpress",
  "Noir"
];

export default function TemplatesPage() {
  const { isArabic } = useLanguage();

  return (
    <PageShell>
      <section className="px-4 pb-24 pt-32 md:px-8 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-gold">
                <Sparkles className="h-4 w-4" />
                {isArabic ? "مجموعة القوالب" : "Template Collection"}
              </p>
              <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">
                {isArabic ? "دعوات تبدو كقطعة فنية قبل أن تصبح رابطًا." : "Invitation previews that feel crafted, not generated."}
              </h1>
            </div>
            <p className="max-w-2xl leading-8 text-[var(--color-muted)] lg:justify-self-end">
              {isArabic
                ? "كل قالب هنا أعيد بناؤه كمعاينة حقيقية: خامات، طبقات، ختم، ورق، أكريليك، ومونوجرام. اختر الاتجاه الأقرب لفرحك ثم أكمل التفاصيل من صفحة التصميم."
                : "Each template now uses a dedicated invitation artwork preview: material, layering, seal, paper, acrylic and monogram details. Choose the direction closest to the wedding mood."}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {invitationTemplates.map((template, index) => (
              <article
                key={template.name}
                className={`group relative ${index % 3 === 1 ? "xl:mt-12" : ""} ${index % 3 === 2 ? "xl:mt-5" : ""}`}
              >
                <div className="absolute -inset-3 rounded-[2rem] bg-gold/0 blur-2xl transition duration-500 group-hover:bg-gold/10" />
                <div className="relative overflow-hidden rounded-[2rem] border border-gold/15 bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(0,0,0,.16)] transition duration-500 group-hover:-translate-y-2 group-hover:border-gold/35 group-hover:shadow-[0_34px_100px_rgba(0,0,0,.24)]">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfcf]">
                    <SafeImage
                      src={template.image}
                      alt={`${template.name} template preview`}
                      fill
                      fallbackLabel={isArabic ? template.nameAr : template.name}
                      sizes="(min-width:1280px) 31vw, (min-width:768px) 48vw, 100vw"
                      className="object-contain transition duration-700 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                      {styleNotes[index]}
                    </div>
                    <Link
                      href={`/design?template=${encodeURIComponent(template.name)}`}
                      className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#f7efe2] px-5 py-3 text-sm font-bold text-night shadow-[0_16px_40px_rgba(0,0,0,.25)] transition hover:bg-gold"
                    >
                      {isArabic ? "اختيار القالب" : "Select Template"}
                      <ArrowUpLeft className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-3xl text-[var(--color-text)]">{isArabic ? template.nameAr : template.name}</h2>
                        <p className="mt-3 min-h-20 leading-7 text-[var(--color-muted)]">{template.description}</p>
                      </div>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/20 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-night">
                        <Eye className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-gold/10 pt-5 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      <span>{isArabic ? "معاينة تفاعلية" : "Interactive preview"}</span>
                      <span className="text-gold">Domus Aurea</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

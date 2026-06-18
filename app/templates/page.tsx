"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { invitationTemplates } from "@/lib/data";

export default function TemplatesPage() {
  const { isArabic } = useLanguage();

  return (
    <PageShell>
      <section className="px-4 py-32 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">{isArabic ? "قوالب الدعوات" : "Invitation Templates"}</p>
            <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">
              {isArabic ? "تصفح أنماط دعوات راقية." : "Browse refined invitation styles."}
            </h1>
            <p className="mt-5 leading-8 text-[var(--color-muted)]">
              {isArabic
                ? "اختر النمط الأقرب لذوقك، ثم أكمل الطلب. كل دعوة نهائية يتم صقلها خصيصًا بواسطة دوموس أوريا."
                : "Choose a preferred style, then complete a request. Every final invitation is custom-polished by Domus Aurea."}
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {invitationTemplates.map((template, index) => (
              <article key={template.name} className={index % 3 === 1 ? "xl:mt-10" : ""}>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-gold/15">
                  <SafeImage
                    src={template.image}
                    alt={`${template.name} template preview`}
                    fill
                    fallbackLabel={isArabic ? template.nameAr : template.name}
                    sizes="(min-width:1280px) 31vw, (min-width:768px) 48vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.025]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/20 bg-black/25 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                      {isArabic ? "معاينة مباشرة" : "Live Preview"}
                    </span>
                    <Link href={`/design?template=${encodeURIComponent(template.name)}`} className="rounded-full bg-[#f7efe2] px-4 py-2 text-sm font-bold text-night transition hover:bg-gold">
                      {isArabic ? "اختيار" : "Select"}
                    </Link>
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl text-[var(--color-text)]">{isArabic ? template.nameAr : template.name}</h2>
                    <p className="mt-2 leading-7 text-[var(--color-muted)]">{template.description}</p>
                  </div>
                  <Eye className="mt-2 h-5 w-5 shrink-0 text-gold" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

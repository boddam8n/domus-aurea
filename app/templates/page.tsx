"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpLeft, Eye, Lock, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { PageShell } from "@/components/page-shell";
import { SafeImage } from "@/components/safe-image";
import { PlayPreviewButton, TemplatePreviewModal } from "@/components/template-preview-experience";
import { invitationTemplates, type InvitationTemplate } from "@/lib/data";

const styleNotes = [
  "Acrylic",
  "Wax seal",
  "Coastal",
  "Scroll",
  "Seaside",
  "Laser cut",
  "Velvet",
  "Letterpress",
  "Noir",
  "Launch"
];

export default function TemplatesPage() {
  const { isArabic } = useLanguage();
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

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
                {isArabic ? "قالب واحد جاهز للإطلاق، والباقي تحت التطوير." : "One launch-ready invitation, with the wider collection under development."}
              </h1>
            </div>
            <p className="max-w-2xl leading-8 text-[var(--color-muted)] lg:justify-self-end">
              {isArabic
                ? "حللنا اتجاهات الصور المرفوعة كخامات ومراجع بصرية، لكن القوالب الحالية لن تكون متاحة للعملاء حتى تكتمل. قالب TEST فقط هو قالب الإنتاج الحالي."
                : "The uploaded references are being treated as visual inspiration for future directions. Current collection cards are locked until polished. TEST is the only production-ready template."}
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {invitationTemplates.map((template, index) =>
              template.status === "available" ? (
                <LaunchTemplateCard key={template.name} template={template} isArabic={isArabic} onPreview={() => setPreviewTemplate(template.name)} />
              ) : (
                <DevelopmentTemplateCard key={template.name} template={template} index={index} isArabic={isArabic} />
              )
            )}
          </div>
        </div>
      </section>
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        templateName={previewTemplate ?? "TEST"}
        onClose={() => setPreviewTemplate(null)}
      />
    </PageShell>
  );
}

function DevelopmentTemplateCard({ template, index, isArabic }: { template: InvitationTemplate; index: number; isArabic: boolean }) {
  return (
    <article data-template-name={template.name} className={`group relative ${index % 3 === 1 ? "xl:mt-12" : ""} ${index % 3 === 2 ? "xl:mt-5" : ""}`}>
      <div className="absolute -inset-3 rounded-[2rem] bg-gold/0 blur-2xl transition duration-500 group-hover:bg-gold/6" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(0,0,0,.14)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#e8dfcf]">
          <SafeImage
            src={template.image}
            alt={`${template.name} template preview`}
            fill
            fallbackLabel={isArabic ? template.nameAr : template.name}
            sizes="(min-width:1280px) 31vw, (min-width:768px) 48vw, 100vw"
            className="object-contain opacity-75 grayscale-[.15] transition duration-700 group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
            {styleNotes[index]}
          </div>
          <div className="absolute inset-x-5 bottom-5 rounded-[1.25rem] border border-[#d8b15f]/28 bg-black/45 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,.3)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d8b15f]/45 text-[#d8b15f]">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8b15f]">{isArabic ? template.badgeAr : template.badge}</p>
                <p className="mt-1 text-sm text-white/70">{isArabic ? "تحت التطوير وغير متاح للاختيار الآن" : "Under Development and not selectable yet"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-[var(--color-text)]">{isArabic ? template.nameAr : template.name}</h2>
              <p className="mt-3 min-h-20 leading-7 text-[var(--color-muted)]">{template.description}</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-[var(--color-muted)]">
              <Eye className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            <span>{isArabic ? "قريبًا" : "Coming Soon"}</span>
            <span className="text-gold">{isArabic ? "تحت التطوير" : "Under Development"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function LaunchTemplateCard({ template, isArabic, onPreview }: { template: InvitationTemplate; isArabic: boolean; onPreview: () => void }) {
  return (
    <article data-template-name={template.name} className="group relative md:col-span-2 xl:col-span-3">
      <div className="absolute -inset-3 rounded-[2.25rem] bg-gold/12 blur-3xl" />
      <div className="relative grid overflow-hidden rounded-[2.25rem] border border-gold/25 bg-[var(--color-surface)] shadow-[0_34px_110px_rgba(0,0,0,.24)] lg:grid-cols-[0.95fr_1fr]">
        <div className="relative min-h-[560px] overflow-hidden bg-[#f5dfd6]">
          <SafeImage
            src={template.image}
            alt={`${template.name} production invitation preview`}
            fill
            fallbackLabel={template.name}
            sizes="(min-width:1024px) 48vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.025]"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_40%,transparent_26%,rgba(44,22,16,.12)_100%)]" />
          <div className="absolute left-5 top-5 rounded-full border border-[#d8b15f]/35 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f7efe2] backdrop-blur-md">
            {isArabic ? template.badgeAr : template.badge}
          </div>
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold">Production Template</p>
          <h2 className="mt-5 font-display text-5xl leading-tight text-[var(--color-text)] md:text-7xl">{template.name}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
            {isArabic
              ? "قالب دعوة واحد مصقول للإطلاق: ظرف زمردي فاخر، ختم ذهبي، ورقة عاجية قابلة للقراءة، وحركة فتح واحدة بطيئة وراقية."
              : template.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PlayPreviewButton onClick={onPreview} isArabic={isArabic} />
            <Link
              href="/design?template=TEST"
              className="inline-flex items-center gap-2 rounded-full bg-[#f7efe2] px-6 py-3 text-sm font-bold text-night shadow-[0_16px_40px_rgba(0,0,0,.2)] transition hover:-translate-y-0.5 hover:bg-gold"
            >
              {isArabic ? "اختيار TEST" : "Select TEST"}
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-3">
            <span className="rounded-2xl border border-gold/15 bg-gold/10 px-4 py-3">{isArabic ? "بدون slideshow" : "No slideshow"}</span>
            <span className="rounded-2xl border border-gold/15 bg-gold/10 px-4 py-3">{isArabic ? "حقول ديناميكية" : "Dynamic fields"}</span>
            <span className="rounded-2xl border border-gold/15 bg-gold/10 px-4 py-3">{isArabic ? "جاهز للموبايل" : "Mobile first"}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

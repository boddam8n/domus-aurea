"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Gem, PenLine } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { comparison, faqs, features, gallery, invitationTemplates, pricingPlans, processSteps, testimonials, themes } from "@/lib/data";
import { fadeUp, stagger } from "@/components/motion-presets";

export function HeroSection() {
  const { isArabic } = useLanguage();

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden px-5 pb-20 pt-32 md:px-10 md:pb-24">
      <div className="absolute inset-0">
        <Image src="/assets/domus-hero.webp" alt="Royal palace wedding ceremony illuminated by candlelight" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-night/82 via-night/42 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/20" />
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto w-full max-w-7xl">
        <div className="max-w-4xl">
          <motion.p variants={fadeUp} className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#e1bd72]">
            {isArabic ? "دعوات زفاف فاخرة" : "Luxury wedding invitations"}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-display text-6xl leading-[0.9] text-[#f7efe2] md:text-8xl xl:text-9xl">
            Domus Aurea
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl font-display text-2xl text-[#f7efe2] md:text-4xl">
            {isArabic ? "اصنع دعوة زفاف لا تنسى." : "Craft unforgettable wedding invitations."}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-lg leading-9 text-[#f7efe2]/70">
            {isArabic
              ? "نصمم دعوات زفاف رقمية راقية تحول تفاصيل يومكم إلى تجربة هادئة، دافئة، ولا تنسى."
              : "A refined ordering experience for couples who want calm, romantic, premium digital invitations."}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/design" className="group rounded-full bg-[#f7efe2] px-7 py-4 font-bold text-night shadow-[0_10px_35px_rgba(222,190,116,.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#dfbd74]">
              {isArabic ? "ابدأ التصميم" : "Start Designing"}
              <ArrowLeft className="mr-2 inline h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
            <Link href="/templates" className="rounded-full border border-[#f7efe2]/30 px-7 py-4 font-bold text-[#f7efe2] transition duration-300 hover:-translate-y-0.5 hover:border-[#dfbd74] hover:bg-black/20">
              {isArabic ? "شاهد القوالب" : "View Templates"}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export function TemplateShowcase() {
  const { isArabic } = useLanguage();

  return (
    <section className="px-5 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={isArabic ? "قوالب مختارة" : "Selected invitations"}
          title={isArabic ? "مجموعة هادئة من اتجاهات خالدة." : "A quiet collection of timeless directions."}
          body={isArabic ? "كل قالب هو بداية قابلة للتخصيص، وليس شكلًا جاهزًا يتكرر على الجميع." : "Each template is a design direction, not a repeated off-the-shelf layout."}
        />
        <div className="mt-16 grid gap-7 lg:grid-cols-3">
          {invitationTemplates.map((template, index) => (
            <article key={template.name} className={index === 1 ? "lg:mt-14" : ""}>
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-gold/15 bg-black/10">
                <Image src={template.image} alt={`${template.name} invitation template`} fill sizes="(min-width:1024px) 31vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/65 via-transparent to-transparent" />
                <Link href="/design" className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-black/25 px-5 py-2 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-night">
                  {isArabic ? "تخصيص القالب" : "Customize template"}
                </Link>
              </div>
              <h3 className="mt-6 font-display text-3xl text-[var(--color-text)]">{isArabic ? template.nameAr : template.name}</h3>
              <p className="mt-2 leading-7 text-[var(--color-muted)]">{template.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  const { isArabic } = useLanguage();

  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={isArabic ? "ماذا تطلب" : "What customers order"}
          title={isArabic ? "نظام دعوة كامل، وليس صفحة واحدة." : "A complete invitation system, not a single page."}
          body={isArabic ? "التجربة العامة مبنية حول الاختيار والطلب، بينما تبقى أدوات الإدارة داخل حساب العميل." : "The public experience is built around choosing, briefing and ordering. Private operations stay behind the client portal."}
        />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-120px" }} className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article key={feature.title} variants={fadeUp} whileHover={{ y: -5 }} className={`glass rounded-[2rem] p-6 ${index === 1 ? "xl:translate-y-8" : ""}`}>
              <feature.icon className="h-8 w-8 text-gold" />
              <h3 className="mt-6 text-2xl font-bold text-[var(--color-text)]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[var(--color-muted)]">{feature.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { isArabic } = useLanguage();

  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gold">{isArabic ? "خطوات الطلب" : "Ordering flow"}</p>
          <h2 className="font-display text-4xl text-[var(--color-text)] md:text-6xl">{isArabic ? "مصممة كموعد خاص داخل دار فاخرة." : "Designed like a private atelier appointment."}</h2>
          <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
            {isArabic ? "نرشد العميل لاختيار الباقة والقالب والتفاصيل بدون تعقيد أو أدوات مشتتة." : "Customers are guided through package, theme, content and launch details without exposing backend tools."}
          </p>
        </div>
        <div className="grid gap-4">
          {processSteps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass grid gap-5 rounded-[2rem] p-6 md:grid-cols-[auto_1fr]">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-sm font-black text-night">{index + 1}</span>
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">{step.title}</h3>
                <p className="mt-2 leading-7 text-[var(--color-muted)]">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  const { isArabic } = useLanguage();

  return (
    <section id="pricing" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={isArabic ? "الأسعار" : "Pricing"}
          title={isArabic ? "ثلاث طرق راقية للبدء." : "Three elegant ways to begin."}
          body={isArabic ? "أسعار واضحة بالجنيه المصري لطلب دعوة مخصصة، ويتم استكمال التفاصيل مع فريق دوموس أوريا." : "Simple Egyptian pound pricing for a custom invitation request. The final delivery is completed with the Domus Aurea team."}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <motion.article key={plan.name} whileHover={{ y: -8 }} className={`rounded-[2rem] p-6 ${plan.featured ? "animated-border bg-[var(--color-text)] text-[var(--color-bg)]" : "glass"}`}>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-gold">{isArabic ? plan.nameAr : plan.name}</p>
              <h3 className="mt-4 font-display text-5xl">{plan.price}</h3>
              <p className={`mt-4 leading-7 ${plan.featured ? "text-[var(--color-bg)]/70" : "text-[var(--color-muted)]"}`}>{plan.description}</p>
              <ul className="mt-7 space-y-3">
                {plan.features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/design" className={`mt-8 block rounded-full px-6 py-4 text-center font-bold ${plan.featured ? "bg-night text-pearl" : "bg-[var(--color-text)] text-[var(--color-bg)]"}`}>
                {isArabic ? "ابدأ الطلب" : "Start order"}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ThemesSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Themes" title="Visual directions with editorial restraint." body="No generic templates. Each direction is a starting point for a crafted invitation identity." />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {themes.map((theme, index) => (
            <motion.div key={theme.name} whileHover={{ scale: 1.015 }} className={`glass rounded-[2rem] p-5 ${index === 1 ? "md:mt-10" : ""}`}>
              <div className="flex h-52 overflow-hidden rounded-3xl">
                {theme.colors.map((color) => (
                  <div key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <h3 className="mt-6 font-display text-3xl text-[var(--color-text)]">{theme.name}</h3>
              <p className="mt-3 leading-7 text-[var(--color-muted)]">{theme.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GalleryPreview() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Visual library" title="Luxury references that feel real." body="Wedding halls, candlelight, floral aisles and sunset venues composed with editorial rhythm." />
        <div className="mt-14 grid auto-rows-[240px] gap-4 md:grid-cols-5">
          {gallery.map((src, index) => (
            <motion.div key={src} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className={`relative overflow-hidden rounded-[2rem] ${index === 0 ? "md:col-span-2 md:row-span-2" : ""} ${index === 3 ? "md:col-span-2" : ""}`}>
              <Image src={src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/55 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ComparisonSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Compare" title="Premium features, clearly scoped." body="A transparent feature matrix for customers before they order." />
        <div className="glass mt-14 overflow-hidden rounded-[2rem]">
          {comparison.map((row) => (
            <div key={row.feature} className="grid grid-cols-4 gap-3 border-b border-white/10 p-5 last:border-b-0">
              <span className="font-bold text-[var(--color-text)]">{row.feature}</span>
              {(["signature", "couture", "royal"] as const).map((key) => (
                <span key={key} className="text-center text-[var(--color-muted)]">{row[key] ? <Check className="mx-auto h-5 w-5 text-gold" /> : "-"}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Clients" title="Built for couples and planners with taste." body="Testimonials are placed like editorial pull quotes, not generic cards." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure key={item.name} className={`glass rounded-[2rem] p-7 ${index === 1 ? "lg:mt-12" : ""}`}>
              <Gem className="h-6 w-6 text-gold" />
              <blockquote className="mt-6 font-display text-3xl leading-tight text-[var(--color-text)]">"{item.quote}"</blockquote>
              <figcaption className="mt-6 text-sm text-[var(--color-muted)]">{item.name} - {item.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-gold">FAQ</p>
          <h2 className="font-display text-4xl text-[var(--color-text)] md:text-6xl">Questions before ordering.</h2>
        </div>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="glass rounded-[2rem] p-6">
              <h3 className="text-xl font-bold text-[var(--color-text)]">{faq.question}</h3>
              <p className="mt-3 leading-7 text-[var(--color-muted)]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OrderCtaSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="relative mx-auto overflow-hidden rounded-[2.5rem] p-8 md:p-12">
        <Image src="/assets/sunset-venue.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-night/80 via-night/50 to-night/20" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">Begin</p>
          <h2 className="mt-5 font-display text-5xl text-pearl md:text-7xl">Create your invitation brief.</h2>
          <p className="mt-6 text-lg leading-8 text-pearl/70">Tell us the venue, mood, language, package and deadline. We turn it into a launch-ready luxury invitation.</p>
          <Link href="/design" className="mt-8 inline-flex rounded-full bg-pearl px-8 py-4 font-bold text-night transition hover:bg-gold">
            <PenLine className="ml-2 h-5 w-5" />
            Start request
          </Link>
        </div>
      </div>
    </section>
  );
}

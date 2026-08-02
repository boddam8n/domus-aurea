"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, ArrowUpRight, Check, Gem, PenLine } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { comparison, faqs, features, invitationTemplates, processSteps, testimonials, themes } from "@/lib/data";
import { fadeUp, stagger } from "@/components/motion-presets";

export function HeroSection() {
  const { isArabic } = useLanguage();

  return (
    <section className="home-section relative isolate flex min-h-[42rem] w-full max-w-none items-end overflow-hidden px-5 pb-16 pt-32 sm:min-h-[46rem] md:min-h-[100svh] md:px-10 md:pb-24">
      <div className="absolute inset-0">
        <Image
          src="/assets/domus-hero.webp"
          alt="Royal palace wedding ceremony illuminated by candlelight"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night/82 via-night/42 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/20" />
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto w-full max-w-[90rem]">
        <div className="w-full max-w-4xl md:ml-0 md:mr-auto">
          <motion.p variants={fadeUp} className="homepage-eyebrow mb-5 text-[#e1bd72]">
            {isArabic ? "دعوات زفاف فاخرة" : "Luxury wedding invitations"}
          </motion.p>
          <motion.h1 variants={fadeUp} className="brand-display text-[clamp(3.6rem,10vw,8.2rem)] font-medium leading-[0.94] text-[#f7efe2]">
            Domus Aurea
          </motion.h1>
          <motion.p variants={fadeUp} className="brand-display mt-6 max-w-2xl text-[clamp(1.65rem,4vw,2.65rem)] font-medium leading-[1.32] text-[#f7efe2]">
            {isArabic ? "اصنع دعوة زفاف لا تُنسى." : "Craft unforgettable wedding invitations."}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-[#f7efe2]/72 md:text-lg md:leading-9">
            {isArabic
              ? "تجربة راقية لدعوات زفاف رقمية رومانسية، بهوية ملكية وتفاصيل مصممة لتبقى في الذاكرة."
              : "A refined ordering experience for couples who want calm, romantic, premium digital invitations."}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/design" className="luxury-button group rounded-full bg-[#f7efe2] px-7 py-4 font-bold text-night shadow-[0_10px_35px_rgba(222,190,116,.18)]">
              {isArabic ? "ابدأ التصميم" : "Start Designing"}
              <ArrowLeft className="mr-2 inline h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
            <Link href="/templates" className="luxury-button rounded-full border border-[#f7efe2]/30 px-7 py-4 font-bold text-[#f7efe2] hover:border-[#dfbd74] hover:bg-black/20">
              {isArabic ? "شاهد القوالب" : "View Templates"}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const homepageTemplateNames = ["Domus Aurea Invitation", "Vintage Letterpress", "Noir Gold Pocket"];
const homepageTemplates = homepageTemplateNames.flatMap((name) => {
  const template = invitationTemplates.find((item) => item.name === name);
  if (!template) return [];
  return [
    template.name === "Domus Aurea Invitation"
      ? { ...template, image: "/assets/templates/test-invitation-preview.webp" }
      : template
  ];
});

export function WeddingTemplatesShowcase() {
  const { isArabic } = useLanguage();

  return (
    <section className="home-section home-showcase px-4 py-20 sm:px-6 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-7 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-3xl">
            <p className="homepage-eyebrow text-gold">{isArabic ? "مختارات الزفاف" : "Wedding collection"}</p>
            <h2 className="brand-display mt-4 text-[clamp(2.8rem,6vw,5.4rem)] leading-[1.04] text-[var(--color-text)]">
              {isArabic ? "دعوات تبدأ منها الحكاية." : "Invitations worthy of the first impression."}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-muted)] md:text-lg md:leading-9">
              {isArabic
                ? "تفاصيل ورقية فاخرة، أختام أنيقة، وتجارب رقمية مصممة بعناية لتشبه يومكم."
                : "Explore refined paper, seal, and editorial directions crafted to make every invitation feel personal."}
            </p>
          </div>
          <Link
            href="/templates"
            className="luxury-button inline-flex w-fit items-center gap-2 rounded-full border border-gold/35 px-6 py-3.5 font-semibold text-[var(--color-text)] hover:border-gold/65"
          >
            {isArabic ? "استكشف المجموعة" : "Explore the collection"}
            {isArabic ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-[1.22fr_.78fr_.78fr]">
          {homepageTemplates.map((template, index) => (
            <Link
              key={template.name}
              href="/templates"
              className={`home-template-card group relative isolate overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 ${
                index === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              aria-label={isArabic ? `شاهد قالب ${template.nameAr}` : `View ${template.name} template`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? "aspect-[16/11] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
                <Image
                  src={template.image}
                  alt={isArabic ? `معاينة ${template.nameAr}` : `${template.name} wedding invitation preview`}
                  fill
                  sizes={index === 0 ? "(min-width: 1024px) 46vw, (min-width: 768px) 92vw, 92vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 46vw, 92vw"}
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#e1bd72]">
                  {index === 0 ? (isArabic ? "جاهز للتخصيص" : "Ready to personalize") : isArabic ? "اتجاه بصري" : "Visual direction"}
                </span>
                <h3 className="brand-display mt-2 text-3xl leading-tight text-[#fff8ed] sm:text-4xl">
                  {isArabic ? template.nameAr : template.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Features" title="A complete invitation system." body="Guest-ready invitations, RSVP, sharing, music and a protected customer portal." />
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
    <section className="home-section px-4 py-20 sm:px-6 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="homepage-eyebrow mb-4 text-gold">{isArabic ? "خطوات الطلب" : "Ordering flow"}</p>
          <h2 className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.12] text-[var(--color-text)]">
            {isArabic ? "مصممة كموعد خاص داخل دار فاخرة." : "Designed like a private atelier appointment."}
          </h2>
          <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
            {isArabic ? "نرشدك لاختيار القالب والتفاصيل وإطلاق الدعوة من دون تعقيد أو أدوات مشتتة." : "Customers are guided through template, details, and launch without exposing complex backend tools."}
          </p>
        </div>
        <div className="grid gap-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-interactive glass grid gap-5 rounded-[2rem] p-6 md:grid-cols-[auto_1fr]"
            >
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

export function ThemesSection() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Themes" title="Visual directions with editorial restraint." body="Each direction is a starting point for a crafted invitation identity." />
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
    <section className="home-section px-4 py-20 sm:px-6 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Clients" title="Built for couples and planners with taste." body="Testimonials are placed like editorial pull quotes, not generic cards." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`luxury-interactive glass rounded-[2rem] p-7 ${index === 1 ? "lg:mt-12" : ""}`}
            >
              <Gem className="h-6 w-6 text-gold" />
              <blockquote className="brand-display mt-6 text-3xl font-medium leading-[1.3] text-[var(--color-text)]">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm text-[var(--color-muted)]">{item.name} - {item.role}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { isArabic } = useLanguage();

  return (
    <section id="faq" className="home-section px-4 pb-20 pt-16 sm:px-6 md:px-8 md:pb-24 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-gold">FAQ</p>
          <h2 className="font-display text-4xl text-[var(--color-text)] md:text-6xl">Questions before ordering.</h2>
        </div>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.question}
              whileHover={{ x: isArabic ? -2 : 2 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-interactive glass rounded-[2rem] p-6"
            >
              <h3 className="text-xl font-bold text-[var(--color-text)]">{faq.question}</h3>
              <p className="mt-3 leading-7 text-[var(--color-muted)]">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OrderCtaSection() {
  const { isArabic } = useLanguage();

  return (
    <section className="home-section px-4 py-20 sm:px-6 md:px-8 md:py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-7 sm:p-9 md:rounded-[2.5rem] md:p-12">
        <Image src="/assets/sunset-venue.webp" alt="" fill sizes="(min-width: 1280px) 1280px, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-night/80 via-night/50 to-night/20" />
        <div className="relative max-w-3xl">
          <p className="homepage-eyebrow text-gold">{isArabic ? "ابدأ الآن" : "Begin"}</p>
          <h2 className="brand-display mt-5 text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[1.08] text-pearl">
            {isArabic ? "ابدأ تصميم دعوتك الخاصة." : "Create your invitation brief."}
          </h2>
          <p className="mt-6 text-base leading-8 text-pearl/75 md:text-lg">
            {isArabic
              ? "شاركنا المكان والأسلوب واللغة والموعد، ونحوّلها إلى دعوة فاخرة جاهزة للمشاركة."
              : "Tell us the venue, mood, language, and date. We turn them into a launch-ready luxury invitation."}
          </p>
          <Link href="/design" className="luxury-button mt-8 inline-flex rounded-full bg-pearl px-8 py-4 font-bold text-night hover:bg-gold">
            <PenLine className="ml-2 h-5 w-5" />
            {isArabic ? "ابدأ الطلب" : "Start request"}
          </Link>
        </div>
      </div>
    </section>
  );
}

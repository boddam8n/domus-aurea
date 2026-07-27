"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, Gem, PenLine } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { comparison, faqs, features, processSteps, testimonials, themes } from "@/lib/data";
import { fadeUp, stagger } from "@/components/motion-presets";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { PricingPackage } from "@/lib/pricing-types";

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
          <motion.h1 variants={fadeUp} className="brand-display text-6xl font-medium leading-[0.96] text-[#f7efe2] md:text-8xl xl:text-9xl">
            Domus Aurea
          </motion.h1>
          <motion.p variants={fadeUp} className="brand-display mt-6 max-w-2xl text-2xl font-medium leading-[1.35] text-[#f7efe2] md:text-4xl">
            {isArabic ? "اصنع دعوة زفاف لا تُنسى." : "Craft unforgettable wedding invitations."}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-[#f7efe2]/72 md:text-lg md:leading-9">
            {isArabic
              ? "تجربة طلب راقية لدعوات زفاف رقمية رومانسية، بهوية ملكية، رابط عام، RSVP، وعدّاد فاخر."
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
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-gold">{isArabic ? "خطوات الطلب" : "Ordering flow"}</p>
          <h2 className="font-display text-4xl text-[var(--color-text)] md:text-6xl">{isArabic ? "مصممة كموعد خاص داخل دار فاخرة." : "Designed like a private atelier appointment."}</h2>
          <p className="mt-6 text-lg leading-8 text-[var(--color-muted)]">
            {isArabic ? "نرشد العميل لاختيار الباقة والقالب والتفاصيل بدون تعقيد أو أدوات مشتتة." : "Customers are guided through package, template and launch details without exposing backend tools."}
          </p>
        </div>
        <div className="grid gap-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -4 }}
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

function formatPrice(priceMinor: number, currency: string, isArabic: boolean) {
  return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: priceMinor % 100 === 0 ? 0 : 2
  }).format(priceMinor / 100);
}

function formatTokens(amount: number, isArabic: boolean) {
  return new Intl.NumberFormat(isArabic ? "ar-EG" : "en-EG").format(amount);
}

export function PricingSection({ packages: initialPackages }: { packages?: PricingPackage[] }) {
  const { isArabic } = useLanguage();
  const [packages, setPackages] = useState(initialPackages ?? []);
  const [isLoading, setIsLoading] = useState(initialPackages === undefined);

  useEffect(() => {
    if (initialPackages !== undefined) {
      setPackages(initialPackages);
      setIsLoading(false);
      return;
    }

    async function loadPackages() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data } = await supabase
          .from("pricing_packages")
          .select(
            "id, code, name_en, name_ar, token_amount, price_minor, currency, description_en, description_ar, features_en, features_ar, display_order, is_enabled, is_featured"
          )
          .eq("is_enabled", true)
          .order("display_order", { ascending: true });

        setPackages(
          ((data ?? []) as PricingPackage[]).map((item) => ({
            ...item,
            features_en: Array.isArray(item.features_en) ? item.features_en : [],
            features_ar: Array.isArray(item.features_ar) ? item.features_ar : []
          }))
        );
      } catch {
        setPackages([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPackages();
  }, [initialPackages]);

  return (
    <section id="pricing" className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={isArabic ? "رصيد الرموز" : "Token Packages"}
          title={isArabic ? "رصيد إبداعي لكل لحظة تستحق الاحتفال." : "Creative freedom, held in reserve."}
          body={
            isArabic
              ? "اختر رصيد الرموز المناسب، واستخدمه داخل المنصة لإنشاء تجاربك وتخصيصها بالوتيرة التي تناسبك."
              : "Choose a token reserve and spend it across the platform whenever inspiration calls."
          }
        />
        {isLoading ? (
          <div className="mx-auto mt-14 grid max-w-sm place-items-center gap-3 py-10 text-center text-[var(--color-muted)]">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
            <span>{isArabic ? "جاري تحميل باقات الرموز..." : "Loading token packages..."}</span>
          </div>
        ) : packages.length ? (
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((plan) => {
              const featured = plan.is_featured;
              const features = isArabic ? plan.features_ar : plan.features_en;
              return (
                <motion.article
                  key={plan.id}
                  whileHover={{ y: -8, scale: 1.008 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`luxury-interactive relative flex min-h-[33rem] flex-col overflow-hidden rounded-[2rem] p-6 ${
                    featured ? "animated-border bg-[var(--color-text)] text-[var(--color-bg)] shadow-[0_30px_90px_rgba(200,155,70,.18)]" : "glass"
                  }`}
                >
                  {featured ? (
                    <span className="absolute end-5 top-5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                      {isArabic ? "الأكثر اختيارًا" : "Most selected"}
                    </span>
                  ) : null}
                  <p className="max-w-[72%] text-xs font-bold uppercase tracking-[0.18em] text-gold">{isArabic ? plan.name_ar : plan.name_en}</p>
                  <div className="mt-8">
                    <strong className="brand-display block text-6xl font-medium leading-none">{formatTokens(plan.token_amount, isArabic)}</strong>
                    <span className={`mt-2 block text-xs font-bold uppercase tracking-[0.18em] ${featured ? "text-[var(--color-bg)]/58" : "text-[var(--color-faint)]"}`}>
                      {isArabic ? "رمز للمنصة" : "Platform tokens"}
                    </span>
                  </div>
                  <h3 className="brand-display mt-7 text-3xl font-medium">{formatPrice(plan.price_minor, plan.currency, isArabic)}</h3>
                  <p className={`mt-4 min-h-[5.25rem] leading-7 ${featured ? "text-[var(--color-bg)]/70" : "text-[var(--color-muted)]"}`}>
                    {isArabic ? plan.description_ar : plan.description_en}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {features.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />
                    <span>{item}</span>
                  </li>
                ))}
                  </ul>
                  <Link
                    href="/design"
                    className={`luxury-button mt-auto block rounded-full px-6 py-4 text-center font-bold ${
                      featured ? "bg-night text-pearl" : "bg-[var(--color-text)] text-[var(--color-bg)]"
                    }`}
                  >
                    {isArabic ? "اختر الرصيد" : "Choose tokens"}
                  </Link>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="glass mx-auto mt-14 max-w-2xl rounded-[2rem] px-8 py-10 text-center">
            <p className="brand-display text-3xl font-medium text-[var(--color-text)]">
              {isArabic ? "يجري إعداد باقات الرموز بعناية." : "Token packages are being carefully prepared."}
            </p>
            <p className="mt-3 leading-7 text-[var(--color-muted)]">
              {isArabic ? "ستظهر الباقات هنا فور اعتمادها من لوحة الإدارة." : "Approved packages will appear here automatically."}
            </p>
          </div>
        )}
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
    <section className="px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Clients" title="Built for couples and planners with taste." body="Testimonials are placed like editorial pull quotes, not generic cards." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.figure
              key={item.name}
              whileHover={{ y: -5 }}
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
    <section id="faq" className="px-4 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.34em] text-gold">FAQ</p>
          <h2 className="font-display text-4xl text-[var(--color-text)] md:text-6xl">Questions before ordering.</h2>
        </div>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.question}
              whileHover={{ x: isArabic ? -3 : 3 }}
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
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="relative mx-auto overflow-hidden rounded-[2.5rem] p-8 md:p-12">
        <Image src="/assets/sunset-venue.webp" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-night/80 via-night/50 to-night/20" />
        <div className="relative max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.34em] text-gold">Begin</p>
          <h2 className="brand-display mt-5 text-5xl font-medium leading-[1.08] text-pearl md:text-7xl">Create your invitation brief.</h2>
          <p className="mt-6 text-lg leading-8 text-pearl/70">Tell us the venue, mood, language, package and deadline. We turn it into a launch-ready luxury invitation.</p>
          <Link href="/design" className="luxury-button mt-8 inline-flex rounded-full bg-pearl px-8 py-4 font-bold text-night hover:bg-gold">
            <PenLine className="ml-2 h-5 w-5" />
            Start request
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SectionHeading } from "@/components/section-heading";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { PricingPackage } from "@/lib/pricing-types";

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

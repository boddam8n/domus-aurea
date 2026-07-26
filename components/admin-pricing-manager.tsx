"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Check, Coins, Database, Save, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { PricingPackage } from "@/lib/pricing-types";

type EditablePackage = PricingPackage & {
  priceInput: string;
  featuresEnInput: string;
  featuresArInput: string;
};

function toEditable(item: PricingPackage): EditablePackage {
  return {
    ...item,
    priceInput: String(item.price_minor / 100),
    featuresEnInput: item.features_en.join("\n"),
    featuresArInput: item.features_ar.join("\n")
  };
}

function featureLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminPricingManager() {
  const router = useRouter();
  const { isArabic } = useLanguage();
  const clientRef = useRef<SupabaseClient | null>(null);
  const [packages, setPackages] = useState<EditablePackage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "forbidden" | "error">("loading");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadPackages = useCallback(async () => {
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createBrowserSupabaseClient();
      clientRef.current = supabase;
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        router.replace("/auth/sign-in?next=/admin");
        return;
      }

      if (session.user.app_metadata?.role !== "admin") {
        setStatus("forbidden");
        return;
      }

      const { data, error } = await supabase
        .from("pricing_packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      setPackages(((data ?? []) as PricingPackage[]).map(toEditable));
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Pricing packages could not be loaded.");
    }
  }, [router]);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  function updatePackage(id: string, patch: Partial<EditablePackage>) {
    setPackages((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function savePackage(item: EditablePackage) {
    const client = clientRef.current;
    if (!client) return;

    const price = Number(item.priceInput);
    if (!item.name_en.trim() || !item.name_ar.trim() || !Number.isFinite(price) || price < 0 || item.token_amount < 1) {
      setMessage(isArabic ? "راجع الاسم والسعر وعدد الرموز قبل الحفظ." : "Review the name, price, and token amount before saving.");
      return;
    }

    setSavingId(item.id);
    setMessage("");

    const { error } = await client
      .from("pricing_packages")
      .update({
        name_en: item.name_en.trim(),
        name_ar: item.name_ar.trim(),
        token_amount: Math.round(item.token_amount),
        price_minor: Math.round(price * 100),
        currency: item.currency.trim().toUpperCase(),
        description_en: item.description_en.trim(),
        description_ar: item.description_ar.trim(),
        features_en: featureLines(item.featuresEnInput),
        features_ar: featureLines(item.featuresArInput),
        display_order: Math.max(0, Math.round(item.display_order)),
        is_enabled: item.is_enabled,
        is_featured: item.is_featured
      })
      .eq("id", item.id);

    setSavingId("");

    if (error) {
      setMessage(error.message);
      return;
    }

    const featuresEn = featureLines(item.featuresEnInput);
    const featuresAr = featureLines(item.featuresArInput);
    setPackages((current) =>
      current
        .map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                price_minor: Math.round(price * 100),
                features_en: featuresEn,
                features_ar: featuresAr
              }
            : currentItem
        )
        .sort((first, second) => first.display_order - second.display_order)
    );
    setMessage(isArabic ? "تم حفظ الباقة وتحديث عرض الصفحة الرئيسية." : "Package saved. The homepage will use the updated data.");
  }

  if (status === "loading") {
    return (
      <div className="glass rounded-2xl px-6 py-16 text-center">
        <Database className="mx-auto h-8 w-8 animate-pulse text-gold" />
        <p className="mt-4 text-[var(--color-muted)]">{isArabic ? "جاري تحميل باقات الرموز..." : "Loading token packages..."}</p>
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="glass rounded-2xl px-6 py-16 text-center">
        <ShieldAlert className="mx-auto h-9 w-9 text-gold" />
        <h2 className="brand-display mt-5 text-4xl font-medium text-[var(--color-text)]">
          {isArabic ? "هذه المساحة للإدارة فقط" : "Admin access only"}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
          {isArabic ? "الحساب الحالي لا يملك صلاحية إدارة الأسعار." : "The current account does not have pricing-management permission."}
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-6 py-10 text-center text-red-100">
        <p>{message}</p>
        <button type="button" onClick={() => void loadPackages()} className="luxury-button mt-5 rounded-full border border-red-100/20 px-5 py-2.5 font-bold">
          {isArabic ? "إعادة المحاولة" : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{isArabic ? "إدارة الرصيد" : "Token commerce"}</p>
          <h2 className="brand-display mt-3 text-4xl font-medium text-[var(--color-text)] md:text-5xl">
            {isArabic ? "باقات الرموز" : "Token packages"}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--color-muted)]">
            {isArabic
              ? "كل تعديل محفوظ يظهر تلقائيًا في قسم الأسعار بالصفحة الرئيسية. الباقات غير المفعلة تظل مخفية عن الزوار."
              : "Saved changes flow directly to homepage pricing. Disabled packages remain hidden from visitors."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Coins className="h-5 w-5 text-gold" />
          <span>{packages.length} {isArabic ? "باقات" : "packages"}</span>
        </div>
      </div>

      {message ? (
        <div role="status" className="mb-5 flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/[0.07] px-4 py-3 text-sm text-[var(--color-text)]">
          <Check className="h-4 w-4 shrink-0 text-gold" />
          <span>{message}</span>
        </div>
      ) : null}

      <div className="grid gap-5">
        {packages.map((item) => (
          <article key={item.id} className="glass rounded-2xl p-5 md:p-7">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{item.code}</p>
                <h3 className="brand-display mt-2 text-3xl font-medium text-[var(--color-text)]">{isArabic ? item.name_ar : item.name_en}</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                <Toggle
                  label={isArabic ? "مفعلة" : "Enabled"}
                  checked={item.is_enabled}
                  onChange={(checked) => updatePackage(item.id, { is_enabled: checked })}
                />
                <Toggle
                  label={isArabic ? "مميزة" : "Featured"}
                  checked={item.is_featured}
                  onChange={(checked) => updatePackage(item.id, { is_featured: checked })}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field label="English package name">
                <input value={item.name_en} onChange={(event) => updatePackage(item.id, { name_en: event.target.value })} />
              </Field>
              <Field label="اسم الباقة بالعربية" dir="rtl">
                <input value={item.name_ar} onChange={(event) => updatePackage(item.id, { name_ar: event.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-3 lg:col-span-2">
                <Field label={isArabic ? "عدد الرموز" : "Tokens"}>
                  <input type="number" min="1" value={item.token_amount} onChange={(event) => updatePackage(item.id, { token_amount: Number(event.target.value) })} />
                </Field>
                <Field label={isArabic ? "السعر" : "Price"}>
                  <input type="number" min="0" step="0.01" value={item.priceInput} onChange={(event) => updatePackage(item.id, { priceInput: event.target.value })} />
                </Field>
                <Field label={isArabic ? "الترتيب" : "Order"}>
                  <input type="number" min="0" value={item.display_order} onChange={(event) => updatePackage(item.id, { display_order: Number(event.target.value) })} />
                </Field>
              </div>
              <Field label="English description">
                <textarea rows={3} value={item.description_en} onChange={(event) => updatePackage(item.id, { description_en: event.target.value })} />
              </Field>
              <Field label="الوصف بالعربية" dir="rtl">
                <textarea rows={3} value={item.description_ar} onChange={(event) => updatePackage(item.id, { description_ar: event.target.value })} />
              </Field>
              <Field label="English features — one per line">
                <textarea rows={5} value={item.featuresEnInput} onChange={(event) => updatePackage(item.id, { featuresEnInput: event.target.value })} />
              </Field>
              <Field label="المميزات بالعربية — ميزة في كل سطر" dir="rtl">
                <textarea rows={5} value={item.featuresArInput} onChange={(event) => updatePackage(item.id, { featuresArInput: event.target.value })} />
              </Field>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => void savePackage(item)}
                disabled={savingId === item.id}
                className="luxury-button inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-6 py-3 font-bold text-[var(--color-bg)] disabled:cursor-wait disabled:opacity-55"
              >
                <Save className="h-4 w-4" />
                {savingId === item.id ? (isArabic ? "جاري الحفظ..." : "Saving...") : (isArabic ? "حفظ الباقة" : "Save package")}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--color-muted)]">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full border border-white/15 bg-black/20 transition peer-checked:border-gold/50 peer-checked:bg-gold/35 after:absolute after:start-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-[var(--color-text)] after:transition-transform peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
      <span>{label}</span>
    </label>
  );
}

function Field({ label, children, dir }: { label: string; children: React.ReactElement; dir?: "rtl" | "ltr" }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--color-muted)]" dir={dir}>
      <span>{label}</span>
      <span className="admin-pricing-field">{children}</span>
    </label>
  );
}

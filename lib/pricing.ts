import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createAnonSupabaseClient } from "@/lib/supabase/server";
import type { PricingPackage } from "@/lib/pricing-types";

function normalizeFeatures(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export async function getPublicPricingPackages(): Promise<PricingPackage[]> {
  noStore();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  const supabase = createAnonSupabaseClient();
  const { data, error } = await supabase
    .from("pricing_packages")
    .select(
      "id, code, name_en, name_ar, token_amount, price_minor, currency, description_en, description_ar, features_en, features_ar, display_order, is_enabled, is_featured"
    )
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });

  if (error) return [];

  return (data ?? []).map((item) => ({
    ...item,
    features_en: normalizeFeatures(item.features_en),
    features_ar: normalizeFeatures(item.features_ar)
  })) as PricingPackage[];
}

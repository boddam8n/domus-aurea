export type PricingPackage = {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  token_amount: number;
  price_minor: number;
  currency: string;
  description_en: string;
  description_ar: string;
  features_en: string[];
  features_ar: string[];
  display_order: number;
  is_enabled: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
};

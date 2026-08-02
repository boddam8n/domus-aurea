import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApologyExperience } from "@/components/apology/apology-experience";
import { normalizeApologyConfig } from "@/lib/apology-config";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "رسالة اعتذار | Domus Aurea",
  description: "A handcrafted apology experience from Domus Aurea."
};

type PublicApologyPageProps = {
  params: { slug: string };
};

export default async function PublicApologyPage({ params }: PublicApologyPageProps) {
  const service = createServiceSupabaseClient();
  const { data, error } = await service
    .from("apology_experiences")
    .select("config")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !data) notFound();

  return <ApologyExperience initialConfig={normalizeApologyConfig(data.config)} />;
}

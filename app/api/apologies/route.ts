import { NextRequest, NextResponse } from "next/server";
import { apologyRequestSchema } from "@/lib/apology-config";
import { authenticateRequest } from "@/lib/request-auth";
import { createApologySlug } from "@/lib/slug";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) return auth.error;

    const parsed = apologyRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid apology settings.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const slug = createApologySlug();
    const siteUrl = (request.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
    const publicUrl = `${siteUrl}/apology/${slug}`;
    const service = createServiceSupabaseClient();
    const { data, error } = await service
      .from("apology_experiences")
      .insert({
        user_id: auth.user.id,
        slug,
        config: parsed.data.config,
        public_url: publicUrl
      })
      .select("id, slug, public_url, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ experience: data, publicUrl }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}

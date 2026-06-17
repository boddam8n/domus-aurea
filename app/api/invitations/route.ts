import { NextRequest, NextResponse } from "next/server";
import { createInvitationSlug } from "@/lib/slug";
import { createAnonSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";
import { invitationRequestSchema } from "@/lib/validation";

function getToken(request: NextRequest) {
  return request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const authClient = createAnonSupabaseClient(token);
    const { data: userData, error: authError } = await authClient.auth.getUser(token);
    if (authError || !userData.user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const parsed = invitationRequestSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid invitation data.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const slug = createInvitationSlug(parsed.data.brideName, parsed.data.groomName);
    const publicUrl = `${siteUrl.replace(/\/$/, "")}/invitation/${slug}`;
    const service = createServiceSupabaseClient();

    const { data, error } = await service
      .from("invitations")
      .insert({
        user_id: userData.user.id,
        slug,
        bride_name: parsed.data.brideName,
        groom_name: parsed.data.groomName,
        wedding_date: parsed.data.weddingDate,
        venue: parsed.data.venue,
        phone: parsed.data.phone,
        template_name: parsed.data.templateName,
        package_name: parsed.data.packageName,
        countdown_style: parsed.data.countdownStyle,
        music_file_name: parsed.data.musicFileName ?? null,
        public_url: publicUrl
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invitation: data, publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

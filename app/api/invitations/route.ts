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

    const siteUrl = request.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "";
    const slug = createInvitationSlug(parsed.data.brideName, parsed.data.groomName);
    const publicUrl = `${siteUrl.replace(/\/$/, "")}/invitation/${slug}`;
    const service = createServiceSupabaseClient();
    const insertPayload = {
      user_id: userData.user.id,
      slug,
      bride_name: parsed.data.brideName,
      groom_name: parsed.data.groomName,
      wedding_date: parsed.data.weddingDate,
      venue: parsed.data.venue,
      venue_address: parsed.data.venueAddress || null,
      venue_lat: parsed.data.venueLat ?? null,
      venue_lng: parsed.data.venueLng ?? null,
      phone: parsed.data.phone,
      template_name: parsed.data.templateName,
      package_name: parsed.data.packageName,
      countdown_style: parsed.data.countdownStyle,
      music_file_name: parsed.data.musicFileName ?? null,
      seal_image_url: parsed.data.sealImageUrl || null,
      public_url: publicUrl
    };

    const { data, error } = await service
      .from("invitations")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      const isOptionalMigrationMissing = /venue_(address|lat|lng)|seal_image_url|column .* does not exist/i.test(error.message);

      if (!isOptionalMigrationMissing) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { venue_address, venue_lat, venue_lng, seal_image_url, ...legacyPayload } = insertPayload;
      const retry = await service.from("invitations").insert(legacyPayload).select("*").single();
      if (retry.error) {
        return NextResponse.json({ error: retry.error.message }, { status: 500 });
      }

      return NextResponse.json({
        invitation: retry.data,
        publicUrl,
        warning: "Invitation was created before all optional invitation columns were available."
      });
    }

    return NextResponse.json({ invitation: data, publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

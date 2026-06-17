import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/validation";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const parsed = rsvpSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid RSVP data.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const service = createServiceSupabaseClient();
    const { data: invitation } = await service.from("invitations").select("id").eq("slug", params.slug).single();
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    }

    const existing = request.cookies.get(`domus_rsvp_${params.slug}`)?.value;
    if (existing) {
      return NextResponse.json({ error: "This device already submitted an RSVP." }, { status: 409 });
    }

    const deviceId = crypto.randomUUID();
    const { error } = await service.from("guest_responses").insert({
      invitation_id: invitation.id,
      guest_name: parsed.data.guestName,
      response: parsed.data.response,
      device_id: deviceId
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: error.code === "23505" ? 409 : 500 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(`domus_rsvp_${params.slug}`, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

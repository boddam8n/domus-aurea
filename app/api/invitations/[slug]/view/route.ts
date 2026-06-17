import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const service = createServiceSupabaseClient();
    const { data: invitation } = await service.from("invitations").select("id").eq("slug", params.slug).single();
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found." }, { status: 404 });
    }

    const existing = request.cookies.get("domus_visitor_id")?.value;
    const visitorId = existing || crypto.randomUUID();
    await service.from("invitation_analytics").insert({
      invitation_id: invitation.id,
      visitor_id: visitorId,
      event_type: "view"
    });

    const response = NextResponse.json({ ok: true });
    if (!existing) {
      response.cookies.set("domus_visitor_id", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365
      });
    }
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

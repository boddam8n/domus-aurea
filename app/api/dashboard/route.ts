import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/request-auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) return auth.error;

    const service = createServiceSupabaseClient();
    const { data: invitations, error } = await service
      .from("invitations")
      .select("*, guest_responses(id, guest_name, response, created_at), invitation_analytics(visitor_id, event_type)")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const enriched = (invitations ?? []).map((invitation) => {
      const responses = invitation.guest_responses ?? [];
      const analytics = invitation.invitation_analytics ?? [];
      const views = analytics.filter((item: { event_type: string }) => item.event_type === "view");
      return {
        ...invitation,
        guest_responses: responses,
        total_views: views.length,
        unique_visitors: new Set(views.map((item: { visitor_id: string }) => item.visitor_id)).size,
        accepted_guests: responses.filter((item: { response: string }) => item.response === "accepted").length,
        declined_guests: responses.filter((item: { response: string }) => item.response === "declined").length
      };
    });

    return NextResponse.json({ invitations: enriched });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error." }, { status: 500 });
  }
}

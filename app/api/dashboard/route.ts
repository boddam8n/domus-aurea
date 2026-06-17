import { NextRequest, NextResponse } from "next/server";
import { createAnonSupabaseClient, createServiceSupabaseClient } from "@/lib/supabase/server";

function getToken(request: NextRequest) {
  return request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
}

export async function GET(request: NextRequest) {
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

    const service = createServiceSupabaseClient();
    const { data: invitations, error } = await service
      .from("invitations")
      .select("*, guest_responses(id, guest_name, response, created_at), invitation_analytics(visitor_id, event_type)")
      .eq("user_id", userData.user.id)
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

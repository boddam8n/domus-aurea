import type { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createAnonSupabaseClient } from "@/lib/supabase/server";

type RequestAuthResult =
  | { user: User; error: null }
  | { user: null; error: NextResponse };

export async function authenticateRequest(request: NextRequest): Promise<RequestAuthResult> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return {
      user: null,
      error: NextResponse.json({ error: "Authentication required." }, { status: 401 })
    };
  }

  const authClient = createAnonSupabaseClient(token);
  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Invalid session." }, { status: 401 })
    };
  }

  return { user: data.user, error: null };
}

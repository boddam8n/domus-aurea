import { notFound } from "next/navigation";
import { InvitationExperience } from "@/components/invitation-experience";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { PublicInvitation } from "@/lib/invitations";

export const dynamic = "force-dynamic";

function getDemoInvitation(slug: string): PublicInvitation | null {
  if (slug !== "test-invitation" && slug !== "layan-yassin") return null;

  const isTest = slug === "test-invitation";

  return {
    id: "demo",
    slug,
    bride_name: isTest ? "?????" : "????",
    groom_name: isTest ? "????" : "?????",
    wedding_date: "2026-12-12T20:00:00+02:00",
    venue: isTest ? "???? ????? ?????" : "??? ?????? - ???????",
    venue_address: isTest ? "???? ???????? ???? ???????? ???" : null,
    venue_lat: null,
    venue_lng: null,
    template_name: "Domus Aurea Invitation",
    package_name: "Royal Package",
    countdown_style: "Old Money",
    music_file_name: "wedding-music.mp3",
    public_url: null,
    invitation_text: null,
    seal_image_url: null
  };
}

export default async function InvitationPage({ params }: { params: { slug: string } }) {
  let invitation: PublicInvitation | null = null;

  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("invitations")
      .select(
        "id, slug, bride_name, groom_name, wedding_date, venue, venue_address, venue_lat, venue_lng, template_name, package_name, countdown_style, music_file_name, seal_image_url, public_url, invitation_text"
      )
      .eq("slug", params.slug)
      .single();

    if (error && /venue_(address|lat|lng)|seal_image_url|invitation_text|column .* does not exist/i.test(error.message)) {
      const legacy = await supabase
        .from("invitations")
        .select("id, slug, bride_name, groom_name, wedding_date, venue, template_name, package_name, countdown_style, music_file_name, public_url")
        .eq("slug", params.slug)
        .single();
      invitation = legacy.data;
    } else {
      invitation = data;
    }
  } catch {
    invitation = getDemoInvitation(params.slug);
  }

  invitation = invitation ?? getDemoInvitation(params.slug);

  if (!invitation) notFound();

  return <InvitationExperience invitation={invitation} />;
}

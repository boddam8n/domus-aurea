import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { InvitationExperience } from "@/components/invitation-experience";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import type { PublicInvitation } from "@/lib/invitations";

export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: { slug: string } }) {
  let invitation: PublicInvitation | null = null;

  try {
    const supabase = createServiceSupabaseClient();
    const { data } = await supabase
      .from("invitations")
      .select("id, slug, bride_name, groom_name, wedding_date, venue, template_name, package_name, countdown_style, music_file_name, public_url")
      .eq("slug", params.slug)
      .single();
    invitation = data;
  } catch {
    if (params.slug === "layan-yassin") {
      invitation = {
        id: "demo",
        slug: "layan-yassin",
        bride_name: "ليان",
        groom_name: "ياسين",
        wedding_date: "2026-12-12T20:00:00+02:00",
        venue: "قصر الزمرد - القاهرة",
        template_name: "Emerald Velvet",
        package_name: "Royal Package",
        countdown_style: "Luxury Gold",
        music_file_name: "wedding-music.mp3",
        public_url: null
      };
    }
  }

  if (!invitation) notFound();

  return (
    <PageShell>
      <InvitationExperience invitation={invitation} />
    </PageShell>
  );
}

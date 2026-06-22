export type PublicInvitation = {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue: string;
  template_name: string;
  package_name: string;
  countdown_style: string;
  music_file_name: string | null;
  public_url: string | null;
  invitation_text?: string | null;
};

export type DashboardInvitation = PublicInvitation & {
  created_at: string;
  total_views: number;
  unique_visitors: number;
  accepted_guests: number;
  declined_guests: number;
  guest_responses: Array<{
    id: string;
    guest_name: string;
    response: "accepted" | "declined";
    created_at: string;
  }>;
};

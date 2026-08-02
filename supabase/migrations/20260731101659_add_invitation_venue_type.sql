alter table public.invitations
  add column if not exists venue_type text;

create index if not exists invitations_venue_type_idx
  on public.invitations(venue_type);

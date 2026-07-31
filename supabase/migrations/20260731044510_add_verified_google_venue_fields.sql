alter table public.invitations
  add column if not exists venue_place_id text,
  add column if not exists venue_maps_url text;

create index if not exists invitations_venue_place_id_idx
  on public.invitations(venue_place_id);

alter table public.invitations
  drop constraint if exists invitations_google_maps_url_check;

alter table public.invitations
  add constraint invitations_google_maps_url_check
  check (
    venue_maps_url is null
    or venue_maps_url ~ '^https://(www\.)?(google\.[^/]+/maps|maps\.google\.[^/]+)/'
  )
  not valid;

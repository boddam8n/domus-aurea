create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  studio_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  bride_name text not null,
  groom_name text not null,
  wedding_date text not null,
  venue text not null,
  venue_address text,
  venue_lat double precision,
  venue_lng double precision,
  phone text not null,
  template_name text not null,
  package_name text not null,
  countdown_style text not null,
  music_file_name text,
  seal_image_url text,
  public_url text,
  created_at timestamptz not null default now()
);

alter table if exists public.invitations add column if not exists venue_address text;
alter table if exists public.invitations add column if not exists venue_lat double precision;
alter table if exists public.invitations add column if not exists venue_lng double precision;
alter table if exists public.invitations add column if not exists seal_image_url text;

create table if not exists public.guest_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  response text not null check (response in ('accepted', 'declined')),
  device_id text not null,
  created_at timestamptz not null default now(),
  unique(invitation_id, device_id)
);

create table if not exists public.invitation_analytics (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  visitor_id text not null,
  event_type text not null check (event_type in ('view')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.guest_responses enable row level security;
alter table public.invitation_analytics enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create policy "invitations_select_own" on public.invitations for select using (auth.uid() = user_id);
create policy "invitations_insert_own" on public.invitations for insert with check (auth.uid() = user_id);
create policy "invitations_update_own" on public.invitations for update using (auth.uid() = user_id);

create index if not exists invitations_user_id_idx on public.invitations(user_id);
create index if not exists invitations_slug_idx on public.invitations(slug);
create index if not exists guest_responses_invitation_id_idx on public.guest_responses(invitation_id);
create index if not exists invitation_analytics_invitation_id_idx on public.invitation_analytics(invitation_id);
create index if not exists invitation_analytics_visitor_idx on public.invitation_analytics(invitation_id, visitor_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, studio_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'studio_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

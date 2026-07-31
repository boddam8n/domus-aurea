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
  venue_place_id text,
  venue_maps_url text,
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
alter table if exists public.invitations add column if not exists venue_place_id text;
alter table if exists public.invitations add column if not exists venue_maps_url text;
alter table if exists public.invitations add column if not exists seal_image_url text;

create index if not exists invitations_venue_place_id_idx on public.invitations(venue_place_id);

alter table public.invitations
  drop constraint if exists invitations_google_maps_url_check;

alter table public.invitations
  add constraint invitations_google_maps_url_check
  check (
    venue_maps_url is null
    or venue_maps_url ~ '^https://(www\.)?(google\.[^/]+/maps|maps\.google\.[^/]+)/'
  )
  not valid;

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

create table if not exists public.pricing_packages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_en text not null,
  name_ar text not null,
  token_amount integer not null check (token_amount > 0),
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'EGP' check (char_length(currency) = 3),
  description_en text not null default '',
  description_ar text not null default '',
  features_en jsonb not null default '[]'::jsonb check (jsonb_typeof(features_en) = 'array'),
  features_ar jsonb not null default '[]'::jsonb check (jsonb_typeof(features_ar) = 'array'),
  display_order integer not null default 0 check (display_order >= 0),
  is_enabled boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_packages enable row level security;

drop policy if exists "pricing_packages_public_read" on public.pricing_packages;
create policy "pricing_packages_public_read"
on public.pricing_packages
for select
using (
  is_enabled = true
  or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
);

drop policy if exists "pricing_packages_admin_insert" on public.pricing_packages;
create policy "pricing_packages_admin_insert"
on public.pricing_packages
for insert
to authenticated
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

drop policy if exists "pricing_packages_admin_update" on public.pricing_packages;
create policy "pricing_packages_admin_update"
on public.pricing_packages
for update
to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

drop policy if exists "pricing_packages_admin_delete" on public.pricing_packages;
create policy "pricing_packages_admin_delete"
on public.pricing_packages
for delete
to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

grant select on public.pricing_packages to anon, authenticated;
grant insert, update, delete on public.pricing_packages to authenticated;

create index if not exists pricing_packages_public_order_idx
on public.pricing_packages(is_enabled, display_order);

create or replace function public.set_pricing_package_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists pricing_packages_set_updated_at on public.pricing_packages;
create trigger pricing_packages_set_updated_at
before update on public.pricing_packages
for each row execute procedure public.set_pricing_package_updated_at();

insert into public.pricing_packages (
  code,
  name_en,
  name_ar,
  token_amount,
  price_minor,
  currency,
  description_en,
  description_ar,
  features_en,
  features_ar,
  display_order,
  is_enabled,
  is_featured
)
values
  (
    'starter',
    'Starter Tokens',
    'رموز البداية',
    100,
    14900,
    'EGP',
    'A refined first balance for exploring the Domus Aurea creative studio.',
    'رصيد أنيق للبدء واستكشاف أدوات الإبداع داخل دوموس أوريا.',
    '["100 platform tokens", "Ideal for a first creation", "Tokens never expire"]'::jsonb,
    '["١٠٠ رمز للمنصة", "مثالية لأول تجربة", "الرموز لا تنتهي صلاحيتها"]'::jsonb,
    1,
    true,
    false
  ),
  (
    'creator',
    'Creator Tokens',
    'رموز المبدع',
    300,
    34900,
    'EGP',
    'More creative freedom for personalizing several meaningful moments.',
    'مساحة أوسع لتخصيص أكثر من لحظة مميزة بحرية ومرونة.',
    '["300 platform tokens", "Better value per token", "Made for active creators"]'::jsonb,
    '["٣٠٠ رمز للمنصة", "قيمة أفضل لكل رمز", "مصممة للمبدعين النشطين"]'::jsonb,
    2,
    true,
    false
  ),
  (
    'premium',
    'Premium Tokens',
    'الرموز المميزة',
    750,
    69900,
    'EGP',
    'A generous balance for richer customization and premium creative choices.',
    'رصيد سخي لتخصيص أعمق واختيارات إبداعية أكثر تميزًا.',
    '["750 platform tokens", "Premium token value", "Best for multiple creations", "Priority token support"]'::jsonb,
    '["٧٥٠ رمزًا للمنصة", "قيمة مميزة للرموز", "مثالية لعدة تصاميم", "دعم أولوية للرصيد"]'::jsonb,
    3,
    true,
    true
  ),
  (
    'royal',
    'Royal Tokens',
    'الرموز الملكية',
    1600,
    129900,
    'EGP',
    'The signature reserve for studios, planners, and ambitious celebrations.',
    'الرصيد الأرقى للاستوديوهات ومنظمي المناسبات والاحتفالات الاستثنائية.',
    '["1,600 platform tokens", "Highest token value", "Built for ongoing creation", "Royal priority support"]'::jsonb,
    '["١٦٠٠ رمز للمنصة", "أعلى قيمة للرموز", "مصممة للاستخدام المستمر", "دعم ملكي بأولوية"]'::jsonb,
    4,
    true,
    false
  )
on conflict (code) do nothing;

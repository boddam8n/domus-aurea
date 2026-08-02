create table if not exists public.apology_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  public_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apology_experiences enable row level security;

drop policy if exists "apology_experiences_select_own" on public.apology_experiences;
create policy "apology_experiences_select_own"
on public.apology_experiences for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "apology_experiences_insert_own" on public.apology_experiences;
create policy "apology_experiences_insert_own"
on public.apology_experiences for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "apology_experiences_update_own" on public.apology_experiences;
create policy "apology_experiences_update_own"
on public.apology_experiences for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "apology_experiences_delete_own" on public.apology_experiences;
create policy "apology_experiences_delete_own"
on public.apology_experiences for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.apology_experiences to authenticated;

create index if not exists apology_experiences_user_id_idx on public.apology_experiences(user_id);
create index if not exists apology_experiences_slug_idx on public.apology_experiences(slug);

create or replace function public.set_apology_experience_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists apology_experiences_set_updated_at on public.apology_experiences;
create trigger apology_experiences_set_updated_at
before update on public.apology_experiences
for each row execute procedure public.set_apology_experience_updated_at();

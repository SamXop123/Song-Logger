create extension if not exists pgcrypto;

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  song_name text not null,
  date timestamptz not null,
  labels text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists songs_user_date_idx
  on public.songs (user_id, date desc);

alter table public.songs enable row level security;

drop policy if exists "Users can read their own songs" on public.songs;
create policy "Users can read their own songs"
  on public.songs
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own songs" on public.songs;
create policy "Users can insert their own songs"
  on public.songs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own songs" on public.songs;
create policy "Users can update their own songs"
  on public.songs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own songs" on public.songs;
create policy "Users can delete their own songs"
  on public.songs
  for delete
  to authenticated
  using (auth.uid() = user_id);

create table if not exists public.special_songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('month', 'year')),
  song_name text not null,
  year integer not null,
  month text,
  date_added timestamptz not null default timezone('utc', now())
);

create index if not exists special_songs_user_date_idx
  on public.special_songs (user_id, date_added desc);

alter table public.special_songs enable row level security;

drop policy if exists "Users can read their own special songs" on public.special_songs;
create policy "Users can read their own special songs"
  on public.special_songs
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own special songs" on public.special_songs;
create policy "Users can insert their own special songs"
  on public.special_songs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own special songs" on public.special_songs;
create policy "Users can update their own special songs"
  on public.special_songs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own special songs" on public.special_songs;
create policy "Users can delete their own special songs"
  on public.special_songs
  for delete
  to authenticated
  using (auth.uid() = user_id);

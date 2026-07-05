-- Malayaan Photography — initial schema
-- Run inside Supabase SQL editor (or `supabase db push`).

create extension if not exists "pgcrypto";

-- ENUMS -----------------------------------------------------------
do $$ begin
  create type progress_stage as enum (
    'booking_confirmed',
    'shoot_completed',
    'photo_selection',
    'editing',
    'color_grading',
    'album_design',
    'client_review',
    'final_delivery'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type deliverable_status as enum ('pending', 'in_progress', 'completed');
exception when duplicate_object then null; end $$;

-- BOOKINGS --------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text unique not null,
  tracking_number text unique not null,

  client_name text not null,
  client_email text,
  client_phone text,

  event_type text not null,
  shoot_date date not null,
  booking_date date not null default current_date,
  expected_delivery_date date not null,

  current_stage progress_stage not null default 'booking_confirmed',

  edited_photos int not null default 0,
  total_photos int not null default 0,
  album_progress int not null default 0,
  video_progress int not null default 0,

  deliverables jsonb not null default jsonb_build_object(
    'raw_photos','pending',
    'edited_photos','pending',
    'album_design','pending',
    'wedding_trailer','pending',
    'cinematic_film','pending'
  ),

  admin_notes text,
  download_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_tracking_idx on public.bookings(tracking_number);
create index if not exists bookings_booking_id_idx on public.bookings(booking_id);

-- UPDATES TIMELINE -----------------------------------------------
create table if not exists public.booking_updates (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists booking_updates_booking_idx on public.booking_updates(booking_id, created_at desc);

-- ENQUIRIES -------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  service text,
  event_date date,
  message text,
  created_at timestamptz not null default now()
);

-- ADMINS ----------------------------------------------------------
-- Admin access is granted to specific Supabase auth users via this table.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- RLS -------------------------------------------------------------
alter table public.bookings enable row level security;
alter table public.booking_updates enable row level security;
alter table public.enquiries enable row level security;
alter table public.admins enable row level security;

-- Public can look up a booking by tracking_number + booking_id (handled via
-- a security-definer function below; no direct read access).
drop policy if exists "no public access bookings" on public.bookings;
create policy "no public access bookings" on public.bookings
  for all using (false);

drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings" on public.bookings
  for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins manage updates" on public.booking_updates;
create policy "admins manage updates" on public.booking_updates
  for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Allow anonymous inserts into enquiries (contact form):
drop policy if exists "anyone can submit enquiry" on public.enquiries;
create policy "anyone can submit enquiry" on public.enquiries
  for insert with check (true);

drop policy if exists "admins read themselves" on public.admins;
create policy "admins read themselves" on public.admins
  for select using (user_id = auth.uid());

-- Public tracking lookup (security-definer) ----------------------
create or replace function public.lookup_booking(
  p_booking_id text,
  p_tracking_number text
) returns table (
  booking_id text,
  tracking_number text,
  client_name text,
  client_email text,
  client_phone text,
  event_type text,
  shoot_date date,
  booking_date date,
  expected_delivery_date date,
  current_stage progress_stage,
  edited_photos int,
  total_photos int,
  album_progress int,
  video_progress int,
  deliverables jsonb,
  download_url text,
  updates jsonb
)
language sql security definer set search_path = public as $$
  select
    b.booking_id, b.tracking_number, b.client_name, b.client_email, b.client_phone,
    b.event_type, b.shoot_date, b.booking_date, b.expected_delivery_date,
    b.current_stage, b.edited_photos, b.total_photos, b.album_progress, b.video_progress,
    b.deliverables, b.download_url,
    coalesce(
      (select jsonb_agg(jsonb_build_object('date', u.created_at, 'note', u.note) order by u.created_at desc)
         from public.booking_updates u where u.booking_id = b.id), '[]'::jsonb
    ) as updates
  from public.bookings b
  where b.booking_id = p_booking_id and b.tracking_number = p_tracking_number
  limit 1;
$$;

grant execute on function public.lookup_booking(text, text) to anon, authenticated;

-- Public tracking lookup by tracking number + phone -------------
create or replace function public.lookup_booking_by_phone(
  p_tracking_number text,
  p_phone text
) returns table (
  booking_id text,
  tracking_number text,
  client_name text,
  client_email text,
  client_phone text,
  event_type text,
  shoot_date date,
  booking_date date,
  expected_delivery_date date,
  current_stage progress_stage,
  edited_photos int,
  total_photos int,
  album_progress int,
  video_progress int,
  deliverables jsonb,
  download_url text,
  updates jsonb
)
language sql security definer set search_path = public as $$
  select
    b.booking_id, b.tracking_number, b.client_name, b.client_email, b.client_phone,
    b.event_type, b.shoot_date, b.booking_date, b.expected_delivery_date,
    b.current_stage, b.edited_photos, b.total_photos, b.album_progress, b.video_progress,
    b.deliverables, b.download_url,
    coalesce(
      (select jsonb_agg(jsonb_build_object('date', u.created_at, 'note', u.note) order by u.created_at desc)
         from public.booking_updates u where u.booking_id = b.id), '[]'::jsonb
    ) as updates
  from public.bookings b
  where b.tracking_number = p_tracking_number
    and regexp_replace(coalesce(b.client_phone, ''), '[\s\-\(\)\+]', '', 'g') = p_phone
  limit 1;
$$;

grant execute on function public.lookup_booking_by_phone(text, text) to anon, authenticated;

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled story',
  category text not null default 'Weddings',
  image_path text not null unique,
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists gallery_images_created_at_idx on public.gallery_images(created_at desc);
alter table public.gallery_images enable row level security;

drop policy if exists "public read gallery images" on public.gallery_images;
create policy "public read gallery images" on public.gallery_images for select using (true);
drop policy if exists "admins manage gallery images" on public.gallery_images;
create policy "admins manage gallery images" on public.gallery_images for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

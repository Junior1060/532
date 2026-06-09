-- ============================================================================
-- 532 — Google Places importer migration
-- Run in the Supabase SQL editor AFTER schema.sql + rls.sql.
-- Adds location/identity columns to businesses + an admin import log.
-- Safe to re-run (idempotent).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- BUSINESSES — location + Google Places identity columns
-- ---------------------------------------------------------------------------
alter table public.businesses add column if not exists google_place_id text;
alter table public.businesses add column if not exists latitude double precision;
alter table public.businesses add column if not exists longitude double precision;
alter table public.businesses add column if not exists google_maps_url text;
alter table public.businesses add column if not exists source text not null default 'manual';
alter table public.businesses add column if not exists imported_at timestamptz;
alter table public.businesses add column if not exists anchor_label text;
alter table public.businesses add column if not exists distance_from_anchor_km numeric(5,1);

-- Google Place ID is the unique identity for imported businesses (dedupe key).
-- Partial unique index allows many manual rows with NULL place id.
create unique index if not exists businesses_google_place_id_key
  on public.businesses(google_place_id)
  where google_place_id is not null;

-- ---------------------------------------------------------------------------
-- IMPORT LOGS — one row per admin import run
-- ---------------------------------------------------------------------------
create table if not exists public.import_logs (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references public.profiles(id) on delete set null,
  city_slug text,
  anchor_label text,
  anchor_lat double precision,
  anchor_lng double precision,
  categories text[] default '{}',
  radius_m int,
  fetched_count int default 0,
  imported_count int default 0,
  updated_count int default 0,
  skipped_count int default 0,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists import_logs_created_idx on public.import_logs(created_at desc);

alter table public.import_logs enable row level security;

-- Admins only (reuses public.is_admin() from rls.sql).
drop policy if exists "import logs admin read" on public.import_logs;
create policy "import logs admin read" on public.import_logs
  for select using (public.is_admin());

drop policy if exists "import logs admin insert" on public.import_logs;
create policy "import logs admin insert" on public.import_logs
  for insert with check (public.is_admin());

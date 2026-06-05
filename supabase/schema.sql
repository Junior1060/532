-- ============================================================================
-- 532 — Database schema for Supabase / PostgreSQL
-- World Cup 2026 city concierge & fan services platform
-- Run in the Supabase SQL editor (or `supabase db push`).
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------------
do $$ begin
  create type verification_status as enum ('pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_tier as enum ('starter', 'featured', 'premium', 'enterprise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('fan', 'business', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('pending', 'published', 'removed');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- PROFILES  (extends auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role user_role not null default 'fan',
  home_country text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CITIES
-- ---------------------------------------------------------------------------
create table if not exists public.cities (
  slug text primary key,
  name text not null,
  country text not null,
  country_code text not null,
  flag text,
  tagline text,
  overview text,
  stadium_name text,
  stadium_capacity int,
  stadium_neighborhood text,
  match_count int default 0,
  timezone text,
  currency text,
  language text,
  lat double precision,
  lng double precision,
  data jsonb default '{}'::jsonb,   -- transport, fan_zones, safety, scams, weather, attractions, emergency
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MATCHES
-- ---------------------------------------------------------------------------
create table if not exists public.matches (
  id text primary key,
  city_slug text not null references public.cities(slug) on delete cascade,
  match_date timestamptz not null,
  stage text not null,
  home text not null,
  away text not null,
  kickoff_local text
);
create index if not exists matches_city_idx on public.matches(city_slug);
create index if not exists matches_date_idx on public.matches(match_date);

-- ---------------------------------------------------------------------------
-- BUSINESSES
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  name text not null,
  category text not null,
  city_slug text references public.cities(slug) on delete set null,
  description text,
  contact_name text,
  address text,
  website text,
  phone text,
  email text,
  whatsapp text,
  hours text,
  verification verification_status not null default 'pending',
  plan plan_tier not null default 'starter',
  featured boolean not null default false,
  rating numeric(2,1) default 0,
  review_count int default 0,
  price_level smallint default 2,
  distance_from_stadium_km numeric(4,1),
  tags text[] default '{}',
  logo_url text,
  photos text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists businesses_city_idx on public.businesses(city_slug);
create index if not exists businesses_category_idx on public.businesses(category);
create index if not exists businesses_verification_idx on public.businesses(verification);

-- ---------------------------------------------------------------------------
-- REVIEWS
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  rating smallint not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_business_idx on public.reviews(business_id);

-- ---------------------------------------------------------------------------
-- FAN HUBS
-- ---------------------------------------------------------------------------
create table if not exists public.fan_hubs (
  slug text primary key,
  country text not null,
  flag text,
  city_slug text references public.cities(slug) on delete cascade,
  members int default 0,
  description text,
  vibe text,
  next_watch_party jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.fan_hub_members (
  hub_slug text references public.fan_hubs(slug) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (hub_slug, user_id)
);

-- ---------------------------------------------------------------------------
-- BOOKINGS
-- ---------------------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  status text not null default 'requested',
  scheduled_for timestamptz,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists bookings_business_idx on public.bookings(business_id);
create index if not exists bookings_user_idx on public.bookings(user_id);

-- ---------------------------------------------------------------------------
-- SUBSCRIPTIONS  (Stripe)
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  plan plan_tier not null default 'starter',
  status subscription_status not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists subscriptions_owner_idx on public.subscriptions(owner_id);

-- ---------------------------------------------------------------------------
-- ALERTS  (city / match-day broadcasts)
-- ---------------------------------------------------------------------------
create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  city_slug text references public.cities(slug) on delete cascade,
  level text not null default 'info',   -- info | warning | critical
  message text not null,
  active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists alerts_city_active_idx on public.alerts(city_slug, active);

-- ---------------------------------------------------------------------------
-- GUIDES  (editorial / city how-tos)
-- ---------------------------------------------------------------------------
create table if not exists public.guides (
  slug text primary key,
  city_slug text references public.cities(slug) on delete cascade,
  title text not null,
  body text,
  cover_url text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- COMMUNITY POSTS
-- ---------------------------------------------------------------------------
create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references public.profiles(id) on delete set null,
  city_slug text references public.cities(slug) on delete set null,
  type text not null default 'Tip',
  title text not null,
  body text not null,
  upvotes int not null default 0,
  status post_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists posts_status_idx on public.community_posts(status);

-- ---------------------------------------------------------------------------
-- updated_at trigger for businesses
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_touch on public.businesses;
create trigger businesses_touch before update on public.businesses
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- auto-create a profile when a user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- helper: is current user an admin?
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

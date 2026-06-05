-- ============================================================================
-- 532 — Row Level Security policies
-- Run AFTER schema.sql.
-- ============================================================================

-- Enable RLS everywhere
alter table public.profiles         enable row level security;
alter table public.cities           enable row level security;
alter table public.matches          enable row level security;
alter table public.businesses       enable row level security;
alter table public.reviews          enable row level security;
alter table public.fan_hubs         enable row level security;
alter table public.fan_hub_members  enable row level security;
alter table public.bookings         enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.alerts           enable row level security;
alter table public.guides           enable row level security;
alter table public.community_posts  enable row level security;

-- ---------------------------------------------------------------------------
-- PUBLIC, READ-ONLY reference data (cities, matches, fan hubs)
-- ---------------------------------------------------------------------------
create policy "cities are public"  on public.cities   for select using (true);
create policy "matches are public" on public.matches  for select using (true);
create policy "hubs are public"    on public.fan_hubs for select using (true);
create policy "guides public read" on public.guides   for select using (published or public.is_admin());

create policy "admin manage cities"  on public.cities   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage matches" on public.matches  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage hubs"    on public.fan_hubs for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage guides"  on public.guides   for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- PROFILES — users manage their own; admins see all
-- ---------------------------------------------------------------------------
create policy "profiles self read"   on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles self update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- BUSINESSES — verified listings are public; owners manage their own; admins moderate
-- ---------------------------------------------------------------------------
create policy "verified businesses public"
  on public.businesses for select
  using (verification = 'verified' or owner_id = auth.uid() or public.is_admin());

create policy "owner insert business"
  on public.businesses for insert
  with check (owner_id = auth.uid());

create policy "owner update business"
  on public.businesses for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

create policy "admin delete business"
  on public.businesses for delete using (public.is_admin());

-- ---------------------------------------------------------------------------
-- REVIEWS — public read; authenticated users write their own
-- ---------------------------------------------------------------------------
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews own insert"  on public.reviews for insert with check (auth.uid() = author_id);
create policy "reviews own update"  on public.reviews for update using (auth.uid() = author_id);
create policy "reviews own/admin delete" on public.reviews for delete using (auth.uid() = author_id or public.is_admin());

-- ---------------------------------------------------------------------------
-- FAN HUB MEMBERSHIP — users manage their own membership
-- ---------------------------------------------------------------------------
create policy "members read"   on public.fan_hub_members for select using (auth.uid() = user_id or public.is_admin());
create policy "members join"    on public.fan_hub_members for insert with check (auth.uid() = user_id);
create policy "members leave"   on public.fan_hub_members for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- BOOKINGS — visible to the booking user and the business owner
-- ---------------------------------------------------------------------------
create policy "bookings read"
  on public.bookings for select
  using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );
create policy "bookings create" on public.bookings for insert with check (user_id = auth.uid());
create policy "bookings update"
  on public.bookings for update
  using (
    user_id = auth.uid()
    or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- SUBSCRIPTIONS — owner reads their own; writes via service role / webhook
-- ---------------------------------------------------------------------------
create policy "subs owner read" on public.subscriptions for select using (owner_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- ALERTS — public read of active alerts; admins manage
-- ---------------------------------------------------------------------------
create policy "alerts public read" on public.alerts for select using (active or public.is_admin());
create policy "alerts admin manage" on public.alerts for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- COMMUNITY POSTS — published are public; authors see/manage their own; admins moderate
-- ---------------------------------------------------------------------------
create policy "posts public read"
  on public.community_posts for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());
create policy "posts create" on public.community_posts for insert with check (auth.uid() = author_id);
create policy "posts author update" on public.community_posts for update using (author_id = auth.uid() or public.is_admin());
create policy "posts moderate delete" on public.community_posts for delete using (author_id = auth.uid() or public.is_admin());

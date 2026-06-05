# 532 — Your World Cup City Assistant

**The unofficial operating system for the 2026 FIFA World Cup.** A premium, dark, mobile-first
city-intelligence and fan-services platform covering all 16 host cities across Canada, the USA, and
Mexico — transport, food, fan zones, trusted local services, and real-time match-day guidance.

> Built like a blend of Airbnb, Google Maps, Citymapper, and a luxury football concierge — with a
> live "command center" feel and an AI concierge that **never hallucinates** (answers only from
> verified internal data).

---

## ✨ Features

- **Homepage** — animated globe/grid hero, live countdown, real-time "control room" modules, a live
  activity ticker, city cards, category grid, featured services.
- **16 host city pages** — stadium, match schedule, transport, fan zones, safety, scam warnings,
  emergency numbers, weather, attractions, verified businesses, and fan hubs.
- **Business directory** — 16 categories, filtering by city/category/rating, dynamic business
  profiles with ratings, WhatsApp/Book-now CTAs, and 532-Verified badges.
- **/list-business** — full onboarding form with server action + validation, pending→approved flow.
- **Match Day Mode** — the hero feature. A live tactical dashboard: mini-map with pings, crowd
  density, gate wait times, last-train alerts, verified rides/food, and live alerts.
- **Near Me** — live discovery across 12 categories (food, washrooms, charging, safe rides, etc.)
  with an animated map, walking times, and open-now status.
- **Fan Hubs** — country-based supporter communities with watch parties and recommendations.
- **Community** — moderated, crowd-sourced tips/recommendations/warnings with upvoting.
- **Ask 532** — floating AI concierge that answers from internal city + business data, cites
  sources, and falls back gracefully ("I don't currently have verified information for that").
- **Pricing** — Stripe-ready business plans (Free / $29 / $99 / Enterprise) + fan Premium tier.
- **Admin dashboard** — submission moderation, city management, alert broadcasting, community
  moderation, and analytics.
- **Auth** — Google / Apple / email UI + guest browsing (wire to Supabase Auth).
- **SEO** — dynamic metadata, OpenGraph, JSON-LD structured data, dynamic `sitemap.xml`, `robots.txt`,
  PWA manifest.

## 🧱 Tech stack

- **Next.js 15** (App Router, Server Actions) · **TypeScript** · **Tailwind CSS**
- **Framer Motion** for animation · **lucide-react** icons
- **Supabase / PostgreSQL** schema + RLS (optional at runtime) · **Stripe**-ready models
- Edge-friendly, fully static-renderable pages with `generateStaticParams`.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

The app runs **fully on seed data** with zero configuration. To connect a real backend, copy
`.env.example` → `.env.local` and fill in Supabase / Stripe / Mapbox keys.

## 🗄️ Database

SQL lives in [`/supabase`](./supabase):

1. `schema.sql` — tables, enums, triggers (profiles, cities, matches, businesses, reviews,
   fan_hubs, bookings, subscriptions, alerts, guides, community_posts).
2. `rls.sql` — Row Level Security policies for every table.
3. `seed.sql` — realistic seed data (16 cities, fan hubs, sample businesses, alerts).

Run them in order in the Supabase SQL editor.

## 🧩 Architecture

```
src/
  app/            # routes (App Router) + api/ + sitemap/robots/manifest
  components/     # ui primitives, layout, cards, home, matchday, nearme, admin, auth, concierge
  data/           # cities, businesses, categories, fanHubs, pricing, live  (seed source of truth)
  lib/            # utils, types, seo, nav, concierge engine, supabase client
supabase/         # schema.sql, rls.sql, seed.sql
```

## 🔌 API

- `GET  /api/businesses?city=&category=&verified=&q=&limit=` — filtered directory JSON.
- `POST /api/concierge` `{ "query": "..." }` — verified-data concierge answer with sources.

---

Not affiliated with FIFA. Built for fans, by fans.

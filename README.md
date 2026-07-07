# Sugandha — Attars & Car Perfumes E-Commerce

A full-featured e-commerce platform for a friend's attar (traditional Indian perfume oil) and car perfume business. What started as a simple orders management app evolved into a complete online store with an admin dashboard.

## For Whom

- **Customers** — browse, search, and buy attars (per-ml pricing) and car perfumes (flat pricing) with variant size selection
- **Store Owner / Admin** — manage products, variants, inventory, orders, categories, coupons, testimonials, and customers from a single dashboard

## What Problem It Solves

Before this app, the business ran on manual WhatsApp orders — customers would message, the owner would note quantities, track stock in a spreadsheet, and manage everything ad-hoc. **Sugandha** replaces that entire workflow:

- Customers see live product catalog with real pricing
- Admin gets a dashboard to track orders, update statuses, manage inventory, and handle the business from one place
- No more lost orders, manual stock tracking, or scattered pricing

## Built With

- **Next.js 16** (App Router, JSX, Tailwind v4)
- **Supabase** (Postgres, Auth, RLS, Storage)
- **Vercel** (deployment)

## Key Features

### Storefront
- Product catalog with category filtering, search, and sorting
- Product detail pages with variant size selector and dynamic pricing
- Shopping cart (sessionStorage-based, variant-aware)
- Checkout with address capture and order confirmation
- User accounts: profile editing, order history, saved addresses

### Admin Dashboard
- Overview dashboard with revenue, orders, and low-stock alerts
- Product management: add/edit products, variants, images, pricing
- Order management: view details, update status, track history
- Category, coupon, and testimonial management
- Inventory monitoring
- Customer list with order history per user

### Auth & Security
- Email/password sign-up and login
- PKCE flow for secure authentication
- Row Level Security (customers see only their data)
- Admin role check with service-role client
- Duplicate email and phone protection on sign-up

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (admin operations)

## Database

The schema is in `src/database/001-schema.sql`. Run it in your Supabase SQL editor to set up all tables, enums, RLS policies, and triggers.

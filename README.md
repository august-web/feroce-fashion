# FÉROCE — Luxury Handbag E-Commerce

Flagship storefront for **FÉROCE**, a premium women's & men's handbag brand. Live at [ferocefashionff.com](https://www.ferocefashionff.com).

A modern, editorial retail experience: rich product browsing, cart & wishlist, Stripe-powered checkout, a full admin portal, and a branded transactional email system.

## Tech Stack

| Layer        | Technology |
|--------------|-----------|
| **Frontend** | Next.js 15 (App Router) + React + TypeScript + Tailwind CSS |
| **Animation**  | Framer Motion + Lenis smooth scroll |
| **State**      | Zustand (cart & wishlist, persisted to localStorage) |
| **Backend**    | Next.js Route Handlers + Server Actions + Middleware |
| **Database**   | Supabase Postgres (Auth, RLS, Storage), migrations in `supabase/migrations/` |
| **Payments**   | Stripe Checkout Sessions + webhooks (signature-verified) |
| **Email**      | Resend via Supabase Edge Function (`supabase/functions/send-email`) |
| **SEO**        | sitemap.xml, robots.txt, meta/OG tags, JSON-LD |
| **Analytics**  | Google Analytics 4 (gtag) |
| **Deploy**     | Vercel — live at `www.ferocefashionff.com` |

## Getting Started

Prerequisites: Node.js 18+, npm, and a Supabase project (free tier is fine).

```bash
# 1. Install dependencies
npm install

# 2. Create your env file and fill it in (see below)
cp .env.example .env.local

# 3. Apply the Supabase schema + seed (from repo root)
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push

# 4. Deploy the email edge function (used for all transactional emails)
npx supabase functions deploy send-email

# 5. Run the dev server
npm run dev
# → http://localhost:3000
```

## Environment Variables

All values live in `.env.local` (gitignored — never commit secrets) and must also be set in your hosting environment (Vercel).

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (use live keys; test keys only for a dev copy)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (for the edge function; stored as a Supabase secret)
RESEND_API_KEY=

# Misc
NEXT_PUBLIC_GA_MEASUREMENT_ID=
VERCEL_OIDC_TOKEN=
```

### Edge function secrets

The email edge function reads `RESEND_API_KEY` from Supabase secrets, **not** from `.env.local`:

```bash
supabase secrets set RESEND_API_KEY=re_xxxx
```

## Stripe Setup

- **Checkout** uses Stripe Checkout Sessions created by `POST /api/checkout/stripe/session` (all cart items become line items; Stripe handles quantities, shipping, and tax).
- **Webhook** endpoint: `https://www.ferocefashionff.com/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `payment_intent.payment_failed`
  - Signing secret (`whsec_...`) goes in `STRIPE_WEBHOOK_SECRET`.
  - Signature verification is enforced — forged requests are rejected with `400`.

## Email System

All transactional email is sent from `hello@ferocefashionff.com` via the `send-email` edge function with branded FÉROCE templates: welcome, verify-email, password-reset, order-confirmation, order-shipped, order-cancelled, new-order-admin, newsletter.

> **Important:** in Supabase Dashboard → Authentication → Email, turn **off** "Confirm email" so only the branded verification email goes out (not Supabase's default one).

## Project Structure

```
src/app/            # Pages & routes
  shop/             # Catalog listing + category pages (filters, sort)
  product/[slug]/   # Product detail: gallery, colors, add-to-cart
  bag/              # Cart page
  checkout/         # Stripe payment flow
  admin/            # Admin dashboard (products, orders, customers, emails)
  (auth pages)      # login, register, account, forgot-password, wishlist
src/components/      # Shared UI + feature components
src/lib/supabase/     # Supabase clients (browser / server / admin)
src/store/            # Zustand stores (cart, wishlist)
supabase/
  migrations/         # Schema + RLS + seed
  functions/send-email # Resend edge function (8 templates)
```

## Key Commands

| Command              | Description |
| -------------------- | ----------- |
| `npm run dev`        | Local dev server (port 3000) |
| `npm run build`      | Production build & typecheck |
| `npm start`          | Run the production build |
| `npm run lint`       | Lint |
| `supabase db push`   | Apply migrations |
| `supabase functions deploy send-email` | Deploy email edge function |

## Notes

- All sales are final: no refunds, returns, or exchanges (per brand policy).
- Preorders (Denim De Ville collection) ship in 4–8 weeks.
- Site serves from `www.ferocefashionff.com`; canonical URLs, sitemap, and webhook all use the `www.` host.

## License

Private — © FÉROCE. All rights reserved.
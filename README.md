# FÉROCE FASHION_FF — Luxury commerce flagship

A responsive React + TypeScript + Vite storefront and operations dashboard for a premium women’s and men’s handbag brand. The interface is original; the campaign/product imagery is the brand’s real photography, downloaded from its Instagram feed (@ferocefashion_ff) and bundled locally (see “Imagery” below).

## What is implemented

- Editorial homepage, women, men, collections and about storytelling
- Search overlay plus catalog search, filters, sorting and empty states
- Responsive product cards with alternate-image hover, wishlist and dynamic bag
- Product detail gallery, color/variant/quantity, pre-order messaging and accordions
- Persistent local preview cart/wishlist; full checkout form wired to a real payment-server flow
- Provider-safe order confirmation behavior (no order claimed before verification)
- Supabase-ready customer auth, password reset, profile/order/address/wishlist dashboard
- Role-checked admin portal with overview analytics, orders/statuses, catalog editor, collections and customers
- Scalable PostgreSQL schema with relationships, constraints, indexes and Row Level Security
- Lazy-loaded routes, semantic landmarks, alt text, responsive images and reduced-motion support

> **Preview data:** Product names, copy, specifications, GHS prices, dates, contact details, founder material, policies, analytics and customer/order records are explicitly marked sample or placeholder. They are not factual brand claims and must be replaced/approved before launch.

> **Imagery:** `public/images/*.jpg` are real product/campaign photos pulled from the brand’s
> Instagram feed (@ferocefashion_ff) via its public web API (2026-08). De Ville, Naji and
> denim pieces; video posts contribute their cover frames. Baked-in creator overlay text was
> removed by cropping where possible. The homepage hero (`hero-campaign-home.jpg`) is a
> dark editorial frame from the De Ville fanny-pack/satchel styled shoot, cropped to a
> three-quarter composition; the About hero keeps `hero-campaign-tuned.jpg`. The un-retouched
> source files and a source manifest live in `.freebuff/ig-candidates/`; the previous AI
> placeholder set is backed up in `.freebuff/original-images/`. Confirm image rights/usage
> with the client and generate AVIF/WebP renditions before launch.

> **Brand handoff:** The last client placeholders are centralized in `src/data/site.ts`
> (footer legal line, newsletter privacy consent line, contact phone/location/hours,
> TikTok/Pinterest URLs, domain email inbox). Each pending field renders an honest
> “client to supply” note on the site and flips to approved text the moment a `value`
> is provided — no other code changes needed. The contact email is the domain-matched
> `hello@feroce.com`; the client must provision the feroce.com inbox for it before
> launch (the old ferocefashionff@gmail.com is retired).

> **Collections:** The `/collections` experience is structured around the brand’s real
> collections — **De Ville** (structured flap bags, denim-textured coated canvas with an
> all-over gold monogram; Cream Gold, Navy & Gold plus the convertible satchel line) and
> **Naji** (soft-fur handbags in Red Maroon & Golden; fur, bobby-shiney, satin) — with
> materials and colorways taken from the feed captions (`src/data/collections.ts`). The six
> placeholder product records stand in as stopgap SKUs under De Ville until the client
> uploads real ones; Naji renders a “pieces arriving” state. Re-running the seed maps the
> live catalog into these collections and creates the Naji row.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev       # Vite (web) + tsx watch (api server) together
```

Or run the two processes separately:

```bash
npm run dev:web      # Vite on :5173, proxies /api to the server
npm run dev:server   # Express API on :8787
```

Build verification:

```bash
npm run typecheck
npm run build
```

## Backend setup (Supabase)

The storefront is wired to a live Supabase project. Schema, seed and credentials live in this repo:

1. Link this directory to the project (already done for `feroce-fashion-flagship`):
   ```bash
   supabase login
   supabase link --project-ref <ref> --password "<db password>"
   ```
2. Apply migrations (tables, constraints, RLS, storage bucket + policies):
   ```bash
   supabase db push --linked --password "<db password>"
   ```
   Migration files: `0001_init.sql` (schema + `products` storage bucket), `0002_profile_email.sql` (customer email on `profiles`), `0003`–`0005` (payment functions + grants), and `0006_product_inventory.sql` (per-product stock totals for server-side availability filtering).
3. Seed the catalog from the static sample data (idempotent). The seed also uploads the bundled `public/images` product photography into the `products` bucket (`catalog/…` object paths) and writes those paths into `product_images`, so records resolve to public storage URLs:
   ```bash
   npx esbuild supabase/seed.ts --bundle --platform=node --format=esm --outfile=supabase/.seed.mjs
   node supabase/.seed.mjs   # reads VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local
   rm supabase/.seed.mjs
   ```
4. Browser-safe values live in `.env.local` (gitignored):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Server-only secrets live in `.env.local` / the server environment — `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_PASSWORD`, and the provider keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Never in a `VITE_` variable.
6. Create the first admin through a trusted service-role operation. Never expose a default admin password or let users select their own role.

### Live dashboards

- The account dashboard (`/account`) reads and writes the signed-in user's profile, orders, addresses and wishlist through Supabase; wishlist hearts sync to the `wishlists`/`wishlist_items` tables when signed in and fall back to local storage for guests.
- The admin portal (`/admin`) is fully live: analytics and stock from the orders/variants tables, order status updates, product/category/collection CRUD, image uploads to the public `products` storage bucket, and the customer list.
- The storefront (home, shop, product, collections, search, and the account wishlist) reads the catalog from Supabase via `src/lib/catalog.ts` + `CatalogContext`. The static `src/data/products.ts` renders instantly and is used automatically as a fallback when Supabase is unconfigured or the query fails; it also remains the source for `supabase/seed.ts`.
- The shop (`/shop`, `/women`, `/men`) runs its **search, filters and sorting against the database** (`fetchShopProducts` in `src/lib/catalog.ts`), so results stay fast as the catalog grows: category/collection/color filters resolve to small child lookups + `id=in` on products, search is an `or(name,subtitle,description…) ilike` plus collection/category-name matches, inventory bands use the `product_inventory()` RPC, and sorting is server-side `order`. The client-side filter remains only as a fallback and as an instant re-filter while typing. The search overlay uses the same debounced server search.

### RLS policy verification

Every Row Level Security policy can be validated against the live project as anonymous, customer, and admin:

```bash
npm run test:rls
```

`scripts/test-rls.ts` creates two throwaway users (subject + other), seeds minimal data, and exercises every table policy (catalog visibility, own-row isolation, admin CRUD, anonymous capture), the `products` storage bucket (public read, admin-only write), and the function grants (`is_admin` callable; payment functions service-role-only). It also asserts that role changes are impossible through PostgREST (column privilege) and that anonymous inserts cannot read back what they wrote. All test data — users, rows, and storage objects — is removed on exit, including on failure. Exits non-zero if any check fails, so it can run in CI against any linked project.

### Recommended first-admin operation

After that person has registered and verified their email, run this only in a trusted SQL/admin environment:

```sql
update public.profiles set role = 'admin' where id = '<verified auth user uuid>';
```

Do not expose this operation to the browser.

## Payments — real server, real provider adapter

Checkout runs through a small Express API (`server/`) that only accepts authenticated requests from the signed-in user, never trusts browser totals, and only confirms orders from a verified provider webhook.

Routes (all same-origin via the Vite dev proxy, so no CORS in dev):

- `POST /api/checkout/session` — validates the request, loads product/variant prices + inventory from the database, creates a pending order with immutable item snapshots, then asks the payment provider for a hosted session. Returns `{ orderId, url }`; on failure the pending order is cancelled so no orphans accumulate.
- `GET /api/checkout/status?orderId=` — returns the order's current status (used by the confirmation page so it never claims payment before verification).
- `POST /api/webhooks/stripe` — parses the raw body with `express.raw()` before any JSON middleware, verifies the Stripe signature and timestamp, enforces webhook idempotency, then atomically marks the order paid and decrements inventory via `public.confirm_paid_order()`. `checkout.session.expired` cancels the order.

Provider configuration (`.env.local` / server env — never in a `VITE_` variable):

- `STRIPE_SECRET_KEY` — provider secret key
- `STRIPE_WEBHOOK_SECRET` — signing secret for `whsec_…`, used to verify webhook signatures
- `SUPABASE_SERVICE_ROLE_KEY` — server-only client for payment confirmation

Unconfigured behavior: if `STRIPE_SECRET_KEY` is absent the checkout route returns a clean "payments unavailable" response that the UI surfaces as-is — no fake orders, no fake charges. E2E-verified: order creation, signed-webhook confirmation, inventory decrement, idempotent replay, bad-signature rejection, and session expiry cancellation all work against the live project.

Server security notes: the payment functions (`confirm_paid_order`, `cancel_pending_order`, `next_order_number`) live in the database and are locked down so only the service role can execute them — anonymous and signed-in users get `permission denied` (migration `0005_function_grants.sql`).

Request protection (all routes):

- **Validation** — the checkout payload is validated with **zod** (`server/validation.ts`) before any work: required customer fields, a real email, UUID product ids, quantity 1–10, line counts 1–30, and field length caps. Invalid payloads get a `400` with the first issue; the database remains the source of truth for prices, stock and currency. The webhook route's validation is signature verification (a validly signed Stripe payload is trusted), plus idempotency.
- **Rate limiting** — `server/rate-limit.ts` applies fixed-window (60s) in-memory limits: **per-IP** on checkout, webhook and status routes, and **per-user** on checkout (bucketed by the signed-in user id from the Bearer token). Over-limit requests get `429` with `Retry-After`; limits are env-configurable (`RATE_LIMIT_CHECKOUT_IP`, `RATE_LIMIT_CHECKOUT_USER`, `RATE_LIMIT_WEBHOOK_IP`, `RATE_LIMIT_STATUS_IP`). In-memory buckets are single-instance — swap `server/rate-limit.ts` for a Redis/Upstash-backed store when deploying multiple instances.

To go live: create a Stripe account, add test/production keys and the webhook endpoint to the server env, then switch the checkout redirect to your live site URL. Add other providers (PayPal, Cash App, Corner…) as adapters behind `server/payment-adapter.ts` once merchant eligibility is confirmed.

## Transactional email

Order emails are rendered server-side and sent via Resend (`server/email-adapter.ts` + `server/email-templates.ts`) at real state transitions:

- **pending** — after a checkout session is created (order received, payment being verified).
- **paid** — when the webhook confirms `checkout.session.completed` (order confirmed, full items + totals + shipping block).
- **cancelled** — when `checkout.session.expired` arrives (no charge taken, retry invite).

Emails only fire on an actual transition — the webhook's idempotency guard plus the RPC's returned order id mean replays and races can never send duplicates. A failed send is logged and the webhook still acks (no Stripe retry storms).

Configuration (server env / `.env.local`, never in a `VITE_` variable):

- `RESEND_API_KEY` — absent = emails are skipped with a log line and checkout is unaffected.
- `MAIL_FROM` — must be a verified Resend domain (default `FÉROCE FASHION_FF <orders@feroce.example>`).
- `RESEND_API_URL` — defaults to `https://api.resend.com`; overridable for proxies/stubs.

Templates are inline-styled HTML with a sample-store footer flag; replace with approved brand templates before launch.

## Contact and newsletter

The contact form and newsletter now insert directly into the schema's insert-only RLS tables (`contact_messages`, `newsletter_subscribers`) using the anonymous key — the browser can write these rows but never read them back (admin-only SELECT), and duplicate newsletter emails are reported as already subscribed. When Supabase is unconfigured or the write fails, the form falls back to an honest "preview only" note so the storefront still works without the backend.

Before launch, consider moving these writes behind a rate-limited edge function (CAPTCHA/bot protection, per-IP limits, consent recording, and an approved email/CRM service) as recommended in the hardening section.

## Site settings (utility bar)

The storefront utility bar (currency, free-shipping threshold, returns window) reads from a single editable row in the `site_settings` table (migration `0007`) — the client updates these from the admin **Settings** module without code changes:

- `currency_code` — ISO 4217 code (e.g. `GHS`); the bar label and the `formatMoney` symbol follow it.
- `free_shipping_over_minor` — threshold in minor units (GH₵2,000 → `200000`).
- `returns_days` — returns window in days.

RLS: anonymous and authenticated users can read the row (the bar is public storefront), only `is_admin()` can write it — verified by the RLS suite. When Supabase is unconfigured or the query fails, `src/context/SiteSettingsContext.tsx` falls back to the same static values that used to live in the component, so the bar still renders.

## SEO & social sharing

Every page sets its own title, meta description, Open Graph and Twitter-card tags plus an absolute canonical URL through `src/lib/seo.ts` (`useSeo`). The social-card image defaults to `/images/hero-campaign.jpg`; product pages override it with the product's own image.

Absolute URLs (og:image, og:url, canonical) resolve against `VITE_SITE_URL` when set in the build environment, otherwise the deployed origin — so set `VITE_SITE_URL=https://<your-domain>` in production builds. The static `index.html` shell carries root-relative equivalents (valid with or without the env var; crawlers resolve them against the origin). The brand description currently ships the site's launch copy — refine it once the client provides approved language (the campaign imagery is already pulled from the brand's Instagram feed).

## Button treatment

One component (`src/components/ui/Button.tsx`) carries the storefront's four variants, and the pairing rules are consistent everywhere:

- `dark` — **primary**: the action the user is here to complete (place order, save, view order, add to bag, view results).
- `outline` — **secondary**: the alternative or exploratory path beside a primary (continue shopping, preview confirmation, buy now, cancel). On dark/photo backgrounds it gets explicit `border-white text-white hover:bg-white hover:text-ink` overrides (hero CTAs, admin preview).
- `text` — **tertiary**: quiet utility links (shop all pieces, clear filters, continue shopping in the cart drawer).
- `light` — **primary on dark/photo backgrounds** (explore the campaign, secure sign in, return home).

Every intentional pairing and its hierarchy:

| Where | Primary | Secondary | Intent |
|---|---|---|---|
| Home hero | — | Shop women / Shop men (both outline) | Equal-weight routes; no merchandising hierarchy |
| Cart drawer (items) | Proceed to checkout (dark) | Continue shopping (text) | Convert vs. keep browsing |
| Checkout notice modal | Return to checkout (dark) | Preview confirmation (outline) | Return to task vs. explore |
| Order confirmation | View order(s) (dark) | Continue shopping (outline) | Confirm the result vs. return to store |
| Product page | Add to bag (dark) | Buy now (outline) | Standard cart path vs. expedited checkout |
| Account address modal | Save address (dark) | Cancel (outline) | Commit vs. discard |
| Admin sign-in | Secure sign in (light) | — | Authenticate (no preview bypass; the dev-only preview escape hatch was removed) |
| Shop mobile filters | View N pieces (solid) | Clear all (bordered) | Commit vs. reset filters |

Keep new pairs on this system — if a pairing is deliberately equal-weight, both buttons must share one treatment with a comment stating why. The admin panel uses its own denser hand-rolled button style (8px caps, tighter padding) for admin density; don't mix it with the storefront component in the same modal.

## Launch content checklist

- [ ] Final logo/wordmark usage and brand color approval
- [ ] Product names, SKUs, real prices, currency and specifications
- [ ] Inventory and pre-order delivery windows
- [ ] Founder biography, journey, quote and verified craft/sourcing claims
- [ ] Official email, phone, business location, social URLs and client hours
- [ ] Approved shipping markets, rates, tax handling and estimates
- [ ] Legal-approved returns, privacy, terms, cookie and accessibility content
- [ ] Merchant payment accounts, server secrets and verified webhook endpoints
- [ ] Transactional email templates and support workflow
- [ ] Product image rights & usage confirmation for the feed photography (already sourced from @ferocefashion_ff), optimized AVIF/WebP renditions and CDN policy
- [ ] Analytics/consent platform and production monitoring

## Production hardening

- Host behind HTTPS with CSP, HSTS, frame and referrer policies.
- Validate all edge/server inputs with a schema library; rate-limit auth, contact and checkout (done server-side with zod + per-IP/per-user buckets).
- Keep RLS enabled and test every policy as anonymous, customer and admin.
- Protect admin MFA, rotate secrets and log privileged changes.
- Use signed storage uploads with MIME/size validation and malware scanning.
- Add transactional inventory reservation and expiration.
- Add provider webhook replay protection and an idempotency table.
- Run accessibility, cross-browser, performance and end-to-end purchase tests.
- Generate server-rendered product JSON-LD, canonical URLs, sitemap and robots rules at deployment.

## Key structure

```text
src/components/        Reusable storefront and UI components
src/components/admin/  Admin shell and operational modules (live Supabase data)
src/context/           Cart, wishlist and notification state (wishlist syncs to Supabase)
src/data/              Clearly labeled preview catalog (also the seed source)
src/lib/               Supabase, SEO, storage, images and payment clients
src/pages/             Route-level, lazy-loaded experiences
server/                 Express API: checkout, Stripe webhook, Resend email adapter + templates
supabase/migrations/   Relational schema, constraints, RLS, storage policies and payment functions
supabase/seed.ts       Idempotent catalog seed (categories, collections, products, variants, images)
public/images/          Real campaign/product photography from @ferocefashion_ff (feed download; sources + manifest in .freebuff/ig-candidates, original placeholders in .freebuff/original-images)
```

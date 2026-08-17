-- FÉROCE FASHION_FF / Supabase PostgreSQL schema
-- Apply in a NEW Supabase project, review all policies, then create the first admin
-- with a service-role-only operation: update public.profiles set role='admin' where id='...';

create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','admin');
create type public.product_status as enum ('draft','active','archived');
create type public.order_status as enum ('pending','paid','processing','shipped','delivered','cancelled','refunded');
create type public.payment_status as enum ('pending','authorized','paid','failed','cancelled','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  description text, created_at timestamptz not null default now()
);
create table public.collections (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  description text, hero_image_path text, status public.product_status not null default 'draft',
  starts_at timestamptz, ends_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
  name text not null, slug text not null unique, subtitle text, description text,
  gender text not null check (gender in ('Women','Men','Unisex')), status public.product_status not null default 'draft',
  base_price_minor integer not null check (base_price_minor >= 0), currency char(3) not null default 'GHS',
  materials text, dimensions text, featured boolean not null default false, best_seller boolean not null default false,
  new_arrival boolean not null default false, preorder boolean not null default false, preorder_delivery_note text,
  seo_title text, seo_description text, search_keywords text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique, name text not null, color_name text, color_hex text, price_minor integer check (price_minor >= 0),
  inventory integer not null default 0 check (inventory >= 0), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null, alt_text text not null, sort_order integer not null default 0, is_primary boolean not null default false
);
create table public.product_collections (
  product_id uuid references public.products(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  sort_order integer not null default 0, primary key (product_id, collection_id)
);
create table public.addresses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  label text, first_name text not null, last_name text not null, phone text, line1 text not null, line2 text,
  city text not null, region text, postal_code text, country_code char(2) not null, is_default boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.wishlists (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table public.wishlist_items (
  wishlist_id uuid references public.wishlists(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now(), primary key (wishlist_id, product_id)
);
create table public.orders (
  id uuid primary key default gen_random_uuid(), order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null, email text not null, phone text,
  status public.order_status not null default 'pending', currency char(3) not null,
  subtotal_minor integer not null check (subtotal_minor >= 0), shipping_minor integer not null default 0 check (shipping_minor >= 0),
  tax_minor integer not null default 0 check (tax_minor >= 0), total_minor integer not null check (total_minor >= 0),
  shipping_address jsonb not null, shipping_method text, estimated_delivery text,
  provider_checkout_id text unique, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null, sku text not null, selected_color text, selected_variant text,
  unit_price_minor integer not null check (unit_price_minor >= 0), quantity integer not null check (quantity > 0),
  line_total_minor integer generated always as (unit_price_minor * quantity) stored
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null, provider_payment_id text unique, status public.payment_status not null default 'pending',
  amount_minor integer not null check (amount_minor >= 0), currency char(3) not null,
  raw_metadata jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), email text not null unique, consent_at timestamptz not null default now(),
  source text not null default 'website', status text not null default 'subscribed'
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null,
  status text not null default 'new', created_at timestamptz not null default now()
);

create index products_status_idx on public.products(status);
create index variants_product_idx on public.product_variants(product_id);
create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);
create index order_items_order_idx on public.order_items(order_id);
create index payments_order_idx on public.payments(order_id);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles where id=auth.uid() and role='admin') $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public
as $$ begin insert into public.profiles(id,first_name,last_name) values(new.id,new.raw_user_meta_data->>'first_name',new.raw_user_meta_data->>'last_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger products_updated before update on public.products for each row execute procedure public.set_updated_at();
create trigger variants_updated before update on public.product_variants for each row execute procedure public.set_updated_at();
create trigger collections_updated before update on public.collections for each row execute procedure public.set_updated_at();
create trigger addresses_updated before update on public.addresses for each row execute procedure public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute procedure public.set_updated_at();
create trigger payments_updated before update on public.payments for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_collections enable row level security;
alter table public.addresses enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

-- Public catalog: only active products/collections are visible. Admins manage all records.
create policy "read active products" on public.products for select using (status='active' or public.is_admin());
create policy "admin products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read categories" on public.categories for select using (true);
create policy "admin categories" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read active collections" on public.collections for select using (status='active' or public.is_admin());
create policy "admin collections" on public.collections for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read active variants" on public.product_variants for select using (active and exists(select 1 from public.products p where p.id=product_id and p.status='active') or public.is_admin());
create policy "admin variants" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read product images" on public.product_images for select using (exists(select 1 from public.products p where p.id=product_id and p.status='active') or public.is_admin());
create policy "admin product images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "read product collections" on public.product_collections for select using (true);
create policy "admin product collections" on public.product_collections for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- A customer may read/update their own profile but may not change role (column privileges below).
create policy "own profile read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
create policy "own profile update" on public.profiles for update to authenticated using (id=auth.uid() or public.is_admin()) with check (id=auth.uid() or public.is_admin());
revoke update on public.profiles from authenticated;
grant update(first_name,last_name,phone) on public.profiles to authenticated;

create policy "own addresses" on public.addresses for all to authenticated using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy "own wishlists" on public.wishlists for all to authenticated using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy "own wishlist items" on public.wishlist_items for all to authenticated using (exists(select 1 from public.wishlists w where w.id=wishlist_id and (w.user_id=auth.uid() or public.is_admin()))) with check (exists(select 1 from public.wishlists w where w.id=wishlist_id and (w.user_id=auth.uid() or public.is_admin())));

-- Orders/payments are INSERTED and mutated by the trusted checkout/webhook service role only.
create policy "own orders read" on public.orders for select to authenticated using (user_id=auth.uid() or public.is_admin());
create policy "admin orders update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "own order items read" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_admin())));
create policy "admin payments read" on public.payments for select to authenticated using (public.is_admin());

-- Anonymous capture is insert-only; add CAPTCHA/rate limiting at the server/edge layer.
create policy "newsletter insert" on public.newsletter_subscribers for insert to anon,authenticated with check (true);
create policy "admin newsletter" on public.newsletter_subscribers for select to authenticated using (public.is_admin());
create policy "contact insert" on public.contact_messages for insert to anon,authenticated with check (true);
create policy "admin contact read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "admin contact update" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Storage recommendation: private product-admin upload bucket + transformation/CDN.
-- Public delivery should use a separate read-only `products` bucket; only admins can upload/delete.

-- Product image storage bucket: public read, admin-only write (schema.sql recommendation).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products', 'products', true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do nothing;

create policy "products public read" on storage.objects
  for select using (bucket_id = 'products');
create policy "products admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and public.is_admin());
create policy "products admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'products' and public.is_admin());
create policy "products admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'products' and public.is_admin());

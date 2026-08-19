-- ══════════════════════════════════════════════
-- FÉROCE FASHION — Drop all & recreate schema
-- ══════════════════════════════════════════════

-- ── DROP EVERYTHING ──
-- Drop tables in reverse dependency order
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists categories cascade;
drop table if exists profiles cascade;
-- Drop any leftover tables from the old schema
drop table if exists product_variants cascade;
drop table if exists product_images cascade;
drop table if exists wishlists cascade;
drop table if exists payments cascade;
drop table if exists newsletter_subscribers cascade;
drop table if exists collections cascade;
drop table if exists addresses cascade;
drop table if exists contact_messages cascade;
drop table if exists site_settings cascade;

-- ── PROFILES ──
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Admins read all profiles" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ── CATEGORIES ──
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int default 0
);

alter table categories enable row level security;

create policy "Public read categories" on categories for select using (true);
create policy "Admin write categories" on categories
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ── PRODUCTS ──
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories on delete set null,
  name text not null,
  slug text not null unique,
  description text default '',
  price int not null,
  image_urls text[] default '{}',
  color text default '',
  stock int default 0,
  active boolean default true,
  is_new boolean default false,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public read active products" on products
  for select using (active = true);
create policy "Admin read all products" on products
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admin write products" on products
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ── ORDERS ──
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete set null,
  stripe_session_id text,
  paypal_order_id text,
  payment_method text not null check (payment_method in (
    'card','apple_pay','google_pay','cashapp','bank_transfer','paypal'
  )),
  payment_provider text not null check (payment_provider in ('stripe','paypal')),
  total int not null,
  status text default 'pending' check (status in ('pending','paid','shipped','cancelled')),
  shipping_address jsonb default '{}',
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users read own orders" on orders
  for select using (auth.uid() = user_id);
create policy "Admin read all orders" on orders
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admin update orders" on orders
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ── ORDER ITEMS ──
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders on delete cascade,
  product_id uuid references products on delete set null,
  name text not null,
  price int not null,
  quantity int not null
);

alter table order_items enable row level security;

create policy "Read order items via order" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and (orders.user_id = auth.uid()
             or exists (select 1 from profiles where id = auth.uid() and role = 'admin'))
    )
  );

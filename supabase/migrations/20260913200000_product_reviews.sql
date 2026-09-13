-- ══════════════════════════════════════════════
-- Product reviews (trust layer)
-- ══════════════════════════════════════════════

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null default 'Verified Buyer',
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 4 and 2000),
  verified_purchase boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.product_reviews enable row level security;

create index if not exists idx_product_reviews_product
  on public.product_reviews (product_id, approved, created_at desc);

-- One review per signed-in user per product
create unique index if not exists uq_product_reviews_user_product
  on public.product_reviews (product_id, user_id)
  where user_id is not null;

-- Anyone (including anonymous visitors) can read approved reviews
create policy "Anyone reads approved reviews" on public.product_reviews
  for select using (approved = true or user_id = auth.uid());

-- Signed-in users can submit reviews for themselves only.
-- Non-purchases land in moderation (approved = false); verified
-- purchases are flipped to approved by the server action.
create policy "Users insert own review" on public.product_reviews
  for insert with check (
    auth.uid() = user_id
    and approved = false
    and rating between 1 and 5
  );

-- No client update/delete policies: moderation happens via the
-- service role (admin), which bypasses RLS.

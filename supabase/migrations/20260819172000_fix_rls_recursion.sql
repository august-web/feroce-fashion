-- ══════════════════════════════════════════════
-- Fix infinite recursion in profiles RLS policy
-- ══════════════════════════════════════════════

-- Helper function: check if current user is admin
-- This avoids querying profiles table from within its own RLS policy
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from auth.users
    where auth.uid() = id
    and raw_user_meta_data->>'role' = 'admin'
  )
$$;

-- Drop the recursive policies
drop policy if exists "Admins read all profiles" on profiles;
drop policy if exists "Admin read all products" on products;
drop policy if exists "Admin write products" on products;
drop policy if exists "Admin write categories" on categories;
drop policy if exists "Admin read all orders" on orders;
drop policy if exists "Admin update orders" on orders;

-- Recreate non-recursive admin policies using the function
create policy "Admins read all profiles" on profiles
  for select using (public.is_admin());

create policy "Admin read all products" on products
  for select using (public.is_admin());

create policy "Admin write products" on products
  for all using (public.is_admin());

create policy "Admin write categories" on categories
  for all using (public.is_admin());

create policy "Admin read all orders" on orders
  for select using (public.is_admin());

create policy "Admin update orders" on orders
  for update using (public.is_admin());

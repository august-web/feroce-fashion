-- Per-product inventory totals (active variants of active products) for server-side
-- availability filtering in the shop. Only aggregates of the public catalog are exposed —
-- the same sums the storefront already derives from embedded variants.
create or replace function public.product_inventory()
returns table (product_id uuid, inventory bigint)
language sql stable security definer set search_path = public
as $$
  select pv.product_id, coalesce(sum(pv.inventory), 0)::bigint
  from public.product_variants pv
  join public.products p on p.id = pv.product_id
  where pv.active and p.status = 'active'
  group by pv.product_id
$$;
revoke all on function public.product_inventory() from public;
grant execute on function public.product_inventory() to anon, authenticated;

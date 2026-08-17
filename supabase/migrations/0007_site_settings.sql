-- Site-wide storefront settings: a single editable row the client updates from the
-- admin panel (Settings module) — no code changes required. The storefront reads it
-- with the anonymous key; only verified admins can write it (is_admin()).
create table public.site_settings (
  id integer primary key default 1 check (id = 1),  -- enforce a single settings row
  currency_code char(3) not null default 'GHS',
  free_shipping_over_minor integer not null default 200000 check (free_shipping_over_minor >= 0),  -- GH₵2,000 in minor units
  returns_days integer not null default 30 check (returns_days > 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

insert into public.site_settings (id, currency_code, free_shipping_over_minor, returns_days)
values (1, 'GHS', 200000, 30)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Public storefront reads the bar values; only admins mutate them.
create policy "site settings read" on public.site_settings for select using (true);
create policy "admin site settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

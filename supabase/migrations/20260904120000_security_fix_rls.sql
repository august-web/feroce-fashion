-- ══════════════════════════════════════════════
-- Security fixes: admin escalation + missing column
-- ══════════════════════════════════════════════

-- 1. Block self-service role changes on profiles.
--    The old "Users update own profile" policy had no column restriction,
--    so any user could run UPDATE profiles SET role = 'admin' on their own
--    row. This trigger makes role changes by the row owner impossible;
--    role changes by the service role (admin dashboard) still work
--    (auth.uid() is NULL for service-role requests).
create or replace function public.enforce_no_self_role_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.role is distinct from old.role and auth.uid() = old.id then
    raise exception 'Cannot change your own role';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_no_self_role_change on public.profiles;
create trigger profiles_no_self_role_change
  before update on public.profiles
  for each row execute function public.enforce_no_self_role_change();

-- 2. Make is_admin() read profiles.role (protected by the trigger above)
--    instead of auth.users.raw_user_meta_data, which every user can edit
--    themselves via supabase.auth.updateUser({ data: { role: 'admin' } }).
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
$$;

-- 3. The admin order-status route writes tracking_number, which did not
--    exist in the live schema (the whole update failed when provided).
alter table public.orders add column if not exists tracking_number text;

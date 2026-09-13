-- ══════════════════════════════════════════════
-- Hardening: restrict self-insert role on profiles
-- ══════════════════════════════════════════════
-- The "Users insert own profile" policy only checked auth.uid() = id,
-- so an authenticated user could insert their own row with role='admin'
-- (blocked today only by the signup trigger creating the row first).
-- Restrict self-inserts to role='customer', mirroring the update trigger.

DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'customer');

-- Belt-and-braces: even if a future policy loosens again, no
-- non-service-role request may create an admin row.
create or replace function public.enforce_no_self_admin_insert()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.role = 'admin' and auth.uid() is not null then
    raise exception 'Cannot create an admin profile';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_no_self_admin_insert on public.profiles;
create trigger profiles_no_self_admin_insert
  before insert on public.profiles
  for each row execute function public.enforce_no_self_admin_insert();

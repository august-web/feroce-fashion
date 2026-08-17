-- Sequential order numbers (FF-0001, FF-0002, …) allocated by the checkout server via RPC.
-- Executable by service_role only: Supabase default privileges grant EXECUTE to
-- anon/authenticated at creation, so revoke must name every role explicitly.
create sequence if not exists public.orders_number_seq start 1;

create or replace function public.next_order_number() returns text
language sql security definer set search_path=public
as $$ select 'FF-' || lpad(nextval('public.orders_number_seq')::text, 4, '0') $$;
revoke all on function public.next_order_number() from public, anon, authenticated;
grant execute on function public.next_order_number() to service_role;

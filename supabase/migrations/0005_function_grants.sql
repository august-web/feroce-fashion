-- Tighten EXECUTE on security-definer functions created by migrations.
-- Supabase default privileges hand EXECUTE to anon/authenticated at creation time,
-- so each role must be revoked explicitly; these functions must be service_role-only.
revoke all on function public.confirm_order_payment(uuid) from public, anon, authenticated;
grant execute on function public.confirm_order_payment(uuid) to service_role;

revoke all on function public.cancel_order_payment(uuid) from public, anon, authenticated;
grant execute on function public.cancel_order_payment(uuid) to service_role;

-- Trigger helpers are never called directly by clients.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.sync_profile_email() from public, anon, authenticated;

-- is_admin() is intentionally callable by anon/authenticated (it backs the RLS policies).

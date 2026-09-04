-- TEMPORARY diagnostic (2/2): recent auth users with their profile roles,
-- to identify the new admin user. Dropped after the fix.
CREATE TABLE IF NOT EXISTS _admin_diag_recent AS
SELECT u.id::text AS uid, u.email, u.created_at::text AS created_at,
       coalesce(p.role, '(no profile)') AS profile_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.created_at > now() - interval '3 days'
ORDER BY u.created_at DESC;

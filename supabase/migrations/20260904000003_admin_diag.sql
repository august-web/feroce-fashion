-- TEMPORARY diagnostic: identify the new admin user and any orphaned
-- profile left by the deleted admin. Dropped after the fix.
CREATE TABLE IF NOT EXISTS _admin_diag AS
SELECT u.id::text AS uid, u.email, u.created_at::text AS created_at,
       coalesce(p.role, '(no profile)') AS profile_role, 'auth_user' AS source
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL OR p.role = 'admin'
UNION ALL
SELECT p.id::text, '(orphaned profile)', NULL, p.role, 'orphan_profile'
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE u.id IS NULL;

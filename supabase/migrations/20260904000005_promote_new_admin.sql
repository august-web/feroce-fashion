-- Promote the new admin account (created 2026-09-04) and capture the
-- resulting admin set for verification. Temp tables dropped afterwards.
UPDATE public.profiles SET role = 'admin'
WHERE id = '68b0ad4d-9fce-49ef-85a4-f39984a7740b';
CREATE TABLE IF NOT EXISTS _admin_verify AS
SELECT id::text AS uid, email, role FROM public.profiles WHERE role = 'admin';

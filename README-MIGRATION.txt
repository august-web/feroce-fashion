FEROCE — migration bundle (Windows PC → Mac)
Created 2026-09-13. All files below are gitignored, so a plain `git clone`
on the Mac will NOT recreate them — copy these into place instead.

WHERE THINGS GO ON THE MAC
==========================
Assuming you clone the repos to ~/dev (adjust paths as needed):

  feroce-fashion/.env.local                       -> ~/dev/feroce-fashion/.env.local
  feroce-fashion/.env.example                     -> ~/dev/feroce-fashion/.env.example  (reference only)
  feroce-fashion/.vercel/project.json             -> ~/dev/feroce-fashion/.vercel/project.json
                                                     (keeps `vercel` linked to the right project)
  feroce-fashion/supabase/.temp/*                 -> ~/dev/feroce-fashion/supabase/.temp/
                                                     (keeps `supabase` CLI linked: project ref,
                                                      linked project, DB pooler URL)
  feroce-mobile/.env                              -> ~/dev/feroce-mobile/.env
  expo/codesigning/development-code-signing-*.json-> ~/.expo/codesigning/66bb7bc5-d79c-41ad-b09f-7bc0e74ac6ee/

WHAT'S IN .env.local (feroce-fashion — the main web store)
==========================================================
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY          (server-only secret)
  STRIPE_SECRET_KEY                  (server-only secret)
  STRIPE_WEBHOOK_SECRET              (server-only secret)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  NEXT_PUBLIC_PAYPAL_CLIENT_ID
  PAYPAL_CLIENT_SECRET               (server-only secret)
  RESEND_API_KEY
  NEXT_PUBLIC_GA_MEASUREMENT_ID
  VERCEL_OIDC_TOKEN                  (auto-rotated by Vercel; can be deleted —
                                      Vercel injects a fresh one at build time)

WHAT'S IN feroce-mobile/.env
============================
  EXPO_PUBLIC_SUPABASE_URL
  EXPO_PUBLIC_SUPABASE_ANON_KEY

NOTE: feroce-fashion/.env.local and feroce-mobile/.env both point at the SAME
Supabase project (edbfoszmspjlnihmhlsa / feroce-fashion-flagship), so the anon
keys should match — they're project-scoped, not machine-scoped.

NOT ON THIS PC — LOG IN FRESH ON THE MAC
========================================
No tokens for these were stored on this Windows machine, so just re-auth:

  1. Vercel CLI:    npx vercel login        (then link, or rely on copied .vercel/project.json)
  2. Supabase CLI:  npx supabase login
  3. Expo / EAS:    npx eas login           (Android keystore lives in EAS cloud servers,
                                             the copied codesigning settings JSON references it)
  4. GitHub:        git over HTTPS + browser login, or `gh auth login` if you use the GitHub CLI
  5. Stripe/PayPal/Resend dashboards: no action needed — live values are already inside .env.local

STRONGLY RECOMMENDED AFTER THE MOVE
===================================
- Delete this zip and the copied .env files from any cloud-sync/transfer
  service you used (AirDrop/USB is safest).
- Since the old PC had real secrets on disk, consider rotating the
  Supabase service_role key, Stripe secret key, and PayPal client secret
  from their dashboards once the Mac is up and running.

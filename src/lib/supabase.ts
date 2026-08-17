import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

// The anonymous key is browser-safe when Row Level Security is enabled.
// Never place a service-role or payment secret in a VITE_ variable.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

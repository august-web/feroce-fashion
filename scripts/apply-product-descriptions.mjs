// One-off: applies supabase/migrations/20260920090000_rich_product_descriptions.sql
// to the live products table via PostgREST (one PATCH per slug parsed from the file).
import { readFileSync } from 'fs'

const ROOT = new URL('..', import.meta.url).pathname
const env = readFileSync(`${ROOT}/.env.local`, 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim()
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim()

const sql = readFileSync(`${ROOT}/supabase/migrations/20260920090000_rich_product_descriptions.sql`, 'utf8')
const re = /update products set description = \$\$([\s\S]*?)\$\$ where slug = '([^']+)';/g
const updates = [...sql.matchAll(re)].map(m => ({ slug: m[2], description: m[1] }))
console.log(`Parsed ${updates.length} updates from migration file`)

let failures = 0
for (const u of updates) {
  let ok = false
  for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
    try {
      const res = await fetch(`${url}/rest/v1/products?slug=eq.${u.slug}`, {
        method: 'PATCH',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ description: u.description }),
        signal: AbortSignal.timeout(30000),
      })
      if (res.ok) {
        const rows = await res.json()
        console.log(`${res.status} ${u.slug} -> updated ${rows.length} row(s), ${u.description.split(/\s+/).length} words`)
        ok = true
      } else {
        console.log(`${res.status} ${u.slug} -> FAILED:`, await res.text())
      }
    } catch (err) {
      console.log(`${u.slug} attempt ${attempt} -> ${err.cause?.code || err.message}`)
    }
  }
  if (!ok) failures++
}

console.log('\nVerification (live products):')
const res = await fetch(`${url}/rest/v1/products?select=slug,description&order=slug.asc`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
  signal: AbortSignal.timeout(30000),
})
const rows = await res.json()
for (const r of rows) {
  const words = r.description.split(/\s+/).filter(Boolean).length
  console.log(`  ${r.slug}: ${words} words ${words > 60 ? 'OK' : '(still short!)'}`)
}
console.log(failures ? `\n${failures} FAILED` : '\nAll updates applied')

process.exit(failures ? 1 : 0)

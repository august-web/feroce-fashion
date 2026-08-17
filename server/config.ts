import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Server-side env. process.env wins; .env.local (gitignored, never bundled) fills gaps. */
export function loadEnv(): Record<string, string> {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const env: Record<string, string> = { ...(process.env as Record<string, string>) }
  try {
    const raw = fs.readFileSync(path.join(root, '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/)
      if (m && !(m[1] in env)) env[m[1]] = m[2].trim()
    }
  } catch { /* .env.local is optional */ }
  return env
}

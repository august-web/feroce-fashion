// SERVER-ONLY in-memory fixed-window rate limiter. Keys are arbitrary strings
// ("ip:<addr>", "user:<id>"). Single-instance only: for multi-instance deploys
// swap the store for Redis/Upstash (same API surface).
interface Bucket { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

const PRUNE_THRESHOLD = 10_000

export interface RateLimitResult { limited: boolean; retryAfterSeconds: number }

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()

  // Occasionally prune expired buckets so a long-lived server doesn't grow unboundedly.
  if (buckets.size >= PRUNE_THRESHOLD) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { limited: false, retryAfterSeconds: 0 }
  }
  if (bucket.count >= limit) {
    return { limited: true, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) }
  }
  bucket.count += 1
  return { limited: false, retryAfterSeconds: 0 }
}

/** Test helper: clear all buckets. */
export function resetRateLimits(): void {
  buckets.clear()
}

/**
 * In-memory sliding-window rate limiter.
 * On Vercel, warm instances reuse this Map — cold starts reset it, which is fine.
 * Limits: 20 requests/minute per user (protects against burst abuse).
 */

interface Window {
  count: number
  resetAt: number
}

const windows = new Map<string, Window>()

const WINDOW_MS = 60_000          // 1 minute
const DEFAULT_MAX = 20            // requests per window

/** Clean up expired entries every 5 minutes to avoid memory growth */
setInterval(() => {
  const now = Date.now()
  for (const [key, w] of windows.entries()) {
    if (now > w.resetAt) windows.delete(key)
  }
}, 5 * 60_000)

export function checkRateLimit(
  userId: string,
  maxPerMinute = DEFAULT_MAX
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const existing = windows.get(userId)

  if (!existing || now > existing.resetAt) {
    windows.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (existing.count >= maxPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count++
  return { allowed: true }
}

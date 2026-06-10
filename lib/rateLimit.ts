const store = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxPerMinute: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + 60_000 })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (entry.count >= maxPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count++
  return { allowed: true, retryAfterSeconds: 0 }
}

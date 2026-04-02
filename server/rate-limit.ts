// server/rate-limit.ts
// In-memory sliding window rate limiter. No external dependencies.
// Suitable for single-instance deployments. For multi-instance, swap to Redis.

const windows = new Map<string, number[]>();

// Evict expired entries every 5 minutes to prevent memory growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of windows) {
    const valid = timestamps.filter((t) => now - t < 3600000);
    if (valid.length === 0) windows.delete(key);
    else windows.set(key, valid);
  }
}, 300000);

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const timestamps = (windows.get(key) ?? []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= limit) {
    const oldest = timestamps[0]!;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: windowMs - (now - oldest),
    };
  }

  timestamps.push(now);
  windows.set(key, timestamps);

  return {
    allowed: true,
    remaining: limit - timestamps.length,
    retryAfterMs: 0,
  };
}

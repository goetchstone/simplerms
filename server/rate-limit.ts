// server/rate-limit.ts
// In-memory sliding window rate limiter. No external dependencies.
// Suitable for single-instance deployments. For multi-instance, swap to Redis.

/**
 * Trusted client IP for rate-limiting and audit logging.
 *
 * The app is only reachable through our nginx reverse proxy, which sets
 * `X-Real-IP` to `$remote_addr` (the immediate client) — overwriting any
 * client-supplied value — and *appends* the real IP to `X-Forwarded-For` via
 * `$proxy_add_x_forwarded_for`. So the trustworthy value is `X-Real-IP`, or
 * failing that the **rightmost** XFF entry. Never the leftmost / whole header:
 * those are attacker-controlled, and keying a rate limiter on them lets a
 * client rotate the header to get a fresh bucket per request (limiter bypass).
 */
export function getClientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]!;
  }
  return "unknown";
}

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

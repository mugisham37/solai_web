type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitConfig = Readonly<{
  key: string;
  limit: number;
  windowMs: number;
}>;

export function checkRateLimit(config: RateLimitConfig): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(config.key);
  if (!existing || now > existing.resetAt) {
    buckets.set(config.key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true };
  }
  if (existing.count >= config.limit) {
    return { allowed: false, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { allowed: true };
}

export const RATE_LIMITS = {
  otpSendPerPhone: { limit: 5, windowMs: 15 * 60 * 1000 },
  otpSendPerIp: { limit: 20, windowMs: 15 * 60 * 1000 },
  otpVerifyPerPhone: { limit: 10, windowMs: 15 * 60 * 1000 },
  /** Delivery-code attempts per order (and IP) before lockout. */
  deliveryCodePerOrder: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const;

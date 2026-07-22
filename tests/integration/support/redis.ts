import { execFileSync } from "node:child_process";

const REDIS_CONTAINER =
  process.env.INTEGRATION_REDIS_CONTAINER ?? "docker-redis-1";

/**
 * Every test in this suite creates its own throwaway user, so nothing
 * depends on Redis-backed state (rate-limit counters, lockouts, 2FA
 * challenge tokens) surviving between tests. Flushing before each test is
 * what makes the suite reliably re-runnable and keeps the backend's
 * per-IP login rate limiter (10 requests/900s — every test in this suite
 * runs from the same machine IP) from being exhausted partway through a
 * single run.
 */
export function flushRedis(): void {
  execFileSync("docker", ["exec", REDIS_CONTAINER, "redis-cli", "FLUSHALL"], {
    stdio: "ignore",
  });
}

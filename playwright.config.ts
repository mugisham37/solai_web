import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.SOLAI_E2E_BASE_URL ?? "http://127.0.0.1:3000";

/**
 * End-to-end gate for the seller and buyer journeys.
 *
 * These run against a real Next.js + FastAPI stack with fake AI/OTP/payment
 * providers — the mock adapters (`SOLAI_USE_HTTP_*=0`) are deliberately not
 * exercised here, because the thing worth guarding is the wiring between the
 * two processes.
 */
export default defineConfig({
  testDir: "./e2e",
  // Generation is genuinely slow, and a stuck stream is exactly the failure
  // these tests exist to catch, so keep the ceiling high but finite.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

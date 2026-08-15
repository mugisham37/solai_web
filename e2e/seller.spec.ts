import { expect, test, type Page } from "@playwright/test";

/**
 * The seller journey, end to end, against the real API.
 *
 * Landing → start → build (description-only) → generate → draft → payout OTP →
 * done. Everything here is asserted through the UI a seller actually touches,
 * because the failure mode this guards against is not "the endpoint 500s" — it
 * is "the endpoint is fine and the screen still hangs".
 */

// Matches solai_server's app/otp/fake.py DEV_OTP_CODE.
const DEV_OTP_CODE = "508312";

/** A fresh number per run: signup refuses a phone that already has a shop. */
function uniqueRwandaPhone(): { national: string; display: string } {
  const suffix = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return { national: `788${suffix}`, display: `788 ${suffix.slice(0, 3)} ${suffix.slice(3)}` };
}

function collectFailures(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });
  return { consoleErrors, failedRequests };
}

test.describe("seller journey", () => {
  test("landing renders and hands off to a draft", async ({ page }) => {
    const { failedRequests } = collectFailures(page);
    await page.goto("/en");
    await expect(page.locator("body")).toBeVisible();

    await page.goto("/en/start?q=handmade%20beaded%20bracelet");
    await page.waitForURL(/\/build\//, { timeout: 30_000 });
    expect(page.url()).toMatch(/\/build\/[\w-]+/);
    expect(failedRequests, `unexpected failed requests: ${failedRequests.join(", ")}`).toEqual([]);
  });

  test("describe → generate → draft → payout → paid", async ({ page }) => {
    const { consoleErrors, failedRequests } = collectFailures(page);
    const phone = uniqueRwandaPhone();
    const timings: Record<string, number> = {};

    await page.goto("/en/start?q=handmade%20beaded%20bracelet");
    await page.waitForURL(/\/build\//, { timeout: 30_000 });

    // --- Build: description-only path -----------------------------------
    const describeInput = page.getByLabel("What are you selling?");
    await expect(describeInput).toBeVisible();
    await describeInput.fill("handmade beaded bracelet");

    const generationStart = Date.now();
    await page.getByRole("button", { name: "Build from description" }).click();

    await expect(page.getByRole("heading", { name: /SolAI is building your listing/i })).toBeVisible();

    // --- Draft ----------------------------------------------------------
    const draftHeading = page.getByRole("heading", { name: /Change anything you don't like/i });
    await expect(draftHeading).toBeVisible({ timeout: 90_000 });
    timings.generation = Date.now() - generationStart;

    const continueCta = page.getByRole("button", { name: /Looks good/i });
    await expect(continueCta).toBeVisible();

    // --- Payout ---------------------------------------------------------
    await continueCta.click();
    await page.waitForURL(/\/payout/, { timeout: 30_000 });

    await expect(page.getByRole("heading", { name: /Where should the money land\?/i })).toBeVisible();
    await page.getByLabel("Your phone number").fill(phone.national);
    await page.getByLabel("Your shop name").fill("Amara Beads");
    await page.getByRole("checkbox").first().check({ force: true });

    const otpStart = Date.now();
    await page.getByRole("button", { name: /Send me a code/i }).click();

    // --- OTP ------------------------------------------------------------
    await expect(page.getByRole("heading", { name: /Enter the code/i })).toBeVisible({
      timeout: 30_000,
    });
    timings.otpSend = Date.now() - otpStart;

    const cells = page.getByRole("group", { name: "6 digit code" }).getByRole("textbox");
    for (let i = 0; i < DEV_OTP_CODE.length; i += 1) {
      await cells.nth(i).fill(DEV_OTP_CODE[i]);
    }
    const accountStart = Date.now();
    await page.getByRole("button", { name: /Verify and open my shop/i }).click();

    // --- Account created --------------------------------------------------
    await expect(page.getByRole("heading", { name: /You can be paid/i })).toBeVisible({
      timeout: 60_000,
    });
    timings.createAccount = Date.now() - accountStart;

    console.log("seller journey timings (ms):", JSON.stringify(timings));
    // Non-AI hops are plain database work; seconds here means something is
    // queueing that should not be.
    expect(timings.otpSend).toBeLessThan(5_000);
    expect(timings.createAccount).toBeLessThan(15_000);

    expect(failedRequests, `unexpected failed requests: ${failedRequests.join(", ")}`).toEqual([]);
    expect(consoleErrors, `console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
  });
});

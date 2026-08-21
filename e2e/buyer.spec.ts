import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

/**
 * The buyer journey, end to end, against the real API.
 *
 * Catalogue → product → checkout → COD order → tracking. COD is the
 * primary path here (per the build plan) because it's fully real and
 * provider-independent — no fake-timing dependency the way the MoMo path
 * has.
 *
 * The seller onboarding needed to get a real shop+product is already
 * covered by seller.spec.ts, so this seeds a shop directly against the
 * backend (mirroring solai_server's `_published_shop()` test helper) and
 * spends the browser budget on the buyer's own screens instead.
 */

const BACKEND_URL = process.env.SOLAI_E2E_BACKEND_URL ?? "http://127.0.0.1:8000";
// Matches solai_server's app/otp/fake.py DEV_OTP_CODE.
const DEV_OTP_CODE = "508312";

function uniqueRwandaPhone(): string {
  const suffix = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  return `+250788${suffix}`;
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

async function publishedShop(
  request: APIRequestContext,
): Promise<{ slug: string; productId: string; title: string }> {
  const phone = uniqueRwandaPhone();

  const create = await request.post(`${BACKEND_URL}/v1/draft`);
  const { draftId } = (await create.json()) as { draftId: string };
  const draftToken = create.headers()["x-solai-draft-token"];
  const draftHeaders = { "X-Solai-Draft-Token": draftToken };

  // This fixture never runs generation, so the skeleton draft's `original`
  // is still the `data:image/svg` placeholder — which now makes the
  // resulting product unpurchasable (§10: description-only listings block
  // checkout until a real photo exists). Give it a real-looking URL so this
  // fixture still represents a normal, buyable listing.
  const draftGet = await request.get(`${BACKEND_URL}/v1/draft/${draftId}`, {
    headers: draftHeaders,
  });
  const { draft } = (await draftGet.json()) as {
    draft: { images: { original: { url: string; thumbnailUrl: string } } };
  };
  draft.images.original.url = `https://cdn.example.com/${draftId}.jpg`;
  draft.images.original.thumbnailUrl = `https://cdn.example.com/${draftId}-thumb.jpg`;
  await request.put(`${BACKEND_URL}/v1/draft/${draftId}`, {
    headers: draftHeaders,
    data: { draft },
  });

  await request.post(`${BACKEND_URL}/v1/payout/otp/send`, {
    data: { phoneE164: phone, channel: "sms" },
  });
  await request.post(`${BACKEND_URL}/v1/payout/otp/verify`, {
    data: { phoneE164: phone, code: DEV_OTP_CODE },
  });

  const account = await request.post(`${BACKEND_URL}/v1/payout/account`, {
    headers: draftHeaders,
    data: {
      draftId,
      phoneE164: phone,
      shopName: `E2E Shop ${Math.random().toString(36).slice(2, 8)}`,
      destination: {
        rail: "mtn-momo",
        maskedIdentifier: "+*** *** *111",
        verifiedHolderName: "E2E TEST",
        verifiedAt: new Date().toISOString(),
      },
      consentVersion: "2026-08-01",
      idempotencyKey: `e2e-${draftId}`,
    },
  });
  const accountBody = (await account.json()) as { ok: boolean };
  if (!accountBody.ok) {
    throw new Error(`account creation failed: ${JSON.stringify(accountBody)}`);
  }
  const shopSession = account.headers()["x-solai-shop-session"];
  const shopHeaders = { "X-Solai-Shop-Session": shopSession };

  let status = (await (
    await request.post(`${BACKEND_URL}/v1/publish/${draftId}/start`, { headers: draftHeaders })
  ).json()) as { phase: string; summary?: { shopSlug: string } };
  for (let i = 0; i < 40 && status.phase === "running"; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    status = (await (
      await request.get(`${BACKEND_URL}/v1/publish/${draftId}/status`, { headers: draftHeaders })
    ).json()) as { phase: string; summary?: { shopSlug: string } };
  }
  if (status.phase !== "done" || !status.summary) {
    throw new Error(`publish did not complete: ${JSON.stringify(status)}`);
  }
  const slug = status.summary.shopSlug;

  const products = (await (
    await request.get(`${BACKEND_URL}/v1/dashboard/products`, { headers: shopHeaders })
  ).json()) as Array<{ id: string; price: { amountMinor: number } }>;
  const productId = products[0].id;

  // `_published_shop`-style seeding skips AI generation for speed, so the
  // draft's title is the empty default — not representative of a real
  // publishable listing (the seller UI never lets an empty title through).
  // Give it a real name the way a seller would via the dashboard editor.
  await request.put(`${BACKEND_URL}/v1/dashboard/products`, {
    headers: shopHeaders,
    data: {
      id: productId,
      name: "Handmade beaded bracelet",
      priceMinor: products[0].price.amountMinor || 5000,
      stock: 5,
      description: "A hand-strung beaded bracelet made in Kigali.",
      onSale: true,
    },
  });

  const productPage = (await (
    await request.get(`${BACKEND_URL}/v1/buyer/shops/${slug}/products/${productId}`)
  ).json()) as { product: { title: string } };

  return { slug, productId, title: productPage.product.title };
}

test.describe("buyer journey", () => {
  test("catalogue → product → checkout → COD order → tracking", async ({ page, request }) => {
    const { slug, productId, title } = await publishedShop(request);
    const { consoleErrors, failedRequests } = collectFailures(page);

    // --- Catalogue ---------------------------------------------------
    await page.goto(`/en/${slug}`);
    await expect(page.getByText(/things for sale/i)).toBeVisible();

    // --- Product --------------------------------------------------------
    await page.goto(`/en/${slug}/p/${productId}`);
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();

    await page.getByRole("button", { name: "Buy now" }).click();
    await page.waitForURL(/\/checkout/, { timeout: 15_000 });

    // --- Checkout ---------------------------------------------------------
    await expect(page.getByRole("heading", { name: "Almost yours" })).toBeVisible();
    await page.getByRole("button", { name: "Deliver to me" }).click();
    await page.getByLabel("Your name").fill("Jean-Paul K.");
    await page.getByLabel("Your phone number").fill("788902771");
    await page.getByLabel("How the courier finds you").fill("Near the market, blue gate");
    await page.getByRole("radio", { name: /Cash on delivery/i }).click();

    // First tap flips to the COD confirmation interstitial; the order isn't
    // placed until the second, differently-worded button.
    await page.getByRole("button", { name: /Place the order/ }).click();
    await page.getByRole("button", { name: "Place the order", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Paid, and held" })).toBeVisible({
      timeout: 15_000,
    });

    // --- Tracking ---------------------------------------------------------
    await page.waitForURL(/\/order\//, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "Paid. And held." })).toBeVisible();

    expect(failedRequests, `unexpected failed requests: ${failedRequests.join(", ")}`).toEqual([]);
    expect(consoleErrors, `console errors: ${consoleErrors.join(" | ")}`).toEqual([]);
  });
});

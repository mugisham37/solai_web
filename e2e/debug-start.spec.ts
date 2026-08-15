import { test } from "@playwright/test";

test("debug describe-only generation", async ({ page }) => {
  page.on("console", (m) => console.log(`CONSOLE ${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => console.log(`PAGEERROR: ${e.message}\n${e.stack}`));
  page.on("requestfailed", (r) =>
    console.log(`REQFAILED ${r.method()} ${r.url()} :: ${r.failure()?.errorText}`),
  );
  page.on("response", (r) => {
    if (!r.url().includes("/_next/")) console.log(`RESP ${r.status()} ${r.request().method()} ${r.url()}`);
  });

  await page.goto("/en/start?q=handmade%20beaded%20bracelet");
  await page.waitForURL(/\/build\//, { timeout: 30_000 });
  console.log("BUILD URL:", page.url());

  await page.getByLabel("What are you selling?").fill("handmade beaded bracelet");
  await page.getByRole("button", { name: "Build from description" }).click();
  await page.waitForTimeout(20_000);
  console.log("FINAL URL:", page.url());
  console.log("HEADINGS:", await page.getByRole("heading").allInnerTexts());
});

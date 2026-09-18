import { test, expect, viewports, safeGoto, reduceMotion } from "./fixtures";

test.describe("Start Your Project enquiry", () => {
  test.beforeEach(async ({ page, setViewport }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/start-your-project");
  });

  test("renders the multi-step form", async ({ page }) => {
    await expect(page.getByRole("progressbar")).toBeVisible();
    await expect(page.getByText("Step 1 of 6").first()).toBeVisible();

    for (const label of [
      "Website or digital platform",
      "Web or mobile application",
      "AI or automation",
      "GST, FSSAI, or compliance support",
    ]) {
      await expect(page.locator(`label:has-text("${label}")`)).toBeVisible();
    }
  });

  test("continue button is always enabled on first step (Cline implementation)", async ({
    page,
  }) => {
    const continueBtn = page.getByRole("button", { name: /Continue/i });

    // Cline implementation: Continue button is always enabled but validates on click
    await expect(continueBtn).toBeEnabled();
  });

  test("advances to the stage step after selecting a need", async ({
    page,
  }) => {
    await page.locator('label:has-text("Website or digital platform")').click();
    await page.getByRole("button", { name: /Continue/i }).click();

    await expect(page.getByText("Step 2 of 6").first()).toBeVisible();
    await expect(page.getByText("Where are you now?")).toBeVisible();
  });

  test("pre-fills from interest search parameter", async ({ page }) => {
    await safeGoto(page, "/start-your-project?interest=website");
    await expect(
      page.locator('label:has-text("Website or digital platform")'),
    ).toHaveClass(/selected/);
  });
});

test.describe("Contact page", () => {
  test("shows contact details and direct routes", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/contact");

    await expect(page.locator("main")).toContainText("Jaigaon");
    await expect(page.locator('main a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('main a[href^="mailto:"]').first()).toBeVisible();
    await expect(
      page.locator('main a[href^="https://wa.me/"]').first(),
    ).toBeVisible();
  });
});

import {
  test,
  expect,
  viewports,
  safeGoto,
  reduceMotion,
  waitForHydration,
} from "./fixtures";

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

  test("continue is gated until a need is selected", async ({ page }) => {
    await waitForHydration(page);
    const continueBtn = page.getByRole("button", { name: /Continue/i });

    // The Continue action is gated at submit time, not on the button attribute:
    // it stays enabled, but with no need selected it refuses to advance and
    // surfaces an inline validation error instead of moving to Step 2.
    await expect(continueBtn).toBeEnabled();
    // Retry until the press registers: __TSR_ROUTER__ can appear a beat before
    // React's event delegation attaches, so a click landing in that gap is
    // dropped and the submit-time validation never runs.
    await expect(async () => {
      await continueBtn.click();
      await expect(page.getByText("Step 1 of 6").first()).toBeVisible();
      await expect(
        page.getByText("Please select what you need help with"),
      ).toBeVisible();
    }).toPass({ timeout: 10000 });

    // Selecting a need clears the gate so Continue can advance. Wait for the
    // selection to commit to form state (the `.selected` class is derived from
    // `form.need`) before pressing Continue, or validation still blocks.
    const need = page.locator('label:has-text("Website or digital platform")');
    await expect(async () => {
      await need.click();
      await expect(need).toHaveClass(/selected/);
    }).toPass({ timeout: 10000 });
    await expect(async () => {
      await continueBtn.click();
      await expect(page.getByText("Step 2 of 6").first()).toBeVisible();
    }).toPass({ timeout: 10000 });
  });

  test("advances to the stage step after selecting a need", async ({
    page,
  }) => {
    await waitForHydration(page);
    const need = page.locator('label:has-text("Website or digital platform")');
    // Retry until the click commits: React's event delegation can attach a beat
    // after __TSR_ROUTER__ appears, so a click landing in that gap is dropped.
    // The `.selected` class is derived from `form.need`, so it only appears once
    // the selection actually committed.
    await expect(async () => {
      await need.click();
      await expect(need).toHaveClass(/selected/);
    }).toPass({ timeout: 10000 });
    await expect(async () => {
      await page.getByRole("button", { name: /Continue/i }).click();
      await expect(page.getByText("Step 2 of 6").first()).toBeVisible();
      await expect(page.getByText("Where are you now?")).toBeVisible();
    }).toPass({ timeout: 10000 });
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

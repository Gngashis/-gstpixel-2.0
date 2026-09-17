import { test, expect, safeGoto, reduceMotion } from "./fixtures";

/**
 * Small, durable visual-regression baseline set.
 *
 * Only a handful of high-value surfaces are captured so the baseline cost stays
 * trivial and reviewable. Animations are stabilized via reduced-motion +
 * animation freezing. The home page runs a continuously animated ambient
 * background (JS/backdrop-filter driven), so its screenshots are compared with
 * a lenient pixel-ratio threshold instead of a brittle exact match. Baselines
 * live in `tests/qa/visual.spec.ts-snapshots/` and can be regenerated locally
 * with `npm run test:e2e:update`.
 */

test.describe("visual regression baselines", () => {
  test("home desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await reduceMotion(page);
    await safeGoto(page, "/");
    await expect(page).toHaveScreenshot("home-desktop.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("home mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await reduceMotion(page);
    await safeGoto(page, "/");
    await expect(page).toHaveScreenshot("home-mobile.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("assembly section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await reduceMotion(page);
    await safeGoto(page, "/");
    await expect(page.locator(".assembly-visual")).toHaveScreenshot(
      "assembly-section.png",
      { maxDiffPixelRatio: 0.03 },
    );
  });

  test("start-your-project", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await reduceMotion(page);
    await safeGoto(page, "/start-your-project");
    await expect(page).toHaveScreenshot("start-your-project.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("project estimator tool", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await reduceMotion(page);
    await safeGoto(page, "/tools/project-estimator");
    await expect(page).toHaveScreenshot("project-estimator.png", {
      maxDiffPixelRatio: 0.03,
    });
  });
});

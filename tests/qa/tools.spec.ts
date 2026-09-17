import { test, expect, viewports, safeGoto, reduceMotion } from "./fixtures";

/**
 * Representative tool-route rendering checks.
 *
 * `/tools/gst-calculator` is intentionally exercised only through the shared
 * route smoke matrix (routes.spec.ts), where its pre-existing runtime crash
 * (`StaggeredReveal` called with a single child) is surfaced distinctly. These
 * checks focus on tools that render correctly so a green run reflects working
 * surfaces.
 */

test.describe("tool routes", () => {
  test("project estimator renders with its inputs", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/tools/project-estimator");

    await expect(page.locator("main")).toContainText("Project estimator");
    await expect(
      page.getByRole("radiogroup", { name: "Project type" }),
    ).toBeVisible();
    await expect(page.locator('input[id="audience"]')).toBeVisible();
  });

  test("service finder renders with its outcome question", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/tools/service-finder");

    await expect(page.locator("main")).toContainText("Service finder");
    await expect(page.locator("main")).toContainText("outcome");
  });
});

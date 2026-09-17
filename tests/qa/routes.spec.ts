import {
  test,
  expect,
  viewports,
  routes,
  expectedContentByRoute,
  assertPageHealthy,
  captureScreenshot,
  reduceMotion,
  safeGoto,
} from "./fixtures";

/**
 * Per-route structural smoke tests across the core responsive matrix.
 *
 * These tests verify real content renders (not just HTTP 200), the site shell
 * is intact, and no fatal runtime/hydration failure occurs. They also capture a
 * full-page screenshot per route/viewport for human visual comparison.
 *
 * Horizontal overflow is asserted in overflow.spec.ts, keeping "does it render"
 * and "does it overflow" as distinct, diagnosable signals.
 */

for (const route of routes) {
  for (const key of Object.keys(viewports) as (keyof typeof viewports)[]) {
    const viewport = viewports[key];
    test.describe(`${route} @ ${viewport.name}`, () => {
      test("renders expected content without runtime crash", async ({
        page,
        setViewport,
      }) => {
        await setViewport(viewport);
        await reduceMotion(page);
        const errors = await safeGoto(page, route);

        await assertPageHealthy(page, {
          route,
          viewport,
          expectedContent: expectedContentByRoute[route] ?? [],
        });

        expect(
          errors,
          `console errors on ${route} @ ${viewport.name}`,
        ).toHaveLength(0);
      });

      test("captures screenshot for visual comparison", async ({
        page,
        setViewport,
      }) => {
        await setViewport(viewport);
        await reduceMotion(page);
        await safeGoto(page, route);
        await assertPageHealthy(page, { route, viewport });
        const file = await captureScreenshot(page, route, viewport);
        expect(file).toMatch(/\.png$/);
      });
    });
  }
}

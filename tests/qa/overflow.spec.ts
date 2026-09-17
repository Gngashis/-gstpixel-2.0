import {
  test,
  expect,
  viewports,
  checkOverflow,
  reduceMotion,
  safeGoto,
} from "./fixtures";

/**
 * Explicit document-level horizontal-overflow checks.
 *
 * Reveals the known pre-existing defect where decorative environment layers
 * (`.env-section::before` with `inset: -50%`) inflate
 * `document.documentElement.scrollWidth` beyond `clientWidth` at >=768px,
 * producing a visible horizontal scrollbar. At <768px the site clips overflow
 * (`overflow-x: hidden`), so the document-level signal is clean there.
 *
 * Offending real DOM elements are reported in the failure message for
 * diagnostic use. These failures belong to the visual/runtime layer
 * (AGENT7), not to this QA harness.
 */

// Representative routes exercised at desktop/tablet widths where the defect shows.
const overflowRoutes = [
  "/",
  "/services",
  "/work",
  "/tools",
  "/start-your-project",
];

for (const key of Object.keys(viewports) as (keyof typeof viewports)[]) {
  const viewport = viewports[key];
  test.describe(`document-level overflow @ ${viewport.name}`, () => {
    for (const route of overflowRoutes) {
      test(`${route} has no horizontal scrollbar`, async ({
        page,
        setViewport,
      }) => {
        await setViewport(viewport);
        await reduceMotion(page);
        await safeGoto(page, route);

        const overflow = await checkOverflow(page);
        test.info().annotations.push({
          type: "overflow",
          description: JSON.stringify(overflow),
        });

        expect(
          overflow.docOverflow,
          `horizontal scroll on ${route} @ ${viewport.name}: ` +
            `scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth} ` +
            `(overflow ${overflow.docOverflow}px). ` +
            `Offending elements: ${JSON.stringify(overflow.offenders)}`,
        ).toBeLessThanOrEqual(2);
      });
    }
  });
}

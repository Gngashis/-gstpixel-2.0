import { test, expect, safeGoto, waitForHydration, fillStable } from "./fixtures";

/**
 * Focused responsive checks for the Website Studio editor.
 *
 * The palette controls used to stretch to ~166px circles when the properties
 * panel went full-width (narrow windows, tablets, mobile). These checks pin
 * the size cap and confirm the workspace never introduces horizontal overflow.
 */

const widths = [390, 430, 768, 1024, 1440] as const;

test.describe("website studio responsive workspace", () => {
  test("palette controls stay compact and nothing overflows at any width", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await safeGoto(page, "/website-studio");
    await waitForHydration(page);

    const field = page.locator("textarea").first();
    await fillStable(
      page,
      field,
      "clothing shop in Jaigaon with tailoring and seasonal collections",
    );
    await page.getByRole("button", { name: /generate website/i }).first().click();

    // Generation can take up to the interactive timeout; wait for the editor.
    await page
      .locator(".studio-v2-palette-control button")
      .first()
      .waitFor({ state: "attached", timeout: 90_000 });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(350);

      const swatch = await page
        .locator(".studio-v2-palette-control button")
        .first()
        .boundingBox();
      expect(swatch, `swatch missing at ${width}`).not.toBeNull();
      expect(swatch!.width, `swatch too large at ${width}`).toBeLessThanOrEqual(
        64,
      );
      expect(swatch!.width, `swatch too small at ${width}`).toBeGreaterThanOrEqual(
        32,
      );

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow at ${width}`).toBeLessThanOrEqual(1);

      // The properties panel must remain in the document and reachable.
      const properties = page.locator(".studio-v2-properties").first();
      await expect(properties).toBeAttached();
    }
  });
});

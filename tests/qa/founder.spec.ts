import { expect, test } from "@playwright/test";
import { safeGoto, viewports } from "./fixtures";

for (const [name, viewport] of Object.entries({
  desktop1440: viewports.desktop1440,
  mobile390: viewports.mobile390,
})) {
  test(`founder experience is intact at ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await safeGoto(page, "/");

    const chip = page.getByRole("link", {
      name: "Meet Ashis Gurung, founder of GSTPIXEL",
    });
    await expect(chip).toBeVisible();
    await chip.click();
    await expect(page).toHaveURL(/#founder$/);

    const section = page.locator("#founder");
    await expect(section).toBeInViewport();
    await expect(
      section.getByRole("heading", { name: /Built with technology/i }),
    ).toBeVisible();
    await expect(
      section.getByAltText("Ashis Gurung, founder of GSTPIXEL in Jaigaon"),
    ).toBeVisible();
    await expect(
      section.getByAltText("Ashis Gurung, founder of GSTPIXEL in Jaigaon"),
    ).toHaveJSProperty("complete", true);
    await expect(
      section.getByRole("link", { name: /Start a conversation/i }),
    ).toHaveAttribute("href", "/start-your-project");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("founder experience resolves immediately under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize(viewports.desktop1440);
  await safeGoto(page, "/#founder");

  const section = page.locator("#founder");
  await expect(section).toBeVisible();
  await expect(section.locator(".founder-portrait-shell")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(section.locator(".founder-copy")).toContainText(
    "AI assists the delivery",
  );
});

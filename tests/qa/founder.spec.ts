import { expect, test } from "@playwright/test";
import { safeGoto, viewports, waitForHydration } from "./fixtures";

for (const [name, viewport] of Object.entries({
  desktop1440: viewports.desktop1440,
  tablet768: viewports.tablet768,
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
      section.getByRole("heading", { name: /Built with engineering/i }),
    ).toBeVisible();
    await expect(section).toContainText("Directed with purpose");
    await expect(section).toContainText(
      "Founder · Digital Solutions & Business Consultant",
    );
    await expect(section).not.toContainText(/AI[- ]assisted delivery/i);
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
    "human judgment",
  );
  await expect(section.locator(".founder-portrait-shell")).toHaveCSS(
    "transform",
    "none",
  );
});

test("founder strip provides restrained pointer and touch feedback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string) => {
      if (query === "(pointer: fine)") {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        } as MediaQueryList;
      }
      return nativeMatchMedia(query);
    };
  });
  await page.setViewportSize(viewports.desktop1440);
  await safeGoto(page, "/");
  await waitForHydration(page);

  const chip = page.getByRole("link", {
    name: "Meet Ashis Gurung, founder of GSTPIXEL",
  });
  const box = await chip.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.8, box!.y + box!.height * 0.25);
  await expect(chip).toHaveAttribute("data-lit-active", "");

  await page.setViewportSize(viewports.mobile390);
  await expect(chip).toHaveCSS("touch-action", "manipulation");
});

test("about page presents the verified founder portrait and direct leadership copy", async ({
  page,
}) => {
  await page.setViewportSize(viewports.tablet768);
  await safeGoto(page, "/about");

  const founderProfile = page.locator(".founder-profile");
  await founderProfile.scrollIntoViewIfNeeded();
  await expect(
    founderProfile.getByAltText("Ashis Gurung, founder of GSTPIXEL in Jaigaon"),
  ).toBeVisible();
  await expect(founderProfile).toContainText(
    "Founder · Digital Solutions & Business Consultant",
  );
  await expect(founderProfile).toContainText("Ashis directly leads GSTPIXEL");
  await expect(founderProfile).not.toContainText(/AI[- ]assisted/i);
});

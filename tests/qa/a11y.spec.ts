import { test, expect, viewports, safeGoto, reduceMotion } from "./fixtures";

test.describe("keyboard accessibility", () => {
  test("skip-link is the first focusable element on desktop", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveClass(/skip-link/);
  });

  test("primary CTA shows a visible focus outline", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    // The homepage's primary action is the Website Studio quick-start.
    const cta = page.getByRole("button", { name: /Create my website/i });
    await cta.focus();
    await expect(cta).toBeFocused();

    const focusVisible = await cta.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const outline = parseFloat(style.outlineWidth) || 0;
      const ring = style.boxShadow && style.boxShadow !== "none" ? 1 : 0;
      return { outline, ring };
    });
    expect(focusVisible.outline + focusVisible.ring).toBeGreaterThan(0);
  });
});

test.describe("reduced motion", () => {
  test("page renders understandably under prefers-reduced-motion", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await safeGoto(page, "/");

    await expect(page.locator("main")).toContainText("GSTPIXEL");
    await expect(page.locator("header.site-header")).toBeVisible();

    // Hero heading must remain present and visible with motion disabled.
    const hero = page.getByRole("heading", { level: 1 }).first();
    await expect(hero).toBeVisible();
  });
});

test.describe("critical content visibility (SSR / reveal)", () => {
  // Runs WITHOUT reduced motion to confirm the scroll-reveal logic does not
  // leave the hero permanently invisible after hydration.
  test("hero content becomes visible on an ordinary render", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await safeGoto(page, "/");

    const hero = page.getByRole("heading", { level: 1 }).first();
    await expect(hero).toBeVisible({ timeout: 10000 });

    const opacity = await hero.evaluate((el) =>
      parseFloat(window.getComputedStyle(el).opacity),
    );
    expect(opacity).toBeGreaterThan(0);
  });

  test("hero content is visible on mobile ordinary render", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await safeGoto(page, "/");

    const hero = page.getByRole("heading", { level: 1 }).first();
    await expect(hero).toBeVisible({ timeout: 10000 });
  });
});

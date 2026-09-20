import {
  test,
  expect,
  viewports,
  safeGoto,
  reduceMotion,
  waitForHydration,
} from "./fixtures";

/* ──────────────────────────────────────────────────────────────────
   MOBILE HEADER PERSISTENCE

   Regression guard for the bug where the mobile header scrolled away with
   the page, and where opening the menu while scrolled (which applies the
   scroll lock, turning <body> into a scroll container) re-parented the
   sticky header's sticky context to the document top — pushing the header,
   the logo, the X/close control and the whole menu off-screen above the
   viewport.

   Positioning is asserted directly (getBoundingClientRect / computed style /
   hit-testing), so the guard does not depend on fragile screenshots.
   ────────────────────────────────────────────────────────────────── */

const MOBILE_WIDTHS = [320, 360, 390, 430] as const;

/** Scroll the document instantly (the app sets `scroll-behavior: smooth`). */
async function scrollToFraction(
  page: import("@playwright/test").Page,
  frac: number,
) {
  await page.evaluate((f) => {
    document.documentElement.style.scrollBehavior = "auto";
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.round(max * f));
  }, frac);
  await page.waitForTimeout(120);
}

async function headerTop(page: import("@playwright/test").Page) {
  return page.evaluate(() =>
    Math.round(
      document.querySelector("header.site-header")!.getBoundingClientRect().top,
    ),
  );
}

for (const width of MOBILE_WIDTHS) {
  test.describe(`mobile header persistence @ ${width}px`, () => {
    test("header stays anchored to the viewport at every scroll position", async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await reduceMotion(page);
      await safeGoto(page, "/");
      await waitForHydration(page);

      // Anchored before any scrolling.
      expect(await headerTop(page)).toBeLessThanOrEqual(1);

      for (const frac of [0.25, 0.5, 0.75, 1]) {
        await scrollToFraction(page, frac);

        const { top, bottom, scrollY } = await page.evaluate(() => {
          const r = document
            .querySelector("header.site-header")!
            .getBoundingClientRect();
          return {
            top: Math.round(r.top),
            bottom: Math.round(r.bottom),
            scrollY: Math.round(window.scrollY),
          };
        });

        // Substantial scroll actually happened and the bar is still on top.
        expect(scrollY).toBeGreaterThan(500);
        expect(top, `header top at ${frac} of the page`).toBeLessThanOrEqual(1);
        expect(bottom).toBeGreaterThan(0);

        // Logo and hamburger are genuinely rendered inside the visible bar.
        await expect(
          page.locator("header.site-header .brand-mark").first(),
        ).toBeInViewport();
        await expect(
          page.locator('button[aria-controls="mobile-nav"]'),
        ).toBeInViewport();
      }
    });

    test("menu opens while scrolled with the header and X still available", async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await reduceMotion(page);
      await safeGoto(page, "/");
      await waitForHydration(page);
      await scrollToFraction(page, 0.5);

      const yBefore = await page.evaluate(() => Math.round(window.scrollY));
      await page.locator('button[aria-controls="mobile-nav"]').click();
      await expect(page.locator("#mobile-nav")).toBeVisible();

      const opened = await page.evaluate(() => {
        const header = document
          .querySelector("header.site-header")!
          .getBoundingClientRect();
        const toggle = document
          .querySelector('button[aria-controls="mobile-nav"]')!
          .getBoundingClientRect();
        const nav = document
          .querySelector("#mobile-nav")!
          .getBoundingClientRect();
        const hit = document.elementFromPoint(
          Math.round(toggle.left + toggle.width / 2),
          Math.round(toggle.top + toggle.height / 2),
        );
        return {
          scrollY: Math.round(window.scrollY),
          headerTop: Math.round(header.top),
          toggleTop: Math.round(toggle.top),
          toggleBottom: Math.round(toggle.bottom),
          toggleHits: !!hit?.closest('button[aria-controls="mobile-nav"]'),
          navBottom: Math.round(nav.bottom),
          viewportH: window.innerHeight,
        };
      });

      // Header and close control remain pinned and unobstructed while open.
      expect(opened.headerTop, "header top with menu open").toBeLessThanOrEqual(
        1,
      );
      expect(opened.toggleTop).toBeGreaterThanOrEqual(0);
      expect(opened.toggleBottom).toBeLessThanOrEqual(opened.viewportH);
      expect(opened.toggleHits, "X is the top-most element at its centre").toBe(
        true,
      );
      // Menu content fits the space below the header (it scrolls internally).
      expect(opened.navBottom).toBeLessThanOrEqual(opened.viewportH + 1);
      // Opening the menu does not move the document.
      expect(Math.abs(opened.scrollY - yBefore)).toBeLessThanOrEqual(1);

      // Attempting to scroll further must not detach the header.
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(150);
      expect(await headerTop(page)).toBeLessThanOrEqual(1);
      await expect(
        page.locator('button[aria-controls="mobile-nav"]'),
      ).toBeInViewport();

      // The close control still works and the header stays anchored after close.
      await page.locator('button[aria-controls="mobile-nav"]').click();
      await expect(page.locator("#mobile-nav")).toBeHidden();
      expect(await headerTop(page)).toBeLessThanOrEqual(1);
    });

    test("auto-close and outside-tap close still work while scrolled", async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await reduceMotion(page);
      await safeGoto(page, "/");
      await waitForHydration(page);
      await scrollToFraction(page, 0.5);

      // Outside tap closes without scrolling the header away.
      await page.locator('button[aria-controls="mobile-nav"]').click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.mouse.click(12, 700);
      await expect(page.locator("#mobile-nav")).toBeHidden();
      expect(await headerTop(page)).toBeLessThanOrEqual(1);

      // 6-second inactivity auto-close is preserved at a scrolled position.
      await page.locator('button[aria-controls="mobile-nav"]').click();
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.waitForTimeout(5200);
      await expect(page.locator("#mobile-nav")).toBeVisible();
      await page.waitForTimeout(2000);
      await expect(page.locator("#mobile-nav")).toBeHidden();
      expect(await headerTop(page)).toBeLessThanOrEqual(1);
    });
  });
}

test("desktop header behaviour is unchanged", async ({ page }) => {
  await page.setViewportSize(viewports.desktop1440);
  await reduceMotion(page);
  await safeGoto(page, "/");
  await waitForHydration(page);

  const position = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector("header.site-header")!).position,
  );
  expect(position).toBe("sticky");

  for (const frac of [0.3, 0.6, 1]) {
    await scrollToFraction(page, frac);
    expect(await headerTop(page)).toBeLessThanOrEqual(1);
  }

  // The mobile-only compensation must not apply on desktop.
  const shellPadTop = await page.evaluate(
    () => getComputedStyle(document.querySelector(".site-shell")!).paddingTop,
  );
  expect(shellPadTop).toBe("0px");
  await expect(page.locator('button[aria-controls="mobile-nav"]')).toBeHidden();
  await expect(page.locator('nav[aria-label="Primary"]')).toBeVisible();
});

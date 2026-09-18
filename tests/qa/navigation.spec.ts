import {
  test,
  expect,
  viewports,
  safeGoto,
  reduceMotion,
  waitForHydration,
} from "./fixtures";

test.describe("desktop navigation", () => {
  test("primary nav links are visible and reachable", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const nav = page.locator('nav[aria-label="Primary"]');
    await expect(nav).toBeVisible();

    for (const label of [
      "Services",
      "Solutions",
      "Work",
      "Tools",
      "Insights",
      "About",
    ]) {
      await expect(
        nav.getByRole("link", { name: label, exact: true }),
      ).toBeVisible();
    }
  });

  test("primary CTA is visible and routes to Start Your Project", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const cta = page.getByRole("link", { name: /Start your project/i });
    await expect(cta.first()).toBeVisible();
    await expect(cta.first()).toHaveAttribute("href", "/start-your-project");
  });
});

test.describe("mobile navigation", () => {
  test("menu toggle is present with correct aria state", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");

    // The open-menu scrim and the toggle both expose an "Close menu"-style
    // accessible name, so target the toggle by its aria-controls — the only
    // element carrying aria-controls="mobile-nav" — to keep the locator
    // unambiguous.
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await expect(toggle).toBeVisible();
    expect(await toggle.getAttribute("aria-expanded")).toBe("false");
    expect(await toggle.getAttribute("aria-controls")).toBe("mobile-nav");
  });

  test("menu opens and closes via the toggle", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    // The open-menu scrim and the toggle both expose an "Close menu"-style
    // accessible name, so target the toggle by its aria-controls — the only
    // element carrying aria-controls="mobile-nav" — to keep the locator
    // unambiguous.
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();

    // The mobile nav panel should appear and expose the full link set.
    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });
    expect(await toggle.getAttribute("aria-expanded")).toBe("true");

    for (const label of [
      "Services",
      "Solutions",
      "Work",
      "Tools",
      "Insights",
      "About",
      "Contact",
    ]) {
      await expect(mobileNav.getByRole("link", { name: label })).toBeVisible();
    }

    // Close via the same toggle.
    await toggle.click();
    await expect(mobileNav).toBeHidden();
    expect(await toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("Escape closes mobile menu and returns focus", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    // The open-menu scrim and the toggle both expose an "Close menu"-style
    // accessible name, so target the toggle by its aria-controls — the only
    // element carrying aria-controls="mobile-nav" — to keep the locator
    // unambiguous.
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Escape");
    await expect(mobileNav).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("resizing to desktop collapses the mobile menu", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    // The open-menu scrim and the toggle both expose an "Close menu"-style
    // accessible name, so target the toggle by its aria-controls — the only
    // element carrying aria-controls="mobile-nav" — to keep the locator
    // unambiguous.
    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    await setViewport(viewports.desktop1440);
    await page.waitForTimeout(200);
    await expect(mobileNav).toBeHidden();
  });
});

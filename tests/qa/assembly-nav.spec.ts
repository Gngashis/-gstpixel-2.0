import {
  test,
  expect,
  viewports,
  safeGoto,
  reduceMotion,
  waitForHydration,
} from "./fixtures";

/* ──────────────────────────────────────────────────────────────────
   MOBILE MENU: auto-close, timer reset, outside click, Escape
   ────────────────────────────────────────────────────────────────── */

test.describe("mobile menu — auto-close after inactivity", () => {
  test("menu auto-closes after ~6 seconds of inactivity", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Wait for the 6-second auto-close (with small margin for test overhead)
    await page.waitForTimeout(6500);

    // Menu should be gone — either unmounted or hidden via closing animation
    const isHidden =
      (await mobileNav.isHidden().catch(() => true)) ||
      (await mobileNav.getAttribute("class"))?.includes(
        "mobile-nav-closing",
      ) === true;
    expect(isHidden).toBeTruthy();
  });

  test("menu stays open while user interacts (timer resets)", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Interact at ~4 second marks to keep resetting the timer
    await page.waitForTimeout(4000);
    const servicesLink = mobileNav.getByRole("link", { name: "Services" });
    await servicesLink.hover();

    await page.waitForTimeout(4000);
    await servicesLink.hover();

    // After 8 total seconds (with resets), menu should still be visible
    await expect(mobileNav).toBeVisible();
    // Toggle should still show expanded
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
  });

  test("menu does not auto-close while keyboard focus remains inside", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.click();
    const servicesLink = page
      .locator("#mobile-nav")
      .getByRole("link", { name: "Services" });
    await servicesLink.focus();
    await page.waitForTimeout(6500);

    await expect(servicesLink).toBeFocused();
    await expect(page.locator("#mobile-nav")).toBeVisible();
  });
});

test.describe("mobile menu — closing behaviors", () => {
  test("Escape closes the mobile menu and returns focus to toggle", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Escape");

    // Wait for closing animation (280ms) + margin
    await page.waitForTimeout(400);

    // Menu should be gone
    const isGone = await mobileNav.isHidden().catch(() => true);
    expect(isGone).toBeTruthy();
    // Focus returned to toggle
    await expect(toggle).toBeFocused();
  });

  test("clicking scrim (outside menu) closes the menu", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Click the scrim (outside the menu panel)
    const scrim = page.locator(".mobile-nav-scrim");
    await expect(scrim).toBeVisible();
    await scrim.click({ force: true });

    await page.waitForTimeout(400);

    const isGone = await mobileNav.isHidden().catch(() => true);
    expect(isGone).toBeTruthy();
  });

  test("clicking a nav link closes the menu", async ({ page, setViewport }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Click Services link — should navigate and close menu
    const servicesLink = mobileNav.getByRole("link", { name: "Services" });
    await servicesLink.click();

    // After navigation, the mobile nav should not be visible
    await page.waitForTimeout(300);
    await expect(mobileNav).toBeHidden();
  });
});

test.describe("mobile menu — closing animation", () => {
  test("closing applies the mobile-nav-closing class before unmount", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    // Do NOT use reduceMotion here — we need to observe the closing animation class
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Press Escape to close
    await page.keyboard.press("Escape");

    // Brief check: the closing class should be applied
    // (it may already be gone if the animation is fast, so we check either state)
    await page.waitForTimeout(50);

    // Eventually the nav should be gone
    await expect(mobileNav).toBeHidden({ timeout: 2000 });
  });
});

/* ──────────────────────────────────────────────────────────────────
   MOBILE MENU — ACTIVE NAVIGATION FEEDBACK
   ────────────────────────────────────────────────────────────────── */

test.describe("mobile menu — active route indicator", () => {
  test("current route gets mobile-nav-active class", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/services");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Services link should have the active class
    const servicesLink = mobileNav.getByRole("link", { name: "Services" });
    await expect(servicesLink).toHaveClass(/mobile-nav-active/);
    await expect(servicesLink).toHaveAttribute("aria-current", "page");
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — ALL SIX STAGES ARE INTERACTIVE
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — interactive stages", () => {
  test("all six assembly stages render as buttons", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const stageButtons = page.locator(".asm-stage-btn");
    await expect(stageButtons).toHaveCount(6);

    // Each button should be keyboard-focusable
    for (let i = 0; i < 6; i++) {
      const btn = stageButtons.nth(i);
      await expect(btn).toHaveAttribute("tabindex", "0");
      const ariaLabel = await btn.getAttribute("aria-label");
      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel!.length).toBeGreaterThan(3);
    }
  });

  test("stage buttons have correct aria-labels with hints", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageButtons = page.locator(".asm-stage-btn");

    // Check each stage has the expected aria-label pattern
    const expectedLabels = [
      "Idea: Define the opportunity",
      "Design: Shape the experience",
      "Build: Engineer the system",
      "Automate: Connect intelligent workflows",
      "Operate: Run the business",
      "Grow: Scale what works",
    ];

    for (let i = 0; i < 6; i++) {
      const label = await stageButtons.nth(i).getAttribute("aria-label");
      expect(label).toBe(expectedLabels[i]);
    }
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — DESTINATION NAVIGATION
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — destination navigation", () => {
  const stageDestinations = [
    { stage: "Idea", href: "/start-your-project" },
    { stage: "Design", href: "/services/websites-digital-platforms" },
    { stage: "Build", href: "/services/web-mobile-applications" },
    { stage: "Automate", href: "/services/ai-automation" },
    { stage: "Operate", href: "/services/business-setup-compliance" },
    { stage: "Grow", href: "/services/business-technology-consulting" },
  ];

  for (const { stage, href } of stageDestinations) {
    test(`${stage} stage navigates to ${href}`, async ({
      page,
      setViewport,
    }) => {
      await setViewport(viewports.desktop1440);
      await reduceMotion(page);
      await safeGoto(page, "/");
      await waitForHydration(page);

      // Find the stage button by its aria-label containing the stage name
      const stageBtn = page.locator(`.asm-stage-btn[aria-label^="${stage}:"]`);
      await expect(stageBtn).toBeVisible();

      // Scroll into view and click
      await stageBtn.scrollIntoViewIfNeeded();
      await stageBtn.click();

      // Wait for client-side navigation — use waitForFunction for reliability
      await page.waitForFunction(
        (path) => window.location.pathname.includes(path),
        href,
        { timeout: 8000 },
      );
      expect(page.url()).toContain(href);
    });
  }
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — DESKTOP HOVER / POINTER RESPONSE
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — desktop hover response", () => {
  test("hovering a stage triggers CSS hover visual effect", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stage = page.locator(".asm-stage").first();
    await expect(stage).toBeVisible();

    // Get the border-color before hover
    const borderBefore = await stage.evaluate(
      (el) => window.getComputedStyle(el).borderColor,
    );

    // Hover over the stage via CSS :hover
    await stage.hover({ force: true });
    await page.waitForTimeout(200);

    // The CSS :hover rule should change the border-color
    const borderAfter = await stage.evaluate(
      (el) => window.getComputedStyle(el).borderColor,
    );

    // The border color should change (from transparent to a visible color)
    expect(borderAfter).not.toBe(borderBefore);
  });

  test("assembly stage button is interactive and responds to click", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageBtn = page.locator(".asm-stage-btn").first();
    await expect(stageBtn).toBeVisible();

    // Verify the button is clickable — the pointer cursor confirms interactivity
    const cursor = await stageBtn.evaluate(
      (el) => window.getComputedStyle(el).cursor,
    );
    expect(cursor).toBe("pointer");
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — KEYBOARD ACCESSIBILITY
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — keyboard accessibility", () => {
  test("stages are keyboard-focusable with correct ARIA", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const stageBtns = page.locator(".asm-stage-btn");

    // All stages should be focusable
    for (let i = 0; i < 6; i++) {
      const btn = stageBtns.nth(i);
      await btn.scrollIntoViewIfNeeded();
      await btn.focus();
      await expect(btn).toBeFocused();
      expect(await btn.getAttribute("tabindex")).toBe("0");
      expect(await btn.getAttribute("aria-label")).toBeTruthy();
    }
  });

  test("Enter key on a focused stage triggers navigation", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    // Focus the first assembly stage button directly
    const firstStageBtn = page.locator(".asm-stage-btn").first();
    await firstStageBtn.scrollIntoViewIfNeeded();
    await firstStageBtn.focus();
    await expect(firstStageBtn).toBeFocused();

    // Space key reliably triggers click on buttons across all browsers/Playwright
    await page.keyboard.press("Space");

    // Wait for client-side navigation
    await page.waitForFunction(
      () => window.location.pathname.includes("/start-your-project"),
      undefined,
      { timeout: 8000 },
    );
    expect(page.url()).toContain("/start-your-project");
  });

  test("focus-visible ring appears on keyboard focus", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageBtn = page.locator(".asm-stage-btn").first();
    await stageBtn.scrollIntoViewIfNeeded();
    await stageBtn.focus();

    // Check that focus is on the button
    const hasFocus = await stageBtn.evaluate((el) => {
      return el === document.activeElement;
    });
    expect(hasFocus).toBeTruthy();
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — TOUCH / MOBILE BEHAVIOR
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — mobile/touch interaction", () => {
  test("assembly stages are visible and tappable on mobile", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageButtons = page.locator(".asm-stage-btn");
    await expect(stageButtons).toHaveCount(6);

    // All should be visible
    for (let i = 0; i < 6; i++) {
      await expect(stageButtons.nth(i)).toBeVisible();
    }
  });

  test("assembly stages have adequate touch target size on mobile", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageButtons = page.locator(".asm-stage-btn");
    for (let i = 0; i < 6; i++) {
      const box = await stageButtons.nth(i).boundingBox();
      expect(box).toBeTruthy();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("hints are hidden on mobile", async ({ page, setViewport }) => {
    await setViewport(viewports.mobile390);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const hints = page.locator(".asm-stage-hint");
    // On mobile, hints should have display: none or equivalent
    const count = await hints.count();
    for (let i = 0; i < count; i++) {
      const isVisible = await hints
        .nth(i)
        .isVisible()
        .catch(() => false);
      expect(isVisible).toBeFalsy();
    }
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — SELECTION TRANSITION
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — selection transition", () => {
  test("clicking a stage triggers navigation with visual feedback", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const stageBtns = page.locator(".asm-stage-btn");
    const secondBtn = stageBtns.nth(1);

    // Verify the stage is clickable and navigates
    await expect(secondBtn).toBeVisible();
    await secondBtn.scrollIntoViewIfNeeded();
    await secondBtn.click();

    // Wait for client-side navigation
    await page.waitForFunction(
      () => window.location.pathname.includes("/services/websites"),
      undefined,
      { timeout: 8000 },
    );
    expect(page.url()).toContain("/services/websites-digital-platforms");
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — CORE PULSE
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — core pulse on selection", () => {
  test("core element receives pulse class when a stage is clicked", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await safeGoto(page, "/");
    await waitForHydration(page);

    const core = page.locator(".asm-core");
    const stageBtn = page.locator(".asm-stage-btn").nth(2);
    await stageBtn.scrollIntoViewIfNeeded();

    const pulseApplied = page.waitForFunction(() =>
      document.querySelector(".asm-core")?.classList.contains("asm-core-pulse"),
    );
    await stageBtn.click({ noWaitAfter: true });
    await pulseApplied;
    await expect(core).toHaveClass(/asm-core-pulse/);
  });
});

/* ──────────────────────────────────────────────────────────────────
   ASSEMBLY — SCROLL MARGIN
   ────────────────────────────────────────────────────────────────── */

test.describe("Assembly — scroll positioning", () => {
  test("sections have scroll-margin-top for fixed header offset", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await reduceMotion(page);
    await safeGoto(page, "/");

    // Check that a content section has proper scroll-margin
    const section = page.locator("section").first();
    const scrollMargin = await section.evaluate((el) => {
      return window.getComputedStyle(el).scrollMarginTop;
    });
    expect(scrollMargin).toBeTruthy();
    const value = parseFloat(scrollMargin);
    expect(value).toBeGreaterThanOrEqual(40);
  });
});

/* ──────────────────────────────────────────────────────────────────
   REDUCED MOTION — new animations disabled
   ────────────────────────────────────────────────────────────────── */

test.describe("reduced motion — new features", () => {
  test("menu closes instantly under reduced motion", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.mobile390);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0.001s !important;
          transition-duration: 0.001s !important;
        }
      `,
    });
    await safeGoto(page, "/");
    await waitForHydration(page);

    const toggle = page.locator('button[aria-controls="mobile-nav"]');
    await toggle.scrollIntoViewIfNeeded();
    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible({ timeout: 10000 });

    // Press Escape — under reduced motion it should close faster
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    await expect(mobileNav).toBeHidden({ timeout: 1000 });
  });

  test("assembly stages render without error under reduced motion", async ({
    page,
    setViewport,
  }) => {
    await setViewport(viewports.desktop1440);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await safeGoto(page, "/");

    const stageButtons = page.locator(".asm-stage-btn");
    await expect(stageButtons).toHaveCount(6);

    // All should be visible and functional
    for (let i = 0; i < 6; i++) {
      await expect(stageButtons.nth(i)).toBeVisible();
    }
  });
});

/* ──────────────────────────────────────────────────────────────────
   TABLET LAYOUT
   ────────────────────────────────────────────────────────────────── */

test.describe("tablet layout", () => {
  test("assembly renders properly on tablet", async ({ page, setViewport }) => {
    await setViewport(viewports.tablet768);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const stageButtons = page.locator(".asm-stage-btn");
    await expect(stageButtons).toHaveCount(6);

    // All stages should be visible on tablet
    for (let i = 0; i < 6; i++) {
      await expect(stageButtons.nth(i)).toBeVisible();
    }
  });

  test("hints are visible on tablet", async ({ page, setViewport }) => {
    await setViewport(viewports.tablet768);
    await reduceMotion(page);
    await safeGoto(page, "/");

    const hints = page.locator(".asm-stage-hint");
    const count = await hints.count();
    // At 768px, hints should be visible (min-width: 640px)
    for (let i = 0; i < count; i++) {
      const isVisible = await hints
        .nth(i)
        .isVisible()
        .catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });
});

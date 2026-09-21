import {
  checkOverflow,
  expect,
  fillStable,
  reduceMotion,
  safeGoto,
  test,
  waitForHydration,
} from "./fixtures";

/**
 * Browser coverage for the owner-reported Studio and homepage defects:
 *
 *  - a short single-line field for a long business description
 *  - one description naming two different businesses
 *  - typo / colloquial descriptions being misunderstood
 *  - oversized hero headlines filling the preview canvas
 *  - conversational commands that silently did nothing
 *  - a custom logo request answered with the generic failure message
 *
 * Runs at desktop plus the two mobile widths the brief calls out, with the
 * environment's known serial-execution constraint respected (the dev server is
 * slow to hydrate under parallel load).
 */

const studioRoute = "/website-studio";
const longDescription = [
  "I run a family clothing shop in Jaigaon that has served the town for years.",
  "We stock everyday wear, school uniforms, winter woollens and offer a small tailoring service.",
  "I want a website showing our collections, shop timings, directions and a way for customers to ask about sizes on WhatsApp.",
  "Please keep it simple enough that my staff can update the products themselves later.",
  "The shop sits near the main market, so opening hours and directions should be easy to find",
  "and each season should have a short section for new arrivals with a note about tailoring turnaround.",
  "Payment is mostly cash and UPI at the counter, and we deliver inside the town on request.",
].join(" ");

async function openStudio(page: Parameters<typeof safeGoto>[0]) {
  await reduceMotion(page);
  const errors = await safeGoto(page, studioRoute);
  await waitForHydration(page);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Describe it\.\s*Watch it become a website\./i,
    }),
  ).toBeVisible();
  return errors;
}

async function generateWebsite(
  page: Parameters<typeof safeGoto>[0],
  prompt: string,
) {
  await fillStable(
    page,
    page.getByLabel("Describe the website you want"),
    prompt,
  );
  await page.getByRole("button", { name: /Generate website/i }).click();
  await expect(page.getByTestId("studio-preview")).toBeVisible({
    timeout: 30_000,
  });
}

/** Headline + frame measurements inside the Studio preview. */
async function headlineMetrics(page: Parameters<typeof safeGoto>[0]) {
  return page.evaluate(() => {
    const frame = document.querySelector<HTMLElement>(
      ".studio-v2-preview-scroll",
    );
    const heading = frame?.querySelector<HTMLElement>("h1");
    if (!frame || !heading) return null;
    const style = window.getComputedStyle(heading);
    const rect = heading.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const lineHeight = Number.parseFloat(style.lineHeight) || 0;
    return {
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight,
      lines: lineHeight ? Math.round(rect.height / lineHeight) : 1,
      headingRight: rect.right,
      headingLeft: rect.left,
      frameRight: frameRect.right,
      frameLeft: frameRect.left,
      frameWidth: frameRect.width,
      frameScrollWidth: frame.scrollWidth,
      frameClientWidth: frame.clientWidth,
      frameHeight: frame.clientHeight,
    };
  });
}

/**
 * Measure once the reflow has settled. Container-relative type can briefly
 * resolve against the previous container size for a frame after a resize, so
 * two consecutive identical measurements are required before asserting.
 */
async function stableHeadlineMetrics(page: Parameters<typeof safeGoto>[0]) {
  let previous = await headlineMetrics(page);
  for (let attempt = 0; attempt < 12; attempt += 1) {
    await page.waitForTimeout(80);
    const current = await headlineMetrics(page);
    if (
      current &&
      previous &&
      current.fontSize === previous.fontSize &&
      current.frameWidth === previous.frameWidth
    ) {
      return current;
    }
    previous = current;
  }
  return previous;
}

test.describe("homepage business description", () => {
  test("accepts a long multi-sentence description without clipping", async ({
    page,
  }) => {
    await reduceMotion(page);
    const errors = await safeGoto(page, "/");
    await waitForHydration(page);
    await page.setViewportSize({ width: 390, height: 844 });

    const field = page.getByLabel("Describe your business");
    await expect(field).toBeVisible();
    // A real description field, not a one-line input.
    expect(await field.evaluate((node) => node.tagName)).toBe("TEXTAREA");
    expect(await field.getAttribute("maxlength")).toBe("600");

    const typed = longDescription.slice(0, 520);
    expect(typed.length).toBe(520);
    await field.fill(typed);
    const box = await field.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThan(90);

    // The full text stays visible: no truncation of what was typed.
    const value = await field.inputValue();
    expect(value.length).toBe(520);

    // Typing more than one line grows the field but never the page.
    const overflow = await checkOverflow(page);
    expect(overflow.docOverflow).toBeLessThanOrEqual(1);
    expect(errors).toHaveLength(0);
  });

  test("asks which business to build when a description names two", async ({
    page,
  }) => {
    await reduceMotion(page);
    const errors = await safeGoto(page, "/");
    await waitForHydration(page);

    await page
      .getByLabel("Describe your business")
      .fill(
        "I want a site for my clothing shop in Jaigaon and also a website for my gym",
      );
    await page.getByRole("button", { name: /Create my website/i }).click();

    const chooser = page.getByRole("group", {
      name: /more than one business idea/i,
    });
    await expect(chooser).toBeVisible();
    await expect(
      chooser.getByText(/more than one business idea/i),
    ).toBeVisible();
    // Still on the homepage: nothing was generated yet.
    await expect(page).toHaveURL(/\/$/);

    await chooser
      .getByRole("button", { name: /Clothing and fashion store/i })
      .click();
    await expect(page).toHaveURL(/\/website-studio$/);
    const preview = page.getByTestId("studio-preview");
    await expect(preview).toBeVisible({ timeout: 30_000 });
    expect(errors).toHaveLength(0);
  });

  test("understands the owner's typo and colloquial description", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);

    await page
      .getByLabel("Describe your business")
      .fill("create me a site that sells clother locally for jaigaon");
    await page.getByRole("button", { name: /Create my website/i }).click();

    const preview = page.getByTestId("studio-preview");
    await expect(preview).toBeVisible({ timeout: 30_000 });
    // A local retail shop: collections, a visit path and the town it serves.
    await expect(preview).toContainText(/collection/i);
    await expect(preview).toContainText(/Jaigaon/);
  });

  test("keeps the clarification UI usable on a small phone", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, "/");
    await waitForHydration(page);
    await page.setViewportSize({ width: 430, height: 932 });

    await page
      .getByLabel("Describe your business")
      .fill("I run a restaurant and a travel agency in Jaigaon");
    await page.getByRole("button", { name: /Create my website/i }).click();

    const chooser = page.getByRole("group", {
      name: /more than one business idea/i,
    });
    await expect(chooser).toBeVisible();

    const buttons = chooser.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let index = 0; index < count; index += 1) {
      const box = await buttons.nth(index).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
    }

    const overflow = await checkOverflow(page);
    expect(overflow.docOverflow).toBeLessThanOrEqual(1);
  });
});

test.describe("Studio typography and mobile", () => {
  test("hero headlines never fill or overflow the frame at any width", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(
      page,
      "Create a bold dramatic streetwear fashion brand website with a campaign hero and a lookbook.",
    );

    // A deliberately long heading is the hardest case for the type guards.
    const headingField = page
      .locator(".studio-v2-section-properties label")
      .filter({ hasText: "Heading" })
      .locator("input");
    await headingField.fill(
      "An extraordinarily long headline written to prove expressive typography never overflows the preview frame",
    );
    await expect(page.locator(".studio-v2-preview-scroll h1")).toContainText(
      /extraordinarily long headline/i,
    );

    for (const width of [390, 430, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      // Wait for the editor layout to settle: measuring mid-reflow reads a
      // frame that is momentarily far narrower than its final width.
      await page.waitForFunction(
        () => {
          const frame = document.querySelector(".studio-v2-preview-scroll");
          return frame ? frame.getBoundingClientRect().width >= 300 : false;
        },
        undefined,
        { timeout: 5000 },
      );
      const metrics = await stableHeadlineMetrics(page);
      expect(metrics, `no headline measured at ${width}px`).not.toBeNull();
      if (!metrics) continue;

      // Never larger than 5.25rem, whatever the width or composition.
      expect(metrics.fontSize, `font size at ${width}px`).toBeLessThanOrEqual(
        84,
      );
      // Never wider than the frame it sits in.
      expect(metrics.headingLeft).toBeGreaterThanOrEqual(metrics.frameLeft - 1);
      expect(metrics.headingRight).toBeLessThanOrEqual(metrics.frameRight + 1);
      // Never dominating the canvas with a wall of type.
      expect(metrics.lines, `line count at ${width}px`).toBeLessThanOrEqual(7);
      const frameShare = metrics.fontSize / metrics.frameWidth;
      expect(frameShare, `type scale at ${width}px`).toBeLessThanOrEqual(0.12);
      // The generated site itself never scrolls sideways.
      expect(metrics.frameScrollWidth).toBeLessThanOrEqual(
        metrics.frameClientWidth + 1,
      );
    }
  });

  test("mobile presentation controls change the rendered site", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(
      page,
      "Create a premium luxury resort website near Jaigaon with rooms, mountain views and booking enquiries.",
    );

    const mobileToggle = page.getByRole("button", { name: /^Mobile$/ });
    await mobileToggle.click();
    await expect(page.locator(".studio-v2-canvas")).toHaveClass(/is-mobile/);

    // The presentation groups are collapsed by default to keep the panel
    // readable; open the mobile one before using it.
    await page
      .locator(".studio-v2-control-group")
      .filter({ hasText: /^Mobile/ })
      .locator("summary")
      .click();

    const decoration = page.getByRole("group", {
      name: "Decoration on mobile",
    });
    await decoration.getByRole("button", { name: "Hide" }).click();
    await expect(page.locator(".studio-v2-site")).toHaveClass(
      /mobile-decor-hidden/,
    );

    const heroMode = page.getByRole("group", { name: "Mobile hero" });
    await heroMode.getByRole("button", { name: "Compact" }).click();
    await expect(page.locator(".studio-v2-site")).toHaveClass(
      /mobile-hero-compact/,
    );

    await expect(page.locator(".studio-v2-canvas")).not.toHaveClass(
      /is-changing/,
    );
  });

  test("asks for a custom logo and still receives a usable outcome", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(
      page,
      "Create a local clothing shop website with collections, new arrivals and visiting details.",
    );

    const input = page.getByLabel("Tell Studio what to change");
    await input.fill("create a huge original lion logo");
    await page.getByRole("button", { name: "Apply change" }).click();
    await expect(input).toHaveValue("", { timeout: 30_000 });
    await expect(page.locator(".studio-v2-canvas")).not.toHaveClass(
      /is-changing/,
    );

    // A supported outcome, not the generic "could not map this request" text.
    const status = page.locator(".studio-v2-status");
    await expect(status).toContainText(/emblem/i);
    await expect(status).toContainText(/image source or upload/i);
    await expect(page.getByTestId("studio-preview")).toContainText(/emblem/i);
  });

  test("adds the list a visitor dictates", async ({ page }) => {
    await openStudio(page);
    await generateWebsite(
      page,
      "Create a website that sells health supplements, protein and multivitamins with product information.",
    );

    const input = page.getByLabel("Tell Studio what to change");
    await input.fill(
      "create a list of multivitamin items and protein supplements",
    );
    await page.getByRole("button", { name: "Apply change" }).click();
    await expect(input).toHaveValue("", { timeout: 30_000 });

    const preview = page.getByTestId("studio-preview");
    await expect(preview).toContainText(/multivitamin items/i);
    await expect(preview).toContainText(/protein supplements/i);
  });

  test("loads a full premium design from the library", async ({ page }) => {
    await openStudio(page);

    await page.getByRole("tab", { name: /Browse premium designs/i }).click();
    const library = page.getByRole("region", {
      name: /premium design library/i,
    });
    await expect(library).toBeVisible();

    await library
      .getByRole("button", { name: "Technology", exact: true })
      .click();
    await library.getByTestId("design-preset-signal-grid").click();

    const preview = page.getByTestId("studio-preview");
    await expect(preview).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(".studio-v2-status")).toContainText(
      /Signal Grid/i,
    );
    await expect(preview).toHaveClass(/palette-graphite-lime/);

    const overflow = await checkOverflow(page);
    expect(overflow.docOverflow).toBeLessThanOrEqual(1);
  });
});

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
 * GSTPIXEL Website Studio V3 — browser coverage for the advanced generative
 * engine: multi-page SiteBlueprint, DesignDNA, three creative directions,
 * session versioning, page navigation inside the preview, conversational
 * page/design editing, interactive component families and session-only media.
 */

const studioRoute = "/website-studio";

const scenarios = {
  jewellery: "Create a luxury jewellery business in Bhutan",
  clothing: "Create a local clothing store in Jaigaon",
  supplements:
    "Create an online protein supplement and multivitamin shop with whey protein, daily vitamins and product information",
} as const;

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

async function generate(page: Parameters<typeof safeGoto>[0], prompt: string) {
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

async function tell(page: Parameters<typeof safeGoto>[0], instruction: string) {
  const input = page.getByLabel("Tell Studio what to change");
  await input.fill(instruction);
  await page.getByRole("button", { name: "Apply change" }).click();
  await expect(input).toHaveValue("", { timeout: 10_000 });
  await expect(page.locator(".studio-v2-canvas")).not.toHaveClass(
    /is-changing/,
  );
}

test.describe("Website Studio V3", () => {
  test("generates a multi-page website and navigates between its pages in the preview", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);

    const preview = page.getByTestId("studio-preview");
    const pages = page.getByTestId("studio-pages");
    const buttons = pages.getByRole("button");
    const pageCount = await buttons.count();
    expect(pageCount).toBeGreaterThanOrEqual(3);
    expect(pageCount).toBeLessThanOrEqual(6);

    // The generated site's own navigation is the page list, and clicking a page
    // in the preview moves the visitor to it.
    const firstSlug = await preview.getAttribute("data-page");
    expect(firstSlug).toBe("/");
    const target = buttons.nth(1);
    const label = (await target.innerText()).split("\n")[0]!.trim();
    await preview.locator("nav").getByRole("button", { name: label }).click();
    await expect(preview).not.toHaveAttribute("data-page", "/");
    await expect(preview.getByRole("heading", { level: 1 })).toBeVisible();

    // Every generated page begins with its own hero and its own heading.
    const headings = new Set<string>();
    for (let index = 0; index < pageCount; index += 1) {
      const title = (await buttons.nth(index).innerText())
        .split("\n")[0]!
        .trim();
      await buttons.nth(index).click();
      await expect(
        preview.locator(".studio-v2-site-hero").first(),
      ).toBeVisible();
      headings.add(
        (await preview.getByRole("heading", { level: 1 }).first().innerText())
          .replace(/\s+/g, " ")
          .trim(),
      );
    }
    expect(headings.size).toBeGreaterThanOrEqual(3);
  });

  test("gives different businesses genuinely different page structures", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.supplements);
    const supplementPages = await page
      .getByTestId("studio-pages")
      .getByRole("button")
      .allInnerTexts();

    await page.getByRole("button", { name: /Start a new website/i }).click();
    await generate(page, scenarios.clothing);
    const clothingPages = await page
      .getByTestId("studio-pages")
      .getByRole("button")
      .allInnerTexts();

    expect(supplementPages.join(" ")).not.toBe(clothingPages.join(" "));
  });

  test("states one design identity and applies it across every page", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);
    const identity = page.getByTestId("studio-identity");
    await expect(identity).toBeVisible();
    await expect(identity.locator("span").first()).toBeVisible();

    const preview = page.getByTestId("studio-preview");
    const palette = await preview.getAttribute("data-palette");
    const composition = await preview.getAttribute("data-composition");
    const dnaClass = (await preview.getAttribute("class"))!
      .split(" ")
      .find((token) => token.startsWith("dna-composition-"));
    expect(dnaClass).toBeTruthy();

    const buttons = page.getByTestId("studio-pages").getByRole("button");
    for (let index = 0; index < (await buttons.count()); index += 1) {
      await buttons.nth(index).click();
      await expect(preview).toHaveAttribute("data-palette", palette!);
      await expect(preview).toHaveAttribute("data-composition", composition!);
      await expect(preview).toHaveClass(/dna-composition-/);
    }
  });

  test("offers three materially different directions, previews one and keeps one", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);
    const preview = page.getByTestId("studio-preview");
    const before = await preview.getAttribute("class");

    const directionOne = page.getByTestId("studio-direction-1");
    const directionTwo = page.getByTestId("studio-direction-2");
    const directionThree = page.getByTestId("studio-direction-3");
    await expect(directionOne).toBeVisible();
    await expect(directionTwo).toBeVisible();
    await expect(directionThree).toBeVisible();

    const names = [
      await directionOne.locator("strong").innerText(),
      await directionTwo.locator("strong").innerText(),
      await directionThree.locator("strong").innerText(),
    ];
    expect(new Set(names).size).toBe(3);

    // Previewing must not commit anything.
    await directionTwo.getByRole("button", { name: "Preview" }).click();
    await expect(page.locator(".studio-v2-direction-banner")).toBeVisible();
    await page.getByRole("button", { name: /Exit preview/i }).click();
    await expect(page.locator(".studio-v2-direction-banner")).toHaveCount(0);
    await expect(preview).toHaveAttribute("class", before!);

    // Previewing direction 3 shows a genuinely different design, and choosing
    // it keeps that design as a session version.
    await directionThree.getByRole("button", { name: "Preview" }).click();
    await expect(preview).not.toHaveAttribute("class", before!);
    await page.getByTestId("use-direction").click();
    await expect(page.locator(".studio-v2-direction-banner")).toHaveCount(0);
    await expect(preview).not.toHaveAttribute("class", before!);
    await expect(page.getByTestId("studio-versions")).toContainText(
      /Direction/i,
    );
  });

  test("offers another direction on request", async ({ page }) => {
    await openStudio(page);
    await generate(page, scenarios.clothing);
    await page.getByTestId("studio-another-direction").click();
    await expect(page.locator(".studio-v2-direction-banner")).toBeVisible();
    await page.getByRole("button", { name: /Exit preview/i }).click();
    await expect(page.getByTestId("studio-direction-4")).toBeVisible();
  });

  test("keeps session versions apart, compares them and undoes inside one", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);
    const preview = page.getByTestId("studio-preview");
    const baseClass = await preview.getAttribute("class");

    // A second version from a different design.
    await page.getByRole("button", { name: /Show another version/i }).click();
    const versions = page.getByTestId("studio-versions");
    const rows = versions.getByTestId("studio-version-row");
    await expect(rows).toHaveCount(2);
    await expect(preview).not.toHaveAttribute("class", baseClass!);

    // Undo stays meaningful across the version boundary.
    await page.getByRole("button", { name: "Undo last change" }).click();
    await expect(preview).toHaveAttribute("class", baseClass!);
    await page.getByRole("button", { name: "Redo change" }).click();
    await expect(preview).not.toHaveAttribute("class", baseClass!);

    // Duplicating and switching keeps each version's own design.
    await page.getByRole("button", { name: /Duplicate this version/i }).click();
    await expect(rows).toHaveCount(3);
    const duplicateClass = await preview.getAttribute("class");

    await rows.first().getByRole("button").first().click();
    await expect(preview).toHaveAttribute("class", baseClass!);
    await rows.nth(2).getByRole("button").first().click();
    await expect(preview).toHaveAttribute("class", duplicateClass!);

    // Comparing two versions lists what actually differs.
    await rows.first().getByRole("button").nth(1).click();
    const compare = page.getByTestId("studio-compare");
    await expect(compare).toBeVisible();
    await expect(compare.locator("tbody tr").first()).toBeVisible();

    // The comparison speaks the visitor's language, not schema vocabulary.
    const labels = await compare.locator("tbody th").allInnerTexts();
    const values = await compare.locator("tbody td").allInnerTexts();
    expect(labels.join(" ")).toMatch(/Hero|Composition|Palette|Motion/);
    for (const text of [...labels, ...values]) {
      expect(text).not.toMatch(/[a-z]-[a-z]/);
    }
    // Structure is compared too, so a version that only differs in its pages
    // still reads as different.
    expect(labels.join(" ")).toMatch(/Pages/);
    expect(values.join(" ")).toMatch(/Home|hero/);

    // A duplicate is not a different design, and Studio says so rather than
    // showing an empty table.
    await rows.first().getByRole("button").nth(1).click();
    await rows.nth(1).getByRole("button").nth(1).click();
    await expect(page.getByTestId("studio-compare-identical")).toBeVisible();
  });

  test("edits pages and the design in plain language", async ({ page }) => {
    await openStudio(page);
    await generate(page, scenarios.supplements);
    const preview = page.getByTestId("studio-preview");
    const pages = page.getByTestId("studio-pages");

    await tell(page, "add an FAQ page");
    const faqPage = pages.getByRole("button", { name: /^FAQ\b/ });
    await expect(faqPage).toBeVisible();
    await faqPage.click();
    await expect(
      preview.locator(".studio-v2-site-faq.is-accordion").first(),
    ).toBeVisible();

    await tell(page, "create a booking page");
    await expect(pages.getByRole("button", { name: /^Book\b/ })).toBeVisible();

    // A named page is changed, not whichever page happens to be open, and the
    // request does not quietly invent a duplicate of a page the concept has.
    const pageCount = await pages.getByRole("button").count();
    await tell(page, "make the shop page more visual");
    await expect(page.locator(".studio-v2-status")).not.toBeEmpty();
    expect(await pages.getByRole("button").count()).toBe(pageCount);
    await pages.getByRole("button", { name: /^Shop\b/ }).click();
    await expect(
      preview.locator(".studio-v2-site-products").first(),
    ).toBeVisible();
  });

  test("exposes real interactive component families in the concept", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.supplements);

    // Commerce: a shelf of sample products with a working category filter.
    await tell(page, "add six sample protein products");
    const shelf = page
      .locator(
        ".studio-v2-interactive.is-filterable:has(.studio-v2-site-filters)",
      )
      .last();
    const products = shelf.locator(".studio-v2-site-products");
    await expect(products).toBeVisible();
    const shown = await products.locator("article").count();
    expect(shown).toBeGreaterThanOrEqual(4);

    const filters = shelf.locator(".studio-v2-site-filters");
    await expect(filters).toBeVisible();
    const filterButtons = filters.getByRole("button");
    expect(await filterButtons.count()).toBeGreaterThan(2);
    await filterButtons.nth(1).click();
    await expect(filterButtons.nth(1)).toHaveAttribute("aria-pressed", "true");
    expect(await products.locator("article").count()).toBeLessThan(shown);
    await filterButtons.first().click();
    await expect(products.locator("article")).toHaveCount(shown);

    // Content: FAQ accordion on the page that carries the questions.
    await tell(page, "add an FAQ page");
    await page
      .getByTestId("studio-pages")
      .getByRole("button", { name: /^FAQ\b/ })
      .click();
    const accordion = page.locator(".studio-v2-site-faq.is-accordion").first();
    await expect(accordion).toBeVisible();
    const firstQuestion = accordion.getByRole("button").first();
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");

    // Lead generation: an enquiry module that states it is a concept, plus a
    // booking journey the visitor can step through.
    await tell(page, "create a booking page");
    await page
      .getByTestId("studio-pages")
      .getByRole("button", { name: /^Book\b/ })
      .click();
    const enquiry = page.locator(".studio-v2-interactive.is-enquiry").first();
    await expect(enquiry).toBeVisible();
    await expect(enquiry).toContainText(
      /nothing was sent|No data leaves your browser/i,
    );

    const stepper = page.locator(".studio-v2-site-timeline.is-stepper").first();
    await expect(stepper).toBeVisible();
    const steps = stepper.getByRole("button");
    expect(await steps.count()).toBeGreaterThan(1);
    await steps.nth(1).click();
    await expect(steps.nth(1)).toHaveAttribute("aria-current", "true");
    await expect(stepper).toContainText(
      (await steps.nth(1).innerText()).split("\n").pop()!.trim(),
    );
  });

  test("integrates a session-only logo without uploading it", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);

    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
      "base64",
    );
    await page.getByTestId("studio-media-logo").setInputFiles({
      name: "logo.png",
      mimeType: "image/png",
      buffer: png,
    });
    await expect(page.locator(".studio-v2-status")).toContainText(
      /session only/i,
    );
    await expect(
      page.getByTestId("studio-preview").locator(".studio-v2-site-logo"),
    ).toBeVisible();

    await page.getByRole("button", { name: /Remove my images/i }).click();
    await expect(
      page.getByTestId("studio-preview").locator(".studio-v2-site-logo"),
    ).toHaveCount(0);
  });

  test("keeps the whole V3 surface usable at 390, 430 and 768", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.supplements);

    for (const width of ["390", "430", "768"] as const) {
      await page.getByTestId(`viewport-${width}`).click();
      const canvasWidth = await page
        .locator(".studio-v2-canvas")
        .evaluate((node) => node.getBoundingClientRect().width);
      expect(canvasWidth).toBeLessThanOrEqual(Number(width) + 1);
      await expect(page.getByTestId("studio-preview")).toBeVisible();
      // The generated website must not overflow its own viewport.
      const previewOverflow = await page
        .locator(".studio-v2-preview-scroll")
        .evaluate((node) => node.scrollWidth - node.clientWidth);
      expect(
        previewOverflow,
        `Generated site overflow at ${width}`,
      ).toBeLessThanOrEqual(1);
      const overflow = await checkOverflow(page);
      expect(overflow.docOverflow).toBeLessThanOrEqual(1);
    }

    // Mobile interpretation is a real design, not a scaled desktop.
    await expect(page.locator(".studio-v2-canvas")).toHaveClass(/is-mobile/);
    await expect(page.getByTestId("studio-preview")).toHaveAttribute(
      "data-motion-level",
      /none|subtle|premium|cinematic/,
    );
    // The identity's own mobile decisions reach the phone preview.
    await expect(page.locator(".studio-v2-site").first()).toHaveClass(
      /dna-mobile-hero-|dna-mobile-density-/,
    );

    /*
     * A multi-page concept must stay navigable on a phone: whatever the mobile
     * navigation treatment is, the generated page links have to remain
     * reachable rather than being hidden behind a desktop-only nav.
     */
    const navLinks = page.getByTestId("studio-preview").locator("nav button");
    expect(await navLinks.count()).toBeGreaterThan(1);
    for (const index of [0, 1]) {
      await expect(navLinks.nth(index)).toBeVisible();
    }
  });

  test("turns one motion request into a whole-website motion level", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);
    const preview = page.getByTestId("studio-preview");
    await expect(preview).toHaveAttribute(
      "data-motion-level",
      /none|subtle|premium|cinematic/,
    );
    const before = await preview.getAttribute("data-motion-level");

    await tell(page, "reduce the motion");
    await expect(page.locator(".studio-v2-status")).not.toBeEmpty();
    await expect(preview).toHaveAttribute("data-motion-level", "none");
    expect(before).not.toBe("none");

    // The identity states the new level instead of contradicting it.
    await expect(page.getByTestId("studio-identity")).toContainText(/Still/i);
    await expect(preview).toHaveClass(/dna-motion-none/);
  });

  test("never persists visitor content, uploads or versions", async ({
    page,
  }) => {
    await openStudio(page);
    await generate(page, scenarios.jewellery);
    await page.getByRole("button", { name: /Show another version/i }).click();
    await tell(page, "make everything darker");

    const stored = await page.evaluate(() => ({
      local: Object.keys(window.localStorage),
      session: Object.keys(window.sessionStorage),
      url: window.location.search,
    }));
    expect(stored.local).toEqual([]);
    expect(stored.session).toEqual([]);
    expect(stored.url).not.toMatch(/jewellery|bhutan|prompt/i);
  });
});

import fs from "node:fs";
import path from "node:path";
import { businessFacts } from "../../src/lib/content";
import { STUDIO_WHATSAPP_MESSAGE } from "../../src/studio/contact";
import {
  checkOverflow,
  expect,
  reduceMotion,
  safeGoto,
  test,
  waitForHydration,
} from "./fixtures";

const studioRoute = "/website-studio";
const resortPrompt =
  "Create a premium luxury resort website for a property near Jaigaon with 15 rooms, mountain views, a restaurant and booking enquiries. Use deep forest green, warm ivory and refined gold accents. Make it elegant, cinematic and modern.";
const cafePrompt =
  "Create a bright modern premium café website with warm cream backgrounds, terracotta accents, editorial photography, friendly typography and a simple menu.";

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
  prompt = resortPrompt,
) {
  await page.getByLabel("Describe the website you want").fill(prompt);
  await page.getByRole("button", { name: /Generate website/i }).click();
  await expect(page.getByText("Preparing your website")).toBeVisible();
  await expect(page.getByTestId("studio-preview")).toBeVisible({
    timeout: 10_000,
  });
}

async function tellStudio(
  page: Parameters<typeof safeGoto>[0],
  instruction: string,
) {
  const input = page.getByLabel("Tell Studio what to change");
  const apply = page.getByRole("button", { name: "Apply change" });
  await input.fill(instruction);
  await apply.click();
  await expect(input).toHaveValue("", { timeout: 10_000 });
  await expect(page.locator(".studio-v2-canvas")).not.toHaveClass(
    /is-changing/,
  );
  await expect(page.locator(".studio-v2-status")).not.toContainText(
    /Understanding|Planning changes|Applying/,
  );
}

test.describe("Website Studio V2", () => {
  test("loads directly and preserves normal browser navigation", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, "/");
    await page.goto(studioRoute, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Describe it.",
    );
    await page.goBack({ waitUntil: "load" });
    await expect(page).toHaveURL(/\/$/);
    await page.goForward({ waitUntil: "load" });
    await expect(page).toHaveURL(/\/website-studio$/);
    await expect(
      page.getByLabel("Describe the website you want"),
    ).toBeVisible();
  });

  test("generates the flagship resort through deterministic fallback", async ({
    page,
  }) => {
    await page.route("**/api/studio-build", async (route) => route.abort());
    const errors = await openStudio(page);
    await generateWebsite(page);

    const preview = page.getByTestId("studio-preview");
    await expect(preview).toHaveAttribute("data-palette", "forest-gold");
    await expect(preview).toHaveAttribute("data-mood", /luxury|cinematic/);
    await expect(preview).toContainText("MOUNTAIN HOUSE");
    await expect(preview).toContainText("Fifteen considered rooms");
    await expect(preview).toContainText("Rooms & private stays");
    await expect(preview).toContainText("The restaurant");
    await expect(
      preview.locator('[data-section-type="gallery"]'),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Website generated with Studio’s resilient design system.",
      ),
    ).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("creates a structurally different café rather than recolouring the resort", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page, cafePrompt);
    const preview = page.getByTestId("studio-preview");
    await expect(preview).toHaveAttribute("data-palette", "ivory-terracotta");
    await expect(preview).toContainText("COMMON GROUND CAFÉ");
    await expect(preview).toContainText(
      "Made for morning rituals and long lunches.",
    );
    await expect(preview.locator(".studio-v2-site-hero")).toHaveClass(
      /variant-split-composition/,
    );
    await expect(preview.locator('[data-section-type="listings"]')).toHaveCount(
      0,
    );
  });

  test("switches between desktop and responsive mobile preview", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const canvas = page.locator(".studio-v2-canvas");
    await expect(canvas).toHaveClass(/is-desktop/);
    await page.getByRole("button", { name: /Mobile/i }).click();
    await expect(canvas).toHaveClass(/is-mobile/);
    const widths = await canvas.evaluate((node) => ({
      canvas: node.getBoundingClientRect().width,
      viewport: window.innerWidth,
    }));
    expect(widths.canvas).toBeLessThan(Math.min(widths.viewport, 430));
    await expect(
      page.getByTestId("studio-preview").locator("nav"),
    ).toBeHidden();
  });

  test("applies palette, mood, hero, copy, section and page instructions", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const preview = page.getByTestId("studio-preview");

    await tellStudio(page, "Change the colors to black and champagne gold.");
    await expect(preview).toHaveAttribute("data-palette", "midnight-champagne");
    await tellStudio(page, "Make it more luxurious.");
    await expect(preview).toHaveAttribute("data-mood", "luxury");
    await tellStudio(page, "Make the hero more cinematic.");
    await expect(preview.locator(".studio-v2-site-hero")).toHaveClass(
      /variant-cinematic-editorial/,
    );
    await tellStudio(
      page,
      'Change the headline to "A private horizon of your own."',
    );
    await expect(preview.getByRole("heading", { level: 1 })).toContainText(
      "A private horizon of your own.",
    );

    await tellStudio(page, "Add testimonials.");
    await expect(
      preview.locator('[data-section-type="testimonials"]'),
    ).toBeVisible();
    await tellStudio(page, "Remove testimonials.");
    await expect(
      preview.locator('[data-section-type="testimonials"]'),
    ).toHaveCount(0);

    await tellStudio(page, "Move gallery above rooms.");
    const order = await preview
      .locator("[data-section-type]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-section-type")),
      );
    expect(order.indexOf("gallery")).toBeLessThan(order.indexOf("listings"));

    await tellStudio(page, "Add an About page.");
    await expect(
      page.getByRole("button", { name: /^About\s+3$/ }),
    ).toBeVisible();
  });

  test("shows context-aware suggestions for selected sections and mobile mode", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);

    const suggestions = page.getByLabel("Suggested changes");
    await expect(
      suggestions.getByRole("button", {
        name: "Make this hero more cinematic",
      }),
    ).toBeVisible();
    await expect(
      suggestions.getByRole("button", { name: "Reduce the hero height" }),
    ).toBeVisible();

    await page
      .getByTestId("studio-preview")
      .locator('[data-section-type="services"]')
      .click();
    await expect(
      suggestions.getByRole("button", {
        name: "Make these services easier to scan",
      }),
    ).toBeVisible();
    await expect(
      suggestions.getByRole("button", { name: "Try a more editorial layout" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Mobile/i }).click();
    await expect(
      suggestions.getByRole("button", { name: "Simplify this for mobile" }),
    ).toBeVisible();
    await expect(suggestions).not.toContainText("testimpnoal");
  });

  test("executes a multi-intent instruction as one undoable transaction", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const preview = page.getByTestId("studio-preview");
    const originalPalette = await preview.getAttribute("data-palette");
    const originalOrder = await preview
      .locator("[data-section-type]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-section-type")),
      );
    const originalGalleryCount = await preview
      .locator('[data-section-type="gallery"]')
      .count();

    await tellStudio(
      page,
      "Make it all black, shorten the hero, move services above about, and add a gallery after services.",
    );
    await expect(preview).toHaveAttribute("data-palette", "midnight-champagne");
    await expect(preview.locator(".studio-v2-site-hero")).toHaveClass(
      /height-compact/,
    );
    const changedOrder = await preview
      .locator("[data-section-type]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-section-type")),
      );
    expect(changedOrder.indexOf("services")).toBeLessThan(
      changedOrder.indexOf("about"),
    );
    await expect(preview.locator('[data-section-type="gallery"]')).toHaveCount(
      originalGalleryCount + 1,
    );
    await expect(page.locator(".studio-v2-status")).toContainText(
      /updated|refined|added|reordered/i,
    );

    await page.getByRole("button", { name: "Undo last change" }).click();
    await expect(preview).toHaveAttribute("data-palette", originalPalette!);
    expect(
      await preview
        .locator("[data-section-type]")
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute("data-section-type")),
        ),
    ).toEqual(originalOrder);
    await expect(preview.locator('[data-section-type="gallery"]')).toHaveCount(
      originalGalleryCount,
    );
  });

  test("keeps a short natural-language conversation scoped to the hero", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const hero = page
      .getByTestId("studio-preview")
      .locator('[data-section-type="hero"] section');

    await tellStudio(page, "Make the hero dark.");
    await expect(hero).toHaveClass(/tone-dark/);
    await tellStudio(page, "More dramatic.");
    await expect(hero).toHaveClass(/tone-dark/);
    await expect(hero).toHaveClass(/height-immersive/);
    await tellStudio(page, "Keep the darkness but make the text smaller.");
    await expect(hero).toHaveClass(/tone-dark/);
    await expect(hero).toHaveClass(/text-compact/);
  });

  test("respects selected-section scope and mobile-only scope", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const preview = page.getByTestId("studio-preview");
    const originalPalette = await preview.getAttribute("data-palette");

    const about = preview.locator('[data-section-type="about"]');
    await about.click();
    await tellStudio(page, "Change only this section to black.");
    await expect(about.locator("section")).toHaveClass(/tone-dark/);
    await expect(preview).toHaveAttribute("data-palette", originalPalette!);

    const originalMood = await preview.getAttribute("data-mood");
    await page.getByRole("button", { name: /Mobile/i }).click();
    await tellStudio(page, "Make mobile cleaner but don't change desktop.");
    await expect(preview).toHaveClass(/mobile-simplified/);
    await expect(preview).toHaveClass(/mobile-nav-minimal/);
    await expect(preview).toHaveAttribute("data-palette", originalPalette!);
    await expect(preview).toHaveAttribute("data-mood", originalMood!);
  });

  test("reports unsupported logo uploads without changing history", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const undo = page.getByRole("button", { name: "Undo last change" });
    await expect(undo).toBeDisabled();
    await tellStudio(page, "Put my logo in the navigation.");
    await expect(page.locator(".studio-v2-status")).toContainText(
      "actual logo file",
    );
    await expect(undo).toBeDisabled();
  });

  test("produces an alternate version and supports undo and redo", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const preview = page.getByTestId("studio-preview");
    const originalPalette = await preview.getAttribute("data-palette");
    const originalHero = await preview
      .locator(".studio-v2-site-hero")
      .getAttribute("class");

    await page.getByRole("button", { name: /Show another version/i }).click();
    await expect(
      page.getByText("A substantially different visual version is ready."),
    ).toBeVisible();
    expect(await preview.getAttribute("data-palette")).not.toBe(
      originalPalette,
    );
    expect(
      await preview.locator(".studio-v2-site-hero").getAttribute("class"),
    ).not.toBe(originalHero);

    await page.getByRole("button", { name: "Undo last change" }).click();
    await expect(preview).toHaveAttribute("data-palette", originalPalette!);
    await page.getByRole("button", { name: "Redo change" }).click();
    await expect(preview).not.toHaveAttribute("data-palette", originalPalette!);
  });

  test("manual controls add, edit, vary, move and remove real sections", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    const preview = page.getByTestId("studio-preview");

    await page.getByLabel("Add section").selectOption("testimonials");
    await page
      .getByRole("button", { name: "Add testimonials section" })
      .click();
    await expect(
      preview.locator('[data-section-type="testimonials"]'),
    ).toBeVisible();

    await page
      .getByLabel("Heading")
      .fill("Verified guest stories belong here.");
    await expect(preview).toContainText("Verified guest stories belong here.");
    await page.getByLabel("Layout variant").selectOption("editorial-quotes");
    await expect(
      preview.locator('[data-section-type="testimonials"] section'),
    ).toHaveClass(/variant-editorial-quotes/);
    await page.getByRole("button", { name: /^Up$/ }).click();
    await expect(page.getByText("Section moved up.")).toBeVisible();
    await page.getByRole("button", { name: "Remove" }).click();
    await expect(
      preview.locator('[data-section-type="testimonials"]'),
    ).toHaveCount(0);
  });

  test("uses canonical WhatsApp text and never persists visitor content", async ({
    page,
  }) => {
    await openStudio(page);
    await generateWebsite(page);
    await tellStudio(
      page,
      'Change the headline to "Still Ridge private retreat."',
    );

    const href = await page.getByTestId("studio-whatsapp").getAttribute("href");
    const actual = new URL(href!);
    const canonical = new URL(businessFacts.whatsapp.href);
    expect(`${actual.origin}${actual.pathname}`).toBe(
      `${canonical.origin}${canonical.pathname}`,
    );
    expect(actual.searchParams.get("text")).toBe(STUDIO_WHATSAPP_MESSAGE);
    expect(decodeURIComponent(actual.search).toLowerCase()).not.toContain(
      "still ridge",
    );

    const storage = await page.evaluate(() => ({
      local: Object.fromEntries(
        Array.from({ length: localStorage.length }, (_, index) => {
          const key = localStorage.key(index) ?? "";
          return [key, localStorage.getItem(key)];
        }),
      ),
      session: Object.fromEntries(
        Array.from({ length: sessionStorage.length }, (_, index) => {
          const key = sessionStorage.key(index) ?? "";
          return [key, sessionStorage.getItem(key)];
        }),
      ),
    }));
    expect(JSON.stringify(storage).toLowerCase()).not.toContain("still ridge");
    expect(JSON.stringify(storage).toLowerCase()).not.toContain(
      "mountain views",
    );
    expect(
      Object.keys(storage.local).some((key) => key.includes("studio")),
    ).toBe(false);
    expect(
      Object.keys(storage.session).some((key) => key.includes("studio")),
    ).toBe(false);
  });

  test("supports keyboard section selection under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await safeGoto(page, studioRoute);
    await waitForHydration(page);
    await generateWebsite(page);

    const gallery = page
      .getByTestId("studio-preview")
      .locator('[data-section-type="gallery"]');
    await gallery.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Selected section")).toBeVisible();
    await expect(page.getByLabel("Layout variant")).toHaveValue(
      "cinematic-mosaic",
    );
    expect(
      await page
        .locator(".studio-v2-change-sweep")
        .evaluate((node) => getComputedStyle(node).animationName),
    ).toBe("none");
  });

  test("runs generation and modification without serious browser or network errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      if (!request.url().includes("fonts.googleapis.com")) {
        failedRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    await openStudio(page);
    await generateWebsite(page);
    await tellStudio(
      page,
      "Use a lighter design and make the hero more cinematic.",
    );
    await expect(page.getByTestId("studio-preview")).toHaveAttribute(
      "data-palette",
      "paper-ink",
    );
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
});

for (const viewport of [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "desktop-1440", width: 1440, height: 900 },
] as const) {
  test(`Website Studio V2 visual QA @ ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await openStudio(page);
    const directory = path.join(
      process.cwd(),
      "qa-screenshots",
      "website-studio-v2",
    );
    fs.mkdirSync(directory, { recursive: true });
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.join(directory, `${viewport.name}-landing.png`),
      fullPage: true,
    });
    await generateWebsite(page);
    const overflow = await checkOverflow(page);
    expect(
      overflow.docOverflow,
      `Studio V2 overflow @ ${viewport.name}: ${JSON.stringify(overflow)}`,
    ).toBeLessThanOrEqual(2);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.join(directory, `${viewport.name}-editor.png`),
      fullPage: true,
    });
  });
}

const businessVisualMatrix = [
  {
    slug: "luxury-resort",
    prompt: resortPrompt,
    hero: "hospitality-focused",
  },
  {
    slug: "cafe",
    prompt: cafePrompt,
    hero: "split-composition",
  },
  {
    slug: "fitness-studio",
    prompt:
      "Create a bold high-energy fitness studio website with programs, coaches, memberships and a trial enquiry.",
    hero: "bold-typographic",
  },
  {
    slug: "technology-company",
    prompt:
      "Create a minimal futuristic Apple-style technology company website for a premium software platform.",
    hero: "minimal-luxury",
  },
  {
    slug: "travel-agency",
    prompt:
      "Create a cinematic travel agency website with destinations, signature journeys and direct enquiries.",
    hero: "immersive-image",
  },
  {
    slug: "professional-services",
    prompt:
      "Create a sophisticated professional services website with expertise, process and contact.",
    hero: "split-composition",
  },
  {
    slug: "online-shop",
    prompt:
      "Create a premium online shop for considered home objects, product collections and editorial storytelling.",
    hero: "product-focused",
  },
] as const;

test("Website Studio V2 seven-business visual matrix", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const directory = path.join(
    process.cwd(),
    "qa-screenshots",
    "website-studio-intelligence",
  );
  fs.mkdirSync(directory, { recursive: true });
  const signatures: string[] = [];

  for (const business of businessVisualMatrix) {
    await openStudio(page);
    await generateWebsite(page, business.prompt);
    const preview = page.getByTestId("studio-preview");
    await expect(preview.locator(".studio-v2-site-hero")).toHaveClass(
      new RegExp(`variant-${business.hero}`),
    );
    const signature = await preview
      .locator("[data-section-type]")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => {
            const section = node.querySelector("section");
            return `${node.getAttribute("data-section-type")}:${section?.className ?? ""}`;
          })
          .join("|"),
      );
    signatures.push(signature);
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.join(directory, `${business.slug}.png`),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Start a new website" }).click();
  }

  expect(new Set(signatures).size).toBe(businessVisualMatrix.length);
});

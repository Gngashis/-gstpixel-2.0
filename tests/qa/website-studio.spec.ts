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
  await page.getByLabel("Tell Studio what to change").fill(instruction);
  await page.getByRole("button", { name: "Apply change" }).click();
  await expect(
    page.getByText("Your instruction changed the website."),
  ).toBeVisible();
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

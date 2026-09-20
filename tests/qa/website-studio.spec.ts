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

async function chooseHotelCinematic(page: Parameters<typeof safeGoto>[0]) {
  await page.getByRole("button", { name: /Hotel \/ Resort/i }).click();
  await expect(
    page.getByRole("heading", { name: "Choose how it should feel." }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Feel it first Cinematic/i }).click();
  await expect(page.getByTestId("studio-preview")).toBeVisible();
}

test.describe("Website Studio deterministic core", () => {
  test("progressively reveals every supported business category", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, studioRoute);
    await waitForHydration(page);

    await expect(
      page.getByRole("button", { name: /Retail \/ Commerce/i }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: /Show more business types/i })
      .click();

    await expect(
      page.getByRole("button", { name: /Retail \/ Commerce/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Professional \/ Corporate/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Gym \/ Fitness/i }),
    ).toBeVisible();
  });

  test("preserves normal browser back and forward navigation", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, "/");
    await page.goto(studioRoute, { waitUntil: "load" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Choose your business",
    );

    await page.goBack({ waitUntil: "load" });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#main")).toContainText("GSTPIXEL");

    await page.goForward({ waitUntil: "load" });
    await expect(page).toHaveURL(/\/website-studio$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Choose your business",
    );
  });

  test("loads directly, refreshes, and completes the core flow", async ({
    page,
    setViewport,
  }) => {
    await setViewport({ name: "mobile-390", width: 390, height: 844 });
    await reduceMotion(page);
    const errors = await safeGoto(page, studioRoute);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Choose your business",
    );
    await page.reload({ waitUntil: "load" });
    await expect(
      page.getByRole("button", { name: /Hotel \/ Resort/i }),
    ).toBeVisible();
    await waitForHydration(page);

    await chooseHotelCinematic(page);
    await expect(page.getByTestId("studio-preview")).toHaveAttribute(
      "data-business",
      "hotel",
    );
    await expect(page.getByTestId("studio-preview")).toHaveAttribute(
      "data-direction",
      "cinematic",
    );
    await expect(page.getByText("Rooms", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Book / Enquire", { exact: true }),
    ).toBeVisible();
    expect(errors).toHaveLength(0);
  });

  test("uses canonical WhatsApp contact with a generic message only", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, studioRoute);
    await waitForHydration(page);
    await chooseHotelCinematic(page);

    const href = await page.getByTestId("studio-whatsapp").getAttribute("href");
    expect(href).toBeTruthy();

    const actual = new URL(href!);
    const canonical = new URL(businessFacts.whatsapp.href);
    expect(`${actual.origin}${actual.pathname}`).toBe(
      `${canonical.origin}${canonical.pathname}`,
    );
    expect(actual.searchParams.get("text")).toBe(STUDIO_WHATSAPP_MESSAGE);

    const transmitted = decodeURIComponent(actual.search).toLowerCase();
    expect(transmitted).not.toContain("hotel");
    expect(transmitted).not.toContain("cinematic");
    expect(transmitted).not.toContain("direction");
  });

  test("supports keyboard-only business and direction selection", async ({
    page,
  }) => {
    await reduceMotion(page);
    await safeGoto(page, studioRoute);
    await waitForHydration(page);

    const hotel = page.getByRole("button", { name: /Hotel \/ Resort/i });
    await hotel.focus();
    await expect(hotel).toBeFocused();
    await page.keyboard.press("Enter");

    const directionHeading = page.getByRole("heading", {
      name: "Choose how it should feel.",
    });
    await expect(directionHeading).toBeFocused();

    const refined = page.getByRole("button", {
      name: /^Clarity with presence Refined/i,
    });
    await refined.focus();
    await page.keyboard.press("Space");

    await expect(page.getByTestId("studio-preview")).toHaveAttribute(
      "data-direction",
      "refined",
    );
    await expect(
      page.getByRole("heading", {
        name: "Your direction is ready to experience.",
      }),
    ).toBeFocused();
  });

  test("remains understandable with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await safeGoto(page, studioRoute);
    await waitForHydration(page);
    await chooseHotelCinematic(page);

    const animationNames = await page.evaluate(() => ({
      ambient: getComputedStyle(document.querySelector(".studio-ambient span")!)
        .animationName,
      preview: getComputedStyle(
        document.querySelector(".studio-art-orbit-one")!,
      ).animationName,
    }));
    expect(animationNames).toEqual({ ambient: "none", preview: "none" });
    await expect(page.getByText("Build this for my business.")).toBeVisible();
  });
});

const visualViewports = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
] as const;

for (const viewport of visualViewports) {
  test(`Website Studio visual QA @ ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await reduceMotion(page);
    await safeGoto(page, studioRoute);
    await waitForHydration(page);

    const dir = path.join(process.cwd(), "qa-screenshots", "website-studio");
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({
      path: path.join(dir, `${viewport.name}-entry.png`),
      fullPage: true,
    });

    await page.getByRole("button", { name: /Hotel \/ Resort/i }).click();
    await expect(
      page.getByRole("heading", { name: "Choose how it should feel." }),
    ).toBeVisible();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: path.join(dir, `${viewport.name}-directions.png`),
      fullPage: true,
    });

    await page
      .getByRole("button", { name: /^Feel it first Cinematic/i })
      .click();
    await expect(page.getByTestId("studio-preview")).toBeVisible();

    const overflow = await checkOverflow(page);
    expect(
      overflow.docOverflow,
      `Studio horizontal overflow @ ${viewport.name}: ${JSON.stringify(overflow)}`,
    ).toBeLessThanOrEqual(2);

    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    await page.screenshot({
      path: path.join(dir, `${viewport.name}.png`),
      fullPage: true,
    });
  });
}

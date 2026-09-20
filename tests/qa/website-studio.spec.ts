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

async function chooseBusinessDirection(
  page: Parameters<typeof safeGoto>[0],
  business:
    | "Hotel / Resort"
    | "Tours & Travel"
    | "Restaurant / Café"
    | "Retail / Commerce"
    | "Professional / Corporate"
    | "Gym / Fitness",
  direction: "Cinematic" | "Refined" | "Bold",
) {
  const businessButton = page.getByRole("button", {
    name: new RegExp(business),
  });
  if ((await businessButton.count()) === 0) {
    await page
      .getByRole("button", { name: /Show more business types/i })
      .click();
  }
  await businessButton.click();
  await expect(
    page.getByRole("heading", { name: "Choose how it should feel." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: new RegExp(`${direction}`, "i") })
    .click();
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

  for (const direction of ["Cinematic", "Refined", "Bold"] as const) {
    test(`renders the Hotel / Resort flagship in the ${direction} direction`, async ({
      page,
    }) => {
      await reduceMotion(page);
      await safeGoto(page, studioRoute);
      await waitForHydration(page);
      await chooseBusinessDirection(page, "Hotel / Resort", direction);

      await expect(page.getByTestId("studio-preview")).toHaveAttribute(
        "data-business",
        "hotel",
      );
      await expect(page.getByTestId("studio-hotel-flagship")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Two quiet ways to arrive." }),
      ).toBeVisible();
      await expect(
        page.getByText("Valley Suite", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Forest House", { exact: true }),
      ).toBeVisible();
      await expect(page.getByTestId("studio-tours-flagship")).toHaveCount(0);
    });

    test(`renders the Tours & Travel flagship in the ${direction} direction`, async ({
      page,
    }) => {
      await reduceMotion(page);
      await safeGoto(page, studioRoute);
      await waitForHydration(page);
      await chooseBusinessDirection(page, "Tours & Travel", direction);

      await expect(page.getByTestId("studio-preview")).toHaveAttribute(
        "data-business",
        "tours",
      );
      await expect(page.getByTestId("studio-tours-flagship")).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Valleys, dzongs and high passes.",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "The journey, understood at a glance.",
        }),
      ).toBeVisible();
      await expect(page.getByText("8 days", { exact: true })).toBeVisible();
      await expect(page.getByTestId("studio-hotel-flagship")).toHaveCount(0);
    });
  }

  const phaseThreeExperiences = [
    {
      business: "Restaurant / Café",
      id: "restaurant",
      testId: "studio-restaurant-flagship",
      headings: ["Tonight’s short menu.", "Sourced within the valley."],
      detail: "Fire-grilled river trout, red rice",
    },
    {
      business: "Retail / Commerce",
      id: "retail",
      testId: "studio-retail-flagship",
      headings: ["Built to be used daily.", "A shop that stays reachable."],
      detail: "Turned bowl",
    },
    {
      business: "Professional / Corporate",
      id: "professional",
      testId: "studio-professional-flagship",
      headings: [
        "We work on decisions that do not get a second try.",
        "How an engagement actually runs.",
      ],
      detail: "Fixed scope, named team",
    },
    {
      business: "Gym / Fitness",
      id: "gym",
      testId: "studio-gym-flagship",
      headings: [
        "A timetable you can plan around.",
        "Two ways in. No lock-ins.",
      ],
      detail: "Nu 6,500 / month",
    },
  ] as const;

  for (const experience of phaseThreeExperiences) {
    for (const direction of ["Cinematic", "Refined", "Bold"] as const) {
      test(`renders the ${experience.business} flagship in the ${direction} direction`, async ({
        page,
      }) => {
        await reduceMotion(page);
        await safeGoto(page, studioRoute);
        await waitForHydration(page);
        await chooseBusinessDirection(page, experience.business, direction);

        await expect(page.getByTestId("studio-preview")).toHaveAttribute(
          "data-business",
          experience.id,
        );
        await expect(page.getByTestId("studio-preview")).toHaveAttribute(
          "data-direction",
          direction.toLowerCase(),
        );
        await expect(page.getByTestId(experience.testId)).toBeVisible();
        for (const heading of experience.headings) {
          await expect(
            page.getByRole("heading", { name: heading }),
          ).toBeVisible();
        }
        await expect(
          page.getByText(experience.detail, { exact: true }),
        ).toBeVisible();
        await expect(page.locator(".studio-preview-art")).toHaveCount(0);
      });
    }
  }

  test("keeps all six flagship experiences within a 360px mobile viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await reduceMotion(page);
    await safeGoto(page, studioRoute);
    await waitForHydration(page);
    const businesses = [
      "Hotel / Resort",
      "Tours & Travel",
      "Restaurant / Café",
      "Retail / Commerce",
      "Professional / Corporate",
      "Gym / Fitness",
    ] as const;

    for (const [index, business] of businesses.entries()) {
      if (index > 0) {
        await page.getByRole("button", { name: /Start again/i }).click();
      }
      await chooseBusinessDirection(page, business, "Cinematic");
      expect(
        (await checkOverflow(page)).docOverflow,
        `${business} overflowed at 360px`,
      ).toBeLessThanOrEqual(2);
    }
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
      preview: getComputedStyle(document.querySelector(".studio-hotel-sun")!)
        .animationName,
    }));
    expect(animationNames).toEqual({ ambient: "none", preview: "none" });
    await expect(page.getByText("Build this for my business.")).toBeVisible();

    await page.getByRole("button", { name: /Start again/i }).click();
    await chooseBusinessDirection(page, "Restaurant / Café", "Cinematic");
    const phaseThreeAnimation = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector(".studio-dining-steam")!)
          .animationName,
    );
    expect(phaseThreeAnimation).toBe("none");
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

    const phaseThreeVisuals = [
      { business: "Restaurant / Café", slug: "restaurant" },
      { business: "Retail / Commerce", slug: "retail" },
      { business: "Professional / Corporate", slug: "professional" },
      { business: "Gym / Fitness", slug: "gym" },
    ] as const;

    for (const experience of phaseThreeVisuals) {
      await page.getByRole("button", { name: /Start again/i }).click();
      await chooseBusinessDirection(page, experience.business, "Cinematic");
      const experienceOverflow = await checkOverflow(page);
      expect(
        experienceOverflow.docOverflow,
        `${experience.business} horizontal overflow @ ${viewport.name}: ${JSON.stringify(experienceOverflow)}`,
      ).toBeLessThanOrEqual(2);
      await page.evaluate(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.screenshot({
        path: path.join(
          dir,
          `${viewport.name}-${experience.slug}-cinematic.png`,
        ),
        fullPage: true,
      });
    }
  });
}

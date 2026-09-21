import {
  test as base,
  expect,
  type Page,
  type Locator,
} from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * GSTPIXEL browser QA shared fixtures and helpers.
 *
 * Design goals:
 * - Lightweight, zero recurring cost, fully local.
 * - Durable structural/visual smoke checks rather than brittle pixel assertions.
 * - Reveal real rendering, overflow, navigation, and form defects without
 *   depending on paid services, accounts, or external network access.
 */

/**
 * Core responsive targets. Kept intentionally small so the matrix stays fast
 * while still covering desktop, tablet, and two mobile extremes.
 */
export const viewports = {
  desktop1440: { name: "desktop-1440", width: 1440, height: 900 },
  tablet768: { name: "tablet-768", width: 768, height: 1024 },
  mobile390: { name: "mobile-390", width: 390, height: 844 },
  mobile320: { name: "mobile-320", width: 320, height: 700 },
} as const;

export type ViewportKey = keyof typeof viewports;
export type ViewportSpec = (typeof viewports)[ViewportKey];

/** Human-readable route labels for reports and screenshot paths. */
export const routeLabels: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/services": "services-index",
  "/services/websites-digital-platforms": "service-websites",
  "/solutions": "solutions-index",
  "/solutions/start-a-business": "solution-start-a-business",
  "/work": "work-index",
  "/work/atlas-stay": "work-atlas-stay",
  "/tools": "tools-index",
  "/tools/project-estimator": "tool-project-estimator",
  "/tools/gst-calculator": "tool-gst-calculator",
  "/start-your-project": "start-your-project",
  "/contact": "contact",
};

/** All routes under test. */
export const routes = Object.keys(routeLabels);

/** Verified content that must actually render per route (HTTP 200 is not enough). */
export const expectedContentByRoute: Record<string, string[]> = {
  "/": ["GSTPIXEL", "Start Right", "Stay Compliant", "Grow Online"],
  "/about": ["About", "Built around connected business needs"],
  "/services": ["Services", "Digital Development", "Business Services"],
  "/services/websites-digital-platforms": [
    "Websites & digital platforms",
    "Who it is for",
  ],
  "/solutions": ["Solutions", "Start a business", "Create a website"],
  "/solutions/start-a-business": ["Start a business", "essential"],
  "/work": ["Work", "Concept Lab", "Exploration without invented proof"],
  "/work/atlas-stay": ["Atlas Stay", "Luxury travel"],
  "/tools": ["Useful tools", "Project estimator", "GST calculator"],
  "/tools/project-estimator": ["Project estimator", "scope"],
  "/tools/gst-calculator": ["GST calculator", "rate"],
  "/start-your-project": ["Start your project", "clearer brief"],
  "/contact": ["Contact", "Jaigaon"],
};

const screenshotDir = path.join(process.cwd(), "qa-screenshots");

function sanitize(name: string) {
  return name.replace(/[^a-z0-9_-]/gi, "-").replace(/-+/g, "-");
}

/**
 * Measure horizontal overflow at the document level and report the real DOM
 * elements (excluding pseudo-elements) whose right edge escapes the viewport.
 *
 * documentElement.scrollWidth is the authoritative "does the user see a
 * horizontal scrollbar" signal. Decorative elements such as `.env-section::before`
 * (which uses `inset: -50%`) inflate it — that inflation is precisely the defect
 * we want to surface at >=768px, so it is reported rather than silently ignored.
 */
export async function checkOverflow(page: Page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const clientWidth = de.clientWidth;
    const docOverflow = de.scrollWidth - clientWidth;

    const offenders: Array<{
      tag: string;
      cls: string;
      left: number;
      right: number;
    }> = [];
    for (const node of Array.from(document.querySelectorAll("*"))) {
      const r = node.getBoundingClientRect();
      if (r.right > clientWidth + 1) {
        offenders.push({
          tag: node.tagName.toLowerCase(),
          cls:
            typeof node.className === "string"
              ? node.className.trim().split(/\s+/).slice(0, 2).join(" ")
              : "",
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    offenders.sort((a, b) => b.right - a.right);
    return {
      docOverflow,
      clientWidth,
      scrollWidth: de.scrollWidth,
      offenders: offenders.slice(0, 6),
    };
  });
}

/**
 * Durable shared assertions used across route smoke tests.
 * Verifies real content renders and the shell is intact. Avoids brittle pixel
 * comparisons. Horizontal overflow is asserted separately (see overflow.spec.ts)
 * so that rendering health and overflow defects are reported distinctly.
 */
export async function assertPageHealthy(
  page: Page,
  options: {
    route: string;
    viewport: ViewportSpec;
    expectedContent?: string[];
    expectsLandmarks?: boolean;
  },
) {
  const { route, viewport } = options;

  // "networkidle" is unreliable against the Vite dev server (HMR/WebSocket
  // keeps connections alive and can stall under load), so wait for load and
  // rely on the auto-retrying content assertions below instead.
  await page.waitForLoadState("load");

  // No root error boundary / fatal render failure.
  const bodyText = await page.locator("body").innerText();
  const lower = bodyText.toLowerCase();
  expect(lower).not.toContain("this page didn't load");
  expect(lower).not.toContain("something went wrong on our end");

  // Critical content expectations (case-insensitive substring match).
  if (options.expectedContent) {
    for (const text of options.expectedContent) {
      await expect(
        page.locator("body"),
        `expected content "${text}" missing on ${route} @ ${viewport.name}`,
      ).toContainText(text, { ignoreCase: true });
    }
  }

  // Shell landmarks. Use #main (the site shell's landmark) rather than the
  // generic `main` role, which can resolve to more than one element while the
  // not-found recovery page (<main class="recovery-page">) is nested inside it.
  if (options.expectsLandmarks ?? true) {
    await expect(page.locator("header.site-header")).toBeVisible();
    await expect(page.locator("#main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  }
}

/**
 * Capture a full-page screenshot for human visual comparison.
 * Animations are stabilized via reduced-motion so continuously animated
 * backgrounds do not make screenshots non-deterministic.
 */
export async function captureScreenshot(
  page: Page,
  route: string,
  viewport: ViewportSpec,
) {
  const label = routeLabels[route] ?? sanitize(route);
  const dir = path.join(screenshotDir, label);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${viewport.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

/**
 * Wait until the app has hydrated so click handlers are actually attached.
 *
 * TanStack Start renders SSR markup before the client takes over. Until the
 * router has hydrated, React's event delegation is not in place, so clicks on
 * interactive elements (the mobile-nav toggle, the enquiry Continue button)
 * are silently dropped and nothing happens. That makes interaction tests race
 * the hydration step and flake.
 *
 * `window.__TSR_ROUTER__` is set by the TanStack Start client only after it has
 * created the router and begun hydrating the SSR tree, so checking for it is a
 * deterministic readiness condition (an actual DOM/state change) rather than an
 * arbitrary sleep. It is empty/false before hydration and a router instance
 * after, so it also snaps back only on a real navigation.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => "__TSR_ROUTER__" in window, undefined, {
    timeout: 10000,
  });
  /* The router marker appears when the client *starts* hydrating, which is still
     too early to click: React overwrites the SSR markup with its own tree in a
     later commit, and anything typed into a controlled input before that commit
     is wiped by it. Under load (several QC browsers on one dev server) hydration
     can take far longer than a couple of frames, so frame-counting is not a
     readiness signal.

     React attaches its bookkeeping keys (`__reactFiber$…`, `__reactProps$…`) to
     DOM nodes as it hydrates, so the presence of one of those keys on a node
     inside the page is a real "the app accepts input now" signal. It is a
     best-effort probe: on timeout the suite continues, so a page without React
     markers fails its own assertions rather than hanging here. */
  await page
    .waitForFunction(
      () => {
        const roots = Array.from(
          document.querySelectorAll(
            "main, form, header, button, input, textarea",
          ),
        ).slice(0, 400);
        const hasReactKey = (node: Element) =>
          Object.keys(node).some((key) => key.startsWith("__react"));
        return roots.some(hasReactKey);
      },
      undefined,
      { timeout: 15000 },
    )
    .catch(() => undefined);
}

/**
 * Fill a controlled input and prove the value survived a React commit.
 *
 * A `fill` that lands during the hydration commit is silently discarded: React
 * renders its own (empty) tree over the SSR value. Re-typing until the value
 * sticks turns that race into a retry instead of a mysterious timeout later.
 */
export async function fillStable(page: Page, locator: Locator, value: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    await locator.fill(value);
    try {
      await expect(locator).toHaveValue(value, { timeout: 4000 });
      return;
    } catch (error) {
      lastError = error;
      await waitForHydration(page);
    }
  }
  throw lastError;
}

/** Apply reduced-motion emulation and neutralize CSS animations/transitions. */
export async function reduceMotion(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001s !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001s !important;
      }
    `,
  });
}

/** Navigate while collecting console errors for assertions. */
export async function safeGoto(
  page: Page,
  url: string,
  options?: { waitFor?: string },
) {
  const errors: string[] = [];
  const handler = (msg: { type: () => string; text: () => string }) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  };
  page.on("console", handler);
  // Avoid "networkidle" here as well — see assertPageHealthy for rationale.
  await page.goto(url, { waitUntil: "load" });
  if (options?.waitFor) {
    await page.waitForSelector(options.waitFor, { state: "visible" });
  }
  page.off("console", handler);
  return errors;
}

/** Shared test fixture with a setViewport helper. */
export const test = base.extend<{
  setViewport: (spec: ViewportSpec) => Promise<void>;
}>({
  setViewport: async ({ page }, use) => {
    await use(async (spec) => {
      await page.setViewportSize({ width: spec.width, height: spec.height });
    });
  },
});

export { expect, type Locator };

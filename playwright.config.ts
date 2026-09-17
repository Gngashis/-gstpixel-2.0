import { defineConfig, devices } from "@playwright/test";

/**
 * GSTPIXEL browser QA and visual regression configuration.
 *
 * Goals:
 * - Lightweight, zero recurring cost, local-only.
 * - Durable structural smoke checks rather than brittle pixel assertions.
 * - Screenshot capture for human/visual comparison without failing on animated backgrounds.
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8080";

export default defineConfig({
  testDir: "./tests/qa",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The TanStack Start dev server used here is single-threaded and can become unstable
  // under multiple concurrent browser workers, so keep one worker for reliable local runs.
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--disable-dev-shm-usage"],
        },
      },
    },
  ],

  webServer: {
    // TanStack Start's cloudflare preset preview is incompatible with this environment,
    // so the test server runs the Vite dev server locally. Build validation is run separately.
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

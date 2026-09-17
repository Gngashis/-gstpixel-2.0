import {
  test,
  expect,
  viewports,
  safeGoto,
  reduceMotion,
  assertPageHealthy,
} from "./fixtures";

test.describe("404 recovery", () => {
  for (const key of Object.keys(viewports) as (keyof typeof viewports)[]) {
    const viewport = viewports[key];
    test(`shows a recovery page and working links @ ${viewport.name}`, async ({
      page,
      setViewport,
    }) => {
      await setViewport(viewport);
      await reduceMotion(page);
      const errors = await safeGoto(page, "/definitely-not-a-real-page");

      // The custom not-found boundary renders its own <main class="recovery-page">.
      const recoveryMain = page.locator("main.recovery-page");
      await expect(recoveryMain).toContainText("404", { ignoreCase: true });
      await expect(recoveryMain).toContainText("This part hasn", {
        ignoreCase: true,
      });

      // Recovery routes must be reachable.
      for (const [name, href] of [
        ["Return home", "/"],
        ["Explore services", "/services"],
        ["Useful tools", "/tools"],
        ["Start your project", "/start-your-project"],
      ] as const) {
        await expect(
          recoveryMain.getByRole("link", { name }),
          `recovery link "${name}" missing`,
        ).toHaveAttribute("href", href);
      }

      // The home recovery link navigates back to a healthy page.
      await page.getByRole("link", { name: "Return home" }).click();
      await expect(page.locator("#main")).toContainText("GSTPIXEL", {
        timeout: 10000,
      });
      await assertPageHealthy(page, { route: "/", viewport });

      expect(errors).toHaveLength(0);
    });
  }
});

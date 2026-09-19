import { defineConfig } from "@playwright/test";

const PORT = 3123;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Uses the locally installed Google Chrome, so no browser download is
    // needed. Set PLAYWRIGHT_CHANNEL=chromium after `npx playwright install chromium`
    // to use Playwright's bundled browser instead.
    channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome",
    deviceScaleFactor: 1,
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});

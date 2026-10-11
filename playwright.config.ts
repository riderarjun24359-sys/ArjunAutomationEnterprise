import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [["list"]],
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "off",
    },
    webServer: {
        command: "npm run dev",
        url: baseURL,
        // Always start a fresh dev server: reusing a stale process can serve a
        // build from a previous config/Next version and make browser tests
        // exercise the wrong bundle (false failures).
        reuseExistingServer: false,
        timeout: 120_000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});

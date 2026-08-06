import { test, expect } from "@playwright/test";

/**
 * Final launch readiness — customer-facing surface smoke.
 * Does not add product features; validates journey entry points exist.
 */

const publicJourney = [
    "/auth/sign-up",
    "/auth/verify-email",
    "/auth/welcome",
    "/auth/sign-in",
    "/privacy",
    "/terms",
    "/cookies",
    "/refund",
    "/pricing",
];

test.describe("Final launch readiness public journey", () => {
    for (const path of publicJourney) {
        test(`${path} loads`, async ({ page }) => {
            await page.goto(path);
            await expect(page.locator("body")).toBeVisible();
        });
    }
});

test.describe("Final launch readiness ops", () => {
    test("final-launch-readiness endpoint", async ({ request }) => {
        const res = await request.get("/api/ops/final-launch-readiness");
        expect([200, 503]).toContain(res.status());
        const json = await res.json();
        expect(["GO", "HOLD"]).toContain(json.decision);
        expect(typeof json.score).toBe("number");
        expect(Array.isArray(json.journeySteps)).toBeTruthy();
        expect(Array.isArray(json.critical)).toBeTruthy();
    });
});

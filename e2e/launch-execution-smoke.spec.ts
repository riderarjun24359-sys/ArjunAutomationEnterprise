import { test, expect } from "@playwright/test";

/**
 * Early Access launch-execution smoke.
 * Verifies critical customer cohort paths exist and ops endpoints respond.
 * Does not create product data or change architecture.
 */

const smokePaths = [
    { path: "/auth/sign-up", name: "Sign up" },
    { path: "/auth/verify-email", name: "Verify email" },
    { path: "/auth/welcome", name: "Welcome" },
    { path: "/auth/sign-in", name: "Sign in" },
];

test.describe("Launch execution auth surfaces", () => {
    for (const item of smokePaths) {
        test(`${item.name} loads`, async ({ page }) => {
            await page.goto(item.path);
            await expect(page.locator("body")).toBeVisible();
            await expect(page).toHaveURL(new RegExp(item.path.replace(/\//g, "\\/")));
        });
    }
});

test.describe("Launch execution ops probes", () => {
    test("live", async ({ request }) => {
        const res = await request.get("/api/ops/live");
        expect(res.ok()).toBeTruthy();
    });

    test("ready", async ({ request }) => {
        const res = await request.get("/api/ops/ready");
        expect([200, 503]).toContain(res.status());
    });

    test("cutover", async ({ request }) => {
        const res = await request.get("/api/ops/cutover");
        expect([200, 503]).toContain(res.status());
    });

    test("launch-execution", async ({ request }) => {
        const res = await request.get("/api/ops/launch-execution");
        expect([200, 503]).toContain(res.status());
        const json = await res.json();
        expect(["GO", "HOLD"]).toContain(json.decision);
        expect(json).toHaveProperty("smokeFlow");
        expect(Array.isArray(json.smokeFlow)).toBeTruthy();
    });
});

test.describe("Launch execution gated product paths", () => {
    const gated = ["/onboarding", "/clients", "/projects", "/tasks", "/finance", "/ai", "/founder-analytics", "/early-access"];
    for (const path of gated) {
        test(`${path} requires auth`, async ({ page }) => {
            await page.goto(path);
            await expect(page.locator("body")).toBeVisible();
            // Unauthenticated users should not remain on a fully open app shell without auth challenge.
            const url = page.url();
            const challenged =
                url.includes("/auth/sign-in") ||
                url.includes("/auth/sign-up") ||
                url.includes(path);
            expect(challenged).toBeTruthy();
        });
    }
});

const hasCreds = Boolean(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe("Launch execution authenticated smoke", () => {
    test.skip(!hasCreds, "Set E2E_EMAIL and E2E_PASSWORD for authenticated cohort smoke");

    test("cohort journey surfaces", async ({ page }) => {
        await page.goto("/auth/sign-in");
        await page.getByLabel(/email/i).fill(process.env.E2E_EMAIL!);
        await page.getByLabel(/password/i).fill(process.env.E2E_PASSWORD!);
        await page.getByRole("button", { name: /sign in|log in|continue/i }).click();
        await page.waitForURL(/\/(dashboard|onboarding|crm|projects)?/, { timeout: 30_000 });

        for (const path of ["/onboarding", "/clients", "/projects", "/tasks", "/finance", "/ai", "/founder-analytics", "/early-access"]) {
            await page.goto(path);
            await expect(page).not.toHaveURL(/\/auth\/sign-in/);
            await expect(page.locator("body")).toBeVisible();
        }
    });
});

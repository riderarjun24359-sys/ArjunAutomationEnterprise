import { test, expect } from "@playwright/test";

/**
 * Soft-launch E2E coverage.
 * Unauthenticated tests always run.
 * Authenticated journey runs when E2E_EMAIL + E2E_PASSWORD are set.
 */

const protectedRoutes = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/crm", name: "CRM" },
    { path: "/projects", name: "Projects" },
    { path: "/customer-success", name: "Customer Success" },
    { path: "/billing-finance", name: "Billing" },
    { path: "/hrms", name: "HRMS" },
    { path: "/integration-hub", name: "Integration Hub" },
    { path: "/security-center", name: "Security Center" },
];

test.describe("Auth pages", () => {
    test("sign-in page loads", async ({ page }) => {
        await page.goto("/auth/sign-in");
        await expect(page).toHaveURL(/\/auth\/sign-in/);
        await expect(page.locator("body")).toBeVisible();
    });

    test("sign-up page loads", async ({ page }) => {
        await page.goto("/auth/sign-up");
        await expect(page).toHaveURL(/\/auth\/sign-up/);
        await expect(page.locator("body")).toBeVisible();
    });
});

test.describe("Protected route gates", () => {
    for (const route of protectedRoutes) {
        test(`${route.name} redirects unauthenticated users`, async ({ page }) => {
            await page.goto(route.path);
            await expect(page).toHaveURL(/\/auth\/sign-in|\/auth\/sign-up|\//);
            const url = page.url();
            const gated =
                url.includes("/auth/sign-in") ||
                url.includes("/auth/sign-up") ||
                !url.includes(route.path);
            expect(gated).toBeTruthy();
        });
    }
});

test.describe("Operations endpoints", () => {
    test("liveness endpoint responds", async ({ request }) => {
        const res = await request.get("/api/ops/live");
        expect(res.ok()).toBeTruthy();
        const json = await res.json();
        expect(json.status).toBe("alive");
    });

    test("readiness endpoint responds", async ({ request }) => {
        const res = await request.get("/api/ops/ready");
        expect([200, 503]).toContain(res.status());
        const json = await res.json();
        expect(["ready", "not_ready"]).toContain(json.status);
    });

    test("health endpoint responds", async ({ request }) => {
        const res = await request.get("/api/ops/health");
        expect([200, 503]).toContain(res.status());
        const json = await res.json();
        expect(json).toHaveProperty("status");
        expect(json).toHaveProperty("score");
    });
});

const hasCreds = Boolean(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe("Authenticated soft-launch journey", () => {
    test.skip(!hasCreds, "Set E2E_EMAIL and E2E_PASSWORD to run authenticated journey");

    test("sign in, visit modules, logout", async ({ page }) => {
        await page.goto("/auth/sign-in");
        await page.getByLabel(/email/i).fill(process.env.E2E_EMAIL!);
        await page.getByLabel(/password/i).fill(process.env.E2E_PASSWORD!);
        await page.getByRole("button", { name: /sign in|log in|continue/i }).click();
        await page.waitForURL(/\/(dashboard|crm|projects)?/, { timeout: 30_000 });

        for (const route of protectedRoutes) {
            await page.goto(route.path);
            await expect(page).not.toHaveURL(/\/auth\/sign-in/);
            await expect(page.locator("body")).toBeVisible();
        }

        const logout = page.getByRole("button", { name: /sign out|log out|logout/i });
        if (await logout.count()) {
            await logout.first().click();
            await expect(page).toHaveURL(/\/auth\/sign-in|\//);
        }
    });
});

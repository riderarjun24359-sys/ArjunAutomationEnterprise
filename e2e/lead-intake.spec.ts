import { test, expect } from "@playwright/test";

/**
 * Public lead-intake journey in a real browser.
 * Passes with OR without backend intake configuration: with config the form
 * reaches the thank-you page; without it the UI must surface the honest
 * error instead of fake success. Both outcomes are asserted explicitly.
 */

test.describe("Lead intake", () => {
    test("contact form requires consent and handles the honest outcome", async ({ page }) => {
        await page.goto("/contact");
        const form = page.locator('form[aria-label="Contact form"]');
        await expect(form).toBeVisible();

        const consent = form.locator('input[name="consent"]');
        await expect(consent).toBeVisible();

        await form.locator('input[name="name"]').fill("E2E Prospect");
        await form.locator('input[name="email"]').fill("e2e-prospect@example.com");
        await form.locator('button[type="submit"]').click();
        // Browser-level required validation blocks submission without consent.
        await expect(page).toHaveURL(/\/contact/);

        await consent.check();
        await form.locator('button[type="submit"]').click();
        await expect
            .poll(
                async () =>
                    page.url().includes("/thank-you")
                        ? "navigated"
                        : (await form.locator('[role="alert"]').count()) > 0
                          ? "errored"
                          : "pending",
                { timeout: 15000 },
            )
            .not.toBe("pending");
        if (page.url().includes("/thank-you")) return;
        const alert = form.locator('[role="alert"]');
        await expect(alert).toBeVisible();
        await expect(alert).not.toBeEmpty();
    });
});

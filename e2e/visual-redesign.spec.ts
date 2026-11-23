import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Browser acceptance tests for the active App Router marketing site.
 * These assertions intentionally follow the real production routes and
 * accessible controls instead of selectors from the retired single-page site.
 */

const SHOTS = join(process.cwd(), "reports", "visual");
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440];

mkdirSync(SHOTS, { recursive: true });

async function assertNoHorizontalOverflow(page: Page, label: string) {
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        innerWidth: window.innerWidth,
    }));
    expect(
        scrollWidth,
        `${label}: document is ${scrollWidth}px wide but viewport is ${innerWidth}px`,
    ).toBeLessThanOrEqual(innerWidth + 1);
}

async function assertNothingOverflowsViewport(page: Page, label: string) {
    const rects = await page.locator("header, main, footer, h1, h2").evaluateAll((nodes) =>
        nodes
            .map((node) => {
                const rect = node.getBoundingClientRect();
                return { tag: node.tagName, left: rect.left, right: rect.right, width: rect.width };
            })
            .filter((rect) => rect.width > 0),
    );

    const viewportWidth = await page.evaluate(() => window.innerWidth);
    for (const rect of rects) {
        expect(rect.left, `${label}: <${rect.tag}> starts outside the viewport`).toBeGreaterThanOrEqual(-1);
        expect(rect.right, `${label}: <${rect.tag}> ends outside the viewport`).toBeLessThanOrEqual(
            viewportWidth + 1,
        );
    }
}

test.describe("Homepage responsive rendering", () => {
    for (const width of WIDTHS) {
        test(`homepage at ${width}px has no horizontal overflow`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/", { waitUntil: "networkidle" });
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            await assertNoHorizontalOverflow(page, `homepage@${width}`);
            await page.screenshot({ path: join(SHOTS, `home-${width}.png`), fullPage: true });
        });
    }

    test("header and page content remain within a tablet viewport", async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 900 });
        await page.goto("/", { waitUntil: "networkidle" });
        await assertNothingOverflowsViewport(page, "homepage at 1024px");
    });
});

test.describe("Primary customer journey", () => {
    test("homepage → consultation CTA → contact form → honest error state", async ({ page }) => {
        // Keep this browser test deterministic and side-effect free: intercept
        // the API request so CI never creates a real lead or sends an email.
        await page.route("**/api/launch-kit/contact", async (route) => {
            await route.fulfill({
                status: 503,
                contentType: "application/json",
                body: JSON.stringify({ success: false, error: "Test-only unavailable response." }),
            });
        });

        await page.goto("/", { waitUntil: "networkidle" });
        await page.getByRole("link", { name: "Request a Free 20-Min Call" }).click();
        await expect(page).toHaveURL(/\/contact\/?$/);

        const form = page.getByRole("form", { name: "Contact form" });
        await expect(form).toBeVisible();
        await form.getByLabel(/Full Name/).fill("E2E Verification");
        await form.getByLabel(/Work Email/).fill("e2e-verification@example.com");
        await form.getByLabel(/Phone/).fill("9876543210");
        await form.getByLabel(/How can we help/).fill("Testing the public enquiry form.");
        await form.getByRole("checkbox", { name: /I agree to the storage and use/ }).check();
        await form.getByRole("button", { name: "Send enquiry" }).click();

        const alert = form.getByRole("alert");
        await expect(alert).toBeVisible();
        await expect(alert).toContainText("Test-only unavailable response.");
        await expect(page).toHaveURL(/\/contact\/?$/);
    });

    test("homepage service cards point to the matching service routes", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        await expect(page.getByRole("heading", { name: "Custom Business Websites" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Explore website development" })).toHaveAttribute(
            "href",
            "/services#websites",
        );
        await expect(page.getByRole("link", { name: "Explore workflow automation" })).toHaveAttribute(
            "href",
            "/services#automations",
        );
        await expect(page.getByRole("link", { name: "Explore portals and business tools" })).toHaveAttribute(
            "href",
            "/services#portals",
        );
    });
});

test.describe("Navigation", () => {
    test("mobile menu exposes all primary destinations", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/", { waitUntil: "networkidle" });

        const menuToggle = page.locator('summary[aria-label="Open navigation menu"]');
        await expect(menuToggle).toBeVisible();
        await menuToggle.click();

        const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
        await expect(mobileNav).toBeVisible();
        for (const label of ["Services", "Blueprints", "Pricing", "About", "Contact"]) {
            await expect(mobileNav.getByRole("link", { name: label, exact: true })).toBeVisible();
        }

        await page.screenshot({ path: join(SHOTS, "mobile-nav-390.png") });
    });

    test("desktop navigation routes to the real services page", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/", { waitUntil: "networkidle" });

        const nav = page.getByRole("navigation", { name: "Main navigation" });
        await expect(nav).toBeVisible();
        const servicesLink = nav.getByRole("link", { name: "Services", exact: true });
        await expect(servicesLink).toHaveAttribute("href", "/services");
        await servicesLink.click();

        await expect(page).toHaveURL(/\/services\/?$/);
        await expect(page.getByRole("main")).toBeVisible();
    });

    test("primary consultation CTA exposes a visible keyboard-focus treatment", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto("/", { waitUntil: "networkidle" });

        const cta = page.getByRole("link", { name: "Request a Free 20-Min Call" });
        await expect(cta).toHaveAttribute("href", "/contact");
        await expect(cta).toHaveClass(/focus-visible:ring-2/);
        await expect(cta).toHaveClass(/focus-visible:outline-none/);
    });
});

test.describe("Runtime health", () => {
    test("public marketing routes render without uncaught browser errors", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(String(error)));

        for (const path of ["/", "/services", "/pricing", "/contact"]) {
            await page.goto(path, { waitUntil: "networkidle" });
            await expect(page.locator("body")).toBeVisible();
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        }

        expect(errors, `uncaught page errors: ${errors.join(" | ")}`).toEqual([]);
    });
});

test.describe("Design system applied", () => {
    test("design tokens resolve and real content cards are styled", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        const tokens = await page.evaluate(() => {
            const root = getComputedStyle(document.documentElement);
            const card = document.querySelector<HTMLElement>("article.rounded-2xl");
            const cardStyle = card ? getComputedStyle(card) : null;
            return {
                radius2xl: root.getPropertyValue("--dos-radius-2xl").trim(),
                shadowMd: root.getPropertyValue("--dos-shadow-md").trim(),
                focusBorder: root.getPropertyValue("--dos-border-focus").trim(),
                cardRadius: cardStyle?.borderTopLeftRadius ?? "",
                cardShadow: cardStyle?.boxShadow ?? "",
            };
        });

        expect(tokens.radius2xl).not.toBe("");
        expect(tokens.shadowMd).not.toBe("");
        expect(tokens.focusBorder).not.toBe("");
        expect(tokens.cardRadius).not.toBe("0px");
        expect(tokens.cardShadow).not.toBe("none");
    });

    test("audit-banned claims never render on the homepage", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        const bodyText = (await page.locator("body").innerText()).toLowerCase();

        for (const banned of ["24/7", "sla-backed", "99.9%", "trusted by", "live health endpoints"]) {
            expect(bodyText, `homepage still renders banned claim: ${banned}`).not.toContain(banned);
        }
    });
});

test.describe("Reference screenshots", () => {
    test("desktop homepage, services and contact pages", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 1000 });
        for (const [path, name] of [
            ["/", "home-1440-fullpage"],
            ["/services", "services-1440"],
            ["/contact", "contact-1440"],
        ] as const) {
            await page.goto(path, { waitUntil: "networkidle" });
            await page.screenshot({
                path: join(SHOTS, `${name}.png`),
                fullPage: name.endsWith("fullpage"),
            });
        }
    });

    test("mobile homepage and contact page", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        for (const [path, name] of [
            ["/", "home-390-fullpage"],
            ["/contact", "contact-390"],
        ] as const) {
            await page.goto(path, { waitUntil: "networkidle" });
            await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
        }
    });
});

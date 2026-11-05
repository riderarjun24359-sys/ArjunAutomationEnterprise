import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Visual redesign verification — real Chromium against the local app.
 *
 * Covers the acceptance criteria for the 2026-10-15 premium redesign:
 *  - the target responsive widths render without horizontal scrolling or
 *    clipped/overflowing controls,
 *  - the primary customer journey still works end to end,
 *  - desktop + mobile navigation work,
 *  - keyboard focus is visible,
 *  - the pages emit no uncaught errors.
 *
 * Screenshots are written to reports/visual/ for manual review. No assertion
 * here fabricates a score or a passing state for something that did not run.
 */

const SHOTS = join(process.cwd(), "reports", "visual");
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1280, 1440];

mkdirSync(SHOTS, { recursive: true });

async function assertNoHorizontalOverflow(page: Page, label: string) {
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
        innerWidth: window.innerWidth,
    }));
    // 1px tolerance for sub-pixel rounding.
    expect(scrollWidth, `${label}: document is ${scrollWidth}px wide but viewport is ${innerWidth}px`).toBeLessThanOrEqual(
        innerWidth + 1,
    );
}

async function assertNothingOverflowsViewport(page: Page, label: string) {
    const rects = await page.locator("header, main, footer, h1, h2").evaluateAll((nodes) =>
        nodes
            .map((n) => {
                const r = n.getBoundingClientRect();
                return { tag: n.tagName, left: r.left, right: r.right, width: r.width };
            })
            .filter((r) => r.width > 0),
    );
    for (const r of rects) {
        expect(r.left, `${label}: <${r.tag}> starts ${r.left}px from the left`).toBeGreaterThanOrEqual(-1);
        expect(r.right, `${label}: <${r.tag}> ends at ${r.right}px, past the viewport`).toBeLessThanOrEqual(
            (await page.evaluate(() => window.innerWidth)) + 1,
        );
    }
}

test.describe("Homepage responsive rendering", () => {
    for (const width of WIDTHS) {
        test(`homepage at ${width}px has no overflow and renders the hero`, async ({ page }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto("/", { waitUntil: "networkidle" });

            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            await assertNoHorizontalOverflow(page, `homepage@${width}`);

            await page.screenshot({ path: join(SHOTS, `home-${width}.png`), fullPage: true });
        });
    }

    test("1024px header controls stay inside the viewport", async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 900 });
        await page.goto("/", { waitUntil: "networkidle" });
        await assertNothingOverflowsViewport(page, "homepage at 1024px");
    });
});

test.describe("Primary customer journey", () => {
    test("homepage → primary CTA → contact → validation → honest result", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        // Primary hero CTA routes to contact.
        await page.getByRole("link", { name: /book (a )?free consultation/i }).first().click();
        await expect(page).toHaveURL(/\/contact/);

        const form = page.locator('form[aria-label="Contact form"]');
        await expect(form).toBeVisible();

        // Required browser validation must block an incomplete submit.
        await form.locator('button[type="submit"]').click();
        await expect(page).toHaveURL(/\/contact/);

        const consent = form.locator('input[name="consent"]');
        await form.locator('input[name="name"]').fill("Redesign Verification");
        await form.locator('input[name="email"]').fill("redesign-verify@example.com");
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
                { timeout: 15_000 },
            )
            .not.toBe("pending");

        if (page.url().includes("/thank-you")) return;
        await expect(form.locator('[role="alert"]')).toBeVisible();
    });

    test("services index links to a service detail page", async ({ page }) => {
        await page.goto("/services", { waitUntil: "networkidle" });
        const firstService = page.locator('a[href^="/services/"]').first();
        await expect(firstService).toBeVisible();
        await firstService.click();
        await expect(page).toHaveURL(/\/services\/[a-z0-9-]+/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
});

test.describe("Navigation", () => {
    test("mobile menu opens and exposes the full link list", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/", { waitUntil: "networkidle" });

        const summary = page.locator("details summary").first();
        await summary.click();
        const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
        await expect(mobileNav).toBeVisible();
        for (const label of ["About", "Services", "Pricing", "Contact"]) {
            await expect(mobileNav.getByRole("link", { name: label, exact: true })).toBeVisible();
        }
        await page.screenshot({ path: join(SHOTS, "mobile-nav-390.png") });
    });

    test("desktop nav is present and links resolve", async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto("/", { waitUntil: "networkidle" });
        const nav = page.getByRole("navigation", { name: "Main navigation" });
        await expect(nav).toBeVisible();
        await nav.getByRole("link", { name: "Services", exact: true }).click();
        await expect(page).toHaveURL(/\/services$/);
    });

    test("keyboard focus is visible on the primary CTA", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        const cta = page.getByRole("link", { name: /book (a )?free consultation/i }).first();
        await cta.focus();
        const outlineVisible = await cta.evaluate((el) => {
            const s = getComputedStyle(el);
            return s.outlineStyle !== "none" || s.boxShadow !== "none";
        });
        expect(outlineVisible).toBe(true);
    });
});

test.describe("Runtime health", () => {
    test("homepage, service and contact pages raise no uncaught errors", async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(String(e)));

        for (const path of ["/", "/services", "/services/platform-implementation", "/contact"]) {
            await page.goto(path, { waitUntil: "networkidle" });
            await expect(page.locator("body")).toBeVisible();
        }

        expect(errors, `uncaught page errors: ${errors.join(" | ")}`).toEqual([]);
    });
});

test.describe("Design system applied", () => {
    test("design tokens resolve and drive real radii, shadows and focus colour", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });

        const tokens = await page.evaluate(() => {
            const scope = document.querySelector<HTMLElement>(".premium-theme") ?? document.documentElement;
            const root = getComputedStyle(scope);
            const read = (name: string) => root.getPropertyValue(name).trim();
            const card = document.querySelector<HTMLElement>(".premium-card, .tc-card");
            const cs = card ? getComputedStyle(card) : null;
            return {
                radius2xl: read("--dos-radius-2xl"),
                shadowMd: read("--dos-shadow-md"),
                glassBg: read("--dos-glass-bg"),
                borderFocus: read("--dos-border-focus"),
                cardRadius: cs?.borderTopLeftRadius ?? "",
                cardShadow: cs?.boxShadow ?? "",
                fontDisplay: root.getPropertyValue("--dos-font-display").trim(),
            };
        });

        // The token-completion layer must actually be emitted as CSS custom props.
        expect(tokens.radius2xl).not.toBe("");
        expect(tokens.shadowMd).not.toBe("");
        expect(tokens.glassBg).not.toBe("");
        expect(tokens.borderFocus).not.toBe("");

        // …and consumed: cards are rounded and shadowed, not flat squares.
        expect(tokens.cardRadius).not.toBe("0px");
        expect(tokens.cardShadow).not.toBe("none");
    });

    test("audit-banned claims never render on the homepage", async ({ page }) => {
        await page.goto("/", { waitUntil: "networkidle" });
        const text = (await page.locator("body").innerText()).toLowerCase();
        for (const banned of ["24/7", "sla-backed", "99.9%", "trusted by", "live health endpoints"]) {
            expect(text, `homepage still renders banned claim: ${banned}`).not.toContain(banned);
        }
    });
});

test.describe("Reference screenshots", () => {
    test("desktop homepage, service and contact", async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 1000 });
        for (const [path, name] of [
            ["/", "home-1440-fullpage"],
            ["/services/platform-implementation", "service-1440"],
            ["/contact", "contact-1440"],
        ] as const) {
            await page.goto(path, { waitUntil: "networkidle" });
            await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: name.endsWith("fullpage") });
        }
    });

    test("mobile homepage and contact", async ({ page }) => {
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

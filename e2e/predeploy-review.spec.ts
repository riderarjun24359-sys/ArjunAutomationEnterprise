import { test, expect } from "@playwright/test";

/**
 * Final pre-deployment review — runtime integrity checks against a real server.
 *
 * Unlike the source-string verifiers in scripts/, everything here is measured
 * from actual HTTP responses / rendered DOM:
 *   - sitemap + robots are served, and every listed public URL resolves,
 *   - no banned/unverifiable claim appears in ANY public page's HTML,
 *   - required security headers are sent,
 *   - the metadata contract (title/description/canonical/OG) holds on key routes,
 *   - internal links resolve, pages have exactly one <h1>,
 *   - every <img> has alt text,
 *   - header/footer controls meet the 24x24 CSS-px minimum touch target,
 *   - JSON-LD blocks are present and parse.
 *
 * Nothing here fabricates a pass: every assertion reads a real response.
 */

// Claims the 2026-10-15 integrity remediation removed from shipped copy. They
// must not be reintroduced anywhere on the public site.
const BANNED_CLAIMS: Array<{ re: RegExp; why: string }> = [
    { re: /\b24\/7\b/, why: "unverifiable round-the-clock operational claim" },
    { re: /SLA-backed/i, why: "unverifiable SLA-backed response claim" },
    { re: /99\.9%\s*(uptime|SLA)/i, why: "unverifiable uptime statistic" },
    { re: /Live\s+Health\s+Endpoints/i, why: "unverifiable endpoint/uptime metric" },
    { re: /Trusted by/i, why: "fabricated client proof" },
    { re: /check your inbox for confirmation/i, why: "false subscription-confirmation message" },
    { re: /captured locally for the support team/i, why: "false feedback-capture claim" },
];

function parseSitemapLocs(xml: string): string[] {
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => m[1].trim());
}

function pathOf(loc: string, origin: string): string {
    try {
        const u = new URL(loc);
        return u.origin === origin ? u.pathname : loc;
    } catch {
        return loc;
    }
}

test.describe("Pre-deployment: crawl, headers, metadata", () => {
    // Dev-mode compiles each route on first hit; the full-site crawl needs room.
    test.beforeEach(() => {
        test.setTimeout(300_000);
    });

    test("robots.txt and sitemap.xml are served with sane content", async ({ request }) => {
        const robots = await request.get("/robots.txt");
        expect(robots.status()).toBe(200);
        const robotsBody = await robots.text();
        expect(robotsBody).toContain("Sitemap:");
        expect(robotsBody).toContain("Disallow: /dashboard");

        const sitemap = await request.get("/sitemap.xml");
        expect(sitemap.status()).toBe(200);
        const locs = parseSitemapLocs(await sitemap.text());
        // The public site advertises ~130 pages; require a real crawl set.
        expect(locs.length).toBeGreaterThan(30);
    });

    test("every sitemap URL resolves and carries no banned claim", async ({ request, baseURL }) => {
        const origin = new URL(baseURL!).origin;
        const sitemap = await request.get("/sitemap.xml");
        const locs = parseSitemapLocs(await sitemap.text()).map((l) => pathOf(l, origin));

        const badStatus: string[] = [];
        const claimHits: string[] = [];

        for (const path of locs) {
            const res = await request.get(path);
            if (res.status() >= 400) {
                badStatus.push(`${res.status()} ${path}`);
                continue;
            }
            const html = await res.text();
            for (const { re, why } of BANNED_CLAIMS) {
                if (re.test(html)) claimHits.push(`${path} :: ${why} (${re})`);
            }
        }

        expect(badStatus, `sitemap URLs that did not resolve:\n${badStatus.join("\n")}`).toEqual([]);
        expect(claimHits, `banned claims found in public HTML:\n${claimHits.join("\n")}`).toEqual([]);
    });

    test("required security headers are present on public responses", async ({ request }) => {
        const res = await request.get("/");
        const headers = res.headers();
        expect(headers["x-frame-options"]).toBe("DENY");
        expect(headers["x-content-type-options"]).toBe("nosniff");
        expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
        expect(headers["permissions-policy"]).toContain("camera=()");
    });

    test("metadata contract holds on key public routes", async ({ request }) => {
        const routes = [
            "/",
            "/about",
            "/services",
            "/services/platform-implementation",
            "/pricing",
            "/portfolio/crm",
            "/case-studies/crm",
            "/contact",
            "/faq",
        ];
        const problems: string[] = [];
        for (const path of routes) {
            const res = await request.get(path);
            const html = await res.text();
            const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
            const desc = html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim() ?? "";
            const canonical = html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1]?.trim() ?? "";
            const ogTitle = html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1]?.trim() ?? "";

            if (res.status() !== 200) problems.push(`${path}: HTTP ${res.status()}`);
            if (title.length < 5 || /undefined/i.test(title)) problems.push(`${path}: weak <title> "${title}"`);
            if (desc.length < 40 || /undefined/i.test(desc)) problems.push(`${path}: weak description (${desc.length} chars)`);
            if (!/^https?:\/\//.test(canonical)) problems.push(`${path}: missing canonical`);
            if (ogTitle.length < 5) problems.push(`${path}: missing og:title`);
        }
        expect(problems, problems.join("\n")).toEqual([]);
    });

    test("JSON-LD blocks exist and parse on the homepage", async ({ request }) => {
        const html = await (await request.get("/")).text();
        const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(
            (m) => m[1],
        );
        expect(blocks.length).toBeGreaterThan(0);
        for (const raw of blocks) {
            expect(() => JSON.parse(raw)).not.toThrow();
        }
    });
});

test.describe("Pre-deployment: rendered page integrity", () => {
    test.beforeEach(() => {
        test.setTimeout(300_000);
    });

    const RENDER_ROUTES = ["/", "/about", "/services", "/pricing", "/contact", "/faq", "/industries", "/solutions"];

    test("each key page has exactly one <h1> and every image has alt text", async ({ page }) => {
        const problems: string[] = [];
        for (const path of RENDER_ROUTES) {
            await page.goto(path, { waitUntil: "domcontentloaded" });
            const h1 = await page.locator("h1").count();
            if (h1 !== 1) problems.push(`${path}: expected 1 <h1>, found ${h1}`);
            const imgsMissingAlt = await page.locator("img:not([alt])").count();
            if (imgsMissingAlt > 0) problems.push(`${path}: ${imgsMissingAlt} <img> without alt`);
        }
        expect(problems, problems.join("\n")).toEqual([]);
    });

    test("no dead affordances (href=\"#\" or empty href) on key pages", async ({ page }) => {
        const problems: string[] = [];
        for (const path of RENDER_ROUTES) {
            await page.goto(path, { waitUntil: "domcontentloaded" });
            const dead = await page.locator('a[href="#"], a[href=""]').count();
            if (dead > 0) problems.push(`${path}: ${dead} dead anchor(s)`);
        }
        expect(problems, problems.join("\n")).toEqual([]);
    });

    test("every internal link on the key pages resolves below 400", async ({ page, request, baseURL }) => {
        const origin = new URL(baseURL!).origin;
        const hrefs = new Set<string>();
        for (const path of RENDER_ROUTES) {
            await page.goto(path, { waitUntil: "domcontentloaded" });
            const found = await page.locator("a[href]").evaluateAll((nodes) =>
                nodes.map((n) => (n as HTMLAnchorElement).getAttribute("href") ?? ""),
            );
            for (const href of found) {
                if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
                let internal = false;
                let pathname = href;
                try {
                    const u = new URL(href, baseURL!);
                    internal = u.origin === origin;
                    pathname = u.pathname;
                } catch {
                    internal = false;
                }
                if (internal) hrefs.add(pathname);
            }
        }

        const broken: string[] = [];
        for (const pathname of hrefs) {
            const res = await request.get(pathname);
            if (res.status() >= 400) broken.push(`${res.status()} ${pathname}`);
        }
        expect(broken, `internal links that 404/500:\n${broken.join("\n")}`).toEqual([]);
        expect(hrefs.size, "no internal links were discovered").toBeGreaterThan(5);
    });

    test("header and footer controls meet the 24x24 CSS-px minimum touch target", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/", { waitUntil: "networkidle" });
        const small = await page
            .locator("header a, header button, footer a, [role='button']")
            .evaluateAll((nodes) =>
                nodes
                    .map((n) => {
                        const r = n.getBoundingClientRect();
                        const label =
                            (n.textContent ?? "").trim().slice(0, 30) || n.getAttribute("aria-label") || "<icon>";
                        return {
                            label,
                            w: Math.round(r.width),
                            h: Math.round(r.height),
                            visible: r.width > 0 && r.height > 0,
                        };
                    })
                    .filter((r) => r.visible && (r.w < 24 || r.h < 24)),
            );
        expect(small, `controls below 24x24:\n${small.map((s) => `${s.w}x${s.h} ${s.label}`).join("\n")}`).toEqual([]);
    });
});

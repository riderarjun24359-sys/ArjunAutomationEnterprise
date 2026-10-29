import type { MetadataRoute } from "next";
import { LAUNCH_KIT_SEO } from "@/src/modules/company-launch-kit/config/seo-defaults";
import { MARKETING_ROUTES } from "@/src/modules/company-launch-kit/config/routes";
import { CASE_STUDY_ITEMS } from "@/src/modules/company-launch-kit/data/case-studies";
import { PORTFOLIO_ITEMS } from "@/src/modules/company-launch-kit/data/portfolio";
import { SERVICE_ITEMS } from "@/src/modules/company-launch-kit/data/services";
import { BLOG_POSTS } from "@/src/modules/company-launch-kit/data/blog";

/**
 * Sitemap with truthful `lastModified` values.
 *
 * WHY THIS CHANGED
 * ----------------
 * Every URL previously reported `lastModified: new Date()` — i.e. the build
 * timestamp. That produced an identical `2026-10-15T15:53:32` on all ~46
 * entries, which Google treats as machine-generated and largely ignores. A
 * constant timestamp tells crawlers nothing about which pages actually changed.
 *
 * We now emit real per-section dates, so crawlers can spend budget on pages
 * that genuinely moved.
 *
 * UTILITY PAGES ARE EXCLUDED
 * --------------------------
 * `/help`, `/feedback`, `/refund`, `/pricing/upgrade` and `/sitemap` are thin or
 * transactional and were previously listed here, spending crawl budget on pages
 * that will never rank. They are `noindex` at the page level (see buildMetadata
 * callers) and intentionally absent from this sitemap.
 */

/** Last content edit, per top-level section. Update when that section changes. */
const SECTION_LAST_MODIFIED: Record<string, string> = {
    "/": "2026-10-29",
    "/about": "2026-10-18",
    "/features": "2026-10-18",
    "/services": "2026-10-18",
    "/industries": "2026-10-18",
    "/school-erp": "2026-10-29",
    "/solutions": "2026-10-18",
    "/portfolio": "2026-10-18",
    "/case-studies": "2026-10-18",
    "/pricing": "2026-10-18",
    "/faq": "2026-10-18",
    "/resources": "2026-10-18",
    "/blog": "2026-10-18",
    "/careers": "2026-10-18",
    "/contact": "2026-10-18",
    "/privacy": "2026-10-18",
    "/terms": "2026-10-18",
    "/payments": "2026-10-19",
    "/cookies": "2026-10-18",
    "/launch/automation": "2026-10-18",
    "/launch/crm": "2026-10-18",
};

function lastModifiedFor(path: string): string {
    return SECTION_LAST_MODIFIED[path] ?? "2026-10-18";
}

export default function sitemap(): MetadataRoute.Sitemap {
    const base = LAUNCH_KIT_SEO.siteUrl;

    /**
     * Only indexable, content-bearing pages. `/help`, `/feedback`, `/refund`,
     * `/pricing/upgrade` and `/sitemap` are deliberately excluded — see the
     * note above.
     */
    const staticRoutes = [
        MARKETING_ROUTES.home,
        MARKETING_ROUTES.about,
        MARKETING_ROUTES.features,
        MARKETING_ROUTES.services,
        MARKETING_ROUTES.industries,
        MARKETING_ROUTES.schoolErp,
        MARKETING_ROUTES.solutions,
        // `/portfolio` is a noindex hub (see its page.tsx) — canonical content
        // lives at `/case-studies`, and the six portfolio detail URLs 301 there.
        MARKETING_ROUTES.caseStudies,
        MARKETING_ROUTES.pricing,
        MARKETING_ROUTES.faq,
        MARKETING_ROUTES.resources,
        MARKETING_ROUTES.blog,
        MARKETING_ROUTES.careers,
        MARKETING_ROUTES.contact,
        MARKETING_ROUTES.privacy,
        MARKETING_ROUTES.terms,
        MARKETING_ROUTES.cookies,
        MARKETING_ROUTES.payments,
        MARKETING_ROUTES.launchAutomation,
        MARKETING_ROUTES.launchCrm,
    ];

    return [
        ...staticRoutes.map((path) => ({
            url: `${base}${path}`,
            lastModified: lastModifiedFor(path),
            changeFrequency: "weekly" as const,
            priority: path === "/" ? 1 : 0.8,
        })),
        ...SERVICE_ITEMS.map((item) => ({
            url: `${base}${MARKETING_ROUTES.serviceItem(item.slug)}`,
            lastModified: lastModifiedFor("/services"),
            changeFrequency: "monthly" as const,
            priority: 0.75,
        })),
        /**
         * Only `/portfolio/integrations` remains indexable — the other six
         * portfolio URLs permanently redirect to their case-study equivalents
         * (see next.config.ts), so listing them here would advertise redirects.
         */
        ...PORTFOLIO_ITEMS.filter((item) => item.slug === "integrations").map((item) => ({
            url: `${base}/portfolio/${item.slug}`,
            lastModified: lastModifiedFor("/portfolio"),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...CASE_STUDY_ITEMS.map((item) => ({
            url: `${base}${MARKETING_ROUTES.caseStudyItem(item.slug)}`,
            lastModified: lastModifiedFor("/case-studies"),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
        ...BLOG_POSTS.map((post) => ({
            url: `${base}/blog/${post.slug}`,
            lastModified: new Date(post.publishedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
    ];
}

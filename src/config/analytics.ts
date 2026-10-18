/**
 * Analytics configuration.
 *
 * WHY THESE ARE COMMITTED RATHER THAN ENV-ONLY
 * -------------------------------------------
 * `.env*` is gitignored, so a measurement ID set only there would be missing
 * from every build without that file — including Vercel's. A GA4 measurement
 * ID is not a secret: it is embedded in the page source of every site using
 * GA4 and is visible in the network tab to anyone. Committing it is the normal
 * approach for a statically deployed marketing site, and it guarantees the tag
 * actually loads in production.
 *
 * ENVIRONMENT VARIABLES STILL WIN
 * ------------------------------
 * Each value below can be overridden per-environment, so a staging deployment
 * can report to a different property than production:
 *
 *   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID=your-meta-pixel-id
 *
 * IMPORTANT: keep `next.config.ts` in sync. The Content-Security-Policy only
 * allows the analytics hosts listed there, so a new provider needs its origins
 * allow-listed or the tag will be blocked in the browser.
 */

/** Google Analytics 4 measurement ID (format: G-XXXXXXXXXX). */
const GA4_ID = "G-1FBXBS641F";

function envString(key: string): string | null {
    const raw = process.env[key]?.trim();
    return raw ? raw : null;
}

export const ANALYTICS = {
    /** `null` disables the tag entirely — nothing is rendered. */
    ga4Id: envString("NEXT_PUBLIC_GA4_ID") ?? GA4_ID,
    gtmId: envString("NEXT_PUBLIC_GTM_ID"),
    metaPixelId: envString("NEXT_PUBLIC_META_PIXEL_ID"),
} as const;

export const HAS_ANALYTICS = Boolean(ANALYTICS.ga4Id || ANALYTICS.gtmId || ANALYTICS.metaPixelId);

/**
 * Origins the Content-Security-Policy must allow when a given provider is
 * active. Imported by `next.config.ts` so the header and the tags cannot drift.
 */
export const ANALYTICS_CSP_ORIGINS = {
    script: ["https://www.googletagmanager.com"],
    connect: [
        "https://www.google-analytics.com",
        "https://region1.google-analytics.com",
        "https://analytics.google.com",
    ],
} as const;

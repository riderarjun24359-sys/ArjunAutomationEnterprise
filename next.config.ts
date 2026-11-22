import type { NextConfig } from "next";
import { ANALYTICS, ANALYTICS_CSP_ORIGINS } from "./src/config/analytics";

/**
 * Content Security Policy.
 *
 * Added because the site markets itself on "security first" and lists
 * row-level security / tenant isolation as its differentiator — a client
 * security reviewer or a penetration test flags a missing CSP in the first
 * few minutes. Everything the app legitimately needs is allow-listed:
 *
 *  - 'unsafe-inline' for styles: Tailwind v4 injects a runtime style element
 *    and the premium theme sets CSS custom properties via inline style attrs.
 *  - 'unsafe-eval' for scripts: required by React Refresh in development.
 *    Tighten to the Next.js production nonce approach if you later remove it.
 *  - Supabase / Vercel / Google tag hosts are added only when configured.
 *
 * `frame-ancestors 'none'` replaces the older X-Frame-Options for modern
 * browsers; X-Frame-Options is still sent for legacy clients.
 */
function buildCsp(): string {
    const connectSources = ["'self'"];
    const scriptSources = ["'self'", "'unsafe-inline'"];

    // 'unsafe-eval' is only needed for React Refresh in development.
    // Production must not allow eval-based script execution.
    if (process.env.NODE_ENV !== "production") {
        scriptSources.push("'unsafe-eval'");
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
        connectSources.push(supabaseOrigin, "wss://*.supabase.co");
    }

    /**
     * Analytics origins are driven by the same config the tags themselves read
     * (`src/config/analytics.ts`), so the policy and the tags cannot drift.
     * Without this the browser blocks the tag outright: the site would look
     * correctly configured while silently recording nothing.
     */
    if (ANALYTICS.ga4Id || ANALYTICS.gtmId) {
        scriptSources.push(...ANALYTICS_CSP_ORIGINS.script);
        connectSources.push(...ANALYTICS_CSP_ORIGINS.connect);
    }

    if (ANALYTICS.metaPixelId) {
        scriptSources.push("https://connect.facebook.net");
        connectSources.push("https://www.facebook.com");
    }

    return [
        "default-src 'self'",
        // Vercel/Next inject inline bootstrap scripts; Tailwind v4 sets theme vars inline.
        `script-src ${scriptSources.join(" ")}`,
        `style-src 'self' 'unsafe-inline'`,
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        `connect-src ${connectSources.join(" ")}`,
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ].join("; ");
}

const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // DNS prefetch can leak browsing patterns; disable in production.
    { key: "X-DNS-Prefetch-Control", value: "off" },
    // HSTS: enforce HTTPS for 1 year. includeSubDomains and preload are
    // intentionally omitted until all subdomains are confirmed HTTPS-ready.
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    { key: "Content-Security-Policy", value: buildCsp() },
];

const nextConfig: NextConfig = {
    // Dev-only: allow the Playwright/E2E harness (which uses 127.0.0.1 while
    // the dev server binds localhost) to load dev assets. Without this, Next.js
    // blocks the client bundle cross-origin and pages never hydrate, so browser
    // tests would exercise an unhydrated form. Has no effect on production.
    allowedDevOrigins: ["127.0.0.1", "localhost"],
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
    async redirects() {
        return [
            { source: "/login", destination: "/auth/sign-in", permanent: true },
            {
                source: "/:path*",
                has: [{ type: "host", value: "arjunautomations.com" }],
                destination: "https://www.arjunautomations.com/:path*",
                permanent: true,
            },
            { source: "/industries", destination: "/services", statusCode: 301 },
            { source: "/case-studies/:path*", destination: "/demos", statusCode: 301 },
            { source: "/case-studies", destination: "/demos", statusCode: 301 },
            { source: "/portfolio/:path*", destination: "/demos", statusCode: 301 },
            { source: "/portfolio", destination: "/demos", statusCode: 301 },
            { source: "/resources/:path*", destination: "/", statusCode: 301 },
            { source: "/resources", destination: "/", statusCode: 301 },
            { source: "/blog/:path*", destination: "/", statusCode: 301 },
            { source: "/blog", destination: "/", statusCode: 301 },
            { source: "/help", destination: "/contact", statusCode: 301 },
            { source: "/careers", destination: "/about", statusCode: 301 },
            { source: "/features", destination: "/services", statusCode: 301 },
            { source: "/solutions", destination: "/services", statusCode: 301 },
            { source: "/faq", destination: "/#faq", statusCode: 301 },
            { source: "/sitemap", destination: "/", statusCode: 301 },
        ];
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: securityHeaders,
            },
        ];
    },
};

export default nextConfig;

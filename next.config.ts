import type { NextConfig } from "next";
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
            {
                source: "/login",
                destination: "/auth/sign-in",
                permanent: true,
            },
            {
                source: "/:path*",
                has: [
                    {
                        type: "host",
                        value: "arjunautomations.com",
                    },
                ],
                destination: "https://www.arjunautomations.com/:path*",
                permanent: true,
            },

            /**
             * Portfolio → Case Studies consolidation.
             *
             * A content-similarity audit found the six portfolio detail pages
             * and their six case-study counterparts were 75–84% identical (same
             * slugs, same industries, same challenge/solution prose, same stats).
             * Two pages targeting the same query splits ranking authority and
             * means Google indexes neither.
             *
             * `/case-studies/[slug]` is the richer page — it carries the
             * challenge, solution, implementation detail and outcomes — so each
             * portfolio URL permanently redirects to its case-study equivalent
             * and all link equity consolidates onto one canonical page.
             *
             * `/portfolio/integrations` has no case-study twin and stays live.
             * The `/portfolio` index remains as a hub that links into both.
             */
            {
                source: "/portfolio/ai-automation",
                destination: "/case-studies/ai-automation",
                permanent: true,
            },
            {
                source: "/portfolio/ai-agents",
                destination: "/case-studies/ai-agents",
                permanent: true,
            },
            {
                source: "/portfolio/business-automation",
                destination: "/case-studies/business-automation",
                permanent: true,
            },
            {
                source: "/portfolio/crm",
                destination: "/case-studies/crm",
                permanent: true,
            },
            {
                source: "/portfolio/erp",
                destination: "/case-studies/erp",
                permanent: true,
            },
            {
                source: "/portfolio/school-management",
                destination: "/case-studies/school-management",
                permanent: true,
            },
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

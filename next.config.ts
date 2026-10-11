import type { NextConfig } from "next";

const securityHeaders = [
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
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

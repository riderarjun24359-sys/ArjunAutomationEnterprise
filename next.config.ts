import type { NextConfig } from "next";

const securityHeaders = [
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    { key: "X-Frame-Options", value: "DENY" },
    {
        key: "Content-Security-Policy",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "media-src 'self' https:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests",
        ].join("; "),
    },
];

const nextConfig: NextConfig = {
    allowedDevOrigins: ["127.0.0.1", "localhost"],
    experimental: { optimizePackageImports: ["lucide-react"] },
    async redirects() {
        return [
            { source: "/login", destination: "/auth/sign-in", permanent: true },
            { source: "/:path*", has: [{ type: "host", value: "arjunautomations.com" }], destination: "https://www.arjunautomations.com/:path*", permanent: true },
            { source: "/industries", destination: "/services", statusCode: 301 },
            { source: "/features", destination: "/services", statusCode: 301 },
            { source: "/solutions", destination: "/services", statusCode: 301 },
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
            { source: "/faq", destination: "/#faq", statusCode: 301 },
            { source: "/sitemap", destination: "/", statusCode: 301 },
        ];
    },
    async headers() {
        return [{ source: "/(.*)", headers: securityHeaders }];
    },
};

export default nextConfig;

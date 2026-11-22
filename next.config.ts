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
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },
    async redirects() {
        return [
            { source: "/login", destination: "/auth/sign-in", permanent: true },
            { source: "/:path*", has: [{ type: "host", value: "arjunautomations.com" }], destination: "https://www.arjunautomations.com/:path*", permanent: true },
            { source: "/industries", destination: "/services", permanent: true },
            { source: "/features", destination: "/services", permanent: true },
            { source: "/solutions", destination: "/services", permanent: true },
            { source: "/case-studies/:path*", destination: "/demos", permanent: true },
            { source: "/case-studies", destination: "/demos", permanent: true },
            { source: "/portfolio/:path*", destination: "/demos", permanent: true },
            { source: "/portfolio", destination: "/demos", permanent: true },
            { source: "/resources/:path*", destination: "/", permanent: true },
            { source: "/resources", destination: "/", permanent: true },
            { source: "/blog/:path*", destination: "/", permanent: true },
            { source: "/blog", destination: "/", permanent: true },
            { source: "/help", destination: "/contact", permanent: true },
            { source: "/careers", destination: "/about", permanent: true },
            { source: "/faq", destination: "/#faq", permanent: true },
            { source: "/sitemap", destination: "/", permanent: true },
        ];
    },
    async headers() {
        return [{ source: "/(.*)", headers: securityHeaders }];
    },
};

export default nextConfig;

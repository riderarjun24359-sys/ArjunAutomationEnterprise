import { ANALYTICS, ANALYTICS_CSP_ORIGINS } from "@/src/config/analytics";

/**
 * Build a per-request CSP. The nonce is generated in the Next.js proxy and
 * forwarded on the request so Next can attach it to framework inline scripts.
 */
export function buildContentSecurityPolicy(nonce: string): string {
    if (!/^[A-Za-z0-9+/_=-]{16,}$/.test(nonce)) {
        throw new Error("A valid per-request CSP nonce is required");
    }

    const connectSources = ["'self'"];
    const scriptSources = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'"];

    if (process.env.NODE_ENV !== "production") {
        scriptSources.push("'unsafe-eval'");
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin;
        connectSources.push(supabaseOrigin, "wss://*.supabase.co");
    }

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
        `script-src ${scriptSources.join(" ")}`,
        "style-src 'self' 'unsafe-inline'",
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

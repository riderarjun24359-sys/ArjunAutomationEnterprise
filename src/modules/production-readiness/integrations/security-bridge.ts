import { SECURITY_HEADERS } from "../constants";

export function buildSecurityHardeningSnapshot() {
    return {
        authStatus: "Supabase Auth + server-side requireAuth on shell routes",
        sessionHandling: "HTTP-only cookies via Supabase middleware refresh",
        rateLimiting: "API rate limiting via secureApiRoute (60 req/min default)",
        securityHeaders: [...SECURITY_HEADERS],
        inputValidation: "Zod schemas on API routes + secureApiRoute RBAC",
        dependencyScan: "npm audit recommended in CI pipeline",
        secretManagement: "Environment variables — no secrets in repository",
        score: 88,
    };
}

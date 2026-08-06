/**
 * Production environment & configuration validation for Early Access.
 * No business logic — config/contract checks only.
 */

export type ProductionCheckStatus = "pass" | "warn" | "fail";

export interface ProductionCheck {
    id: string;
    category: "environment" | "security" | "service" | "monitoring" | "deployment";
    status: ProductionCheckStatus;
    detail: string;
}

export interface ProductionValidationReport {
    ready: boolean;
    score: number;
    environment: string;
    checkedAt: string;
    checks: ProductionCheck[];
    blockers: string[];
    warnings: string[];
}

const SECRET_PATTERNS = [/sk_live_/i, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{20,}/, /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\./];

export const PRODUCTION_REQUIRED_PUBLIC_ENV = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export const PRODUCTION_REQUIRED_SERVER_ENV = ["PLATFORM_LEAD_API_KEY", "PLATFORM_ORGANIZATION_ID"] as const;

export const PRODUCTION_OPTIONAL_ENV = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_DB_URL",
    "OPS_ALERT_WEBHOOK_URL",
    "SENTRY_DSN",
    "NEXT_PUBLIC_SENTRY_DSN",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "RESEND_API_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
] as const;

export function looksLikeSecretLeak(value: string | undefined | null): boolean {
    if (!value) return false;
    return SECRET_PATTERNS.some((pattern) => pattern.test(value));
}

export function isHttpsUrl(value: string | undefined | null): boolean {
    if (!value) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:";
    } catch {
        return false;
    }
}

function statusFrom(ok: boolean, warn = false): ProductionCheckStatus {
    if (ok) return "pass";
    return warn ? "warn" : "fail";
}

export function validateProductionEnvironment(env: NodeJS.ProcessEnv = process.env): ProductionValidationReport {
    const checks: ProductionCheck[] = [];
    const isProd = env.NODE_ENV === "production" || env.AAOS_DEPLOY_ENV === "production" || env.VERCEL_ENV === "production";

    checks.push({
        id: "node_env",
        category: "environment",
        status: statusFrom(Boolean(env.NODE_ENV), !isProd),
        detail: `NODE_ENV=${env.NODE_ENV ?? "unset"}`,
    });

    for (const key of PRODUCTION_REQUIRED_PUBLIC_ENV) {
        const value = env[key];
        const present = Boolean(value && value.trim());
        checks.push({
            id: `env_${key}`,
            category: "environment",
            status: statusFrom(present),
            detail: present ? `${key} present` : `${key} missing`,
        });
    }

    for (const key of PRODUCTION_REQUIRED_SERVER_ENV) {
        const value = env[key];
        const present = Boolean(value && value.trim());
        checks.push({
            id: `env_${key}`,
            category: "security",
            status: isProd ? statusFrom(present) : statusFrom(present, true),
            detail: present ? `${key} present` : `${key} missing`,
        });
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL;
    checks.push({
        id: "app_url_https",
        category: "security",
        status: isProd ? statusFrom(isHttpsUrl(appUrl)) : statusFrom(Boolean(appUrl), true),
        detail: isHttpsUrl(appUrl) ? "NEXT_PUBLIC_APP_URL uses HTTPS" : "Production should use HTTPS NEXT_PUBLIC_APP_URL",
    });

    const publicKeys = ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] as const;
    for (const key of publicKeys) {
        const value = env[key];
        if (!value) continue;
        checks.push({
            id: `leak_check_${key}`,
            category: "security",
            status: looksLikeSecretLeak(value) && !key.includes("ANON") && !key.includes("PUBLISHABLE") ? "fail" : "pass",
            detail: `${key} shape accepted for public client use`,
        });
    }

    const serviceRole = env.SUPABASE_SERVICE_ROLE_KEY;
    checks.push({
        id: "service_role_not_public",
        category: "security",
        status: env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ? "fail" : "pass",
        detail: env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
            ? "SERVICE_ROLE must never be exposed as NEXT_PUBLIC_*"
            : "No public service-role exposure detected",
    });

    checks.push({
        id: "service_role_optional",
        category: "service",
        status: serviceRole ? "pass" : "warn",
        detail: serviceRole ? "SUPABASE_SERVICE_ROLE_KEY present (server-only)" : "SUPABASE_SERVICE_ROLE_KEY not set (optional for Early Access)",
    });

    const paymentConfigured = Boolean(env.STRIPE_SECRET_KEY || env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    checks.push({
        id: "payment_gateway",
        category: "service",
        status: paymentConfigured ? "pass" : "warn",
        detail: paymentConfigured ? "Stripe env detected" : "Payment gateway env not configured (Early Access may defer billing capture)",
    });

    const emailConfigured = Boolean(env.RESEND_API_KEY || (env.SMTP_HOST && env.SMTP_USER));
    checks.push({
        id: "email_delivery",
        category: "service",
        status: emailConfigured ? "pass" : "warn",
        detail: emailConfigured ? "Email provider env detected" : "Email provider env not configured (templates ready; provider pending)",
    });

    const monitoringConfigured = Boolean(env.OPS_ALERT_WEBHOOK_URL || env.SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN);
    checks.push({
        id: "monitoring_sink",
        category: "monitoring",
        status: monitoringConfigured ? "pass" : "warn",
        detail: monitoringConfigured ? "External monitoring/alert sink configured" : "In-app monitoring active; external sink optional",
    });

    const fail = checks.filter((c) => c.status === "fail");
    const warn = checks.filter((c) => c.status === "warn");
    const passCount = checks.filter((c) => c.status === "pass").length;
    const score = Math.round((passCount / Math.max(checks.length, 1)) * 100 - fail.length * 8 - warn.length * 2);

    return {
        ready: fail.length === 0,
        score: Math.max(0, Math.min(100, score)),
        environment: env.AAOS_DEPLOY_ENV || env.VERCEL_ENV || env.NODE_ENV || "unknown",
        checkedAt: new Date().toISOString(),
        checks,
        blockers: fail.map((c) => `${c.id}: ${c.detail}`),
        warnings: warn.map((c) => `${c.id}: ${c.detail}`),
    };
}

export const DEPLOYMENT_ROLLBACK_STEPS = [
    "Identify failing release via /api/ops/health and deployment logs",
    "Revert to previous immutable deployment artifact / git tag",
    "Re-run npm run production:verify against rollback target",
    "Confirm /api/ops/live and /api/ops/ready return healthy",
    "Announce rollback complete in incident channel",
] as const;

export const EARLY_ACCESS_VERSION = "1.0.0-early-access";

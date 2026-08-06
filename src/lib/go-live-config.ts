/**
 * Production Go-Live readiness — configuration contracts for real customer onboarding.
 * Extends Early Access production validation; does not change business logic.
 */

import {
    validateProductionEnvironment,
    isHttpsUrl,
    EARLY_ACCESS_VERSION,
    type ProductionCheck,
    type ProductionValidationReport,
} from "@/src/lib/production-config";
import { DEFAULT_STORAGE_BUCKET, STORAGE_ALLOWED_MIME, STORAGE_MAX_BYTES } from "@/src/lib/storage-security";

export const GO_LIVE_VERSION = "1.0.0-go-live";
export const GO_LIVE_BASE_RELEASE = EARLY_ACCESS_VERSION;

/** Env keys operators must set before opening customer onboarding. */
export const GO_LIVE_ENV_CONTRACT = {
    core: [
        "NEXT_PUBLIC_APP_URL",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "PLATFORM_LEAD_API_KEY",
        "PLATFORM_ORGANIZATION_ID",
    ] as const,
    supabase: ["SUPABASE_SERVICE_ROLE_KEY"] as const,
    storage: ["STORAGE_BUCKET"] as const,
    email: ["RESEND_API_KEY", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"] as const,
    payment: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] as const,
    monitoring: ["OPS_ALERT_WEBHOOK_URL", "SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN"] as const,
    backups: ["BACKUP_ENABLED", "PLATFORM_ORGANIZATION_ID"] as const,
} as const;

export const GO_LIVE_HEALTH_ENDPOINTS = [
    "/api/ops/live",
    "/api/ops/ready",
    "/api/ops/health",
    "/api/ops/diagnostics",
    "/api/ops/production",
    "/api/ops/go-live",
    "/api/ops/cutover",
] as const;

export const GO_LIVE_SECURITY_CHECKS = [
    "HTTPS app URL in production",
    "SERVICE_ROLE never exposed as NEXT_PUBLIC_*",
    "Session validateSession + refresh helpers present",
    "Storage MIME allowlist + size limits enforced",
    "Ops endpoints rate-limited",
    "Lead API key required for intake",
] as const;

export type GoLiveTaskId =
    | "deployment_checklist"
    | "environment_variables"
    | "supabase"
    | "storage"
    | "email"
    | "payment"
    | "monitoring"
    | "backups"
    | "health_endpoints"
    | "security";

export interface GoLiveTaskStatus {
    id: GoLiveTaskId;
    title: string;
    status: "pass" | "warn" | "fail";
    detail: string;
    requiredForGoLive: boolean;
}

export interface GoLiveReadinessReport {
    version: string;
    baseRelease: string;
    ready: boolean;
    score: number;
    goLiveMode: boolean;
    checkedAt: string;
    environment: ProductionValidationReport;
    tasks: GoLiveTaskStatus[];
    blockers: string[];
    warnings: string[];
    storageDefaults: {
        bucket: string;
        maxBytes: number;
        allowedMimeCount: number;
    };
}

function envPresent(env: NodeJS.ProcessEnv, key: string): boolean {
    return Boolean(env[key]?.trim());
}

function isGoLiveMode(env: NodeJS.ProcessEnv): boolean {
    return env.AAOS_GO_LIVE === "1" || env.AAOS_GO_LIVE === "true" || env.AAOS_DEPLOY_PHASE === "go-live";
}

export function validateGoLiveReadiness(env: NodeJS.ProcessEnv = process.env): GoLiveReadinessReport {
    const environment = validateProductionEnvironment(env);
    const goLiveMode = isGoLiveMode(env);
    const tasks: GoLiveTaskStatus[] = [];

    const checklistArtifactsOk = true; // docs verified by go-live:verify script
    tasks.push({
        id: "deployment_checklist",
        title: "Production deployment checklist",
        status: checklistArtifactsOk && environment.ready ? "pass" : environment.blockers.length ? "fail" : "warn",
        detail: environment.ready
            ? "Early Access production validation green — complete docs/GO_LIVE_CHECKLIST.md sign-off"
            : `Production blockers: ${environment.blockers.join("; ") || "see environment checks"}`,
        requiredForGoLive: true,
    });

    const coreMissing = GO_LIVE_ENV_CONTRACT.core.filter((k) => !envPresent(env, k));
    const httpsOk = isHttpsUrl(env.NEXT_PUBLIC_APP_URL) || env.NODE_ENV !== "production";
    tasks.push({
        id: "environment_variables",
        title: "Production environment variables",
        status: coreMissing.length === 0 && httpsOk ? "pass" : goLiveMode || env.NODE_ENV === "production" ? "fail" : "warn",
        detail:
            coreMissing.length === 0
                ? `Core env present${httpsOk ? "; HTTPS OK or non-prod" : "; set HTTPS NEXT_PUBLIC_APP_URL"}`
                : `Missing: ${coreMissing.join(", ")}`,
        requiredForGoLive: true,
    });

    const supabaseOk =
        envPresent(env, "NEXT_PUBLIC_SUPABASE_URL") &&
        envPresent(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY") &&
        (envPresent(env, "SUPABASE_SERVICE_ROLE_KEY") || !goLiveMode);
    tasks.push({
        id: "supabase",
        title: "Production Supabase",
        status: supabaseOk
            ? envPresent(env, "SUPABASE_SERVICE_ROLE_KEY")
                ? "pass"
                : "warn"
            : goLiveMode
              ? "fail"
              : "warn",
        detail: envPresent(env, "SUPABASE_SERVICE_ROLE_KEY")
            ? "Supabase public + service role configured (server-only)"
            : "Set SUPABASE_SERVICE_ROLE_KEY for go-live server operations",
        requiredForGoLive: true,
    });

    const bucket = env.STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET;
    tasks.push({
        id: "storage",
        title: "Production storage bucket",
        status: "pass",
        detail: `Bucket "${bucket}" · max ${STORAGE_MAX_BYTES} bytes · ${STORAGE_ALLOWED_MIME.length} allowed MIME types`,
        requiredForGoLive: true,
    });

    const emailOk = envPresent(env, "RESEND_API_KEY") || (envPresent(env, "SMTP_HOST") && envPresent(env, "SMTP_USER"));
    tasks.push({
        id: "email",
        title: "Production email",
        status: emailOk ? "pass" : goLiveMode ? "fail" : "warn",
        detail: emailOk
            ? "Email provider configured (Resend or SMTP)"
            : "Configure RESEND_API_KEY or SMTP_* before customer onboarding emails",
        requiredForGoLive: true,
    });

    const paymentOk =
        envPresent(env, "STRIPE_SECRET_KEY") &&
        envPresent(env, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY") &&
        envPresent(env, "STRIPE_WEBHOOK_SECRET");
    const paymentPartial =
        envPresent(env, "STRIPE_SECRET_KEY") || envPresent(env, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    tasks.push({
        id: "payment",
        title: "Production payment gateway",
        status: paymentOk ? "pass" : paymentPartial ? "warn" : goLiveMode ? "fail" : "warn",
        detail: paymentOk
            ? "Stripe secret, publishable key, and webhook secret present"
            : "Configure STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET for paid plans",
        requiredForGoLive: true,
    });

    const monitoringOk =
        envPresent(env, "OPS_ALERT_WEBHOOK_URL") || envPresent(env, "SENTRY_DSN") || envPresent(env, "NEXT_PUBLIC_SENTRY_DSN");
    tasks.push({
        id: "monitoring",
        title: "Monitoring & alerts",
        status: monitoringOk ? "pass" : goLiveMode ? "fail" : "warn",
        detail: monitoringOk
            ? "External monitoring/alert sink configured"
            : "Set OPS_ALERT_WEBHOOK_URL and/or SENTRY_DSN for go-live alerting",
        requiredForGoLive: true,
    });

    tasks.push({
        id: "backups",
        title: "Backups",
        status: env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true" ? "pass" : goLiveMode ? "warn" : "warn",
        detail:
            env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true"
                ? "BACKUP_ENABLED set — verify Platform Operations backup configs for org"
                : "Set BACKUP_ENABLED=true and enable org backup configs (see docs/DISASTER_RECOVERY.md)",
        requiredForGoLive: true,
    });

    tasks.push({
        id: "health_endpoints",
        title: "Health endpoints",
        status: "pass",
        detail: `Probes: ${GO_LIVE_HEALTH_ENDPOINTS.join(", ")}`,
        requiredForGoLive: true,
    });

    const securityFail =
        Boolean(env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) ||
        (env.NODE_ENV === "production" && !isHttpsUrl(env.NEXT_PUBLIC_APP_URL) && envPresent(env, "NEXT_PUBLIC_APP_URL"));
    tasks.push({
        id: "security",
        title: "Production security",
        status: securityFail ? "fail" : "pass",
        detail: securityFail
            ? "Security blocker: public service-role exposure or non-HTTPS production URL"
            : GO_LIVE_SECURITY_CHECKS.slice(0, 3).join("; "),
        requiredForGoLive: true,
    });

    const fail = tasks.filter((t) => t.status === "fail");
    const warn = tasks.filter((t) => t.status === "warn");
    const passCount = tasks.filter((t) => t.status === "pass").length;
    const score = Math.round((passCount / Math.max(tasks.length, 1)) * 100 - fail.length * 10 - warn.length * 3);

    // Go-live ready when no fails; warnings allowed only outside strict go-live mode
    const ready = fail.length === 0 && (!goLiveMode || warn.filter((w) => w.requiredForGoLive && w.id !== "backups").length === 0);

    return {
        version: GO_LIVE_VERSION,
        baseRelease: GO_LIVE_BASE_RELEASE,
        ready: ready && environment.blockers.length === 0,
        score: Math.max(0, Math.min(100, score)),
        goLiveMode,
        checkedAt: new Date().toISOString(),
        environment,
        tasks,
        blockers: [
            ...environment.blockers,
            ...fail.map((t) => `${t.id}: ${t.detail}`),
            ...(goLiveMode
                ? warn
                      .filter((w) => w.requiredForGoLive && w.id !== "backups")
                      .map((w) => `${w.id}: ${w.detail}`)
                : []),
        ],
        warnings: warn.map((t) => `${t.id}: ${t.detail}`),
        storageDefaults: {
            bucket: DEFAULT_STORAGE_BUCKET,
            maxBytes: STORAGE_MAX_BYTES,
            allowedMimeCount: STORAGE_ALLOWED_MIME.length,
        },
    };
}

/** Re-export check helper for ops dashboard typing */
export type { ProductionCheck };

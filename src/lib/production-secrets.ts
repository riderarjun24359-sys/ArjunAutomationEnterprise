/**
 * Production secrets — validation + startup fail-closed for Early Access cutover.
 */

export const CUTOVER_CRITICAL_SECRETS = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "PLATFORM_LEAD_API_KEY",
] as const;

export const CUTOVER_RECOMMENDED_SECRETS = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "OPS_ALERT_WEBHOOK_URL",
    "SENTRY_DSN",
    "BACKUP_ENABLED",
    "PLATFORM_ORGANIZATION_ID",
] as const;

export class ProductionSecretsError extends Error {
    readonly missing: string[];

    constructor(missing: string[]) {
        super(`Critical production secrets missing: ${missing.join(", ")}`);
        this.name = "ProductionSecretsError";
        this.missing = missing;
    }
}

function present(env: NodeJS.ProcessEnv, key: string): boolean {
    return Boolean(env[key]?.trim());
}

export function isProductionCutoverRuntime(env: NodeJS.ProcessEnv = process.env): boolean {
    return (
        env.AAOS_CUTOVER === "1" ||
        env.AAOS_CUTOVER === "true" ||
        env.AAOS_DEPLOY_ENV === "production" ||
        env.VERCEL_ENV === "production" ||
        (env.NODE_ENV === "production" && env.AAOS_FAIL_ON_MISSING_SECRETS === "true")
    );
}

export function listMissingCriticalSecrets(env: NodeJS.ProcessEnv = process.env): string[] {
    return CUTOVER_CRITICAL_SECRETS.filter((key) => !present(env, key));
}

export function listMissingRecommendedSecrets(env: NodeJS.ProcessEnv = process.env): string[] {
    const missing: string[] = [];
    if (!present(env, "SUPABASE_SERVICE_ROLE_KEY")) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    const emailOk = present(env, "RESEND_API_KEY") || (present(env, "SMTP_HOST") && present(env, "SMTP_USER"));
    if (!emailOk) missing.push("RESEND_API_KEY|SMTP_*");
    if (!present(env, "STRIPE_SECRET_KEY")) missing.push("STRIPE_SECRET_KEY");
    if (!present(env, "STRIPE_WEBHOOK_SECRET")) missing.push("STRIPE_WEBHOOK_SECRET");
    if (!present(env, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    if (!present(env, "OPS_ALERT_WEBHOOK_URL") && !present(env, "SENTRY_DSN")) missing.push("OPS_ALERT_WEBHOOK_URL|SENTRY_DSN");
    if (env.BACKUP_ENABLED !== "1" && env.BACKUP_ENABLED !== "true") missing.push("BACKUP_ENABLED");
    if (!present(env, "PLATFORM_ORGANIZATION_ID")) missing.push("PLATFORM_ORGANIZATION_ID");
    return missing;
}

export interface SecretLoadingReport {
    cutoverRuntime: boolean;
    criticalPresent: boolean;
    missingCritical: string[];
    missingRecommended: string[];
    serviceRolePublicLeak: boolean;
    checkedAt: string;
}

export function validateSecretLoading(env: NodeJS.ProcessEnv = process.env): SecretLoadingReport {
    const missingCritical = listMissingCriticalSecrets(env);
    return {
        cutoverRuntime: isProductionCutoverRuntime(env),
        criticalPresent: missingCritical.length === 0,
        missingCritical,
        missingRecommended: listMissingRecommendedSecrets(env),
        serviceRolePublicLeak: Boolean(env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY),
        checkedAt: new Date().toISOString(),
    };
}

/**
 * Fail-closed startup gate. Throws when cutover/production runtime lacks critical secrets
 * or when SERVICE_ROLE is exposed as NEXT_PUBLIC_*.
 */
export function assertCriticalProductionSecrets(env: NodeJS.ProcessEnv = process.env): void {
    const report = validateSecretLoading(env);
    if (report.serviceRolePublicLeak) {
        throw new ProductionSecretsError(["NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY must never be set"]);
    }
    if (!report.cutoverRuntime) return;
    if (report.missingCritical.length > 0) {
        throw new ProductionSecretsError(report.missingCritical);
    }
}

/**
 * Production cutover validation — Early Access configuration gate.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateProductionEnvironment, isHttpsUrl, EARLY_ACCESS_VERSION } from "@/src/lib/production-config";
import { validateGoLiveReadiness } from "@/src/lib/go-live-config";
import { validateSecretLoading, type SecretLoadingReport } from "@/src/lib/production-secrets";
import { DEFAULT_STORAGE_BUCKET, STORAGE_ALLOWED_MIME, STORAGE_MAX_BYTES } from "@/src/lib/storage-security";
import { verifyRestoreProcedure } from "@/src/lib/disaster-recovery";
import {
    CUTOVER_EMAIL_TEMPLATES,
    isEmailProviderConfigured,
    listEmailTemplateStatus,
} from "@/src/lib/production-email";
import {
    isPaymentGatewayConfigured,
    isStripeWebhookSecretConfigured,
    PAYMENT_WEBHOOK_PATH,
} from "@/src/lib/production-payments";

export const CUTOVER_VERSION = "1.0.0-early-access-cutover";
export const CUTOVER_BASE = EARLY_ACCESS_VERSION;

export type CutoverStatus = "pass" | "warn" | "fail";

export interface CutoverCheck {
    id: string;
    area: "secrets" | "supabase" | "email" | "payments" | "monitoring" | "cutover";
    status: CutoverStatus;
    detail: string;
}

export interface ProductionCutoverReport {
    version: string;
    baseRelease: string;
    ready: boolean;
    score: number;
    checkedAt: string;
    secrets: SecretLoadingReport;
    checks: CutoverCheck[];
    blockers: string[];
    warnings: string[];
    readinessMarkdown: string;
}

function envPresent(env: NodeJS.ProcessEnv, key: string): boolean {
    return Boolean(env[key]?.trim());
}

function scanMigrations(cwd = process.cwd()): { files: number; rlsEnable: number; policies: number } {
    const dir = join(cwd, "supabase", "migrations");
    if (!existsSync(dir)) return { files: 0, rlsEnable: 0, policies: 0 };
    const files = readdirSync(dir).filter((f) => f.endsWith(".sql"));
    let rlsEnable = 0;
    let policies = 0;
    for (const file of files) {
        const text = readFileSync(join(dir, file), "utf8").toLowerCase();
        rlsEnable += (text.match(/enable row level security/g) ?? []).length;
        policies += (text.match(/create policy/g) ?? []).length;
    }
    return { files: files.length, rlsEnable, policies };
}

export function validateProductionCutover(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): ProductionCutoverReport {
    const secrets = validateSecretLoading(env);
    const production = validateProductionEnvironment(env);
    const goLive = validateGoLiveReadiness(env);
    const checks: CutoverCheck[] = [];
    const migrations = scanMigrations(cwd);
    const emailTemplates = listEmailTemplateStatus(cwd);
    const restore = verifyRestoreProcedure();

    // 1. Secrets
    checks.push({
        id: "secrets_critical",
        area: "secrets",
        status: secrets.criticalPresent && !secrets.serviceRolePublicLeak ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: secrets.criticalPresent
            ? "Critical secrets present"
            : `Missing critical: ${secrets.missingCritical.join(", ") || "none"}`,
    });
    checks.push({
        id: "secrets_loading",
        area: "secrets",
        status: secrets.serviceRolePublicLeak ? "fail" : "pass",
        detail: secrets.serviceRolePublicLeak
            ? "SERVICE_ROLE exposed as NEXT_PUBLIC_*"
            : "Secret loading contract validated (no public service-role leak)",
    });
    checks.push({
        id: "secrets_startup_gate",
        area: "secrets",
        status: existsSync(join(cwd, "instrumentation.ts")) ? "pass" : "fail",
        detail: "instrumentation.ts registers assertCriticalProductionSecrets on Node runtime",
    });

    // 2. Supabase
    checks.push({
        id: "supabase_env",
        area: "supabase",
        status: envPresent(env, "NEXT_PUBLIC_SUPABASE_URL") && envPresent(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY") ? "pass" : "fail",
        detail: "Supabase URL + anon key",
    });
    checks.push({
        id: "supabase_service_role",
        area: "supabase",
        status: envPresent(env, "SUPABASE_SERVICE_ROLE_KEY") ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: envPresent(env, "SUPABASE_SERVICE_ROLE_KEY")
            ? "SUPABASE_SERVICE_ROLE_KEY present (server-only)"
            : "Set SUPABASE_SERVICE_ROLE_KEY for production cutover",
    });
    checks.push({
        id: "supabase_migrations",
        area: "supabase",
        status: migrations.files > 0 ? "pass" : "fail",
        detail: `${migrations.files} migration SQL files present — apply with npm run db:apply on production`,
    });
    checks.push({
        id: "supabase_rls",
        area: "supabase",
        status: migrations.rlsEnable > 0 && migrations.policies > 0 ? "pass" : "warn",
        detail: `RLS enable statements: ${migrations.rlsEnable}; policies: ${migrations.policies}`,
    });
    checks.push({
        id: "supabase_storage",
        area: "supabase",
        status: "pass",
        detail: `Bucket "${env.STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET}" · ${STORAGE_MAX_BYTES} byte cap · ${STORAGE_ALLOWED_MIME.length} MIME types`,
    });
    checks.push({
        id: "supabase_backups",
        area: "supabase",
        status: env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true" ? "pass" : "warn",
        detail:
            env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true"
                ? `BACKUP_ENABLED · restore guide: ${restore.detail}`
                : "Set BACKUP_ENABLED=true and enable Platform Operations backup configs",
    });

    // 3. Email
    const emailOk = isEmailProviderConfigured(env);
    const templatesOk = emailTemplates.every((t) => t.present);
    checks.push({
        id: "email_provider",
        area: "email",
        status: emailOk ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: emailOk ? "Resend or SMTP provider configured" : "Configure RESEND_API_KEY or SMTP_*",
    });
    checks.push({
        id: "email_templates",
        area: "email",
        status: templatesOk ? "pass" : "fail",
        detail: templatesOk
            ? `Transactional templates: ${CUTOVER_EMAIL_TEMPLATES.map((t) => t.id).join(", ")}`
            : `Missing templates: ${emailTemplates.filter((t) => !t.present).map((t) => t.id).join(", ")}`,
    });
    checks.push({
        id: "email_password_reset",
        area: "email",
        status: emailTemplates.some((t) => t.id === "password-reset" && t.present) ? "pass" : "fail",
        detail: "password-reset.md template for recovery emails",
    });
    checks.push({
        id: "email_onboarding",
        area: "email",
        status: emailTemplates.filter((t) => ["welcome", "verify-email", "invite-teammate"].includes(t.id)).every((t) => t.present)
            ? "pass"
            : "fail",
        detail: "welcome + verify-email + invite-teammate onboarding templates",
    });

    // 4. Payments
    const payOk = isPaymentGatewayConfigured(env);
    const whOk = isStripeWebhookSecretConfigured(env);
    checks.push({
        id: "payments_gateway",
        area: "payments",
        status: payOk ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: payOk ? "Stripe live/test keys configured" : "Configure STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    });
    checks.push({
        id: "payments_webhook",
        area: "payments",
        status: whOk && existsSync(join(cwd, "app/api/payments/webhook/route.ts")) ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: `Webhook path ${PAYMENT_WEBHOOK_PATH} · secret ${whOk ? "set" : "missing"}`,
    });
    checks.push({
        id: "payments_subscription_surface",
        area: "payments",
        status: existsSync(join(cwd, "src/modules/billing-finance/services/billing-finance-os.service.ts")) ? "pass" : "fail",
        detail: "Billing Finance OS subscription lifecycle surface present (unchanged)",
    });
    checks.push({
        id: "payments_invoice_surface",
        area: "payments",
        status: existsSync(join(cwd, "src/modules/billing-finance/components/os/InvoiceCenterPanel.tsx")) ? "pass" : "fail",
        detail: "Invoice Center flow present in Billing Finance OS",
    });

    // 5. Monitoring
    const monitoringOk = envPresent(env, "OPS_ALERT_WEBHOOK_URL") || envPresent(env, "SENTRY_DSN") || envPresent(env, "NEXT_PUBLIC_SENTRY_DSN");
    checks.push({
        id: "monitoring_alerts",
        area: "monitoring",
        status: monitoringOk ? "pass" : "warn",
        detail: monitoringOk ? "External alert sink configured" : "Set OPS_ALERT_WEBHOOK_URL and/or SENTRY_DSN",
    });
    const healthFiles = ["live", "ready", "health", "diagnostics", "production", "go-live", "cutover"].every((name) =>
        existsSync(join(cwd, `app/api/ops/${name}/route.ts`)),
    );
    checks.push({
        id: "monitoring_health",
        area: "monitoring",
        status: healthFiles ? "pass" : "fail",
        detail: "Ops health endpoints: live, ready, health, diagnostics, production, go-live, cutover",
    });
    checks.push({
        id: "monitoring_logging",
        area: "monitoring",
        status: existsSync(join(cwd, "src/lib/production-logger.ts")) && existsSync(join(cwd, "src/lib/ops-monitoring.ts")) ? "pass" : "fail",
        detail: "production-logger + ops-monitoring present",
    });
    checks.push({
        id: "monitoring_diagnostics",
        area: "monitoring",
        status: existsSync(join(cwd, "app/api/ops/diagnostics/route.ts")) ? "pass" : "fail",
        detail: "/api/ops/diagnostics authenticated diagnostics route",
    });

    // 6. Final cutover
    const httpsOk = isHttpsUrl(env.NEXT_PUBLIC_APP_URL) || env.NODE_ENV !== "production";
    checks.push({
        id: "cutover_go_live_checklist",
        area: "cutover",
        status: existsSync(join(cwd, "docs/GO_LIVE_CHECKLIST.md")) ? "pass" : "fail",
        detail: "docs/GO_LIVE_CHECKLIST.md present for execution",
    });
    checks.push({
        id: "cutover_environment",
        area: "cutover",
        status: production.ready && httpsOk ? "pass" : production.blockers.length ? "fail" : "warn",
        detail: production.ready
            ? `Production env score ${production.score}; go-live score ${goLive.score}`
            : `Production blockers: ${production.blockers.join("; ") || "see checks"}`,
    });
    checks.push({
        id: "cutover_readiness_report",
        area: "cutover",
        status: existsSync(join(cwd, "docs/PRODUCTION_READINESS_REPORT.md")) || existsSync(join(cwd, "scripts/generate-production-readiness-report.mjs"))
            ? "pass"
            : "fail",
        detail: "Production readiness report generator / artifact present",
    });

    const fail = checks.filter((c) => c.status === "fail");
    const warn = checks.filter((c) => c.status === "warn");
    const passCount = checks.filter((c) => c.status === "pass").length;
    const score = Math.round((passCount / Math.max(checks.length, 1)) * 100 - fail.length * 8 - warn.length * 2);
    const ready = fail.length === 0 && (!secrets.cutoverRuntime || warn.filter((w) => w.area === "secrets" || w.area === "supabase").length === 0);

    const readinessMarkdown = buildReadinessMarkdown({
        version: CUTOVER_VERSION,
        score: Math.max(0, Math.min(100, score)),
        ready: ready && secrets.criticalPresent,
        checks,
        secrets,
        migrations,
    });

    return {
        version: CUTOVER_VERSION,
        baseRelease: CUTOVER_BASE,
        ready: ready && secrets.criticalPresent && !secrets.serviceRolePublicLeak,
        score: Math.max(0, Math.min(100, score)),
        checkedAt: new Date().toISOString(),
        secrets,
        checks,
        blockers: fail.map((c) => `${c.id}: ${c.detail}`),
        warnings: warn.map((c) => `${c.id}: ${c.detail}`),
        readinessMarkdown,
    };
}

function buildReadinessMarkdown(input: {
    version: string;
    score: number;
    ready: boolean;
    checks: CutoverCheck[];
    secrets: SecretLoadingReport;
    migrations: { files: number; rlsEnable: number; policies: number };
}): string {
    const lines = [
        `# Production Readiness Report`,
        ``,
        `**Version:** ${input.version}  `,
        `**Generated:** ${new Date().toISOString()}  `,
        `**Ready:** ${input.ready ? "YES" : "NO"}  `,
        `**Score:** ${input.score}/100  `,
        ``,
        `## Secrets`,
        ``,
        `- Cutover runtime: ${input.secrets.cutoverRuntime}`,
        `- Critical present: ${input.secrets.criticalPresent}`,
        `- Missing critical: ${input.secrets.missingCritical.join(", ") || "none"}`,
        `- Missing recommended: ${input.secrets.missingRecommended.join(", ") || "none"}`,
        ``,
        `## Supabase migrations`,
        ``,
        `- SQL files: ${input.migrations.files}`,
        `- RLS enable statements: ${input.migrations.rlsEnable}`,
        `- Policies: ${input.migrations.policies}`,
        ``,
        `## Checks`,
        ``,
        `| ID | Area | Status | Detail |`,
        `|---|---|---|---|`,
        ...input.checks.map((c) => `| ${c.id} | ${c.area} | ${c.status} | ${c.detail.replace(/\|/g, "/")} |`),
        ``,
        `## Operator next steps`,
        ``,
        `1. Complete \`docs/GO_LIVE_CHECKLIST.md\` and \`docs/PRODUCTION_CUTOVER.md\``,
        `2. Apply migrations: \`npm run db:apply\` against production`,
        `3. Set \`AAOS_CUTOVER=true\` / \`AAOS_DEPLOY_ENV=production\` with all secrets`,
        `4. Probe \`/api/ops/cutover\`, \`/api/ops/live\`, \`/api/ops/ready\``,
        `5. Register Stripe webhook → \`/api/payments/webhook\``,
        ``,
    ];
    return lines.join("\n");
}

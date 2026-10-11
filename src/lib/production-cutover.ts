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
    isRazorpayPaymentWebhookConfigured,
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
    const dir = join(/*turbopackIgnore: true*/ cwd, "supabase", "migrations");
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

/**
 * True when the full repository source tree is present (local dev / CI).
 *
 * The deployed (Vercel) bundle contains only the compiled app output, so
 * source-tree paths — `supabase/migrations`, `instrumentation.ts`, route
 * sources, `docs/*` — are absent at runtime. File-presence checks against
 * those paths must therefore be reported as *unverifiable in the deployed
 * runtime* (`warn`) rather than `fail`: before this, `/api/ops/cutover`
 * asserted things like "0 migration SQL files present — apply with
 * `npm run db:apply` on production" on a host where every migration is
 * already applied, which is a false blocker nobody could ever clear.
 */
function sourceTreePresent(cwd: string): boolean {
    return existsSync(join(/*turbopackIgnore: true*/ cwd, "supabase", "migrations"));
}

export function validateProductionCutover(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): ProductionCutoverReport {
    const secrets = validateSecretLoading(env);
    const production = validateProductionEnvironment(env);
    const goLive = validateGoLiveReadiness(env);
    const checks: CutoverCheck[] = [];
    const sourceTree = sourceTreePresent(cwd);

    /**
     * File-presence check. Locally the source tree is authoritative, so an
     * absent file is a genuine `fail` (kept exactly as before). In the deployed
     * runtime the source tree is not bundled, so absence means "cannot be
     * verified here" — reported as `warn` with an explicit note so the report
     * never claims a source artefact is missing when it simply is not shipped.
     */
    const fileCheck = (
        id: CutoverCheck["id"],
        area: CutoverCheck["area"],
        present: boolean,
        detail: string,
        runtimeDetail?: string,
    ): CutoverCheck => {
        if (present) return { id, area, status: "pass", detail };
        if (sourceTree) return { id, area, status: "fail", detail };
        return {
            id,
            area,
            status: "warn",
            detail: `${runtimeDetail ?? detail} — not verifiable in the deployed runtime (source tree is not bundled); enforced in CI by production-cutover:verify`,
        };
    };
    /** Suffix appended to every check that cannot be evaluated in the deployed bundle. */
    const RUNTIME_NOTE = "not verifiable in the deployed runtime (source tree is not bundled); enforced in CI production-cutover:verify";
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
    checks.push(
        fileCheck(
            "secrets_startup_gate",
            "secrets",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "instrumentation.ts")),
            "instrumentation.ts registers assertCriticalProductionSecrets on Node runtime",
            "instrumentation.ts is compiled into the deployed bundle; the secret assertion runs at Node cold start",
        ),
    );

    // 2. Supabase
    // The app authenticates with NEXT_PUBLIC_SUPABASE_ANON_KEY (see getSupabaseAnonKey,
    // production-config.ts, go-live-config.ts). Accept the newer PUBLISHABLE key as an
    // equivalent — but the classic anon key alone must not fail the gate.
    const supabasePublicKeyPresent =
        envPresent(env, "NEXT_PUBLIC_SUPABASE_URL") &&
        (envPresent(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY") || envPresent(env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
    checks.push({
        id: "supabase_env",
        area: "supabase",
        status: supabasePublicKeyPresent ? "pass" : "fail",
        detail: supabasePublicKeyPresent
            ? "Supabase URL + public key (anon or publishable)"
            : "Supabase URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
    });
    checks.push({
        id: "supabase_service_role",
        area: "supabase",
        status: envPresent(env, "SUPABASE_SERVICE_ROLE_KEY") ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: envPresent(env, "SUPABASE_SERVICE_ROLE_KEY")
            ? "SUPABASE_SERVICE_ROLE_KEY present (server-only)"
            : "Set SUPABASE_SERVICE_ROLE_KEY for production cutover",
    });
    checks.push(
        fileCheck(
            "supabase_migrations",
            "supabase",
            migrations.files > 0,
            `${migrations.files} migration SQL files present — apply with npm run db:apply on production`,
            "Migration SQL files are not part of the serverless bundle; the applied schema is recorded in supabase_migrations.schema_migrations and enforced by CI db:verify",
        ),
    );
    checks.push({
        id: "supabase_rls",
        area: "supabase",
        status: migrations.rlsEnable > 0 && migrations.policies > 0 ? "pass" : "warn",
        detail:
            migrations.rlsEnable > 0 && migrations.policies > 0
                ? `RLS enable statements: ${migrations.rlsEnable}; policies: ${migrations.policies}`
                : sourceTree
                  ? `RLS enable statements: ${migrations.rlsEnable}; policies: ${migrations.policies}`
                  : `RLS statements cannot be scanned from the deployed bundle — ${RUNTIME_NOTE}`,
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
        detail: emailOk
            ? "Resend or SMTP provider configured"
            : "Configure RESEND_API_KEY (+ RESEND_FROM / SMTP_FROM) or SMTP_HOST + SMTP_PORT + SMTP_USER + SMTP_PASS + SMTP_FROM (see docs/GO_LIVE_CHECKLIST.md §6)",
    });
    /** Template files are source-tree artefacts: `fail` locally, `warn` in the deployed runtime. */
    const templateStatus = (ok: boolean): CutoverStatus => (ok ? "pass" : sourceTree ? "fail" : "warn");
    checks.push({
        id: "email_templates",
        area: "email",
        status: templateStatus(templatesOk),
        detail: templatesOk
            ? `Transactional templates: ${CUTOVER_EMAIL_TEMPLATES.map((t) => t.id).join(", ")}`
            : `Missing templates: ${emailTemplates.filter((t) => !t.present).map((t) => t.id).join(", ")}${sourceTree ? "" : ` — ${RUNTIME_NOTE}`}`,
    });
    checks.push({
        id: "email_password_reset",
        area: "email",
        status: templateStatus(emailTemplates.some((t) => t.id === "password-reset" && t.present)),
        detail: emailTemplates.some((t) => t.id === "password-reset" && t.present)
            ? "password-reset.md template for recovery emails"
            : `password-reset.md template for recovery emails is missing${sourceTree ? "" : ` — ${RUNTIME_NOTE}`}`,
    });
    const onboardingOk = emailTemplates
        .filter((t) => ["welcome", "verify-email", "invite-teammate"].includes(t.id))
        .every((t) => t.present);
    checks.push({
        id: "email_onboarding",
        area: "email",
        status: templateStatus(onboardingOk),
        detail: onboardingOk
            ? `welcome + verify-email + invite-teammate onboarding templates`
            : `onboarding templates (welcome + verify-email + invite-teammate) are missing${sourceTree ? "" : ` — ${RUNTIME_NOTE}`}`,
    });

    // 4. Payments
    const payOk = isPaymentGatewayConfigured(env);
    const stripeWebhookOk = isStripeWebhookSecretConfigured(env);
    const razorpayWebhookOk = isRazorpayPaymentWebhookConfigured(env);
    const whOk = stripeWebhookOk || razorpayWebhookOk;
    checks.push({
        id: "payments_gateway",
        area: "payments",
        status: payOk ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail: payOk
            ? "Payment gateway configured (Razorpay India-first or Stripe fallback)"
            : "Configure Razorpay (RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET + RAZORPAY_WEBHOOK_SECRET + plan amounts) or Stripe (STRIPE_SECRET_KEY + NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY + STRIPE_WEBHOOK_SECRET), then register the webhook at /api/payments/webhook (see docs/GO_LIVE_CHECKLIST.md §6)",
    });
    const webhookDetail = `Unified webhook path ${PAYMENT_WEBHOOK_PATH} · Razorpay ${razorpayWebhookOk ? "set" : "missing"} · Stripe ${stripeWebhookOk ? "set" : "missing"}`;
    const webhookRoutePresent = existsSync(join(/*turbopackIgnore: true*/ cwd, "app/api/payments/webhook/route.ts"));
    if (whOk && webhookRoutePresent) {
        checks.push({ id: "payments_webhook", area: "payments", status: "pass", detail: webhookDetail });
    } else if (!webhookRoutePresent && !sourceTree) {
        checks.push({
            id: "payments_webhook",
            area: "payments",
            status: "warn",
            detail: `${webhookDetail} — the webhook route is compiled into the deployed bundle and can be probed at ${PAYMENT_WEBHOOK_PATH} — ${RUNTIME_NOTE}`,
        });
    } else {
        checks.push({
            id: "payments_webhook",
            area: "payments",
            status: secrets.cutoverRuntime ? "fail" : "warn",
            detail: webhookDetail,
        });
    }
    checks.push(
        fileCheck(
            "payments_subscription_surface",
            "payments",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "src/modules/billing-finance/services/billing-finance-os.service.ts")),
            "Billing Finance OS subscription lifecycle surface present (unchanged)",
            "Billing Finance OS subscription surface is compiled into the deployed bundle",
        ),
    );
    checks.push(
        fileCheck(
            "payments_invoice_surface",
            "payments",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "src/modules/billing-finance/components/os/InvoiceCenterPanel.tsx")),
            "Invoice Center flow present in Billing Finance OS",
            "Invoice Center surface is compiled into the deployed bundle",
        ),
    );

    // 5. Monitoring
    const monitoringOk = envPresent(env, "OPS_ALERT_WEBHOOK_URL") || envPresent(env, "SENTRY_DSN") || envPresent(env, "NEXT_PUBLIC_SENTRY_DSN");
    checks.push({
        id: "monitoring_alerts",
        area: "monitoring",
        status: monitoringOk ? "pass" : "warn",
        detail: monitoringOk ? "External alert sink configured" : "Set OPS_ALERT_WEBHOOK_URL and/or SENTRY_DSN",
    });
    const healthFiles = ["live", "ready", "health", "diagnostics", "production", "go-live", "cutover"].every((name) =>
        existsSync(join(/*turbopackIgnore: true*/ cwd, `app/api/ops/${name}/route.ts`)),
    );
    checks.push(
        fileCheck(
            "monitoring_health",
            "monitoring",
            healthFiles,
            "Ops health endpoints: live, ready, health, diagnostics, production, go-live, cutover",
            "Ops health routes are compiled into the deployed bundle; probe /api/ops/* directly",
        ),
    );
    checks.push(
        fileCheck(
            "monitoring_logging",
            "monitoring",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "src/lib/production-logger.ts")) && existsSync(join(/*turbopackIgnore: true*/ cwd, "src/lib/ops-monitoring.ts")),
            "production-logger + ops-monitoring present",
            "production-logger + ops-monitoring are compiled into the deployed bundle",
        ),
    );
    checks.push(
        fileCheck(
            "monitoring_diagnostics",
            "monitoring",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "app/api/ops/diagnostics/route.ts")),
            "/api/ops/diagnostics authenticated diagnostics route",
            "/api/ops/diagnostics is compiled into the deployed bundle and returns 401 without a session",
        ),
    );

    // 6. Final cutover
    const httpsOk = isHttpsUrl(env.NEXT_PUBLIC_APP_URL) || env.NODE_ENV !== "production";
    checks.push(
        fileCheck(
            "cutover_go_live_checklist",
            "cutover",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "docs/GO_LIVE_CHECKLIST.md")),
            "docs/GO_LIVE_CHECKLIST.md present for execution",
            "docs/GO_LIVE_CHECKLIST.md is not part of the deployed bundle",
        ),
    );
    checks.push({
        id: "cutover_environment",
        area: "cutover",
        status: production.ready && httpsOk ? "pass" : production.blockers.length ? "fail" : "warn",
        detail: production.ready
            ? `Production env score ${production.score}; go-live score ${goLive.score}`
            : `Production blockers: ${production.blockers.join("; ") || "see checks"}`,
    });
    checks.push(
        fileCheck(
            "cutover_readiness_report",
            "cutover",
            existsSync(join(/*turbopackIgnore: true*/ cwd, "docs/PRODUCTION_READINESS_REPORT.md")) ||
                existsSync(join(/*turbopackIgnore: true*/ cwd, "scripts/generate-production-readiness-report.mjs")),
            "Production readiness report generator / artifact present",
            "Production readiness report generator / artifact is not part of the deployed bundle",
        ),
    );

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

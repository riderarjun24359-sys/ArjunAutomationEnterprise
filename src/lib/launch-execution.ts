/**
 * Early Access launch execution — activation, cohort, smoke inventory, GO/HOLD.
 * No schema changes; aggregates existing production + early-access surfaces.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { validateSecretLoading, listMissingCriticalSecrets, listMissingRecommendedSecrets } from "@/src/lib/production-secrets";
import { validateProductionCutover } from "@/src/lib/production-cutover";
import { isEmailProviderConfigured, listEmailTemplateStatus, CUTOVER_EMAIL_TEMPLATES } from "@/src/lib/production-email";

export const LAUNCH_EXECUTION_VERSION = "1.0.0-early-access-execution";

export type LaunchCheckStatus = "pass" | "warn" | "fail";
export type LaunchDecision = "GO" | "HOLD";

export interface LaunchCheck {
    id: string;
    area: "activation" | "cohort" | "smoke" | "report";
    status: LaunchCheckStatus;
    detail: string;
}

export interface LaunchExecutionReport {
    version: string;
    checkedAt: string;
    decision: LaunchDecision;
    decisionRationale: string;
    score: number;
    checks: LaunchCheck[];
    blockers: string[];
    warnings: string[];
    knownIssues: string[];
    riskSummary: string[];
    executiveSummary: string;
    smokeFlow: Array<{ step: string; path: string; present: boolean }>;
}

const HEALTH_ENDPOINTS = [
    "app/api/ops/live/route.ts",
    "app/api/ops/ready/route.ts",
    "app/api/ops/health/route.ts",
    "app/api/ops/diagnostics/route.ts",
    "app/api/ops/production/route.ts",
    "app/api/ops/go-live/route.ts",
    "app/api/ops/cutover/route.ts",
    "app/api/ops/launch-execution/route.ts",
] as const;

const SMOKE_FLOW: Array<{ step: string; path: string; file: string }> = [
    { step: "Sign up organization", path: "/auth/sign-up", file: "app/auth/sign-up/page.tsx" },
    { step: "Verify email", path: "/auth/verify-email", file: "app/auth/verify-email/page.tsx" },
    { step: "Create workspace (onboarding)", path: "/onboarding", file: "app/(shell)/onboarding/page.tsx" },
    { step: "Invite member", path: "/early-access", file: "src/modules/early-access/components/EarlyAccessPage.tsx" },
    { step: "Add client", path: "/clients", file: "app/(shell)/clients/page.tsx" },
    { step: "Create project", path: "/projects", file: "app/(shell)/projects/page.tsx" },
    { step: "Create task", path: "/tasks", file: "app/(shell)/tasks/page.tsx" },
    { step: "Generate invoice", path: "/finance", file: "app/(shell)/finance/page.tsx" },
    { step: "AI interaction", path: "/ai", file: "app/(shell)/ai/page.tsx" },
    { step: "Founder dashboard update", path: "/founder-analytics", file: "app/(shell)/founder-analytics/page.tsx" },
];

function fileOk(cwd: string, rel: string): boolean {
    return existsSync(join(/*turbopackIgnore: true*/ cwd, rel));
}

export function validateLaunchExecution(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): LaunchExecutionReport {
    const secrets = validateSecretLoading(env);
    const cutover = validateProductionCutover(env, cwd);
    const emailTemplates = listEmailTemplateStatus(cwd);
    const checks: LaunchCheck[] = [];
    const knownIssues: string[] = [];
    const riskSummary: string[] = [];

    // 1. Production Activation
    const missingCritical = listMissingCriticalSecrets(env);
    checks.push({
        id: "activation_secrets",
        area: "activation",
        status: missingCritical.length === 0 ? "pass" : secrets.cutoverRuntime ? "fail" : "warn",
        detail:
            missingCritical.length === 0
                ? "All critical production secrets present"
                : `Missing critical: ${missingCritical.join(", ")}`,
    });
    checks.push({
        id: "activation_cutover",
        area: "activation",
        status: cutover.checks.filter((c) => c.status === "fail").length === 0 ? "pass" : "fail",
        detail: `Cutover score ${cutover.score}; blockers ${cutover.blockers.length}`,
    });
    const healthOk = HEALTH_ENDPOINTS.every((f) => fileOk(cwd, f));
    checks.push({
        id: "activation_health_endpoints",
        area: "activation",
        status: healthOk ? "pass" : "fail",
        detail: healthOk ? "All ops health/cutover/launch endpoints present" : "Missing one or more ops health routes",
    });
    const backupsOk = env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true";
    const paymentOk = Boolean(
        (env.RAZORPAY_KEY_ID?.trim() &&
            env.RAZORPAY_KEY_SECRET?.trim() &&
            env.RAZORPAY_WEBHOOK_SECRET?.trim() &&
            env.RAZORPAY_STARTER_AMOUNT_MINOR?.trim() &&
            env.RAZORPAY_PROFESSIONAL_AMOUNT_MINOR?.trim()) ||
        (env.STRIPE_SECRET_KEY?.trim() &&
            env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() &&
            env.STRIPE_WEBHOOK_SECRET?.trim()),
    );
    const monitoringOk = Boolean(
        env.OPS_ALERT_WEBHOOK_URL?.trim() || env.SENTRY_DSN?.trim() || env.NEXT_PUBLIC_SENTRY_DSN?.trim(),
    );
    checks.push({
        id: "activation_backups",
        area: "activation",
        status: backupsOk ? "pass" : "warn",
        detail: backupsOk ? "BACKUP_ENABLED set" : "Set BACKUP_ENABLED=true and enable org backup configs",
    });
    checks.push({
        id: "activation_payment",
        area: "activation",
        status: paymentOk ? "pass" : "warn",
        detail: paymentOk ? "Stripe gateway + webhook secret configured" : "Configure Stripe secret, publishable key, and webhook secret",
    });
    checks.push({
        id: "activation_monitoring",
        area: "activation",
        status: monitoringOk ? "pass" : "warn",
        detail: monitoringOk ? "External monitoring/alert sink configured" : "Set OPS_ALERT_WEBHOOK_URL or SENTRY_DSN",
    });
    checks.push({
        id: "activation_startup_gate",
        area: "activation",
        status: fileOk(cwd, "instrumentation.ts") ? "pass" : "fail",
        detail: "Fail-closed secret gate via instrumentation.ts",
    });

    // 2. Early Access Cohort
    checks.push({
        id: "cohort_console",
        area: "cohort",
        status: fileOk(cwd, "src/modules/early-access/index.ts") ? "pass" : "fail",
        detail: "Early Access Launch Console present (/early-access)",
    });
    checks.push({
        id: "cohort_invite_batch",
        area: "cohort",
        status: fileOk(cwd, "docs/EARLY_ACCESS_COHORT_RUNBOOK.md") ? "pass" : "fail",
        detail: "First invite batch runbook present (COP beta + org/idp invites)",
    });
    checks.push({
        id: "cohort_waitlist",
        area: "cohort",
        status: fileOk(cwd, "src/modules/early-access/builders/early-access.builders.ts") ? "pass" : "fail",
        detail: "Waitlist approvals surface via Early Access management builders",
    });
    checks.push({
        id: "cohort_onboarding",
        area: "cohort",
        status: fileOk(cwd, "app/(shell)/onboarding/page.tsx") && fileOk(cwd, "src/modules/soft-launch/components/OnboardingWizard.tsx")
            ? "pass"
            : "fail",
        detail: "Onboarding wizard + /onboarding route present",
    });
    const emailOk = isEmailProviderConfigured(env);
    const templatesOk = emailTemplates.every((t) => t.present);
    checks.push({
        id: "cohort_email",
        area: "cohort",
        status: templatesOk && (emailOk || !secrets.cutoverRuntime) ? (emailOk ? "pass" : "warn") : templatesOk ? "warn" : "fail",
        detail: emailOk
            ? `Email provider configured · templates ${CUTOVER_EMAIL_TEMPLATES.map((t) => t.id).join(", ")}`
            : templatesOk
              ? "Templates ready; configure RESEND_API_KEY or SMTP_* for delivery"
              : "Missing email templates",
    });
    checks.push({
        id: "cohort_founder_alerts",
        area: "cohort",
        status:
            fileOk(cwd, "src/modules/early-access/builders/early-access.builders.ts") &&
            fileOk(cwd, "src/modules/founder-analytics/builders/founder-analytics.builders.ts")
                ? "pass"
                : "fail",
        detail: "Founder monitoring + Founder Analytics alert builders present",
    });

    // 3. Smoke flow inventory
    const smokeFlow = SMOKE_FLOW.map((s) => ({
        step: s.step,
        path: s.path,
        present: fileOk(cwd, s.file),
    }));
    const smokeMissing = smokeFlow.filter((s) => !s.present);
    checks.push({
        id: "smoke_e2e_flow",
        area: "smoke",
        status: smokeMissing.length === 0 ? "pass" : "fail",
        detail:
            smokeMissing.length === 0
                ? `E2E smoke flow ${smokeFlow.length}/${smokeFlow.length} surfaces present`
                : `Missing: ${smokeMissing.map((s) => s.step).join(", ")}`,
    });
    checks.push({
        id: "smoke_playwright",
        area: "smoke",
        status: fileOk(cwd, "e2e/launch-execution-smoke.spec.ts") ? "pass" : "fail",
        detail: "Playwright launch-execution smoke spec present",
    });
    checks.push({
        id: "smoke_soft_launch_e2e",
        area: "smoke",
        status: fileOk(cwd, "e2e/soft-launch.spec.ts") ? "pass" : "warn",
        detail: "Existing soft-launch E2E coverage available",
    });

    // 4. Report artifacts
    checks.push({
        id: "report_generator",
        area: "report",
        status: fileOk(cwd, "scripts/generate-launch-execution-report.mjs") ? "pass" : "fail",
        detail: "Launch readiness report generator present",
    });
    checks.push({
        id: "report_docs",
        area: "report",
        status: fileOk(cwd, "docs/LAUNCH_EXECUTION.md") ? "pass" : "fail",
        detail: "docs/LAUNCH_EXECUTION.md runbook present",
    });

    const fail = checks.filter((c) => c.status === "fail");
    const warn = checks.filter((c) => c.status === "warn");
    const passCount = checks.filter((c) => c.status === "pass").length;
    const score = Math.max(0, Math.min(100, Math.round((passCount / Math.max(checks.length, 1)) * 100 - fail.length * 10 - warn.length * 3)));

    if (missingCritical.length) {
        knownIssues.push(`Critical secrets not loaded in this environment: ${missingCritical.join(", ")}`);
        riskSummary.push("Production cannot fail-closed correctly until critical secrets are set in the deploy environment.");
    }
    if (!emailOk) {
        knownIssues.push("Email provider unset — transactional/onboarding emails will not send.");
        riskSummary.push("Cohort invites and verify-email depend on Resend/SMTP configuration.");
    }
    if (!backupsOk) {
        knownIssues.push("BACKUP_ENABLED not set.");
        riskSummary.push("Disaster recovery posture incomplete without enabled backups.");
    }
    if (!paymentOk) {
        knownIssues.push("Stripe payment gateway/webhook configuration incomplete.");
        riskSummary.push("Paid plans cannot be safely activated until Stripe gateway and webhook verification are configured.");
    }
    if (!monitoringOk) {
        knownIssues.push("No external monitoring sink (OPS_ALERT_WEBHOOK_URL / SENTRY_DSN).");
        riskSummary.push("Founder alerts may be limited to in-app ops buffers without external paging.");
    }
    const recommended = listMissingRecommendedSecrets(env);
    if (recommended.length) {
        riskSummary.push(`Recommended secrets still open: ${recommended.slice(0, 6).join(", ")}${recommended.length > 6 ? "…" : ""}`);
    }

    const artifactReady = fail.length === 0;
    const runtimeReady = missingCritical.length === 0 && emailOk && backupsOk && paymentOk && monitoringOk;
    const decision: LaunchDecision = artifactReady && runtimeReady ? "GO" : "HOLD";
    const decisionRationale = artifactReady
        ? runtimeReady
            ? "Artifact checks green and critical runtime secrets/email/backups configured — proceed with first cohort."
            : "Launch execution artifacts are complete, but runtime secrets/email/backups are incomplete — HOLD until production activation finishes."
        : "Blocking launch-execution artifact failures remain — HOLD.";

    const executiveSummary = [
        `Arjun Automation Early Access execution ${LAUNCH_EXECUTION_VERSION}.`,
        `Decision: ${decision}.`,
        `Score ${score}/100 · ${passCount} pass · ${warn.length} warn · ${fail.length} fail.`,
        `Smoke flow surfaces ${smokeFlow.filter((s) => s.present).length}/${smokeFlow.length}.`,
        decisionRationale,
    ].join(" ");

    return {
        version: LAUNCH_EXECUTION_VERSION,
        checkedAt: new Date().toISOString(),
        decision,
        decisionRationale,
        score,
        checks,
        blockers: fail.map((c) => `${c.id}: ${c.detail}`),
        warnings: warn.map((c) => `${c.id}: ${c.detail}`),
        knownIssues,
        riskSummary: riskSummary.length ? riskSummary : ["No elevated risks from launch-execution validators."],
        executiveSummary,
        smokeFlow,
    };
}

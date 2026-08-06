/**
 * Production Go-Live verification — real customer onboarding readiness.
 * Run: npm run go-live:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

function readSafe(path) {
    try {
        return readFileSync(path, "utf8");
    } catch {
        return "";
    }
}

const tsc = runTsc(root);
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 240) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 240) : "");

const required = [
    "src/lib/go-live-config.ts",
    "src/lib/go-live-services.ts",
    "src/lib/production-config.ts",
    "src/lib/production-services.ts",
    "src/lib/disaster-recovery.ts",
    "src/lib/storage-security.ts",
    "src/lib/session-security.ts",
    "src/lib/ops-monitoring.ts",
    "app/api/ops/go-live/route.ts",
    "app/api/ops/live/route.ts",
    "app/api/ops/ready/route.ts",
    "app/api/ops/health/route.ts",
    "app/api/ops/production/route.ts",
    "app/(shell)/go-live/page.tsx",
    "src/modules/soft-launch/components/GoLiveReadinessDashboard.tsx",
    "src/modules/soft-launch/components/OnboardingWizard.tsx",
    "docs/GO_LIVE_CHECKLIST.md",
    "docs/GO_LIVE_RUNBOOK.md",
    "docs/ROLLBACK_RUNBOOK.md",
    "docs/CUSTOMER_ONBOARDING_RUNBOOK.md",
    "docs/DEPLOYMENT_CHECKLIST.md",
    "docs/DISASTER_RECOVERY.md",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const cfg = readSafe(join(root, "src/lib/go-live-config.ts"));
pass("config:validateGoLiveReadiness", cfg.includes("export function validateGoLiveReadiness"));
pass("config:go_live_version", cfg.includes("1.0.0-go-live"));
pass("config:task_deployment", cfg.includes("deployment_checklist"));
pass("config:task_env", cfg.includes("environment_variables"));
pass("config:task_supabase", cfg.includes('"supabase"'));
pass("config:task_storage", cfg.includes('"storage"'));
pass("config:task_email", cfg.includes('"email"'));
pass("config:task_payment", cfg.includes('"payment"'));
pass("config:task_monitoring", cfg.includes('"monitoring"'));
pass("config:task_backups", cfg.includes('"backups"'));
pass("config:task_health", cfg.includes("health_endpoints"));
pass("config:task_security", cfg.includes('"security"'));
pass("config:AAOS_GO_LIVE", cfg.includes("AAOS_GO_LIVE"));
pass("config:env_contract", cfg.includes("GO_LIVE_ENV_CONTRACT"));

const svc = readSafe(join(root, "src/lib/go-live-services.ts"));
pass("services:buildGoLiveServicesReport", svc.includes("export async function buildGoLiveServicesReport"));
pass("services:onboarding", svc.includes("OnboardingWizard"));
pass("services:backups_restore", svc.includes("verifyRestoreProcedure"));

const api = readSafe(join(root, "app/api/ops/go-live/route.ts"));
pass("api:go_live_route", api.includes("buildGoLiveServicesReport"));
pass("api:rate_limit", api.includes("checkRateLimit"));
pass("api:degraded_503", api.includes("503"));

const dash = readSafe(join(root, "src/modules/soft-launch/components/GoLiveReadinessDashboard.tsx"));
pass("dashboard:fetch", dash.includes("/api/ops/go-live"));
pass("dashboard:tasks", dash.includes("Go-Live tasks"));

const page = readSafe(join(root, "app/(shell)/go-live/page.tsx"));
pass("page:dashboard", page.includes("GoLiveReadinessDashboard"));

pass("routes:goLive", readSafe(join(root, "src/constants/routes.ts")).includes("goLive:"));
pass("middleware:goLive", readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.goLive"));

const checklist = readSafe(join(root, "docs/GO_LIVE_CHECKLIST.md"));
pass("docs:checklist_env", checklist.includes("NEXT_PUBLIC_SUPABASE_URL"));
pass("docs:checklist_supabase", checklist.includes("SUPABASE_SERVICE_ROLE_KEY"));
pass("docs:checklist_storage", checklist.includes("organization-uploads"));
pass("docs:checklist_email", checklist.includes("RESEND_API_KEY"));
pass("docs:checklist_payment", checklist.includes("STRIPE_SECRET_KEY"));
pass("docs:checklist_monitoring", checklist.includes("OPS_ALERT_WEBHOOK_URL"));
pass("docs:checklist_backups", checklist.includes("BACKUP_ENABLED"));
pass("docs:checklist_health", checklist.includes("/api/ops/go-live"));
pass("docs:checklist_security", checklist.includes("validateSession") || checklist.includes("Session hardening"));

const runbook = readSafe(join(root, "docs/GO_LIVE_RUNBOOK.md"));
pass("docs:runbook_phases", runbook.includes("Phase A") && runbook.includes("Phase D"));
pass("docs:runbook_abort", runbook.includes("Abort"));

const rollback = readSafe(join(root, "docs/ROLLBACK_RUNBOOK.md"));
pass("docs:rollback_triggers", rollback.includes("Decision triggers"));
pass("docs:rollback_redeploy", rollback.includes("Redeploy"));

const onboarding = readSafe(join(root, "docs/CUSTOMER_ONBOARDING_RUNBOOK.md"));
pass("docs:onboarding_wizard", onboarding.includes("/onboarding"));
pass("docs:onboarding_email", onboarding.includes("verify-email"));

pass("package:go_live_verify", readSafe(join(root, "package.json")).includes('"go-live:verify"'));

pass("health:live", existsSync(join(root, "app/api/ops/live/route.ts")));
pass("health:ready", existsSync(join(root, "app/api/ops/ready/route.ts")));
pass("security:session", readSafe(join(root, "src/lib/session-security.ts")).includes("buildSessionValidation"));
pass("security:storage_mime", readSafe(join(root, "src/lib/storage-security.ts")).includes("STORAGE_ALLOWED_MIME"));
pass("security:ops_alerts", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("enqueueAlert"));
pass("backups:verifyBackupStatus", readSafe(join(root, "src/lib/disaster-recovery.ts")).includes("verifyBackupStatus"));

// Regression: production verify still green (skip nested tsc/lint)
process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const prod = spawnVerify(root, "scripts/verify-production.mjs");
pass("regression:production_verify", prod.status === 0, prod.status !== 0 ? (prod.stderr || prod.stdout || "").slice(0, 200) : "");

const strict = process.env.AAOS_GO_LIVE === "1" || process.env.AAOS_GO_LIVE === "true";
const requiredStrict = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "PLATFORM_LEAD_API_KEY",
    "PLATFORM_ORGANIZATION_ID",
    "SUPABASE_SERVICE_ROLE_KEY",
    "RESEND_API_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
];
if (strict) {
    const missing = requiredStrict.filter((k) => !process.env[k]?.trim());
    // email can be SMTP instead of Resend
    const emailOk = Boolean(process.env.RESEND_API_KEY?.trim() || (process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim()));
    const filtered = missing.filter((k) => k !== "RESEND_API_KEY" || !emailOk);
    pass("env:strict_go_live", filtered.length === 0 && emailOk, filtered.length ? `missing ${filtered.join(",")}` : "ok");
} else {
    pass("env:strict_go_live", true, "AAOS_GO_LIVE not set — artifact verification only");
}

const failed = results.filter((r) => !r.pass);
console.log(`go-live:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);

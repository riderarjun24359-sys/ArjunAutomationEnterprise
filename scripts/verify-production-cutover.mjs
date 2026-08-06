/**
 * Production Cutover verification — Early Access configuration gate.
 * Run: npm run production-cutover:verify
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
    "src/lib/production-secrets.ts",
    "src/lib/production-cutover.ts",
    "src/lib/production-email.ts",
    "src/lib/production-payments.ts",
    "instrumentation.ts",
    "app/api/ops/cutover/route.ts",
    "app/api/payments/webhook/route.ts",
    "app/api/ops/live/route.ts",
    "app/api/ops/ready/route.ts",
    "app/api/ops/health/route.ts",
    "app/api/ops/diagnostics/route.ts",
    "docs/PRODUCTION_CUTOVER.md",
    "docs/GO_LIVE_CHECKLIST.md",
    "scripts/generate-production-readiness-report.mjs",
    "scripts/test-production-cutover.mjs",
    "src/modules/soft-launch/content/emails/password-reset.md",
    "src/modules/soft-launch/content/emails/welcome.md",
    "src/modules/soft-launch/content/emails/verify-email.md",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const secrets = readSafe(join(root, "src/lib/production-secrets.ts"));
pass("secrets:assert", secrets.includes("assertCriticalProductionSecrets"));
pass("secrets:critical_list", secrets.includes("PLATFORM_LEAD_API_KEY"));
pass("secrets:fail_closed", secrets.includes("ProductionSecretsError"));

const instr = readSafe(join(root, "instrumentation.ts"));
pass("startup:instrumentation", instr.includes("assertCriticalProductionSecrets"));
pass("startup:nodejs_only", instr.includes("NEXT_RUNTIME") || instr.includes("register"));

const cutover = readSafe(join(root, "src/lib/production-cutover.ts"));
pass("cutover:validate", cutover.includes("validateProductionCutover"));
pass("cutover:secrets_area", cutover.includes('area: "secrets"'));
pass("cutover:supabase_area", cutover.includes('area: "supabase"'));
pass("cutover:email_area", cutover.includes('area: "email"'));
pass("cutover:payments_area", cutover.includes('area: "payments"'));
pass("cutover:monitoring_area", cutover.includes('area: "monitoring"'));
pass("cutover:final_area", cutover.includes('area: "cutover"'));
pass("cutover:rls_scan", cutover.includes("enable row level security"));
pass("cutover:readiness_md", cutover.includes("readinessMarkdown"));

const email = readSafe(join(root, "src/lib/production-email.ts"));
pass("email:templates", email.includes("password-reset"));
pass("email:provider", email.includes("isEmailProviderConfigured"));

const payments = readSafe(join(root, "src/lib/production-payments.ts"));
pass("payments:webhook_verify", payments.includes("verifyStripeWebhookSignature"));
pass("payments:timing_safe", payments.includes("timingSafeEqual"));

const webhook = readSafe(join(root, "app/api/payments/webhook/route.ts"));
pass("webhook:rejects_bad_sig", webhook.includes("Invalid webhook signature"));
pass("webhook:stripe_header", webhook.includes("stripe-signature"));

const api = readSafe(join(root, "app/api/ops/cutover/route.ts"));
pass("api:cutover", api.includes("validateProductionCutover"));
pass("api:503", api.includes("503"));

pass("docs:cutover", readSafe(join(root, "docs/PRODUCTION_CUTOVER.md")).includes("AAOS_CUTOVER"));
pass("docs:go_live", existsSync(join(root, "docs/GO_LIVE_CHECKLIST.md")));
pass("package:script", readSafe(join(root, "package.json")).includes('"production-cutover:verify"'));
pass("package:report", readSafe(join(root, "package.json")).includes('"generate:production-readiness-report"'));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-production-cutover.mjs");
pass("test:cutover", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 200) : "");

const report = spawnVerify(root, "scripts/generate-production-readiness-report.mjs");
pass("report:generate", report.status === 0, report.status !== 0 ? (report.stderr || report.stdout || "").slice(0, 200) : "");
pass("report:artifact", existsSync(join(root, "docs/PRODUCTION_READINESS_REPORT.md")));
pass("report:content", readSafe(join(root, "docs/PRODUCTION_READINESS_REPORT.md")).includes("Production Readiness Report"));

const prod = spawnVerify(root, "scripts/verify-production.mjs");
pass("regression:production_verify", prod.status === 0, prod.status !== 0 ? (prod.stderr || prod.stdout || "").slice(0, 200) : "");

const failed = results.filter((r) => !r.pass);
console.log(`production-cutover:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);

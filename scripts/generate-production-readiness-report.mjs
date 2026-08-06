/**
 * Generate docs/PRODUCTION_READINESS_REPORT.md for Early Access cutover.
 * Run: npm run generate:production-readiness-report
 */
import { writeFileSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHmac, timingSafeEqual } from "node:crypto";

const root = process.cwd();
const env = process.env;

function present(key) {
    return Boolean(env[key]?.trim());
}

const critical = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "PLATFORM_LEAD_API_KEY",
    "PLATFORM_ORGANIZATION_ID",
];
const missingCritical = critical.filter((k) => !present(k));

const emailOk = present("RESEND_API_KEY") || (present("SMTP_HOST") && present("SMTP_USER"));
const payOk = present("STRIPE_SECRET_KEY") && present("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
const whOk = present("STRIPE_WEBHOOK_SECRET");
const monitoringOk = present("OPS_ALERT_WEBHOOK_URL") || present("SENTRY_DSN");

const migrationsDir = join(root, "supabase", "migrations");
const migrationFiles = existsSync(migrationsDir) ? readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")) : [];
let rlsEnable = 0;
let policies = 0;
for (const file of migrationFiles) {
    const text = readFileSync(join(migrationsDir, file), "utf8").toLowerCase();
    rlsEnable += (text.match(/enable row level security/g) ?? []).length;
    policies += (text.match(/create policy/g) ?? []).length;
}

const templates = [
    "welcome.md",
    "verify-email.md",
    "invite-teammate.md",
    "password-reset.md",
].map((name) => ({
    name,
    present: existsSync(join(root, "src/modules/soft-launch/content/emails", name)),
}));

const checks = [
    ["secrets_critical", missingCritical.length === 0 ? "pass" : "warn", missingCritical.join(", ") || "all present"],
    ["secrets_startup_gate", existsSync(join(root, "instrumentation.ts")) ? "pass" : "fail", "instrumentation.ts"],
    ["supabase_migrations", migrationFiles.length > 0 ? "pass" : "fail", `${migrationFiles.length} files`],
    ["supabase_rls", rlsEnable > 0 && policies > 0 ? "pass" : "warn", `${rlsEnable} RLS / ${policies} policies`],
    ["email_provider", emailOk ? "pass" : "warn", emailOk ? "configured" : "missing"],
    ["email_templates", templates.every((t) => t.present) ? "pass" : "fail", templates.map((t) => `${t.name}:${t.present}`).join(", ")],
    ["payments_gateway", payOk ? "pass" : "warn", payOk ? "configured" : "missing"],
    ["payments_webhook", whOk && existsSync(join(root, "app/api/payments/webhook/route.ts")) ? "pass" : "warn", "/api/payments/webhook"],
    ["monitoring_health", existsSync(join(root, "app/api/ops/cutover/route.ts")) ? "pass" : "fail", "cutover endpoint"],
    ["monitoring_alerts", monitoringOk ? "pass" : "warn", monitoringOk ? "sink set" : "optional sink missing"],
];

const fail = checks.filter((c) => c[1] === "fail").length;
const warn = checks.filter((c) => c[1] === "warn").length;
const pass = checks.filter((c) => c[1] === "pass").length;
const score = Math.max(0, Math.min(100, Math.round((pass / checks.length) * 100 - fail * 8 - warn * 2)));
const ready = fail === 0 && missingCritical.length === 0;

// Sanity: webhook HMAC helper works
{
    const secret = "whsec_test";
    const ts = Math.floor(Date.now() / 1000);
    const payload = '{"type":"ping"}';
    const sig = createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
    const header = `t=${ts},v1=${sig}`;
    const expected = createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
    const ok = timingSafeEqual(Buffer.from(expected), Buffer.from(sig)) && header.includes("v1=");
    if (!ok) {
        console.error("webhook hmac self-check failed");
        process.exit(1);
    }
}

const md = `# Production Readiness Report

**Version:** 1.0.0-early-access-cutover  
**Generated:** ${new Date().toISOString()}  
**Ready:** ${ready ? "YES" : "NO"}  
**Score:** ${score}/100  

## Secrets

- Missing critical: ${missingCritical.join(", ") || "none"}
- Email provider: ${emailOk ? "configured" : "pending"}
- Payments: ${payOk ? "configured" : "pending"} · webhook secret ${whOk ? "set" : "pending"}
- Monitoring sink: ${monitoringOk ? "configured" : "pending"}
- Backup enabled: ${env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true" ? "yes" : "no"}

## Supabase

- Migration SQL files: ${migrationFiles.length}
- RLS enable statements: ${rlsEnable}
- Policies: ${policies}
- Apply on production with \`npm run db:apply\` (or platform pipeline)

## Email templates

${templates.map((t) => `- ${t.name}: ${t.present ? "present" : "MISSING"}`).join("\n")}

## Checks

| ID | Status | Detail |
|---|---|---|
${checks.map((c) => `| ${c[0]} | ${c[1]} | ${String(c[2]).replace(/\|/g, "/")} |`).join("\n")}

## Remaining blockers

${
    [
        ...missingCritical.map((k) => `- Set ${k}`),
        ...(!emailOk ? ["- Configure RESEND_API_KEY or SMTP_*"] : []),
        ...(!payOk ? ["- Configure Stripe keys"] : []),
        ...(!whOk ? ["- Set STRIPE_WEBHOOK_SECRET and register /api/payments/webhook"] : []),
        ...(!(env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true") ? ["- Set BACKUP_ENABLED=true and enable org backups"] : []),
        ...(!monitoringOk ? ["- Set OPS_ALERT_WEBHOOK_URL or SENTRY_DSN"] : []),
        ...templates.filter((t) => !t.present).map((t) => `- Add email template ${t.name}`),
    ].join("\n") || "- None detected in this environment snapshot"
}

## Operator next steps

1. Complete \`docs/GO_LIVE_CHECKLIST.md\` and \`docs/PRODUCTION_CUTOVER.md\`
2. Apply migrations against production Supabase
3. Set \`AAOS_CUTOVER=true\` / \`AAOS_DEPLOY_ENV=production\`
4. Probe \`/api/ops/cutover\`, \`/api/ops/live\`, \`/api/ops/ready\`
5. Register Stripe webhook → \`/api/payments/webhook\`

See also: \`docs/PRODUCTION_CUTOVER.md\`, \`docs/ROLLBACK_RUNBOOK.md\`
`;

const out = join(root, "docs/PRODUCTION_READINESS_REPORT.md");
writeFileSync(out, md, "utf8");
console.log(`Wrote ${out} (score ${score}, ready=${ready})`);

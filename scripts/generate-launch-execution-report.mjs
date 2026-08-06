/**
 * Generate docs/LAUNCH_EXECUTION_REPORT.md (GO / HOLD).
 * Run: npm run generate:launch-execution-report
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

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
const backupsOk = env.BACKUP_ENABLED === "1" || env.BACKUP_ENABLED === "true";
const monitoringOk = present("OPS_ALERT_WEBHOOK_URL") || present("SENTRY_DSN");

const smoke = [
    ["Sign up organization", "app/auth/sign-up/page.tsx"],
    ["Verify email", "app/auth/verify-email/page.tsx"],
    ["Create workspace", "app/(shell)/onboarding/page.tsx"],
    ["Invite member", "src/modules/early-access/components/EarlyAccessPage.tsx"],
    ["Add client", "app/(shell)/clients/page.tsx"],
    ["Create project", "app/(shell)/projects/page.tsx"],
    ["Create task", "app/(shell)/tasks/page.tsx"],
    ["Generate invoice", "app/(shell)/finance/page.tsx"],
    ["AI interaction", "app/(shell)/ai/page.tsx"],
    ["Founder dashboard update", "app/(shell)/founder-analytics/page.tsx"],
].map(([step, file]) => ({ step, present: existsSync(join(root, file)) }));

const checks = [
    ["activation_secrets", missingCritical.length === 0 ? "pass" : "warn", missingCritical.join(", ") || "ok"],
    ["activation_startup_gate", existsSync(join(root, "instrumentation.ts")) ? "pass" : "fail", "instrumentation.ts"],
    ["activation_cutover_api", existsSync(join(root, "app/api/ops/cutover/route.ts")) ? "pass" : "fail", "/api/ops/cutover"],
    ["activation_health", ["live", "ready", "health", "launch-execution"].every((n) => existsSync(join(root, `app/api/ops/${n}/route.ts`))) ? "pass" : "fail", "ops endpoints"],
    ["activation_backups", backupsOk ? "pass" : "warn", backupsOk ? "enabled" : "BACKUP_ENABLED unset"],
    ["activation_monitoring", monitoringOk ? "pass" : "warn", monitoringOk ? "sink set" : "sink pending"],
    ["cohort_console", existsSync(join(root, "src/modules/early-access/index.ts")) ? "pass" : "fail", "/early-access"],
    ["cohort_runbook", existsSync(join(root, "docs/EARLY_ACCESS_COHORT_RUNBOOK.md")) ? "pass" : "fail", "cohort runbook"],
    ["cohort_email_templates", ["welcome.md", "verify-email.md", "invite-teammate.md", "password-reset.md"].every((n) => existsSync(join(root, "src/modules/soft-launch/content/emails", n))) ? "pass" : "fail", "templates"],
    ["cohort_email_provider", emailOk ? "pass" : "warn", emailOk ? "configured" : "pending"],
    ["smoke_flow", smoke.every((s) => s.present) ? "pass" : "fail", `${smoke.filter((s) => s.present).length}/${smoke.length}`],
    ["smoke_spec", existsSync(join(root, "e2e/launch-execution-smoke.spec.ts")) ? "pass" : "fail", "playwright smoke"],
    ["docs_execution", existsSync(join(root, "docs/LAUNCH_EXECUTION.md")) ? "pass" : "fail", "LAUNCH_EXECUTION.md"],
];

const fail = checks.filter((c) => c[1] === "fail").length;
const warn = checks.filter((c) => c[1] === "warn").length;
const pass = checks.filter((c) => c[1] === "pass").length;
const score = Math.max(0, Math.min(100, Math.round((pass / checks.length) * 100 - fail * 10 - warn * 3)));
const artifactReady = fail === 0;
const runtimeReady = missingCritical.length === 0 && emailOk && backupsOk;
const decision = artifactReady && runtimeReady ? "GO" : "HOLD";

const knownIssues = [
    ...missingCritical.map((k) => `Missing critical secret: ${k}`),
    ...(!emailOk ? ["Email provider not configured"] : []),
    ...(!backupsOk ? ["BACKUPS not enabled (BACKUP_ENABLED)"] : []),
    ...(!monitoringOk ? ["External monitoring sink not configured"] : []),
    ...smoke.filter((s) => !s.present).map((s) => `Smoke surface missing: ${s.step}`),
];

const risks = [
    ...(missingCritical.length ? ["Cannot safely activate production without critical secrets."] : []),
    ...(!emailOk ? ["Cohort onboarding emails will not deliver."] : []),
    ...(!backupsOk ? ["Recovery posture incomplete without backups."] : []),
    ...(!monitoringOk ? ["Founder paging limited without OPS_ALERT_WEBHOOK_URL/SENTRY_DSN."] : []),
];

const md = `# Launch Execution Report — Early Access

**Version:** 1.0.0-early-access-execution  
**Generated:** ${new Date().toISOString()}  
**Decision: ${decision}**  
**Score:** ${score}/100  

## Executive launch report

Arjun Automation Early Access execution is ${artifactReady ? "artifact-complete" : "blocked by artifact gaps"}.
Runtime activation is ${runtimeReady ? "ready" : "incomplete"}.
Recommendation: **${decision}**.

${
    decision === "GO"
        ? "Proceed with the first invite batch under docs/EARLY_ACCESS_COHORT_RUNBOOK.md."
        : "Hold inviting customers until remaining blockers below are cleared, then re-run npm run launch-execution:verify."
}

## Risk summary

${(risks.length ? risks : ["No elevated risks from this environment snapshot."]).map((r) => `- ${r}`).join("\n")}

## Known issues

${(knownIssues.length ? knownIssues : ["None detected in this environment snapshot."]).map((i) => `- ${i}`).join("\n")}

## Production activation

| Check | Status | Detail |
|---|---|---|
${checks
    .filter((c) => String(c[0]).startsWith("activation_"))
    .map((c) => `| ${c[0]} | ${c[1]} | ${String(c[2]).replace(/\|/g, "/")} |`)
    .join("\n")}

## Early Access cohort

| Check | Status | Detail |
|---|---|---|
${checks
    .filter((c) => String(c[0]).startsWith("cohort_"))
    .map((c) => `| ${c[0]} | ${c[1]} | ${String(c[2]).replace(/\|/g, "/")} |`)
    .join("\n")}

## Production smoke test

| Step | Present |
|---|---|
${smoke.map((s) => `| ${s.step} | ${s.present ? "yes" : "NO"} |`).join("\n")}

## All checks

| ID | Status | Detail |
|---|---|---|
${checks.map((c) => `| ${c[0]} | ${c[1]} | ${String(c[2]).replace(/\|/g, "/")} |`).join("\n")}

## Remaining blockers

${
    [
        ...missingCritical.map((k) => `- Set ${k}`),
        ...(!emailOk ? ["- Configure RESEND_API_KEY or SMTP_*"] : []),
        ...(!backupsOk ? ["- Set BACKUP_ENABLED=true and enable org backups"] : []),
        ...(!monitoringOk ? ["- Set OPS_ALERT_WEBHOOK_URL or SENTRY_DSN"] : []),
        ...smoke.filter((s) => !s.present).map((s) => `- Restore smoke surface: ${s.step}`),
        ...checks.filter((c) => c[1] === "fail").map((c) => `- Fix ${c[0]}: ${c[2]}`),
    ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .join("\n") || "- None — GO criteria met"
}

## Recommendation

**${decision}**

See: \`docs/LAUNCH_EXECUTION.md\`, \`docs/EARLY_ACCESS_COHORT_RUNBOOK.md\`, \`docs/PRODUCTION_CUTOVER.md\`
`;

const out = join(root, "docs/LAUNCH_EXECUTION_REPORT.md");
writeFileSync(out, md, "utf8");
console.log(`Wrote ${out} (decision=${decision}, score=${score})`);

// Optional: list playwright suites if available
const playwrightBin = join(root, "node_modules", "@playwright", "test", "cli.js");
if (existsSync(playwrightBin)) {
    const listed = spawnSync(process.execPath, [playwrightBin, "test", "--list", "e2e/launch-execution-smoke.spec.ts"], {
        cwd: root,
        encoding: "utf8",
        timeout: 60_000,
    });
    if (listed.status === 0) {
        console.log("Playwright launch-execution smoke suites listed OK");
    } else {
        console.log("Playwright list skipped/failed (non-blocking for report write)");
    }
}

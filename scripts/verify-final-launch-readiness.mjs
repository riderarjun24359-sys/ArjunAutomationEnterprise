/**
 * Final Launch Readiness verification.
 * Run: npm run final-launch-readiness:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";
import { loadProjectEnv } from "./_load-env.mjs";

const root = process.cwd();
loadProjectEnv(root);
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
    "src/lib/final-launch-readiness.ts",
    "app/api/ops/final-launch-readiness/route.ts",
    "docs/FINAL_LAUNCH_READINESS.md",
    "scripts/generate-final-launch-readiness-report.mjs",
    "e2e/final-launch-readiness.spec.ts",
    "src/design-os/components/EmptyState.tsx",
    "src/design-os/components/LoadingState.tsx",
    "src/design-os/components/ErrorState.tsx",
    "app/(marketing)/privacy/page.tsx",
    "app/(marketing)/terms/page.tsx",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const lib = readSafe(join(root, "src/lib/final-launch-readiness.ts"));
pass("lib:validate", lib.includes("validateFinalLaunchReadiness"));
pass("lib:journey", lib.includes("Sign up") && lib.includes("First invoice") && lib.includes("Logout/Login"));
pass("lib:ux", lib.includes("EmptyState") && lib.includes("LoadingState") && lib.includes("ErrorState"));
pass("lib:trust", lib.includes("privacy") && lib.includes("terms") && lib.includes("security"));
pass("lib:decision", lib.includes('"GO"') && lib.includes('"HOLD"'));
pass("lib:severities", lib.includes("critical") && lib.includes("high") && lib.includes("medium") && lib.includes("nice"));

const api = readSafe(join(root, "app/api/ops/final-launch-readiness/route.ts"));
pass("api:score_header", api.includes("X-Launch-Score"));
pass("api:decision_header", api.includes("X-Launch-Decision"));

pass("package:script", readSafe(join(root, "package.json")).includes('"final-launch-readiness:verify"'));
pass("package:report", readSafe(join(root, "package.json")).includes('"generate:final-launch-readiness-report"'));

const journeyFiles = [
    "app/auth/sign-up/page.tsx",
    "app/auth/verify-email/page.tsx",
    "app/(shell)/onboarding/page.tsx",
    "src/modules/soft-launch/components/OnboardingWizard.tsx",
    "app/auth/sign-in/page.tsx",
    "app/(shell)/ai/page.tsx",
    "app/(shell)/clients/page.tsx",
    "app/(shell)/projects/page.tsx",
    "app/(shell)/tasks/page.tsx",
    "app/(shell)/finance/page.tsx",
    "src/modules/auth/components/AuthStatus.tsx",
];
for (const f of journeyFiles) pass(`journey:${f}`, existsSync(join(root, f)));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";

const emailVerify = spawnVerify(root, "scripts/verify-launch-email-provider.mjs");
pass("blocker:email_provider", emailVerify.status === 0, emailVerify.status !== 0 ? (emailVerify.stderr || emailVerify.stdout || "").slice(0, 200) : "");

const urlVerify = spawnVerify(root, "scripts/verify-production-urls.mjs");
pass("blocker:production_urls", urlVerify.status === 0, urlVerify.status !== 0 ? (urlVerify.stderr || urlVerify.stdout || "").slice(0, 200) : "");

const smoke = spawnVerify(root, "scripts/production-smoke.mjs");
pass("blocker:production_smoke", smoke.status === 0, smoke.status !== 0 ? (smoke.stderr || smoke.stdout || "").slice(0, 200) : "");

const report = spawnVerify(root, "scripts/generate-final-launch-readiness-report.mjs");
pass("report:generate", report.status === 0, report.status !== 0 ? (report.stderr || report.stdout || "").slice(0, 200) : "");
const reportMd = readSafe(join(root, "docs/FINAL_LAUNCH_READINESS_REPORT.md"));
pass("report:artifact", reportMd.includes("Final Launch Readiness Report"));
pass("report:score", /Final score:\**\s*\d+/.test(reportMd) || /Final score:\*\*\s*\d+/.test(reportMd));
pass("report:decision", /Decision:\s*\*?(GO|HOLD)/.test(reportMd));
pass("report:critical_section", reportMd.includes("Critical issues"));
pass("report:high_section", reportMd.includes("High priority issues"));
pass("report:medium_section", reportMd.includes("Medium priority issues"));
pass("report:nice_section", reportMd.includes("Nice-to-have"));
pass("report:go", /Decision:\s*\*?GO\b/.test(reportMd) && /Final score:\**\s*100\b/.test(reportMd), "expect 100/100 GO");

const launchExec = spawnVerify(root, "scripts/verify-launch-execution.mjs");
pass("regression:launch_execution", launchExec.status === 0, launchExec.status !== 0 ? (launchExec.stderr || launchExec.stdout || "").slice(0, 200) : "");

const playwrightBin = join(root, "node_modules", "@playwright", "test", "cli.js");
if (existsSync(playwrightBin)) {
    const listed = spawnSync(process.execPath, [playwrightBin, "test", "--list", "e2e/final-launch-readiness.spec.ts"], {
        cwd: root,
        encoding: "utf8",
        timeout: 120_000,
    });
    pass("playwright:list", listed.status === 0, listed.status !== 0 ? (listed.stderr || listed.stdout || "").slice(0, 200) : "");
} else {
    pass("playwright:list", false, "@playwright/test missing");
}

const failed = results.filter((r) => !r.pass);
console.log(`final-launch-readiness:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

const scoreMatch = reportMd.match(/Final score:\**\s*(\d+)/);
const decisionMatch = reportMd.match(/Decision:\s*\*?(GO|HOLD)/);
if (scoreMatch) console.log(`FINAL_SCORE=${scoreMatch[1]}`);
if (decisionMatch) console.log(`FINAL_DECISION=${decisionMatch[1]}`);
const critBlock = reportMd.split("## Critical issues")[1]?.split("## High")[0] ?? "";
const critLines = critBlock
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- ") && !l.includes("None"));
console.log(`CRITICAL_BLOCKERS=${critLines.length ? critLines.map((l) => l.slice(2)).join(" | ") : "none"}`);

process.exit(failed.length ? 1 : 0);

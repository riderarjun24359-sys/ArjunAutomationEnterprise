/**
 * Early Access launch execution verification.
 * Run: npm run launch-execution:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
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
    "src/lib/launch-execution.ts",
    "app/api/ops/launch-execution/route.ts",
    "docs/LAUNCH_EXECUTION.md",
    "docs/EARLY_ACCESS_COHORT_RUNBOOK.md",
    "scripts/generate-launch-execution-report.mjs",
    "e2e/launch-execution-smoke.spec.ts",
    "instrumentation.ts",
    "app/api/ops/cutover/route.ts",
    "src/modules/early-access/index.ts",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const lib = readSafe(join(root, "src/lib/launch-execution.ts"));
pass("lib:validateLaunchExecution", lib.includes("export function validateLaunchExecution"));
pass("lib:decision_go_hold", lib.includes('"GO"') && lib.includes('"HOLD"'));
pass("lib:activation", lib.includes('area: "activation"'));
pass("lib:cohort", lib.includes('area: "cohort"'));
pass("lib:smoke", lib.includes('area: "smoke"'));
pass("lib:smoke_steps", lib.includes("Sign up organization") && lib.includes("Generate invoice") && lib.includes("Founder dashboard update"));

const api = readSafe(join(root, "app/api/ops/launch-execution/route.ts"));
pass("api:decision_header", api.includes("X-Launch-Decision"));
pass("api:503_hold", api.includes("503"));

pass("docs:cohort_invite", readSafe(join(root, "docs/EARLY_ACCESS_COHORT_RUNBOOK.md")).includes("invite batch"));
pass("docs:execution", readSafe(join(root, "docs/LAUNCH_EXECUTION.md")).includes("GO"));
pass("e2e:smoke_spec", readSafe(join(root, "e2e/launch-execution-smoke.spec.ts")).includes("launch-execution"));
pass("e2e:smoke_paths", readSafe(join(root, "e2e/launch-execution-smoke.spec.ts")).includes("/founder-analytics"));

pass("package:script", readSafe(join(root, "package.json")).includes('"launch-execution:verify"'));
pass("package:report", readSafe(join(root, "package.json")).includes('"generate:launch-execution-report"'));

const smokeFiles = [
    "app/auth/sign-up/page.tsx",
    "app/auth/verify-email/page.tsx",
    "app/(shell)/onboarding/page.tsx",
    "app/(shell)/clients/page.tsx",
    "app/(shell)/projects/page.tsx",
    "app/(shell)/tasks/page.tsx",
    "app/(shell)/finance/page.tsx",
    "app/(shell)/ai/page.tsx",
    "app/(shell)/founder-analytics/page.tsx",
    "app/(shell)/early-access/page.tsx",
];
for (const f of smokeFiles) pass(`smoke:${f}`, existsSync(join(root, f)));

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const report = spawnVerify(root, "scripts/generate-launch-execution-report.mjs");
pass("report:generate", report.status === 0, report.status !== 0 ? (report.stderr || report.stdout || "").slice(0, 200) : "");
const reportMd = readSafe(join(root, "docs/LAUNCH_EXECUTION_REPORT.md"));
pass("report:artifact", reportMd.includes("Launch Execution Report"));
pass("report:decision", /Decision:\s*\*\*(GO|HOLD)\*\*/.test(reportMd) || reportMd.includes("Decision: GO") || reportMd.includes("Decision: HOLD"));
pass("report:risks", reportMd.includes("Risk summary"));
pass("report:known_issues", reportMd.includes("Known issues"));

const cutover = spawnVerify(root, "scripts/verify-production-cutover.mjs");
pass("regression:cutover", cutover.status === 0, cutover.status !== 0 ? (cutover.stderr || cutover.stdout || "").slice(0, 200) : "");

const ea = spawnVerify(root, "scripts/verify-early-access.mjs");
pass("regression:early_access", ea.status === 0, ea.status !== 0 ? (ea.stderr || ea.stdout || "").slice(0, 200) : "");

const playwrightBin = join(root, "node_modules", "@playwright", "test", "cli.js");
if (existsSync(playwrightBin)) {
    const listed = spawnSync(process.execPath, [playwrightBin, "test", "--list", "e2e/launch-execution-smoke.spec.ts"], {
        cwd: root,
        encoding: "utf8",
        timeout: 120_000,
    });
    pass("playwright:list_smoke", listed.status === 0, listed.status !== 0 ? (listed.stderr || listed.stdout || "").slice(0, 200) : "");
} else {
    pass("playwright:list_smoke", false, "@playwright/test missing");
}

const failed = results.filter((r) => !r.pass);
console.log(`launch-execution:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

// Surface decision from generated report for operators
const decisionMatch = reportMd.match(/\*\*Decision:\s*(GO|HOLD)\*\*/) || reportMd.match(/Decision:\s*(GO|HOLD)/);
if (decisionMatch) console.log(`LAUNCH_DECISION=${decisionMatch[1]}`);
process.exit(failed.length ? 1 : 0);

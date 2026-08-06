/**
 * Soft Launch operations verification.
 * Run: npm run operations:verify
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
    "src/lib/session-security.ts",
    "src/lib/storage-security.ts",
    "src/lib/ops-monitoring.ts",
    "src/lib/disaster-recovery.ts",
    "app/api/ops/health/route.ts",
    "app/api/ops/live/route.ts",
    "app/api/ops/ready/route.ts",
    "app/api/ops/diagnostics/route.ts",
    "app/api/storage/upload/route.ts",
    "app/api/storage/signed-url/route.ts",
    "e2e/soft-launch.spec.ts",
    "playwright.config.ts",
    "scripts/test-operations.mjs",
    "docs/DISASTER_RECOVERY.md",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

pass("auth:validateSession", readSafe(join(root, "src/services/auth.server.ts")).includes("async validateSession"));
pass("auth:refresh", readSafe(join(root, "src/services/auth.server.ts")).includes("refreshSessionIfNeeded"));
pass("api:session_hardening", readSafe(join(root, "src/lib/api-security.ts")).includes("validateSession"));
pass("storage:mime", readSafe(join(root, "src/lib/storage-security.ts")).includes("STORAGE_ALLOWED_MIME"));
pass("storage:upload_route_secure", readSafe(join(root, "app/api/storage/upload/route.ts")).includes("secureApiRoute"));
pass("storage:signed_route_secure", readSafe(join(root, "app/api/storage/signed-url/route.ts")).includes("secureApiRoute"));
pass("ops:health_rate_limit", readSafe(join(root, "app/api/ops/health/route.ts")).includes("checkRateLimit"));
pass("ops:diagnostics_auth", readSafe(join(root, "app/api/ops/diagnostics/route.ts")).includes("secureApiRoute"));
pass("ops:alerts", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("enqueueAlert"));
pass("ops:performance", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("recordPerformanceMark"));
pass("dr:backup_verify", readSafe(join(root, "src/lib/disaster-recovery.ts")).includes("verifyBackupStatus"));
pass("dr:docs_soft_launch", readSafe(join(root, "docs/DISASTER_RECOVERY.md")).includes("Soft Launch Verification"));
pass("e2e:sign_in", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("sign-in"));
pass("e2e:sign_up", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("sign-up"));
pass("e2e:crm", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/crm"));
pass("e2e:projects", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/projects"));
pass("e2e:customer_success", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/customer-success"));
pass("e2e:billing", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/billing-finance"));
pass("e2e:hrms", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/hrms"));
pass("e2e:integrations", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/integration-hub"));
pass("e2e:security", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("/security-center"));
pass("e2e:logout", readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("logout") || readSafe(join(root, "e2e/soft-launch.spec.ts")).includes("sign out"));
pass("package:operations_verify", readSafe(join(root, "package.json")).includes('"operations:verify"'));
pass("package:playwright_dep", readSafe(join(root, "package.json")).includes('"@playwright/test"'));

const unit = spawnVerify(root, "scripts/test-operations.mjs");
pass("test:operations", unit.status === 0, unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 200) : "");

const playwrightBin = join(root, "node_modules", "@playwright", "test", "cli.js");
if (existsSync(playwrightBin)) {
    const listed = spawnSync(process.execPath, [playwrightBin, "test", "--list"], {
        cwd: root,
        encoding: "utf8",
        timeout: 120_000,
    });
    pass("playwright:list", listed.status === 0, listed.status !== 0 ? (listed.stderr || listed.stdout || "").slice(0, 200) : "");
    pass(
        "playwright:suites_registered",
        (listed.stdout || "").includes("soft-launch") || (listed.stdout || "").includes("sign-in"),
        "",
    );
} else {
    pass("playwright:list", false, "@playwright/test not installed");
    pass("playwright:suites_registered", false, "@playwright/test not installed");
}

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const security = spawnVerify(root, "scripts/test-security-center-os.mjs");
pass("regression:security-os", security.status === 0);
const ecc = spawnVerify(root, "scripts/test-executive-live-stats.mjs");
pass("regression:ecc-live", ecc.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);
console.log("\nOperations Soft Launch Verification\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);
if (failed.length > 0) process.exit(1);

/**
 * Pre-deployment verification.
 * Run: npm run predeploy:verify
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: !!ok, detail });
}

// 1. Basic Runtime Checks
const tsc = runTsc(root);
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 240) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 240) : "");

// 2. Chained Verification (Critical path)
process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";

const prod = spawnVerify(root, "scripts/verify-production.mjs");
pass("chain:production_verify", prod.status === 0, prod.status !== 0 ? "failed" : "ok");

const readiness = spawnVerify(root, "scripts/verify-production-readiness.mjs");
pass("chain:production_readiness", readiness.status === 0, readiness.status !== 0 ? (readiness.stderr || readiness.stdout || "failed").slice(-4000) : "ok");

const golive = spawnVerify(root, "scripts/verify-go-live.mjs");
pass("chain:go_live", golive.status === 0, golive.status !== 0 ? "failed" : "ok");

const rls = spawnVerify(root, "scripts/verify-rls-isolation.mjs");
pass("chain:rls_isolation", rls.status === 0, rls.status !== 0 ? "failed" : "ok");

const failed = results.filter((r) => !r.pass);
console.log(`predeploy:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

process.exit(failed.length ? 1 : 0);

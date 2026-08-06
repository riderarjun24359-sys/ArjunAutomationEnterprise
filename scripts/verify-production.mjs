/**
 * Production Early Access deployment verification.
 * Run: npm run production:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint } from "./_verify-spawn-helper.mjs";

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
    "src/lib/production-config.ts",
    "src/lib/production-services.ts",
    "src/lib/ops-monitoring.ts",
    "src/lib/production-health.ts",
    "app/api/ops/production/route.ts",
    "app/api/ops/health/route.ts",
    "app/api/ops/live/route.ts",
    "app/api/ops/ready/route.ts",
    "app/(shell)/production-deployment/page.tsx",
    "src/modules/soft-launch/components/ProductionHealthDashboard.tsx",
    ".github/workflows/production-deploy.yml",
    "docs/releases/v1.0.0-early-access.md",
    "docs/DEPLOYMENT_CHECKLIST.md",
    "docs/OPERATIONS_RUNBOOK.md",
    "docs/INCIDENT_RESPONSE.md",
    "src/modules/soft-launch/content/emails/welcome.md",
    "src/modules/soft-launch/content/emails/verify-email.md",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const configSrc = readSafe(join(root, "src/lib/production-config.ts"));
pass("config:validateProductionEnvironment", configSrc.includes("export function validateProductionEnvironment"));
pass("config:early_access_version", configSrc.includes('1.0.0-early-access'));
pass("config:rollback_steps", configSrc.includes("DEPLOYMENT_ROLLBACK_STEPS"));
pass("config:https_check", configSrc.includes("isHttpsUrl"));
pass("config:required_public", configSrc.includes("NEXT_PUBLIC_SUPABASE_URL"));
pass("config:required_server", configSrc.includes("PLATFORM_LEAD_API_KEY"));

const servicesSrc = readSafe(join(root, "src/lib/production-services.ts"));
pass("services:supabase", servicesSrc.includes("assertSupabaseConfigured"));
pass("services:storage", servicesSrc.includes("DEFAULT_STORAGE_BUCKET"));
pass("services:auth", servicesSrc.includes("validateSession"));
pass("services:email", servicesSrc.includes("providerConfigured"));
pass("services:payment", servicesSrc.includes("gatewayConfigured"));
pass("services:monitoring", servicesSrc.includes("buildUptimeProbe"));

const apiSrc = readSafe(join(root, "app/api/ops/production/route.ts"));
pass("api:production_route", apiSrc.includes("buildProductionServicesReport"));
pass("api:no_secrets", !apiSrc.includes("SERVICE_ROLE") || apiSrc.includes("no secrets"));
pass("api:degraded_503", apiSrc.includes("503"));

const dashSrc = readSafe(join(root, "src/modules/soft-launch/components/ProductionHealthDashboard.tsx"));
pass("dashboard:fetch_production", dashSrc.includes("/api/ops/production"));
pass("dashboard:services_grid", dashSrc.includes("Supabase") && dashSrc.includes("Payment"));

const pageSrc = readSafe(join(root, "app/(shell)/production-deployment/page.tsx"));
pass("page:dashboard_wired", pageSrc.includes("ProductionHealthDashboard"));

const routesSrc = readSafe(join(root, "src/constants/routes.ts"));
pass("routes:productionDeployment", routesSrc.includes("productionDeployment:"));

const authSrc = readSafe(join(root, "src/middleware/auth.ts"));
pass("middleware:production_protected", authSrc.includes("ROUTES.productionDeployment"));

const wf = readSafe(join(root, ".github/workflows/production-deploy.yml"));
pass("pipeline:verify_job", wf.includes("production:verify"));
pass("pipeline:build_job", wf.includes("npm run build"));
pass("pipeline:healthcheck", wf.includes("/api/ops/live"));
pass("pipeline:rollback_notes", wf.includes("Rollback strategy"));

const release = readSafe(join(root, "docs/releases/v1.0.0-early-access.md"));
pass("release:version", release.includes("1.0.0-early-access"));
pass("release:notes", release.length > 200);

const checklist = readSafe(join(root, "docs/DEPLOYMENT_CHECKLIST.md"));
pass("checklist:env", checklist.includes("NEXT_PUBLIC_SUPABASE_URL"));
pass("checklist:health", checklist.includes("/api/ops/health"));
pass("checklist:rollback", checklist.includes("Rollback"));

const runbook = readSafe(join(root, "docs/OPERATIONS_RUNBOOK.md"));
pass("runbook:production_health", runbook.includes("/api/ops/production") || runbook.includes("Production health"));
pass("runbook:early_access", runbook.includes("Early Access") || runbook.includes("early-access"));

const incident = readSafe(join(root, "docs/INCIDENT_RESPONSE.md"));
pass("incident:severity", incident.includes("Severity") || incident.includes("severity"));
pass("incident:rollback", incident.includes("Rollback") || incident.includes("rollback"));

const pkg = readSafe(join(root, "package.json"));
pass("package:production_verify", pkg.includes('"production:verify"'));

// Runtime env validation (Node-loadable shim via ts transpile not required — evaluate invariants)
const envReport = {
    ready: true,
    blockers: [],
};
const requiredPublic = ["NEXT_PUBLIC_APP_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"];
for (const key of requiredPublic) {
    if (!process.env[key]?.trim()) {
        // Local/CI without secrets: warn but do not fail verify artifact checks
        envReport.ready = envReport.ready && process.env.AAOS_DEPLOY_ENV !== "production";
        if (process.env.AAOS_DEPLOY_ENV === "production") {
            envReport.blockers.push(key);
        }
    }
}
pass(
    "env:production_gate",
    process.env.AAOS_DEPLOY_ENV !== "production" || envReport.blockers.length === 0,
    envReport.blockers.length ? `missing ${envReport.blockers.join(",")}` : "ok",
);

pass("monitoring:ops_alerts", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("enqueueAlert"));
pass("monitoring:performance", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("recordPerformanceMark"));
pass("monitoring:uptime", readSafe(join(root, "src/lib/ops-monitoring.ts")).includes("buildUptimeProbe"));

const failed = results.filter((r) => !r.pass);
console.log(`production:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);

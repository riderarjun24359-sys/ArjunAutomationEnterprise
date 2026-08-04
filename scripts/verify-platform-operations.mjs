/**
 * Platform Operations verification: tsc, lint, route, nav, middleware,
 * 10 panels, 10 engines, 3 bridges, constants, service methods,
 * mission-core integration, Design OS, SDK, AI diagnostics,
 * no duplicate monitoring, regression mission-core + security-center.
 * Run: node scripts/verify-platform-operations.mjs
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "platform-operations");
const mcRoot = join(root, "src", "modules", "mission-core");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

function readModuleSources(dir) {
    let combined = "";
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) combined += readModuleSources(full);
        else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) combined += readSafe(full);
    }
    return combined;
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

const routePath = join(root, "app", "(shell)", "platform-operations", "page.tsx");
const routeSource = readSafe(routePath);
pass("route:page_exists", existsSync(routePath));
pass("route:exports_PlatformOperationsPage", routeSource.includes("PlatformOperationsPage"));

const routesSource = readSafe(join(root, "src", "constants", "routes.ts"));
pass("route:routes_ts_platformOperations", routesSource.includes('platformOperations: "/platform-operations"'));

const navSource = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Platform_Operations_label", navSource.includes("Platform Operations"));
pass("nav:Gauge_icon", navSource.includes("Gauge"));
pass("nav:platformOperations_route", navSource.includes("ROUTES.platformOperations"));
pass("nav:primary_section", /Platform Operations[\s\S]*section:\s*"primary"/.test(navSource));

const middlewareSource = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:platformOperations_protected", middlewareSource.includes("ROUTES.platformOperations"));

const panels = [
    "PlatformHealthCenterPanel",
    "ObservabilityCenterPanel",
    "ErrorManagementPanel",
    "QueueJobEnginePanel",
    "RetryEnginePanel",
    "BackupCenterPanel",
    "DisasterRecoveryPanel",
    "PerformanceCenterPanel",
    "ServiceStatusPanel",
    "OperationsDashboardPanel",
];

for (const panel of panels) {
    pass(`panel:${panel}`, existsSync(join(modRoot, "components", "panels", `${panel}.tsx`)));
}

const engines = [
    "health-center-engine",
    "observability-engine",
    "error-management-engine",
    "queue-job-engine",
    "retry-engine",
    "backup-center-engine",
    "disaster-recovery-engine",
    "performance-center-engine",
    "service-status-engine",
    "operations-dashboard-engine",
];

for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engine", `${engine}.ts`)));
}

const bridges = [
    "mission-core-bridge",
    "operations-center-bridge",
    "audit-bridge",
];

for (const bridge of bridges) {
    pass(`bridge:${bridge}`, existsSync(join(modRoot, "integrations", `${bridge}.ts`)));
}

const constantsSource = readSafe(join(modRoot, "constants", "index.ts"));
const healthComponents = ["missionCore", "capabilities", "sharedServices", "database", "storage", "api", "queues", "workers", "externalIntegrations"];
for (const comp of healthComponents) {
    pass(`constant:HEALTH_COMPONENT:${comp}`, constantsSource.includes(`"${comp}"`));
}

const errorTypes = ["runtime", "api_failure", "workflow_failure", "integration_failure", "unhandled_exception", "ai_failure"];
for (const type of errorTypes) {
    pass(`constant:ERROR_TYPE:${type}`, constantsSource.includes(`"${type}"`));
}

const queueTypes = ["background", "workflow", "retry", "dead_letter", "priority"];
for (const type of queueTypes) {
    pass(`constant:QUEUE_TYPE:${type}`, constantsSource.includes(`"${type}"`));
}

const backupTypes = ["database", "document", "configuration", "capability_metadata"];
for (const type of backupTypes) {
    pass(`constant:BACKUP_TYPE:${type}`, constantsSource.includes(`"${type}"`));
}

const serviceSource = readSafe(join(modRoot, "services", "platform-operations.service.ts"));
const serviceMethods = [
    "getHealthCenter",
    "getLiveHealthScore",
    "searchLogs",
    "getObservabilityData",
    "captureError",
    "getErrors",
    "getAiRetryRecommendations",
    "resolveError",
    "getJobQueues",
    "enqueueJob",
    "getRetryPolicies",
    "executeRetry",
    "getBackups",
    "runBackupVerification",
    "simulateRestore",
    "getDisasterRecoveryPlans",
    "validateFailover",
    "getPerformanceMetrics",
    "getServiceStatuses",
    "getIncidents",
    "setMaintenanceMode",
    "getOperationsDashboard",
    "getFullState",
];
for (const method of serviceMethods) {
    pass(`service:${method}`, serviceSource.includes(method));
}

const mcConstants = readSafe(join(mcRoot, "constants", "index.ts"));
pass("mission-core:platformOperations_capability", mcConstants.includes('id: "platformOperations"'));
pass("mission-core:HealthEvent", mcConstants.includes("HealthEvent"));
pass("mission-core:PerformanceMetricPublished", mcConstants.includes("PerformanceMetricPublished"));
pass("mission-core:FailureEvent", mcConstants.includes("FailureEvent"));
pass("mission-core:RecoveryEvent", mcConstants.includes("RecoveryEvent"));

const mcService = readSafe(join(mcRoot, "services", "mission-core.service.ts"));
pass("mission-core:publishHealthEvent", mcService.includes("publishHealthEvent"));
pass("mission-core:publishPerformanceMetric", mcService.includes("publishPerformanceMetric"));
pass("mission-core:publishFailureEvent", mcService.includes("publishFailureEvent"));
pass("mission-core:publishRecoveryEvent", mcService.includes("publishRecoveryEvent"));

const mcSdk = readSafe(join(mcRoot, "sdk", "index.ts"));
pass("mission-core:sdk_publishHealthEvent", mcSdk.includes("publishHealthEvent"));
pass("mission-core:sdk_publishPerformanceMetric", mcSdk.includes("publishPerformanceMetric"));

const mcBridge = readSafe(join(modRoot, "integrations", "mission-core-bridge.ts"));
pass("bridge:publishHealthEvent", mcBridge.includes("publishHealthEvent"));
pass("bridge:getPlatformHealth", mcBridge.includes("getPlatformHealth"));

const healthEngine = readSafe(join(modRoot, "engine", "health-center-engine.ts"));
pass("health:delegates_mission_core", healthEngine.includes("getPlatformHealth"));

const opsBridge = readSafe(join(modRoot, "integrations", "operations-center-bridge.ts"));
pass("bridge:delegates_operations_center", opsBridge.includes("operationsCenterService") && opsBridge.includes("no duplicate"));

const pageSource = readSafe(join(modRoot, "components", "PlatformOperationsPage.tsx"));
pass("ui:design_os_Card", pageSource.includes("@/src/design-os/components/Card"));
pass("ui:PageTransition", pageSource.includes("PageTransition"));
pass("ui:StaggerReveal", pageSource.includes("StaggerReveal"));
pass("ui:Tabs", pageSource.includes("Tabs"));

const sdkSource = readSafe(join(modRoot, "sdk", "index.ts"));
pass("sdk:createPlatformOperationsClient", sdkSource.includes("createPlatformOperationsClient"));

const errorEngine = readSafe(join(modRoot, "engine", "error-management-engine.ts"));
pass("ai:retry_recommendations", errorEngine.includes("retryRecommendation") || errorEngine.includes("ai-assisted"));
pass("ai:aiAssisted", errorEngine.includes("aiAssisted"));

pass("package:platform_operations_verify", readSafe(join(root, "package.json")).includes('"platform-operations:verify"'));

const mcVerify = spawnSync("npm", ["run", "mission-core:verify"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:mission_core_verify", mcVerify.status === 0, mcVerify.status !== 0 ? "mission-core verify failed" : "");

const scTsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:security_center_tsc", scTsc.status === 0);

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log("\nPlatform Operations Verification Results\n");
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
console.log(`\n${passed}/${results.length} checks passed`);

if (failed.length > 0) {
    process.exit(1);
}

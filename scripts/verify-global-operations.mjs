/**
 * Customer Success & Global Operations v1.0 verification
 * Run: node scripts/verify-global-operations.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runTsc, runLint, spawnVerify } from "./_verify-spawn-helper.mjs";

const root = process.cwd();
const modRoot = join(root, "src", "modules", "customer-success-global-ops");
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

function readSafe(path) {
    try { return readFileSync(path, "utf8"); } catch { return ""; }
}

const tsc = runTsc(root);
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 300) : "");

const lint = runLint(root);
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 300) : "");

pass("route:page", existsSync(join(root, "app", "(shell)", "global-operations", "page.tsx")));
pass("migration", existsSync(join(root, "supabase", "migrations", "202608060006_customer_success_global_ops.sql")));

const modules = [
    "customerSuccessOs",
    "globalSupportCenter",
    "clientOnboarding",
    "serviceDeliveryControl",
    "customerFeedbackEngine",
    "globalOperationsDashboard",
    "continuousImprovementEngine",
];
const constants = readSafe(join(modRoot, "constants", "index.ts"));
for (const m of modules) {
    pass(`module:${m}`, constants.includes(m));
}

const engines = [
    "customer-success-os.engine.ts",
    "global-support-center.engine.ts",
    "client-onboarding.engine.ts",
    "service-delivery-control.engine.ts",
    "customer-feedback.engine.ts",
    "continuous-improvement.engine.ts",
];
for (const engine of engines) {
    pass(`engine:${engine}`, existsSync(join(modRoot, "engines", engine)));
}

pass("component:CustomerSuccessGlobalOpsPage", existsSync(join(modRoot, "components", "CustomerSuccessGlobalOpsPage.tsx")));
pass("component:GlobalOperationsPanels", existsSync(join(modRoot, "components", "GlobalOperationsPanels.tsx")));
pass("service:customer-success-global-ops", existsSync(join(modRoot, "services", "customer-success-global-ops.service.ts")));
pass("repository", existsSync(join(modRoot, "customer-success-global-ops-repository.ts")));
pass("hook:useCustomerSuccessGlobalOps", existsSync(join(modRoot, "hooks", "useCustomerSuccessGlobalOps.ts")));

const migration = readSafe(join(root, "supabase", "migrations", "202608060006_customer_success_global_ops.sql"));
const tables = [
    "csg_success_plans",
    "csg_onboarding_sessions",
    "csg_delivery_milestones",
    "csg_feedback_responses",
    "csg_escalations",
    "csg_renewals",
    "csg_improvement_items",
    "csg_audit_logs",
];
for (const table of tables) {
    pass(`db:${table}`, migration.includes(table));
}
pass("security:rls", migration.includes("enable row level security"));

pass("bridge:platform", existsSync(join(modRoot, "integrations", "platform-bridges.ts")));
pass("bridge:mission-core", existsSync(join(modRoot, "integrations", "mission-core-bridge.ts")));
pass("integration:business-platform", readSafe(join(modRoot, "integrations", "platform-bridges.ts")).includes("businessPlatformService"));
pass("integration:support", readSafe(join(modRoot, "integrations", "platform-bridges.ts")).includes("supportService"));
pass("integration:delivery-engine", readSafe(join(modRoot, "integrations", "platform-bridges.ts")).includes("deliveryEngineService"));

pass("csat", readSafe(join(modRoot, "engines", "customer-feedback.engine.ts")).includes("computeCsatAverage"));
pass("nps", readSafe(join(modRoot, "engines", "customer-feedback.engine.ts")).includes("computeNpsScore"));
pass("improvement_backlog", readSafe(join(modRoot, "engines", "continuous-improvement.engine.ts")).includes("generateImprovementBacklog"));
pass("ai_recommendations", readSafe(join(modRoot, "engines", "continuous-improvement.engine.ts")).includes("generateAiRecommendations"));
pass("health_scoring", readSafe(join(modRoot, "engines", "customer-success-os.engine.ts")).includes("computeHealthScores"));
pass("delivery_milestones", readSafe(join(modRoot, "engines", "service-delivery-control.engine.ts")).includes("buildDeliveryMilestones"));
pass("onboarding_checklist", readSafe(join(modRoot, "constants", "index.ts")).includes("ONBOARDING_CHECKLIST_TEMPLATE"));

const routes = readSafe(join(root, "src", "constants", "routes.ts"));
pass("routes:globalOperations", routes.includes('globalOperations: "/global-operations"'));

const nav = readSafe(join(root, "src", "config", "shell-navigation.ts"));
pass("nav:Global_Operations", nav.includes("Global Operations") && nav.includes("ROUTES.globalOperations"));

const middleware = readSafe(join(root, "src", "middleware", "auth.ts"));
pass("middleware:protected", middleware.includes("ROUTES.globalOperations"));

const missionConstants = readSafe(join(root, "src", "modules", "mission-core", "constants", "index.ts"));
pass("mission-core:capability", missionConstants.includes('"globalOperations"'));

const executor = readSafe(join(root, "src", "modules", "mission-core", "engine", "capability-executor.ts"));
pass("executor:dashboard", executor.includes("globalOperations:dashboard"));
pass("executor:success-plan", executor.includes("globalOperations:success-plan"));
pass("executor:improvement", executor.includes("globalOperations:improvement-backlog"));

pass("dashboard:panels", readSafe(join(modRoot, "components", "GlobalOperationsPanels.tsx")).includes("Customer Success OS"));
pass("dashboard:support", readSafe(join(modRoot, "components", "GlobalOperationsPanels.tsx")).includes("Global Support Center"));
pass("dashboard:feedback", readSafe(join(modRoot, "components", "GlobalOperationsPanels.tsx")).includes("Customer Feedback Engine"));
pass("dashboard:improvement", readSafe(join(modRoot, "components", "GlobalOperationsPanels.tsx")).includes("Continuous Improvement Engine"));
pass("package:script", readSafe(join(root, "package.json")).includes('"global-operations:verify"'));

const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass);

console.log(`\nCustomer Success & Global Operations v1.0: ${passed}/${results.length} checks passed\n`);
for (const r of results) {
    console.log(`${r.pass ? "✓" : "✗"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}

if (failed.length > 0) process.exit(1);

const chain = spawnVerify(root, "scripts/verify-business-platform.mjs");
if (chain.status !== 0) {
    console.error(chain.stdout?.slice(-500) || chain.stderr?.slice(-500) || "business-platform verify failed");
    process.exit(chain.status ?? 1);
}

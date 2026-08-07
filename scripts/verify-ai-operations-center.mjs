/**
 * Sprint 15 — AI Operations & Monitoring Center verification.
 * Run: npm run ai-operations-center:verify
 * Target: 80+/80 PASS
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
pass("runtime:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 400) : "");

const lint = runLint(root);
pass("runtime:eslint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 400) : "");

const required = [
    "src/modules/ai-operations-center/index.ts",
    "src/modules/ai-operations-center/access.ts",
    "src/modules/ai-operations-center/constants.ts",
    "src/modules/ai-operations-center/types.ts",
    "src/modules/ai-operations-center/repository/ai-operations-center.repository.ts",
    "src/modules/ai-operations-center/builders/ai-operations-center.builders.ts",
    "src/modules/ai-operations-center/services/ai-operations-center.service.ts",
    "src/modules/ai-operations-center/hooks/useAiOperationsCenter.ts",
    "src/modules/ai-operations-center/components/AiOperationsCenterPage.tsx",
    "src/modules/ai-operations-center/components/AiOperationsCenterPanels.tsx",
    "app/(shell)/ai-operations-center/page.tsx",
    "scripts/test-ai-operations-center.mjs",
];
for (const f of required) pass(`file:${f}`, existsSync(join(root, f)));

const access = readSafe(join(root, "src/modules/ai-operations-center/access.ts"));
pass("access:founder_admin", access.includes("isFounderOrAdminAccess"));

const builders = readSafe(join(root, "src/modules/ai-operations-center/builders/ai-operations-center.builders.ts"));
pass("module:health", builders.includes("buildSystemHealthDashboard"));
pass("module:agents", builders.includes("buildAiAgentMonitor"));
pass("module:infrastructure", builders.includes("buildInfrastructureMonitoring"));
pass("module:security", builders.includes("buildSecurityCenter"));
pass("module:logs", builders.includes("buildLogsAndAudit"));
pass("module:alerts", builders.includes("buildAlertCenter"));
pass("module:backup", builders.includes("buildBackupAndRecovery"));
pass("module:performance", builders.includes("buildPerformanceAnalytics"));
pass("module:executive", builders.includes("buildExecutiveOperationsDashboard"));
pass("feature:health_domains", builders.includes("api") && builders.includes("database") && builders.includes("queue") && builders.includes("storage") && builders.includes("background_jobs"));
pass("feature:alert_severity", builders.includes("critical") && builders.includes("warning"));
pass("feature:log_kinds", builders.includes("application") && builders.includes("workflow") && builders.includes("ai_execution"));
pass("feature:token_cost", builders.includes("tokenUsage") && builders.includes("estimatedCostUsd"));
pass("feature:dr_checklist", builders.includes("disasterRecoveryChecklist") && builders.includes("restoreWorkflows"));
pass("no_mock_random", !builders.includes("Math.random"));

const repo = readSafe(join(root, "src/modules/ai-operations-center/repository/ai-operations-center.repository.ts"));
pass("live:databaseService", repo.includes("databaseService"));
pass("live:eoc_overall", repo.includes("eocOverallHealth"));
pass("live:eoc_module", repo.includes("eocModuleHealth"));
pass("live:eoc_database", repo.includes("eocDatabaseHealth"));
pass("live:eoc_schedulers", repo.includes("eocJobSchedulers"));
pass("live:eoc_jobs", repo.includes("eocRecurringJobs"));
pass("live:eoc_queue", repo.includes("eocJobRetryQueue"));
pass("live:eoc_dead", repo.includes("eocJobDeadLetter"));
pass("live:eoc_alerts", repo.includes("eocAlerts"));
pass("live:eoc_acks", repo.includes("eocAlertAcknowledgements"));
pass("live:eoc_logs", repo.includes("eocPlatformLogs"));
pass("live:eoc_metrics", repo.includes("eocPlatformMetrics"));
pass("live:eoc_traces", repo.includes("eocTraceSummaries"));
pass("live:eoc_services", repo.includes("eocServiceRegistry"));
pass("live:eoc_ops_metrics", repo.includes("eocOperationsMetrics"));
pass("live:eoc_ops_health", repo.includes("eocOperationsHealth"));
pass("live:eoc_failures", repo.includes("eocOperationsFailures"));
pass("live:eoc_audit", repo.includes("eocAuditLogs"));
pass("live:activity", repo.includes("activityLogs"));
pass("live:audits", repo.includes("audits.list"));
pass("live:backup_configs", repo.includes("backupConfigs"));
pass("live:backup_runs", repo.includes("backupRuns.listByConfig"));
pass("live:agents", repo.includes("aiAgents"));
pass("live:executions", repo.includes("workflowExecutions"));
pass("live:automation_logs", repo.includes("automationLogs"));
pass("live:dwe_health", repo.includes("dweWorkflowHealth"));
pass("live:clients", repo.includes("clients.listByOrganization"));
pass("live:multi_tenant_org", repo.includes("resolveOrganizationContext") && repo.includes("organizationId"));
pass("live:membership_role", repo.includes("membershipRole") && repo.includes("role_name"));

const page = readSafe(join(root, "src/modules/ai-operations-center/components/AiOperationsCenterPage.tsx"));
pass("ui:access_denied", page.includes("Founder / Admin access required"));
pass("ui:tabs", page.includes("AOC_TAB_LIST"));

const panels = readSafe(join(root, "src/modules/ai-operations-center/components/AiOperationsCenterPanels.tsx"));
pass("ui:health", panels.includes("System Health Dashboard") && panels.includes("API health") && panels.includes("Background jobs"));
pass("ui:agents", panels.includes("AI Agent Monitor") && panels.includes("Token usage") && panels.includes("Cost tracking"));
pass("ui:infrastructure", panels.includes("Infrastructure Monitoring") && panels.includes("CPU") && panels.includes("Availability"));
pass("ui:security", panels.includes("Security Center") && panels.includes("Login activity") && panels.includes("RBAC audit") && panels.includes("Suspicious events"));
pass("ui:logs", panels.includes("Logs & Audit") && panels.includes("Application logs") && panels.includes("Search & filtering"));
pass("ui:alerts", panels.includes("Alert Center") && panels.includes("Critical alerts") && panels.includes("Notification history"));
pass("ui:backup", panels.includes("Backup & Recovery") && panels.includes("Restore workflows") && panels.includes("Disaster recovery checklist"));
pass("ui:performance", panels.includes("Performance Analytics") && panels.includes("Slow pages") && panels.includes("Optimization suggestions"));
pass("ui:executive", panels.includes("Executive Operations Dashboard") && panels.includes("Overall platform health") && panels.includes("Active customers") && panels.includes("Automation health"));

pass(
    "routes:aiOperationsCenter",
    readSafe(join(root, "src/constants/routes.ts")).includes("aiOperationsCenter:"),
);
pass(
    "middleware:protected",
    readSafe(join(root, "src/middleware/auth.ts")).includes("ROUTES.aiOperationsCenter"),
);
pass("nav:shell", readSafe(join(root, "src/config/shell-navigation.ts")).includes("aiOperationsCenter"));
pass(
    "package:script",
    readSafe(join(root, "package.json")).includes('"ai-operations-center:verify"'),
);

pass(
    "isolation:no_schema_migration",
    !existsSync(join(root, "supabase/migrations/ai-operations-center.sql")),
);
pass(
    "isolation:automation_sprint14_intact",
    existsSync(join(root, "src/modules/ai-automation-engine/services/ai-automation-engine.service.ts")),
);
pass(
    "isolation:finance_sprint12_intact",
    existsSync(join(root, "src/modules/ai-finance-billing-engine/services/ai-finance-billing-engine.service.ts")),
);
pass(
    "isolation:customer_success_sprint11_intact",
    existsSync(join(root, "src/modules/ai-customer-success-engine/services/ai-customer-success-engine.service.ts")),
);
pass(
    "isolation:existing_operations_center_intact",
    readSafe(join(root, "src/constants/routes.ts")).includes('operationsCenter: "/operations-center"'),
);

process.env.SKIP_TSC = "1";
process.env.SKIP_LINT = "1";
const unit = spawnVerify(root, "scripts/test-ai-operations-center.mjs");
pass(
    "test:ai-operations-center",
    unit.status === 0,
    unit.status !== 0 ? (unit.stderr || unit.stdout || "").slice(0, 240) : "",
);

const failed = results.filter((r) => !r.pass);
console.log(`ai-operations-center:verify ${results.filter((r) => r.pass).length}/${results.length}`);
for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"} ${r.check}${r.detail ? ` — ${r.detail}` : ""}`);
}
process.exit(failed.length ? 1 : 0);

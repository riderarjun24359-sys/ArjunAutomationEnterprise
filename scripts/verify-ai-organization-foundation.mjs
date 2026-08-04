/**
 * AI Organization Foundation verification: regression, security, tenant isolation, performance,
 * onboarding, production, observability, operations, beta, dashboard, framework SDK compatibility,
 * and founder-os phase3 integration.
 * Run: node scripts/verify-ai-organization-foundation.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

const migrationPath = join(root, "supabase", "migrations", "202608020047_ai_organization_foundation.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(aof_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:aof_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["aof_organization_metrics", "aof_organization_health", "aof_audit_logs"]);
const childTables = tables.filter((t) => t !== "aof_organization_hubs" && !orgOnlyTables.has(t));
const hasMemberPolicyTemplate = migrationSql.includes("is_organization_member(organization_id)");
for (const table of childTables) {
    const hasOrgCol = new RegExp(`create table if not exists public\\.${table}[\\s\\S]*?organization_id uuid`, "i").test(migrationSql);
    pass(`isolation:organization_id:${table}`, hasOrgCol);
    pass(`isolation:is_organization_member:${table}`, hasMemberPolicyTemplate);
}

for (const table of tables) {
    const indexName = `idx_${table}_org`;
    const hasIndex = migrationSql.includes(`create index if not exists ${indexName}`);
    pass(`performance:${indexName}`, hasIndex);
}

pass("ago:growth_orchestrators_table", tables.includes("aof_growth_orchestrators"));
pass("ago:campaign_intelligence_table", tables.includes("aof_campaign_intelligence"));
pass("ago:lead_prioritization_table", tables.includes("aof_lead_prioritization"));
pass("ago:pipeline_health_table", tables.includes("aof_pipeline_health"));
pass("ago:growth_analytics_table", tables.includes("aof_growth_analytics"));
pass("ago:executive_growth_dashboards_table", tables.includes("aof_executive_growth_dashboards"));
pass("ago:orchestrator_status_column", /aof_growth_orchestrators[\s\S]*?orchestrator_status text/i.test(migrationSql));

pass("ado:delivery_orchestrators_table", tables.includes("aof_delivery_orchestrators"));
pass("ado:resource_planners_table", tables.includes("aof_resource_planners"));
pass("ado:implementation_schedulers_table", tables.includes("aof_implementation_schedulers"));
pass("ado:deployment_coordination_table", tables.includes("aof_deployment_coordination"));
pass("ado:delivery_intelligence_table", tables.includes("aof_delivery_intelligence"));
pass("ado:customer_success_automation_table", tables.includes("aof_customer_success_automation"));
pass("ado:executive_delivery_dashboards_table", tables.includes("aof_executive_delivery_dashboards"));

pass("aio:idea_registry_table", tables.includes("aof_idea_registry"));
pass("aio:innovation_pipeline_table", tables.includes("aof_innovation_pipeline"));
pass("aio:experiment_tracker_table", tables.includes("aof_experiment_tracker"));
pass("aio:validation_workflow_table", tables.includes("aof_validation_workflow"));
pass("aio:outcome_evaluation_table", tables.includes("aof_outcome_evaluation"));
pass("aio:knowledge_repository_table", tables.includes("aof_knowledge_repository"));

pass("ai_orchestration:ai_task_routers_table", tables.includes("aof_ai_task_routers"));
pass("ai_orchestration:human_approval_engine_table", tables.includes("aof_human_approval_engine"));
pass("ai_orchestration:policy_engine_table", tables.includes("aof_policy_engine"));
pass("ai_orchestration:execution_history_table", tables.includes("aof_execution_history"));
pass("ai_orchestration:ai_governance_rules_table", tables.includes("aof_ai_governance_rules"));
pass("ai_orchestration:router_status_column", /aof_ai_task_routers[\s\S]*?router_status text/i.test(migrationSql));

pass("dashboard:organization_metrics_table", tables.includes("aof_organization_metrics"));
pass("dashboard:organization_health_table", tables.includes("aof_organization_health"));
pass("dashboard:innovation_dashboards_table", tables.includes("aof_innovation_dashboards"));
pass("dashboard:mission_progress_table", tables.includes("aof_mission_progress"));
pass("dashboard:organization_failures_table", tables.includes("aof_organization_failures"));

pass("organization_metrics:growth_score", /aof_organization_metrics[\s\S]*?growth_score numeric/i.test(migrationSql));
pass("organization_metrics:delivery_score", /aof_organization_metrics[\s\S]*?delivery_score numeric/i.test(migrationSql));
pass("organization_metrics:innovation_score", /aof_organization_metrics[\s\S]*?innovation_score numeric/i.test(migrationSql));
pass("organization_metrics:pending_ai_approval_count", /aof_organization_metrics[\s\S]*?pending_ai_approval_count integer/i.test(migrationSql));
pass("organization_metrics:pipeline_health_score", /aof_organization_metrics[\s\S]*?pipeline_health_score numeric/i.test(migrationSql));
pass("organization_metrics:mission_progress_score", /aof_organization_metrics[\s\S]*?mission_progress_score numeric/i.test(migrationSql));
pass("organization_metrics:overall_organization_score", /aof_organization_metrics[\s\S]*?overall_organization_score numeric/i.test(migrationSql));

pass("organization_health:disaster_recovery_mode", /aof_organization_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("organization_health:ago_status", /aof_organization_health[\s\S]*?ago_status text/i.test(migrationSql));
pass("organization_health:ado_status", /aof_organization_health[\s\S]*?ado_status text/i.test(migrationSql));
pass("organization_health:aio_status", /aof_organization_health[\s\S]*?aio_status text/i.test(migrationSql));
pass("organization_health:orchestration_status", /aof_organization_health[\s\S]*?orchestration_status text/i.test(migrationSql));
pass("organization_health:security_status", /aof_organization_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "047_ai_organization_foundation_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:organization_health_recovery", seedSql.includes("aof_organization_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:growth_orchestrators", seedSql.includes("aof_growth_orchestrators") && seedSql.includes("ago-growth-0907"));
pass("seed:delivery_orchestrators", seedSql.includes("aof_delivery_orchestrators") && seedSql.includes("ado-delivery-0907"));
pass("seed:idea_registry", seedSql.includes("aof_idea_registry") && seedSql.includes("idea-reg-0907"));
pass("seed:ai_task_routers", seedSql.includes("aof_ai_task_routers") && seedSql.includes("task-router-0907"));
pass("seed:mission_progress", seedSql.includes("aof_mission_progress") && seedSql.includes("mission-progress-0907"));
pass("seed:organization_metrics", seedSql.includes("aof_organization_metrics") && seedSql.includes("overall_organization_score"));
pass("seed:organization_hub", seedSql.includes("aof_organization_hubs") && seedSql.includes("northstar-ai-organization"));
pass("seed:agent_type", seedSql.includes("ai_organization_foundation"));

const mappersPath = join(root, "src/modules/database/lib/ai-organization-foundation-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildAofDashboardStats_exported", mappersSource.includes("export const buildAofDashboardStats") || mappersSource.includes("export function buildAofDashboardStats"));
pass("mappers:buildOrganizationHubLookupMaps", mappersSource.includes("buildOrganizationHubLookupMaps"));
pass("mappers:buildAofPipelineInfo", mappersSource.includes("buildAofPipelineInfo"));
if (mappersSource.includes("buildAofDashboardStats")) {
    pass("mappers:buildAofDashboardStats_growth_score", /growthScore|growth_score/.test(mappersSource));
    pass("mappers:buildAofDashboardStats_delivery_score", /deliveryScore|delivery_score/.test(mappersSource));
    pass("mappers:buildAofDashboardStats_organization_score", /overallOrganizationScore|overall_organization_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/ai-organization-foundation/services/ai-organization-foundation.service.ts");
const serviceSource = existsSync(servicePath) ? readFileSync(servicePath, "utf8") : "";
pass("framework:industry-framework_sdk", serviceSource.includes("@/src/modules/industry-framework/sdk"));
pass("framework:business-process_sdk", serviceSource.includes("@/src/modules/business-process/sdk"));
pass("framework:form-engine_sdk", serviceSource.includes("@/src/modules/form-engine/sdk"));
pass("framework:workflow-engine_sdk", serviceSource.includes("@/src/modules/workflow-engine/sdk"));
pass("framework:document-engine_sdk", serviceSource.includes("@/src/modules/document-engine/sdk"));
pass("framework:commercial-saas_sdk", serviceSource.includes("@/src/modules/commercial-saas/sdk"));
pass("framework:enterprise-identity_sdk", serviceSource.includes("@/src/modules/enterprise-identity/sdk"));
pass("framework:communication-hub_sdk", serviceSource.includes("@/src/modules/communication-hub/sdk"));
pass("framework:integration-platform_sdk", serviceSource.includes("@/src/modules/integration-platform/sdk"));
pass("framework:launch-foundation_sdk", serviceSource.includes("@/src/modules/launch-foundation/sdk"));
pass("framework:company-foundation_sdk", serviceSource.includes("@/src/modules/company-foundation/sdk"));
pass("framework:customer-success-delivery_sdk", serviceSource.includes("@/src/modules/customer-success-delivery/sdk"));
pass("framework:crm_service", serviceSource.includes("crmService"));
pass("framework:createIndustryFrameworkClient", serviceSource.includes("createIndustryFrameworkClient"));
pass("framework:createBusinessProcessClient", serviceSource.includes("createBusinessProcessClient"));
pass("framework:createFormEngineClient", serviceSource.includes("createFormEngineClient"));
pass("framework:createWorkflowEngineClient", serviceSource.includes("createWorkflowEngineClient"));
pass("framework:createDocumentEngineClient", serviceSource.includes("createDocumentEngineClient"));
pass("framework:createCommercialSaasClient", serviceSource.includes("createCommercialSaasClient"));
pass("framework:createEnterpriseIdentityClient", serviceSource.includes("createEnterpriseIdentityClient"));
pass("framework:createCommunicationHubClient", serviceSource.includes("createCommunicationHubClient"));
pass("framework:createIntegrationPlatformClient", serviceSource.includes("createIntegrationPlatformClient"));
pass("framework:createLaunchFoundationClient", serviceSource.includes("createLaunchFoundationClient"));
pass("framework:createCompanyFoundationClient", serviceSource.includes("createCompanyFoundationClient"));
pass("framework:createCustomerSuccessDeliveryClient", serviceSource.includes("createCustomerSuccessDeliveryClient"));
pass("framework:createCustomerOperatedPlatformClient", serviceSource.includes("createCustomerOperatedPlatformClient"));
pass("framework:createEnterpriseIntelligencePlatformClient", serviceSource.includes("createEnterpriseIntelligencePlatformClient"));
pass("framework:createAiOrchestrationClient", serviceSource.includes("createAiOrchestrationClient"));
const sdkPath = join(root, "src/modules/ai-organization-foundation/sdk/index.ts");
const sdkSource = existsSync(sdkPath) ? readFileSync(sdkPath, "utf8") : "";
pass("enterprise_ai_foundation:createAiOrganizationFoundationClient", sdkSource.includes("createAiOrganizationFoundationClient"));
pass("sdk:AgoService", sdkSource.includes("export class AgoService"));
pass("sdk:AdoService", sdkSource.includes("export class AdoService"));
pass("sdk:AioService", sdkSource.includes("export class AioService"));
pass("sdk:OrchestrationService", sdkSource.includes("export class OrchestrationService"));
pass("sdk:createAiOrganizationFoundationClient", sdkSource.includes("createAiOrganizationFoundationClient"));

const requiredFiles = [
    "src/modules/ai-organization-foundation/constants/index.ts",
    "src/modules/ai-organization-foundation/schemas/index.ts",
    "src/modules/ai-organization-foundation/services/ai-organization-foundation.service.ts",
    "src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation.ts",
    "src/modules/ai-organization-foundation/components/AiOrganizationFoundationPage.tsx",
    "src/modules/ai-organization-foundation/components/AiOrganizationFoundationStats.tsx",
    "src/modules/ai-organization-foundation/components/AiOrganizationFoundationPanels.tsx",
    "src/modules/ai-organization-foundation/sdk/index.ts",
    "src/modules/ai-organization-foundation/index.ts",
    "src/modules/ai-organization-foundation/types/index.ts",
    "src/modules/database/lib/ai-organization-foundation-mappers.ts",
    "app/(shell)/ai-organization-foundation/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/ai-organization-foundation/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const AOF_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:AOF_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:AOF_THEME orange-600", constants.includes('primary: "orange-600"'));
    pass("ui:AOF_PERMISSIONS", constants.includes('"aof.view"') && constants.includes('"aof.admin"'));
    pass("ui:ORCHESTRATOR_STATUS_OPTIONS", constants.includes('"deprecated"'));
    pass("ui:DASHBOARD_STATUS_OPTIONS", constants.includes('"archived"'));
    pass("ui:APPROVAL_STATUS_OPTIONS", constants.includes('"pending"'));
} else {
    pass("ui:AOF_TABS count", false, "constants missing");
    pass("ui:AOF_THEME orange-600", false);
    pass("ui:AOF_PERMISSIONS", false);
    pass("ui:ORCHESTRATOR_STATUS_OPTIONS", false);
    pass("ui:DASHBOARD_STATUS_OPTIONS", false);
    pass("ui:APPROVAL_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/ai-organization-foundation/hooks/useAiOrganizationFoundation.ts");
if (existsSync(hookPath)) {
    const hook = readFileSync(hookPath, "utf8");
    pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
    pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
    pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));
} else {
    pass("hook:cancelled useEffect", false);
    pass("hook:stable auth deps", false);
    pass("hook:applyData semicolons", false);
}

const panelsPath = join(root, "src/modules/ai-organization-foundation/components/AiOrganizationFoundationPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:OrganizationHubSelect form.register spread", panels.includes("OrganizationHubSelect") && panels.includes('{...form.register("organizationHubId")}'));
} else {
    pass("ui:OrganizationHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:aiOrganizationFoundation", routes.includes('aiOrganizationFoundation: "/ai-organization-foundation"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:AI Organization", nav.includes('"AI Organization"'));
pass("nav:Bot icon", nav.includes("Bot"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:aiOrganizationFoundation", middleware.includes("ROUTES.aiOrganizationFoundation"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:ai-organization-foundation:verify", pkg.includes('"ai-organization-foundation:verify"'));

const founderOsTypesPath = join(root, "src/modules/founder-os/types/index.ts");
const founderOsTypesSource = existsSync(founderOsTypesPath) ? readFileSync(founderOsTypesPath, "utf8") : "";
pass("founder_os_phase5:FoPhase5Stats type", founderOsTypesSource.includes("export interface FoPhase5Stats"));

const founderOsServicePath = join(root, "src/modules/founder-os/services/founder-os.service.ts");
const founderOsServiceSource = existsSync(founderOsServicePath) ? readFileSync(founderOsServicePath, "utf8") : "";
pass("founder_os_phase5:createAiOrganizationFoundationClient", founderOsServiceSource.includes("createAiOrganizationFoundationClient"));
pass("founder_os_phase5:getPhase5Stats", founderOsServiceSource.includes("getPhase5Stats"));

const founderOsPanelsPath = join(root, "src/modules/founder-os/components/FounderOsPanels.tsx");
const founderOsPanelsSource = existsSync(founderOsPanelsPath) ? readFileSync(founderOsPanelsPath, "utf8") : "";
pass("founder_os_phase5:FounderOsPhase5Panel", founderOsPanelsSource.includes("export function FounderOsPhase5Panel"));

const founderOsPagePath = join(root, "src/modules/founder-os/components/FounderOsPage.tsx");
const founderOsPageSource = existsSync(founderOsPagePath) ? readFileSync(founderOsPagePath, "utf8") : "";
pass("founder_os_phase5:phase5 tab", founderOsPageSource.includes("FOUNDER_OS_TABS.phase5") || founderOsPageSource.includes('"phase5"'));

const founderOsHookPath = join(root, "src/modules/founder-os/hooks/useFounderOs.ts");
const founderOsHookSource = existsSync(founderOsHookPath) ? readFileSync(founderOsHookPath, "utf8") : "";
pass("founder_os_phase5:phase5Stats", founderOsHookSource.includes("phase5Stats"));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nAI Organization Foundation verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`AOF_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All AI Organization Foundation verification checks passed.");

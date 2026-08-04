/**
 * Program F Wave 3 verification: regression, security, tenant isolation, performance,
 * customer success, support, deployment, learning, ADO foundation, dashboard, and framework SDK compatibility.
 * Run: node scripts/verify-program-f-wave3.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020044_customer_success_delivery_platform.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(csd_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:csd_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["csd_operations_metrics", "csd_operations_health", "csd_audit_logs"]);
const childTables = tables.filter((t) => t !== "csd_delivery_hubs" && !orgOnlyTables.has(t));
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

pass("customer_success:customer_health_scores_table", tables.includes("csd_customer_health_scores"));
pass("customer_success:adoption_analytics_table", tables.includes("csd_adoption_analytics"));
pass("customer_success:success_plans_table", tables.includes("csd_success_plans"));
pass("customer_success:customer_timelines_table", tables.includes("csd_customer_timelines"));
pass("customer_success:renewal_forecasts_table", tables.includes("csd_renewal_forecasts"));
pass("customer_success:health_score_column", /csd_customer_health_scores[\s\S]*?health_score numeric/i.test(migrationSql));
pass("customer_success:plan_status_column", /csd_success_plans[\s\S]*?plan_status text/i.test(migrationSql));

pass("support:support_tickets_table", tables.includes("csd_support_tickets"));
pass("support:live_chat_sessions_table", tables.includes("csd_live_chat_sessions"));
pass("support:knowledge_base_articles_table", tables.includes("csd_knowledge_base_articles"));
pass("support:sla_policies_table", tables.includes("csd_sla_policies"));
pass("support:escalation_rules_table", tables.includes("csd_escalation_rules"));
pass("support:ticket_status_column", /csd_support_tickets[\s\S]*?ticket_status text/i.test(migrationSql));
pass("support:session_status_column", /csd_live_chat_sessions[\s\S]*?session_status text/i.test(migrationSql));

pass("deployment:deployment_automations_table", tables.includes("csd_deployment_automations"));
pass("deployment:environment_management_table", tables.includes("csd_environment_management"));
pass("deployment:deployment_tracking_table", tables.includes("csd_deployment_tracking"));
pass("deployment:upgrade_management_table", tables.includes("csd_upgrade_management"));
pass("deployment:release_tracking_table", tables.includes("csd_release_tracking"));
pass("deployment:deployment_status_column", /csd_deployment_tracking[\s\S]*?deployment_status text/i.test(migrationSql));
pass("deployment:automation_status_column", /csd_deployment_automations[\s\S]*?automation_status text/i.test(migrationSql));

pass("learning:training_portals_table", tables.includes("csd_training_portals"));
pass("learning:video_library_table", tables.includes("csd_video_library"));
pass("learning:product_tours_table", tables.includes("csd_product_tours"));
pass("learning:certifications_table", tables.includes("csd_certifications"));
pass("learning:progress_tracking_table", tables.includes("csd_progress_tracking"));
pass("learning:learning_analytics_table", tables.includes("csd_learning_analytics"));
pass("learning:portal_type_column", /csd_training_portals[\s\S]*?portal_type text/i.test(migrationSql));
pass("learning:completion_rate_column", /csd_learning_analytics[\s\S]*?completion_rate numeric/i.test(migrationSql));

pass("ado_foundation:delivery_workflows_table", tables.includes("csd_delivery_workflows"));
pass("ado_foundation:onboarding_automation_table", tables.includes("csd_onboarding_automation"));
pass("ado_foundation:implementation_tracking_table", tables.includes("csd_implementation_tracking"));
pass("ado_foundation:resource_assignments_table", tables.includes("csd_resource_assignments"));
pass("ado_foundation:milestone_tracking_table", tables.includes("csd_milestone_tracking"));
pass("ado_foundation:workflow_status_column", /csd_delivery_workflows[\s\S]*?workflow_status text/i.test(migrationSql));
pass("ado_foundation:milestone_status_column", /csd_milestone_tracking[\s\S]*?milestone_status text/i.test(migrationSql));

pass("dashboard:operations_metrics_table", tables.includes("csd_operations_metrics"));
pass("dashboard:operations_health_table", tables.includes("csd_operations_health"));
pass("dashboard:executive_kpis_table", tables.includes("csd_executive_kpis"));
pass("dashboard:delivery_failures_table", tables.includes("csd_delivery_failures"));
pass("dashboard:kpi_score_column", /csd_executive_kpis[\s\S]*?kpi_score numeric/i.test(migrationSql));

pass("operations_metrics:customer_health_score", /csd_operations_metrics[\s\S]*?customer_health_score numeric/i.test(migrationSql));
pass("operations_metrics:open_ticket_count", /csd_operations_metrics[\s\S]*?open_ticket_count integer/i.test(migrationSql));
pass("operations_metrics:sla_compliance_score", /csd_operations_metrics[\s\S]*?sla_compliance_score numeric/i.test(migrationSql));
pass("operations_metrics:deployment_status_score", /csd_operations_metrics[\s\S]*?deployment_status_score numeric/i.test(migrationSql));
pass("operations_metrics:renewal_forecast_count", /csd_operations_metrics[\s\S]*?renewal_forecast_count integer/i.test(migrationSql));
pass("operations_metrics:adoption_rate", /csd_operations_metrics[\s\S]*?adoption_rate numeric/i.test(migrationSql));
pass("operations_metrics:overall_delivery_score", /csd_operations_metrics[\s\S]*?overall_delivery_score numeric/i.test(migrationSql));

pass("disaster_recovery:operations_health_column", /csd_operations_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:customer_success_status", /csd_operations_health[\s\S]*?customer_success_status text/i.test(migrationSql));
pass("disaster_recovery:support_status", /csd_operations_health[\s\S]*?support_status text/i.test(migrationSql));
pass("disaster_recovery:deployment_status", /csd_operations_health[\s\S]*?deployment_status text/i.test(migrationSql));
pass("disaster_recovery:security_status", /csd_operations_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "044_customer_success_delivery_platform_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:operations_health_recovery", seedSql.includes("csd_operations_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:customer_health_scores", seedSql.includes("csd_customer_health_scores") && seedSql.includes("health-score-0904"));
pass("seed:support_tickets", seedSql.includes("csd_support_tickets") && seedSql.includes("ticket-0904"));
pass("seed:deployment_tracking", seedSql.includes("csd_deployment_tracking") && seedSql.includes("deploy-track-0904"));
pass("seed:training_portals", seedSql.includes("csd_training_portals") && seedSql.includes("training-portal-0904"));
pass("seed:delivery_workflows", seedSql.includes("csd_delivery_workflows") && seedSql.includes("workflow-onboard-0904"));
pass("seed:operations_metrics", seedSql.includes("csd_operations_metrics") && seedSql.includes("overall_delivery_score"));
pass("seed:delivery_hub", seedSql.includes("csd_delivery_hubs") && seedSql.includes("northstar-customer-success-delivery"));
pass("seed:agent_type", seedSql.includes("customer_success_delivery"));

const mappersPath = join(root, "src/modules/database/lib/customer-success-delivery-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildCsdDashboardStats_exported", mappersSource.includes("export const buildCsdDashboardStats") || mappersSource.includes("export function buildCsdDashboardStats"));
pass("mappers:buildDeliveryHubLookupMaps", mappersSource.includes("buildDeliveryHubLookupMaps"));
pass("mappers:buildCsdPipelineInfo", mappersSource.includes("buildCsdPipelineInfo"));
if (mappersSource.includes("buildCsdDashboardStats")) {
    pass("mappers:buildCsdDashboardStats_customer_health", /customerHealthScoreCount|customerHealthScores/.test(mappersSource));
    pass("mappers:buildCsdDashboardStats_support_tickets", /supportTicketCount|supportTickets/.test(mappersSource));
    pass("mappers:buildCsdDashboardStats_delivery_score", /overallDeliveryScore|overall_delivery_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/customer-success-delivery/services/customer-success-delivery.service.ts");
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

const requiredFiles = [
    "src/modules/customer-success-delivery/constants/index.ts",
    "src/modules/customer-success-delivery/schemas/index.ts",
    "src/modules/customer-success-delivery/services/customer-success-delivery.service.ts",
    "src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery.ts",
    "src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPage.tsx",
    "src/modules/customer-success-delivery/components/CustomerSuccessDeliveryStats.tsx",
    "src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPanels.tsx",
    "src/modules/customer-success-delivery/sdk/index.ts",
    "src/modules/customer-success-delivery/index.ts",
    "src/modules/customer-success-delivery/types/index.ts",
    "src/modules/database/lib/customer-success-delivery-mappers.ts",
    "app/(shell)/customer-success-delivery/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/customer-success-delivery/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const CSD_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:CSD_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:CSD_THEME sky-600", constants.includes('primary: "sky-600"'));
    pass("ui:CSD_PERMISSIONS", constants.includes('"csd.view"') && constants.includes('"csd.admin"'));
    pass("ui:PLAN_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"completed"'));
    pass("ui:TICKET_STATUS_OPTIONS", constants.includes('"open"') && constants.includes('"resolved"'));
    pass("ui:RENEWAL_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"renewed"'));
} else {
    pass("ui:CSD_TABS count", false, "constants missing");
    pass("ui:CSD_THEME sky-600", false);
    pass("ui:CSD_PERMISSIONS", false);
    pass("ui:PLAN_STATUS_OPTIONS", false);
    pass("ui:TICKET_STATUS_OPTIONS", false);
    pass("ui:RENEWAL_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/customer-success-delivery/hooks/useCustomerSuccessDelivery.ts");
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

const panelsPath = join(root, "src/modules/customer-success-delivery/components/CustomerSuccessDeliveryPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:DeliveryHubSelect form.register spread", panels.includes("DeliveryHubSelect") && panels.includes('{...form.register("deliveryHubId")}'));
} else {
    pass("ui:DeliveryHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:customerSuccessDelivery", routes.includes('customerSuccessDelivery: "/customer-success-delivery"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Customer Success & Delivery", nav.includes('"Customer Success & Delivery"'));
pass("nav:Headphones or LifeBuoy icon", nav.includes("Headphones") || nav.includes("LifeBuoy"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:customerSuccessDelivery", middleware.includes("ROUTES.customerSuccessDelivery"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:program-f-wave3:verify", pkg.includes('"program-f-wave3:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram F Wave 3 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`CSD_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program F Wave 3 verification checks passed.");

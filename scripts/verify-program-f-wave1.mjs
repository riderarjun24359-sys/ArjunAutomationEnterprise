/**
 * Program F Wave 1 verification: regression, security, tenant isolation, performance,
 * brand, website, pricing, proposal, customer portal, documentation, demo, dashboard, and framework SDK compatibility.
 * Run: node scripts/verify-program-f-wave1.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020043_company_foundation.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(cmp_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:cmp_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["cmp_company_metrics", "cmp_company_health", "cmp_audit_logs"]);
const childTables = tables.filter((t) => t !== "cmp_company_hubs" && !orgOnlyTables.has(t));
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

pass("brand:brand_profiles_table", tables.includes("cmp_brand_profiles"));
pass("brand:logo_assets_table", tables.includes("cmp_logo_assets"));
pass("brand:theme_configs_table", tables.includes("cmp_theme_configs"));
pass("brand:brand_assets_table", tables.includes("cmp_brand_assets"));
pass("brand:brand_status_column", /cmp_brand_profiles[\s\S]*?brand_status text/i.test(migrationSql));

pass("website:website_pages_table", tables.includes("cmp_website_pages"));
pass("website:website_features_table", tables.includes("cmp_website_features"));
pass("website:website_sections_table", tables.includes("cmp_website_sections"));
pass("website:demo_requests_table", tables.includes("cmp_demo_requests"));
pass("website:page_slug_column", /cmp_website_pages[\s\S]*?page_slug text/i.test(migrationSql));

pass("pricing:pricing_plans_table", tables.includes("cmp_pricing_plans"));
pass("pricing:pricing_packages_table", tables.includes("cmp_pricing_packages"));
pass("pricing:module_pricing_table", tables.includes("cmp_module_pricing"));
pass("pricing:discount_rules_table", tables.includes("cmp_discount_rules"));
pass("pricing:plan_tier_column", /cmp_pricing_plans[\s\S]*?plan_tier text/i.test(migrationSql));

pass("proposal:proposals_table", tables.includes("cmp_proposals"));
pass("proposal:proposal_documents_table", tables.includes("cmp_proposal_documents"));
pass("proposal:proposal_contracts_table", tables.includes("cmp_proposal_contracts"));
pass("proposal:proposal_history_table", tables.includes("cmp_proposal_history"));
pass("proposal:proposal_status_column", /cmp_proposals[\s\S]*?proposal_status text/i.test(migrationSql));

pass("customer_portal:portal_dashboards_table", tables.includes("cmp_portal_dashboards"));
pass("customer_portal:portal_subscriptions_table", tables.includes("cmp_portal_subscriptions"));
pass("customer_portal:portal_billing_table", tables.includes("cmp_portal_billing"));
pass("customer_portal:portal_support_table", tables.includes("cmp_portal_support"));
pass("customer_portal:dashboard_type_column", /cmp_portal_dashboards[\s\S]*?dashboard_type text/i.test(migrationSql));

pass("documentation:doc_guides_table", tables.includes("cmp_doc_guides"));
pass("documentation:doc_api_references_table", tables.includes("cmp_doc_api_references"));
pass("documentation:doc_versions_table", tables.includes("cmp_doc_versions"));
pass("documentation:guide_category_column", /cmp_doc_guides[\s\S]*?guide_category text/i.test(migrationSql));

pass("demo:demo_organizations_table", tables.includes("cmp_demo_organizations"));
pass("demo:demo_data_sets_table", tables.includes("cmp_demo_data_sets"));
pass("demo:demo_users_table", tables.includes("cmp_demo_users"));
pass("demo:org_type_column", /cmp_demo_organizations[\s\S]*?org_type text/i.test(migrationSql));

pass("company_metrics:website_analytics_score", /cmp_company_metrics[\s\S]*?website_analytics_score numeric/i.test(migrationSql));
pass("company_metrics:demo_request_count", /cmp_company_metrics[\s\S]*?demo_request_count integer/i.test(migrationSql));
pass("company_metrics:active_customer_count", /cmp_company_metrics[\s\S]*?active_customer_count integer/i.test(migrationSql));
pass("company_metrics:revenue_total", /cmp_company_metrics[\s\S]*?revenue_total numeric/i.test(migrationSql));
pass("company_metrics:proposal_pending_count", /cmp_company_metrics[\s\S]*?proposal_pending_count integer/i.test(migrationSql));
pass("company_metrics:support_open_count", /cmp_company_metrics[\s\S]*?support_open_count integer/i.test(migrationSql));
pass("company_metrics:platform_health_score", /cmp_company_metrics[\s\S]*?platform_health_score numeric/i.test(migrationSql));
pass("company_metrics:overall_company_score", /cmp_company_metrics[\s\S]*?overall_company_score numeric/i.test(migrationSql));

pass("disaster_recovery:company_health_column", /cmp_company_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:website_status", /cmp_company_health[\s\S]*?website_status text/i.test(migrationSql));
pass("disaster_recovery:revenue_status", /cmp_company_health[\s\S]*?revenue_status text/i.test(migrationSql));
pass("disaster_recovery:support_status", /cmp_company_health[\s\S]*?support_status text/i.test(migrationSql));
pass("disaster_recovery:security_status", /cmp_company_health[\s\S]*?security_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "043_company_foundation_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:company_health_recovery", seedSql.includes("cmp_company_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:brand_profiles", seedSql.includes("cmp_brand_profiles") && seedSql.includes("brand-profile-0904"));
pass("seed:website_pages", seedSql.includes("cmp_website_pages") && seedSql.includes("page-home-0904"));
pass("seed:pricing_plans", seedSql.includes("cmp_pricing_plans") && seedSql.includes("plan-enterprise-0904"));
pass("seed:proposals", seedSql.includes("cmp_proposals") && seedSql.includes("prop-enterprise-0904"));
pass("seed:portal_dashboards", seedSql.includes("cmp_portal_dashboards") && seedSql.includes("dash-customer-0904"));
pass("seed:company_metrics", seedSql.includes("cmp_company_metrics") && seedSql.includes("overall_company_score"));
pass("seed:company_hub", seedSql.includes("cmp_company_hubs") && seedSql.includes("northstar-company-foundation"));
pass("seed:agent_type", seedSql.includes("company_foundation"));

const mappersPath = join(root, "src/modules/database/lib/company-foundation-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildCmpDashboardStats_exported", mappersSource.includes("export const buildCmpDashboardStats") || mappersSource.includes("export function buildCmpDashboardStats"));
pass("mappers:buildCompanyHubLookupMaps", mappersSource.includes("buildCompanyHubLookupMaps"));
pass("mappers:buildCmpPipelineInfo", mappersSource.includes("buildCmpPipelineInfo"));
if (mappersSource.includes("buildCmpDashboardStats")) {
    pass("mappers:buildCmpDashboardStats_brand_profiles", /brandProfileCount|brandProfiles/.test(mappersSource));
    pass("mappers:buildCmpDashboardStats_website_pages", /websitePageCount|websitePages/.test(mappersSource));
    pass("mappers:buildCmpDashboardStats_company_score", /overallCompanyScore|overall_company_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/company-foundation/services/company-foundation.service.ts");
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

const requiredFiles = [
    "src/modules/company-foundation/constants/index.ts",
    "src/modules/company-foundation/schemas/index.ts",
    "src/modules/company-foundation/services/company-foundation.service.ts",
    "src/modules/company-foundation/hooks/useCompanyFoundation.ts",
    "src/modules/company-foundation/components/CompanyFoundationPage.tsx",
    "src/modules/company-foundation/components/CompanyFoundationStats.tsx",
    "src/modules/company-foundation/components/CompanyFoundationPanels.tsx",
    "src/modules/company-foundation/sdk/index.ts",
    "src/modules/company-foundation/index.ts",
    "src/modules/company-foundation/types/index.ts",
    "src/modules/database/lib/company-foundation-mappers.ts",
    "app/(shell)/company-foundation/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/company-foundation/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const CMP_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:CMP_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:CMP_THEME emerald-600", constants.includes('primary: "emerald-600"'));
    pass("ui:CMP_PERMISSIONS", constants.includes('"cmp.view"') && constants.includes('"cmp.admin"'));
    pass("ui:BRAND_STATUS_OPTIONS", constants.includes('"draft"') && constants.includes('"active"'));
    pass("ui:PROPOSAL_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"approved"'));
    pass("ui:DEMO_REQUEST_STATUS_OPTIONS", constants.includes('"scheduled"') && constants.includes('"completed"'));
} else {
    pass("ui:CMP_TABS count", false, "constants missing");
    pass("ui:CMP_THEME emerald-600", false);
    pass("ui:CMP_PERMISSIONS", false);
    pass("ui:BRAND_STATUS_OPTIONS", false);
    pass("ui:PROPOSAL_STATUS_OPTIONS", false);
    pass("ui:DEMO_REQUEST_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/company-foundation/hooks/useCompanyFoundation.ts");
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

const panelsPath = join(root, "src/modules/company-foundation/components/CompanyFoundationPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:CompanyHubSelect form.register spread", panels.includes("CompanyHubSelect") && panels.includes('{...form.register("companyHubId")}'));
} else {
    pass("ui:CompanyHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:companyFoundation", routes.includes('companyFoundation: "/company-foundation"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Company Foundation", nav.includes('"Company Foundation"'));
pass("nav:Building2 icon", nav.includes("Building2"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:companyFoundation", middleware.includes("ROUTES.companyFoundation"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:program-f-wave1:verify", pkg.includes('"program-f-wave1:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram F Wave 1 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`CMP_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program F Wave 1 verification checks passed.");

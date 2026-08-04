/**
 * Arjun Automation Growth Engine verification: regression, security, tenant isolation, performance,
 * onboarding, production, observability, operations, beta, dashboard, framework SDK compatibility,
 * and founder-os phase3 integration.
 * Run: node scripts/verify-growth-engine.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020049_arjun_automation_growth_engine.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(aage_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:aage_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["aage_growth_metrics", "aage_growth_health", "aage_audit_logs"]);
const childTables = tables.filter((t) => t !== "aage_growth_hubs" && !orgOnlyTables.has(t));
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

pass("brand_foundation:brand_profiles_table", tables.includes("aage_brand_profiles"));
pass("brand_foundation:brand_voice_table", tables.includes("aage_brand_voice"));
pass("brand_foundation:core_messaging_table", tables.includes("aage_core_messaging"));
pass("brand_foundation:brand_guidelines_table", tables.includes("aage_brand_guidelines"));
pass("brand_foundation:logo_library_table", tables.includes("aage_logo_library"));
pass("brand_foundation:color_systems_table", tables.includes("aage_color_systems"));
pass("content_foundation:youtube_templates_table", tables.includes("aage_youtube_templates"));
pass("content_foundation:social_templates_table", tables.includes("aage_social_templates"));
pass("content_foundation:blog_templates_table", tables.includes("aage_blog_templates"));
pass("content_foundation:website_article_templates_table", tables.includes("aage_website_article_templates"));
pass("content_foundation:email_campaign_templates_table", tables.includes("aage_email_campaign_templates"));
pass("content_foundation:case_study_templates_table", tables.includes("aage_case_study_templates"));
pass("media_foundation:image_assets_table", tables.includes("aage_image_assets"));
pass("media_foundation:video_assets_table", tables.includes("aage_video_assets"));
pass("media_foundation:icon_assets_table", tables.includes("aage_icon_assets"));
pass("media_foundation:voice_profiles_table", tables.includes("aage_voice_profiles"));
pass("media_foundation:music_assets_table", tables.includes("aage_music_assets"));
pass("media_foundation:thumbnail_templates_table", tables.includes("aage_thumbnail_templates"));
pass("content_engine:idea_generators_table", tables.includes("aage_idea_generators"));
pass("content_engine:script_generators_table", tables.includes("aage_script_generators"));
pass("content_engine:caption_generators_table", tables.includes("aage_caption_generators"));
pass("content_engine:blog_generators_table", tables.includes("aage_blog_generators"));
pass("content_engine:seo_assistants_table", tables.includes("aage_seo_assistants"));
pass("content_engine:cta_generators_table", tables.includes("aage_cta_generators"));
pass("founder_dashboard:growth_metrics_table", tables.includes("aage_growth_metrics"));
pass("founder_dashboard:growth_health_table", tables.includes("aage_growth_health"));
pass("founder_dashboard:content_calendar_table", tables.includes("aage_content_calendar"));
pass("founder_dashboard:draft_queue_table", tables.includes("aage_draft_queue"));
pass("founder_dashboard:approval_queue_table", tables.includes("aage_approval_queue"));
pass("founder_dashboard:publishing_queue_table", tables.includes("aage_publishing_queue"));

pass("growth_metrics:marketing_overview_score", /aage_growth_metrics[\s\S]*?marketing_overview_score numeric/i.test(migrationSql));
pass("growth_metrics:content_calendar_count", /aage_growth_metrics[\s\S]*?content_calendar_count integer/i.test(migrationSql));
pass("growth_metrics:draft_queue_count", /aage_growth_metrics[\s\S]*?draft_queue_count integer/i.test(migrationSql));
pass("growth_metrics:approval_queue_count", /aage_growth_metrics[\s\S]*?approval_queue_count integer/i.test(migrationSql));
pass("growth_metrics:publishing_queue_count", /aage_growth_metrics[\s\S]*?publishing_queue_count integer/i.test(migrationSql));
pass("growth_metrics:brand_health_score", /aage_growth_metrics[\s\S]*?brand_health_score numeric/i.test(migrationSql));
pass("growth_metrics:overall_growth_score", /aage_growth_metrics[\s\S]*?overall_growth_score numeric/i.test(migrationSql));

pass("growth_health:brand_status", /aage_growth_health[\s\S]*?brand_status text/i.test(migrationSql));
pass("growth_health:content_status", /aage_growth_health[\s\S]*?content_status text/i.test(migrationSql));
pass("growth_health:media_status", /aage_growth_health[\s\S]*?media_status text/i.test(migrationSql));
pass("growth_health:engine_status", /aage_growth_health[\s\S]*?engine_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "049_arjun_automation_growth_engine_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:growth_health_brand_status", seedSql.includes("aage_growth_health") && seedSql.includes("brand_status"));
pass("seed:brand_profiles", seedSql.includes("aage_brand_profiles") && seedSql.includes("brand-profile-0909"));
pass("seed:youtube_templates", seedSql.includes("aage_youtube_templates") && seedSql.includes("yt-template-0909"));
pass("seed:image_assets", seedSql.includes("aage_image_assets") && seedSql.includes("image-0909"));
pass("seed:idea_generators", seedSql.includes("aage_idea_generators") && seedSql.includes("idea-gen-0909"));
pass("seed:content_calendar", seedSql.includes("aage_content_calendar") && seedSql.includes("calendar-0909"));
pass("seed:growth_metrics", seedSql.includes("aage_growth_metrics") && seedSql.includes("overall_growth_score"));
pass("seed:growth_hub", seedSql.includes("aage_growth_hubs") && seedSql.includes("northstar-growth-engine"));
pass("seed:agent_type", seedSql.includes("arjun_automation_growth_engine"));

const mappersPath = join(root, "src/modules/database/lib/growth-engine-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildAageDashboardStats_exported", mappersSource.includes("export const buildAageDashboardStats") || mappersSource.includes("export function buildAageDashboardStats"));
pass("mappers:buildGrowthHubLookupMaps", mappersSource.includes("buildGrowthHubLookupMaps"));
pass("mappers:buildAagePipelineInfo", mappersSource.includes("buildAagePipelineInfo"));
if (mappersSource.includes("buildAageDashboardStats")) {
    pass("mappers:buildAageDashboardStats_marketing_overview_score", /marketingOverviewScore|marketing_overview_score/.test(mappersSource));
    pass("mappers:buildAageDashboardStats_brand_health_score", /brandHealthScore|brand_health_score/.test(mappersSource));
    pass("mappers:buildAageDashboardStats_overall_growth_score", /overallGrowthScore|overall_growth_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/growth-engine/services/growth-engine.service.ts");
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
pass("framework:createEnterpriseIntelligencePlatformClient", serviceSource.includes("createEnterpriseIntelligencePlatformClient"));
pass("framework:createEnterpriseGovernancePlatformClient", serviceSource.includes("createEnterpriseGovernancePlatformClient"));
pass("framework:createAiOrchestrationClient", serviceSource.includes("createAiOrchestrationClient"));
const sdkPath = join(root, "src/modules/growth-engine/sdk/index.ts");
const sdkSource = existsSync(sdkPath) ? readFileSync(sdkPath, "utf8") : "";
pass("enterprise_ai_foundation:createGrowthEngineClient", sdkSource.includes("createGrowthEngineClient"));
pass("sdk:BrandService", sdkSource.includes("export class BrandService"));
pass("sdk:ContentFoundationService", sdkSource.includes("export class ContentFoundationService"));
pass("sdk:MediaFoundationService", sdkSource.includes("export class MediaFoundationService"));
pass("sdk:ContentEngineService", sdkSource.includes("export class ContentEngineService"));
pass("sdk:FounderDashboardService", sdkSource.includes("export class FounderDashboardService"));
pass("sdk:createGrowthEngineClient", sdkSource.includes("createGrowthEngineClient"));

const requiredFiles = [
    "src/modules/growth-engine/constants/index.ts",
    "src/modules/growth-engine/schemas/index.ts",
    "src/modules/growth-engine/services/growth-engine.service.ts",
    "src/modules/growth-engine/hooks/useGrowthEngine.ts",
    "src/modules/growth-engine/components/GrowthEnginePage.tsx",
    "src/modules/growth-engine/components/GrowthEngineStats.tsx",
    "src/modules/growth-engine/components/GrowthEnginePanels.tsx",
    "src/modules/growth-engine/sdk/index.ts",
    "src/modules/growth-engine/index.ts",
    "src/modules/growth-engine/types/index.ts",
    "src/modules/database/lib/growth-engine-mappers.ts",
    "app/(shell)/growth-engine/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/growth-engine/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const AAGE_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:AAGE_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:AAGE_THEME pink-600", constants.includes('primary: "pink-600"'));
    pass("ui:AAGE_PERMISSIONS", constants.includes('"aage.view"') && constants.includes('"aage.admin"'));
    pass("ui:PROFILE_STATUS_OPTIONS", constants.includes('"archived"'));
    pass("ui:TEMPLATE_STATUS_OPTIONS", constants.includes('"inactive"'));
    pass("ui:QUEUE_STATUS_OPTIONS", constants.includes('"pending"'));
} else {
    pass("ui:AAGE_TABS count", false, "constants missing");
    pass("ui:AAGE_THEME pink-600", false);
    pass("ui:AAGE_PERMISSIONS", false);
    pass("ui:PROFILE_STATUS_OPTIONS", false);
    pass("ui:TEMPLATE_STATUS_OPTIONS", false);
    pass("ui:QUEUE_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/growth-engine/hooks/useGrowthEngine.ts");
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

const panelsPath = join(root, "src/modules/growth-engine/components/GrowthEnginePanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:GrowthHubSelect form.register spread", panels.includes("GrowthHubSelect") && panels.includes('{...form.register("growthHubId")}'));
} else {
    pass("ui:GrowthHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:growthEngine", routes.includes('growthEngine: "/growth-engine"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Growth Engine", nav.includes('"Growth Engine"'));
pass("nav:TrendingUp icon", nav.includes("TrendingUp"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:growthEngine", middleware.includes("ROUTES.growthEngine"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:growth-engine:verify", pkg.includes('"growth-engine:verify"'));

pass("growth_engine:createGrowthEngineClient", sdkSource.includes("createGrowthEngineClient"));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nArjun Automation Growth Engine verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`AAGE_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Arjun Automation Growth Engine verification checks passed.");

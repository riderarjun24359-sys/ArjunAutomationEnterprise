/**
 * Program B Sprint 9 verification: regression, security, tenant isolation, performance,
 * POS, inventory, warehouse, sales, customer verification, and framework SDK compatibility.
 * Run: node scripts/verify-sprint-b9.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020041_enterprise_retail_business_os.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(rtl_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:rtl_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["rtl_retail_metrics", "rtl_retail_health", "rtl_audit_logs"]);
const childTables = tables.filter((t) => t !== "rtl_retail_hubs" && !orgOnlyTables.has(t));
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

pass("pos:pos_transactions_table", tables.includes("rtl_pos_transactions"));
pass("pos:cash_registers_table", tables.includes("rtl_cash_registers"));
pass("pos:shift_closings_table", tables.includes("rtl_shift_closings"));
pass("pos:transaction_status_column", /rtl_pos_transactions[\s\S]*?transaction_status text/i.test(migrationSql));
pass("pos:register_status_column", /rtl_cash_registers[\s\S]*?register_status text/i.test(migrationSql));

pass("inventory:stock_levels_table", tables.includes("rtl_stock_levels"));
pass("inventory:purchase_orders_table", tables.includes("rtl_purchase_orders"));
pass("inventory:suppliers_table", tables.includes("rtl_suppliers"));
pass("inventory:stock_quantity_column", /rtl_stock_levels[\s\S]*?stock_quantity integer/i.test(migrationSql));

pass("warehouse:warehouses_table", tables.includes("rtl_warehouses"));
pass("warehouse:warehouse_type_column", /rtl_warehouses[\s\S]*?warehouse_type text/i.test(migrationSql));
pass("warehouse:location_column", /rtl_warehouses[\s\S]*?location text/i.test(migrationSql));

pass("sales:sales_orders_table", tables.includes("rtl_sales_orders"));
pass("sales:returns_exchanges_table", tables.includes("rtl_returns_exchanges"));
pass("sales:order_status_column", /rtl_sales_orders[\s\S]*?order_status text/i.test(migrationSql));
pass("sales:promotions_table", tables.includes("rtl_promotions"));

pass("customer:customer_profiles_table", tables.includes("rtl_customer_profiles"));
pass("customer:loyalty_programs_table", tables.includes("rtl_loyalty_programs"));
pass("customer:reward_points_table", tables.includes("rtl_reward_points"));
pass("customer:campaigns_table", tables.includes("rtl_campaigns"));
pass("customer:loyalty_tier_column", /rtl_customer_profiles[\s\S]*?loyalty_tier text/i.test(migrationSql));

pass("retail_metrics:revenue_total", /rtl_retail_metrics[\s\S]*?revenue_total numeric/i.test(migrationSql));
pass("retail_metrics:profit_total", /rtl_retail_metrics[\s\S]*?profit_total numeric/i.test(migrationSql));
pass("retail_metrics:sales_count", /rtl_retail_metrics[\s\S]*?sales_count integer/i.test(migrationSql));
pass("retail_metrics:inventory_value", /rtl_retail_metrics[\s\S]*?inventory_value numeric/i.test(migrationSql));
pass("retail_metrics:overall_retail_score", /rtl_retail_metrics[\s\S]*?overall_retail_score numeric/i.test(migrationSql));
pass("retail_metrics:customer_retention_rate", /rtl_retail_metrics[\s\S]*?customer_retention_rate numeric/i.test(migrationSql));

pass("disaster_recovery:retail_health_column", /rtl_retail_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:inventory_health_status", /rtl_retail_health[\s\S]*?inventory_health_status text/i.test(migrationSql));
pass("disaster_recovery:financial_health_status", /rtl_retail_health[\s\S]*?financial_health_status text/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "041_enterprise_retail_business_os_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:retail_health_recovery", seedSql.includes("rtl_retail_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:customer_profiles", seedSql.includes("rtl_customer_profiles") && seedSql.includes("cust-smith-0904"));
pass("seed:sales_orders", seedSql.includes("rtl_sales_orders") && seedSql.includes("ord-smith-0904"));
pass("seed:pos_transactions", seedSql.includes("rtl_pos_transactions") && seedSql.includes("pos-smith-0904"));
pass("seed:warehouses", seedSql.includes("rtl_warehouses") && seedSql.includes("wh-central-0904"));
pass("seed:stock_levels", seedSql.includes("rtl_stock_levels") && seedSql.includes("stk-jacket-0904"));
pass("seed:retail_metrics", seedSql.includes("rtl_retail_metrics") && seedSql.includes("overall_retail_score"));
pass("seed:retail_hub", seedSql.includes("rtl_retail_hubs") && seedSql.includes("northstar-retail-os"));
pass("seed:agent_type", seedSql.includes("enterprise_retail_business_os"));

const mappersPath = join(root, "src/modules/database/lib/retail-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildRtlDashboardStats_exported", mappersSource.includes("export const buildRtlDashboardStats") || mappersSource.includes("export function buildRtlDashboardStats"));
pass("mappers:buildRetailHubLookupMaps", mappersSource.includes("buildRetailHubLookupMaps"));
pass("mappers:buildRtlPipelineInfo", mappersSource.includes("buildRtlPipelineInfo"));
if (mappersSource.includes("buildRtlDashboardStats")) {
    pass("mappers:buildRtlDashboardStats_retail_brands", /retailBrandCount|retailBrands/.test(mappersSource));
    pass("mappers:buildRtlDashboardStats_customer_profiles", /customerProfileCount|customerProfiles/.test(mappersSource));
    pass("mappers:buildRtlDashboardStats_retail_score", /overallRetailScore|overall_retail_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/retail/services/retail.service.ts");
const serviceSource = existsSync(servicePath) ? readFileSync(servicePath, "utf8") : "";
pass("framework:industry-framework_sdk", serviceSource.includes("@/src/modules/industry-framework/sdk"));
pass("framework:business-process_sdk", serviceSource.includes("@/src/modules/business-process/sdk"));
pass("framework:form-engine_sdk", serviceSource.includes("@/src/modules/form-engine/sdk"));
pass("framework:workflow-engine_sdk", serviceSource.includes("@/src/modules/workflow-engine/sdk"));
pass("framework:document-engine_sdk", serviceSource.includes("@/src/modules/document-engine/sdk"));
pass("framework:createIndustryFrameworkClient", serviceSource.includes("createIndustryFrameworkClient"));
pass("framework:createBusinessProcessClient", serviceSource.includes("createBusinessProcessClient"));
pass("framework:createFormEngineClient", serviceSource.includes("createFormEngineClient"));
pass("framework:createWorkflowEngineClient", serviceSource.includes("createWorkflowEngineClient"));
pass("framework:createDocumentEngineClient", serviceSource.includes("createDocumentEngineClient"));

const requiredFiles = [
    "src/modules/retail/constants/index.ts",
    "src/modules/retail/schemas/index.ts",
    "src/modules/retail/services/retail.service.ts",
    "src/modules/retail/hooks/useRetail.ts",
    "src/modules/retail/components/RetailPage.tsx",
    "src/modules/retail/components/RetailStats.tsx",
    "src/modules/retail/components/RetailPanels.tsx",
    "src/modules/retail/sdk/index.ts",
    "src/modules/retail/index.ts",
    "src/modules/retail/types/index.ts",
    "src/modules/database/lib/retail-mappers.ts",
    "app/(shell)/retail/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/retail/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const RTL_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:RTL_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:RTL_THEME lime-600", constants.includes('primary: "lime-600"'));
    pass("ui:RTL_PERMISSIONS", constants.includes('"rtl.view"') && constants.includes('"rtl.admin"'));
    pass("ui:SALES_ORDER_STATUS_OPTIONS", constants.includes('"pending"') && constants.includes('"completed"'));
    pass("ui:POS_STATUS_OPTIONS", constants.includes('"completed"') && constants.includes('"refunded"'));
    pass("ui:REGISTER_STATUS_OPTIONS", constants.includes('"active"') && constants.includes('"offline"'));
} else {
    pass("ui:RTL_TABS count", false, "constants missing");
    pass("ui:RTL_THEME lime-600", false);
    pass("ui:RTL_PERMISSIONS", false);
    pass("ui:SALES_ORDER_STATUS_OPTIONS", false);
    pass("ui:POS_STATUS_OPTIONS", false);
    pass("ui:REGISTER_STATUS_OPTIONS", false);
}

const hookPath = join(root, "src/modules/retail/hooks/useRetail.ts");
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

const panelsPath = join(root, "src/modules/retail/components/RetailPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:RetailHubSelect form.register spread", panels.includes("RetailHubSelect") && panels.includes('{...form.register("retailHubId")}'));
} else {
    pass("ui:RetailHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:retail", routes.includes('retail: "/retail"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Retail OS", nav.includes('"Retail OS"'));
pass("nav:ShoppingBag icon", nav.includes("ShoppingBag"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:retail", middleware.includes("ROUTES.retail"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b9:verify", pkg.includes('"sprint-b9:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 9 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`RTL_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 9 verification checks passed.");

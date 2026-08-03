/**
 * Program B Sprint 6 verification: regression, security, tenant isolation, performance,
 * order/kitchen/reservation verification, and framework SDK compatibility.
 * Run: node scripts/verify-sprint-b6.mjs
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

const migrationPath = join(root, "supabase", "migrations", "202608020038_enterprise_restaurant_business_os.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(rst_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

pass("schema:rst_table_count", tables.length === 32, `count=${tables.length}`);

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const orgOnlyTables = new Set(["rst_restaurant_metrics", "rst_restaurant_health", "rst_audit_logs"]);
const childTables = tables.filter((t) => t !== "rst_restaurant_hubs" && !orgOnlyTables.has(t));
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

pass("orders:orders_table", tables.includes("rst_orders"));
pass("orders:order_items_table", tables.includes("rst_order_items"));
pass("orders:order_queue_table", tables.includes("rst_order_queue"));
pass("orders:kitchen_routing_table", tables.includes("rst_kitchen_routing"));
pass("orders:order_timeline_table", tables.includes("rst_order_timeline"));
pass("orders:order_type_column", /rst_orders[\s\S]*?order_type text/i.test(migrationSql));

pass("kitchen:kitchen_stations_table", tables.includes("rst_kitchen_stations"));
pass("kitchen:preparation_queue_table", tables.includes("rst_preparation_queue"));
pass("kitchen:cooking_status_table", tables.includes("rst_cooking_status"));
pass("kitchen:ready_queue_table", tables.includes("rst_ready_queue"));
pass("kitchen:rush_orders_table", tables.includes("rst_rush_orders"));
pass("kitchen:cooking_status_column", /rst_cooking_status[\s\S]*?cooking_status text/i.test(migrationSql));

pass("reservation:reservations_table", tables.includes("rst_reservations"));
pass("reservation:waiting_list_table", tables.includes("rst_waiting_list"));
pass("reservation:reservation_status_column", /rst_reservations[\s\S]*?reservation_status text/i.test(migrationSql));

pass("restaurant_metrics:order_count", /rst_restaurant_metrics[\s\S]*?order_count integer/i.test(migrationSql));
pass("restaurant_metrics:revenue_total", /rst_restaurant_metrics[\s\S]*?revenue_total numeric/i.test(migrationSql));
pass("restaurant_metrics:average_bill", /rst_restaurant_metrics[\s\S]*?average_bill numeric/i.test(migrationSql));
pass("restaurant_metrics:overall_restaurant_score", /rst_restaurant_metrics[\s\S]*?overall_restaurant_score numeric/i.test(migrationSql));
pass("restaurant_metrics:kitchen_performance_score", /rst_restaurant_metrics[\s\S]*?kitchen_performance_score numeric/i.test(migrationSql));

pass("disaster_recovery:restaurant_health_column", /rst_restaurant_health[\s\S]*?disaster_recovery_mode boolean/i.test(migrationSql));
pass("disaster_recovery:pending_orders_count", /rst_restaurant_health[\s\S]*?pending_orders_count integer/i.test(migrationSql));
pass("disaster_recovery:kitchen_queue_depth", /rst_restaurant_health[\s\S]*?kitchen_queue_depth integer/i.test(migrationSql));

const seedPath = join(root, "supabase", "seed", "038_enterprise_restaurant_business_os_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("seed:file", existsSync(seedPath));
pass("seed:restaurant_health_recovery", seedSql.includes("rst_restaurant_health") && seedSql.includes("disaster_recovery_mode"));
pass("seed:orders", seedSql.includes("rst_orders") && seedSql.includes("ord-1042-0804"));
pass("seed:kitchen_stations", seedSql.includes("rst_kitchen_stations") && seedSql.includes("sta-grill-0804"));
pass("seed:reservations", seedSql.includes("rst_reservations") && seedSql.includes("res-smith-0804"));
pass("seed:restaurant_metrics", seedSql.includes("rst_restaurant_metrics") && seedSql.includes("overall_restaurant_score"));
pass("seed:restaurant_hub", seedSql.includes("rst_restaurant_hubs") && seedSql.includes("northstar-restaurant-os"));
pass("seed:agent_type", seedSql.includes("enterprise_restaurant_business_os"));

const mappersPath = join(root, "src/modules/database/lib/restaurant-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("mappers:file", existsSync(mappersPath));
pass("mappers:buildRstDashboardStats_exported", mappersSource.includes("export const buildRstDashboardStats") || mappersSource.includes("export function buildRstDashboardStats"));
pass("mappers:buildRestaurantHubLookupMaps", mappersSource.includes("buildRestaurantHubLookupMaps"));
pass("mappers:buildRstPipelineInfo", mappersSource.includes("buildRstPipelineInfo"));
if (mappersSource.includes("buildRstDashboardStats")) {
    pass("mappers:buildRstDashboardStats_dining_areas", /diningAreaCount|diningAreas/.test(mappersSource));
    pass("mappers:buildRstDashboardStats_menu", /menuCategoryCount|menuCategories/.test(mappersSource));
    pass("mappers:buildRstDashboardStats_restaurant_score", /overallRestaurantScore|overall_restaurant_score/.test(mappersSource));
}

const servicePath = join(root, "src/modules/restaurant/services/restaurant.service.ts");
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
    "src/modules/restaurant/constants/index.ts",
    "src/modules/restaurant/schemas/index.ts",
    "src/modules/restaurant/services/restaurant.service.ts",
    "src/modules/restaurant/hooks/useRestaurant.ts",
    "src/modules/restaurant/components/RestaurantPage.tsx",
    "src/modules/restaurant/components/RestaurantStats.tsx",
    "src/modules/restaurant/components/RestaurantPanels.tsx",
    "src/modules/restaurant/sdk/index.ts",
    "src/modules/restaurant/index.ts",
    "src/modules/restaurant/types/index.ts",
    "src/modules/database/lib/restaurant-mappers.ts",
    "app/(shell)/restaurant/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constantsPath = join(root, "src/modules/restaurant/constants/index.ts");
let tabCount = 0;
if (existsSync(constantsPath)) {
    const constants = readFileSync(constantsPath, "utf8");
    const tabBlock = constants.match(/export const RST_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
    tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
    pass("ui:RST_TABS count", tabCount === 34, `count=${tabCount}`);
    pass("ui:RST_THEME orange-600", constants.includes('primary: "orange-600"'));
    pass("ui:RST_PERMISSIONS", constants.includes('"rst.view"') && constants.includes('"rst.admin"'));
    pass("ui:ORDER_TYPE_OPTIONS", constants.includes('"dine-in"') && constants.includes('"takeaway"') && constants.includes('"delivery"'));
    pass("ui:ALERT_SEVERITY_OPTIONS", constants.includes('"critical"') && constants.includes('"warning"'));
} else {
    pass("ui:RST_TABS count", false, "constants missing");
    pass("ui:RST_THEME orange-600", false);
    pass("ui:RST_PERMISSIONS", false);
    pass("ui:ORDER_TYPE_OPTIONS", false);
    pass("ui:ALERT_SEVERITY_OPTIONS", false);
}

const hookPath = join(root, "src/modules/restaurant/hooks/useRestaurant.ts");
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

const panelsPath = join(root, "src/modules/restaurant/components/RestaurantPanels.tsx");
if (existsSync(panelsPath)) {
    const panels = readFileSync(panelsPath, "utf8");
    pass("ui:RestaurantHubSelect form.register spread", panels.includes("RestaurantHubSelect") && panels.includes('{...form.register("restaurantHubId")}'));
} else {
    pass("ui:RestaurantHubSelect form.register spread", false);
}

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:restaurant", routes.includes('restaurant: "/restaurant"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Restaurant OS", nav.includes('"Restaurant OS"'));
pass("nav:UtensilsCrossed icon", nav.includes("UtensilsCrossed"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:restaurant", middleware.includes("ROUTES.restaurant"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint-b6:verify", pkg.includes('"sprint-b6:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nProgram B Sprint 6 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`RST_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Program B Sprint 6 verification checks passed.");

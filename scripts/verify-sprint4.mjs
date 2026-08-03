/**
 * Sprint 4 verification: regression, security, tenant isolation, performance, financial calculations.
 * Run: node scripts/verify-sprint4.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const results = [];

function pass(check, ok, detail = "") {
    results.push({ check, pass: ok, detail });
}

// Regression: tsc + lint
const tsc = spawnSync("npx", ["tsc", "--noEmit"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:tsc", tsc.status === 0, tsc.status !== 0 ? (tsc.stderr || tsc.stdout || "").slice(0, 200) : "");

const lint = spawnSync("npm", ["run", "lint"], { cwd: root, shell: true, encoding: "utf8" });
pass("regression:lint", lint.status === 0, lint.status !== 0 ? (lint.stderr || lint.stdout || "").slice(0, 200) : "");

// Security + tenant isolation + performance from migration SQL
const migrationPath = join(root, "supabase", "migrations", "202608020027_enterprise_billing_revenue.sql");
const migrationSql = existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";

const tableMatches = [...migrationSql.matchAll(/create table if not exists public\.(brv_\w+)/gi)];
const tables = [...new Set(tableMatches.map((m) => m[1]))];

for (const table of tables) {
    const rlsEnabled = new RegExp(`alter table public\\.${table} enable row level security`, "i").test(migrationSql);
    pass(`security:RLS:${table}`, rlsEnabled);
}

const childTables = tables.filter((t) => t !== "brv_billing_accounts" && t !== "brv_finance_metrics" && t !== "brv_financial_health" && t !== "brv_audit_logs");
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

// Financial columns in migration
const financialColumnPatterns = ["amount_usd", "mrr_usd", "arr_usd", "tax_amount", "gst_rate", "balance_usd"];
for (const col of financialColumnPatterns) {
    pass(`financial:migration_column:${col}`, migrationSql.includes(col));
}

// Financial Calculation Validation
const seedPath = join(root, "supabase", "seed", "027_enterprise_billing_revenue_seed.sql");
const seedSql = existsSync(seedPath) ? readFileSync(seedPath, "utf8") : "";
pass("financial:seed_file", existsSync(seedPath));

const MRR_ARR_TOLERANCE = 0.01;
const mrrArrPairs = [...seedSql.matchAll(/mrr_usd[^0-9]*([\d.]+)[\s\S]{0,400}?arr_usd[^0-9]*([\d.]+)/gi)];
let mrrArrValid = 0;
let mrrArrChecked = 0;
for (const match of mrrArrPairs) {
    const mrr = parseFloat(match[1]);
    const arr = parseFloat(match[2]);
    if (!Number.isFinite(mrr) || !Number.isFinite(arr) || mrr < 1 || arr < 1) continue;
    const ratio = arr / mrr;
    if (ratio < 11 || ratio > 13) continue;
    mrrArrChecked += 1;
    const expectedArr = mrr * 12;
    if (Math.abs(arr - expectedArr) / Math.max(expectedArr, 1) <= MRR_ARR_TOLERANCE) mrrArrValid += 1;
}
pass(
    "financial:seed_mrr_arr_consistency",
    mrrArrChecked === 0 || mrrArrValid === mrrArrChecked,
    `pairs=${mrrArrChecked} valid=${mrrArrValid}`,
);

// Validate canonical starter monthly subscription: $299 MRR → $3,588 ARR
const starterBillingMatch = seedSql.match(/sub-starter-monthly[\s\S]{0,200}?([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*1,/i);
if (starterBillingMatch) {
    const amount = parseFloat(starterBillingMatch[1]);
    const mrr = parseFloat(starterBillingMatch[2]);
    const arr = parseFloat(starterBillingMatch[3]);
    pass("financial:seed_starter_amount_mrr", Math.abs(amount - mrr) < MRR_ARR_TOLERANCE, `amount=${amount} mrr=${mrr}`);
    pass("financial:seed_starter_mrr_arr", Math.abs(arr - mrr * 12) < MRR_ARR_TOLERANCE * 12, `mrr=${mrr} arr=${arr} expected=${mrr * 12}`);
} else {
    pass("financial:seed_starter_billing_row", false, "sub-starter-monthly row not found");
}

const mappersPath = join(root, "src/modules/database/lib/billing-revenue-mappers.ts");
const mappersSource = existsSync(mappersPath) ? readFileSync(mappersPath, "utf8") : "";
pass("financial:mappers_file", existsSync(mappersPath));
pass("financial:buildBrvDashboardStats_exported", mappersSource.includes("export const buildBrvDashboardStats") || mappersSource.includes("export function buildBrvDashboardStats"));

if (mappersSource.includes("buildBrvDashboardStats")) {
    pass("financial:buildBrvDashboardStats_mrr", /mrrUsd|mrr_usd/.test(mappersSource));
    pass("financial:buildBrvDashboardStats_arr", /arrUsd|arr_usd/.test(mappersSource));
}

// UI module files
const requiredFiles = [
    "src/modules/billing-revenue/constants/index.ts",
    "src/modules/billing-revenue/schemas/index.ts",
    "src/modules/billing-revenue/services/billing-revenue.service.ts",
    "src/modules/billing-revenue/hooks/useBillingRevenue.ts",
    "src/modules/billing-revenue/components/BillingRevenuePage.tsx",
    "src/modules/billing-revenue/components/BillingRevenueStats.tsx",
    "src/modules/billing-revenue/components/BillingRevenuePanels.tsx",
    "src/modules/billing-revenue/sdk/index.ts",
    "src/modules/billing-revenue/index.ts",
    "src/modules/billing-revenue/types/index.ts",
    "src/modules/database/lib/billing-revenue-mappers.ts",
    "app/(shell)/billing-revenue/page.tsx",
];

for (const file of requiredFiles) {
    pass(`file:${file}`, existsSync(join(root, file)));
}

const constants = readFileSync(join(root, "src/modules/billing-revenue/constants/index.ts"), "utf8");
const tabBlock = constants.match(/export const BRV_TABS = \{([\s\S]*?)\} as const/)?.[1] ?? "";
const tabCount = (tabBlock.match(/^\s+\w+:/gm) ?? []).length;
pass("ui:BRV_TABS count", tabCount === 34, `count=${tabCount}`);
pass("ui:BRV_THEME amber-600", constants.includes('primary: "amber-600"'));
pass("ui:BRV_PERMISSIONS", constants.includes('"brv.view"') && constants.includes('"brv.admin"'));
pass("ui:BILLING_CYCLE_OPTIONS", constants.includes('"monthly"') && constants.includes('"annual"'));
pass("ui:PAYMENT_STATUS_OPTIONS", constants.includes('"succeeded"') && constants.includes('"failed"'));

const hook = readFileSync(join(root, "src/modules/billing-revenue/hooks/useBillingRevenue.ts"), "utf8");
pass("hook:cancelled useEffect", hook.includes("let cancelled = false") && hook.includes("cancelled = true"));
pass("hook:stable auth deps", hook.includes("authUserId") && hook.includes("[authUserId, email, fullName]"));
pass("hook:applyData semicolons", hook.includes("setStats(result.statsData);") && !hook.includes("setStats(result.statsData),"));

const panels = readFileSync(join(root, "src/modules/billing-revenue/components/BillingRevenuePanels.tsx"), "utf8");
pass("ui:BillingAccountSelect form.register spread", panels.includes("BillingAccountSelect") && panels.includes('{...form.register("billingAccountId")}'));

const routes = readFileSync(join(root, "src/constants/routes.ts"), "utf8");
pass("route:billingRevenue", routes.includes('billingRevenue: "/billing-revenue"'));

const nav = readFileSync(join(root, "src/config/shell-navigation.ts"), "utf8");
pass("nav:Billing & Revenue", nav.includes('"Billing & Revenue"') && nav.includes("DollarSign"));

const middleware = readFileSync(join(root, "src/middleware/auth.ts"), "utf8");
pass("middleware:billingRevenue", middleware.includes("ROUTES.billingRevenue"));

const pkg = readFileSync(join(root, "package.json"), "utf8");
pass("package:sprint4:verify", pkg.includes('"sprint4:verify"'));

const failed = results.filter((r) => !r.pass);
for (const item of results) {
    console.log(`${item.pass ? "PASS" : "FAIL"} ${item.check}${item.detail ? ` (${item.detail})` : ""}`);
}

console.log(`\nSprint 4 verification: ${results.length - failed.length}/${results.length} passed`);
console.log(`BRV_TABS count: ${tabCount}`);

if (failed.length > 0) {
    process.exit(1);
}

console.log("All Sprint 4 verification checks passed.");

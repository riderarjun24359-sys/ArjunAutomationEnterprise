#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 9 Enterprise Retail Business Operating System artifacts.
 * Run: node scripts/generate-enterprise-retail-bos.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "rtl";
const Pascal = "Rtl";
const camel = "rtl";
const permResource = "enterprise_retail_business_os";

const hubTable = `${PREFIX}_retail_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_retail_metrics`, `${PREFIX}_retail_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "retailHubs", plural: "retailHubs", singular: "RetailHub", pascal: "RetailHub", db: `${camel}RetailHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  retail_code text not null default ''" },
    { tab: "retailBrands", plural: "retailBrands", singular: "RetailBrand", pascal: "RetailBrand", db: `${camel}RetailBrands`, table: `${PREFIX}_retail_brands`, fields: [{ name: "brandKey", type: "string" }, { name: "brandName", type: "string" }, { name: "brandType", type: "string" }], display: { title: "brandName", sub: "brandType" }, sqlExtra: "brand_key text not null,\n  brand_name text not null default '',\n  brand_type text not null default 'flagship',\n  region text not null default ''" },
    { tab: "stores", plural: "stores", singular: "Store", pascal: "Store", db: `${camel}Stores`, table: `${PREFIX}_stores`, fields: [{ name: "storeKey", type: "string" }, { name: "storeName", type: "string" }, { name: "storeType", type: "string" }], display: { title: "storeName", sub: "storeType" }, sqlExtra: "store_key text not null,\n  store_name text not null default '',\n  store_type text not null default 'retail',\n  address text not null default ''" },
    { tab: "cashRegisters", plural: "cashRegisters", singular: "CashRegister", pascal: "CashRegister", db: `${camel}CashRegisters`, table: `${PREFIX}_cash_registers`, fields: [{ name: "registerKey", type: "string" }, { name: "registerName", type: "string" }, { name: "registerStatus", type: "select", options: "REGISTER_STATUS_OPTIONS" }], display: { title: "registerName", sub: "registerStatus" }, sqlExtra: "register_key text not null,\n  register_name text not null default '',\n  register_status text not null default 'active',\n  terminal_id text not null default ''" },
    { tab: "storeDepartments", plural: "storeDepartments", singular: "StoreDepartment", pascal: "StoreDepartment", db: `${camel}StoreDepartments`, table: `${PREFIX}_store_departments`, fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" }, sqlExtra: "department_key text not null,\n  department_name text not null default '',\n  department_type text not null default 'sales',\n  floor_level text not null default ''" },
    { tab: "products", plural: "products", singular: "Product", pascal: "Product", db: `${camel}Products`, table: `${PREFIX}_products`, fields: [{ name: "productKey", type: "string" }, { name: "productName", type: "string" }, { name: "productType", type: "string" }], display: { title: "productName", sub: "productType" }, sqlExtra: "product_key text not null,\n  product_name text not null default '',\n  product_type text not null default 'standard',\n  sku text not null default ''" },
    { tab: "productCategories", plural: "productCategories", singular: "ProductCategory", pascal: "ProductCategory", db: `${camel}ProductCategories`, table: `${PREFIX}_product_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'general',\n  parent_ref text not null default ''" },
    { tab: "productVariants", plural: "productVariants", singular: "ProductVariant", pascal: "ProductVariant", db: `${camel}ProductVariants`, table: `${PREFIX}_product_variants`, fields: [{ name: "variantKey", type: "string" }, { name: "variantName", type: "string" }, { name: "variantType", type: "string" }], display: { title: "variantName", sub: "variantType" }, sqlExtra: "variant_key text not null,\n  variant_name text not null default '',\n  variant_type text not null default 'size',\n  sku_ref text not null default ''" },
    { tab: "promotions", plural: "promotions", singular: "Promotion", pascal: "Promotion", db: `${camel}Promotions`, table: `${PREFIX}_promotions`, fields: [{ name: "promotionKey", type: "string" }, { name: "promotionName", type: "string" }, { name: "promotionStatus", type: "select", options: "PROMOTION_STATUS_OPTIONS" }], display: { title: "promotionName", sub: "promotionStatus" }, sqlExtra: "promotion_key text not null,\n  promotion_name text not null default '',\n  promotion_status text not null default 'draft',\n  discount_pct numeric(5, 2) not null default 0" },
    { tab: "salesOrders", plural: "salesOrders", singular: "SalesOrder", pascal: "SalesOrder", db: `${camel}SalesOrders`, table: `${PREFIX}_sales_orders`, fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "select", options: "SALES_ORDER_STATUS_OPTIONS" }], display: { title: "orderName", sub: "orderStatus" }, sqlExtra: "order_key text not null,\n  order_name text not null default '',\n  order_status text not null default 'pending',\n  order_type text not null default 'in_store',\n  ordered_at timestamptz not null default now()" },
    { tab: "posTransactions", plural: "posTransactions", singular: "PosTransaction", pascal: "PosTransaction", db: `${camel}PosTransactions`, table: `${PREFIX}_pos_transactions`, fields: [{ name: "transactionKey", type: "string" }, { name: "transactionName", type: "string" }, { name: "transactionStatus", type: "string" }], display: { title: "transactionName", sub: "transactionStatus" }, sqlExtra: "transaction_key text not null,\n  transaction_name text not null default '',\n  transaction_status text not null default 'completed',\n  amount numeric(12, 2) not null default 0,\n  transacted_at timestamptz not null default now()" },
    { tab: "returnsExchanges", plural: "returnsExchanges", singular: "ReturnsExchange", pascal: "ReturnsExchange", db: `${camel}ReturnsExchanges`, table: `${PREFIX}_returns_exchanges`, fields: [{ name: "returnKey", type: "string" }, { name: "returnName", type: "string" }, { name: "returnStatus", type: "select", options: "RETURN_STATUS_OPTIONS" }], display: { title: "returnName", sub: "returnStatus" }, sqlExtra: "return_key text not null,\n  return_name text not null default '',\n  return_status text not null default 'pending',\n  return_type text not null default 'return',\n  returned_at timestamptz not null default now()" },
    { tab: "shiftClosings", plural: "shiftClosings", singular: "ShiftClosing", pascal: "ShiftClosing", db: `${camel}ShiftClosings`, table: `${PREFIX}_shift_closings`, fields: [{ name: "closingKey", type: "string" }, { name: "closingName", type: "string" }, { name: "closingStatus", type: "string" }], display: { title: "closingName", sub: "closingStatus" }, sqlExtra: "closing_key text not null,\n  closing_name text not null default '',\n  closing_status text not null default 'open',\n  closed_at timestamptz not null default now()" },
    { tab: "warehouses", plural: "warehouses", singular: "Warehouse", pascal: "Warehouse", db: `${camel}Warehouses`, table: `${PREFIX}_warehouses`, fields: [{ name: "warehouseKey", type: "string" }, { name: "warehouseName", type: "string" }, { name: "warehouseType", type: "string" }], display: { title: "warehouseName", sub: "warehouseType" }, sqlExtra: "warehouse_key text not null,\n  warehouse_name text not null default '',\n  warehouse_type text not null default 'distribution',\n  location text not null default ''" },
    { tab: "stockLevels", plural: "stockLevels", singular: "StockLevel", pascal: "StockLevel", db: `${camel}StockLevels`, table: `${PREFIX}_stock_levels`, fields: [{ name: "stockKey", type: "string" }, { name: "stockName", type: "string" }, { name: "stockQuantity", type: "number" }], display: { title: "stockName", sub: "stockQuantity" }, sqlExtra: "stock_key text not null,\n  stock_name text not null default '',\n  stock_quantity integer not null default 0,\n  reorder_level integer not null default 10" },
    { tab: "purchaseOrders", plural: "purchaseOrders", singular: "PurchaseOrder", pascal: "PurchaseOrder", db: `${camel}PurchaseOrders`, table: `${PREFIX}_purchase_orders`, fields: [{ name: "orderKey", type: "string" }, { name: "orderName", type: "string" }, { name: "orderStatus", type: "string" }], display: { title: "orderName", sub: "orderStatus" }, sqlExtra: "order_key text not null,\n  order_name text not null default '',\n  order_status text not null default 'pending',\n  supplier_ref text not null default '',\n  ordered_at timestamptz not null default now()" },
    { tab: "suppliers", plural: "suppliers", singular: "Supplier", pascal: "Supplier", db: `${camel}Suppliers`, table: `${PREFIX}_suppliers`, fields: [{ name: "supplierKey", type: "string" }, { name: "supplierName", type: "string" }, { name: "supplierType", type: "string" }], display: { title: "supplierName", sub: "supplierType" }, sqlExtra: "supplier_key text not null,\n  supplier_name text not null default '',\n  supplier_type text not null default 'vendor',\n  contact_info text not null default ''" },
    { tab: "customerProfiles", plural: "customerProfiles", singular: "CustomerProfile", pascal: "CustomerProfile", db: `${camel}CustomerProfiles`, table: `${PREFIX}_customer_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'regular',\n  loyalty_tier text not null default 'bronze'" },
    { tab: "loyaltyPrograms", plural: "loyaltyPrograms", singular: "LoyaltyProgram", pascal: "LoyaltyProgram", db: `${camel}LoyaltyPrograms`, table: `${PREFIX}_loyalty_programs`, fields: [{ name: "programKey", type: "string" }, { name: "programName", type: "string" }, { name: "programType", type: "string" }], display: { title: "programName", sub: "programType" }, sqlExtra: "program_key text not null,\n  program_name text not null default '',\n  program_type text not null default 'points',\n  points_rate numeric(5, 2) not null default 1" },
    { tab: "rewardPoints", plural: "rewardPoints", singular: "RewardPoint", pascal: "RewardPoint", db: `${camel}RewardPoints`, table: `${PREFIX}_reward_points`, fields: [{ name: "pointsKey", type: "string" }, { name: "pointsName", type: "string" }, { name: "pointsBalance", type: "number" }], display: { title: "pointsName", sub: "pointsBalance" }, sqlExtra: "points_key text not null,\n  points_name text not null default '',\n  points_balance numeric(10, 2) not null default 0,\n  earned_at timestamptz not null default now()" },
    { tab: "campaigns", plural: "campaigns", singular: "Campaign", pascal: "Campaign", db: `${camel}Campaigns`, table: `${PREFIX}_campaigns`, fields: [{ name: "campaignKey", type: "string" }, { name: "campaignName", type: "string" }, { name: "campaignStatus", type: "string" }], display: { title: "campaignName", sub: "campaignStatus" }, sqlExtra: "campaign_key text not null,\n  campaign_name text not null default '',\n  campaign_status text not null default 'draft',\n  start_date date not null default current_date" },
    { tab: "dailyClosings", plural: "dailyClosings", singular: "DailyClosing", pascal: "DailyClosing", db: `${camel}DailyClosings`, table: `${PREFIX}_daily_closings`, fields: [{ name: "closingKey", type: "string" }, { name: "closingName", type: "string" }, { name: "closingAmount", type: "number" }], display: { title: "closingName", sub: "closingAmount" }, sqlExtra: "closing_key text not null,\n  closing_name text not null default '',\n  closing_amount numeric(12, 2) not null default 0,\n  closed_at timestamptz not null default now()" },
    { tab: "branchPerformance", plural: "branchPerformance", singular: "BranchPerformance", pascal: "BranchPerformance", db: `${camel}BranchPerformance`, table: `${PREFIX}_branch_performance`, fields: [{ name: "performanceKey", type: "string" }, { name: "performanceName", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceName", sub: "performanceScore" }, sqlExtra: "performance_key text not null,\n  performance_name text not null default '',\n  performance_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "commissionRecords", plural: "commissionRecords", singular: "CommissionRecord", pascal: "CommissionRecord", db: `${camel}CommissionRecords`, table: `${PREFIX}_commission_records`, fields: [{ name: "commissionKey", type: "string" }, { name: "commissionName", type: "string" }, { name: "commissionAmount", type: "number" }], display: { title: "commissionName", sub: "commissionAmount" }, sqlExtra: "commission_key text not null,\n  commission_name text not null default '',\n  commission_amount numeric(12, 2) not null default 0,\n  earned_at timestamptz not null default now()" },
    { tab: "salesAnalytics", plural: "salesAnalytics", singular: "SalesAnalytics", pascal: "SalesAnalytics", db: `${camel}SalesAnalytics`, table: `${PREFIX}_sales_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'sales',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "inventoryAnalytics", plural: "inventoryAnalytics", singular: "InventoryAnalytics", pascal: "InventoryAnalytics", db: `${camel}InventoryAnalytics`, table: `${PREFIX}_inventory_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'inventory',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "profitabilityAnalytics", plural: "profitabilityAnalytics", singular: "ProfitabilityAnalytics", pascal: "ProfitabilityAnalytics", db: `${camel}ProfitabilityAnalytics`, table: `${PREFIX}_profitability_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'profitability',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "retailMetrics", plural: "retailMetrics", singular: "RetailMetric", pascal: "RetailMetric", db: `${camel}RetailMetrics`, table: `${PREFIX}_retail_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "revenueTotal", type: "number" }, { name: "overallRetailScore", type: "number" }], display: { title: "metricsKey", sub: "overallRetailScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  revenue_total numeric(12, 2) not null default 0,\n  profit_total numeric(12, 2) not null default 0,\n  sales_count integer not null default 0,\n  inventory_value numeric(12, 2) not null default 0,\n  customer_retention_rate numeric(5, 2) not null default 0,\n  store_performance_score numeric(5, 2) not null default 0,\n  top_product_score numeric(5, 2) not null default 0,\n  overall_retail_score numeric(5, 2) not null default 100" },
    { tab: "retailHealth", plural: "retailHealth", singular: "RetailHealth", pascal: "RetailHealth", db: `${camel}RetailHealth`, table: `${PREFIX}_retail_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  inventory_health_status text not null default 'healthy',\n  financial_health_status text not null default 'healthy',\n  operational_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: `${camel}ExecutiveKpis`, table: `${PREFIX}_executive_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'executive',\n  metric_date date not null default current_date" },
    { tab: "retailFailures", plural: "retailFailures", singular: "RetailFailure", pascal: "RetailFailure", db: `${camel}RetailFailures`, table: `${PREFIX}_retail_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'pos',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 9: Enterprise Retail Business Operating System\n\n";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        const hubCol = isHub || isOrgOnly ? "" : `  ${hubFk} uuid not null references public.${hubTable}(id) on delete cascade,\n`;
        const uniqueClause = isHub
            ? "unique (organization_id, hub_key)"
            : isOrgOnly
                ? `unique (organization_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`
                : `unique (organization_id, ${hubFk}, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`;
        sql += `-- ${e.pascal}\n`;
        sql += `create table if not exists public.${e.table} (\n`;
        sql += `  id uuid primary key default gen_random_uuid(),\n`;
        sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
        sql += hubCol;
        sql += `  ${e.sqlExtra},\n`;
        sql += `  status text not null default 'active',\n`;
        sql += `  created_at timestamptz not null default now(),\n`;
        sql += `  updated_at timestamptz not null default now(),\n`;
        sql += `  ${uniqueClause}\n`;
        sql += `);\n\n`;
    }
    sql += `-- Audit Logs\n`;
    sql += `create table if not exists public.${PREFIX}_audit_logs (\n`;
    sql += `  id uuid primary key default gen_random_uuid(),\n`;
    sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
    sql += `  entity_type text not null default '',\n`;
    sql += `  entity_id uuid,\n`;
    sql += `  action text not null default '',\n`;
    sql += `  summary text not null default '',\n`;
    sql += `  metadata jsonb not null default '{}'::jsonb,\n`;
    sql += `  performed_by uuid,\n`;
    sql += `  security_level text not null default 'standard',\n`;
    sql += `  created_at timestamptz not null default now()\n`;
    sql += `);\n\n`;

    for (const t of allTables) {
        sql += `create index if not exists idx_${t}_org on public.${t}(organization_id);\n`;
        if (!orgOnlyTables.has(t) && t !== hubTable) {
            sql += `create index if not exists idx_${t}_hub on public.${t}(${hubFk});\n`;
        }
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${tablesForTriggers.join("','")}'\n  ]\n  loop\n    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);\n    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    for (const t of allTables) {
        sql += `alter table public.${t} enable row level security;\n`;
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${allTables.join("','")}'\n  ]\n  loop\n    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);\n    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);\n    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);\n    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);\n    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    sql += `insert into public.permissions (key, description, resource)\nvalues\n`;
    sql += `  ('${PREFIX}.view', 'View enterprise retail business operating system data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage retail foundation, product, sales, inventory, customer, finance, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve retail sales and inventory gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise retail business operating system governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00710071-0071-0071-0071-007100710101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a341', '${org}', 'Enterprise Retail Orchestrator', 'enterprise_retail_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["retail_foundation","product_engine","sales_pos","inventory_engine","customer_engine","finance_engine","retail_analytics","retail_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a541', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a341', 'northstar-retail-os-001', 'enterprise_retail_business_os', 'retail_hub', '${hubId}', '{"objective":"Enterprise retail business operating system for northstar retail operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Retail Hub\n`;
    sql += `insert into public.rtl_retail_hubs (id, organization_id, hub_key, hub_name, environment, retail_code, status)\nvalues ('${hubId}', '${org}', 'northstar-retail-os', 'Northstar Retail OS Hub', 'production', 'RTL-0904-001', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Foundation\n`;
    sql += `insert into public.rtl_retail_brands (id, organization_id, hub_id, brand_key, brand_name, brand_type, status)\nvalues ('03000100-0300-0300-0300-030001000201', '${org}', '${hubId}', 'brand-flagship-0904', 'Northstar Flagship Brand', 'flagship', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_stores (id, organization_id, hub_id, store_key, store_name, store_type, status)\nvalues ('03010101-0301-0301-0301-030101010301', '${org}', '${hubId}', 'store-downtown-0904', 'Downtown Store', 'retail', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_cash_registers (id, organization_id, hub_id, register_key, register_name, register_status, status)\nvalues ('03020102-0302-0302-0302-030201020401', '${org}', '${hubId}', 'reg-pos-01-0904', 'POS Register 01', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_store_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)\nvalues ('03030103-0303-0303-0303-030301030501', '${org}', '${hubId}', 'dept-apparel-0904', 'Apparel Department', 'sales', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Product\n`;
    sql += `insert into public.rtl_products (id, organization_id, hub_id, product_key, product_name, product_type, status)\nvalues ('03040104-0304-0304-0304-030401040601', '${org}', '${hubId}', 'prod-jacket-0904', 'Winter Jacket', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_product_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('03050105-0305-0305-0305-030501050701', '${org}', '${hubId}', 'cat-apparel-0904', 'Apparel Category', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_product_variants (id, organization_id, hub_id, variant_key, variant_name, variant_type, status)\nvalues ('03060106-0306-0306-0306-030601060801', '${org}', '${hubId}', 'var-jacket-lg-0904', 'Winter Jacket Large', 'size', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_promotions (id, organization_id, hub_id, promotion_key, promotion_name, promotion_status, status)\nvalues ('03070107-0307-0307-0307-030701070901', '${org}', '${hubId}', 'promo-winter-0904', 'Winter Sale Promotion', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Sales & POS\n`;
    sql += `insert into public.rtl_sales_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)\nvalues ('03080108-0308-0308-0308-030801080a01', '${org}', '${hubId}', 'ord-smith-0904', 'Smith Sales Order', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_pos_transactions (id, organization_id, hub_id, transaction_key, transaction_name, transaction_status, status)\nvalues ('03090109-0309-0309-0309-030901090b01', '${org}', '${hubId}', 'pos-smith-0904', 'Smith POS Transaction', 'completed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_returns_exchanges (id, organization_id, hub_id, return_key, return_name, return_status, status)\nvalues ('030a010a-030a-030a-030a-030a010a0c01', '${org}', '${hubId}', 'ret-smith-0904', 'Smith Return', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_shift_closings (id, organization_id, hub_id, closing_key, closing_name, closing_status, status)\nvalues ('030b010b-030b-030b-030b-030b010b0d01', '${org}', '${hubId}', 'shift-close-0904', 'Evening Shift Closing', 'closed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Inventory\n`;
    sql += `insert into public.rtl_warehouses (id, organization_id, hub_id, warehouse_key, warehouse_name, warehouse_type, status)\nvalues ('030c010c-030c-030c-030c-030c010c0e01', '${org}', '${hubId}', 'wh-central-0904', 'Central Warehouse', 'distribution', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_stock_levels (id, organization_id, hub_id, stock_key, stock_name, stock_quantity, status)\nvalues ('030d010d-030d-030d-030d-030d010d0f01', '${org}', '${hubId}', 'stk-jacket-0904', 'Jacket Stock Level', 150, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_purchase_orders (id, organization_id, hub_id, order_key, order_name, order_status, status)\nvalues ('030e010e-030e-030e-030e-030e010e1001', '${org}', '${hubId}', 'po-jacket-0904', 'Jacket Purchase Order', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_suppliers (id, organization_id, hub_id, supplier_key, supplier_name, supplier_type, status)\nvalues ('030f010f-030f-030f-030f-030f010f1101', '${org}', '${hubId}', 'sup-apparel-0904', 'Apparel Supplier Co', 'vendor', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Customer\n`;
    sql += `insert into public.rtl_customer_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('03100110-0310-0310-0310-031001101201', '${org}', '${hubId}', 'cust-smith-0904', 'Smith Customer Profile', 'regular', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_loyalty_programs (id, organization_id, hub_id, program_key, program_name, program_type, status)\nvalues ('03110111-0311-0311-0311-031101111301', '${org}', '${hubId}', 'loyalty-gold-0904', 'Gold Loyalty Program', 'points', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_reward_points (id, organization_id, hub_id, points_key, points_name, points_balance, status)\nvalues ('03120112-0312-0312-0312-031201121401', '${org}', '${hubId}', 'pts-smith-0904', 'Smith Reward Points', 250.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_campaigns (id, organization_id, hub_id, campaign_key, campaign_name, campaign_status, status)\nvalues ('03130113-0313-0313-0313-031301131501', '${org}', '${hubId}', 'camp-winter-0904', 'Winter Campaign', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Finance\n`;
    sql += `insert into public.rtl_daily_closings (id, organization_id, hub_id, closing_key, closing_name, closing_amount, status)\nvalues ('03140114-0314-0314-0314-031401141601', '${org}', '${hubId}', 'daily-close-0904', 'Daily Store Closing', 45000.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_branch_performance (id, organization_id, hub_id, performance_key, performance_name, performance_score, status)\nvalues ('03150115-0315-0315-0315-031501151701', '${org}', '${hubId}', 'perf-downtown-0904', 'Downtown Branch Performance', 92.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_commission_records (id, organization_id, hub_id, commission_key, commission_name, commission_amount, status)\nvalues ('03160116-0316-0316-0316-031601161801', '${org}', '${hubId}', 'comm-smith-0904', 'Smith Commission Record', 1250.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Analytics\n`;
    sql += `insert into public.rtl_sales_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('03170117-0317-0317-0317-031701171901', '${org}', '${hubId}', 'anly-sales-0904', 'sales', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_inventory_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('03180118-0318-0318-0318-031801181a01', '${org}', '${hubId}', 'anly-inv-0904', 'inventory', 88.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_profitability_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('03190119-0319-0319-0319-031901191b01', '${org}', '${hubId}', 'anly-profit-0904', 'profitability', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Executive Dashboard\n`;
    sql += `insert into public.rtl_retail_metrics (id, organization_id, metrics_key, revenue_total, profit_total, sales_count, inventory_value, customer_retention_rate, store_performance_score, top_product_score, overall_retail_score, status)\nvalues ('031a011a-031a-031a-031a-031a011a1c01', '${org}', 'rtl-metrics-0904', 3500000.00, 875000.00, 12500, 980000.00, 87.50, 91.00, 93.50, 95.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_retail_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, inventory_health_status, financial_health_status, operational_health_status, summary, status)\nvalues ('031b011b-031b-031b-031b-031b011b1d01', '${org}', 'rtl-health-0904', 96.00, false, 'healthy', 'healthy', 'healthy', 'Retail business operating system operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('031c011c-031c-031c-031c-031c011c1e01', '${org}', '${hubId}', 'kpi-exec-0904', 'Executive KPI Score', 97.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_retail_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('031d011d-031d-031d-031d-031d011d1f01', '${org}', '${hubId}', 'fail-pos-0904', 'pos', 'POS_TIMEOUT', 'POS transaction processing timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rtl_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('031e011e-031e-031e-031e-031e011e2001', '${org}', 'retail_hub', 'seed', 'Enterprise retail business operating system seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgRtlRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgRtlRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgRtlRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
    return sql;
}

function buildDbTypes() {
    let types = "";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        types += `export interface Db${Pascal}${e.pascal} {\n    id: string;\n    organization_id: string;\n`;
        if (!isHub && !isOrgOnly) types += `    ${hubFk}: string;\n`;
        const cols = e.sqlExtra.split("\n").map((l) => l.trim().replace(/,$/, ""));
        for (const col of cols) {
            const [name, ...rest] = col.split(" ");
            const sqlType = rest.join(" ");
            let tsType = "string";
            if (sqlType.includes("integer") || sqlType.includes("numeric")) tsType = "number";
            if (sqlType.includes("boolean")) tsType = "boolean";
            if (sqlType.includes("jsonb")) tsType = "Record<string, unknown>";
            if (sqlType.includes("timestamptz") || sqlType.includes(" date")) tsType = "string";
            const opt = sqlType.includes("not null") ? "" : "?";
            types += `    ${name}${opt}: ${tsType};\n`;
        }
        types += `    status: string;\n`;
        if (e.table !== `${PREFIX}_audit_logs`) {
            types += `    created_at: string;\n    updated_at: string;\n`;
        }
        types += `}\n\n`;
    }
    types += `export interface Db${Pascal}AuditLog {\n    id: string;\n    organization_id: string;\n    entity_type: string;\n    entity_id?: string | null;\n    action: string;\n    summary: string;\n    metadata: Record<string, unknown>;\n    performed_by?: string | null;\n    security_level: string;\n    created_at: string;\n}\n`;
    return types;
}

const migrationPath = join(root, "supabase/migrations/202608020041_enterprise_retail_business_os.sql");
const seedPath = join(root, "supabase/seed/041_enterprise_retail_business_os_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/retail-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbRtlRetailHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Retail Business Operating System artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbRtl* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-retail-ui.mjs");

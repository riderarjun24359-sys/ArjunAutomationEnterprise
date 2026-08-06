#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 6 Enterprise Restaurant Business Operating System artifacts.
 * Run: node scripts/generate-enterprise-restaurant-bos.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "rst";
const Pascal = "Rst";
const camel = "rst";
const permResource = "enterprise_restaurant_business_os";

const hubTable = `${PREFIX}_restaurant_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_restaurant_metrics`, `${PREFIX}_restaurant_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "restaurantHubs", plural: "restaurantHubs", singular: "RestaurantHub", pascal: "RestaurantHub", db: `${camel}RestaurantHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  gst_number text not null default '',\n  operating_hours jsonb not null default '{}'::jsonb" },
    { tab: "brands", plural: "brands", singular: "Brand", pascal: "Brand", db: `${camel}Brands`, table: `${PREFIX}_brands`, fields: [{ name: "brandKey", type: "string" }, { name: "brandName", type: "string" }, { name: "brandType", type: "string" }], display: { title: "brandName", sub: "brandType" }, sqlExtra: "brand_key text not null,\n  brand_name text not null default '',\n  brand_type text not null default 'franchise',\n  description text not null default ''" },
    { tab: "branches", plural: "branches", singular: "Branch", pascal: "Branch", db: `${camel}Branches`, table: `${PREFIX}_branches`, fields: [{ name: "branchKey", type: "string" }, { name: "branchName", type: "string" }, { name: "branchAddress", type: "string" }], display: { title: "branchName", sub: "branchAddress" }, sqlExtra: "branch_key text not null,\n  branch_name text not null default '',\n  branch_address text not null default '',\n  city text not null default ''" },
    { tab: "businessLicenses", plural: "businessLicenses", singular: "BusinessLicense", pascal: "BusinessLicense", db: `${camel}BusinessLicenses`, table: `${PREFIX}_business_licenses`, fields: [{ name: "licenseKey", type: "string" }, { name: "licenseName", type: "string" }, { name: "licenseType", type: "string" }], display: { title: "licenseName", sub: "licenseType" }, sqlExtra: "license_key text not null,\n  license_name text not null default '',\n  license_type text not null default 'food_service',\n  expiry_date date" },
    { tab: "diningAreas", plural: "diningAreas", singular: "DiningArea", pascal: "DiningArea", db: `${camel}DiningAreas`, table: `${PREFIX}_dining_areas`, fields: [{ name: "areaKey", type: "string" }, { name: "areaName", type: "string" }, { name: "areaType", type: "string" }], display: { title: "areaName", sub: "areaType" }, sqlExtra: "area_key text not null,\n  area_name text not null default '',\n  area_type text not null default 'indoor',\n  capacity integer not null default 0" },
    { tab: "restaurantTables", plural: "restaurantTables", singular: "RestaurantTable", pascal: "RestaurantTable", db: `${camel}RestaurantTables`, table: `${PREFIX}_restaurant_tables`, fields: [{ name: "tableKey", type: "string" }, { name: "tableName", type: "string" }, { name: "tableStatus", type: "string" }], display: { title: "tableName", sub: "tableStatus" }, sqlExtra: "table_key text not null,\n  table_name text not null default '',\n  qr_code text not null default '',\n  table_status text not null default 'available',\n  floor_ref text not null default '',\n  seats integer not null default 4" },
    { tab: "menuCategories", plural: "menuCategories", singular: "MenuCategory", pascal: "MenuCategory", db: `${camel}MenuCategories`, table: `${PREFIX}_menu_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'main',\n  display_order integer not null default 0" },
    { tab: "menuItems", plural: "menuItems", singular: "MenuItem", pascal: "MenuItem", db: `${camel}MenuItems`, table: `${PREFIX}_menu_items`, fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "itemPrice", type: "number" }], display: { title: "itemName", sub: "itemPrice" }, sqlExtra: "item_key text not null,\n  item_name text not null default '',\n  item_price numeric(10, 2) not null default 0,\n  description text not null default ''" },
    { tab: "menuVariants", plural: "menuVariants", singular: "MenuVariant", pascal: "MenuVariant", db: `${camel}MenuVariants`, table: `${PREFIX}_menu_variants`, fields: [{ name: "variantKey", type: "string" }, { name: "variantName", type: "string" }, { name: "variantType", type: "string" }], display: { title: "variantName", sub: "variantType" }, sqlExtra: "variant_key text not null,\n  variant_name text not null default '',\n  variant_type text not null default 'size',\n  price_adjustment numeric(10, 2) not null default 0" },
    { tab: "addOns", plural: "addOns", singular: "AddOn", pascal: "AddOn", db: `${camel}AddOns`, table: `${PREFIX}_add_ons`, fields: [{ name: "addonKey", type: "string" }, { name: "addonName", type: "string" }, { name: "addonPrice", type: "number" }], display: { title: "addonName", sub: "addonPrice" }, sqlExtra: "addon_key text not null,\n  addon_name text not null default '',\n  addon_price numeric(10, 2) not null default 0,\n  addon_type text not null default 'extra'" },
    { tab: "comboMeals", plural: "comboMeals", singular: "ComboMeal", pascal: "ComboMeal", db: `${camel}ComboMeals`, table: `${PREFIX}_combo_meals`, fields: [{ name: "comboKey", type: "string" }, { name: "comboName", type: "string" }, { name: "comboPrice", type: "number" }], display: { title: "comboName", sub: "comboPrice" }, sqlExtra: "combo_key text not null,\n  combo_name text not null default '',\n  combo_price numeric(10, 2) not null default 0,\n  combo_type text not null default 'standard'" },
    { tab: "orders", plural: "orders", singular: "Order", pascal: "Order", db: `${camel}Orders`, table: `${PREFIX}_orders`, fields: [{ name: "orderKey", type: "string" }, { name: "orderNumber", type: "string" }, { name: "orderType", type: "select", options: "ORDER_TYPE_OPTIONS" }], display: { title: "orderNumber", sub: "orderType" }, sqlExtra: "order_key text not null,\n  order_number text not null default '',\n  order_type text not null default 'dine-in',\n  order_status text not null default 'pending',\n  total_amount numeric(10, 2) not null default 0" },
    { tab: "orderItems", plural: "orderItems", singular: "OrderItem", pascal: "OrderItem", db: `${camel}OrderItems`, table: `${PREFIX}_order_items`, fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "itemQuantity", type: "number" }], display: { title: "itemName", sub: "itemQuantity" }, sqlExtra: "item_key text not null,\n  item_name text not null default '',\n  item_quantity integer not null default 1,\n  unit_price numeric(10, 2) not null default 0" },
    { tab: "orderQueue", plural: "orderQueue", singular: "OrderQueue", pascal: "OrderQueue", db: `${camel}OrderQueue`, table: `${PREFIX}_order_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueName", type: "string" }, { name: "queueStatus", type: "string" }], display: { title: "queueName", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_name text not null default '',\n  queue_status text not null default 'waiting',\n  position integer not null default 0" },
    { tab: "kitchenRouting", plural: "kitchenRouting", singular: "KitchenRouting", pascal: "KitchenRouting", db: `${camel}KitchenRouting`, table: `${PREFIX}_kitchen_routing`, fields: [{ name: "routingKey", type: "string" }, { name: "routingName", type: "string" }, { name: "routingStatus", type: "string" }], display: { title: "routingName", sub: "routingStatus" }, sqlExtra: "routing_key text not null,\n  routing_name text not null default '',\n  routing_status text not null default 'pending',\n  station_ref text not null default ''" },
    { tab: "orderTimeline", plural: "orderTimeline", singular: "OrderTimeline", pascal: "OrderTimeline", db: `${camel}OrderTimeline`, table: `${PREFIX}_order_timeline`, fields: [{ name: "timelineKey", type: "string" }, { name: "timelineEvent", type: "string" }, { name: "timelineStatus", type: "string" }], display: { title: "timelineEvent", sub: "timelineStatus" }, sqlExtra: "timeline_key text not null,\n  timeline_event text not null default '',\n  timeline_status text not null default 'pending',\n  recorded_at timestamptz not null default now()" },
    { tab: "kitchenStations", plural: "kitchenStations", singular: "KitchenStation", pascal: "KitchenStation", db: `${camel}KitchenStations`, table: `${PREFIX}_kitchen_stations`, fields: [{ name: "stationKey", type: "string" }, { name: "stationName", type: "string" }, { name: "stationType", type: "string" }], display: { title: "stationName", sub: "stationType" }, sqlExtra: "station_key text not null,\n  station_name text not null default '',\n  station_type text not null default 'grill',\n  capacity integer not null default 5" },
    { tab: "preparationQueue", plural: "preparationQueue", singular: "PreparationQueue", pascal: "PreparationQueue", db: `${camel}PreparationQueue`, table: `${PREFIX}_preparation_queue`, fields: [{ name: "prepKey", type: "string" }, { name: "prepName", type: "string" }, { name: "prepStatus", type: "string" }], display: { title: "prepName", sub: "prepStatus" }, sqlExtra: "prep_key text not null,\n  prep_name text not null default '',\n  prep_status text not null default 'queued',\n  priority integer not null default 0" },
    { tab: "cookingStatus", plural: "cookingStatus", singular: "CookingStatus", pascal: "CookingStatus", db: `${camel}CookingStatus`, table: `${PREFIX}_cooking_status`, fields: [{ name: "cookingKey", type: "string" }, { name: "cookingName", type: "string" }, { name: "cookingStatus", type: "string" }], display: { title: "cookingName", sub: "cookingStatus" }, sqlExtra: "cooking_key text not null,\n  cooking_name text not null default '',\n  cooking_status text not null default 'preparing',\n  started_at timestamptz not null default now()" },
    { tab: "readyQueue", plural: "readyQueue", singular: "ReadyQueue", pascal: "ReadyQueue", db: `${camel}ReadyQueue`, table: `${PREFIX}_ready_queue`, fields: [{ name: "readyKey", type: "string" }, { name: "readyName", type: "string" }, { name: "readyStatus", type: "string" }], display: { title: "readyName", sub: "readyStatus" }, sqlExtra: "ready_key text not null,\n  ready_name text not null default '',\n  ready_status text not null default 'ready',\n  ready_at timestamptz not null default now()" },
    { tab: "rushOrders", plural: "rushOrders", singular: "RushOrder", pascal: "RushOrder", db: `${camel}RushOrders`, table: `${PREFIX}_rush_orders`, fields: [{ name: "rushKey", type: "string" }, { name: "rushName", type: "string" }, { name: "rushPriority", type: "string" }], display: { title: "rushName", sub: "rushPriority" }, sqlExtra: "rush_key text not null,\n  rush_name text not null default '',\n  rush_priority text not null default 'high',\n  escalated_at timestamptz not null default now()" },
    { tab: "reservations", plural: "reservations", singular: "Reservation", pascal: "Reservation", db: `${camel}Reservations`, table: `${PREFIX}_reservations`, fields: [{ name: "reservationKey", type: "string" }, { name: "reservationName", type: "string" }, { name: "reservationStatus", type: "string" }], display: { title: "reservationName", sub: "reservationStatus" }, sqlExtra: "reservation_key text not null,\n  reservation_name text not null default '',\n  reservation_status text not null default 'pending',\n  party_size integer not null default 2,\n  reserved_at timestamptz not null default now()" },
    { tab: "waitingList", plural: "waitingList", singular: "WaitingList", pascal: "WaitingList", db: `${camel}WaitingList`, table: `${PREFIX}_waiting_list`, fields: [{ name: "waitKey", type: "string" }, { name: "waitName", type: "string" }, { name: "waitStatus", type: "string" }], display: { title: "waitName", sub: "waitStatus" }, sqlExtra: "wait_key text not null,\n  wait_name text not null default '',\n  wait_status text not null default 'waiting',\n  party_size integer not null default 2" },
    { tab: "customerProfiles", plural: "customerProfiles", singular: "CustomerProfile", pascal: "CustomerProfile", db: `${camel}CustomerProfiles`, table: `${PREFIX}_customer_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'regular',\n  email text not null default ''" },
    { tab: "loyaltyPrograms", plural: "loyaltyPrograms", singular: "LoyaltyProgram", pascal: "LoyaltyProgram", db: `${camel}LoyaltyPrograms`, table: `${PREFIX}_loyalty_programs`, fields: [{ name: "programKey", type: "string" }, { name: "programName", type: "string" }, { name: "programType", type: "string" }], display: { title: "programName", sub: "programType" }, sqlExtra: "program_key text not null,\n  program_name text not null default '',\n  program_type text not null default 'points',\n  points_balance integer not null default 0" },
    { tab: "feedbackReviews", plural: "feedbackReviews", singular: "FeedbackReview", pascal: "FeedbackReview", db: `${camel}FeedbackReviews`, table: `${PREFIX}_feedback_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "reviewTitle", type: "string" }, { name: "reviewRating", type: "number" }], display: { title: "reviewTitle", sub: "reviewRating" }, sqlExtra: "review_key text not null,\n  review_title text not null default '',\n  review_rating numeric(3, 1) not null default 5,\n  review_text text not null default ''" },
    { tab: "restaurantMetrics", plural: "restaurantMetrics", singular: "RestaurantMetric", pascal: "RestaurantMetric", db: `${camel}RestaurantMetrics`, table: `${PREFIX}_restaurant_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "orderCount", type: "number" }, { name: "overallRestaurantScore", type: "number" }], display: { title: "metricsKey", sub: "overallRestaurantScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  order_count integer not null default 0,\n  revenue_total numeric(12, 2) not null default 0,\n  average_bill numeric(10, 2) not null default 0,\n  occupancy_rate numeric(5, 2) not null default 0,\n  popular_dish_score numeric(5, 2) not null default 0,\n  peak_hour_score numeric(5, 2) not null default 0,\n  customer_growth_rate numeric(5, 2) not null default 0,\n  kitchen_performance_score numeric(5, 2) not null default 0,\n  overall_restaurant_score numeric(5, 2) not null default 100" },
    { tab: "restaurantHealth", plural: "restaurantHealth", singular: "RestaurantHealth", pascal: "RestaurantHealth", db: `${camel}RestaurantHealth`, table: `${PREFIX}_restaurant_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  pending_orders_count integer not null default 0,\n  kitchen_queue_depth integer not null default 0,\n  framework_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "revenueAnalytics", plural: "revenueAnalytics", singular: "RevenueAnalytics", pascal: "RevenueAnalytics", db: `${camel}RevenueAnalytics`, table: `${PREFIX}_revenue_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'revenue',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "kitchenPerformance", plural: "kitchenPerformance", singular: "KitchenPerformance", pascal: "KitchenPerformance", db: `${camel}KitchenPerformance`, table: `${PREFIX}_kitchen_performance`, fields: [{ name: "performanceKey", type: "string" }, { name: "performanceType", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceKey", sub: "performanceType" }, sqlExtra: "performance_key text not null,\n  performance_type text not null default 'kitchen',\n  performance_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "restaurantFailures", plural: "restaurantFailures", singular: "RestaurantFailure", pascal: "RestaurantFailure", db: `${camel}RestaurantFailures`, table: `${PREFIX}_restaurant_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'order',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 6: Enterprise Restaurant Business Operating System\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise restaurant business operating system data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage restaurant foundation, menu, orders, kitchen, customer, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve restaurant reservations and order gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise restaurant business operating system governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006e006e-006e-006e-006e-006e006e0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a338', '${org}', 'Enterprise Restaurant Orchestrator', 'enterprise_restaurant_business_os', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["restaurant_foundation","menu_engine","order_engine","kitchen_engine","customer_engine","restaurant_analytics","restaurant_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a538', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a338', 'northstar-restaurant-os-001', 'enterprise_restaurant_business_os', 'restaurant_hub', '${hubId}', '{"objective":"Enterprise restaurant business operating system for northstar dining operations"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Restaurant Hub\n`;
    sql += `insert into public.rst_restaurant_hubs (id, organization_id, hub_key, hub_name, environment, gst_number, operating_hours, status)\nvalues ('${hubId}', '${org}', 'northstar-restaurant-os', 'Northstar Restaurant OS Hub', 'production', 'GST-0804-001', '{"mon":"09:00-22:00","tue":"09:00-22:00"}'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Foundation\n`;
    sql += `insert into public.rst_brands (id, organization_id, hub_id, brand_key, brand_name, brand_type, status)\nvalues ('006f006f-006f-006f-006f-006f006f0201', '${org}', '${hubId}', 'brand-northstar-0804', 'Northstar Dining', 'franchise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_branches (id, organization_id, hub_id, branch_key, branch_name, branch_address, status)\nvalues ('00700070-0070-0070-0070-007000700301', '${org}', '${hubId}', 'branch-downtown-0804', 'Downtown Branch', '123 Main Street', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_business_licenses (id, organization_id, hub_id, license_key, license_name, license_type, status)\nvalues ('00710071-0071-0071-0071-007100710401', '${org}', '${hubId}', 'lic-food-0804', 'Food Service License', 'food_service', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_dining_areas (id, organization_id, hub_id, area_key, area_name, area_type, status)\nvalues ('00720072-0072-0072-0072-007200720501', '${org}', '${hubId}', 'area-patio-0804', 'Patio Dining', 'outdoor', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_restaurant_tables (id, organization_id, hub_id, table_key, table_name, qr_code, table_status, floor_ref, seats, status)\nvalues ('00730073-0073-0073-0073-007300730601', '${org}', '${hubId}', 'tbl-12-0804', 'Table 12', 'QR-TBL-12', 'available', 'floor-1', 4, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Menu\n`;
    sql += `insert into public.rst_menu_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('00740074-0074-0074-0074-007400740701', '${org}', '${hubId}', 'cat-mains-0804', 'Main Courses', 'main', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_menu_items (id, organization_id, hub_id, item_key, item_name, item_price, status)\nvalues ('00750075-0075-0075-0075-007500750801', '${org}', '${hubId}', 'item-pasta-0804', 'Truffle Pasta', 18.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_menu_variants (id, organization_id, hub_id, variant_key, variant_name, variant_type, status)\nvalues ('00760076-0076-0076-0076-007600760901', '${org}', '${hubId}', 'var-large-0804', 'Large Portion', 'size', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_add_ons (id, organization_id, hub_id, addon_key, addon_name, addon_price, status)\nvalues ('00770077-0077-0077-0077-007700770a01', '${org}', '${hubId}', 'addon-cheese-0804', 'Extra Cheese', 2.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_combo_meals (id, organization_id, hub_id, combo_key, combo_name, combo_price, status)\nvalues ('00780078-0078-0078-0078-007800780b01', '${org}', '${hubId}', 'combo-lunch-0804', 'Lunch Combo', 14.99, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Orders\n`;
    sql += `insert into public.rst_orders (id, organization_id, hub_id, order_key, order_number, order_type, status)\nvalues ('00790079-0079-0079-0079-007900790c01', '${org}', '${hubId}', 'ord-1042-0804', 'ORD-1042', 'dine-in', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_order_items (id, organization_id, hub_id, item_key, item_name, item_quantity, status)\nvalues ('007a007a-007a-007a-007a-007a007a0d01', '${org}', '${hubId}', 'oi-pasta-0804', 'Truffle Pasta', 2, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_order_queue (id, organization_id, hub_id, queue_key, queue_name, queue_status, status)\nvalues ('007b007b-007b-007b-007b-007b007b0e01', '${org}', '${hubId}', 'que-1042-0804', 'Order Queue #1042', 'waiting', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_kitchen_routing (id, organization_id, hub_id, routing_key, routing_name, routing_status, status)\nvalues ('007c007c-007c-007c-007c-007c007c0f01', '${org}', '${hubId}', 'route-grill-0804', 'Grill Station Route', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_order_timeline (id, organization_id, hub_id, timeline_key, timeline_event, timeline_status, status)\nvalues ('007d007d-007d-007d-007d-007d007d1001', '${org}', '${hubId}', 'tl-placed-0804', 'Order Placed', 'completed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Kitchen\n`;
    sql += `insert into public.rst_kitchen_stations (id, organization_id, hub_id, station_key, station_name, station_type, status)\nvalues ('007e007e-007e-007e-007e-007e007e1101', '${org}', '${hubId}', 'sta-grill-0804', 'Grill Station', 'grill', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_preparation_queue (id, organization_id, hub_id, prep_key, prep_name, prep_status, status)\nvalues ('007f007f-007f-007f-007f-007f007f1201', '${org}', '${hubId}', 'prep-1042-0804', 'Prep Order #1042', 'queued', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_cooking_status (id, organization_id, hub_id, cooking_key, cooking_name, cooking_status, status)\nvalues ('00800080-0080-0080-0080-008000801301', '${org}', '${hubId}', 'cook-1042-0804', 'Cooking Order #1042', 'preparing', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_ready_queue (id, organization_id, hub_id, ready_key, ready_name, ready_status, status)\nvalues ('00810081-0081-0081-0081-008100811401', '${org}', '${hubId}', 'ready-1042-0804', 'Ready Order #1042', 'ready', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_rush_orders (id, organization_id, hub_id, rush_key, rush_name, rush_priority, status)\nvalues ('00820082-0082-0082-0082-008200821501', '${org}', '${hubId}', 'rush-vip-0804', 'VIP Rush Order', 'high', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Customer\n`;
    sql += `insert into public.rst_reservations (id, organization_id, hub_id, reservation_key, reservation_name, reservation_status, status)\nvalues ('00830083-0083-0083-0083-008300831601', '${org}', '${hubId}', 'res-smith-0804', 'Smith Party Reservation', 'confirmed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_waiting_list (id, organization_id, hub_id, wait_key, wait_name, wait_status, status)\nvalues ('00840084-0084-0084-0084-008400841701', '${org}', '${hubId}', 'wait-jones-0804', 'Jones Party Waiting', 'waiting', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_customer_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('00850085-0085-0085-0085-008500851801', '${org}', '${hubId}', 'prof-vip-0804', 'VIP Customer Profile', 'vip', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_loyalty_programs (id, organization_id, hub_id, program_key, program_name, program_type, status)\nvalues ('00860086-0086-0086-0086-008600861901', '${org}', '${hubId}', 'prog-points-0804', 'Points Rewards Program', 'points', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_feedback_reviews (id, organization_id, hub_id, review_key, review_title, review_rating, status)\nvalues ('00870087-0087-0087-0087-008700871a01', '${org}', '${hubId}', 'rev-great-0804', 'Excellent Dining Experience', 4.8, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Analytics/Dashboard\n`;
    sql += `insert into public.rst_restaurant_metrics (id, organization_id, metrics_key, order_count, revenue_total, average_bill, occupancy_rate, popular_dish_score, peak_hour_score, customer_growth_rate, kitchen_performance_score, overall_restaurant_score, status)\nvalues ('00880088-0088-0088-0088-008800881b01', '${org}', 'rst-metrics-0804', 850, 42500.00, 50.00, 78.50, 92.00, 88.00, 12.50, 91.00, 94.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_restaurant_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_orders_count, kitchen_queue_depth, framework_health_status, summary, status)\nvalues ('00890089-0089-0089-0089-008900891c01', '${org}', 'rst-health-0804', 95.00, false, 5, 3, 'healthy', 'Restaurant business operating system operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_revenue_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00900090-0090-0090-0090-009000901d01', '${org}', '${hubId}', 'anly-rev-0804', 'revenue', 96.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_kitchen_performance (id, organization_id, hub_id, performance_key, performance_type, performance_score, status)\nvalues ('00910091-0091-0091-0091-009100911e01', '${org}', '${hubId}', 'perf-kitchen-0804', 'kitchen', 93.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_restaurant_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00920092-0092-0092-0092-009200922001', '${org}', '${hubId}', 'fail-ord-0804', 'order', 'ORD_TIMEOUT', 'Order processing timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.rst_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00930093-0093-0093-0093-009300932101', '${org}', 'restaurant_hub', 'seed', 'Enterprise restaurant business operating system seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgRstRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgRstRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgRstRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020038_enterprise_restaurant_business_os.sql");
const seedPath = join(root, "supabase/seed/038_enterprise_restaurant_business_os_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/restaurant-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbRstRestaurantHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Restaurant Business Operating System artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbRst* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-restaurant-ui.mjs");

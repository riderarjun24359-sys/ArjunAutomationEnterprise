#!/usr/bin/env node
/**
 * Generates V2 Program F Capability Wave 1 Company Foundation artifacts.
 * Run: node scripts/generate-enterprise-company-foundation.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "cmp";
const Pascal = "Cmp";
const camel = "cmp";
const permResource = "company_foundation";

const hubTable = `${PREFIX}_company_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_company_metrics`, `${PREFIX}_company_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "companyHubs", plural: "companyHubs", singular: "CompanyHub", pascal: "CompanyHub", db: `${camel}CompanyHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  company_tier text not null default 'enterprise'" },
    { tab: "brandProfiles", plural: "brandProfiles", singular: "BrandProfile", pascal: "BrandProfile", db: `${camel}BrandProfiles`, table: `${PREFIX}_brand_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "brandStatus", type: "select", options: "BRAND_STATUS_OPTIONS" }], display: { title: "profileName", sub: "brandStatus" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  brand_status text not null default 'draft',\n  brand_summary text not null default ''" },
    { tab: "logoAssets", plural: "logoAssets", singular: "LogoAsset", pascal: "LogoAsset", db: `${camel}LogoAssets`, table: `${PREFIX}_logo_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  asset_type text not null default 'primary',\n  asset_url text not null default ''" },
    { tab: "themeConfigs", plural: "themeConfigs", singular: "ThemeConfig", pascal: "ThemeConfig", db: `${camel}ThemeConfigs`, table: `${PREFIX}_theme_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }, { name: "primaryColor", type: "string" }], display: { title: "configName", sub: "primaryColor" }, sqlExtra: "config_key text not null,\n  config_name text not null default '',\n  primary_color text not null default '#059669',\n  secondary_color text not null default '#047857'" },
    { tab: "brandAssets", plural: "brandAssets", singular: "BrandAsset", pascal: "BrandAsset", db: `${camel}BrandAssets`, table: `${PREFIX}_brand_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetCategory", type: "string" }], display: { title: "assetName", sub: "assetCategory" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  asset_category text not null default 'marketing',\n  asset_ref text not null default ''" },
    { tab: "websitePages", plural: "websitePages", singular: "WebsitePage", pascal: "WebsitePage", db: `${camel}WebsitePages`, table: `${PREFIX}_website_pages`, fields: [{ name: "pageKey", type: "string" }, { name: "pageTitle", type: "string" }, { name: "pageSlug", type: "string" }], display: { title: "pageTitle", sub: "pageSlug" }, sqlExtra: "page_key text not null,\n  page_title text not null default '',\n  page_slug text not null default '',\n  page_status text not null default 'draft'" },
    { tab: "websiteFeatures", plural: "websiteFeatures", singular: "WebsiteFeature", pascal: "WebsiteFeature", db: `${camel}WebsiteFeatures`, table: `${PREFIX}_website_features`, fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }, { name: "featureType", type: "string" }], display: { title: "featureName", sub: "featureType" }, sqlExtra: "feature_key text not null,\n  feature_name text not null default '',\n  feature_type text not null default 'core',\n  feature_summary text not null default ''" },
    { tab: "websiteSections", plural: "websiteSections", singular: "WebsiteSection", pascal: "WebsiteSection", db: `${camel}WebsiteSections`, table: `${PREFIX}_website_sections`, fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionType", type: "string" }], display: { title: "sectionName", sub: "sectionType" }, sqlExtra: "section_key text not null,\n  section_name text not null default '',\n  section_type text not null default 'hero',\n  section_order integer not null default 0" },
    { tab: "demoRequests", plural: "demoRequests", singular: "DemoRequest", pascal: "DemoRequest", db: `${camel}DemoRequests`, table: `${PREFIX}_demo_requests`, fields: [{ name: "requestKey", type: "string" }, { name: "requestName", type: "string" }, { name: "requestStatus", type: "select", options: "DEMO_REQUEST_STATUS_OPTIONS" }], display: { title: "requestName", sub: "requestStatus" }, sqlExtra: "request_key text not null,\n  request_name text not null default '',\n  request_status text not null default 'pending',\n  contact_email text not null default '',\n  requested_at timestamptz not null default now()" },
    { tab: "pricingPlans", plural: "pricingPlans", singular: "PricingPlan", pascal: "PricingPlan", db: `${camel}PricingPlans`, table: `${PREFIX}_pricing_plans`, fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "planTier", type: "string" }], display: { title: "planName", sub: "planTier" }, sqlExtra: "plan_key text not null,\n  plan_name text not null default '',\n  plan_tier text not null default 'standard',\n  base_price numeric(12, 2) not null default 0" },
    { tab: "pricingPackages", plural: "pricingPackages", singular: "PricingPackage", pascal: "PricingPackage", db: `${camel}PricingPackages`, table: `${PREFIX}_pricing_packages`, fields: [{ name: "packageKey", type: "string" }, { name: "packageName", type: "string" }, { name: "packageType", type: "string" }], display: { title: "packageName", sub: "packageType" }, sqlExtra: "package_key text not null,\n  package_name text not null default '',\n  package_type text not null default 'bundle',\n  package_price numeric(12, 2) not null default 0" },
    { tab: "modulePricing", plural: "modulePricing", singular: "ModulePricing", pascal: "ModulePricing", db: `${camel}ModulePricing`, table: `${PREFIX}_module_pricing`, fields: [{ name: "pricingKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "priceAmount", type: "number" }], display: { title: "moduleName", sub: "priceAmount" }, sqlExtra: "pricing_key text not null,\n  module_name text not null default '',\n  price_amount numeric(12, 2) not null default 0,\n  billing_cycle text not null default 'monthly'" },
    { tab: "discountRules", plural: "discountRules", singular: "DiscountRule", pascal: "DiscountRule", db: `${camel}DiscountRules`, table: `${PREFIX}_discount_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "discountPercent", type: "number" }], display: { title: "ruleName", sub: "discountPercent" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  discount_percent numeric(5, 2) not null default 0,\n  rule_type text not null default 'volume'" },
    { tab: "proposals", plural: "proposals", singular: "Proposal", pascal: "Proposal", db: `${camel}Proposals`, table: `${PREFIX}_proposals`, fields: [{ name: "proposalKey", type: "string" }, { name: "proposalName", type: "string" }, { name: "proposalStatus", type: "select", options: "PROPOSAL_STATUS_OPTIONS" }], display: { title: "proposalName", sub: "proposalStatus" }, sqlExtra: "proposal_key text not null,\n  proposal_name text not null default '',\n  proposal_status text not null default 'draft',\n  proposal_value numeric(12, 2) not null default 0" },
    { tab: "proposalDocuments", plural: "proposalDocuments", singular: "ProposalDocument", pascal: "ProposalDocument", db: `${camel}ProposalDocuments`, table: `${PREFIX}_proposal_documents`, fields: [{ name: "documentKey", type: "string" }, { name: "documentName", type: "string" }, { name: "documentType", type: "string" }], display: { title: "documentName", sub: "documentType" }, sqlExtra: "document_key text not null,\n  document_name text not null default '',\n  document_type text not null default 'pdf',\n  document_ref text not null default ''" },
    { tab: "proposalContracts", plural: "proposalContracts", singular: "ProposalContract", pascal: "ProposalContract", db: `${camel}ProposalContracts`, table: `${PREFIX}_proposal_contracts`, fields: [{ name: "contractKey", type: "string" }, { name: "contractName", type: "string" }, { name: "contractStatus", type: "select", options: "CONTRACT_STATUS_OPTIONS" }], display: { title: "contractName", sub: "contractStatus" }, sqlExtra: "contract_key text not null,\n  contract_name text not null default '',\n  contract_status text not null default 'pending',\n  contract_value numeric(12, 2) not null default 0" },
    { tab: "proposalHistory", plural: "proposalHistory", singular: "ProposalHistory", pascal: "ProposalHistory", db: `${camel}ProposalHistory`, table: `${PREFIX}_proposal_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "changedAt", type: "string" }], display: { title: "historyKey", sub: "historyType" }, sqlExtra: "history_key text not null,\n  history_type text not null default 'revision',\n  changed_at timestamptz not null default now(),\n  change_summary text not null default ''" },
    { tab: "portalDashboards", plural: "portalDashboards", singular: "PortalDashboard", pascal: "PortalDashboard", db: `${camel}PortalDashboards`, table: `${PREFIX}_portal_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardType", type: "string" }], display: { title: "dashboardName", sub: "dashboardType" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_type text not null default 'customer',\n  widget_count integer not null default 0" },
    { tab: "portalSubscriptions", plural: "portalSubscriptions", singular: "PortalSubscription", pascal: "PortalSubscription", db: `${camel}PortalSubscriptions`, table: `${PREFIX}_portal_subscriptions`, fields: [{ name: "subscriptionKey", type: "string" }, { name: "planName", type: "string" }, { name: "subscriptionStatus", type: "select", options: "SUBSCRIPTION_STATUS_OPTIONS" }], display: { title: "planName", sub: "subscriptionStatus" }, sqlExtra: "subscription_key text not null,\n  plan_name text not null default '',\n  subscription_status text not null default 'active',\n  seat_count integer not null default 1" },
    { tab: "portalBilling", plural: "portalBilling", singular: "PortalBilling", pascal: "PortalBilling", db: `${camel}PortalBilling`, table: `${PREFIX}_portal_billing`, fields: [{ name: "billingKey", type: "string" }, { name: "billingType", type: "string" }, { name: "billingAmount", type: "number" }], display: { title: "billingKey", sub: "billingType" }, sqlExtra: "billing_key text not null,\n  billing_type text not null default 'invoice',\n  billing_amount numeric(12, 2) not null default 0,\n  billing_date date not null default current_date" },
    { tab: "portalSupport", plural: "portalSupport", singular: "PortalSupport", pascal: "PortalSupport", db: `${camel}PortalSupport`, table: `${PREFIX}_portal_support`, fields: [{ name: "supportKey", type: "string" }, { name: "supportTitle", type: "string" }, { name: "supportStatus", type: "select", options: "SUPPORT_STATUS_OPTIONS" }], display: { title: "supportTitle", sub: "supportStatus" }, sqlExtra: "support_key text not null,\n  support_title text not null default '',\n  support_status text not null default 'open',\n  priority text not null default 'normal'" },
    { tab: "docGuides", plural: "docGuides", singular: "DocGuide", pascal: "DocGuide", db: `${camel}DocGuides`, table: `${PREFIX}_doc_guides`, fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideCategory", type: "string" }], display: { title: "guideTitle", sub: "guideCategory" }, sqlExtra: "guide_key text not null,\n  guide_title text not null default '',\n  guide_category text not null default 'getting_started',\n  guide_summary text not null default ''" },
    { tab: "docApiReferences", plural: "docApiReferences", singular: "DocApiReference", pascal: "DocApiReference", db: `${camel}DocApiReferences`, table: `${PREFIX}_doc_api_references`, fields: [{ name: "referenceKey", type: "string" }, { name: "referenceName", type: "string" }, { name: "apiVersion", type: "string" }], display: { title: "referenceName", sub: "apiVersion" }, sqlExtra: "reference_key text not null,\n  reference_name text not null default '',\n  api_version text not null default 'v1',\n  endpoint_count integer not null default 0" },
    { tab: "docVersions", plural: "docVersions", singular: "DocVersion", pascal: "DocVersion", db: `${camel}DocVersions`, table: `${PREFIX}_doc_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionName", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionName", sub: "versionNumber" }, sqlExtra: "version_key text not null,\n  version_name text not null default '',\n  version_number text not null default '1.0.0',\n  released_at timestamptz" },
    { tab: "demoOrganizations", plural: "demoOrganizations", singular: "DemoOrganization", pascal: "DemoOrganization", db: `${camel}DemoOrganizations`, table: `${PREFIX}_demo_organizations`, fields: [{ name: "orgKey", type: "string" }, { name: "orgName", type: "string" }, { name: "orgType", type: "string" }], display: { title: "orgName", sub: "orgType" }, sqlExtra: "org_key text not null,\n  org_name text not null default '',\n  org_type text not null default 'sandbox',\n  region text not null default ''" },
    { tab: "demoDataSets", plural: "demoDataSets", singular: "DemoDataSet", pascal: "DemoDataSet", db: `${camel}DemoDataSets`, table: `${PREFIX}_demo_data_sets`, fields: [{ name: "datasetKey", type: "string" }, { name: "datasetName", type: "string" }, { name: "recordCount", type: "number" }], display: { title: "datasetName", sub: "recordCount" }, sqlExtra: "dataset_key text not null,\n  dataset_name text not null default '',\n  record_count integer not null default 0,\n  dataset_type text not null default 'sample'" },
    { tab: "demoUsers", plural: "demoUsers", singular: "DemoUser", pascal: "DemoUser", db: `${camel}DemoUsers`, table: `${PREFIX}_demo_users`, fields: [{ name: "userKey", type: "string" }, { name: "userName", type: "string" }, { name: "userRole", type: "string" }], display: { title: "userName", sub: "userRole" }, sqlExtra: "user_key text not null,\n  user_name text not null default '',\n  user_role text not null default 'viewer',\n  user_email text not null default ''" },
    { tab: "companyMetrics", plural: "companyMetrics", singular: "CompanyMetric", pascal: "CompanyMetric", db: `${camel}CompanyMetrics`, table: `${PREFIX}_company_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallCompanyScore", type: "number" }, { name: "platformHealthScore", type: "number" }], display: { title: "metricsKey", sub: "overallCompanyScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  website_analytics_score numeric(5, 2) not null default 100,\n  demo_request_count integer not null default 0,\n  active_customer_count integer not null default 0,\n  revenue_total numeric(14, 2) not null default 0,\n  proposal_pending_count integer not null default 0,\n  support_open_count integer not null default 0,\n  platform_health_score numeric(5, 2) not null default 100,\n  overall_company_score numeric(5, 2) not null default 100" },
    { tab: "companyHealth", plural: "companyHealth", singular: "CompanyHealth", pascal: "CompanyHealth", db: `${camel}CompanyHealth`, table: `${PREFIX}_company_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  website_status text not null default 'healthy',\n  revenue_status text not null default 'healthy',\n  support_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: `${camel}ExecutiveKpis`, table: `${PREFIX}_executive_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'executive',\n  metric_date date not null default current_date" },
    { tab: "companyFailures", plural: "companyFailures", singular: "CompanyFailure", pascal: "CompanyFailure", db: `${camel}CompanyFailures`, table: `${PREFIX}_company_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'website',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program F Capability Wave 1: Company Foundation\n\n";
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
        sql += `  id uuid primary key default uuid_generate_v4(),\n`;
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
    sql += `  id uuid primary key default uuid_generate_v4(),\n`;
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
    sql += `  ('${PREFIX}.view', 'View company foundation data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage brand, website, pricing, proposal, portal, documentation, demo, and dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve company foundation gates and publishing actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer company foundation governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00730073-0073-0073-0073-007300730101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a343', '${org}', 'Company Foundation Orchestrator', 'company_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand","website","pricing","proposal","customer_portal","documentation","demo","dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a543', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a343', 'northstar-company-foundation-001', 'company_foundation', 'company_hub', '${hubId}', '{"objective":"Company foundation for northstar platform brand, website, pricing, and portal"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- G0 Company Hub\n`;
    sql += `insert into public.cmp_company_hubs (id, organization_id, hub_key, hub_name, environment, company_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-company-foundation', 'Northstar Company Foundation Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G1 Brand\n`;
    sql += `insert into public.cmp_brand_profiles (id, organization_id, hub_id, profile_key, profile_name, brand_status, status)\nvalues ('04300100-0430-0430-0430-043001000101', '${org}', '${hubId}', 'brand-profile-0904', 'Northstar Brand Profile', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_logo_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)\nvalues ('04310101-0431-0431-0431-043101010201', '${org}', '${hubId}', 'logo-primary-0904', 'Northstar Primary Logo', 'primary', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_theme_configs (id, organization_id, hub_id, config_key, config_name, primary_color, status)\nvalues ('04320102-0432-0432-0432-043201020301', '${org}', '${hubId}', 'theme-emerald-0904', 'Emerald Theme', '#059669', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_brand_assets (id, organization_id, hub_id, asset_key, asset_name, asset_category, status)\nvalues ('04330103-0433-0433-0433-043301030401', '${org}', '${hubId}', 'brand-asset-0904', 'Marketing Banner', 'marketing', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G2 Website\n`;
    sql += `insert into public.cmp_website_pages (id, organization_id, hub_id, page_key, page_title, page_slug, status)\nvalues ('04340104-0434-0434-0434-043401040501', '${org}', '${hubId}', 'page-home-0904', 'Home Page', 'home', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_website_features (id, organization_id, hub_id, feature_key, feature_name, feature_type, status)\nvalues ('04350105-0435-0435-0435-043501050601', '${org}', '${hubId}', 'feat-automation-0904', 'Automation Engine', 'core', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_website_sections (id, organization_id, hub_id, section_key, section_name, section_type, status)\nvalues ('04360106-0436-0436-0436-043601060701', '${org}', '${hubId}', 'section-hero-0904', 'Hero Section', 'hero', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_demo_requests (id, organization_id, hub_id, request_key, request_name, request_status, status)\nvalues ('04370107-0437-0437-0437-043701070801', '${org}', '${hubId}', 'demo-req-0904', 'Enterprise Demo Request', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G3 Pricing\n`;
    sql += `insert into public.cmp_pricing_plans (id, organization_id, hub_id, plan_key, plan_name, plan_tier, status)\nvalues ('04380108-0438-0438-0438-043801080901', '${org}', '${hubId}', 'plan-enterprise-0904', 'Enterprise Plan', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_pricing_packages (id, organization_id, hub_id, package_key, package_name, package_type, status)\nvalues ('04390109-0439-0439-0439-043901090a01', '${org}', '${hubId}', 'pkg-platform-0904', 'Platform Bundle', 'bundle', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_module_pricing (id, organization_id, hub_id, pricing_key, module_name, price_amount, status)\nvalues ('043a010a-043a-043a-043a-043a010a0b01', '${org}', '${hubId}', 'mod-price-0904', 'Workflow Engine', 499.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_discount_rules (id, organization_id, hub_id, rule_key, rule_name, discount_percent, status)\nvalues ('043b010b-043b-043b-043b-043b010b0c01', '${org}', '${hubId}', 'disc-volume-0904', 'Volume Discount', 15.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G4 Proposal\n`;
    sql += `insert into public.cmp_proposals (id, organization_id, hub_id, proposal_key, proposal_name, proposal_status, status)\nvalues ('043c010c-043c-043c-043c-043c010c0d01', '${org}', '${hubId}', 'prop-enterprise-0904', 'Enterprise Proposal', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_proposal_documents (id, organization_id, hub_id, document_key, document_name, document_type, status)\nvalues ('043d010d-043d-043d-043d-043d010d0e01', '${org}', '${hubId}', 'doc-proposal-0904', 'Proposal PDF', 'pdf', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_proposal_contracts (id, organization_id, hub_id, contract_key, contract_name, contract_status, status)\nvalues ('043e010e-043e-043e-043e-043e010e0f01', '${org}', '${hubId}', 'contract-0904', 'Enterprise Contract', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_proposal_history (id, organization_id, hub_id, history_key, history_type, status)\nvalues ('043f010f-043f-043f-043f-043f010f1001', '${org}', '${hubId}', 'hist-revision-0904', 'revision', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G5 Customer Portal\n`;
    sql += `insert into public.cmp_portal_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_type, status)\nvalues ('04400110-0440-0440-0440-044001101101', '${org}', '${hubId}', 'dash-customer-0904', 'Customer Dashboard', 'customer', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_portal_subscriptions (id, organization_id, hub_id, subscription_key, plan_name, subscription_status, status)\nvalues ('04410111-0441-0441-0441-044101111201', '${org}', '${hubId}', 'sub-portal-0904', 'Enterprise Plan', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_portal_billing (id, organization_id, hub_id, billing_key, billing_type, billing_amount, status)\nvalues ('04420112-0442-0442-0442-044201121301', '${org}', '${hubId}', 'bill-invoice-0904', 'invoice', 4999.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_portal_support (id, organization_id, hub_id, support_key, support_title, support_status, status)\nvalues ('04430113-0443-0443-0443-044301131401', '${org}', '${hubId}', 'support-0904', 'Portal Support Request', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G6 Documentation\n`;
    sql += `insert into public.cmp_doc_guides (id, organization_id, hub_id, guide_key, guide_title, guide_category, status)\nvalues ('04440114-0444-0444-0444-044401141501', '${org}', '${hubId}', 'guide-start-0904', 'Getting Started Guide', 'getting_started', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_doc_api_references (id, organization_id, hub_id, reference_key, reference_name, api_version, status)\nvalues ('04450115-0445-0445-0445-044501151601', '${org}', '${hubId}', 'api-ref-0904', 'Platform API Reference', 'v1', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_doc_versions (id, organization_id, hub_id, version_key, version_name, version_number, status)\nvalues ('04460116-0446-0446-0446-044601161701', '${org}', '${hubId}', 'doc-ver-0904', 'Documentation v1', '1.0.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G7 Demo\n`;
    sql += `insert into public.cmp_demo_organizations (id, organization_id, hub_id, org_key, org_name, org_type, status)\nvalues ('04470117-0447-0447-0447-044701171801', '${org}', '${hubId}', 'demo-org-0904', 'Demo Sandbox Org', 'sandbox', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_demo_data_sets (id, organization_id, hub_id, dataset_key, dataset_name, record_count, status)\nvalues ('04480118-0448-0448-0448-044801181901', '${org}', '${hubId}', 'demo-dataset-0904', 'Sample Customer Data', 500, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_demo_users (id, organization_id, hub_id, user_key, user_name, user_role, status)\nvalues ('04490119-0449-0449-0449-044901191a01', '${org}', '${hubId}', 'demo-user-0904', 'Demo Admin', 'admin', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G8 Dashboard\n`;
    sql += `insert into public.cmp_company_metrics (id, organization_id, metrics_key, website_analytics_score, demo_request_count, active_customer_count, revenue_total, proposal_pending_count, support_open_count, platform_health_score, overall_company_score, status)\nvalues ('044a011a-044a-044a-044a-044a011a1b01', '${org}', 'cmp-metrics-0904', 94.00, 12, 45, 125000.00, 5, 3, 96.00, 95.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_company_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, website_status, revenue_status, support_status, security_status, summary, status)\nvalues ('044b011b-044b-044b-044b-044b011b1c01', '${org}', 'cmp-health-0904', 95.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Company foundation operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('044c011c-044c-044c-044c-044c011c1d01', '${org}', '${hubId}', 'kpi-exec-0904', 'Executive KPI Score', 97.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_company_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('044d011d-044d-044d-044d-044d011d1e01', '${org}', '${hubId}', 'fail-website-0904', 'website', 'PAGE_RENDER_ERROR', 'Home page render timeout', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.cmp_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('044e011e-044e-044e-044e-044e011e1f01', '${org}', 'company_hub', 'seed', 'Company foundation seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgCmpRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgCmpRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgCmpRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020043_company_foundation.sql");
const seedPath = join(root, "supabase/seed/043_company_foundation_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/company-foundation-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbCmpCompanyHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Company Foundation artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbCmp* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-company-foundation-ui.mjs");

#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 1 Enterprise Industry Framework Core artifacts.
 * Run: node scripts/generate-enterprise-industry-framework.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "ifr";
const Pascal = "Ifr";
const camel = "ifr";
const permResource = "enterprise_industry_framework_core";

const hubTable = `${PREFIX}_framework_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_framework_metrics`, `${PREFIX}_framework_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "frameworkHubs", plural: "frameworkHubs", singular: "FrameworkHub", pascal: "FrameworkHub", db: `${camel}FrameworkHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "industryRegistrations", plural: "industryRegistrations", singular: "IndustryRegistration", pascal: "IndustryRegistration", db: `${camel}IndustryRegistrations`, table: `${PREFIX}_industry_registrations`, fields: [{ name: "registrationKey", type: "string" }, { name: "industryCode", type: "string" }, { name: "industryName", type: "string" }], display: { title: "industryName", sub: "industryCode" }, sqlExtra: "registration_key text not null,\n  industry_code text not null default '',\n  industry_name text not null default '',\n  registered_at timestamptz not null default now()" },
    { tab: "industryMetadata", plural: "industryMetadata", singular: "IndustryMetadata", pascal: "IndustryMetadata", db: `${camel}IndustryMetadata`, table: `${PREFIX}_industry_metadata`, fields: [{ name: "metadataKey", type: "string" }, { name: "metadataType", type: "string" }, { name: "metadataValue", type: "string" }], display: { title: "metadataKey", sub: "metadataType" }, sqlExtra: "metadata_key text not null,\n  metadata_type text not null default 'profile',\n  metadata_value jsonb not null default '{}'::jsonb,\n  updated_at_ref timestamptz not null default now()" },
    { tab: "industryVersions", plural: "industryVersions", singular: "IndustryVersion", pascal: "IndustryVersion", db: `${camel}IndustryVersions`, table: `${PREFIX}_industry_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  published_at timestamptz" },
    { tab: "industryDependencies", plural: "industryDependencies", singular: "IndustryDependency", pascal: "IndustryDependency", db: `${camel}IndustryDependencies`, table: `${PREFIX}_industry_dependencies`, fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" }, sqlExtra: "dependency_key text not null,\n  dependency_type text not null default 'module',\n  dependency_ref text not null default '',\n  resolved_at timestamptz" },
    { tab: "businessTypes", plural: "businessTypes", singular: "BusinessType", pascal: "BusinessType", db: `${camel}BusinessTypes`, table: `${PREFIX}_business_types`, fields: [{ name: "typeKey", type: "string" }, { name: "typeName", type: "string" }, { name: "typeCategory", type: "string" }], display: { title: "typeName", sub: "typeCategory" }, sqlExtra: "type_key text not null,\n  type_name text not null default '',\n  type_category text not null default 'general',\n  description text not null default ''" },
    { tab: "businessSizes", plural: "businessSizes", singular: "BusinessSize", pascal: "BusinessSize", db: `${camel}BusinessSizes`, table: `${PREFIX}_business_sizes`, fields: [{ name: "sizeKey", type: "string" }, { name: "sizeLabel", type: "string" }, { name: "employeeRange", type: "string" }], display: { title: "sizeLabel", sub: "employeeRange" }, sqlExtra: "size_key text not null,\n  size_label text not null default '',\n  employee_range text not null default '',\n  revenue_range text not null default ''" },
    { tab: "operatingModels", plural: "operatingModels", singular: "OperatingModel", pascal: "OperatingModel", db: `${camel}OperatingModels`, table: `${PREFIX}_operating_models`, fields: [{ name: "modelKey", type: "string" }, { name: "modelName", type: "string" }, { name: "modelType", type: "string" }], display: { title: "modelName", sub: "modelType" }, sqlExtra: "model_key text not null,\n  model_name text not null default '',\n  model_type text not null default 'saas',\n  description text not null default ''" },
    { tab: "industryProfiles", plural: "industryProfiles", singular: "IndustryProfile", pascal: "IndustryProfile", db: `${camel}IndustryProfiles`, table: `${PREFIX}_industry_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileScore", type: "number" }], display: { title: "profileName", sub: "profileScore" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_score numeric(5, 2) not null default 0,\n  profile_summary text not null default ''" },
    { tab: "dashboardTemplates", plural: "dashboardTemplates", singular: "DashboardTemplate", pascal: "DashboardTemplate", db: `${camel}DashboardTemplates`, table: `${PREFIX}_dashboard_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateVersion", type: "string" }], display: { title: "templateName", sub: "templateVersion" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_version text not null default '1.0',\n  layout_ref text not null default ''" },
    { tab: "workflowTemplates", plural: "workflowTemplates", singular: "WorkflowTemplate", pascal: "WorkflowTemplate", db: `${camel}WorkflowTemplates`, table: `${PREFIX}_workflow_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "workflowType", type: "string" }], display: { title: "templateName", sub: "workflowType" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  workflow_type text not null default 'automation',\n  steps_count integer not null default 0" },
    { tab: "roleTemplates", plural: "roleTemplates", singular: "RoleTemplate", pascal: "RoleTemplate", db: `${camel}RoleTemplates`, table: `${PREFIX}_role_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "roleName", type: "string" }, { name: "permissionsCount", type: "number" }], display: { title: "roleName", sub: "permissionsCount" }, sqlExtra: "template_key text not null,\n  role_name text not null default '',\n  permissions_count integer not null default 0,\n  role_level text not null default 'standard'" },
    { tab: "reportTemplates", plural: "reportTemplates", singular: "ReportTemplate", pascal: "ReportTemplate", db: `${camel}ReportTemplates`, table: `${PREFIX}_report_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "reportName", type: "string" }, { name: "reportFormat", type: "string" }], display: { title: "reportName", sub: "reportFormat" }, sqlExtra: "template_key text not null,\n  report_name text not null default '',\n  report_format text not null default 'pdf',\n  schedule_ref text not null default ''" },
    { tab: "dynamicConfigurations", plural: "dynamicConfigurations", singular: "DynamicConfiguration", pascal: "DynamicConfiguration", db: `${camel}DynamicConfigurations`, table: `${PREFIX}_dynamic_configurations`, fields: [{ name: "configKey", type: "string" }, { name: "configType", type: "string" }, { name: "configValue", type: "string" }], display: { title: "configKey", sub: "configType" }, sqlExtra: "config_key text not null,\n  config_type text not null default 'feature',\n  config_value jsonb not null default '{}'::jsonb,\n  effective_at timestamptz not null default now()" },
    { tab: "featureConfigurations", plural: "featureConfigurations", singular: "FeatureConfiguration", pascal: "FeatureConfiguration", db: `${camel}FeatureConfigurations`, table: `${PREFIX}_feature_configurations`, fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "featureName", sub: "featureKey" }, sqlExtra: "feature_key text not null,\n  feature_name text not null default '',\n  enabled boolean not null default true,\n  rollout_percentage numeric(5, 2) not null default 100" },
    { tab: "businessRules", plural: "businessRules", singular: "BusinessRule", pascal: "BusinessRule", db: `${camel}BusinessRules`, table: `${PREFIX}_business_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_type text not null default 'validation',\n  rule_expression text not null default ''" },
    { tab: "validationRules", plural: "validationRules", singular: "ValidationRule", pascal: "ValidationRule", db: `${camel}ValidationRules`, table: `${PREFIX}_validation_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "ruleName", sub: "validationScore" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  validation_type text not null default 'schema',\n  validation_score numeric(5, 2) not null default 0" },
    { tab: "industryContexts", plural: "industryContexts", singular: "IndustryContext", pascal: "IndustryContext", db: `${camel}IndustryContexts`, table: `${PREFIX}_industry_contexts`, fields: [{ name: "contextKey", type: "string" }, { name: "contextType", type: "string" }, { name: "contextPayload", type: "string" }], display: { title: "contextKey", sub: "contextType" }, sqlExtra: "context_key text not null,\n  context_type text not null default 'operational',\n  context_payload jsonb not null default '{}'::jsonb,\n  refreshed_at timestamptz not null default now()" },
    { tab: "aiContexts", plural: "aiContexts", singular: "AiContext", pascal: "AiContext", db: `${camel}AiContexts`, table: `${PREFIX}_ai_contexts`, fields: [{ name: "contextKey", type: "string" }, { name: "contextType", type: "string" }, { name: "tokenCount", type: "number" }], display: { title: "contextKey", sub: "contextType" }, sqlExtra: "context_key text not null,\n  context_type text not null default 'prompt',\n  model_ref text not null default '',\n  token_count integer not null default 0" },
    { tab: "terminologyEntries", plural: "terminologyEntries", singular: "TerminologyEntry", pascal: "TerminologyEntry", db: `${camel}TerminologyEntries`, table: `${PREFIX}_terminology_entries`, fields: [{ name: "termKey", type: "string" }, { name: "termLabel", type: "string" }, { name: "termDefinition", type: "string" }], display: { title: "termLabel", sub: "termKey" }, sqlExtra: "term_key text not null,\n  term_label text not null default '',\n  term_definition text not null default '',\n  locale text not null default 'en'" },
    { tab: "demoProfiles", plural: "demoProfiles", singular: "DemoProfile", pascal: "DemoProfile", db: `${camel}DemoProfiles`, table: `${PREFIX}_demo_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "demoDurationDays", type: "number" }], display: { title: "profileName", sub: "demoDurationDays" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  demo_duration_days integer not null default 14,\n  seed_data_ref text not null default ''" },
    { tab: "productionProfiles", plural: "productionProfiles", singular: "ProductionProfile", pascal: "ProductionProfile", db: `${camel}ProductionProfiles`, table: `${PREFIX}_production_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "deploymentTarget", type: "string" }], display: { title: "profileName", sub: "deploymentTarget" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  deployment_target text not null default 'cloud',\n  scaling_tier text not null default 'standard'" },
    { tab: "enterpriseProfiles", plural: "enterpriseProfiles", singular: "EnterpriseProfile", pascal: "EnterpriseProfile", db: `${camel}EnterpriseProfiles`, table: `${PREFIX}_enterprise_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "complianceTier", type: "string" }], display: { title: "profileName", sub: "complianceTier" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  compliance_tier text not null default 'enterprise',\n  sla_target numeric(5, 2) not null default 99.9" },
    { tab: "sharedApis", plural: "sharedApis", singular: "SharedApi", pascal: "SharedApi", db: `${camel}SharedApis`, table: `${PREFIX}_shared_apis`, fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "apiVersion", type: "string" }], display: { title: "apiName", sub: "apiVersion" }, sqlExtra: "api_key text not null,\n  api_name text not null default '',\n  api_version text not null default 'v1',\n  endpoint_ref text not null default ''" },
    { tab: "contextApis", plural: "contextApis", singular: "ContextApi", pascal: "ContextApi", db: `${camel}ContextApis`, table: `${PREFIX}_context_apis`, fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "contextType", type: "string" }], display: { title: "apiName", sub: "contextType" }, sqlExtra: "api_key text not null,\n  api_name text not null default '',\n  context_type text not null default 'industry',\n  endpoint_ref text not null default ''" },
    { tab: "configurationApis", plural: "configurationApis", singular: "ConfigurationApi", pascal: "ConfigurationApi", db: `${camel}ConfigurationApis`, table: `${PREFIX}_configuration_apis`, fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "configScope", type: "string" }], display: { title: "apiName", sub: "configScope" }, sqlExtra: "api_key text not null,\n  api_name text not null default '',\n  config_scope text not null default 'tenant',\n  endpoint_ref text not null default ''" },
    { tab: "extensionPoints", plural: "extensionPoints", singular: "ExtensionPoint", pascal: "ExtensionPoint", db: `${camel}ExtensionPoints`, table: `${PREFIX}_extension_points`, fields: [{ name: "extensionKey", type: "string" }, { name: "extensionName", type: "string" }, { name: "hookType", type: "string" }], display: { title: "extensionName", sub: "hookType" }, sqlExtra: "extension_key text not null,\n  extension_name text not null default '',\n  hook_type text not null default 'pre_action',\n  plugin_ref text not null default ''" },
    { tab: "frameworkMetrics", plural: "frameworkMetrics", singular: "FrameworkMetric", pascal: "FrameworkMetric", db: `${camel}FrameworkMetrics`, table: `${PREFIX}_framework_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "templateScore", type: "number" }, { name: "overallFrameworkScore", type: "number" }], display: { title: "metricsKey", sub: "overallFrameworkScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  template_score numeric(5, 2) not null default 100,\n  profile_score numeric(5, 2) not null default 100,\n  compatibility_score numeric(5, 2) not null default 100,\n  sdk_score numeric(5, 2) not null default 100,\n  framework_health_score numeric(5, 2) not null default 100,\n  overall_framework_score numeric(5, 2) not null default 100" },
    { tab: "frameworkHealth", plural: "frameworkHealth", singular: "FrameworkHealth", pascal: "FrameworkHealth", db: `${camel}FrameworkHealth`, table: `${PREFIX}_framework_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  compatibility_status text not null default 'healthy',\n  sdk_status text not null default 'healthy',\n  template_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "compatibilityChecks", plural: "compatibilityChecks", singular: "CompatibilityCheck", pascal: "CompatibilityCheck", db: `${camel}CompatibilityChecks`, table: `${PREFIX}_compatibility_checks`, fields: [{ name: "checkKey", type: "string" }, { name: "checkType", type: "string" }, { name: "checkScore", type: "number" }], display: { title: "checkKey", sub: "checkType" }, sqlExtra: "check_key text not null,\n  check_type text not null default 'version',\n  check_score numeric(5, 2) not null default 0,\n  check_summary text not null default ''" },
    { tab: "frameworkFailures", plural: "frameworkFailures", singular: "FrameworkFailure", pascal: "FrameworkFailure", db: `${camel}FrameworkFailures`, table: `${PREFIX}_framework_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'compatibility',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 1: Enterprise Industry Framework Core\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise industry framework core data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage industry registrations, profiles, templates, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve industry framework gates and deployment profiles', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise industry framework core governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00690069-0069-0069-0069-006900690101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a333', '${org}', 'Enterprise Industry Framework Orchestrator', 'enterprise_industry_framework_core', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["industry_registry","profile_engine","template_engine","configuration_engine","context_engine","deployment_profiles","industry_sdk","framework_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a533', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a333', 'northstar-industry-framework-001', 'enterprise_industry_framework_core', 'framework_hub', '${hubId}', '{"objective":"Enterprise industry framework core for northstar multi-industry deployment"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Framework Hub\n`;
    sql += `insert into public.ifr_framework_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-industry-framework', 'Northstar Industry Framework Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Industry Registry\n`;
    sql += `insert into public.ifr_industry_registrations (id, organization_id, hub_id, registration_key, industry_code, industry_name, status)\nvalues ('006a006a-006a-006a-006a-006a006a0201', '${org}', '${hubId}', 'reg-saas-0804', 'saas', 'Software as a Service', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_industry_metadata (id, organization_id, hub_id, metadata_key, metadata_type, status)\nvalues ('006b006b-006b-006b-006b-006b006b0301', '${org}', '${hubId}', 'meta-profile-0804', 'profile', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_industry_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)\nvalues ('006c006c-006c-006c-006c-006c006c0401', '${org}', '${hubId}', 'ver-1-0-0', '1.0.0', 'stable', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_industry_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)\nvalues ('006d006d-006d-006d-006d-006d006d0501', '${org}', '${hubId}', 'dep-crm-0804', 'module', 'crm-core', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Profile Engine\n`;
    sql += `insert into public.ifr_business_types (id, organization_id, hub_id, type_key, type_name, type_category, status)\nvalues ('006e006e-006e-006e-006e-006e006e0601', '${org}', '${hubId}', 'type-b2b-0804', 'B2B SaaS', 'technology', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_business_sizes (id, organization_id, hub_id, size_key, size_label, employee_range, status)\nvalues ('006f006f-006f-006f-006f-006f006f0701', '${org}', '${hubId}', 'size-mid-0804', 'Mid-Market', '50-500', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_operating_models (id, organization_id, hub_id, model_key, model_name, model_type, status)\nvalues ('00700070-0070-0070-0070-007000700801', '${org}', '${hubId}', 'model-sub-0804', 'Subscription', 'saas', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_industry_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_score, profile_summary, status)\nvalues ('00710071-0071-0071-0071-007100710901', '${org}', '${hubId}', 'profile-saas-0804', 'SaaS Growth Profile', 92.50, 'Optimized for B2B SaaS mid-market', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Template Engine\n`;
    sql += `insert into public.ifr_dashboard_templates (id, organization_id, hub_id, template_key, template_name, template_version, status)\nvalues ('00720072-0072-0072-0072-007200720a01', '${org}', '${hubId}', 'dash-exec-0804', 'Executive Dashboard', '1.0', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_workflow_templates (id, organization_id, hub_id, template_key, template_name, workflow_type, status)\nvalues ('00730073-0073-0073-0073-007300730b01', '${org}', '${hubId}', 'wf-onboard-0804', 'Customer Onboarding', 'automation', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_role_templates (id, organization_id, hub_id, template_key, role_name, permissions_count, status)\nvalues ('00740074-0074-0074-0074-007400740c01', '${org}', '${hubId}', 'role-admin-0804', 'Industry Admin', 24, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_report_templates (id, organization_id, hub_id, template_key, report_name, report_format, status)\nvalues ('00750075-0075-0075-0075-007500750d01', '${org}', '${hubId}', 'rpt-kpi-0804', 'KPI Summary Report', 'pdf', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Configuration Engine\n`;
    sql += `insert into public.ifr_dynamic_configurations (id, organization_id, hub_id, config_key, config_type, status)\nvalues ('00760076-0076-0076-0076-007600760e01', '${org}', '${hubId}', 'cfg-feature-0804', 'feature', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_feature_configurations (id, organization_id, hub_id, feature_key, feature_name, enabled, status)\nvalues ('00770077-0077-0077-0077-007700770f01', '${org}', '${hubId}', 'feat-ai-0804', 'AI Copilot', true, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_business_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)\nvalues ('00780078-0078-0078-0078-007800781001', '${org}', '${hubId}', 'rule-valid-0804', 'Profile Validation Rule', 'validation', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_validation_rules (id, organization_id, hub_id, rule_key, rule_name, validation_score, status)\nvalues ('00790079-0079-0079-0079-007900791101', '${org}', '${hubId}', 'val-schema-0804', 'Schema Validation', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Context Engine\n`;
    sql += `insert into public.ifr_industry_contexts (id, organization_id, hub_id, context_key, context_type, status)\nvalues ('007a007a-007a-007a-007a-007a007a1201', '${org}', '${hubId}', 'ctx-ops-0804', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_ai_contexts (id, organization_id, hub_id, context_key, context_type, token_count, status)\nvalues ('007b007b-007b-007b-007b-007b007b1301', '${org}', '${hubId}', 'ctx-ai-0804', 'prompt', 4096, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_terminology_entries (id, organization_id, hub_id, term_key, term_label, term_definition, status)\nvalues ('007c007c-007c-007c-007c-007c007c1401', '${org}', '${hubId}', 'term-mrr-0804', 'MRR', 'Monthly Recurring Revenue', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Deployment Profiles\n`;
    sql += `insert into public.ifr_demo_profiles (id, organization_id, hub_id, profile_key, profile_name, demo_duration_days, status)\nvalues ('007d007d-007d-007d-007d-007d007d1501', '${org}', '${hubId}', 'demo-saas-0804', 'SaaS Demo Profile', 14, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_production_profiles (id, organization_id, hub_id, profile_key, profile_name, deployment_target, status)\nvalues ('007e007e-007e-007e-007e-007e007e1601', '${org}', '${hubId}', 'prod-cloud-0804', 'Cloud Production', 'cloud', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_enterprise_profiles (id, organization_id, hub_id, profile_key, profile_name, compliance_tier, status)\nvalues ('007f007f-007f-007f-007f-007f007f1701', '${org}', '${hubId}', 'ent-soc2-0804', 'Enterprise SOC2', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Industry SDK\n`;
    sql += `insert into public.ifr_shared_apis (id, organization_id, hub_id, api_key, api_name, api_version, status)\nvalues ('00800080-0080-0080-0080-008000801801', '${org}', '${hubId}', 'api-shared-0804', 'Framework Shared API', 'v1', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_context_apis (id, organization_id, hub_id, api_key, api_name, context_type, status)\nvalues ('00810081-0081-0081-0081-008100811901', '${org}', '${hubId}', 'api-ctx-0804', 'Context API', 'industry', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_configuration_apis (id, organization_id, hub_id, api_key, api_name, config_scope, status)\nvalues ('00820082-0082-0082-0082-008200821a01', '${org}', '${hubId}', 'api-cfg-0804', 'Configuration API', 'tenant', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_extension_points (id, organization_id, hub_id, extension_key, extension_name, hook_type, status)\nvalues ('00830083-0083-0083-0083-008300831b01', '${org}', '${hubId}', 'ext-pre-0804', 'Pre-Action Hook', 'pre_action', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Framework Dashboard\n`;
    sql += `insert into public.ifr_framework_metrics (id, organization_id, metrics_key, template_score, profile_score, compatibility_score, sdk_score, framework_health_score, overall_framework_score, status)\nvalues ('00840084-0084-0084-0084-008400841c01', '${org}', 'framework-metrics-0804', 94.00, 96.50, 95.00, 91.00, 97.00, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_compatibility_checks (id, organization_id, hub_id, check_key, check_type, check_score, check_summary, status)\nvalues ('00850085-0085-0085-0085-008500851d01', '${org}', '${hubId}', 'compat-ver-0804', 'version', 93.00, 'All version compatibility checks passed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_framework_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, compatibility_status, sdk_status, template_status, summary, status)\nvalues ('00860086-0086-0086-0086-008600861e01', '${org}', 'framework-health-0804', 95.00, false, 'healthy', 'healthy', 'healthy', 'Industry framework core operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_framework_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00870087-0087-0087-0087-008700872001', '${org}', '${hubId}', 'fail-compat-0804', 'compatibility', 'VERSION_MISMATCH', 'Template version mismatch detected in workflow module', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ifr_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00880088-0088-0088-0088-008800882101', '${org}', 'framework_hub', 'seed', 'Enterprise industry framework core seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgIfrRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgIfrRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgIfrRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020033_enterprise_industry_framework_core.sql");
const seedPath = join(root, "supabase/seed/033_enterprise_industry_framework_core_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/industry-framework-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbIfrFrameworkHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Industry Framework Core artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbIfr* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-industry-framework-ui.mjs");

#!/usr/bin/env node
/**
 * Generates V2 Program C Sprint 4 Enterprise Launch Foundation artifacts.
 * Run: node scripts/generate-enterprise-launch-foundation.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "elf";
const Pascal = "Elf";
const camel = "elf";
const permResource = "enterprise_launch_foundation";

const hubTable = `${PREFIX}_launch_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_launch_metrics`, `${PREFIX}_launch_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "launchHubs", plural: "launchHubs", singular: "LaunchHub", pascal: "LaunchHub", db: `${camel}LaunchHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  platform_tier text not null default 'enterprise'" },
    { tab: "organizationProvisions", plural: "organizationProvisions", singular: "OrganizationProvision", pascal: "OrganizationProvision", db: `${camel}OrganizationProvisions`, table: `${PREFIX}_organization_provisions`, fields: [{ name: "provisionKey", type: "string" }, { name: "provisionName", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionName", sub: "provisionStatus" }, sqlExtra: "provision_key text not null,\n  provision_name text not null default '',\n  provision_status text not null default 'pending',\n  org_ref text not null default ''" },
    { tab: "tenantProvisions", plural: "tenantProvisions", singular: "TenantProvision", pascal: "TenantProvision", db: `${camel}TenantProvisions`, table: `${PREFIX}_tenant_provisions`, fields: [{ name: "provisionKey", type: "string" }, { name: "tenantRef", type: "string" }, { name: "provisionStatus", type: "select", options: "PROVISION_STATUS_OPTIONS" }], display: { title: "provisionKey", sub: "tenantRef" }, sqlExtra: "provision_key text not null,\n  tenant_ref text not null default '',\n  provision_status text not null default 'pending',\n  provision_summary text not null default ''" },
    { tab: "industryPackAssignments", plural: "industryPackAssignments", singular: "IndustryPackAssignment", pascal: "IndustryPackAssignment", db: `${camel}IndustryPackAssignments`, table: `${PREFIX}_industry_pack_assignments`, fields: [{ name: "assignmentKey", type: "string" }, { name: "packName", type: "string" }, { name: "packType", type: "string" }], display: { title: "packName", sub: "packType" }, sqlExtra: "assignment_key text not null,\n  pack_name text not null default '',\n  pack_type text not null default 'hospital',\n  pack_version text not null default '1.0'" },
    { tab: "moduleLicenses", plural: "moduleLicenses", singular: "ModuleLicense", pascal: "ModuleLicense", db: `${camel}ModuleLicenses`, table: `${PREFIX}_module_licenses`, fields: [{ name: "licenseKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "licenseStatus", type: "select", options: "LICENSE_STATUS_OPTIONS" }], display: { title: "moduleName", sub: "licenseStatus" }, sqlExtra: "license_key text not null,\n  module_name text not null default '',\n  license_status text not null default 'active',\n  seat_count integer not null default 1" },
    { tab: "wizardProfiles", plural: "wizardProfiles", singular: "WizardProfile", pascal: "WizardProfile", db: `${camel}WizardProfiles`, table: `${PREFIX}_wizard_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'standard',\n  completion_score numeric(5, 2) not null default 0" },
    { tab: "wizardBranding", plural: "wizardBranding", singular: "WizardBranding", pascal: "WizardBranding", db: `${camel}WizardBranding`, table: `${PREFIX}_wizard_branding`, fields: [{ name: "brandingKey", type: "string" }, { name: "brandingName", type: "string" }, { name: "brandColor", type: "string" }], display: { title: "brandingName", sub: "brandColor" }, sqlExtra: "branding_key text not null,\n  branding_name text not null default '',\n  brand_color text not null default '#475569',\n  logo_ref text not null default ''" },
    { tab: "wizardDepartments", plural: "wizardDepartments", singular: "WizardDepartment", pascal: "WizardDepartment", db: `${camel}WizardDepartments`, table: `${PREFIX}_wizard_departments`, fields: [{ name: "departmentKey", type: "string" }, { name: "departmentName", type: "string" }, { name: "departmentType", type: "string" }], display: { title: "departmentName", sub: "departmentType" }, sqlExtra: "department_key text not null,\n  department_name text not null default '',\n  department_type text not null default 'operations',\n  head_count integer not null default 0" },
    { tab: "wizardSettings", plural: "wizardSettings", singular: "WizardSetting", pascal: "WizardSetting", db: `${camel}WizardSettings`, table: `${PREFIX}_wizard_settings`, fields: [{ name: "settingKey", type: "string" }, { name: "settingName", type: "string" }, { name: "settingValue", type: "string" }], display: { title: "settingName", sub: "settingValue" }, sqlExtra: "setting_key text not null,\n  setting_name text not null default '',\n  setting_value text not null default '',\n  setting_group text not null default 'general'" },
    { tab: "importJobs", plural: "importJobs", singular: "ImportJob", pascal: "ImportJob", db: `${camel}ImportJobs`, table: `${PREFIX}_import_jobs`, fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "IMPORT_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobStatus" }, sqlExtra: "job_key text not null,\n  job_name text not null default '',\n  job_status text not null default 'pending',\n  source_ref text not null default '',\n  started_at timestamptz not null default now()" },
    { tab: "importValidations", plural: "importValidations", singular: "ImportValidation", pascal: "ImportValidation", db: `${camel}ImportValidations`, table: `${PREFIX}_import_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" }, sqlExtra: "validation_key text not null,\n  validation_type text not null default 'schema',\n  validation_score numeric(5, 2) not null default 0,\n  validation_summary text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "importPreviews", plural: "importPreviews", singular: "ImportPreview", pascal: "ImportPreview", db: `${camel}ImportPreviews`, table: `${PREFIX}_import_previews`, fields: [{ name: "previewKey", type: "string" }, { name: "previewName", type: "string" }, { name: "recordCount", type: "number" }], display: { title: "previewName", sub: "recordCount" }, sqlExtra: "preview_key text not null,\n  preview_name text not null default '',\n  record_count integer not null default 0,\n  preview_summary text not null default '',\n  previewed_at timestamptz not null default now()" },
    { tab: "importHistory", plural: "importHistory", singular: "ImportHistory", pascal: "ImportHistory", db: `${camel}ImportHistory`, table: `${PREFIX}_import_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "importedAt", type: "string" }], display: { title: "historyKey", sub: "historyType" }, sqlExtra: "history_key text not null,\n  history_type text not null default 'bulk',\n  imported_at timestamptz not null default now(),\n  record_count integer not null default 0,\n  import_summary text not null default ''" },
    { tab: "goLiveChecklists", plural: "goLiveChecklists", singular: "GoLiveChecklist", pascal: "GoLiveChecklist", db: `${camel}GoLiveChecklists`, table: `${PREFIX}_go_live_checklists`, fields: [{ name: "checklistKey", type: "string" }, { name: "checklistName", type: "string" }, { name: "completionScore", type: "number" }], display: { title: "checklistName", sub: "completionScore" }, sqlExtra: "checklist_key text not null,\n  checklist_name text not null default '',\n  completion_score numeric(5, 2) not null default 0,\n  checklist_items jsonb not null default '[]'::jsonb,\n  reviewed_at timestamptz" },
    { tab: "goLiveScores", plural: "goLiveScores", singular: "GoLiveScore", pascal: "GoLiveScore", db: `${camel}GoLiveScores`, table: `${PREFIX}_go_live_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "scoreType", type: "string" }, { name: "goLiveScore", type: "number" }], display: { title: "scoreKey", sub: "scoreType" }, sqlExtra: "score_key text not null,\n  score_type text not null default 'overall',\n  go_live_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date,\n  captured_at timestamptz not null default now()" },
    { tab: "deploymentStatuses", plural: "deploymentStatuses", singular: "DeploymentStatus", pascal: "DeploymentStatus", db: `${camel}DeploymentStatuses`, table: `${PREFIX}_deployment_statuses`, fields: [{ name: "statusKey", type: "string" }, { name: "deploymentName", type: "string" }, { name: "deploymentStatus", type: "select", options: "DEPLOYMENT_STATUS_OPTIONS" }], display: { title: "deploymentName", sub: "deploymentStatus" }, sqlExtra: "status_key text not null,\n  deployment_name text not null default '',\n  deployment_status text not null default 'pending',\n  target_version text not null default '',\n  deployed_at timestamptz" },
    { tab: "readinessValidations", plural: "readinessValidations", singular: "ReadinessValidation", pascal: "ReadinessValidation", db: `${camel}ReadinessValidations`, table: `${PREFIX}_readiness_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" }, sqlExtra: "validation_key text not null,\n  validation_type text not null default 'launch_gate',\n  validation_score numeric(5, 2) not null default 0,\n  validation_summary text not null default '',\n  validated_at timestamptz not null default now()" },
    { tab: "customerHealthScores", plural: "customerHealthScores", singular: "CustomerHealthScore", pascal: "CustomerHealthScore", db: `${camel}CustomerHealthScores`, table: `${PREFIX}_customer_health_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreKey", sub: "customerRef" }, sqlExtra: "score_key text not null,\n  customer_ref text not null default '',\n  health_score numeric(5, 2) not null default 100,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "platformAdoption", plural: "platformAdoption", singular: "PlatformAdoption", pascal: "PlatformAdoption", db: `${camel}PlatformAdoption`, table: `${PREFIX}_platform_adoption`, fields: [{ name: "adoptionKey", type: "string" }, { name: "featureName", type: "string" }, { name: "adoptionRate", type: "number" }], display: { title: "featureName", sub: "adoptionRate" }, sqlExtra: "adoption_key text not null,\n  feature_name text not null default '',\n  adoption_rate numeric(5, 2) not null default 0,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "featureUsage", plural: "featureUsage", singular: "FeatureUsage", pascal: "FeatureUsage", db: `${camel}FeatureUsage`, table: `${PREFIX}_feature_usage`, fields: [{ name: "usageKey", type: "string" }, { name: "featureName", type: "string" }, { name: "usageCount", type: "number" }], display: { title: "featureName", sub: "usageCount" }, sqlExtra: "usage_key text not null,\n  feature_name text not null default '',\n  usage_count integer not null default 0,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "renewalTracking", plural: "renewalTracking", singular: "RenewalTracking", pascal: "RenewalTracking", db: `${camel}RenewalTracking`, table: `${PREFIX}_renewal_tracking`, fields: [{ name: "renewalKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "renewalStatus", type: "select", options: "RENEWAL_STATUS_OPTIONS" }], display: { title: "renewalKey", sub: "customerRef" }, sqlExtra: "renewal_key text not null,\n  customer_ref text not null default '',\n  renewal_status text not null default 'pending',\n  renewal_date date not null default current_date,\n  contract_value numeric(12, 2) not null default 0" },
    { tab: "supportTickets", plural: "supportTickets", singular: "SupportTicket", pascal: "SupportTicket", db: `${camel}SupportTickets`, table: `${PREFIX}_support_tickets`, fields: [{ name: "ticketKey", type: "string" }, { name: "ticketTitle", type: "string" }, { name: "ticketStatus", type: "select", options: "TICKET_STATUS_OPTIONS" }], display: { title: "ticketTitle", sub: "ticketStatus" }, sqlExtra: "ticket_key text not null,\n  ticket_title text not null default '',\n  ticket_status text not null default 'open',\n  priority text not null default 'normal',\n  opened_at timestamptz not null default now()" },
    { tab: "knowledgeBaseArticles", plural: "knowledgeBaseArticles", singular: "KnowledgeBaseArticle", pascal: "KnowledgeBaseArticle", db: `${camel}KnowledgeBaseArticles`, table: `${PREFIX}_knowledge_base_articles`, fields: [{ name: "articleKey", type: "string" }, { name: "articleTitle", type: "string" }, { name: "articleCategory", type: "string" }], display: { title: "articleTitle", sub: "articleCategory" }, sqlExtra: "article_key text not null,\n  article_title text not null default '',\n  article_category text not null default 'general',\n  article_summary text not null default '',\n  published_at timestamptz" },
    { tab: "incidentTracking", plural: "incidentTracking", singular: "IncidentTracking", pascal: "IncidentTracking", db: `${camel}IncidentTracking`, table: `${PREFIX}_incident_tracking`, fields: [{ name: "incidentKey", type: "string" }, { name: "incidentTitle", type: "string" }, { name: "incidentSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "incidentTitle", sub: "incidentSeverity" }, sqlExtra: "incident_key text not null,\n  incident_title text not null default '',\n  incident_severity text not null default 'warning',\n  incident_summary text not null default '',\n  detected_at timestamptz not null default now()" },
    { tab: "customerRegistry", plural: "customerRegistry", singular: "CustomerRegistry", pascal: "CustomerRegistry", db: `${camel}CustomerRegistry`, table: `${PREFIX}_customer_registry`, fields: [{ name: "customerKey", type: "string" }, { name: "customerName", type: "string" }, { name: "customerTier", type: "string" }], display: { title: "customerName", sub: "customerTier" }, sqlExtra: "customer_key text not null,\n  customer_name text not null default '',\n  customer_tier text not null default 'standard',\n  region text not null default '',\n  onboarded_at timestamptz not null default now()" },
    { tab: "subscriptionRecords", plural: "subscriptionRecords", singular: "SubscriptionRecord", pascal: "SubscriptionRecord", db: `${camel}SubscriptionRecords`, table: `${PREFIX}_subscription_records`, fields: [{ name: "subscriptionKey", type: "string" }, { name: "planName", type: "string" }, { name: "subscriptionStatus", type: "select", options: "SUBSCRIPTION_STATUS_OPTIONS" }], display: { title: "planName", sub: "subscriptionStatus" }, sqlExtra: "subscription_key text not null,\n  plan_name text not null default '',\n  subscription_status text not null default 'active',\n  seat_count integer not null default 1,\n  started_at timestamptz not null default now()" },
    { tab: "licenseManagement", plural: "licenseManagement", singular: "LicenseManagement", pascal: "LicenseManagement", db: `${camel}LicenseManagement`, table: `${PREFIX}_license_management`, fields: [{ name: "licenseKey", type: "string" }, { name: "licenseType", type: "string" }, { name: "licenseStatus", type: "select", options: "LICENSE_STATUS_OPTIONS" }], display: { title: "licenseKey", sub: "licenseType" }, sqlExtra: "license_key text not null,\n  license_type text not null default 'platform',\n  license_status text not null default 'active',\n  seat_limit integer not null default 100,\n  expires_at timestamptz" },
    { tab: "launchMetrics", plural: "launchMetrics", singular: "LaunchMetric", pascal: "LaunchMetric", db: `${camel}LaunchMetrics`, table: `${PREFIX}_launch_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "platformHealthScore", type: "number" }, { name: "overallLaunchScore", type: "number" }], display: { title: "metricsKey", sub: "overallLaunchScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  platform_health_score numeric(5, 2) not null default 100,\n  customer_health_score numeric(5, 2) not null default 100,\n  deployment_count integer not null default 0,\n  subscription_count integer not null default 0,\n  support_open_count integer not null default 0,\n  go_live_score numeric(5, 2) not null default 100,\n  overall_launch_score numeric(5, 2) not null default 100" },
    { tab: "launchHealth", plural: "launchHealth", singular: "LaunchHealth", pascal: "LaunchHealth", db: `${camel}LaunchHealth`, table: `${PREFIX}_launch_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  platform_status text not null default 'healthy',\n  customer_success_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "missionControlKpis", plural: "missionControlKpis", singular: "MissionControlKpi", pascal: "MissionControlKpi", db: `${camel}MissionControlKpis`, table: `${PREFIX}_mission_control_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'mission_control',\n  metric_date date not null default current_date" },
    { tab: "launchFailures", plural: "launchFailures", singular: "LaunchFailure", pascal: "LaunchFailure", db: `${camel}LaunchFailures`, table: `${PREFIX}_launch_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'provisioning',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program C Sprint 4: Enterprise Launch Foundation\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise launch foundation data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage provisioning, configuration, import, go-live, customer success, support, and platform admin outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve launch foundation gates and deployment actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise launch foundation governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00720072-0072-0072-0072-007200720101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a342', '${org}', 'Enterprise Launch Foundation Orchestrator', 'enterprise_launch_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["provisioning","config_wizard","data_import","go_live","customer_success","support_ops","platform_admin","mission_control"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a542', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a342', 'northstar-launch-foundation-001', 'enterprise_launch_foundation', 'launch_hub', '${hubId}', '{"objective":"Enterprise launch foundation for northstar platform go-live"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Launch Hub\n`;
    sql += `insert into public.elf_launch_hubs (id, organization_id, hub_key, hub_name, environment, platform_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-launch-foundation', 'Northstar Launch Foundation Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Provisioning\n`;
    sql += `insert into public.elf_organization_provisions (id, organization_id, hub_id, provision_key, provision_name, provision_status, status)\nvalues ('04200100-0420-0420-0420-042001000201', '${org}', '${hubId}', 'org-provision-0904', 'Northstar Organization Provision', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_tenant_provisions (id, organization_id, hub_id, provision_key, tenant_ref, provision_status, status)\nvalues ('04210101-0421-0421-0421-042101010301', '${org}', '${hubId}', 'tenant-provision-0904', 'northstar-tenant-001', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_industry_pack_assignments (id, organization_id, hub_id, assignment_key, pack_name, pack_type, status)\nvalues ('04220102-0422-0422-0422-042201020401', '${org}', '${hubId}', 'pack-hospital-0904', 'Hospital Business OS', 'hospital', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_module_licenses (id, organization_id, hub_id, license_key, module_name, license_status, status)\nvalues ('04230103-0423-0423-0423-042301030501', '${org}', '${hubId}', 'lic-platform-0904', 'Platform Core', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Config Wizard\n`;
    sql += `insert into public.elf_wizard_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('04240104-0424-0424-0424-042401040601', '${org}', '${hubId}', 'wiz-profile-0904', 'Northstar Wizard Profile', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_wizard_branding (id, organization_id, hub_id, branding_key, branding_name, brand_color, status)\nvalues ('04250105-0425-0425-0425-042501050701', '${org}', '${hubId}', 'wiz-brand-0904', 'Northstar Branding', '#475569', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_wizard_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)\nvalues ('04260106-0426-0426-0426-042601060801', '${org}', '${hubId}', 'wiz-dept-0904', 'Operations Department', 'operations', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_wizard_settings (id, organization_id, hub_id, setting_key, setting_name, setting_value, status)\nvalues ('04270107-0427-0427-0427-042701070901', '${org}', '${hubId}', 'wiz-setting-0904', 'Default Timezone', 'UTC', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Data Import\n`;
    sql += `insert into public.elf_import_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)\nvalues ('04280108-0428-0428-0428-042801080a01', '${org}', '${hubId}', 'import-job-0904', 'Customer Data Import', 'completed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_import_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, status)\nvalues ('04290109-0429-0429-0429-042901090b01', '${org}', '${hubId}', 'import-val-0904', 'schema', 98.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_import_previews (id, organization_id, hub_id, preview_key, preview_name, record_count, status)\nvalues ('042a010a-042a-042a-042a-042a010a0c01', '${org}', '${hubId}', 'import-prev-0904', 'Customer Preview', 1250, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_import_history (id, organization_id, hub_id, history_key, history_type, status)\nvalues ('042b010b-042b-042b-042b-042b010b0d01', '${org}', '${hubId}', 'import-hist-0904', 'bulk', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Go Live\n`;
    sql += `insert into public.elf_go_live_checklists (id, organization_id, hub_id, checklist_key, checklist_name, completion_score, status)\nvalues ('042c010c-042c-042c-042c-042c010c0e01', '${org}', '${hubId}', 'golive-check-0904', 'Production Go-Live Checklist', 95.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_go_live_scores (id, organization_id, hub_id, score_key, score_type, go_live_score, status)\nvalues ('042d010d-042d-042d-042d-042d010d0f01', '${org}', '${hubId}', 'golive-score-0904', 'overall', 96.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_deployment_statuses (id, organization_id, hub_id, status_key, deployment_name, deployment_status, status)\nvalues ('042e010e-042e-042e-042e-042e010e1001', '${org}', '${hubId}', 'deploy-status-0904', 'Production Deployment', 'deployed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_readiness_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, status)\nvalues ('042f010f-042f-042f-042f-042f010f1101', '${org}', '${hubId}', 'ready-val-0904', 'launch_gate', 97.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Customer Success\n`;
    sql += `insert into public.elf_customer_health_scores (id, organization_id, hub_id, score_key, customer_ref, health_score, status)\nvalues ('04300110-0430-0430-0430-043001101201', '${org}', '${hubId}', 'cust-health-0904', 'northstar-customer-001', 92.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_platform_adoption (id, organization_id, hub_id, adoption_key, feature_name, adoption_rate, status)\nvalues ('04310111-0431-0431-0431-043101111301', '${org}', '${hubId}', 'adopt-dash-0904', 'Dashboard', 88.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_feature_usage (id, organization_id, hub_id, usage_key, feature_name, usage_count, status)\nvalues ('04320112-0432-0432-0432-043201121401', '${org}', '${hubId}', 'usage-wf-0904', 'Workflow Engine', 4500, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_renewal_tracking (id, organization_id, hub_id, renewal_key, customer_ref, renewal_status, status)\nvalues ('04330113-0433-0433-0433-043301131501', '${org}', '${hubId}', 'renewal-0904', 'northstar-customer-001', 'confirmed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Support Ops\n`;
    sql += `insert into public.elf_support_tickets (id, organization_id, hub_id, ticket_key, ticket_title, ticket_status, status)\nvalues ('04340114-0434-0434-0434-043401141601', '${org}', '${hubId}', 'ticket-0904', 'Onboarding Support Request', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_knowledge_base_articles (id, organization_id, hub_id, article_key, article_title, article_category, status)\nvalues ('04350115-0435-0435-0435-043501151701', '${org}', '${hubId}', 'kb-article-0904', 'Getting Started Guide', 'onboarding', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_incident_tracking (id, organization_id, hub_id, incident_key, incident_title, incident_severity, status)\nvalues ('04360116-0436-0436-0436-043601161801', '${org}', '${hubId}', 'incident-0904', 'Import Pipeline Delay', 'warning', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Platform Admin\n`;
    sql += `insert into public.elf_customer_registry (id, organization_id, hub_id, customer_key, customer_name, customer_tier, status)\nvalues ('04370117-0437-0437-0437-043701171901', '${org}', '${hubId}', 'cust-reg-0904', 'Northstar Customer', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_subscription_records (id, organization_id, hub_id, subscription_key, plan_name, subscription_status, status)\nvalues ('04380118-0438-0438-0438-043801181a01', '${org}', '${hubId}', 'sub-record-0904', 'Enterprise Plan', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_license_management (id, organization_id, hub_id, license_key, license_type, license_status, status)\nvalues ('04390119-0439-0439-0439-043901191b01', '${org}', '${hubId}', 'lic-mgmt-0904', 'platform', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Mission Control\n`;
    sql += `insert into public.elf_launch_metrics (id, organization_id, metrics_key, platform_health_score, customer_health_score, deployment_count, subscription_count, support_open_count, go_live_score, overall_launch_score, status)\nvalues ('043a011a-043a-043a-043a-043a011a1c01', '${org}', 'elf-metrics-0904', 96.00, 92.00, 12, 45, 3, 96.50, 95.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_launch_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, platform_status, customer_success_status, security_status, summary, status)\nvalues ('043b011b-043b-043b-043b-043b011b1d01', '${org}', 'elf-health-0904', 96.00, false, 'healthy', 'healthy', 'healthy', 'Enterprise launch foundation operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_mission_control_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('043c011c-043c-043c-043c-043c011c1e01', '${org}', '${hubId}', 'kpi-mission-0904', 'Mission Control KPI Score', 97.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_launch_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('043d011d-043d-043d-043d-043d011d1f01', '${org}', '${hubId}', 'fail-provision-0904', 'provisioning', 'PROVISION_TIMEOUT', 'Tenant provisioning timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.elf_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('043e011e-043e-043e-043e-043e011e2001', '${org}', 'launch_hub', 'seed', 'Enterprise launch foundation seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgElfRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgElfRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgElfRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020042_enterprise_launch_foundation.sql");
const seedPath = join(root, "supabase/seed/042_enterprise_launch_foundation_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/launch-foundation-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbElfLaunchHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Launch Foundation artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbElf* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-launch-foundation-ui.mjs");

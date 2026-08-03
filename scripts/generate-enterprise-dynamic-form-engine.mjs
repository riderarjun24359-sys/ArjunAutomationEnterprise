#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 3 Enterprise Dynamic Form Engine artifacts.
 * Run: node scripts/generate-enterprise-dynamic-form-engine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "dfe";
const Pascal = "Dfe";
const camel = "dfe";
const permResource = "enterprise_dynamic_form_engine";

const hubTable = `${PREFIX}_form_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_form_metrics`, `${PREFIX}_form_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "formHubs", plural: "formHubs", singular: "FormHub", pascal: "FormHub", db: `${camel}FormHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "formDefinitions", plural: "formDefinitions", singular: "FormDefinition", pascal: "FormDefinition", db: `${camel}FormDefinitions`, table: `${PREFIX}_form_definitions`, fields: [{ name: "formKey", type: "string" }, { name: "formName", type: "string" }, { name: "formType", type: "string" }], display: { title: "formName", sub: "formType" }, sqlExtra: "form_key text not null,\n  form_name text not null default '',\n  form_type text not null default 'standard',\n  description text not null default ''" },
    { tab: "formCategories", plural: "formCategories", singular: "FormCategory", pascal: "FormCategory", db: `${camel}FormCategories`, table: `${PREFIX}_form_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'general',\n  description text not null default ''" },
    { tab: "formVersions", plural: "formVersions", singular: "FormVersion", pascal: "FormVersion", db: `${camel}FormVersions`, table: `${PREFIX}_form_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  published_at timestamptz" },
    { tab: "formDependencies", plural: "formDependencies", singular: "FormDependency", pascal: "FormDependency", db: `${camel}FormDependencies`, table: `${PREFIX}_form_dependencies`, fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" }, sqlExtra: "dependency_key text not null,\n  dependency_type text not null default 'form',\n  dependency_ref text not null default '',\n  resolved_at timestamptz" },
    { tab: "formSections", plural: "formSections", singular: "FormSection", pascal: "FormSection", db: `${camel}FormSections`, table: `${PREFIX}_form_sections`, fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "sectionOrder", type: "number" }], display: { title: "sectionName", sub: "sectionOrder" }, sqlExtra: "section_key text not null,\n  section_name text not null default '',\n  section_order integer not null default 0,\n  section_type text not null default 'standard'" },
    { tab: "formTabs", plural: "formTabs", singular: "FormTab", pascal: "FormTab", db: `${camel}FormTabs`, table: `${PREFIX}_form_tabs`, fields: [{ name: "tabKey", type: "string" }, { name: "tabName", type: "string" }, { name: "tabOrder", type: "number" }], display: { title: "tabName", sub: "tabOrder" }, sqlExtra: "tab_key text not null,\n  tab_name text not null default '',\n  tab_order integer not null default 0,\n  tab_type text not null default 'standard'" },
    { tab: "formGroups", plural: "formGroups", singular: "FormGroup", pascal: "FormGroup", db: `${camel}FormGroups`, table: `${PREFIX}_form_groups`, fields: [{ name: "groupKey", type: "string" }, { name: "groupName", type: "string" }, { name: "groupOrder", type: "number" }], display: { title: "groupName", sub: "groupOrder" }, sqlExtra: "group_key text not null,\n  group_name text not null default '',\n  group_order integer not null default 0,\n  group_type text not null default 'standard'" },
    { tab: "repeatableSections", plural: "repeatableSections", singular: "RepeatableSection", pascal: "RepeatableSection", db: `${camel}RepeatableSections`, table: `${PREFIX}_repeatable_sections`, fields: [{ name: "sectionKey", type: "string" }, { name: "sectionName", type: "string" }, { name: "minInstances", type: "number" }], display: { title: "sectionName", sub: "minInstances" }, sqlExtra: "section_key text not null,\n  section_name text not null default '',\n  min_instances integer not null default 0,\n  max_instances integer not null default 10" },
    { tab: "formFields", plural: "formFields", singular: "FormField", pascal: "FormField", db: `${camel}FormFields`, table: `${PREFIX}_form_fields`, fields: [{ name: "fieldKey", type: "string" }, { name: "fieldName", type: "string" }, { name: "fieldType", type: "string" }], display: { title: "fieldName", sub: "fieldType" }, sqlExtra: "field_key text not null,\n  field_name text not null default '',\n  field_type text not null default 'text',\n  field_order integer not null default 0" },
    { tab: "fieldOptions", plural: "fieldOptions", singular: "FieldOption", pascal: "FieldOption", db: `${camel}FieldOptions`, table: `${PREFIX}_field_options`, fields: [{ name: "optionKey", type: "string" }, { name: "optionLabel", type: "string" }, { name: "optionValue", type: "string" }], display: { title: "optionLabel", sub: "optionValue" }, sqlExtra: "option_key text not null,\n  option_label text not null default '',\n  option_value text not null default '',\n  option_order integer not null default 0" },
    { tab: "formulaFields", plural: "formulaFields", singular: "FormulaField", pascal: "FormulaField", db: `${camel}FormulaFields`, table: `${PREFIX}_formula_fields`, fields: [{ name: "formulaKey", type: "string" }, { name: "formulaName", type: "string" }, { name: "formulaExpression", type: "string" }], display: { title: "formulaName", sub: "formulaExpression" }, sqlExtra: "formula_key text not null,\n  formula_name text not null default '',\n  formula_expression text not null default '',\n  result_type text not null default 'number'" },
    { tab: "mediaFields", plural: "mediaFields", singular: "MediaField", pascal: "MediaField", db: `${camel}MediaFields`, table: `${PREFIX}_media_fields`, fields: [{ name: "mediaKey", type: "string" }, { name: "mediaName", type: "string" }, { name: "mediaType", type: "string" }], display: { title: "mediaName", sub: "mediaType" }, sqlExtra: "media_key text not null,\n  media_name text not null default '',\n  media_type text not null default 'image',\n  max_file_size_mb integer not null default 10" },
    { tab: "requiredRules", plural: "requiredRules", singular: "RequiredRule", pascal: "RequiredRule", db: `${camel}RequiredRules`, table: `${PREFIX}_required_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "fieldRef", type: "string" }], display: { title: "ruleName", sub: "fieldRef" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  field_ref text not null default '',\n  error_message text not null default ''" },
    { tab: "regexRules", plural: "regexRules", singular: "RegexRule", pascal: "RegexRule", db: `${camel}RegexRules`, table: `${PREFIX}_regex_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "pattern", type: "string" }], display: { title: "ruleName", sub: "pattern" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  pattern text not null default '',\n  error_message text not null default ''" },
    { tab: "rangeRules", plural: "rangeRules", singular: "RangeRule", pascal: "RangeRule", db: `${camel}RangeRules`, table: `${PREFIX}_range_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "minValue", type: "number" }], display: { title: "ruleName", sub: "minValue" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  min_value numeric(12, 2),\n  max_value numeric(12, 2)" },
    { tab: "crossFieldRules", plural: "crossFieldRules", singular: "CrossFieldRule", pascal: "CrossFieldRule", db: `${camel}CrossFieldRules`, table: `${PREFIX}_cross_field_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleExpression", type: "string" }], display: { title: "ruleName", sub: "ruleExpression" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_expression text not null default '',\n  error_message text not null default ''" },
    { tab: "formDrafts", plural: "formDrafts", singular: "FormDraft", pascal: "FormDraft", db: `${camel}FormDrafts`, table: `${PREFIX}_form_drafts`, fields: [{ name: "draftKey", type: "string" }, { name: "draftName", type: "string" }, { name: "draftStatus", type: "string" }], display: { title: "draftName", sub: "draftStatus" }, sqlExtra: "draft_key text not null,\n  draft_name text not null default '',\n  draft_status text not null default 'draft',\n  saved_at timestamptz not null default now()" },
    { tab: "formSubmissions", plural: "formSubmissions", singular: "FormSubmission", pascal: "FormSubmission", db: `${camel}FormSubmissions`, table: `${PREFIX}_form_submissions`, fields: [{ name: "submissionKey", type: "string" }, { name: "submissionName", type: "string" }, { name: "submissionStatus", type: "string" }], display: { title: "submissionName", sub: "submissionStatus" }, sqlExtra: "submission_key text not null,\n  submission_name text not null default '',\n  submission_status text not null default 'submitted',\n  submitted_at timestamptz not null default now()" },
    { tab: "formReviews", plural: "formReviews", singular: "FormReview", pascal: "FormReview", db: `${camel}FormReviews`, table: `${PREFIX}_form_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "reviewName", type: "string" }, { name: "reviewStatus", type: "string" }], display: { title: "reviewName", sub: "reviewStatus" }, sqlExtra: "review_key text not null,\n  review_name text not null default '',\n  review_status text not null default 'pending',\n  reviewed_at timestamptz" },
    { tab: "executionAuditEntries", plural: "executionAuditEntries", singular: "ExecutionAuditEntry", pascal: "ExecutionAuditEntry", db: `${camel}ExecutionAuditEntries`, table: `${PREFIX}_execution_audit_entries`, fields: [{ name: "auditKey", type: "string" }, { name: "auditType", type: "string" }, { name: "auditSummary", type: "string" }], display: { title: "auditKey", sub: "auditType" }, sqlExtra: "audit_key text not null,\n  audit_type text not null default 'submission',\n  audit_summary text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "renderProfiles", plural: "renderProfiles", singular: "RenderProfile", pascal: "RenderProfile", db: `${camel}RenderProfiles`, table: `${PREFIX}_render_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileType", type: "string" }], display: { title: "profileName", sub: "profileType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_type text not null default 'standard',\n  layout_mode text not null default 'vertical'" },
    { tab: "themeConfigs", plural: "themeConfigs", singular: "ThemeConfig", pascal: "ThemeConfig", db: `${camel}ThemeConfigs`, table: `${PREFIX}_theme_configs`, fields: [{ name: "themeKey", type: "string" }, { name: "themeName", type: "string" }, { name: "primaryColor", type: "string" }], display: { title: "themeName", sub: "primaryColor" }, sqlExtra: "theme_key text not null,\n  theme_name text not null default '',\n  primary_color text not null default '#d97706',\n  theme_mode text not null default 'light'" },
    { tab: "localizationPacks", plural: "localizationPacks", singular: "LocalizationPack", pascal: "LocalizationPack", db: `${camel}LocalizationPacks`, table: `${PREFIX}_localization_packs`, fields: [{ name: "localeKey", type: "string" }, { name: "localeCode", type: "string" }, { name: "localeName", type: "string" }], display: { title: "localeName", sub: "localeCode" }, sqlExtra: "locale_key text not null,\n  locale_code text not null default 'en-US',\n  locale_name text not null default '',\n  translation_count integer not null default 0" },
    { tab: "submissionAnalytics", plural: "submissionAnalytics", singular: "SubmissionAnalytics", pascal: "SubmissionAnalytics", db: `${camel}SubmissionAnalytics`, table: `${PREFIX}_submission_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'submission',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "completionMetrics", plural: "completionMetrics", singular: "CompletionMetric", pascal: "CompletionMetric", db: `${camel}CompletionMetrics`, table: `${PREFIX}_completion_metrics`, fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" }, sqlExtra: "metric_key text not null,\n  metric_name text not null default '',\n  completion_rate numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "usageTrends", plural: "usageTrends", singular: "UsageTrend", pascal: "UsageTrend", db: `${camel}UsageTrends`, table: `${PREFIX}_usage_trends`, fields: [{ name: "trendKey", type: "string" }, { name: "trendName", type: "string" }, { name: "trendValue", type: "number" }], display: { title: "trendName", sub: "trendValue" }, sqlExtra: "trend_key text not null,\n  trend_name text not null default '',\n  trend_value numeric(12, 2) not null default 0,\n  trend_date date not null default current_date" },
    { tab: "formMetrics", plural: "formMetrics", singular: "FormMetric", pascal: "FormMetric", db: `${camel}FormMetrics`, table: `${PREFIX}_form_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "submissionCount", type: "number" }, { name: "overallFormScore", type: "number" }], display: { title: "metricsKey", sub: "overallFormScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  submission_count integer not null default 0,\n  completion_rate numeric(5, 2) not null default 100,\n  average_completion_time_ms integer not null default 0,\n  validation_error_count integer not null default 0,\n  abandonment_rate numeric(5, 2) not null default 0,\n  overall_form_score numeric(5, 2) not null default 100" },
    { tab: "formHealth", plural: "formHealth", singular: "FormHealth", pascal: "FormHealth", db: `${camel}FormHealth`, table: `${PREFIX}_form_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  pending_reviews_count integer not null default 0,\n  active_forms_count integer not null default 0,\n  framework_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "pendingReviewItems", plural: "pendingReviewItems", singular: "PendingReviewItem", pascal: "PendingReviewItem", db: `${camel}PendingReviewItems`, table: `${PREFIX}_pending_review_items`, fields: [{ name: "itemKey", type: "string" }, { name: "itemName", type: "string" }, { name: "reviewType", type: "string" }], display: { title: "itemName", sub: "reviewType" }, sqlExtra: "item_key text not null,\n  item_name text not null default '',\n  review_type text not null default 'submission',\n  priority text not null default 'normal'" },
    { tab: "formFailures", plural: "formFailures", singular: "FormFailure", pascal: "FormFailure", db: `${camel}FormFailures`, table: `${PREFIX}_form_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'validation',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 3: Enterprise Dynamic Form Engine\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise dynamic form engine data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage form registry, builder, validation, execution, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve form reviews and validation gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise dynamic form engine governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006b006b-006b-006b-006b-006b006b0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a335', '${org}', 'Enterprise Dynamic Form Orchestrator', 'enterprise_dynamic_form_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["form_registry","form_builder","field_engine","validation_engine","form_execution","form_rendering","form_analytics","form_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a535', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a335', 'northstar-form-engine-001', 'enterprise_dynamic_form_engine', 'form_hub', '${hubId}', '{"objective":"Enterprise dynamic form engine for northstar operational forms"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Form Hub\n`;
    sql += `insert into public.dfe_form_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-form-engine', 'Northstar Form Engine Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Form Registry\n`;
    sql += `insert into public.dfe_form_definitions (id, organization_id, hub_id, form_key, form_name, form_type, status)\nvalues ('006c006c-006c-006c-006c-006c006c0201', '${org}', '${hubId}', 'form-onboard-0804', 'Customer Onboarding Form', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('006d006d-006d-006d-006d-006d006d0301', '${org}', '${hubId}', 'cat-ops-0804', 'Operations', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)\nvalues ('006e006e-006e-006e-006e-006e006e0401', '${org}', '${hubId}', 'ver-1-0-0', '1.0.0', 'stable', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)\nvalues ('006f006f-006f-006f-006f-006f006f0501', '${org}', '${hubId}', 'dep-crm-0804', 'form', 'crm-onboarding', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Form Builder\n`;
    sql += `insert into public.dfe_form_sections (id, organization_id, hub_id, section_key, section_name, section_order, status)\nvalues ('00700070-0070-0070-0070-007000700601', '${org}', '${hubId}', 'sec-personal-0804', 'Personal Information', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_tabs (id, organization_id, hub_id, tab_key, tab_name, tab_order, status)\nvalues ('00710071-0071-0071-0071-007100710701', '${org}', '${hubId}', 'tab-details-0804', 'Details', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_groups (id, organization_id, hub_id, group_key, group_name, group_order, status)\nvalues ('00720072-0072-0072-0072-007200720801', '${org}', '${hubId}', 'grp-contact-0804', 'Contact Group', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_repeatable_sections (id, organization_id, hub_id, section_key, section_name, min_instances, status)\nvalues ('00730073-0073-0073-0073-007300730901', '${org}', '${hubId}', 'rep-addr-0804', 'Addresses', 0, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Field Engine\n`;
    sql += `insert into public.dfe_form_fields (id, organization_id, hub_id, field_key, field_name, field_type, status)\nvalues ('00740074-0074-0074-0074-007400740a01', '${org}', '${hubId}', 'fld-email-0804', 'Email Address', 'email', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_field_options (id, organization_id, hub_id, option_key, option_label, option_value, status)\nvalues ('00750075-0075-0075-0075-007500750b01', '${org}', '${hubId}', 'opt-yes-0804', 'Yes', 'yes', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_formula_fields (id, organization_id, hub_id, formula_key, formula_name, formula_expression, status)\nvalues ('00760076-0076-0076-0076-007600760c01', '${org}', '${hubId}', 'frm-total-0804', 'Total Amount', 'price * quantity', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_media_fields (id, organization_id, hub_id, media_key, media_name, media_type, status)\nvalues ('00770077-0077-0077-0077-007700770d01', '${org}', '${hubId}', 'med-doc-0804', 'Document Upload', 'document', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Validation Engine\n`;
    sql += `insert into public.dfe_required_rules (id, organization_id, hub_id, rule_key, rule_name, field_ref, status)\nvalues ('00780078-0078-0078-0078-007800780e01', '${org}', '${hubId}', 'req-email-0804', 'Email Required', 'fld-email-0804', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_regex_rules (id, organization_id, hub_id, rule_key, rule_name, pattern, status)\nvalues ('00790079-0079-0079-0079-007900790f01', '${org}', '${hubId}', 'rx-email-0804', 'Email Format', '^[^@]+@[^@]+\\\\.[^@]+$', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_range_rules (id, organization_id, hub_id, rule_key, rule_name, min_value, status)\nvalues ('007a007a-007a-007a-007a-007a007a1001', '${org}', '${hubId}', 'rng-age-0804', 'Age Range', 18, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_cross_field_rules (id, organization_id, hub_id, rule_key, rule_name, rule_expression, status)\nvalues ('007b007b-007b-007b-007b-007b007b1101', '${org}', '${hubId}', 'xfr-match-0804', 'Password Match', 'password === confirmPassword', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Form Execution\n`;
    sql += `insert into public.dfe_form_drafts (id, organization_id, hub_id, draft_key, draft_name, draft_status, status)\nvalues ('007c007c-007c-007c-007c-007c007c1201', '${org}', '${hubId}', 'drf-save-0804', 'Onboarding Draft #12', 'draft', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_submissions (id, organization_id, hub_id, submission_key, submission_name, submission_status, status)\nvalues ('007d007d-007d-007d-007d-007d007d1301', '${org}', '${hubId}', 'sub-run-0804', 'Onboarding Submission #42', 'submitted', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_reviews (id, organization_id, hub_id, review_key, review_name, review_status, status)\nvalues ('007e007e-007e-007e-007e-007e007e1401', '${org}', '${hubId}', 'rev-pending-0804', 'Pending Review', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_execution_audit_entries (id, organization_id, hub_id, audit_key, audit_type, audit_summary, status)\nvalues ('007f007f-007f-007f-007f-007f007f1501', '${org}', '${hubId}', 'aud-sub-0804', 'submission', 'Form submitted successfully', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Form Rendering\n`;
    sql += `insert into public.dfe_render_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)\nvalues ('00800080-0080-0080-0080-008000801601', '${org}', '${hubId}', 'prof-std-0804', 'Standard Layout', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_theme_configs (id, organization_id, hub_id, theme_key, theme_name, primary_color, status)\nvalues ('00810081-0081-0081-0081-008100811701', '${org}', '${hubId}', 'thm-amber-0804', 'Amber Theme', '#d97706', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_localization_packs (id, organization_id, hub_id, locale_key, locale_code, locale_name, status)\nvalues ('00820082-0082-0082-0082-008200821801', '${org}', '${hubId}', 'loc-en-0804', 'en-US', 'English (US)', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Form Analytics\n`;
    sql += `insert into public.dfe_submission_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00830083-0083-0083-0083-008300831901', '${org}', '${hubId}', 'anly-sub-0804', 'submission', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_completion_metrics (id, organization_id, hub_id, metric_key, metric_name, completion_rate, status)\nvalues ('00840084-0084-0084-0084-008400841a01', '${org}', '${hubId}', 'cmp-rate-0804', 'Completion Rate', 87.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_usage_trends (id, organization_id, hub_id, trend_key, trend_name, trend_value, status)\nvalues ('00850085-0085-0085-0085-008500851b01', '${org}', '${hubId}', 'trd-vol-0804', 'Submission Volume', 1250.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Form Dashboard\n`;
    sql += `insert into public.dfe_form_metrics (id, organization_id, metrics_key, submission_count, completion_rate, average_completion_time_ms, validation_error_count, abandonment_rate, overall_form_score, status)\nvalues ('00860086-0086-0086-0086-008600861c01', '${org}', 'form-metrics-0804', 1250, 87.50, 4500, 42, 12.50, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_reviews_count, active_forms_count, framework_health_status, summary, status)\nvalues ('00870087-0087-0087-0087-008700871d01', '${org}', 'form-health-0804', 95.00, false, 3, 42, 'healthy', 'Dynamic form engine operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_pending_review_items (id, organization_id, hub_id, item_key, item_name, review_type, status)\nvalues ('00880088-0088-0088-0088-008800881e01', '${org}', '${hubId}', 'item-rev-0804', 'Pending Submission Review', 'submission', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_form_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00890089-0089-0089-0089-008900892001', '${org}', '${hubId}', 'fail-val-0804', 'validation', 'VAL_REQUIRED', 'Required field email is missing', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dfe_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00900090-0090-0090-0090-009000902101', '${org}', 'form_hub', 'seed', 'Enterprise dynamic form engine seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgDfeRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgDfeRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgDfeRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020035_enterprise_dynamic_form_engine.sql");
const seedPath = join(root, "supabase/seed/035_enterprise_dynamic_form_engine_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/form-engine-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbDfeFormHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Dynamic Form Engine artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbDfe* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-form-engine-ui.mjs");

#!/usr/bin/env node
/**
 * Generates Sprint 7 Enterprise Operations Center artifacts.
 * Run: node scripts/generate-enterprise-operations-center.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "eoc";
const Pascal = "Eoc";
const camel = "eoc";
const theme = "emerald-600";
const route = "/operations-center";
const routeKey = "operationsCenter";
const permResource = "enterprise_operations_center";

const hubTable = `${PREFIX}_operations_centers`;
const orgOnlyTables = new Set([`${PREFIX}_operations_metrics`, `${PREFIX}_operations_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "operationsCenters", plural: "operationsCenters", singular: "OperationsCenter", pascal: "OperationsCenter", db: `${camel}OperationsCenters`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "centerKey", type: "string" }, { name: "centerName", type: "string" }, { name: "environment", type: "string" }], display: { title: "centerName", sub: "centerKey" }, sqlExtra: "center_key text not null,\n  center_name text not null,\n  environment text not null default 'production'" },
    { tab: "overallHealth", plural: "overallHealth", singular: "OverallHealth", pascal: "OverallHealth", db: `${camel}OverallHealth`, table: `${PREFIX}_overall_health`, fields: [{ name: "healthKey", type: "string" }, { name: "healthType", type: "select", options: "HEALTH_TYPE_OPTIONS" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthType" }, sqlExtra: "health_key text not null,\n  health_type text not null default 'overall',\n  health_score numeric(5, 2) not null default 100,\n  last_check_at timestamptz not null default now(),\n  check_details jsonb not null default '{}'::jsonb" },
    { tab: "moduleHealth", plural: "moduleHealth", singular: "ModuleHealth", pascal: "ModuleHealth", db: `${camel}ModuleHealth`, table: `${PREFIX}_module_health`, fields: [{ name: "healthKey", type: "string" }, { name: "moduleName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "moduleName", sub: "healthKey" }, sqlExtra: "health_key text not null,\n  module_name text not null default '',\n  health_score numeric(5, 2) not null default 100,\n  last_check_at timestamptz not null default now()" },
    { tab: "databaseHealth", plural: "databaseHealth", singular: "DatabaseHealth", pascal: "DatabaseHealth", db: `${camel}DatabaseHealth`, table: `${PREFIX}_database_health`, fields: [{ name: "healthKey", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthKey", sub: "healthKey" }, sqlExtra: "health_key text not null,\n  connection_pool_used integer not null default 0,\n  health_score numeric(5, 2) not null default 100,\n  last_check_at timestamptz not null default now()" },
    { tab: "queueHealth", plural: "queueHealth", singular: "QueueHealth", pascal: "QueueHealth", db: `${camel}QueueHealth`, table: `${PREFIX}_queue_health`, fields: [{ name: "healthKey", type: "string" }, { name: "queueDepth", type: "number" }], display: { title: "healthKey", sub: "healthKey" }, sqlExtra: "health_key text not null,\n  queue_depth integer not null default 0,\n  health_score numeric(5, 2) not null default 100,\n  last_check_at timestamptz not null default now()" },
    { tab: "jobSchedulers", plural: "jobSchedulers", singular: "JobScheduler", pascal: "JobScheduler", db: `${camel}JobSchedulers`, table: `${PREFIX}_job_schedulers`, fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "workerPoolSize", type: "number" }], display: { title: "schedulerName", sub: "schedulerKey" }, sqlExtra: "scheduler_key text not null,\n  scheduler_name text not null,\n  cron_expression text not null default '0 * * * *',\n  worker_pool_size integer not null default 4,\n  scheduler_status text not null default 'active'" },
    { tab: "recurringJobs", plural: "recurringJobs", singular: "RecurringJob", pascal: "RecurringJob", db: `${camel}RecurringJobs`, table: `${PREFIX}_recurring_jobs`, fields: [{ name: "jobKey", type: "string" }, { name: "jobName", type: "string" }, { name: "jobStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "jobName", sub: "jobKey" }, sqlExtra: "job_key text not null,\n  job_name text not null,\n  cron_expression text not null default '0 0 * * *',\n  job_status text not null default 'active',\n  last_run_at timestamptz,\n  next_run_at timestamptz" },
    { tab: "jobRetryQueue", plural: "jobRetryQueue", singular: "JobRetryQueue", pascal: "JobRetryQueue", db: `${camel}JobRetryQueue`, table: `${PREFIX}_job_retry_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "priority", type: "number" }], display: { title: "queueKey", sub: "jobRef" }, sqlExtra: "queue_key text not null,\n  job_ref text not null default '',\n  retry_count integer not null default 0,\n  max_retries integer not null default 3,\n  priority integer not null default 5,\n  next_retry_at timestamptz,\n  last_error text not null default ''" },
    { tab: "jobDeadLetter", plural: "jobDeadLetter", singular: "JobDeadLetter", pascal: "JobDeadLetter", db: `${camel}JobDeadLetter`, table: `${PREFIX}_job_dead_letter`, fields: [{ name: "deadLetterKey", type: "string" }, { name: "jobRef", type: "string" }, { name: "deadLetterStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "deadLetterKey", sub: "jobRef" }, sqlExtra: "dead_letter_key text not null,\n  job_ref text not null default '',\n  error_message text not null default '',\n  dead_letter_status text not null default 'pending',\n  failed_at timestamptz not null default now()" },
    { tab: "platformEvents", plural: "platformEvents", singular: "PlatformEvent", pascal: "PlatformEvent", db: `${camel}PlatformEvents`, table: `${PREFIX}_platform_events`, fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" }, sqlExtra: "event_key text not null,\n  event_type text not null default 'platform',\n  event_name text not null default '',\n  payload jsonb not null default '{}'::jsonb,\n  event_status text not null default 'published',\n  published_at timestamptz not null default now()" },
    { tab: "businessEvents", plural: "businessEvents", singular: "BusinessEvent", pascal: "BusinessEvent", db: `${camel}BusinessEvents`, table: `${PREFIX}_business_events`, fields: [{ name: "eventKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "eventStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "eventKey", sub: "eventType" }, sqlExtra: "event_key text not null,\n  event_type text not null default 'business',\n  event_name text not null default '',\n  payload jsonb not null default '{}'::jsonb,\n  event_status text not null default 'published',\n  published_at timestamptz not null default now()" },
    { tab: "eventSubscriptions", plural: "eventSubscriptions", singular: "EventSubscription", pascal: "EventSubscription", db: `${camel}EventSubscriptions`, table: `${PREFIX}_event_subscriptions`, fields: [{ name: "subscriptionKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }], display: { title: "subscriptionKey", sub: "eventType" }, sqlExtra: "subscription_key text not null,\n  event_type text not null default 'platform',\n  subscriber_ref text not null default '',\n  delivery_mode text not null default 'push',\n  subscription_status text not null default 'active'" },
    { tab: "eventReplays", plural: "eventReplays", singular: "EventReplay", pascal: "EventReplay", db: `${camel}EventReplays`, table: `${PREFIX}_event_replays`, fields: [{ name: "replayKey", type: "string" }, { name: "eventType", type: "select", options: "EVENT_TYPE_OPTIONS" }, { name: "replayStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "replayKey", sub: "eventType" }, sqlExtra: "replay_key text not null,\n  event_type text not null default 'platform',\n  from_timestamp timestamptz not null default now(),\n  to_timestamp timestamptz,\n  replay_status text not null default 'pending',\n  events_replayed integer not null default 0" },
    { tab: "alerts", plural: "alerts", singular: "Alert", pascal: "Alert", db: `${camel}Alerts`, table: `${PREFIX}_alerts`, fields: [{ name: "alertKey", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }, { name: "alertStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "alertKey", sub: "alertSeverity" }, sqlExtra: "alert_key text not null,\n  alert_title text not null default '',\n  alert_severity text not null default 'info',\n  alert_message text not null default '',\n  silenced boolean not null default false,\n  alert_status text not null default 'open',\n  triggered_at timestamptz not null default now()" },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: `${camel}EscalationRules`, table: `${PREFIX}_escalation_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "alertSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "ruleName", sub: "ruleKey" }, sqlExtra: "rule_key text not null,\n  rule_name text not null,\n  alert_severity text not null default 'critical',\n  escalation_delay_minutes integer not null default 15,\n  notify_channels jsonb not null default '[]'::jsonb" },
    { tab: "alertAcknowledgements", plural: "alertAcknowledgements", singular: "AlertAcknowledgement", pascal: "AlertAcknowledgement", db: `${camel}AlertAcknowledgements`, table: `${PREFIX}_alert_acknowledgements`, fields: [{ name: "ackKey", type: "string" }, { name: "ackStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "ackKey", sub: "ackKey" }, sqlExtra: "ack_key text not null,\n  alert_id uuid,\n  acknowledged_by text not null default '',\n  ack_note text not null default '',\n  ack_status text not null default 'acknowledged',\n  acknowledged_at timestamptz not null default now()" },
    { tab: "maintenanceWindows", plural: "maintenanceWindows", singular: "MaintenanceWindow", pascal: "MaintenanceWindow", db: `${camel}MaintenanceWindows`, table: `${PREFIX}_maintenance_windows`, fields: [{ name: "windowKey", type: "string" }, { name: "windowName", type: "string" }], display: { title: "windowName", sub: "windowKey" }, sqlExtra: "window_key text not null,\n  window_name text not null,\n  starts_at timestamptz not null default now(),\n  ends_at timestamptz,\n  suppress_alerts boolean not null default true,\n  window_status text not null default 'scheduled'" },
    { tab: "globalFlags", plural: "globalFlags", singular: "GlobalFlag", pascal: "GlobalFlag", db: `${camel}GlobalFlags`, table: `${PREFIX}_global_flags`, fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" }, sqlExtra: "flag_key text not null,\n  flag_name text not null,\n  enabled boolean not null default false,\n  kill_switch boolean not null default false,\n  rollout_percent integer not null default 0" },
    { tab: "tenantFlags", plural: "tenantFlags", singular: "TenantFlag", pascal: "TenantFlag", db: `${camel}TenantFlags`, table: `${PREFIX}_tenant_flags`, fields: [{ name: "flagKey", type: "string" }, { name: "flagName", type: "string" }, { name: "enabled", type: "boolean" }], display: { title: "flagName", sub: "flagKey" }, sqlExtra: "flag_key text not null,\n  flag_name text not null,\n  enabled boolean not null default false,\n  tenant_ref text not null default '',\n  rollout_percent integer not null default 0" },
    { tab: "betaFeatures", plural: "betaFeatures", singular: "BetaFeature", pascal: "BetaFeature", db: `${camel}BetaFeatures`, table: `${PREFIX}_beta_features`, fields: [{ name: "featureKey", type: "string" }, { name: "featureName", type: "string" }], display: { title: "featureName", sub: "featureKey" }, sqlExtra: "feature_key text not null,\n  feature_name text not null,\n  beta_status text not null default 'beta',\n  enrolled_tenants integer not null default 0" },
    { tab: "rolloutConfigs", plural: "rolloutConfigs", singular: "RolloutConfig", pascal: "RolloutConfig", db: `${camel}RolloutConfigs`, table: `${PREFIX}_rollout_configs`, fields: [{ name: "rolloutKey", type: "string" }, { name: "flagKey", type: "string" }, { name: "rolloutPercent", type: "number" }], display: { title: "rolloutKey", sub: "flagKey" }, sqlExtra: "rollout_key text not null,\n  flag_key text not null default '',\n  rollout_percent integer not null default 0,\n  target_criteria jsonb not null default '{}'::jsonb,\n  rollout_status text not null default 'active'" },
    { tab: "platformConfigs", plural: "platformConfigs", singular: "PlatformConfig", pascal: "PlatformConfig", db: `${camel}PlatformConfigs`, table: `${PREFIX}_platform_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" }, sqlExtra: "config_key text not null,\n  config_name text not null,\n  config_value jsonb not null default '{}'::jsonb,\n  environment_profile text not null default 'production',\n  approval_status text not null default 'approved'" },
    { tab: "tenantConfigs", plural: "tenantConfigs", singular: "TenantConfig", pascal: "TenantConfig", db: `${camel}TenantConfigs`, table: `${PREFIX}_tenant_configs`, fields: [{ name: "configKey", type: "string" }, { name: "configName", type: "string" }], display: { title: "configName", sub: "configKey" }, sqlExtra: "config_key text not null,\n  config_name text not null,\n  config_value jsonb not null default '{}'::jsonb,\n  tenant_ref text not null default '',\n  approval_status text not null default 'pending'" },
    { tab: "secretsMetadata", plural: "secretsMetadata", singular: "SecretsMetadata", pascal: "SecretsMetadata", db: `${camel}SecretsMetadata`, table: `${PREFIX}_secrets_metadata`, fields: [{ name: "secretKey", type: "string" }, { name: "secretName", type: "string" }], display: { title: "secretName", sub: "secretKey" }, sqlExtra: "secret_key text not null,\n  secret_name text not null,\n  vault_ref text not null default '',\n  rotation_due_at timestamptz,\n  secret_status text not null default 'active'" },
    { tab: "configVersions", plural: "configVersions", singular: "ConfigVersion", pascal: "ConfigVersion", db: `${camel}ConfigVersions`, table: `${PREFIX}_config_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }], display: { title: "versionNumber", sub: "versionKey" }, sqlExtra: "version_key text not null,\n  version_number text not null default '1.0.0',\n  config_snapshot jsonb not null default '{}'::jsonb,\n  approved_by text not null default '',\n  version_status text not null default 'draft'" },
    { tab: "platformLogs", plural: "platformLogs", singular: "PlatformLog", pascal: "PlatformLog", db: `${camel}PlatformLogs`, table: `${PREFIX}_platform_logs`, fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }], display: { title: "logKey", sub: "logLevel" }, sqlExtra: "log_key text not null,\n  log_level text not null default 'info',\n  service_name text not null default '',\n  message text not null default '',\n  logged_at timestamptz not null default now()" },
    { tab: "platformMetrics", plural: "platformMetrics", singular: "PlatformMetric", pascal: "PlatformMetric", db: `${camel}PlatformMetrics`, table: `${PREFIX}_platform_metrics`, fields: [{ name: "metricsKey", type: "string" }, { name: "dependencyHealth", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  dependency_health numeric(5, 2) not null default 100,\n  cpu_percent numeric(5, 2) not null default 0,\n  memory_percent numeric(5, 2) not null default 0" },
    { tab: "traceSummaries", plural: "traceSummaries", singular: "TraceSummary", pascal: "TraceSummary", db: `${camel}TraceSummaries`, table: `${PREFIX}_trace_summaries`, fields: [{ name: "traceKey", type: "string" }, { name: "spanCount", type: "number" }], display: { title: "traceKey", sub: "traceKey" }, sqlExtra: "trace_key text not null,\n  trace_id text not null default '',\n  span_count integer not null default 0,\n  duration_ms integer not null default 0,\n  traced_at timestamptz not null default now()" },
    { tab: "serviceRegistry", plural: "serviceRegistry", singular: "ServiceRegistry", pascal: "ServiceRegistry", db: `${camel}ServiceRegistry`, table: `${PREFIX}_service_registry`, fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "cacheStatus", type: "select", options: "JOB_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceKey" }, sqlExtra: "service_key text not null,\n  service_name text not null,\n  service_url text not null default '',\n  cache_status text not null default 'healthy',\n  last_heartbeat_at timestamptz not null default now()" },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: `${camel}OperationsMetrics`, table: `${PREFIX}_operations_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "operationalScore", type: "number" }], display: { title: "metricsKey", sub: "metricsKey" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  operational_score numeric(5, 2) not null default 100,\n  active_jobs integer not null default 0,\n  open_alerts integer not null default 0" },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: `${camel}OperationsHealth`, table: `${PREFIX}_operations_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "healthKey" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  uptime_percent numeric(5, 2) not null default 99.9,\n  disaster_recovery_mode boolean not null default false,\n  summary text not null default ''" },
    { tab: "operationsFailures", plural: "operationsFailures", singular: "OperationsFailure", pascal: "OperationsFailure", db: `${camel}OperationsFailures`, table: `${PREFIX}_operations_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'system',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program A Sprint 7: Enterprise Operations Center\n\n";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        const centerCol = isHub || isOrgOnly ? "" : "  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,\n";
        const uniqueSuffix = isHub ? "hub_key" : isOrgOnly ? e.sqlExtra.split("\n")[0].split(" ")[0] : "center_id, " + e.sqlExtra.split("\n")[0].split(" ")[0];
        const uniqueClause = isHub
            ? "unique (organization_id, center_key)"
            : isOrgOnly
                ? `unique (organization_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`
                : `unique (organization_id, center_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`;
        sql += `-- ${e.pascal}\n`;
        sql += `create table if not exists public.${e.table} (\n`;
        sql += `  id uuid primary key default gen_random_uuid(),\n`;
        sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
        sql += centerCol;
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
            sql += `create index if not exists idx_${t}_center on public.${t}(center_id);\n`;
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
    sql += `  ('${PREFIX}.view', 'View enterprise operations center data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage background jobs, events, alerts, and platform configuration', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve configuration changes and maintenance windows', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise operations center governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const centerId = "00110011-0011-0011-0011-001100110101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a330', '${org}', 'Enterprise Operations Center Orchestrator', 'enterprise_operations_center', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["system_health","background_jobs","event_bus","alert_management","feature_flags","configuration_center","platform_diagnostics","operations_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a530', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a330', 'northstar-operations-001', 'enterprise_operations_center', 'operations_center', '${centerId}', '{"objective":"enterprise operations center for northstar platform"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 System Health Center\n`;
    sql += `insert into public.eoc_operations_centers (id, organization_id, center_key, center_name, environment, status)\nvalues ('${centerId}', '${org}', 'northstar-operations', 'Northstar Operations Center', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_overall_health (id, organization_id, center_id, health_key, health_type, health_score, status)\nvalues\n  ('00120012-0012-0012-0012-001200120201', '${org}', '${centerId}', 'health-overall-0803', 'overall', 98.50, 'healthy'),\n  ('00120012-0012-0012-0012-001200120202', '${org}', '${centerId}', 'health-storage-0803', 'storage', 97.00, 'healthy'),\n  ('00120012-0012-0012-0012-001200120203', '${org}', '${centerId}', 'health-ai-0803', 'ai', 99.00, 'healthy'),\n  ('00120012-0012-0012-0012-001200120204', '${org}', '${centerId}', 'health-api-0803', 'api', 98.00, 'healthy'),\n  ('00120012-0012-0012-0012-001200120205', '${org}', '${centerId}', 'health-integration-0803', 'integration', 96.50, 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_module_health (id, organization_id, center_id, health_key, module_name, health_score, status)\nvalues ('00130013-0013-0013-0013-001300130301', '${org}', '${centerId}', 'mod-crm-0803', 'CRM', 99.00, 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_database_health (id, organization_id, center_id, health_key, connection_pool_used, health_score, status)\nvalues ('00140014-0014-0014-0014-001400140401', '${org}', '${centerId}', 'db-primary-0803', 12, 99.50, 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_queue_health (id, organization_id, center_id, health_key, queue_depth, health_score, status)\nvalues ('00150015-0015-0015-0015-001500150501', '${org}', '${centerId}', 'queue-jobs-0803', 3, 98.00, 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Background Job Platform\n`;
    sql += `insert into public.eoc_job_schedulers (id, organization_id, center_id, scheduler_key, scheduler_name, cron_expression, worker_pool_size, scheduler_status, status)\nvalues ('00160016-0016-0016-0016-001600160601', '${org}', '${centerId}', 'sched-daily-sync', 'Daily Sync Scheduler', '0 2 * * *', 8, 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_recurring_jobs (id, organization_id, center_id, job_key, job_name, cron_expression, job_status, status)\nvalues ('00170017-0017-0017-0017-001700170701', '${org}', '${centerId}', 'job-health-check', 'Health Check Job', '*/15 * * * *', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_job_retry_queue (id, organization_id, center_id, queue_key, job_ref, retry_count, max_retries, priority, last_error, status)\nvalues ('00180018-0018-0018-0018-001800180801', '${org}', '${centerId}', 'retry-job-0803', 'job-health-check', 1, 3, 5, 'timeout', 'pending')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_job_dead_letter (id, organization_id, center_id, dead_letter_key, job_ref, error_message, dead_letter_status, status)\nvalues ('00190019-0019-0019-0019-001900190901', '${org}', '${centerId}', 'dlq-job-0803', 'job-export-failed', 'connection refused', 'pending', 'failed')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Event Bus\n`;
    sql += `insert into public.eoc_platform_events (id, organization_id, center_id, event_key, event_type, event_name, event_status, status)\nvalues ('00200020-0020-0020-0020-002000200a01', '${org}', '${centerId}', 'evt-platform-startup', 'platform', 'Platform Startup', 'published', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_business_events (id, organization_id, center_id, event_key, event_type, event_name, event_status, status)\nvalues ('00210021-0021-0021-0021-002100210b01', '${org}', '${centerId}', 'evt-customer-signup', 'customer', 'Customer Signup', 'published', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_event_subscriptions (id, organization_id, center_id, subscription_key, event_type, subscriber_ref, subscription_status, status)\nvalues ('00220022-0022-0022-0022-002200220c01', '${org}', '${centerId}', 'sub-alerts-critical', 'platform', 'alert-manager', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_event_replays (id, organization_id, center_id, replay_key, event_type, replay_status, events_replayed, status)\nvalues ('00230023-0023-0023-0023-002300230d01', '${org}', '${centerId}', 'replay-0803-am', 'audit', 'completed', 42, 'completed')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Alert Management\n`;
    sql += `insert into public.eoc_alerts (id, organization_id, center_id, alert_key, alert_title, alert_severity, alert_message, alert_status, status)\nvalues ('00240024-0024-0024-0024-002400240e01', '${org}', '${centerId}', 'alert-queue-depth', 'Queue Depth Warning', 'warning', 'Job queue depth exceeded threshold', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_escalation_rules (id, organization_id, center_id, rule_key, rule_name, alert_severity, escalation_delay_minutes, status)\nvalues ('00250025-0025-0025-0025-002500250f01', '${org}', '${centerId}', 'esc-critical-15m', 'Critical 15min Escalation', 'critical', 15, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_alert_acknowledgements (id, organization_id, center_id, ack_key, acknowledged_by, ack_status, status)\nvalues ('00260026-0026-0026-0026-002600261001', '${org}', '${centerId}', 'ack-alert-0803', 'ops-lead', 'acknowledged', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_maintenance_windows (id, organization_id, center_id, window_key, window_name, window_status, status)\nvalues ('00270027-0027-0027-0027-002700271101', '${org}', '${centerId}', 'maint-weekend', 'Weekend Maintenance', 'scheduled', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Feature Flag Platform\n`;
    sql += `insert into public.eoc_global_flags (id, organization_id, center_id, flag_key, flag_name, enabled, rollout_percent, status)\nvalues ('00280028-0028-0028-0028-002800281201', '${org}', '${centerId}', 'flag-new-dashboard', 'New Dashboard UI', true, 50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_tenant_flags (id, organization_id, center_id, flag_key, flag_name, enabled, tenant_ref, status)\nvalues ('00290029-0029-0029-0029-002900291301', '${org}', '${centerId}', 'flag-beta-analytics', 'Beta Analytics', true, 'northstar', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_beta_features (id, organization_id, center_id, feature_key, feature_name, beta_status, enrolled_tenants, status)\nvalues ('002a002a-002a-002a-002a-002a002a1401', '${org}', '${centerId}', 'beta-ai-insights', 'AI Insights Beta', 'beta', 5, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_rollout_configs (id, organization_id, center_id, rollout_key, flag_key, rollout_percent, rollout_status, status)\nvalues ('002b002b-002b-002b-002b-002b002b1501', '${org}', '${centerId}', 'rollout-dashboard', 'flag-new-dashboard', 50, 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Configuration Center\n`;
    sql += `insert into public.eoc_platform_configs (id, organization_id, center_id, config_key, config_name, environment_profile, approval_status, status)\nvalues ('002c002c-002c-002c-002c-002c002c1601', '${org}', '${centerId}', 'cfg-log-level', 'Platform Log Level', 'production', 'approved', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_tenant_configs (id, organization_id, center_id, config_key, config_name, tenant_ref, approval_status, status)\nvalues ('002d002d-002d-002d-002d-002d002d1701', '${org}', '${centerId}', 'cfg-tenant-limits', 'Tenant Rate Limits', 'northstar', 'approved', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_secrets_metadata (id, organization_id, center_id, secret_key, secret_name, vault_ref, secret_status, status)\nvalues ('002e002e-002e-002e-002e-002e002e1801', '${org}', '${centerId}', 'sec-db-credentials', 'Database Credentials', 'vault://db/northstar', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_config_versions (id, organization_id, center_id, version_key, version_number, version_status, status)\nvalues ('002f002f-002f-002f-002f-002f002f1901', '${org}', '${centerId}', 'ver-config-v2', '2.0.0', 'approved', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Platform Diagnostics\n`;
    sql += `insert into public.eoc_platform_logs (id, organization_id, center_id, log_key, log_level, service_name, message, status)\nvalues ('00300030-0030-0030-0030-003000301a01', '${org}', '${centerId}', 'log-startup-0803', 'info', 'operations-center', 'Platform startup complete', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_platform_metrics (id, organization_id, center_id, metrics_key, dependency_health, cpu_percent, memory_percent, status)\nvalues ('00310031-0031-0031-0031-003100311b01', '${org}', '${centerId}', 'metrics-0803', 99.00, 35.00, 62.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_trace_summaries (id, organization_id, center_id, trace_key, trace_id, span_count, duration_ms, status)\nvalues ('00320032-0032-0032-0032-003200321c01', '${org}', '${centerId}', 'trace-api-0803', 'tr-abc123', 12, 245, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_service_registry (id, organization_id, center_id, service_key, service_name, service_url, cache_status, status)\nvalues ('00330033-0033-0033-0033-003300331d01', '${org}', '${centerId}', 'svc-auth', 'Auth Service', 'http://auth:8080', 'healthy', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Enterprise Operations Dashboard\n`;
    sql += `insert into public.eoc_operations_metrics (id, organization_id, metrics_key, operational_score, active_jobs, open_alerts, status)\nvalues ('00340034-0034-0034-0034-003400341e01', '${org}', 'ops-metrics-0803', 97.50, 8, 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_operations_health (id, organization_id, health_key, overall_score, uptime_percent, disaster_recovery_mode, summary, status)\nvalues ('00350035-0035-0035-0035-003500351f01', '${org}', 'ops-health-0803', 98.00, 99.95, false, 'All systems operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_operations_failures (id, organization_id, center_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00360036-0036-0036-0036-003600362001', '${org}', '${centerId}', 'fail-export-0803', 'background_job', 'TIMEOUT', 'Export job timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.eoc_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00370037-0037-0037-0037-003700372101', '${org}', 'operations_center', 'seed', 'Enterprise operations center seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgEocRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgEocRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgEocRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
    return sql;
}

function buildDbTypes() {
    let types = "";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly;
        types += `export interface Db${Pascal}${e.pascal} {\n    id: string;\n    organization_id: string;\n`;
        if (!isHub && !isOrgOnly) types += `    center_id: string;\n`;
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
            types += `    ${name}:${opt} ${tsType};\n`;
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

// Generate migration, seed, repos, db types
writeFileSync(join(root, "supabase/migrations/202608020030_enterprise_operations_center.sql"), buildMigration(), "utf8");
writeFileSync(join(root, "supabase/seed/030_enterprise_operations_center_seed.sql"), buildSeed(), "utf8");
writeFileSync(join(root, "src/modules/database/repositories/operations-center-repositories.ts"), buildRepositories(), "utf8");

const platformPath = join(root, "src/modules/database/types/platform.ts");
const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbEocOperationsCenter")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated migration, seed, repositories, and platform types.");
console.log("Run: node scripts/generate-operations-center-ui.mjs");

#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 4 Enterprise Dynamic Workflow Engine artifacts.
 * Run: node scripts/generate-enterprise-dynamic-workflow-engine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "dwe";
const Pascal = "Dwe";
const camel = "dwe";
const permResource = "enterprise_dynamic_workflow_engine";

const hubTable = `${PREFIX}_workflow_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_workflow_metrics`, `${PREFIX}_workflow_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "workflowHubs", plural: "workflowHubs", singular: "WorkflowHub", pascal: "WorkflowHub", db: `${camel}WorkflowHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "workflowDefinitions", plural: "workflowDefinitions", singular: "WorkflowDefinition", pascal: "WorkflowDefinition", db: `${camel}WorkflowDefinitions`, table: `${PREFIX}_workflow_definitions`, fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowType", type: "string" }], display: { title: "workflowName", sub: "workflowType" }, sqlExtra: "workflow_key text not null,\n  workflow_name text not null default '',\n  workflow_type text not null default 'standard',\n  description text not null default ''" },
    { tab: "workflowCategories", plural: "workflowCategories", singular: "WorkflowCategory", pascal: "WorkflowCategory", db: `${camel}WorkflowCategories`, table: `${PREFIX}_workflow_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'general',\n  description text not null default ''" },
    { tab: "workflowTemplates", plural: "workflowTemplates", singular: "WorkflowTemplate", pascal: "WorkflowTemplate", db: `${camel}WorkflowTemplates`, table: `${PREFIX}_workflow_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_type text not null default 'standard',\n  description text not null default ''" },
    { tab: "workflowVersions", plural: "workflowVersions", singular: "WorkflowVersion", pascal: "WorkflowVersion", db: `${camel}WorkflowVersions`, table: `${PREFIX}_workflow_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  published_at timestamptz" },
    { tab: "workflowNodes", plural: "workflowNodes", singular: "WorkflowNode", pascal: "WorkflowNode", db: `${camel}WorkflowNodes`, table: `${PREFIX}_workflow_nodes`, fields: [{ name: "nodeKey", type: "string" }, { name: "nodeName", type: "string" }, { name: "nodeType", type: "string" }], display: { title: "nodeName", sub: "nodeType" }, sqlExtra: "node_key text not null,\n  node_name text not null default '',\n  node_type text not null default 'task',\n  node_order integer not null default 0" },
    { tab: "workflowTransitions", plural: "workflowTransitions", singular: "WorkflowTransition", pascal: "WorkflowTransition", db: `${camel}WorkflowTransitions`, table: `${PREFIX}_workflow_transitions`, fields: [{ name: "transitionKey", type: "string" }, { name: "transitionName", type: "string" }, { name: "sourceNodeRef", type: "string" }], display: { title: "transitionName", sub: "sourceNodeRef" }, sqlExtra: "transition_key text not null,\n  transition_name text not null default '',\n  source_node_ref text not null default '',\n  target_node_ref text not null default ''" },
    { tab: "decisionNodes", plural: "decisionNodes", singular: "DecisionNode", pascal: "DecisionNode", db: `${camel}DecisionNodes`, table: `${PREFIX}_decision_nodes`, fields: [{ name: "decisionKey", type: "string" }, { name: "decisionName", type: "string" }, { name: "decisionExpression", type: "string" }], display: { title: "decisionName", sub: "decisionExpression" }, sqlExtra: "decision_key text not null,\n  decision_name text not null default '',\n  decision_expression text not null default '',\n  default_branch text not null default ''" },
    { tab: "reusableSubflows", plural: "reusableSubflows", singular: "ReusableSubflow", pascal: "ReusableSubflow", db: `${camel}ReusableSubflows`, table: `${PREFIX}_reusable_subflows`, fields: [{ name: "subflowKey", type: "string" }, { name: "subflowName", type: "string" }, { name: "subflowType", type: "string" }], display: { title: "subflowName", sub: "subflowType" }, sqlExtra: "subflow_key text not null,\n  subflow_name text not null default '',\n  subflow_type text not null default 'standard',\n  input_schema jsonb not null default '{}'::jsonb" },
    { tab: "workflowExecutions", plural: "workflowExecutions", singular: "WorkflowExecution", pascal: "WorkflowExecution", db: `${camel}WorkflowExecutions`, table: `${PREFIX}_workflow_executions`, fields: [{ name: "executionKey", type: "string" }, { name: "executionName", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "executionName", sub: "executionStatus" }, sqlExtra: "execution_key text not null,\n  execution_name text not null default '',\n  execution_status text not null default 'running',\n  started_at timestamptz not null default now()" },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: `${camel}ExecutionHistory`, table: `${PREFIX}_execution_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyType" }, sqlExtra: "history_key text not null,\n  history_type text not null default 'step',\n  history_summary text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "executionRetries", plural: "executionRetries", singular: "ExecutionRetry", pascal: "ExecutionRetry", db: `${camel}ExecutionRetries`, table: `${PREFIX}_execution_retries`, fields: [{ name: "retryKey", type: "string" }, { name: "retryCount", type: "number" }, { name: "retryStatus", type: "string" }], display: { title: "retryKey", sub: "retryStatus" }, sqlExtra: "retry_key text not null,\n  retry_count integer not null default 0,\n  retry_status text not null default 'pending',\n  next_retry_at timestamptz" },
    { tab: "executionRollbacks", plural: "executionRollbacks", singular: "ExecutionRollback", pascal: "ExecutionRollback", db: `${camel}ExecutionRollbacks`, table: `${PREFIX}_execution_rollbacks`, fields: [{ name: "rollbackKey", type: "string" }, { name: "rollbackReason", type: "string" }, { name: "rollbackStatus", type: "string" }], display: { title: "rollbackKey", sub: "rollbackStatus" }, sqlExtra: "rollback_key text not null,\n  rollback_reason text not null default '',\n  rollback_status text not null default 'pending',\n  rolled_back_at timestamptz" },
    { tab: "timeTriggers", plural: "timeTriggers", singular: "TimeTrigger", pascal: "TimeTrigger", db: `${camel}TimeTriggers`, table: `${PREFIX}_time_triggers`, fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "cronExpression", type: "string" }], display: { title: "triggerName", sub: "cronExpression" }, sqlExtra: "trigger_key text not null,\n  trigger_name text not null default '',\n  cron_expression text not null default '',\n  timezone text not null default 'UTC'" },
    { tab: "businessEventTriggers", plural: "businessEventTriggers", singular: "BusinessEventTrigger", pascal: "BusinessEventTrigger", db: `${camel}BusinessEventTriggers`, table: `${PREFIX}_business_event_triggers`, fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "eventType", type: "string" }], display: { title: "triggerName", sub: "eventType" }, sqlExtra: "trigger_key text not null,\n  trigger_name text not null default '',\n  event_type text not null default '',\n  event_filter jsonb not null default '{}'::jsonb" },
    { tab: "webhookTriggers", plural: "webhookTriggers", singular: "WebhookTrigger", pascal: "WebhookTrigger", db: `${camel}WebhookTriggers`, table: `${PREFIX}_webhook_triggers`, fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "webhookUrl", type: "string" }], display: { title: "triggerName", sub: "webhookUrl" }, sqlExtra: "trigger_key text not null,\n  trigger_name text not null default '',\n  webhook_url text not null default '',\n  secret_token text not null default ''" },
    { tab: "scheduledTriggers", plural: "scheduledTriggers", singular: "ScheduledTrigger", pascal: "ScheduledTrigger", db: `${camel}ScheduledTriggers`, table: `${PREFIX}_scheduled_triggers`, fields: [{ name: "triggerKey", type: "string" }, { name: "triggerName", type: "string" }, { name: "scheduleType", type: "string" }], display: { title: "triggerName", sub: "scheduleType" }, sqlExtra: "trigger_key text not null,\n  trigger_name text not null default '',\n  schedule_type text not null default 'interval',\n  interval_seconds integer not null default 3600" },
    { tab: "manualReviews", plural: "manualReviews", singular: "ManualReview", pascal: "ManualReview", db: `${camel}ManualReviews`, table: `${PREFIX}_manual_reviews`, fields: [{ name: "reviewKey", type: "string" }, { name: "reviewName", type: "string" }, { name: "reviewStatus", type: "string" }], display: { title: "reviewName", sub: "reviewStatus" }, sqlExtra: "review_key text not null,\n  review_name text not null default '',\n  review_status text not null default 'pending',\n  assigned_to uuid" },
    { tab: "approvalTasks", plural: "approvalTasks", singular: "ApprovalTask", pascal: "ApprovalTask", db: `${camel}ApprovalTasks`, table: `${PREFIX}_approval_tasks`, fields: [{ name: "taskKey", type: "string" }, { name: "taskName", type: "string" }, { name: "taskStatus", type: "string" }], display: { title: "taskName", sub: "taskStatus" }, sqlExtra: "task_key text not null,\n  task_name text not null default '',\n  task_status text not null default 'pending',\n  due_at timestamptz" },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: `${camel}EscalationRules`, table: `${PREFIX}_escalation_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "escalationLevel", type: "number" }], display: { title: "ruleName", sub: "escalationLevel" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  escalation_level integer not null default 1,\n  escalation_after_minutes integer not null default 60" },
    { tab: "slaTrackings", plural: "slaTrackings", singular: "SlaTracking", pascal: "SlaTracking", db: `${camel}SlaTrackings`, table: `${PREFIX}_sla_trackings`, fields: [{ name: "slaKey", type: "string" }, { name: "slaName", type: "string" }, { name: "targetMinutes", type: "number" }], display: { title: "slaName", sub: "targetMinutes" }, sqlExtra: "sla_key text not null,\n  sla_name text not null default '',\n  target_minutes integer not null default 60,\n  breach_at timestamptz" },
    { tab: "automationNotifications", plural: "automationNotifications", singular: "AutomationNotification", pascal: "AutomationNotification", db: `${camel}AutomationNotifications`, table: `${PREFIX}_automation_notifications`, fields: [{ name: "notificationKey", type: "string" }, { name: "notificationName", type: "string" }, { name: "channel", type: "string" }], display: { title: "notificationName", sub: "channel" }, sqlExtra: "notification_key text not null,\n  notification_name text not null default '',\n  channel text not null default 'email',\n  template_ref text not null default ''" },
    { tab: "automationApiCalls", plural: "automationApiCalls", singular: "AutomationApiCall", pascal: "AutomationApiCall", db: `${camel}AutomationApiCalls`, table: `${PREFIX}_automation_api_calls`, fields: [{ name: "apiKey", type: "string" }, { name: "apiName", type: "string" }, { name: "endpointUrl", type: "string" }], display: { title: "apiName", sub: "endpointUrl" }, sqlExtra: "api_key text not null,\n  api_name text not null default '',\n  endpoint_url text not null default '',\n  http_method text not null default 'POST'" },
    { tab: "automationIntegrations", plural: "automationIntegrations", singular: "AutomationIntegration", pascal: "AutomationIntegration", db: `${camel}AutomationIntegrations`, table: `${PREFIX}_automation_integrations`, fields: [{ name: "integrationKey", type: "string" }, { name: "integrationName", type: "string" }, { name: "integrationType", type: "string" }], display: { title: "integrationName", sub: "integrationType" }, sqlExtra: "integration_key text not null,\n  integration_name text not null default '',\n  integration_type text not null default 'rest',\n  config jsonb not null default '{}'::jsonb" },
    { tab: "executionAnalytics", plural: "executionAnalytics", singular: "ExecutionAnalytics", pascal: "ExecutionAnalytics", db: `${camel}ExecutionAnalytics`, table: `${PREFIX}_execution_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'execution',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "bottleneckReports", plural: "bottleneckReports", singular: "BottleneckReport", pascal: "BottleneckReport", db: `${camel}BottleneckReports`, table: `${PREFIX}_bottleneck_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "bottleneckScore", type: "number" }], display: { title: "reportName", sub: "bottleneckScore" }, sqlExtra: "report_key text not null,\n  report_name text not null default '',\n  bottleneck_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "slaComplianceMetrics", plural: "slaComplianceMetrics", singular: "SlaComplianceMetric", pascal: "SlaComplianceMetric", db: `${camel}SlaComplianceMetrics`, table: `${PREFIX}_sla_compliance_metrics`, fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "complianceRate", type: "number" }], display: { title: "metricName", sub: "complianceRate" }, sqlExtra: "metric_key text not null,\n  metric_name text not null default '',\n  compliance_rate numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "workflowMetrics", plural: "workflowMetrics", singular: "WorkflowMetric", pascal: "WorkflowMetric", db: `${camel}WorkflowMetrics`, table: `${PREFIX}_workflow_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "executionCount", type: "number" }, { name: "overallWorkflowScore", type: "number" }], display: { title: "metricsKey", sub: "overallWorkflowScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  execution_count integer not null default 0,\n  average_duration_ms integer not null default 0,\n  failure_rate numeric(5, 2) not null default 0,\n  success_rate numeric(5, 2) not null default 100,\n  bottleneck_score numeric(5, 2) not null default 0,\n  sla_compliance_score numeric(5, 2) not null default 100,\n  overall_workflow_score numeric(5, 2) not null default 100" },
    { tab: "workflowHealth", plural: "workflowHealth", singular: "WorkflowHealth", pascal: "WorkflowHealth", db: `${camel}WorkflowHealth`, table: `${PREFIX}_workflow_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  running_workflows_count integer not null default 0,\n  pending_tasks_count integer not null default 0,\n  automation_health_status text not null default 'healthy',\n  framework_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "failedExecutions", plural: "failedExecutions", singular: "FailedExecution", pascal: "FailedExecution", db: `${camel}FailedExecutions`, table: `${PREFIX}_failed_executions`, fields: [{ name: "failureKey", type: "string" }, { name: "executionRef", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  execution_ref text not null default '',\n  failure_type text not null default 'runtime',\n  error_message text not null default '',\n  failed_at timestamptz not null default now()" },
    { tab: "workflowFailures", plural: "workflowFailures", singular: "WorkflowFailure", pascal: "WorkflowFailure", db: `${camel}WorkflowFailures`, table: `${PREFIX}_workflow_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'execution',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 4: Enterprise Dynamic Workflow Engine\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise dynamic workflow engine data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage workflow registry, designer, execution, automation, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve workflow reviews and approval gates', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise dynamic workflow engine governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006c006c-006c-006c-006c-006c006c0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a336', '${org}', 'Enterprise Dynamic Workflow Orchestrator', 'enterprise_dynamic_workflow_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["workflow_registry","visual_designer","execution_engine","event_triggers","approval_tasks","workflow_automation","workflow_analytics","workflow_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a536', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a336', 'northstar-workflow-engine-001', 'enterprise_dynamic_workflow_engine', 'workflow_hub', '${hubId}', '{"objective":"Enterprise dynamic workflow engine for northstar operational workflows"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Workflow Hub\n`;
    sql += `insert into public.dwe_workflow_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-workflow-engine', 'Northstar Workflow Engine Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Workflow Registry\n`;
    sql += `insert into public.dwe_workflow_definitions (id, organization_id, hub_id, workflow_key, workflow_name, workflow_type, status)\nvalues ('006d006d-006d-006d-006d-006d006d0201', '${org}', '${hubId}', 'wf-onboard-0804', 'Customer Onboarding Workflow', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('006e006e-006e-006e-006e-006e006e0301', '${org}', '${hubId}', 'cat-ops-0804', 'Operations', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)\nvalues ('006f006f-006f-006f-006f-006f006f0401', '${org}', '${hubId}', 'tpl-std-0804', 'Standard Approval Template', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)\nvalues ('00700070-0070-0070-0070-007000700501', '${org}', '${hubId}', 'ver-1-0-0', '1.0.0', 'stable', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Visual Designer\n`;
    sql += `insert into public.dwe_workflow_nodes (id, organization_id, hub_id, node_key, node_name, node_type, status)\nvalues ('00710071-0071-0071-0071-007100710601', '${org}', '${hubId}', 'node-start-0804', 'Start Node', 'start', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_transitions (id, organization_id, hub_id, transition_key, transition_name, source_node_ref, status)\nvalues ('00720072-0072-0072-0072-007200720701', '${org}', '${hubId}', 'trn-approve-0804', 'Approve Transition', 'node-start-0804', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_decision_nodes (id, organization_id, hub_id, decision_key, decision_name, decision_expression, status)\nvalues ('00730073-0073-0073-0073-007300730801', '${org}', '${hubId}', 'dec-amount-0804', 'Amount Check', 'amount > 1000', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_reusable_subflows (id, organization_id, hub_id, subflow_key, subflow_name, subflow_type, status)\nvalues ('00740074-0074-0074-0074-007400740901', '${org}', '${hubId}', 'sub-notify-0804', 'Notification Subflow', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Execution Engine\n`;
    sql += `insert into public.dwe_workflow_executions (id, organization_id, hub_id, execution_key, execution_name, execution_status, status)\nvalues ('00750075-0075-0075-0075-007500750a01', '${org}', '${hubId}', 'exec-run-0804', 'Onboarding Execution #42', 'running', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_execution_history (id, organization_id, hub_id, history_key, history_type, history_summary, status)\nvalues ('00760076-0076-0076-0076-007600760b01', '${org}', '${hubId}', 'hist-step-0804', 'step', 'Step completed successfully', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_execution_retries (id, organization_id, hub_id, retry_key, retry_count, retry_status, status)\nvalues ('00770077-0077-0077-0077-007700770c01', '${org}', '${hubId}', 'rty-fail-0804', 1, 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_execution_rollbacks (id, organization_id, hub_id, rollback_key, rollback_reason, rollback_status, status)\nvalues ('00780078-0078-0078-0078-007800780d01', '${org}', '${hubId}', 'rbk-err-0804', 'Validation failed', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Event & Trigger\n`;
    sql += `insert into public.dwe_time_triggers (id, organization_id, hub_id, trigger_key, trigger_name, cron_expression, status)\nvalues ('00790079-0079-0079-0079-007900790e01', '${org}', '${hubId}', 'trg-daily-0804', 'Daily Trigger', '0 9 * * *', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_business_event_triggers (id, organization_id, hub_id, trigger_key, trigger_name, event_type, status)\nvalues ('007a007a-007a-007a-007a-007a007a0f01', '${org}', '${hubId}', 'trg-order-0804', 'Order Created', 'order.created', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_webhook_triggers (id, organization_id, hub_id, trigger_key, trigger_name, webhook_url, status)\nvalues ('007b007b-007b-007b-007b-007b007b1001', '${org}', '${hubId}', 'trg-hook-0804', 'Webhook Trigger', 'https://api.example.com/hook', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_scheduled_triggers (id, organization_id, hub_id, trigger_key, trigger_name, schedule_type, status)\nvalues ('007c007c-007c-007c-007c-007c007c1101', '${org}', '${hubId}', 'trg-sched-0804', 'Hourly Trigger', 'interval', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Approval & Human Tasks\n`;
    sql += `insert into public.dwe_manual_reviews (id, organization_id, hub_id, review_key, review_name, review_status, status)\nvalues ('007d007d-007d-007d-007d-007d007d1201', '${org}', '${hubId}', 'rev-pending-0804', 'Pending Manual Review', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_approval_tasks (id, organization_id, hub_id, task_key, task_name, task_status, status)\nvalues ('007e007e-007e-007e-007e-007e007e1301', '${org}', '${hubId}', 'tsk-approve-0804', 'Manager Approval', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_escalation_rules (id, organization_id, hub_id, rule_key, rule_name, escalation_level, status)\nvalues ('007f007f-007f-007f-007f-007f007f1401', '${org}', '${hubId}', 'esc-l1-0804', 'Level 1 Escalation', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_sla_trackings (id, organization_id, hub_id, sla_key, sla_name, target_minutes, status)\nvalues ('00800080-0080-0080-0080-008000801501', '${org}', '${hubId}', 'sla-24h-0804', '24 Hour SLA', 1440, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Workflow Automation\n`;
    sql += `insert into public.dwe_automation_notifications (id, organization_id, hub_id, notification_key, notification_name, channel, status)\nvalues ('00810081-0081-0081-0081-008100811601', '${org}', '${hubId}', 'ntf-email-0804', 'Email Notification', 'email', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_automation_api_calls (id, organization_id, hub_id, api_key, api_name, endpoint_url, status)\nvalues ('00820082-0082-0082-0082-008200821701', '${org}', '${hubId}', 'api-crm-0804', 'CRM API Call', 'https://api.example.com/crm', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_automation_integrations (id, organization_id, hub_id, integration_key, integration_name, integration_type, status)\nvalues ('00830083-0083-0083-0083-008300831801', '${org}', '${hubId}', 'int-slack-0804', 'Slack Integration', 'rest', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Workflow Analytics\n`;
    sql += `insert into public.dwe_execution_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00840084-0084-0084-0084-008400841901', '${org}', '${hubId}', 'anly-exec-0804', 'execution', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_bottleneck_reports (id, organization_id, hub_id, report_key, report_name, bottleneck_score, status)\nvalues ('00850085-0085-0085-0085-008500851a01', '${org}', '${hubId}', 'bnk-approval-0804', 'Approval Bottleneck', 12.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_sla_compliance_metrics (id, organization_id, hub_id, metric_key, metric_name, compliance_rate, status)\nvalues ('00860086-0086-0086-0086-008600861b01', '${org}', '${hubId}', 'sla-rate-0804', 'SLA Compliance Rate', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Workflow Dashboard\n`;
    sql += `insert into public.dwe_workflow_metrics (id, organization_id, metrics_key, execution_count, average_duration_ms, failure_rate, success_rate, bottleneck_score, sla_compliance_score, overall_workflow_score, status)\nvalues ('00870087-0087-0087-0087-008700871c01', '${org}', 'wf-metrics-0804', 850, 3200, 2.50, 97.50, 8.00, 96.00, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, running_workflows_count, pending_tasks_count, automation_health_status, framework_health_status, summary, status)\nvalues ('00880088-0088-0088-0088-008800881d01', '${org}', 'wf-health-0804', 95.00, false, 12, 5, 'healthy', 'healthy', 'Dynamic workflow engine operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_failed_executions (id, organization_id, hub_id, failure_key, execution_ref, failure_type, error_message, status)\nvalues ('00890089-0089-0089-0089-008900891e01', '${org}', '${hubId}', 'fail-exec-0804', 'exec-run-0804', 'runtime', 'Node execution timeout', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_workflow_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00900090-0090-0090-0090-009000902001', '${org}', '${hubId}', 'fail-wf-0804', 'execution', 'WF_TIMEOUT', 'Workflow execution timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.dwe_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00910091-0091-0091-0091-009100912101', '${org}', 'workflow_hub', 'seed', 'Enterprise dynamic workflow engine seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgDweRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgDweRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgDweRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020036_enterprise_dynamic_workflow_engine.sql");
const seedPath = join(root, "supabase/seed/036_enterprise_dynamic_workflow_engine_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/workflow-engine-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbDweWorkflowHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Dynamic Workflow Engine artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbDwe* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-workflow-engine-ui.mjs");

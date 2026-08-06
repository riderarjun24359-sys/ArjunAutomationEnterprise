#!/usr/bin/env node
/**
 * Generates V2 Program B Sprint 2 Enterprise Business Process Framework artifacts.
 * Run: node scripts/generate-enterprise-business-process-framework.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "bpf";
const Pascal = "Bpf";
const camel = "bpf";
const permResource = "enterprise_business_process_framework";

const hubTable = `${PREFIX}_process_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_process_metrics`, `${PREFIX}_process_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "processHubs", plural: "processHubs", singular: "ProcessHub", pascal: "ProcessHub", db: `${camel}ProcessHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production'" },
    { tab: "businessProcesses", plural: "businessProcesses", singular: "BusinessProcess", pascal: "BusinessProcess", db: `${camel}BusinessProcesses`, table: `${PREFIX}_business_processes`, fields: [{ name: "processKey", type: "string" }, { name: "processName", type: "string" }, { name: "processType", type: "string" }], display: { title: "processName", sub: "processType" }, sqlExtra: "process_key text not null,\n  process_name text not null default '',\n  process_type text not null default 'operational',\n  description text not null default ''" },
    { tab: "processCategories", plural: "processCategories", singular: "ProcessCategory", pascal: "ProcessCategory", db: `${camel}ProcessCategories`, table: `${PREFIX}_process_categories`, fields: [{ name: "categoryKey", type: "string" }, { name: "categoryName", type: "string" }, { name: "categoryType", type: "string" }], display: { title: "categoryName", sub: "categoryType" }, sqlExtra: "category_key text not null,\n  category_name text not null default '',\n  category_type text not null default 'general',\n  description text not null default ''" },
    { tab: "processVersions", plural: "processVersions", singular: "ProcessVersion", pascal: "ProcessVersion", db: `${camel}ProcessVersions`, table: `${PREFIX}_process_versions`, fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" }, sqlExtra: "version_key text not null,\n  version_number text not null default '',\n  release_channel text not null default 'stable',\n  published_at timestamptz" },
    { tab: "processDependencies", plural: "processDependencies", singular: "ProcessDependency", pascal: "ProcessDependency", db: `${camel}ProcessDependencies`, table: `${PREFIX}_process_dependencies`, fields: [{ name: "dependencyKey", type: "string" }, { name: "dependencyType", type: "string" }, { name: "dependencyRef", type: "string" }], display: { title: "dependencyKey", sub: "dependencyType" }, sqlExtra: "dependency_key text not null,\n  dependency_type text not null default 'process',\n  dependency_ref text not null default '',\n  resolved_at timestamptz" },
    { tab: "processModels", plural: "processModels", singular: "ProcessModel", pascal: "ProcessModel", db: `${camel}ProcessModels`, table: `${PREFIX}_process_models`, fields: [{ name: "modelKey", type: "string" }, { name: "modelName", type: "string" }, { name: "modelType", type: "string" }], display: { title: "modelName", sub: "modelType" }, sqlExtra: "model_key text not null,\n  model_name text not null default '',\n  model_type text not null default 'workflow',\n  description text not null default ''" },
    { tab: "processSteps", plural: "processSteps", singular: "ProcessStep", pascal: "ProcessStep", db: `${camel}ProcessSteps`, table: `${PREFIX}_process_steps`, fields: [{ name: "stepKey", type: "string" }, { name: "stepName", type: "string" }, { name: "stepOrder", type: "number" }], display: { title: "stepName", sub: "stepOrder" }, sqlExtra: "step_key text not null,\n  step_name text not null default '',\n  step_order integer not null default 0,\n  step_type text not null default 'action'" },
    { tab: "decisionPoints", plural: "decisionPoints", singular: "DecisionPoint", pascal: "DecisionPoint", db: `${camel}DecisionPoints`, table: `${PREFIX}_decision_points`, fields: [{ name: "decisionKey", type: "string" }, { name: "decisionName", type: "string" }, { name: "decisionType", type: "string" }], display: { title: "decisionName", sub: "decisionType" }, sqlExtra: "decision_key text not null,\n  decision_name text not null default '',\n  decision_type text not null default 'gateway',\n  decision_expression text not null default ''" },
    { tab: "reusableBlocks", plural: "reusableBlocks", singular: "ReusableBlock", pascal: "ReusableBlock", db: `${camel}ReusableBlocks`, table: `${PREFIX}_reusable_blocks`, fields: [{ name: "blockKey", type: "string" }, { name: "blockName", type: "string" }, { name: "blockType", type: "string" }], display: { title: "blockName", sub: "blockType" }, sqlExtra: "block_key text not null,\n  block_name text not null default '',\n  block_type text not null default 'subprocess',\n  block_ref text not null default ''" },
    { tab: "approvalRules", plural: "approvalRules", singular: "ApprovalRule", pascal: "ApprovalRule", db: `${camel}ApprovalRules`, table: `${PREFIX}_approval_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_type text not null default 'sequential',\n  rule_expression text not null default ''" },
    { tab: "sequentialApprovals", plural: "sequentialApprovals", singular: "SequentialApproval", pascal: "SequentialApproval", db: `${camel}SequentialApprovals`, table: `${PREFIX}_sequential_approvals`, fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approvalOrder", type: "number" }], display: { title: "approvalName", sub: "approvalOrder" }, sqlExtra: "approval_key text not null,\n  approval_name text not null default '',\n  approval_order integer not null default 0,\n  approver_ref text not null default ''" },
    { tab: "parallelApprovals", plural: "parallelApprovals", singular: "ParallelApproval", pascal: "ParallelApproval", db: `${camel}ParallelApprovals`, table: `${PREFIX}_parallel_approvals`, fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approverCount", type: "number" }], display: { title: "approvalName", sub: "approverCount" }, sqlExtra: "approval_key text not null,\n  approval_name text not null default '',\n  approver_count integer not null default 1,\n  quorum_required integer not null default 1" },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: `${camel}EscalationRules`, table: `${PREFIX}_escalation_rules`, fields: [{ name: "escalationKey", type: "string" }, { name: "escalationName", type: "string" }, { name: "escalationLevel", type: "number" }], display: { title: "escalationName", sub: "escalationLevel" }, sqlExtra: "escalation_key text not null,\n  escalation_name text not null default '',\n  escalation_level integer not null default 1,\n  timeout_hours integer not null default 24" },
    { tab: "taskAssignments", plural: "taskAssignments", singular: "TaskAssignment", pascal: "TaskAssignment", db: `${camel}TaskAssignments`, table: `${PREFIX}_task_assignments`, fields: [{ name: "assignmentKey", type: "string" }, { name: "assignmentName", type: "string" }, { name: "assigneeRef", type: "string" }], display: { title: "assignmentName", sub: "assigneeRef" }, sqlExtra: "assignment_key text not null,\n  assignment_name text not null default '',\n  assignee_ref text not null default '',\n  priority text not null default 'normal'" },
    { tab: "taskTemplates", plural: "taskTemplates", singular: "TaskTemplate", pascal: "TaskTemplate", db: `${camel}TaskTemplates`, table: `${PREFIX}_task_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateType", type: "string" }], display: { title: "templateName", sub: "templateType" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_type text not null default 'standard',\n  steps_count integer not null default 0" },
    { tab: "recurringTasks", plural: "recurringTasks", singular: "RecurringTask", pascal: "RecurringTask", db: `${camel}RecurringTasks`, table: `${PREFIX}_recurring_tasks`, fields: [{ name: "taskKey", type: "string" }, { name: "taskName", type: "string" }, { name: "recurrencePattern", type: "string" }], display: { title: "taskName", sub: "recurrencePattern" }, sqlExtra: "task_key text not null,\n  task_name text not null default '',\n  recurrence_pattern text not null default 'daily',\n  next_run_at timestamptz" },
    { tab: "taskSlaPolicies", plural: "taskSlaPolicies", singular: "TaskSlaPolicy", pascal: "TaskSlaPolicy", db: `${camel}TaskSlaPolicies`, table: `${PREFIX}_task_sla_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "slaHours", type: "number" }], display: { title: "policyName", sub: "slaHours" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  sla_hours integer not null default 24,\n  breach_action text not null default 'escalate'" },
    { tab: "ruleConditions", plural: "ruleConditions", singular: "RuleCondition", pascal: "RuleCondition", db: `${camel}RuleConditions`, table: `${PREFIX}_rule_conditions`, fields: [{ name: "conditionKey", type: "string" }, { name: "conditionName", type: "string" }, { name: "conditionType", type: "string" }], display: { title: "conditionName", sub: "conditionType" }, sqlExtra: "condition_key text not null,\n  condition_name text not null default '',\n  condition_type text not null default 'expression',\n  condition_expression text not null default ''" },
    { tab: "ruleValidations", plural: "ruleValidations", singular: "RuleValidation", pascal: "RuleValidation", db: `${camel}RuleValidations`, table: `${PREFIX}_rule_validations`, fields: [{ name: "validationKey", type: "string" }, { name: "validationName", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationName", sub: "validationScore" }, sqlExtra: "validation_key text not null,\n  validation_name text not null default '',\n  validation_type text not null default 'schema',\n  validation_score numeric(5, 2) not null default 0" },
    { tab: "ruleCalculations", plural: "ruleCalculations", singular: "RuleCalculation", pascal: "RuleCalculation", db: `${camel}RuleCalculations`, table: `${PREFIX}_rule_calculations`, fields: [{ name: "calculationKey", type: "string" }, { name: "calculationName", type: "string" }, { name: "calculationType", type: "string" }], display: { title: "calculationName", sub: "calculationType" }, sqlExtra: "calculation_key text not null,\n  calculation_name text not null default '',\n  calculation_type text not null default 'formula',\n  formula_ref text not null default ''" },
    { tab: "reusableRules", plural: "reusableRules", singular: "ReusableRule", pascal: "ReusableRule", db: `${camel}ReusableRules`, table: `${PREFIX}_reusable_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_type text not null default 'validation',\n  rule_expression text not null default ''" },
    { tab: "processExecutions", plural: "processExecutions", singular: "ProcessExecution", pascal: "ProcessExecution", db: `${camel}ProcessExecutions`, table: `${PREFIX}_process_executions`, fields: [{ name: "executionKey", type: "string" }, { name: "executionName", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "executionName", sub: "executionStatus" }, sqlExtra: "execution_key text not null,\n  execution_name text not null default '',\n  execution_status text not null default 'pending',\n  started_at timestamptz not null default now()" },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: `${camel}ExecutionHistory`, table: `${PREFIX}_execution_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyType", type: "string" }, { name: "historySummary", type: "string" }], display: { title: "historyKey", sub: "historyType" }, sqlExtra: "history_key text not null,\n  history_type text not null default 'state_change',\n  history_summary text not null default '',\n  recorded_at timestamptz not null default now()" },
    { tab: "executionRetries", plural: "executionRetries", singular: "ExecutionRetry", pascal: "ExecutionRetry", db: `${camel}ExecutionRetries`, table: `${PREFIX}_execution_retries`, fields: [{ name: "retryKey", type: "string" }, { name: "retryCount", type: "number" }, { name: "retryReason", type: "string" }], display: { title: "retryKey", sub: "retryCount" }, sqlExtra: "retry_key text not null,\n  retry_count integer not null default 0,\n  retry_reason text not null default '',\n  retried_at timestamptz not null default now()" },
    { tab: "executionAnalytics", plural: "executionAnalytics", singular: "ExecutionAnalytics", pascal: "ExecutionAnalytics", db: `${camel}ExecutionAnalytics`, table: `${PREFIX}_execution_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsType", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsKey", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_type text not null default 'throughput',\n  analytics_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "bottleneckReports", plural: "bottleneckReports", singular: "BottleneckReport", pascal: "BottleneckReport", db: `${camel}BottleneckReports`, table: `${PREFIX}_bottleneck_reports`, fields: [{ name: "reportKey", type: "string" }, { name: "reportName", type: "string" }, { name: "bottleneckScore", type: "number" }], display: { title: "reportName", sub: "bottleneckScore" }, sqlExtra: "report_key text not null,\n  report_name text not null default '',\n  bottleneck_score numeric(5, 2) not null default 0,\n  report_summary text not null default ''" },
    { tab: "slaPerformanceMetrics", plural: "slaPerformanceMetrics", singular: "SlaPerformanceMetric", pascal: "SlaPerformanceMetric", db: `${camel}SlaPerformanceMetrics`, table: `${PREFIX}_sla_performance_metrics`, fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "slaScore", type: "number" }], display: { title: "metricName", sub: "slaScore" }, sqlExtra: "metric_key text not null,\n  metric_name text not null default '',\n  sla_score numeric(5, 2) not null default 0,\n  metric_date date not null default current_date" },
    { tab: "processMetrics", plural: "processMetrics", singular: "ProcessMetric", pascal: "ProcessMetric", db: `${camel}ProcessMetrics`, table: `${PREFIX}_process_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "executionCount", type: "number" }, { name: "overallProcessScore", type: "number" }], display: { title: "metricsKey", sub: "overallProcessScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  execution_count integer not null default 0,\n  average_duration_ms integer not null default 0,\n  success_rate numeric(5, 2) not null default 100,\n  failure_count integer not null default 0,\n  bottleneck_score numeric(5, 2) not null default 0,\n  sla_performance_score numeric(5, 2) not null default 100,\n  overall_process_score numeric(5, 2) not null default 100" },
    { tab: "processHealth", plural: "processHealth", singular: "ProcessHealth", pascal: "ProcessHealth", db: `${camel}ProcessHealth`, table: `${PREFIX}_process_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  pending_approvals_count integer not null default 0,\n  active_process_count integer not null default 0,\n  task_queue_depth integer not null default 0,\n  framework_health_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "failedProcessRecords", plural: "failedProcessRecords", singular: "FailedProcessRecord", pascal: "FailedProcessRecord", db: `${camel}FailedProcessRecords`, table: `${PREFIX}_failed_process_records`, fields: [{ name: "recordKey", type: "string" }, { name: "recordName", type: "string" }, { name: "failureType", type: "string" }], display: { title: "recordName", sub: "failureType" }, sqlExtra: "record_key text not null,\n  record_name text not null default '',\n  failure_type text not null default 'execution',\n  error_message text not null default '',\n  failed_at timestamptz not null default now()" },
    { tab: "processFailures", plural: "processFailures", singular: "ProcessFailure", pascal: "ProcessFailure", db: `${camel}ProcessFailures`, table: `${PREFIX}_process_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'execution',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program B Sprint 2: Enterprise Business Process Framework\n\n";
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
    sql += `  ('${PREFIX}.view', 'View enterprise business process framework data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage process registry, designer, approvals, tasks, and framework outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve business process gates and escalation rules', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer enterprise business process framework governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "006a006a-006a-006a-006a-006a006a0101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a334', '${org}', 'Enterprise Business Process Orchestrator', 'enterprise_business_process_framework', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["process_registry","process_designer","approval_engine","task_engine","business_rule_engine","process_execution","process_analytics","process_dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a534', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a334', 'northstar-business-process-001', 'enterprise_business_process_framework', 'process_hub', '${hubId}', '{"objective":"Enterprise business process framework for northstar operational workflows"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- M0 Process Hub\n`;
    sql += `insert into public.bpf_process_hubs (id, organization_id, hub_key, hub_name, environment, status)\nvalues ('${hubId}', '${org}', 'northstar-business-process', 'Northstar Business Process Hub', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M1 Process Registry\n`;
    sql += `insert into public.bpf_business_processes (id, organization_id, hub_id, process_key, process_name, process_type, status)\nvalues ('006b006b-006b-006b-006b-006b006b0201', '${org}', '${hubId}', 'proc-onboard-0804', 'Customer Onboarding', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_categories (id, organization_id, hub_id, category_key, category_name, category_type, status)\nvalues ('006c006c-006c-006c-006c-006c006c0301', '${org}', '${hubId}', 'cat-ops-0804', 'Operations', 'operational', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)\nvalues ('006d006d-006d-006d-006d-006d006d0401', '${org}', '${hubId}', 'ver-1-0-0', '1.0.0', 'stable', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)\nvalues ('006e006e-006e-006e-006e-006e006e0501', '${org}', '${hubId}', 'dep-crm-0804', 'process', 'crm-onboarding', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M2 Process Designer\n`;
    sql += `insert into public.bpf_process_models (id, organization_id, hub_id, model_key, model_name, model_type, status)\nvalues ('006f006f-006f-006f-006f-006f006f0601', '${org}', '${hubId}', 'model-wf-0804', 'Onboarding Workflow', 'workflow', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_steps (id, organization_id, hub_id, step_key, step_name, step_order, status)\nvalues ('00700070-0070-0070-0070-007000700701', '${org}', '${hubId}', 'step-verify-0804', 'Verify Account', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_decision_points (id, organization_id, hub_id, decision_key, decision_name, decision_type, status)\nvalues ('00710071-0071-0071-0071-007100710801', '${org}', '${hubId}', 'dec-approve-0804', 'Approval Gateway', 'gateway', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_reusable_blocks (id, organization_id, hub_id, block_key, block_name, block_type, status)\nvalues ('00720072-0072-0072-0072-007200720901', '${org}', '${hubId}', 'block-kyc-0804', 'KYC Subprocess', 'subprocess', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M3 Approval Engine\n`;
    sql += `insert into public.bpf_approval_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)\nvalues ('00730073-0073-0073-0073-007300730a01', '${org}', '${hubId}', 'rule-seq-0804', 'Sequential Approval Rule', 'sequential', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_sequential_approvals (id, organization_id, hub_id, approval_key, approval_name, approval_order, status)\nvalues ('00740074-0074-0074-0074-007400740b01', '${org}', '${hubId}', 'appr-mgr-0804', 'Manager Approval', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_parallel_approvals (id, organization_id, hub_id, approval_key, approval_name, approver_count, status)\nvalues ('00750075-0075-0075-0075-007500750c01', '${org}', '${hubId}', 'appr-par-0804', 'Parallel Review', 3, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_escalation_rules (id, organization_id, hub_id, escalation_key, escalation_name, escalation_level, status)\nvalues ('00760076-0076-0076-0076-007600760d01', '${org}', '${hubId}', 'esc-l1-0804', 'Level 1 Escalation', 1, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M4 Task Engine\n`;
    sql += `insert into public.bpf_task_assignments (id, organization_id, hub_id, assignment_key, assignment_name, assignee_ref, status)\nvalues ('00770077-0077-0077-0077-007700770e01', '${org}', '${hubId}', 'asgn-rev-0804', 'Document Review', 'user-reviewer-001', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_task_templates (id, organization_id, hub_id, template_key, template_name, template_type, status)\nvalues ('00780078-0078-0078-0078-007800780f01', '${org}', '${hubId}', 'tmpl-review-0804', 'Review Task Template', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_recurring_tasks (id, organization_id, hub_id, task_key, task_name, recurrence_pattern, status)\nvalues ('00790079-0079-0079-0079-007900791001', '${org}', '${hubId}', 'task-daily-0804', 'Daily Status Check', 'daily', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_task_sla_policies (id, organization_id, hub_id, policy_key, policy_name, sla_hours, status)\nvalues ('007a007a-007a-007a-007a-007a007a1101', '${org}', '${hubId}', 'sla-24h-0804', '24 Hour SLA', 24, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M5 Business Rule Engine\n`;
    sql += `insert into public.bpf_rule_conditions (id, organization_id, hub_id, condition_key, condition_name, condition_type, status)\nvalues ('007b007b-007b-007b-007b-007b007b1201', '${org}', '${hubId}', 'cond-amt-0804', 'Amount Threshold', 'expression', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_rule_validations (id, organization_id, hub_id, validation_key, validation_name, validation_score, status)\nvalues ('007c007c-007c-007c-007c-007c007c1301', '${org}', '${hubId}', 'val-schema-0804', 'Schema Validation', 96.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_rule_calculations (id, organization_id, hub_id, calculation_key, calculation_name, calculation_type, status)\nvalues ('007d007d-007d-007d-007d-007d007d1401', '${org}', '${hubId}', 'calc-fee-0804', 'Fee Calculation', 'formula', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_reusable_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)\nvalues ('007e007e-007e-007e-007e-007e007e1501', '${org}', '${hubId}', 'rule-valid-0804', 'Validation Rule', 'validation', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M6 Process Execution\n`;
    sql += `insert into public.bpf_process_executions (id, organization_id, hub_id, execution_key, execution_name, execution_status, status)\nvalues ('007f007f-007f-007f-007f-007f007f1601', '${org}', '${hubId}', 'exec-run-0804', 'Onboarding Run #42', 'running', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_execution_history (id, organization_id, hub_id, history_key, history_type, history_summary, status)\nvalues ('00800080-0080-0080-0080-008000801701', '${org}', '${hubId}', 'hist-state-0804', 'state_change', 'Process moved to approval stage', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_execution_retries (id, organization_id, hub_id, retry_key, retry_count, retry_reason, status)\nvalues ('00810081-0081-0081-0081-008100811801', '${org}', '${hubId}', 'retry-1-0804', 1, 'Transient API failure', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M7 Process Analytics\n`;
    sql += `insert into public.bpf_execution_analytics (id, organization_id, hub_id, analytics_key, analytics_type, analytics_score, status)\nvalues ('00820082-0082-0082-0082-008200821901', '${org}', '${hubId}', 'anly-thru-0804', 'throughput', 94.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_bottleneck_reports (id, organization_id, hub_id, report_key, report_name, bottleneck_score, status)\nvalues ('00830083-0083-0083-0083-008300831a01', '${org}', '${hubId}', 'rpt-bneck-0804', 'Approval Bottleneck Report', 72.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_sla_performance_metrics (id, organization_id, hub_id, metric_key, metric_name, sla_score, status)\nvalues ('00840084-0084-0084-0084-008400841b01', '${org}', '${hubId}', 'sla-perf-0804', 'SLA Performance', 98.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- M8 Business Process Dashboard\n`;
    sql += `insert into public.bpf_process_metrics (id, organization_id, metrics_key, execution_count, average_duration_ms, success_rate, failure_count, bottleneck_score, sla_performance_score, overall_process_score, status)\nvalues ('00850085-0085-0085-0085-008500851c01', '${org}', 'process-metrics-0804', 1250, 4500, 97.50, 12, 15.00, 98.00, 94.75, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, pending_approvals_count, active_process_count, task_queue_depth, framework_health_status, summary, status)\nvalues ('00860086-0086-0086-0086-008600861d01', '${org}', 'process-health-0804', 95.00, false, 3, 42, 8, 'healthy', 'Business process framework operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_failed_process_records (id, organization_id, hub_id, record_key, record_name, failure_type, error_message, status)\nvalues ('00870087-0087-0087-0087-008700871e01', '${org}', '${hubId}', 'fail-rec-0804', 'Failed Onboarding Step', 'execution', 'Timeout waiting for external API', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_process_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('00880088-0088-0088-0088-008800882001', '${org}', '${hubId}', 'fail-exec-0804', 'execution', 'EXEC_TIMEOUT', 'Process execution timed out after 30 minutes', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.bpf_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('00890089-0089-0089-0089-008900892101', '${org}', 'process_hub', 'seed', 'Enterprise business process framework seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgBpfRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgBpfRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgBpfRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020034_enterprise_business_process_framework.sql");
const seedPath = join(root, "supabase/seed/034_enterprise_business_process_framework_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/business-process-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbBpfProcessHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Enterprise Business Process Framework artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbBpf* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-business-process-ui.mjs");

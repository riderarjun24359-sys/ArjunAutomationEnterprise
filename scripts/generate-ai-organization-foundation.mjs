#!/usr/bin/env node
/**
 * Generates V2 AI Organization Foundation artifacts.
 * Run: node scripts/generate-ai-organization-foundation.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "aof";
const Pascal = "Aof";
const camel = "aof";
const permResource = "ai_organization_foundation";

const hubTable = `${PREFIX}_organization_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_organization_metrics`, `${PREFIX}_organization_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "organizationHubs", plural: "organizationHubs", singular: "OrganizationHub", pascal: "OrganizationHub", db: `${camel}OrganizationHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  organization_tier text not null default 'enterprise'" },
    { tab: "growthOrchestrators", plural: "growthOrchestrators", singular: "GrowthOrchestrator", pascal: "GrowthOrchestrator", db: `${camel}GrowthOrchestrators`, table: `${PREFIX}_growth_orchestrators`, fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" }, sqlExtra: "orchestrator_key text not null,\n  orchestrator_name text not null default '',\n  orchestrator_status text not null default 'active',\n  campaign_ref text not null default '',\n  priority_level text not null default 'medium'" },
    { tab: "campaignIntelligence", plural: "campaignIntelligence", singular: "CampaignIntelligence", pascal: "CampaignIntelligence", db: `${camel}CampaignIntelligence`, table: `${PREFIX}_campaign_intelligence`, fields: [{ name: "campaignKey", type: "string" }, { name: "campaignName", type: "string" }, { name: "campaignStatus", type: "select", options: "CAMPAIGN_STATUS_OPTIONS" }], display: { title: "campaignName", sub: "campaignStatus" }, sqlExtra: "campaign_key text not null,\n  campaign_name text not null default '',\n  campaign_status text not null default 'active',\n  channel_type text not null default 'digital',\n  audience_segment text not null default 'all'" },
    { tab: "leadPrioritization", plural: "leadPrioritization", singular: "LeadPrioritization", pascal: "LeadPrioritization", db: `${camel}LeadPrioritization`, table: `${PREFIX}_lead_prioritization`, fields: [{ name: "leadKey", type: "string" }, { name: "leadName", type: "string" }, { name: "priorityScore", type: "number" }], display: { title: "leadName", sub: "priorityScore" }, sqlExtra: "lead_key text not null,\n  lead_name text not null default '',\n  priority_score numeric(5, 2) not null default 0,\n  lead_source text not null default 'inbound',\n  qualification_tier text not null default 'warm'" },
    { tab: "opportunityRecommendations", plural: "opportunityRecommendations", singular: "OpportunityRecommendation", pascal: "OpportunityRecommendation", db: `${camel}OpportunityRecommendations`, table: `${PREFIX}_opportunity_recommendations`, fields: [{ name: "recommendationKey", type: "string" }, { name: "recommendationTitle", type: "string" }, { name: "recommendationType", type: "string" }], display: { title: "recommendationTitle", sub: "recommendationType" }, sqlExtra: "recommendation_key text not null,\n  recommendation_title text not null default '',\n  recommendation_type text not null default 'upsell',\n  confidence_score numeric(5, 2) not null default 0,\n  pipeline_ref text not null default ''" },
    { tab: "pipelineHealth", plural: "pipelineHealth", singular: "PipelineHealth", pascal: "PipelineHealth", db: `${camel}PipelineHealth`, table: `${PREFIX}_pipeline_health`, fields: [{ name: "healthKey", type: "string" }, { name: "healthName", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "healthName", sub: "healthScore" }, sqlExtra: "health_key text not null,\n  health_name text not null default '',\n  health_score numeric(5, 2) not null default 100,\n  pipeline_stage text not null default 'qualification',\n  measured_at timestamptz not null default now()" },
    { tab: "growthAnalytics", plural: "growthAnalytics", singular: "GrowthAnalytics", pascal: "GrowthAnalytics", db: `${camel}GrowthAnalytics`, table: `${PREFIX}_growth_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsType", type: "string" }], display: { title: "analyticsName", sub: "analyticsType" }, sqlExtra: "analytics_key text not null,\n  analytics_name text not null default '',\n  analytics_type text not null default 'conversion',\n  metric_value numeric(12, 2) not null default 0,\n  measured_at timestamptz not null default now()" },
    { tab: "executiveGrowthDashboards", plural: "executiveGrowthDashboards", singular: "ExecutiveGrowthDashboard", pascal: "ExecutiveGrowthDashboard", db: `${camel}ExecutiveGrowthDashboards`, table: `${PREFIX}_executive_growth_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  widget_count integer not null default 0,\n  refresh_cadence text not null default 'daily'" },
    { tab: "deliveryOrchestrators", plural: "deliveryOrchestrators", singular: "DeliveryOrchestrator", pascal: "DeliveryOrchestrator", db: `${camel}DeliveryOrchestrators`, table: `${PREFIX}_delivery_orchestrators`, fields: [{ name: "orchestratorKey", type: "string" }, { name: "orchestratorName", type: "string" }, { name: "orchestratorStatus", type: "select", options: "ORCHESTRATOR_STATUS_OPTIONS" }], display: { title: "orchestratorName", sub: "orchestratorStatus" }, sqlExtra: "orchestrator_key text not null,\n  orchestrator_name text not null default '',\n  orchestrator_status text not null default 'active',\n  delivery_ref text not null default '',\n  priority_level text not null default 'medium'" },
    { tab: "resourcePlanners", plural: "resourcePlanners", singular: "ResourcePlanner", pascal: "ResourcePlanner", db: `${camel}ResourcePlanners`, table: `${PREFIX}_resource_planners`, fields: [{ name: "plannerKey", type: "string" }, { name: "plannerName", type: "string" }, { name: "plannerStatus", type: "select", options: "PLANNER_STATUS_OPTIONS" }], display: { title: "plannerName", sub: "plannerStatus" }, sqlExtra: "planner_key text not null,\n  planner_name text not null default '',\n  planner_status text not null default 'active',\n  resource_type text not null default 'engineering',\n  capacity_units numeric(12, 2) not null default 0" },
    { tab: "implementationSchedulers", plural: "implementationSchedulers", singular: "ImplementationScheduler", pascal: "ImplementationScheduler", db: `${camel}ImplementationSchedulers`, table: `${PREFIX}_implementation_schedulers`, fields: [{ name: "schedulerKey", type: "string" }, { name: "schedulerName", type: "string" }, { name: "schedulerStatus", type: "select", options: "SCHEDULER_STATUS_OPTIONS" }], display: { title: "schedulerName", sub: "schedulerStatus" }, sqlExtra: "scheduler_key text not null,\n  scheduler_name text not null default '',\n  scheduler_status text not null default 'active',\n  schedule_cadence text not null default 'weekly',\n  milestone_ref text not null default ''" },
    { tab: "deploymentCoordination", plural: "deploymentCoordination", singular: "DeploymentCoordination", pascal: "DeploymentCoordination", db: `${camel}DeploymentCoordination`, table: `${PREFIX}_deployment_coordination`, fields: [{ name: "coordinationKey", type: "string" }, { name: "coordinationName", type: "string" }, { name: "coordinationStatus", type: "select", options: "COORDINATION_STATUS_OPTIONS" }], display: { title: "coordinationName", sub: "coordinationStatus" }, sqlExtra: "coordination_key text not null,\n  coordination_name text not null default '',\n  coordination_status text not null default 'active',\n  deployment_env text not null default 'production',\n  release_ref text not null default ''" },
    { tab: "deliveryIntelligence", plural: "deliveryIntelligence", singular: "DeliveryIntelligence", pascal: "DeliveryIntelligence", db: `${camel}DeliveryIntelligence`, table: `${PREFIX}_delivery_intelligence`, fields: [{ name: "intelligenceKey", type: "string" }, { name: "intelligenceTitle", type: "string" }, { name: "intelligenceType", type: "string" }], display: { title: "intelligenceTitle", sub: "intelligenceType" }, sqlExtra: "intelligence_key text not null,\n  intelligence_title text not null default '',\n  intelligence_type text not null default 'delivery',\n  insight_score numeric(5, 2) not null default 0,\n  source_module text not null default 'ado'" },
    { tab: "customerSuccessAutomation", plural: "customerSuccessAutomation", singular: "CustomerSuccessAutomation", pascal: "CustomerSuccessAutomation", db: `${camel}CustomerSuccessAutomation`, table: `${PREFIX}_customer_success_automation`, fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" }, sqlExtra: "automation_key text not null,\n  automation_name text not null default '',\n  automation_status text not null default 'active',\n  trigger_type text not null default 'event',\n  workflow_ref text not null default ''" },
    { tab: "executiveDeliveryDashboards", plural: "executiveDeliveryDashboards", singular: "ExecutiveDeliveryDashboard", pascal: "ExecutiveDeliveryDashboard", db: `${camel}ExecutiveDeliveryDashboards`, table: `${PREFIX}_executive_delivery_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  widget_count integer not null default 0,\n  refresh_cadence text not null default 'daily'" },
    { tab: "ideaRegistry", plural: "ideaRegistry", singular: "IdeaRegistry", pascal: "IdeaRegistry", db: `${camel}IdeaRegistry`, table: `${PREFIX}_idea_registry`, fields: [{ name: "ideaKey", type: "string" }, { name: "ideaTitle", type: "string" }, { name: "ideaStatus", type: "select", options: "IDEA_STATUS_OPTIONS" }], display: { title: "ideaTitle", sub: "ideaStatus" }, sqlExtra: "idea_key text not null,\n  idea_title text not null default '',\n  idea_status text not null default 'draft',\n  idea_category text not null default 'product',\n  submitter_ref text not null default ''" },
    { tab: "innovationPipeline", plural: "innovationPipeline", singular: "InnovationPipeline", pascal: "InnovationPipeline", db: `${camel}InnovationPipeline`, table: `${PREFIX}_innovation_pipeline`, fields: [{ name: "pipelineKey", type: "string" }, { name: "pipelineName", type: "string" }, { name: "pipelineStatus", type: "select", options: "PIPELINE_STATUS_OPTIONS" }], display: { title: "pipelineName", sub: "pipelineStatus" }, sqlExtra: "pipeline_key text not null,\n  pipeline_name text not null default '',\n  pipeline_status text not null default 'active',\n  stage_count integer not null default 0,\n  current_stage text not null default 'discovery'" },
    { tab: "experimentTracker", plural: "experimentTracker", singular: "ExperimentTracker", pascal: "ExperimentTracker", db: `${camel}ExperimentTracker`, table: `${PREFIX}_experiment_tracker`, fields: [{ name: "experimentKey", type: "string" }, { name: "experimentName", type: "string" }, { name: "experimentStatus", type: "select", options: "EXPERIMENT_STATUS_OPTIONS" }], display: { title: "experimentName", sub: "experimentStatus" }, sqlExtra: "experiment_key text not null,\n  experiment_name text not null default '',\n  experiment_status text not null default 'planned',\n  hypothesis_ref text not null default '',\n  started_at timestamptz" },
    { tab: "validationWorkflow", plural: "validationWorkflow", singular: "ValidationWorkflow", pascal: "ValidationWorkflow", db: `${camel}ValidationWorkflow`, table: `${PREFIX}_validation_workflow`, fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" }, sqlExtra: "workflow_key text not null,\n  workflow_name text not null default '',\n  workflow_status text not null default 'active',\n  validation_type text not null default 'market',\n  approval_required boolean not null default true" },
    { tab: "outcomeEvaluation", plural: "outcomeEvaluation", singular: "OutcomeEvaluation", pascal: "OutcomeEvaluation", db: `${camel}OutcomeEvaluation`, table: `${PREFIX}_outcome_evaluation`, fields: [{ name: "evaluationKey", type: "string" }, { name: "evaluationTitle", type: "string" }, { name: "evaluationScore", type: "number" }], display: { title: "evaluationTitle", sub: "evaluationScore" }, sqlExtra: "evaluation_key text not null,\n  evaluation_title text not null default '',\n  evaluation_score numeric(5, 2) not null default 0,\n  outcome_type text not null default 'innovation',\n  evaluated_at timestamptz not null default now()" },
    { tab: "knowledgeRepository", plural: "knowledgeRepository", singular: "KnowledgeRepository", pascal: "KnowledgeRepository", db: `${camel}KnowledgeRepository`, table: `${PREFIX}_knowledge_repository`, fields: [{ name: "repositoryKey", type: "string" }, { name: "repositoryName", type: "string" }, { name: "repositoryStatus", type: "select", options: "REPOSITORY_STATUS_OPTIONS" }], display: { title: "repositoryName", sub: "repositoryStatus" }, sqlExtra: "repository_key text not null,\n  repository_name text not null default '',\n  repository_status text not null default 'active',\n  content_count integer not null default 0,\n  taxonomy_ref text not null default ''" },
    { tab: "aiTaskRouters", plural: "aiTaskRouters", singular: "AiTaskRouter", pascal: "AiTaskRouter", db: `${camel}AiTaskRouters`, table: `${PREFIX}_ai_task_routers`, fields: [{ name: "routerKey", type: "string" }, { name: "routerName", type: "string" }, { name: "routerStatus", type: "select", options: "ROUTER_STATUS_OPTIONS" }], display: { title: "routerName", sub: "routerStatus" }, sqlExtra: "router_key text not null,\n  router_name text not null default '',\n  router_status text not null default 'active',\n  routing_policy text not null default 'priority',\n  agent_pool jsonb not null default '[]'::jsonb" },
    { tab: "humanApprovalEngine", plural: "humanApprovalEngine", singular: "HumanApprovalEngine", pascal: "HumanApprovalEngine", db: `${camel}HumanApprovalEngine`, table: `${PREFIX}_human_approval_engine`, fields: [{ name: "approvalKey", type: "string" }, { name: "approvalName", type: "string" }, { name: "approvalStatus", type: "select", options: "APPROVAL_STATUS_OPTIONS" }], display: { title: "approvalName", sub: "approvalStatus" }, sqlExtra: "approval_key text not null,\n  approval_name text not null default '',\n  approval_status text not null default 'pending',\n  approval_type text not null default 'human_in_loop',\n  escalation_policy text not null default 'manager'" },
    { tab: "policyEngine", plural: "policyEngine", singular: "PolicyEngine", pascal: "PolicyEngine", db: `${camel}PolicyEngine`, table: `${PREFIX}_policy_engine`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyStatus", type: "select", options: "POLICY_STATUS_OPTIONS" }], display: { title: "policyName", sub: "policyStatus" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  policy_status text not null default 'active',\n  policy_scope text not null default 'organization',\n  rule_set jsonb not null default '{}'::jsonb" },
    { tab: "executionHistory", plural: "executionHistory", singular: "ExecutionHistory", pascal: "ExecutionHistory", db: `${camel}ExecutionHistory`, table: `${PREFIX}_execution_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyTitle", type: "string" }, { name: "executionStatus", type: "string" }], display: { title: "historyTitle", sub: "executionStatus" }, sqlExtra: "history_key text not null,\n  history_title text not null default '',\n  execution_status text not null default 'completed',\n  executed_at timestamptz not null default now(),\n  task_ref text not null default ''" },
    { tab: "aiGovernanceRules", plural: "aiGovernanceRules", singular: "AiGovernanceRule", pascal: "AiGovernanceRule", db: `${camel}AiGovernanceRules`, table: `${PREFIX}_ai_governance_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleStatus", type: "select", options: "GOVERNANCE_STATUS_OPTIONS" }], display: { title: "ruleName", sub: "ruleStatus" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_status text not null default 'active',\n  governance_level text not null default 'standard',\n  compliance_ref text not null default ''" },
    { tab: "organizationMetrics", plural: "organizationMetrics", singular: "OrganizationMetric", pascal: "OrganizationMetric", db: `${camel}OrganizationMetrics`, table: `${PREFIX}_organization_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "growthScore", type: "number" }, { name: "overallOrganizationScore", type: "number" }], display: { title: "metricsKey", sub: "overallOrganizationScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  growth_score numeric(5, 2) not null default 100,\n  delivery_score numeric(5, 2) not null default 100,\n  innovation_score numeric(5, 2) not null default 100,\n  pending_ai_approval_count integer not null default 0,\n  pipeline_health_score numeric(5, 2) not null default 100,\n  mission_progress_score numeric(5, 2) not null default 0,\n  overall_organization_score numeric(5, 2) not null default 100" },
    { tab: "organizationHealth", plural: "organizationHealth", singular: "OrganizationHealth", pascal: "OrganizationHealth", db: `${camel}OrganizationHealth`, table: `${PREFIX}_organization_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  ago_status text not null default 'healthy',\n  ado_status text not null default 'healthy',\n  aio_status text not null default 'healthy',\n  orchestration_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "innovationDashboards", plural: "innovationDashboards", singular: "InnovationDashboard", pascal: "InnovationDashboard", db: `${camel}InnovationDashboards`, table: `${PREFIX}_innovation_dashboards`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  innovation_score numeric(5, 2) not null default 0,\n  refresh_cadence text not null default 'weekly'" },
    { tab: "missionProgress", plural: "missionProgress", singular: "MissionProgress", pascal: "MissionProgress", db: `${camel}MissionProgress`, table: `${PREFIX}_mission_progress`, fields: [{ name: "progressKey", type: "string" }, { name: "progressName", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressName", sub: "progressPercent" }, sqlExtra: "progress_key text not null,\n  progress_name text not null default '',\n  progress_percent numeric(5, 2) not null default 0,\n  mission_ref text not null default '',\n  target_date date" },
    { tab: "organizationFailures", plural: "organizationFailures", singular: "OrganizationFailure", pascal: "OrganizationFailure", db: `${camel}OrganizationFailures`, table: `${PREFIX}_organization_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'orchestration',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 AI Organization Foundation\n\n";
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
    sql += `  ('${PREFIX}.view', 'View AI organization foundation data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage AGO, ADO, AIO, AI orchestration, and organization dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve AI organization foundation gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer AI organization foundation governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00770077-0077-0077-0077-007700770101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a347', '${org}', 'AI Organization Foundation Orchestrator', 'ai_organization_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["ago","ado","aio","orchestration","dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a547', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a347', 'northstar-ai-organization-001', 'ai_organization_foundation', 'organization_hub', '${hubId}', '{"objective":"Unified AI organization foundation AGO, ADO, AIO, and orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- G0 Organization Hub\n`;
    sql += `insert into public.aof_organization_hubs (id, organization_id, hub_key, hub_name, environment, organization_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-ai-organization', 'Northstar AI Organization Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G1 AGO\n`;
    sql += `insert into public.aof_growth_orchestrators (id, organization_id, hub_id, orchestrator_key, orchestrator_name, orchestrator_status, status)\nvalues ('04900100-0490-0490-0490-049001000101', '${org}', '${hubId}', 'ago-growth-0907', 'Growth Orchestrator', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_campaign_intelligence (id, organization_id, hub_id, campaign_key, campaign_name, campaign_status, status)\nvalues ('04910101-0491-0491-0491-049101010201', '${org}', '${hubId}', 'campaign-intel-0907', 'Campaign Intelligence', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_lead_prioritization (id, organization_id, hub_id, lead_key, lead_name, priority_score, status)\nvalues ('04920102-0492-0492-0492-049201020301', '${org}', '${hubId}', 'lead-priority-0907', 'Lead Prioritization', 85.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_opportunity_recommendations (id, organization_id, hub_id, recommendation_key, recommendation_title, recommendation_type, status)\nvalues ('04930103-0493-0493-0493-049301030401', '${org}', '${hubId}', 'opp-rec-0907', 'Enterprise Upsell Opportunity', 'upsell', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_pipeline_health (id, organization_id, hub_id, health_key, health_name, health_score, status)\nvalues ('04940104-0494-0494-0494-049401040501', '${org}', '${hubId}', 'pipeline-health-0907', 'Pipeline Health', 92.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_growth_analytics (id, organization_id, hub_id, analytics_key, analytics_name, analytics_type, status)\nvalues ('04950105-0495-0495-0495-049501050601', '${org}', '${hubId}', 'growth-analytics-0907', 'Growth Analytics', 'conversion', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_executive_growth_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)\nvalues ('04960106-0496-0496-0496-049601060701', '${org}', '${hubId}', 'dash-growth-0907', 'Executive Growth Dashboard', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G2 ADO\n`;
    sql += `insert into public.aof_delivery_orchestrators (id, organization_id, hub_id, orchestrator_key, orchestrator_name, orchestrator_status, status)\nvalues ('04970107-0497-0497-0497-049701070801', '${org}', '${hubId}', 'ado-delivery-0907', 'Delivery Orchestrator', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_resource_planners (id, organization_id, hub_id, planner_key, planner_name, planner_status, status)\nvalues ('04980108-0498-0498-0498-049801080901', '${org}', '${hubId}', 'resource-plan-0907', 'Resource Planner', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_implementation_schedulers (id, organization_id, hub_id, scheduler_key, scheduler_name, scheduler_status, status)\nvalues ('04990109-0499-0499-0499-049901090a01', '${org}', '${hubId}', 'impl-sched-0907', 'Implementation Scheduler', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_deployment_coordination (id, organization_id, hub_id, coordination_key, coordination_name, coordination_status, status)\nvalues ('049a010a-049a-049a-049a-049a010a0b01', '${org}', '${hubId}', 'deploy-coord-0907', 'Deployment Coordination', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_delivery_intelligence (id, organization_id, hub_id, intelligence_key, intelligence_title, intelligence_type, status)\nvalues ('049b010b-049b-049b-049b-049b010b0c01', '${org}', '${hubId}', 'delivery-intel-0907', 'Delivery Intelligence Insight', 'delivery', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_customer_success_automation (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)\nvalues ('049c010c-049c-049c-049c-049c010c0d01', '${org}', '${hubId}', 'cs-auto-0907', 'Customer Success Automation', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_executive_delivery_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)\nvalues ('049d010d-049d-049d-049d-049d010d0e01', '${org}', '${hubId}', 'dash-delivery-0907', 'Executive Delivery Dashboard', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G3 AIO\n`;
    sql += `insert into public.aof_idea_registry (id, organization_id, hub_id, idea_key, idea_title, idea_status, status)\nvalues ('049e010e-049e-049e-049e-049e010e0f01', '${org}', '${hubId}', 'idea-reg-0907', 'AI Product Innovation Idea', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_innovation_pipeline (id, organization_id, hub_id, pipeline_key, pipeline_name, pipeline_status, status)\nvalues ('049f010f-049f-049f-049f-049f010f1001', '${org}', '${hubId}', 'innov-pipe-0907', 'Innovation Pipeline', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_experiment_tracker (id, organization_id, hub_id, experiment_key, experiment_name, experiment_status, status)\nvalues ('04a00110-04a0-04a0-04a0-04a001101101', '${org}', '${hubId}', 'exp-track-0907', 'Experiment Tracker', 'running', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_validation_workflow (id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)\nvalues ('04a10111-04a1-04a1-04a1-04a101111201', '${org}', '${hubId}', 'valid-work-0907', 'Validation Workflow', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_outcome_evaluation (id, organization_id, hub_id, evaluation_key, evaluation_title, evaluation_score, status)\nvalues ('04a20112-04a2-04a2-04a2-04a201121301', '${org}', '${hubId}', 'outcome-eval-0907', 'Outcome Evaluation', 88.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_knowledge_repository (id, organization_id, hub_id, repository_key, repository_name, repository_status, status)\nvalues ('04a30113-04a3-04a3-04a3-04a301131401', '${org}', '${hubId}', 'know-repo-0907', 'Knowledge Repository', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G4 AI Orchestration\n`;
    sql += `insert into public.aof_ai_task_routers (id, organization_id, hub_id, router_key, router_name, router_status, status)\nvalues ('04a40114-04a4-04a4-04a4-04a401141501', '${org}', '${hubId}', 'task-router-0907', 'AI Task Router', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_human_approval_engine (id, organization_id, hub_id, approval_key, approval_name, approval_status, status)\nvalues ('04a50115-04a5-04a5-04a5-04a501151601', '${org}', '${hubId}', 'human-approval-0907', 'Human Approval Engine', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_policy_engine (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)\nvalues ('04a60116-04a6-04a6-04a6-04a601161701', '${org}', '${hubId}', 'policy-eng-0907', 'Policy Engine', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_execution_history (id, organization_id, hub_id, history_key, history_title, execution_status, status)\nvalues ('04a70117-04a7-04a7-04a7-04a701171801', '${org}', '${hubId}', 'exec-hist-0907', 'Execution History', 'completed', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_ai_governance_rules (id, organization_id, hub_id, rule_key, rule_name, rule_status, status)\nvalues ('04a80118-04a8-04a8-04a8-04a801181901', '${org}', '${hubId}', 'gov-rule-0907', 'AI Governance Rule', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G6 Dashboard\n`;
    sql += `insert into public.aof_organization_metrics (id, organization_id, metrics_key, growth_score, delivery_score, innovation_score, pending_ai_approval_count, pipeline_health_score, mission_progress_score, overall_organization_score, status)\nvalues ('04a90119-04a9-04a9-04a9-04a901191a01', '${org}', 'aof-metrics-0907', 91.00, 89.50, 87.00, 3, 92.50, 78.50, 90.25, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_organization_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, ago_status, ado_status, aio_status, orchestration_status, security_status, summary, status)\nvalues ('04aa011a-04aa-04aa-04aa-04aa011a1b01', '${org}', 'aof-health-0907', 90.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'AI organization foundation operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_innovation_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)\nvalues ('04ab011b-04ab-04ab-04ab-04ab011b1c01', '${org}', '${hubId}', 'dash-innov-0907', 'Innovation Dashboard', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)\nvalues ('04ac011c-04ac-04ac-04ac-04ac011c1d01', '${org}', '${hubId}', 'mission-progress-0907', 'AI Organization Mission', 78.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_organization_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('04ad011d-04ad-04ad-04ad-04ad011d1e01', '${org}', '${hubId}', 'fail-orch-0907', 'orchestration', 'ORCH_SYNC_FAIL', 'Orchestration sync failed', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.aof_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('04ae011e-04ae-04ae-04ae-04ae011e1f01', '${org}', 'organization_hub', 'seed', 'AI organization foundation seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgAofRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgAofRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgAofRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020047_ai_organization_foundation.sql");
const seedPath = join(root, "supabase/seed/047_ai_organization_foundation_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/ai-organization-foundation-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbAofOrganizationHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated AI Organization Foundation artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbAof* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-ai-organization-foundation-ui.mjs");

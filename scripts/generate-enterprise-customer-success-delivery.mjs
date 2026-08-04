#!/usr/bin/env node
/**
 * Generates V2 Program F Capability Wave 3 Customer Success & Delivery Platform artifacts.
 * Run: node scripts/generate-enterprise-customer-success-delivery.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "csd";
const Pascal = "Csd";
const camel = "csd";
const permResource = "customer_success_delivery";

const hubTable = `${PREFIX}_delivery_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_operations_metrics`, `${PREFIX}_operations_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "deliveryHubs", plural: "deliveryHubs", singular: "DeliveryHub", pascal: "DeliveryHub", db: `${camel}DeliveryHubs`, table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  delivery_tier text not null default 'enterprise'" },
    { tab: "customerHealthScores", plural: "customerHealthScores", singular: "CustomerHealthScore", pascal: "CustomerHealthScore", db: `${camel}CustomerHealthScores`, table: `${PREFIX}_customer_health_scores`, fields: [{ name: "scoreKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "healthScore", type: "number" }], display: { title: "scoreKey", sub: "customerRef" }, sqlExtra: "score_key text not null,\n  customer_ref text not null default '',\n  health_score numeric(5, 2) not null default 100,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "adoptionAnalytics", plural: "adoptionAnalytics", singular: "AdoptionAnalytic", pascal: "AdoptionAnalytic", db: `${camel}AdoptionAnalytics`, table: `${PREFIX}_adoption_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "featureName", type: "string" }, { name: "adoptionRate", type: "number" }], display: { title: "featureName", sub: "adoptionRate" }, sqlExtra: "analytics_key text not null,\n  feature_name text not null default '',\n  adoption_rate numeric(5, 2) not null default 0,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "successPlans", plural: "successPlans", singular: "SuccessPlan", pascal: "SuccessPlan", db: `${camel}SuccessPlans`, table: `${PREFIX}_success_plans`, fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "planStatus", type: "select", options: "PLAN_STATUS_OPTIONS" }], display: { title: "planName", sub: "planStatus" }, sqlExtra: "plan_key text not null,\n  plan_name text not null default '',\n  plan_status text not null default 'active',\n  customer_ref text not null default '',\n  target_date date not null default current_date" },
    { tab: "customerTimelines", plural: "customerTimelines", singular: "CustomerTimeline", pascal: "CustomerTimeline", db: `${camel}CustomerTimelines`, table: `${PREFIX}_customer_timelines`, fields: [{ name: "timelineKey", type: "string" }, { name: "timelineName", type: "string" }, { name: "timelineType", type: "string" }], display: { title: "timelineName", sub: "timelineType" }, sqlExtra: "timeline_key text not null,\n  timeline_name text not null default '',\n  timeline_type text not null default 'milestone',\n  event_date date not null default current_date,\n  event_summary text not null default ''" },
    { tab: "renewalForecasts", plural: "renewalForecasts", singular: "RenewalForecast", pascal: "RenewalForecast", db: `${camel}RenewalForecasts`, table: `${PREFIX}_renewal_forecasts`, fields: [{ name: "forecastKey", type: "string" }, { name: "customerRef", type: "string" }, { name: "forecastStatus", type: "select", options: "RENEWAL_STATUS_OPTIONS" }], display: { title: "forecastKey", sub: "customerRef" }, sqlExtra: "forecast_key text not null,\n  customer_ref text not null default '',\n  forecast_status text not null default 'pending',\n  renewal_date date not null default current_date,\n  forecast_value numeric(12, 2) not null default 0" },
    { tab: "supportTickets", plural: "supportTickets", singular: "SupportTicket", pascal: "SupportTicket", db: `${camel}SupportTickets`, table: `${PREFIX}_support_tickets`, fields: [{ name: "ticketKey", type: "string" }, { name: "ticketTitle", type: "string" }, { name: "ticketStatus", type: "select", options: "TICKET_STATUS_OPTIONS" }], display: { title: "ticketTitle", sub: "ticketStatus" }, sqlExtra: "ticket_key text not null,\n  ticket_title text not null default '',\n  ticket_status text not null default 'open',\n  priority text not null default 'normal',\n  opened_at timestamptz not null default now()" },
    { tab: "liveChatSessions", plural: "liveChatSessions", singular: "LiveChatSession", pascal: "LiveChatSession", db: `${camel}LiveChatSessions`, table: `${PREFIX}_live_chat_sessions`, fields: [{ name: "sessionKey", type: "string" }, { name: "sessionTitle", type: "string" }, { name: "sessionStatus", type: "select", options: "SESSION_STATUS_OPTIONS" }], display: { title: "sessionTitle", sub: "sessionStatus" }, sqlExtra: "session_key text not null,\n  session_title text not null default '',\n  session_status text not null default 'active',\n  agent_ref text not null default '',\n  started_at timestamptz not null default now()" },
    { tab: "knowledgeBaseArticles", plural: "knowledgeBaseArticles", singular: "KnowledgeBaseArticle", pascal: "KnowledgeBaseArticle", db: `${camel}KnowledgeBaseArticles`, table: `${PREFIX}_knowledge_base_articles`, fields: [{ name: "articleKey", type: "string" }, { name: "articleTitle", type: "string" }, { name: "articleCategory", type: "string" }], display: { title: "articleTitle", sub: "articleCategory" }, sqlExtra: "article_key text not null,\n  article_title text not null default '',\n  article_category text not null default 'general',\n  article_summary text not null default '',\n  published_at timestamptz" },
    { tab: "slaPolicies", plural: "slaPolicies", singular: "SlaPolicy", pascal: "SlaPolicy", db: `${camel}SlaPolicies`, table: `${PREFIX}_sla_policies`, fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "policyType", type: "string" }], display: { title: "policyName", sub: "policyType" }, sqlExtra: "policy_key text not null,\n  policy_name text not null default '',\n  response_time_minutes integer not null default 60,\n  resolution_time_hours integer not null default 24,\n  policy_type text not null default 'standard'" },
    { tab: "escalationRules", plural: "escalationRules", singular: "EscalationRule", pascal: "EscalationRule", db: `${camel}EscalationRules`, table: `${PREFIX}_escalation_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleType", type: "string" }], display: { title: "ruleName", sub: "ruleType" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  escalation_level integer not null default 1,\n  trigger_condition text not null default '',\n  rule_type text not null default 'time_based'" },
    { tab: "deploymentAutomations", plural: "deploymentAutomations", singular: "DeploymentAutomation", pascal: "DeploymentAutomation", db: `${camel}DeploymentAutomations`, table: `${PREFIX}_deployment_automations`, fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" }, sqlExtra: "automation_key text not null,\n  automation_name text not null default '',\n  automation_type text not null default 'pipeline',\n  automation_status text not null default 'active',\n  last_run_at timestamptz" },
    { tab: "environmentManagement", plural: "environmentManagement", singular: "EnvironmentManagement", pascal: "EnvironmentManagement", db: `${camel}EnvironmentManagement`, table: `${PREFIX}_environment_management`, fields: [{ name: "environmentKey", type: "string" }, { name: "environmentName", type: "string" }, { name: "environmentType", type: "string" }], display: { title: "environmentName", sub: "environmentType" }, sqlExtra: "environment_key text not null,\n  environment_name text not null default '',\n  environment_type text not null default 'production',\n  region text not null default '',\n  managed_at timestamptz not null default now()" },
    { tab: "deploymentTracking", plural: "deploymentTracking", singular: "DeploymentTracking", pascal: "DeploymentTracking", db: `${camel}DeploymentTracking`, table: `${PREFIX}_deployment_tracking`, fields: [{ name: "trackingKey", type: "string" }, { name: "deploymentName", type: "string" }, { name: "deploymentStatus", type: "select", options: "DEPLOYMENT_STATUS_OPTIONS" }], display: { title: "deploymentName", sub: "deploymentStatus" }, sqlExtra: "tracking_key text not null,\n  deployment_name text not null default '',\n  deployment_status text not null default 'pending',\n  target_version text not null default '',\n  deployed_at timestamptz" },
    { tab: "upgradeManagement", plural: "upgradeManagement", singular: "UpgradeManagement", pascal: "UpgradeManagement", db: `${camel}UpgradeManagement`, table: `${PREFIX}_upgrade_management`, fields: [{ name: "upgradeKey", type: "string" }, { name: "upgradeName", type: "string" }, { name: "upgradeStatus", type: "select", options: "UPGRADE_STATUS_OPTIONS" }], display: { title: "upgradeName", sub: "upgradeStatus" }, sqlExtra: "upgrade_key text not null,\n  upgrade_name text not null default '',\n  upgrade_status text not null default 'scheduled',\n  from_version text not null default '',\n  to_version text not null default ''" },
    { tab: "releaseTracking", plural: "releaseTracking", singular: "ReleaseTracking", pascal: "ReleaseTracking", db: `${camel}ReleaseTracking`, table: `${PREFIX}_release_tracking`, fields: [{ name: "releaseKey", type: "string" }, { name: "releaseName", type: "string" }, { name: "releaseStatus", type: "select", options: "RELEASE_STATUS_OPTIONS" }], display: { title: "releaseName", sub: "releaseStatus" }, sqlExtra: "release_key text not null,\n  release_name text not null default '',\n  release_version text not null default '1.0.0',\n  release_status text not null default 'planned',\n  released_at timestamptz" },
    { tab: "trainingPortals", plural: "trainingPortals", singular: "TrainingPortal", pascal: "TrainingPortal", db: `${camel}TrainingPortals`, table: `${PREFIX}_training_portals`, fields: [{ name: "portalKey", type: "string" }, { name: "portalName", type: "string" }, { name: "portalType", type: "string" }], display: { title: "portalName", sub: "portalType" }, sqlExtra: "portal_key text not null,\n  portal_name text not null default '',\n  portal_type text not null default 'customer',\n  course_count integer not null default 0,\n  portal_url text not null default ''" },
    { tab: "videoLibrary", plural: "videoLibrary", singular: "VideoLibrary", pascal: "VideoLibrary", db: `${camel}VideoLibrary`, table: `${PREFIX}_video_library`, fields: [{ name: "videoKey", type: "string" }, { name: "videoTitle", type: "string" }, { name: "videoCategory", type: "string" }], display: { title: "videoTitle", sub: "videoCategory" }, sqlExtra: "video_key text not null,\n  video_title text not null default '',\n  video_category text not null default 'onboarding',\n  duration_minutes integer not null default 0,\n  video_url text not null default ''" },
    { tab: "productTours", plural: "productTours", singular: "ProductTour", pascal: "ProductTour", db: `${camel}ProductTours`, table: `${PREFIX}_product_tours`, fields: [{ name: "tourKey", type: "string" }, { name: "tourName", type: "string" }, { name: "tourType", type: "string" }], display: { title: "tourName", sub: "tourType" }, sqlExtra: "tour_key text not null,\n  tour_name text not null default '',\n  tour_type text not null default 'guided',\n  step_count integer not null default 0,\n  tour_summary text not null default ''" },
    { tab: "certifications", plural: "certifications", singular: "Certification", pascal: "Certification", db: `${camel}Certifications`, table: `${PREFIX}_certifications`, fields: [{ name: "certificationKey", type: "string" }, { name: "certificationName", type: "string" }, { name: "certificationType", type: "string" }], display: { title: "certificationName", sub: "certificationType" }, sqlExtra: "certification_key text not null,\n  certification_name text not null default '',\n  certification_type text not null default 'product',\n  validity_days integer not null default 365,\n  certification_summary text not null default ''" },
    { tab: "progressTracking", plural: "progressTracking", singular: "ProgressTracking", pascal: "ProgressTracking", db: `${camel}ProgressTracking`, table: `${PREFIX}_progress_tracking`, fields: [{ name: "progressKey", type: "string" }, { name: "learnerRef", type: "string" }, { name: "progressPercent", type: "number" }], display: { title: "progressKey", sub: "learnerRef" }, sqlExtra: "progress_key text not null,\n  learner_ref text not null default '',\n  progress_percent numeric(5, 2) not null default 0,\n  course_ref text not null default '',\n  last_activity_at timestamptz not null default now()" },
    { tab: "learningAnalytics", plural: "learningAnalytics", singular: "LearningAnalytic", pascal: "LearningAnalytic", db: `${camel}LearningAnalytics`, table: `${PREFIX}_learning_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "metricName", type: "string" }, { name: "completionRate", type: "number" }], display: { title: "metricName", sub: "completionRate" }, sqlExtra: "analytics_key text not null,\n  metric_name text not null default '',\n  completion_rate numeric(5, 2) not null default 0,\n  metric_date date not null default current_date,\n  measured_at timestamptz not null default now()" },
    { tab: "deliveryWorkflows", plural: "deliveryWorkflows", singular: "DeliveryWorkflow", pascal: "DeliveryWorkflow", db: `${camel}DeliveryWorkflows`, table: `${PREFIX}_delivery_workflows`, fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" }, sqlExtra: "workflow_key text not null,\n  workflow_name text not null default '',\n  workflow_type text not null default 'onboarding',\n  workflow_status text not null default 'active',\n  step_count integer not null default 0" },
    { tab: "onboardingAutomation", plural: "onboardingAutomation", singular: "OnboardingAutomation", pascal: "OnboardingAutomation", db: `${camel}OnboardingAutomation`, table: `${PREFIX}_onboarding_automation`, fields: [{ name: "automationKey", type: "string" }, { name: "automationName", type: "string" }, { name: "automationStatus", type: "select", options: "AUTOMATION_STATUS_OPTIONS" }], display: { title: "automationName", sub: "automationStatus" }, sqlExtra: "automation_key text not null,\n  automation_name text not null default '',\n  automation_status text not null default 'active',\n  customer_ref text not null default '',\n  started_at timestamptz not null default now()" },
    { tab: "implementationTracking", plural: "implementationTracking", singular: "ImplementationTracking", pascal: "ImplementationTracking", db: `${camel}ImplementationTracking`, table: `${PREFIX}_implementation_tracking`, fields: [{ name: "trackingKey", type: "string" }, { name: "implementationName", type: "string" }, { name: "implementationStatus", type: "select", options: "IMPLEMENTATION_STATUS_OPTIONS" }], display: { title: "implementationName", sub: "implementationStatus" }, sqlExtra: "tracking_key text not null,\n  implementation_name text not null default '',\n  implementation_status text not null default 'in_progress',\n  completion_percent numeric(5, 2) not null default 0,\n  target_date date not null default current_date" },
    { tab: "resourceAssignments", plural: "resourceAssignments", singular: "ResourceAssignment", pascal: "ResourceAssignment", db: `${camel}ResourceAssignments`, table: `${PREFIX}_resource_assignments`, fields: [{ name: "assignmentKey", type: "string" }, { name: "resourceName", type: "string" }, { name: "resourceType", type: "string" }], display: { title: "resourceName", sub: "resourceType" }, sqlExtra: "assignment_key text not null,\n  resource_name text not null default '',\n  resource_type text not null default 'consultant',\n  assigned_to text not null default '',\n  assigned_at timestamptz not null default now()" },
    { tab: "milestoneTracking", plural: "milestoneTracking", singular: "MilestoneTracking", pascal: "MilestoneTracking", db: `${camel}MilestoneTracking`, table: `${PREFIX}_milestone_tracking`, fields: [{ name: "milestoneKey", type: "string" }, { name: "milestoneName", type: "string" }, { name: "milestoneStatus", type: "select", options: "MILESTONE_STATUS_OPTIONS" }], display: { title: "milestoneName", sub: "milestoneStatus" }, sqlExtra: "milestone_key text not null,\n  milestone_name text not null default '',\n  milestone_status text not null default 'pending',\n  target_date date not null default current_date,\n  completed_at timestamptz" },
    { tab: "operationsMetrics", plural: "operationsMetrics", singular: "OperationsMetric", pascal: "OperationsMetric", db: `${camel}OperationsMetrics`, table: `${PREFIX}_operations_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "customerHealthScore", type: "number" }, { name: "overallDeliveryScore", type: "number" }], display: { title: "metricsKey", sub: "overallDeliveryScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  customer_health_score numeric(5, 2) not null default 100,\n  open_ticket_count integer not null default 0,\n  sla_compliance_score numeric(5, 2) not null default 100,\n  deployment_status_score numeric(5, 2) not null default 100,\n  renewal_forecast_count integer not null default 0,\n  adoption_rate numeric(5, 2) not null default 0,\n  overall_delivery_score numeric(5, 2) not null default 100" },
    { tab: "operationsHealth", plural: "operationsHealth", singular: "OperationsHealth", pascal: "OperationsHealth", db: `${camel}OperationsHealth`, table: `${PREFIX}_operations_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  disaster_recovery_mode boolean not null default false,\n  customer_success_status text not null default 'healthy',\n  support_status text not null default 'healthy',\n  deployment_status text not null default 'healthy',\n  security_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "executiveKpis", plural: "executiveKpis", singular: "ExecutiveKpi", pascal: "ExecutiveKpi", db: `${camel}ExecutiveKpis`, table: `${PREFIX}_executive_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiScore", type: "number" }], display: { title: "kpiName", sub: "kpiScore" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_score numeric(5, 2) not null default 0,\n  kpi_type text not null default 'executive',\n  metric_date date not null default current_date" },
    { tab: "deliveryFailures", plural: "deliveryFailures", singular: "DeliveryFailure", pascal: "DeliveryFailure", db: `${camel}DeliveryFailures`, table: `${PREFIX}_delivery_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'deployment',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Program F Capability Wave 3: Customer Success & Delivery Platform\n\n";
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
    sql += `  ('${PREFIX}.view', 'View customer success and delivery data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage customer success, support, deployment, learning, ADO, and dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve customer success and delivery gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer customer success and delivery governance', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00740074-0074-0074-0074-007400740101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)\nvalues\n  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a344', '${org}', 'Customer Success & Delivery Orchestrator', 'customer_success_delivery', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["customer_success","support","deployment","learning","ado","dashboard"]'::jsonb, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)\nvalues\n  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a544', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a344', 'northstar-customer-success-delivery-001', 'customer_success_delivery', 'delivery_hub', '${hubId}', '{"objective":"Customer success and delivery for northstar platform onboarding, support, and deployment"}'::jsonb, 'active', '2026-12-31 23:59:59+00')\non conflict (id) do nothing;\n\n`;
    sql += `-- G0 Delivery Hub\n`;
    sql += `insert into public.csd_delivery_hubs (id, organization_id, hub_key, hub_name, environment, delivery_tier, status)\nvalues ('${hubId}', '${org}', 'northstar-customer-success-delivery', 'Northstar Customer Success & Delivery Hub', 'production', 'enterprise', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G1 Customer Success\n`;
    sql += `insert into public.csd_customer_health_scores (id, organization_id, hub_id, score_key, customer_ref, health_score, status)\nvalues ('04400100-0440-0440-0440-044001000101', '${org}', '${hubId}', 'health-score-0904', 'northstar-corp', 92.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_adoption_analytics (id, organization_id, hub_id, analytics_key, feature_name, adoption_rate, status)\nvalues ('04410101-0441-0441-0441-044101010201', '${org}', '${hubId}', 'adopt-analytics-0904', 'Workflow Engine', 78.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_success_plans (id, organization_id, hub_id, plan_key, plan_name, plan_status, status)\nvalues ('04420102-0442-0442-0442-044201020301', '${org}', '${hubId}', 'success-plan-0904', 'Enterprise Success Plan', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_customer_timelines (id, organization_id, hub_id, timeline_key, timeline_name, timeline_type, status)\nvalues ('04430103-0443-0443-0443-044301030401', '${org}', '${hubId}', 'timeline-onboard-0904', 'Onboarding Timeline', 'milestone', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_renewal_forecasts (id, organization_id, hub_id, forecast_key, customer_ref, forecast_status, status)\nvalues ('04440104-0444-0444-0444-044401040501', '${org}', '${hubId}', 'renewal-forecast-0904', 'northstar-corp', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G2 Support\n`;
    sql += `insert into public.csd_support_tickets (id, organization_id, hub_id, ticket_key, ticket_title, ticket_status, status)\nvalues ('04450105-0445-0445-0445-044501050601', '${org}', '${hubId}', 'ticket-0904', 'Integration Support Request', 'open', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_live_chat_sessions (id, organization_id, hub_id, session_key, session_title, session_status, status)\nvalues ('04460106-0446-0446-0446-044601060701', '${org}', '${hubId}', 'chat-session-0904', 'Live Support Session', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_knowledge_base_articles (id, organization_id, hub_id, article_key, article_title, article_category, status)\nvalues ('04470107-0447-0447-0447-044701070801', '${org}', '${hubId}', 'kb-article-0904', 'Getting Started Guide', 'general', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_sla_policies (id, organization_id, hub_id, policy_key, policy_name, policy_type, status)\nvalues ('04480108-0448-0448-0448-044801080901', '${org}', '${hubId}', 'sla-enterprise-0904', 'Enterprise SLA', 'standard', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_escalation_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)\nvalues ('04490109-0449-0449-0449-044901090a01', '${org}', '${hubId}', 'escalation-0904', 'Critical Escalation Rule', 'time_based', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G3 Deployment\n`;
    sql += `insert into public.csd_deployment_automations (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)\nvalues ('044a010a-044a-044a-044a-044a010a0b01', '${org}', '${hubId}', 'deploy-auto-0904', 'Production Pipeline', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_environment_management (id, organization_id, hub_id, environment_key, environment_name, environment_type, status)\nvalues ('044b010b-044b-044b-044b-044b010b0c01', '${org}', '${hubId}', 'env-prod-0904', 'Production Environment', 'production', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_deployment_tracking (id, organization_id, hub_id, tracking_key, deployment_name, deployment_status, status)\nvalues ('044c010c-044c-044c-044c-044c010c0d01', '${org}', '${hubId}', 'deploy-track-0904', 'Platform Deployment', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_upgrade_management (id, organization_id, hub_id, upgrade_key, upgrade_name, upgrade_status, status)\nvalues ('044d010d-044d-044d-044d-044d010d0e01', '${org}', '${hubId}', 'upgrade-0904', 'Version 2.0 Upgrade', 'scheduled', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_release_tracking (id, organization_id, hub_id, release_key, release_name, release_status, status)\nvalues ('044e010e-044e-044e-044e-044e010e0f01', '${org}', '${hubId}', 'release-0904', 'Platform Release 2.0', 'planned', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G4 Learning\n`;
    sql += `insert into public.csd_training_portals (id, organization_id, hub_id, portal_key, portal_name, portal_type, status)\nvalues ('044f010f-044f-044f-044f-044f010f1001', '${org}', '${hubId}', 'training-portal-0904', 'Customer Training Portal', 'customer', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_video_library (id, organization_id, hub_id, video_key, video_title, video_category, status)\nvalues ('04500110-0450-0450-0450-045001101101', '${org}', '${hubId}', 'video-onboard-0904', 'Platform Onboarding Video', 'onboarding', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_product_tours (id, organization_id, hub_id, tour_key, tour_name, tour_type, status)\nvalues ('04510111-0451-0451-0451-045101111201', '${org}', '${hubId}', 'tour-guided-0904', 'Guided Product Tour', 'guided', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_certifications (id, organization_id, hub_id, certification_key, certification_name, certification_type, status)\nvalues ('04520112-0452-0452-0452-045201121301', '${org}', '${hubId}', 'cert-product-0904', 'Platform Certification', 'product', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_progress_tracking (id, organization_id, hub_id, progress_key, learner_ref, progress_percent, status)\nvalues ('04530113-0453-0453-0453-045301131401', '${org}', '${hubId}', 'progress-0904', 'learner-001', 65.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_learning_analytics (id, organization_id, hub_id, analytics_key, metric_name, completion_rate, status)\nvalues ('04540114-0454-0454-0454-045401141501', '${org}', '${hubId}', 'learn-analytics-0904', 'Course Completion Rate', 82.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G5 ADO\n`;
    sql += `insert into public.csd_delivery_workflows (id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)\nvalues ('04550115-0455-0455-0455-045501151601', '${org}', '${hubId}', 'workflow-onboard-0904', 'Onboarding Workflow', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_onboarding_automation (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)\nvalues ('04560116-0456-0456-0456-045601161701', '${org}', '${hubId}', 'onboard-auto-0904', 'Customer Onboarding Automation', 'active', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_implementation_tracking (id, organization_id, hub_id, tracking_key, implementation_name, implementation_status, status)\nvalues ('04570117-0457-0457-0457-045701171801', '${org}', '${hubId}', 'impl-track-0904', 'Enterprise Implementation', 'in_progress', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_resource_assignments (id, organization_id, hub_id, assignment_key, resource_name, resource_type, status)\nvalues ('04580118-0458-0458-0458-045801181901', '${org}', '${hubId}', 'resource-0904', 'Senior Implementation Consultant', 'consultant', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_milestone_tracking (id, organization_id, hub_id, milestone_key, milestone_name, milestone_status, status)\nvalues ('04590119-0459-0459-0459-045901191a01', '${org}', '${hubId}', 'milestone-go-live-0904', 'Go-Live Milestone', 'pending', 'active')\non conflict (id) do nothing;\n\n`;
    sql += `-- G6 Dashboard\n`;
    sql += `insert into public.csd_operations_metrics (id, organization_id, metrics_key, customer_health_score, open_ticket_count, sla_compliance_score, deployment_status_score, renewal_forecast_count, adoption_rate, overall_delivery_score, status)\nvalues ('045a011a-045a-045a-045a-045a011a1b01', '${org}', 'csd-metrics-0904', 92.00, 8, 96.00, 94.00, 12, 78.50, 93.50, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_operations_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, customer_success_status, support_status, deployment_status, security_status, summary, status)\nvalues ('045b011b-045b-045b-045b-045b011b1c01', '${org}', 'csd-health-0904', 94.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Customer success and delivery operational', 'healthy')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_executive_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)\nvalues ('045c011c-045c-045c-045c-045c011c1d01', '${org}', '${hubId}', 'kpi-exec-0904', 'Executive Delivery KPI', 95.00, 'active')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_delivery_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)\nvalues ('045d011d-045d-045d-045d-045d011d1e01', '${org}', '${hubId}', 'fail-deploy-0904', 'deployment', 'DEPLOY_TIMEOUT', 'Production deployment timed out', 'open')\non conflict (id) do nothing;\n\n`;
    sql += `insert into public.csd_audit_logs (id, organization_id, entity_type, action, summary, security_level)\nvalues ('045e011e-045e-045e-045e-045e011e1f01', '${org}', 'delivery_hub', 'seed', 'Customer success and delivery seed data loaded', 'standard')\non conflict (id) do nothing;\n`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgCsdRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgCsdRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgCsdRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020044_customer_success_delivery_platform.sql");
const seedPath = join(root, "supabase/seed/044_customer_success_delivery_platform_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/customer-success-delivery-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbCsdDeliveryHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Customer Success & Delivery Platform artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbCsd* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-customer-success-delivery-ui.mjs");

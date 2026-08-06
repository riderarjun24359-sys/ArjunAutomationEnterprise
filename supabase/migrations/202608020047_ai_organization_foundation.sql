-- V2 AI Organization Foundation

-- OrganizationHub
create table if not exists public.aof_organization_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  organization_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- GrowthOrchestrator
create table if not exists public.aof_growth_orchestrators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  orchestrator_key text not null,
  orchestrator_name text not null default '',
  orchestrator_status text not null default 'active',
  campaign_ref text not null default '',
  priority_level text not null default 'medium',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, orchestrator_key)
);

-- CampaignIntelligence
create table if not exists public.aof_campaign_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  campaign_key text not null,
  campaign_name text not null default '',
  campaign_status text not null default 'active',
  channel_type text not null default 'digital',
  audience_segment text not null default 'all',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, campaign_key)
);

-- LeadPrioritization
create table if not exists public.aof_lead_prioritization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  lead_key text not null,
  lead_name text not null default '',
  priority_score numeric(5, 2) not null default 0,
  lead_source text not null default 'inbound',
  qualification_tier text not null default 'warm',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, lead_key)
);

-- OpportunityRecommendation
create table if not exists public.aof_opportunity_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null default '',
  recommendation_type text not null default 'upsell',
  confidence_score numeric(5, 2) not null default 0,
  pipeline_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, recommendation_key)
);

-- PipelineHealth
create table if not exists public.aof_pipeline_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  health_key text not null,
  health_name text not null default '',
  health_score numeric(5, 2) not null default 100,
  pipeline_stage text not null default 'qualification',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, health_key)
);

-- GrowthAnalytics
create table if not exists public.aof_growth_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_name text not null default '',
  analytics_type text not null default 'conversion',
  metric_value numeric(12, 2) not null default 0,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- ExecutiveGrowthDashboard
create table if not exists public.aof_executive_growth_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  widget_count integer not null default 0,
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- DeliveryOrchestrator
create table if not exists public.aof_delivery_orchestrators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  orchestrator_key text not null,
  orchestrator_name text not null default '',
  orchestrator_status text not null default 'active',
  delivery_ref text not null default '',
  priority_level text not null default 'medium',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, orchestrator_key)
);

-- ResourcePlanner
create table if not exists public.aof_resource_planners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  planner_key text not null,
  planner_name text not null default '',
  planner_status text not null default 'active',
  resource_type text not null default 'engineering',
  capacity_units numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, planner_key)
);

-- ImplementationScheduler
create table if not exists public.aof_implementation_schedulers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  scheduler_key text not null,
  scheduler_name text not null default '',
  scheduler_status text not null default 'active',
  schedule_cadence text not null default 'weekly',
  milestone_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, scheduler_key)
);

-- DeploymentCoordination
create table if not exists public.aof_deployment_coordination (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  coordination_key text not null,
  coordination_name text not null default '',
  coordination_status text not null default 'active',
  deployment_env text not null default 'production',
  release_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, coordination_key)
);

-- DeliveryIntelligence
create table if not exists public.aof_delivery_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  intelligence_key text not null,
  intelligence_title text not null default '',
  intelligence_type text not null default 'delivery',
  insight_score numeric(5, 2) not null default 0,
  source_module text not null default 'ado',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, intelligence_key)
);

-- CustomerSuccessAutomation
create table if not exists public.aof_customer_success_automation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  automation_key text not null,
  automation_name text not null default '',
  automation_status text not null default 'active',
  trigger_type text not null default 'event',
  workflow_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, automation_key)
);

-- ExecutiveDeliveryDashboard
create table if not exists public.aof_executive_delivery_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  widget_count integer not null default 0,
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- IdeaRegistry
create table if not exists public.aof_idea_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  idea_key text not null,
  idea_title text not null default '',
  idea_status text not null default 'draft',
  idea_category text not null default 'product',
  submitter_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, idea_key)
);

-- InnovationPipeline
create table if not exists public.aof_innovation_pipeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  pipeline_key text not null,
  pipeline_name text not null default '',
  pipeline_status text not null default 'active',
  stage_count integer not null default 0,
  current_stage text not null default 'discovery',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, pipeline_key)
);

-- ExperimentTracker
create table if not exists public.aof_experiment_tracker (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  experiment_key text not null,
  experiment_name text not null default '',
  experiment_status text not null default 'planned',
  hypothesis_ref text not null default '',
  started_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, experiment_key)
);

-- ValidationWorkflow
create table if not exists public.aof_validation_workflow (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null default '',
  workflow_status text not null default 'active',
  validation_type text not null default 'market',
  approval_required boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, workflow_key)
);

-- OutcomeEvaluation
create table if not exists public.aof_outcome_evaluation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  evaluation_key text not null,
  evaluation_title text not null default '',
  evaluation_score numeric(5, 2) not null default 0,
  outcome_type text not null default 'innovation',
  evaluated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, evaluation_key)
);

-- KnowledgeRepository
create table if not exists public.aof_knowledge_repository (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  repository_key text not null,
  repository_name text not null default '',
  repository_status text not null default 'active',
  content_count integer not null default 0,
  taxonomy_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, repository_key)
);

-- AiTaskRouter
create table if not exists public.aof_ai_task_routers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  router_key text not null,
  router_name text not null default '',
  router_status text not null default 'active',
  routing_policy text not null default 'priority',
  agent_pool jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, router_key)
);

-- HumanApprovalEngine
create table if not exists public.aof_human_approval_engine (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  approval_key text not null,
  approval_name text not null default '',
  approval_status text not null default 'pending',
  approval_type text not null default 'human_in_loop',
  escalation_policy text not null default 'manager',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, approval_key)
);

-- PolicyEngine
create table if not exists public.aof_policy_engine (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  policy_status text not null default 'active',
  policy_scope text not null default 'organization',
  rule_set jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- ExecutionHistory
create table if not exists public.aof_execution_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  history_key text not null,
  history_title text not null default '',
  execution_status text not null default 'completed',
  executed_at timestamptz not null default now(),
  task_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- AiGovernanceRule
create table if not exists public.aof_ai_governance_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_status text not null default 'active',
  governance_level text not null default 'standard',
  compliance_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- OrganizationMetric
create table if not exists public.aof_organization_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  growth_score numeric(5, 2) not null default 100,
  delivery_score numeric(5, 2) not null default 100,
  innovation_score numeric(5, 2) not null default 100,
  pending_ai_approval_count integer not null default 0,
  pipeline_health_score numeric(5, 2) not null default 100,
  mission_progress_score numeric(5, 2) not null default 0,
  overall_organization_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- OrganizationHealth
create table if not exists public.aof_organization_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  ago_status text not null default 'healthy',
  ado_status text not null default 'healthy',
  aio_status text not null default 'healthy',
  orchestration_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- InnovationDashboard
create table if not exists public.aof_innovation_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  innovation_score numeric(5, 2) not null default 0,
  refresh_cadence text not null default 'weekly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- MissionProgress
create table if not exists public.aof_mission_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  progress_key text not null,
  progress_name text not null default '',
  progress_percent numeric(5, 2) not null default 0,
  mission_ref text not null default '',
  target_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, progress_key)
);

-- OrganizationFailure
create table if not exists public.aof_organization_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aof_organization_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'orchestration',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- Audit Logs
create table if not exists public.aof_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  action text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create index if not exists idx_aof_organization_hubs_org on public.aof_organization_hubs(organization_id);
create index if not exists idx_aof_growth_orchestrators_org on public.aof_growth_orchestrators(organization_id);
create index if not exists idx_aof_growth_orchestrators_hub on public.aof_growth_orchestrators(hub_id);
create index if not exists idx_aof_campaign_intelligence_org on public.aof_campaign_intelligence(organization_id);
create index if not exists idx_aof_campaign_intelligence_hub on public.aof_campaign_intelligence(hub_id);
create index if not exists idx_aof_lead_prioritization_org on public.aof_lead_prioritization(organization_id);
create index if not exists idx_aof_lead_prioritization_hub on public.aof_lead_prioritization(hub_id);
create index if not exists idx_aof_opportunity_recommendations_org on public.aof_opportunity_recommendations(organization_id);
create index if not exists idx_aof_opportunity_recommendations_hub on public.aof_opportunity_recommendations(hub_id);
create index if not exists idx_aof_pipeline_health_org on public.aof_pipeline_health(organization_id);
create index if not exists idx_aof_pipeline_health_hub on public.aof_pipeline_health(hub_id);
create index if not exists idx_aof_growth_analytics_org on public.aof_growth_analytics(organization_id);
create index if not exists idx_aof_growth_analytics_hub on public.aof_growth_analytics(hub_id);
create index if not exists idx_aof_executive_growth_dashboards_org on public.aof_executive_growth_dashboards(organization_id);
create index if not exists idx_aof_executive_growth_dashboards_hub on public.aof_executive_growth_dashboards(hub_id);
create index if not exists idx_aof_delivery_orchestrators_org on public.aof_delivery_orchestrators(organization_id);
create index if not exists idx_aof_delivery_orchestrators_hub on public.aof_delivery_orchestrators(hub_id);
create index if not exists idx_aof_resource_planners_org on public.aof_resource_planners(organization_id);
create index if not exists idx_aof_resource_planners_hub on public.aof_resource_planners(hub_id);
create index if not exists idx_aof_implementation_schedulers_org on public.aof_implementation_schedulers(organization_id);
create index if not exists idx_aof_implementation_schedulers_hub on public.aof_implementation_schedulers(hub_id);
create index if not exists idx_aof_deployment_coordination_org on public.aof_deployment_coordination(organization_id);
create index if not exists idx_aof_deployment_coordination_hub on public.aof_deployment_coordination(hub_id);
create index if not exists idx_aof_delivery_intelligence_org on public.aof_delivery_intelligence(organization_id);
create index if not exists idx_aof_delivery_intelligence_hub on public.aof_delivery_intelligence(hub_id);
create index if not exists idx_aof_customer_success_automation_org on public.aof_customer_success_automation(organization_id);
create index if not exists idx_aof_customer_success_automation_hub on public.aof_customer_success_automation(hub_id);
create index if not exists idx_aof_executive_delivery_dashboards_org on public.aof_executive_delivery_dashboards(organization_id);
create index if not exists idx_aof_executive_delivery_dashboards_hub on public.aof_executive_delivery_dashboards(hub_id);
create index if not exists idx_aof_idea_registry_org on public.aof_idea_registry(organization_id);
create index if not exists idx_aof_idea_registry_hub on public.aof_idea_registry(hub_id);
create index if not exists idx_aof_innovation_pipeline_org on public.aof_innovation_pipeline(organization_id);
create index if not exists idx_aof_innovation_pipeline_hub on public.aof_innovation_pipeline(hub_id);
create index if not exists idx_aof_experiment_tracker_org on public.aof_experiment_tracker(organization_id);
create index if not exists idx_aof_experiment_tracker_hub on public.aof_experiment_tracker(hub_id);
create index if not exists idx_aof_validation_workflow_org on public.aof_validation_workflow(organization_id);
create index if not exists idx_aof_validation_workflow_hub on public.aof_validation_workflow(hub_id);
create index if not exists idx_aof_outcome_evaluation_org on public.aof_outcome_evaluation(organization_id);
create index if not exists idx_aof_outcome_evaluation_hub on public.aof_outcome_evaluation(hub_id);
create index if not exists idx_aof_knowledge_repository_org on public.aof_knowledge_repository(organization_id);
create index if not exists idx_aof_knowledge_repository_hub on public.aof_knowledge_repository(hub_id);
create index if not exists idx_aof_ai_task_routers_org on public.aof_ai_task_routers(organization_id);
create index if not exists idx_aof_ai_task_routers_hub on public.aof_ai_task_routers(hub_id);
create index if not exists idx_aof_human_approval_engine_org on public.aof_human_approval_engine(organization_id);
create index if not exists idx_aof_human_approval_engine_hub on public.aof_human_approval_engine(hub_id);
create index if not exists idx_aof_policy_engine_org on public.aof_policy_engine(organization_id);
create index if not exists idx_aof_policy_engine_hub on public.aof_policy_engine(hub_id);
create index if not exists idx_aof_execution_history_org on public.aof_execution_history(organization_id);
create index if not exists idx_aof_execution_history_hub on public.aof_execution_history(hub_id);
create index if not exists idx_aof_ai_governance_rules_org on public.aof_ai_governance_rules(organization_id);
create index if not exists idx_aof_ai_governance_rules_hub on public.aof_ai_governance_rules(hub_id);
create index if not exists idx_aof_organization_metrics_org on public.aof_organization_metrics(organization_id);
create index if not exists idx_aof_organization_health_org on public.aof_organization_health(organization_id);
create index if not exists idx_aof_innovation_dashboards_org on public.aof_innovation_dashboards(organization_id);
create index if not exists idx_aof_innovation_dashboards_hub on public.aof_innovation_dashboards(hub_id);
create index if not exists idx_aof_mission_progress_org on public.aof_mission_progress(organization_id);
create index if not exists idx_aof_mission_progress_hub on public.aof_mission_progress(hub_id);
create index if not exists idx_aof_organization_failures_org on public.aof_organization_failures(organization_id);
create index if not exists idx_aof_organization_failures_hub on public.aof_organization_failures(hub_id);
create index if not exists idx_aof_audit_logs_org on public.aof_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aof_organization_hubs','aof_growth_orchestrators','aof_campaign_intelligence','aof_lead_prioritization','aof_opportunity_recommendations','aof_pipeline_health','aof_growth_analytics','aof_executive_growth_dashboards','aof_delivery_orchestrators','aof_resource_planners','aof_implementation_schedulers','aof_deployment_coordination','aof_delivery_intelligence','aof_customer_success_automation','aof_executive_delivery_dashboards','aof_idea_registry','aof_innovation_pipeline','aof_experiment_tracker','aof_validation_workflow','aof_outcome_evaluation','aof_knowledge_repository','aof_ai_task_routers','aof_human_approval_engine','aof_policy_engine','aof_execution_history','aof_ai_governance_rules','aof_organization_metrics','aof_organization_health','aof_innovation_dashboards','aof_mission_progress','aof_organization_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.aof_organization_hubs enable row level security;
alter table public.aof_growth_orchestrators enable row level security;
alter table public.aof_campaign_intelligence enable row level security;
alter table public.aof_lead_prioritization enable row level security;
alter table public.aof_opportunity_recommendations enable row level security;
alter table public.aof_pipeline_health enable row level security;
alter table public.aof_growth_analytics enable row level security;
alter table public.aof_executive_growth_dashboards enable row level security;
alter table public.aof_delivery_orchestrators enable row level security;
alter table public.aof_resource_planners enable row level security;
alter table public.aof_implementation_schedulers enable row level security;
alter table public.aof_deployment_coordination enable row level security;
alter table public.aof_delivery_intelligence enable row level security;
alter table public.aof_customer_success_automation enable row level security;
alter table public.aof_executive_delivery_dashboards enable row level security;
alter table public.aof_idea_registry enable row level security;
alter table public.aof_innovation_pipeline enable row level security;
alter table public.aof_experiment_tracker enable row level security;
alter table public.aof_validation_workflow enable row level security;
alter table public.aof_outcome_evaluation enable row level security;
alter table public.aof_knowledge_repository enable row level security;
alter table public.aof_ai_task_routers enable row level security;
alter table public.aof_human_approval_engine enable row level security;
alter table public.aof_policy_engine enable row level security;
alter table public.aof_execution_history enable row level security;
alter table public.aof_ai_governance_rules enable row level security;
alter table public.aof_organization_metrics enable row level security;
alter table public.aof_organization_health enable row level security;
alter table public.aof_innovation_dashboards enable row level security;
alter table public.aof_mission_progress enable row level security;
alter table public.aof_organization_failures enable row level security;
alter table public.aof_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aof_organization_hubs','aof_growth_orchestrators','aof_campaign_intelligence','aof_lead_prioritization','aof_opportunity_recommendations','aof_pipeline_health','aof_growth_analytics','aof_executive_growth_dashboards','aof_delivery_orchestrators','aof_resource_planners','aof_implementation_schedulers','aof_deployment_coordination','aof_delivery_intelligence','aof_customer_success_automation','aof_executive_delivery_dashboards','aof_idea_registry','aof_innovation_pipeline','aof_experiment_tracker','aof_validation_workflow','aof_outcome_evaluation','aof_knowledge_repository','aof_ai_task_routers','aof_human_approval_engine','aof_policy_engine','aof_execution_history','aof_ai_governance_rules','aof_organization_metrics','aof_organization_health','aof_innovation_dashboards','aof_mission_progress','aof_organization_failures','aof_audit_logs'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);
  end loop;
end $$;

insert into public.permissions (key, description, resource)
values
  ('aof.view', 'View AI organization foundation data', 'ai_organization_foundation'),
  ('aof.manage', 'Manage AGO, ADO, AIO, AI orchestration, and organization dashboard outputs', 'ai_organization_foundation'),
  ('aof.approve', 'Approve AI organization foundation gates and actions', 'ai_organization_foundation'),
  ('aof.admin', 'Administer AI organization foundation governance', 'ai_organization_foundation')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

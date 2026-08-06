-- V2 Program F Capability Wave 3: Customer Success & Delivery Platform

-- DeliveryHub
create table if not exists public.csd_delivery_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  delivery_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- CustomerHealthScore
create table if not exists public.csd_customer_health_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  score_key text not null,
  customer_ref text not null default '',
  health_score numeric(5, 2) not null default 100,
  metric_date date not null default current_date,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- AdoptionAnalytic
create table if not exists public.csd_adoption_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  analytics_key text not null,
  feature_name text not null default '',
  adoption_rate numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- SuccessPlan
create table if not exists public.csd_success_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  plan_key text not null,
  plan_name text not null default '',
  plan_status text not null default 'active',
  customer_ref text not null default '',
  target_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, plan_key)
);

-- CustomerTimeline
create table if not exists public.csd_customer_timelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  timeline_key text not null,
  timeline_name text not null default '',
  timeline_type text not null default 'milestone',
  event_date date not null default current_date,
  event_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, timeline_key)
);

-- RenewalForecast
create table if not exists public.csd_renewal_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  forecast_key text not null,
  customer_ref text not null default '',
  forecast_status text not null default 'pending',
  renewal_date date not null default current_date,
  forecast_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, forecast_key)
);

-- SupportTicket
create table if not exists public.csd_support_tickets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  ticket_key text not null,
  ticket_title text not null default '',
  ticket_status text not null default 'open',
  priority text not null default 'normal',
  opened_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, ticket_key)
);

-- LiveChatSession
create table if not exists public.csd_live_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  session_key text not null,
  session_title text not null default '',
  session_status text not null default 'active',
  agent_ref text not null default '',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, session_key)
);

-- KnowledgeBaseArticle
create table if not exists public.csd_knowledge_base_articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  article_key text not null,
  article_title text not null default '',
  article_category text not null default 'general',
  article_summary text not null default '',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, article_key)
);

-- SlaPolicy
create table if not exists public.csd_sla_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  response_time_minutes integer not null default 60,
  resolution_time_hours integer not null default 24,
  policy_type text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- EscalationRule
create table if not exists public.csd_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  escalation_level integer not null default 1,
  trigger_condition text not null default '',
  rule_type text not null default 'time_based',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- DeploymentAutomation
create table if not exists public.csd_deployment_automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  automation_key text not null,
  automation_name text not null default '',
  automation_type text not null default 'pipeline',
  automation_status text not null default 'active',
  last_run_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, automation_key)
);

-- EnvironmentManagement
create table if not exists public.csd_environment_management (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  environment_key text not null,
  environment_name text not null default '',
  environment_type text not null default 'production',
  region text not null default '',
  managed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, environment_key)
);

-- DeploymentTracking
create table if not exists public.csd_deployment_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  tracking_key text not null,
  deployment_name text not null default '',
  deployment_status text not null default 'pending',
  target_version text not null default '',
  deployed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, tracking_key)
);

-- UpgradeManagement
create table if not exists public.csd_upgrade_management (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  upgrade_key text not null,
  upgrade_name text not null default '',
  upgrade_status text not null default 'scheduled',
  from_version text not null default '',
  to_version text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, upgrade_key)
);

-- ReleaseTracking
create table if not exists public.csd_release_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  release_key text not null,
  release_name text not null default '',
  release_version text not null default '1.0.0',
  release_status text not null default 'planned',
  released_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, release_key)
);

-- TrainingPortal
create table if not exists public.csd_training_portals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  portal_key text not null,
  portal_name text not null default '',
  portal_type text not null default 'customer',
  course_count integer not null default 0,
  portal_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, portal_key)
);

-- VideoLibrary
create table if not exists public.csd_video_library (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  video_key text not null,
  video_title text not null default '',
  video_category text not null default 'onboarding',
  duration_minutes integer not null default 0,
  video_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, video_key)
);

-- ProductTour
create table if not exists public.csd_product_tours (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  tour_key text not null,
  tour_name text not null default '',
  tour_type text not null default 'guided',
  step_count integer not null default 0,
  tour_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, tour_key)
);

-- Certification
create table if not exists public.csd_certifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  certification_key text not null,
  certification_name text not null default '',
  certification_type text not null default 'product',
  validity_days integer not null default 365,
  certification_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, certification_key)
);

-- ProgressTracking
create table if not exists public.csd_progress_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  progress_key text not null,
  learner_ref text not null default '',
  progress_percent numeric(5, 2) not null default 0,
  course_ref text not null default '',
  last_activity_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, progress_key)
);

-- LearningAnalytic
create table if not exists public.csd_learning_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  analytics_key text not null,
  metric_name text not null default '',
  completion_rate numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- DeliveryWorkflow
create table if not exists public.csd_delivery_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null default '',
  workflow_type text not null default 'onboarding',
  workflow_status text not null default 'active',
  step_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, workflow_key)
);

-- OnboardingAutomation
create table if not exists public.csd_onboarding_automation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  automation_key text not null,
  automation_name text not null default '',
  automation_status text not null default 'active',
  customer_ref text not null default '',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, automation_key)
);

-- ImplementationTracking
create table if not exists public.csd_implementation_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  tracking_key text not null,
  implementation_name text not null default '',
  implementation_status text not null default 'in_progress',
  completion_percent numeric(5, 2) not null default 0,
  target_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, tracking_key)
);

-- ResourceAssignment
create table if not exists public.csd_resource_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  assignment_key text not null,
  resource_name text not null default '',
  resource_type text not null default 'consultant',
  assigned_to text not null default '',
  assigned_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, assignment_key)
);

-- MilestoneTracking
create table if not exists public.csd_milestone_tracking (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  milestone_key text not null,
  milestone_name text not null default '',
  milestone_status text not null default 'pending',
  target_date date not null default current_date,
  completed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, milestone_key)
);

-- OperationsMetric
create table if not exists public.csd_operations_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  customer_health_score numeric(5, 2) not null default 100,
  open_ticket_count integer not null default 0,
  sla_compliance_score numeric(5, 2) not null default 100,
  deployment_status_score numeric(5, 2) not null default 100,
  renewal_forecast_count integer not null default 0,
  adoption_rate numeric(5, 2) not null default 0,
  overall_delivery_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- OperationsHealth
create table if not exists public.csd_operations_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  customer_success_status text not null default 'healthy',
  support_status text not null default 'healthy',
  deployment_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveKpi
create table if not exists public.csd_executive_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_score numeric(5, 2) not null default 0,
  kpi_type text not null default 'executive',
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- DeliveryFailure
create table if not exists public.csd_delivery_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.csd_delivery_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'deployment',
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
create table if not exists public.csd_audit_logs (
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

create index if not exists idx_csd_delivery_hubs_org on public.csd_delivery_hubs(organization_id);
create index if not exists idx_csd_customer_health_scores_org on public.csd_customer_health_scores(organization_id);
create index if not exists idx_csd_customer_health_scores_hub on public.csd_customer_health_scores(hub_id);
create index if not exists idx_csd_adoption_analytics_org on public.csd_adoption_analytics(organization_id);
create index if not exists idx_csd_adoption_analytics_hub on public.csd_adoption_analytics(hub_id);
create index if not exists idx_csd_success_plans_org on public.csd_success_plans(organization_id);
create index if not exists idx_csd_success_plans_hub on public.csd_success_plans(hub_id);
create index if not exists idx_csd_customer_timelines_org on public.csd_customer_timelines(organization_id);
create index if not exists idx_csd_customer_timelines_hub on public.csd_customer_timelines(hub_id);
create index if not exists idx_csd_renewal_forecasts_org on public.csd_renewal_forecasts(organization_id);
create index if not exists idx_csd_renewal_forecasts_hub on public.csd_renewal_forecasts(hub_id);
create index if not exists idx_csd_support_tickets_org on public.csd_support_tickets(organization_id);
create index if not exists idx_csd_support_tickets_hub on public.csd_support_tickets(hub_id);
create index if not exists idx_csd_live_chat_sessions_org on public.csd_live_chat_sessions(organization_id);
create index if not exists idx_csd_live_chat_sessions_hub on public.csd_live_chat_sessions(hub_id);
create index if not exists idx_csd_knowledge_base_articles_org on public.csd_knowledge_base_articles(organization_id);
create index if not exists idx_csd_knowledge_base_articles_hub on public.csd_knowledge_base_articles(hub_id);
create index if not exists idx_csd_sla_policies_org on public.csd_sla_policies(organization_id);
create index if not exists idx_csd_sla_policies_hub on public.csd_sla_policies(hub_id);
create index if not exists idx_csd_escalation_rules_org on public.csd_escalation_rules(organization_id);
create index if not exists idx_csd_escalation_rules_hub on public.csd_escalation_rules(hub_id);
create index if not exists idx_csd_deployment_automations_org on public.csd_deployment_automations(organization_id);
create index if not exists idx_csd_deployment_automations_hub on public.csd_deployment_automations(hub_id);
create index if not exists idx_csd_environment_management_org on public.csd_environment_management(organization_id);
create index if not exists idx_csd_environment_management_hub on public.csd_environment_management(hub_id);
create index if not exists idx_csd_deployment_tracking_org on public.csd_deployment_tracking(organization_id);
create index if not exists idx_csd_deployment_tracking_hub on public.csd_deployment_tracking(hub_id);
create index if not exists idx_csd_upgrade_management_org on public.csd_upgrade_management(organization_id);
create index if not exists idx_csd_upgrade_management_hub on public.csd_upgrade_management(hub_id);
create index if not exists idx_csd_release_tracking_org on public.csd_release_tracking(organization_id);
create index if not exists idx_csd_release_tracking_hub on public.csd_release_tracking(hub_id);
create index if not exists idx_csd_training_portals_org on public.csd_training_portals(organization_id);
create index if not exists idx_csd_training_portals_hub on public.csd_training_portals(hub_id);
create index if not exists idx_csd_video_library_org on public.csd_video_library(organization_id);
create index if not exists idx_csd_video_library_hub on public.csd_video_library(hub_id);
create index if not exists idx_csd_product_tours_org on public.csd_product_tours(organization_id);
create index if not exists idx_csd_product_tours_hub on public.csd_product_tours(hub_id);
create index if not exists idx_csd_certifications_org on public.csd_certifications(organization_id);
create index if not exists idx_csd_certifications_hub on public.csd_certifications(hub_id);
create index if not exists idx_csd_progress_tracking_org on public.csd_progress_tracking(organization_id);
create index if not exists idx_csd_progress_tracking_hub on public.csd_progress_tracking(hub_id);
create index if not exists idx_csd_learning_analytics_org on public.csd_learning_analytics(organization_id);
create index if not exists idx_csd_learning_analytics_hub on public.csd_learning_analytics(hub_id);
create index if not exists idx_csd_delivery_workflows_org on public.csd_delivery_workflows(organization_id);
create index if not exists idx_csd_delivery_workflows_hub on public.csd_delivery_workflows(hub_id);
create index if not exists idx_csd_onboarding_automation_org on public.csd_onboarding_automation(organization_id);
create index if not exists idx_csd_onboarding_automation_hub on public.csd_onboarding_automation(hub_id);
create index if not exists idx_csd_implementation_tracking_org on public.csd_implementation_tracking(organization_id);
create index if not exists idx_csd_implementation_tracking_hub on public.csd_implementation_tracking(hub_id);
create index if not exists idx_csd_resource_assignments_org on public.csd_resource_assignments(organization_id);
create index if not exists idx_csd_resource_assignments_hub on public.csd_resource_assignments(hub_id);
create index if not exists idx_csd_milestone_tracking_org on public.csd_milestone_tracking(organization_id);
create index if not exists idx_csd_milestone_tracking_hub on public.csd_milestone_tracking(hub_id);
create index if not exists idx_csd_operations_metrics_org on public.csd_operations_metrics(organization_id);
create index if not exists idx_csd_operations_health_org on public.csd_operations_health(organization_id);
create index if not exists idx_csd_executive_kpis_org on public.csd_executive_kpis(organization_id);
create index if not exists idx_csd_executive_kpis_hub on public.csd_executive_kpis(hub_id);
create index if not exists idx_csd_delivery_failures_org on public.csd_delivery_failures(organization_id);
create index if not exists idx_csd_delivery_failures_hub on public.csd_delivery_failures(hub_id);
create index if not exists idx_csd_audit_logs_org on public.csd_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'csd_delivery_hubs','csd_customer_health_scores','csd_adoption_analytics','csd_success_plans','csd_customer_timelines','csd_renewal_forecasts','csd_support_tickets','csd_live_chat_sessions','csd_knowledge_base_articles','csd_sla_policies','csd_escalation_rules','csd_deployment_automations','csd_environment_management','csd_deployment_tracking','csd_upgrade_management','csd_release_tracking','csd_training_portals','csd_video_library','csd_product_tours','csd_certifications','csd_progress_tracking','csd_learning_analytics','csd_delivery_workflows','csd_onboarding_automation','csd_implementation_tracking','csd_resource_assignments','csd_milestone_tracking','csd_operations_metrics','csd_operations_health','csd_executive_kpis','csd_delivery_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.csd_delivery_hubs enable row level security;
alter table public.csd_customer_health_scores enable row level security;
alter table public.csd_adoption_analytics enable row level security;
alter table public.csd_success_plans enable row level security;
alter table public.csd_customer_timelines enable row level security;
alter table public.csd_renewal_forecasts enable row level security;
alter table public.csd_support_tickets enable row level security;
alter table public.csd_live_chat_sessions enable row level security;
alter table public.csd_knowledge_base_articles enable row level security;
alter table public.csd_sla_policies enable row level security;
alter table public.csd_escalation_rules enable row level security;
alter table public.csd_deployment_automations enable row level security;
alter table public.csd_environment_management enable row level security;
alter table public.csd_deployment_tracking enable row level security;
alter table public.csd_upgrade_management enable row level security;
alter table public.csd_release_tracking enable row level security;
alter table public.csd_training_portals enable row level security;
alter table public.csd_video_library enable row level security;
alter table public.csd_product_tours enable row level security;
alter table public.csd_certifications enable row level security;
alter table public.csd_progress_tracking enable row level security;
alter table public.csd_learning_analytics enable row level security;
alter table public.csd_delivery_workflows enable row level security;
alter table public.csd_onboarding_automation enable row level security;
alter table public.csd_implementation_tracking enable row level security;
alter table public.csd_resource_assignments enable row level security;
alter table public.csd_milestone_tracking enable row level security;
alter table public.csd_operations_metrics enable row level security;
alter table public.csd_operations_health enable row level security;
alter table public.csd_executive_kpis enable row level security;
alter table public.csd_delivery_failures enable row level security;
alter table public.csd_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'csd_delivery_hubs','csd_customer_health_scores','csd_adoption_analytics','csd_success_plans','csd_customer_timelines','csd_renewal_forecasts','csd_support_tickets','csd_live_chat_sessions','csd_knowledge_base_articles','csd_sla_policies','csd_escalation_rules','csd_deployment_automations','csd_environment_management','csd_deployment_tracking','csd_upgrade_management','csd_release_tracking','csd_training_portals','csd_video_library','csd_product_tours','csd_certifications','csd_progress_tracking','csd_learning_analytics','csd_delivery_workflows','csd_onboarding_automation','csd_implementation_tracking','csd_resource_assignments','csd_milestone_tracking','csd_operations_metrics','csd_operations_health','csd_executive_kpis','csd_delivery_failures','csd_audit_logs'
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
  ('csd.view', 'View customer success and delivery data', 'customer_success_delivery'),
  ('csd.manage', 'Manage customer success, support, deployment, learning, ADO, and dashboard outputs', 'customer_success_delivery'),
  ('csd.approve', 'Approve customer success and delivery gates and actions', 'customer_success_delivery'),
  ('csd.admin', 'Administer customer success and delivery governance', 'customer_success_delivery')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- V2 Program B Sprint 4: Enterprise Dynamic Workflow Engine

-- WorkflowHub
create table if not exists public.dwe_workflow_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- WorkflowDefinition
create table if not exists public.dwe_workflow_definitions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null default '',
  workflow_type text not null default 'standard',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, workflow_key)
);

-- WorkflowCategory
create table if not exists public.dwe_workflow_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- WorkflowTemplate
create table if not exists public.dwe_workflow_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_type text not null default 'standard',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- WorkflowVersion
create table if not exists public.dwe_workflow_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- WorkflowNode
create table if not exists public.dwe_workflow_nodes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  node_key text not null,
  node_name text not null default '',
  node_type text not null default 'task',
  node_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, node_key)
);

-- WorkflowTransition
create table if not exists public.dwe_workflow_transitions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  transition_key text not null,
  transition_name text not null default '',
  source_node_ref text not null default '',
  target_node_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, transition_key)
);

-- DecisionNode
create table if not exists public.dwe_decision_nodes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  decision_key text not null,
  decision_name text not null default '',
  decision_expression text not null default '',
  default_branch text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, decision_key)
);

-- ReusableSubflow
create table if not exists public.dwe_reusable_subflows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  subflow_key text not null,
  subflow_name text not null default '',
  subflow_type text not null default 'standard',
  input_schema jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, subflow_key)
);

-- WorkflowExecution
create table if not exists public.dwe_workflow_executions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  execution_key text not null,
  execution_name text not null default '',
  execution_status text not null default 'running',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, execution_key)
);

-- ExecutionHistory
create table if not exists public.dwe_execution_history (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  history_key text not null,
  history_type text not null default 'step',
  history_summary text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- ExecutionRetry
create table if not exists public.dwe_execution_retries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  retry_key text not null,
  retry_count integer not null default 0,
  retry_status text not null default 'pending',
  next_retry_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, retry_key)
);

-- ExecutionRollback
create table if not exists public.dwe_execution_rollbacks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  rollback_key text not null,
  rollback_reason text not null default '',
  rollback_status text not null default 'pending',
  rolled_back_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rollback_key)
);

-- TimeTrigger
create table if not exists public.dwe_time_triggers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  trigger_key text not null,
  trigger_name text not null default '',
  cron_expression text not null default '',
  timezone text not null default 'UTC',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trigger_key)
);

-- BusinessEventTrigger
create table if not exists public.dwe_business_event_triggers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  trigger_key text not null,
  trigger_name text not null default '',
  event_type text not null default '',
  event_filter jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trigger_key)
);

-- WebhookTrigger
create table if not exists public.dwe_webhook_triggers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  trigger_key text not null,
  trigger_name text not null default '',
  webhook_url text not null default '',
  secret_token text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trigger_key)
);

-- ScheduledTrigger
create table if not exists public.dwe_scheduled_triggers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  trigger_key text not null,
  trigger_name text not null default '',
  schedule_type text not null default 'interval',
  interval_seconds integer not null default 3600,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trigger_key)
);

-- ManualReview
create table if not exists public.dwe_manual_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  review_key text not null,
  review_name text not null default '',
  review_status text not null default 'pending',
  assigned_to uuid,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- ApprovalTask
create table if not exists public.dwe_approval_tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  task_key text not null,
  task_name text not null default '',
  task_status text not null default 'pending',
  due_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, task_key)
);

-- EscalationRule
create table if not exists public.dwe_escalation_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  escalation_level integer not null default 1,
  escalation_after_minutes integer not null default 60,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- SlaTracking
create table if not exists public.dwe_sla_trackings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  sla_key text not null,
  sla_name text not null default '',
  target_minutes integer not null default 60,
  breach_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, sla_key)
);

-- AutomationNotification
create table if not exists public.dwe_automation_notifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  notification_key text not null,
  notification_name text not null default '',
  channel text not null default 'email',
  template_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, notification_key)
);

-- AutomationApiCall
create table if not exists public.dwe_automation_api_calls (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  api_key text not null,
  api_name text not null default '',
  endpoint_url text not null default '',
  http_method text not null default 'POST',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, api_key)
);

-- AutomationIntegration
create table if not exists public.dwe_automation_integrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  integration_key text not null,
  integration_name text not null default '',
  integration_type text not null default 'rest',
  config jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, integration_key)
);

-- ExecutionAnalytics
create table if not exists public.dwe_execution_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'execution',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- BottleneckReport
create table if not exists public.dwe_bottleneck_reports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  report_key text not null,
  report_name text not null default '',
  bottleneck_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- SlaComplianceMetric
create table if not exists public.dwe_sla_compliance_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  metric_key text not null,
  metric_name text not null default '',
  compliance_rate numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metric_key)
);

-- WorkflowMetric
create table if not exists public.dwe_workflow_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  execution_count integer not null default 0,
  average_duration_ms integer not null default 0,
  failure_rate numeric(5, 2) not null default 0,
  success_rate numeric(5, 2) not null default 100,
  bottleneck_score numeric(5, 2) not null default 0,
  sla_compliance_score numeric(5, 2) not null default 100,
  overall_workflow_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- WorkflowHealth
create table if not exists public.dwe_workflow_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  running_workflows_count integer not null default 0,
  pending_tasks_count integer not null default 0,
  automation_health_status text not null default 'healthy',
  framework_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- FailedExecution
create table if not exists public.dwe_failed_executions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  failure_key text not null,
  execution_ref text not null default '',
  failure_type text not null default 'runtime',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- WorkflowFailure
create table if not exists public.dwe_workflow_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.dwe_workflow_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'execution',
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
create table if not exists public.dwe_audit_logs (
  id uuid primary key default uuid_generate_v4(),
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

create index if not exists idx_dwe_workflow_hubs_org on public.dwe_workflow_hubs(organization_id);
create index if not exists idx_dwe_workflow_definitions_org on public.dwe_workflow_definitions(organization_id);
create index if not exists idx_dwe_workflow_definitions_hub on public.dwe_workflow_definitions(hub_id);
create index if not exists idx_dwe_workflow_categories_org on public.dwe_workflow_categories(organization_id);
create index if not exists idx_dwe_workflow_categories_hub on public.dwe_workflow_categories(hub_id);
create index if not exists idx_dwe_workflow_templates_org on public.dwe_workflow_templates(organization_id);
create index if not exists idx_dwe_workflow_templates_hub on public.dwe_workflow_templates(hub_id);
create index if not exists idx_dwe_workflow_versions_org on public.dwe_workflow_versions(organization_id);
create index if not exists idx_dwe_workflow_versions_hub on public.dwe_workflow_versions(hub_id);
create index if not exists idx_dwe_workflow_nodes_org on public.dwe_workflow_nodes(organization_id);
create index if not exists idx_dwe_workflow_nodes_hub on public.dwe_workflow_nodes(hub_id);
create index if not exists idx_dwe_workflow_transitions_org on public.dwe_workflow_transitions(organization_id);
create index if not exists idx_dwe_workflow_transitions_hub on public.dwe_workflow_transitions(hub_id);
create index if not exists idx_dwe_decision_nodes_org on public.dwe_decision_nodes(organization_id);
create index if not exists idx_dwe_decision_nodes_hub on public.dwe_decision_nodes(hub_id);
create index if not exists idx_dwe_reusable_subflows_org on public.dwe_reusable_subflows(organization_id);
create index if not exists idx_dwe_reusable_subflows_hub on public.dwe_reusable_subflows(hub_id);
create index if not exists idx_dwe_workflow_executions_org on public.dwe_workflow_executions(organization_id);
create index if not exists idx_dwe_workflow_executions_hub on public.dwe_workflow_executions(hub_id);
create index if not exists idx_dwe_execution_history_org on public.dwe_execution_history(organization_id);
create index if not exists idx_dwe_execution_history_hub on public.dwe_execution_history(hub_id);
create index if not exists idx_dwe_execution_retries_org on public.dwe_execution_retries(organization_id);
create index if not exists idx_dwe_execution_retries_hub on public.dwe_execution_retries(hub_id);
create index if not exists idx_dwe_execution_rollbacks_org on public.dwe_execution_rollbacks(organization_id);
create index if not exists idx_dwe_execution_rollbacks_hub on public.dwe_execution_rollbacks(hub_id);
create index if not exists idx_dwe_time_triggers_org on public.dwe_time_triggers(organization_id);
create index if not exists idx_dwe_time_triggers_hub on public.dwe_time_triggers(hub_id);
create index if not exists idx_dwe_business_event_triggers_org on public.dwe_business_event_triggers(organization_id);
create index if not exists idx_dwe_business_event_triggers_hub on public.dwe_business_event_triggers(hub_id);
create index if not exists idx_dwe_webhook_triggers_org on public.dwe_webhook_triggers(organization_id);
create index if not exists idx_dwe_webhook_triggers_hub on public.dwe_webhook_triggers(hub_id);
create index if not exists idx_dwe_scheduled_triggers_org on public.dwe_scheduled_triggers(organization_id);
create index if not exists idx_dwe_scheduled_triggers_hub on public.dwe_scheduled_triggers(hub_id);
create index if not exists idx_dwe_manual_reviews_org on public.dwe_manual_reviews(organization_id);
create index if not exists idx_dwe_manual_reviews_hub on public.dwe_manual_reviews(hub_id);
create index if not exists idx_dwe_approval_tasks_org on public.dwe_approval_tasks(organization_id);
create index if not exists idx_dwe_approval_tasks_hub on public.dwe_approval_tasks(hub_id);
create index if not exists idx_dwe_escalation_rules_org on public.dwe_escalation_rules(organization_id);
create index if not exists idx_dwe_escalation_rules_hub on public.dwe_escalation_rules(hub_id);
create index if not exists idx_dwe_sla_trackings_org on public.dwe_sla_trackings(organization_id);
create index if not exists idx_dwe_sla_trackings_hub on public.dwe_sla_trackings(hub_id);
create index if not exists idx_dwe_automation_notifications_org on public.dwe_automation_notifications(organization_id);
create index if not exists idx_dwe_automation_notifications_hub on public.dwe_automation_notifications(hub_id);
create index if not exists idx_dwe_automation_api_calls_org on public.dwe_automation_api_calls(organization_id);
create index if not exists idx_dwe_automation_api_calls_hub on public.dwe_automation_api_calls(hub_id);
create index if not exists idx_dwe_automation_integrations_org on public.dwe_automation_integrations(organization_id);
create index if not exists idx_dwe_automation_integrations_hub on public.dwe_automation_integrations(hub_id);
create index if not exists idx_dwe_execution_analytics_org on public.dwe_execution_analytics(organization_id);
create index if not exists idx_dwe_execution_analytics_hub on public.dwe_execution_analytics(hub_id);
create index if not exists idx_dwe_bottleneck_reports_org on public.dwe_bottleneck_reports(organization_id);
create index if not exists idx_dwe_bottleneck_reports_hub on public.dwe_bottleneck_reports(hub_id);
create index if not exists idx_dwe_sla_compliance_metrics_org on public.dwe_sla_compliance_metrics(organization_id);
create index if not exists idx_dwe_sla_compliance_metrics_hub on public.dwe_sla_compliance_metrics(hub_id);
create index if not exists idx_dwe_workflow_metrics_org on public.dwe_workflow_metrics(organization_id);
create index if not exists idx_dwe_workflow_health_org on public.dwe_workflow_health(organization_id);
create index if not exists idx_dwe_failed_executions_org on public.dwe_failed_executions(organization_id);
create index if not exists idx_dwe_failed_executions_hub on public.dwe_failed_executions(hub_id);
create index if not exists idx_dwe_workflow_failures_org on public.dwe_workflow_failures(organization_id);
create index if not exists idx_dwe_workflow_failures_hub on public.dwe_workflow_failures(hub_id);
create index if not exists idx_dwe_audit_logs_org on public.dwe_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dwe_workflow_hubs','dwe_workflow_definitions','dwe_workflow_categories','dwe_workflow_templates','dwe_workflow_versions','dwe_workflow_nodes','dwe_workflow_transitions','dwe_decision_nodes','dwe_reusable_subflows','dwe_workflow_executions','dwe_execution_history','dwe_execution_retries','dwe_execution_rollbacks','dwe_time_triggers','dwe_business_event_triggers','dwe_webhook_triggers','dwe_scheduled_triggers','dwe_manual_reviews','dwe_approval_tasks','dwe_escalation_rules','dwe_sla_trackings','dwe_automation_notifications','dwe_automation_api_calls','dwe_automation_integrations','dwe_execution_analytics','dwe_bottleneck_reports','dwe_sla_compliance_metrics','dwe_workflow_metrics','dwe_workflow_health','dwe_failed_executions','dwe_workflow_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.dwe_workflow_hubs enable row level security;
alter table public.dwe_workflow_definitions enable row level security;
alter table public.dwe_workflow_categories enable row level security;
alter table public.dwe_workflow_templates enable row level security;
alter table public.dwe_workflow_versions enable row level security;
alter table public.dwe_workflow_nodes enable row level security;
alter table public.dwe_workflow_transitions enable row level security;
alter table public.dwe_decision_nodes enable row level security;
alter table public.dwe_reusable_subflows enable row level security;
alter table public.dwe_workflow_executions enable row level security;
alter table public.dwe_execution_history enable row level security;
alter table public.dwe_execution_retries enable row level security;
alter table public.dwe_execution_rollbacks enable row level security;
alter table public.dwe_time_triggers enable row level security;
alter table public.dwe_business_event_triggers enable row level security;
alter table public.dwe_webhook_triggers enable row level security;
alter table public.dwe_scheduled_triggers enable row level security;
alter table public.dwe_manual_reviews enable row level security;
alter table public.dwe_approval_tasks enable row level security;
alter table public.dwe_escalation_rules enable row level security;
alter table public.dwe_sla_trackings enable row level security;
alter table public.dwe_automation_notifications enable row level security;
alter table public.dwe_automation_api_calls enable row level security;
alter table public.dwe_automation_integrations enable row level security;
alter table public.dwe_execution_analytics enable row level security;
alter table public.dwe_bottleneck_reports enable row level security;
alter table public.dwe_sla_compliance_metrics enable row level security;
alter table public.dwe_workflow_metrics enable row level security;
alter table public.dwe_workflow_health enable row level security;
alter table public.dwe_failed_executions enable row level security;
alter table public.dwe_workflow_failures enable row level security;
alter table public.dwe_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'dwe_workflow_hubs','dwe_workflow_definitions','dwe_workflow_categories','dwe_workflow_templates','dwe_workflow_versions','dwe_workflow_nodes','dwe_workflow_transitions','dwe_decision_nodes','dwe_reusable_subflows','dwe_workflow_executions','dwe_execution_history','dwe_execution_retries','dwe_execution_rollbacks','dwe_time_triggers','dwe_business_event_triggers','dwe_webhook_triggers','dwe_scheduled_triggers','dwe_manual_reviews','dwe_approval_tasks','dwe_escalation_rules','dwe_sla_trackings','dwe_automation_notifications','dwe_automation_api_calls','dwe_automation_integrations','dwe_execution_analytics','dwe_bottleneck_reports','dwe_sla_compliance_metrics','dwe_workflow_metrics','dwe_workflow_health','dwe_failed_executions','dwe_workflow_failures','dwe_audit_logs'
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
  ('dwe.view', 'View enterprise dynamic workflow engine data', 'enterprise_dynamic_workflow_engine'),
  ('dwe.manage', 'Manage workflow registry, designer, execution, automation, and framework outputs', 'enterprise_dynamic_workflow_engine'),
  ('dwe.approve', 'Approve workflow reviews and approval gates', 'enterprise_dynamic_workflow_engine'),
  ('dwe.admin', 'Administer enterprise dynamic workflow engine governance', 'enterprise_dynamic_workflow_engine')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

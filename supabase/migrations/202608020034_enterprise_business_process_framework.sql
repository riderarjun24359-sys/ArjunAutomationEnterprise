-- V2 Program B Sprint 2: Enterprise Business Process Framework

-- ProcessHub
create table if not exists public.bpf_process_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- BusinessProcess
create table if not exists public.bpf_business_processes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  process_key text not null,
  process_name text not null default '',
  process_type text not null default 'operational',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, process_key)
);

-- ProcessCategory
create table if not exists public.bpf_process_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_type text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- ProcessVersion
create table if not exists public.bpf_process_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- ProcessDependency
create table if not exists public.bpf_process_dependencies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  dependency_key text not null,
  dependency_type text not null default 'process',
  dependency_ref text not null default '',
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dependency_key)
);

-- ProcessModel
create table if not exists public.bpf_process_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  model_key text not null,
  model_name text not null default '',
  model_type text not null default 'workflow',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, model_key)
);

-- ProcessStep
create table if not exists public.bpf_process_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  step_key text not null,
  step_name text not null default '',
  step_order integer not null default 0,
  step_type text not null default 'action',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, step_key)
);

-- DecisionPoint
create table if not exists public.bpf_decision_points (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  decision_key text not null,
  decision_name text not null default '',
  decision_type text not null default 'gateway',
  decision_expression text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, decision_key)
);

-- ReusableBlock
create table if not exists public.bpf_reusable_blocks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  block_key text not null,
  block_name text not null default '',
  block_type text not null default 'subprocess',
  block_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, block_key)
);

-- ApprovalRule
create table if not exists public.bpf_approval_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_type text not null default 'sequential',
  rule_expression text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- SequentialApproval
create table if not exists public.bpf_sequential_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  approval_key text not null,
  approval_name text not null default '',
  approval_order integer not null default 0,
  approver_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, approval_key)
);

-- ParallelApproval
create table if not exists public.bpf_parallel_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  approval_key text not null,
  approval_name text not null default '',
  approver_count integer not null default 1,
  quorum_required integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, approval_key)
);

-- EscalationRule
create table if not exists public.bpf_escalation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  escalation_key text not null,
  escalation_name text not null default '',
  escalation_level integer not null default 1,
  timeout_hours integer not null default 24,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, escalation_key)
);

-- TaskAssignment
create table if not exists public.bpf_task_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  assignment_key text not null,
  assignment_name text not null default '',
  assignee_ref text not null default '',
  priority text not null default 'normal',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, assignment_key)
);

-- TaskTemplate
create table if not exists public.bpf_task_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_type text not null default 'standard',
  steps_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- RecurringTask
create table if not exists public.bpf_recurring_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  task_key text not null,
  task_name text not null default '',
  recurrence_pattern text not null default 'daily',
  next_run_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, task_key)
);

-- TaskSlaPolicy
create table if not exists public.bpf_task_sla_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  sla_hours integer not null default 24,
  breach_action text not null default 'escalate',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- RuleCondition
create table if not exists public.bpf_rule_conditions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  condition_key text not null,
  condition_name text not null default '',
  condition_type text not null default 'expression',
  condition_expression text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, condition_key)
);

-- RuleValidation
create table if not exists public.bpf_rule_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  validation_key text not null,
  validation_name text not null default '',
  validation_type text not null default 'schema',
  validation_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- RuleCalculation
create table if not exists public.bpf_rule_calculations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  calculation_key text not null,
  calculation_name text not null default '',
  calculation_type text not null default 'formula',
  formula_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, calculation_key)
);

-- ReusableRule
create table if not exists public.bpf_reusable_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_type text not null default 'validation',
  rule_expression text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- ProcessExecution
create table if not exists public.bpf_process_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  execution_key text not null,
  execution_name text not null default '',
  execution_status text not null default 'pending',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, execution_key)
);

-- ExecutionHistory
create table if not exists public.bpf_execution_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  history_key text not null,
  history_type text not null default 'state_change',
  history_summary text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- ExecutionRetry
create table if not exists public.bpf_execution_retries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  retry_key text not null,
  retry_count integer not null default 0,
  retry_reason text not null default '',
  retried_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, retry_key)
);

-- ExecutionAnalytics
create table if not exists public.bpf_execution_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_type text not null default 'throughput',
  analytics_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- BottleneckReport
create table if not exists public.bpf_bottleneck_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  report_key text not null,
  report_name text not null default '',
  bottleneck_score numeric(5, 2) not null default 0,
  report_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- SlaPerformanceMetric
create table if not exists public.bpf_sla_performance_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  metric_key text not null,
  metric_name text not null default '',
  sla_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metric_key)
);

-- ProcessMetric
create table if not exists public.bpf_process_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  execution_count integer not null default 0,
  average_duration_ms integer not null default 0,
  success_rate numeric(5, 2) not null default 100,
  failure_count integer not null default 0,
  bottleneck_score numeric(5, 2) not null default 0,
  sla_performance_score numeric(5, 2) not null default 100,
  overall_process_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- ProcessHealth
create table if not exists public.bpf_process_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  pending_approvals_count integer not null default 0,
  active_process_count integer not null default 0,
  task_queue_depth integer not null default 0,
  framework_health_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- FailedProcessRecord
create table if not exists public.bpf_failed_process_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
  record_key text not null,
  record_name text not null default '',
  failure_type text not null default 'execution',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, record_key)
);

-- ProcessFailure
create table if not exists public.bpf_process_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.bpf_process_hubs(id) on delete cascade,
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
create table if not exists public.bpf_audit_logs (
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

create index if not exists idx_bpf_process_hubs_org on public.bpf_process_hubs(organization_id);
create index if not exists idx_bpf_business_processes_org on public.bpf_business_processes(organization_id);
create index if not exists idx_bpf_business_processes_hub on public.bpf_business_processes(hub_id);
create index if not exists idx_bpf_process_categories_org on public.bpf_process_categories(organization_id);
create index if not exists idx_bpf_process_categories_hub on public.bpf_process_categories(hub_id);
create index if not exists idx_bpf_process_versions_org on public.bpf_process_versions(organization_id);
create index if not exists idx_bpf_process_versions_hub on public.bpf_process_versions(hub_id);
create index if not exists idx_bpf_process_dependencies_org on public.bpf_process_dependencies(organization_id);
create index if not exists idx_bpf_process_dependencies_hub on public.bpf_process_dependencies(hub_id);
create index if not exists idx_bpf_process_models_org on public.bpf_process_models(organization_id);
create index if not exists idx_bpf_process_models_hub on public.bpf_process_models(hub_id);
create index if not exists idx_bpf_process_steps_org on public.bpf_process_steps(organization_id);
create index if not exists idx_bpf_process_steps_hub on public.bpf_process_steps(hub_id);
create index if not exists idx_bpf_decision_points_org on public.bpf_decision_points(organization_id);
create index if not exists idx_bpf_decision_points_hub on public.bpf_decision_points(hub_id);
create index if not exists idx_bpf_reusable_blocks_org on public.bpf_reusable_blocks(organization_id);
create index if not exists idx_bpf_reusable_blocks_hub on public.bpf_reusable_blocks(hub_id);
create index if not exists idx_bpf_approval_rules_org on public.bpf_approval_rules(organization_id);
create index if not exists idx_bpf_approval_rules_hub on public.bpf_approval_rules(hub_id);
create index if not exists idx_bpf_sequential_approvals_org on public.bpf_sequential_approvals(organization_id);
create index if not exists idx_bpf_sequential_approvals_hub on public.bpf_sequential_approvals(hub_id);
create index if not exists idx_bpf_parallel_approvals_org on public.bpf_parallel_approvals(organization_id);
create index if not exists idx_bpf_parallel_approvals_hub on public.bpf_parallel_approvals(hub_id);
create index if not exists idx_bpf_escalation_rules_org on public.bpf_escalation_rules(organization_id);
create index if not exists idx_bpf_escalation_rules_hub on public.bpf_escalation_rules(hub_id);
create index if not exists idx_bpf_task_assignments_org on public.bpf_task_assignments(organization_id);
create index if not exists idx_bpf_task_assignments_hub on public.bpf_task_assignments(hub_id);
create index if not exists idx_bpf_task_templates_org on public.bpf_task_templates(organization_id);
create index if not exists idx_bpf_task_templates_hub on public.bpf_task_templates(hub_id);
create index if not exists idx_bpf_recurring_tasks_org on public.bpf_recurring_tasks(organization_id);
create index if not exists idx_bpf_recurring_tasks_hub on public.bpf_recurring_tasks(hub_id);
create index if not exists idx_bpf_task_sla_policies_org on public.bpf_task_sla_policies(organization_id);
create index if not exists idx_bpf_task_sla_policies_hub on public.bpf_task_sla_policies(hub_id);
create index if not exists idx_bpf_rule_conditions_org on public.bpf_rule_conditions(organization_id);
create index if not exists idx_bpf_rule_conditions_hub on public.bpf_rule_conditions(hub_id);
create index if not exists idx_bpf_rule_validations_org on public.bpf_rule_validations(organization_id);
create index if not exists idx_bpf_rule_validations_hub on public.bpf_rule_validations(hub_id);
create index if not exists idx_bpf_rule_calculations_org on public.bpf_rule_calculations(organization_id);
create index if not exists idx_bpf_rule_calculations_hub on public.bpf_rule_calculations(hub_id);
create index if not exists idx_bpf_reusable_rules_org on public.bpf_reusable_rules(organization_id);
create index if not exists idx_bpf_reusable_rules_hub on public.bpf_reusable_rules(hub_id);
create index if not exists idx_bpf_process_executions_org on public.bpf_process_executions(organization_id);
create index if not exists idx_bpf_process_executions_hub on public.bpf_process_executions(hub_id);
create index if not exists idx_bpf_execution_history_org on public.bpf_execution_history(organization_id);
create index if not exists idx_bpf_execution_history_hub on public.bpf_execution_history(hub_id);
create index if not exists idx_bpf_execution_retries_org on public.bpf_execution_retries(organization_id);
create index if not exists idx_bpf_execution_retries_hub on public.bpf_execution_retries(hub_id);
create index if not exists idx_bpf_execution_analytics_org on public.bpf_execution_analytics(organization_id);
create index if not exists idx_bpf_execution_analytics_hub on public.bpf_execution_analytics(hub_id);
create index if not exists idx_bpf_bottleneck_reports_org on public.bpf_bottleneck_reports(organization_id);
create index if not exists idx_bpf_bottleneck_reports_hub on public.bpf_bottleneck_reports(hub_id);
create index if not exists idx_bpf_sla_performance_metrics_org on public.bpf_sla_performance_metrics(organization_id);
create index if not exists idx_bpf_sla_performance_metrics_hub on public.bpf_sla_performance_metrics(hub_id);
create index if not exists idx_bpf_process_metrics_org on public.bpf_process_metrics(organization_id);
create index if not exists idx_bpf_process_health_org on public.bpf_process_health(organization_id);
create index if not exists idx_bpf_failed_process_records_org on public.bpf_failed_process_records(organization_id);
create index if not exists idx_bpf_failed_process_records_hub on public.bpf_failed_process_records(hub_id);
create index if not exists idx_bpf_process_failures_org on public.bpf_process_failures(organization_id);
create index if not exists idx_bpf_process_failures_hub on public.bpf_process_failures(hub_id);
create index if not exists idx_bpf_audit_logs_org on public.bpf_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'bpf_process_hubs','bpf_business_processes','bpf_process_categories','bpf_process_versions','bpf_process_dependencies','bpf_process_models','bpf_process_steps','bpf_decision_points','bpf_reusable_blocks','bpf_approval_rules','bpf_sequential_approvals','bpf_parallel_approvals','bpf_escalation_rules','bpf_task_assignments','bpf_task_templates','bpf_recurring_tasks','bpf_task_sla_policies','bpf_rule_conditions','bpf_rule_validations','bpf_rule_calculations','bpf_reusable_rules','bpf_process_executions','bpf_execution_history','bpf_execution_retries','bpf_execution_analytics','bpf_bottleneck_reports','bpf_sla_performance_metrics','bpf_process_metrics','bpf_process_health','bpf_failed_process_records','bpf_process_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.bpf_process_hubs enable row level security;
alter table public.bpf_business_processes enable row level security;
alter table public.bpf_process_categories enable row level security;
alter table public.bpf_process_versions enable row level security;
alter table public.bpf_process_dependencies enable row level security;
alter table public.bpf_process_models enable row level security;
alter table public.bpf_process_steps enable row level security;
alter table public.bpf_decision_points enable row level security;
alter table public.bpf_reusable_blocks enable row level security;
alter table public.bpf_approval_rules enable row level security;
alter table public.bpf_sequential_approvals enable row level security;
alter table public.bpf_parallel_approvals enable row level security;
alter table public.bpf_escalation_rules enable row level security;
alter table public.bpf_task_assignments enable row level security;
alter table public.bpf_task_templates enable row level security;
alter table public.bpf_recurring_tasks enable row level security;
alter table public.bpf_task_sla_policies enable row level security;
alter table public.bpf_rule_conditions enable row level security;
alter table public.bpf_rule_validations enable row level security;
alter table public.bpf_rule_calculations enable row level security;
alter table public.bpf_reusable_rules enable row level security;
alter table public.bpf_process_executions enable row level security;
alter table public.bpf_execution_history enable row level security;
alter table public.bpf_execution_retries enable row level security;
alter table public.bpf_execution_analytics enable row level security;
alter table public.bpf_bottleneck_reports enable row level security;
alter table public.bpf_sla_performance_metrics enable row level security;
alter table public.bpf_process_metrics enable row level security;
alter table public.bpf_process_health enable row level security;
alter table public.bpf_failed_process_records enable row level security;
alter table public.bpf_process_failures enable row level security;
alter table public.bpf_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'bpf_process_hubs','bpf_business_processes','bpf_process_categories','bpf_process_versions','bpf_process_dependencies','bpf_process_models','bpf_process_steps','bpf_decision_points','bpf_reusable_blocks','bpf_approval_rules','bpf_sequential_approvals','bpf_parallel_approvals','bpf_escalation_rules','bpf_task_assignments','bpf_task_templates','bpf_recurring_tasks','bpf_task_sla_policies','bpf_rule_conditions','bpf_rule_validations','bpf_rule_calculations','bpf_reusable_rules','bpf_process_executions','bpf_execution_history','bpf_execution_retries','bpf_execution_analytics','bpf_bottleneck_reports','bpf_sla_performance_metrics','bpf_process_metrics','bpf_process_health','bpf_failed_process_records','bpf_process_failures','bpf_audit_logs'
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
  ('bpf.view', 'View enterprise business process framework data', 'enterprise_business_process_framework'),
  ('bpf.manage', 'Manage process registry, designer, approvals, tasks, and framework outputs', 'enterprise_business_process_framework'),
  ('bpf.approve', 'Approve business process gates and escalation rules', 'enterprise_business_process_framework'),
  ('bpf.admin', 'Administer enterprise business process framework governance', 'enterprise_business_process_framework')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

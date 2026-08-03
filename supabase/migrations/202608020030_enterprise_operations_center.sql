-- V2 Program A Sprint 7: Enterprise Operations Center

-- OperationsCenter
create table if not exists public.eoc_operations_centers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_key text not null,
  center_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_key)
);

-- OverallHealth
create table if not exists public.eoc_overall_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  health_key text not null,
  health_type text not null default 'overall',
  health_score numeric(5, 2) not null default 100,
  last_check_at timestamptz not null default now(),
  check_details jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, health_key)
);

-- ModuleHealth
create table if not exists public.eoc_module_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  health_key text not null,
  module_name text not null default '',
  health_score numeric(5, 2) not null default 100,
  last_check_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, health_key)
);

-- DatabaseHealth
create table if not exists public.eoc_database_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  health_key text not null,
  connection_pool_used integer not null default 0,
  health_score numeric(5, 2) not null default 100,
  last_check_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, health_key)
);

-- JobScheduler
create table if not exists public.eoc_job_schedulers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  scheduler_key text not null,
  scheduler_name text not null,
  cron_expression text not null default '0 * * * *',
  worker_pool_size integer not null default 4,
  scheduler_status text not null default 'active',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, scheduler_key)
);

-- RecurringJob
create table if not exists public.eoc_recurring_jobs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  job_key text not null,
  job_name text not null,
  cron_expression text not null default '0 0 * * *',
  job_status text not null default 'active',
  last_run_at timestamptz,
  next_run_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, job_key)
);

-- JobRetryQueue
create table if not exists public.eoc_job_retry_queue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  queue_key text not null,
  job_ref text not null default '',
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  priority integer not null default 5,
  next_retry_at timestamptz,
  last_error text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, queue_key)
);

-- JobDeadLetter
create table if not exists public.eoc_job_dead_letter (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  dead_letter_key text not null,
  job_ref text not null default '',
  error_message text not null default '',
  dead_letter_status text not null default 'pending',
  failed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, dead_letter_key)
);

-- PlatformEvent
create table if not exists public.eoc_platform_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  event_key text not null,
  event_type text not null default 'platform',
  event_name text not null default '',
  payload jsonb not null default '{}'::jsonb,
  event_status text not null default 'published',
  published_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, event_key)
);

-- BusinessEvent
create table if not exists public.eoc_business_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  event_key text not null,
  event_type text not null default 'business',
  event_name text not null default '',
  payload jsonb not null default '{}'::jsonb,
  event_status text not null default 'published',
  published_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, event_key)
);

-- EventSubscription
create table if not exists public.eoc_event_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  subscription_key text not null,
  event_type text not null default 'platform',
  subscriber_ref text not null default '',
  delivery_mode text not null default 'push',
  subscription_status text not null default 'active',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, subscription_key)
);

-- EventReplay
create table if not exists public.eoc_event_replays (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  replay_key text not null,
  event_type text not null default 'platform',
  from_timestamp timestamptz not null default now(),
  to_timestamp timestamptz,
  replay_status text not null default 'pending',
  events_replayed integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, replay_key)
);

-- Alert
create table if not exists public.eoc_alerts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  alert_key text not null,
  alert_title text not null default '',
  alert_severity text not null default 'info',
  alert_message text not null default '',
  silenced boolean not null default false,
  alert_status text not null default 'open',
  triggered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, alert_key)
);

-- EscalationRule
create table if not exists public.eoc_escalation_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  rule_key text not null,
  rule_name text not null,
  alert_severity text not null default 'critical',
  escalation_delay_minutes integer not null default 15,
  notify_channels jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, rule_key)
);

-- AlertAcknowledgement
create table if not exists public.eoc_alert_acknowledgements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  ack_key text not null,
  alert_id uuid,
  acknowledged_by text not null default '',
  ack_note text not null default '',
  ack_status text not null default 'acknowledged',
  acknowledged_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, ack_key)
);

-- MaintenanceWindow
create table if not exists public.eoc_maintenance_windows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  window_key text not null,
  window_name text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  suppress_alerts boolean not null default true,
  window_status text not null default 'scheduled',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, window_key)
);

-- GlobalFlag
create table if not exists public.eoc_global_flags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  flag_key text not null,
  flag_name text not null,
  enabled boolean not null default false,
  kill_switch boolean not null default false,
  rollout_percent integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, flag_key)
);

-- TenantFlag
create table if not exists public.eoc_tenant_flags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  flag_key text not null,
  flag_name text not null,
  enabled boolean not null default false,
  tenant_ref text not null default '',
  rollout_percent integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, flag_key)
);

-- BetaFeature
create table if not exists public.eoc_beta_features (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  feature_key text not null,
  feature_name text not null,
  beta_status text not null default 'beta',
  enrolled_tenants integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, feature_key)
);

-- RolloutConfig
create table if not exists public.eoc_rollout_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  rollout_key text not null,
  flag_key text not null default '',
  rollout_percent integer not null default 0,
  target_criteria jsonb not null default '{}'::jsonb,
  rollout_status text not null default 'active',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, rollout_key)
);

-- PlatformConfig
create table if not exists public.eoc_platform_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  config_key text not null,
  config_name text not null,
  config_value jsonb not null default '{}'::jsonb,
  environment_profile text not null default 'production',
  approval_status text not null default 'approved',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, config_key)
);

-- TenantConfig
create table if not exists public.eoc_tenant_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  config_key text not null,
  config_name text not null,
  config_value jsonb not null default '{}'::jsonb,
  tenant_ref text not null default '',
  approval_status text not null default 'pending',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, config_key)
);

-- SecretsMetadata
create table if not exists public.eoc_secrets_metadata (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  secret_key text not null,
  secret_name text not null,
  vault_ref text not null default '',
  rotation_due_at timestamptz,
  secret_status text not null default 'active',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, secret_key)
);

-- ConfigVersion
create table if not exists public.eoc_config_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  version_key text not null,
  version_number text not null default '1.0.0',
  config_snapshot jsonb not null default '{}'::jsonb,
  approved_by text not null default '',
  version_status text not null default 'draft',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, version_key)
);

-- PlatformLog
create table if not exists public.eoc_platform_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  log_key text not null,
  log_level text not null default 'info',
  service_name text not null default '',
  message text not null default '',
  logged_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, log_key)
);

-- PlatformMetric
create table if not exists public.eoc_platform_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  dependency_health numeric(5, 2) not null default 100,
  cpu_percent numeric(5, 2) not null default 0,
  memory_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, metrics_key)
);

-- TraceSummary
create table if not exists public.eoc_trace_summaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  trace_key text not null,
  trace_id text not null default '',
  span_count integer not null default 0,
  duration_ms integer not null default 0,
  traced_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, trace_key)
);

-- ServiceRegistry
create table if not exists public.eoc_service_registry (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  service_key text not null,
  service_name text not null,
  service_url text not null default '',
  cache_status text not null default 'healthy',
  last_heartbeat_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, service_key)
);

-- OperationsMetric
create table if not exists public.eoc_operations_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  operational_score numeric(5, 2) not null default 100,
  active_jobs integer not null default 0,
  open_alerts integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- OperationsHealth
create table if not exists public.eoc_operations_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  uptime_percent numeric(5, 2) not null default 99.9,
  disaster_recovery_mode boolean not null default false,
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- OperationsFailure
create table if not exists public.eoc_operations_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  center_id uuid not null references public.eoc_operations_centers(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'system',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, center_id, failure_key)
);

-- Audit Logs
create table if not exists public.eoc_audit_logs (
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

create index if not exists idx_eoc_operations_centers_org on public.eoc_operations_centers(organization_id);
create index if not exists idx_eoc_overall_health_org on public.eoc_overall_health(organization_id);
create index if not exists idx_eoc_overall_health_center on public.eoc_overall_health(center_id);
create index if not exists idx_eoc_module_health_org on public.eoc_module_health(organization_id);
create index if not exists idx_eoc_module_health_center on public.eoc_module_health(center_id);
create index if not exists idx_eoc_database_health_org on public.eoc_database_health(organization_id);
create index if not exists idx_eoc_database_health_center on public.eoc_database_health(center_id);
create index if not exists idx_eoc_job_schedulers_org on public.eoc_job_schedulers(organization_id);
create index if not exists idx_eoc_job_schedulers_center on public.eoc_job_schedulers(center_id);
create index if not exists idx_eoc_recurring_jobs_org on public.eoc_recurring_jobs(organization_id);
create index if not exists idx_eoc_recurring_jobs_center on public.eoc_recurring_jobs(center_id);
create index if not exists idx_eoc_job_retry_queue_org on public.eoc_job_retry_queue(organization_id);
create index if not exists idx_eoc_job_retry_queue_center on public.eoc_job_retry_queue(center_id);
create index if not exists idx_eoc_job_dead_letter_org on public.eoc_job_dead_letter(organization_id);
create index if not exists idx_eoc_job_dead_letter_center on public.eoc_job_dead_letter(center_id);
create index if not exists idx_eoc_platform_events_org on public.eoc_platform_events(organization_id);
create index if not exists idx_eoc_platform_events_center on public.eoc_platform_events(center_id);
create index if not exists idx_eoc_business_events_org on public.eoc_business_events(organization_id);
create index if not exists idx_eoc_business_events_center on public.eoc_business_events(center_id);
create index if not exists idx_eoc_event_subscriptions_org on public.eoc_event_subscriptions(organization_id);
create index if not exists idx_eoc_event_subscriptions_center on public.eoc_event_subscriptions(center_id);
create index if not exists idx_eoc_event_replays_org on public.eoc_event_replays(organization_id);
create index if not exists idx_eoc_event_replays_center on public.eoc_event_replays(center_id);
create index if not exists idx_eoc_alerts_org on public.eoc_alerts(organization_id);
create index if not exists idx_eoc_alerts_center on public.eoc_alerts(center_id);
create index if not exists idx_eoc_escalation_rules_org on public.eoc_escalation_rules(organization_id);
create index if not exists idx_eoc_escalation_rules_center on public.eoc_escalation_rules(center_id);
create index if not exists idx_eoc_alert_acknowledgements_org on public.eoc_alert_acknowledgements(organization_id);
create index if not exists idx_eoc_alert_acknowledgements_center on public.eoc_alert_acknowledgements(center_id);
create index if not exists idx_eoc_maintenance_windows_org on public.eoc_maintenance_windows(organization_id);
create index if not exists idx_eoc_maintenance_windows_center on public.eoc_maintenance_windows(center_id);
create index if not exists idx_eoc_global_flags_org on public.eoc_global_flags(organization_id);
create index if not exists idx_eoc_global_flags_center on public.eoc_global_flags(center_id);
create index if not exists idx_eoc_tenant_flags_org on public.eoc_tenant_flags(organization_id);
create index if not exists idx_eoc_tenant_flags_center on public.eoc_tenant_flags(center_id);
create index if not exists idx_eoc_beta_features_org on public.eoc_beta_features(organization_id);
create index if not exists idx_eoc_beta_features_center on public.eoc_beta_features(center_id);
create index if not exists idx_eoc_rollout_configs_org on public.eoc_rollout_configs(organization_id);
create index if not exists idx_eoc_rollout_configs_center on public.eoc_rollout_configs(center_id);
create index if not exists idx_eoc_platform_configs_org on public.eoc_platform_configs(organization_id);
create index if not exists idx_eoc_platform_configs_center on public.eoc_platform_configs(center_id);
create index if not exists idx_eoc_tenant_configs_org on public.eoc_tenant_configs(organization_id);
create index if not exists idx_eoc_tenant_configs_center on public.eoc_tenant_configs(center_id);
create index if not exists idx_eoc_secrets_metadata_org on public.eoc_secrets_metadata(organization_id);
create index if not exists idx_eoc_secrets_metadata_center on public.eoc_secrets_metadata(center_id);
create index if not exists idx_eoc_config_versions_org on public.eoc_config_versions(organization_id);
create index if not exists idx_eoc_config_versions_center on public.eoc_config_versions(center_id);
create index if not exists idx_eoc_platform_logs_org on public.eoc_platform_logs(organization_id);
create index if not exists idx_eoc_platform_logs_center on public.eoc_platform_logs(center_id);
create index if not exists idx_eoc_platform_metrics_org on public.eoc_platform_metrics(organization_id);
create index if not exists idx_eoc_platform_metrics_center on public.eoc_platform_metrics(center_id);
create index if not exists idx_eoc_trace_summaries_org on public.eoc_trace_summaries(organization_id);
create index if not exists idx_eoc_trace_summaries_center on public.eoc_trace_summaries(center_id);
create index if not exists idx_eoc_service_registry_org on public.eoc_service_registry(organization_id);
create index if not exists idx_eoc_service_registry_center on public.eoc_service_registry(center_id);
create index if not exists idx_eoc_operations_metrics_org on public.eoc_operations_metrics(organization_id);
create index if not exists idx_eoc_operations_health_org on public.eoc_operations_health(organization_id);
create index if not exists idx_eoc_operations_failures_org on public.eoc_operations_failures(organization_id);
create index if not exists idx_eoc_operations_failures_center on public.eoc_operations_failures(center_id);
create index if not exists idx_eoc_audit_logs_org on public.eoc_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'eoc_operations_centers','eoc_overall_health','eoc_module_health','eoc_database_health','eoc_job_schedulers','eoc_recurring_jobs','eoc_job_retry_queue','eoc_job_dead_letter','eoc_platform_events','eoc_business_events','eoc_event_subscriptions','eoc_event_replays','eoc_alerts','eoc_escalation_rules','eoc_alert_acknowledgements','eoc_maintenance_windows','eoc_global_flags','eoc_tenant_flags','eoc_beta_features','eoc_rollout_configs','eoc_platform_configs','eoc_tenant_configs','eoc_secrets_metadata','eoc_config_versions','eoc_platform_logs','eoc_platform_metrics','eoc_trace_summaries','eoc_service_registry','eoc_operations_metrics','eoc_operations_health','eoc_operations_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.eoc_operations_centers enable row level security;
alter table public.eoc_overall_health enable row level security;
alter table public.eoc_module_health enable row level security;
alter table public.eoc_database_health enable row level security;
alter table public.eoc_job_schedulers enable row level security;
alter table public.eoc_recurring_jobs enable row level security;
alter table public.eoc_job_retry_queue enable row level security;
alter table public.eoc_job_dead_letter enable row level security;
alter table public.eoc_platform_events enable row level security;
alter table public.eoc_business_events enable row level security;
alter table public.eoc_event_subscriptions enable row level security;
alter table public.eoc_event_replays enable row level security;
alter table public.eoc_alerts enable row level security;
alter table public.eoc_escalation_rules enable row level security;
alter table public.eoc_alert_acknowledgements enable row level security;
alter table public.eoc_maintenance_windows enable row level security;
alter table public.eoc_global_flags enable row level security;
alter table public.eoc_tenant_flags enable row level security;
alter table public.eoc_beta_features enable row level security;
alter table public.eoc_rollout_configs enable row level security;
alter table public.eoc_platform_configs enable row level security;
alter table public.eoc_tenant_configs enable row level security;
alter table public.eoc_secrets_metadata enable row level security;
alter table public.eoc_config_versions enable row level security;
alter table public.eoc_platform_logs enable row level security;
alter table public.eoc_platform_metrics enable row level security;
alter table public.eoc_trace_summaries enable row level security;
alter table public.eoc_service_registry enable row level security;
alter table public.eoc_operations_metrics enable row level security;
alter table public.eoc_operations_health enable row level security;
alter table public.eoc_operations_failures enable row level security;
alter table public.eoc_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'eoc_operations_centers','eoc_overall_health','eoc_module_health','eoc_database_health','eoc_job_schedulers','eoc_recurring_jobs','eoc_job_retry_queue','eoc_job_dead_letter','eoc_platform_events','eoc_business_events','eoc_event_subscriptions','eoc_event_replays','eoc_alerts','eoc_escalation_rules','eoc_alert_acknowledgements','eoc_maintenance_windows','eoc_global_flags','eoc_tenant_flags','eoc_beta_features','eoc_rollout_configs','eoc_platform_configs','eoc_tenant_configs','eoc_secrets_metadata','eoc_config_versions','eoc_platform_logs','eoc_platform_metrics','eoc_trace_summaries','eoc_service_registry','eoc_operations_metrics','eoc_operations_health','eoc_operations_failures','eoc_audit_logs'
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
  ('eoc.view', 'View enterprise operations center data', 'enterprise_operations_center'),
  ('eoc.manage', 'Manage background jobs, events, alerts, and platform configuration', 'enterprise_operations_center'),
  ('eoc.approve', 'Approve configuration changes and maintenance windows', 'enterprise_operations_center'),
  ('eoc.admin', 'Administer enterprise operations center governance', 'enterprise_operations_center')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

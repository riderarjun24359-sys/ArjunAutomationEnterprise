-- V2 Program A Sprint 9: Enterprise Launch Readiness Platform

-- ReadinessHub
create table if not exists public.elr_readiness_hubs (
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

-- EnvironmentValidation
create table if not exists public.elr_environment_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  validation_key text not null,
  validation_type text not null default 'infrastructure',
  validation_score numeric(5, 2) not null default 0,
  validation_summary text not null default '',
  validated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- ConfigurationValidation
create table if not exists public.elr_configuration_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  validation_key text not null,
  config_type text not null default 'application',
  validation_score numeric(5, 2) not null default 0,
  config_ref text not null default '',
  validated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- SecretsValidation
create table if not exists public.elr_secrets_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  validation_key text not null,
  secret_type text not null default 'api_key',
  validation_score numeric(5, 2) not null default 0,
  secret_ref text not null default '',
  validated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- DeploymentPlan
create table if not exists public.elr_deployment_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  plan_key text not null,
  plan_name text not null default '',
  target_version text not null default '',
  deployment_strategy text not null default 'rolling',
  scheduled_at timestamptz,
  approved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, plan_key)
);

-- RollbackPlan
create table if not exists public.elr_rollback_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  plan_key text not null,
  rollback_version text not null default '',
  rollback_reason text not null default '',
  trigger_condition text not null default '',
  prepared_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, plan_key)
);

-- VersionRegistry
create table if not exists public.elr_version_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  artifact_ref text not null default '',
  registered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- ReleaseNote
create table if not exists public.elr_release_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  note_key text not null,
  version_ref text not null default '',
  note_summary text not null default '',
  change_log jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, note_key)
);

-- BackupPolicy
create table if not exists public.elr_backup_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  policy_key text not null,
  policy_name text not null default '',
  retention_days integer not null default 30,
  backup_frequency text not null default 'daily',
  storage_target text not null default 'primary',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, policy_key)
);

-- BackupVerification
create table if not exists public.elr_backup_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  verification_key text not null,
  backup_ref text not null default '',
  verification_score numeric(5, 2) not null default 0,
  verification_summary text not null default '',
  verified_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, verification_key)
);

-- RestoreVerification
create table if not exists public.elr_restore_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  verification_key text not null,
  restore_ref text not null default '',
  verification_score numeric(5, 2) not null default 0,
  verification_summary text not null default '',
  verified_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, verification_key)
);

-- RecoveryDrill
create table if not exists public.elr_recovery_drills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  drill_key text not null,
  drill_type text not null default 'failover',
  drill_score numeric(5, 2) not null default 0,
  drill_summary text not null default '',
  completed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, drill_key)
);

-- ObservabilityLog
create table if not exists public.elr_observability_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  log_key text not null,
  log_level text not null default 'info',
  log_source text not null default '',
  log_message text not null default '',
  logged_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, log_key)
);

-- ObservabilityMetric
create table if not exists public.elr_observability_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  metric_key text not null,
  metric_name text not null default '',
  metric_value numeric(14, 4) not null default 0,
  metric_unit text not null default '',
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metric_key)
);

-- TraceRecord
create table if not exists public.elr_trace_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  trace_key text not null,
  trace_name text not null default '',
  latency_ms numeric(10, 2) not null default 0,
  span_count integer not null default 0,
  traced_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trace_key)
);

-- SlaMonitor
create table if not exists public.elr_sla_monitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  monitor_key text not null,
  sla_target numeric(5, 2) not null default 99.9,
  current_value numeric(5, 2) not null default 100,
  service_ref text not null default '',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, monitor_key)
);

-- SecurityChecklist
create table if not exists public.elr_security_checklists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  checklist_key text not null,
  checklist_name text not null default '',
  completion_score numeric(5, 2) not null default 0,
  checklist_items jsonb not null default '[]'::jsonb,
  reviewed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, checklist_key)
);

-- VulnerabilityReview
create table if not exists public.elr_vulnerability_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  review_key text not null,
  vulnerability_ref text not null default '',
  severity text not null default 'info',
  review_summary text not null default '',
  reviewed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- PermissionAudit
create table if not exists public.elr_permission_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  audit_key text not null,
  audit_scope text not null default 'platform',
  finding_count integer not null default 0,
  audit_summary text not null default '',
  audited_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, audit_key)
);

-- ComplianceReview
create table if not exists public.elr_compliance_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  review_key text not null,
  compliance_type text not null default 'soc2',
  review_score numeric(5, 2) not null default 0,
  review_summary text not null default '',
  reviewed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- AdminGuide
create table if not exists public.elr_admin_guides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  guide_key text not null,
  guide_title text not null default '',
  guide_version text not null default '1.0',
  guide_content text not null default '',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, guide_key)
);

-- UserGuide
create table if not exists public.elr_user_guides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  guide_key text not null,
  guide_title text not null default '',
  guide_version text not null default '1.0',
  guide_content text not null default '',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, guide_key)
);

-- DeploymentGuide
create table if not exists public.elr_deployment_guides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  guide_key text not null,
  guide_title text not null default '',
  guide_version text not null default '1.0',
  guide_content text not null default '',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, guide_key)
);

-- LaunchScoreMetric
create table if not exists public.elr_launch_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  security_score numeric(5, 2) not null default 100,
  reliability_score numeric(5, 2) not null default 100,
  performance_score numeric(5, 2) not null default 100,
  documentation_score numeric(5, 2) not null default 100,
  operational_score numeric(5, 2) not null default 100,
  overall_launch_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- ReadinessValidation
create table if not exists public.elr_readiness_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  validation_key text not null,
  validation_type text not null default 'launch_gate',
  validation_score numeric(5, 2) not null default 0,
  validation_summary text not null default '',
  validated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- LaunchBlocker
create table if not exists public.elr_launch_blockers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  blocker_key text not null,
  blocker_title text not null default '',
  blocker_severity text not null default 'warning',
  blocker_summary text not null default '',
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, blocker_key)
);

-- ScoreSnapshot
create table if not exists public.elr_score_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  overall_launch_score numeric(5, 2) not null default 0,
  score_breakdown jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, snapshot_key)
);

-- LaunchHealth
create table if not exists public.elr_launch_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  deployment_status text not null default 'ready',
  backup_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- CriticalIssue
create table if not exists public.elr_critical_issues (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  issue_key text not null,
  issue_title text not null default '',
  issue_severity text not null default 'critical',
  issue_summary text not null default '',
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, issue_key)
);

-- ReadinessWarning
create table if not exists public.elr_readiness_warnings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
  warning_key text not null,
  warning_type text not null default 'operational',
  warning_message text not null default '',
  due_date date,
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, warning_key)
);

-- LaunchFailure
create table if not exists public.elr_launch_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elr_readiness_hubs(id) on delete cascade,
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
create table if not exists public.elr_audit_logs (
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

create index if not exists idx_elr_readiness_hubs_org on public.elr_readiness_hubs(organization_id);
create index if not exists idx_elr_environment_validations_org on public.elr_environment_validations(organization_id);
create index if not exists idx_elr_environment_validations_hub on public.elr_environment_validations(hub_id);
create index if not exists idx_elr_configuration_validations_org on public.elr_configuration_validations(organization_id);
create index if not exists idx_elr_configuration_validations_hub on public.elr_configuration_validations(hub_id);
create index if not exists idx_elr_secrets_validations_org on public.elr_secrets_validations(organization_id);
create index if not exists idx_elr_secrets_validations_hub on public.elr_secrets_validations(hub_id);
create index if not exists idx_elr_deployment_plans_org on public.elr_deployment_plans(organization_id);
create index if not exists idx_elr_deployment_plans_hub on public.elr_deployment_plans(hub_id);
create index if not exists idx_elr_rollback_plans_org on public.elr_rollback_plans(organization_id);
create index if not exists idx_elr_rollback_plans_hub on public.elr_rollback_plans(hub_id);
create index if not exists idx_elr_version_registry_org on public.elr_version_registry(organization_id);
create index if not exists idx_elr_version_registry_hub on public.elr_version_registry(hub_id);
create index if not exists idx_elr_release_notes_org on public.elr_release_notes(organization_id);
create index if not exists idx_elr_release_notes_hub on public.elr_release_notes(hub_id);
create index if not exists idx_elr_backup_policies_org on public.elr_backup_policies(organization_id);
create index if not exists idx_elr_backup_policies_hub on public.elr_backup_policies(hub_id);
create index if not exists idx_elr_backup_verifications_org on public.elr_backup_verifications(organization_id);
create index if not exists idx_elr_backup_verifications_hub on public.elr_backup_verifications(hub_id);
create index if not exists idx_elr_restore_verifications_org on public.elr_restore_verifications(organization_id);
create index if not exists idx_elr_restore_verifications_hub on public.elr_restore_verifications(hub_id);
create index if not exists idx_elr_recovery_drills_org on public.elr_recovery_drills(organization_id);
create index if not exists idx_elr_recovery_drills_hub on public.elr_recovery_drills(hub_id);
create index if not exists idx_elr_observability_logs_org on public.elr_observability_logs(organization_id);
create index if not exists idx_elr_observability_logs_hub on public.elr_observability_logs(hub_id);
create index if not exists idx_elr_observability_metrics_org on public.elr_observability_metrics(organization_id);
create index if not exists idx_elr_observability_metrics_hub on public.elr_observability_metrics(hub_id);
create index if not exists idx_elr_trace_records_org on public.elr_trace_records(organization_id);
create index if not exists idx_elr_trace_records_hub on public.elr_trace_records(hub_id);
create index if not exists idx_elr_sla_monitors_org on public.elr_sla_monitors(organization_id);
create index if not exists idx_elr_sla_monitors_hub on public.elr_sla_monitors(hub_id);
create index if not exists idx_elr_security_checklists_org on public.elr_security_checklists(organization_id);
create index if not exists idx_elr_security_checklists_hub on public.elr_security_checklists(hub_id);
create index if not exists idx_elr_vulnerability_reviews_org on public.elr_vulnerability_reviews(organization_id);
create index if not exists idx_elr_vulnerability_reviews_hub on public.elr_vulnerability_reviews(hub_id);
create index if not exists idx_elr_permission_audits_org on public.elr_permission_audits(organization_id);
create index if not exists idx_elr_permission_audits_hub on public.elr_permission_audits(hub_id);
create index if not exists idx_elr_compliance_reviews_org on public.elr_compliance_reviews(organization_id);
create index if not exists idx_elr_compliance_reviews_hub on public.elr_compliance_reviews(hub_id);
create index if not exists idx_elr_admin_guides_org on public.elr_admin_guides(organization_id);
create index if not exists idx_elr_admin_guides_hub on public.elr_admin_guides(hub_id);
create index if not exists idx_elr_user_guides_org on public.elr_user_guides(organization_id);
create index if not exists idx_elr_user_guides_hub on public.elr_user_guides(hub_id);
create index if not exists idx_elr_deployment_guides_org on public.elr_deployment_guides(organization_id);
create index if not exists idx_elr_deployment_guides_hub on public.elr_deployment_guides(hub_id);
create index if not exists idx_elr_launch_scores_org on public.elr_launch_scores(organization_id);
create index if not exists idx_elr_readiness_validations_org on public.elr_readiness_validations(organization_id);
create index if not exists idx_elr_readiness_validations_hub on public.elr_readiness_validations(hub_id);
create index if not exists idx_elr_launch_blockers_org on public.elr_launch_blockers(organization_id);
create index if not exists idx_elr_launch_blockers_hub on public.elr_launch_blockers(hub_id);
create index if not exists idx_elr_score_snapshots_org on public.elr_score_snapshots(organization_id);
create index if not exists idx_elr_score_snapshots_hub on public.elr_score_snapshots(hub_id);
create index if not exists idx_elr_launch_health_org on public.elr_launch_health(organization_id);
create index if not exists idx_elr_critical_issues_org on public.elr_critical_issues(organization_id);
create index if not exists idx_elr_critical_issues_hub on public.elr_critical_issues(hub_id);
create index if not exists idx_elr_readiness_warnings_org on public.elr_readiness_warnings(organization_id);
create index if not exists idx_elr_readiness_warnings_hub on public.elr_readiness_warnings(hub_id);
create index if not exists idx_elr_launch_failures_org on public.elr_launch_failures(organization_id);
create index if not exists idx_elr_launch_failures_hub on public.elr_launch_failures(hub_id);
create index if not exists idx_elr_audit_logs_org on public.elr_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'elr_readiness_hubs','elr_environment_validations','elr_configuration_validations','elr_secrets_validations','elr_deployment_plans','elr_rollback_plans','elr_version_registry','elr_release_notes','elr_backup_policies','elr_backup_verifications','elr_restore_verifications','elr_recovery_drills','elr_observability_logs','elr_observability_metrics','elr_trace_records','elr_sla_monitors','elr_security_checklists','elr_vulnerability_reviews','elr_permission_audits','elr_compliance_reviews','elr_admin_guides','elr_user_guides','elr_deployment_guides','elr_launch_scores','elr_readiness_validations','elr_launch_blockers','elr_score_snapshots','elr_launch_health','elr_critical_issues','elr_readiness_warnings','elr_launch_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.elr_readiness_hubs enable row level security;
alter table public.elr_environment_validations enable row level security;
alter table public.elr_configuration_validations enable row level security;
alter table public.elr_secrets_validations enable row level security;
alter table public.elr_deployment_plans enable row level security;
alter table public.elr_rollback_plans enable row level security;
alter table public.elr_version_registry enable row level security;
alter table public.elr_release_notes enable row level security;
alter table public.elr_backup_policies enable row level security;
alter table public.elr_backup_verifications enable row level security;
alter table public.elr_restore_verifications enable row level security;
alter table public.elr_recovery_drills enable row level security;
alter table public.elr_observability_logs enable row level security;
alter table public.elr_observability_metrics enable row level security;
alter table public.elr_trace_records enable row level security;
alter table public.elr_sla_monitors enable row level security;
alter table public.elr_security_checklists enable row level security;
alter table public.elr_vulnerability_reviews enable row level security;
alter table public.elr_permission_audits enable row level security;
alter table public.elr_compliance_reviews enable row level security;
alter table public.elr_admin_guides enable row level security;
alter table public.elr_user_guides enable row level security;
alter table public.elr_deployment_guides enable row level security;
alter table public.elr_launch_scores enable row level security;
alter table public.elr_readiness_validations enable row level security;
alter table public.elr_launch_blockers enable row level security;
alter table public.elr_score_snapshots enable row level security;
alter table public.elr_launch_health enable row level security;
alter table public.elr_critical_issues enable row level security;
alter table public.elr_readiness_warnings enable row level security;
alter table public.elr_launch_failures enable row level security;
alter table public.elr_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'elr_readiness_hubs','elr_environment_validations','elr_configuration_validations','elr_secrets_validations','elr_deployment_plans','elr_rollback_plans','elr_version_registry','elr_release_notes','elr_backup_policies','elr_backup_verifications','elr_restore_verifications','elr_recovery_drills','elr_observability_logs','elr_observability_metrics','elr_trace_records','elr_sla_monitors','elr_security_checklists','elr_vulnerability_reviews','elr_permission_audits','elr_compliance_reviews','elr_admin_guides','elr_user_guides','elr_deployment_guides','elr_launch_scores','elr_readiness_validations','elr_launch_blockers','elr_score_snapshots','elr_launch_health','elr_critical_issues','elr_readiness_warnings','elr_launch_failures','elr_audit_logs'
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
  ('elr.view', 'View enterprise launch readiness platform data', 'enterprise_launch_readiness_platform'),
  ('elr.manage', 'Manage launch readiness validations, deployments, and readiness outputs', 'enterprise_launch_readiness_platform'),
  ('elr.approve', 'Approve launch readiness gates and deployment actions', 'enterprise_launch_readiness_platform'),
  ('elr.admin', 'Administer enterprise launch readiness platform governance', 'enterprise_launch_readiness_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

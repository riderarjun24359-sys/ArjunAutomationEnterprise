-- V2 Launch Ready to Customer Operated Platform

-- OperatedHub
create table if not exists public.cop_operated_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  operated_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- SignupFlow
create table if not exists public.cop_signup_flows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  flow_key text not null,
  flow_name text not null default '',
  flow_status text not null default 'active',
  signup_type text not null default 'self_service',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, flow_key)
);

-- OrgProvisioning
create table if not exists public.cop_org_provisioning (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  provision_key text not null,
  provision_name text not null default '',
  provision_status text not null default 'pending',
  org_ref text not null default '',
  provisioned_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, provision_key)
);

-- DomainOnboarding
create table if not exists public.cop_domain_onboarding (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  domain_key text not null,
  domain_name text not null default '',
  domain_status text not null default 'pending',
  verification_method text not null default 'dns',
  verified_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, domain_key)
);

-- EmailVerification
create table if not exists public.cop_email_verifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  verification_key text not null,
  email_address text not null default '',
  verification_status text not null default 'pending',
  sent_at timestamptz not null default now(),
  verified_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, verification_key)
);

-- OnboardingWizard
create table if not exists public.cop_onboarding_wizards (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  wizard_key text not null,
  wizard_name text not null default '',
  wizard_status text not null default 'active',
  step_count integer not null default 0,
  completion_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, wizard_key)
);

-- ProductionProfile
create table if not exists public.cop_production_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_status text not null default 'active',
  environment text not null default 'production',
  region text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- DeploymentJob
create table if not exists public.cop_deployment_jobs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  job_key text not null,
  job_name text not null default '',
  job_status text not null default 'pending',
  target_version text not null default '',
  started_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, job_key)
);

-- HealthValidation
create table if not exists public.cop_health_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  validation_key text not null,
  validation_name text not null default '',
  validation_status text not null default 'pending',
  health_score numeric(5, 2) not null default 100,
  validated_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- RollbackAutomation
create table if not exists public.cop_rollback_automations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  rollback_key text not null,
  rollback_name text not null default '',
  rollback_status text not null default 'ready',
  from_version text not null default '',
  to_version text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rollback_key)
);

-- DeploymentAudit
create table if not exists public.cop_deployment_audits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  audit_key text not null,
  audit_name text not null default '',
  audit_status text not null default 'pending',
  deployment_ref text not null default '',
  audited_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, audit_key)
);

-- CentralLog
create table if not exists public.cop_central_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  log_key text not null,
  log_source text not null default '',
  log_level text not null default 'info',
  log_message text not null default '',
  logged_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, log_key)
);

-- MetricsCollector
create table if not exists public.cop_metrics_collectors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  collector_key text not null,
  collector_name text not null default '',
  collector_status text not null default 'active',
  metric_type text not null default 'counter',
  last_scraped_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, collector_key)
);

-- DistributedTrace
create table if not exists public.cop_distributed_traces (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  trace_key text not null,
  trace_name text not null default '',
  trace_status text not null default 'active',
  span_count integer not null default 0,
  duration_ms integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trace_key)
);

-- AlertRule
create table if not exists public.cop_alert_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  severity text not null default 'warning',
  threshold_value numeric(12, 2) not null default 0,
  rule_type text not null default 'threshold',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- IncidentTimeline
create table if not exists public.cop_incident_timelines (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  incident_key text not null,
  incident_title text not null default '',
  incident_status text not null default 'open',
  severity text not null default 'medium',
  opened_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, incident_key)
);

-- BackupScheduler
create table if not exists public.cop_backup_schedulers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  schedule_key text not null,
  schedule_name text not null default '',
  schedule_status text not null default 'active',
  cron_expression text not null default '0 2 * * *',
  retention_days integer not null default 30,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, schedule_key)
);

-- RestoreValidation
create table if not exists public.cop_restore_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  restore_key text not null,
  restore_name text not null default '',
  restore_status text not null default 'pending',
  backup_ref text not null default '',
  validated_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, restore_key)
);

-- MaintenanceMode
create table if not exists public.cop_maintenance_modes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  maintenance_key text not null,
  maintenance_name text not null default '',
  maintenance_status text not null default 'scheduled',
  starts_at timestamptz,
  ends_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, maintenance_key)
);

-- FeatureFlagOp
create table if not exists public.cop_feature_flag_ops (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  flag_key text not null,
  flag_name text not null default '',
  flag_status text not null default 'disabled',
  rollout_percent numeric(5, 2) not null default 0,
  flag_type text not null default 'boolean',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, flag_key)
);

-- PlatformDiagnostic
create table if not exists public.cop_platform_diagnostics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  diagnostic_key text not null,
  diagnostic_name text not null default '',
  diagnostic_status text not null default 'pending',
  diagnostic_type text not null default 'health_check',
  ran_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, diagnostic_key)
);

-- BetaOrganization
create table if not exists public.cop_beta_organizations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  org_key text not null,
  org_name text not null default '',
  beta_status text not null default 'invited',
  cohort_ref text not null default '',
  enrolled_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, org_key)
);

-- BetaInvitation
create table if not exists public.cop_beta_invitations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  invitation_key text not null,
  invitee_email text not null default '',
  invitation_status text not null default 'pending',
  cohort_ref text not null default '',
  sent_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, invitation_key)
);

-- FeedbackCollection
create table if not exists public.cop_feedback_collection (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  feedback_key text not null,
  feedback_title text not null default '',
  feedback_type text not null default 'general',
  rating numeric(3, 1) not null default 0,
  collected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, feedback_key)
);

-- FeatureRequest
create table if not exists public.cop_feature_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  request_key text not null,
  request_title text not null default '',
  request_status text not null default 'submitted',
  priority text not null default 'normal',
  submitted_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, request_key)
);

-- BugReport
create table if not exists public.cop_bug_reports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  bug_key text not null,
  bug_title text not null default '',
  bug_status text not null default 'open',
  severity text not null default 'medium',
  reported_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, bug_key)
);

-- ReleaseChannel
create table if not exists public.cop_release_channels (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  channel_key text not null,
  channel_name text not null default '',
  channel_status text not null default 'active',
  release_version text not null default '1.0.0',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, channel_key)
);

-- OperatedMetric
create table if not exists public.cop_operated_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  production_status_score numeric(5, 2) not null default 100,
  onboarding_completion_rate numeric(5, 2) not null default 0,
  revenue_today numeric(12, 2) not null default 0,
  active_incident_count integer not null default 0,
  pending_approval_count integer not null default 0,
  platform_availability_score numeric(5, 2) not null default 100,
  customer_satisfaction_score numeric(5, 2) not null default 100,
  overall_operated_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- OperatedHealth
create table if not exists public.cop_operated_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  production_status text not null default 'healthy',
  onboarding_status text not null default 'healthy',
  observability_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveBriefing
create table if not exists public.cop_executive_briefings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null default '',
  briefing_type text not null default 'daily',
  briefing_date date not null default current_date,
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, briefing_key)
);

-- PlatformFailure
create table if not exists public.cop_platform_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cop_operated_hubs(id) on delete cascade,
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
create table if not exists public.cop_audit_logs (
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

create index if not exists idx_cop_operated_hubs_org on public.cop_operated_hubs(organization_id);
create index if not exists idx_cop_signup_flows_org on public.cop_signup_flows(organization_id);
create index if not exists idx_cop_signup_flows_hub on public.cop_signup_flows(hub_id);
create index if not exists idx_cop_org_provisioning_org on public.cop_org_provisioning(organization_id);
create index if not exists idx_cop_org_provisioning_hub on public.cop_org_provisioning(hub_id);
create index if not exists idx_cop_domain_onboarding_org on public.cop_domain_onboarding(organization_id);
create index if not exists idx_cop_domain_onboarding_hub on public.cop_domain_onboarding(hub_id);
create index if not exists idx_cop_email_verifications_org on public.cop_email_verifications(organization_id);
create index if not exists idx_cop_email_verifications_hub on public.cop_email_verifications(hub_id);
create index if not exists idx_cop_onboarding_wizards_org on public.cop_onboarding_wizards(organization_id);
create index if not exists idx_cop_onboarding_wizards_hub on public.cop_onboarding_wizards(hub_id);
create index if not exists idx_cop_production_profiles_org on public.cop_production_profiles(organization_id);
create index if not exists idx_cop_production_profiles_hub on public.cop_production_profiles(hub_id);
create index if not exists idx_cop_deployment_jobs_org on public.cop_deployment_jobs(organization_id);
create index if not exists idx_cop_deployment_jobs_hub on public.cop_deployment_jobs(hub_id);
create index if not exists idx_cop_health_validations_org on public.cop_health_validations(organization_id);
create index if not exists idx_cop_health_validations_hub on public.cop_health_validations(hub_id);
create index if not exists idx_cop_rollback_automations_org on public.cop_rollback_automations(organization_id);
create index if not exists idx_cop_rollback_automations_hub on public.cop_rollback_automations(hub_id);
create index if not exists idx_cop_deployment_audits_org on public.cop_deployment_audits(organization_id);
create index if not exists idx_cop_deployment_audits_hub on public.cop_deployment_audits(hub_id);
create index if not exists idx_cop_central_logs_org on public.cop_central_logs(organization_id);
create index if not exists idx_cop_central_logs_hub on public.cop_central_logs(hub_id);
create index if not exists idx_cop_metrics_collectors_org on public.cop_metrics_collectors(organization_id);
create index if not exists idx_cop_metrics_collectors_hub on public.cop_metrics_collectors(hub_id);
create index if not exists idx_cop_distributed_traces_org on public.cop_distributed_traces(organization_id);
create index if not exists idx_cop_distributed_traces_hub on public.cop_distributed_traces(hub_id);
create index if not exists idx_cop_alert_rules_org on public.cop_alert_rules(organization_id);
create index if not exists idx_cop_alert_rules_hub on public.cop_alert_rules(hub_id);
create index if not exists idx_cop_incident_timelines_org on public.cop_incident_timelines(organization_id);
create index if not exists idx_cop_incident_timelines_hub on public.cop_incident_timelines(hub_id);
create index if not exists idx_cop_backup_schedulers_org on public.cop_backup_schedulers(organization_id);
create index if not exists idx_cop_backup_schedulers_hub on public.cop_backup_schedulers(hub_id);
create index if not exists idx_cop_restore_validations_org on public.cop_restore_validations(organization_id);
create index if not exists idx_cop_restore_validations_hub on public.cop_restore_validations(hub_id);
create index if not exists idx_cop_maintenance_modes_org on public.cop_maintenance_modes(organization_id);
create index if not exists idx_cop_maintenance_modes_hub on public.cop_maintenance_modes(hub_id);
create index if not exists idx_cop_feature_flag_ops_org on public.cop_feature_flag_ops(organization_id);
create index if not exists idx_cop_feature_flag_ops_hub on public.cop_feature_flag_ops(hub_id);
create index if not exists idx_cop_platform_diagnostics_org on public.cop_platform_diagnostics(organization_id);
create index if not exists idx_cop_platform_diagnostics_hub on public.cop_platform_diagnostics(hub_id);
create index if not exists idx_cop_beta_organizations_org on public.cop_beta_organizations(organization_id);
create index if not exists idx_cop_beta_organizations_hub on public.cop_beta_organizations(hub_id);
create index if not exists idx_cop_beta_invitations_org on public.cop_beta_invitations(organization_id);
create index if not exists idx_cop_beta_invitations_hub on public.cop_beta_invitations(hub_id);
create index if not exists idx_cop_feedback_collection_org on public.cop_feedback_collection(organization_id);
create index if not exists idx_cop_feedback_collection_hub on public.cop_feedback_collection(hub_id);
create index if not exists idx_cop_feature_requests_org on public.cop_feature_requests(organization_id);
create index if not exists idx_cop_feature_requests_hub on public.cop_feature_requests(hub_id);
create index if not exists idx_cop_bug_reports_org on public.cop_bug_reports(organization_id);
create index if not exists idx_cop_bug_reports_hub on public.cop_bug_reports(hub_id);
create index if not exists idx_cop_release_channels_org on public.cop_release_channels(organization_id);
create index if not exists idx_cop_release_channels_hub on public.cop_release_channels(hub_id);
create index if not exists idx_cop_operated_metrics_org on public.cop_operated_metrics(organization_id);
create index if not exists idx_cop_operated_health_org on public.cop_operated_health(organization_id);
create index if not exists idx_cop_executive_briefings_org on public.cop_executive_briefings(organization_id);
create index if not exists idx_cop_executive_briefings_hub on public.cop_executive_briefings(hub_id);
create index if not exists idx_cop_platform_failures_org on public.cop_platform_failures(organization_id);
create index if not exists idx_cop_platform_failures_hub on public.cop_platform_failures(hub_id);
create index if not exists idx_cop_audit_logs_org on public.cop_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cop_operated_hubs','cop_signup_flows','cop_org_provisioning','cop_domain_onboarding','cop_email_verifications','cop_onboarding_wizards','cop_production_profiles','cop_deployment_jobs','cop_health_validations','cop_rollback_automations','cop_deployment_audits','cop_central_logs','cop_metrics_collectors','cop_distributed_traces','cop_alert_rules','cop_incident_timelines','cop_backup_schedulers','cop_restore_validations','cop_maintenance_modes','cop_feature_flag_ops','cop_platform_diagnostics','cop_beta_organizations','cop_beta_invitations','cop_feedback_collection','cop_feature_requests','cop_bug_reports','cop_release_channels','cop_operated_metrics','cop_operated_health','cop_executive_briefings','cop_platform_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.cop_operated_hubs enable row level security;
alter table public.cop_signup_flows enable row level security;
alter table public.cop_org_provisioning enable row level security;
alter table public.cop_domain_onboarding enable row level security;
alter table public.cop_email_verifications enable row level security;
alter table public.cop_onboarding_wizards enable row level security;
alter table public.cop_production_profiles enable row level security;
alter table public.cop_deployment_jobs enable row level security;
alter table public.cop_health_validations enable row level security;
alter table public.cop_rollback_automations enable row level security;
alter table public.cop_deployment_audits enable row level security;
alter table public.cop_central_logs enable row level security;
alter table public.cop_metrics_collectors enable row level security;
alter table public.cop_distributed_traces enable row level security;
alter table public.cop_alert_rules enable row level security;
alter table public.cop_incident_timelines enable row level security;
alter table public.cop_backup_schedulers enable row level security;
alter table public.cop_restore_validations enable row level security;
alter table public.cop_maintenance_modes enable row level security;
alter table public.cop_feature_flag_ops enable row level security;
alter table public.cop_platform_diagnostics enable row level security;
alter table public.cop_beta_organizations enable row level security;
alter table public.cop_beta_invitations enable row level security;
alter table public.cop_feedback_collection enable row level security;
alter table public.cop_feature_requests enable row level security;
alter table public.cop_bug_reports enable row level security;
alter table public.cop_release_channels enable row level security;
alter table public.cop_operated_metrics enable row level security;
alter table public.cop_operated_health enable row level security;
alter table public.cop_executive_briefings enable row level security;
alter table public.cop_platform_failures enable row level security;
alter table public.cop_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cop_operated_hubs','cop_signup_flows','cop_org_provisioning','cop_domain_onboarding','cop_email_verifications','cop_onboarding_wizards','cop_production_profiles','cop_deployment_jobs','cop_health_validations','cop_rollback_automations','cop_deployment_audits','cop_central_logs','cop_metrics_collectors','cop_distributed_traces','cop_alert_rules','cop_incident_timelines','cop_backup_schedulers','cop_restore_validations','cop_maintenance_modes','cop_feature_flag_ops','cop_platform_diagnostics','cop_beta_organizations','cop_beta_invitations','cop_feedback_collection','cop_feature_requests','cop_bug_reports','cop_release_channels','cop_operated_metrics','cop_operated_health','cop_executive_briefings','cop_platform_failures','cop_audit_logs'
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
  ('cop.view', 'View customer operated platform data', 'customer_operated_platform'),
  ('cop.manage', 'Manage onboarding, production, observability, operations, beta, and dashboard outputs', 'customer_operated_platform'),
  ('cop.approve', 'Approve customer operated platform gates and actions', 'customer_operated_platform'),
  ('cop.admin', 'Administer customer operated platform governance', 'customer_operated_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

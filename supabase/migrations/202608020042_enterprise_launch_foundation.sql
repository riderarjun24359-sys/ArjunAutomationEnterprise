-- V2 Program C Sprint 4: Enterprise Launch Foundation

-- LaunchHub
create table if not exists public.elf_launch_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  platform_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- OrganizationProvision
create table if not exists public.elf_organization_provisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  provision_key text not null,
  provision_name text not null default '',
  provision_status text not null default 'pending',
  org_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, provision_key)
);

-- TenantProvision
create table if not exists public.elf_tenant_provisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  provision_key text not null,
  tenant_ref text not null default '',
  provision_status text not null default 'pending',
  provision_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, provision_key)
);

-- IndustryPackAssignment
create table if not exists public.elf_industry_pack_assignments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  assignment_key text not null,
  pack_name text not null default '',
  pack_type text not null default 'hospital',
  pack_version text not null default '1.0',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, assignment_key)
);

-- ModuleLicense
create table if not exists public.elf_module_licenses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  license_key text not null,
  module_name text not null default '',
  license_status text not null default 'active',
  seat_count integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, license_key)
);

-- WizardProfile
create table if not exists public.elf_wizard_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_type text not null default 'standard',
  completion_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- WizardBranding
create table if not exists public.elf_wizard_branding (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  branding_key text not null,
  branding_name text not null default '',
  brand_color text not null default '#475569',
  logo_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, branding_key)
);

-- WizardDepartment
create table if not exists public.elf_wizard_departments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  department_key text not null,
  department_name text not null default '',
  department_type text not null default 'operations',
  head_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, department_key)
);

-- WizardSetting
create table if not exists public.elf_wizard_settings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  setting_key text not null,
  setting_name text not null default '',
  setting_value text not null default '',
  setting_group text not null default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, setting_key)
);

-- ImportJob
create table if not exists public.elf_import_jobs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  job_key text not null,
  job_name text not null default '',
  job_status text not null default 'pending',
  source_ref text not null default '',
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, job_key)
);

-- ImportValidation
create table if not exists public.elf_import_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  validation_key text not null,
  validation_type text not null default 'schema',
  validation_score numeric(5, 2) not null default 0,
  validation_summary text not null default '',
  validated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, validation_key)
);

-- ImportPreview
create table if not exists public.elf_import_previews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  preview_key text not null,
  preview_name text not null default '',
  record_count integer not null default 0,
  preview_summary text not null default '',
  previewed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, preview_key)
);

-- ImportHistory
create table if not exists public.elf_import_history (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  history_key text not null,
  history_type text not null default 'bulk',
  imported_at timestamptz not null default now(),
  record_count integer not null default 0,
  import_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- GoLiveChecklist
create table if not exists public.elf_go_live_checklists (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
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

-- GoLiveScore
create table if not exists public.elf_go_live_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  score_key text not null,
  score_type text not null default 'overall',
  go_live_score numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  captured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- DeploymentStatus
create table if not exists public.elf_deployment_statuses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  status_key text not null,
  deployment_name text not null default '',
  deployment_status text not null default 'pending',
  target_version text not null default '',
  deployed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, status_key)
);

-- ReadinessValidation
create table if not exists public.elf_readiness_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
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

-- CustomerHealthScore
create table if not exists public.elf_customer_health_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
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

-- PlatformAdoption
create table if not exists public.elf_platform_adoption (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  adoption_key text not null,
  feature_name text not null default '',
  adoption_rate numeric(5, 2) not null default 0,
  metric_date date not null default current_date,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, adoption_key)
);

-- FeatureUsage
create table if not exists public.elf_feature_usage (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  usage_key text not null,
  feature_name text not null default '',
  usage_count integer not null default 0,
  metric_date date not null default current_date,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, usage_key)
);

-- RenewalTracking
create table if not exists public.elf_renewal_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  renewal_key text not null,
  customer_ref text not null default '',
  renewal_status text not null default 'pending',
  renewal_date date not null default current_date,
  contract_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, renewal_key)
);

-- SupportTicket
create table if not exists public.elf_support_tickets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
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

-- KnowledgeBaseArticle
create table if not exists public.elf_knowledge_base_articles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
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

-- IncidentTracking
create table if not exists public.elf_incident_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  incident_key text not null,
  incident_title text not null default '',
  incident_severity text not null default 'warning',
  incident_summary text not null default '',
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, incident_key)
);

-- CustomerRegistry
create table if not exists public.elf_customer_registry (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  customer_key text not null,
  customer_name text not null default '',
  customer_tier text not null default 'standard',
  region text not null default '',
  onboarded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, customer_key)
);

-- SubscriptionRecord
create table if not exists public.elf_subscription_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  subscription_key text not null,
  plan_name text not null default '',
  subscription_status text not null default 'active',
  seat_count integer not null default 1,
  started_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, subscription_key)
);

-- LicenseManagement
create table if not exists public.elf_license_management (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  license_key text not null,
  license_type text not null default 'platform',
  license_status text not null default 'active',
  seat_limit integer not null default 100,
  expires_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, license_key)
);

-- LaunchMetric
create table if not exists public.elf_launch_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  platform_health_score numeric(5, 2) not null default 100,
  customer_health_score numeric(5, 2) not null default 100,
  deployment_count integer not null default 0,
  subscription_count integer not null default 0,
  support_open_count integer not null default 0,
  go_live_score numeric(5, 2) not null default 100,
  overall_launch_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- LaunchHealth
create table if not exists public.elf_launch_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  platform_status text not null default 'healthy',
  customer_success_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- MissionControlKpi
create table if not exists public.elf_mission_control_kpis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_score numeric(5, 2) not null default 0,
  kpi_type text not null default 'mission_control',
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- LaunchFailure
create table if not exists public.elf_launch_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.elf_launch_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'provisioning',
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
create table if not exists public.elf_audit_logs (
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

create index if not exists idx_elf_launch_hubs_org on public.elf_launch_hubs(organization_id);
create index if not exists idx_elf_organization_provisions_org on public.elf_organization_provisions(organization_id);
create index if not exists idx_elf_organization_provisions_hub on public.elf_organization_provisions(hub_id);
create index if not exists idx_elf_tenant_provisions_org on public.elf_tenant_provisions(organization_id);
create index if not exists idx_elf_tenant_provisions_hub on public.elf_tenant_provisions(hub_id);
create index if not exists idx_elf_industry_pack_assignments_org on public.elf_industry_pack_assignments(organization_id);
create index if not exists idx_elf_industry_pack_assignments_hub on public.elf_industry_pack_assignments(hub_id);
create index if not exists idx_elf_module_licenses_org on public.elf_module_licenses(organization_id);
create index if not exists idx_elf_module_licenses_hub on public.elf_module_licenses(hub_id);
create index if not exists idx_elf_wizard_profiles_org on public.elf_wizard_profiles(organization_id);
create index if not exists idx_elf_wizard_profiles_hub on public.elf_wizard_profiles(hub_id);
create index if not exists idx_elf_wizard_branding_org on public.elf_wizard_branding(organization_id);
create index if not exists idx_elf_wizard_branding_hub on public.elf_wizard_branding(hub_id);
create index if not exists idx_elf_wizard_departments_org on public.elf_wizard_departments(organization_id);
create index if not exists idx_elf_wizard_departments_hub on public.elf_wizard_departments(hub_id);
create index if not exists idx_elf_wizard_settings_org on public.elf_wizard_settings(organization_id);
create index if not exists idx_elf_wizard_settings_hub on public.elf_wizard_settings(hub_id);
create index if not exists idx_elf_import_jobs_org on public.elf_import_jobs(organization_id);
create index if not exists idx_elf_import_jobs_hub on public.elf_import_jobs(hub_id);
create index if not exists idx_elf_import_validations_org on public.elf_import_validations(organization_id);
create index if not exists idx_elf_import_validations_hub on public.elf_import_validations(hub_id);
create index if not exists idx_elf_import_previews_org on public.elf_import_previews(organization_id);
create index if not exists idx_elf_import_previews_hub on public.elf_import_previews(hub_id);
create index if not exists idx_elf_import_history_org on public.elf_import_history(organization_id);
create index if not exists idx_elf_import_history_hub on public.elf_import_history(hub_id);
create index if not exists idx_elf_go_live_checklists_org on public.elf_go_live_checklists(organization_id);
create index if not exists idx_elf_go_live_checklists_hub on public.elf_go_live_checklists(hub_id);
create index if not exists idx_elf_go_live_scores_org on public.elf_go_live_scores(organization_id);
create index if not exists idx_elf_go_live_scores_hub on public.elf_go_live_scores(hub_id);
create index if not exists idx_elf_deployment_statuses_org on public.elf_deployment_statuses(organization_id);
create index if not exists idx_elf_deployment_statuses_hub on public.elf_deployment_statuses(hub_id);
create index if not exists idx_elf_readiness_validations_org on public.elf_readiness_validations(organization_id);
create index if not exists idx_elf_readiness_validations_hub on public.elf_readiness_validations(hub_id);
create index if not exists idx_elf_customer_health_scores_org on public.elf_customer_health_scores(organization_id);
create index if not exists idx_elf_customer_health_scores_hub on public.elf_customer_health_scores(hub_id);
create index if not exists idx_elf_platform_adoption_org on public.elf_platform_adoption(organization_id);
create index if not exists idx_elf_platform_adoption_hub on public.elf_platform_adoption(hub_id);
create index if not exists idx_elf_feature_usage_org on public.elf_feature_usage(organization_id);
create index if not exists idx_elf_feature_usage_hub on public.elf_feature_usage(hub_id);
create index if not exists idx_elf_renewal_tracking_org on public.elf_renewal_tracking(organization_id);
create index if not exists idx_elf_renewal_tracking_hub on public.elf_renewal_tracking(hub_id);
create index if not exists idx_elf_support_tickets_org on public.elf_support_tickets(organization_id);
create index if not exists idx_elf_support_tickets_hub on public.elf_support_tickets(hub_id);
create index if not exists idx_elf_knowledge_base_articles_org on public.elf_knowledge_base_articles(organization_id);
create index if not exists idx_elf_knowledge_base_articles_hub on public.elf_knowledge_base_articles(hub_id);
create index if not exists idx_elf_incident_tracking_org on public.elf_incident_tracking(organization_id);
create index if not exists idx_elf_incident_tracking_hub on public.elf_incident_tracking(hub_id);
create index if not exists idx_elf_customer_registry_org on public.elf_customer_registry(organization_id);
create index if not exists idx_elf_customer_registry_hub on public.elf_customer_registry(hub_id);
create index if not exists idx_elf_subscription_records_org on public.elf_subscription_records(organization_id);
create index if not exists idx_elf_subscription_records_hub on public.elf_subscription_records(hub_id);
create index if not exists idx_elf_license_management_org on public.elf_license_management(organization_id);
create index if not exists idx_elf_license_management_hub on public.elf_license_management(hub_id);
create index if not exists idx_elf_launch_metrics_org on public.elf_launch_metrics(organization_id);
create index if not exists idx_elf_launch_health_org on public.elf_launch_health(organization_id);
create index if not exists idx_elf_mission_control_kpis_org on public.elf_mission_control_kpis(organization_id);
create index if not exists idx_elf_mission_control_kpis_hub on public.elf_mission_control_kpis(hub_id);
create index if not exists idx_elf_launch_failures_org on public.elf_launch_failures(organization_id);
create index if not exists idx_elf_launch_failures_hub on public.elf_launch_failures(hub_id);
create index if not exists idx_elf_audit_logs_org on public.elf_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'elf_launch_hubs','elf_organization_provisions','elf_tenant_provisions','elf_industry_pack_assignments','elf_module_licenses','elf_wizard_profiles','elf_wizard_branding','elf_wizard_departments','elf_wizard_settings','elf_import_jobs','elf_import_validations','elf_import_previews','elf_import_history','elf_go_live_checklists','elf_go_live_scores','elf_deployment_statuses','elf_readiness_validations','elf_customer_health_scores','elf_platform_adoption','elf_feature_usage','elf_renewal_tracking','elf_support_tickets','elf_knowledge_base_articles','elf_incident_tracking','elf_customer_registry','elf_subscription_records','elf_license_management','elf_launch_metrics','elf_launch_health','elf_mission_control_kpis','elf_launch_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.elf_launch_hubs enable row level security;
alter table public.elf_organization_provisions enable row level security;
alter table public.elf_tenant_provisions enable row level security;
alter table public.elf_industry_pack_assignments enable row level security;
alter table public.elf_module_licenses enable row level security;
alter table public.elf_wizard_profiles enable row level security;
alter table public.elf_wizard_branding enable row level security;
alter table public.elf_wizard_departments enable row level security;
alter table public.elf_wizard_settings enable row level security;
alter table public.elf_import_jobs enable row level security;
alter table public.elf_import_validations enable row level security;
alter table public.elf_import_previews enable row level security;
alter table public.elf_import_history enable row level security;
alter table public.elf_go_live_checklists enable row level security;
alter table public.elf_go_live_scores enable row level security;
alter table public.elf_deployment_statuses enable row level security;
alter table public.elf_readiness_validations enable row level security;
alter table public.elf_customer_health_scores enable row level security;
alter table public.elf_platform_adoption enable row level security;
alter table public.elf_feature_usage enable row level security;
alter table public.elf_renewal_tracking enable row level security;
alter table public.elf_support_tickets enable row level security;
alter table public.elf_knowledge_base_articles enable row level security;
alter table public.elf_incident_tracking enable row level security;
alter table public.elf_customer_registry enable row level security;
alter table public.elf_subscription_records enable row level security;
alter table public.elf_license_management enable row level security;
alter table public.elf_launch_metrics enable row level security;
alter table public.elf_launch_health enable row level security;
alter table public.elf_mission_control_kpis enable row level security;
alter table public.elf_launch_failures enable row level security;
alter table public.elf_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'elf_launch_hubs','elf_organization_provisions','elf_tenant_provisions','elf_industry_pack_assignments','elf_module_licenses','elf_wizard_profiles','elf_wizard_branding','elf_wizard_departments','elf_wizard_settings','elf_import_jobs','elf_import_validations','elf_import_previews','elf_import_history','elf_go_live_checklists','elf_go_live_scores','elf_deployment_statuses','elf_readiness_validations','elf_customer_health_scores','elf_platform_adoption','elf_feature_usage','elf_renewal_tracking','elf_support_tickets','elf_knowledge_base_articles','elf_incident_tracking','elf_customer_registry','elf_subscription_records','elf_license_management','elf_launch_metrics','elf_launch_health','elf_mission_control_kpis','elf_launch_failures','elf_audit_logs'
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
  ('elf.view', 'View enterprise launch foundation data', 'enterprise_launch_foundation'),
  ('elf.manage', 'Manage provisioning, configuration, import, go-live, customer success, support, and platform admin outputs', 'enterprise_launch_foundation'),
  ('elf.approve', 'Approve launch foundation gates and deployment actions', 'enterprise_launch_foundation'),
  ('elf.admin', 'Administer enterprise launch foundation governance', 'enterprise_launch_foundation')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

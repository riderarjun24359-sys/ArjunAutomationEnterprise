-- V2 Program B Sprint 1: Enterprise Industry Framework Core

-- FrameworkHub
create table if not exists public.ifr_framework_hubs (
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

-- IndustryRegistration
create table if not exists public.ifr_industry_registrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  registration_key text not null,
  industry_code text not null default '',
  industry_name text not null default '',
  registered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, registration_key)
);

-- IndustryMetadata
create table if not exists public.ifr_industry_metadata (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  metadata_key text not null,
  metadata_type text not null default 'profile',
  metadata_value jsonb not null default '{}'::jsonb,
  updated_at_ref timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metadata_key)
);

-- IndustryVersion
create table if not exists public.ifr_industry_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  version_key text not null,
  version_number text not null default '',
  release_channel text not null default 'stable',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- IndustryDependency
create table if not exists public.ifr_industry_dependencies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  dependency_key text not null,
  dependency_type text not null default 'module',
  dependency_ref text not null default '',
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dependency_key)
);

-- BusinessType
create table if not exists public.ifr_business_types (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  type_key text not null,
  type_name text not null default '',
  type_category text not null default 'general',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, type_key)
);

-- BusinessSize
create table if not exists public.ifr_business_sizes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  size_key text not null,
  size_label text not null default '',
  employee_range text not null default '',
  revenue_range text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, size_key)
);

-- OperatingModel
create table if not exists public.ifr_operating_models (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  model_key text not null,
  model_name text not null default '',
  model_type text not null default 'saas',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, model_key)
);

-- IndustryProfile
create table if not exists public.ifr_industry_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_score numeric(5, 2) not null default 0,
  profile_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- DashboardTemplate
create table if not exists public.ifr_dashboard_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_version text not null default '1.0',
  layout_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- WorkflowTemplate
create table if not exists public.ifr_workflow_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  workflow_type text not null default 'automation',
  steps_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- RoleTemplate
create table if not exists public.ifr_role_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  template_key text not null,
  role_name text not null default '',
  permissions_count integer not null default 0,
  role_level text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- ReportTemplate
create table if not exists public.ifr_report_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  template_key text not null,
  report_name text not null default '',
  report_format text not null default 'pdf',
  schedule_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- DynamicConfiguration
create table if not exists public.ifr_dynamic_configurations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  config_key text not null,
  config_type text not null default 'feature',
  config_value jsonb not null default '{}'::jsonb,
  effective_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

-- FeatureConfiguration
create table if not exists public.ifr_feature_configurations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  feature_key text not null,
  feature_name text not null default '',
  enabled boolean not null default true,
  rollout_percentage numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, feature_key)
);

-- BusinessRule
create table if not exists public.ifr_business_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_type text not null default 'validation',
  rule_expression text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- ValidationRule
create table if not exists public.ifr_validation_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  validation_type text not null default 'schema',
  validation_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- IndustryContext
create table if not exists public.ifr_industry_contexts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  context_key text not null,
  context_type text not null default 'operational',
  context_payload jsonb not null default '{}'::jsonb,
  refreshed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, context_key)
);

-- AiContext
create table if not exists public.ifr_ai_contexts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  context_key text not null,
  context_type text not null default 'prompt',
  model_ref text not null default '',
  token_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, context_key)
);

-- TerminologyEntry
create table if not exists public.ifr_terminology_entries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  term_key text not null,
  term_label text not null default '',
  term_definition text not null default '',
  locale text not null default 'en',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, term_key)
);

-- DemoProfile
create table if not exists public.ifr_demo_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  demo_duration_days integer not null default 14,
  seed_data_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- ProductionProfile
create table if not exists public.ifr_production_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  deployment_target text not null default 'cloud',
  scaling_tier text not null default 'standard',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- EnterpriseProfile
create table if not exists public.ifr_enterprise_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  compliance_tier text not null default 'enterprise',
  sla_target numeric(5, 2) not null default 99.9,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- SharedApi
create table if not exists public.ifr_shared_apis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  api_key text not null,
  api_name text not null default '',
  api_version text not null default 'v1',
  endpoint_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, api_key)
);

-- ContextApi
create table if not exists public.ifr_context_apis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  api_key text not null,
  api_name text not null default '',
  context_type text not null default 'industry',
  endpoint_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, api_key)
);

-- ConfigurationApi
create table if not exists public.ifr_configuration_apis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  api_key text not null,
  api_name text not null default '',
  config_scope text not null default 'tenant',
  endpoint_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, api_key)
);

-- ExtensionPoint
create table if not exists public.ifr_extension_points (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  extension_key text not null,
  extension_name text not null default '',
  hook_type text not null default 'pre_action',
  plugin_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, extension_key)
);

-- FrameworkMetric
create table if not exists public.ifr_framework_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  template_score numeric(5, 2) not null default 100,
  profile_score numeric(5, 2) not null default 100,
  compatibility_score numeric(5, 2) not null default 100,
  sdk_score numeric(5, 2) not null default 100,
  framework_health_score numeric(5, 2) not null default 100,
  overall_framework_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- FrameworkHealth
create table if not exists public.ifr_framework_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  compatibility_status text not null default 'healthy',
  sdk_status text not null default 'healthy',
  template_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- CompatibilityCheck
create table if not exists public.ifr_compatibility_checks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  check_key text not null,
  check_type text not null default 'version',
  check_score numeric(5, 2) not null default 0,
  check_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, check_key)
);

-- FrameworkFailure
create table if not exists public.ifr_framework_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.ifr_framework_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'compatibility',
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
create table if not exists public.ifr_audit_logs (
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

create index if not exists idx_ifr_framework_hubs_org on public.ifr_framework_hubs(organization_id);
create index if not exists idx_ifr_industry_registrations_org on public.ifr_industry_registrations(organization_id);
create index if not exists idx_ifr_industry_registrations_hub on public.ifr_industry_registrations(hub_id);
create index if not exists idx_ifr_industry_metadata_org on public.ifr_industry_metadata(organization_id);
create index if not exists idx_ifr_industry_metadata_hub on public.ifr_industry_metadata(hub_id);
create index if not exists idx_ifr_industry_versions_org on public.ifr_industry_versions(organization_id);
create index if not exists idx_ifr_industry_versions_hub on public.ifr_industry_versions(hub_id);
create index if not exists idx_ifr_industry_dependencies_org on public.ifr_industry_dependencies(organization_id);
create index if not exists idx_ifr_industry_dependencies_hub on public.ifr_industry_dependencies(hub_id);
create index if not exists idx_ifr_business_types_org on public.ifr_business_types(organization_id);
create index if not exists idx_ifr_business_types_hub on public.ifr_business_types(hub_id);
create index if not exists idx_ifr_business_sizes_org on public.ifr_business_sizes(organization_id);
create index if not exists idx_ifr_business_sizes_hub on public.ifr_business_sizes(hub_id);
create index if not exists idx_ifr_operating_models_org on public.ifr_operating_models(organization_id);
create index if not exists idx_ifr_operating_models_hub on public.ifr_operating_models(hub_id);
create index if not exists idx_ifr_industry_profiles_org on public.ifr_industry_profiles(organization_id);
create index if not exists idx_ifr_industry_profiles_hub on public.ifr_industry_profiles(hub_id);
create index if not exists idx_ifr_dashboard_templates_org on public.ifr_dashboard_templates(organization_id);
create index if not exists idx_ifr_dashboard_templates_hub on public.ifr_dashboard_templates(hub_id);
create index if not exists idx_ifr_workflow_templates_org on public.ifr_workflow_templates(organization_id);
create index if not exists idx_ifr_workflow_templates_hub on public.ifr_workflow_templates(hub_id);
create index if not exists idx_ifr_role_templates_org on public.ifr_role_templates(organization_id);
create index if not exists idx_ifr_role_templates_hub on public.ifr_role_templates(hub_id);
create index if not exists idx_ifr_report_templates_org on public.ifr_report_templates(organization_id);
create index if not exists idx_ifr_report_templates_hub on public.ifr_report_templates(hub_id);
create index if not exists idx_ifr_dynamic_configurations_org on public.ifr_dynamic_configurations(organization_id);
create index if not exists idx_ifr_dynamic_configurations_hub on public.ifr_dynamic_configurations(hub_id);
create index if not exists idx_ifr_feature_configurations_org on public.ifr_feature_configurations(organization_id);
create index if not exists idx_ifr_feature_configurations_hub on public.ifr_feature_configurations(hub_id);
create index if not exists idx_ifr_business_rules_org on public.ifr_business_rules(organization_id);
create index if not exists idx_ifr_business_rules_hub on public.ifr_business_rules(hub_id);
create index if not exists idx_ifr_validation_rules_org on public.ifr_validation_rules(organization_id);
create index if not exists idx_ifr_validation_rules_hub on public.ifr_validation_rules(hub_id);
create index if not exists idx_ifr_industry_contexts_org on public.ifr_industry_contexts(organization_id);
create index if not exists idx_ifr_industry_contexts_hub on public.ifr_industry_contexts(hub_id);
create index if not exists idx_ifr_ai_contexts_org on public.ifr_ai_contexts(organization_id);
create index if not exists idx_ifr_ai_contexts_hub on public.ifr_ai_contexts(hub_id);
create index if not exists idx_ifr_terminology_entries_org on public.ifr_terminology_entries(organization_id);
create index if not exists idx_ifr_terminology_entries_hub on public.ifr_terminology_entries(hub_id);
create index if not exists idx_ifr_demo_profiles_org on public.ifr_demo_profiles(organization_id);
create index if not exists idx_ifr_demo_profiles_hub on public.ifr_demo_profiles(hub_id);
create index if not exists idx_ifr_production_profiles_org on public.ifr_production_profiles(organization_id);
create index if not exists idx_ifr_production_profiles_hub on public.ifr_production_profiles(hub_id);
create index if not exists idx_ifr_enterprise_profiles_org on public.ifr_enterprise_profiles(organization_id);
create index if not exists idx_ifr_enterprise_profiles_hub on public.ifr_enterprise_profiles(hub_id);
create index if not exists idx_ifr_shared_apis_org on public.ifr_shared_apis(organization_id);
create index if not exists idx_ifr_shared_apis_hub on public.ifr_shared_apis(hub_id);
create index if not exists idx_ifr_context_apis_org on public.ifr_context_apis(organization_id);
create index if not exists idx_ifr_context_apis_hub on public.ifr_context_apis(hub_id);
create index if not exists idx_ifr_configuration_apis_org on public.ifr_configuration_apis(organization_id);
create index if not exists idx_ifr_configuration_apis_hub on public.ifr_configuration_apis(hub_id);
create index if not exists idx_ifr_extension_points_org on public.ifr_extension_points(organization_id);
create index if not exists idx_ifr_extension_points_hub on public.ifr_extension_points(hub_id);
create index if not exists idx_ifr_framework_metrics_org on public.ifr_framework_metrics(organization_id);
create index if not exists idx_ifr_framework_health_org on public.ifr_framework_health(organization_id);
create index if not exists idx_ifr_compatibility_checks_org on public.ifr_compatibility_checks(organization_id);
create index if not exists idx_ifr_compatibility_checks_hub on public.ifr_compatibility_checks(hub_id);
create index if not exists idx_ifr_framework_failures_org on public.ifr_framework_failures(organization_id);
create index if not exists idx_ifr_framework_failures_hub on public.ifr_framework_failures(hub_id);
create index if not exists idx_ifr_audit_logs_org on public.ifr_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'ifr_framework_hubs','ifr_industry_registrations','ifr_industry_metadata','ifr_industry_versions','ifr_industry_dependencies','ifr_business_types','ifr_business_sizes','ifr_operating_models','ifr_industry_profiles','ifr_dashboard_templates','ifr_workflow_templates','ifr_role_templates','ifr_report_templates','ifr_dynamic_configurations','ifr_feature_configurations','ifr_business_rules','ifr_validation_rules','ifr_industry_contexts','ifr_ai_contexts','ifr_terminology_entries','ifr_demo_profiles','ifr_production_profiles','ifr_enterprise_profiles','ifr_shared_apis','ifr_context_apis','ifr_configuration_apis','ifr_extension_points','ifr_framework_metrics','ifr_framework_health','ifr_compatibility_checks','ifr_framework_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.ifr_framework_hubs enable row level security;
alter table public.ifr_industry_registrations enable row level security;
alter table public.ifr_industry_metadata enable row level security;
alter table public.ifr_industry_versions enable row level security;
alter table public.ifr_industry_dependencies enable row level security;
alter table public.ifr_business_types enable row level security;
alter table public.ifr_business_sizes enable row level security;
alter table public.ifr_operating_models enable row level security;
alter table public.ifr_industry_profiles enable row level security;
alter table public.ifr_dashboard_templates enable row level security;
alter table public.ifr_workflow_templates enable row level security;
alter table public.ifr_role_templates enable row level security;
alter table public.ifr_report_templates enable row level security;
alter table public.ifr_dynamic_configurations enable row level security;
alter table public.ifr_feature_configurations enable row level security;
alter table public.ifr_business_rules enable row level security;
alter table public.ifr_validation_rules enable row level security;
alter table public.ifr_industry_contexts enable row level security;
alter table public.ifr_ai_contexts enable row level security;
alter table public.ifr_terminology_entries enable row level security;
alter table public.ifr_demo_profiles enable row level security;
alter table public.ifr_production_profiles enable row level security;
alter table public.ifr_enterprise_profiles enable row level security;
alter table public.ifr_shared_apis enable row level security;
alter table public.ifr_context_apis enable row level security;
alter table public.ifr_configuration_apis enable row level security;
alter table public.ifr_extension_points enable row level security;
alter table public.ifr_framework_metrics enable row level security;
alter table public.ifr_framework_health enable row level security;
alter table public.ifr_compatibility_checks enable row level security;
alter table public.ifr_framework_failures enable row level security;
alter table public.ifr_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'ifr_framework_hubs','ifr_industry_registrations','ifr_industry_metadata','ifr_industry_versions','ifr_industry_dependencies','ifr_business_types','ifr_business_sizes','ifr_operating_models','ifr_industry_profiles','ifr_dashboard_templates','ifr_workflow_templates','ifr_role_templates','ifr_report_templates','ifr_dynamic_configurations','ifr_feature_configurations','ifr_business_rules','ifr_validation_rules','ifr_industry_contexts','ifr_ai_contexts','ifr_terminology_entries','ifr_demo_profiles','ifr_production_profiles','ifr_enterprise_profiles','ifr_shared_apis','ifr_context_apis','ifr_configuration_apis','ifr_extension_points','ifr_framework_metrics','ifr_framework_health','ifr_compatibility_checks','ifr_framework_failures','ifr_audit_logs'
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
  ('ifr.view', 'View enterprise industry framework core data', 'enterprise_industry_framework_core'),
  ('ifr.manage', 'Manage industry registrations, profiles, templates, and framework outputs', 'enterprise_industry_framework_core'),
  ('ifr.approve', 'Approve industry framework gates and deployment profiles', 'enterprise_industry_framework_core'),
  ('ifr.admin', 'Administer enterprise industry framework core governance', 'enterprise_industry_framework_core')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

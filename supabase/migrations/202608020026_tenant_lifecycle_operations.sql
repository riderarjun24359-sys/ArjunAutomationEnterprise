-- V2 Program A Sprint 3: Customer Lifecycle & Tenant Operations Platform

create table if not exists public.tlo_tenant_contexts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_key text not null,
  company_name text not null,
  lifecycle_stage text not null default 'lead',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_key)
);

create table if not exists public.tlo_lifecycle_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  record_key text not null,
  current_stage text not null default 'lead',
  previous_stage text not null default '',
  stage_entered_at timestamptz not null default now(),
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  notes text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, record_key)
);

create table if not exists public.tlo_lifecycle_transitions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  transition_key text not null,
  from_stage text not null,
  to_stage text not null,
  triggered_by uuid references public.user_profiles(id) on delete set null,
  reason text not null default '',
  approved_by uuid references public.user_profiles(id) on delete set null,
  transitioned_at timestamptz not null default now(),
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, transition_key)
);

create table if not exists public.tlo_lifecycle_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  event_key text not null,
  event_type text not null,
  stage text not null default '',
  summary text not null default '',
  details jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.user_profiles(id) on delete set null,
  occurred_at timestamptz not null default now(),
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table if not exists public.tlo_reactivation_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  request_key text not null,
  prior_stage text not null default 'cancelled',
  target_stage text not null default 'active',
  requested_by uuid references public.user_profiles(id) on delete set null,
  approved_by uuid references public.user_profiles(id) on delete set null,
  justification text not null default '',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, request_key)
);

create table if not exists public.tlo_workspaces (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  workspace_key text not null,
  workspace_name text not null,
  workspace_type text not null default 'production',
  region text not null default '',
  isolation_tier text not null default 'shared',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, workspace_key)
);

create table if not exists public.tlo_environment_settings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  setting_key text not null,
  environment_name text not null default 'production',
  config jsonb not null default '{}'::jsonb,
  feature_flags jsonb not null default '{}'::jsonb,
  api_rate_limit integer not null default 1000,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, setting_key)
);

create table if not exists public.tlo_storage_management (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  storage_key text not null,
  storage_type text not null default 'object',
  quota_gb numeric(12, 2) not null default 0,
  used_gb numeric(12, 2) not null default 0,
  retention_days integer not null default 90,
  encryption_enabled boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, storage_key)
);

create table if not exists public.tlo_operations_controls (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  control_key text not null,
  backup_enabled boolean not null default true,
  backup_schedule_cron text not null default '0 2 * * *',
  last_backup_at timestamptz,
  restore_point_id text not null default '',
  maintenance_mode boolean not null default false,
  maintenance_window jsonb not null default '{}'::jsonb,
  maintenance_message text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, control_key)
);

create table if not exists public.tlo_onboarding_flows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  flow_key text not null,
  flow_name text not null,
  flow_type text not null default 'standard',
  steps jsonb not null default '[]'::jsonb,
  estimated_days integer not null default 14,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, flow_key)
);

create table if not exists public.tlo_onboarding_progress (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  progress_key text not null,
  flow_id uuid references public.tlo_onboarding_flows(id) on delete set null,
  current_step text not null default '',
  completed_steps jsonb not null default '[]'::jsonb,
  percent_complete numeric(5, 2) not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, progress_key)
);

create table if not exists public.tlo_onboarding_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  validation_key text not null,
  validation_type text not null,
  rule_name text not null,
  expected_value text not null default '',
  actual_value text not null default '',
  passed boolean not null default false,
  validated_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, validation_key)
);

create table if not exists public.tlo_go_live_checklists (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  checklist_key text not null,
  name text not null,
  checklist_items jsonb not null default '[]'::jsonb,
  completed_items jsonb not null default '[]'::jsonb,
  signoff_user_id uuid references public.user_profiles(id) on delete set null,
  go_live_date date,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, checklist_key)
);

create table if not exists public.tlo_marketplace_modules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  module_key text not null,
  module_name text not null,
  module_version text not null default '1.0.0',
  category text not null default '',
  description text not null default '',
  is_published boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, module_key)
);

create table if not exists public.tlo_module_installations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  installation_key text not null,
  module_id uuid references public.tlo_marketplace_modules(id) on delete set null,
  installed_version text not null default '',
  installed_at timestamptz not null default now(),
  installed_by uuid references public.user_profiles(id) on delete set null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, installation_key)
);

create table if not exists public.tlo_module_dependencies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  dependency_key text not null,
  module_id uuid references public.tlo_marketplace_modules(id) on delete cascade,
  depends_on_module_id uuid references public.tlo_marketplace_modules(id) on delete cascade,
  dependency_type text not null default 'required',
  min_version text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, dependency_key)
);

create table if not exists public.tlo_module_compatibility (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  compatibility_key text not null,
  module_id uuid references public.tlo_marketplace_modules(id) on delete cascade,
  platform_version text not null default '',
  compatible boolean not null default true,
  notes text not null default '',
  tested_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, compatibility_key)
);

create table if not exists public.tlo_industry_packs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  pack_key text not null,
  pack_name text not null,
  industry text not null default '',
  pack_version text not null default '1.0.0',
  included_modules jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, pack_key)
);

create table if not exists public.tlo_pack_installations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  installation_key text not null,
  pack_id uuid references public.tlo_industry_packs(id) on delete set null,
  installed_version text not null default '',
  installed_at timestamptz not null default now(),
  installed_by uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, installation_key)
);

create table if not exists public.tlo_pack_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  version_key text not null,
  pack_id uuid references public.tlo_industry_packs(id) on delete cascade,
  version_number text not null,
  changelog text not null default '',
  release_notes jsonb not null default '{}'::jsonb,
  released_at timestamptz not null default now(),
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, version_key)
);

create table if not exists public.tlo_pack_exports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  export_key text not null,
  pack_id uuid references public.tlo_industry_packs(id) on delete set null,
  export_format text not null default 'json',
  export_uri text not null default '',
  exported_at timestamptz not null default now(),
  exported_by uuid references public.user_profiles(id) on delete set null,
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, export_key)
);

create table if not exists public.tlo_health_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  overall_score numeric(5, 2) not null default 0,
  trend text not null default 'stable',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, snapshot_key)
);

create table if not exists public.tlo_health_dimensions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  dimension_key text not null,
  snapshot_id uuid references public.tlo_health_snapshots(id) on delete cascade,
  dimension_name text not null,
  score numeric(5, 2) not null default 0,
  weight numeric(5, 2) not null default 1,
  metrics jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, dimension_key)
);

create table if not exists public.tlo_health_risks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  risk_key text not null,
  risk_type text not null,
  severity text not null default 'medium',
  title text not null,
  description text not null default '',
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, risk_key)
);

create table if not exists public.tlo_health_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  score_key text not null,
  score_type text not null default 'composite',
  score_value numeric(5, 2) not null default 0,
  previous_value numeric(5, 2) not null default 0,
  calculated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, score_key)
);

create table if not exists public.tlo_success_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  plan_key text not null,
  plan_name text not null,
  csm_user_id uuid references public.user_profiles(id) on delete set null,
  objectives jsonb not null default '[]'::jsonb,
  start_date date not null default current_date,
  end_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, plan_key)
);

create table if not exists public.tlo_quarterly_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  review_key text not null,
  quarter text not null,
  review_date date not null default current_date,
  attendees jsonb not null default '[]'::jsonb,
  outcomes jsonb not null default '[]'::jsonb,
  next_actions jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, review_key)
);

create table if not exists public.tlo_renewal_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  renewal_key text not null,
  contract_end_date date not null,
  renewal_amount_usd numeric(12, 2) not null default 0,
  renewal_probability numeric(5, 2) not null default 0,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  strategy text not null default '',
  status text not null default 'planning',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, renewal_key)
);

create table if not exists public.tlo_customer_milestones (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  milestone_key text not null,
  milestone_name text not null,
  milestone_type text not null default 'adoption',
  target_date date,
  achieved_at timestamptz,
  success_plan_id uuid references public.tlo_success_plans(id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, milestone_key)
);

create table if not exists public.tlo_commercial_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  total_tenants integer not null default 0,
  active_tenants integer not null default 0,
  trial_tenants integer not null default 0,
  churned_tenants integer not null default 0,
  mrr_usd numeric(14, 2) not null default 0,
  arr_usd numeric(14, 2) not null default 0,
  net_revenue_retention numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.tlo_growth_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  snapshot_key text not null,
  snapshot_date date not null default current_date,
  new_tenants_30d integer not null default 0,
  expansion_revenue_usd numeric(14, 2) not null default 0,
  contraction_revenue_usd numeric(14, 2) not null default 0,
  pipeline_value_usd numeric(14, 2) not null default 0,
  growth_rate_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, snapshot_key)
);

create table if not exists public.tlo_expansion_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_context_id uuid not null references public.tlo_tenant_contexts(id) on delete cascade,
  opportunity_key text not null,
  opportunity_type text not null default 'upsell',
  title text not null,
  estimated_value_usd numeric(12, 2) not null default 0,
  probability numeric(5, 2) not null default 0,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  expected_close_date date,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_context_id, opportunity_key)
);

create table if not exists public.tlo_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_tlo_tenant_contexts_org on public.tlo_tenant_contexts(organization_id);
create index if not exists idx_tlo_lifecycle_records_org on public.tlo_lifecycle_records(organization_id);
create index if not exists idx_tlo_lifecycle_transitions_org on public.tlo_lifecycle_transitions(organization_id);
create index if not exists idx_tlo_lifecycle_events_org on public.tlo_lifecycle_events(organization_id);
create index if not exists idx_tlo_reactivation_requests_org on public.tlo_reactivation_requests(organization_id);
create index if not exists idx_tlo_workspaces_org on public.tlo_workspaces(organization_id);
create index if not exists idx_tlo_environment_settings_org on public.tlo_environment_settings(organization_id);
create index if not exists idx_tlo_storage_management_org on public.tlo_storage_management(organization_id);
create index if not exists idx_tlo_operations_controls_org on public.tlo_operations_controls(organization_id);
create index if not exists idx_tlo_onboarding_flows_org on public.tlo_onboarding_flows(organization_id);
create index if not exists idx_tlo_onboarding_progress_org on public.tlo_onboarding_progress(organization_id);
create index if not exists idx_tlo_onboarding_validations_org on public.tlo_onboarding_validations(organization_id);
create index if not exists idx_tlo_go_live_checklists_org on public.tlo_go_live_checklists(organization_id);
create index if not exists idx_tlo_marketplace_modules_org on public.tlo_marketplace_modules(organization_id);
create index if not exists idx_tlo_module_installations_org on public.tlo_module_installations(organization_id);
create index if not exists idx_tlo_module_dependencies_org on public.tlo_module_dependencies(organization_id);
create index if not exists idx_tlo_module_compatibility_org on public.tlo_module_compatibility(organization_id);
create index if not exists idx_tlo_industry_packs_org on public.tlo_industry_packs(organization_id);
create index if not exists idx_tlo_pack_installations_org on public.tlo_pack_installations(organization_id);
create index if not exists idx_tlo_pack_versions_org on public.tlo_pack_versions(organization_id);
create index if not exists idx_tlo_pack_exports_org on public.tlo_pack_exports(organization_id);
create index if not exists idx_tlo_health_snapshots_org on public.tlo_health_snapshots(organization_id);
create index if not exists idx_tlo_health_dimensions_org on public.tlo_health_dimensions(organization_id);
create index if not exists idx_tlo_health_risks_org on public.tlo_health_risks(organization_id);
create index if not exists idx_tlo_health_scores_org on public.tlo_health_scores(organization_id);
create index if not exists idx_tlo_success_plans_org on public.tlo_success_plans(organization_id);
create index if not exists idx_tlo_quarterly_reviews_org on public.tlo_quarterly_reviews(organization_id);
create index if not exists idx_tlo_renewal_plans_org on public.tlo_renewal_plans(organization_id);
create index if not exists idx_tlo_customer_milestones_org on public.tlo_customer_milestones(organization_id);
create index if not exists idx_tlo_commercial_metrics_org on public.tlo_commercial_metrics(organization_id);
create index if not exists idx_tlo_growth_snapshots_org on public.tlo_growth_snapshots(organization_id);
create index if not exists idx_tlo_expansion_opportunities_org on public.tlo_expansion_opportunities(organization_id);
create index if not exists idx_tlo_audit_logs_org on public.tlo_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'tlo_tenant_contexts','tlo_lifecycle_records','tlo_lifecycle_transitions','tlo_reactivation_requests',
    'tlo_workspaces','tlo_environment_settings','tlo_storage_management','tlo_operations_controls',
    'tlo_onboarding_flows','tlo_onboarding_progress','tlo_onboarding_validations','tlo_go_live_checklists',
    'tlo_marketplace_modules','tlo_module_installations','tlo_module_dependencies','tlo_module_compatibility',
    'tlo_industry_packs','tlo_pack_installations','tlo_pack_versions','tlo_pack_exports',
    'tlo_health_snapshots','tlo_health_dimensions','tlo_health_risks','tlo_health_scores',
    'tlo_success_plans','tlo_quarterly_reviews','tlo_renewal_plans','tlo_customer_milestones',
    'tlo_commercial_metrics','tlo_growth_snapshots','tlo_expansion_opportunities'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.tlo_tenant_contexts enable row level security;
alter table public.tlo_lifecycle_records enable row level security;
alter table public.tlo_lifecycle_transitions enable row level security;
alter table public.tlo_lifecycle_events enable row level security;
alter table public.tlo_reactivation_requests enable row level security;
alter table public.tlo_workspaces enable row level security;
alter table public.tlo_environment_settings enable row level security;
alter table public.tlo_storage_management enable row level security;
alter table public.tlo_operations_controls enable row level security;
alter table public.tlo_onboarding_flows enable row level security;
alter table public.tlo_onboarding_progress enable row level security;
alter table public.tlo_onboarding_validations enable row level security;
alter table public.tlo_go_live_checklists enable row level security;
alter table public.tlo_marketplace_modules enable row level security;
alter table public.tlo_module_installations enable row level security;
alter table public.tlo_module_dependencies enable row level security;
alter table public.tlo_module_compatibility enable row level security;
alter table public.tlo_industry_packs enable row level security;
alter table public.tlo_pack_installations enable row level security;
alter table public.tlo_pack_versions enable row level security;
alter table public.tlo_pack_exports enable row level security;
alter table public.tlo_health_snapshots enable row level security;
alter table public.tlo_health_dimensions enable row level security;
alter table public.tlo_health_risks enable row level security;
alter table public.tlo_health_scores enable row level security;
alter table public.tlo_success_plans enable row level security;
alter table public.tlo_quarterly_reviews enable row level security;
alter table public.tlo_renewal_plans enable row level security;
alter table public.tlo_customer_milestones enable row level security;
alter table public.tlo_commercial_metrics enable row level security;
alter table public.tlo_growth_snapshots enable row level security;
alter table public.tlo_expansion_opportunities enable row level security;
alter table public.tlo_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'tlo_tenant_contexts','tlo_lifecycle_records','tlo_lifecycle_transitions','tlo_lifecycle_events','tlo_reactivation_requests',
    'tlo_workspaces','tlo_environment_settings','tlo_storage_management','tlo_operations_controls',
    'tlo_onboarding_flows','tlo_onboarding_progress','tlo_onboarding_validations','tlo_go_live_checklists',
    'tlo_marketplace_modules','tlo_module_installations','tlo_module_dependencies','tlo_module_compatibility',
    'tlo_industry_packs','tlo_pack_installations','tlo_pack_versions','tlo_pack_exports',
    'tlo_health_snapshots','tlo_health_dimensions','tlo_health_risks','tlo_health_scores',
    'tlo_success_plans','tlo_quarterly_reviews','tlo_renewal_plans','tlo_customer_milestones',
    'tlo_commercial_metrics','tlo_growth_snapshots','tlo_expansion_opportunities','tlo_audit_logs'
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
  ('tlo.view', 'View customer lifecycle and tenant operations platform data', 'tenant_lifecycle_ops'),
  ('tlo.manage', 'Manage tenant lifecycle, operations, onboarding, and marketplace modules', 'tenant_lifecycle_ops'),
  ('tlo.approve', 'Approve lifecycle transitions, reactivations, and go-live checklists', 'tenant_lifecycle_ops'),
  ('tlo.admin', 'Administer customer lifecycle and tenant operations platform governance', 'tenant_lifecycle_ops')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

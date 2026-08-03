-- Sprint 27: AI DevOps & Deployment Engineer

create table if not exists public.dd_engagements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  df_engagement_id uuid references public.df_engagements(id) on delete set null,
  qa_engagement_id uuid references public.qa_engagements(id) on delete set null,
  brd_id uuid references public.ba_brds(id) on delete set null,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  solution_architecture_id uuid references public.sa_solution_architectures(id) on delete set null,
  work_package_id uuid references public.df_work_packages(id) on delete set null,
  qa_release_readiness_id uuid references public.qa_release_readiness(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'devops_deployment',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.dd_cicd_pipelines (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  pipeline_key text not null,
  name text not null,
  platform text not null default 'github_actions',
  stages jsonb not null default '[]'::jsonb,
  triggers jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, pipeline_key)
);

create table if not exists public.dd_environments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  environment_key text not null,
  name text not null,
  environment_type text not null default 'staging',
  config jsonb not null default '{}'::jsonb,
  variables jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, environment_key)
);

create table if not exists public.dd_infrastructure_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  template_key text not null,
  name text not null,
  provider text not null default 'aws',
  template_type text not null default 'terraform',
  resources jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, template_key)
);

create table if not exists public.dd_docker_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  config_key text not null,
  name text not null,
  base_image text not null default '',
  dockerfile_content text not null default '',
  compose_services jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, config_key)
);

create table if not exists public.dd_kubernetes_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  namespace text not null default 'default',
  manifests jsonb not null default '[]'::jsonb,
  resource_limits jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.dd_release_orchestrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  orchestration_key text not null,
  name text not null,
  release_steps jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, orchestration_key)
);

create table if not exists public.dd_rollback_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  rollback_triggers jsonb not null default '[]'::jsonb,
  rollback_steps jsonb not null default '[]'::jsonb,
  recovery_time_minutes integer not null default 15,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.dd_blue_green_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  blue_environment text not null default '',
  green_environment text not null default '',
  switch_criteria jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.dd_canary_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  canary_percentage numeric(5, 2) not null default 10,
  promotion_criteria jsonb not null default '[]'::jsonb,
  rollback_thresholds jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.dd_monitoring_integrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  integration_key text not null,
  name text not null,
  provider text not null default 'datadog',
  metrics jsonb not null default '[]'::jsonb,
  alerts jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, integration_key)
);

create table if not exists public.dd_logging_integrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  integration_key text not null,
  name text not null,
  provider text not null default 'cloudwatch',
  log_sources jsonb not null default '[]'::jsonb,
  retention_days integer not null default 30,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, integration_key)
);

create table if not exists public.dd_health_checks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  check_key text not null,
  name text not null,
  endpoint text not null default '',
  check_interval_seconds integer not null default 60,
  thresholds jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, check_key)
);

create table if not exists public.dd_backup_verifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  verification_key text not null,
  name text not null,
  backup_targets jsonb not null default '[]'::jsonb,
  verification_results text not null default '',
  last_verified_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, verification_key)
);

create table if not exists public.dd_disaster_recovery_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  rto_minutes integer not null default 60,
  rpo_minutes integer not null default 15,
  recovery_steps jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.dd_cost_estimates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  estimate_key text not null,
  name text not null,
  monthly_cost_usd numeric(12, 2) not null default 0,
  cost_breakdown jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, estimate_key)
);

create table if not exists public.dd_deployment_approvals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  approval_key text not null,
  title text not null,
  approver_role text not null default 'release_manager',
  approval_criteria jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, approval_key)
);

create table if not exists public.dd_release_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.dd_engagements(id) on delete cascade,
  version_key text not null,
  version_number text not null,
  release_notes text not null default '',
  changelog jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, version_key)
);

create table if not exists public.dd_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_dd_engagements_org on public.dd_engagements(organization_id);
create index if not exists idx_dd_cicd_pipelines_org on public.dd_cicd_pipelines(organization_id);
create index if not exists idx_dd_environments_org on public.dd_environments(organization_id);
create index if not exists idx_dd_infrastructure_templates_org on public.dd_infrastructure_templates(organization_id);
create index if not exists idx_dd_docker_configs_org on public.dd_docker_configs(organization_id);
create index if not exists idx_dd_kubernetes_plans_org on public.dd_kubernetes_plans(organization_id);
create index if not exists idx_dd_release_orchestrations_org on public.dd_release_orchestrations(organization_id);
create index if not exists idx_dd_rollback_plans_org on public.dd_rollback_plans(organization_id);
create index if not exists idx_dd_blue_green_plans_org on public.dd_blue_green_plans(organization_id);
create index if not exists idx_dd_canary_plans_org on public.dd_canary_plans(organization_id);
create index if not exists idx_dd_monitoring_integrations_org on public.dd_monitoring_integrations(organization_id);
create index if not exists idx_dd_logging_integrations_org on public.dd_logging_integrations(organization_id);
create index if not exists idx_dd_health_checks_org on public.dd_health_checks(organization_id);
create index if not exists idx_dd_backup_verifications_org on public.dd_backup_verifications(organization_id);
create index if not exists idx_dd_disaster_recovery_plans_org on public.dd_disaster_recovery_plans(organization_id);
create index if not exists idx_dd_cost_estimates_org on public.dd_cost_estimates(organization_id);
create index if not exists idx_dd_deployment_approvals_org on public.dd_deployment_approvals(organization_id);
create index if not exists idx_dd_release_versions_org on public.dd_release_versions(organization_id);
create index if not exists idx_dd_audit_logs_org on public.dd_audit_logs(organization_id);

drop trigger if exists trg_dd_engagements_updated_at on public.dd_engagements;
create trigger trg_dd_engagements_updated_at before update on public.dd_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_cicd_pipelines_updated_at on public.dd_cicd_pipelines;
create trigger trg_dd_cicd_pipelines_updated_at before update on public.dd_cicd_pipelines for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_environments_updated_at on public.dd_environments;
create trigger trg_dd_environments_updated_at before update on public.dd_environments for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_infrastructure_templates_updated_at on public.dd_infrastructure_templates;
create trigger trg_dd_infrastructure_templates_updated_at before update on public.dd_infrastructure_templates for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_docker_configs_updated_at on public.dd_docker_configs;
create trigger trg_dd_docker_configs_updated_at before update on public.dd_docker_configs for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_kubernetes_plans_updated_at on public.dd_kubernetes_plans;
create trigger trg_dd_kubernetes_plans_updated_at before update on public.dd_kubernetes_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_release_orchestrations_updated_at on public.dd_release_orchestrations;
create trigger trg_dd_release_orchestrations_updated_at before update on public.dd_release_orchestrations for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_rollback_plans_updated_at on public.dd_rollback_plans;
create trigger trg_dd_rollback_plans_updated_at before update on public.dd_rollback_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_blue_green_plans_updated_at on public.dd_blue_green_plans;
create trigger trg_dd_blue_green_plans_updated_at before update on public.dd_blue_green_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_canary_plans_updated_at on public.dd_canary_plans;
create trigger trg_dd_canary_plans_updated_at before update on public.dd_canary_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_monitoring_integrations_updated_at on public.dd_monitoring_integrations;
create trigger trg_dd_monitoring_integrations_updated_at before update on public.dd_monitoring_integrations for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_logging_integrations_updated_at on public.dd_logging_integrations;
create trigger trg_dd_logging_integrations_updated_at before update on public.dd_logging_integrations for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_health_checks_updated_at on public.dd_health_checks;
create trigger trg_dd_health_checks_updated_at before update on public.dd_health_checks for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_backup_verifications_updated_at on public.dd_backup_verifications;
create trigger trg_dd_backup_verifications_updated_at before update on public.dd_backup_verifications for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_disaster_recovery_plans_updated_at on public.dd_disaster_recovery_plans;
create trigger trg_dd_disaster_recovery_plans_updated_at before update on public.dd_disaster_recovery_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_cost_estimates_updated_at on public.dd_cost_estimates;
create trigger trg_dd_cost_estimates_updated_at before update on public.dd_cost_estimates for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_deployment_approvals_updated_at on public.dd_deployment_approvals;
create trigger trg_dd_deployment_approvals_updated_at before update on public.dd_deployment_approvals for each row execute function public.set_updated_at();
drop trigger if exists trg_dd_release_versions_updated_at on public.dd_release_versions;
create trigger trg_dd_release_versions_updated_at before update on public.dd_release_versions for each row execute function public.set_updated_at();

alter table public.dd_engagements enable row level security;
alter table public.dd_cicd_pipelines enable row level security;
alter table public.dd_environments enable row level security;
alter table public.dd_infrastructure_templates enable row level security;
alter table public.dd_docker_configs enable row level security;
alter table public.dd_kubernetes_plans enable row level security;
alter table public.dd_release_orchestrations enable row level security;
alter table public.dd_rollback_plans enable row level security;
alter table public.dd_blue_green_plans enable row level security;
alter table public.dd_canary_plans enable row level security;
alter table public.dd_monitoring_integrations enable row level security;
alter table public.dd_logging_integrations enable row level security;
alter table public.dd_health_checks enable row level security;
alter table public.dd_backup_verifications enable row level security;
alter table public.dd_disaster_recovery_plans enable row level security;
alter table public.dd_cost_estimates enable row level security;
alter table public.dd_deployment_approvals enable row level security;
alter table public.dd_release_versions enable row level security;
alter table public.dd_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'dd_engagements', 'dd_cicd_pipelines', 'dd_environments', 'dd_infrastructure_templates',
    'dd_docker_configs', 'dd_kubernetes_plans', 'dd_release_orchestrations', 'dd_rollback_plans',
    'dd_blue_green_plans', 'dd_canary_plans', 'dd_monitoring_integrations', 'dd_logging_integrations',
    'dd_health_checks', 'dd_backup_verifications', 'dd_disaster_recovery_plans', 'dd_cost_estimates',
    'dd_deployment_approvals', 'dd_release_versions', 'dd_audit_logs'
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
  ('dd.view', 'View AI DevOps & Deployment engagements and artifacts', 'devops_deployment'),
  ('dd.manage', 'Create and edit DevOps deployment deliverables', 'devops_deployment'),
  ('dd.approve', 'Review and approve deployment outputs', 'devops_deployment'),
  ('dd.admin', 'Administer DevOps deployment pipeline and permissions', 'devops_deployment')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

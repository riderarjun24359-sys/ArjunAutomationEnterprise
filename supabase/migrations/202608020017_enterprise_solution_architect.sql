-- Sprint 24: AI Solution Architect

create table if not exists public.sa_engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  brd_id uuid references public.ba_brds(id) on delete set null,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'architecture_design',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.sa_solution_architectures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  title text not null,
  architecture_type text not null default 'enterprise',
  overview text not null default '',
  components jsonb not null default '[]'::jsonb,
  content text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sa_system_decompositions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  decomposition_key text not null,
  layers jsonb not null default '[]'::jsonb,
  description text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, decomposition_key)
);

create table if not exists public.sa_domain_models (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  model_key text not null,
  entities jsonb not null default '[]'::jsonb,
  relationships jsonb not null default '[]'::jsonb,
  description text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, model_key)
);

create table if not exists public.sa_database_schemas (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  schema_key text not null,
  tables jsonb not null default '[]'::jsonb,
  relationships jsonb not null default '[]'::jsonb,
  migration_notes text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, schema_key)
);

create table if not exists public.sa_api_contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  contract_key text not null,
  endpoints jsonb not null default '[]'::jsonb,
  openapi_spec text not null default '',
  version text not null default '1.0.0',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, contract_key)
);

create table if not exists public.sa_module_selections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  module_name text not null,
  module_key text not null,
  platform_module text not null default '',
  selection_rationale text not null default '',
  status text not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, module_key)
);

create table if not exists public.sa_build_reuse_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  item_key text not null,
  component_name text not null,
  recommendation text not null default 'reuse',
  rationale text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, item_key)
);

create table if not exists public.sa_integration_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  plan_key text not null,
  integrations jsonb not null default '[]'::jsonb,
  data_flow text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.sa_security_architectures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  security_key text not null,
  auth_model text not null default '',
  encryption text not null default '',
  controls jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, security_key)
);

create table if not exists public.sa_scalability_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  plan_key text not null,
  scaling_strategy text not null default '',
  targets jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.sa_performance_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  plan_key text not null,
  performance_targets jsonb not null default '[]'::jsonb,
  optimization_notes text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.sa_technology_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  decision_key text not null,
  title text not null,
  context text not null default '',
  decision text not null default '',
  consequences text not null default '',
  status text not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, decision_key)
);

create table if not exists public.sa_deployment_architectures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  name text not null,
  deployment_key text not null,
  environments jsonb not null default '[]'::jsonb,
  infrastructure text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, deployment_key)
);

create table if not exists public.sa_sprint_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  sprints jsonb not null default '[]'::jsonb,
  total_sprints integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.sa_dependency_analyses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  analysis_key text not null,
  dependencies jsonb not null default '[]'::jsonb,
  critical_path text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.sa_architecture_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  reviewer_id uuid references public.employees(id) on delete set null,
  review_status text not null default 'pending',
  comments text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sa_architecture_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.sa_engagements(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  content text not null default '',
  change_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, version_number)
);

create table if not exists public.sa_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_sa_engagements_org on public.sa_engagements(organization_id);
create index if not exists idx_sa_solution_architectures_org on public.sa_solution_architectures(organization_id);
create index if not exists idx_sa_system_decompositions_org on public.sa_system_decompositions(organization_id);
create index if not exists idx_sa_domain_models_org on public.sa_domain_models(organization_id);
create index if not exists idx_sa_database_schemas_org on public.sa_database_schemas(organization_id);
create index if not exists idx_sa_api_contracts_org on public.sa_api_contracts(organization_id);
create index if not exists idx_sa_module_selections_org on public.sa_module_selections(organization_id);
create index if not exists idx_sa_build_reuse_recommendations_org on public.sa_build_reuse_recommendations(organization_id);
create index if not exists idx_sa_integration_plans_org on public.sa_integration_plans(organization_id);
create index if not exists idx_sa_security_architectures_org on public.sa_security_architectures(organization_id);
create index if not exists idx_sa_scalability_plans_org on public.sa_scalability_plans(organization_id);
create index if not exists idx_sa_performance_plans_org on public.sa_performance_plans(organization_id);
create index if not exists idx_sa_technology_decisions_org on public.sa_technology_decisions(organization_id);
create index if not exists idx_sa_deployment_architectures_org on public.sa_deployment_architectures(organization_id);
create index if not exists idx_sa_sprint_plans_org on public.sa_sprint_plans(organization_id);
create index if not exists idx_sa_dependency_analyses_org on public.sa_dependency_analyses(organization_id);
create index if not exists idx_sa_architecture_reviews_org on public.sa_architecture_reviews(organization_id);
create index if not exists idx_sa_architecture_versions_org on public.sa_architecture_versions(organization_id);
create index if not exists idx_sa_audit_logs_org on public.sa_audit_logs(organization_id);

drop trigger if exists trg_sa_engagements_updated_at on public.sa_engagements;
create trigger trg_sa_engagements_updated_at before update on public.sa_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_solution_architectures_updated_at on public.sa_solution_architectures;
create trigger trg_sa_solution_architectures_updated_at before update on public.sa_solution_architectures for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_system_decompositions_updated_at on public.sa_system_decompositions;
create trigger trg_sa_system_decompositions_updated_at before update on public.sa_system_decompositions for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_domain_models_updated_at on public.sa_domain_models;
create trigger trg_sa_domain_models_updated_at before update on public.sa_domain_models for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_database_schemas_updated_at on public.sa_database_schemas;
create trigger trg_sa_database_schemas_updated_at before update on public.sa_database_schemas for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_api_contracts_updated_at on public.sa_api_contracts;
create trigger trg_sa_api_contracts_updated_at before update on public.sa_api_contracts for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_module_selections_updated_at on public.sa_module_selections;
create trigger trg_sa_module_selections_updated_at before update on public.sa_module_selections for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_build_reuse_recommendations_updated_at on public.sa_build_reuse_recommendations;
create trigger trg_sa_build_reuse_recommendations_updated_at before update on public.sa_build_reuse_recommendations for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_integration_plans_updated_at on public.sa_integration_plans;
create trigger trg_sa_integration_plans_updated_at before update on public.sa_integration_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_security_architectures_updated_at on public.sa_security_architectures;
create trigger trg_sa_security_architectures_updated_at before update on public.sa_security_architectures for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_scalability_plans_updated_at on public.sa_scalability_plans;
create trigger trg_sa_scalability_plans_updated_at before update on public.sa_scalability_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_performance_plans_updated_at on public.sa_performance_plans;
create trigger trg_sa_performance_plans_updated_at before update on public.sa_performance_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_technology_decisions_updated_at on public.sa_technology_decisions;
create trigger trg_sa_technology_decisions_updated_at before update on public.sa_technology_decisions for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_deployment_architectures_updated_at on public.sa_deployment_architectures;
create trigger trg_sa_deployment_architectures_updated_at before update on public.sa_deployment_architectures for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_sprint_plans_updated_at on public.sa_sprint_plans;
create trigger trg_sa_sprint_plans_updated_at before update on public.sa_sprint_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_sa_dependency_analyses_updated_at on public.sa_dependency_analyses;
create trigger trg_sa_dependency_analyses_updated_at before update on public.sa_dependency_analyses for each row execute function public.set_updated_at();

alter table public.sa_engagements enable row level security;
alter table public.sa_solution_architectures enable row level security;
alter table public.sa_system_decompositions enable row level security;
alter table public.sa_domain_models enable row level security;
alter table public.sa_database_schemas enable row level security;
alter table public.sa_api_contracts enable row level security;
alter table public.sa_module_selections enable row level security;
alter table public.sa_build_reuse_recommendations enable row level security;
alter table public.sa_integration_plans enable row level security;
alter table public.sa_security_architectures enable row level security;
alter table public.sa_scalability_plans enable row level security;
alter table public.sa_performance_plans enable row level security;
alter table public.sa_technology_decisions enable row level security;
alter table public.sa_deployment_architectures enable row level security;
alter table public.sa_sprint_plans enable row level security;
alter table public.sa_dependency_analyses enable row level security;
alter table public.sa_architecture_reviews enable row level security;
alter table public.sa_architecture_versions enable row level security;
alter table public.sa_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'sa_engagements', 'sa_solution_architectures', 'sa_system_decompositions', 'sa_domain_models',
    'sa_database_schemas', 'sa_api_contracts', 'sa_module_selections', 'sa_build_reuse_recommendations',
    'sa_integration_plans', 'sa_security_architectures', 'sa_scalability_plans', 'sa_performance_plans',
    'sa_technology_decisions', 'sa_deployment_architectures', 'sa_sprint_plans', 'sa_dependency_analyses',
    'sa_architecture_reviews', 'sa_architecture_versions', 'sa_audit_logs'
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
  ('sa.view', 'View AI Solution Architect engagements and artifacts', 'solution_architect'),
  ('sa.manage', 'Create and edit solution architect deliverables', 'solution_architect'),
  ('sa.approve', 'Review and approve architecture outputs', 'solution_architect'),
  ('sa.admin', 'Administer solution architect pipeline and permissions', 'solution_architect')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

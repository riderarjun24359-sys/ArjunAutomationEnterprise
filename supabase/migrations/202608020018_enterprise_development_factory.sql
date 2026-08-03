-- Sprint 25: AI Development Factory

create table if not exists public.df_engagements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  brd_id uuid references public.ba_brds(id) on delete set null,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  solution_architecture_id uuid references public.sa_solution_architectures(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'development_factory',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.df_work_packages (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  package_key text not null,
  title text not null,
  description text not null default '',
  deliverables jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, package_key)
);

create table if not exists public.df_backend_workflows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  workflow_key text not null,
  name text not null,
  steps jsonb not null default '[]'::jsonb,
  target_modules text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, workflow_key)
);

create table if not exists public.df_frontend_workflows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  workflow_key text not null,
  name text not null,
  steps jsonb not null default '[]'::jsonb,
  target_modules text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, workflow_key)
);

create table if not exists public.df_api_scaffolds (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  scaffold_key text not null,
  name text not null,
  endpoints jsonb not null default '[]'::jsonb,
  scaffold_spec text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, scaffold_key)
);

create table if not exists public.df_migration_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  migrations jsonb not null default '[]'::jsonb,
  rollback_notes text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.df_repositories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  repo_key text not null,
  name text not null,
  repo_type text not null default 'service',
  structure jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, repo_key)
);

create table if not exists public.df_components (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  component_key text not null,
  name text not null,
  component_type text not null default 'ui',
  specification text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, component_key)
);

create table if not exists public.df_test_scaffolds (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  scaffold_key text not null,
  name text not null,
  test_type text not null default 'unit',
  test_cases jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, scaffold_key)
);

create table if not exists public.df_coding_standards (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  standard_key text not null,
  name text not null,
  rules jsonb not null default '[]'::jsonb,
  enforcement_level text not null default 'required',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, standard_key)
);

create table if not exists public.df_secure_coding_validations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  checks jsonb not null default '[]'::jsonb,
  findings text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.df_module_recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  recommendation_key text not null,
  module_name text not null,
  platform_module text not null default '',
  rationale text not null default '',
  status text not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, recommendation_key)
);

create table if not exists public.df_pull_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  pr_key text not null,
  title text not null,
  description text not null default '',
  changed_files jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, pr_key)
);

create table if not exists public.df_code_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  review_key text not null,
  title text not null,
  checklist jsonb not null default '[]'::jsonb,
  reviewer_id uuid references public.employees(id) on delete set null,
  review_status text not null default 'pending',
  comments text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, review_key)
);

create table if not exists public.df_technical_docs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  doc_key text not null,
  title text not null,
  doc_type text not null default 'technical',
  content text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, doc_key)
);

create table if not exists public.df_progress_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  tracking_key text not null,
  milestone text not null,
  progress_percent numeric(5, 2) not null default 0,
  notes text not null default '',
  status text not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, tracking_key)
);

create table if not exists public.df_build_artifacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  artifact_key text not null,
  name text not null,
  artifact_type text not null default 'build',
  artifact_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'generated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, artifact_key)
);

create table if not exists public.df_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.df_engagements(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  content text not null default '',
  change_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, version_number)
);

create table if not exists public.df_audit_logs (
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

create index if not exists idx_df_engagements_org on public.df_engagements(organization_id);
create index if not exists idx_df_work_packages_org on public.df_work_packages(organization_id);
create index if not exists idx_df_backend_workflows_org on public.df_backend_workflows(organization_id);
create index if not exists idx_df_frontend_workflows_org on public.df_frontend_workflows(organization_id);
create index if not exists idx_df_api_scaffolds_org on public.df_api_scaffolds(organization_id);
create index if not exists idx_df_migration_plans_org on public.df_migration_plans(organization_id);
create index if not exists idx_df_repositories_org on public.df_repositories(organization_id);
create index if not exists idx_df_components_org on public.df_components(organization_id);
create index if not exists idx_df_test_scaffolds_org on public.df_test_scaffolds(organization_id);
create index if not exists idx_df_coding_standards_org on public.df_coding_standards(organization_id);
create index if not exists idx_df_secure_coding_validations_org on public.df_secure_coding_validations(organization_id);
create index if not exists idx_df_module_recommendations_org on public.df_module_recommendations(organization_id);
create index if not exists idx_df_pull_requests_org on public.df_pull_requests(organization_id);
create index if not exists idx_df_code_reviews_org on public.df_code_reviews(organization_id);
create index if not exists idx_df_technical_docs_org on public.df_technical_docs(organization_id);
create index if not exists idx_df_progress_tracking_org on public.df_progress_tracking(organization_id);
create index if not exists idx_df_build_artifacts_org on public.df_build_artifacts(organization_id);
create index if not exists idx_df_versions_org on public.df_versions(organization_id);
create index if not exists idx_df_audit_logs_org on public.df_audit_logs(organization_id);

drop trigger if exists trg_df_engagements_updated_at on public.df_engagements;
create trigger trg_df_engagements_updated_at before update on public.df_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_df_work_packages_updated_at on public.df_work_packages;
create trigger trg_df_work_packages_updated_at before update on public.df_work_packages for each row execute function public.set_updated_at();
drop trigger if exists trg_df_backend_workflows_updated_at on public.df_backend_workflows;
create trigger trg_df_backend_workflows_updated_at before update on public.df_backend_workflows for each row execute function public.set_updated_at();
drop trigger if exists trg_df_frontend_workflows_updated_at on public.df_frontend_workflows;
create trigger trg_df_frontend_workflows_updated_at before update on public.df_frontend_workflows for each row execute function public.set_updated_at();
drop trigger if exists trg_df_api_scaffolds_updated_at on public.df_api_scaffolds;
create trigger trg_df_api_scaffolds_updated_at before update on public.df_api_scaffolds for each row execute function public.set_updated_at();
drop trigger if exists trg_df_migration_plans_updated_at on public.df_migration_plans;
create trigger trg_df_migration_plans_updated_at before update on public.df_migration_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_df_repositories_updated_at on public.df_repositories;
create trigger trg_df_repositories_updated_at before update on public.df_repositories for each row execute function public.set_updated_at();
drop trigger if exists trg_df_components_updated_at on public.df_components;
create trigger trg_df_components_updated_at before update on public.df_components for each row execute function public.set_updated_at();
drop trigger if exists trg_df_test_scaffolds_updated_at on public.df_test_scaffolds;
create trigger trg_df_test_scaffolds_updated_at before update on public.df_test_scaffolds for each row execute function public.set_updated_at();
drop trigger if exists trg_df_coding_standards_updated_at on public.df_coding_standards;
create trigger trg_df_coding_standards_updated_at before update on public.df_coding_standards for each row execute function public.set_updated_at();
drop trigger if exists trg_df_secure_coding_validations_updated_at on public.df_secure_coding_validations;
create trigger trg_df_secure_coding_validations_updated_at before update on public.df_secure_coding_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_df_module_recommendations_updated_at on public.df_module_recommendations;
create trigger trg_df_module_recommendations_updated_at before update on public.df_module_recommendations for each row execute function public.set_updated_at();
drop trigger if exists trg_df_pull_requests_updated_at on public.df_pull_requests;
create trigger trg_df_pull_requests_updated_at before update on public.df_pull_requests for each row execute function public.set_updated_at();
drop trigger if exists trg_df_code_reviews_updated_at on public.df_code_reviews;
create trigger trg_df_code_reviews_updated_at before update on public.df_code_reviews for each row execute function public.set_updated_at();
drop trigger if exists trg_df_technical_docs_updated_at on public.df_technical_docs;
create trigger trg_df_technical_docs_updated_at before update on public.df_technical_docs for each row execute function public.set_updated_at();
drop trigger if exists trg_df_progress_tracking_updated_at on public.df_progress_tracking;
create trigger trg_df_progress_tracking_updated_at before update on public.df_progress_tracking for each row execute function public.set_updated_at();
drop trigger if exists trg_df_build_artifacts_updated_at on public.df_build_artifacts;
create trigger trg_df_build_artifacts_updated_at before update on public.df_build_artifacts for each row execute function public.set_updated_at();

alter table public.df_engagements enable row level security;
alter table public.df_work_packages enable row level security;
alter table public.df_backend_workflows enable row level security;
alter table public.df_frontend_workflows enable row level security;
alter table public.df_api_scaffolds enable row level security;
alter table public.df_migration_plans enable row level security;
alter table public.df_repositories enable row level security;
alter table public.df_components enable row level security;
alter table public.df_test_scaffolds enable row level security;
alter table public.df_coding_standards enable row level security;
alter table public.df_secure_coding_validations enable row level security;
alter table public.df_module_recommendations enable row level security;
alter table public.df_pull_requests enable row level security;
alter table public.df_code_reviews enable row level security;
alter table public.df_technical_docs enable row level security;
alter table public.df_progress_tracking enable row level security;
alter table public.df_build_artifacts enable row level security;
alter table public.df_versions enable row level security;
alter table public.df_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'df_engagements', 'df_work_packages', 'df_backend_workflows', 'df_frontend_workflows',
    'df_api_scaffolds', 'df_migration_plans', 'df_repositories', 'df_components',
    'df_test_scaffolds', 'df_coding_standards', 'df_secure_coding_validations', 'df_module_recommendations',
    'df_pull_requests', 'df_code_reviews', 'df_technical_docs', 'df_progress_tracking',
    'df_build_artifacts', 'df_versions', 'df_audit_logs'
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
  ('df.view', 'View AI Development Factory engagements and artifacts', 'development_factory'),
  ('df.manage', 'Create and edit development factory deliverables', 'development_factory'),
  ('df.approve', 'Review and approve development outputs', 'development_factory'),
  ('df.admin', 'Administer development factory pipeline and permissions', 'development_factory')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

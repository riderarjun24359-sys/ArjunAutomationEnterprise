-- Sprint 26: AI QA Engineer

create table if not exists public.qa_engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  df_engagement_id uuid references public.df_engagements(id) on delete set null,
  brd_id uuid references public.ba_brds(id) on delete set null,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  solution_architecture_id uuid references public.sa_solution_architectures(id) on delete set null,
  work_package_id uuid references public.df_work_packages(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'qa_engineering',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.qa_test_strategies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  strategy_key text not null,
  title text not null,
  scope text not null default '',
  approach text not null default '',
  test_levels jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, strategy_key)
);

create table if not exists public.qa_unit_test_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  target_modules text not null default '',
  test_cases jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.qa_integration_test_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  integration_points jsonb not null default '[]'::jsonb,
  test_scenarios jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.qa_e2e_test_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  user_journeys jsonb not null default '[]'::jsonb,
  test_scenarios jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.qa_regression_analyses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  analysis_key text not null,
  name text not null,
  affected_areas jsonb not null default '[]'::jsonb,
  regression_risks text not null default '',
  recommendations text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.qa_risk_based_tests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  test_key text not null,
  name text not null,
  risk_level text not null default 'medium',
  risk_factors jsonb not null default '[]'::jsonb,
  test_priority text not null default 'medium',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, test_key)
);

create table if not exists public.qa_security_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  security_checks jsonb not null default '[]'::jsonb,
  findings text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_performance_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  performance_targets jsonb not null default '[]'::jsonb,
  results text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_accessibility_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  wcag_level text not null default 'AA',
  checks jsonb not null default '[]'::jsonb,
  findings text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_api_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  endpoints jsonb not null default '[]'::jsonb,
  validation_results text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_database_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  schema_checks jsonb not null default '[]'::jsonb,
  data_integrity_checks jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_ui_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  validation_key text not null,
  name text not null,
  ui_components jsonb not null default '[]'::jsonb,
  validation_results text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, validation_key)
);

create table if not exists public.qa_bug_triages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  bug_key text not null,
  title text not null,
  severity text not null default 'medium',
  priority text not null default 'medium',
  triage_notes text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, bug_key)
);

create table if not exists public.qa_defect_analyses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  analysis_key text not null,
  title text not null,
  root_cause text not null default '',
  impact_analysis text not null default '',
  remediation text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.qa_coverage_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  analytics_key text not null,
  name text not null,
  coverage_metrics jsonb not null default '[]'::jsonb,
  coverage_percent numeric(5, 2) not null default 0,
  gaps text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analytics_key)
);

create table if not exists public.qa_release_readiness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  assessment_key text not null,
  title text not null,
  readiness_criteria jsonb not null default '[]'::jsonb,
  blockers jsonb not null default '[]'::jsonb,
  recommendation text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, assessment_key)
);

create table if not exists public.qa_quality_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.qa_engagements(id) on delete cascade,
  score_key text not null,
  name text not null,
  overall_score numeric(5, 2) not null default 0,
  dimension_scores jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, score_key)
);

create table if not exists public.qa_audit_logs (
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

create index if not exists idx_qa_engagements_org on public.qa_engagements(organization_id);
create index if not exists idx_qa_test_strategies_org on public.qa_test_strategies(organization_id);
create index if not exists idx_qa_unit_test_plans_org on public.qa_unit_test_plans(organization_id);
create index if not exists idx_qa_integration_test_plans_org on public.qa_integration_test_plans(organization_id);
create index if not exists idx_qa_e2e_test_plans_org on public.qa_e2e_test_plans(organization_id);
create index if not exists idx_qa_regression_analyses_org on public.qa_regression_analyses(organization_id);
create index if not exists idx_qa_risk_based_tests_org on public.qa_risk_based_tests(organization_id);
create index if not exists idx_qa_security_validations_org on public.qa_security_validations(organization_id);
create index if not exists idx_qa_performance_validations_org on public.qa_performance_validations(organization_id);
create index if not exists idx_qa_accessibility_validations_org on public.qa_accessibility_validations(organization_id);
create index if not exists idx_qa_api_validations_org on public.qa_api_validations(organization_id);
create index if not exists idx_qa_database_validations_org on public.qa_database_validations(organization_id);
create index if not exists idx_qa_ui_validations_org on public.qa_ui_validations(organization_id);
create index if not exists idx_qa_bug_triages_org on public.qa_bug_triages(organization_id);
create index if not exists idx_qa_defect_analyses_org on public.qa_defect_analyses(organization_id);
create index if not exists idx_qa_coverage_analytics_org on public.qa_coverage_analytics(organization_id);
create index if not exists idx_qa_release_readiness_org on public.qa_release_readiness(organization_id);
create index if not exists idx_qa_quality_scores_org on public.qa_quality_scores(organization_id);
create index if not exists idx_qa_audit_logs_org on public.qa_audit_logs(organization_id);

drop trigger if exists trg_qa_engagements_updated_at on public.qa_engagements;
create trigger trg_qa_engagements_updated_at before update on public.qa_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_test_strategies_updated_at on public.qa_test_strategies;
create trigger trg_qa_test_strategies_updated_at before update on public.qa_test_strategies for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_unit_test_plans_updated_at on public.qa_unit_test_plans;
create trigger trg_qa_unit_test_plans_updated_at before update on public.qa_unit_test_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_integration_test_plans_updated_at on public.qa_integration_test_plans;
create trigger trg_qa_integration_test_plans_updated_at before update on public.qa_integration_test_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_e2e_test_plans_updated_at on public.qa_e2e_test_plans;
create trigger trg_qa_e2e_test_plans_updated_at before update on public.qa_e2e_test_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_regression_analyses_updated_at on public.qa_regression_analyses;
create trigger trg_qa_regression_analyses_updated_at before update on public.qa_regression_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_risk_based_tests_updated_at on public.qa_risk_based_tests;
create trigger trg_qa_risk_based_tests_updated_at before update on public.qa_risk_based_tests for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_security_validations_updated_at on public.qa_security_validations;
create trigger trg_qa_security_validations_updated_at before update on public.qa_security_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_performance_validations_updated_at on public.qa_performance_validations;
create trigger trg_qa_performance_validations_updated_at before update on public.qa_performance_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_accessibility_validations_updated_at on public.qa_accessibility_validations;
create trigger trg_qa_accessibility_validations_updated_at before update on public.qa_accessibility_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_api_validations_updated_at on public.qa_api_validations;
create trigger trg_qa_api_validations_updated_at before update on public.qa_api_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_database_validations_updated_at on public.qa_database_validations;
create trigger trg_qa_database_validations_updated_at before update on public.qa_database_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_ui_validations_updated_at on public.qa_ui_validations;
create trigger trg_qa_ui_validations_updated_at before update on public.qa_ui_validations for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_bug_triages_updated_at on public.qa_bug_triages;
create trigger trg_qa_bug_triages_updated_at before update on public.qa_bug_triages for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_defect_analyses_updated_at on public.qa_defect_analyses;
create trigger trg_qa_defect_analyses_updated_at before update on public.qa_defect_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_coverage_analytics_updated_at on public.qa_coverage_analytics;
create trigger trg_qa_coverage_analytics_updated_at before update on public.qa_coverage_analytics for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_release_readiness_updated_at on public.qa_release_readiness;
create trigger trg_qa_release_readiness_updated_at before update on public.qa_release_readiness for each row execute function public.set_updated_at();
drop trigger if exists trg_qa_quality_scores_updated_at on public.qa_quality_scores;
create trigger trg_qa_quality_scores_updated_at before update on public.qa_quality_scores for each row execute function public.set_updated_at();

alter table public.qa_engagements enable row level security;
alter table public.qa_test_strategies enable row level security;
alter table public.qa_unit_test_plans enable row level security;
alter table public.qa_integration_test_plans enable row level security;
alter table public.qa_e2e_test_plans enable row level security;
alter table public.qa_regression_analyses enable row level security;
alter table public.qa_risk_based_tests enable row level security;
alter table public.qa_security_validations enable row level security;
alter table public.qa_performance_validations enable row level security;
alter table public.qa_accessibility_validations enable row level security;
alter table public.qa_api_validations enable row level security;
alter table public.qa_database_validations enable row level security;
alter table public.qa_ui_validations enable row level security;
alter table public.qa_bug_triages enable row level security;
alter table public.qa_defect_analyses enable row level security;
alter table public.qa_coverage_analytics enable row level security;
alter table public.qa_release_readiness enable row level security;
alter table public.qa_quality_scores enable row level security;
alter table public.qa_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'qa_engagements', 'qa_test_strategies', 'qa_unit_test_plans', 'qa_integration_test_plans',
    'qa_e2e_test_plans', 'qa_regression_analyses', 'qa_risk_based_tests', 'qa_security_validations',
    'qa_performance_validations', 'qa_accessibility_validations', 'qa_api_validations',
    'qa_database_validations', 'qa_ui_validations', 'qa_bug_triages', 'qa_defect_analyses',
    'qa_coverage_analytics', 'qa_release_readiness', 'qa_quality_scores', 'qa_audit_logs'
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
  ('qa.view', 'View AI QA Engineer engagements and artifacts', 'qa_engineer'),
  ('qa.manage', 'Create and edit QA engineer deliverables', 'qa_engineer'),
  ('qa.approve', 'Review and approve QA outputs', 'qa_engineer'),
  ('qa.admin', 'Administer QA engineer pipeline and permissions', 'qa_engineer')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

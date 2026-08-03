-- Sprint 28: AI Customer Success Manager

create table if not exists public.cs_engagements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  df_engagement_id uuid references public.df_engagements(id) on delete set null,
  qa_engagement_id uuid references public.qa_engagements(id) on delete set null,
  dd_engagement_id uuid references public.dd_engagements(id) on delete set null,
  brd_id uuid references public.ba_brds(id) on delete set null,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  solution_architecture_id uuid references public.sa_solution_architectures(id) on delete set null,
  work_package_id uuid references public.df_work_packages(id) on delete set null,
  qa_release_readiness_id uuid references public.qa_release_readiness(id) on delete set null,
  dd_release_version_id uuid references public.dd_release_versions(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'customer_success',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.cs_onboarding_workflows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  workflow_key text not null,
  name text not null,
  phases jsonb not null default '[]'::jsonb,
  milestones jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, workflow_key)
);

create table if not exists public.cs_adoption_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  tracking_key text not null,
  name text not null,
  feature_adoptions jsonb not null default '[]'::jsonb,
  adoption_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, tracking_key)
);

create table if not exists public.cs_health_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  score_key text not null,
  name text not null,
  overall_score numeric(5, 2) not null default 0,
  dimension_scores jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, score_key)
);

create table if not exists public.cs_renewal_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  renewal_date date,
  renewal_value_usd numeric(12, 2) not null default 0,
  renewal_actions jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.cs_expansion_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  opportunity_key text not null,
  name text not null,
  opportunity_type text not null default 'upsell',
  estimated_value_usd numeric(12, 2) not null default 0,
  signals jsonb not null default '[]'::jsonb,
  status text not null default 'identified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, opportunity_key)
);

create table if not exists public.cs_risk_analyses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  analysis_key text not null,
  name text not null,
  risk_level text not null default 'medium',
  risk_factors jsonb not null default '[]'::jsonb,
  mitigation_plan text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.cs_support_trend_analyses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  analysis_key text not null,
  name text not null,
  trend_metrics jsonb not null default '[]'::jsonb,
  insights text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.cs_success_playbooks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  playbook_key text not null,
  name text not null,
  playbook_type text not null default 'onboarding',
  steps jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, playbook_key)
);

create table if not exists public.cs_qbr_reports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  report_key text not null,
  title text not null,
  quarter text not null default '',
  report_sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, report_key)
);

create table if not exists public.cs_communication_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  plan_key text not null,
  name text not null,
  channels jsonb not null default '[]'::jsonb,
  cadence text not null default 'monthly',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, plan_key)
);

create table if not exists public.cs_training_recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  recommendation_key text not null,
  name text not null,
  training_modules jsonb not null default '[]'::jsonb,
  priority text not null default 'medium',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, recommendation_key)
);

create table if not exists public.cs_feedback_analyses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  analysis_key text not null,
  name text not null,
  sentiment_score numeric(5, 2) not null default 0,
  themes jsonb not null default '[]'::jsonb,
  recommendations text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, analysis_key)
);

create table if not exists public.cs_sla_monitoring (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  monitoring_key text not null,
  name text not null,
  sla_targets jsonb not null default '[]'::jsonb,
  compliance_percent numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, monitoring_key)
);

create table if not exists public.cs_success_kpi_dashboards (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  dashboard_key text not null,
  name text not null,
  kpis jsonb not null default '[]'::jsonb,
  refresh_cadence text not null default 'weekly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, dashboard_key)
);

create table if not exists public.cs_churn_predictions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  prediction_key text not null,
  name text not null,
  churn_probability numeric(5, 2) not null default 0,
  risk_signals jsonb not null default '[]'::jsonb,
  retention_actions jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, prediction_key)
);

create table if not exists public.cs_lifecycle_management (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  lifecycle_key text not null,
  name text not null,
  current_stage text not null default 'onboarding',
  stage_history jsonb not null default '[]'::jsonb,
  next_actions jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, lifecycle_key)
);

create table if not exists public.cs_executive_summaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.cs_engagements(id) on delete cascade,
  summary_key text not null,
  title text not null,
  summary_content text not null default '',
  key_metrics jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, summary_key)
);

create table if not exists public.cs_audit_logs (
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

create index if not exists idx_cs_engagements_org on public.cs_engagements(organization_id);
create index if not exists idx_cs_onboarding_workflows_org on public.cs_onboarding_workflows(organization_id);
create index if not exists idx_cs_adoption_tracking_org on public.cs_adoption_tracking(organization_id);
create index if not exists idx_cs_health_scores_org on public.cs_health_scores(organization_id);
create index if not exists idx_cs_renewal_plans_org on public.cs_renewal_plans(organization_id);
create index if not exists idx_cs_expansion_opportunities_org on public.cs_expansion_opportunities(organization_id);
create index if not exists idx_cs_risk_analyses_org on public.cs_risk_analyses(organization_id);
create index if not exists idx_cs_support_trend_analyses_org on public.cs_support_trend_analyses(organization_id);
create index if not exists idx_cs_success_playbooks_org on public.cs_success_playbooks(organization_id);
create index if not exists idx_cs_qbr_reports_org on public.cs_qbr_reports(organization_id);
create index if not exists idx_cs_communication_plans_org on public.cs_communication_plans(organization_id);
create index if not exists idx_cs_training_recommendations_org on public.cs_training_recommendations(organization_id);
create index if not exists idx_cs_feedback_analyses_org on public.cs_feedback_analyses(organization_id);
create index if not exists idx_cs_sla_monitoring_org on public.cs_sla_monitoring(organization_id);
create index if not exists idx_cs_success_kpi_dashboards_org on public.cs_success_kpi_dashboards(organization_id);
create index if not exists idx_cs_churn_predictions_org on public.cs_churn_predictions(organization_id);
create index if not exists idx_cs_lifecycle_management_org on public.cs_lifecycle_management(organization_id);
create index if not exists idx_cs_executive_summaries_org on public.cs_executive_summaries(organization_id);
create index if not exists idx_cs_audit_logs_org on public.cs_audit_logs(organization_id);

drop trigger if exists trg_cs_engagements_updated_at on public.cs_engagements;
create trigger trg_cs_engagements_updated_at before update on public.cs_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_onboarding_workflows_updated_at on public.cs_onboarding_workflows;
create trigger trg_cs_onboarding_workflows_updated_at before update on public.cs_onboarding_workflows for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_adoption_tracking_updated_at on public.cs_adoption_tracking;
create trigger trg_cs_adoption_tracking_updated_at before update on public.cs_adoption_tracking for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_health_scores_updated_at on public.cs_health_scores;
create trigger trg_cs_health_scores_updated_at before update on public.cs_health_scores for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_renewal_plans_updated_at on public.cs_renewal_plans;
create trigger trg_cs_renewal_plans_updated_at before update on public.cs_renewal_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_expansion_opportunities_updated_at on public.cs_expansion_opportunities;
create trigger trg_cs_expansion_opportunities_updated_at before update on public.cs_expansion_opportunities for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_risk_analyses_updated_at on public.cs_risk_analyses;
create trigger trg_cs_risk_analyses_updated_at before update on public.cs_risk_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_support_trend_analyses_updated_at on public.cs_support_trend_analyses;
create trigger trg_cs_support_trend_analyses_updated_at before update on public.cs_support_trend_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_success_playbooks_updated_at on public.cs_success_playbooks;
create trigger trg_cs_success_playbooks_updated_at before update on public.cs_success_playbooks for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_qbr_reports_updated_at on public.cs_qbr_reports;
create trigger trg_cs_qbr_reports_updated_at before update on public.cs_qbr_reports for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_communication_plans_updated_at on public.cs_communication_plans;
create trigger trg_cs_communication_plans_updated_at before update on public.cs_communication_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_training_recommendations_updated_at on public.cs_training_recommendations;
create trigger trg_cs_training_recommendations_updated_at before update on public.cs_training_recommendations for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_feedback_analyses_updated_at on public.cs_feedback_analyses;
create trigger trg_cs_feedback_analyses_updated_at before update on public.cs_feedback_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_sla_monitoring_updated_at on public.cs_sla_monitoring;
create trigger trg_cs_sla_monitoring_updated_at before update on public.cs_sla_monitoring for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_success_kpi_dashboards_updated_at on public.cs_success_kpi_dashboards;
create trigger trg_cs_success_kpi_dashboards_updated_at before update on public.cs_success_kpi_dashboards for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_churn_predictions_updated_at on public.cs_churn_predictions;
create trigger trg_cs_churn_predictions_updated_at before update on public.cs_churn_predictions for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_lifecycle_management_updated_at on public.cs_lifecycle_management;
create trigger trg_cs_lifecycle_management_updated_at before update on public.cs_lifecycle_management for each row execute function public.set_updated_at();
drop trigger if exists trg_cs_executive_summaries_updated_at on public.cs_executive_summaries;
create trigger trg_cs_executive_summaries_updated_at before update on public.cs_executive_summaries for each row execute function public.set_updated_at();

alter table public.cs_engagements enable row level security;
alter table public.cs_onboarding_workflows enable row level security;
alter table public.cs_adoption_tracking enable row level security;
alter table public.cs_health_scores enable row level security;
alter table public.cs_renewal_plans enable row level security;
alter table public.cs_expansion_opportunities enable row level security;
alter table public.cs_risk_analyses enable row level security;
alter table public.cs_support_trend_analyses enable row level security;
alter table public.cs_success_playbooks enable row level security;
alter table public.cs_qbr_reports enable row level security;
alter table public.cs_communication_plans enable row level security;
alter table public.cs_training_recommendations enable row level security;
alter table public.cs_feedback_analyses enable row level security;
alter table public.cs_sla_monitoring enable row level security;
alter table public.cs_success_kpi_dashboards enable row level security;
alter table public.cs_churn_predictions enable row level security;
alter table public.cs_lifecycle_management enable row level security;
alter table public.cs_executive_summaries enable row level security;
alter table public.cs_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'cs_engagements', 'cs_onboarding_workflows', 'cs_adoption_tracking', 'cs_health_scores',
    'cs_renewal_plans', 'cs_expansion_opportunities', 'cs_risk_analyses', 'cs_support_trend_analyses',
    'cs_success_playbooks', 'cs_qbr_reports', 'cs_communication_plans', 'cs_training_recommendations',
    'cs_feedback_analyses', 'cs_sla_monitoring', 'cs_success_kpi_dashboards', 'cs_churn_predictions',
    'cs_lifecycle_management', 'cs_executive_summaries', 'cs_audit_logs'
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
  ('cs.view', 'View AI Customer Success engagements and artifacts', 'customer_success'),
  ('cs.manage', 'Create and edit customer success deliverables', 'customer_success'),
  ('cs.approve', 'Review and approve customer success outputs', 'customer_success'),
  ('cs.admin', 'Administer customer success pipeline and permissions', 'customer_success')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

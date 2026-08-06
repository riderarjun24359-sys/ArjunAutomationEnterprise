-- Sprint 29: Founder Operating System

create table if not exists public.fo_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  workspace_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  df_engagement_id uuid references public.df_engagements(id) on delete set null,
  qa_engagement_id uuid references public.qa_engagements(id) on delete set null,
  dd_engagement_id uuid references public.dd_engagements(id) on delete set null,
  cs_engagement_id uuid references public.cs_engagements(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'founder_operating_system',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_key)
);

create table if not exists public.fo_strategic_okrs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  okr_key text not null,
  title text not null,
  objective text not null default '',
  key_results jsonb not null default '[]'::jsonb,
  quarter text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, okr_key)
);

create table if not exists public.fo_executive_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  dashboard_key text not null,
  name text not null,
  widgets jsonb not null default '[]'::jsonb,
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, dashboard_key)
);

create table if not exists public.fo_revenue_runway (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  runway_key text not null,
  name text not null,
  monthly_burn_usd numeric(14, 2) not null default 0,
  cash_balance_usd numeric(14, 2) not null default 0,
  runway_months numeric(6, 2) not null default 0,
  revenue_forecast jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, runway_key)
);

create table if not exists public.fo_team_capacity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  capacity_key text not null,
  name text not null,
  team_allocations jsonb not null default '[]'::jsonb,
  utilization_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, capacity_key)
);

create table if not exists public.fo_product_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  roadmap_key text not null,
  name text not null,
  initiatives jsonb not null default '[]'::jsonb,
  timeline_quarters jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, roadmap_key)
);

create table if not exists public.fo_investor_relations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  relation_key text not null,
  investor_name text not null,
  round text not null default '',
  engagement_notes text not null default '',
  next_touchpoint date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, relation_key)
);

create table if not exists public.fo_board_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  report_key text not null,
  title text not null,
  reporting_period text not null default '',
  sections jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, report_key)
);

create table if not exists public.fo_decision_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  decision_key text not null,
  title text not null,
  decision_type text not null default 'strategic',
  rationale text not null default '',
  outcome text not null default '',
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, decision_key)
);

create table if not exists public.fo_priorities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  priority_key text not null,
  title text not null,
  priority_level text not null default 'medium',
  owner text not null default '',
  due_date date,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, priority_key)
);

create table if not exists public.fo_resource_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  allocation_key text not null,
  name text not null,
  budget_usd numeric(14, 2) not null default 0,
  allocations jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, allocation_key)
);

create table if not exists public.fo_risk_register (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  risk_key text not null,
  title text not null,
  risk_level text not null default 'medium',
  mitigation_plan text not null default '',
  owner text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, risk_key)
);

create table if not exists public.fo_growth_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  metric_key text not null,
  name text not null,
  metric_type text not null default 'revenue',
  current_value numeric(14, 4) not null default 0,
  target_value numeric(14, 4) not null default 0,
  growth_rate_percent numeric(8, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, metric_key)
);

create table if not exists public.fo_founder_agenda (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  agenda_key text not null,
  title text not null,
  scheduled_at timestamptz,
  agenda_items jsonb not null default '[]'::jsonb,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, agenda_key)
);

create table if not exists public.fo_stakeholders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  stakeholder_key text not null,
  name text not null,
  stakeholder_type text not null default 'internal',
  influence_level text not null default 'medium',
  engagement_plan text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, stakeholder_key)
);

create table if not exists public.fo_capital_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  plan_key text not null,
  name text not null,
  funding_target_usd numeric(14, 2) not null default 0,
  use_of_funds jsonb not null default '[]'::jsonb,
  timeline text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, plan_key)
);

create table if not exists public.fo_company_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  milestone_key text not null,
  title text not null,
  target_date date,
  milestone_type text not null default 'product',
  success_criteria text not null default '',
  status text not null default 'planned',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, milestone_key)
);

create table if not exists public.fo_founder_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid not null references public.fo_workspaces(id) on delete cascade,
  insight_key text not null,
  title text not null,
  insight_type text not null default 'strategic',
  content text not null default '',
  confidence_score numeric(5, 2) not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_id, insight_key)
);

create table if not exists public.fo_audit_logs (
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

create index if not exists idx_fo_workspaces_org on public.fo_workspaces(organization_id);
create index if not exists idx_fo_strategic_okrs_org on public.fo_strategic_okrs(organization_id);
create index if not exists idx_fo_executive_dashboards_org on public.fo_executive_dashboards(organization_id);
create index if not exists idx_fo_revenue_runway_org on public.fo_revenue_runway(organization_id);
create index if not exists idx_fo_team_capacity_org on public.fo_team_capacity(organization_id);
create index if not exists idx_fo_product_roadmaps_org on public.fo_product_roadmaps(organization_id);
create index if not exists idx_fo_investor_relations_org on public.fo_investor_relations(organization_id);
create index if not exists idx_fo_board_reports_org on public.fo_board_reports(organization_id);
create index if not exists idx_fo_decision_log_org on public.fo_decision_log(organization_id);
create index if not exists idx_fo_priorities_org on public.fo_priorities(organization_id);
create index if not exists idx_fo_resource_allocations_org on public.fo_resource_allocations(organization_id);
create index if not exists idx_fo_risk_register_org on public.fo_risk_register(organization_id);
create index if not exists idx_fo_growth_metrics_org on public.fo_growth_metrics(organization_id);
create index if not exists idx_fo_founder_agenda_org on public.fo_founder_agenda(organization_id);
create index if not exists idx_fo_stakeholders_org on public.fo_stakeholders(organization_id);
create index if not exists idx_fo_capital_plans_org on public.fo_capital_plans(organization_id);
create index if not exists idx_fo_company_milestones_org on public.fo_company_milestones(organization_id);
create index if not exists idx_fo_founder_insights_org on public.fo_founder_insights(organization_id);
create index if not exists idx_fo_audit_logs_org on public.fo_audit_logs(organization_id);

drop trigger if exists trg_fo_workspaces_updated_at on public.fo_workspaces;
create trigger trg_fo_workspaces_updated_at before update on public.fo_workspaces for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_strategic_okrs_updated_at on public.fo_strategic_okrs;
create trigger trg_fo_strategic_okrs_updated_at before update on public.fo_strategic_okrs for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_executive_dashboards_updated_at on public.fo_executive_dashboards;
create trigger trg_fo_executive_dashboards_updated_at before update on public.fo_executive_dashboards for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_revenue_runway_updated_at on public.fo_revenue_runway;
create trigger trg_fo_revenue_runway_updated_at before update on public.fo_revenue_runway for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_team_capacity_updated_at on public.fo_team_capacity;
create trigger trg_fo_team_capacity_updated_at before update on public.fo_team_capacity for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_product_roadmaps_updated_at on public.fo_product_roadmaps;
create trigger trg_fo_product_roadmaps_updated_at before update on public.fo_product_roadmaps for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_investor_relations_updated_at on public.fo_investor_relations;
create trigger trg_fo_investor_relations_updated_at before update on public.fo_investor_relations for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_board_reports_updated_at on public.fo_board_reports;
create trigger trg_fo_board_reports_updated_at before update on public.fo_board_reports for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_decision_log_updated_at on public.fo_decision_log;
create trigger trg_fo_decision_log_updated_at before update on public.fo_decision_log for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_priorities_updated_at on public.fo_priorities;
create trigger trg_fo_priorities_updated_at before update on public.fo_priorities for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_resource_allocations_updated_at on public.fo_resource_allocations;
create trigger trg_fo_resource_allocations_updated_at before update on public.fo_resource_allocations for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_risk_register_updated_at on public.fo_risk_register;
create trigger trg_fo_risk_register_updated_at before update on public.fo_risk_register for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_growth_metrics_updated_at on public.fo_growth_metrics;
create trigger trg_fo_growth_metrics_updated_at before update on public.fo_growth_metrics for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_founder_agenda_updated_at on public.fo_founder_agenda;
create trigger trg_fo_founder_agenda_updated_at before update on public.fo_founder_agenda for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_stakeholders_updated_at on public.fo_stakeholders;
create trigger trg_fo_stakeholders_updated_at before update on public.fo_stakeholders for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_capital_plans_updated_at on public.fo_capital_plans;
create trigger trg_fo_capital_plans_updated_at before update on public.fo_capital_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_company_milestones_updated_at on public.fo_company_milestones;
create trigger trg_fo_company_milestones_updated_at before update on public.fo_company_milestones for each row execute function public.set_updated_at();
drop trigger if exists trg_fo_founder_insights_updated_at on public.fo_founder_insights;
create trigger trg_fo_founder_insights_updated_at before update on public.fo_founder_insights for each row execute function public.set_updated_at();

alter table public.fo_workspaces enable row level security;
alter table public.fo_strategic_okrs enable row level security;
alter table public.fo_executive_dashboards enable row level security;
alter table public.fo_revenue_runway enable row level security;
alter table public.fo_team_capacity enable row level security;
alter table public.fo_product_roadmaps enable row level security;
alter table public.fo_investor_relations enable row level security;
alter table public.fo_board_reports enable row level security;
alter table public.fo_decision_log enable row level security;
alter table public.fo_priorities enable row level security;
alter table public.fo_resource_allocations enable row level security;
alter table public.fo_risk_register enable row level security;
alter table public.fo_growth_metrics enable row level security;
alter table public.fo_founder_agenda enable row level security;
alter table public.fo_stakeholders enable row level security;
alter table public.fo_capital_plans enable row level security;
alter table public.fo_company_milestones enable row level security;
alter table public.fo_founder_insights enable row level security;
alter table public.fo_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'fo_workspaces', 'fo_strategic_okrs', 'fo_executive_dashboards', 'fo_revenue_runway',
    'fo_team_capacity', 'fo_product_roadmaps', 'fo_investor_relations', 'fo_board_reports',
    'fo_decision_log', 'fo_priorities', 'fo_resource_allocations', 'fo_risk_register',
    'fo_growth_metrics', 'fo_founder_agenda', 'fo_stakeholders', 'fo_capital_plans',
    'fo_company_milestones', 'fo_founder_insights', 'fo_audit_logs'
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
  ('fo.view', 'View Founder Operating System workspaces and artifacts', 'founder_os'),
  ('fo.manage', 'Create and edit founder OS deliverables', 'founder_os'),
  ('fo.approve', 'Review and approve founder OS outputs', 'founder_os'),
  ('fo.admin', 'Administer founder OS and permissions', 'founder_os')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

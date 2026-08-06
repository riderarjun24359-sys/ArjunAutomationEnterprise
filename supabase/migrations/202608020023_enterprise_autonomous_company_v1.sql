-- Sprint 30: Autonomous Company v1

create table if not exists public.ac_company_contexts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  context_key text not null,
  ba_engagement_id uuid references public.ba_engagements(id) on delete set null,
  sa_engagement_id uuid references public.sa_engagements(id) on delete set null,
  df_engagement_id uuid references public.df_engagements(id) on delete set null,
  qa_engagement_id uuid references public.qa_engagements(id) on delete set null,
  dd_engagement_id uuid references public.dd_engagements(id) on delete set null,
  cs_engagement_id uuid references public.cs_engagements(id) on delete set null,
  fo_workspace_id uuid references public.fo_workspaces(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'autonomous_company',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_key)
);

create table if not exists public.ac_workflow_orchestrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  orchestration_key text not null,
  name text not null,
  workflow_definition jsonb not null default '[]'::jsonb,
  participating_modules jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, orchestration_key)
);

create table if not exists public.ac_event_bus_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  event_key text not null,
  name text not null,
  source_module text not null default '',
  target_modules jsonb not null default '[]'::jsonb,
  payload_schema jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, event_key)
);

create table if not exists public.ac_worker_collaborations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  collaboration_key text not null,
  name text not null,
  participating_workers jsonb not null default '[]'::jsonb,
  handoff_rules jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, collaboration_key)
);

create table if not exists public.ac_approval_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  workflow_key text not null,
  title text not null,
  approval_steps jsonb not null default '[]'::jsonb,
  required_role text not null default 'admin',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, workflow_key)
);

create table if not exists public.ac_notification_center (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  notification_key text not null,
  title text not null,
  channel text not null default 'in_app',
  priority text not null default 'normal',
  message text not null default '',
  status text not null default 'unread',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, notification_key)
);

create table if not exists public.ac_company_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  timeline_key text not null,
  title text not null,
  event_type text not null default 'milestone',
  event_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, timeline_key)
);

create table if not exists public.ac_activity_feed (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  feed_key text not null,
  actor_type text not null default 'system',
  actor_name text not null default '',
  action text not null default '',
  resource_type text not null default '',
  resource_id uuid,
  summary text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.ac_cross_module_automations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  automation_key text not null,
  name text not null,
  trigger_module text not null default '',
  action_modules jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, automation_key)
);

create table if not exists public.ac_executive_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  insight_key text not null,
  title text not null,
  insight_type text not null default 'summary',
  content text not null default '',
  metrics jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, insight_key)
);

create table if not exists public.ac_predictive_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  recommendation_key text not null,
  title text not null,
  recommendation_type text not null default 'operational',
  confidence_score numeric(5, 2) not null default 0,
  recommendation text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, recommendation_key)
);

create table if not exists public.ac_system_search (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  search_key text not null,
  resource_type text not null,
  resource_id uuid,
  title text not null,
  keywords text not null default '',
  module_source text not null default '',
  status text not null default 'indexed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, search_key)
);

create table if not exists public.ac_command_palette (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  command_key text not null,
  label text not null,
  action_type text not null default 'navigate',
  target_path text not null default '',
  shortcut text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, command_key)
);

create table if not exists public.ac_emergency_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  workflow_key text not null,
  name text not null,
  severity text not null default 'high',
  response_steps jsonb not null default '[]'::jsonb,
  escalation_contacts jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, workflow_key)
);

create table if not exists public.ac_business_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  kpi_key text not null,
  name text not null,
  kpi_category text not null default 'operational',
  current_value numeric(14, 4) not null default 0,
  target_value numeric(14, 4) not null default 0,
  unit text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, kpi_key)
);

create table if not exists public.ac_security_governance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  governance_key text not null,
  name text not null,
  control_area text not null default 'access',
  controls jsonb not null default '[]'::jsonb,
  compliance_status text not null default 'pending',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, governance_key)
);

create table if not exists public.ac_compliance_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  dashboard_key text not null,
  name text not null,
  framework text not null default 'soc2',
  requirements jsonb not null default '[]'::jsonb,
  compliance_percent numeric(5, 2) not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, dashboard_key)
);

create table if not exists public.ac_operational_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_id uuid not null references public.ac_company_contexts(id) on delete cascade,
  health_key text not null,
  name text not null,
  overall_score numeric(5, 2) not null default 0,
  dimension_scores jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_id, health_key)
);

create table if not exists public.ac_audit_logs (
  id uuid primary key default gen_random_uuid(),
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

create index if not exists idx_ac_company_contexts_org on public.ac_company_contexts(organization_id);
create index if not exists idx_ac_workflow_orchestrations_org on public.ac_workflow_orchestrations(organization_id);
create index if not exists idx_ac_event_bus_events_org on public.ac_event_bus_events(organization_id);
create index if not exists idx_ac_worker_collaborations_org on public.ac_worker_collaborations(organization_id);
create index if not exists idx_ac_approval_workflows_org on public.ac_approval_workflows(organization_id);
create index if not exists idx_ac_notification_center_org on public.ac_notification_center(organization_id);
create index if not exists idx_ac_company_timeline_org on public.ac_company_timeline(organization_id);
create index if not exists idx_ac_activity_feed_org on public.ac_activity_feed(organization_id);
create index if not exists idx_ac_cross_module_automations_org on public.ac_cross_module_automations(organization_id);
create index if not exists idx_ac_executive_insights_org on public.ac_executive_insights(organization_id);
create index if not exists idx_ac_predictive_recommendations_org on public.ac_predictive_recommendations(organization_id);
create index if not exists idx_ac_system_search_org on public.ac_system_search(organization_id);
create index if not exists idx_ac_command_palette_org on public.ac_command_palette(organization_id);
create index if not exists idx_ac_emergency_workflows_org on public.ac_emergency_workflows(organization_id);
create index if not exists idx_ac_business_kpis_org on public.ac_business_kpis(organization_id);
create index if not exists idx_ac_security_governance_org on public.ac_security_governance(organization_id);
create index if not exists idx_ac_compliance_dashboards_org on public.ac_compliance_dashboards(organization_id);
create index if not exists idx_ac_operational_health_org on public.ac_operational_health(organization_id);
create index if not exists idx_ac_audit_logs_org on public.ac_audit_logs(organization_id);

drop trigger if exists trg_ac_company_contexts_updated_at on public.ac_company_contexts;
create trigger trg_ac_company_contexts_updated_at before update on public.ac_company_contexts for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_workflow_orchestrations_updated_at on public.ac_workflow_orchestrations;
create trigger trg_ac_workflow_orchestrations_updated_at before update on public.ac_workflow_orchestrations for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_event_bus_events_updated_at on public.ac_event_bus_events;
create trigger trg_ac_event_bus_events_updated_at before update on public.ac_event_bus_events for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_worker_collaborations_updated_at on public.ac_worker_collaborations;
create trigger trg_ac_worker_collaborations_updated_at before update on public.ac_worker_collaborations for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_approval_workflows_updated_at on public.ac_approval_workflows;
create trigger trg_ac_approval_workflows_updated_at before update on public.ac_approval_workflows for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_notification_center_updated_at on public.ac_notification_center;
create trigger trg_ac_notification_center_updated_at before update on public.ac_notification_center for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_company_timeline_updated_at on public.ac_company_timeline;
create trigger trg_ac_company_timeline_updated_at before update on public.ac_company_timeline for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_cross_module_automations_updated_at on public.ac_cross_module_automations;
create trigger trg_ac_cross_module_automations_updated_at before update on public.ac_cross_module_automations for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_executive_insights_updated_at on public.ac_executive_insights;
create trigger trg_ac_executive_insights_updated_at before update on public.ac_executive_insights for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_predictive_recommendations_updated_at on public.ac_predictive_recommendations;
create trigger trg_ac_predictive_recommendations_updated_at before update on public.ac_predictive_recommendations for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_system_search_updated_at on public.ac_system_search;
create trigger trg_ac_system_search_updated_at before update on public.ac_system_search for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_command_palette_updated_at on public.ac_command_palette;
create trigger trg_ac_command_palette_updated_at before update on public.ac_command_palette for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_emergency_workflows_updated_at on public.ac_emergency_workflows;
create trigger trg_ac_emergency_workflows_updated_at before update on public.ac_emergency_workflows for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_business_kpis_updated_at on public.ac_business_kpis;
create trigger trg_ac_business_kpis_updated_at before update on public.ac_business_kpis for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_security_governance_updated_at on public.ac_security_governance;
create trigger trg_ac_security_governance_updated_at before update on public.ac_security_governance for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_compliance_dashboards_updated_at on public.ac_compliance_dashboards;
create trigger trg_ac_compliance_dashboards_updated_at before update on public.ac_compliance_dashboards for each row execute function public.set_updated_at();
drop trigger if exists trg_ac_operational_health_updated_at on public.ac_operational_health;
create trigger trg_ac_operational_health_updated_at before update on public.ac_operational_health for each row execute function public.set_updated_at();

alter table public.ac_company_contexts enable row level security;
alter table public.ac_workflow_orchestrations enable row level security;
alter table public.ac_event_bus_events enable row level security;
alter table public.ac_worker_collaborations enable row level security;
alter table public.ac_approval_workflows enable row level security;
alter table public.ac_notification_center enable row level security;
alter table public.ac_company_timeline enable row level security;
alter table public.ac_activity_feed enable row level security;
alter table public.ac_cross_module_automations enable row level security;
alter table public.ac_executive_insights enable row level security;
alter table public.ac_predictive_recommendations enable row level security;
alter table public.ac_system_search enable row level security;
alter table public.ac_command_palette enable row level security;
alter table public.ac_emergency_workflows enable row level security;
alter table public.ac_business_kpis enable row level security;
alter table public.ac_security_governance enable row level security;
alter table public.ac_compliance_dashboards enable row level security;
alter table public.ac_operational_health enable row level security;
alter table public.ac_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'ac_company_contexts', 'ac_workflow_orchestrations', 'ac_event_bus_events', 'ac_worker_collaborations',
    'ac_approval_workflows', 'ac_notification_center', 'ac_company_timeline', 'ac_activity_feed',
    'ac_cross_module_automations', 'ac_executive_insights', 'ac_predictive_recommendations', 'ac_system_search',
    'ac_command_palette', 'ac_emergency_workflows', 'ac_business_kpis', 'ac_security_governance',
    'ac_compliance_dashboards', 'ac_operational_health', 'ac_audit_logs'
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
  ('ac.view', 'View Autonomous Company orchestration and artifacts', 'autonomous_company'),
  ('ac.manage', 'Create and edit autonomous company deliverables', 'autonomous_company'),
  ('ac.approve', 'Review and approve autonomous company workflows', 'autonomous_company'),
  ('ac.admin', 'Administer autonomous company governance and permissions', 'autonomous_company')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- Sprint 23: AI Business Analyst

create table if not exists public.ba_engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  engagement_key text not null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  knowledge_context_id uuid references public.knowledge_ai_contexts(id) on delete set null,
  pipeline_stage text not null default 'requirement_interview',
  status text not null default 'active',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create table if not exists public.ba_interviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  interview_key text not null,
  stakeholder_name text not null default '',
  questions jsonb not null default '[]'::jsonb,
  responses jsonb not null default '[]'::jsonb,
  status text not null default 'in_progress',
  conducted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, interview_key)
);

create table if not exists public.ba_brds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  title text not null,
  executive_summary text not null default '',
  business_objectives text not null default '',
  scope_overview text not null default '',
  content text not null default '',
  status text not null default 'draft',
  current_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_frs_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  brd_id uuid references public.ba_brds(id) on delete set null,
  title text not null,
  functional_requirements text not null default '',
  non_functional_requirements text not null default '',
  content text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_user_stories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  frs_id uuid references public.ba_frs_documents(id) on delete set null,
  story_key text not null,
  title text not null,
  description text not null default '',
  persona text not null default '',
  priority text not null default 'medium',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, story_key)
);

create table if not exists public.ba_acceptance_criteria (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_story_id uuid not null references public.ba_user_stories(id) on delete cascade,
  criterion_key text not null,
  description text not null default '',
  test_scenario text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  unique (user_story_id, criterion_key)
);

create table if not exists public.ba_process_maps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  name text not null,
  process_type text not null default 'as_is',
  steps jsonb not null default '[]'::jsonb,
  description text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_gap_analyses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  current_state text not null default '',
  desired_state text not null default '',
  gaps jsonb not null default '[]'::jsonb,
  recommendations text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_feature_priorities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  feature_name text not null,
  priority_score numeric(5, 2) not null default 0,
  priority_rank integer not null default 0,
  rationale text not null default '',
  status text not null default 'proposed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  risk_key text not null,
  title text not null,
  description text not null default '',
  likelihood text not null default 'medium',
  impact text not null default 'medium',
  mitigation text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, risk_key)
);

create table if not exists public.ba_stakeholders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  name text not null,
  role text not null default '',
  influence text not null default 'medium',
  interest text not null default 'medium',
  contact_info text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_scope_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  item_key text not null,
  title text not null,
  scope_type text not null default 'in_scope',
  description text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, item_key)
);

create table if not exists public.ba_proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  title text not null,
  executive_summary text not null default '',
  deliverables text not null default '',
  content text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ba_cost_estimates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  estimate_key text not null,
  line_items jsonb not null default '[]'::jsonb,
  total_amount numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  assumptions text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, estimate_key)
);

create table if not exists public.ba_timeline_estimates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  estimate_key text not null,
  phases jsonb not null default '[]'::jsonb,
  total_duration_days integer not null default 0,
  assumptions text not null default '',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_id, estimate_key)
);

create table if not exists public.ba_requirement_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  version_number integer not null,
  content text not null default '',
  change_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, version_number)
);

create table if not exists public.ba_review_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid not null references public.ba_engagements(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  reviewer_id uuid references public.employees(id) on delete set null,
  approval_status text not null default 'pending',
  comments text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ba_audit_logs (
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

create index if not exists idx_ba_engagements_org on public.ba_engagements(organization_id);
create index if not exists idx_ba_interviews_org on public.ba_interviews(organization_id);
create index if not exists idx_ba_brds_org on public.ba_brds(organization_id);
create index if not exists idx_ba_frs_documents_org on public.ba_frs_documents(organization_id);
create index if not exists idx_ba_user_stories_org on public.ba_user_stories(organization_id);
create index if not exists idx_ba_acceptance_criteria_org on public.ba_acceptance_criteria(organization_id);
create index if not exists idx_ba_process_maps_org on public.ba_process_maps(organization_id);
create index if not exists idx_ba_gap_analyses_org on public.ba_gap_analyses(organization_id);
create index if not exists idx_ba_feature_priorities_org on public.ba_feature_priorities(organization_id);
create index if not exists idx_ba_risks_org on public.ba_risks(organization_id);
create index if not exists idx_ba_stakeholders_org on public.ba_stakeholders(organization_id);
create index if not exists idx_ba_scope_items_org on public.ba_scope_items(organization_id);
create index if not exists idx_ba_proposals_org on public.ba_proposals(organization_id);
create index if not exists idx_ba_cost_estimates_org on public.ba_cost_estimates(organization_id);
create index if not exists idx_ba_timeline_estimates_org on public.ba_timeline_estimates(organization_id);
create index if not exists idx_ba_requirement_versions_org on public.ba_requirement_versions(organization_id);
create index if not exists idx_ba_review_approvals_org on public.ba_review_approvals(organization_id);
create index if not exists idx_ba_audit_logs_org on public.ba_audit_logs(organization_id);

drop trigger if exists trg_ba_engagements_updated_at on public.ba_engagements;
create trigger trg_ba_engagements_updated_at before update on public.ba_engagements for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_interviews_updated_at on public.ba_interviews;
create trigger trg_ba_interviews_updated_at before update on public.ba_interviews for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_brds_updated_at on public.ba_brds;
create trigger trg_ba_brds_updated_at before update on public.ba_brds for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_frs_documents_updated_at on public.ba_frs_documents;
create trigger trg_ba_frs_documents_updated_at before update on public.ba_frs_documents for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_user_stories_updated_at on public.ba_user_stories;
create trigger trg_ba_user_stories_updated_at before update on public.ba_user_stories for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_process_maps_updated_at on public.ba_process_maps;
create trigger trg_ba_process_maps_updated_at before update on public.ba_process_maps for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_gap_analyses_updated_at on public.ba_gap_analyses;
create trigger trg_ba_gap_analyses_updated_at before update on public.ba_gap_analyses for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_feature_priorities_updated_at on public.ba_feature_priorities;
create trigger trg_ba_feature_priorities_updated_at before update on public.ba_feature_priorities for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_risks_updated_at on public.ba_risks;
create trigger trg_ba_risks_updated_at before update on public.ba_risks for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_stakeholders_updated_at on public.ba_stakeholders;
create trigger trg_ba_stakeholders_updated_at before update on public.ba_stakeholders for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_scope_items_updated_at on public.ba_scope_items;
create trigger trg_ba_scope_items_updated_at before update on public.ba_scope_items for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_proposals_updated_at on public.ba_proposals;
create trigger trg_ba_proposals_updated_at before update on public.ba_proposals for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_cost_estimates_updated_at on public.ba_cost_estimates;
create trigger trg_ba_cost_estimates_updated_at before update on public.ba_cost_estimates for each row execute function public.set_updated_at();
drop trigger if exists trg_ba_timeline_estimates_updated_at on public.ba_timeline_estimates;
create trigger trg_ba_timeline_estimates_updated_at before update on public.ba_timeline_estimates for each row execute function public.set_updated_at();

alter table public.ba_engagements enable row level security;
alter table public.ba_interviews enable row level security;
alter table public.ba_brds enable row level security;
alter table public.ba_frs_documents enable row level security;
alter table public.ba_user_stories enable row level security;
alter table public.ba_acceptance_criteria enable row level security;
alter table public.ba_process_maps enable row level security;
alter table public.ba_gap_analyses enable row level security;
alter table public.ba_feature_priorities enable row level security;
alter table public.ba_risks enable row level security;
alter table public.ba_stakeholders enable row level security;
alter table public.ba_scope_items enable row level security;
alter table public.ba_proposals enable row level security;
alter table public.ba_cost_estimates enable row level security;
alter table public.ba_timeline_estimates enable row level security;
alter table public.ba_requirement_versions enable row level security;
alter table public.ba_review_approvals enable row level security;
alter table public.ba_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'ba_engagements', 'ba_interviews', 'ba_brds', 'ba_frs_documents', 'ba_user_stories',
    'ba_acceptance_criteria', 'ba_process_maps', 'ba_gap_analyses', 'ba_feature_priorities',
    'ba_risks', 'ba_stakeholders', 'ba_scope_items', 'ba_proposals', 'ba_cost_estimates',
    'ba_timeline_estimates', 'ba_requirement_versions', 'ba_review_approvals', 'ba_audit_logs'
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
  ('ba.view', 'View AI Business Analyst engagements and artifacts', 'business_analyst'),
  ('ba.manage', 'Create and edit business analyst deliverables', 'business_analyst'),
  ('ba.approve', 'Review and approve business analyst outputs', 'business_analyst'),
  ('ba.admin', 'Administer business analyst pipeline and permissions', 'business_analyst')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

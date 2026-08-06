-- Customer Success & Global Operations v1.0

create table if not exists public.csg_success_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  title text not null,
  goals jsonb not null default '[]',
  status text not null default 'active' check (status in ('draft', 'active', 'completed', 'archived')),
  health_score numeric(5,2) not null default 75,
  owner_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csg_onboarding_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  project_id uuid,
  requirements jsonb not null default '[]',
  checklist jsonb not null default '[]',
  team_assignment jsonb not null default '[]',
  timeline jsonb not null default '[]',
  status text not null default 'in_progress' check (status in ('pending', 'in_progress', 'ready', 'completed')),
  kickoff_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csg_delivery_milestones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid,
  engagement_id uuid,
  title text not null,
  stage text not null default 'planning',
  due_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'blocked', 'completed', 'approved')),
  risk_level text not null default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  requires_client_approval boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csg_feedback_responses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  feedback_type text not null check (feedback_type in ('csat', 'nps', 'feature_request', 'improvement', 'complaint')),
  score numeric(5,2),
  comment text not null default '',
  status text not null default 'open' check (status in ('open', 'reviewed', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.csg_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  ticket_id uuid,
  reason text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'assigned', 'resolved', 'closed')),
  assigned_to text not null default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.csg_renewals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid,
  renewal_date date not null,
  amount numeric(14,2) not null default 0,
  probability numeric(5,2) not null default 70,
  status text not null default 'upcoming' check (status in ('upcoming', 'in_negotiation', 'renewed', 'churned', 'lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.csg_improvement_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_module text not null,
  title text not null,
  detail text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'backlog' check (status in ('backlog', 'planned', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

create table if not exists public.csg_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  action text not null,
  module_key text not null default 'global-ops',
  detail text not null default '',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_csg_success_plans_org on public.csg_success_plans(organization_id);
create index if not exists idx_csg_onboarding_sessions_org on public.csg_onboarding_sessions(organization_id);
create index if not exists idx_csg_delivery_milestones_org on public.csg_delivery_milestones(organization_id);
create index if not exists idx_csg_feedback_responses_org on public.csg_feedback_responses(organization_id);
create index if not exists idx_csg_escalations_org on public.csg_escalations(organization_id);
create index if not exists idx_csg_renewals_org on public.csg_renewals(organization_id);
create index if not exists idx_csg_improvement_items_org on public.csg_improvement_items(organization_id);
create index if not exists idx_csg_audit_logs_org on public.csg_audit_logs(organization_id);

alter table public.csg_success_plans enable row level security;
alter table public.csg_onboarding_sessions enable row level security;
alter table public.csg_delivery_milestones enable row level security;
alter table public.csg_feedback_responses enable row level security;
alter table public.csg_escalations enable row level security;
alter table public.csg_renewals enable row level security;
alter table public.csg_improvement_items enable row level security;
alter table public.csg_audit_logs enable row level security;

drop policy if exists "business_consultations_org_access" on public.business_consultations;
create policy "business_consultations_org_access"
on public.business_consultations
for all
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "business_proposals_org_access" on public.business_proposals;
create policy "business_proposals_org_access"
on public.business_proposals
for all
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "business_lifecycle_events_org_access" on public.business_lifecycle_events;
create policy "business_lifecycle_events_org_access"
on public.business_lifecycle_events
for all
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));

drop policy if exists "business_ai_recommendations_org_access" on public.business_ai_recommendations;
create policy "business_ai_recommendations_org_access"
on public.business_ai_recommendations
for all
using (public.is_organization_member(organization_id))
with check (public.is_organization_member(organization_id));
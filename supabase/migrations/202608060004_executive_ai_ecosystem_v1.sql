-- Executive AI Ecosystem v1.0 — coordinated executive AI organization

create table if not exists public.eae_agent_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  task_type text not null,
  title text not null,
  detail text not null default '',
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.eae_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  title text not null,
  detail text not null default '',
  confidence numeric(5,2) not null default 0,
  requires_approval boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'executed')),
  source_modules text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.eae_collaboration_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  event_type text not null check (event_type in ('task_routed', 'conflict_resolved', 'recommendation_merged', 'approval_requested', 'approval_granted')),
  agent_keys text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.eae_approval_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recommendation_id uuid references public.eae_recommendations(id) on delete set null,
  agent_key text not null,
  action_summary text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_by text not null default 'orchestrator',
  resolved_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_eae_agent_tasks_org on public.eae_agent_tasks(organization_id);
create index if not exists idx_eae_recommendations_org on public.eae_recommendations(organization_id);
create index if not exists idx_eae_collaboration_events_org on public.eae_collaboration_events(organization_id);
create index if not exists idx_eae_approval_requests_org on public.eae_approval_requests(organization_id);

alter table public.eae_agent_tasks enable row level security;
alter table public.eae_recommendations enable row level security;
alter table public.eae_collaboration_events enable row level security;
alter table public.eae_approval_requests enable row level security;

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
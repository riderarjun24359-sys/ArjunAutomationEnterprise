-- Business Platform v1.0 — unified client lifecycle

create table if not exists public.business_consultations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.sales_leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  assigned_to uuid references public.employees(id) on delete set null,
  meeting_notes text not null default '',
  requirements text not null default '',
  ai_summary text not null default '',
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.sales_leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'review', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  version integer not null default 1,
  total_amount numeric(14,2) not null default 0,
  source_type text not null default 'business_platform',
  source_id text not null default '',
  document_ref text not null default '',
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
  valid_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_lifecycle_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  stage text not null,
  event_type text not null,
  notes text not null default '',
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.business_ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  recommendation_type text not null,
  title text not null,
  description text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'executed')),
  requires_approval boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_business_consultations_org on public.business_consultations(organization_id);
create index if not exists idx_business_proposals_org on public.business_proposals(organization_id);
create index if not exists idx_business_lifecycle_events_org on public.business_lifecycle_events(organization_id);
create index if not exists idx_business_ai_recommendations_org on public.business_ai_recommendations(organization_id);

alter table public.business_consultations enable row level security;
alter table public.business_proposals enable row level security;
alter table public.business_lifecycle_events enable row level security;
alter table public.business_ai_recommendations enable row level security;

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
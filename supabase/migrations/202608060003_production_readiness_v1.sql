-- Production Readiness v1.0 — health snapshots and system alerts

create table if not exists public.pr_readiness_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  overall_score numeric(5,2) not null default 0,
  observability_score numeric(5,2) not null default 0,
  resilience_score numeric(5,2) not null default 0,
  backup_score numeric(5,2) not null default 0,
  security_score numeric(5,2) not null default 0,
  scalability_score numeric(5,2) not null default 0,
  quality_score numeric(5,2) not null default 0,
  risk_score numeric(5,2) not null default 0,
  snapshot_data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.pr_system_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  alert_type text not null check (alert_type in ('security', 'performance', 'reliability', 'backup', 'ai', 'delivery', 'database')),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  detail text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_pr_readiness_snapshots_org on public.pr_readiness_snapshots(organization_id);
create index if not exists idx_pr_system_alerts_org on public.pr_system_alerts(organization_id);

alter table public.pr_readiness_snapshots enable row level security;
alter table public.pr_system_alerts enable row level security;

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
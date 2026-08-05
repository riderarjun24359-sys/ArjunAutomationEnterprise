-- Production Readiness v1.0 — health snapshots and system alerts

create table if not exists public.pr_readiness_snapshots (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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

create policy "pr_readiness_snapshots_org_access" on public.pr_readiness_snapshots for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "pr_system_alerts_org_access" on public.pr_system_alerts for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));

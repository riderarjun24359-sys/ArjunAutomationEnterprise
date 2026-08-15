-- AI Command Center v1.0

create table if not exists public.acc_alerts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  source_module text not null default 'system',
  title text not null,
  detail text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.acc_recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engine_key text not null,
  title text not null,
  detail text not null default '',
  confidence numeric(5,2) not null default 0,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'dismissed', 'executed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.acc_decisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  decision_type text not null,
  summary text not null,
  rationale text not null default '',
  confidence numeric(5,2) not null default 0,
  status text not null default 'proposed' check (status in ('proposed', 'approved', 'rejected', 'executed')),
  created_at timestamptz not null default now()
);

create table if not exists public.acc_automations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  automation_key text not null,
  title text not null,
  status text not null default 'idle' check (status in ('idle', 'running', 'succeeded', 'failed')),
  last_run_at timestamptz,
  result_summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.acc_health_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  system_health numeric(5,2) not null default 0,
  client_health numeric(5,2) not null default 0,
  support_sla numeric(5,2) not null default 0,
  delivery_health numeric(5,2) not null default 0,
  agent_health numeric(5,2) not null default 0,
  metadata jsonb not null default '{}',
  recorded_at timestamptz not null default now()
);

create table if not exists public.acc_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  action text not null,
  detail text not null default '',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_acc_alerts_org on public.acc_alerts(organization_id);
create index if not exists idx_acc_recommendations_org on public.acc_recommendations(organization_id);
create index if not exists idx_acc_decisions_org on public.acc_decisions(organization_id);
create index if not exists idx_acc_automations_org on public.acc_automations(organization_id);
create index if not exists idx_acc_health_snapshots_org on public.acc_health_snapshots(organization_id);
create index if not exists idx_acc_audit_logs_org on public.acc_audit_logs(organization_id);

alter table public.acc_alerts enable row level security;
alter table public.acc_recommendations enable row level security;
alter table public.acc_decisions enable row level security;
alter table public.acc_automations enable row level security;
alter table public.acc_health_snapshots enable row level security;
alter table public.acc_audit_logs enable row level security;

create policy "acc_alerts_org" on public.acc_alerts for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "acc_recommendations_org" on public.acc_recommendations for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "acc_decisions_org" on public.acc_decisions for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "acc_automations_org" on public.acc_automations for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "acc_health_snapshots_org" on public.acc_health_snapshots for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "acc_audit_logs_org" on public.acc_audit_logs for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));

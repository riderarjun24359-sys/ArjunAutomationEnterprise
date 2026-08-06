-- Executive AI v1.0 — full enterprise AI leadership layer

create table if not exists public.executive_agents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  name text not null,
  role text not null,
  version text not null default '1.0',
  status text not null default 'active' check (status in ('active', 'paused', 'deprecated')),
  health_score numeric(5,2) not null default 85,
  permissions jsonb not null default '[]',
  capabilities jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, agent_key)
);

create table if not exists public.executive_tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  task_type text not null,
  title text not null,
  detail text not null default '',
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  sla_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  title text not null,
  detail text not null default '',
  explanation text not null default '',
  confidence numeric(5,2) not null default 0,
  votes integer not null default 0,
  requires_approval boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'executed')),
  source_modules text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_collaboration (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  event_type text not null check (event_type in ('discussion', 'vote', 'consensus', 'conflict_resolved', 'task_routed', 'approval_requested')),
  agent_keys text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.executive_approvals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recommendation_id uuid references public.executive_recommendations(id) on delete set null,
  agent_key text not null,
  action_summary text not null,
  policy_key text not null default 'critical_action',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_by text not null default 'orchestrator',
  resolved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.executive_memory (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_module text not null,
  memory_key text not null,
  memory_value jsonb not null default '{}',
  fetched_at timestamptz not null default now(),
  unique (organization_id, source_module, memory_key)
);

create table if not exists public.executive_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_health_score numeric(5,2) not null default 0,
  agent_health jsonb not null default '{}',
  recorded_at timestamptz not null default now()
);

create table if not exists public.executive_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null default 'system',
  action text not null,
  detail text not null default '',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.executive_agent_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  metric_key text not null,
  metric_value numeric(14,4) not null default 0,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_executive_agents_org on public.executive_agents(organization_id);
create index if not exists idx_executive_tasks_org on public.executive_tasks(organization_id);
create index if not exists idx_executive_recommendations_org on public.executive_recommendations(organization_id);
create index if not exists idx_executive_collaboration_org on public.executive_collaboration(organization_id);
create index if not exists idx_executive_approvals_org on public.executive_approvals(organization_id);
create index if not exists idx_executive_memory_org on public.executive_memory(organization_id);
create index if not exists idx_executive_health_org on public.executive_health(organization_id);
create index if not exists idx_executive_audit_logs_org on public.executive_audit_logs(organization_id);
create index if not exists idx_executive_agent_metrics_org on public.executive_agent_metrics(organization_id);

alter table public.executive_agents enable row level security;
alter table public.executive_tasks enable row level security;
alter table public.executive_recommendations enable row level security;
alter table public.executive_collaboration enable row level security;
alter table public.executive_approvals enable row level security;
alter table public.executive_memory enable row level security;
alter table public.executive_health enable row level security;
alter table public.executive_audit_logs enable row level security;
alter table public.executive_agent_metrics enable row level security;

create policy "executive_agents_org" on public.executive_agents for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_tasks_org" on public.executive_tasks for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_recommendations_org" on public.executive_recommendations for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_collaboration_org" on public.executive_collaboration for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_approvals_org" on public.executive_approvals for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_memory_org" on public.executive_memory for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_health_org" on public.executive_health for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_audit_logs_org" on public.executive_audit_logs for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "executive_agent_metrics_org" on public.executive_agent_metrics for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));

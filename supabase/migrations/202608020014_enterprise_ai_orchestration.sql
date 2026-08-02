-- Sprint 21: Enterprise AI Orchestration Layer

create table if not exists public.ai_providers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  provider_key text not null,
  api_base_url text not null default '',
  status text not null default 'active',
  is_default boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider_key)
);

create table if not exists public.ai_model_routes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  provider_id uuid not null references public.ai_providers(id) on delete cascade,
  model_id text not null,
  priority integer not null default 0,
  routing_strategy text not null default 'priority',
  fallback_provider_id uuid references public.ai_providers(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.ai_orchestration_agents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  agent_type text not null default 'general',
  workflow_agent_id uuid references public.ai_agents(id) on delete set null,
  provider_id uuid references public.ai_providers(id) on delete set null,
  model_route_id uuid references public.ai_model_routes(id) on delete set null,
  capabilities jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.ai_prompt_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  template_key text not null,
  category text not null default 'general',
  content text not null default '',
  variables jsonb not null default '[]'::jsonb,
  version integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

create table if not exists public.ai_sessions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_key text not null,
  module_source text not null default 'general',
  entity_type text not null default '',
  entity_id uuid,
  context jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, session_key)
);

create table if not exists public.ai_task_executions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  provider_id uuid references public.ai_providers(id) on delete set null,
  task_type text not null,
  input_payload jsonb not null default '{}'::jsonb,
  output_payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  model_used text not null default '',
  tokens_used integer not null default 0,
  duration_ms integer not null default 0,
  error_message text not null default '',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider_id uuid references public.ai_providers(id) on delete set null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  task_execution_id uuid references public.ai_task_executions(id) on delete set null,
  tokens_input integer not null default 0,
  tokens_output integer not null default 0,
  request_count integer not null default 1,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_cost_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider_id uuid references public.ai_providers(id) on delete set null,
  usage_record_id uuid references public.ai_usage_records(id) on delete set null,
  cost_usd numeric(12, 6) not null default 0,
  pricing_model text not null default 'token',
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_rate_limits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  scope_type text not null default 'organization',
  scope_id uuid,
  requests_per_minute integer not null default 60,
  tokens_per_day integer not null default 1000000,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_permission_grants (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grantee_type text not null default 'employee',
  grantee_id uuid,
  permission_key text not null,
  resource_type text not null default 'all',
  resource_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_provider_health_checks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider_id uuid not null references public.ai_providers(id) on delete cascade,
  status text not null default 'healthy',
  latency_ms integer not null default 0,
  error_message text not null default '',
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_retry_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  max_retries integer not null default 3,
  backoff_strategy text not null default 'exponential',
  fallback_route_id uuid references public.ai_model_routes(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.ai_orchestration_audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_orchestration_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric_key text not null,
  metric_value numeric(14, 4) not null default 0,
  dimensions jsonb not null default '{}'::jsonb,
  period_start timestamptz not null,
  period_end timestamptz not null,
  computed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_providers_org on public.ai_providers(organization_id);
create index if not exists idx_ai_model_routes_org on public.ai_model_routes(organization_id);
create index if not exists idx_ai_orchestration_agents_org on public.ai_orchestration_agents(organization_id);
create index if not exists idx_ai_prompt_templates_org on public.ai_prompt_templates(organization_id);
create index if not exists idx_ai_sessions_org on public.ai_sessions(organization_id);
create index if not exists idx_ai_task_executions_org on public.ai_task_executions(organization_id);
create index if not exists idx_ai_usage_records_org on public.ai_usage_records(organization_id);
create index if not exists idx_ai_cost_records_org on public.ai_cost_records(organization_id);
create index if not exists idx_ai_rate_limits_org on public.ai_rate_limits(organization_id);
create index if not exists idx_ai_permission_grants_org on public.ai_permission_grants(organization_id);
create index if not exists idx_ai_provider_health_checks_org on public.ai_provider_health_checks(organization_id);
create index if not exists idx_ai_retry_policies_org on public.ai_retry_policies(organization_id);
create index if not exists idx_ai_orchestration_audit_logs_org on public.ai_orchestration_audit_logs(organization_id);
create index if not exists idx_ai_orchestration_analytics_org on public.ai_orchestration_analytics(organization_id);

drop trigger if exists trg_ai_providers_updated_at on public.ai_providers;
create trigger trg_ai_providers_updated_at before update on public.ai_providers for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_model_routes_updated_at on public.ai_model_routes;
create trigger trg_ai_model_routes_updated_at before update on public.ai_model_routes for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_orchestration_agents_updated_at on public.ai_orchestration_agents;
create trigger trg_ai_orchestration_agents_updated_at before update on public.ai_orchestration_agents for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_prompt_templates_updated_at on public.ai_prompt_templates;
create trigger trg_ai_prompt_templates_updated_at before update on public.ai_prompt_templates for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_sessions_updated_at on public.ai_sessions;
create trigger trg_ai_sessions_updated_at before update on public.ai_sessions for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_rate_limits_updated_at on public.ai_rate_limits;
create trigger trg_ai_rate_limits_updated_at before update on public.ai_rate_limits for each row execute function public.set_updated_at();
drop trigger if exists trg_ai_retry_policies_updated_at on public.ai_retry_policies;
create trigger trg_ai_retry_policies_updated_at before update on public.ai_retry_policies for each row execute function public.set_updated_at();

alter table public.ai_providers enable row level security;
alter table public.ai_model_routes enable row level security;
alter table public.ai_orchestration_agents enable row level security;
alter table public.ai_prompt_templates enable row level security;
alter table public.ai_sessions enable row level security;
alter table public.ai_task_executions enable row level security;
alter table public.ai_usage_records enable row level security;
alter table public.ai_cost_records enable row level security;
alter table public.ai_rate_limits enable row level security;
alter table public.ai_permission_grants enable row level security;
alter table public.ai_provider_health_checks enable row level security;
alter table public.ai_retry_policies enable row level security;
alter table public.ai_orchestration_audit_logs enable row level security;
alter table public.ai_orchestration_analytics enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'ai_providers', 'ai_model_routes', 'ai_orchestration_agents', 'ai_prompt_templates',
    'ai_sessions', 'ai_task_executions', 'ai_usage_records', 'ai_cost_records',
    'ai_rate_limits', 'ai_permission_grants', 'ai_provider_health_checks',
    'ai_retry_policies', 'ai_orchestration_audit_logs', 'ai_orchestration_analytics'
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
  ('ai.view', 'View AI orchestration configuration and metrics', 'ai'),
  ('ai.manage', 'Manage AI providers, routes, agents, and templates', 'ai'),
  ('ai.execute', 'Execute AI tasks and manage sessions', 'ai'),
  ('ai.admin', 'Manage AI permissions, rate limits, and policies', 'ai')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- Sprint 13: Enterprise AI Automation & Workflow Builder

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  model text not null default 'gpt-4o',
  system_prompt text not null default '',
  status text not null default 'active',
  temperature numeric(3, 2) not null default 0.70,
  max_tokens integer not null default 4096,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  category text not null default 'general',
  definition jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  template_id uuid references public.workflow_templates(id) on delete set null,
  agent_id uuid references public.ai_agents(id) on delete set null,
  name text not null,
  description text not null default '',
  status text not null default 'draft',
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_triggers (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  trigger_type text not null default 'manual',
  event_name text not null default '',
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_actions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  step_order integer not null default 0,
  action_type text not null default 'notify',
  config jsonb not null default '{}'::jsonb,
  agent_id uuid references public.ai_agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_conditions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  step_order integer not null default 0,
  field text not null,
  operator text not null default 'equals',
  value text not null default '',
  logic_group text not null default 'default',
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_schedules (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  cron_expression text not null default '0 9 * * 1',
  timezone text not null default 'UTC',
  next_run_at timestamptz,
  last_run_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  status text not null default 'pending',
  trigger_type text not null default 'manual',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms integer not null default 0,
  result jsonb not null default '{}'::jsonb,
  error_message text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.automation_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete set null,
  execution_id uuid references public.workflow_executions(id) on delete set null,
  level text not null default 'info',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

drop trigger if exists trg_ai_agents_updated_at on public.ai_agents;
create trigger trg_ai_agents_updated_at before update on public.ai_agents for each row execute function public.set_updated_at();

drop trigger if exists trg_workflow_templates_updated_at on public.workflow_templates;
create trigger trg_workflow_templates_updated_at before update on public.workflow_templates for each row execute function public.set_updated_at();

drop trigger if exists trg_workflows_updated_at on public.workflows;
create trigger trg_workflows_updated_at before update on public.workflows for each row execute function public.set_updated_at();

drop trigger if exists trg_workflow_triggers_updated_at on public.workflow_triggers;
create trigger trg_workflow_triggers_updated_at before update on public.workflow_triggers for each row execute function public.set_updated_at();

drop trigger if exists trg_workflow_actions_updated_at on public.workflow_actions;
create trigger trg_workflow_actions_updated_at before update on public.workflow_actions for each row execute function public.set_updated_at();

drop trigger if exists trg_workflow_schedules_updated_at on public.workflow_schedules;
create trigger trg_workflow_schedules_updated_at before update on public.workflow_schedules for each row execute function public.set_updated_at();

create index if not exists idx_ai_agents_org on public.ai_agents(organization_id);
create index if not exists idx_ai_agents_status on public.ai_agents(status);
create index if not exists idx_workflow_templates_org on public.workflow_templates(organization_id);
create index if not exists idx_workflow_templates_category on public.workflow_templates(category);
create index if not exists idx_workflows_org on public.workflows(organization_id);
create index if not exists idx_workflows_status on public.workflows(status);
create index if not exists idx_workflow_triggers_workflow on public.workflow_triggers(workflow_id);
create index if not exists idx_workflow_actions_workflow on public.workflow_actions(workflow_id);
create index if not exists idx_workflow_conditions_workflow on public.workflow_conditions(workflow_id);
create index if not exists idx_workflow_schedules_workflow on public.workflow_schedules(workflow_id);
create index if not exists idx_workflow_executions_org on public.workflow_executions(organization_id);
create index if not exists idx_workflow_executions_workflow on public.workflow_executions(workflow_id);
create index if not exists idx_workflow_executions_status on public.workflow_executions(status);
create index if not exists idx_automation_logs_org on public.automation_logs(organization_id);
create index if not exists idx_automation_logs_workflow on public.automation_logs(workflow_id);
create index if not exists idx_automation_logs_execution on public.automation_logs(execution_id);

alter table public.ai_agents enable row level security;
alter table public.workflow_templates enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_triggers enable row level security;
alter table public.workflow_actions enable row level security;
alter table public.workflow_conditions enable row level security;
alter table public.workflow_schedules enable row level security;
alter table public.workflow_executions enable row level security;
alter table public.automation_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['ai_agents', 'workflow_templates', 'workflows', 'workflow_executions', 'automation_logs']
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

do $$
declare
  tbl text;
begin
  foreach tbl in array array['workflow_triggers', 'workflow_actions', 'workflow_conditions', 'workflow_schedules']
  loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('create policy %I_select on public.%I for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_organization_member(w.organization_id)))', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_organization_member(w.organization_id)))', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_organization_member(w.organization_id))) with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_organization_member(w.organization_id)))', tbl, tbl);
    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format('create policy %I_delete on public.%I for delete using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_organization_member(w.organization_id)))', tbl, tbl);
  end loop;
end $$;

insert into public.permissions (key, description, resource)
values ('automation.manage', 'Manage AI automation and workflows', 'automation')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

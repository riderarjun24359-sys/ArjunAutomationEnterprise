-- Sprint 22: Enterprise Knowledge & Memory Engine

create table if not exists public.knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null default '',
  category text not null default 'general',
  status text not null default 'published',
  tags jsonb not null default '[]'::jsonb,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  ai_session_id uuid references public.ai_sessions(id) on delete set null,
  current_version integer not null default 1,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.knowledge_semantic_index (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entry_id uuid not null references public.knowledge_entries(id) on delete cascade,
  embedding_key text not null default '',
  search_text text not null default '',
  indexed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_solutions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  problem_statement text not null default '',
  solution_summary text not null default '',
  implementation_notes text not null default '',
  category text not null default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.knowledge_adrs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  adr_number integer not null,
  title text not null,
  status text not null default 'proposed',
  context text not null default '',
  decision text not null default '',
  consequences text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, adr_number)
);

create table if not exists public.knowledge_prompt_base (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  prompt_key text not null,
  category text not null default 'general',
  content text not null default '',
  use_cases jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, prompt_key)
);

create table if not exists public.knowledge_project_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  memory_key text not null,
  summary text not null default '',
  details text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, project_id, memory_key)
);

create table if not exists public.knowledge_client_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  memory_key text not null,
  summary text not null default '',
  details text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, client_id, memory_key)
);

create table if not exists public.knowledge_components (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  component_type text not null default 'ui',
  description text not null default '',
  usage_guidelines text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.knowledge_patterns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  pattern_type text not null default 'architecture',
  description text not null default '',
  when_to_use text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.knowledge_documentation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  doc_key text not null,
  module_source text not null default 'general',
  content text not null default '',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, doc_key)
);

create table if not exists public.knowledge_ai_contexts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  context_key text not null,
  agent_id uuid references public.ai_orchestration_agents(id) on delete set null,
  session_id uuid references public.ai_sessions(id) on delete set null,
  entry_id uuid references public.knowledge_entries(id) on delete set null,
  context_payload jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, context_key)
);

create table if not exists public.knowledge_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entry_id uuid not null references public.knowledge_entries(id) on delete cascade,
  version_number integer not null,
  content text not null default '',
  change_summary text not null default '',
  created_at timestamptz not null default now(),
  unique (entry_id, version_number)
);

create table if not exists public.knowledge_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric_key text not null,
  metric_value numeric(14, 4) not null default 0,
  dimensions jsonb not null default '{}'::jsonb,
  period_start timestamptz not null,
  period_end timestamptz not null,
  computed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grantee_type text not null default 'employee',
  grantee_id uuid,
  permission_key text not null,
  resource_type text not null default 'all',
  resource_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_cross_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_module text not null,
  source_entity_type text not null,
  source_entity_id uuid,
  entry_id uuid references public.knowledge_entries(id) on delete cascade,
  link_type text not null default 'reference',
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_audit_logs (
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

create index if not exists idx_knowledge_entries_org on public.knowledge_entries(organization_id);
create index if not exists idx_knowledge_semantic_index_org on public.knowledge_semantic_index(organization_id);
create index if not exists idx_knowledge_solutions_org on public.knowledge_solutions(organization_id);
create index if not exists idx_knowledge_adrs_org on public.knowledge_adrs(organization_id);
create index if not exists idx_knowledge_prompt_base_org on public.knowledge_prompt_base(organization_id);
create index if not exists idx_knowledge_project_memory_org on public.knowledge_project_memory(organization_id);
create index if not exists idx_knowledge_client_memory_org on public.knowledge_client_memory(organization_id);
create index if not exists idx_knowledge_components_org on public.knowledge_components(organization_id);
create index if not exists idx_knowledge_patterns_org on public.knowledge_patterns(organization_id);
create index if not exists idx_knowledge_documentation_org on public.knowledge_documentation(organization_id);
create index if not exists idx_knowledge_ai_contexts_org on public.knowledge_ai_contexts(organization_id);
create index if not exists idx_knowledge_versions_org on public.knowledge_versions(organization_id);
create index if not exists idx_knowledge_analytics_org on public.knowledge_analytics(organization_id);
create index if not exists idx_knowledge_permissions_org on public.knowledge_permissions(organization_id);
create index if not exists idx_knowledge_cross_links_org on public.knowledge_cross_links(organization_id);
create index if not exists idx_knowledge_audit_logs_org on public.knowledge_audit_logs(organization_id);

drop trigger if exists trg_knowledge_entries_updated_at on public.knowledge_entries;
create trigger trg_knowledge_entries_updated_at before update on public.knowledge_entries for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_solutions_updated_at on public.knowledge_solutions;
create trigger trg_knowledge_solutions_updated_at before update on public.knowledge_solutions for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_adrs_updated_at on public.knowledge_adrs;
create trigger trg_knowledge_adrs_updated_at before update on public.knowledge_adrs for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_prompt_base_updated_at on public.knowledge_prompt_base;
create trigger trg_knowledge_prompt_base_updated_at before update on public.knowledge_prompt_base for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_project_memory_updated_at on public.knowledge_project_memory;
create trigger trg_knowledge_project_memory_updated_at before update on public.knowledge_project_memory for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_client_memory_updated_at on public.knowledge_client_memory;
create trigger trg_knowledge_client_memory_updated_at before update on public.knowledge_client_memory for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_components_updated_at on public.knowledge_components;
create trigger trg_knowledge_components_updated_at before update on public.knowledge_components for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_patterns_updated_at on public.knowledge_patterns;
create trigger trg_knowledge_patterns_updated_at before update on public.knowledge_patterns for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_documentation_updated_at on public.knowledge_documentation;
create trigger trg_knowledge_documentation_updated_at before update on public.knowledge_documentation for each row execute function public.set_updated_at();
drop trigger if exists trg_knowledge_ai_contexts_updated_at on public.knowledge_ai_contexts;
create trigger trg_knowledge_ai_contexts_updated_at before update on public.knowledge_ai_contexts for each row execute function public.set_updated_at();

alter table public.knowledge_entries enable row level security;
alter table public.knowledge_semantic_index enable row level security;
alter table public.knowledge_solutions enable row level security;
alter table public.knowledge_adrs enable row level security;
alter table public.knowledge_prompt_base enable row level security;
alter table public.knowledge_project_memory enable row level security;
alter table public.knowledge_client_memory enable row level security;
alter table public.knowledge_components enable row level security;
alter table public.knowledge_patterns enable row level security;
alter table public.knowledge_documentation enable row level security;
alter table public.knowledge_ai_contexts enable row level security;
alter table public.knowledge_versions enable row level security;
alter table public.knowledge_analytics enable row level security;
alter table public.knowledge_permissions enable row level security;
alter table public.knowledge_cross_links enable row level security;
alter table public.knowledge_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'knowledge_entries', 'knowledge_semantic_index', 'knowledge_solutions', 'knowledge_adrs',
    'knowledge_prompt_base', 'knowledge_project_memory', 'knowledge_client_memory',
    'knowledge_components', 'knowledge_patterns', 'knowledge_documentation',
    'knowledge_ai_contexts', 'knowledge_versions', 'knowledge_analytics',
    'knowledge_permissions', 'knowledge_cross_links', 'knowledge_audit_logs'
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
  ('knowledge.view', 'View knowledge repository and memory', 'knowledge'),
  ('knowledge.manage', 'Create and edit knowledge entries and memory', 'knowledge'),
  ('knowledge.publish', 'Publish and version knowledge content', 'knowledge'),
  ('knowledge.admin', 'Manage knowledge permissions and analytics', 'knowledge')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

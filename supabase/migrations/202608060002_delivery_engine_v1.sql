-- Delivery Engine v1.0 — internal execution system for AI-accelerated client delivery

create table if not exists public.de_blueprints (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  blueprint_key text not null,
  name text not null,
  category text not null,
  description text not null default '',
  estimated_build_hours numeric(8,2) not null default 0,
  component_count integer not null default 0,
  reuse_score numeric(5,2) not null default 0,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, blueprint_key)
);

create table if not exists public.de_components (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  component_key text not null,
  name text not null,
  category text not null,
  blueprint_key text not null default '',
  description text not null default '',
  reuse_count integer not null default 0,
  status text not null default 'production' check (status in ('draft', 'production', 'deprecated')),
  source_project_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, component_key)
);

create table if not exists public.de_engagements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  blueprint_key text not null default '',
  playbook_stage text not null default 'lead' check (playbook_stage in ('lead', 'discovery', 'scope', 'blueprint', 'build', 'verification', 'deployment', 'support')),
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'cancelled')),
  assigned_to text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.de_pipeline_runs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid references public.de_engagements(id) on delete cascade,
  pipeline_type text not null check (pipeline_type in ('init', 'environment', 'quality', 'testing', 'deployment', 'documentation')),
  status text not null default 'pending' check (status in ('pending', 'running', 'passed', 'failed')),
  duration_ms integer not null default 0,
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.de_quality_verifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid references public.de_engagements(id) on delete cascade,
  dimension text not null check (dimension in ('performance', 'security', 'accessibility', 'brand', 'seo', 'engineering', 'business_rules')),
  score numeric(5,2) not null default 0,
  passed boolean not null default false,
  findings text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.de_knowledge_entries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entry_type text not null check (entry_type in ('lesson', 'solution', 'fix', 'architecture', 'pattern')),
  title text not null,
  content text not null default '',
  tags text not null default '',
  source_engagement_id uuid references public.de_engagements(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.de_analytics_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric_key text not null,
  metric_value numeric(14,4) not null default 0,
  unit text not null default '',
  period text not null default 'all_time',
  created_at timestamptz not null default now(),
  unique (organization_id, metric_key, period)
);

create table if not exists public.de_ai_recommendations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  engagement_id uuid references public.de_engagements(id) on delete set null,
  recommendation_type text not null check (recommendation_type in ('blueprint', 'component', 'duplicate', 'improvement', 'checklist')),
  title text not null,
  description text not null default '',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed', 'executed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_de_blueprints_org on public.de_blueprints(organization_id);
create index if not exists idx_de_components_org on public.de_components(organization_id);
create index if not exists idx_de_engagements_org on public.de_engagements(organization_id);
create index if not exists idx_de_pipeline_runs_org on public.de_pipeline_runs(organization_id);
create index if not exists idx_de_quality_verifications_org on public.de_quality_verifications(organization_id);
create index if not exists idx_de_knowledge_entries_org on public.de_knowledge_entries(organization_id);
create index if not exists idx_de_analytics_metrics_org on public.de_analytics_metrics(organization_id);
create index if not exists idx_de_ai_recommendations_org on public.de_ai_recommendations(organization_id);

alter table public.de_blueprints enable row level security;
alter table public.de_components enable row level security;
alter table public.de_engagements enable row level security;
alter table public.de_pipeline_runs enable row level security;
alter table public.de_quality_verifications enable row level security;
alter table public.de_knowledge_entries enable row level security;
alter table public.de_analytics_metrics enable row level security;
alter table public.de_ai_recommendations enable row level security;

create policy "de_blueprints_org_access" on public.de_blueprints for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_components_org_access" on public.de_components for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_engagements_org_access" on public.de_engagements for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_pipeline_runs_org_access" on public.de_pipeline_runs for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_quality_verifications_org_access" on public.de_quality_verifications for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_knowledge_entries_org_access" on public.de_knowledge_entries for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_analytics_metrics_org_access" on public.de_analytics_metrics for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));
create policy "de_ai_recommendations_org_access" on public.de_ai_recommendations for all using (organization_id in (select organization_id from public.memberships where user_id = auth.uid()));

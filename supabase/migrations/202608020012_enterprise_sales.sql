-- Sprint 19: Enterprise Sales Pipeline & Revenue Operations

create table if not exists public.sales_pipelines (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  description text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.sales_pipeline_stages (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pipeline_id uuid not null references public.sales_pipelines(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  probability integer not null default 0 check (probability >= 0 and probability <= 100),
  is_closed_won boolean not null default false,
  is_closed_lost boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pipeline_id, name)
);

create table if not exists public.sales_leads (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  lead_name text not null,
  company_name text not null default '',
  email text not null default '',
  phone text not null default '',
  source text not null default 'inbound',
  status text not null default 'new',
  score integer not null default 0,
  assigned_to uuid references public.employees(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_number text not null,
  name text not null,
  description text not null default '',
  pipeline_id uuid references public.sales_pipelines(id) on delete set null,
  stage_id uuid references public.sales_pipeline_stages(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  assigned_to uuid references public.employees(id) on delete set null,
  amount numeric(14,2) not null default 0,
  probability integer not null default 0,
  expected_close_date date,
  status text not null default 'open',
  won_at timestamptz,
  lost_at timestamptz,
  lost_reason text not null default '',
  estimate_id uuid references public.estimates(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, opportunity_number)
);

create table if not exists public.sales_quotes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_number text not null,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  status text not null default 'draft',
  total_amount numeric(14,2) not null default 0,
  valid_until date,
  estimate_id uuid references public.estimates(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, quote_number)
);

create table if not exists public.sales_quote_items (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null references public.sales_quotes(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_forecasts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  forecast_period text not null,
  forecast_date date not null default current_date,
  pipeline_value numeric(14,2) not null default 0,
  weighted_value numeric(14,2) not null default 0,
  closed_value numeric(14,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_activities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  lead_id uuid references public.sales_leads(id) on delete set null,
  activity_type text not null default 'task',
  subject text not null,
  description text not null default '',
  due_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid references public.employees(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_meetings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  lead_id uuid references public.sales_leads(id) on delete set null,
  title text not null,
  location text not null default '',
  meeting_url text not null default '',
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 30,
  status text not null default 'scheduled',
  attendee_names text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sales_call_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  lead_id uuid references public.sales_leads(id) on delete set null,
  direction text not null default 'outbound',
  phone_number text not null default '',
  duration_seconds integer not null default 0,
  outcome text not null default '',
  notes text not null default '',
  called_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.sales_email_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  lead_id uuid references public.sales_leads(id) on delete set null,
  subject text not null,
  recipient_email text not null,
  status text not null default 'sent',
  sent_at timestamptz not null default now(),
  opened_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_targets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  period_label text not null,
  target_amount numeric(14,2) not null default 0,
  achieved_amount numeric(14,2) not null default 0,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_id, period_label)
);

create table if not exists public.sales_commissions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  commission_rate numeric(5,2) not null default 0,
  commission_amount numeric(14,2) not null default 0,
  status text not null default 'pending',
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.sales_win_loss_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  opportunity_id uuid not null references public.sales_opportunities(id) on delete cascade,
  outcome text not null,
  reason text not null default '',
  competitor text not null default '',
  amount numeric(14,2) not null default 0,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.sales_audit_logs (
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

create index if not exists idx_sales_pipelines_org on public.sales_pipelines(organization_id);
create index if not exists idx_sales_pipeline_stages_org on public.sales_pipeline_stages(organization_id);
create index if not exists idx_sales_leads_org on public.sales_leads(organization_id);
create index if not exists idx_sales_opportunities_org on public.sales_opportunities(organization_id);
create index if not exists idx_sales_quotes_org on public.sales_quotes(organization_id);
create index if not exists idx_sales_forecasts_org on public.sales_forecasts(organization_id);
create index if not exists idx_sales_activities_org on public.sales_activities(organization_id);
create index if not exists idx_sales_meetings_org on public.sales_meetings(organization_id);
create index if not exists idx_sales_call_logs_org on public.sales_call_logs(organization_id);
create index if not exists idx_sales_email_tracking_org on public.sales_email_tracking(organization_id);
create index if not exists idx_sales_targets_org on public.sales_targets(organization_id);
create index if not exists idx_sales_commissions_org on public.sales_commissions(organization_id);
create index if not exists idx_sales_win_loss_records_org on public.sales_win_loss_records(organization_id);
create index if not exists idx_sales_audit_logs_org on public.sales_audit_logs(organization_id);

drop trigger if exists trg_sales_pipelines_updated_at on public.sales_pipelines;
create trigger trg_sales_pipelines_updated_at before update on public.sales_pipelines for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_pipeline_stages_updated_at on public.sales_pipeline_stages;
create trigger trg_sales_pipeline_stages_updated_at before update on public.sales_pipeline_stages for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_leads_updated_at on public.sales_leads;
create trigger trg_sales_leads_updated_at before update on public.sales_leads for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_opportunities_updated_at on public.sales_opportunities;
create trigger trg_sales_opportunities_updated_at before update on public.sales_opportunities for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_quotes_updated_at on public.sales_quotes;
create trigger trg_sales_quotes_updated_at before update on public.sales_quotes for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_forecasts_updated_at on public.sales_forecasts;
create trigger trg_sales_forecasts_updated_at before update on public.sales_forecasts for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_meetings_updated_at on public.sales_meetings;
create trigger trg_sales_meetings_updated_at before update on public.sales_meetings for each row execute function public.set_updated_at();
drop trigger if exists trg_sales_targets_updated_at on public.sales_targets;
create trigger trg_sales_targets_updated_at before update on public.sales_targets for each row execute function public.set_updated_at();

alter table public.sales_pipelines enable row level security;
alter table public.sales_pipeline_stages enable row level security;
alter table public.sales_leads enable row level security;
alter table public.sales_opportunities enable row level security;
alter table public.sales_quotes enable row level security;
alter table public.sales_quote_items enable row level security;
alter table public.sales_forecasts enable row level security;
alter table public.sales_activities enable row level security;
alter table public.sales_meetings enable row level security;
alter table public.sales_call_logs enable row level security;
alter table public.sales_email_tracking enable row level security;
alter table public.sales_targets enable row level security;
alter table public.sales_commissions enable row level security;
alter table public.sales_win_loss_records enable row level security;
alter table public.sales_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'sales_pipelines', 'sales_pipeline_stages', 'sales_leads', 'sales_opportunities',
    'sales_quotes', 'sales_forecasts', 'sales_activities', 'sales_meetings',
    'sales_call_logs', 'sales_email_tracking', 'sales_targets', 'sales_commissions',
    'sales_win_loss_records', 'sales_audit_logs'
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

drop policy if exists sales_quote_items_select on public.sales_quote_items;
create policy sales_quote_items_select on public.sales_quote_items for select using (
  exists (select 1 from public.sales_quotes q where q.id = quote_id and public.is_organization_member(q.organization_id))
);
drop policy if exists sales_quote_items_insert on public.sales_quote_items;
create policy sales_quote_items_insert on public.sales_quote_items for insert with check (
  exists (select 1 from public.sales_quotes q where q.id = quote_id and public.is_organization_member(q.organization_id))
);
drop policy if exists sales_quote_items_update on public.sales_quote_items;
create policy sales_quote_items_update on public.sales_quote_items for update using (
  exists (select 1 from public.sales_quotes q where q.id = quote_id and public.is_organization_member(q.organization_id))
);
drop policy if exists sales_quote_items_delete on public.sales_quote_items;
create policy sales_quote_items_delete on public.sales_quote_items for delete using (
  exists (select 1 from public.sales_quotes q where q.id = quote_id and public.is_organization_member(q.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('sales.view', 'View sales pipeline and revenue data', 'sales'),
  ('sales.manage', 'Manage leads, opportunities, and quotes', 'sales'),
  ('sales.pipeline.manage', 'Manage pipelines, stages, and forecasts', 'sales'),
  ('sales.commissions.manage', 'Manage sales targets and commissions', 'sales')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

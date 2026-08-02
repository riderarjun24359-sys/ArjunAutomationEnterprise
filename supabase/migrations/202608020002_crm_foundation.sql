create table if not exists public.crm_clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text not null default 'lead',
  industry text not null default 'saas',
  contact_email text not null,
  manager_name text not null,
  revenue text not null default '$0',
  phone text,
  website text,
  address text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_leads (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_name text not null,
  contact_name text not null,
  stage text not null default 'new',
  score integer not null default 0,
  value text not null default '$0',
  assigned_to text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_deals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_name text not null,
  value text not null default '$0',
  close_date date,
  stage text not null default 'discovery',
  probability integer not null default 0,
  revenue_metric text not null default '$0 ARR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_activities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  activity_type text not null default 'note',
  title text not null,
  detail text not null,
  due_at text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  assignee text not null,
  due_date date,
  priority text not null default 'medium',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop policy if exists crm_clients_select on public.crm_clients;
create policy crm_clients_select on public.crm_clients for select using (true);
drop policy if exists crm_clients_insert on public.crm_clients;
create policy crm_clients_insert on public.crm_clients for insert with check (true);
drop policy if exists crm_clients_update on public.crm_clients;
create policy crm_clients_update on public.crm_clients for update using (true) with check (true);
drop policy if exists crm_leads_select on public.crm_leads;
create policy crm_leads_select on public.crm_leads for select using (true);
drop policy if exists crm_leads_insert on public.crm_leads;
create policy crm_leads_insert on public.crm_leads for insert with check (true);
drop policy if exists crm_leads_update on public.crm_leads;
create policy crm_leads_update on public.crm_leads for update using (true) with check (true);
drop policy if exists crm_deals_select on public.crm_deals;
create policy crm_deals_select on public.crm_deals for select using (true);
drop policy if exists crm_deals_insert on public.crm_deals;
create policy crm_deals_insert on public.crm_deals for insert with check (true);
drop policy if exists crm_deals_update on public.crm_deals;
create policy crm_deals_update on public.crm_deals for update using (true) with check (true);
drop policy if exists crm_activities_select on public.crm_activities;
create policy crm_activities_select on public.crm_activities for select using (true);
drop policy if exists crm_activities_insert on public.crm_activities;
create policy crm_activities_insert on public.crm_activities for insert with check (true);
drop policy if exists crm_activities_update on public.crm_activities;
create policy crm_activities_update on public.crm_activities for update using (true) with check (true);
drop policy if exists crm_tasks_select on public.crm_tasks;
create policy crm_tasks_select on public.crm_tasks for select using (true);
drop policy if exists crm_tasks_insert on public.crm_tasks;
create policy crm_tasks_insert on public.crm_tasks for insert with check (true);
drop policy if exists crm_tasks_update on public.crm_tasks;
create policy crm_tasks_update on public.crm_tasks for update using (true) with check (true);

alter table public.crm_clients enable row level security;
alter table public.crm_leads enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_tasks enable row level security;

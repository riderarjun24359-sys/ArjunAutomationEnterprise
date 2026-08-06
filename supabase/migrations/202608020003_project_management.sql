create table if not exists public.project_management (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text not null default 'planning',
  priority text not null default 'medium',
  progress integer not null default 0,
  budget text not null default '$0',
  timeline text not null default 'Q1',
  owner text not null,
  description text not null,
  template text not null default 'Standard',
  client text not null,
  team_size integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'pending',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  title text not null,
  status text not null default 'todo',
  assignee text not null,
  due_date date,
  priority text not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  name text not null,
  role text not null default 'member',
  capacity text not null default '100%',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.project_time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  project_name text not null,
  started_at text not null,
  duration text not null,
  status text not null default 'running',
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  name text not null,
  folder text not null,
  version text not null default 'v1',
  updated_at text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  author text not null,
  body text not null,
  mentions jsonb default '[]'::jsonb,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

drop policy if exists projects_select on public.project_management;
create policy projects_select on public.project_management for select using (true);
drop policy if exists projects_insert on public.project_management;
create policy projects_insert on public.project_management for insert with check (true);
drop policy if exists projects_update on public.project_management;
create policy projects_update on public.project_management for update using (true) with check (true);
drop policy if exists milestones_select on public.project_milestones;
create policy milestones_select on public.project_milestones for select using (true);
drop policy if exists milestones_insert on public.project_milestones;
create policy milestones_insert on public.project_milestones for insert with check (true);
drop policy if exists milestones_update on public.project_milestones;
create policy milestones_update on public.project_milestones for update using (true) with check (true);
drop policy if exists tasks_select on public.project_tasks;
create policy tasks_select on public.project_tasks for select using (true);
drop policy if exists tasks_insert on public.project_tasks;
create policy tasks_insert on public.project_tasks for insert with check (true);
drop policy if exists tasks_update on public.project_tasks;
create policy tasks_update on public.project_tasks for update using (true) with check (true);
drop policy if exists team_select on public.project_team_members;
create policy team_select on public.project_team_members for select using (true);
drop policy if exists team_insert on public.project_team_members;
create policy team_insert on public.project_team_members for insert with check (true);
drop policy if exists team_update on public.project_team_members;
create policy team_update on public.project_team_members for update using (true) with check (true);
drop policy if exists time_select on public.project_time_entries;
create policy time_select on public.project_time_entries for select using (true);
drop policy if exists time_insert on public.project_time_entries;
create policy time_insert on public.project_time_entries for insert with check (true);
drop policy if exists time_update on public.project_time_entries;
create policy time_update on public.project_time_entries for update using (true) with check (true);
drop policy if exists files_select on public.project_files;
create policy files_select on public.project_files for select using (true);
drop policy if exists files_insert on public.project_files;
create policy files_insert on public.project_files for insert with check (true);
drop policy if exists files_update on public.project_files;
create policy files_update on public.project_files for update using (true) with check (true);
drop policy if exists comments_select on public.project_comments;
create policy comments_select on public.project_comments for select using (true);
drop policy if exists comments_insert on public.project_comments;
create policy comments_insert on public.project_comments for insert with check (true);
drop policy if exists comments_update on public.project_comments;
create policy comments_update on public.project_comments for update using (true) with check (true);

alter table public.project_management enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_team_members enable row level security;
alter table public.project_time_entries enable row level security;
alter table public.project_files enable row level security;
alter table public.project_comments enable row level security;

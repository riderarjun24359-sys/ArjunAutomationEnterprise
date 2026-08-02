-- =============================================================================
-- Arjun Automation OS Enterprise — Production apply_all.sql
-- =============================================================================
-- Generated: 2026-08-02T18:55:35.793Z
-- Apply manually in Supabase SQL Editor (do not auto-execute from CI).
--
-- Contents:
--   Migrations (7):
--     - 202608020001_enterprise_foundation.sql
--     - 202608020002_crm_foundation.sql
--     - 202608020003_project_management.sql
--     - 202608020004_enterprise_data_platform.sql
--     - 202608020005_enterprise_finance.sql
--     - 202608020006_enterprise_automation.sql
--     - 202608020007_enterprise_analytics.sql
--   Seeds (7):
--     - 001_enterprise_seed.sql
--     - 002_crm_seed.sql
--     - 003_project_seed.sql
--     - 004_enterprise_data_platform_seed.sql
--     - 005_enterprise_finance_seed.sql
--     - 006_enterprise_automation_seed.sql
--     - 007_enterprise_analytics_seed.sql
--
-- Includes through Sprint 14:
--   Foundation, CRM, Projects, Data Platform, Finance, AI Automation & Workflows, Analytics
--
-- Idempotent: uses IF NOT EXISTS / ON CONFLICT DO NOTHING where applicable.
-- Safe to run on a project that already has core Sprint 10 tables.
-- =============================================================================

begin;

-- =============================================================================
-- MIGRATION: 202608020001_enterprise_foundation.sql
-- =============================================================================
create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  status text not null default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid not null unique,
  email text not null,
  full_name text,
  avatar_url text,
  locale text default 'en',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role_name text not null default 'member',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.permission_definitions (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default uuid_generate_v4(),
  role_name text not null,
  permission_key text not null,
  action text not null default 'read',
  created_at timestamptz not null default now(),
  unique (role_name, permission_key, action)
);

create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  entity_type text,
  entity_id uuid,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.storage_objects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  bucket text not null,
  path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop policy if exists orgs_select on public.organizations;
create policy orgs_select on public.organizations for select using (true);
drop policy if exists orgs_insert on public.organizations;
create policy orgs_insert on public.organizations for insert with check (true);
drop policy if exists orgs_update on public.organizations;
create policy orgs_update on public.organizations for update using (true) with check (true);
drop policy if exists profiles_select on public.user_profiles;
create policy profiles_select on public.user_profiles for select using (true);
drop policy if exists profiles_insert on public.user_profiles;
create policy profiles_insert on public.user_profiles for insert with check (true);
drop policy if exists profiles_update on public.user_profiles;
create policy profiles_update on public.user_profiles for update using (true) with check (true);
drop policy if exists memberships_select on public.organization_members;
create policy memberships_select on public.organization_members for select using (true);
drop policy if exists memberships_insert on public.organization_members;
create policy memberships_insert on public.organization_members for insert with check (true);
drop policy if exists memberships_update on public.organization_members;
create policy memberships_update on public.organization_members for update using (true) with check (true);
drop policy if exists permissions_select on public.permission_definitions;
create policy permissions_select on public.permission_definitions for select using (true);
drop policy if exists permissions_insert on public.permission_definitions;
create policy permissions_insert on public.permission_definitions for insert with check (true);
drop policy if exists role_perms_select on public.role_permissions;
create policy role_perms_select on public.role_permissions for select using (true);
drop policy if exists role_perms_insert on public.role_permissions;
create policy role_perms_insert on public.role_permissions for insert with check (true);
drop policy if exists audit_logs_select on public.audit_logs;
create policy audit_logs_select on public.audit_logs for select using (true);
drop policy if exists audit_logs_insert on public.audit_logs;
create policy audit_logs_insert on public.audit_logs for insert with check (true);
drop policy if exists storage_select on public.storage_objects;
create policy storage_select on public.storage_objects for select using (true);
drop policy if exists storage_insert on public.storage_objects;
create policy storage_insert on public.storage_objects for insert with check (true);
drop policy if exists storage_update on public.storage_objects;
create policy storage_update on public.storage_objects for update using (true) with check (true);

alter table public.organizations enable row level security;
alter table public.user_profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.permission_definitions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.storage_objects enable row level security;

-- =============================================================================
-- MIGRATION: 202608020002_crm_foundation.sql
-- =============================================================================
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

-- =============================================================================
-- MIGRATION: 202608020003_project_management.sql
-- =============================================================================
create table if not exists public.project_management (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'pending',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tasks (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  name text not null,
  role text not null default 'member',
  capacity text not null default '100%',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.project_time_entries (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  project_name text not null,
  started_at text not null,
  duration text not null,
  status text not null default 'running',
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.project_management(id) on delete cascade,
  name text not null,
  folder text not null,
  version text not null default 'v1',
  updated_at text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_comments (
  id uuid primary key default uuid_generate_v4(),
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

-- =============================================================================
-- MIGRATION: 202608020004_enterprise_data_platform.sql
-- =============================================================================
-- Sprint 10: Enterprise Data Platform — canonical schema, indexes, and RLS

-- ---------------------------------------------------------------------------
-- RBAC
-- ---------------------------------------------------------------------------

create table if not exists public.roles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.permissions (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  description text,
  resource text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permission_grants (
  id uuid primary key default uuid_generate_v4(),
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  action text not null default 'read',
  created_at timestamptz not null default now(),
  unique (role_id, permission_id, action)
);

-- ---------------------------------------------------------------------------
-- CRM
-- ---------------------------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  industry text,
  website text,
  phone text,
  address text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  first_name text not null,
  last_name text,
  email text,
  phone text,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  primary_contact_id uuid references public.contacts(id) on delete set null,
  name text not null,
  status text not null default 'active',
  industry text not null default 'saas',
  contact_email text not null,
  manager_name text not null,
  revenue text not null default '$0',
  phone text,
  website text,
  address text,
  description text,
  lifecycle_stage text not null default 'client',
  lead_score integer,
  deal_value text,
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  status text not null default 'planning',
  priority text not null default 'medium',
  progress integer not null default 0,
  budget text not null default '$0',
  timeline text not null default 'Q1',
  owner_name text not null,
  owner_id uuid references public.user_profiles(id) on delete set null,
  description text not null default '',
  template text not null default 'Standard',
  client_name text not null default '',
  team_size integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  name text not null,
  role text not null default 'member',
  capacity text not null default '100%',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'pending',
  progress integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_time_entries (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  project_name text not null,
  started_at text not null,
  duration text not null,
  status text not null default 'running',
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  folder text not null,
  version text not null default 'v1',
  updated_at text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_comments (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author text not null,
  body text not null,
  mentions jsonb default '[]'::jsonb,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Repoint legacy Sprint 9 project child tables (migration 003) to canonical projects FK.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'project_milestones',
    'project_time_entries',
    'project_files',
    'project_comments',
    'project_tasks',
    'project_team_members'
  ]
  loop
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = tbl
    ) then
      execute format(
        'alter table public.%I drop constraint if exists %I_project_id_fkey',
        tbl, tbl
      );
      execute format(
        'alter table public.%I add constraint %I_project_id_fkey foreign key (project_id) references public.projects(id) on delete cascade',
        tbl, tbl
      );
    end if;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Tasks
-- ---------------------------------------------------------------------------

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  assignee_id uuid references public.user_profiles(id) on delete set null,
  assignee_name text,
  due_date date,
  estimated_hours numeric(8, 2),
  completed_hours numeric(8, 2) default 0,
  tags text[] default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_labels (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text not null default 'slate',
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.task_label_assignments (
  task_id uuid not null references public.tasks(id) on delete cascade,
  label_id uuid not null references public.task_labels(id) on delete cascade,
  primary key (task_id, label_id)
);

create table if not exists public.task_comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.user_profiles(id) on delete set null,
  author_name text not null default '',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Platform signals
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete cascade,
  title text not null,
  body text not null default '',
  notification_type text not null default 'info',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  title text not null,
  detail text not null default '',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Foreign key hardening on foundation tables
-- ---------------------------------------------------------------------------

alter table public.audit_logs
  drop constraint if exists audit_logs_organization_id_fkey;

alter table public.audit_logs
  add constraint audit_logs_organization_id_fkey
  foreign key (organization_id) references public.organizations(id) on delete set null;

alter table public.audit_logs
  drop constraint if exists audit_logs_user_id_fkey;

alter table public.audit_logs
  add constraint audit_logs_user_id_fkey
  foreign key (user_id) references public.user_profiles(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_user_profiles_auth_user_id on public.user_profiles(auth_user_id);
create index if not exists idx_organization_members_org on public.organization_members(organization_id);
create index if not exists idx_organization_members_user on public.organization_members(user_id);
create index if not exists idx_companies_org on public.companies(organization_id);
create index if not exists idx_contacts_org on public.contacts(organization_id);
create index if not exists idx_contacts_company on public.contacts(company_id);
create index if not exists idx_clients_org on public.clients(organization_id);
create index if not exists idx_clients_lifecycle on public.clients(lifecycle_stage);
create index if not exists idx_projects_org on public.projects(organization_id);
create index if not exists idx_project_members_project on public.project_members(project_id);
create index if not exists idx_tasks_org on public.tasks(organization_id);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_task_labels_org on public.task_labels(organization_id);
create index if not exists idx_task_comments_task on public.task_comments(task_id);
create index if not exists idx_notifications_org on public.notifications(organization_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_activity_logs_org on public.activity_logs(organization_id);
create index if not exists idx_activity_logs_entity on public.activity_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_org on public.audit_logs(organization_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

create or replace function public.auth_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.user_profiles where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public.is_organization_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = org_id
      and om.user_id = public.auth_profile_id()
      and om.is_active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS policies (organization-scoped)
-- ---------------------------------------------------------------------------

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'companies', 'contacts', 'clients', 'projects', 'tasks', 'task_labels',
    'notifications', 'activity_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', tbl);

    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format(
      'create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))',
      tbl, tbl
    );

    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format(
      'create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))',
      tbl, tbl
    );

    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format(
      'create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))',
      tbl, tbl
    );

    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format(
      'create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))',
      tbl, tbl
    );
  end loop;
end $$;

alter table public.roles enable row level security;
drop policy if exists roles_select on public.roles;
create policy roles_select on public.roles for select using (
  organization_id is null or public.is_organization_member(organization_id)
);

-- Child tables keyed by project_id inherit access through projects
alter table public.project_members enable row level security;
drop policy if exists project_members_select on public.project_members;
create policy project_members_select on public.project_members for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);
drop policy if exists project_members_insert on public.project_members;
create policy project_members_insert on public.project_members for insert with check (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);
drop policy if exists project_members_update on public.project_members;
create policy project_members_update on public.project_members for update using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);
drop policy if exists project_members_delete on public.project_members;
create policy project_members_delete on public.project_members for delete using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);

alter table public.project_milestones enable row level security;
drop policy if exists project_milestones_select on public.project_milestones;
create policy project_milestones_select on public.project_milestones for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);
drop policy if exists project_milestones_insert on public.project_milestones;
create policy project_milestones_insert on public.project_milestones for insert with check (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);
drop policy if exists project_milestones_update on public.project_milestones;
create policy project_milestones_update on public.project_milestones for update using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);

alter table public.project_time_entries enable row level security;
drop policy if exists project_time_entries_select on public.project_time_entries;
create policy project_time_entries_select on public.project_time_entries for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);

alter table public.project_files enable row level security;
drop policy if exists project_files_select on public.project_files;
create policy project_files_select on public.project_files for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);

alter table public.project_comments enable row level security;
drop policy if exists project_comments_select on public.project_comments;
create policy project_comments_select on public.project_comments for select using (
  exists (select 1 from public.projects p where p.id = project_id and public.is_organization_member(p.organization_id))
);

alter table public.task_label_assignments enable row level security;
drop policy if exists task_label_assignments_select on public.task_label_assignments;
create policy task_label_assignments_select on public.task_label_assignments for select using (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and public.is_organization_member(t.organization_id)
  )
);
drop policy if exists task_label_assignments_insert on public.task_label_assignments;
create policy task_label_assignments_insert on public.task_label_assignments for insert with check (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and public.is_organization_member(t.organization_id)
  )
);
drop policy if exists task_label_assignments_delete on public.task_label_assignments;
create policy task_label_assignments_delete on public.task_label_assignments for delete using (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and public.is_organization_member(t.organization_id)
  )
);

alter table public.task_comments enable row level security;
drop policy if exists task_comments_select on public.task_comments;
create policy task_comments_select on public.task_comments for select using (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and public.is_organization_member(t.organization_id)
  )
);

alter table public.permissions enable row level security;
drop policy if exists permissions_select on public.permissions;
create policy permissions_select on public.permissions for select using (auth.role() = 'authenticated');

alter table public.role_permission_grants enable row level security;
drop policy if exists role_permission_grants_select on public.role_permission_grants;
create policy role_permission_grants_select on public.role_permission_grants for select using (auth.role() = 'authenticated');

-- Profile policies scoped to authenticated user
drop policy if exists profiles_select on public.user_profiles;
create policy profiles_select on public.user_profiles for select using (auth_user_id = auth.uid());
drop policy if exists profiles_insert on public.user_profiles;
create policy profiles_insert on public.user_profiles for insert with check (auth_user_id = auth.uid());
drop policy if exists profiles_update on public.user_profiles;
create policy profiles_update on public.user_profiles for update using (auth_user_id = auth.uid());

-- =============================================================================
-- MIGRATION: 202608020005_enterprise_finance.sql
-- =============================================================================
-- Sprint 12: Enterprise Finance & Invoicing

create table if not exists public.tax_rates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  rate_percent numeric(5, 2) not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estimates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  number text not null,
  status text not null default 'draft',
  issue_date date not null default current_date,
  valid_until date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estimate_line_items (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  tax_rate_id uuid references public.tax_rates(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  estimate_id uuid references public.estimates(id) on delete set null,
  number text not null,
  status text not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  paid_at timestamptz,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  amount_paid numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_line_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(12, 2) not null default 0,
  tax_rate_id uuid references public.tax_rates(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12, 2) not null default 0,
  payment_date date not null default current_date,
  method text not null default 'wire',
  reference text not null default '',
  status text not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  category text not null default 'general',
  description text not null,
  amount numeric(12, 2) not null default 0,
  expense_date date not null default current_date,
  status text not null default 'pending',
  submitted_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recurring_invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  frequency text not null default 'monthly',
  next_run_date date not null,
  end_date date,
  subtotal numeric(12, 2) not null default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  is_active boolean not null default true,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tax_rates_updated_at on public.tax_rates;
create trigger trg_tax_rates_updated_at before update on public.tax_rates for each row execute function public.set_updated_at();

drop trigger if exists trg_estimates_updated_at on public.estimates;
create trigger trg_estimates_updated_at before update on public.estimates for each row execute function public.set_updated_at();

drop trigger if exists trg_invoices_updated_at on public.invoices;
create trigger trg_invoices_updated_at before update on public.invoices for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

drop trigger if exists trg_expenses_updated_at on public.expenses;
create trigger trg_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();

drop trigger if exists trg_recurring_invoices_updated_at on public.recurring_invoices;
create trigger trg_recurring_invoices_updated_at before update on public.recurring_invoices for each row execute function public.set_updated_at();

create index if not exists idx_tax_rates_org on public.tax_rates(organization_id);
create index if not exists idx_estimates_org on public.estimates(organization_id);
create index if not exists idx_estimates_client on public.estimates(client_id);
create index if not exists idx_estimates_status on public.estimates(status);
create index if not exists idx_estimate_line_items_estimate on public.estimate_line_items(estimate_id);
create index if not exists idx_invoices_org on public.invoices(organization_id);
create index if not exists idx_invoices_client on public.invoices(client_id);
create index if not exists idx_invoices_project on public.invoices(project_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_due_date on public.invoices(due_date);
create index if not exists idx_invoice_line_items_invoice on public.invoice_line_items(invoice_id);
create index if not exists idx_payments_org on public.payments(organization_id);
create index if not exists idx_payments_invoice on public.payments(invoice_id);
create index if not exists idx_expenses_org on public.expenses(organization_id);
create index if not exists idx_expenses_project on public.expenses(project_id);
create index if not exists idx_recurring_invoices_org on public.recurring_invoices(organization_id);
create index if not exists idx_recurring_invoices_client on public.recurring_invoices(client_id);

alter table public.tax_rates enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_line_items enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_line_items enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.recurring_invoices enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['tax_rates', 'estimates', 'invoices', 'payments', 'expenses', 'recurring_invoices']
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

drop policy if exists estimate_line_items_select on public.estimate_line_items;
create policy estimate_line_items_select on public.estimate_line_items for select using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_insert on public.estimate_line_items;
create policy estimate_line_items_insert on public.estimate_line_items for insert with check (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_update on public.estimate_line_items;
create policy estimate_line_items_update on public.estimate_line_items for update using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);
drop policy if exists estimate_line_items_delete on public.estimate_line_items;
create policy estimate_line_items_delete on public.estimate_line_items for delete using (
  exists (select 1 from public.estimates e where e.id = estimate_id and public.is_organization_member(e.organization_id))
);

drop policy if exists invoice_line_items_select on public.invoice_line_items;
create policy invoice_line_items_select on public.invoice_line_items for select using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_insert on public.invoice_line_items;
create policy invoice_line_items_insert on public.invoice_line_items for insert with check (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_update on public.invoice_line_items;
create policy invoice_line_items_update on public.invoice_line_items for update using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);
drop policy if exists invoice_line_items_delete on public.invoice_line_items;
create policy invoice_line_items_delete on public.invoice_line_items for delete using (
  exists (select 1 from public.invoices i where i.id = invoice_id and public.is_organization_member(i.organization_id))
);

insert into public.permissions (key, description, resource)
values ('finance.manage', 'Manage finance and invoicing', 'finance')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020006_enterprise_automation.sql
-- =============================================================================
-- Sprint 13: Enterprise AI Automation & Workflow Builder

create table if not exists public.ai_agents (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  trigger_type text not null default 'manual',
  event_name text not null default '',
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_actions (
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  step_order integer not null default 0,
  action_type text not null default 'notify',
  config jsonb not null default '{}'::jsonb,
  agent_id uuid references public.ai_agents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_conditions (
  id uuid primary key default uuid_generate_v4(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  step_order integer not null default 0,
  field text not null,
  operator text not null default 'equals',
  value text not null default '',
  logic_group text not null default 'default',
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_schedules (
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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
  id uuid primary key default uuid_generate_v4(),
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

-- =============================================================================
-- MIGRATION: 202608020007_enterprise_analytics.sql
-- =============================================================================
-- Sprint 14: Enterprise Analytics & Performance Insights

create table if not exists public.analytics_dashboards (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  is_default boolean not null default false,
  layout jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_widgets (
  id uuid primary key default uuid_generate_v4(),
  dashboard_id uuid not null references public.analytics_dashboards(id) on delete cascade,
  title text not null,
  widget_type text not null default 'kpi',
  metric_key text not null default '',
  chart_type text not null default 'line',
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric_key text not null,
  label text not null,
  category text not null default 'general',
  value numeric(14, 2) not null default 0,
  unit text not null default '',
  period_start date,
  period_end date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key, period_start, period_end)
);

create table if not exists public.analytics_reports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  report_type text not null default 'summary',
  status text not null default 'draft',
  filters jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_analytics_dashboards_updated_at on public.analytics_dashboards;
create trigger trg_analytics_dashboards_updated_at before update on public.analytics_dashboards for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_widgets_updated_at on public.analytics_widgets;
create trigger trg_analytics_widgets_updated_at before update on public.analytics_widgets for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_metrics_updated_at on public.analytics_metrics;
create trigger trg_analytics_metrics_updated_at before update on public.analytics_metrics for each row execute function public.set_updated_at();

drop trigger if exists trg_analytics_reports_updated_at on public.analytics_reports;
create trigger trg_analytics_reports_updated_at before update on public.analytics_reports for each row execute function public.set_updated_at();

create index if not exists idx_analytics_dashboards_org on public.analytics_dashboards(organization_id);
create index if not exists idx_analytics_widgets_dashboard on public.analytics_widgets(dashboard_id);
create index if not exists idx_analytics_metrics_org on public.analytics_metrics(organization_id);
create index if not exists idx_analytics_metrics_category on public.analytics_metrics(category);
create index if not exists idx_analytics_reports_org on public.analytics_reports(organization_id);
create index if not exists idx_analytics_reports_type on public.analytics_reports(report_type);

alter table public.analytics_dashboards enable row level security;
alter table public.analytics_widgets enable row level security;
alter table public.analytics_metrics enable row level security;
alter table public.analytics_reports enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array['analytics_dashboards', 'analytics_metrics', 'analytics_reports']
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

drop policy if exists analytics_widgets_select on public.analytics_widgets;
create policy analytics_widgets_select on public.analytics_widgets for select using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_insert on public.analytics_widgets;
create policy analytics_widgets_insert on public.analytics_widgets for insert with check (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_update on public.analytics_widgets;
create policy analytics_widgets_update on public.analytics_widgets for update using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);
drop policy if exists analytics_widgets_delete on public.analytics_widgets;
create policy analytics_widgets_delete on public.analytics_widgets for delete using (
  exists (select 1 from public.analytics_dashboards d where d.id = dashboard_id and public.is_organization_member(d.organization_id))
);

insert into public.permissions (key, description, resource)
values ('analytics.manage', 'Manage analytics dashboards and reports', 'analytics')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- SEED: 001_enterprise_seed.sql
-- =============================================================================
insert into public.organizations (id, name, slug, status, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'Acme Enterprise', 'acme-enterprise', 'active', '{"industry":"software"}'::jsonb)
on conflict (id) do nothing;

-- user_profiles and organization_members are created at auth signup via handle_new_profile trigger (see 004 seed).

insert into public.permission_definitions (key, description)
values
  ('dashboard.view', 'View dashboard'),
  ('projects.manage', 'Manage projects'),
  ('clients.manage', 'Manage clients')
on conflict (key) do nothing;

insert into public.role_permissions (role_name, permission_key, action)
values
  ('super_admin', 'dashboard.view', 'manage'),
  ('super_admin', 'projects.manage', 'manage'),
  ('super_admin', 'clients.manage', 'manage')
on conflict (role_name, permission_key, action) do nothing;

-- =============================================================================
-- SEED: 002_crm_seed.sql
-- =============================================================================
insert into public.organizations (id, name, slug, status, metadata) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'northstar-labs', 'active', '{"segment":"saas"}')
on conflict (id) do nothing;

insert into public.crm_clients (organization_id, name, status, industry, contact_email, manager_name, revenue, phone, website, address, description) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'active', 'saas', 'ops@northstarlabs.com', 'Mina Park', '$248k', '+1 415 555 0148', 'https://northstarlabs.com', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.'),
  ('11111111-1111-1111-1111-111111111111', 'Apex Commerce', 'at_risk', 'retail', 'vp@apexcommerce.com', 'Drew Hsu', '$96k', '+1 212 555 0149', 'https://apexcommerce.com', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.');

insert into public.crm_leads (organization_id, company_name, contact_name, stage, score, value, assigned_to) values
  ('11111111-1111-1111-1111-111111111111', 'Helio Health', 'Sara Kim', 'qualified', 82, '$48k', 'Lina Ortiz'),
  ('11111111-1111-1111-1111-111111111111', 'Summit Retail', 'Tom Reed', 'proposal', 71, '$67k', 'Jordan Lee');

insert into public.crm_deals (organization_id, client_name, value, close_date, stage, probability, revenue_metric) values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Labs', '$124k', '2026-08-28', 'negotiation', 74, '+$18k ARR'),
  ('11111111-1111-1111-1111-111111111111', 'Apex Commerce', '$84k', '2026-09-14', 'proposal', 61, '+$12k ARR');

insert into public.crm_activities (organization_id, activity_type, title, detail, due_at) values
  ('11111111-1111-1111-1111-111111111111', 'call', 'Discovery call completed', 'Discussed implementation timeline', '10 mins ago'),
  ('11111111-1111-1111-1111-111111111111', 'meeting', 'Executive review', 'Shared revenue projection', '1 hr ago'),
  ('11111111-1111-1111-1111-111111111111', 'email', 'Proposal sent', 'Follow-up scheduled for Friday', 'Today');

insert into public.crm_tasks (organization_id, title, assignee, due_date, priority, status) values
  ('11111111-1111-1111-1111-111111111111', 'Prepare onboarding checklist', 'Mina Park', '2026-08-04', 'high', 'pending'),
  ('11111111-1111-1111-1111-111111111111', 'Review contract terms', 'Drew Hsu', '2026-08-06', 'medium', 'in_progress');

-- =============================================================================
-- SEED: 003_project_seed.sql
-- =============================================================================
-- Legacy Sprint 9 project_management seed removed.
-- Canonical projects, milestones, tasks, and members are seeded in
-- 004_enterprise_data_platform_seed.sql after parent organizations, clients,
-- and projects records exist.

-- =============================================================================
-- SEED: 004_enterprise_data_platform_seed.sql
-- =============================================================================
-- Sprint 10 seed: canonical enterprise data platform records

insert into public.organizations (id, name, slug, status, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'Acme Enterprise', 'acme-enterprise', 'active', '{"industry":"software"}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  status = excluded.status,
  metadata = excluded.metadata;

insert into public.permissions (key, description, resource)
values
  ('dashboard.view', 'View executive dashboard', 'dashboard'),
  ('clients.manage', 'Manage CRM clients', 'crm'),
  ('projects.manage', 'Manage projects', 'projects'),
  ('tasks.manage', 'Manage tasks', 'tasks'),
  ('organization.manage', 'Manage organization settings', 'organization')
on conflict (key) do update set
  description = excluded.description,
  resource = excluded.resource;

insert into public.roles (id, organization_id, name, description, is_system)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'super_admin', 'Full platform access', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'member', 'Standard workspace member', true)
on conflict (organization_id, name) do nothing;

insert into public.role_permission_grants (role_id, permission_id, action)
select r.id, p.id, 'manage'
from public.roles r
cross join public.permissions p
where r.name = 'super_admin'
on conflict (role_id, permission_id, action) do nothing;

insert into public.companies (id, organization_id, name, industry, website, phone, address, description)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', '11111111-1111-1111-1111-111111111111', 'Northstar Labs', 'saas', 'https://northstarlabs.com', '+1 415 555 0148', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', '11111111-1111-1111-1111-111111111111', 'Apex Commerce', 'retail', 'https://apexcommerce.com', '+1 212 555 0149', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', '11111111-1111-1111-1111-111111111111', 'Helio Health', 'healthcare', null, null, null, 'Digital health platform.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccc04', '11111111-1111-1111-1111-111111111111', 'Summit Retail', 'retail', null, null, null, 'Regional retail chain.')
on conflict (id) do nothing;

insert into public.contacts (id, organization_id, company_id, first_name, last_name, email, phone, title)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'Ops', 'Team', 'ops@northstarlabs.com', '+1 415 555 0148', 'Operations'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd02', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc02', 'VP', 'Commerce', 'vp@apexcommerce.com', '+1 212 555 0149', 'VP Sales'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd03', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc03', 'Sara', 'Kim', 'sara@heliohealth.com', null, 'Director'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd04', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc04', 'Tom', 'Reed', 'tom@summitretail.com', null, 'Buyer')
on conflict (id) do nothing;

insert into public.clients (id, organization_id, company_id, primary_contact_id, name, status, industry, contact_email, manager_name, revenue, phone, website, address, description, lifecycle_stage, lead_score, deal_value, assigned_to)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'Northstar Labs', 'active', 'saas', 'ops@northstarlabs.com', 'Mina Park', '$248k', '+1 415 555 0148', 'https://northstarlabs.com', '450 Market Street, San Francisco, CA', 'Series B SaaS company focused on workflow automation.', 'client', null, null, null),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', 'Apex Commerce', 'at_risk', 'retail', 'vp@apexcommerce.com', 'Drew Hsu', '$96k', '+1 212 555 0149', 'https://apexcommerce.com', '21 Mercer Street, New York, NY', 'Omnichannel retail group expanding into B2B services.', 'client', null, null, null),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc03', 'dddddddd-dddd-dddd-dddd-dddddddddd03', 'Helio Health', 'lead', 'healthcare', 'sara@heliohealth.com', 'Lina Ortiz', '$48k', null, null, null, 'Qualified healthcare lead.', 'qualified', 82, '$48k', 'Lina Ortiz'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', '11111111-1111-1111-1111-111111111111', 'cccccccc-cccc-cccc-cccc-cccccccccc04', 'dddddddd-dddd-dddd-dddd-dddddddddd04', 'Summit Retail', 'lead', 'retail', 'tom@summitretail.com', 'Jordan Lee', '$67k', null, null, null, 'Proposal-stage retail lead.', 'proposal', 71, '$67k', 'Jordan Lee')
on conflict (id) do nothing;

insert into public.projects (id, organization_id, client_id, name, status, priority, progress, budget, timeline, owner_name, description, template, client_name, team_size)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'Northstar Expansion', 'active', 'high', 74, '$284k', 'Q3 2026', 'Mina Park', 'Expand the enterprise implementation footprint across new verticals.', 'Enterprise Delivery', 'Northstar Labs', 8),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'FinOps Refresh', 'planning', 'medium', 36, '$92k', 'Q4 2026', 'Drew Hsu', 'Modernize finance automation and reporting readiness.', 'Operational Readiness', 'Apex Commerce', 4)
on conflict (id) do nothing;

insert into public.project_members (project_id, name, role, capacity, status)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Mina Park', 'owner', '92%', 'active'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Lina Ortiz', 'manager', '78%', 'active'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', 'Drew Hsu', 'owner', '64%', 'active')
on conflict do nothing;

insert into public.project_milestones (project_id, title, due_date, status, progress)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Discovery complete', '2026-08-10', 'completed', 100),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Pilot launch', '2026-08-24', 'in_progress', 62)
on conflict do nothing;

insert into public.project_time_entries (project_id, project_name, started_at, duration, status)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Northstar Expansion', '09:15', '2h 12m', 'running'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', 'FinOps Refresh', '13:40', '1h 05m', 'paused')
on conflict do nothing;

insert into public.project_files (project_id, name, folder, version, updated_at)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Implementation Plan.pdf', 'Planning', 'v3', 'Today'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Architecture Diagram.png', 'Design', 'v1', 'Yesterday')
on conflict do nothing;

insert into public.project_comments (project_id, author, body, mentions, attachments)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', 'Mina Park', 'Need final sign-off before the pilot starts.', '["Lina"]'::jsonb, '["plan.pdf"]'::jsonb)
on conflict do nothing;

insert into public.task_labels (id, organization_id, name, color)
values
  ('99999999-9999-9999-9999-999999999901', '11111111-1111-1111-1111-111111111111', 'Infrastructure', 'emerald'),
  ('99999999-9999-9999-9999-999999999902', '11111111-1111-1111-1111-111111111111', 'Client Delivery', 'blue'),
  ('99999999-9999-9999-9999-999999999903', '11111111-1111-1111-1111-111111111111', 'Compliance', 'amber'),
  ('99999999-9999-9999-9999-999999999904', '11111111-1111-1111-1111-111111111111', 'Automation', 'violet'),
  ('99999999-9999-9999-9999-999999999905', '11111111-1111-1111-1111-111111111111', 'Security', 'rose')
on conflict (organization_id, name) do nothing;

insert into public.tasks (id, organization_id, project_id, title, description, status, priority, assignee_name, due_date, estimated_hours, completed_hours, tags)
values
  ('88888888-8888-8888-8888-888888888801', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Finalize enterprise rollout plan', 'Complete the phased rollout strategy for Northstar Labs across all business units.', 'in_progress', 'critical', 'Mina Park', '2026-08-06', 16, 10, array['rollout', 'enterprise']),
  ('88888888-8888-8888-8888-888888888802', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Review integration requirements', 'Audit third-party API integration requirements and document compatibility matrix.', 'todo', 'high', 'Jordan Lee', '2026-08-08', 8, 0, array['integration', 'api']),
  ('88888888-8888-8888-8888-888888888803', '11111111-1111-1111-1111-111111111111', null, 'Prepare SOC 2 evidence package', 'Compile audit evidence for access controls, change management, and incident response.', 'review', 'critical', 'Drew Hsu', '2026-08-05', 24, 22, array['compliance', 'audit']),
  ('88888888-8888-8888-8888-888888888804', '11111111-1111-1111-1111-111111111111', null, 'Automate client onboarding workflow', 'Build end-to-end automation for client provisioning, document collection, and kickoff scheduling.', 'in_progress', 'high', 'Lina Ortiz', '2026-08-12', 32, 18, array['automation', 'onboarding']),
  ('88888888-8888-8888-8888-888888888805', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'Resolve production deployment blocker', 'Investigate and fix the CI/CD pipeline failure blocking the FinOps Refresh release.', 'blocked', 'urgent', 'Jordan Lee', '2026-08-03', 6, 2, array['deployment', 'blocker']),
  ('88888888-8888-8888-8888-888888888806', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Complete regression test suite', 'Execute full regression suite for the Q3 release candidate and document results.', 'done', 'medium', 'Sara Chen', '2026-07-30', 12, 12, array['qa', 'release']),
  ('88888888-8888-8888-8888-888888888807', '11111111-1111-1111-1111-111111111111', null, 'Update executive dashboard metrics', 'Refresh KPI definitions and wire new data sources into the executive dashboard.', 'todo', 'medium', null, '2026-08-15', 10, 0, array['analytics', 'dashboard']),
  ('88888888-8888-8888-8888-888888888808', '11111111-1111-1111-1111-111111111111', null, 'Draft vendor security assessment', 'Evaluate third-party vendor security posture and produce risk assessment report.', 'todo', 'high', 'Drew Hsu', '2026-08-01', 14, 0, array['security', 'vendor'])
on conflict (id) do nothing;

insert into public.task_label_assignments (task_id, label_id)
values
  ('88888888-8888-8888-8888-888888888801', '99999999-9999-9999-9999-999999999901'),
  ('88888888-8888-8888-8888-888888888801', '99999999-9999-9999-9999-999999999902'),
  ('88888888-8888-8888-8888-888888888802', '99999999-9999-9999-9999-999999999901'),
  ('88888888-8888-8888-8888-888888888802', '99999999-9999-9999-9999-999999999905')
on conflict do nothing;

insert into public.activity_logs (organization_id, entity_type, action, title, detail, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'deal', 'update', 'Northstar Labs', 'Negotiation in progress', '{"value":"$124k","stage":"negotiation","probability":74,"revenueMetric":"+$18k ARR","closeDate":"2026-08-28"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'deal', 'update', 'Apex Commerce', 'Proposal submitted', '{"value":"$84k","stage":"proposal","probability":61,"revenueMetric":"+$12k ARR","closeDate":"2026-09-14"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'call', 'Discovery call completed', 'Discussed implementation timeline', '{"dueAt":"10 mins ago"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'meeting', 'Executive review', 'Shared revenue projection', '{"dueAt":"1 hr ago"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'activity', 'email', 'Proposal sent', 'Follow-up scheduled for Friday', '{"dueAt":"Today"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'crm_task', 'create', 'Prepare onboarding checklist', 'Assigned to Mina Park', '{"assignee":"Mina Park","dueDate":"2026-08-04","priority":"high","status":"pending"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'crm_task', 'update', 'Review contract terms', 'Assigned to Drew Hsu', '{"assignee":"Drew Hsu","dueDate":"2026-08-06","priority":"medium","status":"in_progress"}'::jsonb)
on conflict do nothing;

insert into public.audit_logs (organization_id, entity_type, action, metadata)
values
  ('11111111-1111-1111-1111-111111111111', 'organization', 'view', '{"source":"seed"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'dashboard', 'view', '{"source":"seed"}'::jsonb),
  ('11111111-1111-1111-1111-111111111111', 'project', 'update', '{"project":"Northstar Expansion"}'::jsonb)
on conflict do nothing;

insert into public.notifications (organization_id, title, body, notification_type)
values
  ('11111111-1111-1111-1111-111111111111', 'Workspace ready', 'Enterprise data platform seeded successfully.', 'success'),
  ('11111111-1111-1111-1111-111111111111', 'New deal activity', 'Northstar Labs moved to negotiation.', 'info')
on conflict do nothing;

-- Auto-enroll new profiles into the default organization for RLS access
create or replace function public.handle_new_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_org uuid := '11111111-1111-1111-1111-111111111111';
begin
  insert into public.organization_members (organization_id, user_id, role_name, is_active)
  values (default_org, new.id, 'member', true)
  on conflict (organization_id, user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_profile_created on public.user_profiles;
create trigger on_profile_created
after insert on public.user_profiles
for each row execute function public.handle_new_profile();

-- =============================================================================
-- SEED: 005_enterprise_finance_seed.sql
-- =============================================================================
insert into public.tax_rates (id, organization_id, name, rate_percent, is_default)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', '11111111-1111-1111-1111-111111111111', 'Standard Sales Tax', 8.50, true)
on conflict (id) do nothing;

insert into public.estimates (id, organization_id, client_id, project_id, number, status, issue_date, valid_until, subtotal, tax_amount, total, currency, notes)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'EST-1001', 'sent', '2026-07-15', '2026-08-15', 25000.00, 2125.00, 27125.00, 'USD', 'Northstar expansion phase 2 proposal'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'EST-1002', 'accepted', '2026-07-20', '2026-09-01', 9200.00, 782.00, 9982.00, 'USD', 'FinOps refresh engagement')
on conflict (id) do nothing;

insert into public.estimate_line_items (id, estimate_id, description, quantity, unit_price, tax_rate_id, amount, sort_order)
values
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c301', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'Enterprise implementation services', 1, 25000.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 25000.00, 1),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c302', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'Finance automation consulting', 1, 9200.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 9200.00, 1)
on conflict (id) do nothing;

insert into public.invoices (id, organization_id, client_id, project_id, estimate_id, number, status, issue_date, due_date, subtotal, tax_amount, total, amount_paid, currency, notes)
values
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'INV-2001', 'paid', '2026-07-28', '2026-08-28', 25000.00, 2125.00, 27125.00, 27125.00, 'USD', 'Northstar expansion milestone 1'),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'INV-2002', 'sent', '2026-08-01', '2026-08-15', 9200.00, 782.00, 9982.00, 0.00, 'USD', 'FinOps refresh kickoff invoice')
on conflict (id) do nothing;

insert into public.invoice_line_items (id, invoice_id, description, quantity, unit_price, tax_rate_id, amount, sort_order)
values
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'Enterprise implementation services', 1, 25000.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 25000.00, 1),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', 'Finance automation consulting', 1, 9200.00, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 9200.00, 1)
on conflict (id) do nothing;

insert into public.payments (id, organization_id, invoice_id, client_id, amount, payment_date, method, reference, status)
values
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f601', '11111111-1111-1111-1111-111111111111', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 27125.00, '2026-08-05', 'wire', 'WIRE-NS-0825', 'completed')
on conflict (id) do nothing;

insert into public.expenses (id, organization_id, project_id, client_id, category, description, amount, expense_date, status, submitted_by)
values
  ('17171717-1717-1717-1717-171717171701', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'travel', 'On-site implementation travel', 1840.00, '2026-07-22', 'approved', 'Mina Park'),
  ('17171717-1717-1717-1717-171717171702', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff02', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'software', 'Finance automation tooling license', 620.00, '2026-07-30', 'pending', 'Drew Hsu')
on conflict (id) do nothing;

insert into public.recurring_invoices (id, organization_id, client_id, project_id, title, frequency, next_run_date, end_date, subtotal, tax_amount, total, currency, is_active, notes)
values
  ('18181818-1818-1818-1818-181818181801', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'Northstar monthly support retainer', 'monthly', '2026-09-01', '2027-09-01', 4200.00, 357.00, 4557.00, 'USD', true, 'Monthly support and maintenance')
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 006_enterprise_automation_seed.sql
-- =============================================================================
insert into public.ai_agents (id, organization_id, name, description, model, system_prompt, status, temperature, max_tokens, config)
values
  ('19191919-1919-1919-1919-191919191901', '11111111-1111-1111-1111-111111111111', 'Ops Copilot', 'Operations assistant for task triage and routing', 'gpt-4o', 'You are an enterprise operations copilot. Triage tasks, summarize status, and recommend next actions.', 'active', 0.50, 4096, '{"tools":["tasks","projects"]}'::jsonb),
  ('19191919-1919-1919-1919-191919191902', '11111111-1111-1111-1111-111111111111', 'Finance Analyst', 'Finance workflow assistant for invoice and payment alerts', 'gpt-4o-mini', 'You analyze finance events and draft concise alerts for finance operators.', 'active', 0.30, 2048, '{"tools":["finance","clients"]}'::jsonb)
on conflict (id) do nothing;

insert into public.workflow_templates (id, organization_id, name, description, category, definition, is_public)
values
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a01', '11111111-1111-1111-1111-111111111111', 'Client Onboarding', 'Automate client onboarding notifications and task creation', 'onboarding', '{"triggers":["client.created"],"actions":["notify","create_task"]}'::jsonb, true),
  ('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a02', '11111111-1111-1111-1111-111111111111', 'Invoice Reminder', 'Send reminders for overdue invoices', 'finance', '{"triggers":["invoice.overdue"],"actions":["email","notify"]}'::jsonb, true)
on conflict (id) do nothing;

insert into public.workflows (id, organization_id, template_id, agent_id, name, description, status, version)
values
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '11111111-1111-1111-1111-111111111111', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a01', '19191919-1919-1919-1919-191919191901', 'Northstar Client Onboarding', 'Onboard new Northstar client accounts with task routing', 'active', 1),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', '11111111-1111-1111-1111-111111111111', '1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a02', '19191919-1919-1919-1919-191919191902', 'Overdue Invoice Escalation', 'Escalate overdue invoices to finance team', 'active', 1),
  ('2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', '11111111-1111-1111-1111-111111111111', null, '19191919-1919-1919-1919-191919191901', 'Weekly Ops Digest', 'Weekly summary of open tasks and project risks', 'paused', 1)
on conflict (id) do nothing;

insert into public.workflow_triggers (id, workflow_id, trigger_type, event_name, config, is_active)
values
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'event', 'client.created', '{"source":"crm"}'::jsonb, true),
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 'event', 'invoice.overdue', '{"days_overdue":7}'::jsonb, true),
  ('3c3c3c3c-3c3c-3c3c-3c3c-3c3c3c3c3c03', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', 'schedule', 'cron.weekly', '{"day":"monday","hour":9}'::jsonb, false)
on conflict (id) do nothing;

insert into public.workflow_actions (id, workflow_id, step_order, action_type, config, agent_id)
values
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 1, 'notify', '{"channel":"slack","template":"client_onboarding"}'::jsonb, '19191919-1919-1919-1919-191919191901'),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 2, 'create_task', '{"project":"onboarding","priority":"high"}'::jsonb, null),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d03', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 1, 'email', '{"to":"finance@acme.com","template":"invoice_overdue"}'::jsonb, '19191919-1919-1919-1919-191919191902'),
  ('4d4d4d4d-4d4d-4d4d-4d4d-4d4d4d4d4d04', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 2, 'ai_task', '{"prompt":"Summarize overdue invoice context"}'::jsonb, '19191919-1919-1919-1919-191919191902')
on conflict (id) do nothing;

insert into public.workflow_conditions (id, workflow_id, step_order, field, operator, value, logic_group)
values
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 1, 'client.status', 'equals', 'active', 'default'),
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e02', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 1, 'invoice.balance_due', 'greater_than', '0', 'default')
on conflict (id) do nothing;

insert into public.workflow_schedules (id, workflow_id, cron_expression, timezone, next_run_at, last_run_at, is_active)
values
  ('6f6f6f6f-6f6f-6f6f-6f6f-6f6f6f6f6f01', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', '0 9 * * 1', 'America/New_York', '2026-08-04 09:00:00+00', '2026-07-28 09:00:00+00', false)
on conflict (id) do nothing;

insert into public.workflow_executions (id, organization_id, workflow_id, status, trigger_type, started_at, completed_at, duration_ms, result, error_message)
values
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'completed', 'event', '2026-08-01 10:15:00+00', '2026-08-01 10:15:04+00', 4200, '{"tasks_created":1,"notifications_sent":1}'::jsonb, ''),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', 'failed', 'event', '2026-08-02 08:30:00+00', '2026-08-02 08:30:02+00', 2100, '{}'::jsonb, 'Email gateway timeout'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', 'running', 'manual', '2026-08-02 14:00:00+00', null, 0, '{}'::jsonb, '')
on conflict (id) do nothing;

insert into public.automation_logs (id, organization_id, workflow_id, execution_id, level, message, metadata)
values
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b01', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'info', 'Workflow execution started', '{"trigger":"client.created"}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b02', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'info', 'Notification dispatched to Slack', '{"channel":"#ops"}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b03', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b02', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', 'error', 'Email gateway timeout after 2s', '{"retry":true}'::jsonb),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b04', '11111111-1111-1111-1111-111111111111', '2b2b2b2b-2b2b-2b2b-2b2b-2b2b2b2b2b03', null, 'warn', 'Weekly digest schedule paused by operator', '{}'::jsonb)
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 007_enterprise_analytics_seed.sql
-- =============================================================================
insert into public.analytics_dashboards (id, organization_id, name, description, is_default, layout)
values
  ('1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', '11111111-1111-1111-1111-111111111111', 'Executive Overview', 'Cross-module KPIs for leadership reviews', true, '{"columns":2,"theme":"executive"}'::jsonb),
  ('1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', '11111111-1111-1111-1111-111111111111', 'Operations Pulse', 'Delivery, tasks, and automation health', false, '{"columns":3,"theme":"operations"}'::jsonb)
on conflict (id) do nothing;

insert into public.analytics_widgets (id, dashboard_id, title, widget_type, metric_key, chart_type, config, sort_order)
values
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d01', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Total Revenue', 'kpi', 'revenue.total', 'line', '{"format":"currency"}'::jsonb, 1),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d02', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Active Clients', 'kpi', 'clients.active', 'bar', '{"format":"number"}'::jsonb, 2),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d03', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c01', 'Project Progress', 'chart', 'projects.progress', 'line', '{"series":"avg_progress"}'::jsonb, 3),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d04', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', 'Open Tasks', 'kpi', 'tasks.open', 'bar', '{"format":"number"}'::jsonb, 1),
  ('2d2d2d2d-2d2d-2d2d-2d2d-2d2d2d2d2d05', '1c1c1c1c-1c1c-1c1c-1c1c-1c1c1c1c1c02', 'Workflow Success Rate', 'kpi', 'automation.success_rate', 'line', '{"format":"percent"}'::jsonb, 2)
on conflict (id) do nothing;

insert into public.analytics_metrics (id, organization_id, metric_key, label, category, value, unit, period_start, period_end, metadata)
values
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e01', '11111111-1111-1111-1111-111111111111', 'revenue.total', 'Total Revenue', 'finance', 27125.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"invoices"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e02', '11111111-1111-1111-1111-111111111111', 'revenue.outstanding', 'Outstanding Invoices', 'finance', 9982.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"invoices"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e03', '11111111-1111-1111-1111-111111111111', 'clients.active', 'Active Clients', 'clients', 2.00, 'count', '2026-07-01', '2026-08-31', '{"source":"clients"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e04', '11111111-1111-1111-1111-111111111111', 'clients.leads', 'Qualified Leads', 'clients', 2.00, 'count', '2026-07-01', '2026-08-31', '{"source":"clients"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e05', '11111111-1111-1111-1111-111111111111', 'projects.active', 'Active Projects', 'delivery', 1.00, 'count', '2026-07-01', '2026-08-31', '{"source":"projects"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e06', '11111111-1111-1111-1111-111111111111', 'projects.progress', 'Average Project Progress', 'delivery', 55.00, 'percent', '2026-07-01', '2026-08-31', '{"source":"projects"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e07', '11111111-1111-1111-1111-111111111111', 'tasks.open', 'Open Tasks', 'delivery', 5.00, 'count', '2026-07-01', '2026-08-31', '{"source":"tasks"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e08', '11111111-1111-1111-1111-111111111111', 'tasks.completed', 'Completed Tasks', 'delivery', 1.00, 'count', '2026-07-01', '2026-08-31', '{"source":"tasks"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e09', '11111111-1111-1111-1111-111111111111', 'automation.success_rate', 'Workflow Success Rate', 'automation', 50.00, 'percent', '2026-07-01', '2026-08-31', '{"source":"workflow_executions"}'::jsonb),
  ('3e3e3e3e-3e3e-3e3e-3e3e-3e3e3e3e3e10', '11111111-1111-1111-1111-111111111111', 'expenses.total', 'Total Expenses', 'finance', 2460.00, 'USD', '2026-07-01', '2026-08-31', '{"source":"expenses"}'::jsonb)
on conflict (id) do nothing;

insert into public.analytics_reports (id, organization_id, name, report_type, status, filters, summary, generated_at)
values
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f01', '11111111-1111-1111-1111-111111111111', 'Q3 Executive Summary', 'summary', 'published', '{"period":"2026-Q3","modules":["finance","clients","delivery"]}'::jsonb, '{"revenue":27125,"clients":4,"projects":2,"tasks":8}'::jsonb, '2026-08-01 09:00:00+00'),
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f02', '11111111-1111-1111-1111-111111111111', 'Automation Performance Review', 'automation', 'published', '{"period":"2026-08","workflows":3}'::jsonb, '{"success_rate":50,"executions":3,"errors":1}'::jsonb, '2026-08-02 14:30:00+00'),
  ('4f4f4f4f-4f4f-4f4f-4f4f-4f4f4f4f4f03', '11111111-1111-1111-1111-111111111111', 'Client Portfolio Health', 'clients', 'draft', '{"lifecycle":["client","lead"]}'::jsonb, '{"active":2,"at_risk":1,"leads":2}'::jsonb, null)
on conflict (id) do nothing;

-- =============================================================================
-- END apply_all.sql
-- =============================================================================
commit;

-- =============================================================================
-- Arjun Automation OS Enterprise — Production apply_all.sql
-- =============================================================================
-- Generated: 2026-08-02T23:23:47.584Z
-- Apply manually in Supabase SQL Editor (do not auto-execute from CI).
--
-- Contents:
--   Migrations (14):
--     - 202608020001_enterprise_foundation.sql
--     - 202608020002_crm_foundation.sql
--     - 202608020003_project_management.sql
--     - 202608020004_enterprise_data_platform.sql
--     - 202608020005_enterprise_finance.sql
--     - 202608020006_enterprise_automation.sql
--     - 202608020007_enterprise_analytics.sql
--     - 202608020008_enterprise_settings.sql
--     - 202608020009_enterprise_hrms.sql
--     - 202608020010_enterprise_inventory.sql
--     - 202608020011_enterprise_support.sql
--     - 202608020012_enterprise_sales.sql
--     - 202608020013_enterprise_documents.sql
--     - 202608020014_enterprise_ai_orchestration.sql
--   Seeds (14):
--     - 001_enterprise_seed.sql
--     - 002_crm_seed.sql
--     - 003_project_seed.sql
--     - 004_enterprise_data_platform_seed.sql
--     - 005_enterprise_finance_seed.sql
--     - 006_enterprise_automation_seed.sql
--     - 007_enterprise_analytics_seed.sql
--     - 008_enterprise_settings_seed.sql
--     - 009_enterprise_hrms_seed.sql
--     - 010_enterprise_inventory_seed.sql
--     - 011_enterprise_support_seed.sql
--     - 012_enterprise_sales_seed.sql
--     - 013_enterprise_documents_seed.sql
--     - 014_enterprise_ai_orchestration_seed.sql
--
-- Includes through Sprint 21:
--   Foundation, CRM, Projects, Data Platform, Finance, AI Automation & Workflows, Analytics, Settings & Administration, HRMS & Employee Management, Inventory & Asset Management, Customer Support & Service Management, Sales Pipeline & Revenue Operations, Document & Content Management, AI Orchestration Layer
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
-- MIGRATION: 202608020008_enterprise_settings.sql
-- =============================================================================
-- Sprint 15: Enterprise Settings & Administration

create table if not exists public.organization_settings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  timezone text not null default 'UTC',
  currency text not null default 'USD',
  fiscal_year_start text not null default '01-01',
  contact_email text not null default '',
  billing_address text not null default '',
  support_phone text not null default '',
  feature_flags jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_branding (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  logo_url text not null default '',
  favicon_url text not null default '',
  primary_color text not null default '#10b981',
  secondary_color text not null default '#0f172a',
  accent_color text not null default '#3b82f6',
  custom_domain text not null default '',
  email_header_html text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_preferences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  default_locale text not null default 'en',
  default_timezone text not null default 'UTC',
  week_starts_on text not null default 'monday',
  date_format text not null default 'YYYY-MM-DD',
  time_format text not null default '24h',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_security_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  mfa_required boolean not null default false,
  session_timeout_minutes integer not null default 480,
  password_min_length integer not null default 12,
  ip_allowlist jsonb not null default '[]'::jsonb,
  login_attempt_limit integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role_name text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.organization_invitations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role_name text not null default 'member',
  status text not null default 'pending',
  invited_by uuid references public.user_profiles(id) on delete set null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.user_profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete set null,
  theme text not null default 'system',
  locale text not null default 'en',
  timezone text not null default 'UTC',
  date_format text not null default 'YYYY-MM-DD',
  digest_frequency text not null default 'daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_config (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  retention_days integer not null default 365,
  enabled_events text[] not null default array['create', 'update', 'delete', 'login'],
  export_format text not null default 'json',
  alert_threshold integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  expires_at timestamptz,
  last_used_at timestamptz,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.user_profiles(id) on delete cascade,
  channel text not null default 'email',
  event_type text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, channel, event_type)
);

create table if not exists public.backup_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  schedule_cron text not null default '0 2 * * 0',
  destination text not null default 'supabase',
  retention_count integer not null default 7,
  include_tables jsonb not null default '[]'::jsonb,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.backup_runs (
  id uuid primary key default uuid_generate_v4(),
  config_id uuid not null references public.backup_configs(id) on delete cascade,
  status text not null default 'pending',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  size_bytes bigint not null default 0,
  storage_path text not null default '',
  error_message text not null default '',
  created_at timestamptz not null default now()
);

drop trigger if exists trg_organization_settings_updated_at on public.organization_settings;
create trigger trg_organization_settings_updated_at before update on public.organization_settings for each row execute function public.set_updated_at();
drop trigger if exists trg_organization_branding_updated_at on public.organization_branding;
create trigger trg_organization_branding_updated_at before update on public.organization_branding for each row execute function public.set_updated_at();
drop trigger if exists trg_organization_preferences_updated_at on public.organization_preferences;
create trigger trg_organization_preferences_updated_at before update on public.organization_preferences for each row execute function public.set_updated_at();
drop trigger if exists trg_organization_security_policies_updated_at on public.organization_security_policies;
create trigger trg_organization_security_policies_updated_at before update on public.organization_security_policies for each row execute function public.set_updated_at();
drop trigger if exists trg_teams_updated_at on public.teams;
create trigger trg_teams_updated_at before update on public.teams for each row execute function public.set_updated_at();
drop trigger if exists trg_organization_invitations_updated_at on public.organization_invitations;
create trigger trg_organization_invitations_updated_at before update on public.organization_invitations for each row execute function public.set_updated_at();
drop trigger if exists trg_user_preferences_updated_at on public.user_preferences;
create trigger trg_user_preferences_updated_at before update on public.user_preferences for each row execute function public.set_updated_at();
drop trigger if exists trg_audit_config_updated_at on public.audit_config;
create trigger trg_audit_config_updated_at before update on public.audit_config for each row execute function public.set_updated_at();
drop trigger if exists trg_api_keys_updated_at on public.api_keys;
create trigger trg_api_keys_updated_at before update on public.api_keys for each row execute function public.set_updated_at();
drop trigger if exists trg_notification_preferences_updated_at on public.notification_preferences;
create trigger trg_notification_preferences_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();
drop trigger if exists trg_backup_configs_updated_at on public.backup_configs;
create trigger trg_backup_configs_updated_at before update on public.backup_configs for each row execute function public.set_updated_at();

create index if not exists idx_organization_settings_org on public.organization_settings(organization_id);
create index if not exists idx_teams_org on public.teams(organization_id);
create index if not exists idx_team_members_team on public.team_members(team_id);
create index if not exists idx_team_members_user on public.team_members(user_id);
create index if not exists idx_organization_invitations_org on public.organization_invitations(organization_id);
create index if not exists idx_user_preferences_user on public.user_preferences(user_id);
create index if not exists idx_audit_config_org on public.audit_config(organization_id);
create index if not exists idx_api_keys_org on public.api_keys(organization_id);
create index if not exists idx_notification_preferences_org on public.notification_preferences(organization_id);
create index if not exists idx_backup_configs_org on public.backup_configs(organization_id);
create index if not exists idx_backup_runs_config on public.backup_runs(config_id);

alter table public.organization_settings enable row level security;
alter table public.organization_branding enable row level security;
alter table public.organization_preferences enable row level security;
alter table public.organization_security_policies enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.user_preferences enable row level security;
alter table public.audit_config enable row level security;
alter table public.api_keys enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.backup_configs enable row level security;
alter table public.backup_runs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'organization_settings', 'organization_branding', 'organization_preferences',
    'organization_security_policies', 'teams', 'organization_invitations',
    'audit_config', 'api_keys', 'notification_preferences', 'backup_configs'
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

drop policy if exists team_members_select on public.team_members;
create policy team_members_select on public.team_members for select using (
  exists (select 1 from public.teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists team_members_insert on public.team_members;
create policy team_members_insert on public.team_members for insert with check (
  exists (select 1 from public.teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists team_members_update on public.team_members;
create policy team_members_update on public.team_members for update using (
  exists (select 1 from public.teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists team_members_delete on public.team_members;
create policy team_members_delete on public.team_members for delete using (
  exists (select 1 from public.teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);

drop policy if exists user_preferences_select on public.user_preferences;
create policy user_preferences_select on public.user_preferences for select using (
  user_id = public.auth_profile_id() or (organization_id is not null and public.is_organization_member(organization_id))
);
drop policy if exists user_preferences_insert on public.user_preferences;
create policy user_preferences_insert on public.user_preferences for insert with check (user_id = public.auth_profile_id());
drop policy if exists user_preferences_update on public.user_preferences;
create policy user_preferences_update on public.user_preferences for update using (user_id = public.auth_profile_id());

drop policy if exists backup_runs_select on public.backup_runs;
create policy backup_runs_select on public.backup_runs for select using (
  exists (select 1 from public.backup_configs c where c.id = config_id and public.is_organization_member(c.organization_id))
);
drop policy if exists backup_runs_insert on public.backup_runs;
create policy backup_runs_insert on public.backup_runs for insert with check (
  exists (select 1 from public.backup_configs c where c.id = config_id and public.is_organization_member(c.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('settings.view', 'View organization settings', 'settings'),
  ('settings.manage', 'Manage organization settings and administration', 'settings'),
  ('security.manage', 'Manage security policies', 'settings'),
  ('api_keys.manage', 'Manage API keys and integrations', 'settings'),
  ('backup.manage', 'Manage backup and maintenance settings', 'settings')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020009_enterprise_hrms.sql
-- =============================================================================
-- Sprint 16: Enterprise HRMS & Employee Management

create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  parent_department_id uuid references public.departments(id) on delete set null,
  head_employee_id uuid,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.designations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  level text not null default 'individual_contributor',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, title)
);

create table if not exists public.employees (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_code text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  manager_id uuid references public.employees(id) on delete set null,
  profile_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active',
  employment_type text not null default 'full_time',
  hire_date date not null default current_date,
  base_salary numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_code),
  unique (organization_id, email)
);

alter table public.departments
  drop constraint if exists departments_head_employee_id_fkey,
  add constraint departments_head_employee_id_fkey foreign key (head_employee_id) references public.employees(id) on delete set null;

create table if not exists public.hr_teams (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  department_id uuid references public.departments(id) on delete set null,
  lead_employee_id uuid references public.employees(id) on delete set null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.hr_team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.hr_teams(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  role_name text not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, employee_id)
);

create table if not exists public.attendance_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (employee_id, work_date)
);

create table if not exists public.leave_types (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  annual_quota numeric(5,1) not null default 0,
  paid boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.leave_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  leave_type_id uuid not null references public.leave_types(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending',
  reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.holidays (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  holiday_date date not null,
  region text not null default 'global',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, holiday_date, region)
);

create table if not exists public.payroll_cycles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  period_start date not null,
  period_end date not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll_entries (
  id uuid primary key default uuid_generate_v4(),
  cycle_id uuid not null references public.payroll_cycles(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  base_salary numeric(12,2) not null default 0,
  allowances numeric(12,2) not null default 0,
  deductions numeric(12,2) not null default 0,
  net_pay numeric(12,2) not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cycle_id, employee_id)
);

create table if not exists public.employee_documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  title text not null,
  document_type text not null default 'general',
  file_url text not null default '',
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.performance_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  reviewer_id uuid references public.employees(id) on delete set null,
  review_period text not null,
  rating numeric(3,1) not null default 0,
  summary text not null default '',
  status text not null default 'scheduled',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_openings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  department_id uuid references public.departments(id) on delete set null,
  designation_id uuid references public.designations(id) on delete set null,
  status text not null default 'open',
  description text not null default '',
  opened_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_candidates (
  id uuid primary key default uuid_generate_v4(),
  opening_id uuid not null references public.job_openings(id) on delete cascade,
  full_name text not null,
  email text not null,
  stage text not null default 'applied',
  applied_at timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  status text not null default 'in_progress',
  start_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_tasks (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.onboarding_plans(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offboarding_plans (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  status text not null default 'in_progress',
  last_working_date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offboarding_tasks (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.offboarding_plans(id) on delete cascade,
  title text not null,
  status text not null default 'pending',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.org_chart_nodes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  parent_node_id uuid references public.org_chart_nodes(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, employee_id)
);

create index if not exists idx_departments_org on public.departments(organization_id);
create index if not exists idx_designations_org on public.designations(organization_id);
create index if not exists idx_employees_org on public.employees(organization_id);
create index if not exists idx_employees_department on public.employees(department_id);
create index if not exists idx_hr_teams_org on public.hr_teams(organization_id);
create index if not exists idx_attendance_org on public.attendance_records(organization_id);
create index if not exists idx_attendance_employee on public.attendance_records(employee_id);
create index if not exists idx_leave_types_org on public.leave_types(organization_id);
create index if not exists idx_leave_requests_org on public.leave_requests(organization_id);
create index if not exists idx_holidays_org on public.holidays(organization_id);
create index if not exists idx_payroll_cycles_org on public.payroll_cycles(organization_id);
create index if not exists idx_employee_documents_org on public.employee_documents(organization_id);
create index if not exists idx_performance_reviews_org on public.performance_reviews(organization_id);
create index if not exists idx_job_openings_org on public.job_openings(organization_id);
create index if not exists idx_onboarding_plans_org on public.onboarding_plans(organization_id);
create index if not exists idx_offboarding_plans_org on public.offboarding_plans(organization_id);
create index if not exists idx_org_chart_nodes_org on public.org_chart_nodes(organization_id);

drop trigger if exists trg_departments_updated_at on public.departments;
create trigger trg_departments_updated_at before update on public.departments for each row execute function public.set_updated_at();
drop trigger if exists trg_designations_updated_at on public.designations;
create trigger trg_designations_updated_at before update on public.designations for each row execute function public.set_updated_at();
drop trigger if exists trg_employees_updated_at on public.employees;
create trigger trg_employees_updated_at before update on public.employees for each row execute function public.set_updated_at();
drop trigger if exists trg_hr_teams_updated_at on public.hr_teams;
create trigger trg_hr_teams_updated_at before update on public.hr_teams for each row execute function public.set_updated_at();
drop trigger if exists trg_attendance_records_updated_at on public.attendance_records;
create trigger trg_attendance_records_updated_at before update on public.attendance_records for each row execute function public.set_updated_at();
drop trigger if exists trg_leave_types_updated_at on public.leave_types;
create trigger trg_leave_types_updated_at before update on public.leave_types for each row execute function public.set_updated_at();
drop trigger if exists trg_leave_requests_updated_at on public.leave_requests;
create trigger trg_leave_requests_updated_at before update on public.leave_requests for each row execute function public.set_updated_at();
drop trigger if exists trg_holidays_updated_at on public.holidays;
create trigger trg_holidays_updated_at before update on public.holidays for each row execute function public.set_updated_at();
drop trigger if exists trg_payroll_cycles_updated_at on public.payroll_cycles;
create trigger trg_payroll_cycles_updated_at before update on public.payroll_cycles for each row execute function public.set_updated_at();
drop trigger if exists trg_payroll_entries_updated_at on public.payroll_entries;
create trigger trg_payroll_entries_updated_at before update on public.payroll_entries for each row execute function public.set_updated_at();
drop trigger if exists trg_employee_documents_updated_at on public.employee_documents;
create trigger trg_employee_documents_updated_at before update on public.employee_documents for each row execute function public.set_updated_at();
drop trigger if exists trg_performance_reviews_updated_at on public.performance_reviews;
create trigger trg_performance_reviews_updated_at before update on public.performance_reviews for each row execute function public.set_updated_at();
drop trigger if exists trg_job_openings_updated_at on public.job_openings;
create trigger trg_job_openings_updated_at before update on public.job_openings for each row execute function public.set_updated_at();
drop trigger if exists trg_job_candidates_updated_at on public.job_candidates;
create trigger trg_job_candidates_updated_at before update on public.job_candidates for each row execute function public.set_updated_at();
drop trigger if exists trg_onboarding_plans_updated_at on public.onboarding_plans;
create trigger trg_onboarding_plans_updated_at before update on public.onboarding_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_onboarding_tasks_updated_at on public.onboarding_tasks;
create trigger trg_onboarding_tasks_updated_at before update on public.onboarding_tasks for each row execute function public.set_updated_at();
drop trigger if exists trg_offboarding_plans_updated_at on public.offboarding_plans;
create trigger trg_offboarding_plans_updated_at before update on public.offboarding_plans for each row execute function public.set_updated_at();
drop trigger if exists trg_offboarding_tasks_updated_at on public.offboarding_tasks;
create trigger trg_offboarding_tasks_updated_at before update on public.offboarding_tasks for each row execute function public.set_updated_at();
drop trigger if exists trg_org_chart_nodes_updated_at on public.org_chart_nodes;
create trigger trg_org_chart_nodes_updated_at before update on public.org_chart_nodes for each row execute function public.set_updated_at();

alter table public.departments enable row level security;
alter table public.designations enable row level security;
alter table public.employees enable row level security;
alter table public.hr_teams enable row level security;
alter table public.hr_team_members enable row level security;
alter table public.attendance_records enable row level security;
alter table public.leave_types enable row level security;
alter table public.leave_requests enable row level security;
alter table public.holidays enable row level security;
alter table public.payroll_cycles enable row level security;
alter table public.payroll_entries enable row level security;
alter table public.employee_documents enable row level security;
alter table public.performance_reviews enable row level security;
alter table public.job_openings enable row level security;
alter table public.job_candidates enable row level security;
alter table public.onboarding_plans enable row level security;
alter table public.onboarding_tasks enable row level security;
alter table public.offboarding_plans enable row level security;
alter table public.offboarding_tasks enable row level security;
alter table public.org_chart_nodes enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'departments', 'designations', 'employees', 'hr_teams',
    'attendance_records', 'leave_types', 'leave_requests', 'holidays',
    'payroll_cycles', 'employee_documents', 'performance_reviews',
    'job_openings', 'onboarding_plans', 'offboarding_plans', 'org_chart_nodes'
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

drop policy if exists hr_team_members_select on public.hr_team_members;
create policy hr_team_members_select on public.hr_team_members for select using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_insert on public.hr_team_members;
create policy hr_team_members_insert on public.hr_team_members for insert with check (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_update on public.hr_team_members;
create policy hr_team_members_update on public.hr_team_members for update using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);
drop policy if exists hr_team_members_delete on public.hr_team_members;
create policy hr_team_members_delete on public.hr_team_members for delete using (
  exists (select 1 from public.hr_teams t where t.id = team_id and public.is_organization_member(t.organization_id))
);

drop policy if exists payroll_entries_select on public.payroll_entries;
create policy payroll_entries_select on public.payroll_entries for select using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_insert on public.payroll_entries;
create policy payroll_entries_insert on public.payroll_entries for insert with check (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_update on public.payroll_entries;
create policy payroll_entries_update on public.payroll_entries for update using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);
drop policy if exists payroll_entries_delete on public.payroll_entries;
create policy payroll_entries_delete on public.payroll_entries for delete using (
  exists (select 1 from public.payroll_cycles c where c.id = cycle_id and public.is_organization_member(c.organization_id))
);

drop policy if exists job_candidates_select on public.job_candidates;
create policy job_candidates_select on public.job_candidates for select using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_insert on public.job_candidates;
create policy job_candidates_insert on public.job_candidates for insert with check (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_update on public.job_candidates;
create policy job_candidates_update on public.job_candidates for update using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);
drop policy if exists job_candidates_delete on public.job_candidates;
create policy job_candidates_delete on public.job_candidates for delete using (
  exists (select 1 from public.job_openings o where o.id = opening_id and public.is_organization_member(o.organization_id))
);

drop policy if exists onboarding_tasks_select on public.onboarding_tasks;
create policy onboarding_tasks_select on public.onboarding_tasks for select using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_insert on public.onboarding_tasks;
create policy onboarding_tasks_insert on public.onboarding_tasks for insert with check (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_update on public.onboarding_tasks;
create policy onboarding_tasks_update on public.onboarding_tasks for update using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists onboarding_tasks_delete on public.onboarding_tasks;
create policy onboarding_tasks_delete on public.onboarding_tasks for delete using (
  exists (select 1 from public.onboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);

drop policy if exists offboarding_tasks_select on public.offboarding_tasks;
create policy offboarding_tasks_select on public.offboarding_tasks for select using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_insert on public.offboarding_tasks;
create policy offboarding_tasks_insert on public.offboarding_tasks for insert with check (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_update on public.offboarding_tasks;
create policy offboarding_tasks_update on public.offboarding_tasks for update using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);
drop policy if exists offboarding_tasks_delete on public.offboarding_tasks;
create policy offboarding_tasks_delete on public.offboarding_tasks for delete using (
  exists (select 1 from public.offboarding_plans p where p.id = plan_id and public.is_organization_member(p.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('hr.view', 'View HR and employee records', 'hr'),
  ('hr.manage', 'Manage employees, departments, and HR operations', 'hr'),
  ('hr.payroll.manage', 'Manage payroll cycles and compensation', 'hr'),
  ('hr.recruitment.manage', 'Manage recruitment pipeline and candidates', 'hr')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020010_enterprise_inventory.sql
-- =============================================================================
-- Sprint 17: Enterprise Inventory & Asset Management

create table if not exists public.product_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  parent_category_id uuid references public.product_categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  sku text not null,
  name text not null,
  description text not null default '',
  unit_of_measure text not null default 'each',
  unit_cost numeric(12,2) not null default 0,
  unit_price numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create table if not exists public.warehouses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  location text not null default '',
  manager_name text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.stock_levels (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  quantity numeric(12,2) not null default 0,
  reserved_quantity numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, warehouse_id)
);

create table if not exists public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.stock_movements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  movement_type text not null,
  quantity numeric(12,2) not null,
  reference_type text not null default '',
  reference_id uuid,
  project_id uuid references public.projects(id) on delete set null,
  notes text not null default '',
  moved_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_adjustments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  adjustment_type text not null default 'correction',
  quantity_delta numeric(12,2) not null,
  reason text not null default '',
  adjusted_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  po_number text not null,
  status text not null default 'draft',
  order_date date not null default current_date,
  expected_date date,
  total_amount numeric(12,2) not null default 0,
  expense_id uuid references public.expenses(id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, po_number)
);

create table if not exists public.purchase_order_items (
  id uuid primary key default uuid_generate_v4(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  line_total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  asset_tag text not null,
  name text not null,
  category text not null default 'equipment',
  serial_number text not null default '',
  purchase_cost numeric(12,2) not null default 0,
  status text not null default 'available',
  warehouse_id uuid references public.warehouses(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  acquired_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_tag)
);

create table if not exists public.product_barcodes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  asset_id uuid references public.assets(id) on delete cascade,
  barcode_value text not null,
  barcode_type text not null default 'code128',
  created_at timestamptz not null default now(),
  unique (organization_id, barcode_value)
);

create table if not exists public.low_stock_alerts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  warehouse_id uuid not null references public.warehouses(id) on delete cascade,
  current_quantity numeric(12,2) not null default 0,
  reorder_level numeric(12,2) not null default 0,
  status text not null default 'open',
  triggered_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_transfers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  transfer_number text not null,
  source_warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  destination_warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  status text not null default 'pending',
  notes text not null default '',
  transferred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, transfer_number)
);

create table if not exists public.stock_transfer_items (
  id uuid primary key default uuid_generate_v4(),
  transfer_id uuid not null references public.stock_transfers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.goods_received_notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grn_number text not null,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  warehouse_id uuid not null references public.warehouses(id) on delete restrict,
  supplier_id uuid references public.suppliers(id) on delete set null,
  status text not null default 'received',
  received_date date not null default current_date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, grn_number)
);

create table if not exists public.grn_items (
  id uuid primary key default uuid_generate_v4(),
  grn_id uuid not null references public.goods_received_notes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity_received numeric(12,2) not null,
  unit_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_valuations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  valuation_date date not null default current_date,
  method text not null default 'weighted_average',
  total_value numeric(14,2) not null default 0,
  total_units numeric(14,2) not null default 0,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_audit_logs (
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

create index if not exists idx_product_categories_org on public.product_categories(organization_id);
create index if not exists idx_products_org on public.products(organization_id);
create index if not exists idx_warehouses_org on public.warehouses(organization_id);
create index if not exists idx_stock_levels_org on public.stock_levels(organization_id);
create index if not exists idx_suppliers_org on public.suppliers(organization_id);
create index if not exists idx_stock_movements_org on public.stock_movements(organization_id);
create index if not exists idx_inventory_adjustments_org on public.inventory_adjustments(organization_id);
create index if not exists idx_purchase_orders_org on public.purchase_orders(organization_id);
create index if not exists idx_assets_org on public.assets(organization_id);
create index if not exists idx_product_barcodes_org on public.product_barcodes(organization_id);
create index if not exists idx_low_stock_alerts_org on public.low_stock_alerts(organization_id);
create index if not exists idx_stock_transfers_org on public.stock_transfers(organization_id);
create index if not exists idx_goods_received_notes_org on public.goods_received_notes(organization_id);
create index if not exists idx_inventory_valuations_org on public.inventory_valuations(organization_id);
create index if not exists idx_inventory_audit_logs_org on public.inventory_audit_logs(organization_id);

drop trigger if exists trg_product_categories_updated_at on public.product_categories;
create trigger trg_product_categories_updated_at before update on public.product_categories for each row execute function public.set_updated_at();
drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products for each row execute function public.set_updated_at();
drop trigger if exists trg_warehouses_updated_at on public.warehouses;
create trigger trg_warehouses_updated_at before update on public.warehouses for each row execute function public.set_updated_at();
drop trigger if exists trg_stock_levels_updated_at on public.stock_levels;
create trigger trg_stock_levels_updated_at before update on public.stock_levels for each row execute function public.set_updated_at();
drop trigger if exists trg_suppliers_updated_at on public.suppliers;
create trigger trg_suppliers_updated_at before update on public.suppliers for each row execute function public.set_updated_at();
drop trigger if exists trg_purchase_orders_updated_at on public.purchase_orders;
create trigger trg_purchase_orders_updated_at before update on public.purchase_orders for each row execute function public.set_updated_at();
drop trigger if exists trg_assets_updated_at on public.assets;
create trigger trg_assets_updated_at before update on public.assets for each row execute function public.set_updated_at();
drop trigger if exists trg_stock_transfers_updated_at on public.stock_transfers;
create trigger trg_stock_transfers_updated_at before update on public.stock_transfers for each row execute function public.set_updated_at();
drop trigger if exists trg_goods_received_notes_updated_at on public.goods_received_notes;
create trigger trg_goods_received_notes_updated_at before update on public.goods_received_notes for each row execute function public.set_updated_at();

alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.warehouses enable row level security;
alter table public.stock_levels enable row level security;
alter table public.suppliers enable row level security;
alter table public.stock_movements enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.assets enable row level security;
alter table public.product_barcodes enable row level security;
alter table public.low_stock_alerts enable row level security;
alter table public.stock_transfers enable row level security;
alter table public.stock_transfer_items enable row level security;
alter table public.goods_received_notes enable row level security;
alter table public.grn_items enable row level security;
alter table public.inventory_valuations enable row level security;
alter table public.inventory_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'product_categories', 'products', 'warehouses', 'stock_levels', 'suppliers',
    'stock_movements', 'inventory_adjustments', 'purchase_orders', 'assets',
    'product_barcodes', 'low_stock_alerts', 'stock_transfers',
    'goods_received_notes', 'inventory_valuations', 'inventory_audit_logs'
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

drop policy if exists purchase_order_items_select on public.purchase_order_items;
create policy purchase_order_items_select on public.purchase_order_items for select using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_insert on public.purchase_order_items;
create policy purchase_order_items_insert on public.purchase_order_items for insert with check (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_update on public.purchase_order_items;
create policy purchase_order_items_update on public.purchase_order_items for update using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);
drop policy if exists purchase_order_items_delete on public.purchase_order_items;
create policy purchase_order_items_delete on public.purchase_order_items for delete using (
  exists (select 1 from public.purchase_orders p where p.id = purchase_order_id and public.is_organization_member(p.organization_id))
);

drop policy if exists stock_transfer_items_select on public.stock_transfer_items;
create policy stock_transfer_items_select on public.stock_transfer_items for select using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_insert on public.stock_transfer_items;
create policy stock_transfer_items_insert on public.stock_transfer_items for insert with check (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_update on public.stock_transfer_items;
create policy stock_transfer_items_update on public.stock_transfer_items for update using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);
drop policy if exists stock_transfer_items_delete on public.stock_transfer_items;
create policy stock_transfer_items_delete on public.stock_transfer_items for delete using (
  exists (select 1 from public.stock_transfers t where t.id = transfer_id and public.is_organization_member(t.organization_id))
);

drop policy if exists grn_items_select on public.grn_items;
create policy grn_items_select on public.grn_items for select using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_insert on public.grn_items;
create policy grn_items_insert on public.grn_items for insert with check (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_update on public.grn_items;
create policy grn_items_update on public.grn_items for update using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);
drop policy if exists grn_items_delete on public.grn_items;
create policy grn_items_delete on public.grn_items for delete using (
  exists (select 1 from public.goods_received_notes g where g.id = grn_id and public.is_organization_member(g.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('inventory.view', 'View inventory and assets', 'inventory'),
  ('inventory.manage', 'Manage inventory, stock, and warehouses', 'inventory'),
  ('inventory.procurement.manage', 'Manage purchase orders and suppliers', 'inventory'),
  ('inventory.assets.manage', 'Manage fixed assets and assignments', 'inventory')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020011_enterprise_support.sql
-- =============================================================================
-- Sprint 18: Enterprise Customer Support & Service Management

create table if not exists public.support_categories (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.support_priorities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  level integer not null default 1,
  color text not null default '#64748b',
  response_hours integer not null default 24,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_slas (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  priority_id uuid references public.support_priorities(id) on delete set null,
  first_response_minutes integer not null default 60,
  resolution_minutes integer not null default 480,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_queues (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  description text not null default '',
  default_assignee_id uuid references public.employees(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_number text not null,
  subject text not null,
  description text not null default '',
  status text not null default 'open',
  category_id uuid references public.support_categories(id) on delete set null,
  priority_id uuid references public.support_priorities(id) on delete set null,
  sla_id uuid references public.support_slas(id) on delete set null,
  queue_id uuid references public.support_queues(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  assigned_agent_id uuid references public.employees(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  portal_visible boolean not null default true,
  due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, ticket_number)
);

create table if not exists public.support_ticket_notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  author_id uuid references public.user_profiles(id) on delete set null,
  body text not null,
  is_internal boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.support_ticket_attachments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  file_name text not null,
  file_url text not null default '',
  file_size integer not null default 0,
  mime_type text not null default 'application/octet-stream',
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.support_knowledge_articles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  slug text not null,
  content text not null default '',
  category_id uuid references public.support_categories(id) on delete set null,
  status text not null default 'draft',
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.support_canned_responses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  shortcut text not null,
  body text not null default '',
  category_id uuid references public.support_categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, shortcut)
);

create table if not exists public.support_escalation_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  trigger_condition text not null default 'sla_breach',
  escalation_level integer not null default 1,
  target_queue_id uuid references public.support_queues(id) on delete set null,
  notify_agent_id uuid references public.employees(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.support_satisfaction_ratings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.support_portal_settings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  portal_enabled boolean not null default true,
  welcome_message text not null default 'Welcome to our support portal.',
  allow_ticket_creation boolean not null default true,
  show_knowledge_base boolean not null default true,
  custom_domain text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create table if not exists public.support_audit_logs (
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

create index if not exists idx_support_categories_org on public.support_categories(organization_id);
create index if not exists idx_support_priorities_org on public.support_priorities(organization_id);
create index if not exists idx_support_slas_org on public.support_slas(organization_id);
create index if not exists idx_support_queues_org on public.support_queues(organization_id);
create index if not exists idx_support_tickets_org on public.support_tickets(organization_id);
create index if not exists idx_support_tickets_status on public.support_tickets(status);
create index if not exists idx_support_ticket_notes_org on public.support_ticket_notes(organization_id);
create index if not exists idx_support_ticket_notes_ticket on public.support_ticket_notes(ticket_id);
create index if not exists idx_support_ticket_attachments_org on public.support_ticket_attachments(organization_id);
create index if not exists idx_support_knowledge_articles_org on public.support_knowledge_articles(organization_id);
create index if not exists idx_support_canned_responses_org on public.support_canned_responses(organization_id);
create index if not exists idx_support_escalation_rules_org on public.support_escalation_rules(organization_id);
create index if not exists idx_support_satisfaction_ratings_org on public.support_satisfaction_ratings(organization_id);
create index if not exists idx_support_portal_settings_org on public.support_portal_settings(organization_id);
create index if not exists idx_support_audit_logs_org on public.support_audit_logs(organization_id);

drop trigger if exists trg_support_categories_updated_at on public.support_categories;
create trigger trg_support_categories_updated_at before update on public.support_categories for each row execute function public.set_updated_at();
drop trigger if exists trg_support_priorities_updated_at on public.support_priorities;
create trigger trg_support_priorities_updated_at before update on public.support_priorities for each row execute function public.set_updated_at();
drop trigger if exists trg_support_slas_updated_at on public.support_slas;
create trigger trg_support_slas_updated_at before update on public.support_slas for each row execute function public.set_updated_at();
drop trigger if exists trg_support_queues_updated_at on public.support_queues;
create trigger trg_support_queues_updated_at before update on public.support_queues for each row execute function public.set_updated_at();
drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at before update on public.support_tickets for each row execute function public.set_updated_at();
drop trigger if exists trg_support_knowledge_articles_updated_at on public.support_knowledge_articles;
create trigger trg_support_knowledge_articles_updated_at before update on public.support_knowledge_articles for each row execute function public.set_updated_at();
drop trigger if exists trg_support_canned_responses_updated_at on public.support_canned_responses;
create trigger trg_support_canned_responses_updated_at before update on public.support_canned_responses for each row execute function public.set_updated_at();
drop trigger if exists trg_support_escalation_rules_updated_at on public.support_escalation_rules;
create trigger trg_support_escalation_rules_updated_at before update on public.support_escalation_rules for each row execute function public.set_updated_at();
drop trigger if exists trg_support_portal_settings_updated_at on public.support_portal_settings;
create trigger trg_support_portal_settings_updated_at before update on public.support_portal_settings for each row execute function public.set_updated_at();

alter table public.support_categories enable row level security;
alter table public.support_priorities enable row level security;
alter table public.support_slas enable row level security;
alter table public.support_queues enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_notes enable row level security;
alter table public.support_ticket_attachments enable row level security;
alter table public.support_knowledge_articles enable row level security;
alter table public.support_canned_responses enable row level security;
alter table public.support_escalation_rules enable row level security;
alter table public.support_satisfaction_ratings enable row level security;
alter table public.support_portal_settings enable row level security;
alter table public.support_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'support_categories', 'support_priorities', 'support_slas', 'support_queues',
    'support_tickets', 'support_ticket_notes', 'support_ticket_attachments',
    'support_knowledge_articles', 'support_canned_responses', 'support_escalation_rules',
    'support_satisfaction_ratings', 'support_portal_settings', 'support_audit_logs'
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
  ('support.view', 'View support tickets and service data', 'support'),
  ('support.manage', 'Manage tickets, queues, and SLAs', 'support'),
  ('support.agents.manage', 'Manage agent assignment and escalation', 'support'),
  ('support.knowledge.manage', 'Manage knowledge base and canned responses', 'support')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020012_enterprise_sales.sql
-- =============================================================================
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

-- =============================================================================
-- MIGRATION: 202608020013_enterprise_documents.sql
-- =============================================================================
-- Sprint 20: Enterprise Document & Content Management

create table if not exists public.document_folders (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_folder_id uuid references public.document_folders(id) on delete set null,
  name text not null,
  slug text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete set null,
  title text not null,
  file_name text not null,
  file_url text not null default '',
  mime_type text not null default 'application/octet-stream',
  file_size integer not null default 0,
  status text not null default 'active',
  current_version integer not null default 1,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  employee_id uuid references public.employees(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  support_ticket_id uuid references public.support_tickets(id) on delete set null,
  sales_opportunity_id uuid references public.sales_opportunities(id) on delete set null,
  uploaded_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_tags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text not null default '#64748b',
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_tag_links (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  tag_id uuid not null references public.document_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (document_id, tag_id)
);

create table if not exists public.document_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null,
  file_url text not null default '',
  file_size integer not null default 0,
  change_summary text not null default '',
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create table if not exists public.document_approvals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  approver_id uuid references public.employees(id) on delete set null,
  status text not null default 'pending',
  comments text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_esign_preparations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  signer_name text not null,
  signer_email text not null,
  status text not null default 'draft',
  prepared_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_shares (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  share_token text not null,
  recipient_email text not null default '',
  permission_level text not null default 'view',
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, share_token)
);

create table if not exists public.document_access_grants (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  folder_id uuid references public.document_folders(id) on delete cascade,
  grantee_type text not null default 'employee',
  grantee_id uuid,
  permission_level text not null default 'view',
  created_at timestamptz not null default now()
);

create table if not exists public.document_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text not null default 'general',
  description text not null default '',
  template_content text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_previews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  preview_type text not null default 'thumbnail',
  preview_url text not null default '',
  page_count integer not null default 1,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.document_search_index (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  search_text text not null default '',
  indexed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.document_retention_policies (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  retention_days integer not null default 365,
  action_on_expiry text not null default 'archive',
  applies_to_category text not null default 'all',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table if not exists public.document_archives (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  archived_at timestamptz not null default now(),
  archived_by uuid references public.user_profiles(id) on delete set null,
  restore_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.document_activity_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  activity_type text not null,
  summary text not null default '',
  performed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.document_audit_logs (
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

create index if not exists idx_document_folders_org on public.document_folders(organization_id);
create index if not exists idx_documents_org on public.documents(organization_id);
create index if not exists idx_document_tags_org on public.document_tags(organization_id);
create index if not exists idx_document_versions_org on public.document_versions(organization_id);
create index if not exists idx_document_approvals_org on public.document_approvals(organization_id);
create index if not exists idx_document_esign_preparations_org on public.document_esign_preparations(organization_id);
create index if not exists idx_document_shares_org on public.document_shares(organization_id);
create index if not exists idx_document_access_grants_org on public.document_access_grants(organization_id);
create index if not exists idx_document_templates_org on public.document_templates(organization_id);
create index if not exists idx_document_previews_org on public.document_previews(organization_id);
create index if not exists idx_document_search_index_org on public.document_search_index(organization_id);
create index if not exists idx_document_retention_policies_org on public.document_retention_policies(organization_id);
create index if not exists idx_document_archives_org on public.document_archives(organization_id);
create index if not exists idx_document_activity_logs_org on public.document_activity_logs(organization_id);
create index if not exists idx_document_audit_logs_org on public.document_audit_logs(organization_id);

drop trigger if exists trg_document_folders_updated_at on public.document_folders;
create trigger trg_document_folders_updated_at before update on public.document_folders for each row execute function public.set_updated_at();
drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
drop trigger if exists trg_document_approvals_updated_at on public.document_approvals;
create trigger trg_document_approvals_updated_at before update on public.document_approvals for each row execute function public.set_updated_at();
drop trigger if exists trg_document_esign_preparations_updated_at on public.document_esign_preparations;
create trigger trg_document_esign_preparations_updated_at before update on public.document_esign_preparations for each row execute function public.set_updated_at();
drop trigger if exists trg_document_templates_updated_at on public.document_templates;
create trigger trg_document_templates_updated_at before update on public.document_templates for each row execute function public.set_updated_at();
drop trigger if exists trg_document_retention_policies_updated_at on public.document_retention_policies;
create trigger trg_document_retention_policies_updated_at before update on public.document_retention_policies for each row execute function public.set_updated_at();

alter table public.document_folders enable row level security;
alter table public.documents enable row level security;
alter table public.document_tags enable row level security;
alter table public.document_tag_links enable row level security;
alter table public.document_versions enable row level security;
alter table public.document_approvals enable row level security;
alter table public.document_esign_preparations enable row level security;
alter table public.document_shares enable row level security;
alter table public.document_access_grants enable row level security;
alter table public.document_templates enable row level security;
alter table public.document_previews enable row level security;
alter table public.document_search_index enable row level security;
alter table public.document_retention_policies enable row level security;
alter table public.document_archives enable row level security;
alter table public.document_activity_logs enable row level security;
alter table public.document_audit_logs enable row level security;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'document_folders', 'documents', 'document_tags', 'document_versions',
    'document_approvals', 'document_esign_preparations', 'document_shares',
    'document_access_grants', 'document_templates', 'document_previews',
    'document_search_index', 'document_retention_policies', 'document_archives',
    'document_activity_logs', 'document_audit_logs'
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

drop policy if exists document_tag_links_select on public.document_tag_links;
create policy document_tag_links_select on public.document_tag_links for select using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_insert on public.document_tag_links;
create policy document_tag_links_insert on public.document_tag_links for insert with check (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_update on public.document_tag_links;
create policy document_tag_links_update on public.document_tag_links for update using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);
drop policy if exists document_tag_links_delete on public.document_tag_links;
create policy document_tag_links_delete on public.document_tag_links for delete using (
  exists (select 1 from public.documents d where d.id = document_id and public.is_organization_member(d.organization_id))
);

insert into public.permissions (key, description, resource)
values
  ('documents.view', 'View documents and content library', 'documents'),
  ('documents.manage', 'Upload, edit, and organize documents', 'documents'),
  ('documents.approve', 'Approve documents and manage workflows', 'documents'),
  ('documents.admin', 'Manage retention, access, and policies', 'documents')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

-- =============================================================================
-- MIGRATION: 202608020014_enterprise_ai_orchestration.sql
-- =============================================================================
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
-- SEED: 008_enterprise_settings_seed.sql
-- =============================================================================
insert into public.organization_settings (id, organization_id, timezone, currency, fiscal_year_start, contact_email, billing_address, support_phone, feature_flags)
values
  ('5a5a5a5a-5a5a-5a5a-5a5a-5a5a5a5a5a01', '11111111-1111-1111-1111-111111111111', 'America/Los_Angeles', 'USD', '01-01', 'admin@acme.example', '100 Enterprise Way, San Francisco, CA', '+1 415 555 0100', '{"automation":true,"analytics":true,"finance":true}'::jsonb)
on conflict (organization_id) do nothing;

insert into public.organization_branding (id, organization_id, logo_url, favicon_url, primary_color, secondary_color, accent_color, custom_domain, email_header_html)
values
  ('5b5b5b5b-5b5b-5b5b-5b5b-5b5b5b5b5b01', '11111111-1111-1111-1111-111111111111', 'https://acme.example/logo.svg', 'https://acme.example/favicon.ico', '#10b981', '#0f172a', '#3b82f6', 'app.acme.example', '<h1>Acme Enterprise</h1>')
on conflict (organization_id) do nothing;

insert into public.organization_preferences (id, organization_id, default_locale, default_timezone, week_starts_on, date_format, time_format)
values
  ('5c5c5c5c-5c5c-5c5c-5c5c-5c5c5c5c5c01', '11111111-1111-1111-1111-111111111111', 'en', 'America/Los_Angeles', 'monday', 'YYYY-MM-DD', '24h')
on conflict (organization_id) do nothing;

insert into public.organization_security_policies (id, organization_id, mfa_required, session_timeout_minutes, password_min_length, ip_allowlist, login_attempt_limit)
values
  ('5d5d5d5d-5d5d-5d5d-5d5d-5d5d5d5d5d01', '11111111-1111-1111-1111-111111111111', true, 480, 12, '["203.0.113.0/24"]'::jsonb, 5)
on conflict (organization_id) do nothing;

insert into public.teams (id, organization_id, name, slug, description)
values
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e01', '11111111-1111-1111-1111-111111111111', 'Platform Engineering', 'platform-engineering', 'Core platform and infrastructure delivery'),
  ('5e5e5e5e-5e5e-5e5e-5e5e-5e5e5e5e5e02', '11111111-1111-1111-1111-111111111111', 'Customer Success', 'customer-success', 'Client onboarding and account management')
on conflict (id) do nothing;

insert into public.organization_invitations (id, organization_id, email, role_name, status, expires_at)
values
  ('5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f01', '11111111-1111-1111-1111-111111111111', 'ops.lead@acme.example', 'member', 'pending', '2026-09-01 00:00:00+00'),
  ('5f5f5f5f-5f5f-5f5f-5f5f-5f5f5f5f5f02', '11111111-1111-1111-1111-111111111111', 'finance.admin@acme.example', 'super_admin', 'accepted', '2026-08-15 00:00:00+00')
on conflict (id) do nothing;

insert into public.audit_config (id, organization_id, retention_days, enabled_events, export_format, alert_threshold)
values
  ('6a6a6a6a-6a6a-6a6a-6a6a-6a6a6a6a6a01', '11111111-1111-1111-1111-111111111111', 365, array['create','update','delete','login','export'], 'json', 100)
on conflict (organization_id) do nothing;

insert into public.api_keys (id, organization_id, name, key_prefix, key_hash, scopes, status, expires_at, last_used_at)
values
  ('6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b01', '11111111-1111-1111-1111-111111111111', 'Production Integration', 'aao_live_', 'sha256:demo_hash_production', '["clients.read","projects.read","finance.read"]'::jsonb, 'active', '2027-08-01 00:00:00+00', '2026-08-02 10:00:00+00'),
  ('6b6b6b6b-6b6b-6b6b-6b6b-6b6b6b6b6b02', '11111111-1111-1111-1111-111111111111', 'Automation Webhook', 'aao_hook_', 'sha256:demo_hash_webhook', '["automation.write","workflows.execute"]'::jsonb, 'active', null, '2026-08-01 18:30:00+00')
on conflict (id) do nothing;

insert into public.notification_preferences (id, organization_id, user_id, channel, event_type, enabled)
values
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c01', '11111111-1111-1111-1111-111111111111', null, 'email', 'invoice.overdue', true),
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c02', '11111111-1111-1111-1111-111111111111', null, 'in_app', 'workflow.failed', true),
  ('6c6c6c6c-6c6c-6c6c-6c6c-6c6c6c6c6c03', '11111111-1111-1111-1111-111111111111', null, 'email', 'backup.completed', false)
on conflict (id) do nothing;

insert into public.backup_configs (id, organization_id, name, schedule_cron, destination, retention_count, include_tables, is_enabled)
values
  ('6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', '11111111-1111-1111-1111-111111111111', 'Weekly Full Backup', '0 2 * * 0', 'supabase', 7, '["clients","projects","invoices","workflows"]'::jsonb, true)
on conflict (id) do nothing;

insert into public.backup_runs (id, config_id, status, started_at, completed_at, size_bytes, storage_path, error_message)
values
  ('6e6e6e6e-6e6e-6e6e-6e6e-6e6e6e6e6e01', '6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', 'completed', '2026-07-28 02:00:00+00', '2026-07-28 02:04:30+00', 52428800, 'backups/acme/2026-07-28-full.sql.gz', ''),
  ('6e6e6e6e-6e6e-6e6e-6e6e-6e6e6e6e6e02', '6d6d6d6d-6d6d-6d6d-6d6d-6d6d6d6d6d01', 'failed', '2026-08-04 02:00:00+00', '2026-08-04 02:01:10+00', 0, '', 'Destination timeout')
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 009_enterprise_hrms_seed.sql
-- =============================================================================
insert into public.departments (id, organization_id, name, code, description)
values
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '11111111-1111-1111-1111-111111111111', 'Engineering', 'ENG', 'Product engineering and platform delivery'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '11111111-1111-1111-1111-111111111111', 'Human Resources', 'HR', 'People operations and talent management'),
  ('7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '11111111-1111-1111-1111-111111111111', 'Finance', 'FIN', 'Finance and accounting operations')
on conflict (id) do nothing;

insert into public.designations (id, organization_id, title, level, description)
values
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b01', '11111111-1111-1111-1111-111111111111', 'Engineering Manager', 'manager', 'Leads engineering teams'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', '11111111-1111-1111-1111-111111111111', 'Senior Software Engineer', 'senior', 'Senior individual contributor'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', '11111111-1111-1111-1111-111111111111', 'HR Business Partner', 'manager', 'HR partner for business units'),
  ('7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b04', '11111111-1111-1111-1111-111111111111', 'Finance Analyst', 'individual_contributor', 'Financial planning and analysis')
on conflict (id) do nothing;

insert into public.employees (id, organization_id, employee_code, first_name, last_name, email, phone, department_id, designation_id, status, employment_type, hire_date, base_salary)
values
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '11111111-1111-1111-1111-111111111111', 'EMP-001', 'Alex', 'Rivera', 'alex.rivera@acme.example', '+1 415 555 0201', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b01', 'active', 'full_time', '2024-03-15', 145000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '11111111-1111-1111-1111-111111111111', 'EMP-002', 'Jordan', 'Lee', 'jordan.lee@acme.example', '+1 415 555 0202', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', 'active', 'full_time', '2024-06-01', 125000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', '11111111-1111-1111-1111-111111111111', 'EMP-003', 'Sam', 'Patel', 'sam.patel@acme.example', '+1 415 555 0203', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', 'active', 'full_time', '2023-11-10', 98000),
  ('7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '11111111-1111-1111-1111-111111111111', 'EMP-004', 'Taylor', 'Nguyen', 'taylor.nguyen@acme.example', '+1 415 555 0204', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b04', 'active', 'full_time', '2025-01-20', 92000)
on conflict (id) do nothing;

update public.departments set head_employee_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01' where id = '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01';
update public.departments set head_employee_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03' where id = '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02';
update public.employees set manager_id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01' where id = '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02';

insert into public.hr_teams (id, organization_id, name, slug, department_id, lead_employee_id, description)
values
  ('7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '11111111-1111-1111-1111-111111111111', 'Platform Squad', 'platform-squad', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Core platform engineering squad'),
  ('7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d02', '11111111-1111-1111-1111-111111111111', 'People Ops', 'people-ops', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'HR operations and employee experience')
on conflict (id) do nothing;

insert into public.hr_team_members (id, team_id, employee_id, role_name)
values
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e01', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'lead'),
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e02', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'member'),
  ('7e7e7e7e-7e7e-7e7e-7e7e-7e7e7e7e7e03', '7d7d7d7d-7d7d-7d7d-7d7d-7d7d7d7d7d02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'lead')
on conflict (id) do nothing;

insert into public.leave_types (id, organization_id, name, code, annual_quota, paid)
values
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f01', '11111111-1111-1111-1111-111111111111', 'Annual Leave', 'AL', 20, true),
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f02', '11111111-1111-1111-1111-111111111111', 'Sick Leave', 'SL', 10, true),
  ('7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f03', '11111111-1111-1111-1111-111111111111', 'Unpaid Leave', 'UL', 5, false)
on conflict (id) do nothing;

insert into public.leave_requests (id, organization_id, employee_id, leave_type_id, start_date, end_date, status, reason)
values
  ('8a8a8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f01', '2026-08-10', '2026-08-14', 'approved', 'Family vacation'),
  ('8a8a8a8a-8a8a-8a8a-8a8a-8a8a8a8a8a02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7f7f7f7f-7f7f-7f7f-7f7f-7f7f7f7f7f02', '2026-08-05', '2026-08-06', 'pending', 'Medical appointment')
on conflict (id) do nothing;

insert into public.holidays (id, organization_id, name, holiday_date, region)
values
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b01', '11111111-1111-1111-1111-111111111111', 'New Year Day', '2026-01-01', 'global'),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b02', '11111111-1111-1111-1111-111111111111', 'Independence Day', '2026-07-04', 'US'),
  ('8b8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b03', '11111111-1111-1111-1111-111111111111', 'Thanksgiving', '2026-11-26', 'US')
on conflict (id) do nothing;

insert into public.attendance_records (id, organization_id, employee_id, work_date, check_in, check_out, status, notes)
values
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '2026-08-01', '2026-08-01 09:00:00+00', '2026-08-01 18:00:00+00', 'present', ''),
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '2026-08-01', '2026-08-01 09:15:00+00', '2026-08-01 17:45:00+00', 'present', ''),
  ('8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c03', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '2026-08-02', '2026-08-02 09:00:00+00', null, 'remote', 'Working remotely')
on conflict (id) do nothing;

insert into public.payroll_cycles (id, organization_id, name, period_start, period_end, status)
values
  ('8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '11111111-1111-1111-1111-111111111111', 'July 2026 Payroll', '2026-07-01', '2026-07-31', 'processed'),
  ('8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d02', '11111111-1111-1111-1111-111111111111', 'August 2026 Payroll', '2026-08-01', '2026-08-31', 'draft')
on conflict (id) do nothing;

insert into public.payroll_entries (id, cycle_id, employee_id, base_salary, allowances, deductions, net_pay, status)
values
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e01', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 145000, 2000, 3500, 143500, 'paid'),
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e02', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 125000, 1500, 2800, 123700, 'paid'),
  ('8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e03', '8d8d8d8d-8d8d-8d8d-8d8d-8d8d8d8d8d01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 98000, 1000, 1900, 97100, 'paid')
on conflict (id) do nothing;

insert into public.employee_documents (id, organization_id, employee_id, title, document_type, file_url)
values
  ('8f8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Employment Contract', 'contract', 'https://acme.example/docs/emp-001-contract.pdf'),
  ('8f8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'ID Verification', 'identity', 'https://acme.example/docs/emp-002-id.pdf')
on conflict (id) do nothing;

insert into public.performance_reviews (id, organization_id, employee_id, reviewer_id, review_period, rating, summary, status, reviewed_at)
values
  ('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'H1 2026', 4.5, 'Strong delivery and collaboration across platform initiatives.', 'completed', '2026-07-15 00:00:00+00'),
  ('9a9a9a9a-9a9a-9a9a-9a9a-9a9a9a9a9a02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', 'H1 2026', 4.0, 'Reliable financial reporting and process improvements.', 'completed', '2026-07-18 00:00:00+00')
on conflict (id) do nothing;

insert into public.job_openings (id, organization_id, title, department_id, designation_id, status, description)
values
  ('9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', '11111111-1111-1111-1111-111111111111', 'Senior Software Engineer', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b02', 'open', 'Hiring a senior engineer for the platform squad.'),
  ('9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b02', '11111111-1111-1111-1111-111111111111', 'HR Coordinator', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', '7b7b7b7b-7b7b-7b7b-7b7b-7b7b7b7b7b03', 'open', 'Support onboarding and employee lifecycle operations.')
on conflict (id) do nothing;

insert into public.job_candidates (id, opening_id, full_name, email, stage, notes)
values
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c01', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', 'Morgan Chen', 'morgan.chen@example.com', 'interview', 'Strong backend experience'),
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c02', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b01', 'Riley Brooks', 'riley.brooks@example.com', 'screening', 'Referred by engineering team'),
  ('9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c03', '9b9b9b9b-9b9b-9b9b-9b9b-9b9b9b9b9b02', 'Casey Morgan', 'casey.morgan@example.com', 'applied', 'HR generalist background')
on conflict (id) do nothing;

insert into public.onboarding_plans (id, organization_id, employee_id, status, start_date)
values
  ('9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', 'in_progress', '2025-01-20')
on conflict (id) do nothing;

insert into public.onboarding_tasks (id, plan_id, title, status, due_date, completed_at)
values
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e01', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Complete HR orientation', 'completed', '2025-01-22', '2025-01-21 00:00:00+00'),
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e02', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Set up payroll profile', 'completed', '2025-01-25', '2025-01-24 00:00:00+00'),
  ('9e9e9e9e-9e9e-9e9e-9e9e-9e9e9e9e9e03', '9d9d9d9d-9d9d-9d9d-9d9d-9d9d9d9d9d01', 'Finance systems access', 'pending', '2025-02-01', null)
on conflict (id) do nothing;

insert into public.offboarding_plans (id, organization_id, employee_id, status, last_working_date)
values
  ('9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'planned', '2026-12-31')
on conflict (id) do nothing;

insert into public.offboarding_tasks (id, plan_id, title, status, due_date)
values
  ('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a001', '9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', 'Knowledge transfer sessions', 'pending', '2026-12-15'),
  ('a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a002', '9f9f9f9f-9f9f-9f9f-9f9f-9f9f9f9f9f01', 'Revoke system access', 'pending', '2026-12-31')
on conflict (id) do nothing;

insert into public.org_chart_nodes (id, organization_id, employee_id, department_id, parent_node_id, sort_order)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a001', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', null, 1),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a002', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a01', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a001', 2),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a003', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c03', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a02', null, 3),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a004', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c04', '7a7a7a7a-7a7a-7a7a-7a7a-7a7a7a7a7a03', null, 4)
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 010_enterprise_inventory_seed.sql
-- =============================================================================
insert into public.product_categories (id, organization_id, name, slug, description)
values
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b101', '11111111-1111-1111-1111-111111111111', 'Hardware', 'hardware', 'Physical equipment and devices'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b102', '11111111-1111-1111-1111-111111111111', 'Software Licenses', 'software-licenses', 'Subscription and perpetual licenses'),
  ('b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b103', '11111111-1111-1111-1111-111111111111', 'Office Supplies', 'office-supplies', 'Consumables and stationery')
on conflict (id) do nothing;

insert into public.products (id, organization_id, category_id, sku, name, description, unit_of_measure, unit_cost, unit_price, reorder_level, status)
values
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b101', 'SKU-LPT-001', 'Enterprise Laptop', 'Standard issue developer laptop', 'each', 1200.00, 1499.00, 5, 'active'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b102', 'SKU-LIC-CRM', 'CRM Platform License', 'Annual CRM seat license', 'seat', 480.00, 720.00, 10, 'active'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', '11111111-1111-1111-1111-111111111111', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b103', 'SKU-PPR-A4', 'A4 Copy Paper', '500-sheet reams', 'ream', 4.50, 7.99, 50, 'active')
on conflict (id) do nothing;

insert into public.warehouses (id, organization_id, name, code, location, manager_name, status)
values
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', '11111111-1111-1111-1111-111111111111', 'San Francisco HQ', 'SF-HQ', '100 Enterprise Way, San Francisco, CA', 'Alex Rivera', 'active'),
  ('b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', '11111111-1111-1111-1111-111111111111', 'Austin Distribution', 'ATX-DC', '500 Logistics Blvd, Austin, TX', 'Jordan Lee', 'active')
on conflict (id) do nothing;

insert into public.stock_levels (id, organization_id, product_id, warehouse_id, quantity, reserved_quantity)
values
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b401', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 12, 2),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b402', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 3, 0),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b403', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b202', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 45, 5),
  ('b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b404', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 28, 0)
on conflict (id) do nothing;

insert into public.suppliers (id, organization_id, name, code, email, phone, address, status)
values
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', '11111111-1111-1111-1111-111111111111', 'TechSupply Co', 'TECHSUP', 'orders@techsupply.example', '+1 415 555 0301', '200 Vendor Lane, San Jose, CA', 'active'),
  ('b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b502', '11111111-1111-1111-1111-111111111111', 'OfficeMart Inc', 'OFFMART', 'sales@officemart.example', '+1 512 555 0302', '88 Supply Row, Austin, TX', 'active')
on conflict (id) do nothing;

insert into public.stock_movements (id, organization_id, product_id, warehouse_id, movement_type, quantity, reference_type, notes, moved_at)
values
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b6b601', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'inbound', 10, 'grn', 'Initial stock receipt', '2026-07-15 10:00:00+00'),
  ('b6b6b6b6-b6b6-b6b6-b6b6-b6b6b6b6b602', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'outbound', 2, 'project', 'Allocated to delivery project', '2026-07-28 14:30:00+00')
on conflict (id) do nothing;

insert into public.inventory_adjustments (id, organization_id, product_id, warehouse_id, adjustment_type, quantity_delta, reason)
values
  ('b7b7b7b7-b7b7-b7b7-b7b7-b7b7b7b7b701', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'correction', -2, 'Cycle count variance')
on conflict (id) do nothing;

insert into public.purchase_orders (id, organization_id, supplier_id, po_number, status, order_date, expected_date, total_amount, notes)
values
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', 'PO-2026-0042', 'approved', '2026-07-20', '2026-08-05', 14400.00, 'Laptop replenishment order'),
  ('b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b802', '11111111-1111-1111-1111-111111111111', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b502', 'PO-2026-0043', 'draft', '2026-08-01', '2026-08-10', 399.50, 'Office supplies restock')
on conflict (id) do nothing;

insert into public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_cost, line_total)
values
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b901', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 12, 1200.00, 14400.00),
  ('b9b9b9b9-b9b9-b9b9-b9b9-b9b9b9b9b902', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b802', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b203', 50, 4.50, 225.00)
on conflict (id) do nothing;

insert into public.assets (id, organization_id, asset_tag, name, category, serial_number, purchase_cost, status, warehouse_id, employee_id, acquired_date)
values
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', '11111111-1111-1111-1111-111111111111', 'AST-LPT-001', 'MacBook Pro 16', 'laptop', 'SN-MBP-88421', 2499.00, 'assigned', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', '2024-03-15'),
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c102', '11111111-1111-1111-1111-111111111111', 'AST-MON-042', 'Dell UltraSharp 27', 'monitor', 'SN-DU27-55210', 599.00, 'available', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', null, '2025-01-10')
on conflict (id) do nothing;

insert into public.product_barcodes (id, organization_id, product_id, asset_id, barcode_value, barcode_type)
values
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c201', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', null, '8901234567890', 'code128'),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c202', '11111111-1111-1111-1111-111111111111', null, 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', 'QR-AST-LPT-001', 'qr')
on conflict (id) do nothing;

insert into public.low_stock_alerts (id, organization_id, product_id, warehouse_id, current_quantity, reorder_level, status, triggered_at)
values
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c301', '11111111-1111-1111-1111-111111111111', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 3, 5, 'open', '2026-08-01 08:00:00+00')
on conflict (id) do nothing;

insert into public.stock_transfers (id, organization_id, transfer_number, source_warehouse_id, destination_warehouse_id, status, notes, transferred_at)
values
  ('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', '11111111-1111-1111-1111-111111111111', 'TRF-2026-0018', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b302', 'completed', 'Laptop redistribution to Austin', '2026-07-25 16:00:00+00')
on conflict (id) do nothing;

insert into public.stock_transfer_items (id, transfer_id, product_id, quantity)
values
  ('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c501', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 3)
on conflict (id) do nothing;

insert into public.goods_received_notes (id, organization_id, grn_number, purchase_order_id, warehouse_id, supplier_id, status, received_date, notes)
values
  ('c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c601', '11111111-1111-1111-1111-111111111111', 'GRN-2026-0091', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b3b301', 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b501', 'received', '2026-07-22', 'Partial receipt against PO-2026-0042')
on conflict (id) do nothing;

insert into public.grn_items (id, grn_id, product_id, quantity_received, unit_cost)
values
  ('c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c701', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c601', 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b201', 10, 1200.00)
on conflict (id) do nothing;

insert into public.inventory_valuations (id, organization_id, valuation_date, method, total_value, total_units, notes)
values
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c801', '11111111-1111-1111-1111-111111111111', '2026-07-31', 'weighted_average', 38482.50, 88, 'Month-end inventory valuation snapshot')
on conflict (id) do nothing;

insert into public.inventory_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata)
values
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c901', '11111111-1111-1111-1111-111111111111', 'purchase_order', 'b8b8b8b8-b8b8-b8b8-b8b8-b8b8b8b8b801', 'approve', 'Purchase order PO-2026-0042 approved', '{"po_number":"PO-2026-0042"}'::jsonb),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c902', '11111111-1111-1111-1111-111111111111', 'stock_transfer', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c401', 'complete', 'Transfer TRF-2026-0018 completed', '{"transfer_number":"TRF-2026-0018"}'::jsonb),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c903', '11111111-1111-1111-1111-111111111111', 'asset', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c101', 'assign', 'Asset AST-LPT-001 assigned to employee', '{"asset_tag":"AST-LPT-001"}'::jsonb)
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 011_enterprise_support_seed.sql
-- =============================================================================
insert into public.support_categories (id, organization_id, name, slug, description)
values
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', '11111111-1111-1111-1111-111111111111', 'Technical Issue', 'technical', 'Software bugs and technical problems'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', '11111111-1111-1111-1111-111111111111', 'Billing', 'billing', 'Invoices, payments, and subscription questions'),
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d103', '11111111-1111-1111-1111-111111111111', 'Feature Request', 'feature-request', 'Product enhancement requests')
on conflict (id) do nothing;

insert into public.support_priorities (id, organization_id, name, level, color, response_hours)
values
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d201', '11111111-1111-1111-1111-111111111111', 'Critical', 1, '#ef4444', 1),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d202', '11111111-1111-1111-1111-111111111111', 'High', 2, '#f97316', 4),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', '11111111-1111-1111-1111-111111111111', 'Medium', 3, '#eab308', 24),
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d204', '11111111-1111-1111-1111-111111111111', 'Low', 4, '#22c55e', 72)
on conflict (id) do nothing;

insert into public.support_slas (id, organization_id, name, priority_id, first_response_minutes, resolution_minutes, is_active)
values
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d301', '11111111-1111-1111-1111-111111111111', 'Critical SLA', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d201', 15, 240, true),
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', '11111111-1111-1111-1111-111111111111', 'Standard SLA', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', 60, 480, true)
on conflict (id) do nothing;

insert into public.support_queues (id, organization_id, name, code, description, default_assignee_id, is_active)
values
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', '11111111-1111-1111-1111-111111111111', 'General Support', 'GEN', 'Default support queue for all incoming tickets', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '11111111-1111-1111-1111-111111111111', 'Enterprise Escalations', 'ESC', 'Priority queue for enterprise customers', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true)
on conflict (id) do nothing;

insert into public.support_tickets (id, organization_id, ticket_number, subject, description, status, category_id, priority_id, sla_id, queue_id, client_id, contact_id, project_id, assigned_agent_id, portal_visible, due_at)
values
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01042', 'API integration timeout errors', 'Northstar Labs reporting intermittent 504 errors on webhook endpoints during peak hours.', 'open', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d202', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d301', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true, '2026-08-03 18:00:00+00'),
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01043', 'Invoice discrepancy on Q2 billing', 'Apex Commerce needs clarification on duplicate line items in June invoice.', 'pending', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d203', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true, '2026-08-05 12:00:00+00'),
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', '11111111-1111-1111-1111-111111111111', 'TKT-2026-01044', 'Request for bulk export feature', 'Customer requesting CSV export for analytics dashboard data.', 'resolved', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d103', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d2d204', 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d302', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', null, 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', true, null)
on conflict (id) do nothing;

update public.support_tickets set resolved_at = '2026-07-30 16:45:00+00' where id = 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503';

insert into public.support_ticket_notes (id, organization_id, ticket_id, body, is_internal)
values
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d601', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'Investigating load balancer logs — spike correlates with webhook batch processing.', true),
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d602', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'We are actively investigating the timeout issue and will update you shortly.', false),
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d6d603', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', 'Forwarded to finance team for invoice reconciliation.', true)
on conflict (id) do nothing;

insert into public.support_ticket_attachments (id, organization_id, ticket_id, file_name, file_url, file_size, mime_type)
values
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d7d701', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'error-logs.txt', 'https://storage.example.com/support/error-logs.txt', 24576, 'text/plain'),
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d7d702', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d502', 'invoice-june-2026.pdf', 'https://storage.example.com/support/invoice-june-2026.pdf', 102400, 'application/pdf')
on conflict (id) do nothing;

insert into public.support_knowledge_articles (id, organization_id, title, slug, content, category_id, status, view_count)
values
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d8d801', '11111111-1111-1111-1111-111111111111', 'Getting Started with Webhooks', 'getting-started-webhooks', 'Configure webhook endpoints in Settings > Integrations. Ensure your endpoint responds within 5 seconds.', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d101', 'published', 142),
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d8d802', '11111111-1111-1111-1111-111111111111', 'Understanding Your Invoice', 'understanding-invoice', 'Your invoice includes base subscription, usage overages, and applicable taxes. Contact billing for adjustments.', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d1d102', 'published', 89)
on conflict (id) do nothing;

insert into public.support_canned_responses (id, organization_id, title, shortcut, body, category_id)
values
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d901', '11111111-1111-1111-1111-111111111111', 'Acknowledge receipt', '/ack', 'Thank you for contacting support. We have received your request and assigned it to our team.', null),
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d9d902', '11111111-1111-1111-1111-111111111111', 'Request more info', '/info', 'To help us resolve this faster, could you please provide additional details or screenshots?', null)
on conflict (id) do nothing;

insert into public.support_escalation_rules (id, organization_id, name, trigger_condition, escalation_level, target_queue_id, notify_agent_id, is_active)
values
  ('dadadada-dada-dada-dada-dadadadada01', '11111111-1111-1111-1111-111111111111', 'SLA breach escalation', 'sla_breach', 1, 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true),
  ('dadadada-dada-dada-dada-dadadadada02', '11111111-1111-1111-1111-111111111111', 'Critical priority auto-escalate', 'priority_critical', 2, 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d402', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', true)
on conflict (id) do nothing;

insert into public.support_satisfaction_ratings (id, organization_id, ticket_id, rating, comment, submitted_at)
values
  ('dbdbdbdb-dbdb-dbdb-dbdb-dbdbdbdbdb01', '11111111-1111-1111-1111-111111111111', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', 5, 'Quick resolution and helpful agent. Export feature works perfectly.', '2026-07-31 09:00:00+00')
on conflict (id) do nothing;

insert into public.support_portal_settings (id, organization_id, portal_enabled, welcome_message, allow_ticket_creation, show_knowledge_base, custom_domain)
values
  ('dcdcdcdc-dcdc-dcdc-dcdc-dcdcdcdcdc01', '11111111-1111-1111-1111-111111111111', true, 'Welcome to Acme Support. How can we help you today?', true, true, 'support.acme.example.com')
on conflict (id) do nothing;

insert into public.support_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('dddddddd-dddd-dddd-dddd-dddddddddd91', '11111111-1111-1111-1111-111111111111', 'ticket', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d501', 'create', 'Ticket TKT-2026-01042 created for Northstar Labs'),
  ('dddddddd-dddd-dddd-dddd-dddddddddd92', '11111111-1111-1111-1111-111111111111', 'ticket', 'd5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d5d503', 'resolve', 'Ticket TKT-2026-01044 resolved')
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 012_enterprise_sales_seed.sql
-- =============================================================================
insert into public.sales_pipelines (id, organization_id, name, code, description, is_default)
values
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', '11111111-1111-1111-1111-111111111111', 'Enterprise Sales', 'ENT', 'Primary B2B enterprise sales pipeline', true),
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e102', '11111111-1111-1111-1111-111111111111', 'Mid-Market', 'MM', 'Mid-market and SMB sales pipeline', false)
on conflict (id) do nothing;

insert into public.sales_pipeline_stages (id, organization_id, pipeline_id, name, sort_order, probability, is_closed_won, is_closed_lost)
values
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e201', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Prospecting', 1, 10, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e202', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Qualification', 2, 25, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e203', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Proposal', 3, 50, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e204', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Negotiation', 4, 75, false, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e205', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Closed Won', 5, 100, true, false),
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e206', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'Closed Lost', 6, 0, false, true)
on conflict (id) do nothing;

insert into public.sales_leads (id, organization_id, client_id, lead_name, company_name, email, phone, source, status, score, assigned_to)
values
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'Sara Chen', 'Helio Health', 'sara@heliohealth.com', '+1 617 555 0201', 'inbound', 'qualified', 82, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01'),
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e302', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', 'Tom Bradley', 'Summit Retail', 'tom@summitretail.com', '+1 312 555 0202', 'referral', 'contacted', 71, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02'),
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e303', '11111111-1111-1111-1111-111111111111', null, 'Maria Gonzalez', 'NovaTech Solutions', 'maria@novatech.io', '+1 415 555 0203', 'outbound', 'new', 45, null)
on conflict (id) do nothing;

insert into public.sales_opportunities (id, organization_id, opportunity_number, name, description, pipeline_id, stage_id, client_id, contact_id, project_id, assigned_to, amount, probability, expected_close_date, status)
values
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0088', 'Northstar Enterprise Expansion', 'Annual platform expansion for Northstar Labs', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e204', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 284000.00, 75, '2026-09-15', 'open'),
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e402', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0089', 'Helio Health Platform License', 'Healthcare compliance module deployment', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e203', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'dddddddd-dddd-dddd-dddd-dddddddddd03', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 48000.00, 50, '2026-08-30', 'open'),
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', '11111111-1111-1111-1111-111111111111', 'OPP-2026-0075', 'Apex Commerce Renewal', 'Annual renewal with upsell', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e2e205', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', 'dddddddd-dddd-dddd-dddd-dddddddddd02', null, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 96000.00, 100, '2026-07-01', 'won')
on conflict (id) do nothing;

update public.sales_opportunities set won_at = '2026-07-01 14:00:00+00', status = 'won' where id = 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403';

insert into public.sales_quotes (id, organization_id, quote_number, opportunity_id, client_id, title, status, total_amount, valid_until)
values
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', '11111111-1111-1111-1111-111111111111', 'QT-2026-0042', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'Northstar Enterprise Expansion Proposal', 'sent', 284000.00, '2026-09-01'),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', '11111111-1111-1111-1111-111111111111', 'QT-2026-0043', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e402', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', 'Helio Health Platform License', 'draft', 48000.00, '2026-08-15')
on conflict (id) do nothing;

insert into public.sales_quote_items (id, quote_id, description, quantity, unit_price, line_total)
values
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e601', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'Enterprise Platform License (100 seats)', 100, 2400.00, 240000.00),
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e602', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e501', 'Implementation Services', 1, 44000.00, 44000.00),
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e6e603', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e502', 'Healthcare Compliance Module', 1, 48000.00, 48000.00)
on conflict (id) do nothing;

insert into public.sales_forecasts (id, organization_id, forecast_period, forecast_date, pipeline_value, weighted_value, closed_value, notes)
values
  ('e7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e701', '11111111-1111-1111-1111-111111111111', 'Q3 2026', '2026-08-01', 428000.00, 253000.00, 96000.00, 'Strong pipeline with two enterprise deals in negotiation'),
  ('e7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e7e702', '11111111-1111-1111-1111-111111111111', 'Q4 2026', '2026-08-01', 185000.00, 92500.00, 0, 'Early-stage Q4 pipeline build')
on conflict (id) do nothing;

insert into public.sales_activities (id, organization_id, opportunity_id, lead_id, activity_type, subject, description, due_at, assigned_to)
values
  ('e8e8e8e8-e8e8-e8e8-e8e8-e8e8e8e8e801', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'task', 'Send revised proposal', 'Update pricing per Mina Park feedback', '2026-08-05 17:00:00+00', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01'),
  ('e8e8e8e8-e8e8-e8e8-e8e8-e8e8e8e8e802', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e302', 'follow_up', 'Follow up on Summit Retail demo', 'Schedule second demo with decision makers', '2026-08-06 10:00:00+00', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02')
on conflict (id) do nothing;

insert into public.sales_meetings (id, organization_id, opportunity_id, lead_id, title, location, meeting_url, scheduled_at, duration_minutes, status, attendee_names)
values
  ('e9e9e9e9-e9e9-e9e9-e9e9-e9e9e9e9e901', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'Northstar Contract Review', 'Zoom', 'https://meet.example.com/northstar-review', '2026-08-04 15:00:00+00', 60, 'scheduled', 'Mina Park, Alex Rivera'),
  ('e9e9e9e9-e9e9-e9e9-e9e9-e9e9e9e9e902', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', 'Helio Health Discovery Call', 'Phone', '', '2026-08-03 11:00:00+00', 30, 'completed', 'Sara Chen')
on conflict (id) do nothing;

insert into public.sales_call_logs (id, organization_id, opportunity_id, lead_id, direction, phone_number, duration_seconds, outcome, notes, called_at)
values
  ('eaeaeaea-eaea-eaea-eaea-eaeaeaeaea01', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'outbound', '+1 415 555 0148', 1245, 'connected', 'Discussed contract terms and timeline', '2026-08-02 16:30:00+00'),
  ('eaeaeaea-eaea-eaea-eaea-eaeaeaeaea02', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e303', 'outbound', '+1 415 555 0203', 420, 'voicemail', 'Left voicemail about product demo', '2026-08-01 09:15:00+00')
on conflict (id) do nothing;

insert into public.sales_email_tracking (id, organization_id, opportunity_id, lead_id, subject, recipient_email, status, sent_at, opened_at)
values
  ('ebebebeb-ebeb-ebeb-ebeb-ebebebebeb01', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', null, 'Northstar Expansion Proposal — QT-2026-0042', 'ops@northstarlabs.com', 'opened', '2026-08-01 10:00:00+00', '2026-08-01 14:22:00+00'),
  ('ebebebeb-ebeb-ebeb-ebeb-ebebebebeb02', '11111111-1111-1111-1111-111111111111', null, 'e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e3e301', 'Helio Health — Next Steps', 'sara@heliohealth.com', 'clicked', '2026-07-28 11:00:00+00', '2026-07-28 11:45:00+00')
on conflict (id) do nothing;

insert into public.sales_targets (id, organization_id, employee_id, period_label, target_amount, achieved_amount, period_start, period_end)
values
  ('ecececec-ecec-ecec-ecec-ececececec01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'Q3 2026', 500000.00, 96000.00, '2026-07-01', '2026-09-30'),
  ('ecececec-ecec-ecec-ecec-ececececec02', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'Q3 2026', 350000.00, 0, '2026-07-01', '2026-09-30')
on conflict (id) do nothing;

insert into public.sales_commissions (id, organization_id, employee_id, opportunity_id, commission_rate, commission_amount, status, calculated_at)
values
  ('edededed-eded-eded-eded-ededededed01', '11111111-1111-1111-1111-111111111111', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 8.00, 7680.00, 'approved', '2026-07-02 09:00:00+00')
on conflict (id) do nothing;

insert into public.sales_win_loss_records (id, organization_id, opportunity_id, outcome, reason, competitor, amount, recorded_at)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee91', '11111111-1111-1111-1111-111111111111', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 'won', 'Competitive pricing and strong relationship', '', 96000.00, '2026-07-01 14:00:00+00')
on conflict (id) do nothing;

insert into public.sales_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee92', '11111111-1111-1111-1111-111111111111', 'opportunity', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401', 'create', 'Opportunity OPP-2026-0088 created for Northstar Labs'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee93', '11111111-1111-1111-1111-111111111111', 'opportunity', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e403', 'won', 'Opportunity OPP-2026-0075 marked as won')
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 013_enterprise_documents_seed.sql
-- =============================================================================
insert into public.document_folders (id, organization_id, parent_folder_id, name, slug, description)
values
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', '11111111-1111-1111-1111-111111111111', null, 'Company Documents', 'company', 'Root folder for company-wide documents'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Legal', 'legal', 'Contracts, agreements, and legal documents'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f103', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Finance', 'finance', 'Invoices, reports, and financial records'),
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f104', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'Projects', 'projects', 'Project deliverables and documentation')
on conflict (id) do nothing;

insert into public.documents (id, organization_id, folder_id, title, file_name, file_url, mime_type, file_size, status, current_version, client_id, project_id, sales_opportunity_id)
values
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', 'Northstar Master Service Agreement', 'northstar-msa-v3.pdf', 'https://storage.example.com/docs/northstar-msa-v3.pdf', 'application/pdf', 524288, 'active', 3, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e4e401'),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f103', 'Q2 2026 Financial Report', 'q2-2026-financial-report.xlsx', 'https://storage.example.com/docs/q2-2026-financial-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1048576, 'active', 1, null, null, null),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f104', 'Northstar Expansion SOW', 'northstar-sow-v1.docx', 'https://storage.example.com/docs/northstar-sow-v1.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 262144, 'active', 1, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', null)
on conflict (id) do nothing;

insert into public.document_tags (id, organization_id, name, color)
values
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f301', '11111111-1111-1111-1111-111111111111', 'Contract', '#3b82f6'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f302', '11111111-1111-1111-1111-111111111111', 'Financial', '#22c55e'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f303', '11111111-1111-1111-1111-111111111111', 'Confidential', '#ef4444')
on conflict (id) do nothing;

insert into public.document_tag_links (id, document_id, tag_id)
values
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f401', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f301'),
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f402', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f303'),
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f403', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f302')
on conflict (id) do nothing;

insert into public.document_versions (id, organization_id, document_id, version_number, file_url, file_size, change_summary)
values
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f501', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 1, 'https://storage.example.com/docs/northstar-msa-v1.pdf', 480000, 'Initial draft'),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f502', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 2, 'https://storage.example.com/docs/northstar-msa-v2.pdf', 510000, 'Legal review updates'),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f503', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 3, 'https://storage.example.com/docs/northstar-msa-v3.pdf', 524288, 'Final signed version')
on conflict (id) do nothing;

insert into public.document_approvals (id, organization_id, document_id, approver_id, status, comments, decided_at)
values
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f601', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'approved', 'Legal terms reviewed and approved', '2026-07-25 10:00:00+00'),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f602', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'pending', 'Awaiting project manager review', null)
on conflict (id) do nothing;

insert into public.document_esign_preparations (id, organization_id, document_id, signer_name, signer_email, status, sent_at)
values
  ('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f701', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'Mina Park', 'ops@northstarlabs.com', 'sent', '2026-07-28 14:00:00+00')
on conflict (id) do nothing;

insert into public.document_shares (id, organization_id, document_id, share_token, recipient_email, permission_level, expires_at, is_active)
values
  ('f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f801', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'share-northstar-msa-2026', 'ops@northstarlabs.com', 'view', '2026-12-31 23:59:59+00', true),
  ('f8f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f802', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', 'share-northstar-sow-2026', 'mina@northstarlabs.com', 'comment', '2026-09-30 23:59:59+00', true)
on conflict (id) do nothing;

insert into public.document_access_grants (id, organization_id, document_id, folder_id, grantee_type, grantee_id, permission_level)
values
  ('f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f901', '11111111-1111-1111-1111-111111111111', null, 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f102', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'edit'),
  ('f9f9f9f9-f9f9-f9f9-f9f9-f9f9f9f9f902', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', null, 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'view')
on conflict (id) do nothing;

insert into public.document_templates (id, organization_id, name, category, description, template_content, status)
values
  ('fafafafa-fafa-fafa-fafa-fafafafafa01', '11111111-1111-1111-1111-111111111111', 'Master Service Agreement', 'legal', 'Standard MSA template for enterprise clients', 'This Master Service Agreement is entered into between {{company_name}} and {{client_name}}...', 'active'),
  ('fafafafa-fafa-fafa-fafa-fafafafafa02', '11111111-1111-1111-1111-111111111111', 'Statement of Work', 'projects', 'Project SOW template with deliverables section', 'Statement of Work for {{project_name}}. Deliverables: {{deliverables_list}}...', 'active')
on conflict (id) do nothing;

insert into public.document_previews (id, organization_id, document_id, preview_type, preview_url, page_count)
values
  ('fbfbfbfb-fbfb-fbfb-fbfb-fbfbfbfbfb01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'thumbnail', 'https://storage.example.com/previews/northstar-msa-thumb.png', 12),
  ('fbfbfbfb-fbfb-fbfb-fbfb-fbfbfbfbfb02', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'thumbnail', 'https://storage.example.com/previews/q2-report-thumb.png', 8)
on conflict (id) do nothing;

insert into public.document_search_index (id, organization_id, document_id, search_text)
values
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'Northstar Master Service Agreement MSA contract legal terms enterprise'),
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc02', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f202', 'Q2 2026 Financial Report revenue expenses balance sheet'),
  ('fcfcfcfc-fcfc-fcfc-fcfc-fcfcfcfcfc03', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f203', 'Northstar Expansion SOW statement of work deliverables scope')
on conflict (id) do nothing;

insert into public.document_retention_policies (id, organization_id, name, retention_days, action_on_expiry, applies_to_category, is_active)
values
  ('fdfdfdfd-fdfd-fdfd-fdfd-fdfdfdfdfd01', '11111111-1111-1111-1111-111111111111', 'Legal Documents — 7 Year Retention', 2555, 'archive', 'legal', true),
  ('fdfdfdfd-fdfd-fdfd-fdfd-fdfdfdfdfd02', '11111111-1111-1111-1111-111111111111', 'Financial Records — 5 Year Retention', 1825, 'archive', 'finance', true)
on conflict (id) do nothing;

insert into public.document_archives (id, organization_id, document_id, archived_at, restore_available)
values
  ('fefefefe-fefe-fefe-fefe-fefefefefe01', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', '2026-01-15 00:00:00+00', false)
on conflict (id) do nothing;

insert into public.document_activity_logs (id, organization_id, document_id, activity_type, summary)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff91', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'upload', 'Document uploaded: Northstar Master Service Agreement'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff92', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'version', 'Version 3 uploaded with legal review changes'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff93', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'share', 'Document shared with ops@northstarlabs.com'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff94', '11111111-1111-1111-1111-111111111111', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'approval', 'Document approved by legal team')
on conflict (id) do nothing;

insert into public.document_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffff95', '11111111-1111-1111-1111-111111111111', 'document', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f201', 'create', 'Document Northstar Master Service Agreement created'),
  ('ffffffff-ffff-ffff-ffff-ffffffffff96', '11111111-1111-1111-1111-111111111111', 'folder', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f101', 'create', 'Root folder Company Documents created')
on conflict (id) do nothing;

-- =============================================================================
-- SEED: 014_enterprise_ai_orchestration_seed.sql
-- =============================================================================
insert into public.ai_providers (id, organization_id, name, provider_key, api_base_url, status, is_default, config)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', '11111111-1111-1111-1111-111111111111', 'OpenAI Production', 'openai', 'https://api.openai.com/v1', 'active', true, '{"region":"us-east-1"}'::jsonb),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', '11111111-1111-1111-1111-111111111111', 'Anthropic Enterprise', 'anthropic', 'https://api.anthropic.com/v1', 'active', false, '{"region":"us-west-2"}'::jsonb)
on conflict (id) do nothing;

insert into public.ai_model_routes (id, organization_id, name, provider_id, model_id, priority, routing_strategy, fallback_provider_id, is_active)
values
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '11111111-1111-1111-1111-111111111111', 'Primary GPT-4o Route', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'gpt-4o', 1, 'priority', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', true),
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a202', '11111111-1111-1111-1111-111111111111', 'Claude Sonnet Fallback', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', 'claude-sonnet-4', 2, 'fallback', null, true)
on conflict (id) do nothing;

insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', '11111111-1111-1111-1111-111111111111', 'Business Analyst Agent', 'analyst', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["analysis","reporting","crm"]'::jsonb, 'active'),
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', '11111111-1111-1111-1111-111111111111', 'Operations Orchestrator', 'operations', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["automation","tasks","projects"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_prompt_templates (id, organization_id, name, template_key, category, content, variables, version, status)
values
  ('a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a401', '11111111-1111-1111-1111-111111111111', 'CRM Analysis Prompt', 'crm.analysis', 'crm', 'Analyze client {{client_name}} with context: {{context}}. Provide actionable insights.', '["client_name","context"]'::jsonb, 1, 'active'),
  ('a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a402', '11111111-1111-1111-1111-111111111111', 'Project Risk Assessment', 'projects.risk', 'projects', 'Assess project {{project_name}} risks based on: {{deliverables}}.', '["project_name","deliverables"]'::jsonb, 1, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'crm-northstar-analysis-001', 'crm', 'client', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '{"objective":"expansion analysis"}'::jsonb, 'active', '2026-12-31 23:59:59+00'),
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a502', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', 'projects-delivery-001', 'projects', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"delivery optimization"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.ai_task_executions (id, organization_id, agent_id, session_id, provider_id, task_type, input_payload, output_payload, status, model_used, tokens_used, duration_ms, completed_at)
values
  ('a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'analysis', '{"prompt":"Analyze Northstar expansion"}'::jsonb, '{"summary":"Strong expansion potential"}'::jsonb, 'completed', 'gpt-4o', 1842, 2340, '2026-08-01 10:00:00+00'),
  ('a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a602', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a502', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'orchestration', '{"prompt":"Optimize delivery timeline"}'::jsonb, '{}'::jsonb, 'pending', 'gpt-4o', 0, 0, null)
on conflict (id) do nothing;

insert into public.ai_usage_records (id, organization_id, provider_id, agent_id, task_execution_id, tokens_input, tokens_output, request_count, recorded_at)
values
  ('a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a701', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', 1200, 642, 1, '2026-08-01 10:00:00+00'),
  ('a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a702', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', null, 450, 210, 1, '2026-08-01 11:00:00+00')
on conflict (id) do nothing;

insert into public.ai_cost_records (id, organization_id, provider_id, usage_record_id, cost_usd, pricing_model, recorded_at)
values
  ('a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a801', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a701', 0.018420, 'token', '2026-08-01 10:00:00+00'),
  ('a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a802', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a702', 0.006600, 'token', '2026-08-01 11:00:00+00')
on conflict (id) do nothing;

insert into public.ai_rate_limits (id, organization_id, scope_type, scope_id, requests_per_minute, tokens_per_day, is_active)
values
  ('a9a9a9a9-a9a9-a9a9-a9a9-a9a9a9a9a901', '11111111-1111-1111-1111-111111111111', 'organization', null, 120, 2000000, true),
  ('a9a9a9a9-a9a9-a9a9-a9a9-a9a9a9a9a902', '11111111-1111-1111-1111-111111111111', 'agent', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 30, 500000, true)
on conflict (id) do nothing;

insert into public.ai_permission_grants (id, organization_id, grantee_type, grantee_id, permission_key, resource_type, resource_id, is_active)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaab101', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'ai.execute', 'agent', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaab102', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'ai.manage', 'all', null, true)
on conflict (id) do nothing;

insert into public.ai_provider_health_checks (id, organization_id, provider_id, status, latency_ms, error_message, last_checked_at)
values
  ('abababab-abab-abab-abab-ababababab01', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'healthy', 142, '', '2026-08-01 12:00:00+00'),
  ('abababab-abab-abab-abab-ababababab02', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', 'degraded', 890, 'Elevated latency detected', '2026-08-01 12:00:00+00')
on conflict (id) do nothing;

insert into public.ai_retry_policies (id, organization_id, name, max_retries, backoff_strategy, fallback_route_id, is_active)
values
  ('acacacac-acac-acac-acac-acacacacac01', '11111111-1111-1111-1111-111111111111', 'Default Retry with Claude Fallback', 3, 'exponential', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a202', true)
on conflict (id) do nothing;

insert into public.ai_orchestration_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('adadadad-adad-adad-adad-adadadadad01', '11111111-1111-1111-1111-111111111111', 'provider', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'create', 'OpenAI Production provider registered'),
  ('adadadad-adad-adad-adad-adadadadad02', '11111111-1111-1111-1111-111111111111', 'task', 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', 'execute', 'CRM analysis task completed successfully')
on conflict (id) do nothing;

insert into public.ai_orchestration_analytics (id, organization_id, metric_key, metric_value, dimensions, period_start, period_end, computed_at)
values
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae01', '11111111-1111-1111-1111-111111111111', 'tasks.completed', 1, '{"module":"crm"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00'),
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae02', '11111111-1111-1111-1111-111111111111', 'tokens.total', 2502, '{"provider":"openai"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00'),
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae03', '11111111-1111-1111-1111-111111111111', 'cost.usd', 0.025020, '{"provider":"openai"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00')
on conflict (id) do nothing;

-- =============================================================================
-- END apply_all.sql
-- =============================================================================
commit;

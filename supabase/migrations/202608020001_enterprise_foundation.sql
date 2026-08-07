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
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
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
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role_name text not null default 'member',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id),
  constraint organization_members_role_name_check check (
    role_name = any (
      array[
        'super_admin'::text,
        'admin'::text,
        'founder'::text,
        'owner'::text,
        'manager'::text,
        'member'::text,
        'viewer'::text
      ]
    )
  )
);

create table if not exists public.permission_definitions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_name text not null,
  permission_key text not null,
  action text not null default 'read',
  created_at timestamptz not null default now(),
  unique (role_name, permission_key, action)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid,
  entity_type text,
  entity_id uuid,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.storage_objects (
  id uuid primary key default gen_random_uuid(),
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

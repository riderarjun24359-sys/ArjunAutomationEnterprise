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

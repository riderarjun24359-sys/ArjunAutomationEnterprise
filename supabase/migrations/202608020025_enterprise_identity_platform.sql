-- V2 Program A Sprint 2: Enterprise Identity Platform

create table if not exists public.idp_realms (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_key text not null,
  realm_name text not null,
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_key)
);

create table if not exists public.idp_providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  provider_key text not null,
  provider_type text not null default 'local',
  display_name text not null,
  config jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, provider_key)
);

create table if not exists public.idp_saml_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  config_key text not null,
  entity_id text not null,
  sso_url text not null,
  certificate_pem text not null default '',
  attribute_mapping jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, config_key)
);

create table if not exists public.idp_oidc_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  config_key text not null,
  client_id text not null,
  client_secret_hash text not null default '',
  issuer_url text not null,
  redirect_uris jsonb not null default '[]'::jsonb,
  scopes jsonb not null default '["openid","profile","email"]'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, config_key)
);

create table if not exists public.idp_mfa_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  policy_key text not null,
  name text not null,
  required_methods jsonb not null default '["authenticator"]'::jsonb,
  grace_period_days integer not null default 7,
  enforce_for_admins boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, policy_key)
);

create table if not exists public.idp_mfa_enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  enrollment_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  mfa_type text not null default 'authenticator',
  enrolled_at timestamptz not null default now(),
  last_used_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, enrollment_key)
);

create table if not exists public.idp_backup_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  code_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  code_hash text not null default '',
  used_at timestamptz,
  status text not null default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, code_key)
);

create table if not exists public.idp_trusted_devices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  device_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  device_fingerprint text not null default '',
  device_name text not null default '',
  trusted_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, device_key)
);

create table if not exists public.idp_session_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  policy_key text not null,
  name text not null,
  idle_timeout_minutes integer not null default 30,
  absolute_timeout_hours integer not null default 12,
  require_reauth boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, policy_key)
);

create table if not exists public.idp_active_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  session_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  device_name text not null default '',
  ip_address text not null default '',
  user_agent text not null default '',
  last_active_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, session_key)
);

create table if not exists public.idp_device_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  device_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  device_name text not null,
  device_type text not null default 'desktop',
  os_name text not null default '',
  registered_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, device_key)
);

create table if not exists public.idp_concurrent_login_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  policy_key text not null,
  max_concurrent_sessions integer not null default 3,
  action_on_exceed text not null default 'terminate_oldest',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, policy_key)
);

create table if not exists public.idp_rbac_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  role_key text not null,
  role_name text not null,
  permissions jsonb not null default '[]'::jsonb,
  is_system boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, role_key)
);

create table if not exists public.idp_permission_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  group_key text not null,
  group_name text not null,
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, group_key)
);

create table if not exists public.idp_abac_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  policy_key text not null,
  name text not null,
  conditions jsonb not null default '{}'::jsonb,
  effect text not null default 'allow',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, policy_key)
);

create table if not exists public.idp_temporary_access_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  grant_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  granted_by uuid references public.user_profiles(id) on delete set null,
  permissions jsonb not null default '[]'::jsonb,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, grant_key)
);

create table if not exists public.idp_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  department_key text not null,
  name text not null,
  parent_department_id uuid references public.idp_departments(id) on delete set null,
  head_user_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, department_key)
);

create table if not exists public.idp_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  team_key text not null,
  name text not null,
  department_id uuid references public.idp_departments(id) on delete set null,
  lead_user_id uuid references public.user_profiles(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, team_key)
);

create table if not exists public.idp_business_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  unit_key text not null,
  name text not null,
  code text not null default '',
  parent_unit_id uuid references public.idp_business_units(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, unit_key)
);

create table if not exists public.idp_reporting_structures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  structure_key text not null,
  employee_user_id uuid references public.user_profiles(id) on delete set null,
  manager_user_id uuid references public.user_profiles(id) on delete set null,
  effective_from date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, structure_key)
);

create table if not exists public.idp_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  invitation_key text not null,
  email text not null,
  invited_by uuid references public.user_profiles(id) on delete set null,
  role_name text not null default '',
  expires_at timestamptz not null,
  accepted_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, invitation_key)
);

create table if not exists public.idp_bulk_invite_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  batch_key text not null,
  name text not null,
  total_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, batch_key)
);

create table if not exists public.idp_invitation_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  role_assignment_key text not null,
  invitation_id uuid references public.idp_invitations(id) on delete cascade,
  role_id uuid references public.idp_rbac_roles(id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, role_assignment_key)
);

create table if not exists public.idp_invitation_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  audit_key text not null,
  invitation_id uuid references public.idp_invitations(id) on delete cascade,
  action text not null,
  actor_user_id uuid references public.user_profiles(id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table if not exists public.idp_login_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  login_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  ip_address text not null default '',
  device_name text not null default '',
  login_method text not null default 'password',
  success boolean not null default true,
  logged_at timestamptz not null default now(),
  status text not null default 'recorded',
  created_at timestamptz not null default now()
);

create table if not exists public.idp_security_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  alert_key text not null,
  alert_type text not null,
  severity text not null default 'medium',
  title text not null,
  description text not null default '',
  resolved_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, alert_key)
);

create table if not exists public.idp_risk_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  event_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  risk_score numeric(5, 2) not null default 0,
  risk_factors jsonb not null default '[]'::jsonb,
  action_taken text not null default '',
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, event_key)
);

create table if not exists public.idp_password_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  policy_key text not null,
  name text not null,
  min_length integer not null default 12,
  require_uppercase boolean not null default true,
  require_numbers boolean not null default true,
  require_symbols boolean not null default true,
  max_age_days integer not null default 90,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, policy_key)
);

create table if not exists public.idp_admin_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  total_users integer not null default 0,
  mfa_adoption_percent numeric(5, 2) not null default 0,
  active_sessions integer not null default 0,
  failed_logins_24h integer not null default 0,
  pending_invitations integer not null default 0,
  compromised_accounts integer not null default 0,
  open_security_alerts integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.idp_identity_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  overall_score numeric(5, 2) not null default 0,
  dimension_scores jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

create table if not exists public.idp_compromised_accounts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  realm_id uuid not null references public.idp_realms(id) on delete cascade,
  account_key text not null,
  user_id uuid references public.user_profiles(id) on delete set null,
  detected_at timestamptz not null default now(),
  remediation_status text not null default 'pending',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, realm_id, account_key)
);

create table if not exists public.idp_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid references public.user_profiles(id) on delete set null,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

-- indexes
create index if not exists idx_idp_realms_org on public.idp_realms(organization_id);
create index if not exists idx_idp_providers_org on public.idp_providers(organization_id);
create index if not exists idx_idp_saml_configs_org on public.idp_saml_configs(organization_id);
create index if not exists idx_idp_oidc_configs_org on public.idp_oidc_configs(organization_id);
create index if not exists idx_idp_mfa_policies_org on public.idp_mfa_policies(organization_id);
create index if not exists idx_idp_mfa_enrollments_org on public.idp_mfa_enrollments(organization_id);
create index if not exists idx_idp_backup_codes_org on public.idp_backup_codes(organization_id);
create index if not exists idx_idp_trusted_devices_org on public.idp_trusted_devices(organization_id);
create index if not exists idx_idp_session_policies_org on public.idp_session_policies(organization_id);
create index if not exists idx_idp_active_sessions_org on public.idp_active_sessions(organization_id);
create index if not exists idx_idp_device_registry_org on public.idp_device_registry(organization_id);
create index if not exists idx_idp_concurrent_login_policies_org on public.idp_concurrent_login_policies(organization_id);
create index if not exists idx_idp_rbac_roles_org on public.idp_rbac_roles(organization_id);
create index if not exists idx_idp_permission_groups_org on public.idp_permission_groups(organization_id);
create index if not exists idx_idp_abac_policies_org on public.idp_abac_policies(organization_id);
create index if not exists idx_idp_temporary_access_grants_org on public.idp_temporary_access_grants(organization_id);
create index if not exists idx_idp_departments_org on public.idp_departments(organization_id);
create index if not exists idx_idp_teams_org on public.idp_teams(organization_id);
create index if not exists idx_idp_business_units_org on public.idp_business_units(organization_id);
create index if not exists idx_idp_reporting_structures_org on public.idp_reporting_structures(organization_id);
create index if not exists idx_idp_invitations_org on public.idp_invitations(organization_id);
create index if not exists idx_idp_bulk_invite_batches_org on public.idp_bulk_invite_batches(organization_id);
create index if not exists idx_idp_invitation_roles_org on public.idp_invitation_roles(organization_id);
create index if not exists idx_idp_invitation_audit_org on public.idp_invitation_audit(organization_id);
create index if not exists idx_idp_login_history_org on public.idp_login_history(organization_id);
create index if not exists idx_idp_security_alerts_org on public.idp_security_alerts(organization_id);
create index if not exists idx_idp_risk_events_org on public.idp_risk_events(organization_id);
create index if not exists idx_idp_password_policies_org on public.idp_password_policies(organization_id);
create index if not exists idx_idp_admin_metrics_org on public.idp_admin_metrics(organization_id);
create index if not exists idx_idp_identity_health_org on public.idp_identity_health(organization_id);
create index if not exists idx_idp_compromised_accounts_org on public.idp_compromised_accounts(organization_id);
create index if not exists idx_idp_audit_logs_org on public.idp_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'idp_realms','idp_providers','idp_saml_configs','idp_oidc_configs',
    'idp_mfa_policies','idp_mfa_enrollments','idp_backup_codes','idp_trusted_devices',
    'idp_session_policies','idp_active_sessions','idp_device_registry','idp_concurrent_login_policies',
    'idp_rbac_roles','idp_permission_groups','idp_abac_policies','idp_temporary_access_grants',
    'idp_departments','idp_teams','idp_business_units','idp_reporting_structures',
    'idp_invitations','idp_bulk_invite_batches','idp_invitation_roles',
    'idp_security_alerts','idp_risk_events','idp_password_policies',
    'idp_admin_metrics','idp_identity_health','idp_compromised_accounts'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.idp_realms enable row level security;
alter table public.idp_providers enable row level security;
alter table public.idp_saml_configs enable row level security;
alter table public.idp_oidc_configs enable row level security;
alter table public.idp_mfa_policies enable row level security;
alter table public.idp_mfa_enrollments enable row level security;
alter table public.idp_backup_codes enable row level security;
alter table public.idp_trusted_devices enable row level security;
alter table public.idp_session_policies enable row level security;
alter table public.idp_active_sessions enable row level security;
alter table public.idp_device_registry enable row level security;
alter table public.idp_concurrent_login_policies enable row level security;
alter table public.idp_rbac_roles enable row level security;
alter table public.idp_permission_groups enable row level security;
alter table public.idp_abac_policies enable row level security;
alter table public.idp_temporary_access_grants enable row level security;
alter table public.idp_departments enable row level security;
alter table public.idp_teams enable row level security;
alter table public.idp_business_units enable row level security;
alter table public.idp_reporting_structures enable row level security;
alter table public.idp_invitations enable row level security;
alter table public.idp_bulk_invite_batches enable row level security;
alter table public.idp_invitation_roles enable row level security;
alter table public.idp_invitation_audit enable row level security;
alter table public.idp_login_history enable row level security;
alter table public.idp_security_alerts enable row level security;
alter table public.idp_risk_events enable row level security;
alter table public.idp_password_policies enable row level security;
alter table public.idp_admin_metrics enable row level security;
alter table public.idp_identity_health enable row level security;
alter table public.idp_compromised_accounts enable row level security;
alter table public.idp_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'idp_realms','idp_providers','idp_saml_configs','idp_oidc_configs',
    'idp_mfa_policies','idp_mfa_enrollments','idp_backup_codes','idp_trusted_devices',
    'idp_session_policies','idp_active_sessions','idp_device_registry','idp_concurrent_login_policies',
    'idp_rbac_roles','idp_permission_groups','idp_abac_policies','idp_temporary_access_grants',
    'idp_departments','idp_teams','idp_business_units','idp_reporting_structures',
    'idp_invitations','idp_bulk_invite_batches','idp_invitation_roles','idp_invitation_audit',
    'idp_login_history','idp_security_alerts','idp_risk_events','idp_password_policies',
    'idp_admin_metrics','idp_identity_health','idp_compromised_accounts','idp_audit_logs'
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
  ('idp.view', 'View enterprise identity platform and realm data', 'enterprise_identity'),
  ('idp.manage', 'Manage identity providers, MFA, sessions, and access control', 'enterprise_identity'),
  ('idp.approve', 'Approve identity policy changes and access grants', 'enterprise_identity'),
  ('idp.admin', 'Administer enterprise identity platform and security governance', 'enterprise_identity')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

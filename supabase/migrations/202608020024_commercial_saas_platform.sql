-- V2 Program A Sprint 1: Commercial Multi-Tenant SaaS Platform

create table if not exists public.saas_tenants (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_key text not null,
  company_name text not null,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  current_plan text not null default 'trial',
  tenant_status text not null default 'active',
  trial_ends_at timestamptz,
  subscription_ends_at timestamptz,
  grace_period_ends_at timestamptz,
  domain_slug text not null default '',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_key)
);

create table if not exists public.saas_registrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  registration_key text not null,
  company_name text not null,
  owner_email text not null,
  owner_name text not null default '',
  registration_status text not null default 'pending',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, registration_key)
);

create table if not exists public.saas_tenant_profiles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  profile_key text not null,
  legal_name text not null default '',
  industry text not null default '',
  company_size text not null default '',
  billing_email text not null default '',
  address jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, profile_key)
);

create table if not exists public.saas_domain_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  domain_key text not null,
  subdomain text not null,
  custom_domain text not null default '',
  ssl_status text not null default 'pending',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, domain_key)
);

create table if not exists public.saas_email_verifications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  verification_key text not null,
  email text not null,
  verification_token text not null default '',
  verified_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, verification_key)
);

create table if not exists public.saas_trials (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  trial_key text not null,
  plan_tier text not null default 'trial',
  started_at timestamptz not null default now(),
  ends_at timestamptz not null,
  converted_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, trial_key)
);

create table if not exists public.saas_workspace_setups (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  setup_key text not null,
  workspace_name text not null,
  initialization_steps jsonb not null default '[]'::jsonb,
  completed_steps jsonb not null default '[]'::jsonb,
  status text not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, setup_key)
);

create table if not exists public.saas_tenant_role_provisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  provision_key text not null,
  role_name text not null,
  permissions jsonb not null default '[]'::jsonb,
  is_default boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, provision_key)
);

create table if not exists public.saas_welcome_experiences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  experience_key text not null,
  title text not null,
  welcome_steps jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, experience_key)
);

create table if not exists public.saas_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  subscription_key text not null,
  plan_tier text not null default 'starter',
  billing_cycle text not null default 'monthly',
  amount_usd numeric(12, 2) not null default 0,
  starts_at timestamptz not null default now(),
  renews_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, subscription_key)
);

create table if not exists public.saas_plan_limits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  limit_key text not null,
  plan_tier text not null,
  resource_type text not null,
  limit_value numeric(14, 2) not null default 0,
  current_usage numeric(14, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, limit_key)
);

create table if not exists public.saas_subscription_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  event_key text not null,
  event_type text not null,
  from_plan text not null default '',
  to_plan text not null default '',
  reason text not null default '',
  effective_at timestamptz not null default now(),
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table if not exists public.saas_licenses (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  license_key text not null,
  license_type text not null default 'seat',
  name text not null,
  total_units integer not null default 0,
  used_units integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, license_key)
);

create table if not exists public.saas_license_allocations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  allocation_key text not null,
  license_id uuid references public.saas_licenses(id) on delete set null,
  resource_type text not null default 'seat',
  resource_name text not null,
  allocated_units integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, allocation_key)
);

create table if not exists public.saas_feature_flags (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  flag_key text not null,
  name text not null,
  enabled boolean not null default false,
  module_source text not null default '',
  usage_limit numeric(14, 2),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, flag_key)
);

create table if not exists public.saas_portal_settings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  settings_key text not null,
  portal_name text not null default '',
  preferences jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, settings_key)
);

create table if not exists public.saas_portal_branding (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  branding_key text not null,
  logo_url text not null default '',
  primary_color text not null default '#0ea5e9',
  accent_color text not null default '#0284c7',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, branding_key)
);

create table if not exists public.saas_portal_integrations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  integration_key text not null,
  provider text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, integration_key)
);

create table if not exists public.saas_portal_api_keys (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  api_key_hash text not null default '',
  key_name text not null,
  scopes jsonb not null default '[]'::jsonb,
  last_used_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, key_name)
);

create table if not exists public.saas_usage_meters (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  meter_key text not null,
  meter_type text not null default 'users',
  unit_label text not null default '',
  current_period_usage numeric(14, 4) not null default 0,
  period_start timestamptz not null default now(),
  period_end timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, meter_key)
);

create table if not exists public.saas_usage_records (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  record_key text not null,
  meter_type text not null,
  quantity numeric(14, 4) not null default 0,
  recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.saas_commercial_invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  invoice_key text not null,
  invoice_number text not null,
  amount_usd numeric(12, 2) not null default 0,
  tax_amount_usd numeric(12, 2) not null default 0,
  discount_amount_usd numeric(12, 2) not null default 0,
  due_date date,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, invoice_key)
);

create table if not exists public.saas_billing_credits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  credit_key text not null,
  balance_usd numeric(12, 2) not null default 0,
  reason text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, credit_key)
);

create table if not exists public.saas_billing_coupons (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  coupon_key text not null,
  code text not null,
  discount_type text not null default 'percent',
  discount_value numeric(8, 2) not null default 0,
  expires_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, coupon_key)
);

create table if not exists public.saas_recurring_billing (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  billing_key text not null,
  amount_usd numeric(12, 2) not null default 0,
  billing_cycle text not null default 'monthly',
  next_billing_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, billing_key)
);

create table if not exists public.saas_tenant_health_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  score_key text not null,
  overall_score numeric(5, 2) not null default 0,
  dimension_scores jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, score_key)
);

create table if not exists public.saas_onboarding_checklists (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  checklist_key text not null,
  name text not null,
  items jsonb not null default '[]'::jsonb,
  completion_percent numeric(5, 2) not null default 0,
  status text not null default 'in_progress',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, checklist_key)
);

create table if not exists public.saas_product_adoption (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  adoption_key text not null,
  module_name text not null,
  adoption_percent numeric(5, 2) not null default 0,
  active_users integer not null default 0,
  status text not null default 'tracking',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, adoption_key)
);

create table if not exists public.saas_renewal_tracking (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  renewal_key text not null,
  renewal_date date not null,
  renewal_value_usd numeric(12, 2) not null default 0,
  renewal_probability numeric(5, 2) not null default 0,
  status text not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, renewal_key)
);

create table if not exists public.saas_support_summaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  tenant_id uuid not null references public.saas_tenants(id) on delete cascade,
  summary_key text not null,
  open_tickets integer not null default 0,
  avg_resolution_hours numeric(8, 2) not null default 0,
  satisfaction_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, tenant_id, summary_key)
);

create table if not exists public.saas_admin_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  active_tenants integer not null default 0,
  trial_tenants integer not null default 0,
  mrr_usd numeric(14, 2) not null default 0,
  arr_usd numeric(14, 2) not null default 0,
  churn_rate_percent numeric(5, 2) not null default 0,
  renewal_count integer not null default 0,
  total_usage_records integer not null default 0,
  avg_health_score numeric(5, 2) not null default 0,
  growth_rate_percent numeric(8, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.saas_audit_logs (
  id uuid primary key default uuid_generate_v4(),
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
create index if not exists idx_saas_tenants_org on public.saas_tenants(organization_id);
create index if not exists idx_saas_registrations_org on public.saas_registrations(organization_id);
create index if not exists idx_saas_tenant_profiles_org on public.saas_tenant_profiles(organization_id);
create index if not exists idx_saas_domain_configs_org on public.saas_domain_configs(organization_id);
create index if not exists idx_saas_email_verifications_org on public.saas_email_verifications(organization_id);
create index if not exists idx_saas_trials_org on public.saas_trials(organization_id);
create index if not exists idx_saas_workspace_setups_org on public.saas_workspace_setups(organization_id);
create index if not exists idx_saas_tenant_role_provisions_org on public.saas_tenant_role_provisions(organization_id);
create index if not exists idx_saas_welcome_experiences_org on public.saas_welcome_experiences(organization_id);
create index if not exists idx_saas_subscriptions_org on public.saas_subscriptions(organization_id);
create index if not exists idx_saas_plan_limits_org on public.saas_plan_limits(organization_id);
create index if not exists idx_saas_subscription_events_org on public.saas_subscription_events(organization_id);
create index if not exists idx_saas_licenses_org on public.saas_licenses(organization_id);
create index if not exists idx_saas_license_allocations_org on public.saas_license_allocations(organization_id);
create index if not exists idx_saas_feature_flags_org on public.saas_feature_flags(organization_id);
create index if not exists idx_saas_portal_settings_org on public.saas_portal_settings(organization_id);
create index if not exists idx_saas_portal_branding_org on public.saas_portal_branding(organization_id);
create index if not exists idx_saas_portal_integrations_org on public.saas_portal_integrations(organization_id);
create index if not exists idx_saas_portal_api_keys_org on public.saas_portal_api_keys(organization_id);
create index if not exists idx_saas_usage_meters_org on public.saas_usage_meters(organization_id);
create index if not exists idx_saas_usage_records_org on public.saas_usage_records(organization_id);
create index if not exists idx_saas_commercial_invoices_org on public.saas_commercial_invoices(organization_id);
create index if not exists idx_saas_billing_credits_org on public.saas_billing_credits(organization_id);
create index if not exists idx_saas_billing_coupons_org on public.saas_billing_coupons(organization_id);
create index if not exists idx_saas_recurring_billing_org on public.saas_recurring_billing(organization_id);
create index if not exists idx_saas_tenant_health_scores_org on public.saas_tenant_health_scores(organization_id);
create index if not exists idx_saas_onboarding_checklists_org on public.saas_onboarding_checklists(organization_id);
create index if not exists idx_saas_product_adoption_org on public.saas_product_adoption(organization_id);
create index if not exists idx_saas_renewal_tracking_org on public.saas_renewal_tracking(organization_id);
create index if not exists idx_saas_support_summaries_org on public.saas_support_summaries(organization_id);
create index if not exists idx_saas_admin_metrics_org on public.saas_admin_metrics(organization_id);
create index if not exists idx_saas_audit_logs_org on public.saas_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'saas_tenants','saas_registrations','saas_tenant_profiles','saas_domain_configs',
    'saas_email_verifications','saas_trials','saas_workspace_setups','saas_tenant_role_provisions',
    'saas_welcome_experiences','saas_subscriptions','saas_plan_limits','saas_licenses',
    'saas_license_allocations','saas_feature_flags','saas_portal_settings','saas_portal_branding',
    'saas_portal_integrations','saas_portal_api_keys','saas_usage_meters','saas_commercial_invoices',
    'saas_billing_credits','saas_billing_coupons','saas_recurring_billing','saas_tenant_health_scores',
    'saas_onboarding_checklists','saas_product_adoption','saas_renewal_tracking','saas_support_summaries',
    'saas_admin_metrics'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.saas_tenants enable row level security;
alter table public.saas_registrations enable row level security;
alter table public.saas_tenant_profiles enable row level security;
alter table public.saas_domain_configs enable row level security;
alter table public.saas_email_verifications enable row level security;
alter table public.saas_trials enable row level security;
alter table public.saas_workspace_setups enable row level security;
alter table public.saas_tenant_role_provisions enable row level security;
alter table public.saas_welcome_experiences enable row level security;
alter table public.saas_subscriptions enable row level security;
alter table public.saas_plan_limits enable row level security;
alter table public.saas_subscription_events enable row level security;
alter table public.saas_licenses enable row level security;
alter table public.saas_license_allocations enable row level security;
alter table public.saas_feature_flags enable row level security;
alter table public.saas_portal_settings enable row level security;
alter table public.saas_portal_branding enable row level security;
alter table public.saas_portal_integrations enable row level security;
alter table public.saas_portal_api_keys enable row level security;
alter table public.saas_usage_meters enable row level security;
alter table public.saas_usage_records enable row level security;
alter table public.saas_commercial_invoices enable row level security;
alter table public.saas_billing_credits enable row level security;
alter table public.saas_billing_coupons enable row level security;
alter table public.saas_recurring_billing enable row level security;
alter table public.saas_tenant_health_scores enable row level security;
alter table public.saas_onboarding_checklists enable row level security;
alter table public.saas_product_adoption enable row level security;
alter table public.saas_renewal_tracking enable row level security;
alter table public.saas_support_summaries enable row level security;
alter table public.saas_admin_metrics enable row level security;
alter table public.saas_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'saas_tenants','saas_registrations','saas_tenant_profiles','saas_domain_configs',
    'saas_email_verifications','saas_trials','saas_workspace_setups','saas_tenant_role_provisions',
    'saas_welcome_experiences','saas_subscriptions','saas_plan_limits','saas_subscription_events',
    'saas_licenses','saas_license_allocations','saas_feature_flags','saas_portal_settings',
    'saas_portal_branding','saas_portal_integrations','saas_portal_api_keys','saas_usage_meters',
    'saas_usage_records','saas_commercial_invoices','saas_billing_credits','saas_billing_coupons',
    'saas_recurring_billing','saas_tenant_health_scores','saas_onboarding_checklists',
    'saas_product_adoption','saas_renewal_tracking','saas_support_summaries','saas_admin_metrics',
    'saas_audit_logs'
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
  ('saas.view', 'View commercial SaaS platform and tenant data', 'commercial_saas'),
  ('saas.manage', 'Manage tenant registration, subscriptions, and billing', 'commercial_saas'),
  ('saas.approve', 'Approve subscription changes and commercial operations', 'commercial_saas'),
  ('saas.admin', 'Administer commercial SaaS platform and tenant governance', 'commercial_saas')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

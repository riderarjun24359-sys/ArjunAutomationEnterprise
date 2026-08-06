-- V2 Program F Capability Wave 1: Company Foundation

-- CompanyHub
create table if not exists public.cmp_company_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  company_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- BrandProfile
create table if not exists public.cmp_brand_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  brand_status text not null default 'draft',
  brand_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- LogoAsset
create table if not exists public.cmp_logo_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  asset_type text not null default 'primary',
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- ThemeConfig
create table if not exists public.cmp_theme_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  config_key text not null,
  config_name text not null default '',
  primary_color text not null default '#059669',
  secondary_color text not null default '#047857',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

-- BrandAsset
create table if not exists public.cmp_brand_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  asset_category text not null default 'marketing',
  asset_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- WebsitePage
create table if not exists public.cmp_website_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  page_key text not null,
  page_title text not null default '',
  page_slug text not null default '',
  page_status text not null default 'draft',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, page_key)
);

-- WebsiteFeature
create table if not exists public.cmp_website_features (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  feature_key text not null,
  feature_name text not null default '',
  feature_type text not null default 'core',
  feature_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, feature_key)
);

-- WebsiteSection
create table if not exists public.cmp_website_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  section_key text not null,
  section_name text not null default '',
  section_type text not null default 'hero',
  section_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, section_key)
);

-- DemoRequest
create table if not exists public.cmp_demo_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  request_key text not null,
  request_name text not null default '',
  request_status text not null default 'pending',
  contact_email text not null default '',
  requested_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, request_key)
);

-- PricingPlan
create table if not exists public.cmp_pricing_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  plan_key text not null,
  plan_name text not null default '',
  plan_tier text not null default 'standard',
  base_price numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, plan_key)
);

-- PricingPackage
create table if not exists public.cmp_pricing_packages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  package_key text not null,
  package_name text not null default '',
  package_type text not null default 'bundle',
  package_price numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, package_key)
);

-- ModulePricing
create table if not exists public.cmp_module_pricing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  pricing_key text not null,
  module_name text not null default '',
  price_amount numeric(12, 2) not null default 0,
  billing_cycle text not null default 'monthly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, pricing_key)
);

-- DiscountRule
create table if not exists public.cmp_discount_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  discount_percent numeric(5, 2) not null default 0,
  rule_type text not null default 'volume',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- Proposal
create table if not exists public.cmp_proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  proposal_key text not null,
  proposal_name text not null default '',
  proposal_status text not null default 'draft',
  proposal_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, proposal_key)
);

-- ProposalDocument
create table if not exists public.cmp_proposal_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  document_key text not null,
  document_name text not null default '',
  document_type text not null default 'pdf',
  document_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, document_key)
);

-- ProposalContract
create table if not exists public.cmp_proposal_contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  contract_key text not null,
  contract_name text not null default '',
  contract_status text not null default 'pending',
  contract_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, contract_key)
);

-- ProposalHistory
create table if not exists public.cmp_proposal_history (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  history_key text not null,
  history_type text not null default 'revision',
  changed_at timestamptz not null default now(),
  change_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- PortalDashboard
create table if not exists public.cmp_portal_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_type text not null default 'customer',
  widget_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- PortalSubscription
create table if not exists public.cmp_portal_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  subscription_key text not null,
  plan_name text not null default '',
  subscription_status text not null default 'active',
  seat_count integer not null default 1,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, subscription_key)
);

-- PortalBilling
create table if not exists public.cmp_portal_billing (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  billing_key text not null,
  billing_type text not null default 'invoice',
  billing_amount numeric(12, 2) not null default 0,
  billing_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, billing_key)
);

-- PortalSupport
create table if not exists public.cmp_portal_support (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  support_key text not null,
  support_title text not null default '',
  support_status text not null default 'open',
  priority text not null default 'normal',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, support_key)
);

-- DocGuide
create table if not exists public.cmp_doc_guides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  guide_key text not null,
  guide_title text not null default '',
  guide_category text not null default 'getting_started',
  guide_summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, guide_key)
);

-- DocApiReference
create table if not exists public.cmp_doc_api_references (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  reference_key text not null,
  reference_name text not null default '',
  api_version text not null default 'v1',
  endpoint_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, reference_key)
);

-- DocVersion
create table if not exists public.cmp_doc_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  version_key text not null,
  version_name text not null default '',
  version_number text not null default '1.0.0',
  released_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- DemoOrganization
create table if not exists public.cmp_demo_organizations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  org_key text not null,
  org_name text not null default '',
  org_type text not null default 'sandbox',
  region text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, org_key)
);

-- DemoDataSet
create table if not exists public.cmp_demo_data_sets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  dataset_key text not null,
  dataset_name text not null default '',
  record_count integer not null default 0,
  dataset_type text not null default 'sample',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dataset_key)
);

-- DemoUser
create table if not exists public.cmp_demo_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  user_key text not null,
  user_name text not null default '',
  user_role text not null default 'viewer',
  user_email text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, user_key)
);

-- CompanyMetric
create table if not exists public.cmp_company_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  website_analytics_score numeric(5, 2) not null default 100,
  demo_request_count integer not null default 0,
  active_customer_count integer not null default 0,
  revenue_total numeric(14, 2) not null default 0,
  proposal_pending_count integer not null default 0,
  support_open_count integer not null default 0,
  platform_health_score numeric(5, 2) not null default 100,
  overall_company_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- CompanyHealth
create table if not exists public.cmp_company_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  website_status text not null default 'healthy',
  revenue_status text not null default 'healthy',
  support_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveKpi
create table if not exists public.cmp_executive_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_score numeric(5, 2) not null default 0,
  kpi_type text not null default 'executive',
  metric_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- CompanyFailure
create table if not exists public.cmp_company_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.cmp_company_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'website',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- Audit Logs
create table if not exists public.cmp_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  action text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create index if not exists idx_cmp_company_hubs_org on public.cmp_company_hubs(organization_id);
create index if not exists idx_cmp_brand_profiles_org on public.cmp_brand_profiles(organization_id);
create index if not exists idx_cmp_brand_profiles_hub on public.cmp_brand_profiles(hub_id);
create index if not exists idx_cmp_logo_assets_org on public.cmp_logo_assets(organization_id);
create index if not exists idx_cmp_logo_assets_hub on public.cmp_logo_assets(hub_id);
create index if not exists idx_cmp_theme_configs_org on public.cmp_theme_configs(organization_id);
create index if not exists idx_cmp_theme_configs_hub on public.cmp_theme_configs(hub_id);
create index if not exists idx_cmp_brand_assets_org on public.cmp_brand_assets(organization_id);
create index if not exists idx_cmp_brand_assets_hub on public.cmp_brand_assets(hub_id);
create index if not exists idx_cmp_website_pages_org on public.cmp_website_pages(organization_id);
create index if not exists idx_cmp_website_pages_hub on public.cmp_website_pages(hub_id);
create index if not exists idx_cmp_website_features_org on public.cmp_website_features(organization_id);
create index if not exists idx_cmp_website_features_hub on public.cmp_website_features(hub_id);
create index if not exists idx_cmp_website_sections_org on public.cmp_website_sections(organization_id);
create index if not exists idx_cmp_website_sections_hub on public.cmp_website_sections(hub_id);
create index if not exists idx_cmp_demo_requests_org on public.cmp_demo_requests(organization_id);
create index if not exists idx_cmp_demo_requests_hub on public.cmp_demo_requests(hub_id);
create index if not exists idx_cmp_pricing_plans_org on public.cmp_pricing_plans(organization_id);
create index if not exists idx_cmp_pricing_plans_hub on public.cmp_pricing_plans(hub_id);
create index if not exists idx_cmp_pricing_packages_org on public.cmp_pricing_packages(organization_id);
create index if not exists idx_cmp_pricing_packages_hub on public.cmp_pricing_packages(hub_id);
create index if not exists idx_cmp_module_pricing_org on public.cmp_module_pricing(organization_id);
create index if not exists idx_cmp_module_pricing_hub on public.cmp_module_pricing(hub_id);
create index if not exists idx_cmp_discount_rules_org on public.cmp_discount_rules(organization_id);
create index if not exists idx_cmp_discount_rules_hub on public.cmp_discount_rules(hub_id);
create index if not exists idx_cmp_proposals_org on public.cmp_proposals(organization_id);
create index if not exists idx_cmp_proposals_hub on public.cmp_proposals(hub_id);
create index if not exists idx_cmp_proposal_documents_org on public.cmp_proposal_documents(organization_id);
create index if not exists idx_cmp_proposal_documents_hub on public.cmp_proposal_documents(hub_id);
create index if not exists idx_cmp_proposal_contracts_org on public.cmp_proposal_contracts(organization_id);
create index if not exists idx_cmp_proposal_contracts_hub on public.cmp_proposal_contracts(hub_id);
create index if not exists idx_cmp_proposal_history_org on public.cmp_proposal_history(organization_id);
create index if not exists idx_cmp_proposal_history_hub on public.cmp_proposal_history(hub_id);
create index if not exists idx_cmp_portal_dashboards_org on public.cmp_portal_dashboards(organization_id);
create index if not exists idx_cmp_portal_dashboards_hub on public.cmp_portal_dashboards(hub_id);
create index if not exists idx_cmp_portal_subscriptions_org on public.cmp_portal_subscriptions(organization_id);
create index if not exists idx_cmp_portal_subscriptions_hub on public.cmp_portal_subscriptions(hub_id);
create index if not exists idx_cmp_portal_billing_org on public.cmp_portal_billing(organization_id);
create index if not exists idx_cmp_portal_billing_hub on public.cmp_portal_billing(hub_id);
create index if not exists idx_cmp_portal_support_org on public.cmp_portal_support(organization_id);
create index if not exists idx_cmp_portal_support_hub on public.cmp_portal_support(hub_id);
create index if not exists idx_cmp_doc_guides_org on public.cmp_doc_guides(organization_id);
create index if not exists idx_cmp_doc_guides_hub on public.cmp_doc_guides(hub_id);
create index if not exists idx_cmp_doc_api_references_org on public.cmp_doc_api_references(organization_id);
create index if not exists idx_cmp_doc_api_references_hub on public.cmp_doc_api_references(hub_id);
create index if not exists idx_cmp_doc_versions_org on public.cmp_doc_versions(organization_id);
create index if not exists idx_cmp_doc_versions_hub on public.cmp_doc_versions(hub_id);
create index if not exists idx_cmp_demo_organizations_org on public.cmp_demo_organizations(organization_id);
create index if not exists idx_cmp_demo_organizations_hub on public.cmp_demo_organizations(hub_id);
create index if not exists idx_cmp_demo_data_sets_org on public.cmp_demo_data_sets(organization_id);
create index if not exists idx_cmp_demo_data_sets_hub on public.cmp_demo_data_sets(hub_id);
create index if not exists idx_cmp_demo_users_org on public.cmp_demo_users(organization_id);
create index if not exists idx_cmp_demo_users_hub on public.cmp_demo_users(hub_id);
create index if not exists idx_cmp_company_metrics_org on public.cmp_company_metrics(organization_id);
create index if not exists idx_cmp_company_health_org on public.cmp_company_health(organization_id);
create index if not exists idx_cmp_executive_kpis_org on public.cmp_executive_kpis(organization_id);
create index if not exists idx_cmp_executive_kpis_hub on public.cmp_executive_kpis(hub_id);
create index if not exists idx_cmp_company_failures_org on public.cmp_company_failures(organization_id);
create index if not exists idx_cmp_company_failures_hub on public.cmp_company_failures(hub_id);
create index if not exists idx_cmp_audit_logs_org on public.cmp_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cmp_company_hubs','cmp_brand_profiles','cmp_logo_assets','cmp_theme_configs','cmp_brand_assets','cmp_website_pages','cmp_website_features','cmp_website_sections','cmp_demo_requests','cmp_pricing_plans','cmp_pricing_packages','cmp_module_pricing','cmp_discount_rules','cmp_proposals','cmp_proposal_documents','cmp_proposal_contracts','cmp_proposal_history','cmp_portal_dashboards','cmp_portal_subscriptions','cmp_portal_billing','cmp_portal_support','cmp_doc_guides','cmp_doc_api_references','cmp_doc_versions','cmp_demo_organizations','cmp_demo_data_sets','cmp_demo_users','cmp_company_metrics','cmp_company_health','cmp_executive_kpis','cmp_company_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.cmp_company_hubs enable row level security;
alter table public.cmp_brand_profiles enable row level security;
alter table public.cmp_logo_assets enable row level security;
alter table public.cmp_theme_configs enable row level security;
alter table public.cmp_brand_assets enable row level security;
alter table public.cmp_website_pages enable row level security;
alter table public.cmp_website_features enable row level security;
alter table public.cmp_website_sections enable row level security;
alter table public.cmp_demo_requests enable row level security;
alter table public.cmp_pricing_plans enable row level security;
alter table public.cmp_pricing_packages enable row level security;
alter table public.cmp_module_pricing enable row level security;
alter table public.cmp_discount_rules enable row level security;
alter table public.cmp_proposals enable row level security;
alter table public.cmp_proposal_documents enable row level security;
alter table public.cmp_proposal_contracts enable row level security;
alter table public.cmp_proposal_history enable row level security;
alter table public.cmp_portal_dashboards enable row level security;
alter table public.cmp_portal_subscriptions enable row level security;
alter table public.cmp_portal_billing enable row level security;
alter table public.cmp_portal_support enable row level security;
alter table public.cmp_doc_guides enable row level security;
alter table public.cmp_doc_api_references enable row level security;
alter table public.cmp_doc_versions enable row level security;
alter table public.cmp_demo_organizations enable row level security;
alter table public.cmp_demo_data_sets enable row level security;
alter table public.cmp_demo_users enable row level security;
alter table public.cmp_company_metrics enable row level security;
alter table public.cmp_company_health enable row level security;
alter table public.cmp_executive_kpis enable row level security;
alter table public.cmp_company_failures enable row level security;
alter table public.cmp_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'cmp_company_hubs','cmp_brand_profiles','cmp_logo_assets','cmp_theme_configs','cmp_brand_assets','cmp_website_pages','cmp_website_features','cmp_website_sections','cmp_demo_requests','cmp_pricing_plans','cmp_pricing_packages','cmp_module_pricing','cmp_discount_rules','cmp_proposals','cmp_proposal_documents','cmp_proposal_contracts','cmp_proposal_history','cmp_portal_dashboards','cmp_portal_subscriptions','cmp_portal_billing','cmp_portal_support','cmp_doc_guides','cmp_doc_api_references','cmp_doc_versions','cmp_demo_organizations','cmp_demo_data_sets','cmp_demo_users','cmp_company_metrics','cmp_company_health','cmp_executive_kpis','cmp_company_failures','cmp_audit_logs'
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
  ('cmp.view', 'View company foundation data', 'company_foundation'),
  ('cmp.manage', 'Manage brand, website, pricing, proposal, portal, documentation, demo, and dashboard outputs', 'company_foundation'),
  ('cmp.approve', 'Approve company foundation gates and publishing actions', 'company_foundation'),
  ('cmp.admin', 'Administer company foundation governance', 'company_foundation')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

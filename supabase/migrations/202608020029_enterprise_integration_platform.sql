-- V2 Program A Sprint 6: Enterprise Integration Platform

-- M1 Integration Hub
create table if not exists public.intg_integration_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

create table if not exists public.intg_connected_services (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  service_key text not null,
  service_name text not null,
  provider_type text not null default 'google_workspace',
  connector_status text not null default 'connected',
  credentials_ref text not null default '',
  config jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, service_key)
);

create table if not exists public.intg_connector_configs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connected_service_id uuid not null references public.intg_connected_services(id) on delete cascade,
  config_key text not null,
  config_name text not null,
  provider_type text not null default 'google_workspace',
  api_version text not null default 'v1',
  settings jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

create table if not exists public.intg_connector_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connected_service_id uuid not null references public.intg_connected_services(id) on delete cascade,
  health_key text not null,
  health_score numeric(5, 2) not null default 100,
  last_check_at timestamptz not null default now(),
  check_details jsonb not null default '{}'::jsonb,
  status text not null default 'healthy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, health_key)
);

-- M2 Payment Connectors
create table if not exists public.intg_payment_connectors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_key text not null,
  connector_name text not null,
  provider_type text not null default 'stripe',
  connector_status text not null default 'connected',
  api_version text not null default '2024-06-20',
  credentials_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, connector_key)
);

create table if not exists public.intg_payment_connector_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_payment_connectors(id) on delete cascade,
  health_key text not null,
  health_score numeric(5, 2) not null default 100,
  last_check_at timestamptz not null default now(),
  latency_ms integer not null default 0,
  status text not null default 'healthy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, health_key)
);

create table if not exists public.intg_payment_retry_queue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_payment_connectors(id) on delete cascade,
  queue_key text not null,
  transaction_ref text not null default '',
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  next_retry_at timestamptz,
  last_error text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

create table if not exists public.intg_payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_payment_connectors(id) on delete cascade,
  transaction_key text not null,
  external_id text not null default '',
  amount numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  provider_type text not null default 'stripe',
  transaction_status text not null default 'pending',
  processed_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, transaction_key)
);

-- M3 Accounting Connectors
create table if not exists public.intg_accounting_connectors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_key text not null,
  connector_name text not null,
  provider_type text not null default 'quickbooks',
  connector_status text not null default 'connected',
  api_version text not null default 'v3',
  credentials_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, connector_key)
);

create table if not exists public.intg_accounting_sync_status (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_accounting_connectors(id) on delete cascade,
  sync_key text not null,
  entity_type text not null default 'invoice',
  last_sync_at timestamptz,
  records_synced integer not null default 0,
  sync_status text not null default 'idle',
  error_message text not null default '',
  status text not null default 'idle',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, sync_key)
);

create table if not exists public.intg_export_mappings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_accounting_connectors(id) on delete cascade,
  mapping_key text not null,
  mapping_name text not null,
  source_entity text not null default 'order',
  target_entity text not null default 'invoice',
  field_mappings jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, mapping_key)
);

create table if not exists public.intg_accounting_exports (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_id uuid not null references public.intg_accounting_connectors(id) on delete cascade,
  export_key text not null,
  export_type text not null default 'invoice',
  record_count integer not null default 0,
  export_status text not null default 'pending',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, export_key)
);

-- M4 Public API Platform
create table if not exists public.intg_api_keys (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  key_name text not null,
  key_prefix text not null default '',
  key_hash text not null default '',
  api_version text not null default 'v1',
  expires_at timestamptz,
  last_used_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, key_name)
);

create table if not exists public.intg_api_scopes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  api_key_id uuid not null references public.intg_api_keys(id) on delete cascade,
  scope_key text not null,
  scope_name text not null,
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, api_key_id, scope_key)
);

create table if not exists public.intg_rate_limits (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  api_key_id uuid references public.intg_api_keys(id) on delete set null,
  limit_key text not null,
  limit_name text not null,
  rate_limit_rpm integer not null default 60,
  burst_limit integer not null default 10,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, limit_key)
);

create table if not exists public.intg_api_usage (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  api_key_id uuid references public.intg_api_keys(id) on delete set null,
  usage_key text not null,
  endpoint text not null default '',
  request_count integer not null default 0,
  error_count integer not null default 0,
  period_start timestamptz not null default now(),
  period_end timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, usage_key)
);

-- M5 Webhook Platform
create table if not exists public.intg_incoming_webhooks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  webhook_key text not null,
  webhook_name text not null,
  endpoint_path text not null default '',
  provider_type text not null default 'stripe',
  webhook_signing_key_hash text not null default '',
  is_enabled boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, webhook_key)
);

create table if not exists public.intg_outgoing_webhooks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  webhook_key text not null,
  webhook_name text not null,
  target_url text not null default '',
  event_types jsonb not null default '[]'::jsonb,
  webhook_signing_key_hash text not null default '',
  is_enabled boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, webhook_key)
);

create table if not exists public.intg_webhook_dead_letter (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  outgoing_webhook_id uuid references public.intg_outgoing_webhooks(id) on delete set null,
  dead_letter_key text not null,
  event_type text not null default '',
  payload jsonb not null default '{}'::jsonb,
  dead_letter_status text not null default 'pending',
  retry_count integer not null default 0,
  last_error text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dead_letter_key)
);

create table if not exists public.intg_webhook_delivery_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  outgoing_webhook_id uuid not null references public.intg_outgoing_webhooks(id) on delete cascade,
  delivery_key text not null,
  event_type text not null default '',
  http_status integer not null default 0,
  delivery_status text not null default 'pending',
  response_body text not null default '',
  delivered_at timestamptz,
  latency_ms integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, delivery_key)
);

-- M6 Integration Marketplace
create table if not exists public.intg_marketplace_connectors (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  connector_slug text not null,
  connector_name text not null,
  provider_type text not null default 'google_workspace',
  category text not null default 'productivity',
  description text not null default '',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, connector_slug)
);

create table if not exists public.intg_marketplace_installations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  marketplace_connector_id uuid not null references public.intg_marketplace_connectors(id) on delete cascade,
  installation_key text not null,
  connector_status text not null default 'installed',
  installed_at timestamptz not null default now(),
  config jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, installation_key)
);

create table if not exists public.intg_marketplace_compatibility (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  marketplace_connector_id uuid not null references public.intg_marketplace_connectors(id) on delete cascade,
  compatibility_key text not null,
  min_api_version text not null default 'v1',
  max_api_version text not null default 'v2',
  platform_requirements jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, compatibility_key)
);

create table if not exists public.intg_marketplace_versions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  marketplace_connector_id uuid not null references public.intg_marketplace_connectors(id) on delete cascade,
  version_key text not null,
  version_number text not null default '1.0.0',
  api_version text not null default 'v1',
  changelog text not null default '',
  published_at timestamptz not null default now(),
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, version_key)
);

-- M7 API Analytics
create table if not exists public.intg_api_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  analytics_key text not null,
  metric_date date not null default current_date,
  total_requests integer not null default 0,
  total_errors integer not null default 0,
  error_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

create table if not exists public.intg_latency_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  endpoint text not null default '',
  p50_ms integer not null default 0,
  p95_ms integer not null default 0,
  p99_ms integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metrics_key)
);

create table if not exists public.intg_webhook_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  analytics_key text not null,
  metric_date date not null default current_date,
  total_deliveries integer not null default 0,
  successful_deliveries integer not null default 0,
  failed_deliveries integer not null default 0,
  success_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

create table if not exists public.intg_usage_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  trend_key text not null,
  metric_date date not null default current_date,
  trend_direction text not null default 'stable',
  usage_delta numeric(10, 2) not null default 0,
  baseline_value numeric(12, 2) not null default 0,
  current_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- M8 Integration Dashboard
create table if not exists public.intg_integration_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  active_connectors integer not null default 0,
  total_api_calls integer not null default 0,
  total_webhook_deliveries integer not null default 0,
  overall_success_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

create table if not exists public.intg_integration_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 0,
  uptime_percent numeric(5, 2) not null default 100,
  active_connectors integer not null default 0,
  degraded_connectors integer not null default 0,
  disaster_recovery_mode boolean not null default false,
  summary text not null default '',
  status text not null default 'healthy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

create table if not exists public.intg_integration_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.intg_integration_hubs(id) on delete cascade,
  failure_key text not null,
  provider_type text not null default 'stripe',
  error_code text not null default '',
  error_message text not null default '',
  retry_count integer not null default 0,
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

create table if not exists public.intg_audit_logs (
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
create index if not exists idx_intg_integration_hubs_org on public.intg_integration_hubs(organization_id);
create index if not exists idx_intg_connected_services_org on public.intg_connected_services(organization_id);
create index if not exists idx_intg_connected_services_hub on public.intg_connected_services(hub_id);
create index if not exists idx_intg_connector_configs_org on public.intg_connector_configs(organization_id);
create index if not exists idx_intg_connector_configs_hub on public.intg_connector_configs(hub_id);
create index if not exists idx_intg_connector_health_org on public.intg_connector_health(organization_id);
create index if not exists idx_intg_connector_health_hub on public.intg_connector_health(hub_id);
create index if not exists idx_intg_payment_connectors_org on public.intg_payment_connectors(organization_id);
create index if not exists idx_intg_payment_connectors_hub on public.intg_payment_connectors(hub_id);
create index if not exists idx_intg_payment_connector_health_org on public.intg_payment_connector_health(organization_id);
create index if not exists idx_intg_payment_connector_health_hub on public.intg_payment_connector_health(hub_id);
create index if not exists idx_intg_payment_retry_queue_org on public.intg_payment_retry_queue(organization_id);
create index if not exists idx_intg_payment_retry_queue_hub on public.intg_payment_retry_queue(hub_id);
create index if not exists idx_intg_payment_transactions_org on public.intg_payment_transactions(organization_id);
create index if not exists idx_intg_payment_transactions_hub on public.intg_payment_transactions(hub_id);
create index if not exists idx_intg_accounting_connectors_org on public.intg_accounting_connectors(organization_id);
create index if not exists idx_intg_accounting_connectors_hub on public.intg_accounting_connectors(hub_id);
create index if not exists idx_intg_accounting_sync_status_org on public.intg_accounting_sync_status(organization_id);
create index if not exists idx_intg_accounting_sync_status_hub on public.intg_accounting_sync_status(hub_id);
create index if not exists idx_intg_export_mappings_org on public.intg_export_mappings(organization_id);
create index if not exists idx_intg_export_mappings_hub on public.intg_export_mappings(hub_id);
create index if not exists idx_intg_accounting_exports_org on public.intg_accounting_exports(organization_id);
create index if not exists idx_intg_accounting_exports_hub on public.intg_accounting_exports(hub_id);
create index if not exists idx_intg_api_keys_org on public.intg_api_keys(organization_id);
create index if not exists idx_intg_api_keys_hub on public.intg_api_keys(hub_id);
create index if not exists idx_intg_api_scopes_org on public.intg_api_scopes(organization_id);
create index if not exists idx_intg_api_scopes_hub on public.intg_api_scopes(hub_id);
create index if not exists idx_intg_rate_limits_org on public.intg_rate_limits(organization_id);
create index if not exists idx_intg_rate_limits_hub on public.intg_rate_limits(hub_id);
create index if not exists idx_intg_api_usage_org on public.intg_api_usage(organization_id);
create index if not exists idx_intg_api_usage_hub on public.intg_api_usage(hub_id);
create index if not exists idx_intg_incoming_webhooks_org on public.intg_incoming_webhooks(organization_id);
create index if not exists idx_intg_incoming_webhooks_hub on public.intg_incoming_webhooks(hub_id);
create index if not exists idx_intg_outgoing_webhooks_org on public.intg_outgoing_webhooks(organization_id);
create index if not exists idx_intg_outgoing_webhooks_hub on public.intg_outgoing_webhooks(hub_id);
create index if not exists idx_intg_webhook_dead_letter_org on public.intg_webhook_dead_letter(organization_id);
create index if not exists idx_intg_webhook_dead_letter_hub on public.intg_webhook_dead_letter(hub_id);
create index if not exists idx_intg_webhook_delivery_logs_org on public.intg_webhook_delivery_logs(organization_id);
create index if not exists idx_intg_webhook_delivery_logs_hub on public.intg_webhook_delivery_logs(hub_id);
create index if not exists idx_intg_marketplace_connectors_org on public.intg_marketplace_connectors(organization_id);
create index if not exists idx_intg_marketplace_connectors_hub on public.intg_marketplace_connectors(hub_id);
create index if not exists idx_intg_marketplace_installations_org on public.intg_marketplace_installations(organization_id);
create index if not exists idx_intg_marketplace_installations_hub on public.intg_marketplace_installations(hub_id);
create index if not exists idx_intg_marketplace_compatibility_org on public.intg_marketplace_compatibility(organization_id);
create index if not exists idx_intg_marketplace_compatibility_hub on public.intg_marketplace_compatibility(hub_id);
create index if not exists idx_intg_marketplace_versions_org on public.intg_marketplace_versions(organization_id);
create index if not exists idx_intg_marketplace_versions_hub on public.intg_marketplace_versions(hub_id);
create index if not exists idx_intg_api_analytics_org on public.intg_api_analytics(organization_id);
create index if not exists idx_intg_api_analytics_hub on public.intg_api_analytics(hub_id);
create index if not exists idx_intg_latency_metrics_org on public.intg_latency_metrics(organization_id);
create index if not exists idx_intg_latency_metrics_hub on public.intg_latency_metrics(hub_id);
create index if not exists idx_intg_webhook_analytics_org on public.intg_webhook_analytics(organization_id);
create index if not exists idx_intg_webhook_analytics_hub on public.intg_webhook_analytics(hub_id);
create index if not exists idx_intg_usage_trends_org on public.intg_usage_trends(organization_id);
create index if not exists idx_intg_usage_trends_hub on public.intg_usage_trends(hub_id);
create index if not exists idx_intg_integration_metrics_org on public.intg_integration_metrics(organization_id);
create index if not exists idx_intg_integration_health_org on public.intg_integration_health(organization_id);
create index if not exists idx_intg_integration_failures_org on public.intg_integration_failures(organization_id);
create index if not exists idx_intg_integration_failures_hub on public.intg_integration_failures(hub_id);
create index if not exists idx_intg_audit_logs_org on public.intg_audit_logs(organization_id);

-- updated_at triggers
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'intg_integration_hubs','intg_connected_services','intg_connector_configs','intg_connector_health',
    'intg_payment_connectors','intg_payment_connector_health','intg_payment_retry_queue','intg_payment_transactions',
    'intg_accounting_connectors','intg_accounting_sync_status','intg_export_mappings','intg_accounting_exports',
    'intg_api_keys','intg_api_scopes','intg_rate_limits','intg_api_usage',
    'intg_incoming_webhooks','intg_outgoing_webhooks','intg_webhook_dead_letter','intg_webhook_delivery_logs',
    'intg_marketplace_connectors','intg_marketplace_installations','intg_marketplace_compatibility','intg_marketplace_versions',
    'intg_api_analytics','intg_latency_metrics','intg_webhook_analytics','intg_usage_trends',
    'intg_integration_metrics','intg_integration_health','intg_integration_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

-- RLS
alter table public.intg_integration_hubs enable row level security;
alter table public.intg_connected_services enable row level security;
alter table public.intg_connector_configs enable row level security;
alter table public.intg_connector_health enable row level security;
alter table public.intg_payment_connectors enable row level security;
alter table public.intg_payment_connector_health enable row level security;
alter table public.intg_payment_retry_queue enable row level security;
alter table public.intg_payment_transactions enable row level security;
alter table public.intg_accounting_connectors enable row level security;
alter table public.intg_accounting_sync_status enable row level security;
alter table public.intg_export_mappings enable row level security;
alter table public.intg_accounting_exports enable row level security;
alter table public.intg_api_keys enable row level security;
alter table public.intg_api_scopes enable row level security;
alter table public.intg_rate_limits enable row level security;
alter table public.intg_api_usage enable row level security;
alter table public.intg_incoming_webhooks enable row level security;
alter table public.intg_outgoing_webhooks enable row level security;
alter table public.intg_webhook_dead_letter enable row level security;
alter table public.intg_webhook_delivery_logs enable row level security;
alter table public.intg_marketplace_connectors enable row level security;
alter table public.intg_marketplace_installations enable row level security;
alter table public.intg_marketplace_compatibility enable row level security;
alter table public.intg_marketplace_versions enable row level security;
alter table public.intg_api_analytics enable row level security;
alter table public.intg_latency_metrics enable row level security;
alter table public.intg_webhook_analytics enable row level security;
alter table public.intg_usage_trends enable row level security;
alter table public.intg_integration_metrics enable row level security;
alter table public.intg_integration_health enable row level security;
alter table public.intg_integration_failures enable row level security;
alter table public.intg_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'intg_integration_hubs','intg_connected_services','intg_connector_configs','intg_connector_health',
    'intg_payment_connectors','intg_payment_connector_health','intg_payment_retry_queue','intg_payment_transactions',
    'intg_accounting_connectors','intg_accounting_sync_status','intg_export_mappings','intg_accounting_exports',
    'intg_api_keys','intg_api_scopes','intg_rate_limits','intg_api_usage',
    'intg_incoming_webhooks','intg_outgoing_webhooks','intg_webhook_dead_letter','intg_webhook_delivery_logs',
    'intg_marketplace_connectors','intg_marketplace_installations','intg_marketplace_compatibility','intg_marketplace_versions',
    'intg_api_analytics','intg_latency_metrics','intg_webhook_analytics','intg_usage_trends',
    'intg_integration_metrics','intg_integration_health','intg_integration_failures','intg_audit_logs'
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
  ('intg.view', 'View enterprise integration platform data', 'enterprise_integration_platform'),
  ('intg.manage', 'Manage connectors, API keys, webhooks, and integration delivery', 'enterprise_integration_platform'),
  ('intg.approve', 'Approve marketplace installations and integration configurations', 'enterprise_integration_platform'),
  ('intg.admin', 'Administer enterprise integration platform governance and configuration', 'enterprise_integration_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

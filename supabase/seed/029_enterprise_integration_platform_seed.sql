insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a329', '11111111-1111-1111-1111-111111111111', 'Enterprise Integration Platform Orchestrator', 'enterprise_integration_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["integration_hub","payment_connectors","accounting_connectors","public_api_platform","webhook_platform","integration_marketplace","api_analytics","integration_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a529', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a329', 'northstar-integrations-001', 'enterprise_integration_platform', 'integration_hub', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', '{"objective":"enterprise integration platform for northstar-integrations hub"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 Integration Hub
insert into public.intg_integration_hubs (id, organization_id, hub_key, hub_name, environment, status)
values
  ('ff01ff01-ff01-ff01-ff01-ff01ff010101', '11111111-1111-1111-1111-111111111111', 'northstar-integrations', 'Northstar Integration Hub', 'production', 'active')
on conflict (id) do nothing;

insert into public.intg_connected_services (id, organization_id, hub_id, service_key, service_name, provider_type, connector_status, credentials_ref, config, status)
values
  ('ff02ff02-ff02-ff02-ff02-ff02ff020201', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'svc-google-workspace', 'Google Workspace', 'google_workspace', 'connected', 'vault://google/northstar', '{"domain":"northstar.example","scopes":["admin.directory.user"]}'::jsonb, 'active'),
  ('ff02ff02-ff02-ff02-ff02-ff02ff020202', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'svc-stripe', 'Stripe Payments', 'stripe', 'connected', 'vault://stripe/northstar', '{"mode":"live","webhook_enabled":true}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_connector_configs (id, organization_id, hub_id, connected_service_id, config_key, config_name, provider_type, api_version, settings, status)
values
  ('ff03ff03-ff03-ff03-ff03-ff03ff030301', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff02ff02-ff02-ff02-ff02-ff02ff020201', 'cfg-google-admin', 'Google Admin SDK Config', 'google_workspace', 'directory_v1', '{"sync_interval_minutes":15}'::jsonb, 'active'),
  ('ff03ff03-ff03-ff03-ff03-ff03ff030302', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff02ff02-ff02-ff02-ff02-ff02ff020202', 'cfg-stripe-api', 'Stripe API Config', 'stripe', '2024-06-20', '{"webhook_events":["payment_intent.succeeded","charge.failed"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_connector_health (id, organization_id, hub_id, connected_service_id, health_key, health_score, last_check_at, check_details, status)
values
  ('ff04ff04-ff04-ff04-ff04-ff04ff040401', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff02ff02-ff02-ff02-ff02-ff02ff020201', 'health-google-0802', 98.50, '2026-08-02 12:00:00+00', '{"latency_ms":120,"auth_valid":true}'::jsonb, 'healthy'),
  ('ff04ff04-ff04-ff04-ff04-ff04ff040402', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff02ff02-ff02-ff02-ff02-ff02ff020202', 'health-stripe-0802', 99.00, '2026-08-02 12:00:00+00', '{"latency_ms":85,"auth_valid":true}'::jsonb, 'healthy')
on conflict (id) do nothing;

-- M2 Payment Connectors
insert into public.intg_payment_connectors (id, organization_id, hub_id, connector_key, connector_name, provider_type, connector_status, api_version, credentials_ref, status)
values
  ('ff05ff05-ff05-ff05-ff05-ff05ff050501', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'pay-stripe-primary', 'Stripe Primary', 'stripe', 'connected', '2024-06-20', 'vault://stripe/northstar', 'active'),
  ('ff05ff05-ff05-ff05-ff05-ff05ff050502', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'pay-razorpay-secondary', 'Razorpay Secondary', 'razorpay', 'connected', 'v1', 'vault://razorpay/northstar', 'active')
on conflict (id) do nothing;

insert into public.intg_payment_connector_health (id, organization_id, hub_id, connector_id, health_key, health_score, last_check_at, latency_ms, status)
values
  ('ff06ff06-ff06-ff06-ff06-ff06ff060601', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff05ff05-ff05-ff05-ff05-ff05ff050501', 'pay-health-stripe-0802', 99.00, '2026-08-02 12:00:00+00', 85, 'healthy')
on conflict (id) do nothing;

insert into public.intg_payment_retry_queue (id, organization_id, hub_id, connector_id, queue_key, transaction_ref, retry_count, max_retries, next_retry_at, last_error, status)
values
  ('ff07ff07-ff07-ff07-ff07-ff07ff070701', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff05ff05-ff05-ff05-ff05-ff05ff050501', 'retry-charge-0802', 'pi_3NxRetry0802', 1, 3, '2026-08-02 12:05:00+00', 'card_declined', 'pending')
on conflict (id) do nothing;

insert into public.intg_payment_transactions (id, organization_id, hub_id, connector_id, transaction_key, external_id, amount, currency, provider_type, transaction_status, processed_at, status)
values
  ('ff08ff08-ff08-ff08-ff08-ff08ff080801', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff05ff05-ff05-ff05-ff05-ff05ff050501', 'txn-welcome-0802', 'pi_3NxSuccess0802', 99.00, 'USD', 'stripe', 'succeeded', '2026-08-02 09:00:00+00', 'completed'),
  ('ff08ff08-ff08-ff08-ff08-ff08ff080802', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff05ff05-ff05-ff05-ff05-ff05ff050501', 'txn-retry-0802', 'pi_3NxRetry0802', 49.00, 'USD', 'stripe', 'failed', null, 'failed')
on conflict (id) do nothing;

-- M3 Accounting Connectors
insert into public.intg_accounting_connectors (id, organization_id, hub_id, connector_key, connector_name, provider_type, connector_status, api_version, credentials_ref, status)
values
  ('ff09ff09-ff09-ff09-ff09-ff09ff090901', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'acct-quickbooks', 'QuickBooks Online', 'quickbooks', 'connected', 'v3', 'vault://quickbooks/northstar', 'active')
on conflict (id) do nothing;

insert into public.intg_accounting_sync_status (id, organization_id, hub_id, connector_id, sync_key, entity_type, last_sync_at, records_synced, sync_status, status)
values
  ('ff10ff10-ff10-ff10-ff10-ff10ff101001', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff09ff09-ff09-ff09-ff09-ff09ff090901', 'sync-invoices-0802', 'invoice', '2026-08-02 08:00:00+00', 42, 'completed', 'completed')
on conflict (id) do nothing;

insert into public.intg_export_mappings (id, organization_id, hub_id, connector_id, mapping_key, mapping_name, source_entity, target_entity, field_mappings, status)
values
  ('ff11ff11-ff11-ff11-ff11-ff11ff111101', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff09ff09-ff09-ff09-ff09-ff09ff090901', 'map-order-invoice', 'Order to Invoice Mapping', 'order', 'invoice', '{"order_id":"DocNumber","total":"TotalAmt"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_accounting_exports (id, organization_id, hub_id, connector_id, export_key, export_type, record_count, export_status, started_at, completed_at, status)
values
  ('ff12ff12-ff12-ff12-ff12-ff12ff121201', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff09ff09-ff09-ff09-ff09-ff09ff090901', 'export-invoices-0802', 'invoice', 42, 'completed', '2026-08-02 08:00:00+00', '2026-08-02 08:05:00+00', 'completed')
on conflict (id) do nothing;

-- M4 Public API Platform
insert into public.intg_api_keys (id, organization_id, hub_id, key_name, key_prefix, key_hash, api_version, last_used_at, status)
values
  ('ff13ff13-ff13-ff13-ff13-ff13ff131301', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'northstar-prod-key', 'nsk_live_', 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef', 'v1', '2026-08-02 11:30:00+00', 'active'),
  ('ff13ff13-ff13-ff13-ff13-ff13ff131302', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'northstar-readonly-key', 'nsk_ro_', 'sha256:fedcba0987654321fedcba0987654321fedcba09', 'v1', '2026-08-02 10:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.intg_api_scopes (id, organization_id, hub_id, api_key_id, scope_key, scope_name, permissions, status)
values
  ('ff14ff14-ff14-ff14-ff14-ff14ff141401', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131301', 'scope-integrations-read', 'Integrations Read', '["integrations:read","connectors:read","webhooks:read"]'::jsonb, 'active'),
  ('ff14ff14-ff14-ff14-ff14-ff14ff141402', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131301', 'scope-integrations-write', 'Integrations Write', '["integrations:write","connectors:write","webhooks:write"]'::jsonb, 'active'),
  ('ff14ff14-ff14-ff14-ff14-ff14ff141403', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131302', 'scope-readonly', 'Read Only', '["integrations:read"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_rate_limits (id, organization_id, hub_id, api_key_id, limit_key, limit_name, rate_limit_rpm, burst_limit, status)
values
  ('ff15ff15-ff15-ff15-ff15-ff15ff151501', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131301', 'limit-prod-standard', 'Production Standard', 120, 20, 'active'),
  ('ff15ff15-ff15-ff15-ff15-ff15ff151502', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131302', 'limit-readonly', 'Read Only Limit', 60, 10, 'active')
on conflict (id) do nothing;

insert into public.intg_api_usage (id, organization_id, hub_id, api_key_id, usage_key, endpoint, request_count, error_count, period_start, status)
values
  ('ff16ff16-ff16-ff16-ff16-ff16ff161601', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff13ff13-ff13-ff13-ff13-ff13ff131301', 'usage-connectors-0802', '/v1/connectors', 156, 2, '2026-08-02 00:00:00+00', 'active')
on conflict (id) do nothing;

-- M5 Webhook Platform
insert into public.intg_incoming_webhooks (id, organization_id, hub_id, webhook_key, webhook_name, endpoint_path, provider_type, webhook_signing_key_hash, is_enabled, status)
values
  ('ff17ff17-ff17-ff17-ff17-ff17ff171701', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'wh-in-stripe', 'Stripe Incoming Webhook', '/webhooks/stripe', 'stripe', 'sha256:whsec_stripe_northstar_hash', true, 'active')
on conflict (id) do nothing;

insert into public.intg_outgoing_webhooks (id, organization_id, hub_id, webhook_key, webhook_name, target_url, event_types, webhook_signing_key_hash, is_enabled, status)
values
  ('ff18ff18-ff18-ff18-ff18-ff18ff181801', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'wh-out-integration-events', 'Integration Event Dispatcher', 'https://api.northstar.example/webhooks/integration-events', '["integration.connected","payment.succeeded","payment.failed"]'::jsonb, 'sha256:whsec_outbound_northstar_hash', true, 'active')
on conflict (id) do nothing;

insert into public.intg_webhook_dead_letter (id, organization_id, hub_id, outgoing_webhook_id, dead_letter_key, event_type, payload, dead_letter_status, retry_count, last_error, status)
values
  ('ff19ff19-ff19-ff19-ff19-ff19ff191901', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff18ff18-ff18-ff18-ff18-ff18ff181801', 'dl-payment-failed-0802', 'payment.failed', '{"transaction_id":"pi_3NxRetry0802","amount":49.00}'::jsonb, 'pending', 2, '503 Service Unavailable', 'pending')
on conflict (id) do nothing;

insert into public.intg_webhook_delivery_logs (id, organization_id, hub_id, outgoing_webhook_id, delivery_key, event_type, http_status, delivery_status, response_body, delivered_at, latency_ms, status)
values
  ('ff20ff20-ff20-ff20-ff20-ff20ff202001', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff18ff18-ff18-ff18-ff18-ff18ff181801', 'delivery-connected-0802', 'integration.connected', 200, 'delivered', '{"received":true}', '2026-08-02 09:00:05+00', 120, 'completed'),
  ('ff20ff20-ff20-ff20-ff20-ff20ff202002', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff18ff18-ff18-ff18-ff18-ff18ff181801', 'delivery-payment-0802', 'payment.succeeded', 200, 'delivered', '{"received":true,"processed":true}', '2026-08-02 09:00:10+00', 95, 'completed'),
  ('ff20ff20-ff20-ff20-ff20-ff20ff202003', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff18ff18-ff18-ff18-ff18-ff18ff181801', 'delivery-failed-0802', 'payment.failed', 503, 'failed', 'Service Unavailable', '2026-08-02 10:00:00+00', 5000, 'failed')
on conflict (id) do nothing;

-- M6 Integration Marketplace
insert into public.intg_marketplace_connectors (id, organization_id, hub_id, connector_slug, connector_name, provider_type, category, description, status)
values
  ('ff21ff21-ff21-ff21-ff21-ff21ff212101', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'google-workspace', 'Google Workspace Connector', 'google_workspace', 'productivity', 'Sync users and groups from Google Workspace', 'published'),
  ('ff21ff21-ff21-ff21-ff21-ff21ff212102', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'microsoft-365', 'Microsoft 365 Connector', 'microsoft_365', 'productivity', 'Sync users and calendar from Microsoft 365', 'published')
on conflict (id) do nothing;

insert into public.intg_marketplace_installations (id, organization_id, hub_id, marketplace_connector_id, installation_key, connector_status, installed_at, config, status)
values
  ('ff22ff22-ff22-ff22-ff22-ff22ff222201', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff21ff21-ff21-ff21-ff21-ff21ff212101', 'install-google-0801', 'installed', '2026-08-01 10:00:00+00', '{"sync_users":true,"sync_groups":true}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_marketplace_compatibility (id, organization_id, hub_id, marketplace_connector_id, compatibility_key, min_api_version, max_api_version, platform_requirements, status)
values
  ('ff23ff23-ff23-ff23-ff23-ff23ff232301', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff21ff21-ff21-ff21-ff21-ff21ff212101', 'compat-google-v1', 'v1', 'v2', '{"min_platform_version":"2.0"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.intg_marketplace_versions (id, organization_id, hub_id, marketplace_connector_id, version_key, version_number, api_version, changelog, published_at, status)
values
  ('ff24ff24-ff24-ff24-ff24-ff24ff242401', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'ff21ff21-ff21-ff21-ff21-ff21ff212101', 'ver-google-1-0-0', '1.0.0', 'v1', 'Initial release with user and group sync', '2026-08-01 10:00:00+00', 'published')
on conflict (id) do nothing;

-- M7 API Analytics
insert into public.intg_api_analytics (id, organization_id, hub_id, analytics_key, metric_date, total_requests, total_errors, error_rate, status)
values
  ('ff25ff25-ff25-ff25-ff25-ff25ff252501', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'analytics-api-0802', '2026-08-02', 156, 2, 1.28, 'active')
on conflict (id) do nothing;

insert into public.intg_latency_metrics (id, organization_id, hub_id, metrics_key, metric_date, endpoint, p50_ms, p95_ms, p99_ms, status)
values
  ('ff26ff26-ff26-ff26-ff26-ff26ff262601', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'latency-connectors-0802', '2026-08-02', '/v1/connectors', 45, 120, 250, 'active')
on conflict (id) do nothing;

insert into public.intg_webhook_analytics (id, organization_id, hub_id, analytics_key, metric_date, total_deliveries, successful_deliveries, failed_deliveries, success_rate, status)
values
  ('ff27ff27-ff27-ff27-ff27-ff27ff272701', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'analytics-webhooks-0802', '2026-08-02', 3, 2, 1, 66.67, 'active')
on conflict (id) do nothing;

insert into public.intg_usage_trends (id, organization_id, hub_id, trend_key, metric_date, trend_direction, usage_delta, baseline_value, current_value, status)
values
  ('ff28ff28-ff28-ff28-ff28-ff28ff282801', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'trend-api-0802', '2026-08-02', 'increasing', 12.50, 138.00, 156.00, 'active')
on conflict (id) do nothing;

-- M8 Integration Dashboard (org-only tables)
insert into public.intg_integration_metrics (id, organization_id, metrics_key, metric_date, active_connectors, total_api_calls, total_webhook_deliveries, overall_success_rate, status)
values
  ('ff29ff29-ff29-ff29-ff29-ff29ff292901', '11111111-1111-1111-1111-111111111111', 'intg-daily-0802', '2026-08-02', 4, 156, 3, 98.72, 'active')
on conflict (id) do nothing;

insert into public.intg_integration_health (id, organization_id, health_key, health_date, overall_score, uptime_percent, active_connectors, degraded_connectors, disaster_recovery_mode, summary, status)
values
  ('ff30ff30-ff30-ff30-ff30-ff30ff303001', '11111111-1111-1111-1111-111111111111', 'health-daily-0802', '2026-08-02', 97.50, 99.98, 4, 0, false, 'Integration platform healthy — 4 active connectors, 1 webhook delivery failure under retry', 'healthy')
on conflict (id) do nothing;

insert into public.intg_integration_failures (id, organization_id, hub_id, failure_key, provider_type, error_code, error_message, retry_count, failed_at, status)
values
  ('ff31ff31-ff31-ff31-ff31-ff31ff313101', '11111111-1111-1111-1111-111111111111', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'failure-webhook-0802', 'stripe', '503', 'Webhook delivery failed — 503 Service Unavailable', 2, '2026-08-02 10:00:00+00', 'open')
on conflict (id) do nothing;

insert into public.intg_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('ff000001-ff00-ff00-ff00-ff0000000001', '11111111-1111-1111-1111-111111111111', 'integration_hub', 'ff01ff01-ff01-ff01-ff01-ff01ff010101', 'create', 'Northstar integration hub provisioned in production environment', '{"hub_key":"northstar-integrations","environment":"production"}'::jsonb, 'standard'),
  ('ff000002-ff00-ff00-ff00-ff0000000002', '11111111-1111-1111-1111-111111111111', 'connected_service', 'ff02ff02-ff02-ff02-ff02-ff02ff020201', 'connect', 'Google Workspace connected with admin directory scope', '{"provider_type":"google_workspace","connector_status":"connected"}'::jsonb, 'elevated'),
  ('ff000003-ff00-ff00-ff00-ff0000000003', '11111111-1111-1111-1111-111111111111', 'webhook_delivery_log', 'ff20ff20-ff20-ff20-ff20-ff20ff202003', 'fail', 'Webhook delivery failed for payment.failed event — 503 Service Unavailable', '{"delivery_status":"failed","http_status":503,"event_type":"payment.failed"}'::jsonb, 'restricted')
on conflict (id) do nothing;

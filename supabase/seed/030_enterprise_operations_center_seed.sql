insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a330', '11111111-1111-1111-1111-111111111111', 'Enterprise Operations Center Orchestrator', 'enterprise_operations_center', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["system_health","background_jobs","event_bus","alert_management","feature_flags","configuration_center","platform_diagnostics","operations_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a530', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a330', 'northstar-operations-001', 'enterprise_operations_center', 'operations_center', '00110011-0011-0011-0011-001100110101', '{"objective":"enterprise operations center for northstar platform"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 System Health Center
insert into public.eoc_operations_centers (id, organization_id, center_key, center_name, environment, status)
values ('00110011-0011-0011-0011-001100110101', '11111111-1111-1111-1111-111111111111', 'northstar-operations', 'Northstar Operations Center', 'production', 'active')
on conflict (id) do nothing;

insert into public.eoc_overall_health (id, organization_id, center_id, health_key, health_type, health_score, status)
values
  ('00120012-0012-0012-0012-001200120201', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-overall-0803', 'overall', 98.50, 'healthy'),
  ('00120012-0012-0012-0012-001200120202', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-storage-0803', 'storage', 97.00, 'healthy'),
  ('00120012-0012-0012-0012-001200120203', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-ai-0803', 'ai', 99.00, 'healthy'),
  ('00120012-0012-0012-0012-001200120204', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-api-0803', 'api', 98.00, 'healthy'),
  ('00120012-0012-0012-0012-001200120205', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-integration-0803', 'integration', 96.50, 'healthy'),
  ('00120012-0012-0012-0012-001200120206', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'health-queue-0803', 'queue', 98.00, 'healthy')
on conflict (id) do nothing;

insert into public.eoc_module_health (id, organization_id, center_id, health_key, module_name, health_score, status)
values ('00130013-0013-0013-0013-001300130301', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'mod-crm-0803', 'CRM', 99.00, 'healthy')
on conflict (id) do nothing;

insert into public.eoc_database_health (id, organization_id, center_id, health_key, connection_pool_used, health_score, status)
values ('00140014-0014-0014-0014-001400140401', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'db-primary-0803', 12, 99.50, 'healthy')
on conflict (id) do nothing;

-- M2 Background Job Platform
insert into public.eoc_job_schedulers (id, organization_id, center_id, scheduler_key, scheduler_name, cron_expression, worker_pool_size, scheduler_status, status)
values ('00160016-0016-0016-0016-001600160601', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'sched-daily-sync', 'Daily Sync Scheduler', '0 2 * * *', 8, 'active', 'active')
on conflict (id) do nothing;

insert into public.eoc_recurring_jobs (id, organization_id, center_id, job_key, job_name, cron_expression, job_status, status)
values ('00170017-0017-0017-0017-001700170701', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'job-health-check', 'Health Check Job', '*/15 * * * *', 'active', 'active')
on conflict (id) do nothing;

insert into public.eoc_job_retry_queue (id, organization_id, center_id, queue_key, job_ref, retry_count, max_retries, priority, last_error, status)
values ('00180018-0018-0018-0018-001800180801', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'retry-job-0803', 'job-health-check', 1, 3, 5, 'timeout', 'pending')
on conflict (id) do nothing;

insert into public.eoc_job_dead_letter (id, organization_id, center_id, dead_letter_key, job_ref, error_message, dead_letter_status, status)
values ('00190019-0019-0019-0019-001900190901', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'dlq-job-0803', 'job-export-failed', 'connection refused', 'pending', 'failed')
on conflict (id) do nothing;

-- M3 Event Bus
insert into public.eoc_platform_events (id, organization_id, center_id, event_key, event_type, event_name, event_status, status)
values ('00200020-0020-0020-0020-002000200a01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'evt-platform-startup', 'platform', 'Platform Startup', 'published', 'active')
on conflict (id) do nothing;

insert into public.eoc_business_events (id, organization_id, center_id, event_key, event_type, event_name, event_status, status)
values ('00210021-0021-0021-0021-002100210b01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'evt-customer-signup', 'customer', 'Customer Signup', 'published', 'active')
on conflict (id) do nothing;

insert into public.eoc_event_subscriptions (id, organization_id, center_id, subscription_key, event_type, subscriber_ref, subscription_status, status)
values ('00220022-0022-0022-0022-002200220c01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'sub-alerts-critical', 'platform', 'alert-manager', 'active', 'active')
on conflict (id) do nothing;

insert into public.eoc_event_replays (id, organization_id, center_id, replay_key, event_type, replay_status, events_replayed, status)
values ('00230023-0023-0023-0023-002300230d01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'replay-0803-am', 'audit', 'completed', 42, 'completed')
on conflict (id) do nothing;

-- M4 Alert Management
insert into public.eoc_alerts (id, organization_id, center_id, alert_key, alert_title, alert_severity, alert_message, alert_status, status)
values ('00240024-0024-0024-0024-002400240e01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'alert-queue-depth', 'Queue Depth Warning', 'warning', 'Job queue depth exceeded threshold', 'open', 'active')
on conflict (id) do nothing;

insert into public.eoc_escalation_rules (id, organization_id, center_id, rule_key, rule_name, alert_severity, escalation_delay_minutes, status)
values ('00250025-0025-0025-0025-002500250f01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'esc-critical-15m', 'Critical 15min Escalation', 'critical', 15, 'active')
on conflict (id) do nothing;

insert into public.eoc_alert_acknowledgements (id, organization_id, center_id, ack_key, acknowledged_by, ack_status, status)
values ('00260026-0026-0026-0026-002600261001', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'ack-alert-0803', 'ops-lead', 'acknowledged', 'active')
on conflict (id) do nothing;

insert into public.eoc_maintenance_windows (id, organization_id, center_id, window_key, window_name, window_status, status)
values ('00270027-0027-0027-0027-002700271101', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'maint-weekend', 'Weekend Maintenance', 'scheduled', 'active')
on conflict (id) do nothing;

-- M5 Feature Flag Platform
insert into public.eoc_global_flags (id, organization_id, center_id, flag_key, flag_name, enabled, rollout_percent, status)
values ('00280028-0028-0028-0028-002800281201', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'flag-new-dashboard', 'New Dashboard UI', true, 50, 'active')
on conflict (id) do nothing;

insert into public.eoc_tenant_flags (id, organization_id, center_id, flag_key, flag_name, enabled, tenant_ref, status)
values ('00290029-0029-0029-0029-002900291301', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'flag-beta-analytics', 'Beta Analytics', true, 'northstar', 'active')
on conflict (id) do nothing;

insert into public.eoc_beta_features (id, organization_id, center_id, feature_key, feature_name, beta_status, enrolled_tenants, status)
values ('002a002a-002a-002a-002a-002a002a1401', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'beta-ai-insights', 'AI Insights Beta', 'beta', 5, 'active')
on conflict (id) do nothing;

insert into public.eoc_rollout_configs (id, organization_id, center_id, rollout_key, flag_key, rollout_percent, rollout_status, status)
values ('002b002b-002b-002b-002b-002b002b1501', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'rollout-dashboard', 'flag-new-dashboard', 50, 'active', 'active')
on conflict (id) do nothing;

-- M6 Configuration Center
insert into public.eoc_platform_configs (id, organization_id, center_id, config_key, config_name, environment_profile, approval_status, status)
values ('002c002c-002c-002c-002c-002c002c1601', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'cfg-log-level', 'Platform Log Level', 'production', 'approved', 'active')
on conflict (id) do nothing;

insert into public.eoc_tenant_configs (id, organization_id, center_id, config_key, config_name, tenant_ref, approval_status, status)
values ('002d002d-002d-002d-002d-002d002d1701', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'cfg-tenant-limits', 'Tenant Rate Limits', 'northstar', 'approved', 'active')
on conflict (id) do nothing;

insert into public.eoc_secrets_metadata (id, organization_id, center_id, secret_key, secret_name, vault_ref, secret_status, status)
values ('002e002e-002e-002e-002e-002e002e1801', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'sec-db-credentials', 'Database Credentials', 'vault://db/northstar', 'active', 'active')
on conflict (id) do nothing;

insert into public.eoc_config_versions (id, organization_id, center_id, version_key, version_number, version_status, status)
values ('002f002f-002f-002f-002f-002f002f1901', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'ver-config-v2', '2.0.0', 'approved', 'active')
on conflict (id) do nothing;

-- M7 Platform Diagnostics
insert into public.eoc_platform_logs (id, organization_id, center_id, log_key, log_level, service_name, message, status)
values ('00300030-0030-0030-0030-003000301a01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'log-startup-0803', 'info', 'operations-center', 'Platform startup complete', 'active')
on conflict (id) do nothing;

insert into public.eoc_platform_metrics (id, organization_id, center_id, metrics_key, dependency_health, cpu_percent, memory_percent, status)
values ('00310031-0031-0031-0031-003100311b01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'metrics-0803', 99.00, 35.00, 62.00, 'active')
on conflict (id) do nothing;

insert into public.eoc_trace_summaries (id, organization_id, center_id, trace_key, trace_id, span_count, duration_ms, status)
values ('00320032-0032-0032-0032-003200321c01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'trace-api-0803', 'tr-abc123', 12, 245, 'active')
on conflict (id) do nothing;

insert into public.eoc_service_registry (id, organization_id, center_id, service_key, service_name, service_url, cache_status, status)
values ('00330033-0033-0033-0033-003300331d01', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'svc-auth', 'Auth Service', 'http://auth:8080', 'healthy', 'active')
on conflict (id) do nothing;

-- M8 Enterprise Operations Dashboard
insert into public.eoc_operations_metrics (id, organization_id, metrics_key, operational_score, active_jobs, open_alerts, status)
values ('00340034-0034-0034-0034-003400341e01', '11111111-1111-1111-1111-111111111111', 'ops-metrics-0803', 97.50, 8, 1, 'active')
on conflict (id) do nothing;

insert into public.eoc_operations_health (id, organization_id, health_key, overall_score, uptime_percent, disaster_recovery_mode, summary, status)
values ('00350035-0035-0035-0035-003500351f01', '11111111-1111-1111-1111-111111111111', 'ops-health-0803', 98.00, 99.95, false, 'All systems operational', 'healthy')
on conflict (id) do nothing;

insert into public.eoc_operations_failures (id, organization_id, center_id, failure_key, failure_type, error_code, error_message, status)
values ('00360036-0036-0036-0036-003600362001', '11111111-1111-1111-1111-111111111111', '00110011-0011-0011-0011-001100110101', 'fail-export-0803', 'background_job', 'TIMEOUT', 'Export job timed out', 'open')
on conflict (id) do nothing;

insert into public.eoc_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00370037-0037-0037-0037-003700372101', '11111111-1111-1111-1111-111111111111', 'operations_center', 'seed', 'Enterprise operations center seed data loaded', 'standard')
on conflict (id) do nothing;

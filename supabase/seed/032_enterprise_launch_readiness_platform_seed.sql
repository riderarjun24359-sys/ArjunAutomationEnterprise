insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a332', '11111111-1111-1111-1111-111111111111', 'Enterprise Launch Readiness Orchestrator', 'enterprise_launch_readiness_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["production_validation","deployment_readiness","backup_recovery","observability","security_compliance","documentation","launch_scoring","launch_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a532', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a332', 'northstar-launch-readiness-001', 'enterprise_launch_readiness_platform', 'readiness_hub', '00680068-0068-0068-0068-006800680101', '{"objective":"Enterprise launch readiness platform for northstar production go-live"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 Production Readiness Hub
insert into public.elr_readiness_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('00680068-0068-0068-0068-006800680101', '11111111-1111-1111-1111-111111111111', 'northstar-launch-readiness', 'Northstar Launch Readiness Hub', 'production', 'active')
on conflict (id) do nothing;

insert into public.elr_environment_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, validation_summary, status)
values ('00690069-0069-0069-0069-006900690201', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'env-prod-0804', 'infrastructure', 96.50, 'All production environment checks passed', 'active')
on conflict (id) do nothing;

insert into public.elr_configuration_validations (id, organization_id, hub_id, validation_key, config_type, validation_score, config_ref, status)
values ('006a006a-006a-006a-006a-006a006a0301', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'cfg-app-0804', 'application', 94.00, 'app-config-prod', 'active')
on conflict (id) do nothing;

insert into public.elr_secrets_validations (id, organization_id, hub_id, validation_key, secret_type, validation_score, secret_ref, status)
values ('006b006b-006b-006b-006b-006b006b0401', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'sec-api-0804', 'api_key', 98.00, 'vault/api-keys', 'active')
on conflict (id) do nothing;

-- M2 Deployment Readiness
insert into public.elr_deployment_plans (id, organization_id, hub_id, plan_key, plan_name, target_version, deployment_strategy, status)
values ('006c006c-006c-006c-006c-006c006c0501', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'deploy-v2-0804', 'Production v2.0 Rollout', '2.0.0', 'rolling', 'active')
on conflict (id) do nothing;

insert into public.elr_rollback_plans (id, organization_id, hub_id, plan_key, rollback_version, rollback_reason, status)
values ('006d006d-006d-006d-006d-006d006d0601', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'rollback-v1-0804', '1.9.5', 'Automated rollback if error rate exceeds threshold', 'active')
on conflict (id) do nothing;

insert into public.elr_version_registry (id, organization_id, hub_id, version_key, version_number, release_channel, artifact_ref, status)
values ('006e006e-006e-006e-006e-006e006e0701', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'ver-2-0-0', '2.0.0', 'stable', 'registry/northstar:2.0.0', 'active')
on conflict (id) do nothing;

insert into public.elr_release_notes (id, organization_id, hub_id, note_key, version_ref, note_summary, status)
values ('006f006f-006f-006f-006f-006f006f0801', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'notes-v2-0804', '2.0.0', 'Major launch readiness release with backup and observability upgrades', 'active')
on conflict (id) do nothing;

-- M3 Backup & Recovery
insert into public.elr_backup_policies (id, organization_id, hub_id, policy_key, policy_name, retention_days, backup_frequency, status)
values ('00700070-0070-0070-0070-007000700901', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'backup-daily-0804', 'Daily Full Backup', 30, 'daily', 'active')
on conflict (id) do nothing;

insert into public.elr_backup_verifications (id, organization_id, hub_id, verification_key, backup_ref, verification_score, verification_summary, status)
values ('00710071-0071-0071-0071-007100710a01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'bkp-verify-0804', 'backup-20260804', 99.00, 'Backup integrity verified', 'active')
on conflict (id) do nothing;

insert into public.elr_restore_verifications (id, organization_id, hub_id, verification_key, restore_ref, verification_score, verification_summary, status)
values ('00720072-0072-0072-0072-007200720b01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'restore-verify-0804', 'restore-drill-0804', 97.50, 'Restore drill completed successfully', 'active')
on conflict (id) do nothing;

insert into public.elr_recovery_drills (id, organization_id, hub_id, drill_key, drill_type, drill_score, drill_summary, status)
values ('00730073-0073-0073-0073-007300730c01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'drill-failover-0804', 'failover', 95.00, 'Regional failover drill passed', 'active')
on conflict (id) do nothing;

-- M4 Observability
insert into public.elr_observability_logs (id, organization_id, hub_id, log_key, log_level, log_source, log_message, status)
values ('00740074-0074-0074-0074-007400740d01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'log-health-0804', 'info', 'launch-monitor', 'All observability pipelines healthy', 'active')
on conflict (id) do nothing;

insert into public.elr_observability_metrics (id, organization_id, hub_id, metric_key, metric_name, metric_value, metric_unit, status)
values ('00750075-0075-0075-0075-007500750e01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'metric-latency-0804', 'p99_latency', 120.5, 'ms', 'active')
on conflict (id) do nothing;

insert into public.elr_trace_records (id, organization_id, hub_id, trace_key, trace_name, latency_ms, span_count, status)
values ('00760076-0076-0076-0076-007600760f01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'trace-api-0804', 'api-gateway-trace', 45.2, 12, 'active')
on conflict (id) do nothing;

insert into public.elr_sla_monitors (id, organization_id, hub_id, monitor_key, sla_target, current_value, service_ref, status)
values ('00770077-0077-0077-0077-007700771001', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'sla-uptime-0804', 99.95, 99.98, 'platform-api', 'active')
on conflict (id) do nothing;

-- M5 Security & Compliance
insert into public.elr_security_checklists (id, organization_id, hub_id, checklist_key, checklist_name, completion_score, status)
values ('00780078-0078-0078-0078-007800781101', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'sec-checklist-0804', 'Production Security Checklist', 92.00, 'active')
on conflict (id) do nothing;

insert into public.elr_vulnerability_reviews (id, organization_id, hub_id, review_key, vulnerability_ref, severity, review_summary, status)
values ('00790079-0079-0079-0079-007900791201', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'vuln-review-0804', 'CVE-2026-1234', 'warning', 'Patch scheduled for next maintenance window', 'active')
on conflict (id) do nothing;

insert into public.elr_permission_audits (id, organization_id, hub_id, audit_key, audit_scope, finding_count, audit_summary, status)
values ('007a007a-007a-007a-007a-007a007a1301', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'perm-audit-0804', 'platform', 2, 'Two over-privileged service accounts identified', 'active')
on conflict (id) do nothing;

insert into public.elr_compliance_reviews (id, organization_id, hub_id, review_key, compliance_type, review_score, review_summary, status)
values ('007b007b-007b-007b-007b-007b007b1401', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'compliance-soc2-0804', 'soc2', 94.50, 'SOC2 controls validated for launch', 'active')
on conflict (id) do nothing;

-- M6 Documentation
insert into public.elr_admin_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)
values ('007c007c-007c-007c-007c-007c007c1501', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'admin-guide-0804', 'Production Admin Guide', '2.0', 'active')
on conflict (id) do nothing;

insert into public.elr_user_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)
values ('007d007d-007d-007d-007d-007d007d1601', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'user-guide-0804', 'End User Launch Guide', '2.0', 'active')
on conflict (id) do nothing;

insert into public.elr_deployment_guides (id, organization_id, hub_id, guide_key, guide_title, guide_version, status)
values ('007e007e-007e-007e-007e-007e007e1701', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'deploy-guide-0804', 'Production Deployment Runbook', '2.0', 'active')
on conflict (id) do nothing;

-- M7 Launch Score
insert into public.elr_launch_scores (id, organization_id, metrics_key, security_score, reliability_score, performance_score, documentation_score, operational_score, overall_launch_score, status)
values ('007f007f-007f-007f-007f-007f007f1801', '11111111-1111-1111-1111-111111111111', 'launch-scores-0804', 94.00, 96.50, 95.00, 91.00, 97.00, 94.75, 'active')
on conflict (id) do nothing;

insert into public.elr_readiness_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, validation_summary, status)
values ('00800080-0080-0080-0080-008000801901', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'readiness-gate-0804', 'launch_gate', 93.00, 'All launch gates passed except documentation review', 'active')
on conflict (id) do nothing;

insert into public.elr_launch_blockers (id, organization_id, hub_id, blocker_key, blocker_title, blocker_severity, blocker_summary, status)
values ('00810081-0081-0081-0081-008100811a01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'blocker-docs-0804', 'Deployment guide review pending', 'warning', 'Admin guide needs final sign-off', 'open')
on conflict (id) do nothing;

insert into public.elr_score_snapshots (id, organization_id, hub_id, snapshot_key, snapshot_date, overall_launch_score, status)
values ('00820082-0082-0082-0082-008200821b01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'snapshot-0804', current_date, 94.75, 'active')
on conflict (id) do nothing;

-- M8 Launch Dashboard
insert into public.elr_launch_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, deployment_status, backup_status, security_status, summary, status)
values ('00830083-0083-0083-0083-008300831c01', '11111111-1111-1111-1111-111111111111', 'launch-health-0804', 95.00, false, 'ready', 'healthy', 'healthy', 'Launch readiness platform operational', 'healthy')
on conflict (id) do nothing;

insert into public.elr_critical_issues (id, organization_id, hub_id, issue_key, issue_title, issue_severity, issue_summary, status)
values ('00840084-0084-0084-0084-008400841d01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'issue-drill-0804', 'Recovery drill scheduled for tonight', 'warning', 'Ensure on-call coverage during drill window', 'open')
on conflict (id) do nothing;

insert into public.elr_readiness_warnings (id, organization_id, hub_id, warning_key, warning_type, warning_message, status)
values ('00850085-0085-0085-0085-008500851e01', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'warn-sla-0804', 'sla', 'SLA monitor approaching threshold for api-gateway', 'active')
on conflict (id) do nothing;

insert into public.elr_launch_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00860086-0086-0086-0086-008600862001', '11111111-1111-1111-1111-111111111111', '00680068-0068-0068-0068-006800680101', 'fail-deploy-0804', 'deployment', 'ROLLBACK', 'Canary deployment rolled back due to elevated error rate', 'open')
on conflict (id) do nothing;

insert into public.elr_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00870087-0087-0087-0087-008700872101', '11111111-1111-1111-1111-111111111111', 'readiness_hub', 'seed', 'Enterprise launch readiness platform seed data loaded', 'standard')
on conflict (id) do nothing;

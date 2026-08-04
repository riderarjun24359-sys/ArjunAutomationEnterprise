insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a345', '11111111-1111-1111-1111-111111111111', 'Customer Operated Platform Orchestrator', 'customer_operated_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["onboarding","production","observability","operations","beta","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a545', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a345', 'northstar-customer-operated-001', 'customer_operated_platform', 'operated_hub', '00750075-0075-0075-0075-007500750101', '{"objective":"Launch ready to customer operated platform onboarding, production, and observability"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- G0 Operated Hub
insert into public.cop_operated_hubs (id, organization_id, hub_key, hub_name, environment, operated_tier, status)
values ('00750075-0075-0075-0075-007500750101', '11111111-1111-1111-1111-111111111111', 'northstar-customer-operated', 'Northstar Customer Operated Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- G1 Onboarding
insert into public.cop_signup_flows (id, organization_id, hub_id, flow_key, flow_name, flow_status, status)
values ('04500100-0450-0450-0450-045001000101', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'signup-flow-0905', 'Self-Service Signup', 'active', 'active')
on conflict (id) do nothing;

insert into public.cop_org_provisioning (id, organization_id, hub_id, provision_key, provision_name, provision_status, status)
values ('04510101-0451-0451-0451-045101010201', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'org-provision-0905', 'Org Provisioning Job', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_domain_onboarding (id, organization_id, hub_id, domain_key, domain_name, domain_status, status)
values ('04520102-0452-0452-0452-045201020301', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'domain-onboard-0905', 'app.northstar.io', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_email_verifications (id, organization_id, hub_id, verification_key, email_address, verification_status, status)
values ('04530103-0453-0453-0453-045301030401', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'email-verify-0905', 'admin@northstar.io', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_onboarding_wizards (id, organization_id, hub_id, wizard_key, wizard_name, wizard_status, status)
values ('04540104-0454-0454-0454-045401040501', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'wizard-onboard-0905', 'Launch Onboarding Wizard', 'active', 'active')
on conflict (id) do nothing;

-- G2 Production
insert into public.cop_production_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_status, status)
values ('04550105-0455-0455-0455-045501050601', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'prod-profile-0905', 'Production Profile', 'active', 'active')
on conflict (id) do nothing;

insert into public.cop_deployment_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)
values ('04560106-0456-0456-0456-045601060701', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'deploy-job-0905', 'Production Deployment', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_health_validations (id, organization_id, hub_id, validation_key, validation_name, validation_status, status)
values ('04570107-0457-0457-0457-045701070801', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'health-val-0905', 'Production Health Validation', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_rollback_automations (id, organization_id, hub_id, rollback_key, rollback_name, rollback_status, status)
values ('04580108-0458-0458-0458-045801080901', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'rollback-auto-0905', 'Automated Rollback', 'ready', 'active')
on conflict (id) do nothing;

insert into public.cop_deployment_audits (id, organization_id, hub_id, audit_key, audit_name, audit_status, status)
values ('04590109-0459-0459-0459-045901090a01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'deploy-audit-0905', 'Deployment Audit', 'pending', 'active')
on conflict (id) do nothing;

-- G3 Observability
insert into public.cop_central_logs (id, organization_id, hub_id, log_key, log_source, log_level, status)
values ('045a010a-045a-045a-045a-045a010a0b01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'log-central-0905', 'api-gateway', 'info', 'active')
on conflict (id) do nothing;

insert into public.cop_metrics_collectors (id, organization_id, hub_id, collector_key, collector_name, collector_status, status)
values ('045b010b-045b-045b-045b-045b010b0c01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'metrics-col-0905', 'Platform Metrics Collector', 'active', 'active')
on conflict (id) do nothing;

insert into public.cop_distributed_traces (id, organization_id, hub_id, trace_key, trace_name, trace_status, status)
values ('045c010c-045c-045c-045c-045c010c0d01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'trace-dist-0905', 'API Request Trace', 'active', 'active')
on conflict (id) do nothing;

insert into public.cop_alert_rules (id, organization_id, hub_id, rule_key, rule_name, severity, status)
values ('045d010d-045d-045d-045d-045d010d0e01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'alert-rule-0905', 'High Error Rate Alert', 'warning', 'active')
on conflict (id) do nothing;

insert into public.cop_incident_timelines (id, organization_id, hub_id, incident_key, incident_title, incident_status, status)
values ('045e010e-045e-045e-045e-045e010e0f01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'incident-0905', 'Production Incident', 'open', 'active')
on conflict (id) do nothing;

-- G4 Operations
insert into public.cop_backup_schedulers (id, organization_id, hub_id, schedule_key, schedule_name, schedule_status, status)
values ('045f010f-045f-045f-045f-045f010f1001', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'backup-sched-0905', 'Daily Backup Schedule', 'active', 'active')
on conflict (id) do nothing;

insert into public.cop_restore_validations (id, organization_id, hub_id, restore_key, restore_name, restore_status, status)
values ('04600110-0460-0460-0460-046001101101', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'restore-val-0905', 'Restore Validation', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_maintenance_modes (id, organization_id, hub_id, maintenance_key, maintenance_name, maintenance_status, status)
values ('04610111-0461-0461-0461-046101111201', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'maint-mode-0905', 'Scheduled Maintenance', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.cop_feature_flag_ops (id, organization_id, hub_id, flag_key, flag_name, flag_status, status)
values ('04620112-0462-0462-0462-046201121301', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'flag-beta-0905', 'Beta Feature Flag', 'disabled', 'active')
on conflict (id) do nothing;

insert into public.cop_platform_diagnostics (id, organization_id, hub_id, diagnostic_key, diagnostic_name, diagnostic_status, status)
values ('04630113-0463-0463-0463-046301131401', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'diag-platform-0905', 'Platform Diagnostic', 'pending', 'active')
on conflict (id) do nothing;

-- G5 Beta
insert into public.cop_beta_organizations (id, organization_id, hub_id, org_key, org_name, beta_status, status)
values ('04640114-0464-0464-0464-046401141501', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'beta-org-0905', 'Northstar Beta Corp', 'invited', 'active')
on conflict (id) do nothing;

insert into public.cop_beta_invitations (id, organization_id, hub_id, invitation_key, invitee_email, invitation_status, status)
values ('04650115-0465-0465-0465-046501151601', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'beta-invite-0905', 'beta@northstar.io', 'pending', 'active')
on conflict (id) do nothing;

insert into public.cop_feedback_collection (id, organization_id, hub_id, feedback_key, feedback_title, feedback_type, status)
values ('04660116-0466-0466-0466-046601161701', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'feedback-0905', 'Beta Feedback', 'general', 'active')
on conflict (id) do nothing;

insert into public.cop_feature_requests (id, organization_id, hub_id, request_key, request_title, request_status, status)
values ('04670117-0467-0467-0467-046701171801', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'feature-req-0905', 'Advanced Analytics Request', 'submitted', 'active')
on conflict (id) do nothing;

insert into public.cop_bug_reports (id, organization_id, hub_id, bug_key, bug_title, bug_status, status)
values ('04680118-0468-0468-0468-046801181901', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'bug-report-0905', 'Login Timeout Bug', 'open', 'active')
on conflict (id) do nothing;

insert into public.cop_release_channels (id, organization_id, hub_id, channel_key, channel_name, channel_status, status)
values ('04690119-0469-0469-0469-046901191a01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'release-chan-0905', 'Beta Release Channel', 'active', 'active')
on conflict (id) do nothing;

-- G6 Dashboard
insert into public.cop_operated_metrics (id, organization_id, metrics_key, production_status_score, onboarding_completion_rate, revenue_today, active_incident_count, pending_approval_count, platform_availability_score, customer_satisfaction_score, overall_operated_score, status)
values ('046a011a-046a-046a-046a-046a011a1b01', '11111111-1111-1111-1111-111111111111', 'cop-metrics-0905', 96.00, 82.50, 12500.00, 2, 5, 99.50, 94.00, 95.50, 'active')
on conflict (id) do nothing;

insert into public.cop_operated_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, production_status, onboarding_status, observability_status, security_status, summary, status)
values ('046b011b-046b-046b-046b-046b011b1c01', '11111111-1111-1111-1111-111111111111', 'cop-health-0905', 95.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Customer operated platform operational', 'healthy')
on conflict (id) do nothing;

insert into public.cop_executive_briefings (id, organization_id, hub_id, briefing_key, briefing_title, briefing_type, status)
values ('046c011c-046c-046c-046c-046c011c1d01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'briefing-daily-0905', 'Daily Executive Briefing', 'daily', 'active')
on conflict (id) do nothing;

insert into public.cop_platform_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('046d011d-046d-046d-046d-046d011d1e01', '11111111-1111-1111-1111-111111111111', '00750075-0075-0075-0075-007500750101', 'fail-deploy-0905', 'deployment', 'DEPLOY_TIMEOUT', 'Production deployment timed out', 'open')
on conflict (id) do nothing;

insert into public.cop_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('046e011e-046e-046e-046e-046e011e1f01', '11111111-1111-1111-1111-111111111111', 'operated_hub', 'seed', 'Customer operated platform seed data loaded', 'standard')
on conflict (id) do nothing;

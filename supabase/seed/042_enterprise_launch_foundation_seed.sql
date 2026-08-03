insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a342', '11111111-1111-1111-1111-111111111111', 'Enterprise Launch Foundation Orchestrator', 'enterprise_launch_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["provisioning","config_wizard","data_import","go_live","customer_success","support_ops","platform_admin","mission_control"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a542', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a342', 'northstar-launch-foundation-001', 'enterprise_launch_foundation', 'launch_hub', '00720072-0072-0072-0072-007200720101', '{"objective":"Enterprise launch foundation for northstar platform go-live"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Launch Hub
insert into public.elf_launch_hubs (id, organization_id, hub_key, hub_name, environment, platform_tier, status)
values ('00720072-0072-0072-0072-007200720101', '11111111-1111-1111-1111-111111111111', 'northstar-launch-foundation', 'Northstar Launch Foundation Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- M1 Provisioning
insert into public.elf_organization_provisions (id, organization_id, hub_id, provision_key, provision_name, provision_status, status)
values ('04200100-0420-0420-0420-042001000201', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'org-provision-0904', 'Northstar Organization Provision', 'active', 'active')
on conflict (id) do nothing;

insert into public.elf_tenant_provisions (id, organization_id, hub_id, provision_key, tenant_ref, provision_status, status)
values ('04210101-0421-0421-0421-042101010301', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'tenant-provision-0904', 'northstar-tenant-001', 'active', 'active')
on conflict (id) do nothing;

insert into public.elf_industry_pack_assignments (id, organization_id, hub_id, assignment_key, pack_name, pack_type, status)
values ('04220102-0422-0422-0422-042201020401', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'pack-hospital-0904', 'Hospital Business OS', 'hospital', 'active')
on conflict (id) do nothing;

insert into public.elf_module_licenses (id, organization_id, hub_id, license_key, module_name, license_status, status)
values ('04230103-0423-0423-0423-042301030501', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'lic-platform-0904', 'Platform Core', 'active', 'active')
on conflict (id) do nothing;

-- M2 Config Wizard
insert into public.elf_wizard_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_type, status)
values ('04240104-0424-0424-0424-042401040601', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'wiz-profile-0904', 'Northstar Wizard Profile', 'standard', 'active')
on conflict (id) do nothing;

insert into public.elf_wizard_branding (id, organization_id, hub_id, branding_key, branding_name, brand_color, status)
values ('04250105-0425-0425-0425-042501050701', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'wiz-brand-0904', 'Northstar Branding', '#475569', 'active')
on conflict (id) do nothing;

insert into public.elf_wizard_departments (id, organization_id, hub_id, department_key, department_name, department_type, status)
values ('04260106-0426-0426-0426-042601060801', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'wiz-dept-0904', 'Operations Department', 'operations', 'active')
on conflict (id) do nothing;

insert into public.elf_wizard_settings (id, organization_id, hub_id, setting_key, setting_name, setting_value, status)
values ('04270107-0427-0427-0427-042701070901', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'wiz-setting-0904', 'Default Timezone', 'UTC', 'active')
on conflict (id) do nothing;

-- M3 Data Import
insert into public.elf_import_jobs (id, organization_id, hub_id, job_key, job_name, job_status, status)
values ('04280108-0428-0428-0428-042801080a01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'import-job-0904', 'Customer Data Import', 'completed', 'active')
on conflict (id) do nothing;

insert into public.elf_import_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, status)
values ('04290109-0429-0429-0429-042901090b01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'import-val-0904', 'schema', 98.50, 'active')
on conflict (id) do nothing;

insert into public.elf_import_previews (id, organization_id, hub_id, preview_key, preview_name, record_count, status)
values ('042a010a-042a-042a-042a-042a010a0c01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'import-prev-0904', 'Customer Preview', 1250, 'active')
on conflict (id) do nothing;

insert into public.elf_import_history (id, organization_id, hub_id, history_key, history_type, status)
values ('042b010b-042b-042b-042b-042b010b0d01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'import-hist-0904', 'bulk', 'active')
on conflict (id) do nothing;

-- M4 Go Live
insert into public.elf_go_live_checklists (id, organization_id, hub_id, checklist_key, checklist_name, completion_score, status)
values ('042c010c-042c-042c-042c-042c010c0e01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'golive-check-0904', 'Production Go-Live Checklist', 95.00, 'active')
on conflict (id) do nothing;

insert into public.elf_go_live_scores (id, organization_id, hub_id, score_key, score_type, go_live_score, status)
values ('042d010d-042d-042d-042d-042d010d0f01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'golive-score-0904', 'overall', 96.50, 'active')
on conflict (id) do nothing;

insert into public.elf_deployment_statuses (id, organization_id, hub_id, status_key, deployment_name, deployment_status, status)
values ('042e010e-042e-042e-042e-042e010e1001', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'deploy-status-0904', 'Production Deployment', 'deployed', 'active')
on conflict (id) do nothing;

insert into public.elf_readiness_validations (id, organization_id, hub_id, validation_key, validation_type, validation_score, status)
values ('042f010f-042f-042f-042f-042f010f1101', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'ready-val-0904', 'launch_gate', 97.00, 'active')
on conflict (id) do nothing;

-- M5 Customer Success
insert into public.elf_customer_health_scores (id, organization_id, hub_id, score_key, customer_ref, health_score, status)
values ('04300110-0430-0430-0430-043001101201', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'cust-health-0904', 'northstar-customer-001', 92.00, 'active')
on conflict (id) do nothing;

insert into public.elf_platform_adoption (id, organization_id, hub_id, adoption_key, feature_name, adoption_rate, status)
values ('04310111-0431-0431-0431-043101111301', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'adopt-dash-0904', 'Dashboard', 88.50, 'active')
on conflict (id) do nothing;

insert into public.elf_feature_usage (id, organization_id, hub_id, usage_key, feature_name, usage_count, status)
values ('04320112-0432-0432-0432-043201121401', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'usage-wf-0904', 'Workflow Engine', 4500, 'active')
on conflict (id) do nothing;

insert into public.elf_renewal_tracking (id, organization_id, hub_id, renewal_key, customer_ref, renewal_status, status)
values ('04330113-0433-0433-0433-043301131501', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'renewal-0904', 'northstar-customer-001', 'confirmed', 'active')
on conflict (id) do nothing;

-- M6 Support Ops
insert into public.elf_support_tickets (id, organization_id, hub_id, ticket_key, ticket_title, ticket_status, status)
values ('04340114-0434-0434-0434-043401141601', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'ticket-0904', 'Onboarding Support Request', 'open', 'active')
on conflict (id) do nothing;

insert into public.elf_knowledge_base_articles (id, organization_id, hub_id, article_key, article_title, article_category, status)
values ('04350115-0435-0435-0435-043501151701', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'kb-article-0904', 'Getting Started Guide', 'onboarding', 'active')
on conflict (id) do nothing;

insert into public.elf_incident_tracking (id, organization_id, hub_id, incident_key, incident_title, incident_severity, status)
values ('04360116-0436-0436-0436-043601161801', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'incident-0904', 'Import Pipeline Delay', 'warning', 'active')
on conflict (id) do nothing;

-- M7 Platform Admin
insert into public.elf_customer_registry (id, organization_id, hub_id, customer_key, customer_name, customer_tier, status)
values ('04370117-0437-0437-0437-043701171901', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'cust-reg-0904', 'Northstar Customer', 'enterprise', 'active')
on conflict (id) do nothing;

insert into public.elf_subscription_records (id, organization_id, hub_id, subscription_key, plan_name, subscription_status, status)
values ('04380118-0438-0438-0438-043801181a01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'sub-record-0904', 'Enterprise Plan', 'active', 'active')
on conflict (id) do nothing;

insert into public.elf_license_management (id, organization_id, hub_id, license_key, license_type, license_status, status)
values ('04390119-0439-0439-0439-043901191b01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'lic-mgmt-0904', 'platform', 'active', 'active')
on conflict (id) do nothing;

-- M8 Mission Control
insert into public.elf_launch_metrics (id, organization_id, metrics_key, platform_health_score, customer_health_score, deployment_count, subscription_count, support_open_count, go_live_score, overall_launch_score, status)
values ('043a011a-043a-043a-043a-043a011a1c01', '11111111-1111-1111-1111-111111111111', 'elf-metrics-0904', 96.00, 92.00, 12, 45, 3, 96.50, 95.25, 'active')
on conflict (id) do nothing;

insert into public.elf_launch_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, platform_status, customer_success_status, security_status, summary, status)
values ('043b011b-043b-043b-043b-043b011b1d01', '11111111-1111-1111-1111-111111111111', 'elf-health-0904', 96.00, false, 'healthy', 'healthy', 'healthy', 'Enterprise launch foundation operational', 'healthy')
on conflict (id) do nothing;

insert into public.elf_mission_control_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_score, status)
values ('043c011c-043c-043c-043c-043c011c1e01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'kpi-mission-0904', 'Mission Control KPI Score', 97.50, 'active')
on conflict (id) do nothing;

insert into public.elf_launch_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('043d011d-043d-043d-043d-043d011d1f01', '11111111-1111-1111-1111-111111111111', '00720072-0072-0072-0072-007200720101', 'fail-provision-0904', 'provisioning', 'PROVISION_TIMEOUT', 'Tenant provisioning timed out', 'open')
on conflict (id) do nothing;

insert into public.elf_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('043e011e-043e-043e-043e-043e011e2001', '11111111-1111-1111-1111-111111111111', 'launch_hub', 'seed', 'Enterprise launch foundation seed data loaded', 'standard')
on conflict (id) do nothing;

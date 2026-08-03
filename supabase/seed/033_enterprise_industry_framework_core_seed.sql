insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a333', '11111111-1111-1111-1111-111111111111', 'Enterprise Industry Framework Orchestrator', 'enterprise_industry_framework_core', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["industry_registry","profile_engine","template_engine","configuration_engine","context_engine","deployment_profiles","industry_sdk","framework_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a533', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a333', 'northstar-industry-framework-001', 'enterprise_industry_framework_core', 'framework_hub', '00690069-0069-0069-0069-006900690101', '{"objective":"Enterprise industry framework core for northstar multi-industry deployment"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M0 Framework Hub
insert into public.ifr_framework_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('00690069-0069-0069-0069-006900690101', '11111111-1111-1111-1111-111111111111', 'northstar-industry-framework', 'Northstar Industry Framework Hub', 'production', 'active')
on conflict (id) do nothing;

-- M1 Industry Registry
insert into public.ifr_industry_registrations (id, organization_id, hub_id, registration_key, industry_code, industry_name, status)
values ('006a006a-006a-006a-006a-006a006a0201', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'reg-saas-0804', 'saas', 'Software as a Service', 'active')
on conflict (id) do nothing;

insert into public.ifr_industry_metadata (id, organization_id, hub_id, metadata_key, metadata_type, status)
values ('006b006b-006b-006b-006b-006b006b0301', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'meta-profile-0804', 'profile', 'active')
on conflict (id) do nothing;

insert into public.ifr_industry_versions (id, organization_id, hub_id, version_key, version_number, release_channel, status)
values ('006c006c-006c-006c-006c-006c006c0401', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'ver-1-0-0', '1.0.0', 'stable', 'active')
on conflict (id) do nothing;

insert into public.ifr_industry_dependencies (id, organization_id, hub_id, dependency_key, dependency_type, dependency_ref, status)
values ('006d006d-006d-006d-006d-006d006d0501', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'dep-crm-0804', 'module', 'crm-core', 'active')
on conflict (id) do nothing;

-- M2 Profile Engine
insert into public.ifr_business_types (id, organization_id, hub_id, type_key, type_name, type_category, status)
values ('006e006e-006e-006e-006e-006e006e0601', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'type-b2b-0804', 'B2B SaaS', 'technology', 'active')
on conflict (id) do nothing;

insert into public.ifr_business_sizes (id, organization_id, hub_id, size_key, size_label, employee_range, status)
values ('006f006f-006f-006f-006f-006f006f0701', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'size-mid-0804', 'Mid-Market', '50-500', 'active')
on conflict (id) do nothing;

insert into public.ifr_operating_models (id, organization_id, hub_id, model_key, model_name, model_type, status)
values ('00700070-0070-0070-0070-007000700801', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'model-sub-0804', 'Subscription', 'saas', 'active')
on conflict (id) do nothing;

insert into public.ifr_industry_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_score, profile_summary, status)
values ('00710071-0071-0071-0071-007100710901', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'profile-saas-0804', 'SaaS Growth Profile', 92.50, 'Optimized for B2B SaaS mid-market', 'active')
on conflict (id) do nothing;

-- M3 Template Engine
insert into public.ifr_dashboard_templates (id, organization_id, hub_id, template_key, template_name, template_version, status)
values ('00720072-0072-0072-0072-007200720a01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'dash-exec-0804', 'Executive Dashboard', '1.0', 'active')
on conflict (id) do nothing;

insert into public.ifr_workflow_templates (id, organization_id, hub_id, template_key, template_name, workflow_type, status)
values ('00730073-0073-0073-0073-007300730b01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'wf-onboard-0804', 'Customer Onboarding', 'automation', 'active')
on conflict (id) do nothing;

insert into public.ifr_role_templates (id, organization_id, hub_id, template_key, role_name, permissions_count, status)
values ('00740074-0074-0074-0074-007400740c01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'role-admin-0804', 'Industry Admin', 24, 'active')
on conflict (id) do nothing;

insert into public.ifr_report_templates (id, organization_id, hub_id, template_key, report_name, report_format, status)
values ('00750075-0075-0075-0075-007500750d01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'rpt-kpi-0804', 'KPI Summary Report', 'pdf', 'active')
on conflict (id) do nothing;

-- M4 Configuration Engine
insert into public.ifr_dynamic_configurations (id, organization_id, hub_id, config_key, config_type, status)
values ('00760076-0076-0076-0076-007600760e01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'cfg-feature-0804', 'feature', 'active')
on conflict (id) do nothing;

insert into public.ifr_feature_configurations (id, organization_id, hub_id, feature_key, feature_name, enabled, status)
values ('00770077-0077-0077-0077-007700770f01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'feat-ai-0804', 'AI Copilot', true, 'active')
on conflict (id) do nothing;

insert into public.ifr_business_rules (id, organization_id, hub_id, rule_key, rule_name, rule_type, status)
values ('00780078-0078-0078-0078-007800781001', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'rule-valid-0804', 'Profile Validation Rule', 'validation', 'active')
on conflict (id) do nothing;

insert into public.ifr_validation_rules (id, organization_id, hub_id, rule_key, rule_name, validation_score, status)
values ('00790079-0079-0079-0079-007900791101', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'val-schema-0804', 'Schema Validation', 96.00, 'active')
on conflict (id) do nothing;

-- M5 Context Engine
insert into public.ifr_industry_contexts (id, organization_id, hub_id, context_key, context_type, status)
values ('007a007a-007a-007a-007a-007a007a1201', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'ctx-ops-0804', 'operational', 'active')
on conflict (id) do nothing;

insert into public.ifr_ai_contexts (id, organization_id, hub_id, context_key, context_type, token_count, status)
values ('007b007b-007b-007b-007b-007b007b1301', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'ctx-ai-0804', 'prompt', 4096, 'active')
on conflict (id) do nothing;

insert into public.ifr_terminology_entries (id, organization_id, hub_id, term_key, term_label, term_definition, status)
values ('007c007c-007c-007c-007c-007c007c1401', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'term-mrr-0804', 'MRR', 'Monthly Recurring Revenue', 'active')
on conflict (id) do nothing;

-- M6 Deployment Profiles
insert into public.ifr_demo_profiles (id, organization_id, hub_id, profile_key, profile_name, demo_duration_days, status)
values ('007d007d-007d-007d-007d-007d007d1501', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'demo-saas-0804', 'SaaS Demo Profile', 14, 'active')
on conflict (id) do nothing;

insert into public.ifr_production_profiles (id, organization_id, hub_id, profile_key, profile_name, deployment_target, status)
values ('007e007e-007e-007e-007e-007e007e1601', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'prod-cloud-0804', 'Cloud Production', 'cloud', 'active')
on conflict (id) do nothing;

insert into public.ifr_enterprise_profiles (id, organization_id, hub_id, profile_key, profile_name, compliance_tier, status)
values ('007f007f-007f-007f-007f-007f007f1701', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'ent-soc2-0804', 'Enterprise SOC2', 'enterprise', 'active')
on conflict (id) do nothing;

-- M7 Industry SDK
insert into public.ifr_shared_apis (id, organization_id, hub_id, api_key, api_name, api_version, status)
values ('00800080-0080-0080-0080-008000801801', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'api-shared-0804', 'Framework Shared API', 'v1', 'active')
on conflict (id) do nothing;

insert into public.ifr_context_apis (id, organization_id, hub_id, api_key, api_name, context_type, status)
values ('00810081-0081-0081-0081-008100811901', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'api-ctx-0804', 'Context API', 'industry', 'active')
on conflict (id) do nothing;

insert into public.ifr_configuration_apis (id, organization_id, hub_id, api_key, api_name, config_scope, status)
values ('00820082-0082-0082-0082-008200821a01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'api-cfg-0804', 'Configuration API', 'tenant', 'active')
on conflict (id) do nothing;

insert into public.ifr_extension_points (id, organization_id, hub_id, extension_key, extension_name, hook_type, status)
values ('00830083-0083-0083-0083-008300831b01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'ext-pre-0804', 'Pre-Action Hook', 'pre_action', 'active')
on conflict (id) do nothing;

-- M8 Framework Dashboard
insert into public.ifr_framework_metrics (id, organization_id, metrics_key, template_score, profile_score, compatibility_score, sdk_score, framework_health_score, overall_framework_score, status)
values ('00840084-0084-0084-0084-008400841c01', '11111111-1111-1111-1111-111111111111', 'framework-metrics-0804', 94.00, 96.50, 95.00, 91.00, 97.00, 94.75, 'active')
on conflict (id) do nothing;

insert into public.ifr_compatibility_checks (id, organization_id, hub_id, check_key, check_type, check_score, check_summary, status)
values ('00850085-0085-0085-0085-008500851d01', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'compat-ver-0804', 'version', 93.00, 'All version compatibility checks passed', 'active')
on conflict (id) do nothing;

insert into public.ifr_framework_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, compatibility_status, sdk_status, template_status, summary, status)
values ('00860086-0086-0086-0086-008600861e01', '11111111-1111-1111-1111-111111111111', 'framework-health-0804', 95.00, false, 'healthy', 'healthy', 'healthy', 'Industry framework core operational', 'healthy')
on conflict (id) do nothing;

insert into public.ifr_framework_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00870087-0087-0087-0087-008700872001', '11111111-1111-1111-1111-111111111111', '00690069-0069-0069-0069-006900690101', 'fail-compat-0804', 'compatibility', 'VERSION_MISMATCH', 'Template version mismatch detected in workflow module', 'open')
on conflict (id) do nothing;

insert into public.ifr_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00880088-0088-0088-0088-008800882101', '11111111-1111-1111-1111-111111111111', 'framework_hub', 'seed', 'Enterprise industry framework core seed data loaded', 'standard')
on conflict (id) do nothing;

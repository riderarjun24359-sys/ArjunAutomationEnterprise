insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a326', '11111111-1111-1111-1111-111111111111', 'Tenant Lifecycle Operations Orchestrator', 'tenant_lifecycle_ops', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["lifecycle_management","tenant_operations","onboarding","module_marketplace","industry_packs","health_monitoring","customer_success","commercial_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a526', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a326', 'northstar-lifecycle-001', 'tenant_lifecycle_ops', 'tenant_context', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', '{"objective":"customer lifecycle and tenant operations platform for northstar-lifecycle context"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.tlo_tenant_contexts (id, organization_id, context_key, company_name, lifecycle_stage, status)
values
  ('cc01cc01-cc01-cc01-cc01-cc01cc010101', '11111111-1111-1111-1111-111111111111', 'northstar-lifecycle', 'Northstar Lifecycle Demo Corp', 'active', 'active')
on conflict (id) do nothing;

insert into public.tlo_lifecycle_records (id, organization_id, tenant_context_id, record_key, current_stage, previous_stage, stage_entered_at, notes, status)
values
  ('cc02cc02-cc02-cc02-cc02-cc02cc020201', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'lifecycle-primary', 'active', 'evaluation', '2026-07-15 10:00:00+00', 'Converted from evaluation after successful 30-day pilot with 12 active users', 'active')
on conflict (id) do nothing;

insert into public.tlo_lifecycle_transitions (id, organization_id, tenant_context_id, transition_key, from_stage, to_stage, reason, transitioned_at, status)
values
  ('cc03cc03-cc03-cc03-cc03-cc03cc030301', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'transition-lead-trial', 'lead', 'trial', 'Sales qualified lead — 14-day trial provisioned', '2026-06-01 09:00:00+00', 'completed'),
  ('cc03cc03-cc03-cc03-cc03-cc03cc030302', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'transition-trial-eval', 'trial', 'evaluation', 'Trial extended for enterprise evaluation', '2026-06-20 14:00:00+00', 'completed'),
  ('cc03cc03-cc03-cc03-cc03-cc03cc030303', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'transition-eval-active', 'evaluation', 'active', 'Contract signed — annual subscription activated', '2026-07-15 10:00:00+00', 'completed')
on conflict (id) do nothing;

insert into public.tlo_lifecycle_events (id, organization_id, tenant_context_id, event_key, event_type, stage, summary, details, occurred_at, status)
values
  ('cc04cc04-cc04-cc04-cc04-cc04cc040401', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'event-trial-started', 'stage_entered', 'trial', 'Trial period initiated for Northstar Lifecycle Demo Corp', '{"duration_days":14,"plan":"trial"}'::jsonb, '2026-06-01 09:00:00+00', 'recorded'),
  ('cc04cc04-cc04-cc04-cc04-cc04cc040402', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'event-contract-signed', 'milestone', 'active', 'Annual enterprise contract executed', '{"contract_value_usd":48000,"term_months":12}'::jsonb, '2026-07-15 10:00:00+00', 'recorded')
on conflict (id) do nothing;

insert into public.tlo_reactivation_requests (id, organization_id, tenant_context_id, request_key, prior_stage, target_stage, justification, requested_at, status)
values
  ('cc05cc05-cc05-cc05-cc05-cc05cc050501', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'reactivation-demo', 'cancelled', 'active', 'Demo reactivation request for lifecycle workflow testing', '2026-07-28 11:00:00+00', 'pending')
on conflict (id) do nothing;

insert into public.tlo_workspaces (id, organization_id, tenant_context_id, workspace_key, workspace_name, workspace_type, region, isolation_tier, status)
values
  ('cc06cc06-cc06-cc06-cc06-cc06cc060601', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'workspace-prod', 'Northstar Production', 'production', 'us-west-2', 'dedicated', 'active'),
  ('cc06cc06-cc06-cc06-cc06-cc06cc060602', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'workspace-staging', 'Northstar Staging', 'staging', 'us-west-2', 'shared', 'active')
on conflict (id) do nothing;

insert into public.tlo_environment_settings (id, organization_id, tenant_context_id, setting_key, environment_name, config, feature_flags, api_rate_limit, status)
values
  ('cc07cc07-cc07-cc07-cc07-cc07cc070701', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'env-prod', 'production', '{"log_level":"info","timezone":"America/Los_Angeles"}'::jsonb, '{"advanced_analytics":true,"ai_agents":true,"module_marketplace":true}'::jsonb, 5000, 'active')
on conflict (id) do nothing;

insert into public.tlo_storage_management (id, organization_id, tenant_context_id, storage_key, storage_type, quota_gb, used_gb, retention_days, encryption_enabled, status)
values
  ('cc08cc08-cc08-cc08-cc08-cc08cc080801', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'storage-primary', 'object', 500.00, 127.50, 365, true, 'active'),
  ('cc08cc08-cc08-cc08-cc08-cc08cc080802', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'storage-backup', 'archive', 1000.00, 245.00, 730, true, 'active')
on conflict (id) do nothing;

insert into public.tlo_operations_controls (id, organization_id, tenant_context_id, control_key, backup_enabled, backup_schedule_cron, last_backup_at, restore_point_id, maintenance_mode, maintenance_window, maintenance_message, status)
values
  ('cc09cc09-cc09-cc09-cc09-cc09cc090901', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'ops-primary', true, '0 2 * * *', '2026-08-02 02:00:00+00', 'rp-20260802-0200', false, '{"day":"sunday","start_hour":2,"duration_hours":4}'::jsonb, '', 'active')
on conflict (id) do nothing;

insert into public.tlo_onboarding_flows (id, organization_id, tenant_context_id, flow_key, flow_name, flow_type, steps, estimated_days, status)
values
  ('cc10cc10-cc10-cc10-cc10-cc10cc101001', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'flow-enterprise', 'Enterprise Onboarding', 'standard', '["account_setup","workspace_provision","module_selection","team_invite","go_live_review"]'::jsonb, 14, 'active')
on conflict (id) do nothing;

insert into public.tlo_onboarding_progress (id, organization_id, tenant_context_id, progress_key, flow_id, current_step, completed_steps, percent_complete, started_at, completed_at, status)
values
  ('cc11cc11-cc11-cc11-cc11-cc11cc111101', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'progress-enterprise', 'cc10cc10-cc10-cc10-cc10-cc10cc101001', 'go_live_review', '["account_setup","workspace_provision","module_selection","team_invite"]'::jsonb, 80.00, '2026-06-01 09:00:00+00', null, 'in_progress')
on conflict (id) do nothing;

insert into public.tlo_onboarding_validations (id, organization_id, tenant_context_id, validation_key, validation_type, rule_name, expected_value, actual_value, passed, validated_at, status)
values
  ('cc12cc12-cc12-cc12-cc12-cc12cc121201', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'validation-sso', 'integration', 'SSO Configuration Valid', 'configured', 'configured', true, '2026-07-10 16:00:00+00', 'passed'),
  ('cc12cc12-cc12-cc12-cc12-cc12cc121202', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'validation-data-migration', 'data', 'Initial Data Migration Complete', 'complete', 'complete', true, '2026-07-12 11:30:00+00', 'passed')
on conflict (id) do nothing;

insert into public.tlo_go_live_checklists (id, organization_id, tenant_context_id, checklist_key, name, checklist_items, completed_items, go_live_date, status)
values
  ('cc13cc13-cc13-cc13-cc13-cc13cc131301', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'checklist-go-live', 'Northstar Go-Live Checklist', '["security_review","backup_verified","monitoring_enabled","csm_assigned","training_complete"]'::jsonb, '["security_review","backup_verified","monitoring_enabled","csm_assigned"]'::jsonb, '2026-08-15', 'in_review')
on conflict (id) do nothing;

insert into public.tlo_marketplace_modules (id, organization_id, tenant_context_id, module_key, module_name, module_version, category, description, is_published, status)
values
  ('cc14cc14-cc14-cc14-cc14-cc14cc141401', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'mod-analytics', 'Advanced Analytics', '2.1.0', 'analytics', 'Real-time dashboards and custom reporting engine', true, 'active'),
  ('cc14cc14-cc14-cc14-cc14-cc14cc141402', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'mod-workflow', 'Workflow Automation', '1.8.3', 'automation', 'Visual workflow builder with AI-assisted triggers', true, 'active')
on conflict (id) do nothing;

insert into public.tlo_module_installations (id, organization_id, tenant_context_id, installation_key, module_id, installed_version, installed_at, config, status)
values
  ('cc15cc15-cc15-cc15-cc15-cc15cc151501', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'install-analytics', 'cc14cc14-cc14-cc14-cc14-cc14cc141401', '2.1.0', '2026-07-01 10:00:00+00', '{"dashboard_limit":10,"retention_days":90}'::jsonb, 'active'),
  ('cc15cc15-cc15-cc15-cc15-cc15cc151502', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'install-workflow', 'cc14cc14-cc14-cc14-cc14-cc14cc141402', '1.8.3', '2026-07-05 14:00:00+00', '{"max_concurrent_workflows":50}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.tlo_module_dependencies (id, organization_id, tenant_context_id, dependency_key, module_id, depends_on_module_id, dependency_type, min_version, status)
values
  ('cc16cc16-cc16-cc16-cc16-cc16cc161601', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'dep-workflow-analytics', 'cc14cc14-cc14-cc14-cc14-cc14cc141402', 'cc14cc14-cc14-cc14-cc14-cc14cc141401', 'optional', '2.0.0', 'active')
on conflict (id) do nothing;

insert into public.tlo_module_compatibility (id, organization_id, tenant_context_id, compatibility_key, module_id, platform_version, compatible, notes, tested_at, status)
values
  ('cc17cc17-cc17-cc17-cc17-cc17cc171701', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'compat-analytics-v2', 'cc14cc14-cc14-cc14-cc14-cc14cc141401', '2.6.0', true, 'Fully compatible with platform v2.6.0', '2026-07-28 09:00:00+00', 'active'),
  ('cc17cc17-cc17-cc17-cc17-cc17cc171702', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'compat-workflow-v2', 'cc14cc14-cc14-cc14-cc14-cc14cc141402', '2.6.0', true, 'Fully compatible with platform v2.6.0', '2026-07-28 09:15:00+00', 'active')
on conflict (id) do nothing;

insert into public.tlo_industry_packs (id, organization_id, tenant_context_id, pack_key, pack_name, industry, pack_version, included_modules, status)
values
  ('cc18cc18-cc18-cc18-cc18-cc18cc181801', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'pack-saas', 'SaaS Operations Pack', 'enterprise_software', '1.2.0', '["mod-analytics","mod-workflow","mod-billing"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.tlo_pack_installations (id, organization_id, tenant_context_id, installation_key, pack_id, installed_version, installed_at, status)
values
  ('cc19cc19-cc19-cc19-cc19-cc19cc191901', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'pack-install-saas', 'cc18cc18-cc18-cc18-cc18-cc18cc181801', '1.2.0', '2026-07-08 10:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.tlo_pack_versions (id, organization_id, tenant_context_id, version_key, pack_id, version_number, changelog, release_notes, released_at, status)
values
  ('cc20cc20-cc20-cc20-cc20-cc20cc202001', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'pack-ver-saas-120', 'cc18cc18-cc18-cc18-cc18-cc18cc181801', '1.2.0', 'Added billing module integration and improved analytics templates', '{"highlights":["billing_module","analytics_templates","workflow_presets"]}'::jsonb, '2026-07-01 00:00:00+00', 'published')
on conflict (id) do nothing;

insert into public.tlo_pack_exports (id, organization_id, tenant_context_id, export_key, pack_id, export_format, export_uri, exported_at, status)
values
  ('cc21cc21-cc21-cc21-cc21-cc21cc212101', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'export-saas-config', 'cc18cc18-cc18-cc18-cc18-cc18cc181801', 'json', 's3://northstar-exports/packs/saas-ops-pack-v1.2.0.json', '2026-07-20 15:00:00+00', 'completed')
on conflict (id) do nothing;

insert into public.tlo_health_snapshots (id, organization_id, tenant_context_id, snapshot_key, snapshot_date, overall_score, trend, summary, status)
values
  ('cc22cc22-cc22-cc22-cc22-cc22cc222201', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'health-daily-0802', '2026-08-02', 88.50, 'improving', 'Strong adoption metrics with minor storage utilization risk', 'active')
on conflict (id) do nothing;

insert into public.tlo_health_dimensions (id, organization_id, tenant_context_id, dimension_key, snapshot_id, dimension_name, score, weight, metrics, status)
values
  ('cc23cc23-cc23-cc23-cc23-cc23cc232301', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'dim-adoption', 'cc22cc22-cc22-cc22-cc22-cc22cc222201', 'Product Adoption', 92.00, 0.30, '{"dau":24,"wau":45,"feature_usage_percent":78}'::jsonb, 'active'),
  ('cc23cc23-cc23-cc23-cc23-cc23cc232302', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'dim-engagement', 'cc22cc22-cc22-cc22-cc22-cc22cc222201', 'User Engagement', 85.00, 0.25, '{"avg_session_minutes":32,"support_tickets_30d":2}'::jsonb, 'active'),
  ('cc23cc23-cc23-cc23-cc23-cc23cc232303', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'dim-technical', 'cc22cc22-cc22-cc22-cc22-cc22cc222201', 'Technical Health', 88.50, 0.25, '{"uptime_percent":99.9,"error_rate":0.02}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.tlo_health_risks (id, organization_id, tenant_context_id, risk_key, risk_type, severity, title, description, detected_at, status)
values
  ('cc24cc24-cc24-cc24-cc24-cc24cc242401', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'risk-storage-util', 'capacity', 'medium', 'Storage Utilization Approaching Quota', 'Primary storage at 25.5% of 500 GB quota — trending upward', '2026-08-01 08:00:00+00', 'open')
on conflict (id) do nothing;

insert into public.tlo_health_scores (id, organization_id, tenant_context_id, score_key, score_type, score_value, previous_value, calculated_at, status)
values
  ('cc25cc25-cc25-cc25-cc25-cc25cc252501', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'score-composite', 'composite', 88.50, 86.00, '2026-08-02 00:00:00+00', 'active'),
  ('cc25cc25-cc25-cc25-cc25-cc25cc252502', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'score-renewal', 'renewal_likelihood', 91.00, 89.00, '2026-08-02 00:00:00+00', 'active')
on conflict (id) do nothing;

insert into public.tlo_success_plans (id, organization_id, tenant_context_id, plan_key, plan_name, objectives, start_date, end_date, status)
values
  ('cc26cc26-cc26-cc26-cc26-cc26cc262601', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'plan-q3-2026', 'Q3 2026 Success Plan', '["achieve_80pct_adoption","deploy_workflow_automation","complete_go_live"]'::jsonb, '2026-07-01', '2026-09-30', 'active')
on conflict (id) do nothing;

insert into public.tlo_quarterly_reviews (id, organization_id, tenant_context_id, review_key, quarter, review_date, attendees, outcomes, next_actions, status)
values
  ('cc27cc27-cc27-cc27-cc27-cc27cc272701', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'qbr-q2-2026', 'Q2 2026', '2026-07-25', '["csm@northstar.example","vp-ops@customer.example"]'::jsonb, '["strong_trial_conversion","workflow_module_adopted"]'::jsonb, '["schedule_go_live","plan_q3_expansion"]'::jsonb, 'completed')
on conflict (id) do nothing;

insert into public.tlo_renewal_plans (id, organization_id, tenant_context_id, renewal_key, contract_end_date, renewal_amount_usd, renewal_probability, strategy, status)
values
  ('cc28cc28-cc28-cc28-cc28-cc28cc282801', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'renewal-2027', '2027-07-15', 52000.00, 91.00, 'Multi-year expansion with analytics upsell and additional seats', 'planning')
on conflict (id) do nothing;

insert into public.tlo_customer_milestones (id, organization_id, tenant_context_id, milestone_key, milestone_name, milestone_type, target_date, achieved_at, success_plan_id, status)
values
  ('cc29cc29-cc29-cc29-cc29-cc29cc292901', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'milestone-first-workflow', 'First Workflow Deployed', 'adoption', '2026-07-20', '2026-07-18 16:00:00+00', 'cc26cc26-cc26-cc26-cc26-cc26cc262601', 'achieved'),
  ('cc29cc29-cc29-cc29-cc29-cc29cc292902', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'milestone-go-live', 'Production Go-Live', 'launch', '2026-08-15', null, 'cc26cc26-cc26-cc26-cc26-cc26cc262601', 'pending')
on conflict (id) do nothing;

insert into public.tlo_commercial_metrics (id, organization_id, metrics_key, metric_date, total_tenants, active_tenants, trial_tenants, churned_tenants, mrr_usd, arr_usd, net_revenue_retention, status)
values
  ('cc30cc30-cc30-cc30-cc30-cc30cc303001', '11111111-1111-1111-1111-111111111111', 'commercial-daily-0802', '2026-08-02', 156, 128, 18, 10, 425000.00, 5100000.00, 112.50, 'active')
on conflict (id) do nothing;

insert into public.tlo_growth_snapshots (id, organization_id, snapshot_key, snapshot_date, new_tenants_30d, expansion_revenue_usd, contraction_revenue_usd, pipeline_value_usd, growth_rate_percent, status)
values
  ('cc31cc31-cc31-cc31-cc31-cc31cc313101', '11111111-1111-1111-1111-111111111111', 'growth-monthly-0802', '2026-08-02', 12, 85000.00, 12000.00, 320000.00, 8.50, 'active')
on conflict (id) do nothing;

insert into public.tlo_expansion_opportunities (id, organization_id, tenant_context_id, opportunity_key, opportunity_type, title, estimated_value_usd, probability, expected_close_date, status)
values
  ('cc32cc32-cc32-cc32-cc32-cc32cc323201', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'expansion-seats', 'upsell', 'Additional 25 User Seats', 15000.00, 75.00, '2026-09-30', 'open'),
  ('cc32cc32-cc32-cc32-cc32-cc32cc323202', '11111111-1111-1111-1111-111111111111', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'expansion-analytics', 'cross_sell', 'Premium Analytics Tier Upgrade', 8000.00, 60.00, '2026-10-15', 'open')
on conflict (id) do nothing;

insert into public.tlo_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('cc000001-cc00-cc00-cc00-cc0000000001', '11111111-1111-1111-1111-111111111111', 'tenant_context', 'cc01cc01-cc01-cc01-cc01-cc01cc010101', 'create', 'Northstar Lifecycle tenant context provisioned with active lifecycle stage', '{"context_key":"northstar-lifecycle","lifecycle_stage":"active"}'::jsonb, 'standard'),
  ('cc000002-cc00-cc00-cc00-cc0000000002', '11111111-1111-1111-1111-111111111111', 'lifecycle_transition', 'cc03cc03-cc03-cc03-cc03-cc03cc030303', 'update', 'Lifecycle transition evaluation to active completed after contract signing', '{"from_stage":"evaluation","to_stage":"active"}'::jsonb, 'elevated'),
  ('cc000003-cc00-cc00-cc00-cc0000000003', '11111111-1111-1111-1111-111111111111', 'operations_control', 'cc09cc09-cc09-cc09-cc09-cc09cc090901', 'update', 'Nightly backup completed successfully — restore point rp-20260802-0200 created', '{"backup_enabled":true,"restore_point_id":"rp-20260802-0200"}'::jsonb, 'restricted')
on conflict (id) do nothing;

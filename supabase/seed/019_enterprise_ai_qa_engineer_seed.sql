insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a305', '11111111-1111-1111-1111-111111111111', 'QA Engineer Agent', 'qa', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["testing","validation","quality"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a505', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a305', 'northstar-qa-001', 'qa_engineer', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"quality assurance validation"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000004', '11111111-1111-1111-1111-111111111111', 'northstar-qa-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a305', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a505', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs","df_outputs"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.qa_engagements (id, organization_id, title, engagement_key, ba_engagement_id, sa_engagement_id, df_engagement_id, brd_id, frs_id, solution_architecture_id, work_package_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform QA Validation', 'northstar-expansion-qa-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a305', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a505', 'cb000001-cb00-cb00-cb00-cb0000000004', 'qa_engineering', 'active', 'QA validation for Northstar platform expansion from BA, SA, and DF deliverables')
on conflict (id) do nothing;

insert into public.qa_test_strategies (id, organization_id, engagement_id, strategy_key, title, scope, approach, test_levels, status)
values
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f20101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'strategy-crm-sync', 'CRM-Project Sync Test Strategy', 'Validate CRM-Project sync API, repository layer, and UI components per DF work package', 'Risk-based testing with unit, integration, and E2E coverage', '["unit","integration","e2e","regression"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_unit_test_plans (id, organization_id, engagement_id, plan_key, name, target_modules, test_cases, status)
values
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f30101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'unit-sync-repo', 'Sync Repository Unit Tests', 'database,sync', '["SyncEventRepository.create","SyncEventRepository.listByOrganization","Sync mapper payload building"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_integration_test_plans (id, organization_id, engagement_id, plan_key, name, integration_points, test_scenarios, status)
values
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f40101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'integration-crm-sync', 'CRM-Project Integration Tests', '["CRM API → Sync Service","Sync Service → Projects Module","Supabase RLS enforcement"]'::jsonb, '["Client update propagates to project within 5 minutes","Sync failure triggers audit log entry"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_e2e_test_plans (id, organization_id, engagement_id, plan_key, name, user_journeys, test_scenarios, status)
values
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f50101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'e2e-crm-admin', 'CRM Admin E2E Tests', '["CRM admin updates client","Project team views synced data"]'::jsonb, '["Update client name in CRM and verify project view","Trigger manual sync and verify status panel"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_regression_analyses (id, organization_id, engagement_id, analysis_key, name, affected_areas, regression_risks, recommendations, status)
values
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f60101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'regression-crm', 'CRM Module Regression Analysis', '["CRM client list","CRM client detail","Project client view"]'::jsonb, 'Existing CRM read paths may be affected by sync event writes', 'Run full CRM regression suite before release', 'draft')
on conflict (id) do nothing;

insert into public.qa_risk_based_tests (id, organization_id, engagement_id, test_key, name, risk_level, risk_factors, test_priority, status)
values
  ('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f70101', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'risk-data-sync', 'Data Sync Integrity Tests', 'high', '["Data loss","Stale reads","RLS bypass"]'::jsonb, 'critical', 'draft')
on conflict (id) do nothing;

insert into public.qa_security_validations (id, organization_id, engagement_id, validation_key, name, security_checks, findings, status)
values
  ('fa000001-fa00-fa00-fa00-fa0000000001', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'sec-sync-api', 'Sync API Security Validation', '["Auth middleware on /api/sync/*","RLS on sync_events table","Input sanitization","Rate limiting"]'::jsonb, 'All security checks passed in design review', 'passed')
on conflict (id) do nothing;

insert into public.qa_performance_validations (id, organization_id, engagement_id, validation_key, name, performance_targets, results, status)
values
  ('fa000002-fa00-fa00-fa00-fa0000000002', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'perf-sync-api', 'Sync API Performance Validation', '[{"endpoint":"/api/sync/client","p95_ms":200},{"endpoint":"/api/sync/status","p95_ms":100}]'::jsonb, 'Pending load test execution', 'pending')
on conflict (id) do nothing;

insert into public.qa_accessibility_validations (id, organization_id, engagement_id, validation_key, name, wcag_level, checks, findings, status)
values
  ('fa000003-fa00-fa00-fa00-fa0000000003', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'a11y-sync-panel', 'Sync Status Panel Accessibility', 'AA', '["Keyboard navigation","ARIA labels","Color contrast","Screen reader compatibility"]'::jsonb, 'Pending accessibility audit', 'pending')
on conflict (id) do nothing;

insert into public.qa_api_validations (id, organization_id, engagement_id, validation_key, name, endpoints, validation_results, status)
values
  ('fa000004-fa00-fa00-fa00-fa0000000004', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'api-crm-sync', 'CRM Sync API Validation', '[{"method":"POST","path":"/api/sync/client"},{"method":"GET","path":"/api/sync/status"}]'::jsonb, 'Contract matches SA API scaffold specification', 'passed')
on conflict (id) do nothing;

insert into public.qa_database_validations (id, organization_id, engagement_id, validation_key, name, schema_checks, data_integrity_checks, status)
values
  ('fa000005-fa00-fa00-fa00-fa0000000005', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'db-sync-events', 'Sync Events Schema Validation', '["sync_events table exists","organization_id indexed","RLS policies applied"]'::jsonb, '["FK integrity to clients and projects","No orphan sync events"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_ui_validations (id, organization_id, engagement_id, validation_key, name, ui_components, validation_results, status)
values
  ('fa000006-fa00-fa00-fa00-fa0000000006', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'ui-sync-panel', 'SyncStatusPanel UI Validation', '["SyncStatusPanel","Sync trigger button","Status indicator"]'::jsonb, 'Component follows enterprise Card and SectionHeader patterns', 'passed')
on conflict (id) do nothing;

insert into public.qa_bug_triages (id, organization_id, engagement_id, bug_key, title, severity, priority, triage_notes, status)
values
  ('fa000007-fa00-fa00-fa00-fa0000000007', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'BUG-001', 'Sync status not updating on client rename', 'medium', 'high', 'Reproducible in staging; affects AC-001 from BA user story US-001', 'open')
on conflict (id) do nothing;

insert into public.qa_defect_analyses (id, organization_id, engagement_id, analysis_key, title, root_cause, impact_analysis, remediation, status)
values
  ('fa000008-fa00-fa00-fa00-fa0000000008', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'defect-sync-lag', 'Sync Status Lag Defect Analysis', 'Event listener not subscribed to CRM update webhook', 'Client name changes not reflected in project view within SLA', 'Add webhook subscription in sync service initialization', 'draft')
on conflict (id) do nothing;

insert into public.qa_coverage_analytics (id, organization_id, engagement_id, analytics_key, name, coverage_metrics, coverage_percent, gaps, status)
values
  ('fa000009-fa00-fa00-fa00-fa0000000009', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'coverage-crm-sync', 'CRM Sync Test Coverage', '[{"area":"repository","percent":85},{"area":"service","percent":72},{"area":"api","percent":90},{"area":"ui","percent":60}]'::jsonb, 76.75, 'UI component tests need expansion; error path coverage incomplete', 'draft')
on conflict (id) do nothing;

insert into public.qa_release_readiness (id, organization_id, engagement_id, assessment_key, title, readiness_criteria, blockers, recommendation, status)
values
  ('fa00000a-fa00-fa00-fa00-fa000000000a', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'readiness-phase1', 'Phase 1 Release Readiness', '["All critical tests pass","Security validation passed","Performance targets met","No open critical bugs"]'::jsonb, '["BUG-001 sync status lag","Performance load test pending"]'::jsonb, 'Not ready for release; resolve blockers before go-live', 'pending')
on conflict (id) do nothing;

insert into public.qa_quality_scores (id, organization_id, engagement_id, score_key, name, overall_score, dimension_scores, status)
values
  ('fa00000b-fa00-fa00-fa00-fa000000000b', '11111111-1111-1111-1111-111111111111', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'quality-phase1', 'Phase 1 Quality Score', 78.50, '[{"dimension":"functional","score":82},{"dimension":"security","score":90},{"dimension":"performance","score":65},{"dimension":"accessibility","score":70},{"dimension":"coverage","score":77}]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.qa_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('fa00000c-fa00-fa00-fa00-fa000000000c', '11111111-1111-1111-1111-111111111111', 'engagement', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'create', 'Northstar Platform QA engagement created from DF handoff'),
  ('fa00000c-fa00-fa00-fa00-fa000000000d', '11111111-1111-1111-1111-111111111111', 'test_strategy', 'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f20101', 'generate', 'CRM-Project sync test strategy generated from BA/SA/DF outputs')
on conflict (id) do nothing;

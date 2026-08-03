insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a304', '11111111-1111-1111-1111-111111111111', 'Development Factory Agent', 'developer', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["codegen","testing","documentation"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a504', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a304', 'northstar-development-001', 'development_factory', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"development factory execution"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000003', '11111111-1111-1111-1111-111111111111', 'northstar-developer-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a304', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a504', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.df_engagements (id, organization_id, title, engagement_key, ba_engagement_id, sa_engagement_id, brd_id, frs_id, solution_architecture_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform Development', 'northstar-expansion-df-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a304', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a504', 'cb000001-cb00-cb00-cb00-cb0000000003', 'development_factory', 'active', 'Development factory engagement for Northstar platform expansion from BA and SA deliverables')
on conflict (id) do nothing;

insert into public.df_work_packages (id, organization_id, engagement_id, package_key, title, description, deliverables, status)
values
  ('e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'wp-crm-sync-001', 'CRM-Project Sync Work Package', 'Implement bidirectional CRM-Project sync per SA architecture and BA FRS FR-001', '["API scaffold","Repository layer","Migration plan","Test scaffolds","Technical docs"]'::jsonb, 'in_progress')
on conflict (id) do nothing;

insert into public.df_backend_workflows (id, organization_id, engagement_id, workflow_key, name, steps, target_modules, status)
values
  ('e3e3e3e3-e3e3-e3e3-e3e3-e3e3e3e30101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'backend-crm-sync', 'CRM Sync Backend Workflow', '["Generate repository","Generate service","Generate API route","Apply migration","Run tests"]'::jsonb, 'crm,projects,database', 'draft')
on conflict (id) do nothing;

insert into public.df_frontend_workflows (id, organization_id, engagement_id, workflow_key, name, steps, target_modules, status)
values
  ('e4e4e4e4-e4e4-e4e4-e4e4-e4e4e4e40101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'frontend-sync-ui', 'Sync Status UI Workflow', '["Generate page component","Generate hook","Generate form panel","Wire to API"]'::jsonb, 'crm,projects', 'draft')
on conflict (id) do nothing;

insert into public.df_api_scaffolds (id, organization_id, engagement_id, scaffold_key, name, endpoints, scaffold_spec, status)
values
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e50101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'api-crm-sync', 'CRM Sync API Scaffold', '[{"method":"POST","path":"/api/sync/client"},{"method":"GET","path":"/api/sync/status"}]'::jsonb, 'Next.js App Router API routes with service layer delegation', 'draft')
on conflict (id) do nothing;

insert into public.df_migration_plans (id, organization_id, engagement_id, plan_key, name, migrations, rollback_notes, status)
values
  ('e6e6e6e6-e6e6-e6e6-e6e6-e6e6e6e60101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'migration-sync-events', 'Sync Events Migration Plan', '[{"file":"202608020019_sync_events.sql","description":"Create sync_events table with RLS"}]'::jsonb, 'Drop sync_events table and remove triggers', 'draft')
on conflict (id) do nothing;

insert into public.df_repositories (id, organization_id, engagement_id, repo_key, name, repo_type, structure, status)
values
  ('e7e7e7e7-e7e7-e7e7-e7e7-e7e7e7e70101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'repo-sync', 'SyncEventRepository', 'repository', '["src/modules/database/repositories/sync-event-repository.ts","src/modules/database/lib/sync-mappers.ts"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.df_components (id, organization_id, engagement_id, component_key, name, component_type, specification, status)
values
  ('e8e8e8e8-e8e8-e8e8-e8e8-e8e8e8e80101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'comp-sync-status', 'SyncStatusPanel', 'ui', 'React component showing CRM-Project sync status with Card and SectionHeader pattern', 'draft')
on conflict (id) do nothing;

insert into public.df_test_scaffolds (id, organization_id, engagement_id, scaffold_key, name, test_type, test_cases, status)
values
  ('e9e9e9e9-e9e9-e9e9-e9e9-e9e9e9e90101', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'test-sync-api', 'CRM Sync API Tests', 'integration', '["POST /api/sync/client returns 200","GET /api/sync/status returns sync state"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.df_coding_standards (id, organization_id, engagement_id, standard_key, name, rules, enforcement_level, status)
values
  ('ea000001-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'std-enterprise', 'Enterprise Coding Standards', '["Use repository pattern","No direct Supabase calls in components","Zod validation on forms","RLS on all new tables"]'::jsonb, 'required', 'active')
on conflict (id) do nothing;

insert into public.df_secure_coding_validations (id, organization_id, engagement_id, validation_key, name, checks, findings, status)
values
  ('ea000002-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'sec-sync-api', 'Sync API Security Validation', '["Input validation","Auth middleware","RLS enforcement","No SQL injection vectors"]'::jsonb, 'All checks passed for scaffold design', 'passed')
on conflict (id) do nothing;

insert into public.df_module_recommendations (id, organization_id, engagement_id, recommendation_key, module_name, platform_module, rationale, status)
values
  ('ea000003-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'rec-crm-reuse', 'CRM Module Extension', 'crm', 'Extend existing CRM repositories rather than building new client module', 'approved')
on conflict (id) do nothing;

insert into public.df_pull_requests (id, organization_id, engagement_id, pr_key, title, description, changed_files, status)
values
  ('ea000004-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'pr-crm-sync-001', 'feat: CRM-Project sync API and repository', 'Implements FR-001 CRM client sync per SA architecture', '["src/modules/crm/services/sync.service.ts","src/modules/database/repositories/sync-event-repository.ts","app/api/sync/client/route.ts"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.df_code_reviews (id, organization_id, engagement_id, review_key, title, checklist, reviewer_id, review_status, comments)
values
  ('ea000005-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'review-crm-sync', 'CRM Sync Code Review', '["Repository pattern followed","RLS applied","Tests included","No secrets in code"]'::jsonb, '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'pending', 'Awaiting senior developer review')
on conflict (id) do nothing;

insert into public.df_technical_docs (id, organization_id, engagement_id, doc_key, title, doc_type, content, status)
values
  ('ea000006-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'doc-crm-sync', 'CRM-Project Sync Technical Documentation', 'technical', 'Technical documentation for CRM-Project sync implementation including API endpoints, data flow, and error handling.', 'draft')
on conflict (id) do nothing;

insert into public.df_progress_tracking (id, organization_id, engagement_id, tracking_key, milestone, progress_percent, notes, status)
values
  ('ea000007-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'progress-sprint1', 'Sprint 1 - API Scaffold', 35.00, 'Work package created, API scaffold and migration plan drafted', 'in_progress')
on conflict (id) do nothing;

insert into public.df_build_artifacts (id, organization_id, engagement_id, artifact_key, name, artifact_type, artifact_path, metadata, status)
values
  ('ea000008-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'artifact-api-scaffold', 'CRM Sync API Scaffold Output', 'scaffold', 'generated/api/sync/', '{"generator":"development_factory","version":"1.0.0"}'::jsonb, 'generated')
on conflict (id) do nothing;

insert into public.df_versions (id, organization_id, engagement_id, entity_type, entity_id, version_number, content, change_summary)
values
  ('ea000009-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'work_package', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', 1, 'Initial work package for CRM-Project sync', 'Created from SA sprint plan and BA user stories')
on conflict (id) do nothing;

insert into public.df_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('ea00000a-ea00-ea00-ea00-ea0000000001', '11111111-1111-1111-1111-111111111111', 'engagement', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'create', 'Northstar Platform Development engagement created from SA handoff'),
  ('ea00000a-ea00-ea00-ea00-ea0000000002', '11111111-1111-1111-1111-111111111111', 'work_package', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', 'generate', 'CRM-Project sync work package generated from BA/SA outputs')
on conflict (id) do nothing;

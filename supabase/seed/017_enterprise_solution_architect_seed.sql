insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a303', '11111111-1111-1111-1111-111111111111', 'Solution Architect Agent', 'architect', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["architecture","design","integration"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a503', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a303', 'northstar-architecture-001', 'solution_architect', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"solution architecture design"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000002', '11111111-1111-1111-1111-111111111111', 'northstar-architect-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a303', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a503', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.sa_engagements (id, organization_id, title, engagement_key, ba_engagement_id, brd_id, frs_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('d1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform Architecture Design', 'northstar-expansion-sa-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a303', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a503', 'cb000001-cb00-cb00-cb00-cb0000000002', 'architecture_design', 'active', 'Solution architecture for Northstar Labs platform expansion based on BA deliverables')
on conflict (id) do nothing;

insert into public.sa_solution_architectures (id, organization_id, engagement_id, title, architecture_type, overview, components, content, status)
values
  ('d2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Northstar Enterprise Platform Architecture', 'enterprise', 'Modular multi-tenant SaaS platform with CRM, Projects, and AI worker pipeline integration.', '["API Gateway","CRM Module","Projects Module","AI Orchestration Layer","Knowledge Engine","Business Analyst Worker","Solution Architect Worker"]'::jsonb, 'Full solution architecture document for Northstar expansion.', 'draft')
on conflict (id) do nothing;

insert into public.sa_system_decompositions (id, organization_id, engagement_id, name, decomposition_key, layers, description, status)
values
  ('d3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d30101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Northstar Layer Decomposition', 'layer-decomp-001', '["Presentation (Next.js App Shell)","Application Services","Domain Modules","Data Access Layer","Supabase PostgreSQL"]'::jsonb, 'Five-layer decomposition for Northstar platform', 'draft')
on conflict (id) do nothing;

insert into public.sa_domain_models (id, organization_id, engagement_id, name, model_key, entities, relationships, description, status)
values
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d40101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Northstar Core Domain', 'core-domain-001', '["Client","Project","Engagement","UserStory","ArchitectureArtifact"]'::jsonb, '[{"from":"Client","to":"Project","type":"has_many"},{"from":"Project","to":"Engagement","type":"has_many"}]'::jsonb, 'Core domain entities for Northstar platform', 'draft')
on conflict (id) do nothing;

insert into public.sa_database_schemas (id, organization_id, engagement_id, name, schema_key, tables, relationships, migration_notes, status)
values
  ('d5d5d5d5-d5d5-d5d5-d5d5-d5d5d5d50101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'CRM-Project Sync Schema', 'db-schema-001', '["clients","projects","client_project_links","sync_events"]'::jsonb, '[{"from":"clients","to":"client_project_links","fk":"client_id"}]'::jsonb, 'Use existing clients and projects tables with new sync_events audit table', 'draft')
on conflict (id) do nothing;

insert into public.sa_api_contracts (id, organization_id, engagement_id, name, contract_key, endpoints, openapi_spec, version, status)
values
  ('d6d6d6d6-d6d6-d6d6-d6d6-d6d6d6d60101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'CRM-Project Sync API', 'api-crm-sync-001', '[{"method":"POST","path":"/api/sync/client","description":"Trigger client sync"},{"method":"GET","path":"/api/sync/status","description":"Get sync status"}]'::jsonb, 'openapi: 3.0.0\ninfo:\n  title: CRM-Project Sync API\n  version: 1.0.0', '1.0.0', 'draft')
on conflict (id) do nothing;

insert into public.sa_module_selections (id, organization_id, engagement_id, module_name, module_key, platform_module, selection_rationale, status)
values
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d70101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'CRM Module', 'mod-crm-001', 'crm', 'Existing CRM module provides client lifecycle management required by FR-001', 'approved'),
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d70202', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Projects Module', 'mod-projects-001', 'projects', 'Existing Projects module supports milestone tracking for FR-002', 'approved'),
  ('d7d7d7d7-d7d7-d7d7-d7d7-d7d7d7d70303', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'AI Orchestration', 'mod-ai-001', 'ai-orchestration', 'Required for AI worker pipeline execution', 'approved')
on conflict (id) do nothing;

insert into public.sa_build_reuse_recommendations (id, organization_id, engagement_id, item_key, component_name, recommendation, rationale, status)
values
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d80101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'BR-001', 'CRM Client Sync', 'reuse', 'Existing CRM and Projects modules with repository pattern can be extended', 'approved'),
  ('d8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d80202', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'BR-002', 'Training Module', 'build', 'No existing training module in platform; new module required for US-002', 'draft')
on conflict (id) do nothing;

insert into public.sa_integration_plans (id, organization_id, engagement_id, name, plan_key, integrations, data_flow, status)
values
  ('d9d9d9d9-d9d9-d9d9-d9d9-d9d9d9d90101', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'CRM-Project Integration Plan', 'integration-001', '["CRM → Projects (client sync)","Projects → CRM (status updates)","AI Orchestration → All modules (task execution)"]'::jsonb, 'Event-driven sync via Supabase realtime and service layer callbacks', 'draft')
on conflict (id) do nothing;

insert into public.sa_security_architectures (id, organization_id, engagement_id, name, security_key, auth_model, encryption, controls, status)
values
  ('da000001-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Northstar Security Architecture', 'sec-arch-001', 'Supabase Auth with JWT + RLS organization scoping', 'TLS in transit, AES-256 at rest via Supabase', '["RLS on all tables","is_organization_member policies","API key rotation","Audit logging"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.sa_scalability_plans (id, organization_id, engagement_id, name, plan_key, scaling_strategy, targets, status)
values
  ('da000002-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Horizontal Scaling Plan', 'scale-001', 'Serverless Next.js on Vercel + Supabase connection pooling + read replicas', '[{"metric":"concurrent_users","target":10000},{"metric":"api_rps","target":500}]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.sa_performance_plans (id, organization_id, engagement_id, name, plan_key, performance_targets, optimization_notes, status)
values
  ('da000003-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'API Performance Plan', 'perf-001', '[{"endpoint":"/api/sync/client","p95_ms":200},{"endpoint":"/dashboard","p95_ms":500}]'::jsonb, 'Use parallel Promise.all in service layer, index organization_id on all tables', 'draft')
on conflict (id) do nothing;

insert into public.sa_technology_decisions (id, organization_id, engagement_id, decision_key, title, context, decision, consequences, status)
values
  ('da000004-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'TDR-001', 'Use Supabase for CRM-Project Sync Events', 'Need real-time sync with audit trail for FR-001', 'Store sync events in Supabase with RLS and use database triggers for audit', 'Positive: consistent with platform. Negative: adds one new table per sync type.', 'approved')
on conflict (id) do nothing;

insert into public.sa_deployment_architectures (id, organization_id, engagement_id, name, deployment_key, environments, infrastructure, status)
values
  ('da000005-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'Northstar Deployment Architecture', 'deploy-001', '["development","staging","production"]'::jsonb, 'Vercel (frontend) + Supabase (backend) + GitHub Actions CI/CD', 'draft')
on conflict (id) do nothing;

insert into public.sa_sprint_plans (id, organization_id, engagement_id, plan_key, name, sprints, total_sprints, status)
values
  ('da000006-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'sprint-plan-001', 'Northstar Implementation Sprints', '[{"sprint":1,"focus":"CRM-Project sync API","days":14},{"sprint":2,"focus":"Training module foundation","days":14},{"sprint":3,"focus":"Integration testing","days":7}]'::jsonb, 3, 'draft')
on conflict (id) do nothing;

insert into public.sa_dependency_analyses (id, organization_id, engagement_id, analysis_key, dependencies, critical_path, status)
values
  ('da000007-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'dep-analysis-001', '["CRM module (existing)","Projects module (existing)","sync_events table (new)","AI Orchestration SDK (existing)"]'::jsonb, 'CRM-Project sync API → Integration testing → Training module', 'draft')
on conflict (id) do nothing;

insert into public.sa_architecture_reviews (id, organization_id, engagement_id, entity_type, entity_id, reviewer_id, review_status, comments, reviewed_at)
values
  ('da000008-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'solution_architecture', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'pending', 'Awaiting architecture review board approval', null)
on conflict (id) do nothing;

insert into public.sa_architecture_versions (id, organization_id, engagement_id, entity_type, entity_id, version_number, content, change_summary)
values
  ('da000009-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'solution_architecture', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 1, 'Initial solution architecture for Northstar expansion', 'Created from BA BRD and FRS deliverables')
on conflict (id) do nothing;

insert into public.sa_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('da00000a-da00-da00-da00-da0000000001', '11111111-1111-1111-1111-111111111111', 'engagement', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'create', 'Northstar Platform Architecture engagement created from BA handoff'),
  ('da00000a-da00-da00-da00-da0000000002', '11111111-1111-1111-1111-111111111111', 'solution_architecture', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 'generate', 'Solution architecture generated from BA requirements')
on conflict (id) do nothing;

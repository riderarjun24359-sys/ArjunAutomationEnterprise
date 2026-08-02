insert into public.knowledge_entries (id, organization_id, title, slug, content, category, status, tags, client_id, project_id, current_version)
values
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '11111111-1111-1111-1111-111111111111', 'Northstar Client Profile', 'northstar-client-profile', 'Northstar Labs is a Series B SaaS company focused on workflow automation with expansion plans in Q4 2026.', 'client', 'published', '["crm","client","expansion"]'::jsonb, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', null, 1),
  ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10202', '11111111-1111-1111-1111-111111111111', 'Northstar Expansion Project Context', 'northstar-expansion-context', 'Northstar Expansion project includes platform migration, API integration, and training deliverables.', 'project', 'published', '["projects","delivery"]'::jsonb, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 1)
on conflict (id) do nothing;

insert into public.knowledge_semantic_index (id, organization_id, entry_id, embedding_key, search_text)
values
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c20101', '11111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', 'emb-northstar-profile', 'Northstar Labs Series B SaaS workflow automation expansion Q4 2026'),
  ('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c20202', '11111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10202', 'emb-northstar-project', 'Northstar Expansion platform migration API integration training deliverables')
on conflict (id) do nothing;

insert into public.knowledge_solutions (id, organization_id, name, problem_statement, solution_summary, implementation_notes, category, status)
values
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c30101', '11111111-1111-1111-1111-111111111111', 'Enterprise Client Onboarding Playbook', 'New enterprise clients require structured onboarding', 'Use phased onboarding with CRM, project, and knowledge memory setup', 'Link client memory to AI context for analyst agents', 'onboarding', 'active'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c30202', '11111111-1111-1111-1111-111111111111', 'Supabase RLS Org Pattern', 'Multi-tenant data isolation required', 'Use is_organization_member loop policies on all org-scoped tables', 'Apply to every new module migration', 'architecture', 'active')
on conflict (id) do nothing;

insert into public.knowledge_adrs (id, organization_id, adr_number, title, status, context, decision, consequences)
values
  ('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c40101', '11111111-1111-1111-1111-111111111111', 1, 'Modular Enterprise Architecture', 'accepted', 'Need scalable module boundaries for enterprise OS', 'Each domain gets migration, seed, module, service, hook, and UI', 'Consistent sprint delivery, clear ownership'),
  ('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c40202', '11111111-1111-1111-1111-111111111111', 2, 'AI Orchestration as Infrastructure Layer', 'accepted', 'AI capabilities must not be chat-only features', 'All AI modules consume ai-orchestration SDK and knowledge engine', 'Unified routing, context, and memory')
on conflict (id) do nothing;

insert into public.knowledge_prompt_base (id, organization_id, name, prompt_key, category, content, use_cases, status)
values
  ('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c50101', '11111111-1111-1111-1111-111111111111', 'Client Context Injection', 'knowledge.client.context', 'crm', 'Use the following client memory: {{client_memory}}. Answer based on permanent knowledge.', '["analysis","support","sales"]'::jsonb, 'active'),
  ('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c50202', '11111111-1111-1111-1111-111111111111', 'Project Delivery Context', 'knowledge.project.context', 'projects', 'Project memory: {{project_memory}}. Consider deliverables and timeline.', '["pm","architect","qa"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.knowledge_project_memory (id, organization_id, project_id, memory_key, summary, details, context)
values
  ('c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c60101', '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'delivery-status', 'Phase 2 migration in progress', 'API integration complete, training scheduled for August 2026', '{"phase":2,"risk":"low"}'::jsonb)
on conflict (id) do nothing;

insert into public.knowledge_client_memory (id, organization_id, client_id, memory_key, summary, details, context)
values
  ('c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c70101', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'relationship-summary', 'Strategic enterprise client since 2024', 'Primary contact Mina Park, expansion opportunity in platform services', '{"tier":"enterprise","health":"strong"}'::jsonb)
on conflict (id) do nothing;

insert into public.knowledge_components (id, organization_id, name, component_type, description, usage_guidelines, status)
values
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c80101', '11111111-1111-1111-1111-111111111111', 'StatCard', 'ui', 'Dashboard metric display card with trend indicator', 'Use in module overview stats sections with 4-column grid', 'active'),
  ('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c80202', '11111111-1111-1111-1111-111111111111', 'SectionHeader', 'ui', 'Panel section title with description', 'Pair with Card hover wrapper in tab panels', 'active')
on conflict (id) do nothing;

insert into public.knowledge_patterns (id, organization_id, name, pattern_type, description, when_to_use, status)
values
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c90101', '11111111-1111-1111-1111-111111111111', 'Org-Scoped Repository', 'data-access', 'BaseRepository with listByOrganization for all domain tables', 'Every new enterprise module with Supabase tables', 'active'),
  ('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c90202', '11111111-1111-1111-1111-111111111111', 'Service-Hook-Panel UI', 'frontend', 'Service layer, useHook parallel fetch, tabbed Panels', 'All enterprise module UIs', 'active')
on conflict (id) do nothing;

insert into public.knowledge_documentation (id, organization_id, title, doc_key, module_source, content, status)
values
  ('ca000001-ca00-ca00-ca00-ca0000000001', '11111111-1111-1111-1111-111111111111', 'AI Orchestration Integration Guide', 'docs.ai.integration', 'ai', 'All AI capabilities must use createAiOrchestrationClient and knowledge SDK for context.', 'published'),
  ('ca000001-ca00-ca00-ca00-ca0000000002', '11111111-1111-1111-1111-111111111111', 'Knowledge Engine Overview', 'docs.knowledge.overview', 'knowledge', 'Permanent knowledge system for entries, memory, patterns, and AI context.', 'published')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000001', '11111111-1111-1111-1111-111111111111', 'northstar-analyst-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.knowledge_versions (id, organization_id, entry_id, version_number, content, change_summary)
values
  ('cc000001-cc00-cc00-cc00-cc0000000001', '11111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', 1, 'Northstar Labs is a Series B SaaS company focused on workflow automation.', 'Initial version')
on conflict (id) do nothing;

insert into public.knowledge_analytics (id, organization_id, metric_key, metric_value, dimensions, period_start, period_end, computed_at)
values
  ('cd000001-cd00-cd00-cd00-cd0000000001', '11111111-1111-1111-1111-111111111111', 'entries.total', 2, '{"category":"all"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00'),
  ('cd000001-cd00-cd00-cd00-cd0000000002', '11111111-1111-1111-1111-111111111111', 'searches.indexed', 2, '{"type":"semantic"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00')
on conflict (id) do nothing;

insert into public.knowledge_permissions (id, organization_id, grantee_type, grantee_id, permission_key, resource_type, resource_id, is_active)
values
  ('ce000001-ce00-ce00-ce00-ce0000000001', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'knowledge.manage', 'all', null, true),
  ('ce000001-ce00-ce00-ce00-ce0000000002', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'knowledge.view', 'entry', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', true)
on conflict (id) do nothing;

insert into public.knowledge_cross_links (id, organization_id, source_module, source_entity_type, source_entity_id, entry_id, link_type)
values
  ('cf000001-cf00-cf00-cf00-cf0000000001', '11111111-1111-1111-1111-111111111111', 'crm', 'client', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', 'reference'),
  ('cf000001-cf00-cf00-cf00-cf0000000002', '11111111-1111-1111-1111-111111111111', 'projects', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10202', 'reference'),
  ('cf000001-cf00-cf00-cf00-cf0000000003', '11111111-1111-1111-1111-111111111111', 'ai', 'session', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', 'context')
on conflict (id) do nothing;

insert into public.knowledge_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('d0000001-d000-d000-d000-d00000000001', '11111111-1111-1111-1111-111111111111', 'entry', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', 'create', 'Northstar Client Profile knowledge entry created'),
  ('d0000001-d000-d000-d000-d00000000002', '11111111-1111-1111-1111-111111111111', 'context', 'cb000001-cb00-cb00-cb00-cb0000000001', 'link', 'AI context linked to analyst session')
on conflict (id) do nothing;

insert into public.ai_providers (id, organization_id, name, provider_key, api_base_url, status, is_default, config)
values
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', '11111111-1111-1111-1111-111111111111', 'OpenAI Production', 'openai', 'https://api.openai.com/v1', 'active', true, '{"region":"us-east-1"}'::jsonb),
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', '11111111-1111-1111-1111-111111111111', 'Anthropic Enterprise', 'anthropic', 'https://api.anthropic.com/v1', 'active', false, '{"region":"us-west-2"}'::jsonb)
on conflict (id) do nothing;

insert into public.ai_model_routes (id, organization_id, name, provider_id, model_id, priority, routing_strategy, fallback_provider_id, is_active)
values
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '11111111-1111-1111-1111-111111111111', 'Primary GPT-4o Route', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'gpt-4o', 1, 'priority', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', true),
  ('a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a202', '11111111-1111-1111-1111-111111111111', 'Claude Sonnet Fallback', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', 'claude-sonnet-4', 2, 'fallback', null, true)
on conflict (id) do nothing;

insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', '11111111-1111-1111-1111-111111111111', 'Business Analyst Agent', 'analyst', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["analysis","reporting","crm"]'::jsonb, 'active'),
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', '11111111-1111-1111-1111-111111111111', 'Operations Orchestrator', 'operations', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["automation","tasks","projects"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_prompt_templates (id, organization_id, name, template_key, category, content, variables, version, status)
values
  ('a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a401', '11111111-1111-1111-1111-111111111111', 'CRM Analysis Prompt', 'crm.analysis', 'crm', 'Analyze client {{client_name}} with context: {{context}}. Provide actionable insights.', '["client_name","context"]'::jsonb, 1, 'active'),
  ('a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a402', '11111111-1111-1111-1111-111111111111', 'Project Risk Assessment', 'projects.risk', 'projects', 'Assess project {{project_name}} risks based on: {{deliverables}}.', '["project_name","deliverables"]'::jsonb, 1, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'crm-northstar-analysis-001', 'crm', 'client', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '{"objective":"expansion analysis"}'::jsonb, 'active', '2026-12-31 23:59:59+00'),
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a502', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', 'projects-delivery-001', 'projects', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"delivery optimization"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.ai_task_executions (id, organization_id, agent_id, session_id, provider_id, task_type, input_payload, output_payload, status, model_used, tokens_used, duration_ms, completed_at)
values
  ('a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a501', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'analysis', '{"prompt":"Analyze Northstar expansion"}'::jsonb, '{"summary":"Strong expansion potential"}'::jsonb, 'completed', 'gpt-4o', 1842, 2340, '2026-08-01 10:00:00+00'),
  ('a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a602', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a502', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'orchestration', '{"prompt":"Optimize delivery timeline"}'::jsonb, '{}'::jsonb, 'pending', 'gpt-4o', 0, 0, null)
on conflict (id) do nothing;

insert into public.ai_usage_records (id, organization_id, provider_id, agent_id, task_execution_id, tokens_input, tokens_output, request_count, recorded_at)
values
  ('a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a701', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', 1200, 642, 1, '2026-08-01 10:00:00+00'),
  ('a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a702', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a302', null, 450, 210, 1, '2026-08-01 11:00:00+00')
on conflict (id) do nothing;

insert into public.ai_cost_records (id, organization_id, provider_id, usage_record_id, cost_usd, pricing_model, recorded_at)
values
  ('a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a801', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a701', 0.018420, 'token', '2026-08-01 10:00:00+00'),
  ('a8a8a8a8-a8a8-a8a8-a8a8-a8a8a8a8a802', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a7a7a7a7-a7a7-a7a7-a7a7-a7a7a7a7a702', 0.006600, 'token', '2026-08-01 11:00:00+00')
on conflict (id) do nothing;

insert into public.ai_rate_limits (id, organization_id, scope_type, scope_id, requests_per_minute, tokens_per_day, is_active)
values
  ('a9a9a9a9-a9a9-a9a9-a9a9-a9a9a9a9a901', '11111111-1111-1111-1111-111111111111', 'organization', null, 120, 2000000, true),
  ('a9a9a9a9-a9a9-a9a9-a9a9-a9a9a9a9a902', '11111111-1111-1111-1111-111111111111', 'agent', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', 30, 500000, true)
on conflict (id) do nothing;

insert into public.ai_permission_grants (id, organization_id, grantee_type, grantee_id, permission_key, resource_type, resource_id, is_active)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaab101', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c01', 'ai.execute', 'agent', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a301', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaab102', '11111111-1111-1111-1111-111111111111', 'employee', '7c7c7c7c-7c7c-7c7c-7c7c-7c7c7c7c7c02', 'ai.manage', 'all', null, true)
on conflict (id) do nothing;

insert into public.ai_provider_health_checks (id, organization_id, provider_id, status, latency_ms, error_message, last_checked_at)
values
  ('abababab-abab-abab-abab-ababababab01', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'healthy', 142, '', '2026-08-01 12:00:00+00'),
  ('abababab-abab-abab-abab-ababababab02', '11111111-1111-1111-1111-111111111111', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a102', 'degraded', 890, 'Elevated latency detected', '2026-08-01 12:00:00+00')
on conflict (id) do nothing;

insert into public.ai_retry_policies (id, organization_id, name, max_retries, backoff_strategy, fallback_route_id, is_active)
values
  ('acacacac-acac-acac-acac-acacacacac01', '11111111-1111-1111-1111-111111111111', 'Default Retry with Claude Fallback', 3, 'exponential', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a202', true)
on conflict (id) do nothing;

insert into public.ai_orchestration_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('adadadad-adad-adad-adad-adadadadad01', '11111111-1111-1111-1111-111111111111', 'provider', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'create', 'OpenAI Production provider registered'),
  ('adadadad-adad-adad-adad-adadadadad02', '11111111-1111-1111-1111-111111111111', 'task', 'a6a6a6a6-a6a6-a6a6-a6a6-a6a6a6a6a601', 'execute', 'CRM analysis task completed successfully')
on conflict (id) do nothing;

insert into public.ai_orchestration_analytics (id, organization_id, metric_key, metric_value, dimensions, period_start, period_end, computed_at)
values
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae01', '11111111-1111-1111-1111-111111111111', 'tasks.completed', 1, '{"module":"crm"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00'),
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae02', '11111111-1111-1111-1111-111111111111', 'tokens.total', 2502, '{"provider":"openai"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00'),
  ('aeaeaeae-aeae-aeae-aeae-aeaeaeaeae03', '11111111-1111-1111-1111-111111111111', 'cost.usd', 0.025020, '{"provider":"openai"}'::jsonb, '2026-08-01 00:00:00+00', '2026-08-01 23:59:59+00', '2026-08-01 12:00:00+00')
on conflict (id) do nothing;

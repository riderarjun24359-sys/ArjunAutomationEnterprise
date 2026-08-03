insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a310', '11111111-1111-1111-1111-111111111111', 'Autonomous Company Orchestrator', 'autonomous_company', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["workflow_orchestration","event_bus","worker_collaboration","executive_insights","security_governance"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a510', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a310', 'northstar-ac-001', 'autonomous_company', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"autonomous company orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000009', '11111111-1111-1111-1111-111111111111', 'northstar-ac-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a310', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a510', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs","df_outputs","qa_outputs","dd_outputs","cs_outputs","fo_outputs","finance_context"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_company_contexts (id, organization_id, title, context_key, ba_engagement_id, sa_engagement_id, df_engagement_id, qa_engagement_id, dd_engagement_id, cs_engagement_id, fo_workspace_id, client_id, project_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('ac01ac01-ac01-ac01-ac01-ac01ac010101', '11111111-1111-1111-1111-111111111111', 'Northstar Autonomous Company v1', 'northstar-autonomous-company-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'c501c501-c501-c501-c501-c501c5010101', 'f001f001-f001-f001-f001-f001f0010101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a310', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a510', 'cb000001-cb00-cb00-cb00-cb0000000009', 'autonomous_company', 'active', 'Autonomous company orchestration layer unifying Founder OS, all AI workers, and enterprise modules for continuous operations')
on conflict (id) do nothing;

insert into public.ac_workflow_orchestrations (id, organization_id, context_id, orchestration_key, name, workflow_definition, participating_modules, status)
values
  ('ac02ac02-ac02-ac02-ac02-ac02ac020201', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'orchestration-northstar', 'Northstar Cross-Module Orchestration', '[{"step":"founder_os_handoff","module":"founder_os"},{"step":"worker_sync","module":"ai_workers"},{"step":"continuous_ops","module":"autonomous_company"}]'::jsonb, '["founder_os","business_analyst","solution_architect","development_factory","qa_engineering","devops_deployment","customer_success","autonomous_company"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_event_bus_events (id, organization_id, context_id, event_key, name, source_module, target_modules, payload_schema, status)
values
  ('ac03ac03-ac03-ac03-ac03-ac03ac030301', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'event-founder-handoff', 'Founder OS Strategic Handoff', 'founder_os', '["autonomous_company","business_analyst","customer_success"]'::jsonb, '{"type":"object","properties":{"workspaceId":{"type":"string"},"pipelineStage":{"type":"string"}}}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_worker_collaborations (id, organization_id, context_id, collaboration_key, name, participating_workers, handoff_rules, status)
values
  ('ac04ac04-ac04-ac04-ac04-ac04ac040401', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'collab-all-workers', 'Full AI Worker Collaboration Mesh', '["business_analyst","solution_architect","development_factory","qa_engineering","devops_deployment","customer_success","founder_os"]'::jsonb, '[{"from":"business_analyst","to":"solution_architect","trigger":"requirements_complete"},{"from":"solution_architect","to":"development_factory","trigger":"architecture_approved"},{"from":"development_factory","to":"qa_engineering","trigger":"build_complete"},{"from":"qa_engineering","to":"devops_deployment","trigger":"qa_passed"},{"from":"devops_deployment","to":"customer_success","trigger":"deployment_complete"},{"from":"customer_success","to":"founder_os","trigger":"expansion_ready"},{"from":"founder_os","to":"autonomous_company","trigger":"strategic_execution"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_approval_workflows (id, organization_id, context_id, workflow_key, title, approval_steps, required_role, status)
values
  ('ac05ac05-ac05-ac05-ac05-ac05ac050501', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'approval-orchestration', 'Cross-Module Orchestration Approval', '[{"step":1,"role":"admin","action":"review_orchestration"},{"step":2,"role":"ac.approve","action":"authorize_execution"}]'::jsonb, 'admin', 'pending')
on conflict (id) do nothing;

insert into public.ac_notification_center (id, organization_id, context_id, notification_key, title, channel, priority, message, status)
values
  ('ac06ac06-ac06-ac06-ac06-ac06ac060601', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'notif-orchestration-ready', 'Autonomous Company Orchestration Ready', 'in_app', 'high', 'Founder OS handoff complete. Autonomous Company v1 orchestration layer is active for Northstar.', 'unread')
on conflict (id) do nothing;

insert into public.ac_company_timeline (id, organization_id, context_id, timeline_key, title, event_type, event_at, metadata, status)
values
  ('ac07ac07-ac07-ac07-ac07-ac07ac070701', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'timeline-ac-launch', 'Autonomous Company v1 Activated', 'milestone', '2026-08-02 00:23:00+00', '{"source":"founder_os","pipeline":"continuous_operations"}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_activity_feed (id, organization_id, context_id, feed_key, actor_type, actor_name, action, resource_type, resource_id, summary)
values
  ('ac08ac08-ac08-ac08-ac08-ac08ac080801', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'feed-context-created', 'system', 'Autonomous Company Orchestrator', 'create', 'company_context', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'Northstar Autonomous Company v1 context created from Founder OS workspace handoff')
on conflict (id) do nothing;

insert into public.ac_cross_module_automations (id, organization_id, context_id, automation_key, name, trigger_module, action_modules, conditions, status)
values
  ('ac09ac09-ac09-ac09-ac09-ac09ac090901', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'automation-fo-sync', 'Founder OS to Autonomous Company Sync', 'founder_os', '["autonomous_company","knowledge","ai_orchestration"]'::jsonb, '[{"field":"pipeline_stage","operator":"equals","value":"founder_operating_system"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_executive_insights (id, organization_id, context_id, insight_key, title, insight_type, content, metrics, status)
values
  ('ac0aac0a-ac0a-ac0a-ac0a-ac0aac0a0a01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'insight-orchestration', 'Unified Orchestration Readiness', 'summary', 'All six AI workers and Founder OS are synchronized. Cross-module event bus active with 98% module coverage.', '[{"metric":"worker_sync","value":100},{"metric":"module_coverage","value":98}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_predictive_recommendations (id, organization_id, context_id, recommendation_key, title, recommendation_type, confidence_score, recommendation, status)
values
  ('ac0bac0b-ac0b-ac0b-ac0b-ac0bac0b0b01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'rec-continuous-ops', 'Enable Continuous Operations Mode', 'operational', 91.50, 'Activate automated cross-module handoffs from Founder OS insights to customer success expansion workflows within 48 hours of board report generation.', 'active')
on conflict (id) do nothing;

insert into public.ac_system_search (id, organization_id, context_id, search_key, resource_type, resource_id, title, keywords, module_source, status)
values
  ('ac0cac0c-ac0c-ac0c-ac0c-ac0cac0c0c01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'search-orchestration', 'workflow_orchestration', 'ac02ac02-ac02-ac02-ac02-ac02ac020201', 'Northstar Cross-Module Orchestration', 'orchestration founder os ai workers continuous operations', 'autonomous_company', 'indexed')
on conflict (id) do nothing;

insert into public.ac_command_palette (id, organization_id, context_id, command_key, label, action_type, target_path, shortcut, status)
values
  ('ac0dac0d-ac0d-ac0d-ac0d-ac0dac0d0d01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'cmd-orchestration', 'Open Orchestration Dashboard', 'navigate', '/autonomous-company', 'Ctrl+Shift+A', 'active')
on conflict (id) do nothing;

insert into public.ac_emergency_workflows (id, organization_id, context_id, workflow_key, name, severity, response_steps, escalation_contacts, status)
values
  ('ac0eac0e-ac0e-ac0e-ac0e-ac0eac0e0e01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'emergency-module-failure', 'Critical Module Failure Response', 'critical', '["isolate_module","notify_admin","activate_fallback","audit_log"]'::jsonb, '[{"role":"admin","channel":"in_app"},{"role":"ac.admin","channel":"email"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_business_kpis (id, organization_id, context_id, kpi_key, name, kpi_category, current_value, target_value, unit, status)
values
  ('ac0fac0f-ac0f-ac0f-ac0f-ac0fac0f0f01', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'kpi-orchestration-uptime', 'Orchestration Layer Uptime', 'operational', 99.9500, 99.9900, 'percent', 'active')
on conflict (id) do nothing;

insert into public.ac_security_governance (id, organization_id, context_id, governance_key, name, control_area, controls, compliance_status, status)
values
  ('ac10ac10-ac10-ac10-ac10-ac10ac101001', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'gov-access-control', 'Orchestration Access Control', 'access', '[{"control":"rls_enabled","status":"active"},{"control":"org_membership","status":"active"},{"control":"ac_permissions","status":"active"}]'::jsonb, 'compliant', 'active')
on conflict (id) do nothing;

insert into public.ac_compliance_dashboards (id, organization_id, context_id, dashboard_key, name, framework, requirements, compliance_percent, status)
values
  ('ac11ac11-ac11-ac11-ac11-ac11ac111101', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'compliance-soc2', 'SOC 2 Orchestration Compliance', 'soc2', '["access_control","audit_logging","data_isolation","change_management"]'::jsonb, 94.50, 'active')
on conflict (id) do nothing;

insert into public.ac_operational_health (id, organization_id, context_id, health_key, name, overall_score, dimension_scores, status)
values
  ('ac12ac12-ac12-ac12-ac12-ac12ac121201', '11111111-1111-1111-1111-111111111111', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'health-overall', 'Northstar Operational Health', 92.75, '[{"dimension":"orchestration","score":95},{"dimension":"security","score":94},{"dimension":"worker_sync","score":90},{"dimension":"compliance","score":92}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ac_audit_logs (id, organization_id, entity_type, entity_id, action, summary, metadata, security_level)
values
  ('ac000001-ac00-ac00-ac00-ac0000000001', '11111111-1111-1111-1111-111111111111', 'company_context', 'ac01ac01-ac01-ac01-ac01-ac01ac010101', 'create', 'Northstar Autonomous Company v1 context created from Founder OS handoff', '{"source":"founder_os","fo_workspace_id":"f001f001-f001-f001-f001-f001f0010101"}'::jsonb, 'standard'),
  ('ac000002-ac00-ac00-ac00-ac0000000002', '11111111-1111-1111-1111-111111111111', 'worker_collaboration', 'ac04ac04-ac04-ac04-ac04-ac04ac040401', 'activate', 'Full AI worker collaboration mesh activated with Founder OS integration', '{"workers":["business_analyst","solution_architect","development_factory","qa_engineering","devops_deployment","customer_success","founder_os"]}'::jsonb, 'elevated')
on conflict (id) do nothing;

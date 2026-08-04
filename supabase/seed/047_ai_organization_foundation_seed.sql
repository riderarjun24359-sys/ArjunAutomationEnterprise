insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a347', '11111111-1111-1111-1111-111111111111', 'AI Organization Foundation Orchestrator', 'ai_organization_foundation', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["ago","ado","aio","orchestration","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a547', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a347', 'northstar-ai-organization-001', 'ai_organization_foundation', 'organization_hub', '00770077-0077-0077-0077-007700770101', '{"objective":"Unified AI organization foundation AGO, ADO, AIO, and orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- G0 Organization Hub
insert into public.aof_organization_hubs (id, organization_id, hub_key, hub_name, environment, organization_tier, status)
values ('00770077-0077-0077-0077-007700770101', '11111111-1111-1111-1111-111111111111', 'northstar-ai-organization', 'Northstar AI Organization Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- G1 AGO
insert into public.aof_growth_orchestrators (id, organization_id, hub_id, orchestrator_key, orchestrator_name, orchestrator_status, status)
values ('04900100-0490-0490-0490-049001000101', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'ago-growth-0907', 'Growth Orchestrator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_campaign_intelligence (id, organization_id, hub_id, campaign_key, campaign_name, campaign_status, status)
values ('04910101-0491-0491-0491-049101010201', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'campaign-intel-0907', 'Campaign Intelligence', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_lead_prioritization (id, organization_id, hub_id, lead_key, lead_name, priority_score, status)
values ('04920102-0492-0492-0492-049201020301', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'lead-priority-0907', 'Lead Prioritization', 85.00, 'active')
on conflict (id) do nothing;

insert into public.aof_opportunity_recommendations (id, organization_id, hub_id, recommendation_key, recommendation_title, recommendation_type, status)
values ('04930103-0493-0493-0493-049301030401', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'opp-rec-0907', 'Enterprise Upsell Opportunity', 'upsell', 'active')
on conflict (id) do nothing;

insert into public.aof_pipeline_health (id, organization_id, hub_id, health_key, health_name, health_score, status)
values ('04940104-0494-0494-0494-049401040501', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'pipeline-health-0907', 'Pipeline Health', 92.50, 'active')
on conflict (id) do nothing;

insert into public.aof_growth_analytics (id, organization_id, hub_id, analytics_key, analytics_name, analytics_type, status)
values ('04950105-0495-0495-0495-049501050601', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'growth-analytics-0907', 'Growth Analytics', 'conversion', 'active')
on conflict (id) do nothing;

insert into public.aof_executive_growth_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('04960106-0496-0496-0496-049601060701', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'dash-growth-0907', 'Executive Growth Dashboard', 'active', 'active')
on conflict (id) do nothing;

-- G2 ADO
insert into public.aof_delivery_orchestrators (id, organization_id, hub_id, orchestrator_key, orchestrator_name, orchestrator_status, status)
values ('04970107-0497-0497-0497-049701070801', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'ado-delivery-0907', 'Delivery Orchestrator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_resource_planners (id, organization_id, hub_id, planner_key, planner_name, planner_status, status)
values ('04980108-0498-0498-0498-049801080901', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'resource-plan-0907', 'Resource Planner', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_implementation_schedulers (id, organization_id, hub_id, scheduler_key, scheduler_name, scheduler_status, status)
values ('04990109-0499-0499-0499-049901090a01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'impl-sched-0907', 'Implementation Scheduler', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_deployment_coordination (id, organization_id, hub_id, coordination_key, coordination_name, coordination_status, status)
values ('049a010a-049a-049a-049a-049a010a0b01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'deploy-coord-0907', 'Deployment Coordination', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_delivery_intelligence (id, organization_id, hub_id, intelligence_key, intelligence_title, intelligence_type, status)
values ('049b010b-049b-049b-049b-049b010b0c01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'delivery-intel-0907', 'Delivery Intelligence Insight', 'delivery', 'active')
on conflict (id) do nothing;

insert into public.aof_customer_success_automation (id, organization_id, hub_id, automation_key, automation_name, automation_status, status)
values ('049c010c-049c-049c-049c-049c010c0d01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'cs-auto-0907', 'Customer Success Automation', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_executive_delivery_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('049d010d-049d-049d-049d-049d010d0e01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'dash-delivery-0907', 'Executive Delivery Dashboard', 'active', 'active')
on conflict (id) do nothing;

-- G3 AIO
insert into public.aof_idea_registry (id, organization_id, hub_id, idea_key, idea_title, idea_status, status)
values ('049e010e-049e-049e-049e-049e010e0f01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'idea-reg-0907', 'AI Product Innovation Idea', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_innovation_pipeline (id, organization_id, hub_id, pipeline_key, pipeline_name, pipeline_status, status)
values ('049f010f-049f-049f-049f-049f010f1001', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'innov-pipe-0907', 'Innovation Pipeline', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_experiment_tracker (id, organization_id, hub_id, experiment_key, experiment_name, experiment_status, status)
values ('04a00110-04a0-04a0-04a0-04a001101101', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'exp-track-0907', 'Experiment Tracker', 'running', 'active')
on conflict (id) do nothing;

insert into public.aof_validation_workflow (id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)
values ('04a10111-04a1-04a1-04a1-04a101111201', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'valid-work-0907', 'Validation Workflow', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_outcome_evaluation (id, organization_id, hub_id, evaluation_key, evaluation_title, evaluation_score, status)
values ('04a20112-04a2-04a2-04a2-04a201121301', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'outcome-eval-0907', 'Outcome Evaluation', 88.00, 'active')
on conflict (id) do nothing;

insert into public.aof_knowledge_repository (id, organization_id, hub_id, repository_key, repository_name, repository_status, status)
values ('04a30113-04a3-04a3-04a3-04a301131401', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'know-repo-0907', 'Knowledge Repository', 'active', 'active')
on conflict (id) do nothing;

-- G4 AI Orchestration
insert into public.aof_ai_task_routers (id, organization_id, hub_id, router_key, router_name, router_status, status)
values ('04a40114-04a4-04a4-04a4-04a401141501', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'task-router-0907', 'AI Task Router', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_human_approval_engine (id, organization_id, hub_id, approval_key, approval_name, approval_status, status)
values ('04a50115-04a5-04a5-04a5-04a501151601', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'human-approval-0907', 'Human Approval Engine', 'pending', 'active')
on conflict (id) do nothing;

insert into public.aof_policy_engine (id, organization_id, hub_id, policy_key, policy_name, policy_status, status)
values ('04a60116-04a6-04a6-04a6-04a601161701', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'policy-eng-0907', 'Policy Engine', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_execution_history (id, organization_id, hub_id, history_key, history_title, execution_status, status)
values ('04a70117-04a7-04a7-04a7-04a701171801', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'exec-hist-0907', 'Execution History', 'completed', 'active')
on conflict (id) do nothing;

insert into public.aof_ai_governance_rules (id, organization_id, hub_id, rule_key, rule_name, rule_status, status)
values ('04a80118-04a8-04a8-04a8-04a801181901', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'gov-rule-0907', 'AI Governance Rule', 'active', 'active')
on conflict (id) do nothing;

-- G6 Dashboard
insert into public.aof_organization_metrics (id, organization_id, metrics_key, growth_score, delivery_score, innovation_score, pending_ai_approval_count, pipeline_health_score, mission_progress_score, overall_organization_score, status)
values ('04a90119-04a9-04a9-04a9-04a901191a01', '11111111-1111-1111-1111-111111111111', 'aof-metrics-0907', 91.00, 89.50, 87.00, 3, 92.50, 78.50, 90.25, 'active')
on conflict (id) do nothing;

insert into public.aof_organization_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, ago_status, ado_status, aio_status, orchestration_status, security_status, summary, status)
values ('04aa011a-04aa-04aa-04aa-04aa011a1b01', '11111111-1111-1111-1111-111111111111', 'aof-health-0907', 90.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'healthy', 'AI organization foundation operational', 'healthy')
on conflict (id) do nothing;

insert into public.aof_innovation_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('04ab011b-04ab-04ab-04ab-04ab011b1c01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'dash-innov-0907', 'Innovation Dashboard', 'active', 'active')
on conflict (id) do nothing;

insert into public.aof_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)
values ('04ac011c-04ac-04ac-04ac-04ac011c1d01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'mission-progress-0907', 'AI Organization Mission', 78.50, 'active')
on conflict (id) do nothing;

insert into public.aof_organization_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('04ad011d-04ad-04ad-04ad-04ad011d1e01', '11111111-1111-1111-1111-111111111111', '00770077-0077-0077-0077-007700770101', 'fail-orch-0907', 'orchestration', 'ORCH_SYNC_FAIL', 'Orchestration sync failed', 'open')
on conflict (id) do nothing;

insert into public.aof_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('04ae011e-04ae-04ae-04ae-04ae011e1f01', '11111111-1111-1111-1111-111111111111', 'organization_hub', 'seed', 'AI organization foundation seed data loaded', 'standard')
on conflict (id) do nothing;

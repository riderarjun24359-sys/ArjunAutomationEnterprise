insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a350', '11111111-1111-1111-1111-111111111111', 'AAGE Operational Growth Engine Orchestrator', 'arjun_automation_growth_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand_os","creative_studio","distribution_hub","growth_intelligence","founder_command_center"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a550', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a350', 'northstar-operational-growth-001', 'arjun_automation_growth_engine', 'operations_hub', '007a007a-007a-007a-007a-007a007a0101', '{"objective":"Unified AAGE operational growth engine"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.aago_operations_hubs (id, organization_id, hub_key, hub_name, environment, operations_tier, status)
values ('007a007a-007a-007a-007a-007a007a0101', '11111111-1111-1111-1111-111111111111', 'northstar-operations-hub', 'Northstar Operations Hub', 'production', 'operational', 'active')
on conflict (id) do nothing;

insert into public.aago_brand_knowledge_base (id, organization_id, hub_id, knowledge_key, knowledge_title, knowledge_status, status)
values ('05010101-0501-0501-0501-050101010201', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'knowledge-0501', 'Brand Knowledge Base', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_brand_rulebook (id, organization_id, hub_id, rulebook_key, rulebook_name, rulebook_status, status)
values ('05020102-0502-0502-0502-050201020301', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'rulebook-0502', 'Brand Rulebook', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_messaging_library (id, organization_id, hub_id, message_key, message_title, message_status, status)
values ('05030103-0503-0503-0503-050301030401', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'message-0503', 'Messaging Library', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_service_library (id, organization_id, hub_id, service_key, service_name, service_status, status)
values ('05040104-0504-0504-0504-050401040501', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'service-0504', 'Service Library', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_industry_library (id, organization_id, hub_id, industry_key, industry_name, industry_status, status)
values ('05050105-0505-0505-0505-050501050601', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'industry-0505', 'Industry Library', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_faq_library (id, organization_id, hub_id, faq_key, faq_question, faq_status, status)
values ('05060106-0506-0506-0506-050601060701', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'faq-0506', 'FAQ Library', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_brand_approval_rules (id, organization_id, hub_id, rule_key, rule_name, rule_status, status)
values ('05070107-0507-0507-0507-050701070801', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'rule-0507', 'Brand Approval Rules', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_video_projects (id, organization_id, hub_id, project_key, project_name, project_status, status)
values ('05080108-0508-0508-0508-050801080901', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'video-0508', 'Video Project', 'draft', 'active')
on conflict (id) do nothing;

insert into public.aago_thumbnail_manager (id, organization_id, hub_id, thumbnail_key, thumbnail_name, thumbnail_status, status)
values ('05090109-0509-0509-0509-050901090a01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'thumb-0509', 'Thumbnail Manager', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_voiceover_manager (id, organization_id, hub_id, voiceover_key, voiceover_name, voiceover_status, status)
values ('050a010a-050a-050a-050a-050a010a0b01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'voice-050a', 'Voiceover Manager', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_creative_asset_generator (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('050b010b-050b-050b-050b-050b010b0c01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'gen-050b', 'Creative Asset Generator', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_campaign_asset_builder (id, organization_id, hub_id, builder_key, builder_name, builder_status, status)
values ('050c010c-050c-050c-050c-050c010c0d01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'builder-050c', 'Campaign Asset Builder', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_creative_workflows (id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)
values ('050d010d-050d-050d-050d-050d010d0e01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'workflow-050d', 'Creative Workflow', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_distribution_content_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('050e010e-050e-050e-050e-050e010e0f01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'content-q-050e', 'Content Queue', 'draft', 'active')
on conflict (id) do nothing;

insert into public.aago_distribution_publishing_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('050f010f-050f-050f-050f-050f010f1001', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'publish-q-050f', 'Publishing Queue', 'scheduled', 'active')
on conflict (id) do nothing;

insert into public.aago_channel_manager (id, organization_id, hub_id, channel_key, channel_name, channel_status, status)
values ('05100110-0510-0510-0510-051001101101', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'channel-0510', 'Channel Manager', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_approval_center (id, organization_id, hub_id, approval_key, approval_title, approval_status, status)
values ('05110111-0511-0511-0511-051101111201', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'approval-0511', 'Approval Center', 'pending', 'active')
on conflict (id) do nothing;

insert into public.aago_publishing_history (id, organization_id, hub_id, history_key, history_title, history_status, status)
values ('05120112-0512-0512-0512-051201121301', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'history-0512', 'Publishing History', 'published', 'active')
on conflict (id) do nothing;

insert into public.aago_distribution_analytics (id, organization_id, hub_id, analytics_key, analytics_name, analytics_score, status)
values ('05130113-0513-0513-0513-051301131401', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'analytics-0513', 'Distribution Analytics', 88.00, 'active')
on conflict (id) do nothing;

insert into public.aago_campaign_dashboard (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('05140114-0514-0514-0514-051401141501', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'campaign-0514', 'Campaign Dashboard', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_content_performance (id, organization_id, hub_id, performance_key, performance_title, performance_score, status)
values ('05150115-0515-0515-0515-051501151601', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'perf-0515', 'Content Performance', 92.00, 'active')
on conflict (id) do nothing;

insert into public.aago_lead_attribution (id, organization_id, hub_id, attribution_key, attribution_title, attribution_status, status)
values ('05160116-0516-0516-0516-051601161701', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'attrib-0516', 'Lead Attribution', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_growth_kpis (id, organization_id, hub_id, kpi_key, kpi_name, kpi_value, status)
values ('05170117-0517-0517-0517-051701171801', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'kpi-0517', 'Growth KPI', 100.00, 'active')
on conflict (id) do nothing;

insert into public.aago_roi_dashboard (id, organization_id, hub_id, roi_key, roi_name, roi_score, status)
values ('05180118-0518-0518-0518-051801181901', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'roi-0518', 'ROI Dashboard', 85.00, 'active')
on conflict (id) do nothing;

insert into public.aago_recommendation_engine (id, organization_id, hub_id, recommendation_key, recommendation_title, recommendation_status, status)
values ('05190119-0519-0519-0519-051901191a01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'rec-0519', 'Recommendation Engine', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_command_center_metrics (id, organization_id, metrics_key, mission_status_score, content_status_score, publishing_status_score, growth_metrics_score, campaign_health_score, executive_summary_score, overall_operations_score, status)
values ('051a011a-051a-051a-051a-051a011a1b01', '11111111-1111-1111-1111-111111111111', 'aago-metrics-0501', 90.00, 88.00, 87.00, 91.00, 89.00, 92.00, 89.50, 'active')
on conflict (id) do nothing;

insert into public.aago_command_center_health (id, organization_id, health_key, overall_score, brand_os_status, creative_studio_status, distribution_status, intelligence_status, summary, status)
values ('051b011b-051b-051b-051b-051b011b1c01', '11111111-1111-1111-1111-111111111111', 'aago-health-0501', 91.00, 'healthy', 'healthy', 'healthy', 'healthy', 'AAGE operational growth engine operational', 'healthy')
on conflict (id) do nothing;

insert into public.aago_mission_status (id, organization_id, hub_id, mission_key, mission_name, mission_status, status)
values ('051c011c-051c-051c-051c-051c011c1d01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'mission-051c', 'Mission Status', 'active', 'active')
on conflict (id) do nothing;

insert into public.aago_executive_summaries (id, organization_id, hub_id, summary_key, summary_title, summary_status, status)
values ('051d011d-051d-051d-051d-051d011d1e01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'summary-051d', 'Executive Summary', 'draft', 'active')
on conflict (id) do nothing;

insert into public.aago_operational_failures (id, organization_id, hub_id, failure_key, failure_type, status)
values ('051e011e-051e-051e-051e-051e011e1f01', '11111111-1111-1111-1111-111111111111', '007a007a-007a-007a-007a-007a007a0101', 'failure-051e', 'operational', 'open')
on conflict (id) do nothing;

insert into public.aago_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('051f011f-051f-051f-051f-051f011f2001', '11111111-1111-1111-1111-111111111111', 'operations_hub', 'seed', 'AAGE operational growth engine seed data loaded', 'standard')
on conflict (id) do nothing;

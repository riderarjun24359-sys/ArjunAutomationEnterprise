insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a307', '11111111-1111-1111-1111-111111111111', 'Customer Success Agent', 'customer_success', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["onboarding","adoption","renewal","health_scoring"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a507', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a307', 'northstar-cs-001', 'customer_success', 'project', 'ffffffff-ffff-ffff-ffff-ffffffffff01', '{"objective":"customer success orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

insert into public.knowledge_ai_contexts (id, organization_id, context_key, agent_id, session_id, entry_id, context_payload, status)
values
  ('cb000001-cb00-cb00-cb00-cb0000000006', '11111111-1111-1111-1111-111111111111', 'northstar-cs-context', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a307', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a507', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c10101', '{"includes":["client_memory","project_memory","ba_outputs","sa_outputs","df_outputs","qa_outputs","dd_outputs","support_trends"]}'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cs_engagements (id, organization_id, title, engagement_key, ba_engagement_id, sa_engagement_id, df_engagement_id, qa_engagement_id, dd_engagement_id, brd_id, frs_id, solution_architecture_id, work_package_id, qa_release_readiness_id, dd_release_version_id, client_id, project_id, contact_id, agent_id, session_id, knowledge_context_id, pipeline_stage, status, summary)
values
  ('c501c501-c501-c501-c501-c501c5010101', '11111111-1111-1111-1111-111111111111', 'Northstar Platform Customer Success', 'northstar-expansion-cs-001', 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b10101', 'd1d1d1d1-d1d1-d1d1-d1d1-d1d1d1d10101', 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e10101', 'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f10101', 'dd01dd01-dd01-dd01-dd01-dd01dd010101', 'b3b3b3b3-b3b3-b3b3-b3b3-b3b3b3b30101', 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b40101', 'd2d2d2d2-d2d2-d2d2-d2d2-d2d2d2d20101', 'e2e2e2e2-e2e2-e2e2-e2e2-e2e2e2e20101', 'fa00000a-fa00-fa00-fa00-fa000000000a', 'dd12dd12-dd12-dd12-dd12-dd12dd120101', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', 'ffffffff-ffff-ffff-ffff-ffffffffff01', 'dddddddd-dddd-dddd-dddd-dddddddddd01', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a307', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a507', 'cb000001-cb00-cb00-cb00-cb0000000006', 'customer_success', 'active', 'Customer success orchestration for Northstar platform expansion from DevOps deployment handoff')
on conflict (id) do nothing;

insert into public.cs_onboarding_workflows (id, organization_id, engagement_id, workflow_key, name, phases, milestones, status)
values
  ('c502c502-c502-c502-c502-c502c5020201', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'onboarding-northstar', 'Northstar Platform Onboarding', '["kickoff","configuration","training","go_live"]'::jsonb, '["stakeholder_intro","environment_access","admin_training","first_sync_complete"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cs_adoption_tracking (id, organization_id, engagement_id, tracking_key, name, feature_adoptions, adoption_percent, status)
values
  ('c503c503-c503-c503-c503-c503c5030301', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'adoption-crm-sync', 'CRM Sync Feature Adoption', '["sync_dashboard","status_panel","client_mapping"]'::jsonb, 72.50, 'active')
on conflict (id) do nothing;

insert into public.cs_health_scores (id, organization_id, engagement_id, score_key, name, overall_score, dimension_scores, status)
values
  ('c504c504-c504-c504-c504-c504c5040401', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'health-northstar', 'Northstar Account Health', 84.00, '[{"dimension":"adoption","score":78},{"dimension":"engagement","score":88},{"dimension":"support","score":86}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cs_renewal_plans (id, organization_id, engagement_id, plan_key, name, renewal_date, renewal_value_usd, renewal_actions, status)
values
  ('c505c505-c505-c505-c505-c505c5050501', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'renewal-2027', 'Northstar 2027 Renewal Plan', '2027-03-31', 248000.00, '["executive_briefing","roi_review","expansion_proposal"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.cs_expansion_opportunities (id, organization_id, engagement_id, opportunity_key, name, opportunity_type, estimated_value_usd, signals, status)
values
  ('c506c506-c506-c506-c506-c506c5060601', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'expansion-analytics', 'Analytics Module Upsell', 'upsell', 45000.00, '["high_adoption","executive_interest","support_positive"]'::jsonb, 'identified')
on conflict (id) do nothing;

insert into public.cs_risk_analyses (id, organization_id, engagement_id, analysis_key, name, risk_level, risk_factors, mitigation_plan, status)
values
  ('c507c507-c507-c507-c507-c507c5070701', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'risk-adoption-lag', 'Adoption Lag Risk Analysis', 'medium', '["low_training_attendance","delayed_go_live"]'::jsonb, 'Schedule additional training sessions and assign dedicated CSM for first 90 days', 'draft')
on conflict (id) do nothing;

insert into public.cs_support_trend_analyses (id, organization_id, engagement_id, analysis_key, name, trend_metrics, insights, status)
values
  ('c508c508-c508-c508-c508-c508c5080801', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'support-trends-q3', 'Q3 Support Trend Analysis', '[{"metric":"ticket_volume","trend":"down","change_pct":-18},{"metric":"resolution_time","trend":"stable","change_pct":2}]'::jsonb, 'Support ticket volume declining post-deployment; CRM sync module driving fewer integration issues', 'active')
on conflict (id) do nothing;

insert into public.cs_success_playbooks (id, organization_id, engagement_id, playbook_key, name, playbook_type, steps, status)
values
  ('c509c509-c509-c509-c509-c509c5090901', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'playbook-onboarding', 'Enterprise Onboarding Playbook', 'onboarding', '["welcome_call","kickoff","training","30_day_checkin","90_day_review"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cs_qbr_reports (id, organization_id, engagement_id, report_key, title, quarter, report_sections, status)
values
  ('c50ac50a-c50a-c50a-c50a-c50ac50a0a01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'qbr-q3-2026', 'Northstar Q3 2026 QBR', 'Q3 2026', '["executive_summary","adoption_metrics","support_trends","roadmap_alignment"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.cs_communication_plans (id, organization_id, engagement_id, plan_key, name, channels, cadence, status)
values
  ('c50bc50b-c50b-c50b-c50b-c50bc50b0b01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'comms-northstar', 'Northstar Communication Plan', '["email","slack","qbr_meeting"]'::jsonb, 'monthly', 'active')
on conflict (id) do nothing;

insert into public.cs_training_recommendations (id, organization_id, engagement_id, recommendation_key, name, training_modules, priority, status)
values
  ('c50cc50c-c50c-c50c-c50c-c50cc50c0c01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'training-advanced-sync', 'Advanced Sync Configuration Training', '["sync_rules","conflict_resolution","reporting"]'::jsonb, 'high', 'draft')
on conflict (id) do nothing;

insert into public.cs_feedback_analyses (id, organization_id, engagement_id, analysis_key, name, sentiment_score, themes, recommendations, status)
values
  ('c50dc50d-c50d-c50d-c50d-c50dc50d0d01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'feedback-post-launch', 'Post-Launch Feedback Analysis', 82.00, '["positive_ui","sync_reliability","training_gaps"]'::jsonb, 'Expand self-service training and schedule advanced sync workshop', 'draft')
on conflict (id) do nothing;

insert into public.cs_sla_monitoring (id, organization_id, engagement_id, monitoring_key, name, sla_targets, compliance_percent, status)
values
  ('c50ec50e-c50e-c50e-c50e-c50ec50e0e01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'sla-support', 'Support SLA Monitoring', '[{"target":"first_response_4h","compliance":96},{"target":"resolution_24h","compliance":91}]'::jsonb, 93.50, 'active')
on conflict (id) do nothing;

insert into public.cs_success_kpi_dashboards (id, organization_id, engagement_id, dashboard_key, name, kpis, refresh_cadence, status)
values
  ('c50fc50f-c50f-c50f-c50f-c50fc50f0f01', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'kpi-northstar', 'Northstar Success KPI Dashboard', '[{"kpi":"adoption_rate","value":72.5},{"kpi":"health_score","value":84},{"kpi":"nps","value":42}]'::jsonb, 'weekly', 'active')
on conflict (id) do nothing;

insert into public.cs_churn_predictions (id, organization_id, engagement_id, prediction_key, name, churn_probability, risk_signals, retention_actions, status)
values
  ('c510c510-c510-c510-c510-c510c5101001', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'churn-northstar', 'Northstar Churn Prediction', 12.00, '["low_executive_engagement"]'::jsonb, '["schedule_executive_briefing","roi_case_study"]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.cs_lifecycle_management (id, organization_id, engagement_id, lifecycle_key, name, current_stage, stage_history, next_actions, status)
values
  ('c511c511-c511-c511-c511-c511c5111101', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'lifecycle-northstar', 'Northstar Lifecycle Management', 'adoption', '[{"stage":"onboarding","entered_at":"2026-08-01"},{"stage":"adoption","entered_at":"2026-08-15"}]'::jsonb, '["90_day_review","expansion_discussion"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.cs_executive_summaries (id, organization_id, engagement_id, summary_key, title, summary_content, key_metrics, status)
values
  ('c512c512-c512-c512-c512-c512c5121201', '11111111-1111-1111-1111-111111111111', 'c501c501-c501-c501-c501-c501c5010101', 'exec-q3-2026', 'Northstar Q3 Executive Summary', 'Northstar platform expansion on track with strong adoption and declining support volume post-deployment.', '[{"metric":"health_score","value":84},{"metric":"adoption_pct","value":72.5},{"metric":"renewal_value_usd","value":248000}]'::jsonb, 'draft')
on conflict (id) do nothing;

insert into public.cs_audit_logs (id, organization_id, entity_type, entity_id, action, summary)
values
  ('ca000001-ca00-ca00-ca00-ca0000000001', '11111111-1111-1111-1111-111111111111', 'engagement', 'c501c501-c501-c501-c501-c501c5010101', 'create', 'Northstar Platform Customer Success engagement created from DevOps deployment handoff'),
  ('ca000002-ca00-ca00-ca00-ca0000000002', '11111111-1111-1111-1111-111111111111', 'onboarding_workflow', 'c502c502-c502-c502-c502-c502c5020201', 'generate', 'Enterprise onboarding workflow generated from deployment release')
on conflict (id) do nothing;

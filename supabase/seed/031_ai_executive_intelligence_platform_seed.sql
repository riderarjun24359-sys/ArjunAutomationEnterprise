insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a331', '11111111-1111-1111-1111-111111111111', 'AI Executive Intelligence Orchestrator', 'ai_executive_intelligence_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["executive_briefs","revenue_intelligence","platform_health","security_intelligence","priority_recommendations","knowledge_reasoning","executive_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a531', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a331', 'northstar-executive-intel-001', 'ai_executive_intelligence_platform', 'intelligence_hub', '00480048-0048-0048-0048-004800480101', '{"objective":"AI executive intelligence platform for northstar leadership"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- M1 Executive Intelligence Hub
insert into public.aix_intelligence_hubs (id, organization_id, hub_key, hub_name, environment, status)
values ('00480048-0048-0048-0048-004800480101', '11111111-1111-1111-1111-111111111111', 'northstar-executive-intel', 'Northstar Executive Intelligence Hub', 'production', 'active')
on conflict (id) do nothing;

insert into public.aix_daily_executive_briefs (id, organization_id, hub_id, brief_key, brief_date, summary, ai_confidence_score, evidence_refs, status)
values ('00490049-0049-0049-0049-004900490201', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'brief-daily-0803', current_date, 'Revenue up 4.2% WoW; churn risk elevated in enterprise segment.', 92.50, '[{"source":"mrr_trends","ref":"trend-mrr-0803"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.aix_weekly_business_reviews (id, organization_id, hub_id, review_key, week_start, summary, ai_confidence_score, evidence_refs, status)
values ('004a004a-004a-004a-004a-004a004a0301', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'wbr-week-31', date_trunc('week', current_date)::date, 'Strong trial conversion; integration health stable.', 88.00, '[{"source":"trial_conversion_scores","ref":"score-trial-0803"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.aix_monthly_executive_summaries (id, organization_id, hub_id, summary_key, month_start, summary, ai_confidence_score, evidence_refs, status)
values ('004b004b-004b-004b-004b-004b004b0401', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'summary-jul-2026', date_trunc('month', current_date)::date, 'July closed with 12% ARR growth and improved platform health.', 90.25, '[{"source":"arr_trends","ref":"trend-arr-0803"}]'::jsonb, 'active')
on conflict (id) do nothing;

-- M2 Customer & Revenue Intelligence
insert into public.aix_trial_conversion_scores (id, organization_id, hub_id, score_key, conversion_rate, trial_count, converted_count, ai_confidence_score, status)
values ('004c004c-004c-004c-004c-004c004c0501', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'score-trial-0803', 34.50, 200, 69, 91.00, 'active')
on conflict (id) do nothing;

insert into public.aix_renewal_probabilities (id, organization_id, hub_id, probability_key, renewal_probability, account_ref, ai_confidence_score, status)
values ('004d004d-004d-004d-004d-004d004d0601', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'renewal-acme-0803', 87.00, 'acme-corp', 89.50, 'active')
on conflict (id) do nothing;

insert into public.aix_churn_risks (id, organization_id, hub_id, risk_key, churn_score, risk_level, account_ref, ai_confidence_score, status)
values ('004e004e-004e-004e-004e-004e004e0701', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'churn-enterprise-0803', 72.00, 'high', 'enterprise-co', 85.00, 'active')
on conflict (id) do nothing;

insert into public.aix_expansion_opportunities (id, organization_id, hub_id, opportunity_key, expansion_score, account_ref, opportunity_type, ai_confidence_score, status)
values ('004f004f-004f-004f-004f-004f004f0801', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'expand-northstar-0803', 78.50, 'northstar', 'upsell', 86.00, 'active')
on conflict (id) do nothing;

-- M3 Revenue Analytics
insert into public.aix_mrr_trends (id, organization_id, hub_id, trend_key, mrr_amount, trend_direction, ai_confidence_score, status)
values ('00500050-0050-0050-0050-005000500901', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'trend-mrr-0803', 125000.00, 'up', 94.00, 'active')
on conflict (id) do nothing;

insert into public.aix_arr_trends (id, organization_id, hub_id, trend_key, arr_amount, trend_direction, ai_confidence_score, status)
values ('00510051-0051-0051-0051-005100510a01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'trend-arr-0803', 1500000.00, 'up', 93.50, 'active')
on conflict (id) do nothing;

insert into public.aix_revenue_growth_metrics (id, organization_id, hub_id, metrics_key, growth_rate, ai_confidence_score, status)
values ('00520052-0052-0052-0052-005200520b01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'growth-q3-0803', 12.00, 91.00, 'active')
on conflict (id) do nothing;

insert into public.aix_revenue_risks (id, organization_id, hub_id, risk_key, risk_amount, risk_level, risk_category, ai_confidence_score, status)
values ('00530053-0053-0053-0053-005300530c01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'rev-risk-concentration', 250000.00, 'medium', 'concentration', 82.00, 'active')
on conflict (id) do nothing;

-- M4 Platform Health Intelligence
insert into public.aix_platform_health_intel (id, organization_id, hub_id, intel_key, health_score, component_summary, ai_confidence_score, status)
values ('00540054-0054-0054-0054-005400540d01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'platform-health-0803', 98.50, 'All core services healthy', 96.00, 'active')
on conflict (id) do nothing;

insert into public.aix_queue_health_intel (id, organization_id, hub_id, intel_key, queue_depth, health_score, queue_name, ai_confidence_score, status)
values ('00550055-0055-0055-0055-005500550e01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'queue-health-0803', 3, 97.00, 'job-queue', 95.00, 'active')
on conflict (id) do nothing;

insert into public.aix_integration_health_intel (id, organization_id, hub_id, intel_key, integration_name, health_score, error_rate, ai_confidence_score, status)
values ('00560056-0056-0056-0056-005600560f01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'integration-health-0803', 'Stripe Connector', 99.00, 0.10, 97.50, 'active')
on conflict (id) do nothing;

insert into public.aix_performance_trends (id, organization_id, hub_id, trend_key, performance_score, trend_direction, metric_window, ai_confidence_score, status)
values ('00570057-0057-0057-0057-005700571001', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'perf-trend-0803', 96.00, 'up', '24h', 94.00, 'active')
on conflict (id) do nothing;

-- M5 Security & Compliance Intelligence
insert into public.aix_unusual_login_activity (id, organization_id, hub_id, activity_key, login_count, risk_level, user_ref, geo_anomaly, ai_confidence_score, status)
values ('00580058-0058-0058-0058-005800581101', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'login-anomaly-0803', 12, 'medium', 'user-ops-lead', 'unexpected geo: APAC', 88.00, 'active')
on conflict (id) do nothing;

insert into public.aix_permission_risks (id, organization_id, hub_id, risk_key, risk_type, risk_level, subject_ref, ai_confidence_score, status)
values ('00590059-0059-0059-0059-005900591201', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'perm-risk-admin-0803', 'over_privileged', 'high', 'svc-admin-bot', 90.00, 'active')
on conflict (id) do nothing;

insert into public.aix_tenant_security_trends (id, organization_id, hub_id, trend_key, security_score, trend_direction, tenant_ref, ai_confidence_score, status)
values ('005a005a-005a-005a-005a-005a005a1301', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'sec-trend-0803', 94.00, 'flat', 'northstar', 92.00, 'active')
on conflict (id) do nothing;

insert into public.aix_compliance_warnings (id, organization_id, hub_id, warning_key, compliance_type, severity, warning_message, ai_confidence_score, status)
values ('005b005b-005b-005b-005b-005b005b1401', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'compliance-soc2-0803', 'soc2', 'warning', 'Access review overdue for 3 admin accounts', 87.00, 'active')
on conflict (id) do nothing;

-- M6 Executive Priorities & Recommendations
insert into public.aix_today_priorities (id, organization_id, hub_id, priority_key, priority_title, priority_rank, priority_category, ai_confidence_score, status)
values ('005c005c-005c-005c-005c-005c005c1501', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'priority-churn-0803', 'Address enterprise churn risk', 1, 'customer', 93.00, 'active')
on conflict (id) do nothing;

insert into public.aix_recommended_actions (id, organization_id, hub_id, action_key, action_title, action_type, action_summary, ai_confidence_score, evidence_refs, status)
values ('005d005d-005d-005d-005d-005d005d1601', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'action-renewal-0803', 'Schedule renewal call with Acme Corp', 'outreach', 'High renewal probability with contract ending in 30 days', 91.50, '[{"source":"renewal_probabilities","ref":"renewal-acme-0803"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.aix_business_risks (id, organization_id, hub_id, risk_key, risk_title, risk_level, risk_category, impact_summary, ai_confidence_score, status)
values ('005e005e-005e-005e-005e-005e005e1701', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'biz-risk-revenue', 'Revenue concentration in top 3 accounts', 'medium', 'revenue', '42% of MRR from 3 accounts', 89.00, 'active')
on conflict (id) do nothing;

insert into public.aix_growth_opportunities (id, organization_id, hub_id, opportunity_key, opportunity_title, growth_score, opportunity_category, impact_summary, ai_confidence_score, status)
values ('005f005f-005f-005f-005f-005f005f1801', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'growth-upsell-0803', 'Expand analytics module to enterprise tier', 82.00, 'expansion', 'Potential $45K ARR uplift', 88.00, 'active')
on conflict (id) do nothing;

-- M7 Knowledge Reasoning & Evidence
insert into public.aix_knowledge_reasoning_sessions (id, organization_id, hub_id, session_key, reasoning_type, objective, ai_confidence_score, status)
values ('00600060-0060-0060-0060-006000601901', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'reasoning-q3-0803', 'executive', 'Synthesize Q3 revenue and risk signals for board prep', 90.00, 'active')
on conflict (id) do nothing;

insert into public.aix_evidence_traces (id, organization_id, hub_id, trace_key, source_module, trace_summary, evidence_refs, status)
values ('00610061-0061-0061-0061-006100611a01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'trace-mrr-evidence', 'revenue_analytics', 'MRR trend corroborated by billing and CRM signals', '[{"source":"aix_mrr_trends","ref":"trend-mrr-0803"},{"source":"intg_payment_transactions","ref":"txn-batch-0803"}]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.aix_orchestration_links (id, organization_id, hub_id, link_key, link_type, target_ref, ai_confidence_score, status)
values ('00620062-0062-0062-0062-006200621b01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'link-agent-0803', 'agent', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a331', 95.00, 'active')
on conflict (id) do nothing;

insert into public.aix_recommendation_outputs (id, organization_id, hub_id, output_key, recommendation_text, recommendation_type, ai_confidence_score, evidence_refs, status)
values ('00630063-0063-0063-0063-006300631c01', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'rec-churn-mitigation', 'Launch executive outreach program for at-risk enterprise accounts within 7 days', 'action', 92.75, '[{"source":"aix_churn_risks","ref":"churn-enterprise-0803"},{"source":"aix_evidence_traces","ref":"trace-mrr-evidence"}]'::jsonb, 'active')
on conflict (id) do nothing;

-- M8 Executive Dashboard
insert into public.aix_executive_metrics (id, organization_id, metrics_key, business_score, growth_score, operational_score, security_score, customer_score, status)
values ('00640064-0064-0064-0064-006400641d01', '11111111-1111-1111-1111-111111111111', 'exec-metrics-0803', 94.50, 91.00, 97.00, 93.00, 89.50, 'active')
on conflict (id) do nothing;

insert into public.aix_executive_health (id, organization_id, health_key, overall_score, uptime_percent, disaster_recovery_mode, summary, status)
values ('00650065-0065-0065-0065-006500651e01', '11111111-1111-1111-1111-111111111111', 'exec-health-0803', 95.00, 99.95, false, 'Executive intelligence platform operational', 'healthy')
on conflict (id) do nothing;

insert into public.aix_executive_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('00660066-0066-0066-0066-006600662001', '11111111-1111-1111-1111-111111111111', '00480048-0048-0048-0048-004800480101', 'fail-reasoning-0803', 'reasoning', 'TIMEOUT', 'Knowledge reasoning session timed out', 'open')
on conflict (id) do nothing;

insert into public.aix_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('00670067-0067-0067-0067-006700672101', '11111111-1111-1111-1111-111111111111', 'intelligence_hub', 'seed', 'AI executive intelligence platform seed data loaded', 'standard')
on conflict (id) do nothing;

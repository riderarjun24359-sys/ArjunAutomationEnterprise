insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a346', '11111111-1111-1111-1111-111111111111', 'Enterprise Intelligence Platform Orchestrator', 'enterprise_intelligence_platform', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["kpi","executive","predictive","reporting","sdk","dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a546', '11111111-1111-1111-1111-111111111111', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a346', 'northstar-enterprise-intelligence-001', 'enterprise_intelligence_platform', 'intelligence_hub', '00760076-0076-0076-0076-007600760101', '{"objective":"Unified enterprise intelligence platform KPI, executive, predictive, and reporting orchestration"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

-- G0 Intelligence Hub
insert into public.eip_intelligence_hubs (id, organization_id, hub_key, hub_name, environment, intelligence_tier, status)
values ('00760076-0076-0076-0076-007600760101', '11111111-1111-1111-1111-111111111111', 'northstar-enterprise-intelligence', 'Northstar Enterprise Intelligence Hub', 'production', 'enterprise', 'active')
on conflict (id) do nothing;

-- G1 KPI Engine
insert into public.eip_kpi_registry (id, organization_id, hub_id, kpi_key, kpi_name, kpi_status, status)
values ('04700100-0470-0470-0470-047001000101', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'kpi-revenue-0906', 'Revenue KPI', 'active', 'active')
on conflict (id) do nothing;

insert into public.eip_kpi_aggregations (id, organization_id, hub_id, aggregation_key, aggregation_name, aggregation_type, status)
values ('04710101-0471-0471-0471-047101010201', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'agg-daily-0906', 'Daily Revenue Aggregation', 'sum', 'active')
on conflict (id) do nothing;

insert into public.eip_kpi_categories (id, organization_id, hub_id, category_key, category_name, category_status, status)
values ('04720102-0472-0472-0472-047201020301', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'cat-revenue-0906', 'Revenue Category', 'active', 'active')
on conflict (id) do nothing;

insert into public.eip_kpi_targets (id, organization_id, hub_id, target_key, target_name, target_value, status)
values ('04730103-0473-0473-0473-047301030401', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'target-revenue-0906', 'Q3 Revenue Target', 500000.00, 'active')
on conflict (id) do nothing;

insert into public.eip_kpi_thresholds (id, organization_id, hub_id, threshold_key, threshold_name, threshold_value, status)
values ('04740104-0474-0474-0474-047401040501', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'threshold-revenue-0906', 'Revenue Warning Threshold', 400000.00, 'active')
on conflict (id) do nothing;

insert into public.eip_kpi_snapshots (id, organization_id, hub_id, snapshot_key, snapshot_name, snapshot_value, status)
values ('04750105-0475-0475-0475-047501050601', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'snapshot-revenue-0906', 'Revenue Snapshot', 425000.00, 'active')
on conflict (id) do nothing;

-- G2 Executive Intelligence
insert into public.eip_executive_dashboards (id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)
values ('04760106-0476-0476-0476-047601060701', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'dash-exec-0906', 'Executive Command Center', 'active', 'active')
on conflict (id) do nothing;

insert into public.eip_cross_module_insights (id, organization_id, hub_id, insight_key, insight_title, insight_type, status)
values ('04770107-0477-0477-0477-047701070801', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'insight-cross-0906', 'Cross-Module Revenue Insight', 'cross_module', 'active')
on conflict (id) do nothing;

insert into public.eip_business_health_scores (id, organization_id, hub_id, score_key, score_name, health_score, status)
values ('04780108-0478-0478-0478-047801080901', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'health-biz-0906', 'Business Health Score', 92.50, 'active')
on conflict (id) do nothing;

insert into public.eip_operational_efficiency_scores (id, organization_id, hub_id, score_key, score_name, efficiency_score, status)
values ('04790109-0479-0479-0479-047901090a01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'efficiency-ops-0906', 'Operational Efficiency Score', 88.00, 'active')
on conflict (id) do nothing;

insert into public.eip_growth_scores (id, organization_id, hub_id, score_key, score_name, growth_score, status)
values ('047a010a-047a-047a-047a-047a010a0b01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'growth-score-0906', 'Growth Score', 85.50, 'active')
on conflict (id) do nothing;

insert into public.eip_strategic_insights (id, organization_id, hub_id, insight_key, insight_title, insight_priority, status)
values ('047b010b-047b-047b-047b-047b010b0c01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'insight-strat-0906', 'Strategic Market Expansion', 'high', 'active')
on conflict (id) do nothing;

-- G3 Predictive Analytics
insert into public.eip_revenue_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, forecast_total, status)
values ('047c010c-047c-047c-047c-047c010c0d01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'forecast-revenue-0906', 'Q4 Revenue Forecast', 650000.00, 'active')
on conflict (id) do nothing;

insert into public.eip_customer_growth_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, growth_total, status)
values ('047d010d-047d-047d-047d-047d010d0e01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'forecast-customer-0906', 'Customer Growth Forecast', 1250.00, 'active')
on conflict (id) do nothing;

insert into public.eip_renewal_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, renewal_rate, status)
values ('047e010e-047e-047e-047e-047e010e0f01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'forecast-renewal-0906', 'Annual Renewal Forecast', 94.50, 'active')
on conflict (id) do nothing;

insert into public.eip_capacity_planning (id, organization_id, hub_id, plan_key, plan_name, capacity_units, status)
values ('047f010f-047f-047f-047f-047f010f1001', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'plan-capacity-0906', 'Q4 Capacity Plan', 500.00, 'active')
on conflict (id) do nothing;

insert into public.eip_operational_trends (id, organization_id, hub_id, trend_key, trend_name, trend_direction, status)
values ('04800110-0480-0480-0480-048001101101', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'trend-ops-0906', 'Operational Throughput Trend', 'up', 'active')
on conflict (id) do nothing;

insert into public.eip_risk_forecasts (id, organization_id, hub_id, forecast_key, forecast_name, risk_score, status)
values ('04810111-0481-0481-0481-048101111201', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'forecast-risk-0906', 'Enterprise Risk Forecast', 18.50, 'active')
on conflict (id) do nothing;

-- G4 Enterprise Reporting
insert into public.eip_daily_executive_briefs (id, organization_id, hub_id, brief_key, brief_title, brief_date, status)
values ('04820112-0482-0482-0482-048201121301', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'brief-daily-0906', 'Daily Executive Brief', current_date, 'active')
on conflict (id) do nothing;

insert into public.eip_weekly_business_summaries (id, organization_id, hub_id, summary_key, summary_title, summary_week, status)
values ('04830113-0483-0483-0483-048301131401', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'summary-weekly-0906', 'Weekly Business Summary', '2026-W32', 'active')
on conflict (id) do nothing;

insert into public.eip_monthly_performance_reports (id, organization_id, hub_id, report_key, report_title, report_month, status)
values ('04840114-0484-0484-0484-048401141501', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'report-monthly-0906', 'August Performance Report', '2026-08', 'active')
on conflict (id) do nothing;

insert into public.eip_quarterly_executive_reviews (id, organization_id, hub_id, review_key, review_title, review_quarter, status)
values ('04850115-0485-0485-0485-048501151601', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'review-quarterly-0906', 'Q3 Executive Review', '2026-Q3', 'active')
on conflict (id) do nothing;

insert into public.eip_annual_business_reports (id, organization_id, hub_id, report_key, report_title, report_year, status)
values ('04860116-0486-0486-0486-048601161701', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'report-annual-0906', '2026 Annual Business Report', '2026', 'active')
on conflict (id) do nothing;

-- G5 Intelligence SDK
insert into public.eip_kpi_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)
values ('04870117-0487-0487-0487-048701171801', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'config-kpi-0906', 'KPI Service Config', 'active', 'active')
on conflict (id) do nothing;

insert into public.eip_intelligence_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)
values ('04880118-0488-0488-0488-048801181901', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'config-intel-0906', 'Intelligence Service Config', 'active', 'active')
on conflict (id) do nothing;

insert into public.eip_forecast_service_configs (id, organization_id, hub_id, config_key, config_name, config_status, status)
values ('04890119-0489-0489-0489-048901191a01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'config-forecast-0906', 'Forecast Service Config', 'active', 'active')
on conflict (id) do nothing;

-- G6 Dashboard
insert into public.eip_intelligence_metrics (id, organization_id, metrics_key, unified_kpi_score, business_health_score, operational_efficiency_score, growth_score, revenue_forecast_total, customer_forecast_total, risk_score, overall_intelligence_score, status)
values ('048a011a-048a-048a-048a-048a011a1b01', '11111111-1111-1111-1111-111111111111', 'eip-metrics-0906', 94.00, 92.50, 88.00, 85.50, 650000.00, 1250.00, 18.50, 91.25, 'active')
on conflict (id) do nothing;

insert into public.eip_intelligence_health (id, organization_id, health_key, overall_score, disaster_recovery_mode, kpi_status, intelligence_status, forecast_status, security_status, summary, status)
values ('048b011b-048b-048b-048b-048b011b1c01', '11111111-1111-1111-1111-111111111111', 'eip-health-0906', 91.00, false, 'healthy', 'healthy', 'healthy', 'healthy', 'Enterprise intelligence platform operational', 'healthy')
on conflict (id) do nothing;

insert into public.eip_mission_progress (id, organization_id, hub_id, progress_key, progress_name, progress_percent, status)
values ('048c011c-048c-048c-048c-048c011c1d01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'mission-progress-0906', 'Enterprise Intelligence Mission', 78.50, 'active')
on conflict (id) do nothing;

insert into public.eip_intelligence_failures (id, organization_id, hub_id, failure_key, failure_type, error_code, error_message, status)
values ('048d011d-048d-048d-048d-048d011d1e01', '11111111-1111-1111-1111-111111111111', '00760076-0076-0076-0076-007600760101', 'fail-kpi-0906', 'kpi', 'KPI_SYNC_FAIL', 'KPI aggregation sync failed', 'open')
on conflict (id) do nothing;

insert into public.eip_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('048e011e-048e-048e-048e-048e011e1f01', '11111111-1111-1111-1111-111111111111', 'intelligence_hub', 'seed', 'Enterprise intelligence platform seed data loaded', 'standard')
on conflict (id) do nothing;

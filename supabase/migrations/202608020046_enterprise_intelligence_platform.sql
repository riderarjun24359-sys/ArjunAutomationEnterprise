-- V2 Enterprise Intelligence Platform

-- IntelligenceHub
create table if not exists public.eip_intelligence_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  intelligence_tier text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- KpiRegistry
create table if not exists public.eip_kpi_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_status text not null default 'active',
  kpi_category text not null default 'general',
  kpi_type text not null default 'counter',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- KpiAggregation
create table if not exists public.eip_kpi_aggregations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  aggregation_key text not null,
  aggregation_name text not null default '',
  aggregation_type text not null default 'sum',
  window_size text not null default 'daily',
  computed_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, aggregation_key)
);

-- KpiCategory
create table if not exists public.eip_kpi_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  category_key text not null,
  category_name text not null default '',
  category_status text not null default 'active',
  parent_category text not null default '',
  sort_order integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, category_key)
);

-- KpiTarget
create table if not exists public.eip_kpi_targets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  target_key text not null,
  target_name text not null default '',
  target_value numeric(12, 2) not null default 0,
  target_period text not null default 'monthly',
  kpi_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, target_key)
);

-- KpiThreshold
create table if not exists public.eip_kpi_thresholds (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  threshold_key text not null,
  threshold_name text not null default '',
  threshold_value numeric(12, 2) not null default 0,
  threshold_type text not null default 'warning',
  kpi_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, threshold_key)
);

-- KpiSnapshot
create table if not exists public.eip_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  snapshot_key text not null,
  snapshot_name text not null default '',
  snapshot_value numeric(12, 2) not null default 0,
  snapshot_date date not null default current_date,
  kpi_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, snapshot_key)
);

-- ExecutiveDashboard
create table if not exists public.eip_executive_dashboards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  widget_count integer not null default 0,
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- CrossModuleInsight
create table if not exists public.eip_cross_module_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  insight_key text not null,
  insight_title text not null default '',
  insight_type text not null default 'cross_module',
  source_modules jsonb not null default '[]'::jsonb,
  confidence_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, insight_key)
);

-- BusinessHealthScore
create table if not exists public.eip_business_health_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  score_key text not null,
  score_name text not null default '',
  health_score numeric(5, 2) not null default 100,
  score_date date not null default current_date,
  dimension text not null default 'overall',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- OperationalEfficiencyScore
create table if not exists public.eip_operational_efficiency_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  score_key text not null,
  score_name text not null default '',
  efficiency_score numeric(5, 2) not null default 100,
  score_date date not null default current_date,
  process_area text not null default 'operations',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- GrowthScore
create table if not exists public.eip_growth_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  score_key text not null,
  score_name text not null default '',
  growth_score numeric(5, 2) not null default 100,
  score_date date not null default current_date,
  growth_dimension text not null default 'revenue',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- StrategicInsight
create table if not exists public.eip_strategic_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  insight_key text not null,
  insight_title text not null default '',
  insight_priority text not null default 'medium',
  insight_type text not null default 'strategic',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, insight_key)
);

-- RevenueForecast
create table if not exists public.eip_revenue_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  forecast_key text not null,
  forecast_name text not null default '',
  forecast_total numeric(14, 2) not null default 0,
  forecast_horizon text not null default 'quarterly',
  confidence_level numeric(5, 2) not null default 80,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, forecast_key)
);

-- CustomerGrowthForecast
create table if not exists public.eip_customer_growth_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  forecast_key text not null,
  forecast_name text not null default '',
  growth_total numeric(12, 2) not null default 0,
  forecast_horizon text not null default 'quarterly',
  segment text not null default 'all',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, forecast_key)
);

-- RenewalForecast
create table if not exists public.eip_renewal_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  forecast_key text not null,
  forecast_name text not null default '',
  renewal_rate numeric(5, 2) not null default 0,
  forecast_horizon text not null default 'annual',
  cohort_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, forecast_key)
);

-- CapacityPlanning
create table if not exists public.eip_capacity_planning (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  plan_key text not null,
  plan_name text not null default '',
  capacity_units numeric(12, 2) not null default 0,
  plan_horizon text not null default 'quarterly',
  resource_type text not null default 'compute',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, plan_key)
);

-- OperationalTrend
create table if not exists public.eip_operational_trends (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  trend_key text not null,
  trend_name text not null default '',
  trend_direction text not null default 'stable',
  trend_value numeric(12, 2) not null default 0,
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- RiskForecast
create table if not exists public.eip_risk_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  forecast_key text not null,
  forecast_name text not null default '',
  risk_score numeric(5, 2) not null default 0,
  risk_category text not null default 'operational',
  forecast_horizon text not null default 'quarterly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, forecast_key)
);

-- DailyExecutiveBrief
create table if not exists public.eip_daily_executive_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  brief_key text not null,
  brief_title text not null default '',
  brief_date date not null default current_date,
  summary text not null default '',
  priority_items jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, brief_key)
);

-- WeeklyBusinessSummary
create table if not exists public.eip_weekly_business_summaries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  summary_key text not null,
  summary_title text not null default '',
  summary_week text not null default '',
  highlights text not null default '',
  kpi_summary jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, summary_key)
);

-- MonthlyPerformanceReport
create table if not exists public.eip_monthly_performance_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  report_key text not null,
  report_title text not null default '',
  report_month text not null default '',
  executive_summary text not null default '',
  performance_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- QuarterlyExecutiveReview
create table if not exists public.eip_quarterly_executive_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  review_key text not null,
  review_title text not null default '',
  review_quarter text not null default '',
  strategic_summary text not null default '',
  board_ready boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- AnnualBusinessReport
create table if not exists public.eip_annual_business_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  report_key text not null,
  report_title text not null default '',
  report_year text not null default '',
  annual_summary text not null default '',
  published_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, report_key)
);

-- KpiServiceConfig
create table if not exists public.eip_kpi_service_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  config_key text not null,
  config_name text not null default '',
  config_status text not null default 'active',
  service_endpoint text not null default '',
  refresh_interval text not null default 'hourly',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

-- IntelligenceServiceConfig
create table if not exists public.eip_intelligence_service_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  config_key text not null,
  config_name text not null default '',
  config_status text not null default 'active',
  service_endpoint text not null default '',
  insight_types jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

-- ForecastServiceConfig
create table if not exists public.eip_forecast_service_configs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  config_key text not null,
  config_name text not null default '',
  config_status text not null default 'active',
  service_endpoint text not null default '',
  forecast_models jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, config_key)
);

-- IntelligenceMetric
create table if not exists public.eip_intelligence_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  unified_kpi_score numeric(5, 2) not null default 100,
  business_health_score numeric(5, 2) not null default 100,
  operational_efficiency_score numeric(5, 2) not null default 100,
  growth_score numeric(5, 2) not null default 100,
  revenue_forecast_total numeric(14, 2) not null default 0,
  customer_forecast_total numeric(12, 2) not null default 0,
  risk_score numeric(5, 2) not null default 0,
  overall_intelligence_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- IntelligenceHealth
create table if not exists public.eip_intelligence_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  disaster_recovery_mode boolean not null default false,
  kpi_status text not null default 'healthy',
  intelligence_status text not null default 'healthy',
  forecast_status text not null default 'healthy',
  security_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- MissionProgress
create table if not exists public.eip_mission_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  progress_key text not null,
  progress_name text not null default '',
  progress_percent numeric(5, 2) not null default 0,
  mission_ref text not null default '',
  target_date date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, progress_key)
);

-- IntelligenceFailure
create table if not exists public.eip_intelligence_failures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.eip_intelligence_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'kpi',
  error_code text not null default '',
  error_message text not null default '',
  failed_at timestamptz not null default now(),
  resolved_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, failure_key)
);

-- Audit Logs
create table if not exists public.eip_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  entity_type text not null default '',
  entity_id uuid,
  action text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  performed_by uuid,
  security_level text not null default 'standard',
  created_at timestamptz not null default now()
);

create index if not exists idx_eip_intelligence_hubs_org on public.eip_intelligence_hubs(organization_id);
create index if not exists idx_eip_kpi_registry_org on public.eip_kpi_registry(organization_id);
create index if not exists idx_eip_kpi_registry_hub on public.eip_kpi_registry(hub_id);
create index if not exists idx_eip_kpi_aggregations_org on public.eip_kpi_aggregations(organization_id);
create index if not exists idx_eip_kpi_aggregations_hub on public.eip_kpi_aggregations(hub_id);
create index if not exists idx_eip_kpi_categories_org on public.eip_kpi_categories(organization_id);
create index if not exists idx_eip_kpi_categories_hub on public.eip_kpi_categories(hub_id);
create index if not exists idx_eip_kpi_targets_org on public.eip_kpi_targets(organization_id);
create index if not exists idx_eip_kpi_targets_hub on public.eip_kpi_targets(hub_id);
create index if not exists idx_eip_kpi_thresholds_org on public.eip_kpi_thresholds(organization_id);
create index if not exists idx_eip_kpi_thresholds_hub on public.eip_kpi_thresholds(hub_id);
create index if not exists idx_eip_kpi_snapshots_org on public.eip_kpi_snapshots(organization_id);
create index if not exists idx_eip_kpi_snapshots_hub on public.eip_kpi_snapshots(hub_id);
create index if not exists idx_eip_executive_dashboards_org on public.eip_executive_dashboards(organization_id);
create index if not exists idx_eip_executive_dashboards_hub on public.eip_executive_dashboards(hub_id);
create index if not exists idx_eip_cross_module_insights_org on public.eip_cross_module_insights(organization_id);
create index if not exists idx_eip_cross_module_insights_hub on public.eip_cross_module_insights(hub_id);
create index if not exists idx_eip_business_health_scores_org on public.eip_business_health_scores(organization_id);
create index if not exists idx_eip_business_health_scores_hub on public.eip_business_health_scores(hub_id);
create index if not exists idx_eip_operational_efficiency_scores_org on public.eip_operational_efficiency_scores(organization_id);
create index if not exists idx_eip_operational_efficiency_scores_hub on public.eip_operational_efficiency_scores(hub_id);
create index if not exists idx_eip_growth_scores_org on public.eip_growth_scores(organization_id);
create index if not exists idx_eip_growth_scores_hub on public.eip_growth_scores(hub_id);
create index if not exists idx_eip_strategic_insights_org on public.eip_strategic_insights(organization_id);
create index if not exists idx_eip_strategic_insights_hub on public.eip_strategic_insights(hub_id);
create index if not exists idx_eip_revenue_forecasts_org on public.eip_revenue_forecasts(organization_id);
create index if not exists idx_eip_revenue_forecasts_hub on public.eip_revenue_forecasts(hub_id);
create index if not exists idx_eip_customer_growth_forecasts_org on public.eip_customer_growth_forecasts(organization_id);
create index if not exists idx_eip_customer_growth_forecasts_hub on public.eip_customer_growth_forecasts(hub_id);
create index if not exists idx_eip_renewal_forecasts_org on public.eip_renewal_forecasts(organization_id);
create index if not exists idx_eip_renewal_forecasts_hub on public.eip_renewal_forecasts(hub_id);
create index if not exists idx_eip_capacity_planning_org on public.eip_capacity_planning(organization_id);
create index if not exists idx_eip_capacity_planning_hub on public.eip_capacity_planning(hub_id);
create index if not exists idx_eip_operational_trends_org on public.eip_operational_trends(organization_id);
create index if not exists idx_eip_operational_trends_hub on public.eip_operational_trends(hub_id);
create index if not exists idx_eip_risk_forecasts_org on public.eip_risk_forecasts(organization_id);
create index if not exists idx_eip_risk_forecasts_hub on public.eip_risk_forecasts(hub_id);
create index if not exists idx_eip_daily_executive_briefs_org on public.eip_daily_executive_briefs(organization_id);
create index if not exists idx_eip_daily_executive_briefs_hub on public.eip_daily_executive_briefs(hub_id);
create index if not exists idx_eip_weekly_business_summaries_org on public.eip_weekly_business_summaries(organization_id);
create index if not exists idx_eip_weekly_business_summaries_hub on public.eip_weekly_business_summaries(hub_id);
create index if not exists idx_eip_monthly_performance_reports_org on public.eip_monthly_performance_reports(organization_id);
create index if not exists idx_eip_monthly_performance_reports_hub on public.eip_monthly_performance_reports(hub_id);
create index if not exists idx_eip_quarterly_executive_reviews_org on public.eip_quarterly_executive_reviews(organization_id);
create index if not exists idx_eip_quarterly_executive_reviews_hub on public.eip_quarterly_executive_reviews(hub_id);
create index if not exists idx_eip_annual_business_reports_org on public.eip_annual_business_reports(organization_id);
create index if not exists idx_eip_annual_business_reports_hub on public.eip_annual_business_reports(hub_id);
create index if not exists idx_eip_kpi_service_configs_org on public.eip_kpi_service_configs(organization_id);
create index if not exists idx_eip_kpi_service_configs_hub on public.eip_kpi_service_configs(hub_id);
create index if not exists idx_eip_intelligence_service_configs_org on public.eip_intelligence_service_configs(organization_id);
create index if not exists idx_eip_intelligence_service_configs_hub on public.eip_intelligence_service_configs(hub_id);
create index if not exists idx_eip_forecast_service_configs_org on public.eip_forecast_service_configs(organization_id);
create index if not exists idx_eip_forecast_service_configs_hub on public.eip_forecast_service_configs(hub_id);
create index if not exists idx_eip_intelligence_metrics_org on public.eip_intelligence_metrics(organization_id);
create index if not exists idx_eip_intelligence_health_org on public.eip_intelligence_health(organization_id);
create index if not exists idx_eip_mission_progress_org on public.eip_mission_progress(organization_id);
create index if not exists idx_eip_mission_progress_hub on public.eip_mission_progress(hub_id);
create index if not exists idx_eip_intelligence_failures_org on public.eip_intelligence_failures(organization_id);
create index if not exists idx_eip_intelligence_failures_hub on public.eip_intelligence_failures(hub_id);
create index if not exists idx_eip_audit_logs_org on public.eip_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'eip_intelligence_hubs','eip_kpi_registry','eip_kpi_aggregations','eip_kpi_categories','eip_kpi_targets','eip_kpi_thresholds','eip_kpi_snapshots','eip_executive_dashboards','eip_cross_module_insights','eip_business_health_scores','eip_operational_efficiency_scores','eip_growth_scores','eip_strategic_insights','eip_revenue_forecasts','eip_customer_growth_forecasts','eip_renewal_forecasts','eip_capacity_planning','eip_operational_trends','eip_risk_forecasts','eip_daily_executive_briefs','eip_weekly_business_summaries','eip_monthly_performance_reports','eip_quarterly_executive_reviews','eip_annual_business_reports','eip_kpi_service_configs','eip_intelligence_service_configs','eip_forecast_service_configs','eip_intelligence_metrics','eip_intelligence_health','eip_mission_progress','eip_intelligence_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.eip_intelligence_hubs enable row level security;
alter table public.eip_kpi_registry enable row level security;
alter table public.eip_kpi_aggregations enable row level security;
alter table public.eip_kpi_categories enable row level security;
alter table public.eip_kpi_targets enable row level security;
alter table public.eip_kpi_thresholds enable row level security;
alter table public.eip_kpi_snapshots enable row level security;
alter table public.eip_executive_dashboards enable row level security;
alter table public.eip_cross_module_insights enable row level security;
alter table public.eip_business_health_scores enable row level security;
alter table public.eip_operational_efficiency_scores enable row level security;
alter table public.eip_growth_scores enable row level security;
alter table public.eip_strategic_insights enable row level security;
alter table public.eip_revenue_forecasts enable row level security;
alter table public.eip_customer_growth_forecasts enable row level security;
alter table public.eip_renewal_forecasts enable row level security;
alter table public.eip_capacity_planning enable row level security;
alter table public.eip_operational_trends enable row level security;
alter table public.eip_risk_forecasts enable row level security;
alter table public.eip_daily_executive_briefs enable row level security;
alter table public.eip_weekly_business_summaries enable row level security;
alter table public.eip_monthly_performance_reports enable row level security;
alter table public.eip_quarterly_executive_reviews enable row level security;
alter table public.eip_annual_business_reports enable row level security;
alter table public.eip_kpi_service_configs enable row level security;
alter table public.eip_intelligence_service_configs enable row level security;
alter table public.eip_forecast_service_configs enable row level security;
alter table public.eip_intelligence_metrics enable row level security;
alter table public.eip_intelligence_health enable row level security;
alter table public.eip_mission_progress enable row level security;
alter table public.eip_intelligence_failures enable row level security;
alter table public.eip_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'eip_intelligence_hubs','eip_kpi_registry','eip_kpi_aggregations','eip_kpi_categories','eip_kpi_targets','eip_kpi_thresholds','eip_kpi_snapshots','eip_executive_dashboards','eip_cross_module_insights','eip_business_health_scores','eip_operational_efficiency_scores','eip_growth_scores','eip_strategic_insights','eip_revenue_forecasts','eip_customer_growth_forecasts','eip_renewal_forecasts','eip_capacity_planning','eip_operational_trends','eip_risk_forecasts','eip_daily_executive_briefs','eip_weekly_business_summaries','eip_monthly_performance_reports','eip_quarterly_executive_reviews','eip_annual_business_reports','eip_kpi_service_configs','eip_intelligence_service_configs','eip_forecast_service_configs','eip_intelligence_metrics','eip_intelligence_health','eip_mission_progress','eip_intelligence_failures','eip_audit_logs'
  ]
  loop
    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);
    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);
    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);
    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);
  end loop;
end $$;

insert into public.permissions (key, description, resource)
values
  ('eip.view', 'View enterprise intelligence platform data', 'enterprise_intelligence_platform'),
  ('eip.manage', 'Manage KPI engine, executive intelligence, predictive analytics, reporting, SDK, and dashboard outputs', 'enterprise_intelligence_platform'),
  ('eip.approve', 'Approve enterprise intelligence platform gates and actions', 'enterprise_intelligence_platform'),
  ('eip.admin', 'Administer enterprise intelligence platform governance', 'enterprise_intelligence_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

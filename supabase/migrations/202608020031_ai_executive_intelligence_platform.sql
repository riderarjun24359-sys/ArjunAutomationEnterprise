-- V2 Program A Sprint 8: AI Executive Intelligence Platform

-- IntelligenceHub
create table if not exists public.aix_intelligence_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- DailyExecutiveBrief
create table if not exists public.aix_daily_executive_briefs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  brief_key text not null,
  brief_date date not null default current_date,
  summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  evidence_refs jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, brief_key)
);

-- WeeklyBusinessReview
create table if not exists public.aix_weekly_business_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  review_key text not null,
  week_start date not null default current_date,
  summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  evidence_refs jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, review_key)
);

-- MonthlyExecutiveSummary
create table if not exists public.aix_monthly_executive_summaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  summary_key text not null,
  month_start date not null default current_date,
  summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  evidence_refs jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, summary_key)
);

-- TrialConversionScore
create table if not exists public.aix_trial_conversion_scores (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  score_key text not null,
  conversion_rate numeric(5, 2) not null default 0,
  trial_count integer not null default 0,
  converted_count integer not null default 0,
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, score_key)
);

-- RenewalProbability
create table if not exists public.aix_renewal_probabilities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  probability_key text not null,
  renewal_probability numeric(5, 2) not null default 0,
  account_ref text not null default '',
  contract_end_date date,
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, probability_key)
);

-- ChurnRisk
create table if not exists public.aix_churn_risks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  risk_key text not null,
  churn_score numeric(5, 2) not null default 0,
  risk_level text not null default 'low',
  account_ref text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, risk_key)
);

-- ExpansionOpportunity
create table if not exists public.aix_expansion_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  opportunity_key text not null,
  expansion_score numeric(5, 2) not null default 0,
  account_ref text not null default '',
  opportunity_type text not null default 'upsell',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, opportunity_key)
);

-- MrrTrend
create table if not exists public.aix_mrr_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  trend_key text not null,
  mrr_amount numeric(14, 2) not null default 0,
  trend_direction text not null default 'flat',
  period_start date not null default current_date,
  ai_confidence_score numeric(5, 2) not null default 0,
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- ArrTrend
create table if not exists public.aix_arr_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  trend_key text not null,
  arr_amount numeric(14, 2) not null default 0,
  trend_direction text not null default 'flat',
  period_start date not null default current_date,
  ai_confidence_score numeric(5, 2) not null default 0,
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- RevenueGrowthMetric
create table if not exists public.aix_revenue_growth_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  metrics_key text not null,
  growth_rate numeric(5, 2) not null default 0,
  period_start date not null default current_date,
  period_end date not null default current_date,
  ai_confidence_score numeric(5, 2) not null default 0,
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, metrics_key)
);

-- RevenueRisk
create table if not exists public.aix_revenue_risks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  risk_key text not null,
  risk_amount numeric(14, 2) not null default 0,
  risk_level text not null default 'low',
  risk_category text not null default 'concentration',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, risk_key)
);

-- PlatformHealthIntel
create table if not exists public.aix_platform_health_intel (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  intel_key text not null,
  health_score numeric(5, 2) not null default 100,
  component_summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  last_check_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, intel_key)
);

-- QueueHealthIntel
create table if not exists public.aix_queue_health_intel (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  intel_key text not null,
  queue_depth integer not null default 0,
  health_score numeric(5, 2) not null default 100,
  queue_name text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  last_check_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, intel_key)
);

-- IntegrationHealthIntel
create table if not exists public.aix_integration_health_intel (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  intel_key text not null,
  integration_name text not null default '',
  health_score numeric(5, 2) not null default 100,
  error_rate numeric(5, 2) not null default 0,
  ai_confidence_score numeric(5, 2) not null default 0,
  last_check_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, intel_key)
);

-- PerformanceTrend
create table if not exists public.aix_performance_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  trend_key text not null,
  performance_score numeric(5, 2) not null default 100,
  trend_direction text not null default 'flat',
  metric_window text not null default '24h',
  ai_confidence_score numeric(5, 2) not null default 0,
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- UnusualLoginActivity
create table if not exists public.aix_unusual_login_activity (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  activity_key text not null,
  login_count integer not null default 0,
  risk_level text not null default 'low',
  user_ref text not null default '',
  geo_anomaly text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, activity_key)
);

-- PermissionRisk
create table if not exists public.aix_permission_risks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  risk_key text not null,
  risk_type text not null default 'over_privileged',
  risk_level text not null default 'low',
  subject_ref text not null default '',
  permission_summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, risk_key)
);

-- TenantSecurityTrend
create table if not exists public.aix_tenant_security_trends (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  trend_key text not null,
  security_score numeric(5, 2) not null default 100,
  trend_direction text not null default 'flat',
  tenant_ref text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  recorded_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trend_key)
);

-- ComplianceWarning
create table if not exists public.aix_compliance_warnings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  warning_key text not null,
  compliance_type text not null default 'policy',
  severity text not null default 'info',
  warning_message text not null default '',
  due_date date,
  ai_confidence_score numeric(5, 2) not null default 0,
  detected_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, warning_key)
);

-- TodayPriority
create table if not exists public.aix_today_priorities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  priority_key text not null,
  priority_title text not null default '',
  priority_rank integer not null default 1,
  priority_category text not null default 'operational',
  ai_confidence_score numeric(5, 2) not null default 0,
  priority_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, priority_key)
);

-- RecommendedAction
create table if not exists public.aix_recommended_actions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  action_key text not null,
  action_title text not null default '',
  action_type text not null default 'review',
  action_summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  evidence_refs jsonb not null default '[]'::jsonb,
  recommended_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, action_key)
);

-- BusinessRisk
create table if not exists public.aix_business_risks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  risk_key text not null,
  risk_title text not null default '',
  risk_level text not null default 'low',
  risk_category text not null default 'operational',
  impact_summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, risk_key)
);

-- GrowthOpportunity
create table if not exists public.aix_growth_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null default '',
  growth_score numeric(5, 2) not null default 0,
  opportunity_category text not null default 'expansion',
  impact_summary text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  scored_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, opportunity_key)
);

-- KnowledgeReasoningSession
create table if not exists public.aix_knowledge_reasoning_sessions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  session_key text not null,
  reasoning_type text not null default 'executive',
  objective text not null default '',
  ai_confidence_score numeric(5, 2) not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, session_key)
);

-- EvidenceTrace
create table if not exists public.aix_evidence_traces (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  trace_key text not null,
  source_module text not null default '',
  trace_summary text not null default '',
  evidence_refs jsonb not null default '[]'::jsonb,
  traced_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, trace_key)
);

-- OrchestrationLink
create table if not exists public.aix_orchestration_links (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  link_key text not null,
  link_type text not null default 'agent',
  target_ref text not null default '',
  link_context jsonb not null default '{}'::jsonb,
  ai_confidence_score numeric(5, 2) not null default 0,
  linked_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, link_key)
);

-- RecommendationOutput
create table if not exists public.aix_recommendation_outputs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  output_key text not null,
  recommendation_text text not null default '',
  recommendation_type text not null default 'action',
  ai_confidence_score numeric(5, 2) not null default 0,
  evidence_refs jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, output_key)
);

-- ExecutiveMetric
create table if not exists public.aix_executive_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  business_score numeric(5, 2) not null default 100,
  growth_score numeric(5, 2) not null default 100,
  operational_score numeric(5, 2) not null default 100,
  security_score numeric(5, 2) not null default 100,
  customer_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- ExecutiveHealth
create table if not exists public.aix_executive_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  uptime_percent numeric(5, 2) not null default 99.9,
  disaster_recovery_mode boolean not null default false,
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ExecutiveFailure
create table if not exists public.aix_executive_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aix_intelligence_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'reasoning',
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
create table if not exists public.aix_audit_logs (
  id uuid primary key default uuid_generate_v4(),
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

create index if not exists idx_aix_intelligence_hubs_org on public.aix_intelligence_hubs(organization_id);
create index if not exists idx_aix_daily_executive_briefs_org on public.aix_daily_executive_briefs(organization_id);
create index if not exists idx_aix_daily_executive_briefs_hub on public.aix_daily_executive_briefs(hub_id);
create index if not exists idx_aix_weekly_business_reviews_org on public.aix_weekly_business_reviews(organization_id);
create index if not exists idx_aix_weekly_business_reviews_hub on public.aix_weekly_business_reviews(hub_id);
create index if not exists idx_aix_monthly_executive_summaries_org on public.aix_monthly_executive_summaries(organization_id);
create index if not exists idx_aix_monthly_executive_summaries_hub on public.aix_monthly_executive_summaries(hub_id);
create index if not exists idx_aix_trial_conversion_scores_org on public.aix_trial_conversion_scores(organization_id);
create index if not exists idx_aix_trial_conversion_scores_hub on public.aix_trial_conversion_scores(hub_id);
create index if not exists idx_aix_renewal_probabilities_org on public.aix_renewal_probabilities(organization_id);
create index if not exists idx_aix_renewal_probabilities_hub on public.aix_renewal_probabilities(hub_id);
create index if not exists idx_aix_churn_risks_org on public.aix_churn_risks(organization_id);
create index if not exists idx_aix_churn_risks_hub on public.aix_churn_risks(hub_id);
create index if not exists idx_aix_expansion_opportunities_org on public.aix_expansion_opportunities(organization_id);
create index if not exists idx_aix_expansion_opportunities_hub on public.aix_expansion_opportunities(hub_id);
create index if not exists idx_aix_mrr_trends_org on public.aix_mrr_trends(organization_id);
create index if not exists idx_aix_mrr_trends_hub on public.aix_mrr_trends(hub_id);
create index if not exists idx_aix_arr_trends_org on public.aix_arr_trends(organization_id);
create index if not exists idx_aix_arr_trends_hub on public.aix_arr_trends(hub_id);
create index if not exists idx_aix_revenue_growth_metrics_org on public.aix_revenue_growth_metrics(organization_id);
create index if not exists idx_aix_revenue_growth_metrics_hub on public.aix_revenue_growth_metrics(hub_id);
create index if not exists idx_aix_revenue_risks_org on public.aix_revenue_risks(organization_id);
create index if not exists idx_aix_revenue_risks_hub on public.aix_revenue_risks(hub_id);
create index if not exists idx_aix_platform_health_intel_org on public.aix_platform_health_intel(organization_id);
create index if not exists idx_aix_platform_health_intel_hub on public.aix_platform_health_intel(hub_id);
create index if not exists idx_aix_queue_health_intel_org on public.aix_queue_health_intel(organization_id);
create index if not exists idx_aix_queue_health_intel_hub on public.aix_queue_health_intel(hub_id);
create index if not exists idx_aix_integration_health_intel_org on public.aix_integration_health_intel(organization_id);
create index if not exists idx_aix_integration_health_intel_hub on public.aix_integration_health_intel(hub_id);
create index if not exists idx_aix_performance_trends_org on public.aix_performance_trends(organization_id);
create index if not exists idx_aix_performance_trends_hub on public.aix_performance_trends(hub_id);
create index if not exists idx_aix_unusual_login_activity_org on public.aix_unusual_login_activity(organization_id);
create index if not exists idx_aix_unusual_login_activity_hub on public.aix_unusual_login_activity(hub_id);
create index if not exists idx_aix_permission_risks_org on public.aix_permission_risks(organization_id);
create index if not exists idx_aix_permission_risks_hub on public.aix_permission_risks(hub_id);
create index if not exists idx_aix_tenant_security_trends_org on public.aix_tenant_security_trends(organization_id);
create index if not exists idx_aix_tenant_security_trends_hub on public.aix_tenant_security_trends(hub_id);
create index if not exists idx_aix_compliance_warnings_org on public.aix_compliance_warnings(organization_id);
create index if not exists idx_aix_compliance_warnings_hub on public.aix_compliance_warnings(hub_id);
create index if not exists idx_aix_today_priorities_org on public.aix_today_priorities(organization_id);
create index if not exists idx_aix_today_priorities_hub on public.aix_today_priorities(hub_id);
create index if not exists idx_aix_recommended_actions_org on public.aix_recommended_actions(organization_id);
create index if not exists idx_aix_recommended_actions_hub on public.aix_recommended_actions(hub_id);
create index if not exists idx_aix_business_risks_org on public.aix_business_risks(organization_id);
create index if not exists idx_aix_business_risks_hub on public.aix_business_risks(hub_id);
create index if not exists idx_aix_growth_opportunities_org on public.aix_growth_opportunities(organization_id);
create index if not exists idx_aix_growth_opportunities_hub on public.aix_growth_opportunities(hub_id);
create index if not exists idx_aix_knowledge_reasoning_sessions_org on public.aix_knowledge_reasoning_sessions(organization_id);
create index if not exists idx_aix_knowledge_reasoning_sessions_hub on public.aix_knowledge_reasoning_sessions(hub_id);
create index if not exists idx_aix_evidence_traces_org on public.aix_evidence_traces(organization_id);
create index if not exists idx_aix_evidence_traces_hub on public.aix_evidence_traces(hub_id);
create index if not exists idx_aix_orchestration_links_org on public.aix_orchestration_links(organization_id);
create index if not exists idx_aix_orchestration_links_hub on public.aix_orchestration_links(hub_id);
create index if not exists idx_aix_recommendation_outputs_org on public.aix_recommendation_outputs(organization_id);
create index if not exists idx_aix_recommendation_outputs_hub on public.aix_recommendation_outputs(hub_id);
create index if not exists idx_aix_executive_metrics_org on public.aix_executive_metrics(organization_id);
create index if not exists idx_aix_executive_health_org on public.aix_executive_health(organization_id);
create index if not exists idx_aix_executive_failures_org on public.aix_executive_failures(organization_id);
create index if not exists idx_aix_executive_failures_hub on public.aix_executive_failures(hub_id);
create index if not exists idx_aix_audit_logs_org on public.aix_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aix_intelligence_hubs','aix_daily_executive_briefs','aix_weekly_business_reviews','aix_monthly_executive_summaries','aix_trial_conversion_scores','aix_renewal_probabilities','aix_churn_risks','aix_expansion_opportunities','aix_mrr_trends','aix_arr_trends','aix_revenue_growth_metrics','aix_revenue_risks','aix_platform_health_intel','aix_queue_health_intel','aix_integration_health_intel','aix_performance_trends','aix_unusual_login_activity','aix_permission_risks','aix_tenant_security_trends','aix_compliance_warnings','aix_today_priorities','aix_recommended_actions','aix_business_risks','aix_growth_opportunities','aix_knowledge_reasoning_sessions','aix_evidence_traces','aix_orchestration_links','aix_recommendation_outputs','aix_executive_metrics','aix_executive_health','aix_executive_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.aix_intelligence_hubs enable row level security;
alter table public.aix_daily_executive_briefs enable row level security;
alter table public.aix_weekly_business_reviews enable row level security;
alter table public.aix_monthly_executive_summaries enable row level security;
alter table public.aix_trial_conversion_scores enable row level security;
alter table public.aix_renewal_probabilities enable row level security;
alter table public.aix_churn_risks enable row level security;
alter table public.aix_expansion_opportunities enable row level security;
alter table public.aix_mrr_trends enable row level security;
alter table public.aix_arr_trends enable row level security;
alter table public.aix_revenue_growth_metrics enable row level security;
alter table public.aix_revenue_risks enable row level security;
alter table public.aix_platform_health_intel enable row level security;
alter table public.aix_queue_health_intel enable row level security;
alter table public.aix_integration_health_intel enable row level security;
alter table public.aix_performance_trends enable row level security;
alter table public.aix_unusual_login_activity enable row level security;
alter table public.aix_permission_risks enable row level security;
alter table public.aix_tenant_security_trends enable row level security;
alter table public.aix_compliance_warnings enable row level security;
alter table public.aix_today_priorities enable row level security;
alter table public.aix_recommended_actions enable row level security;
alter table public.aix_business_risks enable row level security;
alter table public.aix_growth_opportunities enable row level security;
alter table public.aix_knowledge_reasoning_sessions enable row level security;
alter table public.aix_evidence_traces enable row level security;
alter table public.aix_orchestration_links enable row level security;
alter table public.aix_recommendation_outputs enable row level security;
alter table public.aix_executive_metrics enable row level security;
alter table public.aix_executive_health enable row level security;
alter table public.aix_executive_failures enable row level security;
alter table public.aix_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aix_intelligence_hubs','aix_daily_executive_briefs','aix_weekly_business_reviews','aix_monthly_executive_summaries','aix_trial_conversion_scores','aix_renewal_probabilities','aix_churn_risks','aix_expansion_opportunities','aix_mrr_trends','aix_arr_trends','aix_revenue_growth_metrics','aix_revenue_risks','aix_platform_health_intel','aix_queue_health_intel','aix_integration_health_intel','aix_performance_trends','aix_unusual_login_activity','aix_permission_risks','aix_tenant_security_trends','aix_compliance_warnings','aix_today_priorities','aix_recommended_actions','aix_business_risks','aix_growth_opportunities','aix_knowledge_reasoning_sessions','aix_evidence_traces','aix_orchestration_links','aix_recommendation_outputs','aix_executive_metrics','aix_executive_health','aix_executive_failures','aix_audit_logs'
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
  ('aix.view', 'View AI executive intelligence platform data', 'ai_executive_intelligence_platform'),
  ('aix.manage', 'Manage executive briefs, recommendations, and intelligence outputs', 'ai_executive_intelligence_platform'),
  ('aix.approve', 'Approve executive recommendations and intelligence actions', 'ai_executive_intelligence_platform'),
  ('aix.admin', 'Administer AI executive intelligence platform governance', 'ai_executive_intelligence_platform')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

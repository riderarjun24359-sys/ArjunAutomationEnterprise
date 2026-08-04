-- V2 AAGE Operational Growth Engine

-- OperationsHub
create table if not exists public.aago_operations_hubs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  operations_tier text not null default 'operational',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- BrandKnowledgeBase
create table if not exists public.aago_brand_knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null default '',
  knowledge_status text not null default 'active',
  knowledge_category text not null default 'general',
  content_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, knowledge_key)
);

-- BrandRulebook
create table if not exists public.aago_brand_rulebook (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  rulebook_key text not null,
  rulebook_name text not null default '',
  rulebook_status text not null default 'active',
  rulebook_version text not null default '1.0',
  owner_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rulebook_key)
);

-- MessagingLibrary
create table if not exists public.aago_messaging_library (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  message_key text not null,
  message_title text not null default '',
  message_status text not null default 'active',
  message_type text not null default 'value_prop',
  audience_segment text not null default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, message_key)
);

-- ServiceLibrary
create table if not exists public.aago_service_library (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  service_key text not null,
  service_name text not null default '',
  service_status text not null default 'active',
  service_category text not null default 'core',
  pricing_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, service_key)
);

-- IndustryLibrary
create table if not exists public.aago_industry_library (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  industry_key text not null,
  industry_name text not null default '',
  industry_status text not null default 'active',
  vertical text not null default 'technology',
  segment text not null default 'enterprise',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, industry_key)
);

-- FaqLibrary
create table if not exists public.aago_faq_library (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  faq_key text not null,
  faq_question text not null default '',
  faq_status text not null default 'active',
  faq_category text not null default 'general',
  answer_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, faq_key)
);

-- BrandApprovalRule
create table if not exists public.aago_brand_approval_rules (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  rule_key text not null,
  rule_name text not null default '',
  rule_status text not null default 'active',
  approval_level text not null default 'manager',
  entity_type text not null default 'brand',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, rule_key)
);

-- VideoProject
create table if not exists public.aago_video_projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  project_key text not null,
  project_name text not null default '',
  project_status text not null default 'draft',
  video_format text not null default 'long_form',
  duration_seconds integer not null default 600,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, project_key)
);

-- ThumbnailManager
create table if not exists public.aago_thumbnail_manager (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  thumbnail_key text not null,
  thumbnail_name text not null default '',
  thumbnail_status text not null default 'active',
  aspect_ratio text not null default '16:9',
  style text not null default 'bold',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, thumbnail_key)
);

-- VoiceoverManager
create table if not exists public.aago_voiceover_manager (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  voiceover_key text not null,
  voiceover_name text not null default '',
  voiceover_status text not null default 'active',
  voice_type text not null default 'narrator',
  language text not null default 'en-US',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, voiceover_key)
);

-- CreativeAssetGenerator
create table if not exists public.aago_creative_asset_generator (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  asset_type text not null default 'image',
  output_format text not null default 'png',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- CampaignAssetBuilder
create table if not exists public.aago_campaign_asset_builder (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  builder_key text not null,
  builder_name text not null default '',
  builder_status text not null default 'active',
  campaign_type text not null default 'launch',
  asset_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, builder_key)
);

-- CreativeWorkflow
create table if not exists public.aago_creative_workflows (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null default '',
  workflow_status text not null default 'active',
  workflow_type text not null default 'production',
  step_count integer not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, workflow_key)
);

-- DistributionContentQueue
create table if not exists public.aago_distribution_content_queue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  queue_key text not null,
  queue_title text not null default '',
  queue_status text not null default 'draft',
  content_type text not null default 'blog',
  priority text not null default 'medium',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

-- DistributionPublishingQueue
create table if not exists public.aago_distribution_publishing_queue (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  queue_key text not null,
  queue_title text not null default '',
  queue_status text not null default 'scheduled',
  content_type text not null default 'blog',
  publish_date date not null default current_date,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

-- ChannelManager
create table if not exists public.aago_channel_manager (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  channel_key text not null,
  channel_name text not null default '',
  channel_status text not null default 'active',
  platform text not null default 'linkedin',
  post_type text not null default 'organic',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, channel_key)
);

-- ApprovalCenter
create table if not exists public.aago_approval_center (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  approval_key text not null,
  approval_title text not null default '',
  approval_status text not null default 'pending',
  content_type text not null default 'blog',
  approver_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, approval_key)
);

-- PublishingHistory
create table if not exists public.aago_publishing_history (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  history_key text not null,
  history_title text not null default '',
  history_status text not null default 'published',
  content_type text not null default 'blog',
  published_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, history_key)
);

-- DistributionAnalytics
create table if not exists public.aago_distribution_analytics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  analytics_key text not null,
  analytics_name text not null default '',
  analytics_score numeric(5, 2) not null default 0,
  analytics_type text not null default 'reach',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, analytics_key)
);

-- CampaignDashboard
create table if not exists public.aago_campaign_dashboard (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  dashboard_key text not null,
  dashboard_name text not null default '',
  dashboard_status text not null default 'active',
  campaign_ref text not null default '',
  refresh_cadence text not null default 'daily',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, dashboard_key)
);

-- ContentPerformance
create table if not exists public.aago_content_performance (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  performance_key text not null,
  performance_title text not null default '',
  performance_score numeric(5, 2) not null default 0,
  content_type text not null default 'blog',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, performance_key)
);

-- LeadAttribution
create table if not exists public.aago_lead_attribution (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  attribution_key text not null,
  attribution_title text not null default '',
  attribution_status text not null default 'active',
  channel_ref text not null default '',
  conversion_rate numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, attribution_key)
);

-- GrowthKpi
create table if not exists public.aago_growth_kpis (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  kpi_key text not null,
  kpi_name text not null default '',
  kpi_value numeric(12, 2) not null default 0,
  kpi_category text not null default 'growth',
  target_value numeric(12, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, kpi_key)
);

-- RoiDashboard
create table if not exists public.aago_roi_dashboard (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  roi_key text not null,
  roi_name text not null default '',
  roi_score numeric(5, 2) not null default 0,
  campaign_ref text not null default '',
  measured_at timestamptz not null default now(),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, roi_key)
);

-- RecommendationEngine
create table if not exists public.aago_recommendation_engine (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null default '',
  recommendation_status text not null default 'active',
  recommendation_type text not null default 'content',
  confidence_score numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, recommendation_key)
);

-- CommandCenterMetric
create table if not exists public.aago_command_center_metrics (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  mission_status_score numeric(5, 2) not null default 0,
  content_status_score numeric(5, 2) not null default 0,
  publishing_status_score numeric(5, 2) not null default 0,
  growth_metrics_score numeric(5, 2) not null default 0,
  campaign_health_score numeric(5, 2) not null default 0,
  executive_summary_score numeric(5, 2) not null default 0,
  overall_operations_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- CommandCenterHealth
create table if not exists public.aago_command_center_health (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  brand_os_status text not null default 'healthy',
  creative_studio_status text not null default 'healthy',
  distribution_status text not null default 'healthy',
  intelligence_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- MissionStatus
create table if not exists public.aago_mission_status (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  mission_key text not null,
  mission_name text not null default '',
  mission_status text not null default 'active',
  mission_type text not null default 'growth',
  progress_percent numeric(5, 2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, mission_key)
);

-- ExecutiveSummary
create table if not exists public.aago_executive_summaries (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  summary_key text not null,
  summary_title text not null default '',
  summary_status text not null default 'draft',
  summary_period text not null default 'weekly',
  author_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, summary_key)
);

-- OperationalFailure
create table if not exists public.aago_operational_failures (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aago_operations_hubs(id) on delete cascade,
  failure_key text not null,
  failure_type text not null default 'operational',
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
create table if not exists public.aago_audit_logs (
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

create index if not exists idx_aago_operations_hubs_org on public.aago_operations_hubs(organization_id);
create index if not exists idx_aago_brand_knowledge_base_org on public.aago_brand_knowledge_base(organization_id);
create index if not exists idx_aago_brand_knowledge_base_hub on public.aago_brand_knowledge_base(hub_id);
create index if not exists idx_aago_brand_rulebook_org on public.aago_brand_rulebook(organization_id);
create index if not exists idx_aago_brand_rulebook_hub on public.aago_brand_rulebook(hub_id);
create index if not exists idx_aago_messaging_library_org on public.aago_messaging_library(organization_id);
create index if not exists idx_aago_messaging_library_hub on public.aago_messaging_library(hub_id);
create index if not exists idx_aago_service_library_org on public.aago_service_library(organization_id);
create index if not exists idx_aago_service_library_hub on public.aago_service_library(hub_id);
create index if not exists idx_aago_industry_library_org on public.aago_industry_library(organization_id);
create index if not exists idx_aago_industry_library_hub on public.aago_industry_library(hub_id);
create index if not exists idx_aago_faq_library_org on public.aago_faq_library(organization_id);
create index if not exists idx_aago_faq_library_hub on public.aago_faq_library(hub_id);
create index if not exists idx_aago_brand_approval_rules_org on public.aago_brand_approval_rules(organization_id);
create index if not exists idx_aago_brand_approval_rules_hub on public.aago_brand_approval_rules(hub_id);
create index if not exists idx_aago_video_projects_org on public.aago_video_projects(organization_id);
create index if not exists idx_aago_video_projects_hub on public.aago_video_projects(hub_id);
create index if not exists idx_aago_thumbnail_manager_org on public.aago_thumbnail_manager(organization_id);
create index if not exists idx_aago_thumbnail_manager_hub on public.aago_thumbnail_manager(hub_id);
create index if not exists idx_aago_voiceover_manager_org on public.aago_voiceover_manager(organization_id);
create index if not exists idx_aago_voiceover_manager_hub on public.aago_voiceover_manager(hub_id);
create index if not exists idx_aago_creative_asset_generator_org on public.aago_creative_asset_generator(organization_id);
create index if not exists idx_aago_creative_asset_generator_hub on public.aago_creative_asset_generator(hub_id);
create index if not exists idx_aago_campaign_asset_builder_org on public.aago_campaign_asset_builder(organization_id);
create index if not exists idx_aago_campaign_asset_builder_hub on public.aago_campaign_asset_builder(hub_id);
create index if not exists idx_aago_creative_workflows_org on public.aago_creative_workflows(organization_id);
create index if not exists idx_aago_creative_workflows_hub on public.aago_creative_workflows(hub_id);
create index if not exists idx_aago_distribution_content_queue_org on public.aago_distribution_content_queue(organization_id);
create index if not exists idx_aago_distribution_content_queue_hub on public.aago_distribution_content_queue(hub_id);
create index if not exists idx_aago_distribution_publishing_queue_org on public.aago_distribution_publishing_queue(organization_id);
create index if not exists idx_aago_distribution_publishing_queue_hub on public.aago_distribution_publishing_queue(hub_id);
create index if not exists idx_aago_channel_manager_org on public.aago_channel_manager(organization_id);
create index if not exists idx_aago_channel_manager_hub on public.aago_channel_manager(hub_id);
create index if not exists idx_aago_approval_center_org on public.aago_approval_center(organization_id);
create index if not exists idx_aago_approval_center_hub on public.aago_approval_center(hub_id);
create index if not exists idx_aago_publishing_history_org on public.aago_publishing_history(organization_id);
create index if not exists idx_aago_publishing_history_hub on public.aago_publishing_history(hub_id);
create index if not exists idx_aago_distribution_analytics_org on public.aago_distribution_analytics(organization_id);
create index if not exists idx_aago_distribution_analytics_hub on public.aago_distribution_analytics(hub_id);
create index if not exists idx_aago_campaign_dashboard_org on public.aago_campaign_dashboard(organization_id);
create index if not exists idx_aago_campaign_dashboard_hub on public.aago_campaign_dashboard(hub_id);
create index if not exists idx_aago_content_performance_org on public.aago_content_performance(organization_id);
create index if not exists idx_aago_content_performance_hub on public.aago_content_performance(hub_id);
create index if not exists idx_aago_lead_attribution_org on public.aago_lead_attribution(organization_id);
create index if not exists idx_aago_lead_attribution_hub on public.aago_lead_attribution(hub_id);
create index if not exists idx_aago_growth_kpis_org on public.aago_growth_kpis(organization_id);
create index if not exists idx_aago_growth_kpis_hub on public.aago_growth_kpis(hub_id);
create index if not exists idx_aago_roi_dashboard_org on public.aago_roi_dashboard(organization_id);
create index if not exists idx_aago_roi_dashboard_hub on public.aago_roi_dashboard(hub_id);
create index if not exists idx_aago_recommendation_engine_org on public.aago_recommendation_engine(organization_id);
create index if not exists idx_aago_recommendation_engine_hub on public.aago_recommendation_engine(hub_id);
create index if not exists idx_aago_command_center_metrics_org on public.aago_command_center_metrics(organization_id);
create index if not exists idx_aago_command_center_health_org on public.aago_command_center_health(organization_id);
create index if not exists idx_aago_mission_status_org on public.aago_mission_status(organization_id);
create index if not exists idx_aago_mission_status_hub on public.aago_mission_status(hub_id);
create index if not exists idx_aago_executive_summaries_org on public.aago_executive_summaries(organization_id);
create index if not exists idx_aago_executive_summaries_hub on public.aago_executive_summaries(hub_id);
create index if not exists idx_aago_operational_failures_org on public.aago_operational_failures(organization_id);
create index if not exists idx_aago_operational_failures_hub on public.aago_operational_failures(hub_id);
create index if not exists idx_aago_audit_logs_org on public.aago_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aago_operations_hubs','aago_brand_knowledge_base','aago_brand_rulebook','aago_messaging_library','aago_service_library','aago_industry_library','aago_faq_library','aago_brand_approval_rules','aago_video_projects','aago_thumbnail_manager','aago_voiceover_manager','aago_creative_asset_generator','aago_campaign_asset_builder','aago_creative_workflows','aago_distribution_content_queue','aago_distribution_publishing_queue','aago_channel_manager','aago_approval_center','aago_publishing_history','aago_distribution_analytics','aago_campaign_dashboard','aago_content_performance','aago_lead_attribution','aago_growth_kpis','aago_roi_dashboard','aago_recommendation_engine','aago_command_center_metrics','aago_command_center_health','aago_mission_status','aago_executive_summaries','aago_operational_failures'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.aago_operations_hubs enable row level security;
alter table public.aago_brand_knowledge_base enable row level security;
alter table public.aago_brand_rulebook enable row level security;
alter table public.aago_messaging_library enable row level security;
alter table public.aago_service_library enable row level security;
alter table public.aago_industry_library enable row level security;
alter table public.aago_faq_library enable row level security;
alter table public.aago_brand_approval_rules enable row level security;
alter table public.aago_video_projects enable row level security;
alter table public.aago_thumbnail_manager enable row level security;
alter table public.aago_voiceover_manager enable row level security;
alter table public.aago_creative_asset_generator enable row level security;
alter table public.aago_campaign_asset_builder enable row level security;
alter table public.aago_creative_workflows enable row level security;
alter table public.aago_distribution_content_queue enable row level security;
alter table public.aago_distribution_publishing_queue enable row level security;
alter table public.aago_channel_manager enable row level security;
alter table public.aago_approval_center enable row level security;
alter table public.aago_publishing_history enable row level security;
alter table public.aago_distribution_analytics enable row level security;
alter table public.aago_campaign_dashboard enable row level security;
alter table public.aago_content_performance enable row level security;
alter table public.aago_lead_attribution enable row level security;
alter table public.aago_growth_kpis enable row level security;
alter table public.aago_roi_dashboard enable row level security;
alter table public.aago_recommendation_engine enable row level security;
alter table public.aago_command_center_metrics enable row level security;
alter table public.aago_command_center_health enable row level security;
alter table public.aago_mission_status enable row level security;
alter table public.aago_executive_summaries enable row level security;
alter table public.aago_operational_failures enable row level security;
alter table public.aago_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aago_operations_hubs','aago_brand_knowledge_base','aago_brand_rulebook','aago_messaging_library','aago_service_library','aago_industry_library','aago_faq_library','aago_brand_approval_rules','aago_video_projects','aago_thumbnail_manager','aago_voiceover_manager','aago_creative_asset_generator','aago_campaign_asset_builder','aago_creative_workflows','aago_distribution_content_queue','aago_distribution_publishing_queue','aago_channel_manager','aago_approval_center','aago_publishing_history','aago_distribution_analytics','aago_campaign_dashboard','aago_content_performance','aago_lead_attribution','aago_growth_kpis','aago_roi_dashboard','aago_recommendation_engine','aago_command_center_metrics','aago_command_center_health','aago_mission_status','aago_executive_summaries','aago_operational_failures','aago_audit_logs'
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
  ('aage.view', 'View Arjun Automation growth engine data', 'arjun_automation_growth_engine'),
  ('aage.manage', 'Manage brand OS, creative studio, distribution, intelligence, and command center outputs', 'arjun_automation_growth_engine'),
  ('aage.approve', 'Approve growth engine gates and actions', 'arjun_automation_growth_engine'),
  ('aage.admin', 'Administer Arjun Automation growth engine', 'arjun_automation_growth_engine')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

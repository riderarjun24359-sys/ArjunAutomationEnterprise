-- V2 Arjun Automation Growth Engine

-- GrowthHub
create table if not exists public.aage_growth_hubs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_key text not null,
  hub_name text not null,
  environment text not null default 'production',
  growth_tier text not null default 'growth',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_key)
);

-- BrandProfile
create table if not exists public.aage_brand_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  profile_status text not null default 'active',
  brand_tagline text not null default '',
  target_audience text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- BrandVoice
create table if not exists public.aage_brand_voice (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  voice_key text not null,
  voice_name text not null default '',
  voice_tone text not null default 'professional',
  voice_style text not null default 'conversational',
  formality_level text not null default 'medium',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, voice_key)
);

-- CoreMessaging
create table if not exists public.aage_core_messaging (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  messaging_key text not null,
  messaging_title text not null default '',
  messaging_status text not null default 'active',
  messaging_type text not null default 'value_prop',
  audience_segment text not null default 'general',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, messaging_key)
);

-- BrandGuideline
create table if not exists public.aage_brand_guidelines (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  guideline_key text not null,
  guideline_name text not null default '',
  guideline_status text not null default 'active',
  guideline_category text not null default 'visual',
  version text not null default '1.0',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, guideline_key)
);

-- LogoLibrary
create table if not exists public.aage_logo_library (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  logo_key text not null,
  logo_name text not null default '',
  logo_format text not null default 'svg',
  logo_variant text not null default 'primary',
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, logo_key)
);

-- ColorSystem
create table if not exists public.aage_color_systems (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  color_key text not null,
  color_name text not null default '',
  primary_hex text not null default '#db2777',
  secondary_hex text not null default '#831843',
  accent_hex text not null default '#f472b6',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, color_key)
);

-- YoutubeTemplate
create table if not exists public.aage_youtube_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  video_format text not null default 'long_form',
  duration_seconds integer not null default 600,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- SocialTemplate
create table if not exists public.aage_social_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  platform text not null default 'linkedin',
  post_type text not null default 'carousel',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- BlogTemplate
create table if not exists public.aage_blog_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  word_count_target integer not null default 1200,
  content_type text not null default 'thought_leadership',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- WebsiteArticleTemplate
create table if not exists public.aage_website_article_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  page_type text not null default 'landing',
  seo_focus text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- EmailCampaignTemplate
create table if not exists public.aage_email_campaign_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  campaign_type text not null default 'nurture',
  subject_line text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- CaseStudyTemplate
create table if not exists public.aage_case_study_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  industry text not null default 'technology',
  outcome_type text not null default 'roi',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- ImageAsset
create table if not exists public.aage_image_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  asset_type text not null default 'hero',
  asset_format text not null default 'png',
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- VideoAsset
create table if not exists public.aage_video_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  asset_type text not null default 'promo',
  duration_seconds integer not null default 60,
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- IconAsset
create table if not exists public.aage_icon_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  asset_type text not null default 'feature',
  icon_style text not null default 'outline',
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- VoiceProfile
create table if not exists public.aage_voice_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  profile_key text not null,
  profile_name text not null default '',
  voice_type text not null default 'narrator',
  language text not null default 'en-US',
  sample_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, profile_key)
);

-- MusicAsset
create table if not exists public.aage_music_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  asset_key text not null,
  asset_name text not null default '',
  genre text not null default 'corporate',
  mood text not null default 'uplifting',
  asset_url text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, asset_key)
);

-- ThumbnailTemplate
create table if not exists public.aage_thumbnail_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  template_key text not null,
  template_name text not null default '',
  template_status text not null default 'active',
  aspect_ratio text not null default '16:9',
  style text not null default 'bold',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, template_key)
);

-- IdeaGenerator
create table if not exists public.aage_idea_generators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  content_type text not null default 'blog',
  output_format text not null default 'outline',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- ScriptGenerator
create table if not exists public.aage_script_generators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  script_type text not null default 'video',
  target_length integer not null default 500,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- CaptionGenerator
create table if not exists public.aage_caption_generators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  platform text not null default 'instagram',
  tone text not null default 'engaging',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- BlogGenerator
create table if not exists public.aage_blog_generators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  topic_category text not null default 'automation',
  word_count integer not null default 1000,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- SeoAssistant
create table if not exists public.aage_seo_assistants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  assistant_key text not null,
  assistant_name text not null default '',
  assistant_status text not null default 'active',
  keyword_focus text not null default '',
  search_intent text not null default 'informational',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, assistant_key)
);

-- CtaGenerator
create table if not exists public.aage_cta_generators (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  generator_key text not null,
  generator_name text not null default '',
  generator_status text not null default 'active',
  cta_type text not null default 'button',
  conversion_goal text not null default 'signup',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, generator_key)
);

-- GrowthMetric
create table if not exists public.aage_growth_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metrics_key text not null,
  metric_date date not null default current_date,
  marketing_overview_score numeric(5, 2) not null default 0,
  content_calendar_count integer not null default 0,
  draft_queue_count integer not null default 0,
  approval_queue_count integer not null default 0,
  publishing_queue_count integer not null default 0,
  brand_health_score numeric(5, 2) not null default 100,
  overall_growth_score numeric(5, 2) not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, metrics_key)
);

-- GrowthHealth
create table if not exists public.aage_growth_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  health_key text not null,
  health_date date not null default current_date,
  overall_score numeric(5, 2) not null default 100,
  brand_status text not null default 'healthy',
  content_status text not null default 'healthy',
  media_status text not null default 'healthy',
  engine_status text not null default 'healthy',
  summary text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_key)
);

-- ContentCalendar
create table if not exists public.aage_content_calendar (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  calendar_key text not null,
  calendar_name text not null default '',
  calendar_status text not null default 'active',
  scheduled_date date not null default current_date,
  content_type text not null default 'blog',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, calendar_key)
);

-- DraftQueue
create table if not exists public.aage_draft_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
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

-- ApprovalQueue
create table if not exists public.aage_approval_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
  queue_key text not null,
  queue_title text not null default '',
  queue_status text not null default 'pending',
  content_type text not null default 'blog',
  approver_ref text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, hub_id, queue_key)
);

-- PublishingQueue
create table if not exists public.aage_publishing_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  hub_id uuid not null references public.aage_growth_hubs(id) on delete cascade,
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

-- Audit Logs
create table if not exists public.aage_audit_logs (
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

create index if not exists idx_aage_growth_hubs_org on public.aage_growth_hubs(organization_id);
create index if not exists idx_aage_brand_profiles_org on public.aage_brand_profiles(organization_id);
create index if not exists idx_aage_brand_profiles_hub on public.aage_brand_profiles(hub_id);
create index if not exists idx_aage_brand_voice_org on public.aage_brand_voice(organization_id);
create index if not exists idx_aage_brand_voice_hub on public.aage_brand_voice(hub_id);
create index if not exists idx_aage_core_messaging_org on public.aage_core_messaging(organization_id);
create index if not exists idx_aage_core_messaging_hub on public.aage_core_messaging(hub_id);
create index if not exists idx_aage_brand_guidelines_org on public.aage_brand_guidelines(organization_id);
create index if not exists idx_aage_brand_guidelines_hub on public.aage_brand_guidelines(hub_id);
create index if not exists idx_aage_logo_library_org on public.aage_logo_library(organization_id);
create index if not exists idx_aage_logo_library_hub on public.aage_logo_library(hub_id);
create index if not exists idx_aage_color_systems_org on public.aage_color_systems(organization_id);
create index if not exists idx_aage_color_systems_hub on public.aage_color_systems(hub_id);
create index if not exists idx_aage_youtube_templates_org on public.aage_youtube_templates(organization_id);
create index if not exists idx_aage_youtube_templates_hub on public.aage_youtube_templates(hub_id);
create index if not exists idx_aage_social_templates_org on public.aage_social_templates(organization_id);
create index if not exists idx_aage_social_templates_hub on public.aage_social_templates(hub_id);
create index if not exists idx_aage_blog_templates_org on public.aage_blog_templates(organization_id);
create index if not exists idx_aage_blog_templates_hub on public.aage_blog_templates(hub_id);
create index if not exists idx_aage_website_article_templates_org on public.aage_website_article_templates(organization_id);
create index if not exists idx_aage_website_article_templates_hub on public.aage_website_article_templates(hub_id);
create index if not exists idx_aage_email_campaign_templates_org on public.aage_email_campaign_templates(organization_id);
create index if not exists idx_aage_email_campaign_templates_hub on public.aage_email_campaign_templates(hub_id);
create index if not exists idx_aage_case_study_templates_org on public.aage_case_study_templates(organization_id);
create index if not exists idx_aage_case_study_templates_hub on public.aage_case_study_templates(hub_id);
create index if not exists idx_aage_image_assets_org on public.aage_image_assets(organization_id);
create index if not exists idx_aage_image_assets_hub on public.aage_image_assets(hub_id);
create index if not exists idx_aage_video_assets_org on public.aage_video_assets(organization_id);
create index if not exists idx_aage_video_assets_hub on public.aage_video_assets(hub_id);
create index if not exists idx_aage_icon_assets_org on public.aage_icon_assets(organization_id);
create index if not exists idx_aage_icon_assets_hub on public.aage_icon_assets(hub_id);
create index if not exists idx_aage_voice_profiles_org on public.aage_voice_profiles(organization_id);
create index if not exists idx_aage_voice_profiles_hub on public.aage_voice_profiles(hub_id);
create index if not exists idx_aage_music_assets_org on public.aage_music_assets(organization_id);
create index if not exists idx_aage_music_assets_hub on public.aage_music_assets(hub_id);
create index if not exists idx_aage_thumbnail_templates_org on public.aage_thumbnail_templates(organization_id);
create index if not exists idx_aage_thumbnail_templates_hub on public.aage_thumbnail_templates(hub_id);
create index if not exists idx_aage_idea_generators_org on public.aage_idea_generators(organization_id);
create index if not exists idx_aage_idea_generators_hub on public.aage_idea_generators(hub_id);
create index if not exists idx_aage_script_generators_org on public.aage_script_generators(organization_id);
create index if not exists idx_aage_script_generators_hub on public.aage_script_generators(hub_id);
create index if not exists idx_aage_caption_generators_org on public.aage_caption_generators(organization_id);
create index if not exists idx_aage_caption_generators_hub on public.aage_caption_generators(hub_id);
create index if not exists idx_aage_blog_generators_org on public.aage_blog_generators(organization_id);
create index if not exists idx_aage_blog_generators_hub on public.aage_blog_generators(hub_id);
create index if not exists idx_aage_seo_assistants_org on public.aage_seo_assistants(organization_id);
create index if not exists idx_aage_seo_assistants_hub on public.aage_seo_assistants(hub_id);
create index if not exists idx_aage_cta_generators_org on public.aage_cta_generators(organization_id);
create index if not exists idx_aage_cta_generators_hub on public.aage_cta_generators(hub_id);
create index if not exists idx_aage_growth_metrics_org on public.aage_growth_metrics(organization_id);
create index if not exists idx_aage_growth_health_org on public.aage_growth_health(organization_id);
create index if not exists idx_aage_content_calendar_org on public.aage_content_calendar(organization_id);
create index if not exists idx_aage_content_calendar_hub on public.aage_content_calendar(hub_id);
create index if not exists idx_aage_draft_queue_org on public.aage_draft_queue(organization_id);
create index if not exists idx_aage_draft_queue_hub on public.aage_draft_queue(hub_id);
create index if not exists idx_aage_approval_queue_org on public.aage_approval_queue(organization_id);
create index if not exists idx_aage_approval_queue_hub on public.aage_approval_queue(hub_id);
create index if not exists idx_aage_publishing_queue_org on public.aage_publishing_queue(organization_id);
create index if not exists idx_aage_publishing_queue_hub on public.aage_publishing_queue(hub_id);
create index if not exists idx_aage_audit_logs_org on public.aage_audit_logs(organization_id);

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aage_growth_hubs','aage_brand_profiles','aage_brand_voice','aage_core_messaging','aage_brand_guidelines','aage_logo_library','aage_color_systems','aage_youtube_templates','aage_social_templates','aage_blog_templates','aage_website_article_templates','aage_email_campaign_templates','aage_case_study_templates','aage_image_assets','aage_video_assets','aage_icon_assets','aage_voice_profiles','aage_music_assets','aage_thumbnail_templates','aage_idea_generators','aage_script_generators','aage_caption_generators','aage_blog_generators','aage_seo_assistants','aage_cta_generators','aage_growth_metrics','aage_growth_health','aage_content_calendar','aage_draft_queue','aage_approval_queue','aage_publishing_queue'
  ]
  loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);
  end loop;
end $$;

alter table public.aage_growth_hubs enable row level security;
alter table public.aage_brand_profiles enable row level security;
alter table public.aage_brand_voice enable row level security;
alter table public.aage_core_messaging enable row level security;
alter table public.aage_brand_guidelines enable row level security;
alter table public.aage_logo_library enable row level security;
alter table public.aage_color_systems enable row level security;
alter table public.aage_youtube_templates enable row level security;
alter table public.aage_social_templates enable row level security;
alter table public.aage_blog_templates enable row level security;
alter table public.aage_website_article_templates enable row level security;
alter table public.aage_email_campaign_templates enable row level security;
alter table public.aage_case_study_templates enable row level security;
alter table public.aage_image_assets enable row level security;
alter table public.aage_video_assets enable row level security;
alter table public.aage_icon_assets enable row level security;
alter table public.aage_voice_profiles enable row level security;
alter table public.aage_music_assets enable row level security;
alter table public.aage_thumbnail_templates enable row level security;
alter table public.aage_idea_generators enable row level security;
alter table public.aage_script_generators enable row level security;
alter table public.aage_caption_generators enable row level security;
alter table public.aage_blog_generators enable row level security;
alter table public.aage_seo_assistants enable row level security;
alter table public.aage_cta_generators enable row level security;
alter table public.aage_growth_metrics enable row level security;
alter table public.aage_growth_health enable row level security;
alter table public.aage_content_calendar enable row level security;
alter table public.aage_draft_queue enable row level security;
alter table public.aage_approval_queue enable row level security;
alter table public.aage_publishing_queue enable row level security;
alter table public.aage_audit_logs enable row level security;

do $$
declare tbl text;
begin
  foreach tbl in array array[
    'aage_growth_hubs','aage_brand_profiles','aage_brand_voice','aage_core_messaging','aage_brand_guidelines','aage_logo_library','aage_color_systems','aage_youtube_templates','aage_social_templates','aage_blog_templates','aage_website_article_templates','aage_email_campaign_templates','aage_case_study_templates','aage_image_assets','aage_video_assets','aage_icon_assets','aage_voice_profiles','aage_music_assets','aage_thumbnail_templates','aage_idea_generators','aage_script_generators','aage_caption_generators','aage_blog_generators','aage_seo_assistants','aage_cta_generators','aage_growth_metrics','aage_growth_health','aage_content_calendar','aage_draft_queue','aage_approval_queue','aage_publishing_queue','aage_audit_logs'
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
  ('aage.manage', 'Manage brand, content, media, content engine, and founder dashboard outputs', 'arjun_automation_growth_engine'),
  ('aage.approve', 'Approve growth engine gates and actions', 'arjun_automation_growth_engine'),
  ('aage.admin', 'Administer Arjun Automation growth engine', 'arjun_automation_growth_engine')
on conflict (key) do update set description = excluded.description, resource = excluded.resource;

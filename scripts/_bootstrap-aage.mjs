#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const aageEntities = `const entities = [
    { tab: "growthHubs", plural: "growthHubs", singular: "GrowthHub", pascal: "GrowthHub", db: "aageGrowthHubs", table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\\n  hub_name text not null,\\n  environment text not null default 'production',\\n  growth_tier text not null default 'growth'" },
    { tab: "brandProfiles", plural: "brandProfiles", singular: "BrandProfile", pascal: "BrandProfile", db: "aageBrandProfiles", table: \`\${PREFIX}_brand_profiles\`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" }, sqlExtra: "profile_key text not null,\\n  profile_name text not null default '',\\n  profile_status text not null default 'active',\\n  brand_tagline text not null default '',\\n  target_audience text not null default ''" },
    { tab: "brandVoice", plural: "brandVoice", singular: "BrandVoice", pascal: "BrandVoice", db: "aageBrandVoice", table: \`\${PREFIX}_brand_voice\`, fields: [{ name: "voiceKey", type: "string" }, { name: "voiceName", type: "string" }, { name: "voiceTone", type: "string" }], display: { title: "voiceName", sub: "voiceTone" }, sqlExtra: "voice_key text not null,\\n  voice_name text not null default '',\\n  voice_tone text not null default 'professional',\\n  voice_style text not null default 'conversational',\\n  formality_level text not null default 'medium'" },
    { tab: "coreMessaging", plural: "coreMessaging", singular: "CoreMessaging", pascal: "CoreMessaging", db: "aageCoreMessaging", table: \`\${PREFIX}_core_messaging\`, fields: [{ name: "messagingKey", type: "string" }, { name: "messagingTitle", type: "string" }, { name: "messagingStatus", type: "select", options: "MESSAGING_STATUS_OPTIONS" }], display: { title: "messagingTitle", sub: "messagingStatus" }, sqlExtra: "messaging_key text not null,\\n  messaging_title text not null default '',\\n  messaging_status text not null default 'active',\\n  messaging_type text not null default 'value_prop',\\n  audience_segment text not null default 'general'" },
    { tab: "brandGuidelines", plural: "brandGuidelines", singular: "BrandGuideline", pascal: "BrandGuideline", db: "aageBrandGuidelines", table: \`\${PREFIX}_brand_guidelines\`, fields: [{ name: "guidelineKey", type: "string" }, { name: "guidelineName", type: "string" }, { name: "guidelineStatus", type: "select", options: "GUIDELINE_STATUS_OPTIONS" }], display: { title: "guidelineName", sub: "guidelineStatus" }, sqlExtra: "guideline_key text not null,\\n  guideline_name text not null default '',\\n  guideline_status text not null default 'active',\\n  guideline_category text not null default 'visual',\\n  version text not null default '1.0'" },
    { tab: "logoLibrary", plural: "logoLibrary", singular: "LogoLibrary", pascal: "LogoLibrary", db: "aageLogoLibrary", table: \`\${PREFIX}_logo_library\`, fields: [{ name: "logoKey", type: "string" }, { name: "logoName", type: "string" }, { name: "logoFormat", type: "string" }], display: { title: "logoName", sub: "logoFormat" }, sqlExtra: "logo_key text not null,\\n  logo_name text not null default '',\\n  logo_format text not null default 'svg',\\n  logo_variant text not null default 'primary',\\n  asset_url text not null default ''" },
    { tab: "colorSystems", plural: "colorSystems", singular: "ColorSystem", pascal: "ColorSystem", db: "aageColorSystems", table: \`\${PREFIX}_color_systems\`, fields: [{ name: "colorKey", type: "string" }, { name: "colorName", type: "string" }, { name: "primaryHex", type: "string" }], display: { title: "colorName", sub: "primaryHex" }, sqlExtra: "color_key text not null,\\n  color_name text not null default '',\\n  primary_hex text not null default '#db2777',\\n  secondary_hex text not null default '#831843',\\n  accent_hex text not null default '#f472b6'" },
    { tab: "youtubeTemplates", plural: "youtubeTemplates", singular: "YoutubeTemplate", pascal: "YoutubeTemplate", db: "aageYoutubeTemplates", table: \`\${PREFIX}_youtube_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  video_format text not null default 'long_form',\\n  duration_seconds integer not null default 600" },
    { tab: "socialTemplates", plural: "socialTemplates", singular: "SocialTemplate", pascal: "SocialTemplate", db: "aageSocialTemplates", table: \`\${PREFIX}_social_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  platform text not null default 'linkedin',\\n  post_type text not null default 'carousel'" },
    { tab: "blogTemplates", plural: "blogTemplates", singular: "BlogTemplate", pascal: "BlogTemplate", db: "aageBlogTemplates", table: \`\${PREFIX}_blog_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  word_count_target integer not null default 1200,\\n  content_type text not null default 'thought_leadership'" },
    { tab: "websiteArticleTemplates", plural: "websiteArticleTemplates", singular: "WebsiteArticleTemplate", pascal: "WebsiteArticleTemplate", db: "aageWebsiteArticleTemplates", table: \`\${PREFIX}_website_article_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  page_type text not null default 'landing',\\n  seo_focus text not null default ''" },
    { tab: "emailCampaignTemplates", plural: "emailCampaignTemplates", singular: "EmailCampaignTemplate", pascal: "EmailCampaignTemplate", db: "aageEmailCampaignTemplates", table: \`\${PREFIX}_email_campaign_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  campaign_type text not null default 'nurture',\\n  subject_line text not null default ''" },
    { tab: "caseStudyTemplates", plural: "caseStudyTemplates", singular: "CaseStudyTemplate", pascal: "CaseStudyTemplate", db: "aageCaseStudyTemplates", table: \`\${PREFIX}_case_study_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  industry text not null default 'technology',\\n  outcome_type text not null default 'roi'" },
    { tab: "imageAssets", plural: "imageAssets", singular: "ImageAsset", pascal: "ImageAsset", db: "aageImageAssets", table: \`\${PREFIX}_image_assets\`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\\n  asset_name text not null default '',\\n  asset_type text not null default 'hero',\\n  asset_format text not null default 'png',\\n  asset_url text not null default ''" },
    { tab: "videoAssets", plural: "videoAssets", singular: "VideoAsset", pascal: "VideoAsset", db: "aageVideoAssets", table: \`\${PREFIX}_video_assets\`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\\n  asset_name text not null default '',\\n  asset_type text not null default 'promo',\\n  duration_seconds integer not null default 60,\\n  asset_url text not null default ''" },
    { tab: "iconAssets", plural: "iconAssets", singular: "IconAsset", pascal: "IconAsset", db: "aageIconAssets", table: \`\${PREFIX}_icon_assets\`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\\n  asset_name text not null default '',\\n  asset_type text not null default 'feature',\\n  icon_style text not null default 'outline',\\n  asset_url text not null default ''" },
    { tab: "voiceProfiles", plural: "voiceProfiles", singular: "VoiceProfile", pascal: "VoiceProfile", db: "aageVoiceProfiles", table: \`\${PREFIX}_voice_profiles\`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "voiceType", type: "string" }], display: { title: "profileName", sub: "voiceType" }, sqlExtra: "profile_key text not null,\\n  profile_name text not null default '',\\n  voice_type text not null default 'narrator',\\n  language text not null default 'en-US',\\n  sample_url text not null default ''" },
    { tab: "musicAssets", plural: "musicAssets", singular: "MusicAsset", pascal: "MusicAsset", db: "aageMusicAssets", table: \`\${PREFIX}_music_assets\`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "genre", type: "string" }], display: { title: "assetName", sub: "genre" }, sqlExtra: "asset_key text not null,\\n  asset_name text not null default '',\\n  genre text not null default 'corporate',\\n  mood text not null default 'uplifting',\\n  asset_url text not null default ''" },
    { tab: "thumbnailTemplates", plural: "thumbnailTemplates", singular: "ThumbnailTemplate", pascal: "ThumbnailTemplate", db: "aageThumbnailTemplates", table: \`\${PREFIX}_thumbnail_templates\`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\\n  template_name text not null default '',\\n  template_status text not null default 'active',\\n  aspect_ratio text not null default '16:9',\\n  style text not null default 'bold'" },
    { tab: "ideaGenerators", plural: "ideaGenerators", singular: "IdeaGenerator", pascal: "IdeaGenerator", db: "aageIdeaGenerators", table: \`\${PREFIX}_idea_generators\`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\\n  generator_name text not null default '',\\n  generator_status text not null default 'active',\\n  content_type text not null default 'blog',\\n  output_format text not null default 'outline'" },
    { tab: "scriptGenerators", plural: "scriptGenerators", singular: "ScriptGenerator", pascal: "ScriptGenerator", db: "aageScriptGenerators", table: \`\${PREFIX}_script_generators\`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\\n  generator_name text not null default '',\\n  generator_status text not null default 'active',\\n  script_type text not null default 'video',\\n  target_length integer not null default 500" },
    { tab: "captionGenerators", plural: "captionGenerators", singular: "CaptionGenerator", pascal: "CaptionGenerator", db: "aageCaptionGenerators", table: \`\${PREFIX}_caption_generators\`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\\n  generator_name text not null default '',\\n  generator_status text not null default 'active',\\n  platform text not null default 'instagram',\\n  tone text not null default 'engaging'" },
    { tab: "blogGenerators", plural: "blogGenerators", singular: "BlogGenerator", pascal: "BlogGenerator", db: "aageBlogGenerators", table: \`\${PREFIX}_blog_generators\`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\\n  generator_name text not null default '',\\n  generator_status text not null default 'active',\\n  topic_category text not null default 'automation',\\n  word_count integer not null default 1000" },
    { tab: "seoAssistants", plural: "seoAssistants", singular: "SeoAssistant", pascal: "SeoAssistant", db: "aageSeoAssistants", table: \`\${PREFIX}_seo_assistants\`, fields: [{ name: "assistantKey", type: "string" }, { name: "assistantName", type: "string" }, { name: "assistantStatus", type: "select", options: "ASSISTANT_STATUS_OPTIONS" }], display: { title: "assistantName", sub: "assistantStatus" }, sqlExtra: "assistant_key text not null,\\n  assistant_name text not null default '',\\n  assistant_status text not null default 'active',\\n  keyword_focus text not null default '',\\n  search_intent text not null default 'informational'" },
    { tab: "ctaGenerators", plural: "ctaGenerators", singular: "CtaGenerator", pascal: "CtaGenerator", db: "aageCtaGenerators", table: \`\${PREFIX}_cta_generators\`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\\n  generator_name text not null default '',\\n  generator_status text not null default 'active',\\n  cta_type text not null default 'button',\\n  conversion_goal text not null default 'signup'" },
    { tab: "growthMetrics", plural: "growthMetrics", singular: "GrowthMetric", pascal: "GrowthMetric", db: "aageGrowthMetrics", table: \`\${PREFIX}_growth_metrics\`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallGrowthScore", type: "number" }, { name: "brandHealthScore", type: "number" }], display: { title: "metricsKey", sub: "overallGrowthScore" }, sqlExtra: "metrics_key text not null,\\n  metric_date date not null default current_date,\\n  marketing_overview_score numeric(5, 2) not null default 0,\\n  content_calendar_count integer not null default 0,\\n  draft_queue_count integer not null default 0,\\n  approval_queue_count integer not null default 0,\\n  publishing_queue_count integer not null default 0,\\n  brand_health_score numeric(5, 2) not null default 100,\\n  overall_growth_score numeric(5, 2) not null default 100" },
    { tab: "growthHealth", plural: "growthHealth", singular: "GrowthHealth", pascal: "GrowthHealth", db: "aageGrowthHealth", table: \`\${PREFIX}_growth_health\`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "brandStatus", type: "string" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\\n  health_date date not null default current_date,\\n  overall_score numeric(5, 2) not null default 100,\\n  brand_status text not null default 'healthy',\\n  content_status text not null default 'healthy',\\n  media_status text not null default 'healthy',\\n  engine_status text not null default 'healthy',\\n  summary text not null default ''" },
    { tab: "contentCalendar", plural: "contentCalendar", singular: "ContentCalendar", pascal: "ContentCalendar", db: "aageContentCalendar", table: \`\${PREFIX}_content_calendar\`, fields: [{ name: "calendarKey", type: "string" }, { name: "calendarName", type: "string" }, { name: "calendarStatus", type: "select", options: "CALENDAR_STATUS_OPTIONS" }], display: { title: "calendarName", sub: "calendarStatus" }, sqlExtra: "calendar_key text not null,\\n  calendar_name text not null default '',\\n  calendar_status text not null default 'active',\\n  scheduled_date date not null default current_date,\\n  content_type text not null default 'blog'" },
    { tab: "draftQueue", plural: "draftQueue", singular: "DraftQueue", pascal: "DraftQueue", db: "aageDraftQueue", table: \`\${PREFIX}_draft_queue\`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\\n  queue_title text not null default '',\\n  queue_status text not null default 'draft',\\n  content_type text not null default 'blog',\\n  priority text not null default 'medium'" },
    { tab: "approvalQueue", plural: "approvalQueue", singular: "ApprovalQueue", pascal: "ApprovalQueue", db: "aageApprovalQueue", table: \`\${PREFIX}_approval_queue\`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\\n  queue_title text not null default '',\\n  queue_status text not null default 'pending',\\n  content_type text not null default 'blog',\\n  approver_ref text not null default ''" },
    { tab: "publishingQueue", plural: "publishingQueue", singular: "PublishingQueue", pascal: "PublishingQueue", db: "aagePublishingQueue", table: \`\${PREFIX}_publishing_queue\`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\\n  queue_title text not null default '',\\n  queue_status text not null default 'scheduled',\\n  content_type text not null default 'blog',\\n  publish_date date not null default current_date" },
];`;

const hubId = "00790079-0079-0079-0079-007900790101";
const org = "11111111-1111-1111-1111-111111111111";

function patchGen(srcPath, outPath, reps, entitiesReplace) {
    let s = readFileSync(join(root, srcPath), "utf8");
    if (entitiesReplace) s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesReplace);
    for (const [from, to] of reps) {
        if (from instanceof RegExp) s = s.replace(from, to);
        else s = s.replaceAll(from, to);
    }
    writeFileSync(join(root, outPath), s, "utf8");
}

// 1. Main generator
patchGen(
    "scripts/generate-enterprise-governance-platform.mjs",
    "scripts/generate-arjun-automation-growth-engine.mjs",
    [
        [/Generates V2 Enterprise Governance Platform[\s\S]*?\n \*\//, "/**\n * Generates V2 Arjun Automation Growth Engine artifacts.\n * Run: node scripts/generate-arjun-automation-growth-engine.mjs\n */"],
        ["PREFIX = \"egp\"", "PREFIX = \"aage\""],
        ["Pascal = \"Egp\"", "Pascal = \"Aage\""],
        ["camel = \"egp\"", "camel = \"aage\""],
        ["permResource = \"enterprise_governance_platform\"", "permResource = \"arjun_automation_growth_engine\""],
        ["governance_hubs", "growth_hubs"],
        ["governance_metrics", "growth_metrics"],
        ["governance_health", "growth_health"],
        ["-- V2 Enterprise Governance Platform", "-- V2 Arjun Automation Growth Engine"],
        ["View enterprise governance platform data", "View Arjun Automation growth engine data"],
        ["Manage governance, compliance, audit, data governance, risk, and dashboard outputs", "Manage brand, content, media, content engine, and founder dashboard outputs"],
        ["Approve enterprise governance gates and actions", "Approve growth engine gates and actions"],
        ["Administer enterprise governance platform", "Administer Arjun Automation growth engine"],
        ["OrgEgpRepository", "OrgAageRepository"],
        ["DbEgpGovernanceHub", "DbAageGrowthHub"],
        ["202608020048_enterprise_governance_platform", "202608020049_arjun_automation_growth_engine"],
        ["048_enterprise_governance_platform_seed", "049_arjun_automation_growth_engine_seed"],
        ["enterprise-governance-platform-repositories", "growth-engine-repositories"],
        ["Generated Enterprise Governance Platform", "Generated Arjun Automation Growth Engine"],
        ["patch-enterprise-governance-platform-ui", "patch-growth-engine-ui"],
        ["governance_tier", "growth_tier"],
    ],
    aageEntities,
);

// Replace buildSeed in main generator
let gen = readFileSync(join(root, "scripts/generate-arjun-automation-growth-engine.mjs"), "utf8");
const buildSeed = `function buildSeed() {
    const org = "${org}";
    const hubId = "${hubId}";
    let sql = \`insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', '\${org}', 'Arjun Automation Growth Engine Orchestrator', 'arjun_automation_growth_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand","content","media","content_engine","founder_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a549', '\${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', 'northstar-growth-engine-001', 'arjun_automation_growth_engine', 'growth_hub', '\${hubId}', '{"objective":"Unified Arjun Automation growth engine"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_growth_hubs (id, organization_id, hub_key, hub_name, environment, growth_tier, status)
values ('\${hubId}', '\${org}', 'northstar-growth-engine', 'Northstar Growth Engine Hub', 'production', 'growth', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_brand_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_status, status)
values ('04900100-0490-0490-0490-049001000101', '\${org}', '\${hubId}', 'brand-profile-0909', 'Brand Profile', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_brand_voice (id, organization_id, hub_id, voice_key, voice_name, voice_tone, status)
values ('04910101-0491-0491-0491-049101010201', '\${org}', '\${hubId}', 'brand-voice-0909', 'Brand Voice', 'professional', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_core_messaging (id, organization_id, hub_id, messaging_key, messaging_title, messaging_status, status)
values ('04920102-0492-0492-0492-049201020301', '\${org}', '\${hubId}', 'core-msg-0909', 'Core Messaging', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_brand_guidelines (id, organization_id, hub_id, guideline_key, guideline_name, guideline_status, status)
values ('04930103-0493-0493-0493-049301030401', '\${org}', '\${hubId}', 'brand-guide-0909', 'Brand Guidelines', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_logo_library (id, organization_id, hub_id, logo_key, logo_name, logo_format, status)
values ('04940104-0494-0494-0494-049401040501', '\${org}', '\${hubId}', 'logo-0909', 'Primary Logo', 'svg', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_color_systems (id, organization_id, hub_id, color_key, color_name, primary_hex, status)
values ('04950105-0495-0495-0495-049501050601', '\${org}', '\${hubId}', 'color-0909', 'Brand Colors', '#db2777', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_youtube_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04960106-0496-0496-0496-049601060701', '\${org}', '\${hubId}', 'yt-template-0909', 'YouTube Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_social_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04970107-0497-0497-0497-049701070801', '\${org}', '\${hubId}', 'social-template-0909', 'Social Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_blog_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04980108-0498-0498-0498-049801080901', '\${org}', '\${hubId}', 'blog-template-0909', 'Blog Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_website_article_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04990109-0499-0499-0499-049901090a01', '\${org}', '\${hubId}', 'web-template-0909', 'Website Article Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_email_campaign_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049a010a-049a-049a-049a-049a010a0b01', '\${org}', '\${hubId}', 'email-template-0909', 'Email Campaign Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_case_study_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049b010b-049b-049b-049b-049b010b0c01', '\${org}', '\${hubId}', 'case-template-0909', 'Case Study Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_image_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049c010c-049c-049c-049c-049c010c0d01', '\${org}', '\${hubId}', 'image-0909', 'Hero Image', 'hero', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_video_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049d010d-049d-049d-049d-049d010d0e01', '\${org}', '\${hubId}', 'video-0909', 'Promo Video', 'promo', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_icon_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049e010e-049e-049e-049e-049e010e0f01', '\${org}', '\${hubId}', 'icon-0909', 'Feature Icon', 'feature', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_voice_profiles (id, organization_id, hub_id, profile_key, profile_name, voice_type, status)
values ('049f010f-049f-049f-049f-049f010f1001', '\${org}', '\${hubId}', 'voice-0909', 'Narrator Voice', 'narrator', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_music_assets (id, organization_id, hub_id, asset_key, asset_name, genre, status)
values ('04a00110-04a0-04a0-04a0-04a001101101', '\${org}', '\${hubId}', 'music-0909', 'Brand Music', 'corporate', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_thumbnail_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04a10111-04a1-04a1-04a1-04a101111201', '\${org}', '\${hubId}', 'thumb-template-0909', 'Thumbnail Template', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_idea_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a20112-04a2-04a2-04a2-04a201121301', '\${org}', '\${hubId}', 'idea-gen-0909', 'Idea Generator', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_script_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a30113-04a3-04a3-04a3-04a301131401', '\${org}', '\${hubId}', 'script-gen-0909', 'Script Generator', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_caption_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a40114-04a4-04a4-04a4-04a401141501', '\${org}', '\${hubId}', 'caption-gen-0909', 'Caption Generator', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_blog_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a50115-04a5-04a5-04a5-04a501151601', '\${org}', '\${hubId}', 'blog-gen-0909', 'Blog Generator', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_seo_assistants (id, organization_id, hub_id, assistant_key, assistant_name, assistant_status, status)
values ('04a60116-04a6-04a6-04a6-04a601161701', '\${org}', '\${hubId}', 'seo-0909', 'SEO Assistant', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_cta_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a70117-04a7-04a7-04a7-04a701171801', '\${org}', '\${hubId}', 'cta-gen-0909', 'CTA Generator', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_growth_metrics (id, organization_id, metrics_key, marketing_overview_score, content_calendar_count, draft_queue_count, approval_queue_count, publishing_queue_count, brand_health_score, overall_growth_score, status)
values ('04a80118-04a8-04a8-04a8-04a801181901', '\${org}', 'aage-metrics-0909', 88.50, 12, 5, 3, 2, 92.00, 89.75, 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_growth_health (id, organization_id, health_key, overall_score, brand_status, content_status, media_status, engine_status, summary, status)
values ('04a90119-04a9-04a9-04a9-04a901191a01', '\${org}', 'aage-health-0909', 90.00, 'healthy', 'healthy', 'healthy', 'healthy', 'Arjun Automation growth engine operational', 'healthy')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_content_calendar (id, organization_id, hub_id, calendar_key, calendar_name, calendar_status, status)
values ('04aa011a-04aa-04aa-04aa-04aa011a1b01', '\${org}', '\${hubId}', 'calendar-0909', 'Content Calendar', 'active', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_draft_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ab011b-04ab-04ab-04ab-04ab011b1c01', '\${org}', '\${hubId}', 'draft-0909', 'Draft Content', 'draft', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_approval_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ac011c-04ac-04ac-04ac-04ac011c1d01', '\${org}', '\${hubId}', 'approval-0909', 'Pending Approval', 'pending', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_publishing_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ad011d-04ad-04ad-04ad-04ad011d1d01', '\${org}', '\${hubId}', 'publish-0909', 'Scheduled Publish', 'scheduled', 'active')
on conflict (id) do nothing;

\`;
    sql += \`insert into public.aage_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('04ae011e-04ae-04ae-04ae-04ae011e1e01', '\${org}', 'growth_hub', 'seed', 'Arjun Automation growth engine seed data loaded', 'standard')
on conflict (id) do nothing;
\`;
    return sql;
}`;
gen = gen.replace(/function buildSeed\(\) \{[\s\S]*?\n\}/, buildSeed);
writeFileSync(join(root, "scripts/generate-arjun-automation-growth-engine.mjs"), gen);

console.log("Created generate-arjun-automation-growth-engine.mjs");

// 2. Mappers generator
const aageMapperEntities = `const entities = [
    { pascal: "GrowthHub", key: "hub_key", title: "hub_name", sub: "hub_key", hub: false, orgOnly: false, createFields: ["hubKey", "hubName", "environment"] },
    { pascal: "BrandProfile", key: "profile_key", title: "profile_name", sub: "profile_status", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "profileStatus"] },
    { pascal: "BrandVoice", key: "voice_key", title: "voice_name", sub: "voice_tone", hub: true, orgOnly: false, createFields: ["voiceKey", "voiceName", "voiceTone"] },
    { pascal: "CoreMessaging", key: "messaging_key", title: "messaging_title", sub: "messaging_status", hub: true, orgOnly: false, createFields: ["messagingKey", "messagingTitle", "messagingStatus"] },
    { pascal: "BrandGuideline", key: "guideline_key", title: "guideline_name", sub: "guideline_status", hub: true, orgOnly: false, createFields: ["guidelineKey", "guidelineName", "guidelineStatus"] },
    { pascal: "LogoLibrary", key: "logo_key", title: "logo_name", sub: "logo_format", hub: true, orgOnly: false, createFields: ["logoKey", "logoName", "logoFormat"] },
    { pascal: "ColorSystem", key: "color_key", title: "color_name", sub: "primary_hex", hub: true, orgOnly: false, createFields: ["colorKey", "colorName", "primaryHex"] },
    { pascal: "YoutubeTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "SocialTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "BlogTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "WebsiteArticleTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "EmailCampaignTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "CaseStudyTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "ImageAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "VideoAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "IconAsset", key: "asset_key", title: "asset_name", sub: "asset_type", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "assetType"] },
    { pascal: "VoiceProfile", key: "profile_key", title: "profile_name", sub: "voice_type", hub: true, orgOnly: false, createFields: ["profileKey", "profileName", "voiceType"] },
    { pascal: "MusicAsset", key: "asset_key", title: "asset_name", sub: "genre", hub: true, orgOnly: false, createFields: ["assetKey", "assetName", "genre"] },
    { pascal: "ThumbnailTemplate", key: "template_key", title: "template_name", sub: "template_status", hub: true, orgOnly: false, createFields: ["templateKey", "templateName", "templateStatus"] },
    { pascal: "IdeaGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "ScriptGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "CaptionGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "BlogGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "SeoAssistant", key: "assistant_key", title: "assistant_name", sub: "assistant_status", hub: true, orgOnly: false, createFields: ["assistantKey", "assistantName", "assistantStatus"] },
    { pascal: "CtaGenerator", key: "generator_key", title: "generator_name", sub: "generator_status", hub: true, orgOnly: false, createFields: ["generatorKey", "generatorName", "generatorStatus"] },
    { pascal: "GrowthMetric", key: "metrics_key", title: "metrics_key", sub: "overall_growth_score", hub: false, orgOnly: true, createFields: ["metricsKey", "overallGrowthScore", "brandHealthScore"] },
    { pascal: "GrowthHealth", key: "health_key", title: "health_key", sub: "overall_score", hub: false, orgOnly: true, createFields: ["healthKey", "overallScore", "brandStatus"] },
    { pascal: "ContentCalendar", key: "calendar_key", title: "calendar_name", sub: "calendar_status", hub: true, orgOnly: false, createFields: ["calendarKey", "calendarName", "calendarStatus"] },
    { pascal: "DraftQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "ApprovalQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
    { pascal: "PublishingQueue", key: "queue_key", title: "queue_title", sub: "queue_status", hub: true, orgOnly: false, createFields: ["queueKey", "queueTitle", "queueStatus"] },
];`;

patchGen(
    "scripts/generate-egp-mappers-types.mjs",
    "scripts/generate-aage-mappers-types.mjs",
    [
        ["enterprise-governance-platform", "growth-engine"],
        ["Egp", "Aage"],
        ["egp", "aage"],
        ["GovernanceHub", "GrowthHub"],
        ["governanceHub", "growthHub"],
        ["GovernanceMetric", "GrowthMetric"],
        ["GovernanceHealth", "GrowthHealth"],
        ["GovernanceFailure", "PublishingQueue"],
        ["organizationGovernance", "brandProfile"],
        ["complianceControl", "youtubeTemplate"],
        ["auditFinding", "imageAsset"],
        ["riskRegister", "ideaGenerator"],
        ["dataClassification", "contentCalendar"],
        ["OrganizationGovernance", "BrandProfile"],
        ["ComplianceControl", "YoutubeTemplate"],
        ["AuditFinding", "ImageAsset"],
        ["RiskRegister", "IdeaGenerator"],
        ["DataClassification", "ContentCalendar"],
        ["governance_health_score", "marketing_overview_score"],
        ["compliance_score", "brand_health_score"],
        ["enterprise_risk_score", "content_calendar_count"],
        ["audit_summary_score", "draft_queue_count"],
        ["data_governance_health_score", "approval_queue_count"],
        ["overall_governance_score", "overall_growth_score"],
        ["governanceHealthScore", "marketingOverviewScore"],
        ["complianceScore", "brandHealthScore"],
        ["enterpriseRiskScore", "contentCalendarCount"],
        ["auditSummaryScore", "draftQueueCount"],
        ["dataGovernanceHealthScore", "approvalQueueCount"],
        ["overallGovernanceScore", "overallGrowthScore"],
        ["openGovernanceFailureCount", "publishingQueueCount"],
        ["organizationGovernances", "brandProfiles"],
        ["complianceControls", "youtubeTemplates"],
        ["auditFinding", "imageAssets"],
        ["riskRegisters", "ideaGenerators"],
        ["dataClassification", "contentCalendars"],
        ["organizationMetrics", "growthMetrics"],
        ["organizationHealth", "growthHealth"],
        ["organizationFailures", "publishingQueues"],
        ["governanceHubs", "growthHubs"],
        ["totalGovernanceHubs", "totalGrowthHubs"],
        ["activeGovernanceHubs", "activeGrowthHubs"],
        ["organizationGovernanceCount", "brandProfileCount"],
        ["complianceControlCount", "youtubeTemplateCount"],
        ["auditFindingCount", "imageAssetCount"],
        ["riskRegisterCount", "ideaGeneratorCount"],
        ["humanApprovalCount", "contentCalendarCount"],
        ["governance", "brand"],
        ["compliance", "content_foundation"],
        ["audit", "media_foundation"],
        ["data_governance", "content_engine"],
        ["Risk Management", "Founder Dashboard"],
        ["Dashboard", "Founder Dashboard"],
        ["Generates enterprise-governance-platform-mappers", "Generates growth-engine-mappers"],
        ["Generated EGP types", "Generated AAGE types"],
        ['"overallGovernanceScore", "complianceScore"', '"overallGrowthScore", "brandHealthScore"'],
        ["disasterRecoveryMode", "brandStatus"],
    ],
    aageMapperEntities,
);

console.log("Created generate-aage-mappers-types.mjs");

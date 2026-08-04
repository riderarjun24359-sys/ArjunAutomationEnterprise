#!/usr/bin/env node
/**
 * /**
 * /**
 * Generates V2 Arjun Automation Growth Engine artifacts.
 * Run: node scripts/generate-arjun-automation-growth-engine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "aage";
const Pascal = "Aage";
const camel = "aage";
const permResource = "arjun_automation_growth_engine";

const hubTable = `${PREFIX}_growth_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([`${PREFIX}_growth_metrics`, `${PREFIX}_growth_health`, `${PREFIX}_audit_logs`]);

const entities = [
    { tab: "growthHubs", plural: "growthHubs", singular: "GrowthHub", pascal: "GrowthHub", db: "aageGrowthHubs", table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  growth_tier text not null default 'growth'" },
    { tab: "brandProfiles", plural: "brandProfiles", singular: "BrandProfile", pascal: "BrandProfile", db: "aageBrandProfiles", table: `${PREFIX}_brand_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "profileStatus", type: "select", options: "PROFILE_STATUS_OPTIONS" }], display: { title: "profileName", sub: "profileStatus" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  profile_status text not null default 'active',\n  brand_tagline text not null default '',\n  target_audience text not null default ''" },
    { tab: "brandVoice", plural: "brandVoice", singular: "BrandVoice", pascal: "BrandVoice", db: "aageBrandVoice", table: `${PREFIX}_brand_voice`, fields: [{ name: "voiceKey", type: "string" }, { name: "voiceName", type: "string" }, { name: "voiceTone", type: "string" }], display: { title: "voiceName", sub: "voiceTone" }, sqlExtra: "voice_key text not null,\n  voice_name text not null default '',\n  voice_tone text not null default 'professional',\n  voice_style text not null default 'conversational',\n  formality_level text not null default 'medium'" },
    { tab: "coreMessaging", plural: "coreMessaging", singular: "CoreMessaging", pascal: "CoreMessaging", db: "aageCoreMessaging", table: `${PREFIX}_core_messaging`, fields: [{ name: "messagingKey", type: "string" }, { name: "messagingTitle", type: "string" }, { name: "messagingStatus", type: "select", options: "MESSAGING_STATUS_OPTIONS" }], display: { title: "messagingTitle", sub: "messagingStatus" }, sqlExtra: "messaging_key text not null,\n  messaging_title text not null default '',\n  messaging_status text not null default 'active',\n  messaging_type text not null default 'value_prop',\n  audience_segment text not null default 'general'" },
    { tab: "brandGuidelines", plural: "brandGuidelines", singular: "BrandGuideline", pascal: "BrandGuideline", db: "aageBrandGuidelines", table: `${PREFIX}_brand_guidelines`, fields: [{ name: "guidelineKey", type: "string" }, { name: "guidelineName", type: "string" }, { name: "guidelineStatus", type: "select", options: "GUIDELINE_STATUS_OPTIONS" }], display: { title: "guidelineName", sub: "guidelineStatus" }, sqlExtra: "guideline_key text not null,\n  guideline_name text not null default '',\n  guideline_status text not null default 'active',\n  guideline_category text not null default 'visual',\n  version text not null default '1.0'" },
    { tab: "logoLibrary", plural: "logoLibrary", singular: "LogoLibrary", pascal: "LogoLibrary", db: "aageLogoLibrary", table: `${PREFIX}_logo_library`, fields: [{ name: "logoKey", type: "string" }, { name: "logoName", type: "string" }, { name: "logoFormat", type: "string" }], display: { title: "logoName", sub: "logoFormat" }, sqlExtra: "logo_key text not null,\n  logo_name text not null default '',\n  logo_format text not null default 'svg',\n  logo_variant text not null default 'primary',\n  asset_url text not null default ''" },
    { tab: "colorSystems", plural: "colorSystems", singular: "ColorSystem", pascal: "ColorSystem", db: "aageColorSystems", table: `${PREFIX}_color_systems`, fields: [{ name: "colorKey", type: "string" }, { name: "colorName", type: "string" }, { name: "primaryHex", type: "string" }], display: { title: "colorName", sub: "primaryHex" }, sqlExtra: "color_key text not null,\n  color_name text not null default '',\n  primary_hex text not null default '#db2777',\n  secondary_hex text not null default '#831843',\n  accent_hex text not null default '#f472b6'" },
    { tab: "youtubeTemplates", plural: "youtubeTemplates", singular: "YoutubeTemplate", pascal: "YoutubeTemplate", db: "aageYoutubeTemplates", table: `${PREFIX}_youtube_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  video_format text not null default 'long_form',\n  duration_seconds integer not null default 600" },
    { tab: "socialTemplates", plural: "socialTemplates", singular: "SocialTemplate", pascal: "SocialTemplate", db: "aageSocialTemplates", table: `${PREFIX}_social_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  platform text not null default 'linkedin',\n  post_type text not null default 'carousel'" },
    { tab: "blogTemplates", plural: "blogTemplates", singular: "BlogTemplate", pascal: "BlogTemplate", db: "aageBlogTemplates", table: `${PREFIX}_blog_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  word_count_target integer not null default 1200,\n  content_type text not null default 'thought_leadership'" },
    { tab: "websiteArticleTemplates", plural: "websiteArticleTemplates", singular: "WebsiteArticleTemplate", pascal: "WebsiteArticleTemplate", db: "aageWebsiteArticleTemplates", table: `${PREFIX}_website_article_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  page_type text not null default 'landing',\n  seo_focus text not null default ''" },
    { tab: "emailCampaignTemplates", plural: "emailCampaignTemplates", singular: "EmailCampaignTemplate", pascal: "EmailCampaignTemplate", db: "aageEmailCampaignTemplates", table: `${PREFIX}_email_campaign_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  campaign_type text not null default 'nurture',\n  subject_line text not null default ''" },
    { tab: "caseStudyTemplates", plural: "caseStudyTemplates", singular: "CaseStudyTemplate", pascal: "CaseStudyTemplate", db: "aageCaseStudyTemplates", table: `${PREFIX}_case_study_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  industry text not null default 'technology',\n  outcome_type text not null default 'roi'" },
    { tab: "imageAssets", plural: "imageAssets", singular: "ImageAsset", pascal: "ImageAsset", db: "aageImageAssets", table: `${PREFIX}_image_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  asset_type text not null default 'hero',\n  asset_format text not null default 'png',\n  asset_url text not null default ''" },
    { tab: "videoAssets", plural: "videoAssets", singular: "VideoAsset", pascal: "VideoAsset", db: "aageVideoAssets", table: `${PREFIX}_video_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  asset_type text not null default 'promo',\n  duration_seconds integer not null default 60,\n  asset_url text not null default ''" },
    { tab: "iconAssets", plural: "iconAssets", singular: "IconAsset", pascal: "IconAsset", db: "aageIconAssets", table: `${PREFIX}_icon_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "assetType", type: "string" }], display: { title: "assetName", sub: "assetType" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  asset_type text not null default 'feature',\n  icon_style text not null default 'outline',\n  asset_url text not null default ''" },
    { tab: "voiceProfiles", plural: "voiceProfiles", singular: "VoiceProfile", pascal: "VoiceProfile", db: "aageVoiceProfiles", table: `${PREFIX}_voice_profiles`, fields: [{ name: "profileKey", type: "string" }, { name: "profileName", type: "string" }, { name: "voiceType", type: "string" }], display: { title: "profileName", sub: "voiceType" }, sqlExtra: "profile_key text not null,\n  profile_name text not null default '',\n  voice_type text not null default 'narrator',\n  language text not null default 'en-US',\n  sample_url text not null default ''" },
    { tab: "musicAssets", plural: "musicAssets", singular: "MusicAsset", pascal: "MusicAsset", db: "aageMusicAssets", table: `${PREFIX}_music_assets`, fields: [{ name: "assetKey", type: "string" }, { name: "assetName", type: "string" }, { name: "genre", type: "string" }], display: { title: "assetName", sub: "genre" }, sqlExtra: "asset_key text not null,\n  asset_name text not null default '',\n  genre text not null default 'corporate',\n  mood text not null default 'uplifting',\n  asset_url text not null default ''" },
    { tab: "thumbnailTemplates", plural: "thumbnailTemplates", singular: "ThumbnailTemplate", pascal: "ThumbnailTemplate", db: "aageThumbnailTemplates", table: `${PREFIX}_thumbnail_templates`, fields: [{ name: "templateKey", type: "string" }, { name: "templateName", type: "string" }, { name: "templateStatus", type: "select", options: "TEMPLATE_STATUS_OPTIONS" }], display: { title: "templateName", sub: "templateStatus" }, sqlExtra: "template_key text not null,\n  template_name text not null default '',\n  template_status text not null default 'active',\n  aspect_ratio text not null default '16:9',\n  style text not null default 'bold'" },
    { tab: "ideaGenerators", plural: "ideaGenerators", singular: "IdeaGenerator", pascal: "IdeaGenerator", db: "aageIdeaGenerators", table: `${PREFIX}_idea_generators`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  content_type text not null default 'blog',\n  output_format text not null default 'outline'" },
    { tab: "scriptGenerators", plural: "scriptGenerators", singular: "ScriptGenerator", pascal: "ScriptGenerator", db: "aageScriptGenerators", table: `${PREFIX}_script_generators`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  script_type text not null default 'video',\n  target_length integer not null default 500" },
    { tab: "captionGenerators", plural: "captionGenerators", singular: "CaptionGenerator", pascal: "CaptionGenerator", db: "aageCaptionGenerators", table: `${PREFIX}_caption_generators`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  platform text not null default 'instagram',\n  tone text not null default 'engaging'" },
    { tab: "blogGenerators", plural: "blogGenerators", singular: "BlogGenerator", pascal: "BlogGenerator", db: "aageBlogGenerators", table: `${PREFIX}_blog_generators`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  topic_category text not null default 'automation',\n  word_count integer not null default 1000" },
    { tab: "seoAssistants", plural: "seoAssistants", singular: "SeoAssistant", pascal: "SeoAssistant", db: "aageSeoAssistants", table: `${PREFIX}_seo_assistants`, fields: [{ name: "assistantKey", type: "string" }, { name: "assistantName", type: "string" }, { name: "assistantStatus", type: "select", options: "ASSISTANT_STATUS_OPTIONS" }], display: { title: "assistantName", sub: "assistantStatus" }, sqlExtra: "assistant_key text not null,\n  assistant_name text not null default '',\n  assistant_status text not null default 'active',\n  keyword_focus text not null default '',\n  search_intent text not null default 'informational'" },
    { tab: "ctaGenerators", plural: "ctaGenerators", singular: "CtaGenerator", pascal: "CtaGenerator", db: "aageCtaGenerators", table: `${PREFIX}_cta_generators`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  cta_type text not null default 'button',\n  conversion_goal text not null default 'signup'" },
    { tab: "growthMetrics", plural: "growthMetrics", singular: "GrowthMetric", pascal: "GrowthMetric", db: "aageGrowthMetrics", table: `${PREFIX}_growth_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallGrowthScore", type: "number" }, { name: "brandHealthScore", type: "number" }], display: { title: "metricsKey", sub: "overallGrowthScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  marketing_overview_score numeric(5, 2) not null default 0,\n  content_calendar_count integer not null default 0,\n  draft_queue_count integer not null default 0,\n  approval_queue_count integer not null default 0,\n  publishing_queue_count integer not null default 0,\n  brand_health_score numeric(5, 2) not null default 100,\n  overall_growth_score numeric(5, 2) not null default 100" },
    { tab: "growthHealth", plural: "growthHealth", singular: "GrowthHealth", pascal: "GrowthHealth", db: "aageGrowthHealth", table: `${PREFIX}_growth_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "brandStatus", type: "string" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  brand_status text not null default 'healthy',\n  content_status text not null default 'healthy',\n  media_status text not null default 'healthy',\n  engine_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "contentCalendar", plural: "contentCalendar", singular: "ContentCalendar", pascal: "ContentCalendar", db: "aageContentCalendar", table: `${PREFIX}_content_calendar`, fields: [{ name: "calendarKey", type: "string" }, { name: "calendarName", type: "string" }, { name: "calendarStatus", type: "select", options: "CALENDAR_STATUS_OPTIONS" }], display: { title: "calendarName", sub: "calendarStatus" }, sqlExtra: "calendar_key text not null,\n  calendar_name text not null default '',\n  calendar_status text not null default 'active',\n  scheduled_date date not null default current_date,\n  content_type text not null default 'blog'" },
    { tab: "draftQueue", plural: "draftQueue", singular: "DraftQueue", pascal: "DraftQueue", db: "aageDraftQueue", table: `${PREFIX}_draft_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_title text not null default '',\n  queue_status text not null default 'draft',\n  content_type text not null default 'blog',\n  priority text not null default 'medium'" },
    { tab: "approvalQueue", plural: "approvalQueue", singular: "ApprovalQueue", pascal: "ApprovalQueue", db: "aageApprovalQueue", table: `${PREFIX}_approval_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_title text not null default '',\n  queue_status text not null default 'pending',\n  content_type text not null default 'blog',\n  approver_ref text not null default ''" },
    { tab: "publishingQueue", plural: "publishingQueue", singular: "PublishingQueue", pascal: "PublishingQueue", db: "aagePublishingQueue", table: `${PREFIX}_publishing_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_title text not null default '',\n  queue_status text not null default 'scheduled',\n  content_type text not null default 'blog',\n  publish_date date not null default current_date" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 Arjun Automation Growth Engine\n\n";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        const hubCol = isHub || isOrgOnly ? "" : `  ${hubFk} uuid not null references public.${hubTable}(id) on delete cascade,\n`;
        const uniqueClause = isHub
            ? "unique (organization_id, hub_key)"
            : isOrgOnly
              ? `unique (organization_id, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`
              : `unique (organization_id, ${hubFk}, ${e.sqlExtra.split("\n")[0].split(" ")[0]})`;
        sql += `-- ${e.pascal}\n`;
        sql += `create table if not exists public.${e.table} (\n`;
        sql += `  id uuid primary key default uuid_generate_v4(),\n`;
        sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
        sql += hubCol;
        sql += `  ${e.sqlExtra},\n`;
        sql += `  status text not null default 'active',\n`;
        sql += `  created_at timestamptz not null default now(),\n`;
        sql += `  updated_at timestamptz not null default now(),\n`;
        sql += `  ${uniqueClause}\n`;
        sql += `);\n\n`;
    }
    sql += `-- Audit Logs\n`;
    sql += `create table if not exists public.${PREFIX}_audit_logs (\n`;
    sql += `  id uuid primary key default uuid_generate_v4(),\n`;
    sql += `  organization_id uuid not null references public.organizations(id) on delete cascade,\n`;
    sql += `  entity_type text not null default '',\n`;
    sql += `  entity_id uuid,\n`;
    sql += `  action text not null default '',\n`;
    sql += `  summary text not null default '',\n`;
    sql += `  metadata jsonb not null default '{}'::jsonb,\n`;
    sql += `  performed_by uuid,\n`;
    sql += `  security_level text not null default 'standard',\n`;
    sql += `  created_at timestamptz not null default now()\n`;
    sql += `);\n\n`;

    for (const t of allTables) {
        sql += `create index if not exists idx_${t}_org on public.${t}(organization_id);\n`;
        if (!orgOnlyTables.has(t) && t !== hubTable) {
            sql += `create index if not exists idx_${t}_hub on public.${t}(${hubFk});\n`;
        }
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${tablesForTriggers.join("','")}'\n  ]\n  loop\n    execute format('drop trigger if exists trg_%I_updated_at on public.%I', tbl, tbl);\n    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    for (const t of allTables) {
        sql += `alter table public.${t} enable row level security;\n`;
    }
    sql += "\n";

    sql += `do $$\ndeclare tbl text;\nbegin\n  foreach tbl in array array[\n    '${allTables.join("','")}'\n  ]\n  loop\n    execute format('drop policy if exists %I_select on public.%I', tbl, tbl);\n    execute format('create policy %I_select on public.%I for select using (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_insert on public.%I', tbl, tbl);\n    execute format('create policy %I_insert on public.%I for insert with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_update on public.%I', tbl, tbl);\n    execute format('create policy %I_update on public.%I for update using (public.is_organization_member(organization_id)) with check (public.is_organization_member(organization_id))', tbl, tbl);\n    execute format('drop policy if exists %I_delete on public.%I', tbl, tbl);\n    execute format('create policy %I_delete on public.%I for delete using (public.is_organization_member(organization_id))', tbl, tbl);\n  end loop;\nend $$;\n\n`;

    sql += `insert into public.permissions (key, description, resource)\nvalues\n`;
    sql += `  ('${PREFIX}.view', 'View Arjun Automation growth engine data', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.manage', 'Manage brand, content, media, content engine, and founder dashboard outputs', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.approve', 'Approve growth engine gates and actions', '${permResource}'),\n`;
    sql += `  ('${PREFIX}.admin', 'Administer Arjun Automation growth engine', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "00790079-0079-0079-0079-007900790101";
    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', '${org}', 'Arjun Automation Growth Engine Orchestrator', 'arjun_automation_growth_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand","content","media","content_engine","founder_dashboard"]'::jsonb, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a549', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a349', 'northstar-growth-engine-001', 'arjun_automation_growth_engine', 'growth_hub', '${hubId}', '{"objective":"Unified Arjun Automation growth engine"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_growth_hubs (id, organization_id, hub_key, hub_name, environment, growth_tier, status)
values ('${hubId}', '${org}', 'northstar-growth-engine', 'Northstar Growth Engine Hub', 'production', 'growth', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_brand_profiles (id, organization_id, hub_id, profile_key, profile_name, profile_status, status)
values ('04900100-0490-0490-0490-049001000101', '${org}', '${hubId}', 'brand-profile-0909', 'Brand Profile', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_brand_voice (id, organization_id, hub_id, voice_key, voice_name, voice_tone, status)
values ('04910101-0491-0491-0491-049101010201', '${org}', '${hubId}', 'brand-voice-0909', 'Brand Voice', 'professional', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_core_messaging (id, organization_id, hub_id, messaging_key, messaging_title, messaging_status, status)
values ('04920102-0492-0492-0492-049201020301', '${org}', '${hubId}', 'core-msg-0909', 'Core Messaging', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_brand_guidelines (id, organization_id, hub_id, guideline_key, guideline_name, guideline_status, status)
values ('04930103-0493-0493-0493-049301030401', '${org}', '${hubId}', 'brand-guide-0909', 'Brand Guidelines', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_logo_library (id, organization_id, hub_id, logo_key, logo_name, logo_format, status)
values ('04940104-0494-0494-0494-049401040501', '${org}', '${hubId}', 'logo-0909', 'Primary Logo', 'svg', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_color_systems (id, organization_id, hub_id, color_key, color_name, primary_hex, status)
values ('04950105-0495-0495-0495-049501050601', '${org}', '${hubId}', 'color-0909', 'Brand Colors', '#db2777', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_youtube_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04960106-0496-0496-0496-049601060701', '${org}', '${hubId}', 'yt-template-0909', 'YouTube Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_social_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04970107-0497-0497-0497-049701070801', '${org}', '${hubId}', 'social-template-0909', 'Social Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_blog_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04980108-0498-0498-0498-049801080901', '${org}', '${hubId}', 'blog-template-0909', 'Blog Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_website_article_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04990109-0499-0499-0499-049901090a01', '${org}', '${hubId}', 'web-template-0909', 'Website Article Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_email_campaign_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049a010a-049a-049a-049a-049a010a0b01', '${org}', '${hubId}', 'email-template-0909', 'Email Campaign Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_case_study_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('049b010b-049b-049b-049b-049b010b0c01', '${org}', '${hubId}', 'case-template-0909', 'Case Study Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_image_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049c010c-049c-049c-049c-049c010c0d01', '${org}', '${hubId}', 'image-0909', 'Hero Image', 'hero', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_video_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049d010d-049d-049d-049d-049d010d0e01', '${org}', '${hubId}', 'video-0909', 'Promo Video', 'promo', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_icon_assets (id, organization_id, hub_id, asset_key, asset_name, asset_type, status)
values ('049e010e-049e-049e-049e-049e010e0f01', '${org}', '${hubId}', 'icon-0909', 'Feature Icon', 'feature', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_voice_profiles (id, organization_id, hub_id, profile_key, profile_name, voice_type, status)
values ('049f010f-049f-049f-049f-049f010f1001', '${org}', '${hubId}', 'voice-0909', 'Narrator Voice', 'narrator', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_music_assets (id, organization_id, hub_id, asset_key, asset_name, genre, status)
values ('04a00110-04a0-04a0-04a0-04a001101101', '${org}', '${hubId}', 'music-0909', 'Brand Music', 'corporate', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_thumbnail_templates (id, organization_id, hub_id, template_key, template_name, template_status, status)
values ('04a10111-04a1-04a1-04a1-04a101111201', '${org}', '${hubId}', 'thumb-template-0909', 'Thumbnail Template', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_idea_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a20112-04a2-04a2-04a2-04a201121301', '${org}', '${hubId}', 'idea-gen-0909', 'Idea Generator', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_script_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a30113-04a3-04a3-04a3-04a301131401', '${org}', '${hubId}', 'script-gen-0909', 'Script Generator', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_caption_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a40114-04a4-04a4-04a4-04a401141501', '${org}', '${hubId}', 'caption-gen-0909', 'Caption Generator', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_blog_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a50115-04a5-04a5-04a5-04a501151601', '${org}', '${hubId}', 'blog-gen-0909', 'Blog Generator', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_seo_assistants (id, organization_id, hub_id, assistant_key, assistant_name, assistant_status, status)
values ('04a60116-04a6-04a6-04a6-04a601161701', '${org}', '${hubId}', 'seo-0909', 'SEO Assistant', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_cta_generators (id, organization_id, hub_id, generator_key, generator_name, generator_status, status)
values ('04a70117-04a7-04a7-04a7-04a701171801', '${org}', '${hubId}', 'cta-gen-0909', 'CTA Generator', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_growth_metrics (id, organization_id, metrics_key, marketing_overview_score, content_calendar_count, draft_queue_count, approval_queue_count, publishing_queue_count, brand_health_score, overall_growth_score, status)
values ('04a80118-04a8-04a8-04a8-04a801181901', '${org}', 'aage-metrics-0909', 88.50, 12, 5, 3, 2, 92.00, 89.75, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_growth_health (id, organization_id, health_key, overall_score, brand_status, content_status, media_status, engine_status, summary, status)
values ('04a90119-04a9-04a9-04a9-04a901191a01', '${org}', 'aage-health-0909', 90.00, 'healthy', 'healthy', 'healthy', 'healthy', 'Arjun Automation growth engine operational', 'healthy')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_content_calendar (id, organization_id, hub_id, calendar_key, calendar_name, calendar_status, status)
values ('04aa011a-04aa-04aa-04aa-04aa011a1b01', '${org}', '${hubId}', 'calendar-0909', 'Content Calendar', 'active', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_draft_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ab011b-04ab-04ab-04ab-04ab011b1c01', '${org}', '${hubId}', 'draft-0909', 'Draft Content', 'draft', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_approval_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ac011c-04ac-04ac-04ac-04ac011c1d01', '${org}', '${hubId}', 'approval-0909', 'Pending Approval', 'pending', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_publishing_queue (id, organization_id, hub_id, queue_key, queue_title, queue_status, status)
values ('04ad011d-04ad-04ad-04ad-04ad011d1d01', '${org}', '${hubId}', 'publish-0909', 'Scheduled Publish', 'scheduled', 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.aage_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('04ae011e-04ae-04ae-04ae-04ae011e1e01', '${org}', 'growth_hub', 'seed', 'Arjun Automation growth engine seed data loaded', 'standard')
on conflict (id) do nothing;
`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgAageRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgAageRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgAageRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
    return sql;
}

function buildDbTypes() {
    let types = "";
    for (const e of entities) {
        const isHub = e.table === hubTable;
        const isOrgOnly = e.orgOnly || orgOnlyTables.has(e.table);
        types += `export interface Db${Pascal}${e.pascal} {\n    id: string;\n    organization_id: string;\n`;
        if (!isHub && !isOrgOnly) types += `    ${hubFk}: string;\n`;
        const cols = e.sqlExtra.split("\n").map((l) => l.trim().replace(/,$/, ""));
        for (const col of cols) {
            const [name, ...rest] = col.split(" ");
            const sqlType = rest.join(" ");
            let tsType = "string";
            if (sqlType.includes("integer") || sqlType.includes("numeric")) tsType = "number";
            if (sqlType.includes("boolean")) tsType = "boolean";
            if (sqlType.includes("jsonb")) tsType = "Record<string, unknown>";
            if (sqlType.includes("timestamptz") || sqlType.includes(" date")) tsType = "string";
            const opt = sqlType.includes("not null") ? "" : "?";
            types += `    ${name}${opt}: ${tsType};\n`;
        }
        types += `    status: string;\n`;
        if (e.table !== `${PREFIX}_audit_logs`) {
            types += `    created_at: string;\n    updated_at: string;\n`;
        }
        types += `}\n\n`;
    }
    types += `export interface Db${Pascal}AuditLog {\n    id: string;\n    organization_id: string;\n    entity_type: string;\n    entity_id?: string | null;\n    action: string;\n    summary: string;\n    metadata: Record<string, unknown>;\n    performed_by?: string | null;\n    security_level: string;\n    created_at: string;\n}\n`;
    return types;
}

const migrationPath = join(root, "supabase/migrations/202608020049_arjun_automation_growth_engine.sql");
const seedPath = join(root, "supabase/seed/049_arjun_automation_growth_engine_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/growth-engine-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbAageGrowthHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated Arjun Automation Growth Engine artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbAof* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-growth-engine-ui.mjs");

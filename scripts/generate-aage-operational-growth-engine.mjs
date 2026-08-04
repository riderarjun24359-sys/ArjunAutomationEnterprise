#!/usr/bin/env node
/**
 * Generates V2 AAGE Operational Growth Engine artifacts (migration 050).
 * Run: node scripts/generate-aage-operational-growth-engine.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const PREFIX = "aago";
const Pascal = "Aago";
const permPrefix = "aage";
const permResource = "arjun_automation_growth_engine";

const hubTable = `${PREFIX}_operations_hubs`;
const hubFk = "hub_id";
const orgOnlyTables = new Set([
    `${PREFIX}_command_center_metrics`,
    `${PREFIX}_command_center_health`,
    `${PREFIX}_audit_logs`,
]);

const entities = [
    { tab: "operationsHubs", plural: "operationsHubs", singular: "OperationsHub", pascal: "OperationsHub", db: "aagoOperationsHubs", table: hubTable, hubField: false, orgOnly: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" }, sqlExtra: "hub_key text not null,\n  hub_name text not null,\n  environment text not null default 'production',\n  operations_tier text not null default 'operational'" },
    { tab: "brandKnowledgeBase", plural: "brandKnowledgeBase", singular: "BrandKnowledgeBase", pascal: "BrandKnowledgeBase", db: "aagoBrandKnowledgeBase", table: `${PREFIX}_brand_knowledge_base`, fields: [{ name: "knowledgeKey", type: "string" }, { name: "knowledgeTitle", type: "string" }, { name: "knowledgeStatus", type: "select", options: "KNOWLEDGE_STATUS_OPTIONS" }], display: { title: "knowledgeTitle", sub: "knowledgeStatus" }, sqlExtra: "knowledge_key text not null,\n  knowledge_title text not null default '',\n  knowledge_status text not null default 'active',\n  knowledge_category text not null default 'general',\n  content_ref text not null default ''" },
    { tab: "brandRulebook", plural: "brandRulebook", singular: "BrandRulebook", pascal: "BrandRulebook", db: "aagoBrandRulebook", table: `${PREFIX}_brand_rulebook`, fields: [{ name: "rulebookKey", type: "string" }, { name: "rulebookName", type: "string" }, { name: "rulebookStatus", type: "select", options: "RULEBOOK_STATUS_OPTIONS" }], display: { title: "rulebookName", sub: "rulebookStatus" }, sqlExtra: "rulebook_key text not null,\n  rulebook_name text not null default '',\n  rulebook_status text not null default 'active',\n  rulebook_version text not null default '1.0',\n  owner_ref text not null default ''" },
    { tab: "messagingLibrary", plural: "messagingLibrary", singular: "MessagingLibrary", pascal: "MessagingLibrary", db: "aagoMessagingLibrary", table: `${PREFIX}_messaging_library`, fields: [{ name: "messageKey", type: "string" }, { name: "messageTitle", type: "string" }, { name: "messageStatus", type: "select", options: "MESSAGE_STATUS_OPTIONS" }], display: { title: "messageTitle", sub: "messageStatus" }, sqlExtra: "message_key text not null,\n  message_title text not null default '',\n  message_status text not null default 'active',\n  message_type text not null default 'value_prop',\n  audience_segment text not null default 'general'" },
    { tab: "serviceLibrary", plural: "serviceLibrary", singular: "ServiceLibrary", pascal: "ServiceLibrary", db: "aagoServiceLibrary", table: `${PREFIX}_service_library`, fields: [{ name: "serviceKey", type: "string" }, { name: "serviceName", type: "string" }, { name: "serviceStatus", type: "select", options: "SERVICE_STATUS_OPTIONS" }], display: { title: "serviceName", sub: "serviceStatus" }, sqlExtra: "service_key text not null,\n  service_name text not null default '',\n  service_status text not null default 'active',\n  service_category text not null default 'core',\n  pricing_ref text not null default ''" },
    { tab: "industryLibrary", plural: "industryLibrary", singular: "IndustryLibrary", pascal: "IndustryLibrary", db: "aagoIndustryLibrary", table: `${PREFIX}_industry_library`, fields: [{ name: "industryKey", type: "string" }, { name: "industryName", type: "string" }, { name: "industryStatus", type: "select", options: "INDUSTRY_STATUS_OPTIONS" }], display: { title: "industryName", sub: "industryStatus" }, sqlExtra: "industry_key text not null,\n  industry_name text not null default '',\n  industry_status text not null default 'active',\n  vertical text not null default 'technology',\n  segment text not null default 'enterprise'" },
    { tab: "faqLibrary", plural: "faqLibrary", singular: "FaqLibrary", pascal: "FaqLibrary", db: "aagoFaqLibrary", table: `${PREFIX}_faq_library`, fields: [{ name: "faqKey", type: "string" }, { name: "faqQuestion", type: "string" }, { name: "faqStatus", type: "select", options: "FAQ_STATUS_OPTIONS" }], display: { title: "faqQuestion", sub: "faqStatus" }, sqlExtra: "faq_key text not null,\n  faq_question text not null default '',\n  faq_status text not null default 'active',\n  faq_category text not null default 'general',\n  answer_ref text not null default ''" },
    { tab: "brandApprovalRules", plural: "brandApprovalRules", singular: "BrandApprovalRule", pascal: "BrandApprovalRule", db: "aagoBrandApprovalRules", table: `${PREFIX}_brand_approval_rules`, fields: [{ name: "ruleKey", type: "string" }, { name: "ruleName", type: "string" }, { name: "ruleStatus", type: "select", options: "RULE_STATUS_OPTIONS" }], display: { title: "ruleName", sub: "ruleStatus" }, sqlExtra: "rule_key text not null,\n  rule_name text not null default '',\n  rule_status text not null default 'active',\n  approval_level text not null default 'manager',\n  entity_type text not null default 'brand'" },
    { tab: "videoProjects", plural: "videoProjects", singular: "VideoProject", pascal: "VideoProject", db: "aagoVideoProjects", table: `${PREFIX}_video_projects`, fields: [{ name: "projectKey", type: "string" }, { name: "projectName", type: "string" }, { name: "projectStatus", type: "select", options: "PROJECT_STATUS_OPTIONS" }], display: { title: "projectName", sub: "projectStatus" }, sqlExtra: "project_key text not null,\n  project_name text not null default '',\n  project_status text not null default 'draft',\n  video_format text not null default 'long_form',\n  duration_seconds integer not null default 600" },
    { tab: "thumbnailManager", plural: "thumbnailManager", singular: "ThumbnailManager", pascal: "ThumbnailManager", db: "aagoThumbnailManager", table: `${PREFIX}_thumbnail_manager`, fields: [{ name: "thumbnailKey", type: "string" }, { name: "thumbnailName", type: "string" }, { name: "thumbnailStatus", type: "select", options: "THUMBNAIL_STATUS_OPTIONS" }], display: { title: "thumbnailName", sub: "thumbnailStatus" }, sqlExtra: "thumbnail_key text not null,\n  thumbnail_name text not null default '',\n  thumbnail_status text not null default 'active',\n  aspect_ratio text not null default '16:9',\n  style text not null default 'bold'" },
    { tab: "voiceoverManager", plural: "voiceoverManager", singular: "VoiceoverManager", pascal: "VoiceoverManager", db: "aagoVoiceoverManager", table: `${PREFIX}_voiceover_manager`, fields: [{ name: "voiceoverKey", type: "string" }, { name: "voiceoverName", type: "string" }, { name: "voiceoverStatus", type: "select", options: "VOICEOVER_STATUS_OPTIONS" }], display: { title: "voiceoverName", sub: "voiceoverStatus" }, sqlExtra: "voiceover_key text not null,\n  voiceover_name text not null default '',\n  voiceover_status text not null default 'active',\n  voice_type text not null default 'narrator',\n  language text not null default 'en-US'" },
    { tab: "creativeAssetGenerator", plural: "creativeAssetGenerator", singular: "CreativeAssetGenerator", pascal: "CreativeAssetGenerator", db: "aagoCreativeAssetGenerator", table: `${PREFIX}_creative_asset_generator`, fields: [{ name: "generatorKey", type: "string" }, { name: "generatorName", type: "string" }, { name: "generatorStatus", type: "select", options: "GENERATOR_STATUS_OPTIONS" }], display: { title: "generatorName", sub: "generatorStatus" }, sqlExtra: "generator_key text not null,\n  generator_name text not null default '',\n  generator_status text not null default 'active',\n  asset_type text not null default 'image',\n  output_format text not null default 'png'" },
    { tab: "campaignAssetBuilder", plural: "campaignAssetBuilder", singular: "CampaignAssetBuilder", pascal: "CampaignAssetBuilder", db: "aagoCampaignAssetBuilder", table: `${PREFIX}_campaign_asset_builder`, fields: [{ name: "builderKey", type: "string" }, { name: "builderName", type: "string" }, { name: "builderStatus", type: "select", options: "BUILDER_STATUS_OPTIONS" }], display: { title: "builderName", sub: "builderStatus" }, sqlExtra: "builder_key text not null,\n  builder_name text not null default '',\n  builder_status text not null default 'active',\n  campaign_type text not null default 'launch',\n  asset_count integer not null default 0" },
    { tab: "creativeWorkflows", plural: "creativeWorkflows", singular: "CreativeWorkflow", pascal: "CreativeWorkflow", db: "aagoCreativeWorkflows", table: `${PREFIX}_creative_workflows`, fields: [{ name: "workflowKey", type: "string" }, { name: "workflowName", type: "string" }, { name: "workflowStatus", type: "select", options: "WORKFLOW_STATUS_OPTIONS" }], display: { title: "workflowName", sub: "workflowStatus" }, sqlExtra: "workflow_key text not null,\n  workflow_name text not null default '',\n  workflow_status text not null default 'active',\n  workflow_type text not null default 'production',\n  step_count integer not null default 0" },
    { tab: "distributionContentQueue", plural: "distributionContentQueue", singular: "DistributionContentQueue", pascal: "DistributionContentQueue", db: "aagoDistributionContentQueue", table: `${PREFIX}_distribution_content_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_title text not null default '',\n  queue_status text not null default 'draft',\n  content_type text not null default 'blog',\n  priority text not null default 'medium'" },
    { tab: "distributionPublishingQueue", plural: "distributionPublishingQueue", singular: "DistributionPublishingQueue", pascal: "DistributionPublishingQueue", db: "aagoDistributionPublishingQueue", table: `${PREFIX}_distribution_publishing_queue`, fields: [{ name: "queueKey", type: "string" }, { name: "queueTitle", type: "string" }, { name: "queueStatus", type: "select", options: "QUEUE_STATUS_OPTIONS" }], display: { title: "queueTitle", sub: "queueStatus" }, sqlExtra: "queue_key text not null,\n  queue_title text not null default '',\n  queue_status text not null default 'scheduled',\n  content_type text not null default 'blog',\n  publish_date date not null default current_date" },
    { tab: "channelManager", plural: "channelManager", singular: "ChannelManager", pascal: "ChannelManager", db: "aagoChannelManager", table: `${PREFIX}_channel_manager`, fields: [{ name: "channelKey", type: "string" }, { name: "channelName", type: "string" }, { name: "channelStatus", type: "select", options: "CHANNEL_STATUS_OPTIONS" }], display: { title: "channelName", sub: "channelStatus" }, sqlExtra: "channel_key text not null,\n  channel_name text not null default '',\n  channel_status text not null default 'active',\n  platform text not null default 'linkedin',\n  post_type text not null default 'organic'" },
    { tab: "approvalCenter", plural: "approvalCenter", singular: "ApprovalCenter", pascal: "ApprovalCenter", db: "aagoApprovalCenter", table: `${PREFIX}_approval_center`, fields: [{ name: "approvalKey", type: "string" }, { name: "approvalTitle", type: "string" }, { name: "approvalStatus", type: "select", options: "APPROVAL_STATUS_OPTIONS" }], display: { title: "approvalTitle", sub: "approvalStatus" }, sqlExtra: "approval_key text not null,\n  approval_title text not null default '',\n  approval_status text not null default 'pending',\n  content_type text not null default 'blog',\n  approver_ref text not null default ''" },
    { tab: "publishingHistory", plural: "publishingHistory", singular: "PublishingHistory", pascal: "PublishingHistory", db: "aagoPublishingHistory", table: `${PREFIX}_publishing_history`, fields: [{ name: "historyKey", type: "string" }, { name: "historyTitle", type: "string" }, { name: "historyStatus", type: "select", options: "HISTORY_STATUS_OPTIONS" }], display: { title: "historyTitle", sub: "historyStatus" }, sqlExtra: "history_key text not null,\n  history_title text not null default '',\n  history_status text not null default 'published',\n  content_type text not null default 'blog',\n  published_at timestamptz not null default now()" },
    { tab: "distributionAnalytics", plural: "distributionAnalytics", singular: "DistributionAnalytics", pascal: "DistributionAnalytics", db: "aagoDistributionAnalytics", table: `${PREFIX}_distribution_analytics`, fields: [{ name: "analyticsKey", type: "string" }, { name: "analyticsName", type: "string" }, { name: "analyticsScore", type: "number" }], display: { title: "analyticsName", sub: "analyticsScore" }, sqlExtra: "analytics_key text not null,\n  analytics_name text not null default '',\n  analytics_score numeric(5, 2) not null default 0,\n  analytics_type text not null default 'reach',\n  measured_at timestamptz not null default now()" },
    { tab: "campaignDashboard", plural: "campaignDashboard", singular: "CampaignDashboard", pascal: "CampaignDashboard", db: "aagoCampaignDashboard", table: `${PREFIX}_campaign_dashboard`, fields: [{ name: "dashboardKey", type: "string" }, { name: "dashboardName", type: "string" }, { name: "dashboardStatus", type: "select", options: "DASHBOARD_STATUS_OPTIONS" }], display: { title: "dashboardName", sub: "dashboardStatus" }, sqlExtra: "dashboard_key text not null,\n  dashboard_name text not null default '',\n  dashboard_status text not null default 'active',\n  campaign_ref text not null default '',\n  refresh_cadence text not null default 'daily'" },
    { tab: "contentPerformance", plural: "contentPerformance", singular: "ContentPerformance", pascal: "ContentPerformance", db: "aagoContentPerformance", table: `${PREFIX}_content_performance`, fields: [{ name: "performanceKey", type: "string" }, { name: "performanceTitle", type: "string" }, { name: "performanceScore", type: "number" }], display: { title: "performanceTitle", sub: "performanceScore" }, sqlExtra: "performance_key text not null,\n  performance_title text not null default '',\n  performance_score numeric(5, 2) not null default 0,\n  content_type text not null default 'blog',\n  measured_at timestamptz not null default now()" },
    { tab: "leadAttribution", plural: "leadAttribution", singular: "LeadAttribution", pascal: "LeadAttribution", db: "aagoLeadAttribution", table: `${PREFIX}_lead_attribution`, fields: [{ name: "attributionKey", type: "string" }, { name: "attributionTitle", type: "string" }, { name: "attributionStatus", type: "select", options: "ATTRIBUTION_STATUS_OPTIONS" }], display: { title: "attributionTitle", sub: "attributionStatus" }, sqlExtra: "attribution_key text not null,\n  attribution_title text not null default '',\n  attribution_status text not null default 'active',\n  channel_ref text not null default '',\n  conversion_rate numeric(5, 2) not null default 0" },
    { tab: "growthKpis", plural: "growthKpis", singular: "GrowthKpi", pascal: "GrowthKpi", db: "aagoGrowthKpis", table: `${PREFIX}_growth_kpis`, fields: [{ name: "kpiKey", type: "string" }, { name: "kpiName", type: "string" }, { name: "kpiValue", type: "number" }], display: { title: "kpiName", sub: "kpiValue" }, sqlExtra: "kpi_key text not null,\n  kpi_name text not null default '',\n  kpi_value numeric(12, 2) not null default 0,\n  kpi_category text not null default 'growth',\n  target_value numeric(12, 2) not null default 0" },
    { tab: "roiDashboard", plural: "roiDashboard", singular: "RoiDashboard", pascal: "RoiDashboard", db: "aagoRoiDashboard", table: `${PREFIX}_roi_dashboard`, fields: [{ name: "roiKey", type: "string" }, { name: "roiName", type: "string" }, { name: "roiScore", type: "number" }], display: { title: "roiName", sub: "roiScore" }, sqlExtra: "roi_key text not null,\n  roi_name text not null default '',\n  roi_score numeric(5, 2) not null default 0,\n  campaign_ref text not null default '',\n  measured_at timestamptz not null default now()" },
    { tab: "recommendationEngine", plural: "recommendationEngine", singular: "RecommendationEngine", pascal: "RecommendationEngine", db: "aagoRecommendationEngine", table: `${PREFIX}_recommendation_engine`, fields: [{ name: "recommendationKey", type: "string" }, { name: "recommendationTitle", type: "string" }, { name: "recommendationStatus", type: "select", options: "RECOMMENDATION_STATUS_OPTIONS" }], display: { title: "recommendationTitle", sub: "recommendationStatus" }, sqlExtra: "recommendation_key text not null,\n  recommendation_title text not null default '',\n  recommendation_status text not null default 'active',\n  recommendation_type text not null default 'content',\n  confidence_score numeric(5, 2) not null default 0" },
    { tab: "commandCenterMetrics", plural: "commandCenterMetrics", singular: "CommandCenterMetric", pascal: "CommandCenterMetric", db: "aagoCommandCenterMetrics", table: `${PREFIX}_command_center_metrics`, hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "overallOperationsScore", type: "number" }, { name: "missionStatusScore", type: "number" }], display: { title: "metricsKey", sub: "overallOperationsScore" }, sqlExtra: "metrics_key text not null,\n  metric_date date not null default current_date,\n  mission_status_score numeric(5, 2) not null default 0,\n  content_status_score numeric(5, 2) not null default 0,\n  publishing_status_score numeric(5, 2) not null default 0,\n  growth_metrics_score numeric(5, 2) not null default 0,\n  campaign_health_score numeric(5, 2) not null default 0,\n  executive_summary_score numeric(5, 2) not null default 0,\n  overall_operations_score numeric(5, 2) not null default 100" },
    { tab: "commandCenterHealth", plural: "commandCenterHealth", singular: "CommandCenterHealth", pascal: "CommandCenterHealth", db: "aagoCommandCenterHealth", table: `${PREFIX}_command_center_health`, hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "brandOsStatus", type: "string" }], display: { title: "healthKey", sub: "overallScore" }, sqlExtra: "health_key text not null,\n  health_date date not null default current_date,\n  overall_score numeric(5, 2) not null default 100,\n  brand_os_status text not null default 'healthy',\n  creative_studio_status text not null default 'healthy',\n  distribution_status text not null default 'healthy',\n  intelligence_status text not null default 'healthy',\n  summary text not null default ''" },
    { tab: "missionStatus", plural: "missionStatus", singular: "MissionStatus", pascal: "MissionStatus", db: "aagoMissionStatus", table: `${PREFIX}_mission_status`, fields: [{ name: "missionKey", type: "string" }, { name: "missionName", type: "string" }, { name: "missionStatus", type: "select", options: "MISSION_STATUS_OPTIONS" }], display: { title: "missionName", sub: "missionStatus" }, sqlExtra: "mission_key text not null,\n  mission_name text not null default '',\n  mission_status text not null default 'active',\n  mission_type text not null default 'growth',\n  progress_percent numeric(5, 2) not null default 0" },
    { tab: "executiveSummaries", plural: "executiveSummaries", singular: "ExecutiveSummary", pascal: "ExecutiveSummary", db: "aagoExecutiveSummaries", table: `${PREFIX}_executive_summaries`, fields: [{ name: "summaryKey", type: "string" }, { name: "summaryTitle", type: "string" }, { name: "summaryStatus", type: "select", options: "SUMMARY_STATUS_OPTIONS" }], display: { title: "summaryTitle", sub: "summaryStatus" }, sqlExtra: "summary_key text not null,\n  summary_title text not null default '',\n  summary_status text not null default 'draft',\n  summary_period text not null default 'weekly',\n  author_ref text not null default ''" },
    { tab: "operationalFailures", plural: "operationalFailures", singular: "OperationalFailure", pascal: "OperationalFailure", db: "aagoOperationalFailures", table: `${PREFIX}_operational_failures`, fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" }, sqlExtra: "failure_key text not null,\n  failure_type text not null default 'operational',\n  error_code text not null default '',\n  error_message text not null default '',\n  failed_at timestamptz not null default now(),\n  resolved_at timestamptz" },
];

const allTables = [...entities.map((e) => e.table), `${PREFIX}_audit_logs`];
const tablesForTriggers = allTables.filter((t) => t !== `${PREFIX}_audit_logs`);

function buildMigration() {
    let sql = "-- V2 AAGE Operational Growth Engine\n\n";
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
    sql += `  ('${permPrefix}.view', 'View Arjun Automation growth engine data', '${permResource}'),\n`;
    sql += `  ('${permPrefix}.manage', 'Manage brand OS, creative studio, distribution, intelligence, and command center outputs', '${permResource}'),\n`;
    sql += `  ('${permPrefix}.approve', 'Approve growth engine gates and actions', '${permResource}'),\n`;
    sql += `  ('${permPrefix}.admin', 'Administer Arjun Automation growth engine', '${permResource}')\n`;
    sql += `on conflict (key) do update set description = excluded.description, resource = excluded.resource;\n`;
    return sql;
}

function buildSeed() {
    const org = "11111111-1111-1111-1111-111111111111";
    const hubId = "007a007a-007a-007a-007a-007a007a0101";
    const seedRows = [
        ["aago_operations_hubs", "05000100-0500-0500-0500-050001000101", `(id, organization_id, hub_key, hub_name, environment, operations_tier, status)`, `('${hubId}', '${org}', 'northstar-operations-hub', 'Northstar Operations Hub', 'production', 'operational', 'active')`],
        ["aago_brand_knowledge_base", "05010101-0501-0501-0501-050101010201", `(id, organization_id, hub_id, knowledge_key, knowledge_title, knowledge_status, status)`, `('05010101-0501-0501-0501-050101010201', '${org}', '${hubId}', 'knowledge-0501', 'Brand Knowledge Base', 'active', 'active')`],
        ["aago_brand_rulebook", "05020102-0502-0502-0502-050201020301", `(id, organization_id, hub_id, rulebook_key, rulebook_name, rulebook_status, status)`, `('05020102-0502-0502-0502-050201020301', '${org}', '${hubId}', 'rulebook-0502', 'Brand Rulebook', 'active', 'active')`],
        ["aago_messaging_library", "05030103-0503-0503-0503-050301030401", `(id, organization_id, hub_id, message_key, message_title, message_status, status)`, `('05030103-0503-0503-0503-050301030401', '${org}', '${hubId}', 'message-0503', 'Messaging Library', 'active', 'active')`],
        ["aago_service_library", "05040104-0504-0504-0504-050401040501", `(id, organization_id, hub_id, service_key, service_name, service_status, status)`, `('05040104-0504-0504-0504-050401040501', '${org}', '${hubId}', 'service-0504', 'Service Library', 'active', 'active')`],
        ["aago_industry_library", "05050105-0505-0505-0505-050501050601", `(id, organization_id, hub_id, industry_key, industry_name, industry_status, status)`, `('05050105-0505-0505-0505-050501050601', '${org}', '${hubId}', 'industry-0505', 'Industry Library', 'active', 'active')`],
        ["aago_faq_library", "05060106-0506-0506-0506-050601060701", `(id, organization_id, hub_id, faq_key, faq_question, faq_status, status)`, `('05060106-0506-0506-0506-050601060701', '${org}', '${hubId}', 'faq-0506', 'FAQ Library', 'active', 'active')`],
        ["aago_brand_approval_rules", "05070107-0507-0507-0507-050701070801", `(id, organization_id, hub_id, rule_key, rule_name, rule_status, status)`, `('05070107-0507-0507-0507-050701070801', '${org}', '${hubId}', 'rule-0507', 'Brand Approval Rules', 'active', 'active')`],
        ["aago_video_projects", "05080108-0508-0508-0508-050801080901", `(id, organization_id, hub_id, project_key, project_name, project_status, status)`, `('05080108-0508-0508-0508-050801080901', '${org}', '${hubId}', 'video-0508', 'Video Project', 'draft', 'active')`],
        ["aago_thumbnail_manager", "05090109-0509-0509-0509-050901090a01", `(id, organization_id, hub_id, thumbnail_key, thumbnail_name, thumbnail_status, status)`, `('05090109-0509-0509-0509-050901090a01', '${org}', '${hubId}', 'thumb-0509', 'Thumbnail Manager', 'active', 'active')`],
        ["aago_voiceover_manager", "050a010a-050a-050a-050a-050a010a0b01", `(id, organization_id, hub_id, voiceover_key, voiceover_name, voiceover_status, status)`, `('050a010a-050a-050a-050a-050a010a0b01', '${org}', '${hubId}', 'voice-050a', 'Voiceover Manager', 'active', 'active')`],
        ["aago_creative_asset_generator", "050b010b-050b-050b-050b-050b010b0c01", `(id, organization_id, hub_id, generator_key, generator_name, generator_status, status)`, `('050b010b-050b-050b-050b-050b010b0c01', '${org}', '${hubId}', 'gen-050b', 'Creative Asset Generator', 'active', 'active')`],
        ["aago_campaign_asset_builder", "050c010c-050c-050c-050c-050c010c0d01", `(id, organization_id, hub_id, builder_key, builder_name, builder_status, status)`, `('050c010c-050c-050c-050c-050c010c0d01', '${org}', '${hubId}', 'builder-050c', 'Campaign Asset Builder', 'active', 'active')`],
        ["aago_creative_workflows", "050d010d-050d-050d-050d-050d010d0e01", `(id, organization_id, hub_id, workflow_key, workflow_name, workflow_status, status)`, `('050d010d-050d-050d-050d-050d010d0e01', '${org}', '${hubId}', 'workflow-050d', 'Creative Workflow', 'active', 'active')`],
        ["aago_distribution_content_queue", "050e010e-050e-050e-050e-050e010e0f01", `(id, organization_id, hub_id, queue_key, queue_title, queue_status, status)`, `('050e010e-050e-050e-050e-050e010e0f01', '${org}', '${hubId}', 'content-q-050e', 'Content Queue', 'draft', 'active')`],
        ["aago_distribution_publishing_queue", "050f010f-050f-050f-050f-050f010f1001", `(id, organization_id, hub_id, queue_key, queue_title, queue_status, status)`, `('050f010f-050f-050f-050f-050f010f1001', '${org}', '${hubId}', 'publish-q-050f', 'Publishing Queue', 'scheduled', 'active')`],
        ["aago_channel_manager", "05100110-0510-0510-0510-051001101101", `(id, organization_id, hub_id, channel_key, channel_name, channel_status, status)`, `('05100110-0510-0510-0510-051001101101', '${org}', '${hubId}', 'channel-0510', 'Channel Manager', 'active', 'active')`],
        ["aago_approval_center", "05110111-0511-0511-0511-051101111201", `(id, organization_id, hub_id, approval_key, approval_title, approval_status, status)`, `('05110111-0511-0511-0511-051101111201', '${org}', '${hubId}', 'approval-0511', 'Approval Center', 'pending', 'active')`],
        ["aago_publishing_history", "05120112-0512-0512-0512-051201121301", `(id, organization_id, hub_id, history_key, history_title, history_status, status)`, `('05120112-0512-0512-0512-051201121301', '${org}', '${hubId}', 'history-0512', 'Publishing History', 'published', 'active')`],
        ["aago_distribution_analytics", "05130113-0513-0513-0513-051301131401", `(id, organization_id, hub_id, analytics_key, analytics_name, analytics_score, status)`, `('05130113-0513-0513-0513-051301131401', '${org}', '${hubId}', 'analytics-0513', 'Distribution Analytics', 88.00, 'active')`],
        ["aago_campaign_dashboard", "05140114-0514-0514-0514-051401141501", `(id, organization_id, hub_id, dashboard_key, dashboard_name, dashboard_status, status)`, `('05140114-0514-0514-0514-051401141501', '${org}', '${hubId}', 'campaign-0514', 'Campaign Dashboard', 'active', 'active')`],
        ["aago_content_performance", "05150115-0515-0515-0515-051501151601", `(id, organization_id, hub_id, performance_key, performance_title, performance_score, status)`, `('05150115-0515-0515-0515-051501151601', '${org}', '${hubId}', 'perf-0515', 'Content Performance', 92.00, 'active')`],
        ["aago_lead_attribution", "05160116-0516-0516-0516-051601161701", `(id, organization_id, hub_id, attribution_key, attribution_title, attribution_status, status)`, `('05160116-0516-0516-0516-051601161701', '${org}', '${hubId}', 'attrib-0516', 'Lead Attribution', 'active', 'active')`],
        ["aago_growth_kpis", "05170117-0517-0517-0517-051701171801", `(id, organization_id, hub_id, kpi_key, kpi_name, kpi_value, status)`, `('05170117-0517-0517-0517-051701171801', '${org}', '${hubId}', 'kpi-0517', 'Growth KPI', 100.00, 'active')`],
        ["aago_roi_dashboard", "05180118-0518-0518-0518-051801181901", `(id, organization_id, hub_id, roi_key, roi_name, roi_score, status)`, `('05180118-0518-0518-0518-051801181901', '${org}', '${hubId}', 'roi-0518', 'ROI Dashboard', 85.00, 'active')`],
        ["aago_recommendation_engine", "05190119-0519-0519-0519-051901191a01", `(id, organization_id, hub_id, recommendation_key, recommendation_title, recommendation_status, status)`, `('05190119-0519-0519-0519-051901191a01', '${org}', '${hubId}', 'rec-0519', 'Recommendation Engine', 'active', 'active')`],
        ["aago_command_center_metrics", "051a011a-051a-051a-051a-051a011a1b01", `(id, organization_id, metrics_key, mission_status_score, content_status_score, publishing_status_score, growth_metrics_score, campaign_health_score, executive_summary_score, overall_operations_score, status)`, `('051a011a-051a-051a-051a-051a011a1b01', '${org}', 'aago-metrics-0501', 90.00, 88.00, 87.00, 91.00, 89.00, 92.00, 89.50, 'active')`],
        ["aago_command_center_health", "051b011b-051b-051b-051b-051b011b1c01", `(id, organization_id, health_key, overall_score, brand_os_status, creative_studio_status, distribution_status, intelligence_status, summary, status)`, `('051b011b-051b-051b-051b-051b011b1c01', '${org}', 'aago-health-0501', 91.00, 'healthy', 'healthy', 'healthy', 'healthy', 'AAGE operational growth engine operational', 'healthy')`],
        ["aago_mission_status", "051c011c-051c-051c-051c-051c011c1d01", `(id, organization_id, hub_id, mission_key, mission_name, mission_status, status)`, `('051c011c-051c-051c-051c-051c011c1d01', '${org}', '${hubId}', 'mission-051c', 'Mission Status', 'active', 'active')`],
        ["aago_executive_summaries", "051d011d-051d-051d-051d-051d011d1e01", `(id, organization_id, hub_id, summary_key, summary_title, summary_status, status)`, `('051d011d-051d-051d-051d-051d011d1e01', '${org}', '${hubId}', 'summary-051d', 'Executive Summary', 'draft', 'active')`],
        ["aago_operational_failures", "051e011e-051e-051e-051e-051e011e1f01", `(id, organization_id, hub_id, failure_key, failure_type, status)`, `('051e011e-051e-051e-051e-051e011e1f01', '${org}', '${hubId}', 'failure-051e', 'operational', 'open')`],
    ];

    let sql = `insert into public.ai_orchestration_agents (id, organization_id, name, agent_type, workflow_agent_id, provider_id, model_route_id, capabilities, status)
values
  ('a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a350', '${org}', 'AAGE Operational Growth Engine Orchestrator', 'arjun_automation_growth_engine', null, 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a101', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a201', '["brand_os","creative_studio","distribution_hub","growth_intelligence","founder_command_center"]'::jsonb, 'active')
on conflict (id) do nothing;

`;
    sql += `insert into public.ai_sessions (id, organization_id, agent_id, session_key, module_source, entity_type, entity_id, context, status, expires_at)
values
  ('a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a550', '${org}', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a350', 'northstar-operational-growth-001', 'arjun_automation_growth_engine', 'operations_hub', '${hubId}', '{"objective":"Unified AAGE operational growth engine"}'::jsonb, 'active', '2026-12-31 23:59:59+00')
on conflict (id) do nothing;

`;
    for (const [table, , cols, vals] of seedRows) {
        sql += `insert into public.${table} ${cols}\nvalues ${vals}\non conflict (id) do nothing;\n\n`;
    }
    sql += `insert into public.aago_audit_logs (id, organization_id, entity_type, action, summary, security_level)
values ('051f011f-051f-051f-051f-051f011f2001', '${org}', 'operations_hub', 'seed', 'AAGE operational growth engine seed data loaded', 'standard')
on conflict (id) do nothing;
`;
    return sql;
}

function buildRepositories() {
    const dbTypes = entities.map((e) => `Db${Pascal}${e.pascal}`).concat([`Db${Pascal}AuditLog`]);
    let sql = `import type {\n    ${dbTypes.join(",\n    ")},\n} from "@/src/modules/database/types/platform";\n`;
    sql += `import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";\n`;
    sql += `import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";\n\n`;
    sql += `abstract class OrgAagoRepository<T> extends BaseRepository<T> {\n`;
    sql += `    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {\n        const client = getRepositoryClient();\n        if (!client) return [];\n        const normalized = this.buildQuery(query);\n        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);\n        mapRepositoryError(error, \`Failed to list \${this.table}\`);\n        return (data ?? []) as T[];\n    }\n\n    async getById(id: string): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();\n        mapRepositoryError(error, \`Failed to get \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async create(input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to create \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async update(id: string, input: Record<string, unknown>): Promise<T | null> {\n        const client = getRepositoryClient();\n        if (!client) return null;\n        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();\n        mapRepositoryError(error, \`Failed to update \${this.table}\`);\n        return (data as T | null) ?? null;\n    }\n\n    async delete(id: string): Promise<boolean> {\n        const client = getRepositoryClient();\n        if (!client) return false;\n        const { error } = await client.from(this.table).delete().eq("id", id);\n        mapRepositoryError(error, \`Failed to delete \${this.table}\`);\n        return !error;\n    }\n}\n\n`;
    for (const e of entities) {
        sql += `export class ${Pascal}${e.pascal}Repository extends OrgAagoRepository<Db${Pascal}${e.pascal}> { protected table = "${e.table}"; }\n`;
    }
    sql += `export class ${Pascal}AuditLogRepository extends OrgAagoRepository<Db${Pascal}AuditLog> { protected table = "${PREFIX}_audit_logs"; }\n`;
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

const migrationPath = join(root, "supabase/migrations/202608020050_aage_operational_growth_engine.sql");
const seedPath = join(root, "supabase/seed/050_aage_operational_growth_engine_seed.sql");
const reposPath = join(root, "src/modules/database/repositories/growth-engine-operations-repositories.ts");
const platformPath = join(root, "src/modules/database/types/platform.ts");

writeFileSync(migrationPath, buildMigration(), "utf8");
writeFileSync(seedPath, buildSeed(), "utf8");
writeFileSync(reposPath, buildRepositories(), "utf8");

const platformContent = readFileSync(platformPath, "utf8");
if (!platformContent.includes("DbAagoOperationsHub")) {
    writeFileSync(platformPath, platformContent.trimEnd() + "\n\n" + buildDbTypes(), "utf8");
}

console.log("Generated AAGE Operational Growth Engine artifacts:");
console.log(`  Migration: ${migrationPath}`);
console.log(`  Seed:      ${seedPath}`);
console.log(`  Repos:     ${reposPath}`);
console.log(`  Types:     ${platformPath} (appended DbAago* interfaces)`);
console.log(`  Entities:  ${entities.length} + audit_logs = ${allTables.length} tables`);
console.log("Run: node scripts/patch-growth-engine-operational-ui.mjs");

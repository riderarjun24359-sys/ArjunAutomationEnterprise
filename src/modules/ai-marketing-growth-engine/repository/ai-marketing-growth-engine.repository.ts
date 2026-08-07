import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiMarketingGrowthEngineRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class AiMarketingGrowthEngineRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiMarketingGrowthEngineRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            blogTemplates,
            blogGenerators,
            emailTemplates,
            socialTemplates,
            captions,
            campaignBuilders,
            campaignDashboards,
            brandVoice,
            brandGuidelines,
            messaging,
            ideaGenerators,
            scriptGenerators,
            ctaGenerators,
            contentCalendar,
            drafts,
            growthMetrics,
        ] = await Promise.all([
            databaseService.aageBlogTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBlogGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageEmailCampaignTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSocialTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaptionGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignAssetBuilder.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignDashboard.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandVoice.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandGuidelines.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCoreMessaging.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageIdeaGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageScriptGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCtaGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageContentCalendar.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageDraftQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            blogTemplates: blogTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                word_count_target: Number(r.word_count_target ?? 0),
                content_type: r.content_type,
                status: r.status,
            })),
            blogGenerators: blogGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                topic_category: r.topic_category,
                word_count: Number(r.word_count ?? 0),
                status: r.status,
            })),
            emailTemplates: emailTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                campaign_type: r.campaign_type,
                subject_line: r.subject_line,
                status: r.status,
            })),
            socialTemplates: socialTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                platform: r.platform,
                post_type: r.post_type,
                status: r.status,
            })),
            captions: captions.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                platform: r.platform,
                tone: r.tone,
                status: r.status,
            })),
            campaignBuilders: campaignBuilders.map((r) => ({
                id: r.id,
                builder_name: r.builder_name,
                builder_status: r.builder_status,
                campaign_type: r.campaign_type,
                asset_count: Number(r.asset_count ?? 0),
                status: r.status,
            })),
            campaignDashboards: campaignDashboards.map((r) => ({
                id: r.id,
                dashboard_name: r.dashboard_name,
                dashboard_status: r.dashboard_status,
                campaign_ref: r.campaign_ref,
                refresh_cadence: r.refresh_cadence,
                status: r.status,
            })),
            brandVoice: brandVoice.map((r) => ({
                id: r.id,
                voice_name: r.voice_name,
                voice_tone: r.voice_tone,
                voice_style: r.voice_style,
                formality_level: r.formality_level,
                status: r.status,
            })),
            brandGuidelines: brandGuidelines.map((r) => ({
                id: r.id,
                guideline_name: r.guideline_name,
                guideline_category: r.guideline_category,
                version: r.version,
                guideline_status: r.guideline_status,
                status: r.status,
            })),
            messaging: messaging.map((r) => ({
                id: r.id,
                messaging_title: r.messaging_title,
                messaging_type: r.messaging_type,
                audience_segment: r.audience_segment,
                messaging_status: r.messaging_status,
                status: r.status,
            })),
            ideaGenerators: ideaGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                content_type: r.content_type,
                output_format: r.output_format,
                status: r.status,
            })),
            scriptGenerators: scriptGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                script_type: r.script_type,
                target_length: Number(r.target_length ?? 0),
                status: r.status,
            })),
            ctaGenerators: ctaGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                cta_type: r.cta_type,
                conversion_goal: r.conversion_goal,
                status: r.status,
            })),
            contentCalendar: contentCalendar.map((r) => ({
                id: r.id,
                calendar_name: r.calendar_name,
                calendar_status: r.calendar_status,
                scheduled_date: r.scheduled_date,
                content_type: r.content_type,
                status: r.status,
            })),
            drafts: drafts.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                content_type: r.content_type,
                queue_status: r.queue_status,
                status: r.status,
            })),
            growthMetrics: growthMetrics.map((r) => ({
                overall_growth_score: Number(r.overall_growth_score ?? 0),
                brand_health_score: Number(r.brand_health_score ?? 0),
                marketing_overview_score: Number(r.marketing_overview_score ?? 0),
                content_calendar_count: Number(r.content_calendar_count ?? 0),
            })),
        };
    }
}

export const aiMarketingGrowthEngineRepository = new AiMarketingGrowthEngineRepository();

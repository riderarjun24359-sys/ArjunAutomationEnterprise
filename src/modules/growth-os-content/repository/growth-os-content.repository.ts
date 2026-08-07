import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthOsContentRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthOsContentRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthOsContentRawData | null> {
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
            websiteTemplates,
            caseStudyTemplates,
            seoAssistants,
            ideaGenerators,
            faqs,
            ctaGenerators,
            industries,
            campaignBuilders,
            socialTemplates,
            captions,
            youtubeTemplates,
            channels,
            emailTemplates,
            brandVoice,
            brandGuidelines,
            brandRulebook,
            messaging,
            messagingLibrary,
            approvalQueue,
            approvalCenter,
            growthMetrics,
            contentPerformance,
            drafts,
        ] = await Promise.all([
            databaseService.aageBlogTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBlogGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageWebsiteArticleTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaseStudyTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSeoAssistants.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageIdeaGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoFaqLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCtaGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoIndustryLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignAssetBuilder.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSocialTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaptionGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageYoutubeTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoChannelManager.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageEmailCampaignTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandVoice.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandGuidelines.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoBrandRulebook.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCoreMessaging.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoMessagingLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageApprovalQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoApprovalCenter.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoContentPerformance.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageDraftQueue.listByOrganization(orgId, q).catch(() => []),
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
            websiteTemplates: websiteTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                page_type: r.page_type,
                seo_focus: r.seo_focus,
                status: r.status,
            })),
            caseStudyTemplates: caseStudyTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                industry: r.industry,
                outcome_type: r.outcome_type,
                status: r.status,
            })),
            seoAssistants: seoAssistants.map((r) => ({
                id: r.id,
                assistant_name: r.assistant_name,
                assistant_status: r.assistant_status,
                keyword_focus: r.keyword_focus,
                search_intent: r.search_intent,
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
            faqs: faqs.map((r) => ({
                id: r.id,
                faq_question: r.faq_question,
                faq_category: r.faq_category,
                answer_ref: r.answer_ref,
                faq_status: r.faq_status,
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
            industries: industries.map((r) => ({
                id: r.id,
                industry_name: r.industry_name,
                vertical: r.vertical,
                segment: r.segment,
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
            youtubeTemplates: youtubeTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                video_format: r.video_format,
                duration_seconds: Number(r.duration_seconds ?? 0),
                status: r.status,
            })),
            channels: channels.map((r) => ({
                id: r.id,
                channel_name: r.channel_name,
                channel_status: r.channel_status,
                platform: r.platform,
                post_type: r.post_type,
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
            brandRulebook: brandRulebook.map((r) => ({
                id: r.id,
                rulebook_name: r.rulebook_name,
                rulebook_version: r.rulebook_version,
                rulebook_status: r.rulebook_status,
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
            messagingLibrary: messagingLibrary.map((r) => ({
                id: r.id,
                message_title: r.message_title,
                message_type: r.message_type,
                audience_segment: r.audience_segment,
                message_status: r.message_status,
                status: r.status,
            })),
            approvalQueue: approvalQueue.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                content_type: r.content_type,
                approver_ref: r.approver_ref,
                queue_status: r.queue_status,
                status: r.status,
            })),
            approvalCenter: approvalCenter.map((r) => ({
                id: r.id,
                approval_title: r.approval_title,
                content_type: r.content_type,
                approver_ref: r.approver_ref,
                approval_status: r.approval_status,
                status: r.status,
            })),
            growthMetrics: growthMetrics.map((r) => ({
                overall_growth_score: Number(r.overall_growth_score ?? 0),
                brand_health_score: Number(r.brand_health_score ?? 0),
                marketing_overview_score: Number(r.marketing_overview_score ?? 0),
                content_calendar_count: Number(r.content_calendar_count ?? 0),
            })),
            contentPerformance: contentPerformance.map((r) => ({
                id: r.id,
                performance_title: r.performance_title,
                performance_score: Number(r.performance_score ?? 0),
                content_type: r.content_type,
            })),
            drafts: drafts.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                content_type: r.content_type,
                queue_status: r.queue_status,
                status: r.status,
            })),
        };
    }
}

export const growthOsContentRepository = new GrowthOsContentRepository();

import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthOsPublishingRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthOsPublishingRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthOsPublishingRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            campaigns,
            campaignBuilders,
            campaignDashboards,
            emailTemplates,
            contentCalendar,
            aagePublishing,
            distPublishing,
            distContent,
            publishingHistory,
            channels,
            blogTemplates,
            websiteTemplates,
            caseStudyTemplates,
            websitePages,
            seoAssistants,
            campaignMetrics,
            campaignDeliveries,
            distributionAnalytics,
            attributions,
            approvalQueue,
            approvalCenter,
            aageAudit,
            aagoAudit,
        ] = await Promise.all([
            databaseService.cnhCampaigns.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignAssetBuilder.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignDashboard.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageEmailCampaignTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageContentCalendar.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagePublishingQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoDistributionPublishingQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoDistributionContentQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoPublishingHistory.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoChannelManager.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBlogTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageWebsiteArticleTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaseStudyTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.cmpWebsitePages.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSeoAssistants.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignDeliveries.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoDistributionAnalytics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoLeadAttribution.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageApprovalQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoApprovalCenter.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoAuditLogs.listByOrganization(orgId, q).catch(() => []),
        ]);

        const auditLogs = [...aageAudit, ...aagoAudit]
            .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
            .slice(0, LIMIT);

        return {
            organizationId: orgId,
            membershipRole,
            campaigns: campaigns.map((r) => ({
                id: r.id,
                campaign_name: r.campaign_name,
                channel_type: r.channel_type,
                status: r.status,
                starts_at: r.starts_at,
                ends_at: r.ends_at,
                updated_at: r.updated_at,
            })),
            campaignBuilders: campaignBuilders.map((r) => ({
                id: r.id,
                builder_name: r.builder_name,
                builder_status: r.builder_status,
                campaign_type: r.campaign_type,
                asset_count: Number(r.asset_count ?? 0),
                status: r.status,
                updated_at: r.updated_at,
            })),
            campaignDashboards: campaignDashboards.map((r) => ({
                id: r.id,
                dashboard_name: r.dashboard_name,
                dashboard_status: r.dashboard_status,
                campaign_ref: r.campaign_ref,
                refresh_cadence: r.refresh_cadence,
                status: r.status,
            })),
            emailTemplates: emailTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                campaign_type: r.campaign_type,
                status: r.status,
            })),
            contentCalendar: contentCalendar.map((r) => ({
                id: r.id,
                calendar_name: r.calendar_name,
                calendar_status: r.calendar_status,
                scheduled_date: r.scheduled_date,
                content_type: r.content_type,
                status: r.status,
                updated_at: r.updated_at,
            })),
            aagePublishing: aagePublishing.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                queue_status: r.queue_status,
                content_type: r.content_type,
                publish_date: r.publish_date,
                status: r.status,
                updated_at: r.updated_at,
            })),
            distPublishing: distPublishing.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                queue_status: r.queue_status,
                content_type: r.content_type,
                publish_date: r.publish_date,
                status: r.status,
                updated_at: r.updated_at,
            })),
            distContent: distContent.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                queue_status: r.queue_status,
                content_type: r.content_type,
                priority: r.priority,
                status: r.status,
                updated_at: r.updated_at,
            })),
            publishingHistory: publishingHistory.map((r) => ({
                id: r.id,
                history_title: r.history_title,
                history_status: r.history_status,
                content_type: r.content_type,
                published_at: r.published_at,
                status: r.status,
                updated_at: r.updated_at,
            })),
            channels: channels.map((r) => ({
                id: r.id,
                channel_name: r.channel_name,
                channel_status: r.channel_status,
                platform: r.platform,
                post_type: r.post_type,
                status: r.status,
            })),
            blogTemplates: blogTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                content_type: r.content_type,
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
                status: r.status,
            })),
            websitePages: websitePages.map((r) => ({
                id: r.id,
                page_title: r.page_title,
                page_slug: r.page_slug,
                page_status: r.page_status,
                status: r.status,
            })),
            seoAssistants: seoAssistants.map((r) => ({
                id: r.id,
                assistant_name: r.assistant_name,
                keyword_focus: r.keyword_focus,
                search_intent: r.search_intent,
                assistant_status: r.assistant_status,
                status: r.status,
            })),
            campaignMetrics: campaignMetrics.map((r) => ({
                id: r.id,
                campaign_id: r.campaign_id,
                open_rate: Number(r.open_rate ?? 0),
                click_rate: Number(r.click_rate ?? 0),
                sent_count: Number(r.sent_count ?? 0),
                delivered_count: Number(r.delivered_count ?? 0),
            })),
            campaignDeliveries: campaignDeliveries.map((r) => ({
                id: r.id,
                campaign_id: r.campaign_id,
                status: r.delivery_status || r.status,
                delivered_at: r.delivered_at,
            })),
            distributionAnalytics: distributionAnalytics.map((r) => ({
                id: r.id,
                analytics_name: r.analytics_name,
                analytics_score: Number(r.analytics_score ?? 0),
                analytics_type: r.analytics_type,
                measured_at: r.measured_at,
                status: r.status,
            })),
            attributions: attributions.map((r) => ({
                id: r.id,
                attribution_title: r.attribution_title,
                channel_ref: r.channel_ref,
                conversion_rate: Number(r.conversion_rate ?? 0),
                attribution_status: r.attribution_status,
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
            auditLogs: auditLogs.map((r) => ({
                id: r.id,
                entity_type: r.entity_type,
                action: r.action,
                summary: r.summary,
                created_at: r.created_at,
            })),
        };
    }
}

export const growthOsPublishingRepository = new GrowthOsPublishingRepository();

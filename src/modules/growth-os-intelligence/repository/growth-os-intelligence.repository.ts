import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthOsIntelligenceRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthOsIntelligenceRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthOsIntelligenceRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            growthKpis,
            executiveSummaries,
            commandMetrics,
            commandHealth,
            growthMetrics,
            growthHealth,
            seoAssistants,
            contentPerformance,
            distributionAnalytics,
            attributions,
            videoProjects,
            youtubeTemplates,
            campaignMetrics,
            campaigns,
            salesLeads,
            subscriptions,
            mrrSnapshots,
            arrSnapshots,
            mrrForecasts,
            arrForecasts,
            churnPredictions,
            renewals,
            expansions,
            adoption,
            recommendations,
            roiDashboards,
            payments,
            publishingHistory,
        ] = await Promise.all([
            databaseService.aagoGrowthKpis.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoExecutiveSummaries.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCommandCenterMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCommandCenterHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSeoAssistants.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoContentPerformance.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoDistributionAnalytics.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoLeadAttribution.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoVideoProjects.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageYoutubeTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaignMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.cnhCampaigns.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvSubscriptionBillings.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrForecasts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrForecasts.listByOrganization(orgId, q).catch(() => []),
            databaseService.csChurnPredictions.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRenewalPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoRecommendationEngine.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoRoiDashboard.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoPublishingHistory.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            growthKpis: growthKpis.map((r) => ({
                id: r.id,
                kpi_name: r.kpi_name,
                kpi_value: Number(r.kpi_value ?? 0),
                kpi_category: r.kpi_category,
                target_value: Number(r.target_value ?? 0),
                status: r.status,
            })),
            executiveSummaries: executiveSummaries.map((r) => ({
                id: r.id,
                summary_title: r.summary_title,
                summary_period: r.summary_period,
                summary_status: r.summary_status,
                status: r.status,
            })),
            commandMetrics: commandMetrics.map((r) => ({
                id: r.id,
                metric_date: r.metric_date,
                mission_status_score: Number(r.mission_status_score ?? 0),
                content_status_score: Number(r.content_status_score ?? 0),
                publishing_status_score: Number(r.publishing_status_score ?? 0),
                growth_metrics_score: Number(r.growth_metrics_score ?? 0),
                campaign_health_score: Number(r.campaign_health_score ?? 0),
                executive_summary_score: Number(r.executive_summary_score ?? 0),
                overall_operations_score: Number(r.overall_operations_score ?? 0),
            })),
            commandHealth: commandHealth.map((r) => ({
                id: r.id,
                overall_score: Number(r.overall_score ?? 0),
                health_date: r.health_date,
                summary: r.summary,
            })),
            growthMetrics: growthMetrics.map((r) => ({
                overall_growth_score: Number(r.overall_growth_score ?? 0),
                brand_health_score: Number(r.brand_health_score ?? 0),
                marketing_overview_score: Number(r.marketing_overview_score ?? 0),
                content_calendar_count: Number(r.content_calendar_count ?? 0),
                draft_queue_count: Number(r.draft_queue_count ?? 0),
                approval_queue_count: Number(r.approval_queue_count ?? 0),
                publishing_queue_count: Number(r.publishing_queue_count ?? 0),
            })),
            growthHealth: growthHealth.map((r) => ({
                id: r.id,
                overall_score: Number(r.overall_score ?? 0),
                brand_status: r.brand_status,
                content_status: r.content_status,
                media_status: r.media_status,
                engine_status: r.engine_status,
                summary: r.summary,
            })),
            seoAssistants: seoAssistants.map((r) => ({
                id: r.id,
                assistant_name: r.assistant_name,
                keyword_focus: r.keyword_focus,
                search_intent: r.search_intent,
                assistant_status: r.assistant_status,
                status: r.status,
            })),
            contentPerformance: contentPerformance.map((r) => ({
                id: r.id,
                performance_title: r.performance_title,
                performance_score: Number(r.performance_score ?? 0),
                content_type: r.content_type,
                measured_at: r.measured_at,
            })),
            distributionAnalytics: distributionAnalytics.map((r) => ({
                id: r.id,
                analytics_name: r.analytics_name,
                analytics_score: Number(r.analytics_score ?? 0),
                analytics_type: r.analytics_type,
                measured_at: r.measured_at,
            })),
            attributions: attributions.map((r) => ({
                id: r.id,
                attribution_title: r.attribution_title,
                channel_ref: r.channel_ref,
                conversion_rate: Number(r.conversion_rate ?? 0),
                attribution_status: r.attribution_status,
                status: r.status,
            })),
            videoProjects: videoProjects.map((r) => ({
                id: r.id,
                project_name: r.project_name,
                project_status: r.project_status,
                duration_seconds: Number(r.duration_seconds ?? 0),
                status: r.status,
            })),
            youtubeTemplates: youtubeTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                duration_seconds: Number(r.duration_seconds ?? 0),
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
            campaigns: campaigns.map((r) => ({
                id: r.id,
                campaign_name: r.campaign_name,
                channel_type: r.channel_type,
                status: r.status,
            })),
            salesLeads: salesLeads.map((r) => ({
                id: r.id,
                lead_name: r.lead_name,
                source: r.source,
                status: r.status,
                score: Number(r.score ?? 0),
                created_at: r.created_at,
            })),
            subscriptions: subscriptions.map((r) => ({
                id: r.id,
                plan_name: r.plan_name,
                status: r.status,
                payment_status: r.payment_status,
                mrr_usd: Number(r.mrr_usd ?? 0),
                arr_usd: Number(r.arr_usd ?? 0),
                created_at: r.created_at,
            })),
            mrrSnapshots: mrrSnapshots.map((r) => ({
                snapshot_date: r.snapshot_date,
                mrr_usd: Number(r.mrr_usd ?? 0),
                new_mrr_usd: Number(r.new_mrr_usd ?? 0),
                churn_mrr_usd: Number(r.churn_mrr_usd ?? 0),
            })),
            arrSnapshots: arrSnapshots.map((r) => ({
                snapshot_date: r.snapshot_date,
                arr_usd: Number(r.arr_usd ?? 0),
            })),
            mrrForecasts: mrrForecasts.map((r) => ({
                id: r.id,
                forecast_date: r.forecast_date,
                forecast_period: r.forecast_period,
                projected_mrr_usd: Number(r.projected_mrr_usd ?? 0),
                confidence_percent: Number(r.confidence_percent ?? 0),
                status: r.status,
            })),
            arrForecasts: arrForecasts.map((r) => ({
                id: r.id,
                forecast_date: r.forecast_date,
                forecast_period: r.forecast_period,
                projected_arr_usd: Number(r.projected_arr_usd ?? 0),
                confidence_percent: Number(r.confidence_percent ?? 0),
                status: r.status,
            })),
            churnPredictions: churnPredictions.map((r) => ({
                id: r.id,
                name: r.name,
                churn_probability: Number(r.churn_probability ?? 0),
                status: r.status,
            })),
            renewals: renewals.map((r) => ({
                id: r.id,
                name: r.name,
                renewal_value_usd: Number(r.renewal_value_usd ?? 0),
                status: r.status,
            })),
            expansions: expansions.map((r) => ({
                id: r.id,
                name: r.name,
                opportunity_type: r.opportunity_type,
                estimated_value_usd: Number(r.estimated_value_usd ?? 0),
                status: r.status,
            })),
            adoption: adoption.map((r) => ({
                adoption_percent: Number(r.adoption_percent ?? 0),
                status: r.status,
            })),
            recommendations: recommendations.map((r) => ({
                id: r.id,
                recommendation_title: r.recommendation_title,
                recommendation_type: r.recommendation_type,
                confidence_score: Number(r.confidence_score ?? 0),
                recommendation_status: r.recommendation_status,
                status: r.status,
            })),
            roiDashboards: roiDashboards.map((r) => ({
                id: r.id,
                roi_name: r.roi_name,
                roi_score: Number(r.roi_score ?? 0),
                campaign_ref: r.campaign_ref,
                measured_at: r.measured_at,
            })),
            payments: payments.map((r) => ({
                amount: Number(r.amount ?? 0),
                status: r.status,
                payment_date: r.payment_date,
                created_at: r.created_at,
            })),
            publishingHistory: publishingHistory.map((r) => ({
                id: r.id,
                history_title: r.history_title,
                content_type: r.content_type,
                published_at: r.published_at,
                status: r.status,
            })),
        };
    }
}

export const growthOsIntelligenceRepository = new GrowthOsIntelligenceRepository();

import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthOsCreativeRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthOsCreativeRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthOsCreativeRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            imageAssets,
            iconAssets,
            logos,
            colors,
            guidelines,
            socialTemplates,
            thumbnailTemplates,
            thumbnailManager,
            youtubeTemplates,
            creativeGenerators,
            campaignBuilders,
            creativeWorkflows,
            videoProjects,
            emailTemplates,
            caseStudyTemplates,
            blogTemplates,
            cmpBrandAssets,
            approvalQueue,
            approvalCenter,
            growthMetrics,
        ] = await Promise.all([
            databaseService.aageImageAssets.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageIconAssets.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageLogoLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageColorSystems.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandGuidelines.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageSocialTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageThumbnailTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoThumbnailManager.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageYoutubeTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCreativeAssetGenerator.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCampaignAssetBuilder.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCreativeWorkflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoVideoProjects.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageEmailCampaignTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaseStudyTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBlogTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.cmpBrandAssets.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageApprovalQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoApprovalCenter.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            imageAssets: imageAssets.map((r) => ({
                id: r.id,
                asset_name: r.asset_name,
                asset_type: r.asset_type,
                asset_format: r.asset_format,
                asset_url: r.asset_url,
                status: r.status,
                updated_at: r.updated_at,
            })),
            iconAssets: iconAssets.map((r) => ({
                id: r.id,
                asset_name: r.asset_name,
                asset_type: r.asset_type,
                icon_style: r.icon_style,
                asset_url: r.asset_url,
                status: r.status,
                updated_at: r.updated_at,
            })),
            logos: logos.map((r) => ({
                id: r.id,
                logo_name: r.logo_name,
                logo_format: r.logo_format,
                logo_variant: r.logo_variant,
                asset_url: r.asset_url,
                status: r.status,
                updated_at: r.updated_at,
            })),
            colors: colors.map((r) => ({
                id: r.id,
                color_name: r.color_name,
                primary_hex: r.primary_hex,
                secondary_hex: r.secondary_hex,
                accent_hex: r.accent_hex,
                status: r.status,
            })),
            guidelines: guidelines.map((r) => ({
                id: r.id,
                guideline_name: r.guideline_name,
                guideline_category: r.guideline_category,
                version: r.version,
                guideline_status: r.guideline_status,
                status: r.status,
                updated_at: r.updated_at,
            })),
            socialTemplates: socialTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                platform: r.platform,
                post_type: r.post_type,
                status: r.status,
                updated_at: r.updated_at,
            })),
            thumbnailTemplates: thumbnailTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                aspect_ratio: r.aspect_ratio,
                style: r.style,
                status: r.status,
                updated_at: r.updated_at,
            })),
            thumbnailManager: thumbnailManager.map((r) => ({
                id: r.id,
                thumbnail_name: r.thumbnail_name,
                thumbnail_status: r.thumbnail_status,
                aspect_ratio: r.aspect_ratio,
                style: r.style,
                status: r.status,
                updated_at: r.updated_at,
            })),
            youtubeTemplates: youtubeTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                video_format: r.video_format,
                duration_seconds: Number(r.duration_seconds ?? 0),
                status: r.status,
                updated_at: r.updated_at,
            })),
            creativeGenerators: creativeGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                asset_type: r.asset_type,
                output_format: r.output_format,
                status: r.status,
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
            creativeWorkflows: creativeWorkflows.map((r) => ({
                id: r.id,
                workflow_name: r.workflow_name,
                workflow_status: r.workflow_status,
                workflow_type: r.workflow_type,
                step_count: Number(r.step_count ?? 0),
                status: r.status,
                updated_at: r.updated_at,
            })),
            videoProjects: videoProjects.map((r) => ({
                id: r.id,
                project_name: r.project_name,
                project_status: r.project_status,
                video_format: r.video_format,
                duration_seconds: Number(r.duration_seconds ?? 0),
                status: r.status,
                updated_at: r.updated_at,
            })),
            emailTemplates: emailTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                campaign_type: r.campaign_type,
                status: r.status,
                updated_at: r.updated_at,
            })),
            caseStudyTemplates: caseStudyTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                industry: r.industry,
                status: r.status,
                updated_at: r.updated_at,
            })),
            blogTemplates: blogTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                content_type: r.content_type,
                status: r.status,
                updated_at: r.updated_at,
            })),
            cmpBrandAssets: cmpBrandAssets.map((r) => ({
                id: r.id,
                asset_name: r.asset_name,
                asset_category: r.asset_category,
                asset_ref: r.asset_ref,
                status: r.status,
                updated_at: r.updated_at,
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
                brand_health_score: Number(r.brand_health_score ?? 0),
                overall_growth_score: Number(r.overall_growth_score ?? 0),
                marketing_overview_score: Number(r.marketing_overview_score ?? 0),
            })),
        };
    }
}

export const growthOsCreativeRepository = new GrowthOsCreativeRepository();

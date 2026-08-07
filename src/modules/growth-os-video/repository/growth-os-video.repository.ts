import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { GrowthOsVideoRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class GrowthOsVideoRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<GrowthOsVideoRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            scripts,
            captions,
            brandVoice,
            voiceProfiles,
            voiceovers,
            music,
            videoProjects,
            youtubeTemplates,
            creativeWorkflows,
            creativeGenerators,
            logos,
            imageAssets,
            thumbnailTemplates,
            publishingQueue,
            publishingHistory,
            approvalQueue,
            approvalCenter,
            messaging,
            growthMetrics,
        ] = await Promise.all([
            databaseService.aageScriptGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCaptionGenerators.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageBrandVoice.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageVoiceProfiles.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoVoiceoverManager.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageMusicAssets.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoVideoProjects.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageYoutubeTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCreativeWorkflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoCreativeAssetGenerator.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageLogoLibrary.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageImageAssets.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageThumbnailTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagePublishingQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoPublishingHistory.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageApprovalQueue.listByOrganization(orgId, q).catch(() => []),
            databaseService.aagoApprovalCenter.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageCoreMessaging.listByOrganization(orgId, q).catch(() => []),
            databaseService.aageGrowthMetrics.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            membershipRole,
            scripts: scripts.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                script_type: r.script_type,
                target_length: Number(r.target_length ?? 0),
                status: r.status,
                updated_at: r.updated_at,
            })),
            captions: captions.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                platform: r.platform,
                tone: r.tone,
                status: r.status,
                updated_at: r.updated_at,
            })),
            brandVoice: brandVoice.map((r) => ({
                id: r.id,
                voice_name: r.voice_name,
                voice_tone: r.voice_tone,
                voice_style: r.voice_style,
                formality_level: r.formality_level,
                status: r.status,
            })),
            voiceProfiles: voiceProfiles.map((r) => ({
                id: r.id,
                profile_name: r.profile_name,
                voice_type: r.voice_type,
                language: r.language,
                sample_url: r.sample_url,
                status: r.status,
                updated_at: r.updated_at,
            })),
            voiceovers: voiceovers.map((r) => ({
                id: r.id,
                voiceover_name: r.voiceover_name,
                voiceover_status: r.voiceover_status,
                voice_type: r.voice_type,
                language: r.language,
                status: r.status,
                updated_at: r.updated_at,
            })),
            music: music.map((r) => ({
                id: r.id,
                asset_name: r.asset_name,
                genre: r.genre,
                mood: r.mood,
                asset_url: r.asset_url,
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
            youtubeTemplates: youtubeTemplates.map((r) => ({
                id: r.id,
                template_name: r.template_name,
                template_status: r.template_status,
                video_format: r.video_format,
                duration_seconds: Number(r.duration_seconds ?? 0),
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
            creativeGenerators: creativeGenerators.map((r) => ({
                id: r.id,
                generator_name: r.generator_name,
                generator_status: r.generator_status,
                asset_type: r.asset_type,
                output_format: r.output_format,
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
            imageAssets: imageAssets.map((r) => ({
                id: r.id,
                asset_name: r.asset_name,
                asset_type: r.asset_type,
                asset_format: r.asset_format,
                asset_url: r.asset_url,
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
            publishingQueue: publishingQueue.map((r) => ({
                id: r.id,
                queue_title: r.queue_title,
                content_type: r.content_type,
                publish_date: r.publish_date,
                queue_status: r.queue_status,
                status: r.status,
                updated_at: r.updated_at,
            })),
            publishingHistory: publishingHistory.map((r) => ({
                id: r.id,
                history_title: r.history_title,
                content_type: r.content_type,
                history_status: r.history_status,
                published_at: r.published_at,
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
            messaging: messaging.map((r) => ({
                id: r.id,
                messaging_title: r.messaging_title,
                messaging_type: r.messaging_type,
                audience_segment: r.audience_segment,
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

export const growthOsVideoRepository = new GrowthOsVideoRepository();

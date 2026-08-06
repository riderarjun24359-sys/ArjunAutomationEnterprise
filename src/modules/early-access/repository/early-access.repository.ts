import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { EarlyAccessRawData } from "../types";

const LIMIT = 400;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

export class EarlyAccessRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<EarlyAccessRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const memberships = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole = memberships.find((m) => m.organization_id === orgId)?.role_name ?? memberships[0]?.role_name ?? null;

        const [
            betaInvites,
            orgInvites,
            idpInvites,
            betaOrgs,
            organizations,
            salesLeads,
            founderInsights,
            activityLogs,
            onboardingWorkflows,
            adoption,
            healthScores,
            onboardingPlans,
            operatedMetrics,
            operatedHealth,
            feedback,
            satisfaction,
            bugs,
            featureRequests,
            briefings,
            releaseNotes,
            releaseChannels,
            deploymentPlans,
            criticalIssues,
            launchFailures,
            platformFailures,
        ] = await Promise.all([
            databaseService.copBetaInvitations.listByOrganization(orgId, q).catch(() => []),
            databaseService.organizationInvitations.listByOrganization(orgId, q).catch(() => []),
            databaseService.idpInvitations.listByOrganization(orgId, q).catch(() => []),
            databaseService.copBetaOrganizations.listByOrganization(orgId, q).catch(() => []),
            databaseService.organizations.list({ limit: LIMIT }).catch(() => []),
            databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
            databaseService.foFounderInsights.listByOrganization(orgId, q).catch(() => []),
            databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 150 }).catch(() => []),
            databaseService.csOnboardingWorkflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.csHealthScores.listByOrganization(orgId, q).catch(() => []),
            databaseService.onboardingPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.copOperatedMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.copOperatedHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.copFeedbackCollection.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportSatisfactionRatings.listByOrganization(orgId, q).catch(() => []),
            databaseService.copBugReports.listByOrganization(orgId, q).catch(() => []),
            databaseService.copFeatureRequests.listByOrganization(orgId, q).catch(() => []),
            databaseService.copExecutiveBriefings.listByOrganization(orgId, q).catch(() => []),
            databaseService.elrReleaseNotes.listByOrganization(orgId, q).catch(() => []),
            databaseService.copReleaseChannels.listByOrganization(orgId, q).catch(() => []),
            databaseService.elrDeploymentPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.elrCriticalIssues.listByOrganization(orgId, q).catch(() => []),
            databaseService.elrLaunchFailures.listByOrganization(orgId, q).catch(() => []),
            databaseService.copPlatformFailures.listByOrganization(orgId, q).catch(() => []),
        ]);

        const onboardingTaskBatches = await Promise.all(
            onboardingPlans.slice(0, 40).map((p) => databaseService.onboardingTasks.listByPlan(p.id).catch(() => [])),
        );
        const onboardingTasks = onboardingTaskBatches.flat();

        return {
            organizationId: orgId,
            membershipRole,
            betaInvites: betaInvites.map((i) => ({
                id: i.id,
                invitation_key: i.invitation_key,
                invitee_email: i.invitee_email,
                invitation_status: i.invitation_status,
                cohort_ref: i.cohort_ref,
                sent_at: i.sent_at,
                status: i.status,
            })),
            orgInvites: orgInvites.map((i) => ({
                id: i.id,
                email: i.email,
                role_name: i.role_name,
                status: i.status,
                expires_at: i.expires_at,
                created_at: i.created_at,
            })),
            idpInvites: idpInvites.map((i) => ({
                id: i.id,
                invitation_key: i.invitation_key,
                email: i.email,
                status: i.status,
                role_name: i.role_name,
                created_at: i.created_at,
                expires_at: i.expires_at,
            })),
            betaOrgs: betaOrgs.map((o) => ({
                id: o.id,
                org_name: o.org_name,
                beta_status: o.beta_status,
                cohort_ref: o.cohort_ref,
                enrolled_at: o.enrolled_at,
                status: o.status,
                created_at: o.created_at,
            })),
            organizations: organizations.map((o) => ({
                id: o.id,
                name: o.name,
                status: o.status,
                created_at: o.created_at,
            })),
            salesLeads: salesLeads.map((l) => ({
                id: l.id,
                lead_name: l.lead_name,
                email: l.email,
                source: l.source,
                status: l.status,
                score: Number(l.score ?? 0),
                created_at: l.created_at,
            })),
            founderInsights: founderInsights.map((f) => ({
                id: f.id,
                title: f.title,
                insight_type: f.insight_type,
                content: f.content,
                confidence_score: Number(f.confidence_score ?? 0),
                status: f.status,
                created_at: f.created_at,
            })),
            activityLogs: activityLogs.map((a) => ({
                id: a.id,
                action: a.action,
                title: a.title,
                detail: a.detail,
                created_at: a.created_at,
            })),
            onboardingWorkflows: onboardingWorkflows.map((w) => ({
                id: w.id,
                name: w.name,
                status: w.status,
                updated_at: w.updated_at,
                created_at: w.created_at,
            })),
            adoption: adoption.map((a) => ({
                id: a.id,
                name: a.name,
                adoption_percent: Number(a.adoption_percent ?? 0),
                status: a.status,
            })),
            healthScores: healthScores.map((h) => ({
                id: h.id,
                name: h.name,
                overall_score: Number(h.overall_score ?? 0),
                status: h.status,
                updated_at: h.updated_at,
                created_at: h.created_at,
            })),
            onboardingTasks: onboardingTasks.map((t) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                plan_id: t.plan_id,
                updated_at: t.updated_at,
                created_at: t.created_at,
            })),
            operatedMetrics: operatedMetrics.map((m) => ({
                onboarding_completion_rate: Number(m.onboarding_completion_rate ?? 0),
                metric_date: m.metric_date,
            })),
            operatedHealth: operatedHealth.map((h) => ({
                overall_score: Number(h.overall_score ?? 0),
                onboarding_status: h.onboarding_status,
                summary: h.summary,
                health_date: h.health_date,
            })),
            feedback: feedback.map((f) => ({
                id: f.id,
                feedback_title: f.feedback_title,
                feedback_type: f.feedback_type,
                rating: Number(f.rating ?? 0),
                collected_at: f.collected_at,
                status: f.status,
            })),
            satisfaction: satisfaction.map((s) => ({
                rating: Number(s.rating ?? 0),
                submitted_at: s.submitted_at,
            })),
            bugs: bugs.map((b) => ({
                id: b.id,
                bug_title: b.bug_title,
                severity: b.severity,
                bug_status: b.bug_status,
                reported_at: b.reported_at,
                status: b.status,
            })),
            featureRequests: featureRequests.map((r) => ({
                id: r.id,
                request_title: r.request_title,
                priority: r.priority,
                request_status: r.request_status,
                submitted_at: r.submitted_at,
                status: r.status,
            })),
            briefings: briefings.map((b) => ({
                id: b.id,
                briefing_title: b.briefing_title,
                briefing_type: b.briefing_type,
                summary: b.summary,
                briefing_date: b.briefing_date,
                status: b.status,
            })),
            releaseNotes: releaseNotes.map((n) => ({
                id: n.id,
                version_ref: n.version_ref,
                note_summary: n.note_summary,
                change_log: (n.change_log ?? {}) as Record<string, unknown>,
                published_at: n.published_at,
                status: n.status,
                created_at: n.created_at,
            })),
            releaseChannels: releaseChannels.map((c) => ({
                id: c.id,
                channel_name: c.channel_name,
                release_version: c.release_version,
                channel_status: c.channel_status,
                published_at: c.published_at,
                status: c.status,
            })),
            deploymentPlans: deploymentPlans.map((d) => ({
                id: d.id,
                plan_name: d.plan_name,
                target_version: d.target_version,
                deployment_strategy: d.deployment_strategy,
                status: d.status,
                scheduled_at: d.scheduled_at,
                created_at: d.created_at,
            })),
            criticalIssues: criticalIssues.map((i) => ({
                id: i.id,
                issue_title: i.issue_title,
                issue_severity: i.issue_severity,
                issue_summary: i.issue_summary,
                detected_at: i.detected_at,
                status: i.status,
            })),
            launchFailures: launchFailures.map((f) => ({
                id: f.id,
                failure_type: f.failure_type,
                error_message: f.error_message,
                failed_at: f.failed_at,
                status: f.status,
            })),
            platformFailures: platformFailures.map((f) => ({
                id: f.id,
                failure_title: f.error_message || f.failure_type,
                failure_type: f.failure_type,
                status: f.status,
                created_at: f.failed_at || f.created_at,
            })),
            fetchedAt: new Date().toISOString(),
        };
    }
}

export const earlyAccessRepository = new EarlyAccessRepository();

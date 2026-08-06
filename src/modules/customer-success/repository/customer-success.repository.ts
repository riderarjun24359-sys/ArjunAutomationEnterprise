import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { CustomerSuccessRawData } from "../types/raw";

const LIMIT = 500;

export class CustomerSuccessRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<CustomerSuccessRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

        const [
            clients,
            engagements,
            healthScores,
            adoption,
            onboarding,
            renewals,
            expansions,
            risks,
            churn,
            qbrReports,
            projects,
            tasks,
            invoices,
            payments,
            supportTickets,
            meetings,
            activities,
        ] = await Promise.all([
            databaseService.clients.listByOrganization(orgId, q).catch(() => []),
            databaseService.csEngagements.listByOrganization(orgId, q).catch(() => []),
            databaseService.csHealthScores.listByOrganization(orgId, q).catch(() => []),
            databaseService.csAdoptionTracking.listByOrganization(orgId, q).catch(() => []),
            databaseService.csOnboardingWorkflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRenewalPlans.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
            databaseService.csRiskAnalyses.listByOrganization(orgId, q).catch(() => []),
            databaseService.csChurnPredictions.listByOrganization(orgId, q).catch(() => []),
            databaseService.csQbrReports.listByOrganization(orgId, q).catch(() => []),
            databaseService.projects.listByOrganization(orgId, q).catch(() => []),
            databaseService.tasks.listByOrganization(orgId, q).catch(() => []),
            databaseService.invoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
            databaseService.supportTickets.listByOrganization(orgId, q).catch(() => []),
            databaseService.salesMeetings.listByOrganization(orgId, q).catch(() => []),
            databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 100 }).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            clients,
            engagements,
            healthScores,
            adoption,
            onboarding,
            renewals,
            expansions,
            risks,
            churn,
            qbrReports,
            projects,
            tasks,
            invoices,
            payments,
            supportTickets,
            meetings,
            activities,
            fetchedAt: new Date().toISOString(),
        };
    }
}

export const customerSuccessRepository = new CustomerSuccessRepository();

import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { BillingFinanceRawData } from "../types/raw";

const LIMIT = 500;

export class BillingFinanceRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<BillingFinanceRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

        const [
            clients,
            projects,
            billingAccounts,
            subscriptions,
            brvInvoices,
            paymentAttempts,
            refunds,
            mrrSnapshots,
            arrSnapshots,
            outstandingBalances,
            collectionCases,
            financeInvoices,
            financePayments,
            csHealthScores,
            csExpansions,
        ] = await Promise.all([
            databaseService.clients.listByOrganization(orgId, q).catch(() => []),
            databaseService.projects.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvBillingAccounts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvSubscriptionBillings.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvInvoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvPaymentAttempts.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvRefunds.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvMrrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvArrSnapshots.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvOutstandingBalances.listByOrganization(orgId, q).catch(() => []),
            databaseService.brvCollectionCases.listByOrganization(orgId, q).catch(() => []),
            databaseService.invoices.listByOrganization(orgId, q).catch(() => []),
            databaseService.payments.listByOrganization(orgId, q).catch(() => []),
            databaseService.csHealthScores.listByOrganization(orgId, q).catch(() => []),
            databaseService.csExpansionOpportunities.listByOrganization(orgId, q).catch(() => []),
        ]);

        return {
            organizationId: orgId,
            clients,
            projects,
            billingAccounts,
            subscriptions,
            brvInvoices,
            paymentAttempts,
            refunds,
            mrrSnapshots,
            arrSnapshots,
            outstandingBalances,
            collectionCases,
            financeInvoices,
            financePayments,
            csHealthScores,
            csExpansions,
            fetchedAt: new Date().toISOString(),
        };
    }
}

export const billingFinanceRepository = new BillingFinanceRepository();

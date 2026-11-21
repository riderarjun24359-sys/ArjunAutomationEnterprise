import type {
    DbActivityLog,
    DbClient,
    DbContact,
    DbDocument,
    DbInvoice,
    DbPayment,
    DbProject,
    DbSalesActivity,
    DbSalesCallLog,
    DbSalesEmailTracking,
    DbSalesLead,
    DbSalesMeeting,
    DbSalesOpportunity,
    DbSalesWinLossRecord,
    DbTask,
} from "@/src/modules/database/types/platform";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";

const LIST_LIMIT = 500;

export interface CrmPlatformRawData {
    organizationId: string;
    clients: DbClient[];
    leadsCrm: DbClient[];
    salesLeads: DbSalesLead[];
    opportunities: DbSalesOpportunity[];
    contacts: DbContact[];
    projects: DbProject[];
    tasks: DbTask[];
    invoices: DbInvoice[];
    payments: DbPayment[];
    activities: DbActivityLog[];
    salesActivities: DbSalesActivity[];
    calls: DbSalesCallLog[];
    emails: DbSalesEmailTracking[];
    meetings: DbSalesMeeting[];
    winLoss: DbSalesWinLossRecord[];
    documents: DbDocument[];
    fetchedAt: string;
}

export async function loadCrmPlatformData(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<CrmPlatformRawData> {
    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (!context) {
        throw new Error("No organization is linked to this account. Contact your administrator to finish workspace setup.");
    }

    const orgId = context.organizationId;
    const q = { limit: LIST_LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

    const [
        clients,
        leadsCrm,
        salesLeads,
        opportunities,
        contacts,
        projects,
        tasks,
        invoices,
        payments,
        activities,
        salesActivities,
        calls,
        emails,
        meetings,
        winLoss,
        documents,
    ] = await Promise.all([
        databaseService.clients.listByOrganization(orgId, q),
        databaseService.clients.listLeads(orgId),
        databaseService.salesLeads.listByOrganization(orgId, q),
        databaseService.salesOpportunities.listByOrganization(orgId, q),
        databaseService.contacts.listByOrganization(orgId, q),
        databaseService.projects.listByOrganization(orgId, q),
        databaseService.tasks.listByOrganization(orgId, q),
        databaseService.invoices.listByOrganization(orgId, q),
        databaseService.payments.listByOrganization(orgId, q),
        databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 100 }),
        databaseService.salesActivities.listByOrganization(orgId, q),
        databaseService.salesCallLogs.listByOrganization(orgId, q),
        databaseService.salesEmailTracking.listByOrganization(orgId, q),
        databaseService.salesMeetings.listByOrganization(orgId, q),
        databaseService.salesWinLossRecords.listByOrganization(orgId, q),
        databaseService.documents.listByOrganization(orgId, q),
    ]);

    return {
        organizationId: orgId,
        clients,
        leadsCrm,
        salesLeads,
        opportunities,
        contacts,
        projects,
        tasks,
        invoices,
        payments,
        activities,
        salesActivities,
        calls,
        emails,
        meetings,
        winLoss,
        documents,
        fetchedAt: new Date().toISOString(),
    };
}

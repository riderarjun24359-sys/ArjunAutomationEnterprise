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
): Promise<CrmPlatformRawData | null> {
    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (!context) return null;

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
        databaseService.clients.listByOrganization(orgId, q).catch(() => []),
        databaseService.clients.listLeads(orgId).catch(() => []),
        databaseService.salesLeads.listByOrganization(orgId, q).catch(() => []),
        databaseService.salesOpportunities.listByOrganization(orgId, q).catch(() => []),
        databaseService.contacts.listByOrganization(orgId, q).catch(() => []),
        databaseService.projects.listByOrganization(orgId, q).catch(() => []),
        databaseService.tasks.listByOrganization(orgId, q).catch(() => []),
        databaseService.invoices.listByOrganization(orgId, q).catch(() => []),
        databaseService.payments.listByOrganization(orgId, q).catch(() => []),
        databaseService.activityLogs.listByOrganization(orgId, { ...q, limit: 100 }).catch(() => []),
        databaseService.salesActivities.listByOrganization(orgId, q).catch(() => []),
        databaseService.salesCallLogs.listByOrganization(orgId, q).catch(() => []),
        databaseService.salesEmailTracking.listByOrganization(orgId, q).catch(() => []),
        databaseService.salesMeetings.listByOrganization(orgId, q).catch(() => []),
        databaseService.salesWinLossRecords.listByOrganization(orgId, q).catch(() => []),
        databaseService.documents.listByOrganization(orgId, q).catch(() => []),
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

import type {
    DbActivityLog,
    DbClient,
    DbInvoice,
    DbPayment,
    DbProject,
    DbSalesLead,
    DbTask,
} from "@/src/modules/database/types/platform";
import type { AuditLog } from "@/src/modules/database/types/core";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";

const LIST_LIMIT = 500;

export interface OrganizationOperationsData {
    organizationId: string;
    clients: DbClient[];
    activeClients: DbClient[];
    projects: DbProject[];
    tasks: DbTask[];
    salesLeads: DbSalesLead[];
    crmLeads: DbClient[];
    invoices: DbInvoice[];
    payments: DbPayment[];
    audits: AuditLog[];
    activities: DbActivityLog[];
    fetchedAt: string;
}

export async function loadOrganizationOperationsData(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<OrganizationOperationsData | null> {
    const context = await resolveOrganizationContext(authUserId, email, fullName);
    if (!context) return null;

    const orgId = context.organizationId;
    const listQuery = { limit: LIST_LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };

    const [clients, activeClients, projects, tasks, salesLeads, crmLeads, invoices, payments, audits, activities] =
        await Promise.all([
            databaseService.clients.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.clients.listActiveClients(orgId).catch(() => []),
            databaseService.projects.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.tasks.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.salesLeads.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.clients.listLeads(orgId).catch(() => []),
            databaseService.invoices.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.payments.listByOrganization(orgId, listQuery).catch(() => []),
            databaseService.audits
                .list({
                    limit: 40,
                    orderBy: "created_at",
                    orderDirection: "desc",
                    filters: { organization_id: orgId },
                })
                .catch(() => []),
            databaseService.activityLogs
                .listByOrganization(orgId, {
                    orderBy: "created_at",
                    orderDirection: "desc",
                    limit: 40,
                })
                .catch(() => []),
        ]);

    return {
        organizationId: orgId,
        clients,
        activeClients,
        projects,
        tasks,
        salesLeads,
        crmLeads,
        invoices,
        payments,
        audits,
        activities,
        fetchedAt: new Date().toISOString(),
    };
}

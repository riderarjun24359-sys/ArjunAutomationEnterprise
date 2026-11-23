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
    integrationIssues: string[];
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

    const loadRecords = async <T,>(label: string, load: () => Promise<T[]>): Promise<{ data: T[]; error?: string }> => {
        try {
            return { data: await load() };
        } catch {
            return { data: [], error: label };
        }
    };
    const results = await Promise.all([
        loadRecords("Clients", () => databaseService.clients.listByOrganization(orgId, listQuery)),
        loadRecords("Projects", () => databaseService.projects.listByOrganization(orgId, listQuery)),
        loadRecords("Tasks", () => databaseService.tasks.listByOrganization(orgId, listQuery)),
        loadRecords("Sales leads", () => databaseService.salesLeads.listByOrganization(orgId, listQuery)),
        loadRecords("Invoices", () => databaseService.invoices.listByOrganization(orgId, listQuery)),
        loadRecords("Payments", () => databaseService.payments.listByOrganization(orgId, listQuery)),
        loadRecords("Audit logs", () => databaseService.audits.list({
            limit: 40,
            orderBy: "created_at",
            orderDirection: "desc",
            filters: { organization_id: orgId },
        })),
        loadRecords("Activity logs", () => databaseService.activityLogs.listByOrganization(orgId, {
            orderBy: "created_at",
            orderDirection: "desc",
            limit: 40,
        })),
    ]);
    const [clientsResult, projectsResult, tasksResult, leadsResult, invoicesResult, paymentsResult, auditsResult, activitiesResult] = results;
    const clients = clientsResult.data;
    const projects = projectsResult.data;
    const tasks = tasksResult.data;
    const salesLeads = leadsResult.data;
    const invoices = invoicesResult.data;
    const payments = paymentsResult.data;
    const audits = auditsResult.data;
    const activities = activitiesResult.data;
    const integrationIssues = results.flatMap((result) => result.error ? [result.error] : []);

    const activeClients = clients.filter((c) => c.lifecycle_stage === "client");
    const crmLeads = clients.filter((c) => c.lifecycle_stage !== "client");

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
        integrationIssues,
    };
}

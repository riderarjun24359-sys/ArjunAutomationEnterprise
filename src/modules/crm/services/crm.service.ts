import { databaseService } from "@/src/modules/database/services/database-service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import {
    mapActivitySummary,
    mapClientDetail,
    mapClientSummary,
    mapLeadSummary,
} from "@/src/modules/database/lib/crm-mappers";
import {
    buildClientProfile,
    buildCrmEnterpriseSnapshot,
    createEmptyCrmSnapshot,
    queryDirectory,
} from "./crm-enterprise-builders";
import { loadCrmPlatformData } from "./crm-platform-data.service";
import type {
    ClientProfileBundle,
    CrmEnterpriseSnapshot,
    DirectoryQuery,
    DirectoryResult,
    LeadPipelineStage,
} from "../types/enterprise";
import type {
    ActivitySummary,
    ClientDetail,
    ClientSummary,
    CrmDashboardStats,
    DealSummary,
    LeadSummary,
    TaskSummary,
} from "../types";

export { queryDirectory } from "./crm-enterprise-builders";

export class CrmService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getEnterpriseSnapshot(authUserId: string, email: string, fullName?: string | null): Promise<CrmEnterpriseSnapshot> {
        const data = await loadCrmPlatformData(authUserId, email, fullName).catch(() => null);
        if (!data) return createEmptyCrmSnapshot();
        return buildCrmEnterpriseSnapshot(data);
    }

    async getDirectoryPage(
        authUserId: string,
        email: string,
        query: DirectoryQuery,
        fullName?: string | null,
    ): Promise<DirectoryResult> {
        const snapshot = await this.getEnterpriseSnapshot(authUserId, email, fullName);
        return queryDirectory(snapshot.directory, query);
    }

    async getClientProfile(
        authUserId: string,
        email: string,
        clientId: string,
        fullName?: string | null,
    ): Promise<ClientProfileBundle | null> {
        const data = await loadCrmPlatformData(authUserId, email, fullName).catch(() => null);
        if (!data) return null;
        return buildClientProfile(data, clientId);
    }

    async moveLeadStage(
        authUserId: string,
        email: string,
        leadId: string,
        stage: LeadPipelineStage,
        origin: "sales_lead" | "crm_lead",
        fullName?: string | null,
    ): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return false;

        // Tenant guard: verify the lead belongs to the caller's organization
        // before moving it. Without this, a known UUID from another tenant
        // could be transitioned.
        if (origin === "sales_lead") {
            const existing = await databaseService.salesLeads.getById(leadId);
            if (!existing || existing.organization_id !== context.organizationId) return false;
            const updated = await databaseService.salesLeads.update(leadId, {
                status: stage,
                updated_at: new Date().toISOString(),
            });
            return Boolean(updated);
        }

        const existingClient = await databaseService.clients.getById(leadId);
        if (!existingClient || existingClient.organization_id !== context.organizationId) return false;
        const updated = await databaseService.clients.update(leadId, {
            lifecycle_stage: stage,
            status: stage === "won" ? "active" : stage === "lost" ? "inactive" : "lead",
            updated_at: new Date().toISOString(),
        });
        return Boolean(updated);
    }

    async getClients(authUserId: string, email: string, fullName?: string | null): Promise<ClientSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.clients.listByOrganization(context.organizationId);
        return records.filter((record) => record.lifecycle_stage === "client").map(mapClientSummary);
    }

    async getClient(authUserId: string, email: string, id: string, fullName?: string | null): Promise<ClientDetail | undefined> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return undefined;
        const record = await databaseService.clients.getById(id);
        // Tenant guard: never return a client that belongs to another organization,
        // even if its UUID is known. RLS is the backstop; this is the service gate.
        if (!record || record.organization_id !== context.organizationId) return undefined;
        return mapClientDetail(record);
    }

    async getLeads(authUserId: string, email: string, fullName?: string | null): Promise<LeadSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.clients.listLeads(context.organizationId);
        return records.map(mapLeadSummary);
    }

    async getDeals(authUserId: string, email: string, fullName?: string | null): Promise<DealSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const opportunities = await databaseService.salesOpportunities.listByOrganization(context.organizationId);
        return opportunities.map((opp) => ({
            id: opp.id,
            client: opp.name,
            value: `₹${Number(opp.amount ?? 0).toLocaleString()}`,
            closeDate: opp.expected_close_date ?? "—",
            stage: (opp.status as DealSummary["stage"]) || "discovery",
            probability: Number(opp.probability ?? 0),
            revenueMetric: `Weighted ₹${Math.round(Number(opp.amount ?? 0) * (Number(opp.probability ?? 0) / 100)).toLocaleString()}`,
        }));
    }

    async getActivities(authUserId: string, email: string, fullName?: string | null): Promise<ActivitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.activityLogs.listByOrganization(context.organizationId, { limit: 50 });
        return records.map(mapActivitySummary);
    }

    async getTasks(authUserId: string, email: string, fullName?: string | null): Promise<TaskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const records = await databaseService.tasks.listByOrganization(context.organizationId);
        return records.map((task) => ({
            id: task.id,
            title: task.title,
            assignee: task.assignee_name ?? "Unassigned",
            dueDate: task.due_date ?? "—",
            priority: (task.priority as TaskSummary["priority"]) || "medium",
            status: (task.status as TaskSummary["status"]) || "pending",
        }));
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CrmDashboardStats> {
        const snapshot = await this.getEnterpriseSnapshot(authUserId, email, fullName);
        return {
            totalClients: snapshot.stats.totalClients,
            activeDeals: snapshot.stats.openOpportunities,
            monthlyRevenue: snapshot.stats.collectedRevenueLabel,
            newLeads: snapshot.stats.totalLeads,
            conversionRate: `${snapshot.stats.conversionRate}%`,
            recentActivities: snapshot.communications.slice(0, 5).map((c) => ({
                id: c.id,
                type:
                    c.channel === "call"
                        ? "call"
                        : c.channel === "email"
                          ? "email"
                          : c.channel === "meeting"
                            ? "meeting"
                            : "note",
                title: c.title,
                detail: c.detail,
                dueAt: c.relativeTime,
            })),
        };
    }
}

export const crmService = new CrmService();

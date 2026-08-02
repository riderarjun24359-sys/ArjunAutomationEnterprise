import {
    buildCrmDashboardStats,
    mapActivitySummary,
    mapClientDetail,
    mapClientSummary,
    mapCrmTaskSummary,
    mapDealSummary,
    mapLeadSummary,
} from "@/src/modules/database/lib/crm-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { ActivitySummary, ClientDetail, ClientSummary, CrmDashboardStats, DealSummary, LeadSummary, TaskSummary } from "@/src/modules/crm/types";

export class CrmService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getClients(authUserId: string, email: string, fullName?: string | null): Promise<ClientSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.clients.listByOrganization(context.organizationId);
        return records.filter((record) => record.lifecycle_stage === "client").map(mapClientSummary);
    }

    async getClient(authUserId: string, email: string, id: string, fullName?: string | null): Promise<ClientDetail | undefined> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return undefined;
        }

        const record = await databaseService.clients.getById(id);
        return record ? mapClientDetail(record) : undefined;
    }

    async getLeads(authUserId: string, email: string, fullName?: string | null): Promise<LeadSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.clients.listLeads(context.organizationId);
        return records.map(mapLeadSummary);
    }

    async getDeals(authUserId: string, email: string, fullName?: string | null): Promise<DealSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.activityLogs.listByOrganization(context.organizationId, {
            filters: { entity_type: "deal" },
        });

        return records.map(mapDealSummary);
    }

    async getActivities(authUserId: string, email: string, fullName?: string | null): Promise<ActivitySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.activityLogs.listByOrganization(context.organizationId, {
            filters: { entity_type: "activity" },
        });

        return records.map(mapActivitySummary);
    }

    async getTasks(authUserId: string, email: string, fullName?: string | null): Promise<TaskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.activityLogs.listByOrganization(context.organizationId, {
            filters: { entity_type: "crm_task" },
        });

        return records.map(mapCrmTaskSummary);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<CrmDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return {
                totalClients: 0,
                activeDeals: 0,
                monthlyRevenue: "$0",
                newLeads: 0,
                conversionRate: "0%",
                recentActivities: [],
            };
        }

        const [clients, deals, activities] = await Promise.all([
            databaseService.clients.listByOrganization(context.organizationId),
            databaseService.activityLogs.listByOrganization(context.organizationId, { filters: { entity_type: "deal" } }),
            databaseService.activityLogs.listByOrganization(context.organizationId, { filters: { entity_type: "activity" }, limit: 5 }),
        ]);

        return buildCrmDashboardStats({ clients, deals, activities });
    }
}

export const crmService = new CrmService();

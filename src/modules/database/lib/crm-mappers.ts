import type { ActivitySummary, ClientDetail, ClientSummary, CrmDashboardStats, DealSummary, LeadSummary, TaskSummary } from "@/src/modules/crm/types";
import { formatRelativeTimestamp } from "@/src/modules/database/lib/formatters";
import type { DbActivityLog, DbClient } from "@/src/modules/database/types/platform";

export const mapClientSummary = (client: DbClient): ClientSummary => ({
    id: client.id,
    name: client.name,
    status: client.status as ClientSummary["status"],
    industry: client.industry as ClientSummary["industry"],
    contactEmail: client.contact_email,
    manager: client.manager_name,
    revenue: client.revenue,
    updatedAt: formatRelativeTimestamp(client.updated_at),
});

export const mapClientDetail = (client: DbClient): ClientDetail => ({
    ...mapClientSummary(client),
    phone: client.phone ?? "",
    website: client.website ?? "",
    address: client.address ?? "",
    description: client.description ?? "",
});

export const mapLeadSummary = (client: DbClient): LeadSummary => ({
    id: client.id,
    company: client.name,
    contact: client.contact_email,
    stage: (client.lifecycle_stage as LeadSummary["stage"]) ?? "new",
    score: client.lead_score ?? 0,
    value: client.deal_value ?? "$0",
    assignedTo: client.assigned_to ?? "Unassigned",
});

export const mapDealSummary = (log: DbActivityLog): DealSummary => {
    const metadata = (log.metadata ?? {}) as Record<string, string | number>;

    return {
        id: log.id,
        client: log.title,
        value: String(metadata.value ?? "$0"),
        closeDate: String(metadata.closeDate ?? "—"),
        stage: String(metadata.stage ?? log.action) as DealSummary["stage"],
        probability: Number(metadata.probability ?? 0),
        revenueMetric: String(metadata.revenueMetric ?? "$0 ARR"),
    };
};

export const mapActivitySummary = (log: DbActivityLog): ActivitySummary => {
    const metadata = (log.metadata ?? {}) as Record<string, string>;

    return {
        id: log.id,
        type: log.action as ActivitySummary["type"],
        title: log.title,
        detail: log.detail,
        dueAt: metadata.dueAt ?? formatRelativeTimestamp(log.created_at),
    };
};

export const mapCrmTaskSummary = (log: DbActivityLog): TaskSummary => {
    const metadata = (log.metadata ?? {}) as Record<string, string>;

    return {
        id: log.id,
        title: log.title,
        assignee: metadata.assignee ?? "Unassigned",
        dueDate: metadata.dueDate ?? "—",
        priority: (metadata.priority as TaskSummary["priority"]) ?? "medium",
        status: (metadata.status as TaskSummary["status"]) ?? "pending",
    };
};

export const buildCrmDashboardStats = (input: {
    clients: DbClient[];
    deals: DbActivityLog[];
    activities: DbActivityLog[];
}): CrmDashboardStats => {
    const activeClients = input.clients.filter((client) => client.lifecycle_stage === "client").length;
    const leads = input.clients.filter((client) => client.lifecycle_stage !== "client").length;

    return {
        totalClients: activeClients,
        activeDeals: input.deals.length,
        monthlyRevenue: "$312k",
        newLeads: leads,
        conversionRate: activeClients > 0 ? `${Math.round((activeClients / (activeClients + leads)) * 100)}%` : "0%",
        recentActivities: input.activities.slice(0, 3).map(mapActivitySummary),
    };
};

import type { ExecutiveKpi, LiveOperationsStats } from "../types";

export function createEmptyLiveOperationsStats(
    reason: "no_organization" | "error" = "no_organization",
): LiveOperationsStats {
    return {
        totalClients: 0,
        activeProjects: 0,
        openTasks: 0,
        crmLeads: 0,
        revenue: {
            collected: 0,
            outstanding: 0,
            openInvoiceCount: 0,
            invoiceCount: 0,
            currency: "USD",
            label: "$0",
            detail: reason === "no_organization" ? "Sign in to load revenue" : "Unable to load revenue",
        },
        notifications: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        organizationId: null,
    };
}

export function buildLiveOperationsKpis(liveStats: LiveOperationsStats): ExecutiveKpi[] {
    const emptyHint = liveStats.source === "fallback" ? "Connect Supabase data" : "No records yet";
    return [
        {
            title: "Total Clients",
            value: String(liveStats.totalClients),
            detail: liveStats.totalClients === 0 ? emptyHint : "Active CRM clients",
            tone: "accent",
            trend: liveStats.totalClients > 0 ? "up" : "flat",
        },
        {
            title: "Active Projects",
            value: String(liveStats.activeProjects),
            detail: liveStats.activeProjects === 0 ? emptyHint : "In-flight delivery work",
            tone: liveStats.activeProjects > 0 ? "success" : "neutral",
            trend: liveStats.activeProjects > 0 ? "up" : "flat",
        },
        {
            title: "Open Tasks",
            value: String(liveStats.openTasks),
            detail: liveStats.openTasks === 0 ? emptyHint : "Tasks awaiting completion",
            tone: liveStats.openTasks > 10 ? "warning" : "neutral",
            trend: liveStats.openTasks > 0 ? "down" : "up",
        },
        {
            title: "CRM Leads",
            value: String(liveStats.crmLeads),
            detail: liveStats.crmLeads === 0 ? emptyHint : "Pipeline opportunities",
            tone: "accent",
            trend: liveStats.crmLeads > 0 ? "up" : "flat",
        },
        {
            title: "Revenue Summary",
            value: liveStats.revenue.label,
            detail: liveStats.revenue.detail || emptyHint,
            tone: liveStats.revenue.collected > 0 ? "success" : "neutral",
            trend: liveStats.revenue.collected > 0 ? "up" : "flat",
        },
    ];
}

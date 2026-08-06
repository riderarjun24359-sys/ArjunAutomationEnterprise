import type { OrganizationOperationsData } from "./organization-operations-data.service";
import type { LiveOperationsStats, RevenueSummaryLive } from "../types";
import { createEmptyLiveOperationsStats } from "./build-live-operations-kpis";
import { loadOrganizationOperationsData } from "./organization-operations-data.service";

export { createEmptyLiveOperationsStats } from "./build-live-operations-kpis";

function parseMoney(value: string | number | null | undefined): number {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (!value) return 0;
    const n = Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

function formatCurrency(amount: number, currency = "USD"): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `$${Math.round(amount).toLocaleString()}`;
    }
}

function isActiveProject(status: string): boolean {
    const s = status.toLowerCase();
    return !["completed", "cancelled", "archived", "done", "closed"].includes(s);
}

function isOpenTask(status: string): boolean {
    const s = status.toLowerCase();
    return !["done", "completed", "cancelled", "closed"].includes(s);
}

function isOpenInvoice(status: string): boolean {
    const s = status.toLowerCase();
    return ["open", "sent", "draft", "partial", "overdue", "pending"].includes(s);
}

function relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function buildLiveOperationsStatsFromData(data: OrganizationOperationsData): LiveOperationsStats {
    const {
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
        organizationId,
        fetchedAt,
    } = data;

    const totalClients =
        activeClients.length > 0
            ? activeClients.length
            : clients.filter((c) => c.lifecycle_stage === "client" || c.status === "active").length ||
              clients.filter((c) => c.lifecycle_stage !== "lead").length;

    const activeProjects = projects.filter((p) => isActiveProject(p.status)).length;
    const openTasks = tasks.filter((t) => isOpenTask(t.status)).length;
    const crmLeadsCount = Math.max(salesLeads.length, crmLeads.length);

    const paidFromPayments = payments.reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
    const paidFromInvoices = invoices.reduce((sum, inv) => sum + Number(inv.amount_paid ?? 0), 0);
    const collected = Math.max(paidFromPayments, paidFromInvoices);
    const openInvoices = invoices.filter((inv) => isOpenInvoice(inv.status));
    const outstanding = openInvoices.reduce(
        (sum, inv) => sum + Math.max(0, Number(inv.total ?? 0) - Number(inv.amount_paid ?? 0)),
        0,
    );
    const currency = invoices[0]?.currency ?? "USD";

    const revenue: RevenueSummaryLive = {
        collected,
        outstanding,
        openInvoiceCount: openInvoices.length,
        invoiceCount: invoices.length,
        currency,
        label: formatCurrency(collected, currency),
        detail:
            invoices.length === 0 && payments.length === 0
                ? "No invoice data yet"
                : `${openInvoices.length} open · ${formatCurrency(outstanding, currency)} outstanding`,
    };

    const clientRevenueHint = clients.reduce((sum, c) => sum + parseMoney(c.revenue), 0);
    if (collected === 0 && clientRevenueHint > 0) {
        revenue.collected = clientRevenueHint;
        revenue.label = formatCurrency(clientRevenueHint, currency);
        revenue.detail = `${clients.length} clients · CRM revenue signal`;
    }

    const notifications = [
        ...activities.slice(0, 8).map((a) => ({
            id: `act-${a.id}`,
            title: a.title || `${a.action} ${a.entity_type}`,
            detail: a.detail || `${a.entity_type} activity`,
            time: relativeTime(a.created_at),
            severity: "low" as const,
            read: false,
            source: "activity" as const,
        })),
        ...audits.slice(0, 8).map((log) => ({
            id: `audit-${log.id}`,
            title: `${log.action} ${log.entity_type ?? "record"}`,
            detail: log.entity_type ? `${log.entity_type} ${log.entity_id ?? ""}`.trim() : "System audit event",
            time: relativeTime(log.created_at),
            severity: "medium" as const,
            read: false,
            source: "audit" as const,
        })),
    ].slice(0, 10);

    return {
        totalClients,
        activeProjects,
        openTasks,
        crmLeads: crmLeadsCount,
        revenue,
        notifications,
        source: "supabase",
        fetchedAt,
        organizationId,
    };
}

export async function fetchLiveOperationsStats(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<LiveOperationsStats> {
    const data = await loadOrganizationOperationsData(authUserId, email, fullName);
    if (!data) return createEmptyLiveOperationsStats("no_organization");
    return buildLiveOperationsStatsFromData(data);
}

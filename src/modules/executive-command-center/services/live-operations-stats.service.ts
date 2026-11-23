import type { OrganizationOperationsData } from "./organization-operations-data.service";
import type { LiveOperationsStats, RevenueSummaryLive } from "../types";
import { createEmptyLiveOperationsStats } from "./build-live-operations-kpis";
import { loadOrganizationOperationsData } from "./organization-operations-data.service";

export { createEmptyLiveOperationsStats } from "./build-live-operations-kpis";

function formatInr(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
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

    // Invoice balances are not proof of collected revenue. Until signed Razorpay
    // captured events are reconciled to invoices, report collected revenue as unverified.
    const inrInvoices = invoices.filter((invoice) => invoice.currency === "INR");
    const openInvoices = inrInvoices.filter((invoice) => isOpenInvoice(invoice.status));
    const outstanding = openInvoices.reduce(
        (sum, invoice) => sum + Math.max(0, Number(invoice.total ?? 0) - Number(invoice.amount_paid ?? 0)),
        0,
    );

    const revenue: RevenueSummaryLive = {
        collected: 0,
        outstanding,
        openInvoiceCount: openInvoices.length,
        invoiceCount: inrInvoices.length,
        currency: "INR",
        verified: false,
        label: "Not verified",
        detail: `Razorpay settlement verification is not connected · ${openInvoices.length} open · ${formatInr(outstanding)} outstanding`,
    };

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
        source: data.integrationIssues.length ? "fallback" : "supabase",
        fetchedAt,
        organizationId,
        integrationIssues: data.integrationIssues,
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

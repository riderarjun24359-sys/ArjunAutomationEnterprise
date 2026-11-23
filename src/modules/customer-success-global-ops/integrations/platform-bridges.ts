import { businessPlatformService } from "@/src/modules/business-platform/services/business-platform.service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import { supportService } from "@/src/modules/support/services/support.service";
import type { CsgContext, SupportTicketSummary } from "../types";

export async function fetchBusinessPlatformSnapshot(ctx: CsgContext) {
    try {
        const organizationId = ctx.organizationId ?? (await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName))?.organizationId;
        if (!organizationId) throw new Error("Organization context unavailable");
        const dash = await businessPlatformService.getDashboard({ ...ctx, organizationId });
        return {
            activeClients: dash.activeClients,
            activeProjects: dash.activeProjects,
            openInvoices: dash.openInvoices,
            pendingAi: dash.pendingAiRecommendations,
            leads: dash.leadsCount,
            available: true,
        };
    } catch {
        return { activeClients: 0, activeProjects: 0, openInvoices: 0, pendingAi: 0, leads: 0, available: false };
    }
}

export async function fetchSupportSnapshot(ctx: CsgContext) {
    try {
        const stats = await supportService.getDashboardStats(ctx.authUserId, ctx.email, ctx.fullName);
        return {
            openTickets: stats.openTickets,
            slaCompliance: stats.slaCompliance,
            queueDepth: stats.openTickets,
            knowledgeArticles: stats.knowledgeArticles,
            incidents: stats.openEscalations,
            avgSatisfaction: stats.avgSatisfaction,
            available: true,
        };
    } catch {
        return { openTickets: 0, slaCompliance: 0, queueDepth: 0, knowledgeArticles: 0, incidents: 0, avgSatisfaction: 0, available: false };
    }
}

export async function fetchDeliverySnapshot(ctx: CsgContext) {
    try {
        const organizationId = ctx.organizationId ?? (await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName))?.organizationId;
        if (!organizationId) throw new Error("Organization context unavailable");
        const dash = await deliveryEngineService.getDashboard({ ...ctx, organizationId });
        return {
            activeEngagements: dash.activeEngagements,
            qualityPassRate: dash.qualityPassRate,
            pendingAi: dash.pendingAiRecommendations,
            available: true,
        };
    } catch {
        return { activeEngagements: 0, qualityPassRate: 0, pendingAi: 0, available: false };
    }
}

export async function fetchSupportTickets(ctx: CsgContext): Promise<SupportTicketSummary[]> {
    const tickets = await supportService.getTickets(ctx.authUserId, ctx.email, ctx.fullName);
    return tickets.slice(0, 12).map((t) => ({
        id: t.id,
        subject: t.subject,
        status: t.status,
        priority: t.priorityName ?? "normal",
        slaStatus: t.dueAt && new Date(t.dueAt) < new Date() && t.status !== "resolved" ? "breached" : "on-track",
        clientName: t.clientName ?? "Client",
    }));
}

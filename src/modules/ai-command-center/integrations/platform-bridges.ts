import { businessPlatformService } from "@/src/modules/business-platform/services/business-platform.service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import { supportService } from "@/src/modules/support/services/support.service";
import { customerSuccessGlobalOpsService } from "@/src/modules/customer-success-global-ops/services/customer-success-global-ops.service";
import type { AccContext } from "../types";

export async function fetchBusinessSnapshot(ctx: AccContext) {
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

export async function fetchSupportSnapshot(ctx: AccContext) {
    try {
        const stats = await supportService.getDashboardStats(ctx.authUserId, ctx.email, ctx.fullName);
        return {
            openTickets: stats.openTickets,
            slaCompliance: stats.slaCompliance,
            supportHealth: Math.round((stats.slaCompliance + (stats.avgSatisfaction > 0 ? (stats.avgSatisfaction / 5) * 100 : 0)) / 2),
            incidents: stats.openEscalations,
            knowledgeArticles: stats.knowledgeArticles,
            available: true,
        };
    } catch {
        return { openTickets: 0, slaCompliance: 0, supportHealth: 0, incidents: 0, knowledgeArticles: 0, available: false };
    }
}

export async function fetchDeliverySnapshot(ctx: AccContext) {
    try {
        const organizationId = ctx.organizationId ?? (await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName))?.organizationId;
        if (!organizationId) throw new Error("Organization context unavailable");
        const dash = await deliveryEngineService.getDashboard({ ...ctx, organizationId });
        return {
            activeEngagements: dash.activeEngagements,
            qualityPassRate: dash.activeEngagements > 0 ? dash.qualityPassRate : 0,
            pendingAi: dash.pendingAiRecommendations,
            available: true,
        };
    } catch {
        return { activeEngagements: 0, qualityPassRate: 0, pendingAi: 0, available: false };
    }
}

export async function fetchGlobalOpsSnapshot(ctx: AccContext) {
    try {
        const dash = await customerSuccessGlobalOpsService.getDashboard(ctx);
        return {
            customerHealth: dash.customerHealth,
            deliveryHealth: dash.deliveryHealth,
            supportHealth: dash.supportHealth,
            renewalsDue: dash.revenueOverview.renewalsDue,
            mrr: dash.revenueOverview.mrr,
            escalations: dash.escalations.length,
            available: dash.integrationIssues.length === 0,
            integrationIssues: dash.integrationIssues,
        };
    } catch {
        return { customerHealth: 0, deliveryHealth: 0, supportHealth: 0, renewalsDue: 0, mrr: 0, escalations: 0, available: false, integrationIssues: ["Customer Success Global Operations"] };
    }
}

export async function fetchProductionSnapshot(_ctx: AccContext) {
    // Platform Operations currently uses in-memory seeded backups, random latency
    // and simulated health components. It is not an authoritative production monitor.
    // Keep Command Centre health unknown until a real provider/backup verification
    // integration supplies timestamped evidence.
    return {
        overallScore: 0,
        alerts: 0,
        platformHealth: 0,
        available: false,
        reason: "Production health and backup evidence is simulated, not externally verified",
    };
}

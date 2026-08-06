import { businessPlatformService } from "@/src/modules/business-platform/services/business-platform.service";
import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import { supportService } from "@/src/modules/support/services/support.service";
import { customerSuccessGlobalOpsService } from "@/src/modules/customer-success-global-ops/services/customer-success-global-ops.service";
import { productionReadinessService } from "@/src/modules/production-readiness/services/production-readiness.service";
import type { AccContext } from "../types";

export async function fetchBusinessSnapshot(ctx: AccContext) {
    try {
        const dash = await businessPlatformService.getDashboard(ctx);
        return {
            activeClients: dash.activeClients,
            activeProjects: dash.activeProjects,
            openInvoices: dash.openInvoices,
            pendingAi: dash.pendingAiRecommendations,
            leads: dash.leadsCount,
        };
    } catch {
        return { activeClients: 0, activeProjects: 0, openInvoices: 0, pendingAi: 0, leads: 0 };
    }
}

export async function fetchSupportSnapshot(ctx: AccContext) {
    try {
        const stats = await supportService.getDashboardStats(ctx.authUserId, ctx.email, ctx.fullName);
        return {
            openTickets: stats.openTickets,
            slaCompliance: stats.slaCompliance,
            supportHealth: Math.round((stats.slaCompliance + (stats.avgSatisfaction > 0 ? (stats.avgSatisfaction / 5) * 100 : 85)) / 2),
            incidents: stats.openEscalations,
            knowledgeArticles: stats.knowledgeArticles,
        };
    } catch {
        return { openTickets: 0, slaCompliance: 100, supportHealth: 90, incidents: 0, knowledgeArticles: 0 };
    }
}

export async function fetchDeliverySnapshot(ctx: AccContext) {
    try {
        const dash = await deliveryEngineService.getDashboard(ctx);
        return {
            activeEngagements: dash.activeEngagements,
            qualityPassRate: dash.qualityPassRate,
            pendingAi: dash.pendingAiRecommendations,
        };
    } catch {
        return { activeEngagements: 0, qualityPassRate: 100, pendingAi: 0 };
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
        };
    } catch {
        return { customerHealth: 75, deliveryHealth: 85, supportHealth: 85, renewalsDue: 0, mrr: 0, escalations: 0 };
    }
}

export async function fetchProductionSnapshot(ctx: AccContext) {
    try {
        const snapshot = await productionReadinessService.getSnapshot(ctx);
        return {
            overallScore: snapshot.ctoAudit.overallScore,
            alerts: snapshot.ctoAudit.systemAlerts.length,
            platformHealth: snapshot.ctoAudit.platformHealth,
        };
    } catch {
        return { overallScore: 90, alerts: 0, platformHealth: 90 };
    }
}

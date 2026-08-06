import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { productionLog } from "@/src/lib/production-logger";
import { proposeDecisions } from "../engines/ai-decision.engine";
import { buildAutomations } from "../engines/automation.engine";
import { buildRevenueSummary, computeOverallScore } from "../engines/executive-analytics.engine";
import {
    buildAgentStatuses,
    buildDeliveryStatusSummary,
    buildSupportSlaSummary,
    computeAgentHealth,
    computeClientHealth,
} from "../engines/health-monitoring.engine";
import { buildRecommendations } from "../engines/recommendation.engine";
import { buildSystemAlerts, computeSystemHealth } from "../engines/system-monitor.engine";
import { publishAiCommandCenterEvent } from "../integrations/mission-core-bridge";
import {
    fetchBusinessSnapshot,
    fetchDeliverySnapshot,
    fetchGlobalOpsSnapshot,
    fetchProductionSnapshot,
    fetchSupportSnapshot,
} from "../integrations/platform-bridges";
import { aiCommandCenterRepository } from "../repository/ai-command-center-repository";
import type { AccContext, AccRecommendation, AiCommandCenterDashboard } from "../types";

export class AiCommandCenterService {
    private async getOrgId(ctx: AccContext): Promise<string | null> {
        if (ctx.organizationId) return ctx.organizationId;
        const resolved = await resolveOrganizationContext(ctx.authUserId, ctx.email, ctx.fullName);
        return resolved?.organizationId ?? null;
    }

    async getDashboard(ctx: AccContext): Promise<AiCommandCenterDashboard> {
        productionLog("info", "AI Command Center dashboard load", "ai-command-center");
        publishAiCommandCenterEvent("AiCommandCenterLoaded", { at: new Date().toISOString() });

        const [business, support, delivery, globalOps, production] = await Promise.all([
            fetchBusinessSnapshot(ctx),
            fetchSupportSnapshot(ctx),
            fetchDeliverySnapshot(ctx),
            fetchGlobalOpsSnapshot(ctx),
            fetchProductionSnapshot(ctx),
        ]);

        const deliveryHealth = globalOps.deliveryHealth || delivery.qualityPassRate;
        const systemHealth = computeSystemHealth({
            productionScore: production.overallScore,
            platformHealth: production.platformHealth,
            openAlerts: production.alerts,
            openErrors: support.incidents,
        });
        const clientHealth = computeClientHealth({
            globalOpsCustomerHealth: globalOps.customerHealth,
            activeClients: business.activeClients,
            openEscalations: globalOps.escalations,
        });
        const supportSla = buildSupportSlaSummary({
            openTickets: support.openTickets,
            slaCompliance: support.slaCompliance,
            supportHealth: Math.max(support.supportHealth, globalOps.supportHealth),
            incidents: support.incidents,
        });
        const deliveryStatus = buildDeliveryStatusSummary({
            activeEngagements: delivery.activeEngagements,
            qualityPassRate: delivery.qualityPassRate,
            deliveryHealth,
            pendingAi: delivery.pendingAi + business.pendingAi,
        });
        const revenue = buildRevenueSummary({
            activeClients: business.activeClients,
            openInvoices: business.openInvoices,
            renewalsDue: globalOps.renewalsDue,
            pipelineLeads: business.leads,
            mrrEstimate: globalOps.mrr || undefined,
        });

        const decisions = proposeDecisions({
            clientHealth,
            supportSla: support.slaCompliance,
            deliveryHealth,
            openInvoices: business.openInvoices,
            renewalsDue: globalOps.renewalsDue,
        });
        const recommendations = buildRecommendations({
            decisions,
            systemHealth,
            clientHealth,
            supportHealth: supportSla.supportHealth,
            deliveryHealth,
            pendingAi: deliveryStatus.pendingAi,
        });
        const automations = buildAutomations({
            openTickets: support.openTickets,
            renewalsDue: globalOps.renewalsDue,
            deliveryHealth,
            pendingAi: deliveryStatus.pendingAi,
        });
        const agents = buildAgentStatuses({
            systemHealth,
            pendingApprovals: recommendations.filter((r) => r.priority === "high" || r.priority === "critical").length,
        });
        const agentHealth = computeAgentHealth(agents);
        const alerts = buildSystemAlerts({
            systemHealth,
            openTickets: support.openTickets,
            deliveryHealth,
            productionAlerts: production.alerts,
        });

        const overallScore = computeOverallScore([
            systemHealth,
            clientHealth,
            supportSla.supportHealth,
            deliveryHealth,
            agentHealth,
        ]);

        const orgId = await this.getOrgId(ctx);
        if (orgId) {
            void aiCommandCenterRepository.logAudit(orgId, "dashboard_load", "AI Command Center dashboard loaded");
            void aiCommandCenterRepository.persistHealthSnapshot(orgId, {
                systemHealth,
                clientHealth,
                supportSla: support.slaCompliance,
                deliveryHealth,
                agentHealth,
                metadata: { overallScore },
            });
            for (const alert of alerts.slice(0, 3)) {
                void aiCommandCenterRepository.persistAlert(orgId, alert);
            }
            for (const rec of recommendations.slice(0, 5)) {
                void aiCommandCenterRepository.persistRecommendation(orgId, rec);
            }
            for (const decision of decisions.slice(0, 3)) {
                void aiCommandCenterRepository.persistDecision(orgId, decision);
            }
        }

        return {
            systemHealth,
            clientHealth,
            revenue,
            supportSla,
            deliveryStatus,
            agents,
            alerts,
            recommendations,
            decisions,
            automations,
            overallScore,
            fetchedAt: new Date().toISOString(),
        };
    }

    acceptRecommendation(recommendations: AccRecommendation[], id: string): AccRecommendation[] {
        productionLog("info", `Recommendation accepted: ${id}`, "ai-command-center");
        publishAiCommandCenterEvent("AiRecommendationAccepted", { recommendationId: id });
        return recommendations.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r));
    }

    dismissRecommendation(recommendations: AccRecommendation[], id: string): AccRecommendation[] {
        publishAiCommandCenterEvent("AiRecommendationDismissed", { recommendationId: id });
        return recommendations.map((r) => (r.id === id ? { ...r, status: "dismissed" as const } : r));
    }
}

export const aiCommandCenterService = new AiCommandCenterService();

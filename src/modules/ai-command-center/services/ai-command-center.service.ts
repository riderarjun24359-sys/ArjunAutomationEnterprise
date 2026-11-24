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
import type { AccContext, AiCommandCenterDashboard } from "../types";

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

        const deliveryHealth = globalOps.available ? globalOps.deliveryHealth : delivery.qualityPassRate;
        const integrationIssues = [
            business.available ? null : "Business Platform",
            support.available ? null : "Support",
            delivery.available ? null : "Delivery Engine",
            globalOps.available ? null : "Customer Success Global Operations",
            ...(globalOps.integrationIssues ?? []).map((item: string) => `Global Operations: ${item}`),
            production.available ? null : "Production Readiness",
        ].filter((item): item is string => Boolean(item));
        const customerHealthAvailable = !integrationIssues.some((item) => item.toLowerCase().includes("customer health"));
        const supportHealthAvailable = support.available && !integrationIssues.some((item) => item.toLowerCase().includes("support health"));
        const deliveryHealthAvailable = delivery.available && delivery.activeEngagements > 0 &&
            !integrationIssues.some((item) => item.toLowerCase().includes("delivery health"));
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
        });

        const decisions = proposeDecisions({
            clientHealth: customerHealthAvailable ? clientHealth : null,
            supportSla: supportHealthAvailable ? support.slaCompliance : null,
            deliveryHealth: deliveryHealthAvailable ? deliveryHealth : null,
            openInvoices: business.available ? business.openInvoices : null,
            renewalsDue: globalOps.available ? globalOps.renewalsDue : null,
        });
        const orgId = await this.getOrgId(ctx);
        const recommendations = buildRecommendations({
            organizationId: orgId,
            decisions,
            systemHealth: production.available ? systemHealth : null,
            clientHealth: customerHealthAvailable ? clientHealth : null,
            supportHealth: supportHealthAvailable ? supportSla.supportHealth : null,
            deliveryHealth: deliveryHealthAvailable ? deliveryHealth : null,
            pendingAi: business.available && delivery.available ? deliveryStatus.pendingAi : null,
        });
        const automations = buildAutomations({
            openTickets: support.available ? support.openTickets : null,
            renewalsDue: globalOps.available ? globalOps.renewalsDue : null,
            deliveryHealth: deliveryHealthAvailable ? deliveryHealth : null,
            pendingAi: business.available && delivery.available ? deliveryStatus.pendingAi : null,
        });
        const agents = buildAgentStatuses({
            systemHealth,
            pendingApprovals: recommendations.filter((r) => r.priority === "high" || r.priority === "critical").length,
        });
        const agentHealth = computeAgentHealth(agents);
        if (agents.every((agent) => agent.status === "unknown")) {
            integrationIssues.push("Agent heartbeats (not connected)");
        }
        const alerts = buildSystemAlerts({
            systemHealth: production.available ? systemHealth : null,
            openTickets: support.available ? support.openTickets : null,
            deliveryHealth: deliveryHealthAvailable ? deliveryHealth : null,
            productionAlerts: production.available ? production.alerts : null,
        });

        const overallScore = computeOverallScore([
            production.available ? systemHealth : null,
            customerHealthAvailable ? clientHealth : null,
            supportHealthAvailable ? supportSla.supportHealth : null,
            deliveryHealthAvailable ? deliveryHealth : null,
        ].filter((score): score is number => score !== null));

        if (orgId) {
            void aiCommandCenterRepository.logAudit(orgId, "dashboard_load", "AI Command Center dashboard loaded");
            if (integrationIssues.length === 0 && agents.some((agent) => agent.status !== "unknown")) {
                void aiCommandCenterRepository.persistHealthSnapshot(orgId, {
                    systemHealth,
                    clientHealth,
                    supportSla: support.slaCompliance,
                    deliveryHealth,
                    agentHealth,
                    metadata: { overallScore },
                });
            }
            for (const alert of alerts.slice(0, 3)) {
                void aiCommandCenterRepository.persistAlert(orgId, alert);
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
            integrationIssues,
            fetchedAt: new Date().toISOString(),
        };
    }


}

export const aiCommandCenterService = new AiCommandCenterService();

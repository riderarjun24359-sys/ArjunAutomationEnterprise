import { fetchDashboardOverview } from "@/src/modules/executive-command-center/integrations/dashboard-bridge";
import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import { fetchBusinessPlatformKnowledge } from "../integrations/business-platform-bridge";
import { fetchDeliveryEngineKnowledge } from "../integrations/delivery-engine-bridge";
import { fetchExecutiveIntelligenceKnowledge } from "../integrations/executive-intelligence-bridge";
import { fetchProductionReadinessKnowledge } from "../integrations/production-readiness-bridge";
import type { ExecutiveAiContext, SharedKnowledgeSnapshot } from "../types";

export async function buildSharedKnowledge(ctx: ExecutiveAiContext): Promise<SharedKnowledgeSnapshot> {
    const [overview, business, intel, delivery, readiness, knowledge] = await Promise.all([
        fetchDashboardOverview(ctx.authUserId, ctx.email, ctx.fullName),
        fetchBusinessPlatformKnowledge(ctx).catch(() => ({ leads: 0, clients: 0, pendingAi: 0 })),
        fetchExecutiveIntelligenceKnowledge(ctx).catch(() => ({ unifiedScore: 0, risks: 0, opportunities: 0, eipScore: 0, aixConfidence: 0, recommendations: 0 })),
        fetchDeliveryEngineKnowledge(ctx).catch(() => ({ activeEngagements: 0, qualityPassRate: 0, blueprintCount: 0, pendingAi: 0 })),
        fetchProductionReadinessKnowledge(ctx).catch(() => ({ overallScore: 0, alerts: 0, securityScore: 0, platformHealth: 0 })),
        deliveryEngineService.getKnowledgeEntries(ctx).catch(() => []),
    ]);

    return {
        organizationName: overview.organization?.name ?? "Enterprise workspace",
        businessPlatform: business,
        executiveIntelligence: { unifiedScore: intel.unifiedScore, risks: intel.risks, opportunities: intel.opportunities },
        deliveryEngine: { activeEngagements: delivery.activeEngagements, qualityPassRate: delivery.qualityPassRate },
        productionReadiness: { overallScore: readiness.overallScore, alerts: readiness.alerts },
        knowledgeEntries: knowledge.length,
        fetchedAt: new Date().toISOString(),
    };
}

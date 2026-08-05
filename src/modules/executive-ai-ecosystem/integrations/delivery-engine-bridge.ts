import { deliveryEngineService } from "@/src/modules/delivery-engine/services/delivery-engine-orchestrator.service";
import type { ExecutiveAiContext } from "../types";

export async function fetchDeliveryEngineKnowledge(ctx: ExecutiveAiContext) {
    const dash = await deliveryEngineService.getDashboard(ctx);
    return {
        activeEngagements: dash.activeEngagements,
        qualityPassRate: dash.qualityPassRate,
        blueprintCount: dash.blueprintCount,
        pendingAi: dash.pendingAiRecommendations,
    };
}

import { productionReadinessService } from "@/src/modules/production-readiness/services/production-readiness.service";
import type { ExecutiveAiContext } from "../types";

export async function fetchProductionReadinessKnowledge(ctx: ExecutiveAiContext) {
    const snapshot = await productionReadinessService.getSnapshot(ctx);
    return {
        overallScore: snapshot.ctoAudit.overallScore,
        alerts: snapshot.ctoAudit.systemAlerts.length,
        securityScore: snapshot.ctoAudit.securityStatus,
        platformHealth: snapshot.ctoAudit.platformHealth,
    };
}

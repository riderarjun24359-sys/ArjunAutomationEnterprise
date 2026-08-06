import { executiveCommandCenterService } from "@/src/modules/executive-command-center/services/executive-command-center.service";
import { fetchEipStats } from "@/src/modules/executive-command-center/integrations/eip-bridge";
import { fetchAixStats } from "@/src/modules/executive-command-center/integrations/aix-bridge";
import type { ExecutiveAiContext } from "../types";

export async function fetchExecutiveIntelligenceKnowledge(ctx: ExecutiveAiContext) {
    const [snapshot, eip, aix] = await Promise.all([
        executiveCommandCenterService.getSnapshot(ctx.authUserId, ctx.email, ctx.fullName),
        fetchEipStats(ctx.authUserId, ctx.email, ctx.fullName),
        fetchAixStats(ctx.authUserId, ctx.email, ctx.fullName),
    ]);
    return {
        unifiedScore: snapshot.unifiedScore,
        risks: snapshot.risks.length,
        opportunities: snapshot.opportunities.length,
        eipScore: eip.overallIntelligenceScore,
        aixConfidence: aix.avgAiConfidenceScore,
        recommendations: snapshot.recommendations.length,
    };
}

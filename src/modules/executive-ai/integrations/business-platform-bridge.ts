import { businessPlatformService } from "@/src/modules/business-platform/services/business-platform.service";
import type { ExecutiveAiContext } from "../types";

export async function fetchBusinessPlatformKnowledge(ctx: ExecutiveAiContext) {
    const dash = await businessPlatformService.getDashboard(ctx);
    return { leads: dash.leadsCount, clients: dash.activeClients, pendingAi: dash.pendingAiRecommendations };
}

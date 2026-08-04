import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import type { AiSdkExecuteInput, AiSdkExecuteResult, AiSdkRouteResult } from "@/src/modules/ai-orchestration/types";

/** All AI access routes through Mission Core shared AI service — no direct orchestration bypass. */
export class AiOrchestrationClient {
    private readonly missionCore = createMissionCoreClient();

    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async resolveRoute(strategy?: string): Promise<AiSdkRouteResult | null> {
        return this.missionCore.invokeSharedService("ai", "resolveRoute", [this.authUserId, this.email, strategy, this.fullName]) as Promise<AiSdkRouteResult | null>;
    }

    async executeTask(input: AiSdkExecuteInput): Promise<AiSdkExecuteResult> {
        return this.missionCore.invokeSharedService("ai", "executeTask", [this.authUserId, this.email, input, this.fullName]) as Promise<AiSdkExecuteResult>;
    }

    async getProviders() {
        const { aiOrchestrationService } = await import("@/src/modules/ai-orchestration/services/ai-orchestration.service");
        return aiOrchestrationService.getProviders(this.authUserId, this.email, this.fullName);
    }

    async getAgents() {
        const { aiOrchestrationService } = await import("@/src/modules/ai-orchestration/services/ai-orchestration.service");
        return aiOrchestrationService.getAgents(this.authUserId, this.email, this.fullName);
    }

    async getPromptTemplates() {
        const { aiOrchestrationService } = await import("@/src/modules/ai-orchestration/services/ai-orchestration.service");
        return aiOrchestrationService.getPromptTemplates(this.authUserId, this.email, this.fullName);
    }
}

export function createAiOrchestrationClient(authUserId: string, email: string, fullName?: string | null): AiOrchestrationClient {
    return new AiOrchestrationClient(authUserId, email, fullName);
}

export { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";

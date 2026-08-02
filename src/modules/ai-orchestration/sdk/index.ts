import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import type { AiSdkExecuteInput, AiSdkExecuteResult, AiSdkRouteResult } from "@/src/modules/ai-orchestration/types";

export class AiOrchestrationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async resolveRoute(strategy?: string): Promise<AiSdkRouteResult | null> {
        return aiOrchestrationService.resolveRoute(this.authUserId, this.email, strategy, this.fullName);
    }

    async executeTask(input: AiSdkExecuteInput): Promise<AiSdkExecuteResult> {
        return aiOrchestrationService.executeTask(this.authUserId, this.email, input, this.fullName);
    }

    async getProviders() {
        return aiOrchestrationService.getProviders(this.authUserId, this.email, this.fullName);
    }

    async getAgents() {
        return aiOrchestrationService.getAgents(this.authUserId, this.email, this.fullName);
    }

    async getPromptTemplates() {
        return aiOrchestrationService.getPromptTemplates(this.authUserId, this.email, this.fullName);
    }
}

export function createAiOrchestrationClient(authUserId: string, email: string, fullName?: string | null): AiOrchestrationClient {
    return new AiOrchestrationClient(authUserId, email, fullName);
}

export { aiOrchestrationService };

import { executiveIntelligenceService } from "@/src/modules/executive-intelligence/services/executive-intelligence.service";
import type { AixSdkGenerateBriefInput, AixSdkGenerateRecommendationInput, AixSdkTriggerReasoningInput } from "@/src/modules/executive-intelligence/types";

export class ExecutiveIntelligenceClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async generateBrief(input: AixSdkGenerateBriefInput) {
        return executiveIntelligenceService.sdkGenerateBrief(this.authUserId, this.email, input, this.fullName);
    }

    async generateRecommendation(input: AixSdkGenerateRecommendationInput) {
        return executiveIntelligenceService.sdkGenerateRecommendation(this.authUserId, this.email, input, this.fullName);
    }

    async triggerReasoning(input: AixSdkTriggerReasoningInput) {
        return executiveIntelligenceService.sdkTriggerReasoning(this.authUserId, this.email, input, this.fullName);
    }

    async getIntelligenceHubs() {
        return executiveIntelligenceService.getIntelligenceHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return executiveIntelligenceService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return executiveIntelligenceService.getPipelineInfo();
    }
}

export function createExecutiveIntelligenceClient(authUserId: string, email: string, fullName?: string | null): ExecutiveIntelligenceClient {
    return new ExecutiveIntelligenceClient(authUserId, email, fullName);
}

export { executiveIntelligenceService };

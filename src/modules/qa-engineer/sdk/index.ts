import { qaEngineerService } from "@/src/modules/qa-engineer/services/qa-engineer.service";
import type { QaSdkGenerateArtifactInput, QaSdkRunAnalysisInput, QaSdkStartEngagementInput } from "@/src/modules/qa-engineer/types";

export class QaEngineerClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: QaSdkStartEngagementInput) {
        return qaEngineerService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: QaSdkGenerateArtifactInput) {
        return qaEngineerService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: QaSdkRunAnalysisInput) {
        return qaEngineerService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return qaEngineerService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getTestStrategies() {
        return qaEngineerService.getTestStrategies(this.authUserId, this.email, this.fullName);
    }

    async getReleaseReadiness() {
        return qaEngineerService.getReleaseReadiness(this.authUserId, this.email, this.fullName);
    }

    async getCoverageAnalytics() {
        return qaEngineerService.getCoverageAnalytics(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return qaEngineerService.getPipelineInfo();
    }
}

export function createQaEngineerClient(authUserId: string, email: string, fullName?: string | null): QaEngineerClient {
    return new QaEngineerClient(authUserId, email, fullName);
}

export { qaEngineerService };

import { businessAnalystService } from "@/src/modules/business-analyst/services/business-analyst.service";
import type { BaSdkGenerateArtifactInput, BaSdkRunAnalysisInput, BaSdkStartEngagementInput } from "@/src/modules/business-analyst/types";

export class BusinessAnalystClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: BaSdkStartEngagementInput) {
        return businessAnalystService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: BaSdkGenerateArtifactInput) {
        return businessAnalystService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: BaSdkRunAnalysisInput) {
        return businessAnalystService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return businessAnalystService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getBrds() {
        return businessAnalystService.getBrds(this.authUserId, this.email, this.fullName);
    }

    async getUserStories() {
        return businessAnalystService.getUserStories(this.authUserId, this.email, this.fullName);
    }

    async getProposals() {
        return businessAnalystService.getProposals(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return businessAnalystService.getPipelineInfo();
    }
}

export function createBusinessAnalystClient(authUserId: string, email: string, fullName?: string | null): BusinessAnalystClient {
    return new BusinessAnalystClient(authUserId, email, fullName);
}

export { businessAnalystService };

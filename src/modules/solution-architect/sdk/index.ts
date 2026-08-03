import { solutionArchitectService } from "@/src/modules/solution-architect/services/solution-architect.service";
import type { SaSdkGenerateArtifactInput, SaSdkRunAnalysisInput, SaSdkStartEngagementInput } from "@/src/modules/solution-architect/types";

export class SolutionArchitectClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: SaSdkStartEngagementInput) {
        return solutionArchitectService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: SaSdkGenerateArtifactInput) {
        return solutionArchitectService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: SaSdkRunAnalysisInput) {
        return solutionArchitectService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return solutionArchitectService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getSolutionArchitectures() {
        return solutionArchitectService.getSolutionArchitectures(this.authUserId, this.email, this.fullName);
    }

    async getApiContracts() {
        return solutionArchitectService.getApiContracts(this.authUserId, this.email, this.fullName);
    }

    async getTechnologyDecisions() {
        return solutionArchitectService.getTechnologyDecisions(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return solutionArchitectService.getPipelineInfo();
    }
}

export function createSolutionArchitectClient(authUserId: string, email: string, fullName?: string | null): SolutionArchitectClient {
    return new SolutionArchitectClient(authUserId, email, fullName);
}

export { solutionArchitectService };

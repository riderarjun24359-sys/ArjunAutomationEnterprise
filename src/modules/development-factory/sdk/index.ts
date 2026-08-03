import { developmentFactoryService } from "@/src/modules/development-factory/services/development-factory.service";
import type { DfSdkGenerateArtifactInput, DfSdkRunAnalysisInput, DfSdkStartEngagementInput } from "@/src/modules/development-factory/types";

export class DevelopmentFactoryClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: DfSdkStartEngagementInput) {
        return developmentFactoryService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: DfSdkGenerateArtifactInput) {
        return developmentFactoryService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: DfSdkRunAnalysisInput) {
        return developmentFactoryService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return developmentFactoryService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getWorkPackages() {
        return developmentFactoryService.getWorkPackages(this.authUserId, this.email, this.fullName);
    }

    async getApiScaffolds() {
        return developmentFactoryService.getApiScaffolds(this.authUserId, this.email, this.fullName);
    }

    async getComponents() {
        return developmentFactoryService.getComponents(this.authUserId, this.email, this.fullName);
    }

    async getTechnicalDocs() {
        return developmentFactoryService.getTechnicalDocs(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return developmentFactoryService.getPipelineInfo();
    }
}

export function createDevelopmentFactoryClient(authUserId: string, email: string, fullName?: string | null): DevelopmentFactoryClient {
    return new DevelopmentFactoryClient(authUserId, email, fullName);
}

export { developmentFactoryService };

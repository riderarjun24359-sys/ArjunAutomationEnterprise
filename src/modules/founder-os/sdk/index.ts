import { founderOsService } from "@/src/modules/founder-os/services/founder-os.service";
import type { FoSdkGenerateArtifactInput, FoSdkRunAnalysisInput, FoSdkStartWorkspaceInput } from "@/src/modules/founder-os/types";

export class FounderOsClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startWorkspace(input: FoSdkStartWorkspaceInput) {
        return founderOsService.sdkStartWorkspace(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: FoSdkGenerateArtifactInput) {
        return founderOsService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: FoSdkRunAnalysisInput) {
        return founderOsService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getWorkspaces() {
        return founderOsService.getWorkspaces(this.authUserId, this.email, this.fullName);
    }

    async getStrategicOkrs() {
        return founderOsService.getStrategicOkrs(this.authUserId, this.email, this.fullName);
    }

    async getBoardReports() {
        return founderOsService.getBoardReports(this.authUserId, this.email, this.fullName);
    }

    async getFounderInsights() {
        return founderOsService.getFounderInsights(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return founderOsService.getPipelineInfo();
    }
}

export function createFounderOsClient(authUserId: string, email: string, fullName?: string | null): FounderOsClient {
    return new FounderOsClient(authUserId, email, fullName);
}

export { founderOsService };

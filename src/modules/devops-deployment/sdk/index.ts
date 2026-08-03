import { devopsDeploymentService } from "@/src/modules/devops-deployment/services/devops-deployment.service";
import type { DdSdkGenerateArtifactInput, DdSdkRunAnalysisInput, DdSdkStartEngagementInput } from "@/src/modules/devops-deployment/types";

export class DevopsDeploymentClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: DdSdkStartEngagementInput) {
        return devopsDeploymentService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: DdSdkGenerateArtifactInput) {
        return devopsDeploymentService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: DdSdkRunAnalysisInput) {
        return devopsDeploymentService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return devopsDeploymentService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getCicdPipelines() {
        return devopsDeploymentService.getCicdPipelines(this.authUserId, this.email, this.fullName);
    }

    async getReleaseOrchestrations() {
        return devopsDeploymentService.getReleaseOrchestrations(this.authUserId, this.email, this.fullName);
    }

    async getReleaseVersions() {
        return devopsDeploymentService.getReleaseVersions(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return devopsDeploymentService.getPipelineInfo();
    }
}

export function createDevopsDeploymentClient(authUserId: string, email: string, fullName?: string | null): DevopsDeploymentClient {
    return new DevopsDeploymentClient(authUserId, email, fullName);
}

export { devopsDeploymentService };

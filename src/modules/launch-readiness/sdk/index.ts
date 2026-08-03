import { launchReadinessService } from "@/src/modules/launch-readiness/services/launch-readiness.service";
import type { ElrSdkValidateEnvironmentInput, ElrSdkRunDeploymentCheckInput, ElrSdkRunRecoveryDrillInput } from "@/src/modules/launch-readiness/types";

export class LaunchReadinessClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async validateEnvironment(input: ElrSdkValidateEnvironmentInput) {
        return launchReadinessService.sdkValidateEnvironment(this.authUserId, this.email, input, this.fullName);
    }

    async runDeploymentCheck(input: ElrSdkRunDeploymentCheckInput) {
        return launchReadinessService.sdkRunDeploymentCheck(this.authUserId, this.email, input, this.fullName);
    }

    async runRecoveryDrill(input: ElrSdkRunRecoveryDrillInput) {
        return launchReadinessService.sdkRunRecoveryDrill(this.authUserId, this.email, input, this.fullName);
    }

    async getReadinessHubs() {
        return launchReadinessService.getReadinessHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return launchReadinessService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return launchReadinessService.getPipelineInfo();
    }
}

export function createLaunchReadinessClient(authUserId: string, email: string, fullName?: string | null): LaunchReadinessClient {
    return new LaunchReadinessClient(authUserId, email, fullName);
}

export { launchReadinessService };

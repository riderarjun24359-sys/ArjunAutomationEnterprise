import { customerOperatedPlatformService } from "@/src/modules/customer-operated-platform/services/customer-operated-platform.service";
import type { CopSdkLaunchOnboardingInput, CopSdkDeployProductionInput, CopSdkMonitorPlatformInput } from "@/src/modules/customer-operated-platform/types";

export class CustomerOperatedPlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async launchOnboarding(input: CopSdkLaunchOnboardingInput) {
        return customerOperatedPlatformService.sdkLaunchOnboarding(this.authUserId, this.email, input, this.fullName);
    }

    async deployProduction(input: CopSdkDeployProductionInput) {
        return customerOperatedPlatformService.sdkDeployProduction(this.authUserId, this.email, input, this.fullName);
    }

    async monitorPlatform(input: CopSdkMonitorPlatformInput) {
        return customerOperatedPlatformService.sdkMonitorPlatform(this.authUserId, this.email, input, this.fullName);
    }

    async getOperatedHubs() {
        return customerOperatedPlatformService.getOperatedHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return customerOperatedPlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return customerOperatedPlatformService.getPipelineInfo();
    }
}

export function createCustomerOperatedPlatformClient(authUserId: string, email: string, fullName?: string | null): CustomerOperatedPlatformClient {
    return new CustomerOperatedPlatformClient(authUserId, email, fullName);
}

export { customerOperatedPlatformService };

import { launchFoundationService } from "@/src/modules/launch-foundation/services/launch-foundation.service";
import type {
    ElfSdkProvisionOrganizationInput,
    ElfSdkConfigureWizardProfileInput,
    ElfSdkRunGoLiveWorkflowInput,
} from "@/src/modules/launch-foundation/types";

export class LaunchFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async provisionOrganization(input: ElfSdkProvisionOrganizationInput) {
        return launchFoundationService.sdkProvisionOrganization(this.authUserId, this.email, input, this.fullName);
    }

    async configureWizardProfile(input: ElfSdkConfigureWizardProfileInput) {
        return launchFoundationService.sdkConfigureWizardProfile(this.authUserId, this.email, input, this.fullName);
    }

    async runGoLiveWorkflow(input: ElfSdkRunGoLiveWorkflowInput) {
        return launchFoundationService.sdkRunGoLiveWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getLaunchHubs() {
        return launchFoundationService.getLaunchHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return launchFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return launchFoundationService.getPipelineInfo();
    }
}

export function createLaunchFoundationClient(authUserId: string, email: string, fullName?: string | null): LaunchFoundationClient {
    return new LaunchFoundationClient(authUserId, email, fullName);
}

export { launchFoundationService };

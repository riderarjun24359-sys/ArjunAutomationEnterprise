import { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
import type { IntgSdkConnectServiceInput, IntgSdkIssueApiKeyInput, IntgSdkRegisterWebhookInput } from "@/src/modules/integration-platform/types";

export class IntegrationPlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async connectService(input: IntgSdkConnectServiceInput) {
        return integrationPlatformService.sdkConnectService(this.authUserId, this.email, input, this.fullName);
    }

    async issueApiKey(input: IntgSdkIssueApiKeyInput) {
        return integrationPlatformService.sdkIssueApiKey(this.authUserId, this.email, input, this.fullName);
    }

    async registerWebhook(input: IntgSdkRegisterWebhookInput) {
        return integrationPlatformService.sdkRegisterWebhook(this.authUserId, this.email, input, this.fullName);
    }

    async getIntegrationHubs() {
        return integrationPlatformService.getIntegrationHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return integrationPlatformService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return integrationPlatformService.getPipelineInfo();
    }
}

export function createIntegrationPlatformClient(authUserId: string, email: string, fullName?: string | null): IntegrationPlatformClient {
    return new IntegrationPlatformClient(authUserId, email, fullName);
}

export { integrationPlatformService };

import { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
import type { IntgSdkConnectServiceInput, IntgSdkIssueApiKeyInput, IntgSdkIssueApiKeyResult, IntgSdkRegisterWebhookInput } from "@/src/modules/integration-platform/types";

export class IntegrationPlatformClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async connectService(input: IntgSdkConnectServiceInput) {
        return integrationPlatformService.sdkConnectService(this.authUserId, this.email, input, this.fullName);
    }

    async issueApiKey(input: IntgSdkIssueApiKeyInput): Promise<IntgSdkIssueApiKeyResult> {
        if (typeof window === "undefined") {
            throw new Error("API key issuance must be initiated from an authenticated browser session.");
        }
        const response = await fetch("/api/integration-platform/api-keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });
        const result = await response.json().catch(() => null) as {
            key?: { id: string; key_name: string; status: string };
            token?: string;
            error?: string;
        } | null;
        if (!response.ok || !result?.key || !result.token) {
            throw new Error(result?.error ?? "Unable to issue API key");
        }
        return {
            apiKeyId: result.key.id,
            keyName: result.key.key_name,
            status: result.key.status,
            token: result.token,
        };
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

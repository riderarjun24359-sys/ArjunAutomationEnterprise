import { communicationHubService } from "@/src/modules/communication-hub/services/communication-hub.service";
import type { CnhSdkLaunchCampaignInput, CnhSdkSendNotificationInput, CnhSdkUpdatePreferencesInput } from "@/src/modules/communication-hub/types";

export class CommunicationHubClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async sendNotification(input: CnhSdkSendNotificationInput) {
        return communicationHubService.sdkSendNotification(this.authUserId, this.email, input, this.fullName);
    }

    async launchCampaign(input: CnhSdkLaunchCampaignInput) {
        return communicationHubService.sdkLaunchCampaign(this.authUserId, this.email, input, this.fullName);
    }

    async updatePreferences(input: CnhSdkUpdatePreferencesInput) {
        return communicationHubService.sdkUpdatePreferences(this.authUserId, this.email, input, this.fullName);
    }

    async getCommunicationHubs() {
        return communicationHubService.getCommunicationHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return communicationHubService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return communicationHubService.getPipelineInfo();
    }
}

export function createCommunicationHubClient(authUserId: string, email: string, fullName?: string | null): CommunicationHubClient {
    return new CommunicationHubClient(authUserId, email, fullName);
}

export { communicationHubService };

import { commercialSaasService } from "@/src/modules/commercial-saas/services/commercial-saas.service";
import type { SaasSdkManageSubscriptionInput, SaasSdkRegisterTenantInput, SaasSdkTrackUsageInput } from "@/src/modules/commercial-saas/types";

export class CommercialSaasClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerTenant(input: SaasSdkRegisterTenantInput) {
        return commercialSaasService.sdkRegisterTenant(this.authUserId, this.email, input, this.fullName);
    }

    async manageSubscription(input: SaasSdkManageSubscriptionInput) {
        return commercialSaasService.sdkManageSubscription(this.authUserId, this.email, input, this.fullName);
    }

    async trackUsage(input: SaasSdkTrackUsageInput) {
        return commercialSaasService.sdkTrackUsage(this.authUserId, this.email, input, this.fullName);
    }

    async getTenants() {
        return commercialSaasService.getTenants(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return commercialSaasService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return commercialSaasService.getPipelineInfo();
    }
}

export function createCommercialSaasClient(authUserId: string, email: string, fullName?: string | null): CommercialSaasClient {
    return new CommercialSaasClient(authUserId, email, fullName);
}

export { commercialSaasService };

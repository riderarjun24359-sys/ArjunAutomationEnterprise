import { tenantLifecycleOpsService } from "@/src/modules/tenant-lifecycle-ops/services/tenant-lifecycle-ops.service";
import type { TloSdkInstallIndustryPackInput, TloSdkProvisionTenantInput, TloSdkTransitionLifecycleInput } from "@/src/modules/tenant-lifecycle-ops/types";

export class TenantLifecycleOpsClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async provisionTenant(input: TloSdkProvisionTenantInput) {
        return tenantLifecycleOpsService.sdkProvisionTenant(this.authUserId, this.email, input, this.fullName);
    }

    async transitionLifecycle(input: TloSdkTransitionLifecycleInput) {
        return tenantLifecycleOpsService.sdkTransitionLifecycle(this.authUserId, this.email, input, this.fullName);
    }

    async installIndustryPack(input: TloSdkInstallIndustryPackInput) {
        return tenantLifecycleOpsService.sdkInstallIndustryPack(this.authUserId, this.email, input, this.fullName);
    }

    async getTenantContexts() {
        return tenantLifecycleOpsService.getTenantContexts(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return tenantLifecycleOpsService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return tenantLifecycleOpsService.getPipelineInfo();
    }
}

export function createTenantLifecycleOpsClient(authUserId: string, email: string, fullName?: string | null): TenantLifecycleOpsClient {
    return new TenantLifecycleOpsClient(authUserId, email, fullName);
}

export { tenantLifecycleOpsService };

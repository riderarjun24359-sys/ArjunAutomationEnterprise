import { retailService } from "@/src/modules/retail/services/retail.service";
import type {
    RtlSdkRegisterRetailBrandInput,
    RtlSdkConfigureCustomerProfileInput,
    RtlSdkRunSalesOrderWorkflowInput,
} from "@/src/modules/retail/types";

export class RetailClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerRetailBrand(input: RtlSdkRegisterRetailBrandInput) {
        return retailService.sdkRegisterRetailBrand(this.authUserId, this.email, input, this.fullName);
    }

    async configureCustomerProfile(input: RtlSdkConfigureCustomerProfileInput) {
        return retailService.sdkConfigureCustomerProfile(this.authUserId, this.email, input, this.fullName);
    }

    async runSalesOrderWorkflow(input: RtlSdkRunSalesOrderWorkflowInput) {
        return retailService.sdkRunSalesOrderWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getRetailHubs() {
        return retailService.getRetailHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return retailService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return retailService.getPipelineInfo();
    }
}

export function createRetailClient(authUserId: string, email: string, fullName?: string | null): RetailClient {
    return new RetailClient(authUserId, email, fullName);
}

export { retailService };

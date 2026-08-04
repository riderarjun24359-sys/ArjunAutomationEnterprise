import { customerSuccessDeliveryService } from "@/src/modules/customer-success-delivery/services/customer-success-delivery.service";
import type { CsdSdkTrackCustomerHealthInput, CsdSdkOpenSupportTicketInput, CsdSdkRunDeliveryWorkflowInput } from "@/src/modules/customer-success-delivery/types";

export class CustomerSuccessDeliveryClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async trackCustomerHealth(input: CsdSdkTrackCustomerHealthInput) {
        return customerSuccessDeliveryService.sdkTrackCustomerHealth(this.authUserId, this.email, input, this.fullName);
    }

    async openSupportTicket(input: CsdSdkOpenSupportTicketInput) {
        return customerSuccessDeliveryService.sdkOpenSupportTicket(this.authUserId, this.email, input, this.fullName);
    }

    async runDeliveryWorkflow(input: CsdSdkRunDeliveryWorkflowInput) {
        return customerSuccessDeliveryService.sdkRunDeliveryWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async getDeliveryHubs() {
        return customerSuccessDeliveryService.getDeliveryHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return customerSuccessDeliveryService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return customerSuccessDeliveryService.getPipelineInfo();
    }
}

export function createCustomerSuccessDeliveryClient(authUserId: string, email: string, fullName?: string | null): CustomerSuccessDeliveryClient {
    return new CustomerSuccessDeliveryClient(authUserId, email, fullName);
}

export { customerSuccessDeliveryService };

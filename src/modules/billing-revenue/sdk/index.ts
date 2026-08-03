import { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
import type { BrvSdkGenerateInvoiceInput, BrvSdkProcessPaymentInput, BrvSdkRecognizeRevenueInput } from "@/src/modules/billing-revenue/types";

export class BillingRevenueClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async generateInvoice(input: BrvSdkGenerateInvoiceInput) {
        return billingRevenueService.sdkGenerateInvoice(this.authUserId, this.email, input, this.fullName);
    }

    async processPayment(input: BrvSdkProcessPaymentInput) {
        return billingRevenueService.sdkProcessPayment(this.authUserId, this.email, input, this.fullName);
    }

    async recognizeRevenue(input: BrvSdkRecognizeRevenueInput) {
        return billingRevenueService.sdkRecognizeRevenue(this.authUserId, this.email, input, this.fullName);
    }

    async getBillingAccounts() {
        return billingRevenueService.getBillingAccounts(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return billingRevenueService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return billingRevenueService.getPipelineInfo();
    }
}

export function createBillingRevenueClient(authUserId: string, email: string, fullName?: string | null): BillingRevenueClient {
    return new BillingRevenueClient(authUserId, email, fullName);
}

export { billingRevenueService };

import { customerSuccessService } from "@/src/modules/customer-success/services/customer-success.service";
import type { CsSdkGenerateArtifactInput, CsSdkRunAnalysisInput, CsSdkStartEngagementInput } from "@/src/modules/customer-success/types";

export class CustomerSuccessClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startEngagement(input: CsSdkStartEngagementInput) {
        return customerSuccessService.sdkStartEngagement(this.authUserId, this.email, input, this.fullName);
    }

    async generateArtifact(input: CsSdkGenerateArtifactInput) {
        return customerSuccessService.sdkGenerateArtifact(this.authUserId, this.email, input, this.fullName);
    }

    async runAnalysis(input: CsSdkRunAnalysisInput) {
        return customerSuccessService.sdkRunAnalysis(this.authUserId, this.email, input, this.fullName);
    }

    async getEngagements() {
        return customerSuccessService.getEngagements(this.authUserId, this.email, this.fullName);
    }

    async getHealthScores() {
        return customerSuccessService.getHealthScores(this.authUserId, this.email, this.fullName);
    }

    async getQbrReports() {
        return customerSuccessService.getQbrReports(this.authUserId, this.email, this.fullName);
    }

    async getExecutiveSummaries() {
        return customerSuccessService.getExecutiveSummaries(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return customerSuccessService.getPipelineInfo();
    }
}

export function createCustomerSuccessClient(authUserId: string, email: string, fullName?: string | null): CustomerSuccessClient {
    return new CustomerSuccessClient(authUserId, email, fullName);
}

export { customerSuccessService };

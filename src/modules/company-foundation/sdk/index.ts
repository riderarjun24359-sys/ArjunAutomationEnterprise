import { companyFoundationService } from "@/src/modules/company-foundation/services/company-foundation.service";
import type {
    CmpSdkConfigureBrandProfileInput,
    CmpSdkPublishWebsitePageInput,
    CmpSdkGenerateProposalInput,
} from "@/src/modules/company-foundation/types";

export class CompanyFoundationClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async configureBrandProfile(input: CmpSdkConfigureBrandProfileInput) {
        return companyFoundationService.sdkConfigureBrandProfile(this.authUserId, this.email, input, this.fullName);
    }

    async publishWebsitePage(input: CmpSdkPublishWebsitePageInput) {
        return companyFoundationService.sdkPublishWebsitePage(this.authUserId, this.email, input, this.fullName);
    }

    async generateProposal(input: CmpSdkGenerateProposalInput) {
        return companyFoundationService.sdkGenerateProposal(this.authUserId, this.email, input, this.fullName);
    }

    async getCompanyHubs() {
        return companyFoundationService.getCompanyHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return companyFoundationService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return companyFoundationService.getPipelineInfo();
    }
}

export function createCompanyFoundationClient(authUserId: string, email: string, fullName?: string | null): CompanyFoundationClient {
    return new CompanyFoundationClient(authUserId, email, fullName);
}

export { companyFoundationService };

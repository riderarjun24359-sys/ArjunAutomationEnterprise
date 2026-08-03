import { industryFrameworkService } from "@/src/modules/industry-framework/services/industry-framework.service";
import type { IfrSdkRegisterIndustryInput, IfrSdkConfigureTemplateInput, IfrSdkRunCompatibilityCheckInput } from "@/src/modules/industry-framework/types";

export class IndustryFrameworkClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerIndustry(input: IfrSdkRegisterIndustryInput) {
        return industryFrameworkService.sdkRegisterIndustry(this.authUserId, this.email, input, this.fullName);
    }

    async configureTemplate(input: IfrSdkConfigureTemplateInput) {
        return industryFrameworkService.sdkConfigureTemplate(this.authUserId, this.email, input, this.fullName);
    }

    async runCompatibilityCheck(input: IfrSdkRunCompatibilityCheckInput) {
        return industryFrameworkService.sdkRunCompatibilityCheck(this.authUserId, this.email, input, this.fullName);
    }

    async getFrameworkHubs() {
        return industryFrameworkService.getFrameworkHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return industryFrameworkService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return industryFrameworkService.getPipelineInfo();
    }
}

export function createIndustryFrameworkClient(authUserId: string, email: string, fullName?: string | null): IndustryFrameworkClient {
    return new IndustryFrameworkClient(authUserId, email, fullName);
}

export { industryFrameworkService };

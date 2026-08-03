import { businessProcessService } from "@/src/modules/business-process/services/business-process.service";
import type { BpfSdkRegisterProcessInput, BpfSdkConfigureApprovalInput, BpfSdkRunProcessExecutionInput } from "@/src/modules/business-process/types";

export class BusinessProcessClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerProcess(input: BpfSdkRegisterProcessInput) {
        return businessProcessService.sdkRegisterProcess(this.authUserId, this.email, input, this.fullName);
    }

    async configureApproval(input: BpfSdkConfigureApprovalInput) {
        return businessProcessService.sdkConfigureApproval(this.authUserId, this.email, input, this.fullName);
    }

    async runProcessExecution(input: BpfSdkRunProcessExecutionInput) {
        return businessProcessService.sdkRunProcessExecution(this.authUserId, this.email, input, this.fullName);
    }

    async getProcessHubs() {
        return businessProcessService.getProcessHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return businessProcessService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return businessProcessService.getPipelineInfo();
    }
}

export function createBusinessProcessClient(authUserId: string, email: string, fullName?: string | null): BusinessProcessClient {
    return new BusinessProcessClient(authUserId, email, fullName);
}

export { businessProcessService };

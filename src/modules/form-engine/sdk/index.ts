import { formEngineService } from "@/src/modules/form-engine/services/form-engine.service";
import type { DfeSdkRegisterFormInput, DfeSdkConfigureValidationInput, DfeSdkRunFormSubmissionInput } from "@/src/modules/form-engine/types";

export class FormEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerForm(input: DfeSdkRegisterFormInput) {
        return formEngineService.sdkRegisterForm(this.authUserId, this.email, input, this.fullName);
    }

    async configureValidation(input: DfeSdkConfigureValidationInput) {
        return formEngineService.sdkConfigureValidation(this.authUserId, this.email, input, this.fullName);
    }

    async runFormSubmission(input: DfeSdkRunFormSubmissionInput) {
        return formEngineService.sdkRunFormSubmission(this.authUserId, this.email, input, this.fullName);
    }

    async getFormHubs() {
        return formEngineService.getFormHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return formEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return formEngineService.getPipelineInfo();
    }
}

export function createFormEngineClient(authUserId: string, email: string, fullName?: string | null): FormEngineClient {
    return new FormEngineClient(authUserId, email, fullName);
}

export { formEngineService };

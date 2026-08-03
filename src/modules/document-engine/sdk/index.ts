import { documentEngineService } from "@/src/modules/document-engine/services/document-engine.service";
import type { DdeSdkRegisterDocumentInput, DdeSdkConfigureTemplateInput, DdeSdkRunDocumentGenerationInput } from "@/src/modules/document-engine/types";

export class DocumentEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerDocument(input: DdeSdkRegisterDocumentInput) {
        return documentEngineService.sdkRegisterDocument(this.authUserId, this.email, input, this.fullName);
    }

    async configureTemplate(input: DdeSdkConfigureTemplateInput) {
        return documentEngineService.sdkConfigureTemplate(this.authUserId, this.email, input, this.fullName);
    }

    async runDocumentGeneration(input: DdeSdkRunDocumentGenerationInput) {
        return documentEngineService.sdkRunDocumentGeneration(this.authUserId, this.email, input, this.fullName);
    }

    async getDocumentHubs() {
        return documentEngineService.getDocumentHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return documentEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return documentEngineService.getPipelineInfo();
    }
}

export function createDocumentEngineClient(authUserId: string, email: string, fullName?: string | null): DocumentEngineClient {
    return new DocumentEngineClient(authUserId, email, fullName);
}

export { documentEngineService };

import { autonomousCompanyService } from "@/src/modules/autonomous-company/services/autonomous-company.service";
import type { AcSdkOrchestrateWorkflowInput, AcSdkRunCollaborationInput, AcSdkStartContextInput } from "@/src/modules/autonomous-company/types";

export class AutonomousCompanyClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async startContext(input: AcSdkStartContextInput) {
        return autonomousCompanyService.sdkStartContext(this.authUserId, this.email, input, this.fullName);
    }

    async orchestrateWorkflow(input: AcSdkOrchestrateWorkflowInput) {
        return autonomousCompanyService.sdkOrchestrateWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async runCollaboration(input: AcSdkRunCollaborationInput) {
        return autonomousCompanyService.sdkRunCollaboration(this.authUserId, this.email, input, this.fullName);
    }

    async getCompanyContexts() {
        return autonomousCompanyService.getCompanyContexts(this.authUserId, this.email, this.fullName);
    }

    async getWorkflowOrchestrations() {
        return autonomousCompanyService.getWorkflowOrchestrations(this.authUserId, this.email, this.fullName);
    }

    async getWorkerCollaborations() {
        return autonomousCompanyService.getWorkerCollaborations(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return autonomousCompanyService.getPipelineInfo();
    }
}

export function createAutonomousCompanyClient(authUserId: string, email: string, fullName?: string | null): AutonomousCompanyClient {
    return new AutonomousCompanyClient(authUserId, email, fullName);
}

export { autonomousCompanyService };

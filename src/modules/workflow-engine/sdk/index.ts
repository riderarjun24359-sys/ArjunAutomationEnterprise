import { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
import type { DweSdkRegisterWorkflowInput, DweSdkConfigureAutomationInput, DweSdkRunWorkflowExecutionInput } from "@/src/modules/workflow-engine/types";

export class WorkflowEngineClient {
    constructor(
        private readonly authUserId: string,
        private readonly email: string,
        private readonly fullName?: string | null,
    ) {}

    async registerWorkflow(input: DweSdkRegisterWorkflowInput) {
        return workflowEngineService.sdkRegisterWorkflow(this.authUserId, this.email, input, this.fullName);
    }

    async configureAutomation(input: DweSdkConfigureAutomationInput) {
        return workflowEngineService.sdkConfigureAutomation(this.authUserId, this.email, input, this.fullName);
    }

    async runWorkflowExecution(input: DweSdkRunWorkflowExecutionInput) {
        return workflowEngineService.sdkRunWorkflowExecution(this.authUserId, this.email, input, this.fullName);
    }

    async getWorkflowHubs() {
        return workflowEngineService.getWorkflowHubs(this.authUserId, this.email, this.fullName);
    }

    async getDashboardStats() {
        return workflowEngineService.getDashboardStats(this.authUserId, this.email, this.fullName);
    }

    async getPipelineInfo() {
        return workflowEngineService.getPipelineInfo();
    }
}

export function createWorkflowEngineClient(authUserId: string, email: string, fullName?: string | null): WorkflowEngineClient {
    return new WorkflowEngineClient(authUserId, email, fullName);
}

export { workflowEngineService };

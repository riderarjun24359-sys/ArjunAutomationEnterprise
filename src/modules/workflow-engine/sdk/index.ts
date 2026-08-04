import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import { workflowEngineService } from "@/src/modules/workflow-engine/services/workflow-engine.service";
import type { DweSdkRegisterWorkflowInput, DweSdkConfigureAutomationInput, DweSdkRunWorkflowExecutionInput } from "@/src/modules/workflow-engine/types";

/** Workflow execution routes through Mission Core — DWE remains data layer only. */
export class WorkflowEngineClient {
    private readonly missionCore = createMissionCoreClient();

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
        const result = this.missionCore.executeWorkflow({
            capabilityId: "workflowEngine",
            workflowName: input.executionName ?? input.executionKey ?? "run-execution",
            payload: {
                workflowHubId: input.workflowHubId,
                executionKey: input.executionKey,
                authUserId: this.authUserId,
                email: this.email,
                fullName: this.fullName,
            },
        });
        return {
            executionId: result.id,
            executionKey: input.executionKey ?? result.id,
            status: result.status,
        };
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

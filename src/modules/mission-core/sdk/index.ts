import { missionCoreService } from "../services/mission-core.service";
import type {
    CapabilityRegistration,
    CapabilityStatusReport,
    ExecuteWorkflowInput,
    RegisterCapabilityInput,
    WorkflowExecution,
} from "../types";

export class MissionCoreClient {
    registerCapability(input: RegisterCapabilityInput): CapabilityRegistration {
        return missionCoreService.registerCapability(input);
    }

    executeWorkflow(input: ExecuteWorkflowInput): WorkflowExecution {
        return missionCoreService.executeWorkflow(input);
    }

    getCapabilityStatus(capabilityId: string): CapabilityStatusReport | null {
        return missionCoreService.getCapabilityStatus(capabilityId);
    }

    ensureClientSuccessCapability(): CapabilityRegistration {
        return missionCoreService.ensureClientSuccessCapability();
    }

    listCapabilities(): CapabilityRegistration[] {
        return missionCoreService.listCapabilities();
    }

    listWorkflows(capabilityId?: string): WorkflowExecution[] {
        return missionCoreService.listWorkflows(capabilityId);
    }
}

export function createMissionCoreClient(): MissionCoreClient {
    return new MissionCoreClient();
}

export { missionCoreService };

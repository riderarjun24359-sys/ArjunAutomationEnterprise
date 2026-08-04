import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import { MISSION_CORE_CAPABILITY_IDS, MISSION_CORE_WORKFLOWS } from "@/src/modules/mission-core/constants";
import type { CapabilityRegistration, PlatformEvent, WorkflowExecution } from "@/src/modules/mission-core/types";

const client = createMissionCoreClient();

export function ensureClientSuccessCapability(): CapabilityRegistration {
    return client.ensureClientSuccessCapability();
}

export function executeClientSuccessWorkflow(
    workflowName: string,
    payload?: Record<string, unknown>,
): WorkflowExecution {
    const capability = ensureClientSuccessCapability();
    return client.executeWorkflow({
        capabilityId: capability.id,
        workflowName,
        payload,
    });
}

export function getClientSuccessCapabilityStatus() {
    const capability = ensureClientSuccessCapability();
    return client.getCapabilityStatus(capability.id);
}

export function publishClientSuccessEvent(
    type: string,
    payload?: Record<string, unknown>,
): PlatformEvent {
    ensureClientSuccessCapability();
    return client.publishEvent({
        type,
        source: MISSION_CORE_CAPABILITY_IDS.clientSuccess,
        payload,
    });
}

export function subscribeClientSuccessEvents(eventTypes: string[]): void {
    client.subscribeToEvents({
        capabilityId: MISSION_CORE_CAPABILITY_IDS.clientSuccess,
        eventTypes,
    });
}

export { MISSION_CORE_CAPABILITY_IDS, MISSION_CORE_WORKFLOWS, createMissionCoreClient };

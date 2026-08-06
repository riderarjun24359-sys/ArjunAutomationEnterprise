import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";
import { MISSION_CORE_CAPABILITY_IDS, MISSION_CORE_WORKFLOWS } from "@/src/modules/mission-core/constants";
import type { CapabilityRegistration, PlatformEvent, WorkflowExecution } from "@/src/modules/mission-core/types";

export function ensureClientSuccessCapability(): CapabilityRegistration {
    return lazyMissionCoreClient().ensureClientSuccessCapability();
}

export function executeClientSuccessWorkflow(
    workflowName: string,
    payload?: Record<string, unknown>,
): WorkflowExecution {
    const capability = ensureClientSuccessCapability();
    return lazyMissionCoreClient().executeWorkflow({
        capabilityId: capability.id,
        workflowName,
        payload,
    });
}

export function getClientSuccessCapabilityStatus() {
    const capability = ensureClientSuccessCapability();
    return lazyMissionCoreClient().getCapabilityStatus(capability.id);
}

export function publishClientSuccessEvent(
    type: string,
    payload?: Record<string, unknown>,
): PlatformEvent {
    ensureClientSuccessCapability();
    return lazyMissionCoreClient().publishEvent({
        type,
        source: MISSION_CORE_CAPABILITY_IDS.clientSuccess,
        payload,
    });
}

export function subscribeClientSuccessEvents(eventTypes: string[]): void {
    lazyMissionCoreClient().subscribeToEvents({
        capabilityId: MISSION_CORE_CAPABILITY_IDS.clientSuccess,
        eventTypes,
    });
}

export { MISSION_CORE_CAPABILITY_IDS, MISSION_CORE_WORKFLOWS } from "@/src/modules/mission-core/constants";
export { createMissionCoreClient } from "@/src/modules/mission-core/sdk";

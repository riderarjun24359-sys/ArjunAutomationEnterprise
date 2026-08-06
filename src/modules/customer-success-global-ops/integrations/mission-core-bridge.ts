import { executeCapabilityAction } from "@/src/modules/mission-core/engine/capability-executor";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

export function publishGlobalOpsEvent(type: string, payload: Record<string, unknown>) {
    return lazyMissionCoreClient().publishEvent({ type, source: "globalOperations", payload });
}

export async function executeGlobalOpsAction(
    action: string,
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("globalOperations", action, context);
}

export function executeGlobalOpsWorkflow(workflowName: string, payload: Record<string, unknown>) {
    return lazyMissionCoreClient().executeWorkflow({
        capabilityId: "globalOperations",
        workflowName,
        payload,
    });
}

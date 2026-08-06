import { executeCapabilityAction } from "@/src/modules/mission-core/engine/capability-executor";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

export function publishAiCommandCenterEvent(type: string, payload: Record<string, unknown>) {
    return lazyMissionCoreClient().publishEvent({ type, source: "aiCommandCenter", payload });
}

export async function executeAiCommandCenterAction(
    action: string,
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("aiCommandCenter", action, context);
}

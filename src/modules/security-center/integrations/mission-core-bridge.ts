import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import type { PlatformEvent } from "@/src/modules/mission-core/types";
import type { SecurityPolicyResult, UserContext } from "../types";
import { enforceCapabilityAccess } from "../lib/security-policies";

const client = createMissionCoreClient();

export function enforceSecurityPolicy(
    capabilityId: string,
    action: string,
    userContext: UserContext,
): SecurityPolicyResult {
    const access = enforceCapabilityAccess(capabilityId, userContext);
    if (!access.allowed) {
        return { allowed: false, capabilityId, action, reason: access.reason ?? "Policy denied" };
    }
    return { allowed: true, capabilityId, action };
}

export function publishSecurityEvent(
    type: string,
    payload?: Record<string, unknown>,
): PlatformEvent {
    return client.publishEvent({
        type,
        source: "securityCenter",
        payload: { ...payload, securityEvent: true },
    });
}

export { createMissionCoreClient };

import { executeCapabilityAction } from "@/src/modules/mission-core/engine/capability-executor";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";

export function publishBusinessPlatformEvent(type: string, payload: Record<string, unknown>) {
    lazyMissionCoreClient().publishEvent({ type, source: "businessPlatform", payload });
}

export async function executeBusinessPlatformAction(
    action: string,
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    const [capabilityId, capAction] = action.includes(":") ? action.split(":") : ["businessPlatform", action];
    return executeCapabilityAction(capabilityId, capAction, context);
}

export async function scheduleConsultationViaMissionCore(
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("businessPlatform", "schedule-consultation", context);
}

export async function generateProposalViaMissionCore(
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("businessPlatform", "generate-proposal", context);
}

export async function provisionClientPortal(
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("clientSuccess", "run-onboarding", context);
}

export async function createProjectViaMissionCore(
    context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> },
) {
    return executeCapabilityAction("projects", "create-project", context);
}

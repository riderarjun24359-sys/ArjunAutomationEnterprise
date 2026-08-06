import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";
import type { PlatformEvent } from "@/src/modules/mission-core/types";
import { AI_FOUNDATION_EVENTS } from "../constants";

export function publishAiRoutingEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishAiRoutingEvent({ ...payload, source: "aiFoundation" });
}

export function publishAgentSelectedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishAgentSelectedEvent({ ...payload, source: "aiFoundation" });
}

export function publishAiWorkflowExecutedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishAiWorkflowExecutedEvent({ ...payload, source: "aiFoundation" });
}

export function publishMemoryAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishMemoryAccessEvent({ ...payload, source: "aiFoundation" });
}

export function publishKnowledgeAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishKnowledgeAccessEvent({ ...payload, source: "aiFoundation" });
}

export function publishPolicyEnforcedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishPolicyEnforcedEvent({ ...payload, source: "aiFoundation" });
}

export function routeAiDecision(context: { capability: string; task: string }) {
    return lazyMissionCoreClient().makeAiDecision({ sourceCapability: "aiFoundation", payload: context });
}

export function executeMissionCoreWorkflow(workflowName: string, payload?: Record<string, unknown>) {
    return lazyMissionCoreClient().executeWorkflow({ capabilityId: "aiFoundation", workflowName, payload });
}

export function invokeAiSharedService(method: string, args: unknown[] = []) {
    return lazyMissionCoreClient().invokeSharedService("ai", method, args);
}

export { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
export { AI_FOUNDATION_EVENTS };

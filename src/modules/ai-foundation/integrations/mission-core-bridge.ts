import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import type { PlatformEvent } from "@/src/modules/mission-core/types";
import { AI_FOUNDATION_EVENTS } from "../constants";

const client = createMissionCoreClient();

export function publishAiRoutingEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishAiRoutingEvent({ ...payload, source: "aiFoundation" });
}

export function publishAgentSelectedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishAgentSelectedEvent({ ...payload, source: "aiFoundation" });
}

export function publishAiWorkflowExecutedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishAiWorkflowExecutedEvent({ ...payload, source: "aiFoundation" });
}

export function publishMemoryAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishMemoryAccessEvent({ ...payload, source: "aiFoundation" });
}

export function publishKnowledgeAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishKnowledgeAccessEvent({ ...payload, source: "aiFoundation" });
}

export function publishPolicyEnforcedEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishPolicyEnforcedEvent({ ...payload, source: "aiFoundation" });
}

export function routeAiDecision(context: { capability: string; task: string }) {
    return client.makeAiDecision({ sourceCapability: "aiFoundation", payload: context });
}

export function executeMissionCoreWorkflow(workflowName: string, payload?: Record<string, unknown>) {
    return client.executeWorkflow({ capabilityId: "aiFoundation", workflowName, payload });
}

export function invokeAiSharedService(method: string, args: unknown[] = []) {
    return client.invokeSharedService("ai", method, args);
}

export { createMissionCoreClient, AI_FOUNDATION_EVENTS };

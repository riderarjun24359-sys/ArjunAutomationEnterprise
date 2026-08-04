import { createMissionCoreClient } from "@/src/modules/mission-core/sdk";
import type { PlatformEvent, PlatformHealth } from "@/src/modules/mission-core/types";
import { PLATFORM_OPS_EVENTS } from "../constants";
import type { HealthScore } from "../types";

const client = createMissionCoreClient();

export function publishHealthEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishHealthEvent({ ...payload, source: "platformOperations" });
}

export function publishWorkflowEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishEvent({
        type: PLATFORM_OPS_EVENTS.WorkflowEvent,
        source: "platformOperations",
        payload,
    });
}

export function publishPerformanceMetric(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishPerformanceMetric({ ...payload, source: "platformOperations" });
}

export function publishFailureEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishFailureEvent({ ...payload, source: "platformOperations" });
}

export function publishRecoveryEvent(payload?: Record<string, unknown>): PlatformEvent {
    return client.publishRecoveryEvent({ ...payload, source: "platformOperations" });
}

export function getPlatformHealth(): PlatformHealth {
    return client.getPlatformHealth();
}

export function mapMissionCoreHealthToScore(health: PlatformHealth): HealthScore {
    const degraded = health.capabilities.filter((c) => c.status !== "healthy").length;
    const score = Math.max(0, 100 - degraded * 10);
    return {
        overall: health.overall,
        score,
        components: [],
        checkedAt: health.checkedAt,
    };
}

export { createMissionCoreClient };

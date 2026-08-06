import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";
import type { PlatformEvent, PlatformHealth } from "@/src/modules/mission-core/types";
import { PLATFORM_OPS_EVENTS } from "../constants";
import type { HealthScore } from "../types";

export function publishHealthEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishHealthEvent({ ...payload, source: "platformOperations" });
}

export function publishWorkflowEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishEvent({
        type: PLATFORM_OPS_EVENTS.WorkflowEvent,
        source: "platformOperations",
        payload,
    });
}

export function publishPerformanceMetric(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishPerformanceMetric({ ...payload, source: "platformOperations" });
}

export function publishFailureEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishFailureEvent({ ...payload, source: "platformOperations" });
}

export function publishRecoveryEvent(payload?: Record<string, unknown>): PlatformEvent {
    return lazyMissionCoreClient().publishRecoveryEvent({ ...payload, source: "platformOperations" });
}

export function getPlatformHealth(): PlatformHealth {
    return lazyMissionCoreClient().getPlatformHealth();
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

export { createMissionCoreClient } from "@/src/modules/mission-core/sdk";

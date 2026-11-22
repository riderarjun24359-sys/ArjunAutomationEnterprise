import { HEALTH_COMPONENTS } from "../constants";
import type { HealthComponent, HealthScore } from "../types";
import { getPlatformHealth } from "../integrations/mission-core-bridge";

const COMPONENT_LABELS: Record<string, string> = {
    missionCore: "Mission Core",
    capabilities: "Capabilities",
    sharedServices: "Shared Services",
    database: "Database",
    storage: "Storage",
    api: "API Gateway",
    queues: "Job Queues",
    workers: "Background Workers",
    externalIntegrations: "External Integrations",
};

export function monitorComponents(): HealthComponent[] {
    const platformHealth = getPlatformHealth();
    return HEALTH_COMPONENTS.map((id, index) => {
        const cap = platformHealth.capabilities[index];
        const uptime = cap?.uptime ?? 0;
        return {
            id,
            name: COMPONENT_LABELS[id] ?? id,
            status: cap?.status ?? "offline",
            uptime,
            latencyMs: 0,
            lastCheck: new Date().toISOString(),
            message: cap?.message ?? "No live health signal is available for this component.",
        };
    });
}

export function computeHealthScore(): HealthScore {
    const components = monitorComponents();
    const healthy = components.filter((c) => c.status === "healthy").length;
    const score = Math.round((healthy / components.length) * 100);
    const degraded = components.some((c) => c.status === "degraded");
    const critical = components.some((c) => c.status === "critical" || c.status === "offline");
    const overall = critical ? "critical" : degraded ? "degraded" : "healthy";
    return { overall, score, components, checkedAt: new Date().toISOString() };
}

export function getLiveHealthScore(): HealthScore {
    return computeHealthScore();
}

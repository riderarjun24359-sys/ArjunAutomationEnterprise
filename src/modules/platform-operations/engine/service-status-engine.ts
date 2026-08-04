import { HEALTH_COMPONENTS } from "../constants";
import type { HealthComponentId, Incident, ServiceStatus } from "../types";

const incidentStore: Incident[] = [
    {
        id: "inc-001",
        title: "Elevated API latency in us-east-1",
        severity: "medium",
        status: "monitoring",
        affectedComponents: ["api", "externalIntegrations"],
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        maintenanceMode: false,
    },
];

let maintenanceMode = false;

export function getIncidents(): Incident[] {
    return incidentStore;
}

export function getActiveIncidents(): Incident[] {
    return incidentStore.filter((i) => i.status !== "resolved");
}

export function createIncident(input: Omit<Incident, "id">): Incident {
    const incident: Incident = { ...input, id: `inc-${Date.now()}` };
    incidentStore.unshift(incident);
    return incident;
}

export function resolveIncident(id: string): Incident | null {
    const incident = incidentStore.find((i) => i.id === id);
    if (!incident) return null;
    incident.status = "resolved";
    incident.resolvedAt = new Date().toISOString();
    return incident;
}

export function getServiceStatuses(): ServiceStatus[] {
    return HEALTH_COMPONENTS.map((id) => ({
        id,
        name: id.replace(/([A-Z])/g, " $1").trim(),
        status: "healthy" as const,
        dependencies: id === "missionCore" ? [] : ["missionCore"],
        uptime: 99 + Math.random(),
    }));
}

export function isMaintenanceMode(): boolean {
    return maintenanceMode;
}

export function setMaintenanceMode(enabled: boolean): { maintenanceMode: boolean } {
    maintenanceMode = enabled;
    return { maintenanceMode };
}

export function getCapabilityDependencyStatus(componentId: HealthComponentId): ServiceStatus | undefined {
    return getServiceStatuses().find((s) => s.id === componentId);
}

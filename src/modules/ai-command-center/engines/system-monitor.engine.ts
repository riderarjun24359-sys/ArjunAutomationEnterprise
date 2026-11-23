import type { AccAlert } from "../types";
import { clampScore, uid } from "./engine-utils";

export function computeSystemHealth(input: {
    productionScore?: number;
    platformHealth?: number;
    openErrors?: number;
    openAlerts?: number;
}): number {
    const base = input.productionScore ?? input.platformHealth ?? 0;
    const penalty = (input.openErrors ?? 0) * 3 + (input.openAlerts ?? 0) * 4;
    return clampScore(base - penalty);
}

export function buildSystemAlerts(input: {
    systemHealth: number | null;
    openTickets: number | null;
    deliveryHealth: number | null;
    productionAlerts?: number | null;
}): AccAlert[] {
    const alerts: AccAlert[] = [];
    const now = new Date().toISOString();
    if (input.systemHealth !== null && input.systemHealth < 75) {
        alerts.push({
            id: uid("alert"),
            severity: "critical",
            sourceModule: "systemMonitor",
            title: "System health below threshold",
            detail: `System health at ${input.systemHealth}%`,
            status: "open",
            createdAt: now,
        });
    }
    if (input.productionAlerts !== null && input.productionAlerts !== undefined && input.productionAlerts > 0) {
        alerts.push({
            id: uid("alert"),
            severity: "high",
            sourceModule: "production-readiness",
            title: `${input.productionAlerts} production alerts active`,
            detail: "Review production readiness CTO audit dashboard.",
            status: "open",
            createdAt: now,
        });
    }
    if (input.openTickets !== null && input.openTickets > 10) {
        alerts.push({
            id: uid("alert"),
            severity: "medium",
            sourceModule: "support",
            title: "Elevated support backlog",
            detail: `${input.openTickets} open tickets`,
            status: "open",
            createdAt: now,
        });
    }
    if (input.deliveryHealth !== null && input.deliveryHealth < 80) {
        alerts.push({
            id: uid("alert"),
            severity: "high",
            sourceModule: "delivery-engine",
            title: "Delivery health degraded",
            detail: `Delivery health at ${input.deliveryHealth}%`,
            status: "open",
            createdAt: now,
        });
    }
    return alerts;
}

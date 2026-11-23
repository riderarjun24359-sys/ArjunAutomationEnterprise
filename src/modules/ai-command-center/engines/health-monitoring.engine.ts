import type { AccAgentStatus, DeliveryStatusSummary, SupportSlaSummary } from "../types";
import { clampScore } from "./engine-utils";

export function computeClientHealth(input: {
    globalOpsCustomerHealth?: number;
    activeClients: number;
    openEscalations?: number;
}): number {
    const base = input.globalOpsCustomerHealth ?? (input.activeClients > 0 ? 80 : 70);
    return clampScore(base - (input.openEscalations ?? 0) * 5);
}

export function buildSupportSlaSummary(input: {
    openTickets: number;
    slaCompliance: number;
    supportHealth: number;
    incidents: number;
}): SupportSlaSummary {
    return {
        openTickets: input.openTickets,
        slaCompliance: input.slaCompliance,
        supportHealth: input.supportHealth,
        incidents: input.incidents,
    };
}

export function buildDeliveryStatusSummary(input: {
    activeEngagements: number;
    qualityPassRate: number;
    deliveryHealth: number;
    pendingAi: number;
}): DeliveryStatusSummary {
    return {
        activeEngagements: input.activeEngagements,
        qualityPassRate: input.qualityPassRate,
        deliveryHealth: input.deliveryHealth,
        pendingAi: input.pendingAi,
    };
}

/** No agent telemetry adapter is connected; never infer live agents from platform health. */
export function buildAgentStatuses(_input: {
    executiveAgentCount?: number;
    pendingApprovals?: number;
    systemHealth: number;
}): AccAgentStatus[] {
    return [];
}

export function computeAgentHealth(agents: AccAgentStatus[]): number {
    if (!agents.length) return 0;
    return clampScore(agents.reduce((s, a) => s + a.healthScore, 0) / agents.length);
}

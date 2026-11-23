import { ACC_AGENT_KEYS } from "../constants";
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

export function buildAgentStatuses(_input: {
    executiveAgentCount?: number;
    pendingApprovals?: number;
    systemHealth: number;
}): AccAgentStatus[] {
    void _input;
    // System health is not proof that an individual agent or provider is online.
    // Until each agent reports a heartbeat, expose an explicit unknown state.
    return ACC_AGENT_KEYS.map((key) => ({
        key,
        label: key === "orchestrator" ? "AI Orchestrator" : `${key.toUpperCase()} AI`,
        status: "unknown",
        healthScore: 0,
        lastActivity: "",
    }));
}

export function computeAgentHealth(agents: AccAgentStatus[]): number {
    if (!agents.length) return 0;
    return clampScore(agents.reduce((s, a) => s + a.healthScore, 0) / agents.length);
}

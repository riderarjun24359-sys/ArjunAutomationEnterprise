import type { AccAutomation } from "../types";
import { uid } from "./engine-utils";

export function buildAutomations(input: {
    openTickets: number | null;
    renewalsDue: number | null;
    deliveryHealth: number | null;
    pendingAi: number | null;
}): AccAutomation[] {
    const now = new Date().toISOString();
    return [
        {
            id: uid("auto"),
            automationKey: "sla_watchdog",
            title: "SLA watchdog scan",
            status: input.openTickets === null ? "unknown" : input.openTickets > 5 ? "running" : "succeeded",
            lastRunAt: input.openTickets === null ? null : now,
            resultSummary: input.openTickets === null ? "Support data unavailable" : input.openTickets > 5 ? `Monitoring ${input.openTickets} open tickets` : "No elevated support backlog detected",
        },
        {
            id: uid("auto"),
            automationKey: "renewal_reminder",
            title: "Renewal reminder dispatcher",
            status: input.renewalsDue === null ? "unknown" : input.renewalsDue > 0 ? "running" : "idle",
            lastRunAt: input.renewalsDue === null ? null : now,
            resultSummary: input.renewalsDue === null ? "Renewal data unavailable" : input.renewalsDue > 0 ? `${input.renewalsDue} renewals queued` : "No renewals due",
        },
        {
            id: uid("auto"),
            automationKey: "delivery_quality_check",
            title: "Delivery quality checkpoint",
            status: input.deliveryHealth === null ? "unknown" : input.deliveryHealth < 85 ? "running" : "succeeded",
            lastRunAt: input.deliveryHealth === null ? null : now,
            resultSummary: input.deliveryHealth === null ? "Delivery data unavailable" : `Delivery health ${input.deliveryHealth}%`,
        },
        {
            id: uid("auto"),
            automationKey: "ai_lifecycle_flush",
            title: "AI recommendation flush",
            status: input.pendingAi === null ? "unknown" : input.pendingAi > 3 ? "running" : "idle",
            lastRunAt: input.pendingAi === null ? null : now,
            resultSummary: input.pendingAi === null ? "AI lifecycle data unavailable" : `${input.pendingAi} pending AI recommendations`,
        },
    ];
}

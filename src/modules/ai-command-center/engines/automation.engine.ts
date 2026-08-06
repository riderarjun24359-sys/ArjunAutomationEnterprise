import type { AccAutomation } from "../types";
import { uid } from "./engine-utils";

export function buildAutomations(input: {
    openTickets: number;
    renewalsDue: number;
    deliveryHealth: number;
    pendingAi: number;
}): AccAutomation[] {
    const now = new Date().toISOString();
    return [
        {
            id: uid("auto"),
            automationKey: "sla_watchdog",
            title: "SLA watchdog scan",
            status: input.openTickets > 5 ? "running" : "succeeded",
            lastRunAt: now,
            resultSummary: input.openTickets > 5 ? `Monitoring ${input.openTickets} open tickets` : "No SLA breaches detected",
        },
        {
            id: uid("auto"),
            automationKey: "renewal_reminder",
            title: "Renewal reminder dispatcher",
            status: input.renewalsDue > 0 ? "running" : "idle",
            lastRunAt: now,
            resultSummary: input.renewalsDue > 0 ? `${input.renewalsDue} renewals queued` : "No renewals due",
        },
        {
            id: uid("auto"),
            automationKey: "delivery_quality_check",
            title: "Delivery quality checkpoint",
            status: input.deliveryHealth < 85 ? "running" : "succeeded",
            lastRunAt: now,
            resultSummary: `Delivery health ${input.deliveryHealth}%`,
        },
        {
            id: uid("auto"),
            automationKey: "ai_lifecycle_flush",
            title: "AI recommendation flush",
            status: input.pendingAi > 3 ? "running" : "idle",
            lastRunAt: now,
            resultSummary: `${input.pendingAi} pending AI recommendations`,
        },
    ];
}

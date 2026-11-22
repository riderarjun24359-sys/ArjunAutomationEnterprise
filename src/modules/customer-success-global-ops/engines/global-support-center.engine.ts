import type { SupportTicketSummary } from "../types";

export function computeSupportHealth(input: {
    openTickets: number;
    slaCompliance: number;
    incidents: number;
    avgSatisfaction: number;
}): number {
    const hasSatisfactionData = input.avgSatisfaction > 0;
    const sat = hasSatisfactionData ? (input.avgSatisfaction / 5) * 100 : 0;
    const ticketPenalty = Math.min(25, input.openTickets * 2);
    const incidentPenalty = input.incidents * 8;
    const base = hasSatisfactionData
        ? input.slaCompliance * 0.5 + sat * 0.3 + 20
        : input.slaCompliance;
    return Math.max(0, Math.min(100, Math.round(base - ticketPenalty - incidentPenalty)));
}

export function classifyLiveQueue(tickets: SupportTicketSummary[]) {
    const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status.toLowerCase()));
    return {
        queueDepth: open.length,
        breached: open.filter((t) => t.slaStatus === "breached").length,
        critical: open.filter((t) => /critical|p1|urgent/i.test(t.priority)).length,
    };
}

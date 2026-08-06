import type { SupportTicketSummary } from "../types";

export function computeSupportHealth(input: {
    openTickets: number;
    slaCompliance: number;
    incidents: number;
    avgSatisfaction: number;
}): number {
    const sat = input.avgSatisfaction > 0 ? (input.avgSatisfaction / 5) * 100 : 85;
    const ticketPenalty = Math.min(25, input.openTickets * 2);
    const incidentPenalty = input.incidents * 8;
    return Math.max(0, Math.min(100, Math.round((input.slaCompliance * 0.5 + sat * 0.3 + 100 * 0.2) - ticketPenalty - incidentPenalty)));
}

export function classifyLiveQueue(tickets: SupportTicketSummary[]) {
    const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status.toLowerCase()));
    return {
        queueDepth: open.length,
        breached: open.filter((t) => t.slaStatus === "breached").length,
        critical: open.filter((t) => /critical|p1|urgent/i.test(t.priority)).length,
    };
}

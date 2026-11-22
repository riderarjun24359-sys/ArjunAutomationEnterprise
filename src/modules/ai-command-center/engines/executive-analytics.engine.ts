import type { RevenueSummary } from "../types";
import { clampScore } from "./engine-utils";

export function buildRevenueSummary(input: {
    activeClients: number;
    openInvoices: number;
    renewalsDue: number;
    pipelineLeads: number;
    mrrEstimate?: number;
}): RevenueSummary {
    return {
        mrr: input.mrrEstimate ?? 0,
        openInvoices: input.openInvoices,
        renewalsDue: input.renewalsDue,
        activeClients: input.activeClients,
        pipelineLeads: input.pipelineLeads,
    };
}

export function computeOverallScore(scores: number[]): number {
    const reported = scores.filter((score) => score > 0);
    if (!reported.length) return 0;
    return clampScore(reported.reduce((s, n) => s + n, 0) / reported.length);
}

export function formatExecutiveBrief(input: {
    systemHealth: number;
    clientHealth: number;
    revenue: RevenueSummary;
    supportSla: number;
    deliveryHealth: number;
}): string {
    return [
        `AI Command Center brief`,
        `System ${input.systemHealth}% · Clients ${input.clientHealth}% · Support SLA ${input.supportSla}% · Delivery ${input.deliveryHealth}%`,
        `MRR ₹${Math.round(input.revenue.mrr).toLocaleString()} · ${input.revenue.activeClients} clients · ${input.revenue.pipelineLeads} leads · ${input.revenue.openInvoices} open invoices`,
    ].join("\n");
}

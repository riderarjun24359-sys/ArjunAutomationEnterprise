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
        mrr: input.mrrEstimate ?? Math.max(0, input.activeClients * 2500),
        openInvoices: input.openInvoices,
        renewalsDue: input.renewalsDue,
        activeClients: input.activeClients,
        pipelineLeads: input.pipelineLeads,
    };
}

export function computeOverallScore(scores: number[]): number {
    if (!scores.length) return 0;
    return clampScore(scores.reduce((s, n) => s + n, 0) / scores.length);
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
        `MRR $${Math.round(input.revenue.mrr).toLocaleString()} · ${input.revenue.activeClients} clients · ${input.revenue.pipelineLeads} leads · ${input.revenue.openInvoices} open invoices`,
    ].join("\n");
}

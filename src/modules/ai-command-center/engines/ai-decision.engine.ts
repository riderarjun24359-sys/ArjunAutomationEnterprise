import type { AccDecision } from "../types";
import { uid } from "./engine-utils";

export function proposeDecisions(input: {
    clientHealth: number | null;
    supportSla: number | null;
    deliveryHealth: number | null;
    openInvoices: number | null;
    renewalsDue: number | null;
}): AccDecision[] {
    const now = new Date().toISOString();
    const decisions: AccDecision[] = [];

    if (input.clientHealth !== null && input.clientHealth < 75) {
        decisions.push({
            id: uid("dec"),
            decisionType: "customer_recovery",
            summary: "Launch at-risk client recovery playbook",
            rationale: `Client health at ${input.clientHealth}% warrants coordinated CS and support action.`,
            confidence: 0.88,
            status: "proposed",
            createdAt: now,
        });
    }
    if (input.supportSla !== null && input.supportSla < 90) {
        decisions.push({
            id: uid("dec"),
            decisionType: "support_rebalance",
            summary: "Rebalance support queue for SLA recovery",
            rationale: `SLA compliance at ${input.supportSla}% — prioritize breached tickets.`,
            confidence: 0.86,
            status: "proposed",
            createdAt: now,
        });
    }
    if (input.deliveryHealth !== null && input.deliveryHealth < 85) {
        decisions.push({
            id: uid("dec"),
            decisionType: "delivery_quality_gate",
            summary: "Enforce quality gate before next go-live",
            rationale: `Delivery health at ${input.deliveryHealth}% — block deploy until quality recovers.`,
            confidence: 0.9,
            status: "proposed",
            createdAt: now,
        });
    }
    if (input.renewalsDue !== null && input.renewalsDue > 0) {
        decisions.push({
            id: uid("dec"),
            decisionType: "renewal_focus",
            summary: "Prioritize renewal QBRs this week",
            rationale: `${input.renewalsDue} renewals due — prepare ROI briefs.`,
            confidence: 0.84,
            status: "proposed",
            createdAt: now,
        });
    }
    if (input.openInvoices !== null && input.openInvoices > 5) {
        decisions.push({
            id: uid("dec"),
            decisionType: "collections",
            summary: "Escalate overdue invoice collections",
            rationale: `${input.openInvoices} open invoices impact cash-flow forecast.`,
            confidence: 0.82,
            status: "proposed",
            createdAt: now,
        });
    }
    return decisions;
}

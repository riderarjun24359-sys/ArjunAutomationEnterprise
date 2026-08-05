import type { ExecutiveRawSignals, ExecutiveAttentionItem } from "../../types";

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

export function runPriorityEngine(signals: ExecutiveRawSignals): ExecutiveAttentionItem[] {
    const items: ExecutiveAttentionItem[] = [];
    const { overview, eip, aix, business } = signals;

    if (overview.openTasks > 0) {
        items.push({
            id: "attention-open-tasks",
            title: `${overview.openTasks} open tasks require action`,
            detail: "Operational backlog detected across workspace tasks.",
            severity: overview.openTasks > 10 ? "high" : "medium",
            module: "operations",
            actionHref: "/tasks",
            actionLabel: "Review tasks",
        });
    }

    if (eip.openIntelligenceFailureCount > 0) {
        items.push({
            id: "attention-eip-failures",
            title: `${eip.openIntelligenceFailureCount} intelligence failures open`,
            detail: "EIP pipeline failures need engineering review.",
            severity: "critical",
            module: "cto",
            actionHref: "/enterprise-intelligence-platform",
            actionLabel: "Open EIP",
        });
    }

    if (aix.openFailureCount > 0) {
        items.push({
            id: "attention-aix-failures",
            title: `${aix.openFailureCount} executive AI failures`,
            detail: "AIX reasoning or recommendation jobs failed.",
            severity: "high",
            module: "operations",
            actionHref: "/executive-intelligence",
            actionLabel: "Open AIX",
        });
    }

    if (aix.openRiskCount > 0) {
        items.push({
            id: "attention-business-risks",
            title: `${aix.openRiskCount} business risks flagged`,
            detail: "Executive risk register has unresolved items.",
            severity: "high",
            module: "business",
            actionHref: "/executive-intelligence",
            actionLabel: "View risks",
        });
    }

    if (business && business.pendingAiRecommendations > 0) {
        items.push({
            id: "attention-ai-recommendations",
            title: `${business.pendingAiRecommendations} AI recommendations pending`,
            detail: "Business platform suggests lifecycle actions awaiting review.",
            severity: "medium",
            module: "customer",
            actionHref: "/business-platform",
            actionLabel: "Review recommendations",
        });
    }

    if (business && business.consultationsScheduled > 0) {
        items.push({
            id: "attention-consultations",
            title: `${business.consultationsScheduled} consultations scheduled`,
            detail: "Upcoming client consultations need preparation.",
            severity: "medium",
            module: "customer",
            actionHref: "/business-platform",
            actionLabel: "View consultations",
        });
    }

    if (business && business.openInvoices > 0) {
        items.push({
            id: "attention-invoices",
            title: `${business.openInvoices} open invoices`,
            detail: "Outstanding billing items may affect cash flow.",
            severity: "medium",
            module: "business",
            actionHref: "/finance",
            actionLabel: "View invoices",
        });
    }

    if (items.length === 0) {
        items.push({
            id: "attention-all-clear",
            title: "No critical attention items today",
            detail: "Workspace signals are within normal operating thresholds.",
            severity: "low",
            module: "operations",
        });
    }

    return items.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

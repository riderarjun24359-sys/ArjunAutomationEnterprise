import type { AiOpsRecommendation, FeedbackEntry, GlobalOperationsDashboard, ImprovementItem } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateImprovementBacklog(input: {
    feedback: FeedbackEntry[];
    deliveryHealth: number;
    supportHealth: number;
    customerHealth: number;
    openTickets: number;
}): ImprovementItem[] {
    const items: ImprovementItem[] = [];

    for (const f of input.feedback.filter((x) => x.type === "feature_request" || x.type === "improvement" || x.type === "complaint")) {
        items.push({
            id: uid("imp"),
            sourceModule: "customerFeedbackEngine",
            title: f.type === "complaint" ? `Resolve: ${f.comment.slice(0, 60)}` : f.comment.slice(0, 80),
            detail: `Captured from ${f.type} feedback`,
            priority: f.type === "complaint" ? "high" : "medium",
            status: "backlog",
        });
    }

    if (input.deliveryHealth < 85) {
        items.push({
            id: uid("imp"),
            sourceModule: "serviceDeliveryControl",
            title: "Strengthen delivery quality checkpoints",
            detail: `Delivery health at ${input.deliveryHealth}%`,
            priority: "high",
            status: "backlog",
        });
    }

    if (input.supportHealth < 85 || input.openTickets > 8) {
        items.push({
            id: uid("imp"),
            sourceModule: "globalSupportCenter",
            title: "Reduce open ticket backlog and improve first-response SLA",
            detail: `${input.openTickets} open tickets · support health ${input.supportHealth}%`,
            priority: "high",
            status: "backlog",
        });
    }

    if (input.customerHealth < 75) {
        items.push({
            id: uid("imp"),
            sourceModule: "customerSuccessOs",
            title: "Run health recovery playbook for at-risk clients",
            detail: `Customer health at ${input.customerHealth}%`,
            priority: "critical",
            status: "backlog",
        });
    }

    items.push({
        id: uid("imp"),
        sourceModule: "continuousImprovementEngine",
        title: "Capture lessons learned from latest delivery cycle",
        detail: "Auto-generated continuous improvement item",
        priority: "medium",
        status: "backlog",
    });

    return items;
}

export function generateAiRecommendations(dash: Pick<GlobalOperationsDashboard, "customerHealth" | "supportHealth" | "deliveryHealth" | "openTickets" | "renewals" | "escalations">): AiOpsRecommendation[] {
    const recs: AiOpsRecommendation[] = [];
    if (dash.customerHealth < 80) {
        recs.push({ id: uid("ai"), module: "customerSuccessOs", title: "Prioritize at-risk health accounts", detail: "Schedule success plan reviews for clients below 75 health.", confidence: 0.88 });
    }
    if (dash.openTickets > 5) {
        recs.push({ id: uid("ai"), module: "globalSupportCenter", title: "Rebalance support queue", detail: "Assign senior agents to breached or aging tickets.", confidence: 0.86 });
    }
    if (dash.deliveryHealth < 90) {
        recs.push({ id: uid("ai"), module: "serviceDeliveryControl", title: "Add quality gate before deploy", detail: "Block go-live until quality pass rate recovers.", confidence: 0.9 });
    }
    if (dash.renewals.some((r) => r.status === "in_negotiation")) {
        recs.push({ id: uid("ai"), module: "customerSuccessOs", title: "Advance renewal negotiations", detail: "Prepare ROI brief and QBR for renewals in negotiation.", confidence: 0.84 });
    }
    if (dash.escalations.length > 0) {
        recs.push({ id: uid("ai"), module: "globalSupportCenter", title: "Close open escalations within SLA", detail: `${dash.escalations.length} escalations require executive visibility.`, confidence: 0.91 });
    }
    if (recs.length === 0) {
        recs.push({ id: uid("ai"), module: "globalOperationsDashboard", title: "Operations nominal", detail: "Maintain current cadence; continue weekly health reviews.", confidence: 0.8 });
    }
    return recs;
}

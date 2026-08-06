import type {
    AiExecutiveInsight,
    ExecutiveChartsBundle,
    LiveOperationsStats,
    Severity,
} from "../types";

function priorityFromSeverity(severity: Severity): AiExecutiveInsight["priority"] {
    if (severity === "critical" || severity === "high") return "P1";
    if (severity === "medium") return "P2";
    return "P3";
}

export function buildAiExecutiveInsights(input: {
    liveStats: LiveOperationsStats;
    charts: ExecutiveChartsBundle;
    unifiedScore: number;
}): AiExecutiveInsight[] {
    const { liveStats, charts, unifiedScore } = input;
    const insights: AiExecutiveInsight[] = [];
    const { revenue, totalClients, activeProjects, openTasks, crmLeads } = liveStats;
    const { taskCompletion, revenueTrend, clientGrowth } = charts;

    if (revenue.outstanding > 0 && revenue.outstanding >= revenue.collected * 0.25) {
        insights.push({
            id: "insight-collections-risk",
            kind: "risk",
            priority: "P1",
            severity: "high",
            title: "Collections pressure rising",
            detail: `${revenue.openInvoiceCount} open invoices leave ${revenue.currency} ${Math.round(revenue.outstanding).toLocaleString()} outstanding versus ${revenue.label} collected.`,
            actionLabel: "Review open invoices",
            actionHref: "/finance",
        });
    }

    if (openTasks > 15) {
        insights.push({
            id: "insight-task-backlog",
            kind: "risk",
            priority: priorityFromSeverity(openTasks > 40 ? "critical" : "high"),
            severity: openTasks > 40 ? "critical" : "high",
            title: "Task backlog needs triage",
            detail: `${openTasks} open tasks across active delivery. Completion rate is ${taskCompletion.rate}%.`,
            actionLabel: "Open tasks board",
            actionHref: "/tasks",
        });
    }

    if (activeProjects === 0 && totalClients > 0) {
        insights.push({
            id: "insight-idle-clients",
            kind: "risk",
            priority: "P2",
            severity: "medium",
            title: "Clients without active delivery",
            detail: `${totalClients} clients are on record but no active projects are in flight.`,
            actionLabel: "Create a project",
            actionHref: "/projects",
        });
    }

    if (crmLeads > 0) {
        insights.push({
            id: "insight-convert-leads",
            kind: "recommendation",
            priority: crmLeads >= 10 ? "P1" : "P2",
            severity: crmLeads >= 10 ? "high" : "medium",
            title: "Convert CRM pipeline",
            detail: `${crmLeads} leads are waiting. Prioritize qualification and proposal follow-up.`,
            actionLabel: "Open sales pipeline",
            actionHref: "/sales",
        });
    }

    const revenueDelta =
        revenueTrend.length >= 2
            ? (revenueTrend[revenueTrend.length - 1]?.value ?? 0) - (revenueTrend[revenueTrend.length - 2]?.value ?? 0)
            : 0;
    if (revenueDelta > 0) {
        insights.push({
            id: "insight-revenue-up",
            kind: "opportunity",
            priority: "P3",
            severity: "low",
            title: "Revenue momentum improved",
            detail: `Latest month is up ${Math.round(revenueDelta).toLocaleString()} versus the prior month.`,
            actionLabel: "View analytics",
            actionHref: "/analytics",
        });
    } else if (revenueTrend.some((p) => p.value > 0) && revenueDelta < 0) {
        insights.push({
            id: "insight-revenue-down",
            kind: "risk",
            priority: "P2",
            severity: "medium",
            title: "Revenue soft month",
            detail: `Latest month is down ${Math.abs(Math.round(revenueDelta)).toLocaleString()} versus the prior month.`,
            actionLabel: "Inspect finance",
            actionHref: "/finance",
        });
    }

    const clientDelta =
        clientGrowth.length >= 2
            ? (clientGrowth[clientGrowth.length - 1]?.value ?? 0) - (clientGrowth[clientGrowth.length - 2]?.value ?? 0)
            : 0;
    if (clientDelta > 0) {
        insights.push({
            id: "insight-client-growth",
            kind: "opportunity",
            priority: "P3",
            severity: "low",
            title: "Client base expanding",
            detail: `${clientDelta} net new client${clientDelta === 1 ? "" : "s"} this month. Protect onboarding quality.`,
            actionLabel: "Review clients",
            actionHref: "/clients",
        });
    }

    if (taskCompletion.total > 0 && taskCompletion.rate >= 70) {
        insights.push({
            id: "insight-delivery-health",
            kind: "insight",
            priority: "P3",
            severity: "low",
            title: "Delivery completion is healthy",
            detail: `${taskCompletion.completed}/${taskCompletion.total} tasks complete (${taskCompletion.rate}%). Keep cadence.`,
            actionLabel: "View projects",
            actionHref: "/projects",
        });
    } else if (taskCompletion.total > 0 && taskCompletion.rate < 40) {
        insights.push({
            id: "insight-delivery-weak",
            kind: "recommendation",
            priority: "P1",
            severity: "high",
            title: "Raise task completion rate",
            detail: `Only ${taskCompletion.rate}% of tasks are complete. Re-balance workload and clear blockers.`,
            actionLabel: "Triage tasks",
            actionHref: "/tasks",
        });
    }

    if (unifiedScore < 55) {
        insights.push({
            id: "insight-unified-score",
            kind: "risk",
            priority: "P2",
            severity: "medium",
            title: "Unified intelligence score is soft",
            detail: `Cross-domain score is ${unifiedScore}%. Review EIP/AIX attention items and operational KPIs.`,
            actionLabel: "Open executive brief",
            actionHref: "/dashboard",
        });
    }

    if (insights.length === 0 && liveStats.source === "supabase") {
        insights.push({
            id: "insight-stable",
            kind: "insight",
            priority: "P3",
            severity: "low",
            title: "Operations look stable",
            detail: "Live KPIs show no critical imbalances. Continue monitoring pipeline and collections.",
            actionLabel: "Refresh analytics",
            actionHref: "/analytics",
        });
    }

    const order: Record<AiExecutiveInsight["priority"], number> = { P1: 0, P2: 1, P3: 2 };
    return insights.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 8);
}

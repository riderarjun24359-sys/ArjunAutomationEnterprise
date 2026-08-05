import type { ExecutiveRawSignals, ExecutiveFeedItem } from "../../types";

export function runFeedEngine(signals: ExecutiveRawSignals): ExecutiveFeedItem[] {
    const { overview, eip, aix } = signals;
    const feed: ExecutiveFeedItem[] = [];

    for (const activity of overview.activities.slice(0, 6)) {
        feed.push({
            id: `feed-audit-${activity.id}`,
            title: activity.title,
            detail: activity.detail,
            module: "operations",
            time: activity.time,
            tag: activity.tag,
        });
    }

    if (eip.strategicInsightCount > 0) {
        feed.push({
            id: "feed-strategic-insights",
            title: "Strategic insights updated",
            detail: `${eip.strategicInsightCount} strategic insights in EIP registry.`,
            module: "business",
            time: "Today",
            tag: "intelligence",
        });
    }

    if (aix.evidenceTraceCount > 0) {
        feed.push({
            id: "feed-evidence-traces",
            title: "New evidence traces",
            detail: `${aix.evidenceTraceCount} AIX evidence traces support recommendations.`,
            module: "cto",
            time: "Today",
            tag: "ai",
        });
    }

    if (aix.reasoningSessionCount > 0) {
        feed.push({
            id: "feed-reasoning",
            title: "Knowledge reasoning active",
            detail: `${aix.reasoningSessionCount} reasoning sessions processed.`,
            module: "cto",
            time: "Today",
            tag: "reasoning",
        });
    }

    return feed;
}

export function buildExecutiveNotifications(
    attention: ReturnType<typeof import("./priority-engine").runPriorityEngine>,
): import("../../types").ExecutiveNotification[] {
    return attention
        .filter((item) => item.severity !== "low")
        .slice(0, 8)
        .map((item) => ({
            id: `notif-${item.id}`,
            title: item.title,
            detail: item.detail,
            time: "Today",
            severity: item.severity,
            read: false,
        }));
}

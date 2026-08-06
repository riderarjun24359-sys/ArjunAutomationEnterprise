import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateAnalyticsRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("ana"),
            agentKey: "analytics",
            title: "KPI trend analysis",
            detail: `Unified score ${knowledge.executiveIntelligence.unifiedScore}%. Track week-over-week delta across EIP metrics.`,
            explanation: "EIP unified score is primary KPI for trend detection.",
            confidence: 0.89,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "executive-intelligence-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("ana"),
            agentKey: "analytics",
            title: "Executive reporting",
            detail: "Generate consolidated executive brief from all 9 agent recommendations.",
            explanation: "Cross-agent aggregation for executive dashboard reporting.",
            confidence: 0.91,
            votes: 3,
            requiresApproval: false,
            status: "pending",
            sourceModules: "executive-intelligence-platform,business-platform,delivery-engine",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

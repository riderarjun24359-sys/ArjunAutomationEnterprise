import type { ExecutiveAgentKey } from "../constants";
import type { AgentRecommendation, CollaborationEvent } from "../types";
import { explainRecommendation } from "../recommendation-engine/recommendation-engine.service";

export function voteOnRecommendations(recommendations: AgentRecommendation[]): AgentRecommendation[] {
    return recommendations.map((r) => ({
        ...r,
        votes: r.votes + (r.confidence >= 0.85 ? 1 : 0),
        explanation: explainRecommendation(r),
    }));
}

export function buildConsensus(recommendations: AgentRecommendation[]): { consensus: AgentRecommendation[]; events: CollaborationEvent[] } {
    const voted = voteOnRecommendations(recommendations);
    const consensus = voted.filter((r) => r.votes >= 2 || r.confidence >= 0.88);
    const events: CollaborationEvent[] = [
        {
            id: `collab-vote-${Date.now()}`,
            eventType: "vote",
            agentKeys: [...new Set(voted.map((r) => r.agentKey))].join(","),
            summary: `Voting completed across ${voted.length} recommendations`,
            createdAt: new Date().toISOString(),
        },
    ];
    if (consensus.length > 0) {
        events.push({
            id: `collab-consensus-${Date.now()}`,
            eventType: "consensus",
            agentKeys: consensus.map((r) => r.agentKey).join(","),
            summary: `Consensus reached on ${consensus.length} high-confidence recommendations`,
            createdAt: new Date().toISOString(),
        });
    }
    return { consensus: consensus.length ? consensus : voted, events };
}

export function buildCollaborationTimeline(
    routedAgents: ExecutiveAgentKey[],
    taskType: string,
    conflictsResolved: number,
    requiresApproval: boolean,
    mergedCount: number,
): CollaborationEvent[] {
    const events: CollaborationEvent[] = [
        {
            id: `collab-route-${Date.now()}`,
            eventType: "task_routed",
            agentKeys: routedAgents.join(","),
            summary: `Task "${taskType}" routed to ${routedAgents.length} agents`,
            createdAt: new Date().toISOString(),
        },
    ];
    if (conflictsResolved > 0) {
        events.push({
            id: `collab-conflict-${Date.now()}`,
            eventType: "conflict_resolved",
            agentKeys: routedAgents.join(","),
            summary: `Resolved ${conflictsResolved} duplicate recommendations`,
            createdAt: new Date().toISOString(),
        });
    }
    events.push({
        id: `collab-merge-${Date.now()}`,
        eventType: "recommendation_merged",
        agentKeys: "orchestrator",
        summary: `Merged ${mergedCount} executive recommendations`,
        createdAt: new Date().toISOString(),
    });
    if (requiresApproval) {
        events.push({
            id: `collab-approval-${Date.now()}`,
            eventType: "approval_requested",
            agentKeys: "orchestrator",
            summary: "Critical actions pending human approval",
            createdAt: new Date().toISOString(),
        });
    }
    return events;
}

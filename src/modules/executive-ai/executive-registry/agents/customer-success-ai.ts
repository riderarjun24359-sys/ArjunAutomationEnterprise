import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCustomerSuccessRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("cs"),
            agentKey: "customerSuccess",
            title: "Customer health review",
            detail: `${knowledge.businessPlatform.clients} active clients. Monitor renewal signals and satisfaction.`,
            explanation: "Client count and lifecycle AI signals inform health scoring.",
            confidence: 0.86,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform,executive-intelligence-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("cs"),
            agentKey: "customerSuccess",
            title: "Renewal prediction",
            detail: knowledge.businessPlatform.pendingAi > 0 ? `${knowledge.businessPlatform.pendingAi} AI lifecycle recommendations pending client review.` : "No pending renewal risks.",
            explanation: "Churn risk detection from pending AI lifecycle actions.",
            confidence: 0.84,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

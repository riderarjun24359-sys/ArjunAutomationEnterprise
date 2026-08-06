import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCsoRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("cso"),
            agentKey: "cso",
            title: "Pipeline forecast",
            detail: `Score top ${Math.max(1, Math.floor(knowledge.businessPlatform.leads / 3))} leads for consultation scheduling.`,
            explanation: "Lead scoring model applied to business platform pipeline.",
            confidence: 0.87,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("cso"),
            agentKey: "cso",
            title: "Proposal recommendation",
            detail: "Draft proposals for qualified leads with pending consultations.",
            explanation: "Opportunity detection from qualified lead signals.",
            confidence: 0.85,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform,delivery-engine",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

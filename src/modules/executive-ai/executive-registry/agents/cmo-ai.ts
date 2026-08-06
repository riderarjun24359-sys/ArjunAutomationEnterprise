import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCmoRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("cmo"),
            agentKey: "cmo",
            title: "Lead generation insights",
            detail: `${knowledge.businessPlatform.leads} leads in pipeline. Increase SEO content for high-intent service pages.`,
            explanation: "Lead volume drives marketing campaign and SEO recommendations.",
            confidence: 0.83,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("cmo"),
            agentKey: "cmo",
            title: "Campaign planning",
            detail: "Launch case-study campaign targeting enterprise automation buyers.",
            explanation: "Content strategy aligned with knowledge engine assets.",
            confidence: 0.8,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform,knowledge-engine",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

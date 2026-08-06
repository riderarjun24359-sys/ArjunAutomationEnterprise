import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCfoRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("cfo"),
            agentKey: "cfo",
            title: "Revenue pipeline review",
            detail: `${knowledge.businessPlatform.leads} leads, ${knowledge.businessPlatform.clients} active clients. Review open invoices and forecast.`,
            explanation: "Business platform lead/client counts inform revenue intelligence.",
            confidence: 0.88,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform,executive-intelligence-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("cfo"),
            agentKey: "cfo",
            title: "Pricing recommendation",
            detail: "Analyze proposal win rates before adjusting enterprise pricing tiers.",
            explanation: "Pricing changes require human approval per governance policy.",
            confidence: 0.79,
            votes: 1,
            requiresApproval: true,
            status: "pending",
            sourceModules: "business-platform",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

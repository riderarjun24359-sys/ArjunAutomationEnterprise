import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCeoRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("ceo"),
            agentKey: "ceo",
            title: "Executive priority summary",
            detail: `${knowledge.executiveIntelligence.risks} risks and ${knowledge.executiveIntelligence.opportunities} opportunities identified. Unified intelligence ${knowledge.executiveIntelligence.unifiedScore}%.`,
            explanation: "Aggregated EIP risk/opportunity signals for executive prioritization.",
            confidence: 0.9,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "executive-intelligence-platform,business-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("ceo"),
            agentKey: "ceo",
            title: "Strategic prioritization",
            detail: "Prioritize client lifecycle conversion and delivery velocity — both directly impact company health.",
            explanation: "Cross-department impact analysis from business platform and delivery engine.",
            confidence: 0.87,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "business-platform,delivery-engine",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

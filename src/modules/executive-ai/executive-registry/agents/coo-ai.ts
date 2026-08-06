import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCooRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("coo"),
            agentKey: "coo",
            title: "Operations workflow optimization",
            detail: `${knowledge.deliveryEngine.activeEngagements} active deliveries. Align resource allocation with playbook stages.`,
            explanation: "Delivery engine engagement count drives ops resource planning.",
            confidence: 0.86,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "delivery-engine,business-platform",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("coo"),
            agentKey: "coo",
            title: "Delivery monitoring alert",
            detail: knowledge.productionReadiness.alerts > 0 ? `${knowledge.productionReadiness.alerts} production alerts require ops attention.` : "Operations nominal.",
            explanation: "SLA and production alert correlation for operations supervision.",
            confidence: 0.84,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "production-readiness",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateSecurityRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [
        {
            id: uid("sec"),
            agentKey: "security",
            title: "Security posture summary",
            detail: `Production security score ${knowledge.productionReadiness.overallScore > 0 ? "tracked via readiness module" : "pending"}. ${knowledge.productionReadiness.alerts} active alerts.`,
            explanation: "Production readiness module provides security posture baseline.",
            confidence: 0.9,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "production-readiness",
            createdAt: new Date().toISOString(),
        },
        {
            id: uid("sec"),
            agentKey: "security",
            title: "Compliance recommendation",
            detail: "Run permission audit across org-scoped tables before next deployment.",
            explanation: "Deployment-adjacent compliance actions require human approval.",
            confidence: 0.88,
            votes: 1,
            requiresApproval: true,
            status: "pending",
            sourceModules: "production-readiness,executive-intelligence-platform",
            createdAt: new Date().toISOString(),
        },
    ];
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

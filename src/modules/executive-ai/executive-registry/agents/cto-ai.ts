import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../../types";
import { isCritical, uid } from "../agent-utils";

export function generateCtoRecommendations(knowledge: SharedKnowledgeSnapshot): AgentRecommendation[] {
    const recs: AgentRecommendation[] = [];
    if (knowledge.productionReadiness.overallScore < 85) {
        recs.push({
            id: uid("cto"),
            agentKey: "cto",
            title: "Review architecture against production readiness gaps",
            detail: `Production readiness at ${knowledge.productionReadiness.overallScore}%. Prioritize technical debt in low-scoring pillars.`,
            explanation: "Production readiness score below threshold triggers architecture review.",
            confidence: 0.88,
            votes: 2,
            requiresApproval: false,
            status: "pending",
            sourceModules: "production-readiness,delivery-engine",
            createdAt: new Date().toISOString(),
        });
    }
    if (knowledge.deliveryEngine.qualityPassRate < 90) {
        recs.push({
            id: uid("cto"),
            agentKey: "cto",
            title: "Engineering quality gate review",
            detail: `Delivery quality pass rate ${knowledge.deliveryEngine.qualityPassRate}%. Schedule sprint planning for verification fixes.`,
            explanation: "Quality pass rate below 90% indicates engineering risk.",
            confidence: 0.85,
            votes: 1,
            requiresApproval: false,
            status: "pending",
            sourceModules: "delivery-engine",
            createdAt: new Date().toISOString(),
        });
    }
    recs.push({
        id: uid("cto"),
        agentKey: "cto",
        title: "Sprint planning recommendation",
        detail: "Focus next sprint on EIP failure remediation and delivery pipeline automation.",
        explanation: "Sprint focus derived from executive intelligence and delivery signals.",
        confidence: 0.82,
        votes: 1,
        requiresApproval: false,
        status: "pending",
        sourceModules: "executive-intelligence-platform",
        createdAt: new Date().toISOString(),
    });
    return recs.map((r) => ({ ...r, requiresApproval: r.requiresApproval || isCritical(r.title + " " + r.detail) }));
}

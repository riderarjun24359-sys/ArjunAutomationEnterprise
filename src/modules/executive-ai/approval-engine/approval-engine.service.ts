import { CRITICAL_ACTION_KEYWORDS, GOVERNANCE_POLICIES, type ExecutiveAgentKey } from "../constants";
import type { AgentRecommendation, ApprovalRequest } from "../types";

export function requiresHumanApproval(rec: AgentRecommendation): boolean {
    if (rec.requiresApproval) return true;
    const text = `${rec.title} ${rec.detail}`.toLowerCase();
    return CRITICAL_ACTION_KEYWORDS.some((k) => text.includes(k));
}

export function buildApprovalQueue(recommendations: AgentRecommendation[]): ApprovalRequest[] {
    return recommendations
        .filter((r) => requiresHumanApproval(r) && r.status === "pending")
        .map((r) => ({
            id: `approval-${r.id}`,
            agentKey: r.agentKey,
            actionSummary: r.title,
            policyKey: "critical_action",
            status: "pending" as const,
            recommendationId: r.id,
            createdAt: r.createdAt,
        }));
}

export function approveRecommendation(recommendations: AgentRecommendation[], recommendationId: string): AgentRecommendation[] {
    return recommendations.map((r) => (r.id === recommendationId ? { ...r, status: "approved" as const } : r));
}

export function dismissRecommendation(recommendations: AgentRecommendation[], recommendationId: string): AgentRecommendation[] {
    return recommendations.map((r) => (r.id === recommendationId ? { ...r, status: "dismissed" as const } : r));
}

export function getGovernancePolicies() {
    return GOVERNANCE_POLICIES.map((p) => ({ ...p }));
}

export function enforceRoleBoundary(agentKey: ExecutiveAgentKey, action: string): boolean {
    const policy = GOVERNANCE_POLICIES.find((p) => p.key === "role_separation");
    return policy?.enforced ? Boolean(agentKey && action) : true;
}

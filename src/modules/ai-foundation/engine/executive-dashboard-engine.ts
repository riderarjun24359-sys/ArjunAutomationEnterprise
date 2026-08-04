import type { ExecutiveDashboardStats } from "../types";
import { getAgents } from "./agent-registry-engine";
import { getTotalTokens, getTotalCost } from "./cost-usage-engine";
import { getOverallQualityScore } from "./evaluation-center-engine";
import { getGovernancePolicies } from "./ai-governance-engine";

export function getExecutiveDashboard(): ExecutiveDashboardStats {
    const agents = getAgents("active");
    const policies = getGovernancePolicies();
    const avgRisk = policies.reduce((sum, p) => sum + p.riskScore, 0) / policies.length;
    const healthyAgents = agents.filter((a) => a.health === "healthy").length;
    const aiHealthScore = Math.round((healthyAgents / Math.max(agents.length, 1)) * 100);

    return {
        aiHealthScore,
        activeAgents: agents.length,
        modelHealth: aiHealthScore >= 80 ? "healthy" : aiHealthScore >= 50 ? "degraded" : "critical",
        totalTokens: getTotalTokens(),
        totalCostUsd: getTotalCost(),
        qualityScore: getOverallQualityScore(),
        riskScore: Math.round(avgRisk),
        lastUpdatedAt: new Date().toISOString(),
    };
}

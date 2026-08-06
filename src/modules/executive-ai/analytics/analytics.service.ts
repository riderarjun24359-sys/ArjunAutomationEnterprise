import type { AgentRecommendation, SharedKnowledgeSnapshot } from "../types";

export function computeCompanyHealthScore(knowledge: SharedKnowledgeSnapshot, recommendations: AgentRecommendation[]): number {
    const intel = knowledge.executiveIntelligence.unifiedScore;
    const readiness = knowledge.productionReadiness.overallScore;
    const quality = knowledge.deliveryEngine.qualityPassRate;
    const recConfidence = recommendations.length
        ? (recommendations.reduce((s, r) => s + r.confidence, 0) / recommendations.length) * 100
        : 80;
    const alertPenalty = knowledge.productionReadiness.alerts * 3;
    return Math.max(0, Math.min(100, Math.round((intel + readiness + quality + recConfidence) / 4 - alertPenalty)));
}

export function detectTrends(knowledge: SharedKnowledgeSnapshot): string[] {
    const trends: string[] = [];
    if (knowledge.executiveIntelligence.unifiedScore >= 80) trends.push("Intelligence score trending positive");
    if (knowledge.businessPlatform.leads > 5) trends.push("Lead pipeline expanding");
    if (knowledge.productionReadiness.alerts > 0) trends.push("Production alerts increasing");
    return trends;
}

import type { AgentRecommendation } from "../types";

export function resolveConflicts(recommendations: AgentRecommendation[]): { merged: AgentRecommendation[]; resolved: number } {
    const seen = new Map<string, AgentRecommendation>();
    let resolved = 0;
    for (const rec of recommendations) {
        const key = rec.title.toLowerCase().slice(0, 40);
        const existing = seen.get(key);
        if (existing) {
            if (rec.confidence > existing.confidence) {
                seen.set(key, { ...rec, detail: `${rec.detail} (Merged — higher confidence)` });
            }
            resolved += 1;
        } else {
            seen.set(key, rec);
        }
    }
    return { merged: Array.from(seen.values()), resolved };
}

export function explainRecommendation(rec: AgentRecommendation): string {
    return rec.explanation || `Recommendation from ${rec.agentKey} based on ${rec.sourceModules}. Confidence: ${Math.round(rec.confidence * 100)}%.`;
}

export function rankRecommendations(recommendations: AgentRecommendation[]): AgentRecommendation[] {
    return [...recommendations].sort((a, b) => b.confidence - a.confidence || b.votes - a.votes);
}

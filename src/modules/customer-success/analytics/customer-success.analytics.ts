import type { CustomerSuccessSnapshot } from "../types/os";

export interface CustomerSuccessAnalyticsSummary {
    healthyShare: number;
    atRiskShare: number;
    renewalCoverageUsd: number;
    expansionCoverageUsd: number;
    churnEscalations: number;
    timelineVelocity: number;
}

export function buildCustomerSuccessAnalytics(snapshot: CustomerSuccessSnapshot): CustomerSuccessAnalyticsSummary {
    const total = snapshot.healthCenter.length || 1;
    const healthy = snapshot.healthCenter.filter((h) => h.overallHealthScore >= 80).length;
    const atRisk = snapshot.healthCenter.filter((h) => h.overallHealthScore < 60).length;
    return {
        healthyShare: Math.round((healthy / total) * 100),
        atRiskShare: Math.round((atRisk / total) * 100),
        renewalCoverageUsd: snapshot.renewals.reduce((s, r) => s + r.renewalForecastUsd, 0),
        expansionCoverageUsd: snapshot.stats.expansionPipelineUsd,
        churnEscalations: snapshot.churnPrevention.filter((c) => c.escalationLevel !== "none").length,
        timelineVelocity: snapshot.timeline.length,
    };
}

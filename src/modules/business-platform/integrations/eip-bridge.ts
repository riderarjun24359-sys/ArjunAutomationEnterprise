import type { BusinessPlatformDashboard } from "@/src/modules/business-platform/types";
import type { EipDashboardStats } from "@/src/modules/enterprise-intelligence-platform/types";
import type { AixDashboardStats } from "@/src/modules/executive-intelligence/types";

export interface ExecutiveIntelStrip {
    unifiedScore: number;
    riskScore: number;
    opportunityCount: number;
    pendingRecommendations: number;
    openTasks: number;
    activeClients: number;
    revenueForecastTotal: number;
}

export function buildExecutiveIntelFromEip(eip: EipDashboardStats): Partial<ExecutiveIntelStrip> {
    return {
        unifiedScore: eip.overallIntelligenceScore,
        riskScore: eip.riskScore,
        revenueForecastTotal: eip.revenueForecastTotal,
    };
}

export function buildExecutiveIntelFromAix(aix: AixDashboardStats): Partial<ExecutiveIntelStrip> {
    return {
        pendingRecommendations: aix.recommendationCount,
        opportunityCount: Math.max(0, Math.round(aix.growthScore / 10)),
    };
}

export function buildExecutiveIntelFromBusiness(
    business: BusinessPlatformDashboard | null,
): Partial<ExecutiveIntelStrip> {
    if (!business) return {};
    return {
        activeClients: business.activeClients ?? 0,
        pendingRecommendations: business.pendingAiRecommendations ?? 0,
    };
}

export function mergeExecutiveIntel(
    eip: EipDashboardStats,
    aix: AixDashboardStats,
    business: BusinessPlatformDashboard | null,
    openTasks: number,
): ExecutiveIntelStrip {
    return {
        unifiedScore: Math.round((eip.overallIntelligenceScore + aix.avgAiConfidenceScore + aix.businessScore) / 3),
        riskScore: Math.max(eip.riskScore, aix.openRiskCount * 10),
        opportunityCount: Math.max(1, Math.round((eip.growthScore + aix.growthScore) / 20)),
        pendingRecommendations: aix.recommendationCount + (business?.pendingAiRecommendations ?? 0),
        openTasks,
        activeClients: business?.activeClients ?? 0,
        revenueForecastTotal: eip.revenueForecastTotal,
    };
}

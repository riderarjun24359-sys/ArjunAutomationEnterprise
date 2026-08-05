import type { ExecutiveRawSignals, ExecutiveRiskItem } from "../../types";

export function runRiskEngine(signals: ExecutiveRawSignals): ExecutiveRiskItem[] {
    const { eip, aix, business } = signals;
    const risks: ExecutiveRiskItem[] = [];

    if (eip.riskScore > 50) {
        risks.push({
            id: "risk-eip-score",
            title: "Elevated enterprise risk score",
            detail: `EIP risk index at ${eip.riskScore} — review forecasts and strategic insights.`,
            severity: eip.riskScore > 75 ? "critical" : "high",
            module: "business",
            score: eip.riskScore,
        });
    }

    if (eip.openIntelligenceFailureCount > 0) {
        risks.push({
            id: "risk-intelligence-failures",
            title: "Intelligence pipeline degradation",
            detail: `${eip.openIntelligenceFailureCount} open EIP failures threaten data freshness.`,
            severity: "high",
            module: "cto",
            score: eip.openIntelligenceFailureCount * 15,
        });
    }

    if (aix.securityScore < 70) {
        risks.push({
            id: "risk-security-posture",
            title: "Security health below target",
            detail: `AIX security score ${aix.securityScore}% — review permission and compliance signals.`,
            severity: aix.securityScore < 50 ? "critical" : "high",
            module: "cto",
            score: 100 - aix.securityScore,
        });
    }

    if (aix.openRiskCount > 0) {
        risks.push({
            id: "risk-executive-register",
            title: "Unresolved executive risks",
            detail: `${aix.openRiskCount} items in business risk register.`,
            severity: "high",
            module: "business",
            score: aix.openRiskCount * 12,
        });
    }

    if (business && business.activeProjects > 0 && business.pendingAiRecommendations > 3) {
        risks.push({
            id: "risk-delivery-backlog",
            title: "Delivery recommendation backlog",
            detail: "Multiple AI recommendations pending may indicate schedule pressure.",
            severity: "medium",
            module: "project",
            score: business.pendingAiRecommendations * 8,
        });
    }

    if (risks.length === 0) {
        risks.push({
            id: "risk-none",
            title: "Risk posture stable",
            detail: "No elevated risks detected across EIP, AIX, or business platform.",
            severity: "low",
            module: "operations",
            score: 0,
        });
    }

    return risks.sort((a, b) => b.score - a.score);
}

import type { ExecutiveRawSignals, ExecutiveRecommendationItem } from "../../types";

export function runRecommendationEngine(signals: ExecutiveRawSignals): ExecutiveRecommendationItem[] {
    const { eip, aix, business, overview } = signals;
    const recommendations: ExecutiveRecommendationItem[] = [];

    if (eip.crossModuleInsightCount > 0) {
        recommendations.push({
            id: "rec-cross-module",
            title: "Review cross-module insights",
            detail: `${eip.crossModuleInsightCount} EIP insights ready for executive review.`,
            module: "business",
            requiresApproval: false,
            confidence: 0.85,
        });
    }

    if (aix.recommendationCount > 0) {
        recommendations.push({
            id: "rec-aix-outputs",
            title: "Process AIX recommendations",
            detail: `${aix.recommendationCount} evidence-backed recommendations awaiting action.`,
            module: "operations",
            requiresApproval: true,
            confidence: aix.avgAiConfidenceScore / 100,
        });
    }

    if (eip.operationalEfficiencyScore < 75) {
        recommendations.push({
            id: "rec-ops-efficiency",
            title: "Improve operational efficiency",
            detail: `Efficiency score ${eip.operationalEfficiencyScore}% — audit workflows and automation health.`,
            module: "operations",
            requiresApproval: false,
            confidence: 0.78,
        });
    }

    if (overview.openTasks > 5) {
        recommendations.push({
            id: "rec-task-triage",
            title: "Triage open task backlog",
            detail: "Assign owners and deadlines to reduce operational drag.",
            module: "project",
            requiresApproval: false,
            confidence: 0.9,
        });
    }

    if (business && business.consultationsScheduled > 0) {
        recommendations.push({
            id: "rec-consultation-prep",
            title: "Prepare consultation briefs",
            detail: "Generate client context packs before scheduled consultations.",
            module: "customer",
            requiresApproval: false,
            confidence: 0.82,
        });
    }

    if (aix.securityScore < 80) {
        recommendations.push({
            id: "rec-security-review",
            title: "Schedule security review",
            detail: "Run permission audit and compliance check across tenants.",
            module: "cto",
            requiresApproval: true,
            confidence: 0.88,
        });
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
}

import { INTELLIGENCE_MODULES } from "../constants";
import type { ExecutiveRawSignals, IntelligenceModuleSnapshot, ModuleHealth } from "../types";

function healthFromScore(score: number): ModuleHealth {
    if (score >= 75) return "healthy";
    if (score >= 50) return "watch";
    return "critical";
}

export function buildIntelligenceModules(signals: ExecutiveRawSignals): IntelligenceModuleSnapshot[] {
    const { eip, aix, business, overview } = signals;

    return [
        {
            key: "cto",
            label: INTELLIGENCE_MODULES.cto.label,
            description: INTELLIGENCE_MODULES.cto.description,
            score: Math.round((eip.overallIntelligenceScore + aix.securityScore + (100 - eip.riskScore)) / 3),
            status: healthFromScore(Math.round((aix.securityScore + eip.businessHealthScore) / 2)),
            metrics: [
                { label: "Intelligence score", value: eip.overallIntelligenceScore, trend: "up" },
                { label: "Security score", value: `${aix.securityScore}%`, trend: aix.securityScore >= 80 ? "up" : "down" },
                { label: "Open failures", value: eip.openIntelligenceFailureCount, trend: eip.openIntelligenceFailureCount > 0 ? "down" : "up" },
                { label: "KPI registry", value: eip.kpiRegistryCount, trend: "flat" },
            ],
            highlights: [
                eip.openIntelligenceFailureCount > 0
                    ? "Review EIP intelligence failures"
                    : "Engineering intelligence pipeline stable",
                aix.securityScore < 80 ? "Security posture needs attention" : "Security within target range",
            ],
        },
        {
            key: "operations",
            label: INTELLIGENCE_MODULES.operations.label,
            description: INTELLIGENCE_MODULES.operations.description,
            score: Math.round((eip.operationalEfficiencyScore + aix.operationalScore) / 2),
            status: healthFromScore(Math.round((eip.operationalEfficiencyScore + aix.operationalScore) / 2)),
            metrics: [
                { label: "Efficiency", value: `${eip.operationalEfficiencyScore}%`, trend: "up" },
                { label: "AI failures", value: aix.openFailureCount, trend: aix.openFailureCount > 0 ? "down" : "up" },
                { label: "Audit events", value: overview.auditCount, trend: "flat" },
                { label: "Open tasks", value: overview.openTasks, trend: overview.openTasks > 5 ? "down" : "up" },
            ],
            highlights: [
                aix.openFailureCount > 0 ? "AIX job failures detected" : "Automation health nominal",
                overview.openTasks > 0 ? `${overview.openTasks} tasks need triage` : "Task queue clear",
            ],
        },
        {
            key: "business",
            label: INTELLIGENCE_MODULES.business.label,
            description: INTELLIGENCE_MODULES.business.description,
            score: Math.round((eip.businessHealthScore + aix.businessScore + eip.growthScore) / 3),
            status: healthFromScore(Math.round((eip.businessHealthScore + aix.businessScore) / 2)),
            metrics: [
                { label: "Business health", value: `${eip.businessHealthScore}%`, trend: "up" },
                { label: "Growth score", value: `${eip.growthScore}%`, trend: "up" },
                { label: "Revenue forecast", value: eip.revenueForecastTotal.toLocaleString(), trend: "up" },
                { label: "Open risks", value: aix.openRiskCount, trend: aix.openRiskCount > 0 ? "down" : "up" },
            ],
            highlights: [
                eip.revenueForecastTotal > 0 ? "Revenue forecast data available" : "Connect finance for forecasts",
                aix.openRiskCount > 0 ? `${aix.openRiskCount} risks in register` : "Risk register clear",
            ],
        },
        {
            key: "customer",
            label: INTELLIGENCE_MODULES.customer.label,
            description: INTELLIGENCE_MODULES.customer.description,
            score: Math.round((aix.customerScore + (business?.activeClients ?? 0) * 5) / 2),
            status: healthFromScore(aix.customerScore),
            metrics: [
                { label: "Customer score", value: `${aix.customerScore}%`, trend: "up" },
                { label: "Active clients", value: business?.activeClients ?? 0, trend: "up" },
                { label: "Consultations", value: business?.consultationsScheduled ?? 0, trend: "flat" },
                { label: "Leads", value: business?.leadsCount ?? 0, trend: "up" },
            ],
            highlights: [
                (business?.pendingAiRecommendations ?? 0) > 0
                    ? `${business?.pendingAiRecommendations} AI recommendations pending`
                    : "Client lifecycle signals healthy",
            ],
        },
        {
            key: "project",
            label: INTELLIGENCE_MODULES.project.label,
            description: INTELLIGENCE_MODULES.project.description,
            score: Math.round((100 - Math.min(overview.openTasks * 3, 60) + (business?.activeProjects ?? 0) * 5) / 2),
            status: healthFromScore(100 - Math.min(overview.openTasks * 5, 50)),
            metrics: [
                { label: "Active projects", value: business?.activeProjects ?? 0, trend: "up" },
                { label: "Open tasks", value: overview.openTasks, trend: overview.openTasks > 5 ? "down" : "up" },
                { label: "Team members", value: overview.teamCount, trend: "flat" },
                { label: "Draft proposals", value: business?.proposalsDraft ?? 0, trend: "flat" },
            ],
            highlights: [
                overview.openTasks > 10 ? "Schedule risk elevated — triage backlog" : "Delivery confidence stable",
            ],
        },
    ];
}

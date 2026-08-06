import type { SecurityCenterSnapshot } from "../types/os";

export interface SecurityOsAnalyticsSummary {
    alertPressure: number;
    mfaCoverage: number;
    complianceCoverage: number;
    sessionLoad: number;
    apiRiskShare: number;
    auditVelocity: number;
}

export function buildSecurityOsAnalytics(snapshot: SecurityCenterSnapshot): SecurityOsAnalyticsSummary {
    const apiTotal = snapshot.apiSecurity.filter((a) => a.kind === "api_key").length || 1;
    const apiRisk = snapshot.apiSecurity.filter((a) => a.kind === "api_key" && a.risk !== "low").length;
    const frameworksPresent = new Set(snapshot.compliance.map((c) => c.framework)).size;

    return {
        alertPressure: snapshot.stats.openAlerts,
        mfaCoverage: snapshot.executiveWidgets.mfaCoverage,
        complianceCoverage: Math.round((frameworksPresent / 3) * 100),
        sessionLoad: snapshot.stats.activeSessions,
        apiRiskShare: Math.round((apiRisk / apiTotal) * 100),
        auditVelocity: snapshot.stats.auditEvents,
    };
}

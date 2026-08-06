import type { AiSecurityAssistant, SecurityCenterSnapshot } from "../types/os";

export function buildAiSecurityAssistant(snapshot: Omit<SecurityCenterSnapshot, "assistant">): AiSecurityAssistant {
    const attention = [
        ...snapshot.alerts.filter((a) => !a.resolvedAt).slice(0, 4).map((a) => `${a.severity}: ${a.title}`),
        ...snapshot.securityEvents
            .filter((e) => e.riskScore >= 60)
            .slice(0, 3)
            .map((e) => `Risk ${e.riskScore} · ${e.eventType}`),
        ...snapshot.apiSecurity
            .filter((a) => a.risk !== "low")
            .slice(0, 2)
            .map((a) => `API ${a.name} risk ${a.risk}`),
    ].slice(0, 8);

    const frameworks = ["ISO 27001", "SOC 2", "GDPR"] as const;
    const complianceRecommendations = frameworks.map((fw) => {
        const rows = snapshot.compliance.filter((c) => c.framework === fw);
        if (rows.length === 0) return `${fw}: no live reviews yet — schedule compliance evidence collection.`;
        const avg = Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
        return `${fw}: ${rows.length} control(s), avg score ${avg}.`;
    });

    const accessInsights = [
        `${snapshot.stats.roles} roles · ${snapshot.permissions.filter((p) => p.source === "permission").length} permissions.`,
        `${snapshot.stats.mfaEnrollments} MFA enrollments · coverage ${snapshot.executiveWidgets.mfaCoverage}.`,
        `${snapshot.stats.activeSessions} active sessions.`,
    ];

    const incidentInsights = snapshot.securityEvents.slice(0, 5).map(
        (e) => `${e.eventType}: score ${e.riskScore}, action ${e.actionTaken || "none"}, status ${e.status}.`,
    );

    const dailySummary = [
        `Security score ${snapshot.stats.securityScore}.`,
        `${snapshot.stats.openAlerts} open alerts · ${snapshot.executiveWidgets.unresolvedRisks} unresolved risks.`,
        `${snapshot.stats.complianceControls} compliance controls · ${snapshot.stats.backupConfigs} backup configs.`,
        `${snapshot.stats.auditEvents} audit events in window.`,
    ].join(" ");

    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No critical security attention items.",
        complianceRecommendations[0],
    ].join(" ");

    return {
        dailySummary,
        attentionItems: attention,
        complianceRecommendations,
        accessInsights,
        incidentInsights,
        executiveSummary,
        generatedAt: new Date().toISOString(),
    };
}

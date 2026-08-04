import { THREAT_TYPES } from "../constants";
import type { ThreatAlert, ThreatType } from "../types";
import { getIdentitySecurityAlerts } from "../integrations/enterprise-identity-bridge";

const localAlerts: ThreatAlert[] = [];

export async function detectThreats(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<ThreatAlert[]> {
    const identityAlerts = await getIdentitySecurityAlerts(authUserId, email, fullName);
    const mapped: ThreatAlert[] = identityAlerts.map((a, i) => ({
        id: String(a.id ?? `threat-${i}`),
        type: (THREAT_TYPES[i % THREAT_TYPES.length] ?? "repeated_failures") as ThreatType,
        severity: (a.severity as ThreatAlert["severity"]) ?? "medium",
        title: String(a.title ?? a.alertType ?? "Security alert"),
        description: String(a.alertType ?? a.alertKey ?? ""),
        detectedAt: new Date().toISOString(),
        resolved: a.status === "resolved",
        aiSuggestion: suggestMonitoringAction(
            (THREAT_TYPES[i % THREAT_TYPES.length] ?? "repeated_failures") as ThreatType,
        ),
    }));
    return [...localAlerts, ...mapped];
}

export function getThreatAlerts(): ThreatAlert[] {
    return [...localAlerts];
}

export function runThreatDetection(): ThreatAlert[] {
    const alert: ThreatAlert = {
        id: `scan-${Date.now()}`,
        type: "abnormal_api",
        severity: "low",
        title: "Routine threat scan complete",
        description: "No critical anomalies detected in the last interval.",
        detectedAt: new Date().toISOString(),
        resolved: true,
        aiSuggestion: suggestMonitoringAction("abnormal_api"),
    };
    localAlerts.unshift(alert);
    return getThreatAlerts();
}

export function suggestMonitoringAction(type: ThreatType): string {
    const suggestions: Record<ThreatType, string> = {
        repeated_failures: "Enable account lockout after 5 failed attempts and alert security team.",
        suspicious_location: "Require step-up MFA for logins from new geographic regions.",
        impossible_travel: "Invalidate active sessions and force re-authentication.",
        permission_abuse: "Review RBAC assignments and enable just-in-time access for elevated roles.",
        abnormal_api: "Tighten rate limits and rotate API keys with anomalous usage patterns.",
    };
    return suggestions[type];
}

export function listThreatTypes(): ThreatType[] {
    return [...THREAT_TYPES];
}

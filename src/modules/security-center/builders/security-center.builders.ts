import type { SecurityCenterRawData } from "../types/raw";
import type {
    ApiSecurityItem,
    AuditLogExplorerItem,
    BackupDrItem,
    ComplianceCenterItem,
    ExecutiveSecurityWidgets,
    MfaManagementItem,
    PermissionManagerItem,
    RbacRoleItem,
    SecurityAlertItem,
    SecurityCenterSnapshot,
    SecurityEventItem,
    SecurityOpsMetric,
    SessionManagementItem,
} from "../types/os";
import { asStringArray, clampScore, mapComplianceFramework } from "../utils/os-formatters";

export function buildOpsDashboard(data: SecurityCenterRawData): SecurityOpsMetric[] {
    const openAlerts = data.securityAlerts.filter((a) => !a.resolved_at).length;
    const activeSessions = data.activeSessions.filter((s) => s.status.toLowerCase() === "active").length;
    const mfaActive = data.mfaEnrollments.filter((e) => e.status.toLowerCase() === "active").length;
    const health = Number(data.identityHealth[0]?.overall_score ?? 0);
    const unresolvedRisks = data.riskEvents.filter((r) => r.status.toLowerCase() !== "resolved").length;
    const backupEnabled = data.backupConfigs.filter((c) => c.is_enabled).length;

    return [
        {
            id: "score",
            label: "Identity Health",
            value: String(clampScore(health || 70)),
            status: health >= 80 || health === 0 ? "healthy" : health >= 60 ? "watch" : "critical",
            detail: data.identityHealth[0]?.status ?? "No identity health snapshot",
        },
        {
            id: "alerts",
            label: "Open Alerts",
            value: String(openAlerts),
            status: openAlerts === 0 ? "healthy" : openAlerts < 5 ? "watch" : "critical",
            detail: `${data.securityAlerts.length} total alerts`,
        },
        {
            id: "sessions",
            label: "Active Sessions",
            value: String(activeSessions),
            status: "healthy",
            detail: `${data.activeSessions.length} tracked sessions`,
        },
        {
            id: "mfa",
            label: "MFA Enrollments",
            value: String(mfaActive),
            status: mfaActive > 0 ? "healthy" : "watch",
            detail: `${data.mfaPolicies.length} MFA policies`,
        },
        {
            id: "risks",
            label: "Unresolved Risks",
            value: String(unresolvedRisks),
            status: unresolvedRisks === 0 ? "healthy" : unresolvedRisks < 3 ? "watch" : "critical",
            detail: `${data.riskEvents.length} risk events`,
        },
        {
            id: "backup",
            label: "Backup Configs",
            value: String(backupEnabled),
            status: backupEnabled > 0 ? "healthy" : "watch",
            detail: `${data.disasterPlans.length} DR plans`,
        },
    ];
}

export function buildRbac(data: SecurityCenterRawData): RbacRoleItem[] {
    const settings = data.roles.map((r) => ({
        id: r.id,
        source: "settings" as const,
        name: r.name,
        key: r.name,
        permissionCount: data.roleGrants.filter((g) => g.role_id === r.id).length,
        isSystem: r.is_system,
        status: "active",
    }));

    const idp = data.idpRbacRoles.map((r) => ({
        id: r.id,
        source: "idp" as const,
        name: r.role_name,
        key: r.role_key,
        permissionCount: asStringArray(r.permissions).length,
        isSystem: r.is_system,
        status: r.status,
    }));

    return [...settings, ...idp];
}

export function buildPermissions(data: SecurityCenterRawData): PermissionManagerItem[] {
    const perms = data.permissions.map((p) => ({
        id: p.id,
        source: "permission" as const,
        name: p.key,
        key: p.key,
        detail: p.description || p.resource || "Platform permission",
        status: "active",
    }));

    const groups = data.idpPermissionGroups.map((g) => ({
        id: g.id,
        source: "group" as const,
        name: g.group_name,
        key: g.group_key,
        detail: `${asStringArray(g.permissions).length} grouped permissions`,
        status: g.status,
    }));

    const grants = data.roleGrants.slice(0, 100).map((g) => {
        const role = data.roles.find((r) => r.id === g.role_id);
        const perm = data.permissions.find((p) => p.id === g.permission_id);
        return {
            id: g.id,
            source: "grant" as const,
            name: `${role?.name ?? "role"} → ${perm?.key ?? g.permission_id}`,
            key: g.action,
            detail: `Grant action ${g.action}`,
            status: "granted",
        };
    });

    return [...perms, ...groups, ...grants];
}

export function buildAuditExplorer(data: SecurityCenterRawData): AuditLogExplorerItem[] {
    const idp = data.idpAuditLogs.map((a) => ({
        id: a.id,
        source: "idp" as const,
        entityType: a.entity_type,
        action: a.action,
        summary: a.summary,
        securityLevel: a.security_level,
        occurredAt: a.created_at,
        actor: a.performed_by ?? null,
    }));

    const activity = data.activityLogs
        .filter((a) => {
            const t = a.entity_type.toLowerCase();
            return t.includes("security") || t.includes("auth") || t.includes("role") || t.includes("mfa") || t.includes("session");
        })
        .map((a) => ({
            id: a.id,
            source: "activity" as const,
            entityType: a.entity_type,
            action: a.action,
            summary: a.title || a.detail,
            securityLevel: "standard",
            occurredAt: a.created_at,
            actor: a.user_id ?? null,
        }));

    return [...idp, ...activity]
        .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
        .slice(0, 80);
}

export function buildSecurityEvents(data: SecurityCenterRawData): SecurityEventItem[] {
    return data.riskEvents
        .map((e) => ({
            id: e.id,
            eventType: e.event_key,
            riskScore: clampScore(Number(e.risk_score ?? 0)),
            riskFactors: asStringArray(e.risk_factors),
            actionTaken: e.action_taken,
            status: e.status,
            occurredAt: e.created_at,
        }))
        .sort((a, b) => b.riskScore - a.riskScore);
}

export function buildMfa(data: SecurityCenterRawData): MfaManagementItem[] {
    const policies = data.mfaPolicies.map((p) => ({
        id: p.id,
        kind: "policy" as const,
        name: p.name,
        method: asStringArray(p.required_methods).join(", ") || "policy",
        status: p.status,
        detail: `Grace ${p.grace_period_days}d · admins ${p.enforce_for_admins ? "enforced" : "optional"}`,
        lastUsedAt: null,
    }));

    const enrollments = data.mfaEnrollments.map((e) => ({
        id: e.id,
        kind: "enrollment" as const,
        name: e.enrollment_key,
        method: e.mfa_type,
        status: e.status,
        detail: `User ${e.user_id ?? "unassigned"}`,
        lastUsedAt: e.last_used_at ?? null,
    }));

    return [...policies, ...enrollments];
}

export function buildSessions(data: SecurityCenterRawData): SessionManagementItem[] {
    return data.activeSessions
        .map((s) => ({
            id: s.id,
            userId: s.user_id ?? null,
            deviceName: s.device_name,
            ipAddress: s.ip_address,
            lastActiveAt: s.last_active_at,
            expiresAt: s.expires_at ?? null,
            status: s.status,
        }))
        .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
}

export function buildApiSecurity(data: SecurityCenterRawData): ApiSecurityItem[] {
    const keys = data.apiKeys.map((k) => {
        const expired = k.expires_at ? new Date(k.expires_at).getTime() < Date.now() : false;
        const inactive = k.status.toLowerCase() !== "active";
        return {
            id: k.id,
            kind: "api_key" as const,
            name: k.key_name,
            detail: `${k.key_prefix}… · ${k.api_version}`,
            status: k.status,
            risk: (expired || inactive ? "high" : "low") as "low" | "medium" | "high",
        };
    });

    const limits = data.rateLimits.map((r) => ({
        id: r.id,
        kind: "rate_limit" as const,
        name: r.limit_name,
        detail: `${r.rate_limit_rpm} rpm · burst ${r.burst_limit}`,
        status: r.status,
        risk: (r.rate_limit_rpm > 1000 ? "medium" : "low") as "low" | "medium" | "high",
    }));

    return [...keys, ...limits];
}

export function buildCompliance(data: SecurityCenterRawData): ComplianceCenterItem[] {
    const fromElr = data.complianceReviews.map((r) => ({
        id: r.id,
        framework: mapComplianceFramework(r.compliance_type),
        title: r.review_key,
        score: clampScore(Number(r.review_score ?? 0)),
        status: r.status,
        summary: r.review_summary,
        reviewedAt: r.reviewed_at,
        source: "elr" as const,
    }));

    const fromAix = data.complianceWarnings.map((w) => ({
        id: w.id,
        framework: mapComplianceFramework(w.compliance_type),
        title: w.warning_key,
        score: clampScore(100 - Number(w.ai_confidence_score ?? 0)),
        status: w.status,
        summary: w.warning_message,
        reviewedAt: w.detected_at,
        source: "aix" as const,
    }));

    // Ensure ISO 27001 / SOC 2 / GDPR appear when live reviews exist for related types; no fabricated scores.
    return [...fromElr, ...fromAix].sort((a, b) => a.framework.localeCompare(b.framework));
}

export function buildBackupDr(data: SecurityCenterRawData): BackupDrItem[] {
    const configs = data.backupConfigs.map((c) => ({
        id: c.id,
        kind: "backup_config" as const,
        name: c.name,
        status: c.is_enabled ? "enabled" : "disabled",
        detail: `${c.schedule_cron} · retain ${c.retention_count} · ${c.destination}`,
        occurredAt: c.updated_at,
    }));

    const runs = data.backupRuns.map((r) => ({
        id: r.id,
        kind: "backup_run" as const,
        name: `Run ${r.id.slice(0, 8)}`,
        status: r.status,
        detail: r.error_message || `${r.size_bytes} bytes · ${r.storage_path}`,
        occurredAt: r.started_at,
    }));

    const plans = data.disasterPlans.map((p) => ({
        id: p.id,
        kind: "dr_plan" as const,
        name: p.name,
        status: p.status,
        detail: `RTO ${p.rto_minutes}m · RPO ${p.rpo_minutes}m`,
        occurredAt: p.updated_at,
    }));

    return [...configs, ...runs, ...plans];
}

export function buildAlerts(data: SecurityCenterRawData): SecurityAlertItem[] {
    return data.securityAlerts
        .map((a) => ({
            id: a.id,
            title: a.title,
            alertType: a.alert_type,
            severity: a.severity,
            description: a.description,
            status: a.status,
            resolvedAt: a.resolved_at ?? null,
            createdAt: a.created_at,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function buildExecutiveWidgets(input: {
    ops: SecurityOpsMetric[];
    alerts: SecurityAlertItem[];
    sessions: SessionManagementItem[];
    mfa: MfaManagementItem[];
    compliance: ComplianceCenterItem[];
    events: SecurityEventItem[];
    apiSecurity: ApiSecurityItem[];
    audit: AuditLogExplorerItem[];
}): ExecutiveSecurityWidgets {
    const health = Number(input.ops.find((o) => o.id === "score")?.value ?? 70);
    const enrollments = input.mfa.filter((m) => m.kind === "enrollment" && m.status.toLowerCase() === "active").length;
    const policies = input.mfa.filter((m) => m.kind === "policy").length || 1;
    const mfaCoverage = clampScore((enrollments / Math.max(policies, 1)) * 40 + (enrollments > 0 ? 40 : 0));
    const complianceAvg =
        input.compliance.length === 0
            ? 0
            : Math.round(input.compliance.reduce((s, c) => s + c.score, 0) / input.compliance.length);

    return {
        securityScore: clampScore(health),
        openAlerts: input.alerts.filter((a) => !a.resolvedAt).length,
        activeSessions: input.sessions.filter((s) => s.status.toLowerCase() === "active").length,
        mfaCoverage,
        complianceAvgScore: complianceAvg,
        unresolvedRisks: input.events.filter((e) => e.status.toLowerCase() !== "resolved").length,
        apiKeysAtRisk: input.apiSecurity.filter((a) => a.kind === "api_key" && a.risk !== "low").length,
        recentAuditCount: input.audit.length,
    };
}

export function createEmptySecurityCenterSnapshot(): SecurityCenterSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            securityScore: 0,
            roles: 0,
            openAlerts: 0,
            activeSessions: 0,
            mfaEnrollments: 0,
            complianceControls: 0,
            backupConfigs: 0,
            auditEvents: 0,
        },
        opsDashboard: [],
        rbac: [],
        permissions: [],
        auditTrail: [],
        securityEvents: [],
        mfa: [],
        sessions: [],
        apiSecurity: [],
        compliance: [],
        backupDr: [],
        alerts: [],
        executiveWidgets: {
            securityScore: 0,
            openAlerts: 0,
            activeSessions: 0,
            mfaCoverage: 0,
            complianceAvgScore: 0,
            unresolvedRisks: 0,
            apiKeysAtRisk: 0,
            recentAuditCount: 0,
        },
        assistant: {
            dailySummary: "No organization context loaded.",
            attentionItems: [],
            complianceRecommendations: [],
            accessInsights: [],
            incidentInsights: [],
            executiveSummary: "Sign in to load Security & Compliance Center.",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function buildSecurityCenterSnapshot(data: SecurityCenterRawData): SecurityCenterSnapshot {
    const opsDashboard = buildOpsDashboard(data);
    const rbac = buildRbac(data);
    const permissions = buildPermissions(data);
    const auditTrail = buildAuditExplorer(data);
    const securityEvents = buildSecurityEvents(data);
    const mfa = buildMfa(data);
    const sessions = buildSessions(data);
    const apiSecurity = buildApiSecurity(data);
    const compliance = buildCompliance(data);
    const backupDr = buildBackupDr(data);
    const alerts = buildAlerts(data);
    const executiveWidgets = buildExecutiveWidgets({
        ops: opsDashboard,
        alerts,
        sessions,
        mfa,
        compliance,
        events: securityEvents,
        apiSecurity,
        audit: auditTrail,
    });

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats: {
            securityScore: executiveWidgets.securityScore,
            roles: rbac.length,
            openAlerts: executiveWidgets.openAlerts,
            activeSessions: executiveWidgets.activeSessions,
            mfaEnrollments: mfa.filter((m) => m.kind === "enrollment").length,
            complianceControls: compliance.length,
            backupConfigs: data.backupConfigs.length,
            auditEvents: auditTrail.length,
        },
        opsDashboard,
        rbac,
        permissions,
        auditTrail,
        securityEvents,
        mfa,
        sessions,
        apiSecurity,
        compliance,
        backupDr,
        alerts,
        executiveWidgets,
        assistant: {
            dailySummary: "",
            attentionItems: [],
            complianceRecommendations: [],
            accessInsights: [],
            incidentInsights: [],
            executiveSummary: "",
            generatedAt: data.fetchedAt,
        },
    };
}

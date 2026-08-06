export type SecurityOsTab =
    | "ops"
    | "rbac"
    | "permissions"
    | "audit"
    | "events"
    | "mfa"
    | "sessions"
    | "api-security"
    | "compliance"
    | "backup"
    | "alerts"
    | "assistant";

export interface SecurityOpsMetric {
    id: string;
    label: string;
    value: string;
    status: "healthy" | "watch" | "critical";
    detail: string;
}

export interface RbacRoleItem {
    id: string;
    source: "settings" | "idp";
    name: string;
    key: string;
    permissionCount: number;
    isSystem: boolean;
    status: string;
}

export interface PermissionManagerItem {
    id: string;
    source: "permission" | "group" | "grant";
    name: string;
    key: string;
    detail: string;
    status: string;
}

export interface AuditLogExplorerItem {
    id: string;
    source: "idp" | "activity";
    entityType: string;
    action: string;
    summary: string;
    securityLevel: string;
    occurredAt: string;
    actor: string | null;
}

export interface SecurityEventItem {
    id: string;
    eventType: string;
    riskScore: number;
    riskFactors: string[];
    actionTaken: string;
    status: string;
    occurredAt: string;
}

export interface MfaManagementItem {
    id: string;
    kind: "policy" | "enrollment";
    name: string;
    method: string;
    status: string;
    detail: string;
    lastUsedAt: string | null;
}

export interface SessionManagementItem {
    id: string;
    userId: string | null;
    deviceName: string;
    ipAddress: string;
    lastActiveAt: string;
    expiresAt: string | null;
    status: string;
}

export interface ApiSecurityItem {
    id: string;
    kind: "api_key" | "rate_limit";
    name: string;
    detail: string;
    status: string;
    risk: "low" | "medium" | "high";
}

export interface ComplianceCenterItem {
    id: string;
    framework: "ISO 27001" | "SOC 2" | "GDPR" | "Other";
    title: string;
    score: number;
    status: string;
    summary: string;
    reviewedAt: string | null;
    source: "elr" | "aix";
}

export interface BackupDrItem {
    id: string;
    kind: "backup_config" | "backup_run" | "dr_plan";
    name: string;
    status: string;
    detail: string;
    occurredAt: string | null;
}

export interface SecurityAlertItem {
    id: string;
    title: string;
    alertType: string;
    severity: string;
    description: string;
    status: string;
    resolvedAt: string | null;
    createdAt: string;
}

export interface ExecutiveSecurityWidgets {
    securityScore: number;
    openAlerts: number;
    activeSessions: number;
    mfaCoverage: number;
    complianceAvgScore: number;
    unresolvedRisks: number;
    apiKeysAtRisk: number;
    recentAuditCount: number;
}

export interface AiSecurityAssistant {
    dailySummary: string;
    attentionItems: string[];
    complianceRecommendations: string[];
    accessInsights: string[];
    incidentInsights: string[];
    executiveSummary: string;
    generatedAt: string;
}

export interface SecurityOsStats {
    securityScore: number;
    roles: number;
    openAlerts: number;
    activeSessions: number;
    mfaEnrollments: number;
    complianceControls: number;
    backupConfigs: number;
    auditEvents: number;
}

export interface SecurityCenterSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: SecurityOsStats;
    opsDashboard: SecurityOpsMetric[];
    rbac: RbacRoleItem[];
    permissions: PermissionManagerItem[];
    auditTrail: AuditLogExplorerItem[];
    securityEvents: SecurityEventItem[];
    mfa: MfaManagementItem[];
    sessions: SessionManagementItem[];
    apiSecurity: ApiSecurityItem[];
    compliance: ComplianceCenterItem[];
    backupDr: BackupDrItem[];
    alerts: SecurityAlertItem[];
    executiveWidgets: ExecutiveSecurityWidgets;
    assistant: AiSecurityAssistant;
}

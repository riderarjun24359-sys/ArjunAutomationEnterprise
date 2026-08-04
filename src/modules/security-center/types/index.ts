export type AuthMethod =
    | "email_password"
    | "magic_link"
    | "google_oauth"
    | "microsoft_oauth"
    | "github_oauth";

export type MfaMethod = "authenticator" | "recovery_codes" | "backup_methods" | "trusted_devices";

export type SecurityRole =
    | "founder"
    | "admin"
    | "sales"
    | "delivery"
    | "support"
    | "finance"
    | "customer"
    | "custom";

export type Permission =
    | "auth:read"
    | "auth:write"
    | "mfa:read"
    | "mfa:write"
    | "rbac:read"
    | "rbac:write"
    | "api:read"
    | "api:write"
    | "secrets:read"
    | "secrets:write"
    | "audit:read"
    | "audit:write"
    | "threat:read"
    | "threat:write"
    | "org:isolation:verify"
    | "security:dashboard";

export type AuditEventType =
    | "login"
    | "logout"
    | "permission_change"
    | "document_access"
    | "workflow_execution"
    | "admin_action"
    | "security_event";

export type ThreatType =
    | "repeated_failures"
    | "suspicious_location"
    | "impossible_travel"
    | "permission_abuse"
    | "abnormal_api";

export type OrgIsolationResource =
    | "projects"
    | "documents"
    | "invoices"
    | "crm"
    | "business_assets"
    | "messages"
    | "audit_logs";

export interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    role: SecurityRole;
    createdAt: string;
    expiresAt?: string | null;
    lastUsedAt?: string | null;
    status: "active" | "revoked" | "expired";
}

export interface SecretEntry {
    key: string;
    source: "env" | "vault";
    required: boolean;
    present: boolean;
    rotatedAt?: string | null;
}

export interface AuditEvent {
    id: string;
    type: AuditEventType;
    actorId?: string | null;
    organizationId?: string | null;
    resource?: string | null;
    action: string;
    metadata?: Record<string, unknown> | null;
    createdAt: string;
}

export interface ThreatAlert {
    id: string;
    type: ThreatType;
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    detectedAt: string;
    resolved: boolean;
    aiSuggestion?: string | null;
}

export interface OrgIsolationCheck {
    resource: OrgIsolationResource;
    isolated: boolean;
    orgId: string;
    checkedAt: string;
    message?: string | null;
}

export interface SecurityDashboardStats {
    authMethodsEnabled: number;
    mfaEnrollmentRate: number;
    activeThreats: number;
    auditEventsToday: number;
    apiKeysActive: number;
    secretsValid: boolean;
    orgIsolationScore: number;
    lastCheckedAt: string;
}

export interface AuthMethodStatus {
    method: AuthMethod;
    enabled: boolean;
    configured: boolean;
}

export interface MfaStatus {
    enrolled: boolean;
    methods: MfaMethod[];
    policyEnforced: boolean;
}

export interface UserContext {
    userId: string;
    email: string;
    role: SecurityRole;
    organizationId?: string | null;
}

export interface SecurityPolicyResult {
    allowed: boolean;
    capabilityId: string;
    action: string;
    reason?: string | null;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: string;
}

export interface SecurityCenterState {
    authMethods: AuthMethodStatus[];
    mfaStatus: MfaStatus;
    roles: SecurityRole[];
    apiKeys: ApiKey[];
    secrets: SecretEntry[];
    auditEvents: AuditEvent[];
    threatAlerts: ThreatAlert[];
    orgChecks: OrgIsolationCheck[];
    dashboard: SecurityDashboardStats;
}

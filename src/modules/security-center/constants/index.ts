import type { AuthMethod, MfaMethod, Permission, SecurityRole } from "../types";

export const SECURITY_CENTER_STORAGE_KEY = "aa-security-center-state";

export const SECURITY_ROLES: SecurityRole[] = [
    "founder",
    "admin",
    "sales",
    "delivery",
    "support",
    "finance",
    "customer",
    "custom",
];

export const AUTH_METHODS: AuthMethod[] = [
    "email_password",
    "magic_link",
    "google_oauth",
    "microsoft_oauth",
    "github_oauth",
];

export const MFA_METHODS: MfaMethod[] = [
    "authenticator",
    "recovery_codes",
    "backup_methods",
    "trusted_devices",
];

export const AUDIT_EVENT_TYPES = [
    "login",
    "logout",
    "permission_change",
    "document_access",
    "workflow_execution",
    "admin_action",
    "security_event",
] as const;

export const THREAT_TYPES = [
    "repeated_failures",
    "suspicious_location",
    "impossible_travel",
    "permission_abuse",
    "abnormal_api",
] as const;

export const ORG_ISOLATION_RESOURCES = [
    "projects",
    "documents",
    "invoices",
    "crm",
    "business_assets",
    "messages",
    "audit_logs",
] as const;

export const SECURITY_PERMISSIONS: Record<SecurityRole, Permission[]> = {
    founder: [
        "auth:read", "auth:write", "mfa:read", "mfa:write",
        "rbac:read", "rbac:write", "api:read", "api:write",
        "secrets:read", "secrets:write", "audit:read", "audit:write",
        "threat:read", "threat:write", "org:isolation:verify", "security:dashboard",
    ],
    admin: [
        "auth:read", "auth:write", "mfa:read", "mfa:write",
        "rbac:read", "rbac:write", "api:read", "api:write",
        "secrets:read", "audit:read", "audit:write",
        "threat:read", "threat:write", "org:isolation:verify", "security:dashboard",
    ],
    sales: ["auth:read", "mfa:read", "rbac:read", "audit:read", "security:dashboard"],
    delivery: ["auth:read", "mfa:read", "rbac:read", "audit:read", "security:dashboard"],
    support: ["auth:read", "mfa:read", "rbac:read", "audit:read", "threat:read", "security:dashboard"],
    finance: ["auth:read", "mfa:read", "rbac:read", "audit:read", "security:dashboard"],
    customer: ["auth:read", "mfa:read", "security:dashboard"],
    custom: ["auth:read", "security:dashboard"],
};

export const SECURITY_CENTER_TABS = {
    authentication: "authentication",
    mfa: "mfa",
    rbac: "rbac",
    orgIsolation: "org-isolation",
    apiSecurity: "api-security",
    secrets: "secrets",
    audit: "audit",
    threatDetection: "threat-detection",
    dashboard: "dashboard",
} as const;

export const SECURITY_CENTER_TAB_LIST = [
    { id: SECURITY_CENTER_TABS.authentication, label: "Authentication" },
    { id: SECURITY_CENTER_TABS.mfa, label: "MFA" },
    { id: SECURITY_CENTER_TABS.rbac, label: "RBAC" },
    { id: SECURITY_CENTER_TABS.orgIsolation, label: "Org Isolation" },
    { id: SECURITY_CENTER_TABS.apiSecurity, label: "API Security" },
    { id: SECURITY_CENTER_TABS.secrets, label: "Secrets" },
    { id: SECURITY_CENTER_TABS.audit, label: "Audit Center" },
    { id: SECURITY_CENTER_TABS.threatDetection, label: "Threat Detection" },
    { id: SECURITY_CENTER_TABS.dashboard, label: "Dashboard" },
] as const;

export const SECURITY_CENTER_THEME = {
    accent: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200/60 dark:border-indigo-800/60",
    surface: "bg-indigo-50/50 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
} as const;

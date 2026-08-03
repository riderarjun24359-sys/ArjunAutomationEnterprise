export const IDP_TABS = {
    overview: "overview",
    realms: "realms",
    providers: "providers",
    samlConfigs: "samlConfigs",
    oidcConfigs: "oidcConfigs",
    mfaPolicies: "mfaPolicies",
    mfaEnrollments: "mfaEnrollments",
    backupCodes: "backupCodes",
    trustedDevices: "trustedDevices",
    sessionPolicies: "sessionPolicies",
    activeSessions: "activeSessions",
    deviceRegistry: "deviceRegistry",
    concurrentLoginPolicies: "concurrentLoginPolicies",
    rbacRoles: "rbacRoles",
    permissionGroups: "permissionGroups",
    abacPolicies: "abacPolicies",
    temporaryAccessGrants: "temporaryAccessGrants",
    departments: "departments",
    teams: "teams",
    businessUnits: "businessUnits",
    reportingStructures: "reportingStructures",
    invitations: "invitations",
    bulkInviteBatches: "bulkInviteBatches",
    invitationRoles: "invitationRoles",
    invitationAudit: "invitationAudit",
    loginHistory: "loginHistory",
    securityAlerts: "securityAlerts",
    riskEvents: "riskEvents",
    passwordPolicies: "passwordPolicies",
    adminMetrics: "adminMetrics",
    identityHealth: "identityHealth",
    compromisedAccounts: "compromisedAccounts",
    audit: "audit",
    api: "api",
} as const;

export const PROVIDER_TYPE_OPTIONS = [
    { value: "local", label: "Local" },
    { value: "saml", label: "SAML" },
    { value: "oidc", label: "OIDC" },
    { value: "ldap", label: "LDAP" },
    { value: "social", label: "Social" },
] as const;

export const MFA_TYPE_OPTIONS = [
    { value: "authenticator", label: "Authenticator App" },
    { value: "sms", label: "SMS" },
    { value: "email", label: "Email" },
    { value: "hardware_key", label: "Hardware Key" },
    { value: "push", label: "Push Notification" },
] as const;

export const SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const IDP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const IDP_PERMISSIONS = ["idp.view", "idp.manage", "idp.approve", "idp.admin"] as const;

export const IDP_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;

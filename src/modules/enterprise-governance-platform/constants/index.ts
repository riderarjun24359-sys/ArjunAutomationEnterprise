export const EGP_TABS = {
    overview: "overview",
    governanceHubs: "governanceHubs",
    organizationGovernance: "organizationGovernance",
    governancePolicies: "governancePolicies",
    governanceFramework: "governanceFramework",
    governanceReviews: "governanceReviews",
    governanceDashboards: "governanceDashboards",
    complianceFramework: "complianceFramework",
    complianceControls: "complianceControls",
    complianceEvidence: "complianceEvidence",
    complianceReports: "complianceReports",
    complianceCalendar: "complianceCalendar",
    auditCenter: "auditCenter",
    auditFindings: "auditFindings",
    correctiveActions: "correctiveActions",
    auditEvidence: "auditEvidence",
    auditAnalytics: "auditAnalytics",
    dataClassification: "dataClassification",
    retentionPolicies: "retentionPolicies",
    dataLifecycle: "dataLifecycle",
    dataOwnership: "dataOwnership",
    dataQuality: "dataQuality",
    riskRegister: "riskRegister",
    riskAssessment: "riskAssessment",
    riskMitigation: "riskMitigation",
    riskMonitoring: "riskMonitoring",
    businessContinuity: "businessContinuity",
    governanceMetrics: "governanceMetrics",
    governanceHealth: "governanceHealth",
    complianceDashboards: "complianceDashboards",
    missionProgress: "missionProgress",
    governanceFailures: "governanceFailures",
    auditLogs: "auditLogs",
    api: "api",
} as const;

export const GOVERNANCE_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "deprecated", label: "Deprecated" },
] as const;

export const POLICY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const FRAMEWORK_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const CONTROL_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const EVIDENCE_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
] as const;

export const DASHBOARD_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
] as const;

export const REVIEW_STATUS_OPTIONS = [
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
] as const;

export const REPORT_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
] as const;

export const CALENDAR_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
] as const;

export const AUDIT_STATUS_OPTIONS = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
] as const;

export const ACTION_STATUS_OPTIONS = [
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const OWNERSHIP_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
] as const;

export const MITIGATION_STATUS_OPTIONS = [
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
] as const;

export const MONITORING_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "paused", label: "Paused" },
] as const;

export const CONTINUITY_STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "testing", label: "Testing" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
] as const;

export const EGP_PERMISSIONS = ["egp.view", "egp.manage", "egp.approve", "egp.admin"] as const;

export const EGP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
] as const;


export const EGP_THEME = {
    primary: "rose-600",
    primaryHover: "rose-500",
    ring: "rose-500/20",
    text: "text-rose-600",
    textDark: "dark:text-rose-400",
    bg: "bg-rose-600",
    bgHover: "hover:bg-rose-500",
} as const;

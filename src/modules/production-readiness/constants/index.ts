export const PRODUCTION_READINESS_STORAGE_KEY = "aa-production-readiness-state";

export const PRODUCTION_READINESS_TABS = {
    ctoAudit: "cto-audit",
    observability: "observability",
    resilience: "resilience",
    backupRecovery: "backup-recovery",
    security: "security",
    scalability: "scalability",
    operationsPlaybook: "operations-playbook",
    productionQuality: "production-quality",
} as const;

export const PRODUCTION_READINESS_TAB_LIST = [
    { id: PRODUCTION_READINESS_TABS.ctoAudit, label: "CTO Audit Dashboard", module: 8 },
    { id: PRODUCTION_READINESS_TABS.observability, label: "Observability", module: 1 },
    { id: PRODUCTION_READINESS_TABS.resilience, label: "Resilience", module: 2 },
    { id: PRODUCTION_READINESS_TABS.backupRecovery, label: "Backup & Recovery", module: 3 },
    { id: PRODUCTION_READINESS_TABS.security, label: "Security Hardening", module: 4 },
    { id: PRODUCTION_READINESS_TABS.scalability, label: "Scalability", module: 5 },
    { id: PRODUCTION_READINESS_TABS.operationsPlaybook, label: "Operations Playbook", module: 6 },
    { id: PRODUCTION_READINESS_TABS.productionQuality, label: "Production Quality", module: 7 },
] as const;

export const OPERATIONS_PLAYBOOK_SECTIONS = [
    { id: "deployment", label: "Deployment", steps: ["Run verify scripts", "Apply migrations", "Build production bundle", "Deploy to hosting", "Smoke test critical paths"] },
    { id: "rollback", label: "Rollback", steps: ["Identify failing deployment", "Revert to last known good commit", "Restore database if needed", "Verify health endpoint", "Notify stakeholders"] },
    { id: "incident", label: "Incident Response", steps: ["Acknowledge alert", "Assess severity", "Mitigate user impact", "Root cause analysis", "Post-incident review"] },
    { id: "backup", label: "Backup Recovery", steps: ["Verify backup integrity", "Select recovery point", "Restore to staging first", "Validate data integrity", "Cutover to production"] },
    { id: "maintenance", label: "Maintenance", steps: ["Schedule maintenance window", "Notify users", "Apply patches", "Run regression verify", "Monitor for 24h"] },
    { id: "emergency", label: "Emergency Procedures", steps: ["Activate incident commander", "Enable read-only mode if needed", "Execute DR plan", "Communicate status", "Document timeline"] },
] as const;

export const QUALITY_GATE_DIMENSIONS = [
    "Engineering",
    "Security",
    "Performance",
    "Reliability",
    "Scalability",
    "Maintainability",
    "Accessibility",
    "Brand",
    "Business",
] as const;

export const PRODUCTION_READINESS_THEME = {
    accent: "text-emerald-600 dark:text-emerald-400",
    text: "text-[var(--dos-text-secondary)]",
    badge: "Production Hardening & Enterprise Readiness v1.0",
} as const;

export const SECURITY_HEADERS = [
    "X-Frame-Options: DENY",
    "X-Content-Type-Options: nosniff",
    "Referrer-Policy: strict-origin-when-cross-origin",
    "Permissions-Policy: camera=(), microphone=(), geolocation=()",
] as const;

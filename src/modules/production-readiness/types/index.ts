export type ReadinessStatus = "healthy" | "degraded" | "critical";
export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertType = "security" | "performance" | "reliability" | "backup" | "ai" | "delivery" | "database";

export interface ProductionReadinessContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
}

export interface PillarScore {
    key: string;
    label: string;
    score: number;
    status: ReadinessStatus;
    summary: string;
}

export interface SystemAlert {
    id: string;
    alertType: AlertType;
    severity: AlertSeverity;
    title: string;
    detail: string;
    resolved: boolean;
    createdAt: string;
}

export interface CtoAuditDashboard {
    overallScore: number;
    riskScore: number;
    status: ReadinessStatus;
    platformHealth: number;
    securityStatus: number;
    performanceStatus: number;
    databaseHealth: number;
    aiHealth: number;
    deliveryHealth: number;
    systemAlerts: SystemAlert[];
    pillars: PillarScore[];
    generatedAt: string;
}

export interface ObservabilitySnapshot {
    logCount: number;
    errorCount: number;
    traceCount: number;
    recentLogs: Array<{ level: string; message: string; source: string; time: string }>;
    metrics: Array<{ name: string; value: string }>;
    healthChecks: Array<{ name: string; status: string }>;
}

export interface ResilienceSnapshot {
    retryPolicies: Array<{ name: string; maxAttempts: number; circuitOpen: boolean }>;
    circuitBreakers: Array<{ key: string; open: boolean; failures: number }>;
    queueStats: Array<{ name: string; pending: number; failed: number }>;
    openErrors: number;
    recoveryJobs: number;
}

export interface BackupRecoverySnapshot {
    backups: Array<{ id: string; type: string; status: string; verified: boolean; createdAt: string }>;
    lastVerified: string | null;
    drPlanStatus: string;
    integrityChecks: Array<{ name: string; passed: boolean }>;
}

export interface SecurityHardeningSnapshot {
    authStatus: string;
    sessionHandling: string;
    rateLimiting: string;
    securityHeaders: string[];
    inputValidation: string;
    dependencyScan: string;
    secretManagement: string;
    score: number;
}

export interface ScalabilitySnapshot {
    concurrentUsersCapacity: number;
    databaseOptimization: string;
    cachingStrategy: string;
    horizontalScaling: string;
    recommendations: string[];
}

export interface ProductionQualitySnapshot {
    dimensions: Array<{ name: string; score: number; passed: boolean }>;
    verifyScripts: Array<{ name: string; status: "pass" | "pending" }>;
    overallPassed: boolean;
}

export interface ProductionReadinessSnapshot {
    ctoAudit: CtoAuditDashboard;
    observability: ObservabilitySnapshot;
    resilience: ResilienceSnapshot;
    backupRecovery: BackupRecoverySnapshot;
    security: SecurityHardeningSnapshot;
    scalability: ScalabilitySnapshot;
    productionQuality: ProductionQualitySnapshot;
}

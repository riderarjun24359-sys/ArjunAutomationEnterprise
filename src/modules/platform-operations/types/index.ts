export type HealthComponentId =
    | "missionCore"
    | "capabilities"
    | "sharedServices"
    | "database"
    | "storage"
    | "api"
    | "queues"
    | "workers"
    | "externalIntegrations";

export type HealthStatus = "healthy" | "degraded" | "critical" | "offline";

export interface HealthComponent {
    id: HealthComponentId;
    name: string;
    status: HealthStatus;
    uptime: number;
    latencyMs: number;
    lastCheck: string;
    message?: string | null;
}

export interface HealthScore {
    overall: HealthStatus;
    score: number;
    components: HealthComponent[];
    checkedAt: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
    id: string;
    level: LogLevel;
    message: string;
    source: string;
    timestamp: string;
    metadata?: Record<string, unknown> | null;
    traceId?: string | null;
}

export type MetricType = "counter" | "gauge" | "histogram" | "timer";

export interface MetricPoint {
    id: string;
    name: string;
    type: MetricType;
    value: number;
    unit: string;
    timestamp: string;
    labels?: Record<string, string>;
}

export interface TraceSpan {
    id: string;
    traceId: string;
    name: string;
    service: string;
    durationMs: number;
    status: "ok" | "error";
    startedAt: string;
    parentId?: string | null;
}

export type ErrorType =
    | "runtime"
    | "api_failure"
    | "workflow_failure"
    | "integration_failure"
    | "unhandled_exception"
    | "ai_failure";

export interface PlatformError {
    id: string;
    type: ErrorType;
    message: string;
    source: string;
    stack?: string | null;
    occurredAt: string;
    resolved: boolean;
    retryRecommendation?: string | null;
    aiAssisted?: boolean;
}

export type QueueType = "background" | "workflow" | "retry" | "dead_letter" | "priority";

export interface JobQueue {
    id: string;
    name: string;
    type: QueueType;
    pending: number;
    processing: number;
    failed: number;
    completed: number;
    avgLatencyMs: number;
}

export interface RetryPolicy {
    id: string;
    name: string;
    maxAttempts: number;
    baseDelayMs: number;
    maxDelayMs: number;
    circuitBreakerThreshold: number;
    circuitOpen: boolean;
    escalationLevel: number;
}

export type BackupType = "database" | "document" | "configuration" | "capability_metadata";

export interface BackupRecord {
    id: string;
    type: BackupType;
    status: "pending" | "completed" | "failed" | "verified";
    sizeBytes: number;
    createdAt: string;
    verifiedAt?: string | null;
    restoreSimulated?: boolean;
}

export interface DisasterRecoveryPlan {
    id: string;
    name: string;
    rpoMinutes: number;
    rtoMinutes: number;
    status: "draft" | "active" | "tested";
    lastValidatedAt?: string | null;
    failoverReady: boolean;
}

export interface PerformanceMetric {
    id: string;
    category: "response_time" | "workflow_duration" | "ai_time" | "queue_latency" | "database" | "api" | "memory" | "cpu";
    name: string;
    value: number;
    unit: string;
    threshold: number;
    status: "ok" | "warning" | "critical";
    measuredAt: string;
}

export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

export interface Incident {
    id: string;
    title: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    affectedComponents: HealthComponentId[];
    startedAt: string;
    resolvedAt?: string | null;
    maintenanceMode: boolean;
}

export interface ServiceStatus {
    id: string;
    name: string;
    status: HealthStatus;
    dependencies: string[];
    lastIncidentAt?: string | null;
    uptime: number;
}

export interface OperationsDashboardStats {
    reliabilityScore: number;
    healthScore: number;
    activeIncidents: number;
    openErrors: number;
    queueBacklog: number;
    backupSuccessRate: number;
    avgResponseTimeMs: number;
    lastCheckedAt: string;
}

export interface PlatformOperationsState {
    healthScore: HealthScore;
    logs: LogEntry[];
    metrics: MetricPoint[];
    traces: TraceSpan[];
    errors: PlatformError[];
    queues: JobQueue[];
    retryPolicies: RetryPolicy[];
    backups: BackupRecord[];
    drPlans: DisasterRecoveryPlan[];
    performance: PerformanceMetric[];
    incidents: Incident[];
    serviceStatuses: ServiceStatus[];
    dashboard: OperationsDashboardStats;
}

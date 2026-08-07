import type { AocAlertSeverity, AocHealthDomain, AocLogKind } from "./constants";

export interface HealthDomainRow {
    domain: AocHealthDomain;
    score: number | null;
    status: string;
    detail: string;
    lastCheckAt: string;
}

export interface SystemHealthDashboard {
    domains: HealthDomainRow[];
    overallScore: number | null;
    moduleRows: Array<{ name: string; score: number; status: string; lastCheckAt: string }>;
    backgroundJobs: number;
    queueDepth: number;
}

export interface AiAgentRow {
    id: string;
    name: string;
    status: string;
    model: string;
    runningTasks: number;
    successRate: number | null;
    tokenUsage: number;
    estimatedCostUsd: number;
}

export interface AiAgentMonitor {
    rows: AiAgentRow[];
    activeAgents: number;
    totalTokenUsage: number;
    totalCostUsd: number;
    avgSuccessRate: number | null;
}

export interface InfrastructureMonitoring {
    cpuPercent: number | null;
    memoryPercent: number | null;
    avgResponseMs: number | null;
    errorRate: number | null;
    availabilityPercent: number | null;
    services: Array<{ name: string; status: string; lastHeartbeat: string; url: string }>;
    failures: number;
}

export interface SecurityCenterBoard {
    loginActivity: Array<{ id: string; title: string; detail: string; createdAt: string }>;
    rbacAudit: Array<{ id: string; action: string; summary: string; securityLevel: string; createdAt: string }>;
    suspiciousEvents: number;
    securityAlerts: number;
}

export interface LogRow {
    id: string;
    kind: AocLogKind;
    level: string;
    message: string;
    source: string;
    createdAt: string;
}

export interface LogsAndAudit {
    rows: LogRow[];
    byKind: Array<{ kind: AocLogKind; count: number }>;
}

export interface AlertRow {
    id: string;
    title: string;
    severity: AocAlertSeverity;
    message: string;
    status: string;
    triggeredAt: string;
    silenced: boolean;
}

export interface AlertCenter {
    rows: AlertRow[];
    critical: number;
    warning: number;
    notificationHistory: Array<{ id: string; note: string; acknowledgedBy: string; at: string }>;
}

export interface BackupAndRecovery {
    configs: Array<{ id: string; name: string; enabled: boolean; schedule: string; destination: string }>;
    runs: Array<{ id: string; status: string; startedAt: string; sizeBytes: number; error: string; path: string }>;
    restoreWorkflows: string[];
    disasterRecoveryChecklist: Array<{ item: string; ready: boolean }>;
    disasterRecoveryMode: boolean;
}

export interface PerformanceAnalytics {
    slowPages: Array<{ id: string; name: string; durationMs: number; status: string }>;
    slowQueries: Array<{ id: string; name: string; durationMs: number; status: string }>;
    suggestions: string[];
    avgTraceMs: number | null;
}

export interface ExecutiveOperationsDashboard {
    platformHealth: number | null;
    slaPercent: number | null;
    uptimePercent: number | null;
    activeCustomers: number;
    automationHealth: number | null;
    openAlerts: number;
    summary: string;
}

export interface AiOperationsCenterSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    health: SystemHealthDashboard;
    agents: AiAgentMonitor;
    infrastructure: InfrastructureMonitoring;
    security: SecurityCenterBoard;
    logs: LogsAndAudit;
    alerts: AlertCenter;
    backup: BackupAndRecovery;
    performance: PerformanceAnalytics;
    executive: ExecutiveOperationsDashboard;
}

export interface AiOperationsCenterRawData {
    organizationId: string;
    membershipRole: string | null;
    overallHealth: Array<{
        id: string;
        health_type: string;
        health_score: number;
        last_check_at: string;
        status: string;
    }>;
    moduleHealth: Array<{
        id: string;
        module_name: string;
        health_score: number;
        last_check_at: string;
        status: string;
    }>;
    databaseHealth: Array<{
        id: string;
        connection_pool_used: number;
        health_score: number;
        last_check_at: string;
        status: string;
    }>;
    jobSchedulers: Array<{ id: string; scheduler_name: string; scheduler_status: string; status: string }>;
    recurringJobs: Array<{
        id: string;
        job_name: string;
        job_status: string;
        last_run_at: string | null;
        next_run_at: string | null;
        status: string;
    }>;
    retryQueue: Array<{
        id: string;
        job_ref: string;
        retry_count: number;
        priority: number;
        last_error: string;
        status: string;
    }>;
    deadLetters: Array<{ id: string; job_ref: string; error_message: string; failed_at: string; status: string }>;
    alerts: Array<{
        id: string;
        alert_title: string;
        alert_severity: string;
        alert_message: string;
        silenced: boolean;
        alert_status: string;
        triggered_at: string;
        status: string;
    }>;
    alertAcks: Array<{
        id: string;
        acknowledged_by: string;
        ack_note: string;
        acknowledged_at: string;
        status: string;
    }>;
    platformLogs: Array<{
        id: string;
        log_level: string;
        service_name: string;
        message: string;
        logged_at: string;
        status: string;
    }>;
    platformMetrics: Array<{
        id: string;
        metric_date: string;
        dependency_health: number;
        cpu_percent: number;
        memory_percent: number;
        status: string;
    }>;
    traces: Array<{
        id: string;
        trace_id: string;
        span_count: number;
        duration_ms: number;
        traced_at: string;
        status: string;
    }>;
    services: Array<{
        id: string;
        service_name: string;
        service_url: string;
        last_heartbeat_at: string;
        status: string;
        cache_status: string;
    }>;
    opsMetrics: Array<{
        id: string;
        metric_date: string;
        operational_score: number;
        active_jobs: number;
        open_alerts: number;
        status: string;
    }>;
    opsHealth: Array<{
        id: string;
        health_date: string;
        overall_score: number;
        uptime_percent: number;
        disaster_recovery_mode: boolean;
        summary: string;
        status: string;
    }>;
    opsFailures: Array<{
        id: string;
        failure_type: string;
        error_message: string;
        failed_at: string;
        status: string;
    }>;
    eocAudit: Array<{
        id: string;
        action: string;
        summary: string;
        security_level: string;
        created_at: string;
        entity_type: string;
    }>;
    activityLogs: Array<{
        id: string;
        action: string;
        title: string;
        detail: string;
        entity_type: string;
        created_at: string;
    }>;
    auditLogs: Array<{
        id: string;
        action: string;
        summary: string;
        created_at: string;
    }>;
    backupConfigs: Array<{
        id: string;
        name: string;
        schedule_cron: string;
        destination: string;
        is_enabled: boolean;
        retention_count: number;
    }>;
    backupRuns: Array<{
        id: string;
        config_id: string;
        status: string;
        started_at: string;
        size_bytes: number;
        storage_path: string;
        error_message: string;
    }>;
    aiAgents: Array<{
        id: string;
        name: string;
        status: string;
        model: string;
        max_tokens: number;
        description: string;
    }>;
    workflowExecutions: Array<{
        id: string;
        workflow_id: string;
        status: string;
        duration_ms: number;
        error_message: string;
        started_at: string;
    }>;
    automationLogs: Array<{
        id: string;
        level: string;
        message: string;
        created_at: string;
        workflow_id: string | null;
    }>;
    dweHealth: Array<{
        id: string;
        overall_score: number;
        running_workflows_count: number;
        automation_health_status: string;
        summary: string;
    }>;
    clients: Array<{ id: string; name: string; status: string }>;
}

import type {
    BackupType,
    ErrorType,
    HealthComponentId,
    LogLevel,
    MetricType,
    QueueType,
} from "../types";

export const PLATFORM_OPERATIONS_STORAGE_KEY = "aa-platform-operations-state";

export const HEALTH_COMPONENTS: HealthComponentId[] = [
    "missionCore",
    "capabilities",
    "sharedServices",
    "database",
    "storage",
    "api",
    "queues",
    "workers",
    "externalIntegrations",
];

export const LOG_LEVELS: LogLevel[] = ["debug", "info", "warn", "error", "fatal"];

export const METRIC_TYPES: MetricType[] = ["counter", "gauge", "histogram", "timer"];

export const ERROR_TYPES: ErrorType[] = [
    "runtime",
    "api_failure",
    "workflow_failure",
    "integration_failure",
    "unhandled_exception",
    "ai_failure",
];

export const QUEUE_TYPES: QueueType[] = ["background", "workflow", "retry", "dead_letter", "priority"];

export const BACKUP_TYPES: BackupType[] = ["database", "document", "configuration", "capability_metadata"];

export const DR_METRICS = {
    RPO: "RPO",
    RTO: "RTO",
} as const;

export const PLATFORM_OPS_EVENTS = {
    HealthEvent: "HealthEvent",
    WorkflowEvent: "WorkflowEvent",
    PerformanceMetric: "PerformanceMetric",
    FailureEvent: "FailureEvent",
    RecoveryEvent: "RecoveryEvent",
} as const;

export const PLATFORM_OPERATIONS_TABS = {
    health: "health",
    observability: "observability",
    errors: "errors",
    queues: "queues",
    retry: "retry",
    backup: "backup",
    disasterRecovery: "disaster-recovery",
    performance: "performance",
    serviceStatus: "service-status",
    dashboard: "dashboard",
} as const;

export const PLATFORM_OPERATIONS_TAB_LIST = [
    { id: PLATFORM_OPERATIONS_TABS.health, label: "Health Center" },
    { id: PLATFORM_OPERATIONS_TABS.observability, label: "Observability" },
    { id: PLATFORM_OPERATIONS_TABS.errors, label: "Error Management" },
    { id: PLATFORM_OPERATIONS_TABS.queues, label: "Queue & Jobs" },
    { id: PLATFORM_OPERATIONS_TABS.retry, label: "Retry Engine" },
    { id: PLATFORM_OPERATIONS_TABS.backup, label: "Backup Center" },
    { id: PLATFORM_OPERATIONS_TABS.disasterRecovery, label: "Disaster Recovery" },
    { id: PLATFORM_OPERATIONS_TABS.performance, label: "Performance" },
    { id: PLATFORM_OPERATIONS_TABS.serviceStatus, label: "Service Status" },
    { id: PLATFORM_OPERATIONS_TABS.dashboard, label: "Dashboard" },
] as const;

export const PLATFORM_OPERATIONS_THEME = {
    accent: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/60",
    surface: "bg-emerald-50/50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
} as const;

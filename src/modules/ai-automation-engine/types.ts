import type {
    AaeActionType,
    AaeExecutionStatus,
    AaeIntegrationType,
    AaeNodeKind,
    AaeTemplateCategory,
    AaeTriggerType,
} from "./constants";

export interface WorkflowBuilderNode {
    id: string;
    name: string;
    kind: AaeNodeKind;
    order: number;
    status: string;
    detail: string;
}

export interface WorkflowBuilderBoard {
    workflows: Array<{ id: string; name: string; status: string; version: number; nodeCount: number }>;
    nodes: WorkflowBuilderNode[];
    conditions: number;
    branches: number;
    delays: number;
    loops: number;
    templates: number;
}

export interface TriggerRow {
    id: string;
    name: string;
    type: AaeTriggerType;
    source: string;
    active: boolean;
    detail: string;
}

export interface TriggerCenter {
    rows: TriggerRow[];
    byType: Array<{ type: AaeTriggerType; count: number }>;
}

export interface ActionRow {
    id: string;
    name: string;
    type: AaeActionType;
    source: string;
    detail: string;
}

export interface ActionsLibrary {
    rows: ActionRow[];
    byType: Array<{ type: AaeActionType; count: number }>;
}

export interface AiGeneratorInsight {
    id: string;
    kind: "generated" | "optimization" | "error" | "improvement";
    title: string;
    detail: string;
    severity: "high" | "medium" | "low";
}

export interface AiWorkflowGenerator {
    promptSamples: string[];
    insights: AiGeneratorInsight[];
    generatedCount: number;
}

export interface ExecutionRow {
    id: string;
    name: string;
    status: AaeExecutionStatus;
    startedAt: string;
    durationMs: number;
    error: string;
    logLevel: string;
}

export interface ExecutionCenter {
    rows: ExecutionRow[];
    byStatus: Array<{ status: AaeExecutionStatus; count: number }>;
    logs: Array<{ id: string; level: string; message: string; createdAt: string }>;
    retryQueue: number;
}

export interface ApprovalRow {
    id: string;
    name: string;
    audience: "founder" | "admin" | "high_risk";
    status: string;
    dueAt: string;
}

export interface ApprovalCenter {
    rows: ApprovalRow[];
    founderCount: number;
    adminCount: number;
    highRiskCount: number;
    auditTrail: Array<{ id: string; action: string; summary: string; securityLevel: string; createdAt: string }>;
}

export interface MonitoringDashboard {
    activeWorkflows: number;
    successRate: number | null;
    failures: number;
    avgExecutionMs: number | null;
    automationSavingsHours: number;
    healthScore: number | null;
}

export interface TemplateRow {
    id: string;
    name: string;
    category: AaeTemplateCategory;
    description: string;
    status: string;
}

export interface TemplateMarketplace {
    rows: TemplateRow[];
    byCategory: Array<{ category: AaeTemplateCategory; count: number }>;
}

export interface IntegrationRow {
    id: string;
    name: string;
    type: AaeIntegrationType;
    status: string;
    architecture: string;
}

export interface IntegrationHub {
    rows: IntegrationRow[];
    byType: Array<{ type: AaeIntegrationType; count: number }>;
}

export interface ExecutiveAutomationDashboard {
    automationRoi: number;
    timeSavedHours: number;
    workflowHealth: number | null;
    topAutomations: Array<{ name: string; executions: number; successRate: number }>;
    aiRecommendations: string[];
    summary: string;
}

export interface AiAutomationEngineSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    builder: WorkflowBuilderBoard;
    triggers: TriggerCenter;
    actions: ActionsLibrary;
    generator: AiWorkflowGenerator;
    execution: ExecutionCenter;
    approvals: ApprovalCenter;
    monitoring: MonitoringDashboard;
    templates: TemplateMarketplace;
    integrations: IntegrationHub;
    executive: ExecutiveAutomationDashboard;
}

export interface AiAutomationEngineRawData {
    organizationId: string;
    membershipRole: string | null;
    workflows: Array<{
        id: string;
        name: string;
        description: string;
        status: string;
        version: number;
    }>;
    workflowTemplates: Array<{
        id: string;
        name: string;
        description: string;
        category: string;
        is_public: boolean;
    }>;
    workflowTriggers: Array<{
        id: string;
        workflow_id: string;
        trigger_type: string;
        event_name: string;
        is_active: boolean;
    }>;
    workflowActions: Array<{
        id: string;
        workflow_id: string;
        step_order: number;
        action_type: string;
    }>;
    workflowConditions: Array<{
        id: string;
        workflow_id: string;
        step_order: number;
        field: string;
        operator: string;
        value: string;
        logic_group: string;
    }>;
    workflowSchedules: Array<{
        id: string;
        workflow_id: string;
        cron_expression: string;
        is_active: boolean;
        next_run_at: string | null;
    }>;
    workflowExecutions: Array<{
        id: string;
        workflow_id: string;
        status: string;
        trigger_type: string;
        started_at: string;
        completed_at: string | null;
        duration_ms: number;
        error_message: string;
    }>;
    automationLogs: Array<{
        id: string;
        workflow_id: string | null;
        execution_id: string | null;
        level: string;
        message: string;
        created_at: string;
    }>;
    aiAgents: Array<{ id: string; name: string; status: string; description: string }>;
    dweDefinitions: Array<{
        id: string;
        workflow_name: string;
        workflow_type: string;
        description: string;
        status: string;
    }>;
    dweNodes: Array<{
        id: string;
        node_name: string;
        node_type: string;
        node_order: number;
        status: string;
    }>;
    dweDecisions: Array<{
        id: string;
        decision_name: string;
        decision_expression: string;
        default_branch: string;
        status: string;
    }>;
    dweTransitions: Array<{
        id: string;
        transition_name: string;
        source_node_ref: string;
        target_node_ref: string;
        status: string;
    }>;
    dweTemplates: Array<{
        id: string;
        template_name: string;
        template_type: string;
        description: string;
        status: string;
    }>;
    dweCategories: Array<{ id: string; category_name: string; category_type: string; status: string }>;
    dweExecutions: Array<{
        id: string;
        execution_name: string;
        execution_status: string;
        started_at: string;
        status: string;
    }>;
    dweRetries: Array<{
        id: string;
        retry_key: string;
        retry_count: number;
        retry_status: string;
        next_retry_at: string | null;
        status: string;
    }>;
    dweHistory: Array<{
        id: string;
        history_type: string;
        history_summary: string;
        recorded_at: string;
        status: string;
    }>;
    dweBusinessTriggers: Array<{
        id: string;
        trigger_name: string;
        event_type: string;
        status: string;
    }>;
    dweWebhookTriggers: Array<{
        id: string;
        trigger_name: string;
        webhook_url: string;
        status: string;
    }>;
    dweTimeTriggers: Array<{
        id: string;
        trigger_name: string;
        cron_expression: string;
        status: string;
    }>;
    dweScheduledTriggers: Array<{
        id: string;
        trigger_name: string;
        schedule_type: string;
        status: string;
    }>;
    dweApprovals: Array<{
        id: string;
        task_name: string;
        task_status: string;
        due_at: string | null;
        status: string;
    }>;
    dweManualReviews: Array<{
        id: string;
        review_name: string;
        review_status: string;
        status: string;
    }>;
    dweIntegrations: Array<{
        id: string;
        integration_name: string;
        integration_type: string;
        status: string;
    }>;
    dweApiCalls: Array<{
        id: string;
        api_name: string;
        endpoint_url: string;
        http_method: string;
        status: string;
    }>;
    dweNotifications: Array<{
        id: string;
        notification_name: string;
        channel: string;
        status: string;
    }>;
    dweMetrics: Array<{
        id: string;
        metric_date: string;
        execution_count: number;
        average_duration_ms: number;
        failure_rate: number;
        success_rate: number;
        overall_workflow_score: number;
    }>;
    dweHealth: Array<{
        id: string;
        health_date: string;
        overall_score: number;
        running_workflows_count: number;
        pending_tasks_count: number;
        automation_health_status: string;
        summary: string;
    }>;
    dweFailed: Array<{
        id: string;
        failure_type: string;
        error_message: string;
        failed_at: string;
        status: string;
    }>;
    dweAnalytics: Array<{
        id: string;
        analytics_type: string;
        analytics_score: number;
        metric_date: string;
        status: string;
    }>;
    dweAudit: Array<{
        id: string;
        action: string;
        summary: string;
        security_level: string;
        created_at: string;
    }>;
    dweSubflows: Array<{ id: string; subflow_name: string; subflow_type: string; status: string }>;
}

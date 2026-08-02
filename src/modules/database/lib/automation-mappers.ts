import { formatRelativeTimestamp } from "@/src/modules/database/lib/formatters";
import type {
    DbAiAgent,
    DbAutomationLog,
    DbWorkflow,
    DbWorkflowAction,
    DbWorkflowCondition,
    DbWorkflowExecution,
    DbWorkflowSchedule,
    DbWorkflowTemplate,
    DbWorkflowTrigger,
} from "@/src/modules/database/types/platform";
import type {
    AiAgent,
    AutomationAnalytics,
    AutomationDashboardStats,
    AutomationLog,
    CreateAiAgentInput,
    CreateWorkflowInput,
    Workflow,
    WorkflowAction,
    WorkflowCondition,
    WorkflowExecution,
    WorkflowSchedule,
    WorkflowTemplate,
    WorkflowTrigger,
} from "@/src/modules/automation/types";

export const mapAiAgent = (record: DbAiAgent): AiAgent => ({
    id: record.id,
    name: record.name,
    description: record.description,
    model: record.model,
    systemPrompt: record.system_prompt,
    status: record.status as AiAgent["status"],
    temperature: Number(record.temperature),
    maxTokens: record.max_tokens,
    config: record.config ?? {},
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapWorkflowTemplate = (record: DbWorkflowTemplate): WorkflowTemplate => ({
    id: record.id,
    name: record.name,
    description: record.description,
    category: record.category,
    definition: record.definition ?? {},
    isPublic: record.is_public,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapWorkflow = (
    record: DbWorkflow,
    agentName?: string | null,
    templateName?: string | null,
    triggers: WorkflowTrigger[] = [],
    actions: WorkflowAction[] = [],
    conditions: WorkflowCondition[] = [],
    schedules: WorkflowSchedule[] = [],
): Workflow => ({
    id: record.id,
    name: record.name,
    description: record.description,
    status: record.status as Workflow["status"],
    version: record.version,
    templateId: record.template_id ?? null,
    templateName: templateName ?? null,
    agentId: record.agent_id ?? null,
    agentName: agentName ?? null,
    triggers,
    actions,
    conditions,
    schedules,
    updatedAt: formatRelativeTimestamp(record.updated_at),
});

export const mapWorkflowTrigger = (record: DbWorkflowTrigger): WorkflowTrigger => ({
    id: record.id,
    workflowId: record.workflow_id,
    triggerType: record.trigger_type as WorkflowTrigger["triggerType"],
    eventName: record.event_name,
    config: record.config ?? {},
    isActive: record.is_active,
});

export const mapWorkflowAction = (record: DbWorkflowAction, agentName?: string | null): WorkflowAction => ({
    id: record.id,
    workflowId: record.workflow_id,
    stepOrder: record.step_order,
    actionType: record.action_type as WorkflowAction["actionType"],
    config: record.config ?? {},
    agentId: record.agent_id ?? null,
    agentName: agentName ?? null,
});

export const mapWorkflowCondition = (record: DbWorkflowCondition): WorkflowCondition => ({
    id: record.id,
    workflowId: record.workflow_id,
    stepOrder: record.step_order,
    field: record.field,
    operator: record.operator as WorkflowCondition["operator"],
    value: record.value,
    logicGroup: record.logic_group,
});

export const mapWorkflowSchedule = (record: DbWorkflowSchedule): WorkflowSchedule => ({
    id: record.id,
    workflowId: record.workflow_id,
    cronExpression: record.cron_expression,
    timezone: record.timezone,
    nextRunAt: record.next_run_at ?? null,
    lastRunAt: record.last_run_at ?? null,
    isActive: record.is_active,
});

export const mapWorkflowExecution = (record: DbWorkflowExecution, workflowName?: string | null): WorkflowExecution => ({
    id: record.id,
    workflowId: record.workflow_id,
    workflowName: workflowName ?? "Unknown workflow",
    status: record.status as WorkflowExecution["status"],
    triggerType: record.trigger_type as WorkflowExecution["triggerType"],
    startedAt: record.started_at,
    completedAt: record.completed_at ?? null,
    durationMs: record.duration_ms,
    result: record.result ?? {},
    errorMessage: record.error_message,
});

export const mapAutomationLog = (record: DbAutomationLog, workflowName?: string | null): AutomationLog => ({
    id: record.id,
    workflowId: record.workflow_id ?? null,
    workflowName: workflowName ?? null,
    executionId: record.execution_id ?? null,
    level: record.level as AutomationLog["level"],
    message: record.message,
    metadata: record.metadata ?? {},
    timestamp: formatRelativeTimestamp(record.created_at),
});

export const buildAiAgentPayload = (organizationId: string, input: CreateAiAgentInput) => ({
    organization_id: organizationId,
    name: input.name,
    description: input.description ?? "",
    model: input.model,
    system_prompt: input.systemPrompt ?? "",
    status: input.status ?? "active",
    temperature: input.temperature ?? 0.7,
    max_tokens: input.maxTokens ?? 4096,
    config: input.config ?? {},
});

export const buildWorkflowPayload = (organizationId: string, input: CreateWorkflowInput) => ({
    organization_id: organizationId,
    template_id: input.templateId ?? null,
    agent_id: input.agentId ?? null,
    name: input.name,
    description: input.description ?? "",
    status: input.status ?? "draft",
    version: 1,
});

export const buildWorkflowTriggerRecords = (workflowId: string, triggers: CreateWorkflowInput["triggers"]) =>
    (triggers ?? []).map((trigger, index) => ({
        workflow_id: workflowId,
        trigger_type: trigger.triggerType,
        event_name: trigger.eventName ?? "",
        config: trigger.config ?? {},
        is_active: trigger.isActive ?? true,
        ...(index === 0 ? {} : {}),
    }));

export const buildWorkflowActionRecords = (workflowId: string, actions: CreateWorkflowInput["actions"]) =>
    (actions ?? []).map((action, index) => ({
        workflow_id: workflowId,
        step_order: action.stepOrder ?? index + 1,
        action_type: action.actionType,
        config: action.config ?? {},
        agent_id: action.agentId ?? null,
    }));

export const buildWorkflowConditionRecords = (workflowId: string, conditions: CreateWorkflowInput["conditions"]) =>
    (conditions ?? []).map((condition, index) => ({
        workflow_id: workflowId,
        step_order: condition.stepOrder ?? index + 1,
        field: condition.field,
        operator: condition.operator,
        value: condition.value,
        logic_group: condition.logicGroup ?? "default",
    }));

export const buildWorkflowScheduleRecords = (workflowId: string, schedules: CreateWorkflowInput["schedules"]) =>
    (schedules ?? []).map((schedule) => ({
        workflow_id: workflowId,
        cron_expression: schedule.cronExpression,
        timezone: schedule.timezone ?? "UTC",
        next_run_at: schedule.nextRunAt ?? null,
        is_active: schedule.isActive ?? true,
    }));

export const buildExecutionPayload = (organizationId: string, workflowId: string, triggerType: string) => ({
    organization_id: organizationId,
    workflow_id: workflowId,
    status: "running",
    trigger_type: triggerType,
    started_at: new Date().toISOString(),
    duration_ms: 0,
    result: {},
    error_message: "",
});

export const buildAutomationLogPayload = (
    organizationId: string,
    message: string,
    level: AutomationLog["level"],
    workflowId?: string | null,
    executionId?: string | null,
    metadata: Record<string, unknown> = {},
) => ({
    organization_id: organizationId,
    workflow_id: workflowId ?? null,
    execution_id: executionId ?? null,
    level,
    message,
    metadata,
});

export const buildAutomationActivityPayload = (organizationId: string, entityType: string, entityId: string, action: string, title: string, detail: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    title,
    detail,
    metadata: {},
});

export const buildAutomationDashboardStats = (input: {
    workflows: Workflow[];
    agents: AiAgent[];
    executions: WorkflowExecution[];
    logs: AutomationLog[];
}): AutomationDashboardStats => {
    const activeWorkflows = input.workflows.filter((workflow) => workflow.status === "active").length;
    const pausedWorkflows = input.workflows.filter((workflow) => workflow.status === "paused").length;
    const completedExecutions = input.executions.filter((execution) => execution.status === "completed").length;
    const failedExecutions = input.executions.filter((execution) => execution.status === "failed").length;
    const runningExecutions = input.executions.filter((execution) => execution.status === "running").length;
    const activeAgents = input.agents.filter((agent) => agent.status === "active").length;
    const errorLogs = input.logs.filter((log) => log.level === "error").length;

    return {
        activeWorkflows: String(activeWorkflows),
        pausedWorkflows: String(pausedWorkflows),
        activeAgents: String(activeAgents),
        completedExecutions: String(completedExecutions),
        failedExecutions: String(failedExecutions),
        runningExecutions: String(runningExecutions),
        errorLogs: String(errorLogs),
        successRate: completedExecutions + failedExecutions > 0 ? `${Math.round((completedExecutions / (completedExecutions + failedExecutions)) * 100)}%` : "100%",
    };
};

export const buildAutomationAnalytics = (input: {
    executions: WorkflowExecution[];
    logs: AutomationLog[];
    workflows: Workflow[];
}): AutomationAnalytics => {
    const executionsByStatus = ["completed", "failed", "running", "pending"].map((status) => ({
        status,
        count: input.executions.filter((execution) => execution.status === status).length,
    }));

    const topWorkflows = input.workflows
        .map((workflow) => ({
            workflow: workflow.name,
            runs: input.executions.filter((execution) => execution.workflowId === workflow.id).length,
        }))
        .sort((a, b) => b.runs - a.runs)
        .slice(0, 5);

    const logsByLevel = ["info", "warn", "error", "debug"].map((level) => ({
        level,
        count: input.logs.filter((log) => log.level === level).length,
    }));

    const avgDuration =
        input.executions.filter((execution) => execution.durationMs > 0).reduce((sum, execution) => sum + execution.durationMs, 0) /
        Math.max(input.executions.filter((execution) => execution.durationMs > 0).length, 1);

    return {
        executionsByStatus,
        topWorkflows,
        logsByLevel,
        averageDurationMs: Math.round(avgDuration),
    };
};

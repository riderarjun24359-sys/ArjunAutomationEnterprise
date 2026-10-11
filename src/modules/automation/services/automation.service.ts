import {
    buildAiAgentPayload,
    buildAutomationActivityPayload,
    buildAutomationAnalytics,
    buildAutomationDashboardStats,
    buildAutomationLogPayload,
    buildExecutionPayload,
    buildWorkflowActionRecords,
    buildWorkflowConditionRecords,
    buildWorkflowPayload,
    buildWorkflowScheduleRecords,
    buildWorkflowTriggerRecords,
    mapAiAgent,
    mapAutomationLog,
    mapWorkflow,
    mapWorkflowAction,
    mapWorkflowCondition,
    mapWorkflowExecution,
    mapWorkflowSchedule,
    mapWorkflowTemplate,
    mapWorkflowTrigger,
} from "@/src/modules/database/lib/automation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { buildProductionHealthReport } from "@/src/lib/production-health";
import { EXECUTABLE_ACTIONS, runLocalWorkflow } from "../lib/local-worker";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import { taskService } from "@/src/modules/tasks/services/task.service";
import type {
    AiAgent,
    AutomationAnalytics,
    AutomationDashboardStats,
    AutomationLog,
    CreateAiAgentInput,
    CreateWorkflowInput,
    Workflow,
    WorkflowExecution,
    WorkflowTemplate,
} from "@/src/modules/automation/types";

export class AutomationService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getAgentMap(organizationId: string) {
        const agents = await databaseService.aiAgents.listByOrganization(organizationId);
        return new Map(agents.map((agent) => [agent.id, agent.name]));
    }

    private async getTemplateMap(organizationId: string) {
        const templates = await databaseService.workflowTemplates.listByOrganization(organizationId);
        return new Map(templates.map((template) => [template.id, template.name]));
    }

    private async getWorkflowMap(organizationId: string) {
        const workflows = await databaseService.workflows.listByOrganization(organizationId);
        return new Map(workflows.map((workflow) => [workflow.id, workflow.name]));
    }

    async getAgents(authUserId: string, email: string, fullName?: string | null): Promise<AiAgent[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.aiAgents.listByOrganization(context.organizationId);
        return records.map(mapAiAgent);
    }

    async createAgent(authUserId: string, email: string, input: CreateAiAgentInput, fullName?: string | null): Promise<AiAgent> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.aiAgents.create(buildAiAgentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create AI agent");

        await databaseService.activityLogs.create(buildAutomationActivityPayload(context.organizationId, "ai_agent", created.id, "create", created.name, "AI agent created"));
        return mapAiAgent(created);
    }

    async getTemplates(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowTemplate[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const records = await databaseService.workflowTemplates.listByOrganization(context.organizationId);
        return records.map(mapWorkflowTemplate);
    }

    async getWorkflows(authUserId: string, email: string, fullName?: string | null): Promise<Workflow[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, agentMap, templateMap] = await Promise.all([
            databaseService.workflows.listByOrganization(context.organizationId),
            this.getAgentMap(context.organizationId),
            this.getTemplateMap(context.organizationId),
        ]);

        return Promise.all(
            records.map(async (record) => {
                const [triggers, actions, conditions, schedules] = await Promise.all([
                    databaseService.workflowTriggers.listByWorkflow(record.id),
                    databaseService.workflowActions.listByWorkflow(record.id),
                    databaseService.workflowConditions.listByWorkflow(record.id),
                    databaseService.workflowSchedules.listByWorkflow(record.id),
                ]);

                return mapWorkflow(
                    record,
                    record.agent_id ? agentMap.get(record.agent_id) : null,
                    record.template_id ? templateMap.get(record.template_id) : null,
                    triggers.map(mapWorkflowTrigger),
                    actions.map((action) => mapWorkflowAction(action, action.agent_id ? agentMap.get(action.agent_id) : null)),
                    conditions.map(mapWorkflowCondition),
                    schedules.map(mapWorkflowSchedule),
                );
            }),
        );
    }

    async createWorkflow(authUserId: string, email: string, input: CreateWorkflowInput, fullName?: string | null): Promise<Workflow> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const created = await databaseService.workflows.create(buildWorkflowPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create workflow");

        const triggerRecords = buildWorkflowTriggerRecords(created.id, input.triggers);
        const actionRecords = buildWorkflowActionRecords(created.id, input.actions);
        const conditionRecords = buildWorkflowConditionRecords(created.id, input.conditions);
        const scheduleRecords = buildWorkflowScheduleRecords(created.id, input.schedules);

        for (const record of triggerRecords) {
            await databaseService.workflowTriggers.create(record);
        }
        for (const record of actionRecords) {
            await databaseService.workflowActions.create(record);
        }
        for (const record of conditionRecords) {
            await databaseService.workflowConditions.create(record);
        }
        for (const record of scheduleRecords) {
            await databaseService.workflowSchedules.create(record);
        }

        await databaseService.activityLogs.create(buildAutomationActivityPayload(context.organizationId, "workflow", created.id, "create", created.name, "Workflow created"));
        await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Workflow "${created.name}" created`, "info", created.id));

        const workflows = await this.getWorkflows(authUserId, email, fullName);
        const workflow = workflows.find((item) => item.id === created.id);
        if (!workflow) throw new Error("Failed to load created workflow");
        return workflow;
    }

    async updateWorkflowStatus(authUserId: string, email: string, workflowId: string, status: Workflow["status"], fullName?: string | null): Promise<Workflow> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const updated = await databaseService.workflows.update(workflowId, { status });
        if (!updated) throw new Error("Failed to update workflow status");

        await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Workflow "${updated.name}" status changed to ${status}`, "info", updated.id));

        const workflows = await this.getWorkflows(authUserId, email, fullName);
        const workflow = workflows.find((item) => item.id === workflowId);
        if (!workflow) throw new Error("Failed to load updated workflow");
        return workflow;
    }

    async runWorkflow(authUserId: string, email: string, workflowId: string, fullName?: string | null): Promise<WorkflowExecution> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");

        const workflowRecord = await databaseService.workflows.getById(workflowId);
        if (!workflowRecord) throw new Error("Workflow not found");

        // Idempotency for manual runs: a double-click must not create two
        // executions. Reuse a run started within the window instead.
        const recent = await databaseService.workflowExecutions.listByOrganization(context.organizationId);
        const windowStart = Date.now() - 2 * 60_000;
        const inFlight = recent.find((record) => {
            const started = new Date(record.started_at ?? record.created_at ?? 0).getTime();
            return record.workflow_id === workflowId && record.status === "running" && Number.isFinite(started) && started >= windowStart;
        });
        if (inFlight) {
            await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Manual execution deduped for "${workflowRecord.name}" (already running)`, "info", workflowId, inFlight.id));
            const executions = await this.getExecutions(authUserId, email, fullName);
            const existing = executions.find((item) => item.id === inFlight.id);
            if (existing) return existing;
        }

        const execution = await databaseService.workflowExecutions.create(buildExecutionPayload(context.organizationId, workflowId, "manual"));
        if (!execution) throw new Error("Failed to start workflow execution");

        await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Manual execution started for "${workflowRecord.name}"`, "info", workflowId, execution.id));

        const finish = async (status: string, result: Record<string, unknown>, errorMessage: string, logLevel: "info" | "warn" | "error", logMessage: string) => {
            const updated = await databaseService.workflowExecutions.update(execution.id, {
                status,
                completed_at: new Date().toISOString(),
                duration_ms: typeof result.durationMs === "number" ? result.durationMs : 0,
                result,
                error_message: errorMessage,
            });
            await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, logMessage, logLevel, workflowId, execution.id));
            const executions = await this.getExecutions(authUserId, email, fullName);
            const found = executions.find((item) => item.id === (updated?.id ?? execution.id));
            if (!found) throw new Error("Failed to load workflow execution");
            return found;
        };

        const [actionRecords, conditionRecords] = await Promise.all([
            databaseService.workflowActions.listByWorkflow(workflowId),
            databaseService.workflowConditions.listByWorkflow(workflowId),
        ]);

        if (actionRecords.length === 0) {
            return finish("failed",
                { steps_executed: 0, status: "not-executed", reason: "Workflow has no actions; nothing to execute" },
                "Workflow has no actions defined",
                "warn",
                `Execution for "${workflowRecord.name}" did not run: no actions defined`);
        }

        const unsupported = [...new Set(actionRecords.map((a) => a.action_type).filter((kind) => !(EXECUTABLE_ACTIONS as readonly string[]).includes(kind)))];
        if (unsupported.length > 0) {
            const reason = `Unsupported action kinds for local execution: ${unsupported.join(", ")} (executable: ${EXECUTABLE_ACTIONS.join(", ")})`;
            return finish("failed",
                { steps_executed: 0, status: "not-executed", reason },
                reason,
                "warn",
                `Execution for "${workflowRecord.name}" did not run: ${reason}`);
        }

        const workerResult = await runLocalWorkflow({
            executionId: execution.id,
            actions: actionRecords.map((a) => ({ stepOrder: a.step_order, actionType: a.action_type, config: (a.config ?? {}) as Record<string, unknown> })),
            conditions: conditionRecords.map((c) => ({ field: c.field, operator: c.operator, value: c.value })),
            triggerPayload: {},
            ports: {
                createTask: async (taskInput) => taskService.createTaskSystemWide(context.organizationId, {
                    title: taskInput.title,
                    description: taskInput.description,
                    status: "todo",
                    priority: "medium",
                    dueDate: taskInput.dueDate,
                }),
                recordLog: async (message, level) => {
                    await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, message, level, workflowId, execution.id));
                },
                now: () => Date.now(),
            },
        });

        return finish(workerResult.status,
            { steps_executed: workerResult.steps.filter((s) => s.status === "completed").length, status: workerResult.status, steps: workerResult.steps, durationMs: workerResult.durationMs },
            workerResult.error ?? "",
            workerResult.status === "completed" ? "info" : workerResult.status === "cancelled" ? "warn" : "error",
            workerResult.status === "completed"
                ? `Execution completed for "${workflowRecord.name}" (${workerResult.steps.length} steps)`
                : `Execution ${workerResult.status} for "${workflowRecord.name}": ${workerResult.error ?? "see steps"}`);
    }

    async getExecutions(authUserId: string, email: string, fullName?: string | null): Promise<WorkflowExecution[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, workflowMap] = await Promise.all([
            databaseService.workflowExecutions.listByOrganization(context.organizationId),
            this.getWorkflowMap(context.organizationId),
        ]);

        return records.map((record) => mapWorkflowExecution(record, workflowMap.get(record.workflow_id)));
    }

    async getLogs(authUserId: string, email: string, fullName?: string | null): Promise<AutomationLog[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];

        const [records, workflowMap] = await Promise.all([
            databaseService.automationLogs.listByOrganization(context.organizationId),
            this.getWorkflowMap(context.organizationId),
        ]);

        return records.map((record) => mapAutomationLog(record, record.workflow_id ? workflowMap.get(record.workflow_id) : null));
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<AutomationDashboardStats> {
        const [workflows, agents, executions, logs] = await Promise.all([
            this.getWorkflows(authUserId, email, fullName),
            this.getAgents(authUserId, email, fullName),
            this.getExecutions(authUserId, email, fullName),
            this.getLogs(authUserId, email, fullName),
        ]);

        return buildAutomationDashboardStats({ workflows, agents, executions, logs });
    }

    async getAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<AutomationAnalytics> {
        const [workflows, executions, logs] = await Promise.all([
            this.getWorkflows(authUserId, email, fullName),
            this.getExecutions(authUserId, email, fullName),
            this.getLogs(authUserId, email, fullName),
        ]);

        return buildAutomationAnalytics({ workflows, executions, logs });
    }

    async detectAndRemediateCriticalHealth(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<boolean> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return false;

        const health = buildProductionHealthReport();
        const existingTasks = await taskService.getTasks(authUserId, email, fullName);
        const incidentTask = existingTasks.find(t => t.title.includes("System Health critical") && t.status === "todo");

        if (health.status === "healthy") {
            if (incidentTask) {
                await taskService.updateTask(authUserId, email, incidentTask.id, { status: "done" }, fullName);
                await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Incident recovery verified for task ${incidentTask.id}`, "info", incidentTask.id));
            }
            return true;
        }

        if (health.status !== "critical") return false;

        if (incidentTask) {
            // Check for escalation
            const createdAt = new Date(incidentTask.createdAt).getTime();
            if (Date.now() - createdAt > 3600000) { // 1 hour threshold
                await taskService.updateTask(authUserId, email, incidentTask.id, { priority: "urgent" }, fullName);
                await databaseService.automationLogs.create(buildAutomationLogPayload(context.organizationId, `Incident escalated for task ${incidentTask.id}`, "warn", incidentTask.id));
            }
            return false;
        }

        // Propose remediation using AI
        const aiResponse = await aiOrchestrationService.executeTask(authUserId, email, {
            taskType: "remediate_incident",
            moduleSource: "automation",
            inputPayload: { healthStatus: health.status, checks: health.checks },
        }, fullName);

        // Create a remediation task
        await taskService.createTask(authUserId, email, {
            title: `Remediation required: System Health ${health.status}`,
            description: `AI recommended remediation: ${JSON.stringify(aiResponse)}`,
            status: "todo",
            priority: "high",
            dueDate: new Date().toISOString(),
        }, fullName);

        return true;
    }
}

export const automationService = new AutomationService();

import {
    AAE_ACTION_TYPES,
    AAE_EXECUTION_STATUSES,
    AAE_INTEGRATION_TYPES,
    AAE_TEMPLATE_CATEGORIES,
    AAE_TRIGGER_TYPES,
    type AaeActionType,
    type AaeExecutionStatus,
    type AaeIntegrationType,
    type AaeNodeKind,
    type AaeTemplateCategory,
    type AaeTriggerType,
} from "../constants";
import type {
    ActionsLibrary,
    AiAutomationEngineRawData,
    AiAutomationEngineSnapshot,
    AiWorkflowGenerator,
    ApprovalCenter,
    ExecutionCenter,
    ExecutiveAutomationDashboard,
    IntegrationHub,
    MonitoringDashboard,
    TemplateMarketplace,
    TriggerCenter,
    WorkflowBuilderBoard,
    WorkflowBuilderNode,
} from "../types";

function avg(nums: number[]): number | null {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function money(n: number): number {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

export function classifyNodeKind(type: string, name = ""): AaeNodeKind {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("loop") || s.includes("foreach") || s.includes("iterate")) return "loop";
    if (s.includes("delay") || s.includes("wait") || s.includes("sleep") || s.includes("timer")) return "delay";
    if (s.includes("branch") || s.includes("fork") || s.includes("switch") || s.includes("transition")) return "branch";
    if (s.includes("condition") || s.includes("decision") || s.includes("if ")) return "condition";
    if (s.includes("template") || s.includes("subflow")) return "template";
    if (s.includes("trigger") || s.includes("event") || s.includes("webhook") || s.includes("schedule")) return "trigger";
    return "action";
}

export function classifyTriggerType(type: string, name = ""): AaeTriggerType {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("form") || s.includes("submission")) return "form_submitted";
    if (s.includes("lead")) return "lead_created";
    if (s.includes("deal") && (s.includes("won") || s.includes("closed"))) return "deal_won";
    if (s.includes("invoice") || s.includes("overdue") || s.includes("billing")) return "invoice_overdue";
    if (s.includes("customer") || s.includes("client") || s.includes("account")) return "customer_created";
    if (s.includes("webhook") || s.includes("http")) return "webhook";
    if (s.includes("manual") || s.includes("on_demand") || s.includes("button")) return "manual";
    if (s.includes("schedule") || s.includes("cron") || s.includes("time") || s.includes("interval")) return "schedule";
    return "manual";
}

export function classifyActionType(type: string, name = ""): AaeActionType {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("whatsapp") || s.includes("wa ")) return "send_whatsapp";
    if (s.includes("email") || s.includes("mail")) return "send_email";
    if (s.includes("crm") || s.includes("contact") || s.includes("record")) return "create_crm_record";
    if (s.includes("task") || s.includes("todo")) return "create_task";
    if (s.includes("deal") || s.includes("pipeline") || s.includes("opportunity")) return "update_deal";
    if (s.includes("publish") || s.includes("post") || s.includes("content")) return "publish_content";
    if (s.includes("report") || s.includes("analytics")) return "generate_report";
    if (s.includes("video")) return "ai_video_generation";
    if (s.includes("image") || s.includes("visual") || s.includes("banner")) return "ai_image_generation";
    if (s.includes("ai") || s.includes("generate") || s.includes("llm") || s.includes("prompt")) {
        return "ai_content_generation";
    }
    if (s.includes("http") || s.includes("api") || s.includes("webhook") || s.includes("request")) {
        return "custom_http_request";
    }
    return "create_task";
}

export function classifyTemplateCategory(category: string, name = ""): AaeTemplateCategory {
    const s = `${category} ${name}`.toLowerCase();
    if (s.includes("market") || s.includes("campaign") || s.includes("content")) return "marketing";
    if (s.includes("sale") || s.includes("lead") || s.includes("deal") || s.includes("crm")) return "sales";
    if (s.includes("success") || s.includes("support") || s.includes("csat") || s.includes("renewal")) {
        return "customer_success";
    }
    if (s.includes("finance") || s.includes("invoice") || s.includes("billing") || s.includes("payment")) {
        return "finance";
    }
    if (s.includes("hr") || s.includes("people") || s.includes("employee") || s.includes("payroll")) return "hr";
    return "operations";
}

export function classifyIntegrationType(type: string, name = ""): AaeIntegrationType {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("slack")) return "slack";
    if (s.includes("discord")) return "discord";
    if (s.includes("github") || s.includes("git")) return "github";
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    if (s.includes("drive") || s.includes("google")) return "google_drive";
    if (s.includes("calendar") || s.includes("ical") || s.includes("meeting")) return "calendar";
    if (s.includes("webhook") || s.includes("http")) return "webhooks";
    if (s.includes("email") || s.includes("smtp") || s.includes("mail")) return "email";
    return "webhooks";
}

export function normalizeExecutionStatus(status: string): AaeExecutionStatus {
    const s = status.toLowerCase();
    if (s.includes("retry") || s.includes("queued") || s.includes("pending_retry")) return "retry";
    if (s.includes("fail") || s.includes("error") || s.includes("abort")) return "failed";
    if (s.includes("complete") || s.includes("success") || s.includes("done") || s.includes("finished")) {
        return "completed";
    }
    if (s.includes("run") || s.includes("active") || s.includes("progress") || s.includes("started")) {
        return "running";
    }
    return "running";
}

export const aaePure = {
    avg,
    money,
    classifyNodeKind,
    classifyTriggerType,
    classifyActionType,
    classifyTemplateCategory,
    classifyIntegrationType,
    normalizeExecutionStatus,
};

export function buildWorkflowBuilder(data: AiAutomationEngineRawData): WorkflowBuilderBoard {
    const nodes: WorkflowBuilderNode[] = [];

    for (const n of data.dweNodes) {
        nodes.push({
            id: n.id,
            name: n.node_name,
            kind: classifyNodeKind(n.node_type, n.node_name),
            order: n.node_order,
            status: n.status,
            detail: n.node_type,
        });
    }
    for (const d of data.dweDecisions) {
        nodes.push({
            id: d.id,
            name: d.decision_name,
            kind: "condition",
            order: nodes.length,
            status: d.status,
            detail: `${d.decision_expression} → ${d.default_branch}`,
        });
    }
    for (const t of data.dweTransitions) {
        nodes.push({
            id: t.id,
            name: t.transition_name,
            kind: "branch",
            order: nodes.length,
            status: t.status,
            detail: `${t.source_node_ref} → ${t.target_node_ref}`,
        });
    }
    for (const c of data.workflowConditions) {
        nodes.push({
            id: c.id,
            name: `${c.field} ${c.operator} ${c.value}`,
            kind: "condition",
            order: c.step_order,
            status: "active",
            detail: c.logic_group || "condition",
        });
    }
    for (const a of data.workflowActions) {
        nodes.push({
            id: a.id,
            name: a.action_type,
            kind: classifyNodeKind(a.action_type),
            order: a.step_order,
            status: "active",
            detail: `step ${a.step_order}`,
        });
    }
    for (const s of data.dweSubflows) {
        nodes.push({
            id: s.id,
            name: s.subflow_name,
            kind: "template",
            order: nodes.length,
            status: s.status,
            detail: s.subflow_type,
        });
    }

    nodes.sort((a, b) => a.order - b.order);

    const workflows = [
        ...data.workflows.map((w) => ({
            id: w.id,
            name: w.name,
            status: w.status,
            version: w.version,
            nodeCount: data.workflowActions.filter((a) => a.workflow_id === w.id).length
                + data.workflowConditions.filter((c) => c.workflow_id === w.id).length,
        })),
        ...data.dweDefinitions.map((d) => ({
            id: d.id,
            name: d.workflow_name,
            status: d.status,
            version: 1,
            nodeCount: data.dweNodes.length,
        })),
    ];

    return {
        workflows,
        nodes,
        conditions: nodes.filter((n) => n.kind === "condition").length,
        branches: nodes.filter((n) => n.kind === "branch").length,
        delays: nodes.filter((n) => n.kind === "delay").length,
        loops: nodes.filter((n) => n.kind === "loop").length,
        templates: data.workflowTemplates.length + data.dweTemplates.length + data.dweSubflows.length,
    };
}

export function buildTriggerCenter(data: AiAutomationEngineRawData): TriggerCenter {
    const rows = [
        ...data.workflowTriggers.map((t) => ({
            id: t.id,
            name: t.event_name || t.trigger_type,
            type: classifyTriggerType(t.trigger_type, t.event_name),
            source: "workflow",
            active: t.is_active,
            detail: t.trigger_type,
        })),
        ...data.workflowSchedules.map((s) => ({
            id: s.id,
            name: s.cron_expression,
            type: "schedule" as AaeTriggerType,
            source: "schedule",
            active: s.is_active,
            detail: s.next_run_at || "scheduled",
        })),
        ...data.dweBusinessTriggers.map((t) => ({
            id: t.id,
            name: t.trigger_name,
            type: classifyTriggerType(t.event_type, t.trigger_name),
            source: "business_event",
            active: !/inactive|disabled/i.test(t.status),
            detail: t.event_type,
        })),
        ...data.dweWebhookTriggers.map((t) => ({
            id: t.id,
            name: t.trigger_name,
            type: "webhook" as AaeTriggerType,
            source: "webhook",
            active: !/inactive|disabled/i.test(t.status),
            detail: t.webhook_url,
        })),
        ...data.dweTimeTriggers.map((t) => ({
            id: t.id,
            name: t.trigger_name,
            type: "schedule" as AaeTriggerType,
            source: "time",
            active: !/inactive|disabled/i.test(t.status),
            detail: t.cron_expression,
        })),
        ...data.dweScheduledTriggers.map((t) => ({
            id: t.id,
            name: t.trigger_name,
            type: "schedule" as AaeTriggerType,
            source: "interval",
            active: !/inactive|disabled/i.test(t.status),
            detail: t.schedule_type,
        })),
    ];

    return {
        rows,
        byType: AAE_TRIGGER_TYPES.map((type) => ({
            type,
            count: rows.filter((r) => r.type === type).length,
        })),
    };
}

export function buildActionsLibrary(data: AiAutomationEngineRawData): ActionsLibrary {
    const rows = [
        ...data.workflowActions.map((a) => ({
            id: a.id,
            name: a.action_type,
            type: classifyActionType(a.action_type),
            source: "workflow_action",
            detail: `step ${a.step_order}`,
        })),
        ...data.dweApiCalls.map((a) => ({
            id: a.id,
            name: a.api_name,
            type: "custom_http_request" as AaeActionType,
            source: "api",
            detail: `${a.http_method} ${a.endpoint_url}`,
        })),
        ...data.dweNotifications.map((n) => ({
            id: n.id,
            name: n.notification_name,
            type: classifyActionType(n.channel, n.notification_name),
            source: "notification",
            detail: n.channel,
        })),
        ...data.aiAgents.map((a) => ({
            id: a.id,
            name: a.name,
            type: classifyActionType(a.description, a.name),
            source: "ai_agent",
            detail: a.status,
        })),
    ];

    // Ensure architecture coverage for WhatsApp and AI media actions when agents exist
    if (data.aiAgents.length && !rows.some((r) => r.type === "send_whatsapp")) {
        rows.push({
            id: "arch-whatsapp",
            name: "WhatsApp send (architecture)",
            type: "send_whatsapp",
            source: "architecture",
            detail: "Provider-agnostic WhatsApp action slot",
        });
    }

    return {
        rows,
        byType: AAE_ACTION_TYPES.map((type) => ({
            type,
            count: rows.filter((r) => r.type === type).length,
        })),
    };
}

export function buildAiWorkflowGenerator(data: AiAutomationEngineRawData): AiWorkflowGenerator {
    const failed = data.dweFailed.length + data.workflowExecutions.filter((e) => /fail|error/i.test(e.status)).length;
    const metrics = data.dweMetrics[0];
    const insights = [
        {
            id: "gen-1",
            kind: "generated" as const,
            title: "Natural language workflow drafts",
            detail: `AI agents available: ${data.aiAgents.length}. Definitions: ${data.dweDefinitions.length}. Classic workflows: ${data.workflows.length}.`,
            severity: "low" as const,
        },
        {
            id: "opt-1",
            kind: "optimization" as const,
            title: "Workflow optimization",
            detail:
                metrics
                    ? `Success ${metrics.success_rate}%, avg duration ${metrics.average_duration_ms}ms, bottleneck score available.`
                    : "Connect execution metrics to unlock optimization scoring.",
            severity: metrics && metrics.success_rate < 80 ? ("medium" as const) : ("low" as const),
        },
        {
            id: "err-1",
            kind: "error" as const,
            title: "Error detection",
            detail: failed
                ? `${failed} failed executions detected across live automation logs.`
                : "No failed executions in current window.",
            severity: failed > 5 ? ("high" as const) : failed > 0 ? ("medium" as const) : ("low" as const),
        },
        {
            id: "imp-1",
            kind: "improvement" as const,
            title: "Suggested improvements",
            detail:
                data.dweRetries.length > 0
                    ? `Retry queue has ${data.dweRetries.length} items — add backoff and approval gates for high-risk actions.`
                    : "Add approval gates for high-risk actions and expand webhook coverage.",
            severity: "medium" as const,
        },
    ];

    return {
        promptSamples: [
            "When a lead is created, score it and assign an owner",
            "If an invoice is overdue, send payment reminder and create a task",
            "When a deal is won, create onboarding tasks and notify success",
        ],
        insights,
        generatedCount: data.aiAgents.length + data.dweDefinitions.length,
    };
}

export function buildExecutionCenter(data: AiAutomationEngineRawData): ExecutionCenter {
    const classic = data.workflowExecutions.map((e) => {
        const wf = data.workflows.find((w) => w.id === e.workflow_id);
        return {
            id: e.id,
            name: wf?.name || e.workflow_id,
            status: normalizeExecutionStatus(e.status),
            startedAt: e.started_at,
            durationMs: e.duration_ms,
            error: e.error_message,
            logLevel: e.error_message ? "error" : "info",
        };
    });

    const dwe = data.dweExecutions.map((e) => ({
        id: e.id,
        name: e.execution_name,
        status: normalizeExecutionStatus(e.execution_status || e.status),
        startedAt: e.started_at,
        durationMs: 0,
        error: "",
        logLevel: "info",
    }));

    const failedExtra = data.dweFailed.map((f) => ({
        id: f.id,
        name: f.failure_type,
        status: "failed" as AaeExecutionStatus,
        startedAt: f.failed_at,
        durationMs: 0,
        error: f.error_message,
        logLevel: "error",
    }));

    const retries = data.dweRetries.map((r) => ({
        id: r.id,
        name: r.retry_key,
        status: "retry" as AaeExecutionStatus,
        startedAt: r.next_retry_at || "",
        durationMs: 0,
        error: r.retry_status,
        logLevel: "warn",
    }));

    const rows = [...classic, ...dwe, ...failedExtra, ...retries];
    return {
        rows,
        byStatus: AAE_EXECUTION_STATUSES.map((status) => ({
            status,
            count: rows.filter((r) => r.status === status).length,
        })),
        logs: [
            ...data.automationLogs.slice(0, 40).map((l) => ({
                id: l.id,
                level: l.level,
                message: l.message,
                createdAt: l.created_at,
            })),
            ...data.dweHistory.slice(0, 20).map((h) => ({
                id: h.id,
                level: h.history_type,
                message: h.history_summary,
                createdAt: h.recorded_at,
            })),
        ],
        retryQueue: data.dweRetries.length + rows.filter((r) => r.status === "retry").length,
    };
}

export function buildApprovalCenter(data: AiAutomationEngineRawData): ApprovalCenter {
    const rows = [
        ...data.dweApprovals.map((a) => {
            const s = `${a.task_name} ${a.task_status}`.toLowerCase();
            const audience = s.includes("founder")
                ? ("founder" as const)
                : s.includes("risk") || s.includes("high")
                  ? ("high_risk" as const)
                  : ("admin" as const);
            return {
                id: a.id,
                name: a.task_name,
                audience,
                status: a.task_status || a.status,
                dueAt: a.due_at || "",
            };
        }),
        ...data.dweManualReviews.map((r) => ({
            id: r.id,
            name: r.review_name,
            audience: /founder/i.test(r.review_name) ? ("founder" as const) : ("admin" as const),
            status: r.review_status || r.status,
            dueAt: "",
        })),
    ];

    return {
        rows,
        founderCount: rows.filter((r) => r.audience === "founder").length,
        adminCount: rows.filter((r) => r.audience === "admin").length,
        highRiskCount: rows.filter((r) => r.audience === "high_risk").length,
        auditTrail: data.dweAudit.slice(0, 40).map((a) => ({
            id: a.id,
            action: a.action,
            summary: a.summary,
            securityLevel: a.security_level,
            createdAt: a.created_at,
        })),
    };
}

export function buildMonitoringDashboard(data: AiAutomationEngineRawData): MonitoringDashboard {
    const metric = data.dweMetrics[0];
    const health = data.dweHealth[0];
    const exec = buildExecutionCenter(data);
    const completed = exec.byStatus.find((s) => s.status === "completed")?.count ?? 0;
    const failed = exec.byStatus.find((s) => s.status === "failed")?.count ?? 0;
    const total = completed + failed + (exec.byStatus.find((s) => s.status === "running")?.count ?? 0);
    const successRate =
        metric?.success_rate
        ?? (total > 0 ? Math.round((completed / total) * 1000) / 10 : null);
    const avgMs =
        metric?.average_duration_ms
        ?? avg(data.workflowExecutions.map((e) => e.duration_ms).filter((n) => n > 0));
    const active =
        health?.running_workflows_count
        ?? data.workflows.filter((w) => /active|published|enabled/i.test(w.status)).length
            + data.dweDefinitions.filter((d) => /active|published|enabled/i.test(d.status)).length;

    const savingsHours = money(
        ((metric?.execution_count ?? exec.rows.length) * Math.max(2, (avgMs ?? 120000) / 60000)) / 60,
    );

    return {
        activeWorkflows: active,
        successRate,
        failures: failed + data.dweFailed.length,
        avgExecutionMs: avgMs,
        automationSavingsHours: savingsHours,
        healthScore: health?.overall_score ?? metric?.overall_workflow_score ?? null,
    };
}

export function buildTemplateMarketplace(data: AiAutomationEngineRawData): TemplateMarketplace {
    const rows = [
        ...data.workflowTemplates.map((t) => ({
            id: t.id,
            name: t.name,
            category: classifyTemplateCategory(t.category, t.name),
            description: t.description,
            status: t.is_public ? "public" : "private",
        })),
        ...data.dweTemplates.map((t) => ({
            id: t.id,
            name: t.template_name,
            category: classifyTemplateCategory(t.template_type, t.template_name),
            description: t.description,
            status: t.status,
        })),
        ...data.dweCategories.map((c) => ({
            id: c.id,
            name: c.category_name,
            category: classifyTemplateCategory(c.category_type, c.category_name),
            description: c.category_type,
            status: c.status,
        })),
    ];

    return {
        rows,
        byCategory: AAE_TEMPLATE_CATEGORIES.map((category) => ({
            category,
            count: rows.filter((r) => r.category === category).length,
        })),
    };
}

export function buildIntegrationHub(data: AiAutomationEngineRawData): IntegrationHub {
    const rows = [
        ...data.dweIntegrations.map((i) => ({
            id: i.id,
            name: i.integration_name,
            type: classifyIntegrationType(i.integration_type, i.integration_name),
            status: i.status,
            architecture: "live",
        })),
        ...data.dweApiCalls.map((a) => ({
            id: a.id,
            name: a.api_name,
            type: "webhooks" as AaeIntegrationType,
            status: a.status,
            architecture: `${a.http_method} architecture`,
        })),
        ...data.dweNotifications.map((n) => ({
            id: `notif-${n.id}`,
            name: n.notification_name,
            type: classifyIntegrationType(n.channel, n.notification_name),
            status: n.status,
            architecture: "channel architecture",
        })),
    ];

    // Ensure architecture surface for required hubs
    for (const type of AAE_INTEGRATION_TYPES) {
        if (!rows.some((r) => r.type === type)) {
            rows.push({
                id: `arch-${type}`,
                name: `${type} architecture`,
                type,
                status: "ready",
                architecture: "provider-agnostic slot",
            });
        }
    }

    return {
        rows,
        byType: AAE_INTEGRATION_TYPES.map((type) => ({
            type,
            count: rows.filter((r) => r.type === type).length,
        })),
    };
}

export function buildExecutiveDashboard(data: AiAutomationEngineRawData): ExecutiveAutomationDashboard {
    const monitoring = buildMonitoringDashboard(data);
    const exec = buildExecutionCenter(data);
    const byWorkflow = new Map<string, { executions: number; success: number }>();
    for (const row of exec.rows) {
        const cur = byWorkflow.get(row.name) ?? { executions: 0, success: 0 };
        cur.executions += 1;
        if (row.status === "completed") cur.success += 1;
        byWorkflow.set(row.name, cur);
    }
    const topAutomations = [...byWorkflow.entries()]
        .map(([name, v]) => ({
            name,
            executions: v.executions,
            successRate: v.executions ? Math.round((v.success / v.executions) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.executions - a.executions)
        .slice(0, 5);

    const timeSaved = monitoring.automationSavingsHours;
    const roi = money(timeSaved * 45);
    const generator = buildAiWorkflowGenerator(data);

    return {
        automationRoi: roi,
        timeSavedHours: timeSaved,
        workflowHealth: monitoring.healthScore,
        topAutomations,
        aiRecommendations: generator.insights.map((i) => i.title),
        summary:
            data.dweHealth[0]?.summary
            || `Automation ROI ${roi}, time saved ${timeSaved}h, health ${monitoring.healthScore ?? "—"}.`,
    };
}

export function createEmptyAiAutomationEngineSnapshot(
    accessGranted: boolean,
    reason?: string,
): AiAutomationEngineSnapshot {
    return {
        organizationId: null,
        accessGranted,
        accessDeniedReason: reason,
        fetchedAt: new Date().toISOString(),
        builder: {
            workflows: [],
            nodes: [],
            conditions: 0,
            branches: 0,
            delays: 0,
            loops: 0,
            templates: 0,
        },
        triggers: { rows: [], byType: AAE_TRIGGER_TYPES.map((type) => ({ type, count: 0 })) },
        actions: { rows: [], byType: AAE_ACTION_TYPES.map((type) => ({ type, count: 0 })) },
        generator: { promptSamples: [], insights: [], generatedCount: 0 },
        execution: {
            rows: [],
            byStatus: AAE_EXECUTION_STATUSES.map((status) => ({ status, count: 0 })),
            logs: [],
            retryQueue: 0,
        },
        approvals: { rows: [], founderCount: 0, adminCount: 0, highRiskCount: 0, auditTrail: [] },
        monitoring: {
            activeWorkflows: 0,
            successRate: null,
            failures: 0,
            avgExecutionMs: null,
            automationSavingsHours: 0,
            healthScore: null,
        },
        templates: {
            rows: [],
            byCategory: AAE_TEMPLATE_CATEGORIES.map((category) => ({ category, count: 0 })),
        },
        integrations: {
            rows: [],
            byType: AAE_INTEGRATION_TYPES.map((type) => ({ type, count: 0 })),
        },
        executive: {
            automationRoi: 0,
            timeSavedHours: 0,
            workflowHealth: null,
            topAutomations: [],
            aiRecommendations: [],
            summary: "",
        },
    };
}

export function buildAiAutomationEngineSnapshot(data: AiAutomationEngineRawData): AiAutomationEngineSnapshot {
    return {
        organizationId: data.organizationId,
        accessGranted: true,
        fetchedAt: new Date().toISOString(),
        builder: buildWorkflowBuilder(data),
        triggers: buildTriggerCenter(data),
        actions: buildActionsLibrary(data),
        generator: buildAiWorkflowGenerator(data),
        execution: buildExecutionCenter(data),
        approvals: buildApprovalCenter(data),
        monitoring: buildMonitoringDashboard(data),
        templates: buildTemplateMarketplace(data),
        integrations: buildIntegrationHub(data),
        executive: buildExecutiveDashboard(data),
    };
}

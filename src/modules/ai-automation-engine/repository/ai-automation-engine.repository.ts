import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type { AiAutomationEngineRawData } from "../types";

const LIMIT = 500;
const q = { limit: LIMIT, orderBy: "created_at" as const, orderDirection: "desc" as const };
const CHILD_WORKFLOW_CAP = 40;

export class AiAutomationEngineRepository {
    async loadOrganizationData(
        authUserId: string,
        email: string,
        fullName?: string | null,
    ): Promise<AiAutomationEngineRawData | null> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);
        if (!context) return null;

        const orgId = context.organizationId;
        const membershipsForUser = await databaseService.memberships.getByUser(context.profileId).catch(() => []);
        const membershipRole =
            membershipsForUser.find((m) => m.organization_id === orgId)?.role_name ??
            membershipsForUser[0]?.role_name ??
            null;

        const [
            workflows,
            workflowTemplates,
            workflowExecutions,
            automationLogs,
            aiAgents,
            dweDefinitions,
            dweNodes,
            dweDecisions,
            dweTransitions,
            dweTemplates,
            dweCategories,
            dweExecutions,
            dweRetries,
            dweHistory,
            dweBusinessTriggers,
            dweWebhookTriggers,
            dweTimeTriggers,
            dweScheduledTriggers,
            dweApprovals,
            dweManualReviews,
            dweIntegrations,
            dweApiCalls,
            dweNotifications,
            dweMetrics,
            dweHealth,
            dweFailed,
            dweAnalytics,
            dweAudit,
            dweSubflows,
        ] = await Promise.all([
            databaseService.workflows.listByOrganization(orgId, q).catch(() => []),
            databaseService.workflowTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.workflowExecutions.listByOrganization(orgId, q).catch(() => []),
            databaseService.automationLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.aiAgents.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowDefinitions.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowNodes.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweDecisionNodes.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowTransitions.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowTemplates.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowCategories.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowExecutions.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweExecutionRetries.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweExecutionHistory.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweBusinessEventTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWebhookTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweTimeTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweScheduledTriggers.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweApprovalTasks.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweManualReviews.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweAutomationIntegrations.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweAutomationApiCalls.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweAutomationNotifications.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowMetrics.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweWorkflowHealth.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweFailedExecutions.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweExecutionAnalytics.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweAuditLogs.listByOrganization(orgId, q).catch(() => []),
            databaseService.dweReusableSubflows.listByOrganization(orgId, q).catch(() => []),
        ]);

        const scopedWorkflows = workflows.slice(0, CHILD_WORKFLOW_CAP);
        const childBundles = await Promise.all(
            scopedWorkflows.map(async (w) => {
                const [triggers, actions, conditions, schedules] = await Promise.all([
                    databaseService.workflowTriggers.listByWorkflow(w.id).catch(() => []),
                    databaseService.workflowActions.listByWorkflow(w.id).catch(() => []),
                    databaseService.workflowConditions.listByWorkflow(w.id).catch(() => []),
                    databaseService.workflowSchedules.listByWorkflow(w.id).catch(() => []),
                ]);
                return { triggers, actions, conditions, schedules };
            }),
        );

        const workflowTriggers = childBundles.flatMap((b) => b.triggers);
        const workflowActions = childBundles.flatMap((b) => b.actions);
        const workflowConditions = childBundles.flatMap((b) => b.conditions);
        const workflowSchedules = childBundles.flatMap((b) => b.schedules);

        return {
            organizationId: orgId,
            membershipRole,
            workflows: workflows.map((w) => ({
                id: w.id,
                name: w.name,
                description: w.description,
                status: w.status,
                version: Number(w.version ?? 1),
            })),
            workflowTemplates: workflowTemplates.map((t) => ({
                id: t.id,
                name: t.name,
                description: t.description,
                category: t.category,
                is_public: Boolean(t.is_public),
            })),
            workflowTriggers: workflowTriggers.map((t) => ({
                id: t.id,
                workflow_id: t.workflow_id,
                trigger_type: t.trigger_type,
                event_name: t.event_name,
                is_active: Boolean(t.is_active),
            })),
            workflowActions: workflowActions.map((a) => ({
                id: a.id,
                workflow_id: a.workflow_id,
                step_order: Number(a.step_order ?? 0),
                action_type: a.action_type,
            })),
            workflowConditions: workflowConditions.map((c) => ({
                id: c.id,
                workflow_id: c.workflow_id,
                step_order: Number(c.step_order ?? 0),
                field: c.field,
                operator: c.operator,
                value: c.value,
                logic_group: c.logic_group,
            })),
            workflowSchedules: workflowSchedules.map((s) => ({
                id: s.id,
                workflow_id: s.workflow_id,
                cron_expression: s.cron_expression,
                is_active: Boolean(s.is_active),
                next_run_at: s.next_run_at ?? null,
            })),
            workflowExecutions: workflowExecutions.map((e) => ({
                id: e.id,
                workflow_id: e.workflow_id,
                status: e.status,
                trigger_type: e.trigger_type,
                started_at: e.started_at,
                completed_at: e.completed_at ?? null,
                duration_ms: Number(e.duration_ms ?? 0),
                error_message: e.error_message,
            })),
            automationLogs: automationLogs.map((l) => ({
                id: l.id,
                workflow_id: l.workflow_id ?? null,
                execution_id: l.execution_id ?? null,
                level: l.level,
                message: l.message,
                created_at: l.created_at,
            })),
            aiAgents: aiAgents.map((a) => ({
                id: a.id,
                name: a.name,
                status: a.status,
                description: a.description,
            })),
            dweDefinitions: dweDefinitions.map((d) => ({
                id: d.id,
                workflow_name: d.workflow_name,
                workflow_type: d.workflow_type,
                description: d.description,
                status: d.status,
            })),
            dweNodes: dweNodes.map((n) => ({
                id: n.id,
                node_name: n.node_name,
                node_type: n.node_type,
                node_order: Number(n.node_order ?? 0),
                status: n.status,
            })),
            dweDecisions: dweDecisions.map((d) => ({
                id: d.id,
                decision_name: d.decision_name,
                decision_expression: d.decision_expression,
                default_branch: d.default_branch,
                status: d.status,
            })),
            dweTransitions: dweTransitions.map((t) => ({
                id: t.id,
                transition_name: t.transition_name,
                source_node_ref: t.source_node_ref,
                target_node_ref: t.target_node_ref,
                status: t.status,
            })),
            dweTemplates: dweTemplates.map((t) => ({
                id: t.id,
                template_name: t.template_name,
                template_type: t.template_type,
                description: t.description,
                status: t.status,
            })),
            dweCategories: dweCategories.map((c) => ({
                id: c.id,
                category_name: c.category_name,
                category_type: c.category_type,
                status: c.status,
            })),
            dweExecutions: dweExecutions.map((e) => ({
                id: e.id,
                execution_name: e.execution_name,
                execution_status: e.execution_status,
                started_at: e.started_at,
                status: e.status,
            })),
            dweRetries: dweRetries.map((r) => ({
                id: r.id,
                retry_key: r.retry_key,
                retry_count: Number(r.retry_count ?? 0),
                retry_status: r.retry_status,
                next_retry_at: r.next_retry_at ?? null,
                status: r.status,
            })),
            dweHistory: dweHistory.map((h) => ({
                id: h.id,
                history_type: h.history_type,
                history_summary: h.history_summary,
                recorded_at: h.recorded_at,
                status: h.status,
            })),
            dweBusinessTriggers: dweBusinessTriggers.map((t) => ({
                id: t.id,
                trigger_name: t.trigger_name,
                event_type: t.event_type,
                status: t.status,
            })),
            dweWebhookTriggers: dweWebhookTriggers.map((t) => ({
                id: t.id,
                trigger_name: t.trigger_name,
                webhook_url: t.webhook_url,
                status: t.status,
            })),
            dweTimeTriggers: dweTimeTriggers.map((t) => ({
                id: t.id,
                trigger_name: t.trigger_name,
                cron_expression: t.cron_expression,
                status: t.status,
            })),
            dweScheduledTriggers: dweScheduledTriggers.map((t) => ({
                id: t.id,
                trigger_name: t.trigger_name,
                schedule_type: t.schedule_type,
                status: t.status,
            })),
            dweApprovals: dweApprovals.map((a) => ({
                id: a.id,
                task_name: a.task_name,
                task_status: a.task_status,
                due_at: a.due_at ?? null,
                status: a.status,
            })),
            dweManualReviews: dweManualReviews.map((r) => ({
                id: r.id,
                review_name: r.review_name,
                review_status: r.review_status,
                status: r.status,
            })),
            dweIntegrations: dweIntegrations.map((i) => ({
                id: i.id,
                integration_name: i.integration_name,
                integration_type: i.integration_type,
                status: i.status,
            })),
            dweApiCalls: dweApiCalls.map((a) => ({
                id: a.id,
                api_name: a.api_name,
                endpoint_url: a.endpoint_url,
                http_method: a.http_method,
                status: a.status,
            })),
            dweNotifications: dweNotifications.map((n) => ({
                id: n.id,
                notification_name: n.notification_name,
                channel: n.channel,
                status: n.status,
            })),
            dweMetrics: dweMetrics.map((m) => ({
                id: m.id,
                metric_date: m.metric_date,
                execution_count: Number(m.execution_count ?? 0),
                average_duration_ms: Number(m.average_duration_ms ?? 0),
                failure_rate: Number(m.failure_rate ?? 0),
                success_rate: Number(m.success_rate ?? 0),
                overall_workflow_score: Number(m.overall_workflow_score ?? 0),
            })),
            dweHealth: dweHealth.map((h) => ({
                id: h.id,
                health_date: h.health_date,
                overall_score: Number(h.overall_score ?? 0),
                running_workflows_count: Number(h.running_workflows_count ?? 0),
                pending_tasks_count: Number(h.pending_tasks_count ?? 0),
                automation_health_status: h.automation_health_status,
                summary: h.summary,
            })),
            dweFailed: dweFailed.map((f) => ({
                id: f.id,
                failure_type: f.failure_type,
                error_message: f.error_message,
                failed_at: f.failed_at,
                status: f.status,
            })),
            dweAnalytics: dweAnalytics.map((a) => ({
                id: a.id,
                analytics_type: a.analytics_type,
                analytics_score: Number(a.analytics_score ?? 0),
                metric_date: a.metric_date,
                status: a.status,
            })),
            dweAudit: dweAudit.map((a) => ({
                id: a.id,
                action: a.action,
                summary: a.summary,
                security_level: a.security_level,
                created_at: a.created_at,
            })),
            dweSubflows: dweSubflows.map((s) => ({
                id: s.id,
                subflow_name: s.subflow_name,
                subflow_type: s.subflow_type,
                status: s.status,
            })),
        };
    }
}

export const aiAutomationEngineRepository = new AiAutomationEngineRepository();

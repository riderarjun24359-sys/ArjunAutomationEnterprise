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
import { getRepositoryClient, getSelectedOrganizationId, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAutomationRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client || getSelectedOrganizationId() !== organizationId) return [];

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async getById(id: string): Promise<T | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId) return null;

        const { data, error } = await client.from(this.table).select("*").eq("id", id).eq("organization_id", organizationId).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId || input.organization_id !== organizationId) return null;

        if (this.table === "workflows") {
            if (typeof input.agent_id === "string") {
                const agent = await client.from("ai_agents").select("id").eq("id", input.agent_id).eq("organization_id", organizationId).maybeSingle();
                if (agent.error || !agent.data) return null;
            }
            if (typeof input.template_id === "string") {
                const template = await client.from("workflow_templates").select("id").eq("id", input.template_id).eq("organization_id", organizationId).maybeSingle();
                if (template.error || !template.data) return null;
            }
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId || (input.organization_id !== undefined && input.organization_id !== organizationId)) return null;

        const { data, error } = await client.from(this.table).update({ ...input, organization_id: organizationId }).eq("id", id).eq("organization_id", organizationId).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId) return false;

        const { error } = await client.from(this.table).delete().eq("id", id).eq("organization_id", organizationId);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

abstract class WorkflowChildRepository<T> extends BaseRepository<T> {
    async listByWorkflow(workflowId: string): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const organizationId = getSelectedOrganizationId();
        if (!organizationId) return [];
        const parent = await client.from("workflows").select("id").eq("id", workflowId).eq("organization_id", organizationId).maybeSingle();
        if (parent.error || !parent.data) return [];
        const { data, error } = await client.from(this.table).select("*").eq("workflow_id", workflowId).order(this.orderColumn);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        const workflowId = typeof input.workflow_id === "string" ? input.workflow_id : null;
        if (!client || !organizationId || !workflowId) return null;

        const parent = await client.from("workflows").select("id").eq("id", workflowId).eq("organization_id", organizationId).maybeSingle();
        if (parent.error || !parent.data) return null;
        if (typeof input.agent_id === "string") {
            const agent = await client.from("ai_agents").select("id").eq("id", input.agent_id).eq("organization_id", organizationId).maybeSingle();
            if (agent.error || !agent.data) return null;
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async deleteByWorkflow(workflowId: string): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;

        const organizationId = getSelectedOrganizationId();
        if (!organizationId) return;
        const parent = await client.from("workflows").select("id").eq("id", workflowId).eq("organization_id", organizationId).maybeSingle();
        if (parent.error || !parent.data) return;
        const { error } = await client.from(this.table).delete().eq("workflow_id", workflowId);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
    }

    protected abstract orderColumn: string;
}

export class AiAgentRepository extends OrgAutomationRepository<DbAiAgent> {
    protected table = "ai_agents";
}

export class WorkflowTemplateRepository extends OrgAutomationRepository<DbWorkflowTemplate> {
    protected table = "workflow_templates";
}

export class WorkflowRepository extends OrgAutomationRepository<DbWorkflow> {
    protected table = "workflows";
}

export class WorkflowTriggerRepository extends WorkflowChildRepository<DbWorkflowTrigger> {
    protected table = "workflow_triggers";
    protected orderColumn = "created_at";
}

export class WorkflowActionRepository extends WorkflowChildRepository<DbWorkflowAction> {
    protected table = "workflow_actions";
    protected orderColumn = "step_order";
}

export class WorkflowConditionRepository extends WorkflowChildRepository<DbWorkflowCondition> {
    protected table = "workflow_conditions";
    protected orderColumn = "step_order";
}

export class WorkflowScheduleRepository extends WorkflowChildRepository<DbWorkflowSchedule> {
    protected table = "workflow_schedules";
    protected orderColumn = "created_at";
}

export class WorkflowExecutionRepository extends OrgAutomationRepository<DbWorkflowExecution> {
    protected table = "workflow_executions";
}

export class AutomationLogRepository extends OrgAutomationRepository<DbAutomationLog> {
    protected table = "automation_logs";
}

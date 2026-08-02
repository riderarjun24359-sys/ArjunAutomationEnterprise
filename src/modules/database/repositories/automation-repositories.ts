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
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgAutomationRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

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
        if (!client) return null;

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, `Failed to get ${this.table}`);
        return (data as T | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to update ${this.table}`);
        return (data as T | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) return false;

        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, `Failed to delete ${this.table}`);
        return !error;
    }
}

abstract class WorkflowChildRepository<T> extends BaseRepository<T> {
    async listByWorkflow(workflowId: string): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];

        const { data, error } = await client.from(this.table).select("*").eq("workflow_id", workflowId).order(this.orderColumn);
        mapRepositoryError(error, `Failed to list ${this.table}`);
        return (data ?? []) as T[];
    }

    async create(input: Record<string, unknown>): Promise<T | null> {
        const client = getRepositoryClient();
        if (!client) return null;

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, `Failed to create ${this.table}`);
        return (data as T | null) ?? null;
    }

    async deleteByWorkflow(workflowId: string): Promise<void> {
        const client = getRepositoryClient();
        if (!client) return;

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

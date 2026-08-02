import type { DbTask, DbTaskLabel } from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class TaskRepository extends BaseRepository<DbTask> {
    protected table = "tasks";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbTask[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        let request = client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        if (query.filters?.project_id) {
            request = request.eq("project_id", String(query.filters.project_id));
        }

        const { data, error } = await request;
        mapRepositoryError(error, "Failed to list tasks");
        return (data ?? []) as DbTask[];
    }

    async getById(id: string): Promise<DbTask | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get task");
        return (data as DbTask | null) ?? null;
    }

    async create(input: Record<string, unknown>): Promise<DbTask | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).insert(input).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create task");
        return (data as DbTask | null) ?? null;
    }

    async update(id: string, input: Record<string, unknown>): Promise<DbTask | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).update(input).eq("id", id).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to update task");
        return (data as DbTask | null) ?? null;
    }

    async delete(id: string): Promise<boolean> {
        const client = getRepositoryClient();
        if (!client) {
            return false;
        }

        const { error } = await client.from(this.table).delete().eq("id", id);
        mapRepositoryError(error, "Failed to delete task");
        return !error;
    }

    async listLabels(organizationId: string): Promise<DbTaskLabel[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from("task_labels").select("*").eq("organization_id", organizationId).order("name");
        mapRepositoryError(error, "Failed to list task labels");
        return (data ?? []) as DbTaskLabel[];
    }

    async listLabelAssignments(taskIds: string[]): Promise<Array<{ task_id: string; label_id: string }>> {
        const client = getRepositoryClient();
        if (!client || taskIds.length === 0) {
            return [];
        }

        const { data, error } = await client.from("task_label_assignments").select("task_id, label_id").in("task_id", taskIds);
        mapRepositoryError(error, "Failed to list task label assignments");
        return (data ?? []) as Array<{ task_id: string; label_id: string }>;
    }

    async setLabelAssignments(taskId: string, labelIds: string[]): Promise<void> {
        const client = getRepositoryClient();
        if (!client) {
            return;
        }

        await client.from("task_label_assignments").delete().eq("task_id", taskId);

        if (labelIds.length === 0) {
            return;
        }

        const { error } = await client.from("task_label_assignments").insert(labelIds.map((labelId) => ({ task_id: taskId, label_id: labelId })));
        mapRepositoryError(error, "Failed to set task label assignments");
    }
}

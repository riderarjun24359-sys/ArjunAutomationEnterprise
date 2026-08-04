import type {
    DbProject,
    DbProjectComment,
    DbProjectFile,
    DbProjectMember,
    DbProjectMilestone,
    DbProjectTimeEntry,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ProjectRepository extends BaseRepository<DbProject> {
    protected table = "projects";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbProject[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const normalized = this.buildQuery(query);
        const { data, error } = await client
            .from(this.table)
            .select("*")
            .eq("organization_id", organizationId)
            .order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" })
            .range(normalized.offset, normalized.offset + normalized.limit - 1);

        mapRepositoryError(error, "Failed to list projects");
        return (data ?? []) as DbProject[];
    }

    async getById(id: string): Promise<DbProject | null> {
        const client = getRepositoryClient();
        if (!client) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).maybeSingle();
        mapRepositoryError(error, "Failed to get project");
        return (data as DbProject | null) ?? null;
    }

    async create(payload: Partial<DbProject>): Promise<DbProject | null> {
        const client = await import("@/src/modules/database/lib/repository-client").then((m) => m.getRepositoryClientAsync());
        if (!client) return null;
        const { data, error } = await client.from(this.table).insert(payload).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create project");
        return (data as DbProject | null) ?? null;
    }

    async listByClientId(clientId: string): Promise<DbProject[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from(this.table).select("*").eq("client_id", clientId).order("updated_at", { ascending: false });
        mapRepositoryError(error, "Failed to list projects by client");
        return (data ?? []) as DbProject[];
    }

    async listMilestones(projectId: string): Promise<DbProjectMilestone[]> {
        return this.listChildRecords<DbProjectMilestone>("project_milestones", projectId);
    }

    async listMembers(projectId: string): Promise<DbProjectMember[]> {
        return this.listChildRecords<DbProjectMember>("project_members", projectId);
    }

    async listTimeEntries(projectId: string): Promise<DbProjectTimeEntry[]> {
        return this.listChildRecords<DbProjectTimeEntry>("project_time_entries", projectId);
    }

    async listFiles(projectId: string): Promise<DbProjectFile[]> {
        return this.listChildRecords<DbProjectFile>("project_files", projectId);
    }

    async listComments(projectId: string): Promise<DbProjectComment[]> {
        return this.listChildRecords<DbProjectComment>("project_comments", projectId);
    }

    private async listChildRecords<T>(table: string, projectId: string): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) {
            return [];
        }

        const { data, error } = await client.from(table).select("*").eq("project_id", projectId).order("created_at", { ascending: false });
        mapRepositoryError(error, `Failed to list ${table}`);
        return (data ?? []) as T[];
    }
}

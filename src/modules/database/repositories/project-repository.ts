import type {
    DbProject,
    DbProjectComment,
    DbProjectFile,
    DbProjectMember,
    DbProjectMilestone,
    DbProjectTimeEntry,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, getSelectedOrganizationId, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

export class ProjectRepository extends BaseRepository<DbProject> {
    protected table = "projects";

    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<DbProject[]> {
        const client = getRepositoryClient();
        if (!client || getSelectedOrganizationId() !== organizationId) {
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
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId) {
            return null;
        }

        const { data, error } = await client.from(this.table).select("*").eq("id", id).eq("organization_id", organizationId).maybeSingle();
        mapRepositoryError(error, "Failed to get project");
        return (data as DbProject | null) ?? null;
    }

    async create(payload: Partial<DbProject>): Promise<DbProject | null> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId || payload.organization_id !== organizationId) return null;
        if (typeof payload.client_id === "string") {
            const owner = await client.from("clients").select("id").eq("id", payload.client_id).eq("organization_id", organizationId).maybeSingle();
            if (owner.error || !owner.data) return null;
        }
        const { data, error } = await client.from(this.table).insert(payload).select("*").maybeSingle();
        mapRepositoryError(error, "Failed to create project");
        return (data as DbProject | null) ?? null;
    }

    async listByClientId(clientId: string): Promise<DbProject[]> {
        const client = getRepositoryClient();
        const organizationId = getSelectedOrganizationId();
        if (!client || !organizationId) {
            return [];
        }

        const { data, error } = await client.from(this.table).select("*").eq("client_id", clientId).eq("organization_id", organizationId).order("updated_at", { ascending: false });
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

        const organizationId = getSelectedOrganizationId();
        if (!organizationId) return [];
        const parent = await client.from(this.table).select("id").eq("id", projectId).eq("organization_id", organizationId).maybeSingle();
        if (parent.error || !parent.data) return [];
        const { data, error } = await client.from(table).select("*").eq("project_id", projectId).order("created_at", { ascending: false });
        mapRepositoryError(error, `Failed to list ${table}`);
        return (data ?? []) as T[];
    }
}

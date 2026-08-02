import type {
    DbKnowledgeAdr,
    DbKnowledgeAiContext,
    DbKnowledgeAnalytics,
    DbKnowledgeAuditLog,
    DbKnowledgeClientMemory,
    DbKnowledgeComponent,
    DbKnowledgeCrossLink,
    DbKnowledgeDocumentation,
    DbKnowledgeEntry,
    DbKnowledgePattern,
    DbKnowledgePermission,
    DbKnowledgeProjectMemory,
    DbKnowledgePromptBase,
    DbKnowledgeSemanticIndex,
    DbKnowledgeSolution,
    DbKnowledgeVersion,
} from "@/src/modules/database/types/platform";
import { getRepositoryClient, mapRepositoryError } from "@/src/modules/database/lib/repository-client";
import { BaseRepository, type RepositoryQuery } from "@/src/modules/database/repositories/base-repository";

abstract class OrgKnowledgeRepository<T> extends BaseRepository<T> {
    async listByOrganization(organizationId: string, query: RepositoryQuery = {}): Promise<T[]> {
        const client = getRepositoryClient();
        if (!client) return [];
        const normalized = this.buildQuery(query);
        const { data, error } = await client.from(this.table).select("*").eq("organization_id", organizationId).order(normalized.orderBy, { ascending: normalized.orderDirection === "asc" }).range(normalized.offset, normalized.offset + normalized.limit - 1);
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
}

export class KnowledgeEntryRepository extends OrgKnowledgeRepository<DbKnowledgeEntry> { protected table = "knowledge_entries"; }
export class KnowledgeSemanticIndexRepository extends OrgKnowledgeRepository<DbKnowledgeSemanticIndex> { protected table = "knowledge_semantic_index"; }
export class KnowledgeSolutionRepository extends OrgKnowledgeRepository<DbKnowledgeSolution> { protected table = "knowledge_solutions"; }
export class KnowledgeAdrRepository extends OrgKnowledgeRepository<DbKnowledgeAdr> { protected table = "knowledge_adrs"; }
export class KnowledgePromptBaseRepository extends OrgKnowledgeRepository<DbKnowledgePromptBase> { protected table = "knowledge_prompt_base"; }
export class KnowledgeProjectMemoryRepository extends OrgKnowledgeRepository<DbKnowledgeProjectMemory> { protected table = "knowledge_project_memory"; }
export class KnowledgeClientMemoryRepository extends OrgKnowledgeRepository<DbKnowledgeClientMemory> { protected table = "knowledge_client_memory"; }
export class KnowledgeComponentRepository extends OrgKnowledgeRepository<DbKnowledgeComponent> { protected table = "knowledge_components"; }
export class KnowledgePatternRepository extends OrgKnowledgeRepository<DbKnowledgePattern> { protected table = "knowledge_patterns"; }
export class KnowledgeDocumentationRepository extends OrgKnowledgeRepository<DbKnowledgeDocumentation> { protected table = "knowledge_documentation"; }
export class KnowledgeAiContextRepository extends OrgKnowledgeRepository<DbKnowledgeAiContext> { protected table = "knowledge_ai_contexts"; }
export class KnowledgeVersionRepository extends OrgKnowledgeRepository<DbKnowledgeVersion> { protected table = "knowledge_versions"; }
export class KnowledgeAnalyticsRepository extends OrgKnowledgeRepository<DbKnowledgeAnalytics> { protected table = "knowledge_analytics"; }
export class KnowledgePermissionRepository extends OrgKnowledgeRepository<DbKnowledgePermission> { protected table = "knowledge_permissions"; }
export class KnowledgeCrossLinkRepository extends OrgKnowledgeRepository<DbKnowledgeCrossLink> { protected table = "knowledge_cross_links"; }
export class KnowledgeAuditLogRepository extends OrgKnowledgeRepository<DbKnowledgeAuditLog> { protected table = "knowledge_audit_logs"; }

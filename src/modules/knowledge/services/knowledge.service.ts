import {
    buildAdrPayload,
    buildAiContextPayload,
    buildClientMemoryPayload,
    buildComponentPayload,
    buildCrossLinkPayload,
    buildCrossModuleLinks,
    buildDocumentationPayload,
    buildEntryPayload,
    buildKnowledgeAuditPayload,
    buildKnowledgeDashboardStats,
    buildKnowledgeReport,
    buildLookupMaps,
    buildPatternPayload,
    buildPermissionGrantPayload,
    buildProjectMemoryPayload,
    buildPromptPayload,
    buildSemanticIndexPayload,
    buildSolutionPayload,
    buildVersionPayload,
    mapAdrSummary,
    mapAiContextSummary,
    mapAnalyticsSummary,
    mapAuditEntry,
    mapClientMemorySummary,
    mapComponentSummary,
    mapCrossLinkSummary,
    mapDocumentationSummary,
    mapEntrySummary,
    mapPatternSummary,
    mapPermissionGrantSummary,
    mapProjectMemorySummary,
    mapPromptSummary,
    mapSemanticIndexSummary,
    mapSolutionSummary,
    mapVersionSummary,
    searchSemanticIndex,
} from "@/src/modules/database/lib/knowledge-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    AdrSummary,
    AiContextSummary,
    AnalyticsSummary,
    AuditEntry,
    ClientMemorySummary,
    ComponentSummary,
    CreateAdrInput,
    CreateAiContextInput,
    CreateClientMemoryInput,
    CreateComponentInput,
    CreateCrossLinkInput,
    CreateDocumentationInput,
    CreateEntryInput,
    CreatePatternInput,
    CreatePermissionGrantInput,
    CreateProjectMemoryInput,
    CreatePromptInput,
    CreateSemanticIndexInput,
    CreateSolutionInput,
    CreateVersionInput,
    CrossLinkSummary,
    CrossModuleLinks,
    DocumentationSummary,
    EntrySummary,
    KnowledgeDashboardStats,
    KnowledgeReport,
    KnowledgeSearchResult,
    KnowledgeSdkContextInput,
    KnowledgeSdkContextResult,
    KnowledgeSdkMemoryInput,
    KnowledgeSdkMemoryResult,
    KnowledgeSdkSearchInput,
    PatternSummary,
    PermissionGrantSummary,
    ProjectMemorySummary,
    PromptSummary,
    SemanticIndexSummary,
    SolutionSummary,
    VersionSummary,
} from "@/src/modules/knowledge/types";

export class KnowledgeService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const [entries, clients, projects, employees, agents, sessions] = await Promise.all([
            databaseService.knowledgeEntries.listByOrganization(organizationId),
            databaseService.clients.listByOrganization(organizationId),
            databaseService.projects.listByOrganization(organizationId),
            databaseService.employees.listByOrganization(organizationId),
            databaseService.aiOrchestrationAgents.listByOrganization(organizationId),
            databaseService.aiSessions.listByOrganization(organizationId),
        ]);
        return buildLookupMaps(entries, clients, projects, employees, agents, sessions);
    }

    async getEntries(authUserId: string, email: string, fullName?: string | null): Promise<EntrySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeEntries.listByOrganization(context.organizationId)).map((entry) => mapEntrySummary(entry, maps));
    }

    async createEntry(authUserId: string, email: string, input: CreateEntryInput, fullName?: string | null): Promise<EntrySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeEntries.create(buildEntryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create knowledge entry");
        await databaseService.knowledgeSemanticIndex.create(buildSemanticIndexPayload(context.organizationId, { entryId: created.id, searchText: `${created.title} ${created.content}` }));
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "entry", "create", `Entry ${created.title} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapEntrySummary(created, maps);
    }

    async getSemanticIndex(authUserId: string, email: string, fullName?: string | null): Promise<SemanticIndexSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeSemanticIndex.listByOrganization(context.organizationId)).map((record) => mapSemanticIndexSummary(record, maps));
    }

    async createSemanticIndex(authUserId: string, email: string, input: CreateSemanticIndexInput, fullName?: string | null): Promise<SemanticIndexSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeSemanticIndex.create(buildSemanticIndexPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create semantic index");
        const maps = await this.getMaps(context.organizationId);
        return mapSemanticIndexSummary(created, maps);
    }

    async searchKnowledge(authUserId: string, email: string, query: string, fullName?: string | null): Promise<KnowledgeSearchResult[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const [indexRecords, entries] = await Promise.all([
            databaseService.knowledgeSemanticIndex.listByOrganization(context.organizationId),
            databaseService.knowledgeEntries.listByOrganization(context.organizationId),
        ]);
        const maps = buildLookupMaps(entries, [], [], [], [], []);
        return searchSemanticIndex(indexRecords, entries, query, maps);
    }

    async getSolutions(authUserId: string, email: string, fullName?: string | null): Promise<SolutionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeSolutions.listByOrganization(context.organizationId)).map(mapSolutionSummary);
    }

    async createSolution(authUserId: string, email: string, input: CreateSolutionInput, fullName?: string | null): Promise<SolutionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeSolutions.create(buildSolutionPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create solution");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "solution", "create", `Solution ${created.name} created`, created.id));
        return mapSolutionSummary(created);
    }

    async getAdrs(authUserId: string, email: string, fullName?: string | null): Promise<AdrSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeAdrs.listByOrganization(context.organizationId, { orderBy: "adr_number", orderDirection: "asc" })).map(mapAdrSummary);
    }

    async createAdr(authUserId: string, email: string, input: CreateAdrInput, fullName?: string | null): Promise<AdrSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = await databaseService.knowledgeAdrs.listByOrganization(context.organizationId);
        const adrNumber = existing.length > 0 ? Math.max(...existing.map((adr) => adr.adr_number)) + 1 : 1;
        const created = await databaseService.knowledgeAdrs.create(buildAdrPayload(context.organizationId, input, adrNumber));
        if (!created) throw new Error("Failed to create ADR");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "adr", "create", `ADR-${created.adr_number} ${created.title} created`, created.id));
        return mapAdrSummary(created);
    }

    async getPrompts(authUserId: string, email: string, fullName?: string | null): Promise<PromptSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgePromptBase.listByOrganization(context.organizationId)).map(mapPromptSummary);
    }

    async createPrompt(authUserId: string, email: string, input: CreatePromptInput, fullName?: string | null): Promise<PromptSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgePromptBase.create(buildPromptPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create prompt");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "prompt", "create", `Prompt ${created.name} created`, created.id));
        return mapPromptSummary(created);
    }

    async getProjectMemories(authUserId: string, email: string, fullName?: string | null): Promise<ProjectMemorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeProjectMemory.listByOrganization(context.organizationId)).map((record) => mapProjectMemorySummary(record, maps));
    }

    async createProjectMemory(authUserId: string, email: string, input: CreateProjectMemoryInput, fullName?: string | null): Promise<ProjectMemorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeProjectMemory.create(buildProjectMemoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create project memory");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "project_memory", "create", `Project memory ${created.memory_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapProjectMemorySummary(created, maps);
    }

    async getClientMemories(authUserId: string, email: string, fullName?: string | null): Promise<ClientMemorySummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeClientMemory.listByOrganization(context.organizationId)).map((record) => mapClientMemorySummary(record, maps));
    }

    async createClientMemory(authUserId: string, email: string, input: CreateClientMemoryInput, fullName?: string | null): Promise<ClientMemorySummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeClientMemory.create(buildClientMemoryPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create client memory");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "client_memory", "create", `Client memory ${created.memory_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapClientMemorySummary(created, maps);
    }

    async getComponents(authUserId: string, email: string, fullName?: string | null): Promise<ComponentSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeComponents.listByOrganization(context.organizationId)).map(mapComponentSummary);
    }

    async createComponent(authUserId: string, email: string, input: CreateComponentInput, fullName?: string | null): Promise<ComponentSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeComponents.create(buildComponentPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create component");
        return mapComponentSummary(created);
    }

    async getPatterns(authUserId: string, email: string, fullName?: string | null): Promise<PatternSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgePatterns.listByOrganization(context.organizationId)).map(mapPatternSummary);
    }

    async createPattern(authUserId: string, email: string, input: CreatePatternInput, fullName?: string | null): Promise<PatternSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgePatterns.create(buildPatternPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create pattern");
        return mapPatternSummary(created);
    }

    async getDocumentation(authUserId: string, email: string, fullName?: string | null): Promise<DocumentationSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeDocumentation.listByOrganization(context.organizationId)).map(mapDocumentationSummary);
    }

    async createDocumentation(authUserId: string, email: string, input: CreateDocumentationInput, fullName?: string | null): Promise<DocumentationSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeDocumentation.create(buildDocumentationPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create documentation");
        return mapDocumentationSummary(created);
    }

    async getAiContexts(authUserId: string, email: string, fullName?: string | null): Promise<AiContextSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeAiContexts.listByOrganization(context.organizationId)).map((record) => mapAiContextSummary(record, maps));
    }

    async createAiContext(authUserId: string, email: string, input: CreateAiContextInput, fullName?: string | null): Promise<AiContextSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeAiContexts.create(buildAiContextPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create AI context");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "ai_context", "create", `AI context ${created.context_key} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapAiContextSummary(created, maps);
    }

    async getVersions(authUserId: string, email: string, fullName?: string | null): Promise<VersionSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeVersions.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((record) => mapVersionSummary(record, maps));
    }

    async createVersion(authUserId: string, email: string, input: CreateVersionInput, fullName?: string | null): Promise<VersionSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const entry = await databaseService.knowledgeEntries.getById(input.entryId);
        if (!entry) throw new Error("Entry not found");
        const versionNumber = entry.current_version + 1;
        const created = await databaseService.knowledgeVersions.create(buildVersionPayload(context.organizationId, input, versionNumber));
        if (!created) throw new Error("Failed to create version");
        await databaseService.knowledgeEntries.update(entry.id, { content: input.content, current_version: versionNumber });
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "version", "create", `Version ${versionNumber} created for ${entry.title}`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapVersionSummary(created, maps);
    }

    async getAnalytics(authUserId: string, email: string, fullName?: string | null): Promise<AnalyticsSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeAnalytics.listByOrganization(context.organizationId, { orderBy: "computed_at", orderDirection: "desc" })).map(mapAnalyticsSummary);
    }

    async getPermissionGrants(authUserId: string, email: string, fullName?: string | null): Promise<PermissionGrantSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgePermissions.listByOrganization(context.organizationId)).map((record) => mapPermissionGrantSummary(record, maps));
    }

    async createPermissionGrant(authUserId: string, email: string, input: CreatePermissionGrantInput, fullName?: string | null): Promise<PermissionGrantSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgePermissions.create(buildPermissionGrantPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create permission grant");
        const maps = await this.getMaps(context.organizationId);
        return mapPermissionGrantSummary(created, maps);
    }

    async getCrossLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossLinkSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        const maps = await this.getMaps(context.organizationId);
        return (await databaseService.knowledgeCrossLinks.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map((record) => mapCrossLinkSummary(record, maps));
    }

    async createCrossLink(authUserId: string, email: string, input: CreateCrossLinkInput, fullName?: string | null): Promise<CrossLinkSummary> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.knowledgeCrossLinks.create(buildCrossLinkPayload(context.organizationId, input));
        if (!created) throw new Error("Failed to create cross link");
        await databaseService.knowledgeAuditLogs.create(buildKnowledgeAuditPayload(context.organizationId, "cross_link", "create", `Cross-module link from ${created.source_module} created`, created.id));
        const maps = await this.getMaps(context.organizationId);
        return mapCrossLinkSummary(created, maps);
    }

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeAuditLogs.listByOrganization(context.organizationId, { orderBy: "created_at", orderDirection: "desc" })).map(mapAuditEntry);
    }

    async getReport(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeReport> {
        const [entries, analytics] = await Promise.all([
            this.getEntries(authUserId, email, fullName),
            this.getAnalytics(authUserId, email, fullName),
        ]);
        return buildKnowledgeReport({ entries, analytics });
    }

    async getCrossModuleLinks(authUserId: string, email: string, fullName?: string | null): Promise<CrossModuleLinks> {
        const crossLinks = await this.getCrossLinks(authUserId, email, fullName);
        return buildCrossModuleLinks({ crossLinks });
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<KnowledgeDashboardStats> {
        const [entries, solutions, adrs, prompts, projectMemories, clientMemories, components, patterns, documentation, aiContexts, versions, crossLinks] = await Promise.all([
            this.getEntries(authUserId, email, fullName),
            this.getSolutions(authUserId, email, fullName),
            this.getAdrs(authUserId, email, fullName),
            this.getPrompts(authUserId, email, fullName),
            this.getProjectMemories(authUserId, email, fullName),
            this.getClientMemories(authUserId, email, fullName),
            this.getComponents(authUserId, email, fullName),
            this.getPatterns(authUserId, email, fullName),
            this.getDocumentation(authUserId, email, fullName),
            this.getAiContexts(authUserId, email, fullName),
            this.getVersions(authUserId, email, fullName),
            this.getCrossLinks(authUserId, email, fullName),
        ]);
        return buildKnowledgeDashboardStats({ entries, solutions, adrs, prompts, projectMemories, clientMemories, components, patterns, documentation, aiContexts, versions, crossLinks });
    }

    async sdkSearch(authUserId: string, email: string, input: KnowledgeSdkSearchInput, fullName?: string | null): Promise<KnowledgeSearchResult[]> {
        const results = await this.searchKnowledge(authUserId, email, input.query, fullName);
        const limit = input.limit ?? 20;
        return results.slice(0, limit);
    }

    async sdkResolveContext(authUserId: string, email: string, input: KnowledgeSdkContextInput, fullName?: string | null): Promise<KnowledgeSdkContextResult> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const existing = (await databaseService.knowledgeAiContexts.listByOrganization(context.organizationId)).find((record) => record.context_key === input.contextKey);
        if (existing) {
            const maps = await this.getMaps(context.organizationId);
            const summary = mapAiContextSummary(existing, maps);
            return { contextId: existing.id, contextKey: existing.context_key, entryTitle: summary.entryTitle, status: existing.status };
        }
        const created = await this.createAiContext(authUserId, email, input, fullName);
        return { contextId: created.id, contextKey: created.contextKey, entryTitle: created.entryTitle, status: created.status };
    }

    async sdkStoreMemory(authUserId: string, email: string, input: KnowledgeSdkMemoryInput, fullName?: string | null): Promise<KnowledgeSdkMemoryResult> {
        if (input.entityType === "client") {
            const created = await this.createClientMemory(authUserId, email, { clientId: input.entityId, memoryKey: input.memoryKey, summary: input.summary, details: input.details }, fullName);
            return { memoryId: created.id, memoryKey: created.memoryKey, summary: created.summary };
        }
        const created = await this.createProjectMemory(authUserId, email, { projectId: input.entityId, memoryKey: input.memoryKey, summary: input.summary, details: input.details }, fullName);
        return { memoryId: created.id, memoryKey: created.memoryKey, summary: created.summary };
    }

    async getEntryOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.knowledgeEntries.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: e.title }));
    }

    async getProjectOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.projects.listByOrganization(context.organizationId)).map((p) => ({ id: p.id, name: p.name }));
    }

    async getClientOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.clients.listByOrganization(context.organizationId)).map((c) => ({ id: c.id, name: c.name }));
    }

    async getAgentOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiOrchestrationAgents.listByOrganization(context.organizationId)).map((a) => ({ id: a.id, name: a.name }));
    }

    async getSessionOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.aiSessions.listByOrganization(context.organizationId)).map((s) => ({ id: s.id, name: s.session_key }));
    }

    async getEmployeeOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.employees.listByOrganization(context.organizationId)).map((e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` }));
    }
}

export const knowledgeService = new KnowledgeService();

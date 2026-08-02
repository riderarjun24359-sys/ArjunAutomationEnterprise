import type {
    DbAiOrchestrationAgent,
    DbAiSession,
    DbClient,
    DbEmployee,
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
    DbProject,
} from "@/src/modules/database/types/platform";
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
    CrossModuleLinks,
    DocumentationSummary,
    EntrySummary,
    KnowledgeDashboardStats,
    KnowledgeReport,
    KnowledgeSearchResult,
    PatternSummary,
    PermissionGrantSummary,
    ProjectMemorySummary,
    PromptSummary,
    SemanticIndexSummary,
    SolutionSummary,
    VersionSummary,
} from "@/src/modules/knowledge/types";

type LookupMaps = {
    entries: Map<string, DbKnowledgeEntry>;
    clients: Map<string, DbClient>;
    projects: Map<string, DbProject>;
    employees: Map<string, DbEmployee>;
    agents: Map<string, DbAiOrchestrationAgent>;
    sessions: Map<string, DbAiSession>;
};

export const buildLookupMaps = (
    entries: DbKnowledgeEntry[],
    clients: DbClient[],
    projects: DbProject[],
    employees: DbEmployee[],
    agents: DbAiOrchestrationAgent[],
    sessions: DbAiSession[],
): LookupMaps => ({
    entries: new Map(entries.map((item) => [item.id, item])),
    clients: new Map(clients.map((item) => [item.id, item])),
    projects: new Map(projects.map((item) => [item.id, item])),
    employees: new Map(employees.map((item) => [item.id, item])),
    agents: new Map(agents.map((item) => [item.id, item])),
    sessions: new Map(sessions.map((item) => [item.id, item])),
});

const clientName = (maps: LookupMaps, id?: string | null) => (id ? maps.clients.get(id)?.name ?? null : null);
const projectName = (maps: LookupMaps, id?: string | null) => (id ? maps.projects.get(id)?.name ?? null : null);
const entryTitle = (maps: LookupMaps, id?: string | null) => (id ? maps.entries.get(id)?.title ?? null : null);
const employeeName = (maps: LookupMaps, id?: string | null) => {
    if (!id) return null;
    const employee = maps.employees.get(id);
    return employee ? `${employee.first_name} ${employee.last_name}` : null;
};

export const mapEntrySummary = (record: DbKnowledgeEntry, maps: LookupMaps): EntrySummary => ({
    id: record.id,
    title: record.title,
    slug: record.slug,
    category: record.category,
    status: record.status,
    contentPreview: record.content.slice(0, 120),
    tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
    clientName: clientName(maps, record.client_id),
    projectName: projectName(maps, record.project_id),
    currentVersion: record.current_version,
    updatedAt: record.updated_at,
});

export const mapSemanticIndexSummary = (record: DbKnowledgeSemanticIndex, maps: LookupMaps): SemanticIndexSummary => ({
    id: record.id,
    entryId: record.entry_id,
    entryTitle: entryTitle(maps, record.entry_id) ?? "Unknown",
    embeddingKey: record.embedding_key,
    searchTextPreview: record.search_text.slice(0, 120),
    indexedAt: record.indexed_at,
});

export const mapSolutionSummary = (record: DbKnowledgeSolution): SolutionSummary => ({
    id: record.id,
    name: record.name,
    category: record.category,
    status: record.status,
    problemPreview: record.problem_statement.slice(0, 100),
    solutionPreview: record.solution_summary.slice(0, 100),
});

export const mapAdrSummary = (record: DbKnowledgeAdr): AdrSummary => ({
    id: record.id,
    adrNumber: record.adr_number,
    title: record.title,
    status: record.status,
    contextPreview: record.context.slice(0, 100),
    decisionPreview: record.decision.slice(0, 100),
});

export const mapPromptSummary = (record: DbKnowledgePromptBase): PromptSummary => ({
    id: record.id,
    name: record.name,
    promptKey: record.prompt_key,
    category: record.category,
    status: record.status,
    contentPreview: record.content.slice(0, 120),
    useCases: Array.isArray(record.use_cases) ? record.use_cases.map(String) : [],
});

export const mapProjectMemorySummary = (record: DbKnowledgeProjectMemory, maps: LookupMaps): ProjectMemorySummary => ({
    id: record.id,
    memoryKey: record.memory_key,
    projectName: projectName(maps, record.project_id) ?? "Unknown",
    summary: record.summary,
    detailsPreview: record.details.slice(0, 100),
});

export const mapClientMemorySummary = (record: DbKnowledgeClientMemory, maps: LookupMaps): ClientMemorySummary => ({
    id: record.id,
    memoryKey: record.memory_key,
    clientName: clientName(maps, record.client_id) ?? "Unknown",
    summary: record.summary,
    detailsPreview: record.details.slice(0, 100),
});

export const mapComponentSummary = (record: DbKnowledgeComponent): ComponentSummary => ({
    id: record.id,
    name: record.name,
    componentType: record.component_type,
    status: record.status,
    descriptionPreview: record.description.slice(0, 100),
});

export const mapPatternSummary = (record: DbKnowledgePattern): PatternSummary => ({
    id: record.id,
    name: record.name,
    patternType: record.pattern_type,
    status: record.status,
    descriptionPreview: record.description.slice(0, 100),
});

export const mapDocumentationSummary = (record: DbKnowledgeDocumentation): DocumentationSummary => ({
    id: record.id,
    title: record.title,
    docKey: record.doc_key,
    moduleSource: record.module_source,
    status: record.status,
    contentPreview: record.content.slice(0, 120),
});

export const mapAiContextSummary = (record: DbKnowledgeAiContext, maps: LookupMaps): AiContextSummary => ({
    id: record.id,
    contextKey: record.context_key,
    agentName: record.agent_id ? maps.agents.get(record.agent_id)?.name ?? null : null,
    sessionKey: record.session_id ? maps.sessions.get(record.session_id)?.session_key ?? null : null,
    entryTitle: entryTitle(maps, record.entry_id),
    status: record.status,
});

export const mapVersionSummary = (record: DbKnowledgeVersion, maps: LookupMaps): VersionSummary => ({
    id: record.id,
    entryTitle: entryTitle(maps, record.entry_id) ?? "Unknown",
    versionNumber: record.version_number,
    changeSummary: record.change_summary,
    createdAt: record.created_at,
});

export const mapAnalyticsSummary = (record: DbKnowledgeAnalytics): AnalyticsSummary => ({
    id: record.id,
    metricKey: record.metric_key,
    metricValue: Number(record.metric_value),
    dimensions: record.dimensions,
    periodStart: record.period_start,
    periodEnd: record.period_end,
    computedAt: record.computed_at,
});

export const mapPermissionGrantSummary = (record: DbKnowledgePermission, maps: LookupMaps): PermissionGrantSummary => ({
    id: record.id,
    granteeType: record.grantee_type,
    granteeName: employeeName(maps, record.grantee_id),
    permissionKey: record.permission_key,
    resourceType: record.resource_type,
    isActive: record.is_active,
});

export const mapCrossLinkSummary = (record: DbKnowledgeCrossLink, maps: LookupMaps): import("@/src/modules/knowledge/types").CrossLinkSummary => ({
    id: record.id,
    sourceModule: record.source_module,
    sourceEntityType: record.source_entity_type,
    entryTitle: entryTitle(maps, record.entry_id),
    linkType: record.link_type,
    createdAt: record.created_at,
});

export const mapAuditEntry = (record: DbKnowledgeAuditLog): AuditEntry => ({
    id: record.id,
    entityType: record.entity_type,
    entityId: record.entity_id ?? null,
    action: record.action,
    summary: record.summary,
    createdAt: record.created_at,
});

export const buildKnowledgeDashboardStats = (input: {
    entries: EntrySummary[];
    solutions: SolutionSummary[];
    adrs: AdrSummary[];
    prompts: PromptSummary[];
    projectMemories: ProjectMemorySummary[];
    clientMemories: ClientMemorySummary[];
    components: ComponentSummary[];
    patterns: PatternSummary[];
    documentation: DocumentationSummary[];
    aiContexts: AiContextSummary[];
    versions: VersionSummary[];
    crossLinks: import("@/src/modules/knowledge/types").CrossLinkSummary[];
}): KnowledgeDashboardStats => ({
    totalEntries: input.entries.length,
    publishedEntries: input.entries.filter((e) => e.status === "published").length,
    totalSolutions: input.solutions.length,
    totalAdrs: input.adrs.length,
    totalPrompts: input.prompts.length,
    projectMemories: input.projectMemories.length,
    clientMemories: input.clientMemories.length,
    totalComponents: input.components.length,
    totalPatterns: input.patterns.length,
    documentationPages: input.documentation.length,
    activeAiContexts: input.aiContexts.filter((c) => c.status === "active").length,
    versionRecords: input.versions.length,
    crossModuleLinks: input.crossLinks.length,
});

export const buildKnowledgeReport = (input: { entries: EntrySummary[]; analytics: AnalyticsSummary[] }): KnowledgeReport => ({
    entriesByCategory: Object.entries(
        input.entries.reduce<Record<string, number>>((acc, entry) => {
            acc[entry.category] = (acc[entry.category] ?? 0) + 1;
            return acc;
        }, {}),
    ).map(([label, count]) => ({ label, count })),
    metricsByKey: input.analytics.map((m) => ({ label: m.metricKey, value: m.metricValue })),
    totalEntries: input.entries.length,
});

export const buildCrossModuleLinks = (input: { crossLinks: import("@/src/modules/knowledge/types").CrossLinkSummary[] }): CrossModuleLinks => {
    const countByModule = (moduleName: string) => input.crossLinks.filter((link) => link.sourceModule === moduleName).length;
    return {
        crmLinks: countByModule("crm"),
        projectLinks: countByModule("projects"),
        financeLinks: countByModule("finance"),
        hrLinks: countByModule("hr"),
        inventoryLinks: countByModule("inventory"),
        supportLinks: countByModule("support"),
        salesLinks: countByModule("sales"),
        documentsLinks: countByModule("documents"),
        automationLinks: countByModule("automation"),
        analyticsLinks: countByModule("analytics"),
        aiLinks: countByModule("ai"),
    };
};

export const searchSemanticIndex = (records: DbKnowledgeSemanticIndex[], entries: DbKnowledgeEntry[], query: string, maps: LookupMaps): KnowledgeSearchResult[] => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return records
        .filter((record) => record.search_text.toLowerCase().includes(normalized))
        .map((record) => ({
            entryId: record.entry_id,
            entryTitle: entryTitle(maps, record.entry_id) ?? "Unknown",
            matchPreview: record.search_text.slice(0, 160),
            score: record.search_text.toLowerCase().indexOf(normalized) >= 0 ? 1 : 0,
        }));
};

export const buildEntryPayload = (organizationId: string, input: CreateEntryInput) => ({
    organization_id: organizationId,
    title: input.title,
    slug: input.slug,
    content: input.content,
    category: input.category,
    status: input.status ?? "published",
    tags: input.tags ?? [],
    client_id: input.clientId || null,
    project_id: input.projectId || null,
});

export const buildSemanticIndexPayload = (organizationId: string, input: CreateSemanticIndexInput) => ({
    organization_id: organizationId,
    entry_id: input.entryId,
    embedding_key: input.embeddingKey ?? "",
    search_text: input.searchText,
});

export const buildSolutionPayload = (organizationId: string, input: CreateSolutionInput) => ({
    organization_id: organizationId,
    name: input.name,
    problem_statement: input.problemStatement,
    solution_summary: input.solutionSummary,
    implementation_notes: input.implementationNotes ?? "",
    category: input.category,
});

export const buildAdrPayload = (organizationId: string, input: CreateAdrInput, adrNumber: number) => ({
    organization_id: organizationId,
    adr_number: adrNumber,
    title: input.title,
    status: input.status ?? "proposed",
    context: input.context,
    decision: input.decision,
    consequences: input.consequences ?? "",
});

export const buildPromptPayload = (organizationId: string, input: CreatePromptInput) => ({
    organization_id: organizationId,
    name: input.name,
    prompt_key: input.promptKey,
    category: input.category,
    content: input.content,
    use_cases: input.useCases ?? [],
});

export const buildProjectMemoryPayload = (organizationId: string, input: CreateProjectMemoryInput) => ({
    organization_id: organizationId,
    project_id: input.projectId,
    memory_key: input.memoryKey,
    summary: input.summary,
    details: input.details ?? "",
    context: input.context ?? {},
});

export const buildClientMemoryPayload = (organizationId: string, input: CreateClientMemoryInput) => ({
    organization_id: organizationId,
    client_id: input.clientId,
    memory_key: input.memoryKey,
    summary: input.summary,
    details: input.details ?? "",
    context: input.context ?? {},
});

export const buildComponentPayload = (organizationId: string, input: CreateComponentInput) => ({
    organization_id: organizationId,
    name: input.name,
    component_type: input.componentType,
    description: input.description,
    usage_guidelines: input.usageGuidelines ?? "",
});

export const buildPatternPayload = (organizationId: string, input: CreatePatternInput) => ({
    organization_id: organizationId,
    name: input.name,
    pattern_type: input.patternType,
    description: input.description,
    when_to_use: input.whenToUse ?? "",
});

export const buildDocumentationPayload = (organizationId: string, input: CreateDocumentationInput) => ({
    organization_id: organizationId,
    title: input.title,
    doc_key: input.docKey,
    module_source: input.moduleSource,
    content: input.content,
});

export const buildAiContextPayload = (organizationId: string, input: CreateAiContextInput) => ({
    organization_id: organizationId,
    context_key: input.contextKey,
    agent_id: input.agentId || null,
    session_id: input.sessionId || null,
    entry_id: input.entryId || null,
    context_payload: input.contextPayload ?? {},
});

export const buildVersionPayload = (organizationId: string, input: CreateVersionInput, versionNumber: number) => ({
    organization_id: organizationId,
    entry_id: input.entryId,
    version_number: versionNumber,
    content: input.content,
    change_summary: input.changeSummary,
});

export const buildPermissionGrantPayload = (organizationId: string, input: CreatePermissionGrantInput) => ({
    organization_id: organizationId,
    grantee_type: input.granteeType,
    grantee_id: input.granteeId || null,
    permission_key: input.permissionKey,
    resource_type: input.resourceType,
    resource_id: input.resourceId || null,
});

export const buildCrossLinkPayload = (organizationId: string, input: CreateCrossLinkInput) => ({
    organization_id: organizationId,
    source_module: input.sourceModule,
    source_entity_type: input.sourceEntityType,
    source_entity_id: input.sourceEntityId || null,
    entry_id: input.entryId || null,
    link_type: input.linkType ?? "reference",
});

export const buildKnowledgeAuditPayload = (organizationId: string, entityType: string, action: string, summary: string, entityId?: string) => ({
    organization_id: organizationId,
    entity_type: entityType,
    entity_id: entityId ?? null,
    action,
    summary,
    metadata: {},
});

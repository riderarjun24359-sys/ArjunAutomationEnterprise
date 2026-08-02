export type KnowledgeTab =
    | "overview"
    | "repository"
    | "search"
    | "solutions"
    | "adrs"
    | "prompts"
    | "projectMemory"
    | "clientMemory"
    | "components"
    | "patterns"
    | "documentation"
    | "aiContext"
    | "versions"
    | "analytics"
    | "permissions"
    | "crossLinks"
    | "audit"
    | "api";

export interface KnowledgeDashboardStats {
    totalEntries: number;
    publishedEntries: number;
    totalSolutions: number;
    totalAdrs: number;
    totalPrompts: number;
    projectMemories: number;
    clientMemories: number;
    totalComponents: number;
    totalPatterns: number;
    documentationPages: number;
    activeAiContexts: number;
    versionRecords: number;
    crossModuleLinks: number;
}

export interface EntrySummary {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    contentPreview: string;
    tags: string[];
    clientName?: string | null;
    projectName?: string | null;
    currentVersion: number;
    updatedAt: string;
}

export interface SemanticIndexSummary {
    id: string;
    entryId: string;
    entryTitle: string;
    embeddingKey: string;
    searchTextPreview: string;
    indexedAt: string;
}

export interface KnowledgeSearchResult {
    entryId: string;
    entryTitle: string;
    matchPreview: string;
    score: number;
}

export interface SolutionSummary {
    id: string;
    name: string;
    category: string;
    status: string;
    problemPreview: string;
    solutionPreview: string;
}

export interface AdrSummary {
    id: string;
    adrNumber: number;
    title: string;
    status: string;
    contextPreview: string;
    decisionPreview: string;
}

export interface PromptSummary {
    id: string;
    name: string;
    promptKey: string;
    category: string;
    status: string;
    contentPreview: string;
    useCases: string[];
}

export interface ProjectMemorySummary {
    id: string;
    memoryKey: string;
    projectName: string;
    summary: string;
    detailsPreview: string;
}

export interface ClientMemorySummary {
    id: string;
    memoryKey: string;
    clientName: string;
    summary: string;
    detailsPreview: string;
}

export interface ComponentSummary {
    id: string;
    name: string;
    componentType: string;
    status: string;
    descriptionPreview: string;
}

export interface PatternSummary {
    id: string;
    name: string;
    patternType: string;
    status: string;
    descriptionPreview: string;
}

export interface DocumentationSummary {
    id: string;
    title: string;
    docKey: string;
    moduleSource: string;
    status: string;
    contentPreview: string;
}

export interface AiContextSummary {
    id: string;
    contextKey: string;
    agentName?: string | null;
    sessionKey?: string | null;
    entryTitle?: string | null;
    status: string;
}

export interface VersionSummary {
    id: string;
    entryTitle: string;
    versionNumber: number;
    changeSummary: string;
    createdAt: string;
}

export interface AnalyticsSummary {
    id: string;
    metricKey: string;
    metricValue: number;
    dimensions: Record<string, unknown>;
    periodStart: string;
    periodEnd: string;
    computedAt: string;
}

export interface PermissionGrantSummary {
    id: string;
    granteeType: string;
    granteeName?: string | null;
    permissionKey: string;
    resourceType: string;
    isActive: boolean;
}

export interface CrossLinkSummary {
    id: string;
    sourceModule: string;
    sourceEntityType: string;
    entryTitle?: string | null;
    linkType: string;
    createdAt: string;
}

export interface AuditEntry {
    id: string;
    entityType: string;
    entityId?: string | null;
    action: string;
    summary: string;
    createdAt: string;
}

export interface KnowledgeReport {
    entriesByCategory: Array<{ label: string; count: number }>;
    metricsByKey: Array<{ label: string; value: number }>;
    totalEntries: number;
}

export interface CrossModuleLinks {
    crmLinks: number;
    projectLinks: number;
    financeLinks: number;
    hrLinks: number;
    inventoryLinks: number;
    supportLinks: number;
    salesLinks: number;
    documentsLinks: number;
    automationLinks: number;
    analyticsLinks: number;
    aiLinks: number;
}

export interface CreateEntryInput { title: string; slug: string; content: string; category: string; status?: string; tags?: string[]; clientId?: string; projectId?: string; }
export interface CreateSemanticIndexInput { entryId: string; searchText: string; embeddingKey?: string; }
export interface CreateSolutionInput { name: string; problemStatement: string; solutionSummary: string; implementationNotes?: string; category: string; }
export interface CreateAdrInput { title: string; status?: string; context: string; decision: string; consequences?: string; }
export interface CreatePromptInput { name: string; promptKey: string; category: string; content: string; useCases?: string[]; }
export interface CreateProjectMemoryInput { projectId: string; memoryKey: string; summary: string; details?: string; context?: Record<string, unknown>; }
export interface CreateClientMemoryInput { clientId: string; memoryKey: string; summary: string; details?: string; context?: Record<string, unknown>; }
export interface CreateComponentInput { name: string; componentType: string; description: string; usageGuidelines?: string; }
export interface CreatePatternInput { name: string; patternType: string; description: string; whenToUse?: string; }
export interface CreateDocumentationInput { title: string; docKey: string; moduleSource: string; content: string; }
export interface CreateAiContextInput { contextKey: string; agentId?: string; sessionId?: string; entryId?: string; contextPayload?: Record<string, unknown>; }
export interface CreateVersionInput { entryId: string; content: string; changeSummary: string; }
export interface CreatePermissionGrantInput { granteeType: string; granteeId?: string; permissionKey: string; resourceType: string; resourceId?: string; }
export interface CreateCrossLinkInput { sourceModule: string; sourceEntityType: string; sourceEntityId?: string; entryId?: string; linkType?: string; }

export interface KnowledgeSdkSearchInput {
    query: string;
    moduleSource?: string;
    limit?: number;
}

export interface KnowledgeSdkContextInput {
    contextKey: string;
    agentId?: string;
    sessionId?: string;
    entryId?: string;
    contextPayload?: Record<string, unknown>;
}

export interface KnowledgeSdkContextResult {
    contextId: string;
    contextKey: string;
    entryTitle?: string | null;
    status: string;
}

export interface KnowledgeSdkMemoryInput {
    entityType: "client" | "project";
    entityId: string;
    memoryKey: string;
    summary: string;
    details?: string;
}

export interface KnowledgeSdkMemoryResult {
    memoryId: string;
    memoryKey: string;
    summary: string;
}

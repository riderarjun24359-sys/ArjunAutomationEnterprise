"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { buildCrossModuleLinks, buildKnowledgeDashboardStats, buildKnowledgeReport } from "@/src/modules/database/lib/knowledge-mappers";
import { knowledgeService } from "@/src/modules/knowledge/services/knowledge.service";
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
    PatternSummary,
    PermissionGrantSummary,
    ProjectMemorySummary,
    PromptSummary,
    SemanticIndexSummary,
    SolutionSummary,
    VersionSummary,
} from "@/src/modules/knowledge/types";

export function useKnowledge() {
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<KnowledgeDashboardStats | null>(null);
    const [entries, setEntries] = useState<EntrySummary[]>([]);
    const [semanticIndex, setSemanticIndex] = useState<SemanticIndexSummary[]>([]);
    const [searchResults, setSearchResults] = useState<KnowledgeSearchResult[]>([]);
    const [solutions, setSolutions] = useState<SolutionSummary[]>([]);
    const [adrs, setAdrs] = useState<AdrSummary[]>([]);
    const [prompts, setPrompts] = useState<PromptSummary[]>([]);
    const [projectMemories, setProjectMemories] = useState<ProjectMemorySummary[]>([]);
    const [clientMemories, setClientMemories] = useState<ClientMemorySummary[]>([]);
    const [components, setComponents] = useState<ComponentSummary[]>([]);
    const [patterns, setPatterns] = useState<PatternSummary[]>([]);
    const [documentation, setDocumentation] = useState<DocumentationSummary[]>([]);
    const [aiContexts, setAiContexts] = useState<AiContextSummary[]>([]);
    const [versions, setVersions] = useState<VersionSummary[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsSummary[]>([]);
    const [permissionGrants, setPermissionGrants] = useState<PermissionGrantSummary[]>([]);
    const [crossLinks, setCrossLinks] = useState<CrossLinkSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [report, setReport] = useState<KnowledgeReport | null>(null);
    const [crossModuleLinks, setCrossModuleLinks] = useState<CrossModuleLinks | null>(null);
    const [entryOptions, setEntryOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [projectOptions, setProjectOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [clientOptions, setClientOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [agentOptions, setAgentOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [sessionOptions, setSessionOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [employeeOptions, setEmployeeOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!user) return { empty: true as const };
        const [entryList, indexList, solutionList, adrList, promptList, projectMemoryList, clientMemoryList, componentList, patternList, documentationList, aiContextList, versionList, analyticsList, grantList, linkList, auditList, entries, projects, clients, agents, sessions, employees] = await Promise.all([
            knowledgeService.getEntries(user.id, user.email, user.fullName),
            knowledgeService.getSemanticIndex(user.id, user.email, user.fullName),
            knowledgeService.getSolutions(user.id, user.email, user.fullName),
            knowledgeService.getAdrs(user.id, user.email, user.fullName),
            knowledgeService.getPrompts(user.id, user.email, user.fullName),
            knowledgeService.getProjectMemories(user.id, user.email, user.fullName),
            knowledgeService.getClientMemories(user.id, user.email, user.fullName),
            knowledgeService.getComponents(user.id, user.email, user.fullName),
            knowledgeService.getPatterns(user.id, user.email, user.fullName),
            knowledgeService.getDocumentation(user.id, user.email, user.fullName),
            knowledgeService.getAiContexts(user.id, user.email, user.fullName),
            knowledgeService.getVersions(user.id, user.email, user.fullName),
            knowledgeService.getAnalytics(user.id, user.email, user.fullName),
            knowledgeService.getPermissionGrants(user.id, user.email, user.fullName),
            knowledgeService.getCrossLinks(user.id, user.email, user.fullName),
            knowledgeService.getAuditLogs(user.id, user.email, user.fullName),
            knowledgeService.getEntryOptions(user.id, user.email, user.fullName),
            knowledgeService.getProjectOptions(user.id, user.email, user.fullName),
            knowledgeService.getClientOptions(user.id, user.email, user.fullName),
            knowledgeService.getAgentOptions(user.id, user.email, user.fullName),
            knowledgeService.getSessionOptions(user.id, user.email, user.fullName),
            knowledgeService.getEmployeeOptions(user.id, user.email, user.fullName),
        ]);
        const dashboardStats = buildKnowledgeDashboardStats({ entries: entryList, solutions: solutionList, adrs: adrList, prompts: promptList, projectMemories: projectMemoryList, clientMemories: clientMemoryList, components: componentList, patterns: patternList, documentation: documentationList, aiContexts: aiContextList, versions: versionList, crossLinks: linkList });
        const knowledgeReport = buildKnowledgeReport({ entries: entryList, analytics: analyticsList });
        const crossLinksData = buildCrossModuleLinks({ crossLinks: linkList });
        return { empty: false as const, dashboardStats, entryList, indexList, solutionList, adrList, promptList, projectMemoryList, clientMemoryList, componentList, patternList, documentationList, aiContextList, versionList, analyticsList, grantList, linkList, auditList, knowledgeReport, crossLinksData, entries, projects, clients, agents, sessions, employees };
    }, [user]);

    const applyData = useCallback((data: Awaited<ReturnType<typeof fetchData>>) => {
        if (data.empty) { setLoading(false); return; }
        setStats(data.dashboardStats);
        setEntries(data.entryList);
        setSemanticIndex(data.indexList);
        setSolutions(data.solutionList);
        setAdrs(data.adrList);
        setPrompts(data.promptList);
        setProjectMemories(data.projectMemoryList);
        setClientMemories(data.clientMemoryList);
        setComponents(data.componentList);
        setPatterns(data.patternList);
        setDocumentation(data.documentationList);
        setAiContexts(data.aiContextList);
        setVersions(data.versionList);
        setAnalytics(data.analyticsList);
        setPermissionGrants(data.grantList);
        setCrossLinks(data.linkList);
        setAuditLogs(data.auditList);
        setReport(data.knowledgeReport);
        setCrossModuleLinks(data.crossLinksData);
        setEntryOptions(data.entries);
        setProjectOptions(data.projects);
        setClientOptions(data.clients);
        setAgentOptions(data.agents);
        setSessionOptions(data.sessions);
        setEmployeeOptions(data.employees);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createEntry = useCallback(async (input: CreateEntryInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createEntry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSemanticIndex = useCallback(async (input: CreateSemanticIndexInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createSemanticIndex(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const searchKnowledge = useCallback(async (query: string) => { if (!user) return; const results = await knowledgeService.searchKnowledge(user.id, user.email, query, user.fullName); setSearchResults(results); }, [user]);
    const createSolution = useCallback(async (input: CreateSolutionInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createSolution(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdr = useCallback(async (input: CreateAdrInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createAdr(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPrompt = useCallback(async (input: CreatePromptInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createPrompt(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProjectMemory = useCallback(async (input: CreateProjectMemoryInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createProjectMemory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createClientMemory = useCallback(async (input: CreateClientMemoryInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createClientMemory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createComponent = useCallback(async (input: CreateComponentInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createComponent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPattern = useCallback(async (input: CreatePatternInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createPattern(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDocumentation = useCallback(async (input: CreateDocumentationInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createDocumentation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAiContext = useCallback(async (input: CreateAiContextInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createAiContext(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createVersion = useCallback(async (input: CreateVersionInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPermissionGrant = useCallback(async (input: CreatePermissionGrantInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createPermissionGrant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCrossLink = useCallback(async (input: CreateCrossLinkInput) => { if (!user) throw new Error("Authentication required"); await knowledgeService.createCrossLink(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading, stats, entries, semanticIndex, searchResults, solutions, adrs, prompts, projectMemories, clientMemories, components, patterns, documentation, aiContexts, versions, analytics, permissionGrants, crossLinks, auditLogs, report, crossModuleLinks, entryOptions, projectOptions, clientOptions, agentOptions, sessionOptions, employeeOptions,
        createEntry, createSemanticIndex, searchKnowledge, createSolution, createAdr, createPrompt, createProjectMemory, createClientMemory, createComponent, createPattern, createDocumentation, createAiContext, createVersion, createPermissionGrant, createCrossLink, refresh,
    };
}

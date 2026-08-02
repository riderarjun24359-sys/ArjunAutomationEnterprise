"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AdrsPanel, AiContextPanel, ClientMemoryPanel, ComponentsPanel, CrossLinksPanel, DocumentationPanel, KnowledgeAnalyticsPanel, KnowledgeAuditPanel, KnowledgeOverviewPanel, KnowledgePermissionsPanel, KnowledgeSdkPanel, PatternsPanel, ProjectMemoryPanel, PromptsPanel, RepositoryPanel, SearchPanel, SolutionsPanel, VersionsPanel,
} from "@/src/modules/knowledge/components/KnowledgePanels";
import { KnowledgeStats } from "@/src/modules/knowledge/components/KnowledgeStats";
import { KNOWLEDGE_TABS } from "@/src/modules/knowledge/constants";
import { useKnowledge } from "@/src/modules/knowledge/hooks/useKnowledge";

const tabs = [
    { id: KNOWLEDGE_TABS.overview, label: "Overview" },
    { id: KNOWLEDGE_TABS.repository, label: "Repository" },
    { id: KNOWLEDGE_TABS.search, label: "Search" },
    { id: KNOWLEDGE_TABS.solutions, label: "Solutions" },
    { id: KNOWLEDGE_TABS.adrs, label: "ADRs" },
    { id: KNOWLEDGE_TABS.prompts, label: "Prompts" },
    { id: KNOWLEDGE_TABS.projectMemory, label: "Project Memory" },
    { id: KNOWLEDGE_TABS.clientMemory, label: "Client Memory" },
    { id: KNOWLEDGE_TABS.components, label: "Components" },
    { id: KNOWLEDGE_TABS.patterns, label: "Patterns" },
    { id: KNOWLEDGE_TABS.documentation, label: "Documentation" },
    { id: KNOWLEDGE_TABS.aiContext, label: "AI Context" },
    { id: KNOWLEDGE_TABS.versions, label: "Versions" },
    { id: KNOWLEDGE_TABS.analytics, label: "Analytics" },
    { id: KNOWLEDGE_TABS.permissions, label: "Permissions" },
    { id: KNOWLEDGE_TABS.crossLinks, label: "Cross Links" },
    { id: KNOWLEDGE_TABS.audit, label: "Audit" },
    { id: KNOWLEDGE_TABS.api, label: "SDK" },
] as const;

export function KnowledgePage() {
    const knowledge = useKnowledge();
    const [activeTab, setActiveTab] = useState<(typeof KNOWLEDGE_TABS)[keyof typeof KNOWLEDGE_TABS]>(KNOWLEDGE_TABS.overview);

    if (knowledge.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading enterprise knowledge and memory engine" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-600">Knowledge Infrastructure</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Knowledge & Memory Engine</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Permanent knowledge system for central repository, semantic search, reusable solutions, architecture decision records, prompt knowledge, project and client memory, component catalog, pattern library, documentation knowledge, AI context management, versioning, analytics, permissions, cross-module linking, audit history, and the shared Knowledge SDK used by every AI capability.
                </p>
            </motion.header>
            <KnowledgeStats stats={knowledge.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-amber-600 text-white" : "border border-slate-200 text-slate-600 hover:border-amber-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === KNOWLEDGE_TABS.overview ? <KnowledgeOverviewPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.repository ? <RepositoryPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.search ? <SearchPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.solutions ? <SolutionsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.adrs ? <AdrsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.prompts ? <PromptsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.projectMemory ? <ProjectMemoryPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.clientMemory ? <ClientMemoryPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.components ? <ComponentsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.patterns ? <PatternsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.documentation ? <DocumentationPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.aiContext ? <AiContextPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.versions ? <VersionsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.analytics ? <KnowledgeAnalyticsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.permissions ? <KnowledgePermissionsPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.crossLinks ? <CrossLinksPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.audit ? <KnowledgeAuditPanel data={knowledge} /> : null}
            {activeTab === KNOWLEDGE_TABS.api ? <KnowledgeSdkPanel data={knowledge} /> : null}
        </div>
    );
}

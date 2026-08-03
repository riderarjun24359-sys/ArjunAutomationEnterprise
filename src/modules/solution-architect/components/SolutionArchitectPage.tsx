"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ApiContractsPanel,
    ArchitecturesPanel,
    BuildReusePanel,
    DatabaseSchemasPanel,
    DecompositionsPanel,
    DependenciesPanel,
    DeploymentPanel,
    DomainModelsPanel,
    EngagementsPanel,
    IntegrationsPanel,
    ModuleSelectionsPanel,
    PerformancePanel,
    ReviewsPanel,
    SaAuditPanel,
    SaOverviewPanel,
    SaSdkPanel,
    ScalabilityPanel,
    SecurityPanel,
    SprintPlansPanel,
    TechnologyDecisionsPanel,
    VersionsPanel,
} from "@/src/modules/solution-architect/components/SolutionArchitectPanels";
import { SolutionArchitectStats } from "@/src/modules/solution-architect/components/SolutionArchitectStats";
import { SOLUTION_ARCHITECT_TABS } from "@/src/modules/solution-architect/constants";
import { useSolutionArchitect } from "@/src/modules/solution-architect/hooks/useSolutionArchitect";

const tabs = [
    { id: SOLUTION_ARCHITECT_TABS.overview, label: "Overview" },
    { id: SOLUTION_ARCHITECT_TABS.engagements, label: "Engagements" },
    { id: SOLUTION_ARCHITECT_TABS.architectures, label: "Architectures" },
    { id: SOLUTION_ARCHITECT_TABS.decompositions, label: "Decompositions" },
    { id: SOLUTION_ARCHITECT_TABS.domainModels, label: "Domain Models" },
    { id: SOLUTION_ARCHITECT_TABS.databaseSchemas, label: "Database Schemas" },
    { id: SOLUTION_ARCHITECT_TABS.apiContracts, label: "API Contracts" },
    { id: SOLUTION_ARCHITECT_TABS.moduleSelections, label: "Module Selections" },
    { id: SOLUTION_ARCHITECT_TABS.buildReuse, label: "Build vs Reuse" },
    { id: SOLUTION_ARCHITECT_TABS.integrations, label: "Integrations" },
    { id: SOLUTION_ARCHITECT_TABS.security, label: "Security" },
    { id: SOLUTION_ARCHITECT_TABS.scalability, label: "Scalability" },
    { id: SOLUTION_ARCHITECT_TABS.performance, label: "Performance" },
    { id: SOLUTION_ARCHITECT_TABS.technologyDecisions, label: "Technology Decisions" },
    { id: SOLUTION_ARCHITECT_TABS.deployment, label: "Deployment" },
    { id: SOLUTION_ARCHITECT_TABS.sprintPlans, label: "Sprint Plans" },
    { id: SOLUTION_ARCHITECT_TABS.dependencies, label: "Dependencies" },
    { id: SOLUTION_ARCHITECT_TABS.reviews, label: "Reviews" },
    { id: SOLUTION_ARCHITECT_TABS.versions, label: "Versions" },
    { id: SOLUTION_ARCHITECT_TABS.audit, label: "Audit" },
    { id: SOLUTION_ARCHITECT_TABS.api, label: "SDK" },
] as const;

export function SolutionArchitectPage() {
    const solutionArchitect = useSolutionArchitect();
    const [activeTab, setActiveTab] = useState<(typeof SOLUTION_ARCHITECT_TABS)[keyof typeof SOLUTION_ARCHITECT_TABS]>(SOLUTION_ARCHITECT_TABS.overview);

    if (solutionArchitect.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Solution Architect worker" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Solution Architect</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for solution architecture design, system decomposition, domain modeling, database schemas, API contracts, module selection, build vs reuse analysis, integration planning, security architecture, scalability and performance planning, technology decisions, deployment architecture, sprint planning, dependency analysis, reviews, versioning, audit history, and the shared Solution Architect SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Development Factory → AI QA → AI DevOps → AI Support.
                </p>
            </motion.header>
            <SolutionArchitectStats stats={solutionArchitect.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-cyan-600 text-white" : "border border-slate-200 text-slate-600 hover:border-cyan-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === SOLUTION_ARCHITECT_TABS.overview ? <SaOverviewPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.engagements ? <EngagementsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.architectures ? <ArchitecturesPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.decompositions ? <DecompositionsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.domainModels ? <DomainModelsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.databaseSchemas ? <DatabaseSchemasPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.apiContracts ? <ApiContractsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.moduleSelections ? <ModuleSelectionsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.buildReuse ? <BuildReusePanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.integrations ? <IntegrationsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.security ? <SecurityPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.scalability ? <ScalabilityPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.performance ? <PerformancePanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.technologyDecisions ? <TechnologyDecisionsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.deployment ? <DeploymentPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.sprintPlans ? <SprintPlansPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.dependencies ? <DependenciesPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.reviews ? <ReviewsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.versions ? <VersionsPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.audit ? <SaAuditPanel data={solutionArchitect} /> : null}
            {activeTab === SOLUTION_ARCHITECT_TABS.api ? <SaSdkPanel data={solutionArchitect} /> : null}
        </div>
    );
}

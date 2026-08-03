"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ApiScaffoldsPanel,
    BackendWorkflowsPanel,
    BuildArtifactsPanel,
    CodeReviewsPanel,
    CodingStandardsPanel,
    ComponentsPanel,
    DfAuditPanel,
    DfOverviewPanel,
    DfSdkPanel,
    EngagementsPanel,
    FrontendWorkflowsPanel,
    MigrationPlansPanel,
    ModuleRecommendationsPanel,
    ProgressPanel,
    PullRequestsPanel,
    RepositoriesPanel,
    SecureCodingPanel,
    TechnicalDocsPanel,
    TestScaffoldsPanel,
    VersionsPanel,
    WorkPackagesPanel,
} from "@/src/modules/development-factory/components/DevelopmentFactoryPanels";
import { DevelopmentFactoryStats } from "@/src/modules/development-factory/components/DevelopmentFactoryStats";
import { DEVELOPMENT_FACTORY_TABS } from "@/src/modules/development-factory/constants";
import { useDevelopmentFactory } from "@/src/modules/development-factory/hooks/useDevelopmentFactory";

const tabs = [
    { id: DEVELOPMENT_FACTORY_TABS.overview, label: "Overview" },
    { id: DEVELOPMENT_FACTORY_TABS.engagements, label: "Engagements" },
    { id: DEVELOPMENT_FACTORY_TABS.workPackages, label: "Work Packages" },
    { id: DEVELOPMENT_FACTORY_TABS.backendWorkflows, label: "Backend Workflows" },
    { id: DEVELOPMENT_FACTORY_TABS.frontendWorkflows, label: "Frontend Workflows" },
    { id: DEVELOPMENT_FACTORY_TABS.apiScaffolds, label: "API Scaffolds" },
    { id: DEVELOPMENT_FACTORY_TABS.migrationPlans, label: "Migration Plans" },
    { id: DEVELOPMENT_FACTORY_TABS.repositories, label: "Repositories" },
    { id: DEVELOPMENT_FACTORY_TABS.components, label: "Components" },
    { id: DEVELOPMENT_FACTORY_TABS.testScaffolds, label: "Test Scaffolds" },
    { id: DEVELOPMENT_FACTORY_TABS.codingStandards, label: "Coding Standards" },
    { id: DEVELOPMENT_FACTORY_TABS.secureCoding, label: "Secure Coding" },
    { id: DEVELOPMENT_FACTORY_TABS.moduleRecommendations, label: "Module Recommendations" },
    { id: DEVELOPMENT_FACTORY_TABS.pullRequests, label: "Pull Requests" },
    { id: DEVELOPMENT_FACTORY_TABS.codeReviews, label: "Code Reviews" },
    { id: DEVELOPMENT_FACTORY_TABS.technicalDocs, label: "Technical Docs" },
    { id: DEVELOPMENT_FACTORY_TABS.progress, label: "Progress" },
    { id: DEVELOPMENT_FACTORY_TABS.buildArtifacts, label: "Build Artifacts" },
    { id: DEVELOPMENT_FACTORY_TABS.versions, label: "Versions" },
    { id: DEVELOPMENT_FACTORY_TABS.audit, label: "Audit" },
    { id: DEVELOPMENT_FACTORY_TABS.api, label: "SDK" },
] as const;

export function DevelopmentFactoryPage() {
    const developmentFactory = useDevelopmentFactory();
    const [activeTab, setActiveTab] = useState<(typeof DEVELOPMENT_FACTORY_TABS)[keyof typeof DEVELOPMENT_FACTORY_TABS]>(DEVELOPMENT_FACTORY_TABS.overview);

    if (developmentFactory.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI Development Factory worker" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI Development Factory</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for code generation, work packages, backend and frontend workflows, API scaffolds, migration plans, repository structures, components, test scaffolds, coding standards, secure coding validation, module recommendations, pull requests, code reviews, technical documentation, progress tracking, build artifacts, versioning, audit history, and the shared Development Factory SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Development Factory → AI QA → Deployment.
                </p>
            </motion.header>
            <DevelopmentFactoryStats stats={developmentFactory.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DEVELOPMENT_FACTORY_TABS.overview ? <DfOverviewPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.engagements ? <EngagementsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.workPackages ? <WorkPackagesPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.backendWorkflows ? <BackendWorkflowsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.frontendWorkflows ? <FrontendWorkflowsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.apiScaffolds ? <ApiScaffoldsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.migrationPlans ? <MigrationPlansPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.repositories ? <RepositoriesPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.components ? <ComponentsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.testScaffolds ? <TestScaffoldsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.codingStandards ? <CodingStandardsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.secureCoding ? <SecureCodingPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.moduleRecommendations ? <ModuleRecommendationsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.pullRequests ? <PullRequestsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.codeReviews ? <CodeReviewsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.technicalDocs ? <TechnicalDocsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.progress ? <ProgressPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.buildArtifacts ? <BuildArtifactsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.versions ? <VersionsPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.audit ? <DfAuditPanel data={developmentFactory} /> : null}
            {activeTab === DEVELOPMENT_FACTORY_TABS.api ? <DfSdkPanel data={developmentFactory} /> : null}
        </div>
    );
}
